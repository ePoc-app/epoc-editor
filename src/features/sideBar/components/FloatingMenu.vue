<script setup lang="ts">
import { SideAction } from '@/src/shared/interfaces';
import VueDraggable from 'vuedraggable';
import { moveGuard } from '@/src/shared/utils/draggable';
import SideBarButton from './SideBarButton.vue';

const props = defineProps<{
    items: SideAction[];
    isVisible: boolean;
}>();

const emit = defineEmits<{
    (e: 'dragstart', event: DragEvent, element: SideAction): void;
}>();

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
</script>

<template>
    <div v-if="isVisible" data-testid="floating-menu" class="floating-menu" @click.stop>
        <div class="arrow-wrapper">
            <div class="arrow"></div>
        </div>
        <VueDraggable v-bind="dragOptions" key="draggable" :model-value="items" item-key="id" class="menu-list">
            <template #item="{ element, index }">
                <SideBarButton
                    :key="index"
                    :content="element"
                    :is-draggable="true"
                    @dragstart="(event) => emit('dragstart', event, element)"
                />
            </template>
        </VueDraggable>
    </div>
</template>

<style scoped lang="scss">
.question {
    position: relative;
}

.menu-list {
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

.active {
    border: 2px solid var(--editor-blue);
    color: var(--editor-blue);

    box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
    transition: all 0.15s ease-in-out;
}
</style>
