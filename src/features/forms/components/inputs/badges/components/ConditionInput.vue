<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores/editorStore';
import { getConditions, createPhrase } from '@/src/shared/services';
import { getElementType, getElementLabel, goToElement } from '@/src/shared/services/graph';
import { computed } from 'vue';
import { Condition } from '@/src/shared/interfaces';

const editorStore = useEditorStore();

const currentItem =
    editorStore.openedBadgeId ?
        editorStore.getEpocNode.data.formValues['badges'][editorStore.openedBadgeId]
        :   editorStore.getCurrentGraphNode.data.formValues;

const conditions = computed(() => getConditions(currentItem));

function onClick() {
    editorStore.conditionModal = true;
}

function getPhrase(condition: Condition): { phrase: string; label: string; tooltip: string } {
    const elementType = getElementType(condition.element);
    const labelData = getElementLabel(condition.element);
    const phrase = createPhrase(condition, elementType);

    const label = labelData.shortLabel;

    const tooltip = labelData.fullPath
        .map((part, index) => {
            if (index === 0) return part;
            return `<i class="icon-chevron-right"></i> ${part}`;
        })
        .join(' ');

    return { phrase, label, tooltip };
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
                v-tippy="{ content: getPhrase(condition).tooltip, allowHTML: true }"
                @mouseenter="handleMouseEnter(condition)"
                @mouseleave="handleMouseLeave"
                @click="goToElement(condition.element)"
            >
                {{ getPhrase(condition).label }}
            </a>
        </li>
    </ul>
    <button class="btn btn-form" @click="onClick">
        <i class="icon-plus"></i>
        {{ $t('inputs.manageConditions') }}
    </button>
</template>

<style scoped lang="scss">
ul {
    margin-top: 0;
    margin-bottom: 1.5rem;

    li {
        font-size: 1rem;
        margin-top: 0.5rem;
    }
}

a {
    color: var(--editor-blue);
    font-weight: 600;
    cursor: pointer;
}

i {
    font-size: 0.9rem;
}
</style>
