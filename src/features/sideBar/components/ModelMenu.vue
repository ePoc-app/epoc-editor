<script setup lang="ts">
import PageTemplate from './PageTemplate.vue';
import { useEditorStore } from '@/src/shared/stores';
import SideMenu from '@/src/components/SideMenu.vue';

const editorStore = useEditorStore();
</script>

<template>
    <SideMenu title="Modèles de page" @close="editorStore.modelMenu = false">
        <div v-if="editorStore.pageModels.length > 0" class="models">
            <PageTemplate
                v-for="(model, index) in editorStore.pageModels"
                :key="index"
                :elements="model.actions"
                :name="model.name"
            />
        </div>
        <div v-else>
            <h4 class="empty">Aucun modèle de page n'as été créé</h4>
        </div>
    </SideMenu>
</template>

<style scoped lang="scss">
.models {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin: 0;
}

.empty {
    width: calc(6rem + 120px);
    text-align: center;
    padding: 1rem;
    h4 {
        margin: 1rem;
    }
}
</style>
