<script setup lang="ts">
import { Background, BackgroundVariant, MiniMap, Panel, PanelPosition } from '@vue-flow/additional-components';
import { VueFlow, useVueFlow } from '@vue-flow/core';

const { nodes, addNodes, addEdges, onConnect, dimensions}  = useVueFlow();

onConnect((params) => addEdges([params]));

const addRandomNode = () => {
    const nodeId = (nodes.value.length + 1).toString();

    const newNode = {
        id: nodeId,
        label: `Node ${nodeId}`,
        position: {
            x: Math.random() * dimensions.value.width,
            y: Math.random() * dimensions.value.height,
        },
    };

    addNodes([newNode]);
};

function sum(a: number, b: number) {
    return a + b;
}

sum(1, 2);
</script>

<template>
    <VueFlow>
        <MiniMap />

        <Background :variant="BackgroundVariant.Lines" />

        <Panel :position="PanelPosition.TopRight">
            <button id="add-node" @click="addRandomNode">Add random node</button>
        </Panel>
    </VueFlow>
</template>