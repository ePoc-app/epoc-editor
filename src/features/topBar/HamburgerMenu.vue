<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';

const editorStore = useEditorStore();

defineProps<{
    undoDisabled: boolean;
    redoDisabled: boolean;
    saving: boolean;
    loadingPreview: boolean;
    exporting: boolean;
    zoomString: string;
    zoom: number;
}>();

const emit = defineEmits<{
    (e: 'undo'): void;
    (e: 'redo'): void;
    (e: 'save'): void;
    (e: 'runPreview'): void;
    (e: 'exportProject'): void;
    (e: 'updateZoom', value: number): void;
}>();

function toggleMenu() {
    editorStore.hamburgerMenu = !editorStore.hamburgerMenu;
}

const modifier = editorStore.platform === 'darwin' ? '⌘' : 'Ctrl';
</script>

<template>
    <button
        class="btn btn-top-bar btn-squared"
        :class="{ active: editorStore.hamburgerMenu }"
        @mousdown.stop
        @mouseup.stop
        @click.stop="toggleMenu"
    >
        <i class="icon-menu"></i>
    </button>

    <div v-if="editorStore.hamburgerMenu" class="select-menu" @click.stop @mouseup.stop @mousedown.stop>
        <button
            v-tippy="{
                content: `${modifier} + z`,
                placement: 'left',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            class="menu-item"
            :disabled="undoDisabled"
            @click="emit('undo')"
        >
            <i class="icon-arriere"></i>
            <span>Undo</span>
        </button>
        <button
            v-tippy="{
                content: `${modifier} + ${editorStore.platform === 'darwin' ? '⇧ + z' : 'y' }`,
                placement: 'left',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            class="menu-item"
            :disabled="redoDisabled"
            @click="emit('redo')"
        >
            <i class="icon-avant"></i>
            <span>Redo</span>
        </button>
        <button
            v-tippy="{
                content: `${modifier} + s`,
                placement: 'left',
                arrow: true,
                arrowType: 'round',
                animation: 'fade',
            }"
            class="menu-item"
            :disabled="saving"
            @click="emit('save')"
        >
            <i class="icon-save"></i>
            <span>Sauvegarder</span>
        </button>
        <button class="menu-item" :disabled="loadingPreview" @click="emit('runPreview')">
            <i class="icon-play"></i>
            <span>Aperçu</span>
        </button>
        <button class="menu-item" :disabled="exporting" @click="emit('exportProject')">
            <i class="icon-export"></i>
            <span>Publier</span>
        </button>
    </div>
</template>

<style scoped lang="scss">
.btn-squared {
    padding: 0.7rem;

    &.active {
        background-color: var(--content);
    }

    i {
        font-size: 1.5rem;
    }
}

.select-menu {
    z-index: 100;
    position: fixed;
    top: calc(80px + 0.3rem);
    right: 0.3rem;
    background-color: var(--content);
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 8px var(--shadow);

    .menu-item {
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        gap: 0.5rem;
        align-items: center;

        border: none;
        background: none;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text);

        &:disabled {
            opacity: 0.5;
        }

        &:hover:not(:disabled) {
            background: var(--button-blue);
            cursor: pointer;
        }
        select {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    }
}
</style>
