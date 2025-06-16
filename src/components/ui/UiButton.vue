<script setup lang="ts">
withDefaults(
    defineProps<{
        size: 'icon' | 'default';
        variant: 'outline' | 'default';
    }>(),
    {
        size: 'default',
        color: 'default',
    },
);
</script>

<template>
    <button class="ui-btn" :class="{ 'ui-btn-square': size === 'icon', 'ui-btn-outline': variant === 'outline' }">
        <slot />
    </button>
</template>

<style scoped lang="scss">
.ui-btn {
    border: none;
    cursor: pointer;
    color: var(--text);
    border-radius: 6px;
    transition: box-shadow 0.2s ease-in-out;

    &-outline {
        background: var(--content);
        border: 1px solid var(--border);

        &:hover {
            box-shadow: 0 1px 8px 0 var(--shadow-outer);
        }
    }

    &-square {
        width: 2rem;
        height: 2rem;
    }
}
</style>
