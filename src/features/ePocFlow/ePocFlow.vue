<script setup lang="ts">
import { ConnectionMode, MarkerType, useVueFlow, VueFlow, getConnectedEdges } from '@vue-flow/core';
import { markRaw, nextTick, onMounted, watch, ref } from 'vue';
import ScreenNode from './nodes/ScreenNode.vue';
import CustomConnectContent from './edges/CustomConnectContent.vue';
import { Form, NodeElement, SideAction } from '@/src/shared/interfaces';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import ChapterNode from './nodes/ChapterNode.vue';
import ePocNode from './nodes/ePocNode.vue';
import AddChapterNode from './nodes/AddChapterNode.vue';

const { addNodes, addEdges, onConnect, vueFlowRef, project, findNode, setNodes, setEdges, setTransform, findEdge, removeEdges, edges }  = useVueFlow({ id: 'main' });

onConnect((params) => {
    addEdges([{...params, updatable: true, style: { stroke: '#384257', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#384257'} }]);    
});

const editorStore = useEditorStore();
const projectStore = useProjectStore();

const nodeTypes = {
    content: markRaw(ScreenNode),
    chapter: markRaw(ChapterNode),
    epoc: markRaw(ePocNode),
    add: markRaw(AddChapterNode), 
};

const onDrop = (event) => {
    const { left, top } = vueFlowRef.value.getBoundingClientRect();

    const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
    });

    const sideActionData = event.dataTransfer.getData('sideAction');
    const elementData = event.dataTransfer.getData('element');
    
    if(sideActionData) {
        const isScreen = event.dataTransfer.getData('isScreen');
        const actions = JSON.parse(sideActionData);
    
        // not sure if this is better than transfer the isScreen in all the case and use it as a boolean here
        if(isScreen === 'true') {
            addNode(position, actions);
        } else {
            addNode(position, [actions]);
        }
    } else if(elementData) {
        const element = JSON.parse(elementData);
        createNodeFromElement(position, element);

        const source = JSON.parse(event.dataTransfer.getData('source'));

        editorStore.removeElementFromScreen(source.index, source.parent);
    }

};

function createNodeFromElement(position, element: NodeElement) {

    const id = editorStore.generateId();
    const form = editorStore.getForm('screen');

    element.parentId = id;

    const newNode = {
        id: id,
        type: 'content',
        data: { elements: [element], readyToDrop: false, animated: false, form: form, type: 'question' },
        position,
        events: {
            click: () => {
                openForm(id, form);
            }
        },
        deletable: false
    };

    editorStore.addElementToScreen(form, element.action, -1);

    addNodes([newNode]);

    // align node position after drop, so it's centered to the mouse
    nextTick(() => {
        const node = findNode(newNode.id);
        const stop = watch(
            () => node.dimensions,
            (dimensions) => {
                if (dimensions.width > 0 && dimensions.height > 0) {
                    node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 };
                    stop();
                }
            },
            { deep: true, flush: 'post' },
        );
    });
}

function addNode(position, actions: SideAction[]) {

    const questionTypes = ['qcm', 'dragdrop', 'reorder', 'swipe', 'list'];
    let elements: NodeElement[] = [];
    
    const id = editorStore.generateId();
    const form = editorStore.getForm('screen');
    
    actions.forEach((action) => {
        elements.push({
            id: editorStore.generateId(),
            action: action,
            form: editorStore.getForm(action.type),
            parentId: id
        });
        editorStore.addElementToScreen(form, action, -1);
    });

    //? For the V0 the templates aren't editable
    const type = questionTypes.includes(elements[0].action.type) ? 'question' : 'template';

    const newNode = {
        id: id,
        type: 'content',
        // Put animated: nodeIcons.length === 1 when implementing v2
        data: { elements: elements, readyToDrop: false, animated: false, form: form, type: type },
        position,
        events: {
            click: () => {
                openForm(id, form);
            }
        },
        deletable: false
    };
       
    addNodes([newNode]);
    
    // align node position after drop, so it's centered to the mouse
    nextTick(() => {
        const node = findNode(newNode.id);
        const stop = watch(
            () => node.dimensions,
            (dimensions) => {
                if (dimensions.width > 0 && dimensions.height > 0) {
                    node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 };
                    stop();
                }
            },
            { deep: true, flush: 'post' },
        );
    });
}

function openForm(id: string, form: Form) {
    editorStore.openFormPanel(id, form);
}
onMounted(() => {
    if (projectStore.flow) {
        const [x = 0, y = 0] = projectStore.flow.position;
        setNodes(projectStore.flow.nodes);
        setEdges(projectStore.flow.edges);
        setTransform({ x, y, zoom: projectStore.flow.zoom || 0 });
    }
});

//? This is used only to remove
const sourceNode = ref(null);
const targetNode = ref(null);

function changeEdge(event) {
    if(event[0].type === 'select') {
        const edge = findEdge(event[0].id);
        sourceNode.value = findNode(edge.source);
        targetNode.value = findNode(edge.target);
    }if(event[0].type === 'remove') {
        if(sourceNode.value) {
            sourceNode.value.data.isSource = false;
        }
        if(targetNode.value) {
            targetNode.value.data.isTarget = false;
        }
    }
}

function connectEdge(event) {
    const source = findNode(event.source);
    const target = findNode(event.target);
    if(source.data.isSource || target.data.isTarget) {
        const connectedEdges = getConnectedEdges([target], edges.value);
        for(const edge of connectedEdges) {
            if(edge.source === source.id) {
                sourceNode.value = source;
                targetNode.value = null;

                //TODO: find why this is needed
                setTimeout(() => {
                    removeEdges([edge]);
                }, 0);
            }
        }
    }
    source.data.isSource = true;
    target.data.isTarget = true;
}

function update(event) {
    let sourceNode = findNode(event.edge.source);
    let targetNode = findNode(event.edge.target);

    sourceNode.data.isSource = false;
    targetNode.data.isTarget = false;

    event.edge.source = event.connection.source;
    event.edge.target = event.connection.target;

    sourceNode = findNode(event.edge.source);
    targetNode = findNode(event.edge.target);

    sourceNode.data.isSource = true;
    targetNode.data.isTarget = true;
}

</script>

<template>
    <VueFlow
        v-model="projectStore.elements"
        auto-connect
        :default-zoom=".75"
        :max-zoom="1.5"
        :min-zoom=".5"
        :node-types="nodeTypes"
        :connection-mode="ConnectionMode.Strict"
        :connection-radius="50"
        :edge-updater-radius="30"
        @edges-change="changeEdge"
        @edge-update="update"
        @connect="connectEdge"
        @drop="onDrop"
        @dragover.prevent
        @dragenter.prevent
    >
        <template #node-custom="{ id, data }">
            <ScreenNode :id="id" :data="data" />
        </template>
        <template #node-chapter="{ id, data }">
            <ChapterNode :id="id" :data="data" />
        </template>
        <template #node-epoc="{ id, data }">
            <ePocNode :id="id" :data="data" />
        </template>
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

<style scoped lang="scss">
.node {
    margin: auto;
}
</style>