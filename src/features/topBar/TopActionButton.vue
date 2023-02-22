<script setup lang="ts">

defineProps<{
    icon: string;
    text?: string;
    textBefore?: string;
    disabled?: boolean;
}>();

</script>

<template>
    <button class="btn btn-top-bar" :class="!text ? 'btn-squared' : ''" :disabled="disabled">
        <span v-if="textBefore" class="text-top-bar zoom-span">{{ textBefore }}</span>
        <i :class="icon" />
        <span v-if="text" class="text-top-bar">{{ text }}</span>
    </button>
</template>

<style scoped lang="scss">
.btn-squared {
    padding: .7rem;
}

.btn:disabled{
    opacity: 0.5;
}
</style>