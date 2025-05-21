import { ref } from 'vue';
import { SideAction } from '@/src/shared/interfaces';
import { useEditorStore } from '@/src/shared/stores';
import { moveGuard } from '@/src/shared/utils/draggable';

export function useDraggable() {
    const editorStore = useEditorStore();
    const isDragging = ref(false);

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

    function handleDragStart(event: DragEvent, sideAction: SideAction) {
        editorStore.draggedElement = {
            type: 'sideAction',
            element: [sideAction],
        };
        isDragging.value = true;
    }

    function handleDragEnd() {
        isDragging.value = false;
    }

    return {
        isDragging,
        dragOptions,
        handleDragStart,
        handleDragEnd,
    };
}
