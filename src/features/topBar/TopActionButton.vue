<script setup lang="ts">

defineProps<{
    icon: string;
    text?: string;
    textBefore?: string;
     //TODO: Find a way to manage different actions within the same component
}>();

</script>

<template>
    <button class="btn btn-top-bar" :class="!text ? 'btn-squared' : ''">
        <span v-if="textBefore" class="text-top-bar zoom-span">{{ textBefore }}</span>
        <i :class="icon" />
        <span v-if="text" class="text-top-bar">{{ text }}</span>
    </button>
</template>

<style scoped lang="scss">
.btn-top-bar {
    padding: .7rem 1rem;
    margin-right: 1rem;
    background-color: var(--button-blue);
    border-radius: 8px;
    border: 1px solid var(--border);
    transition: box-shadow .2s ease-in-out;
    i {
        margin: auto;
        font-size: 1rem;
    }
    .text-top-bar {
        margin-left: .5rem;
    }
    .icon-chevron {
        font-size: .5rem;
    }
    .zoom-span {
        margin-right: .5rem;
        margin-left: 0;
    }
    &:hover {
      background-color: var(--content);  
      box-shadow: 0 1px 8px 0 var(--shadow);
    }
    &:active {
        opacity: .7;
    }
}
.btn-squared {
    padding: .7rem;
}
</style>