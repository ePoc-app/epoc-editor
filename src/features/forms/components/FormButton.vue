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
    <button 
        class="btn btn-form"
        :class="{ 'btn-delete' : label === 'Supprimer' }"
        @click="emit('click')"
    >
        <i :class="icon"></i>
        {{ label }}
    </button>
</template>

<style scoped lang="scss">
.btn-delete:hover {
    transition: color .2s ease-in-out;
    color: var(--editor-red);
}
</style>