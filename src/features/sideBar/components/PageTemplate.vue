<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import ContentButton from '@/src/components/ContentButton.vue';
import { ref } from 'vue';

defineProps<{
    elements: SideAction[];
    name: string;
}>();

const templateTooltip = 'Glisser/déposer pour ajouter un modèle';

const dragging = ref(false);

function dragStart(event, elements) {
    event.dataTransfer.dropEffect= 'move';
    event.dataTransfer.effectAllowed= 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(elements));
    event.dataTransfer.setData('isTemplate', 'true');
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
            @dragstart="dragStart($event, elements)"
            @dragend="dragging = false"
        >
            <ContentButton 
                v-for="(element, index) in elements"
                :key="index"
                :icon="element.icon"
                :class-list="{ 'btn-content-blue': false }"
                :is-active="false"
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
    max-width: calc(60px + 1.8rem);
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>