<script setup lang="ts">
import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import { useEditorStore } from '@/src/shared/stores';

const editorStore = useEditorStore();

defineProps<{
    inputValue: string;
    label: string;
}>();

function openIconModal() {
    editorStore.iconModal = true;
}

</script>

<template>
    <label v-if="label !== ''" class="input-label" :for="label">{{ label }}</label>
    <div :id="label" class="container">
        <BadgeItem :icon="inputValue" :view-mode="true" :inactive="!inputValue" />
        <button class="btn btn-form" @click="openIconModal">
            <i class="icon-plus"></i>
            Modifier l'icône
        </button>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    gap: 1.5rem;
    
    button {
        height: fit-content;
        margin: auto 0;
    }
}
</style>