<script setup lang="ts">
import SideMenu from '@/src/components/SideMenu.vue';
import { ref, watch } from 'vue';
import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import AssetItem from './AssetItem.vue';
import { useVModel } from '@vueuse/core';
import { useEditorStore } from '@/src/shared/stores';

declare const api: ApiInterface;

function getAssets() {
    api.send('getAssets');
}

getAssets();

const assets = ref();
api.receive('assets', (data: any) => {
    assets.value = JSON.parse(data).assets;
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

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            getAssets();
            editorStore.closeFormPanel();
        }
    },
);
</script>

<template>
    <SideMenu v-model:open="isOpen" title="Assets">
        <div class="menu">
            <button class="btn btn-form refresh" @click="getAssets"><i class="icon-refresh-cw" />Refresh</button>
            <div v-if="assets?.length" class="assets">
                <AssetItem v-for="asset in assets" :key="asset.filename" :asset="asset" @delete="deleteItem(asset)" />
            </div>
            <p v-else>No asset found</p>
        </div>
    </SideMenu>
</template>

<style scoped lang="scss">
.assets {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.menu {
    display: flex;
    flex-direction: column;
    max-width: 50rem;

    .refresh {
        align-self: end;
    }
}
</style>
