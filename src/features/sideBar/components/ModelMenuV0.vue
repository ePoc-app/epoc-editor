<script setup lang="ts">
import ScreenNode from './ScreenNode.vue';
import { useEditorStore } from '../../../shared/stores';
import { Ref, ref } from 'vue';
import { Screen } from '../../../shared/interfaces';

const editorStore = useEditorStore();

const emit = defineEmits<{
    (e: 'dragStart', { event , sideAction }): void;
}>();

const rightCol: Ref<Screen[]> = ref([]);
const leftCol: Ref<Screen[]> = ref([]);

editorStore.getSelectedScreens.forEach((screen: Screen, index) => {
    index % 2 === 0 ? leftCol.value.push(screen) : rightCol.value.push(screen); 
});

function dragStart(event, screen) {
    emit('dragStart',{ event: event, sideAction: screen.actions});
}

</script>

<template>
    <div class="model-menu" @click.stop>
        <div class="top">
            <h3>Modèles d'écrans</h3>
        </div>
        <div class="screens">
            <div class="col-left">
                <ScreenNode 
                    v-for="(screen, index) of leftCol"
                    :key="index"
                    :title="screen.title"
                    :side-actions="screen.actions"
                    @drag-start="dragStart($event, screen)"
                />
            </div>
            <div class="col-right">
                <ScreenNode 
                    v-for="(screen, index) of rightCol"
                    :key="index"
                    :title="screen.title"
                    :side-actions="screen.actions"
                    @drag-start="dragStart($event, screen)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.model-menu {
    
    z-index: 100;

    top: 80px;
    height: calc(100% - 80px);
    position: absolute;

    width: fit-content;
    background-color: white;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    .screens {
        margin: 1.5rem;
        display: flex;
        flex-direction: row;
        
        .col {
            flex-direction: column;

            &-left {
                margin-right: 1.5rem;
            }
        }
    }

    .top {
        margin: 1.5rem;
    }
}
</style>