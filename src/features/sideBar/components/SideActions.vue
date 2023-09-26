<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import { ref } from 'vue';
import ContentButton from '@/src/components/ContentButton.vue';
import { useEditorStore } from '@/src/shared/stores';
import { moveGuard } from '@/src/shared/utils/draggable';
import env from '@/src/shared/utils/env';

const editorStore = useEditorStore();

const standardContent = editorStore.standardPages.filter(({ type }) => {
    const filteredPages = ['legacy-condition', 'condition', 'question', 'model', 'badge'];
    const prodFilteredPages = env.isDev ? []:[];
    return ![...filteredPages, ...prodFilteredPages].includes(type);
});
const questionContent = editorStore.standardPages.find(({ type }) => type === 'question');
const conditionContent = editorStore.standardPages.find(({ type }) => type === 'condition');
const modelContent = editorStore.standardPages.find(({ type }) => type === 'model');

const dragging = ref(false);

const dragOptions = {
    group: {
        name:'node',
        pull: 'clone',
        put: false,
    },
    disabled: false,
    sort: false,
    ghostClass: 'ghost',
    move: moveGuard
};

const classList = (item: SideAction) => ({ 'clickable': item.type === 'question' || item.type === 'model' || item.type === 'badge' });

function dragStart(event: DragEvent, sideAction: SideAction) {
    editorStore.draggedElement = {
        type: 'sideAction',
        element: [sideAction]
    };
    dragging.value = true;
}

function showQuestionsMenu() {
    editorStore.questionMenu = !editorStore.questionMenu;
}

function showTemplateMenu() {
    editorStore.modelMenu = !editorStore.modelMenu;
}

</script>

<template>
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
                    v-tippy="{content: element.tooltip, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
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
            v-tippy="{content: questionContent.tooltip, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
            :icon="questionContent.icon"
            :is-draggable="false"
            :class-list="classList(questionContent)"
            :is-active="editorStore.questionMenu"
            @click="showQuestionsMenu"
        />
        <div v-if="editorStore.questionMenu" class="floating-menu" @click.stop>
            <div class="arrow-wrapper">
                <div class="arrow">
                </div>
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
                            v-tippy="{content: element.label, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
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
    <div v-if="env.isDev">
        <!--suppress VueUnrecognizedDirective -->
        <ContentButton
            v-tippy="{content: conditionContent.tooltip, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
            :icon="conditionContent.icon"
            :class-list="{ 'btn-content-blue': true }"
            :is-draggable="true"
            @dragstart="dragStart($event, conditionContent)"
            @dragend="dragging = false"
        />
        <hr>
        <!--suppress VueUnrecognizedDirective -->
        <ContentButton
            v-tippy="{content: modelContent.tooltip, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
            :icon="modelContent.icon"
            :is-draggable="false"
            :is-active="editorStore.modelMenu"
            :class-list="classList(modelContent)"
            @click="showTemplateMenu"
        />
    </div>
</template>

<style scoped lang="scss">

hr {
    border-top: 1px solid var(--border);
    width: 60px;
}

.dragging {
    transition: opacity .1s ease-in-out;
    opacity: .5;
    box-shadow: none;
}

.active {
    border: 2px solid var(--editor-blue);
    color: var(--editor-blue);
    
    box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
    transition: all .15s ease-in-out;
}

.questions-list, .contents-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

</style>