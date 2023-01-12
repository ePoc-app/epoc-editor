
<script setup lang="ts">

//! This component is linked to fileInput and they may be fusionned

defineProps<{
    placeholder: string
    label: string;
}>();

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <button :id="label" class="btn btn-form">
        <i class="icon-plus"></i>
        {{ placeholder }}
    </button>
</template>

<style scoped lang="scss">

i {
    font-size: .9rem;
}

button {
    margin-bottom: 1.5rem;
}

</style>