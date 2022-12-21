<script setup lang="ts">

// remove this when implementing dark mode
const root = document.querySelector(':root');
root.setAttribute('color-scheme', 'light');

</script>

<template>
    <router-view />
</template>