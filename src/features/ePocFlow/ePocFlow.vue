<script setup lang="ts">
import {
    ConnectionMode,
    useVueFlow,
    VueFlow,
    getConnectedEdges,
    applyEdgeChanges,
    NodeDragEvent,
    Connection,
    NodeChange,
    EdgeUpdateEvent,
    EdgeMouseEvent,
    EdgeMarker,
} from '@vue-flow/core';

import { markRaw, onMounted } from 'vue';
import PageNode from './nodes/PageNode.vue';
import ActivityNode from './nodes/ActivityNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { useEditorStore, useGraphStore } from '@/src/shared/stores';
import ChapterNode from './nodes/ChapterNode.vue';
import ePocNode from './nodes/ePocNode.vue';
import AddChapterNode from './nodes/AddChapterNode.vue';
import { NodeElement, SideAction } from '@/src/shared/interfaces';
import {
    addPage,
    createPageFromContent,
    graphCopy,
    getSelectedNodes, handleChapterDrag
} from '@/src/shared/services/graph';
import { saveState, saveGivenState, getCurrentState } from '@/src/shared/services/undoRedo.service';
import { closeFormPanel, graphService } from '@/src/shared/services';

const { vueFlowRef, project, updateEdge, edges, findNode, setTransform } = useVueFlow({ id: 'main' });

const editorStore = useEditorStore();
const graphStore = useGraphStore();

const nodeTypes = {
    activity: markRaw(ActivityNode),
    page: markRaw(PageNode),
    chapter: markRaw(ChapterNode),
    epoc: markRaw(ePocNode),
    add: markRaw(AddChapterNode),
};

const onDrop = (event: DragEvent) => {
    document.body.classList.remove('cursor-allowed', 'cursor-not-allowed');

    if (!editorStore.draggedElement) return;

    const { left, top } = vueFlowRef.value.getBoundingClientRect();

    const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
    });

    const { element, type } = editorStore.draggedElement;

    saveState();

    if (type === 'sideAction') addPage(position, element as SideAction[]);
    else if (type === 'nodeElement') {
        createPageFromContent(position, element as NodeElement);
    }
};

onMounted(() => {
    graphStore.restore();
});

function onEdgeClick(event: EdgeMouseEvent) {
    const marker = event.edge.markerEnd as EdgeMarker;
    // watch property changed to change color back
    Object.defineProperty(event.edge, 'selected', {
        get() {
            return this._selected;
        },
        set(newValue) {
            this._selected = newValue !== false;
            marker.color = this._selected ? '#00B3E9' : '#384257';
        },
    });
}

function selectionStart() {
    closeFormPanel();
}

function update(event: EdgeUpdateEvent) {
    updateEdge(event.edge, {
        source: event.connection.source,
        target: event.connection.target,
    });

    saveGivenState(savedState);
}

function nodeChange(event: NodeChange[]) {
    const { type } = event[0];

    if (type === 'remove') closeFormPanel();
}

function onDragOver() {
    document.body.classList.add('cursor-allowed');
}

function connect(event: Connection) {
    const targetNode = findNode(event.target);
    const sourceNode = findNode(event.source);

    if (event.source === event.target) {
        const currentEdge = edges.value.find((edge) => edge.target === targetNode.id && edge.source === sourceNode.id);
        applyEdgeChanges([{ id: currentEdge.id, type: 'remove' }], edges.value);
        return false;
    }

    const otherEdge = getConnectedEdges([targetNode], edges.value).find(
        (edge) => edge.target === targetNode.id && edge.source !== sourceNode.id,
    );

    if (otherEdge) {
        applyEdgeChanges([{ id: otherEdge.id, type: 'remove' }], edges.value);
    }

    saveGivenState(savedState);
}

function nodeDrag(event: NodeDragEvent) {
    const { node } = event;

    if (node.type !== 'chapter') return;

    handleChapterDrag(node.id);
}

let startPos = { x: 0, y: 0 };
let savedState = '';
function onDragStart(event: NodeDragEvent) {
    const mouseEvent = event.event as MouseEvent;
    const { x, y } = mouseEvent;
    startPos = { x, y };

    savedState = getCurrentState();
}

function onDragEnd(event: NodeDragEvent) {
    const mouseEvent = event.event as MouseEvent;
    const { x, y } = mouseEvent;

    if (startPos.x === x && startPos.y === y) return;

    saveGivenState(savedState);

    savedState = '';
    startPos = { x: 0, y: 0 };
}

function onConnectStart() {
    savedState = getCurrentState();
}

function onConnectEnd() {
    savedState = '';
}

function onKeyDown(event: KeyboardEvent) {
    const { key, metaKey, ctrlKey } = event;

    if (metaKey || ctrlKey) {
        if (key === 'c') graphCopy();
    }
}

function onContextMenu(event: MouseEvent) {
    const position = project({
        x: event.clientX,
        y: event.clientY,
    });

    graphService.openContextMenu('flow', { position });
}

function onSelectionContextMenu() {
    const selectedNodes = JSON.stringify(getSelectedNodes());
    graphService.openContextMenu('selection', { selection: selectedNodes });
}

function onPaneReady() {
    setTransform({ x: 32, y: 32, zoom: 1 });
}
</script>

<template>
    <VueFlow
        v-model="graphStore.elements"
        auto-connect
        :default-zoom="0.75"
        :max-zoom="1.5"
        :min-zoom="0.4"
        :node-types="nodeTypes"
        :connection-mode="ConnectionMode.Strict"
        :connection-radius="50"
        :edge-updater-radius="30"
        :snap-to-grid="true"
        :snap-grid="[16, 16]"
        @edge-update="update"
        @nodes-change="nodeChange"
        @node-drag-start="onDragStart"
        @node-drag-stop="onDragEnd"
        @node-drag="nodeDrag"
        @selection-drag-start="onDragStart"
        @selection-drag-stop="onDragEnd"
        @selection-start="selectionStart"
        @drop="onDrop"
        @dragover.prevent="onDragOver"
        @dragenter.prevent
        @edge-click="onEdgeClick"
        @pane-click="closeFormPanel()"
        @connect="connect"
        @connect-start="onConnectStart"
        @connect-end="onConnectEnd"
        @keydown="onKeyDown"
        @pane-context-menu.stop="onContextMenu"
        @selection-context-menu="onSelectionContextMenu"
        @pane-ready="onPaneReady"
    >
        <!--suppress VueUnrecognizedSlot -->
        <template #node-custom="{ id, data }">
            <PageNode :id="id" :data="data" />
        </template>
        <!--suppress VueUnrecognizedSlot -->
        <template #node-chapter="{ id, data }">
            <ChapterNode :id="id" :data="data" />
        </template>
        <!--suppress VueUnrecognizedSlot -->
        <template #node-epoc="{ id, data }">
            <ePocNode :id="id" :data="data" />
        </template>
        <!--suppress VueUnrecognizedSlot -->
        <template #node-add="{ id, data }">
            <AddChapterNode :id="id" :data="data" />
        </template>
        <template #connection-line="{ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }">
            <CustomConnectContent
                :source-x="sourceX"
                :source-y="sourceY"
                :targetX="targetX"
                :targetY="targetY"
                :source-position="sourcePosition"
                :target-position="targetPosition"
            />
        </template>
    </VueFlow>
</template>
