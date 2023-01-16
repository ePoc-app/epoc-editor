<script setup lang="ts">
// The beta use the ModelMenuV0 component
//@ts-nocheck
import ScreenNode from './ScreenNode.vue';
import { useEpocStore } from '../../../shared/stores';
import { ref } from 'vue';

const epocStore = useEpocStore();

const emit = defineEmits<{
    (e: 'dragStart', { event , sideAction }): void;
}>();

const rightCol = ref([]);
const leftCol = ref([]);

epocStore.getSelectedScreens.forEach((screen, index) => {
    index % 2 === 0 ? leftCol.value.push(screen) : rightCol.value.push(screen); 
});

function dragStart(event, screen) {
    emit('dragStart',{ event: event, sideAction: screen.actions});
}

function switchSelection() {
    epocStore.screensModel.personnalSelected = !epocStore.screensModel.personnalSelected;
    rightCol.value = [];
    leftCol.value = [];
    epocStore.getSelectedScreens.forEach((screen, index) => {
        index % 2 === 0 ? leftCol.value.push(screen) : rightCol.value.push(screen); 
    });
}
</script>

<template>
    <div class="model-menu" @click.stop>
        <div class="top">
            <h3>Modèles d'écrans</h3>
        </div>
        <div class="tab">
            <button :class="{'tab-button-active': !epocStore.screensModel.personnalSelected}" class="tab-button tab-button-left" @click="switchSelection">Standard</button>
            <button :class="{'tab-button-active': epocStore.screensModel.personnalSelected}" class="tab-button tab-button-right" @click="switchSelection">Personnel</button>
        </div>
        <div class="screens">
            <div class="col-left">
                <ScreenNode 
                    v-for="(screen, index) of leftCol"
                    :key="index"
                    :title="'Titre écran'"
                    :side-actions="screen.actions"
                    @drag-start="dragStart($event, screen)"
                />
            </div>
            <div class="col-right">
                <ScreenNode 
                    v-for="(screen, index) of rightCol"
                    :key="index"
                    :title="'Titre écran'"
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

    top: 0;
    left: 100px;
    height: 100%;
    position: fixed;

    width: fit-content;
    background-color: white;
    border-right: 1px solid var(--border);
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

    .tab {
        background-color: var(--item-background);
        padding: 1rem 1.6rem;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);

        &-button {
            background-color: var(--background);
            border: none;
            color: var(--text);
            padding: .5rem 1.5rem;
            cursor: pointer;
            
            &-left {
                border-radius: 8px 0 0 8px;
            }

            &-right {
                border-radius: 0 8px 8px 0;
            }

            &-active {
                background-color: var(--editor-grayblue);
                color: white;
            }
        }
    }

    .top {
        margin: 1.5rem;
    }
}
</style>