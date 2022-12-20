<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    icon: string;
    //TODO: Find a way to manage different actions within the same component
    //action: string;
}>();

const showMenu = ref(false);

</script>

<template>
    <button class="btn" :class="{ active : showMenu }" @click="showMenu = !showMenu">
        <i :class="icon" />
    </button>
</template>

<style scoped lang="scss">
button {
    background-color: var(--button-blue);
    width: 60px;
    height: 60px;
    margin-bottom: .7rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    i {
        margin: auto;
        font-size: 1.5rem;
        font-weight: 500;
    }
    &:active {
        background-color: var(--content);
        box-shadow: 0 1px 8px 0 var(--shadow);
    }

    &.active {
        background-color: var(--content);
        box-shadow: 0 1px 8px 0 var(--shadow);
    }
}
</style>