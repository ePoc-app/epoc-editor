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

function deleteFile() {
    console.log('delete file');
}

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <div :id="label" class="input">
        <input
            class="input-file"
            type="file"
            :accept="accept"
            @change="changeImage($event)"
        >
        <i class="icon-supprimer" @click="deleteFile"></i>
    </div>
    <img src="/img/image.png" alt="preview img">
    <!-- <img v-if="url" :src="url" alt="image preview"> -->
</template>

<style scoped lang="scss">
div {
    display: flex;
    align-items: center;
}
img {
    margin-bottom: 1.5rem;
}
</style>