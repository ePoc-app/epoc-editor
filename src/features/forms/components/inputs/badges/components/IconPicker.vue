<script setup lang="ts">
import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import { iconsPath } from '@/src/shared/data';
import { useEditorStore } from '@/src/shared/stores';
import { computed } from 'vue';

const editorStore = useEditorStore();

const props = defineProps<{
    inputValue: string;
    label: string;
}>();

function openIconModal() {
    editorStore.iconModal = true;
}

const icon = computed(() => {
    if (props.inputValue.endsWith('.svg')) return props.inputValue;
    return `${iconsPath}/${props.inputValue}.svg`;
});

</script>

<template>
    <label v-if="label !== ''" class="input-label" :for="label">{{ label }}</label>
    <div :id="label" class="container">
        <BadgeItem :icon="icon" :view-mode="true" :inactive="!inputValue" />
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