<script setup lang="ts">
import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'click', icon: string): void;
}>();

function onClick() {
    if(!url.value) return;
    emit('click', url.value);
}

function openFile() {
    fileInput.value.click();
}

async function changeIcon(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    if (!file) return;
    fileInput.value.value = '';
    url.value = file.path;
    blob.value = URL.createObjectURL(file);
}
function deleteFile() {
    url.value = '';
}

const url = ref('');
const blob = ref('');
const fileInput = ref(null);

</script>

<template>
    <div class="new-icon">
        <BadgeItem
            :icon="blob"
            :inactive="!url"
            @click="onClick"
        />
        <div>
            <p class="accepted-files">Fichier supporté: SVG</p>
            <div v-if="!url">
                <button id="file-selector" class="btn btn-form" @click="openFile">
                    <i class="icon-plus"></i>
                    Sélectionner un fichier
                </button>
            </div>
            <div v-show="url">
                <div class="input-file">
                    <input ref="fileInput" class="file" type="file" accept="image/svg+xml" @change="changeIcon">
                    <input class="input" type="text" readonly :value="url" @click="openFile">
                    <i class="icon-supprimer" @click="deleteFile"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.new-icon {
    display: flex;
    gap: 1rem;
    padding-top: 1.5rem;
}

.accepted-files {
    font-size: .9rem;
    color: var(--text-secondary);
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

    i {
        font-size: .9rem;
        cursor: pointer;

        &:hover {
            color: var(--editor-red);
        }
    }
}

.icon-supprimer{
    position: absolute;
    right:.5rem;
    top:50%;
    transform: translateY(-50%);
}
</style>