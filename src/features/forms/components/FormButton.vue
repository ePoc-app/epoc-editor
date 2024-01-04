<script setup lang="ts">
defineProps<{
    label: string;
    icon: string;
    disabled: boolean;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
}>();
</script>

<template>
    <button
        class="btn btn-form"
        :class="{ 'btn-delete': label === 'Supprimer' }"
        :disabled="!!disabled"
        @click="emit('click')"
    >
        <i :class="icon"></i>
        {{ label }}
    </button>
</template>

<style scoped lang="scss">
.btn-delete:hover {
    transition: color 0.2s ease-in-out;
    color: var(--editor-red);
}

button:disabled {
    pointer-events: none;
    opacity: 0.5;
}
</style>
