<script setup lang="ts">

defineProps<{
    icon: string;
    text?: string;
    position?: 'left' | 'right';
    disabled?: boolean;
}>();

</script>

<template>
    <button class="btn btn-top-bar" :class="{ 'btn-squared': !text }" :disabled="disabled">
        <span v-if="position === 'left'" class="text-top-bar zoom-span">{{ text }}</span>
        <i :class="icon" />
        <span v-if="position === 'right'" class="text-top-bar">{{ text }}</span>
    </button>
</template>

<style scoped lang="scss">
.btn-squared {
    padding: .7rem;
}

button:disabled {
    pointer-events: none;
}
</style>