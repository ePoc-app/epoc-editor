<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores/editorStore';
import { getConditions, createPhrase } from '@/src/shared/services';
import { getElementType, goToElement } from '@/src/shared/services/graph';
import { computed } from 'vue';
import { Condition } from '@/src/shared/interfaces';

const editorStore = useEditorStore();

const currentBadge = editorStore.getEpocNode.data.formValues['badges'][editorStore.openedBadgeId];

const conditions = computed(() => getConditions(currentBadge));

function onClick() {
    editorStore.conditionModal = true;
}

function getPhrase(condition: Condition): { phrase: string, id: string} {
    const elementType = getElementType(condition.element);
    const phrase = createPhrase(condition, elementType);
    return { phrase, id: condition.element };
}


let hoveredElement = null;
function handleMouseEnter(condition: Condition) {
    hoveredElement = document.getElementById(condition.element);
    hoveredElement.classList.add('highlight');
}

function handleMouseLeave() {
    hoveredElement.classList.remove('highlight');
    hoveredElement = null;
}

</script>

<template>
    <ul v-if="conditions.length > 0">
        <li v-for="(condition, index) of conditions" :key="index">
            {{ getPhrase(condition).phrase }}
            <a
                @mouseenter="handleMouseEnter(condition)"
                @mouseleave="handleMouseLeave"
                @click="goToElement(condition.element)">
                {{ condition.element }}
            </a>
        </li>
    </ul>
    <button class="btn btn-form" @click="onClick">
        <i class="icon-plus"></i>
        Configurer les conditions
    </button>
</template>

<style scoped lang="scss">
ul {
    margin-top: 0;
    margin-bottom: 1.5rem;

    li {
        font-size: 1rem;
        margin-top: .5rem;
    }
}

a {
    color: var(--editor-blue);
    font-weight: 600;
    cursor: pointer;
}
</style>