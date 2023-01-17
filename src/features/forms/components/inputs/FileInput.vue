<script setup lang="ts">import { ref } from 'vue';


defineProps<{
    label: string;
    accept: string;
    placeholder: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

const url = ref('');

//! This function have to fetch the image from the back
function changeImage(e) {
    console.log('change image');
    const file = e.target.files[0];
    url.value = URL.createObjectURL(file);
    emit('input', url.value);
}

function deleteFile() {
    url.value = '';
}

function openFile() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
}

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <div v-show="url" class="show-input">
        <div :id="label" class="input">
            <input
                id="file-input"
                class="input-file"
                type="file"
                :accept="accept"
                @change="changeImage($event)"
            >
            <i class="icon-supprimer" @click="deleteFile"></i>
        </div>
        <img src="/img/image.png" alt="preview img">
        <!-- <img v-if="url" :src="url" alt="image preview"> -->
    </div>
    <div v-if="!url">
        <button :id="label" class="btn btn-form" @click="openFile">
            <i class="icon-plus"></i>
            {{ placeholder }}
        </button>
    </div>
</template>

<style scoped lang="scss">
div {
    display: flex;
}
img {
    margin-bottom: 1.5rem;
}

i {
    font-size: .9rem;
    cursor: pointer;
}

button {
    margin-bottom: 1.5rem;
}

.show-input {
    display: flex;
    flex-direction: column;
}

</style>