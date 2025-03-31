<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from './shared/stores';

// remove this when implementing dark mode
const root = document.querySelector(':root');
root.setAttribute('color-scheme', 'light');

onMounted(() => {
    // const settingsStore = useSettingsStore();
    // if (!settingsStore.initialized) {
    //     settingsStore.init();
    // }
});
</script>

<template>
    <router-view />
</template>
