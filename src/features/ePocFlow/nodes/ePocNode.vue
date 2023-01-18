<script setup lang="ts">
import ContentButton from '../../../components/ContentButton.vue';
import { NodeElement } from '../../../shared/interfaces';
import { useEditorStore } from '../../../shared/stores';

const editorStore = useEditorStore();
const props = defineProps<{
    id: string;
    data: {
        type: object;
        required: true;
    }
}>();

const element: NodeElement = { id: props.id, action: { icon: 'icon-epoc', type: 'epoc'}, form: editorStore.getForm('epoc') };

function openForm(element: NodeElement) {
    editorStore.openFormPanel(element.id, element.form);
}

</script>

<template>
    <div>
        <ContentButton 
            :icon="element.action.icon"
            :is-active="editorStore.openedNodeId ? editorStore.openedNodeId === element.id : false"
            :is-draggable="false"
            :class-list="{ 'btn-content-blue' : false, 'clickable': true, 'btn-content-node': true, 'btn-content-large': true }"
            subtitle="ePoc"
            @click="openForm(element)"
        />
    </div>
</template>