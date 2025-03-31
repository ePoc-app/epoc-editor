<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { deleteSelectedNodes } from '@/src/shared/services/graph';
import { saveState } from '@/src/shared/services/undoRedo.service';
import ChoiceModal from '@/src/components/ChoiceModal.vue';

const editorStore = useEditorStore();

function confirmDelete() {
    saveState();
    deleteSelectedNodes();
}
</script>

<template>
    <ChoiceModal
        :accept-label="$t('validation.yes')"
        :cancel-label="$t('validation.no')"
        @cancel="editorStore.validationModal = false"
        @accept="confirmDelete"
    >
        <h3>{{ $t('validation.confirm') }}</h3>
    </ChoiceModal>
</template>

<style lang="scss" scoped>
h3 {
    text-align: center;
}
</style>
