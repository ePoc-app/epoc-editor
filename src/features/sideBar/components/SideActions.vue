<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '@/src/shared/stores';
import env from '@/src/shared/utils/env';
import VueDraggable from 'vuedraggable';
import SideBarButton from './SideBarButton.vue';
import FloatingMenu from './FloatingMenu.vue';
import { useDraggable } from '../composables/useDraggable';
import { useSideBarStore } from '../stores/sideBarStore';

const sidebarStore = useSideBarStore();
const editorStore = useEditorStore();
const { dragOptions, handleDragStart, handleDragEnd } = useDraggable();

const standardContent = computed(() =>
    editorStore.standardPages.filter(({ type }) => {
        const filteredPages = ['legacy-condition', 'condition', 'question', 'model', 'badge', 'asset'];
        const prodFilteredPages = env.isDev ? [] : [];
        return ![...filteredPages, ...prodFilteredPages].includes(type);
    }),
);

const questionContent = computed(() => editorStore.standardPages.find(({ type }) => type === 'question'));
const conditionContent = computed(() => editorStore.standardPages.find(({ type }) => type === 'condition'));
const modelContent = computed(() => editorStore.standardPages.find(({ type }) => type === 'model'));
const badgeContent = computed(() => editorStore.standardPages.find(({ type }) => type === 'badge'));
const assetContent = computed(() => editorStore.standardPages.find(({ type }) => type === 'asset'));

function showQuestionsMenu() {
    sidebarStore.toggleMenu('question');
}

function showTemplateMenu() {
    sidebarStore.toggleMenu('model');
}

function showBadgeMenu() {
    sidebarStore.toggleMenu('badge');
}

function showAssetMenu() {
    sidebarStore.toggleMenu('asset');
}
</script>

<template>
    <div class="actions-lists">
        <div class="actions-list">
            <VueDraggable
                v-bind="dragOptions"
                key="draggable"
                :model-value="standardContent"
                item-key="index"
                class="contents-list"
            >
                <template #item="{ element, index }">
                    <SideBarButton
                        :key="index"
                        :content="element"
                        :is-draggable="true"
                        @dragstart="(event) => handleDragStart(event, element)"
                        @dragend="handleDragEnd"
                    />
                </template>
            </VueDraggable>

            <div class="question">
                <SideBarButton
                    :content="questionContent"
                    :is-active="sidebarStore.questionMenu"
                    @click="showQuestionsMenu"
                />
                <FloatingMenu
                    :items="editorStore.questions"
                    :is-visible="sidebarStore.questionMenu"
                    @dragstart="handleDragStart"
                />
            </div>

            <SideBarButton
                v-if="env.isDev"
                :content="conditionContent"
                :is-draggable="true"
                @dragstart="(event) => handleDragStart(event, conditionContent)"
                @dragend="handleDragEnd"
            />

            <hr />

            <SideBarButton
                v-if="env.isDev"
                :content="modelContent"
                :is-active="sidebarStore.modelMenu"
                @click="showTemplateMenu"
            />
        </div>

        <div class="actions-list">
            <SideBarButton :content="badgeContent" :is-active="sidebarStore.badgeMenu" @click="showBadgeMenu" />
            <SideBarButton :content="assetContent" :is-active="sidebarStore.assetMenu" @click="showAssetMenu" />
        </div>
    </div>
</template>

<style scoped lang="scss">
hr {
    border-top: 1px solid var(--border);
    width: 60px;
}

.dragging {
    transition: opacity 0.1s ease-in-out;
    opacity: 0.5;
    box-shadow: none;
}

.actions-list,
.contents-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.actions-lists {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
}

.question {
    position: relative;
}
</style>
