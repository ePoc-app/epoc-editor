<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import { ref } from 'vue';
import ContentButton from '@/src/components/ContentButton.vue';
import { useEditorStore } from '@/src/shared/stores';

const props = defineProps<{
    sideAction:SideAction;
}>();

const editorStore = useEditorStore();

const classList = { 'clickable': props.sideAction.type === 'question' };

const dragging = ref(false);

function dragStart(event, sideAction) {
    event.dataTransfer.dropEffect= 'move';
    event.dataTransfer.effectAllowed= 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(sideAction));
    dragging.value = true;
}

function showMenu() {
    if(props.sideAction.type === 'question') {
        editorStore.floatingMenu = !editorStore.floatingMenu;
    }
}

const dragOptions = {
    group: {
        name:'node',
        pull: 'clone',
        put: false,
    },
    disabled: false,
    sort: false,
    ghostClass: 'ghost'
};

</script>

<template>
    <div class="container">
        <template v-if="sideAction.type === 'question'">
            <ContentButton
                class="question"
                :class="{ 'dragging' : dragging }"
                :icon="sideAction.icon"
                :class-list="classList"
                :is-active="editorStore.floatingMenu"
                :is-draggable="false"
                @dragstart="dragStart($event, sideAction)"
                @dragend="dragging = false"
                @click="showMenu"
            />
            <Transition>
                <div v-if="editorStore.floatingMenu" class="floating-menu" @click.stop>
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
                        <template #item="{ element, index }">
                            <div>
                                <ContentButton
                                    :key="index"
                                    :icon="element.icon"
                                    :class-list="{ 'btn-content-blue': false }"
                                    :is-active="false"
                                    :is-draggable="true"
                                    v-tippy="{content: element.label, placement: 'right', arrow : true, arrowType : 'round', animation : 'fade'}"
                                    @dragstart="dragStart($event, element)"
                                />
                            </div>
                        </template>
                    </VueDraggable>
                </div>
            </Transition>
        </template>
        <template v-else>
            <ContentButton
                class="question"
                :class="{ 'dragging' : dragging }"
                :icon="sideAction.icon"
                :class-list="classList"
                is-blue
                is-draggable
                :is-active="false"
                @dragstart="dragStart($event, sideAction)"
                @dragend="dragging = false"
                @click="showMenu"
            />
        </template>
    </div>
</template>

<style scoped lang="scss">

.dragging {
    transition: opacity .1s ease-in-out;
    opacity: .5;
    box-shadow: none;
}

.active {
    border: 1px solid var(--editor-blue);
    color: var(--editor-blue);
    
    box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
    transition: all .15s ease-in-out;
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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