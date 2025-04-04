<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { graphService } from '@/src/shared/services';
import { getCurrentState } from '@/src/shared/services/undoRedo.service';

const props = defineProps<{
    id: string;
    inputValue: string;
    label: string;
    accept: string;
    placeholder: string;
    targetDirectory?: string;
}>();

const emit = defineEmits<{
    (e: 'input', value: string): void;
    (e: 'saveGivenState', state: string): void;
}>();

const url = ref('');
const fileInput = ref(null);
const filetype = computed(() => {
    const ext = url.value.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'img';
    if (['mp4', 'm4v'].includes(ext)) return 'video';
    if (['mp3'].includes(ext)) return 'audio';
    return null;
});

async function changeImage(e: Event) {
    savedState = getCurrentState(true);

    const target = e.target as HTMLInputElement;
    const file = target.files[0];
    if (!file) return;
    fileInput.value.value = '';
    url.value = await graphService.importFile(file.path, props.targetDirectory);

    emit('input', url.value);
    emit('saveGivenState', savedState);
}

function deleteFile() {
    savedState = getCurrentState(true);

    url.value = '';

    emit('input', url.value);
    emit('saveGivenState', savedState);
}

function openFile() {
    fileInput.value.click();
}

onMounted(() => {
    url.value = props.inputValue;
    if (url.value.includes('\\')) {
        //? Backwards support if files contains backslashes (not possible anymore)
        // TODO: Remove this in the future
        emit('input', url.value.replaceAll('\\', '/'));
    }
});

watch(
    () => props.inputValue,
    () => {
        url.value = props.inputValue;
    },
);

let savedState = '';
</script>

<template>
    <div v-show="url" class="show-input">
        <div class="input-file">
            <input ref="fileInput" class="file" type="file" :accept="accept" @change="changeImage" />
            <input class="input" type="text" readonly :value="url" @click="openFile" />
            <i class="icon-supprimer" @click="deleteFile"></i>
        </div>
        <div v-if="url" class="preview">
            <img v-if="filetype === 'img'" :src="'assets://' + url" :alt="label" />
            <video v-if="filetype === 'video'" :src="'assets://' + url" controls></video>
            <audio v-if="filetype === 'audio'" :src="'assets://' + url" controls></audio>
        </div>
    </div>
    <div v-if="!url">
        <button :id="id" class="btn btn-form" @click="openFile">
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
    img,
    video,
    audio {
        width: 100%;
        height: auto;
        min-height: 50px;
        max-width: 100%;
        margin-bottom: 1.5rem;
        border-radius: 4px;
    }
}

i {
    font-size: 0.9rem;
    cursor: pointer;
}

button {
    margin-bottom: 1.5rem;
}

.show-input {
    display: flex;
    flex-direction: column;
}

.input-file {
    position: relative;
    margin-bottom: 1.5rem;

    .input {
        margin-bottom: 0;
        padding-right: 1.5rem;
        width: 100%;
    }

    .file {
        display: none;
    }
}

.icon-supprimer {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
        color: var(--editor-red);
    }
}
</style>
