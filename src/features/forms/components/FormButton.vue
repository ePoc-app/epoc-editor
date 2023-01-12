<script setup lang="ts">

defineProps<{
    label: string;
    icon: string;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
}>();

</script>

<template>
    <button class="btn btn-form" @click="emit('click')">
        <i :class="icon"></i>
        {{ label }}
    </button>
</template>