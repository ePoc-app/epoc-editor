<script setup lang="ts">
import ResizablePanel from '@/src/components/ResizablePanel.vue';
import { ref, watch } from 'vue';
import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import AssetItem from './AssetItem.vue';
import { useVModel } from '@vueuse/core';
import { useEditorStore } from '@/src/shared/stores';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

declare const api: ApiInterface;

const loading = ref(false);

function getAssets() {
    loading.value = true;
    api.send('getAssets');
}

getAssets();

const assets = ref();

api.receive('assets', (data: any) => {
    assets.value = JSON.parse(data).assets;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
});

api.receive('assetRemoved', (success: boolean) => {
    console.log('success', success);
    getAssets();
});

function deleteItem(asset: { filename: string; linkedPages: string[] }) {
    api.send('removeAsset', asset.filename);
}

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean);
}>();

const isOpen = useVModel(props, 'open', emit);
const editorStore = useEditorStore();

const assetPanelWidth = ref(400);

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            getAssets();
            editorStore.closeFormPanel();
        }
    },
);

function handleResizeEnd(width: number) {
    assetPanelWidth.value = width;
}

function closePanel() {
    isOpen.value = false;
}
</script>

<template>
    <ResizablePanel
        v-if="isOpen"
        :initial-width="assetPanelWidth"
        position="left"
        min-width="21rem"
        max-width="60rem"
        @resize-end="handleResizeEnd"
        @close="closePanel"
    >
        <template #title>
            <h3>Assets</h3>
        </template>

        <div class="panel-content">
            <button class="btn btn-form refresh" @click="getAssets">
                <i :class="[loading ? 'loading' : '', 'icon-refresh-cw']" />
                {{ t('global.refresh') }}
            </button>

            <div v-if="assets?.length" class="assets">
                <AssetItem v-for="asset in assets" :key="asset.filename" :asset="asset" @delete="deleteItem(asset)" />
            </div>
            <p v-else class="no-assets">{{ t('assets.empty') }}</p>
        </div>
    </ResizablePanel>
</template>

<style scoped lang="scss">
.asset-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
}

i.loading {
    animation: spin 1s infinite;
}

.panel-content {
    flex: 1;
    overflow-y: auto;

    .refresh {
        margin-bottom: 1rem;
        align-self: flex-end;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .assets {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .no-assets {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
        margin-top: 2rem;
    }
}
</style>
