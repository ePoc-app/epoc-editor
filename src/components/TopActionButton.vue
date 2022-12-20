<script setup lang="ts">

defineProps<{
    icon: string;
    text?: string;
    textBefore?: string;
     //TODO: Find a way to manage different actions within the same component
    //action: string;
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
}
.btn-squared {
    padding: .7rem;
}
</style>