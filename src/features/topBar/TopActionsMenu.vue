<script setup lang="ts">
import TopActionButton from '@/src/features/topBar/TopActionButton.vue';
import HamburgerMenu from '@/src/features/topBar/HamburgerMenu.vue';
import SettingsModal from '../settings/SettingsModal.vue';
import { useEditorStore } from '@/src/shared/stores';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

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
    (e: 'exportSite', type: 'html' | 'scorm'): void;
}>();

// detect the platform
const modifier = computed(() => (editorStore.platform === 'darwin' ? '⌘' : 'Ctrl'));

const settingsModal = ref(null);

const publishMenu = ref<HTMLElement | null>(null);
const publishOpen = ref(false);

function togglePublish() {
    publishOpen.value = !publishOpen.value;
}

function exportSite(type: 'html' | 'scorm') {
    publishOpen.value = false;
    emit('exportSite', type);
}

function closeOnOutsideClick(e: MouseEvent) {
    if (publishMenu.value && !publishMenu.value.contains(e.target as Node)) publishOpen.value = false;
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick));
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
            <div ref="publishMenu" class="publish-split">
                <TopActionButton
                    class="publish-main"
                    icon="icon-export"
                    :text="$t('header.publish')"
                    position="right"
                    :disabled="exporting"
                    @click="emit('exportProject')"
                />
                <button
                    class="btn btn-top-bar publish-toggle"
                    :class="{ active: publishOpen }"
                    :disabled="exporting"
                    @click.stop="togglePublish"
                >
                    <i class="icon-chevron-down" />
                </button>
                <div v-if="publishOpen" class="publish-dropdown" @click.stop>
                    <button class="dropdown-item" @click="exportSite('html')">
                        <i class="icon-code" />
                        <span>{{ $t('header.exportHtml') }}</span>
                    </button>
                    <button class="dropdown-item" @click="exportSite('scorm')">
                        <i class="icon-export" />
                        <span>{{ $t('header.exportScorm') }}</span>
                    </button>
                </div>
            </div>

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
                @export-site="emit('exportSite', $event)"
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

.publish-split {
    position: relative;
    display: flex;
    align-items: stretch;

    .publish-main {
        margin-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .publish-toggle {
        margin-left: -1px;
        padding: 0 0.7rem;
        background-color: var(--button-blue);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        &.active {
            background-color: var(--content);
        }

        &:disabled {
            pointer-events: none;
        }
    }

    .publish-dropdown {
        z-index: 100;
        position: absolute;
        top: calc(100% + 4px);
        right: 1rem; // toggle button margin
        white-space: nowrap;
        background-color: var(--content);
        padding: 0.35rem;
        border: 1px solid var(--border);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 8px var(--shadow);

        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            border: none;
            border-radius: 6px;
            background: none;
            text-align: left;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text);

            i {
                font-size: 1rem;
            }

            &:hover {
                background: var(--button-blue);
                cursor: pointer;
            }
        }
    }
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
