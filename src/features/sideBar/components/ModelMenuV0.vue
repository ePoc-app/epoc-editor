<script setup lang="ts">
import ScreenNode from './ScreenNode.vue';
import { useEditorStore } from '../../../shared/stores';
import { Ref, ref } from 'vue';
import { Screen, SideAction } from '../../../shared/interfaces';
import SideActionButtonV0 from './SideActionButtonV0.vue';

const editorStore = useEditorStore();

const emit = defineEmits<{
    (e: 'dragStart', { event , sideAction }): void;
    (e: 'dragStartQuestion', { event, sideAction }): void;
}>();

const rightCol: Ref<Screen[]> = ref([]);
const leftCol: Ref<Screen[]> = ref([]);

editorStore.getSelectedScreens.forEach((screen: Screen, index) => {
    index % 2 === 0 ? leftCol.value.push(screen) : rightCol.value.push(screen); 
});

const questionsRight: Ref<SideAction[]> = ref([]);
const questionsLeft: Ref<SideAction[]> = ref([]);

editorStore.questions.forEach((sideAction: SideAction, index) => {
    index % 2 === 0 ? questionsLeft.value.push(sideAction) : questionsRight.value.push(sideAction); 
});

function dragStart(event, screen) {
    emit('dragStart',{ event: event, sideAction: screen.actions});
}

const displayScreen = ref(false);

</script>

<template>
    <div class="model-menu" @click.stop>
        <div class="top">
            <h3>Modèles d'écrans</h3>
        </div>
        <div class="tab">
            <button :class="{'tab-button-active': displayScreen }" class="tab-button tab-button-left" @click="displayScreen = true">Contenu</button>
            <button :class="{'tab-button-active': !displayScreen }" class="tab-button tab-button-right" @click="displayScreen = false">Questions</button>
        </div>
        <div v-if="displayScreen" class="screens">
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
        <div v-else class="questions">
            <div class="col-left">
                <SideActionButtonV0
                    v-for="question in questionsLeft"
                    :key="question.type"
                    :side-action="question"
                />
            </div>
            <div class="col-right">
                <SideActionButtonV0
                    v-for="question in questionsRight"
                    :key="question.type"
                    :side-action="question"
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

    .questions {
        margin: 1.5rem 2.61rem;
        display: flex;
        flex-direction: row;
        .col {
            flex-direction: column;
            &-left {
                margin-right: 3.5rem;
            }
        }
    }

    .top {
        margin: 1.5rem;
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
}
</style>