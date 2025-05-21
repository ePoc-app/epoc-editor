<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
    title: string;
    open?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean);
}>();

const isOpen = useVModel(props, 'open', emit);

function closeMenu() {
    isOpen.value = false;
}
</script>

<template>
    <div v-if="isOpen" class="side-menu">
        <header>
            <h3>{{ title }}</h3>
            <button class="btn btn-close" @click="closeMenu">
                <i class="icon-x"></i>
            </button>
        </header>

        <hr class="separator" />

        <div class="side-menu-content">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.side-menu {
    z-index: 100;
    position: fixed;
    top: 80px;
    left: 100px;
    height: 100vh;
    background-color: white;
    border-right: 1px solid var(--border);
    width: fit-content;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
            margin-left: 1rem;
        }
    }

    .separator {
        margin: 0;
        border: none;
        border-top: 1px solid var(--border);
    }

    &-content {
        padding: 1rem;
        height: calc(100vh - 60px);
        overflow-y: auto;
    }
}
</style>
