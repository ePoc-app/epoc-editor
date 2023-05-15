<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';
import { ref } from 'vue';
import { useEditorStore } from '@/src/shared/stores';

defineProps<{
    elements: SideAction[];
    name: string;
}>();

const editorStore = useEditorStore();

const templateTooltip = 'Glisser/déposer pour ajouter un modèle';

const dragging = ref(false);

function dragStart(elements) {
    editorStore.draggedElement = {
        type: 'sideAction',
        element: elements
    };
    dragging.value = true;
}

</script>

<template>
    <div class="container">
        <p class="page-title">{{ name ? name : 'Modèle' }}</p>
        <div
            v-tippy="{content: templateTooltip, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
            class="page-template node"
            :draggable="true"
            :class="{ 'dragging': dragging }"
            @dragstart="dragStart(elements)"
            @dragend="dragging = false"
        >
            <ContentButton 
                v-for="(element, index) in elements"
                :key="index"
                :icon="element.icon"
                :is-draggable="false"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.page-template {
    cursor: grab;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    &.dragging {
        cursor: grabbing;
        transition: opacity .1s ease-in-out;
        opacity: .5;
        box-shadow: none;
    }
}

.page-title {
    margin: 0;
    padding: .2rem;
    margin: 0 1rem;
    max-width: calc(60px + 1.8rem);
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>