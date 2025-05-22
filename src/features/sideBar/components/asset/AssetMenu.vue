<script setup lang="ts">
import SideMenu from '@/src/components/SideMenu.vue';
import { ref } from 'vue';
import { useSideBarStore } from '../../stores/sideBarStore';
import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import AssetItem from './AssetItem.vue';

const sidebarStore = useSideBarStore();

declare const api: ApiInterface;

function getAssets() {
    api.send('getAssets');
}

getAssets();

const assets = ref();
api.receive('assets', (data: any) => {
    assets.value = JSON.parse(data).assets;
});
</script>

<template>
    <SideMenu title="Assets" @close-menu="sidebarStore.assetMenu = false">
        <div class="menu">
            <button class="btn btn-form refresh" @click="getAssets"><i class="icon-refresh-cw" />Refresh</button>
            <div class="assets">
                <AssetItem v-for="asset in assets" :key="asset.filename" :asset="asset" />
            </div>
        </div>
    </SideMenu>
</template>

<style scoped lang="scss">
.assets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.menu {
    display: flex;
    flex-direction: column;

    .refresh {
        align-self: end;
    }
}
</style>
