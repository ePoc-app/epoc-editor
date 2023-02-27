<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { projectService } from '@/src/shared/services';

const props = defineProps<{
    inputValue: string;
    label: string;
    accept: string;
    placeholder: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
}>();

const url = ref('');
const fileInput = ref(null);
const filetype = computed(() => {
    const ext = url.value.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'img';
    if (['mp4'].includes(ext)) return 'video';
    if (['mp3'].includes(ext)) return 'audio';
    return null;
});

//! This function have to fetch the image from the back
async function changeImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    fileInput.value.value = '';
    url.value = await projectService.importFile(file.path);
    emit('input', url.value);
}

function deleteFile() {
    url.value = '';
}

function openFile() {
    fileInput.value.click();
}

onMounted(() => {
    url.value = props.inputValue;
});

</script>

<template>
    <label class="input-label" :for="label">{{ label }}</label>
    <div v-show="url" class="show-input">
        <div class="input-file">
            <input ref="fileInput" class="file" type="file" :accept="accept" @change="changeImage">
            <input class="input" type="text" readonly :value="url" @click="openFile">
            <i class="icon-supprimer" @click="deleteFile"></i>
        </div>
        <div v-if="url" class="preview">
            <img v-if="filetype === 'img'" :src="'assets://'+url" :alt="label" />
            <video v-if="filetype === 'video'" :src="'assets://'+url" controls></video>
            <audio v-if="filetype === 'audio'" :src="'assets://'+url" controls></audio>
        </div>
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
.preview {
    img, video, audio {
        width:100%;
        height:auto;
        min-height: 50px;
        max-width: 100%;
        margin-bottom: 1.5rem;
    }
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

.input-file{
    position: relative;
    margin-bottom: 1.5rem;

    .input{
        margin-bottom: 0;
        padding-right: 1.5rem;
    }

    .file{
        display: none;
    }
}

.icon-supprimer{
    position: absolute;
    right:.5rem;
    top:50%;
    transform: translateY(-50%);
}

</style>