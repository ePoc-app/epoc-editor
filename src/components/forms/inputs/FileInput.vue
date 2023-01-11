<script setup lang="ts">

defineProps<{
    label: string;
    accept: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

let url;
//! This function have to fetch the image from the back
function changeImage(e) {
    const file = e.target.files[0];
    url = URL.createObjectURL(file);
    emit('input', url);
}

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <input
        :id="label"
        class="input input-file"
        type="file"
        :accept="accept"
        @change="changeImage($event)"
    >
    <!-- <img v-if="url" :src="url" alt="image preview"> -->
</template>