<script setup lang="ts">
// import { ref } from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
// import ChartFlow from './components/ChartFlow.vue';
import LandingPage from './views/LandingPage.vue';

// let fileContent = ref('');

// // @ts-ignore
// //! window.api is not recognized by TypeScript
// window.api.receive('fromMain', (data: string) => {
//     fileContent.value = data;
// });

// function sendData() {
//     // @ts-ignore
//     //! window.api is not recognized by TypeScript
//     window.api.send('toMain', 'Hello from Renderer');
// }

// remove this when implementing dark mode
const root = document.querySelector(':root');
root.setAttribute('color-scheme', 'light');

</script>

<template>
    <LandingPage />
    <!-- <HelloWorld />
    <p>{{ fileContent }}</p>
    <button @click="sendData">Send</button>
    <ChartFlow /> -->
</template>