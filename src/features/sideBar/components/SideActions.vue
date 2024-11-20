<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import { ref } from 'vue';
import ContentButton from '@/src/components/ContentButton.vue';
import { useEditorStore } from '@/src/shared/stores';
import { moveGuard } from '@/src/shared/utils/draggable';
import env from '@/src/shared/utils/env';
import SettingsModal from '@/src/features/settings/SettingsModal.vue';

const editorStore = useEditorStore();

const standardContent = editorStore.standardPages.filter(({ type }) => {
    const filteredPages = ['legacy-condition', 'condition', 'question', 'model', 'badge'];
    const prodFilteredPages = env.isDev ? [] : [];
    return ![...filteredPages, ...prodFilteredPages].includes(type);
});
const questionContent = editorStore.standardPages.find(({ type }) => type === 'question');
const conditionContent = editorStore.standardPages.find(({ type }) => type === 'condition');
const modelContent = editorStore.standardPages.find(({ type }) => type === 'model');
const badgeContent = editorStore.standardPages.find(({ type }) => type === 'badge');

const dragging = ref(false);

const dragOptions = {
    group: {
        name: 'node',
        pull: 'clone',
        put: false,
    },
    disabled: false,
    sort: false,
    ghostClass: 'ghost',
    move: moveGuard,
};

const classList = (item: SideAction) => ({
    clickable: item.type === 'question' || item.type === 'model' || item.type === 'badge',
});

function dragStart(event: DragEvent, sideAction: SideAction) {
    editorStore.draggedElement = {
        type: 'sideAction',
        element: [sideAction],
    };
    dragging.value = true;
}

function showQuestionsMenu() {
    editorStore.toggleSideMenu('question');
}

function showTemplateMenu() {
    editorStore.toggleSideMenu('model');
}

function showBadgeMenu() {
    editorStore.toggleSideMenu('badge');
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
                <!--suppress VueUnrecognizedSlot -->
                <template #item="{ element, index }">
                    <div>
                        <!--suppress VueUnrecognizedDirective -->
                        <ContentButton
                            :key="index"
                            v-tippy="{
                                content: element.tooltip,
                                placement: 'right',
                                arrow: true,
                                arrowType: 'round',
                                animation: 'fade',
                            }"
                            :data-testid="`${element.type}-content`"
                            :icon="element.icon"
                            :is-draggable="true"
                            :class-list="{ 'btn-content-blue': true }"
                            @dragstart="dragStart($event, element)"
                        />
                    </div>
                </template>
            </VueDraggable>
            <div class="question">
                <!--suppress VueUnrecognizedDirective -->
                <ContentButton
                    v-tippy="{
                        content: questionContent.tooltip,
                        placement: 'right',
                        arrow: true,
                        arrowType: 'round',
                        animation: 'fade',
                    }"
                    data-testid="questions-menu"
                    :icon="questionContent.icon"
                    :is-draggable="false"
                    :class-list="classList(questionContent)"
                    :is-active="editorStore.questionMenu"
                    @mouseup.stop
                    @click="showQuestionsMenu"
                />
                <div v-if="editorStore.questionMenu" data-testid="floating-menu" class="floating-menu" @click.stop>
                    <div class="arrow-wrapper">
                        <div class="arrow"></div>
                    </div>
                    <VueDraggable
                        v-bind="dragOptions"
                        key="draggable"
                        :model-value="editorStore.questions"
                        item-key="id"
                        class="questions-list"
                    >
                        <!--suppress VueUnrecognizedSlot -->
                        <template #item="{ element, index }">
                            <div>
                                <!--suppress VueUnrecognizedDirective -->
                                <ContentButton
                                    :key="index"
                                    v-tippy="{
                                        content: element.label,
                                        placement: 'right',
                                        arrow: true,
                                        arrowType: 'round',
                                        animation: 'fade',
                                    }"
                                    :data-testid="`${element.type}-content`"
                                    :icon="element.icon"
                                    :class-list="{ 'btn-content-blue': true }"
                                    :is-draggable="true"
                                    @dragstart="dragStart($event, element)"
                                />
                            </div>
                        </template>
                    </VueDraggable>
                </div>
            </div>
            <!--suppress VueUnrecognizedDirective -->
            <ContentButton
                v-if="env.isDev"
                v-tippy="{
                    content: conditionContent.tooltip,
                    placement: 'right',
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                :icon="conditionContent.icon"
                :class-list="{ 'btn-content-blue': true }"
                :is-draggable="true"
                @dragstart="dragStart($event, conditionContent)"
                @dragend="dragging = false"
            />
            <hr />
            <!--suppress VueUnrecognizedDirective -->
            <ContentButton
                v-if="env.isDev"
                v-tippy="{
                    content: modelContent.tooltip,
                    placement: 'right',
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                class="model-menu"
                :icon="modelContent.icon"
                :is-draggable="false"
                :is-active="editorStore.modelMenu"
                :class-list="classList(modelContent)"
                @click="showTemplateMenu"
            />
        </div>
        <div class="actions-list">
            <!--suppress VueUnrecognizedDirective -->
            <ContentButton
                v-tippy="{
                    content: badgeContent.tooltip,
                    placement: 'right',
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                class="badge-menu"
                :icon="badgeContent.icon"
                :is-draggable="false"
                :is-active="editorStore.badgeMenu"
                :class-list="classList(badgeContent)"
                @click="showBadgeMenu"
            />
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

.active {
    border: 2px solid var(--editor-blue);
    color: var(--editor-blue);

    box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
    transition: all 0.15s ease-in-out;
}

.questions-list, .actions-list, .contents-list {
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

.floating-menu {
    background-color: white;
    padding: 1rem;
    position: absolute;
    left: 5.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    border-radius: 10px;
    filter: drop-shadow(0 1px 8px var(--shadow-outer));

    .btn {
        &:hover {
            box-shadow: 0 2px 8px 0 var(--shadow-outer);
        }
    }
}

// Modal transition
.v-enter-active,
.v-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.container {
    position: relative;
}

.model-menu {
    flex: 1;
}

</style>
