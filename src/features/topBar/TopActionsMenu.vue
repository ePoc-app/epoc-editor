<script setup lang="ts">
import TopActionButton from '@/src/features/topBar/TopActionButton.vue';
import HamburgerMenu from '@/src/features/topBar/HamburgerMenu.vue';
import SettingsModal from '../settings/SettingsModal.vue';
import { useEditorStore } from '@/src/shared/stores';
import { computed, ref } from 'vue';

const editorStore = useEditorStore();

defineProps<{
    undoDisabled: boolean;
    redoDisabled: boolean;
    saving: boolean;
    loadingPreview: boolean;
    exporting: boolean;
}>();

const emit = defineEmits<{
    (e: 'undo'): void;
    (e: 'redo'): void;
    (e: 'save'): void;
    (e: 'runPreview'): void;
    (e: 'exportProject'): void;
}>();

// detect the platform
const modifier = computed(() => (editorStore.platform === 'darwin' ? '⌘' : 'Ctrl'));

const settingsModal = ref(null);
</script>

<template>
    <div class="top-bar-actions">
        <div class="menu-md-container top-bar-actions">
            <TopActionButton
                v-tippy="{
                    content: `${modifier} + z`,
                    placement: 'bottom',
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                icon="icon-arriere"
                :disabled="undoDisabled"
                @click="emit('undo')"
            />
            <TopActionButton
                v-tippy="{
                    content: `${modifier} + ${editorStore.platform === 'darwin' ? '⇧ + z' : 'y'}`,
                    placement: 'bottom',
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                icon="icon-avant"
                :disabled="redoDisabled"
                @click="emit('redo')"
            />

            <hr class="vertical-separator" />

            <TopActionButton
                v-tippy="{
                    content: `${modifier} + s`,
                    placement: 'bottom',
                    arrow: true,
                    arrowType: 'round',
                    animation: 'fade',
                }"
                icon="icon-save"
                :text="$t('global.save')"
                position="right"
                :disabled="saving"
                @click="emit('save')"
            />
            <TopActionButton
                icon="icon-play"
                :text="$t('header.preview')"
                position="right"
                :disabled="loadingPreview"
                @click="emit('runPreview')"
            />
            <TopActionButton
                icon="icon-export"
                :text="$t('header.publish')"
                position="right"
                :disabled="exporting"
                @click="emit('exportProject')"
            />

            <SettingsModal ref="settingsModal">
                <template #trigger>
                    <TopActionButton
                        icon="icon-settings"
                        :text="$t('settings.title')"
                        position="right"
                        @click="settingsModal.open"
                    />
                </template>
            </SettingsModal>
        </div>

        <div class="menu-xs-container top-bar-actions">
            <HamburgerMenu
                :undo-disabled="undoDisabled"
                :redo-disabled="redoDisabled"
                :saving="saving"
                :loading-preview="loadingPreview"
                :exporting="exporting"
                @undo="emit('undo')"
                @redo="emit('redo')"
                @save="emit('save')"
                @run-preview="emit('runPreview')"
                @export-project="emit('exportProject')"
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
