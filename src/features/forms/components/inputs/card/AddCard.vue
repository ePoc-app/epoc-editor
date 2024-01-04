<script setup lang="ts">
defineProps<{
    placeholder: string;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
}>();
</script>

<template>
    <button class="btn btn-form" @click="emit('click')">
        <i class="icon-plus"></i>
        {{ placeholder }}
    </button>
</template>

<style scoped lang="scss">
i {
    font-size: 0.9rem;
}

button {
    margin-bottom: 1.5rem;
}
</style>
