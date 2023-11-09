<script setup lang="ts">
import TopActionButton from '@/src/features/topBar/TopActionButton.vue';
import TopActionDropdown from '@/src/features/topBar/TopActionDropdown.vue';
import HamburgerMenu from '@/src/features/topBar/HamburgerMenu.vue';
import { editorService } from '@/src/shared/services';

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

</script>

<template>
    <div class="top-bar-actions">
        <TopActionDropdown
            icon="icon-chevron"
            :text="zoomString"
            position="left"
            :input-value="zoom"
            @change="emit('updateZoom', $event)"
        />

        <div class="menu-md-container top-bar-actions">
            <hr class="vertical-separator">
            <TopActionButton icon="icon-arriere" :disabled="undoDisabled" @click="emit('undo')" />
            <TopActionButton icon="icon-avant" :disabled="redoDisabled" @click="emit('redo')" />
            <hr class="vertical-separator">
            <TopActionButton
                icon="icon-save"
                text="Sauvegarder"
                position="right"
                :disabled="saving"
                @click="emit('save')"
            />
            <TopActionButton
                icon="icon-play"
                text="Aperçu"
                position="right"
                :disabled="loadingPreview"
                @click="emit('runPreview')"
            />
            <TopActionButton
                icon="icon-export"
                text="Exporter archive"
                position="right"
                :disabled="exporting"
                @click="emit('exportProject')"
            />
        </div>

        <div class="menu-xs-container top-bar-actions">
            <HamburgerMenu
                :undo-disabled="undoDisabled"
                :redo-disabled="redoDisabled"
                :saving="saving"
                :loading-preview="loadingPreview"
                :exporting="exporting"
                :zoom-string="zoomString"
                :zoom="zoom"
                @undo="emit('undo')"
                @redo="emit('redo')"
                @save="emit('save')"
                @run-preview="emit('runPreview')"
                @export-project="emit('exportProject')"
                @update-zoom="emit('updateZoom', $event)"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/src/mixins';

.top-bar-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
    min-width: fit-content;
}

.menu-md-container {
    @include mixins.sm {
        display: none;
    }
}

.menu-xs-container {
    @include mixins.md {
        display: none;
    }
}
</style>