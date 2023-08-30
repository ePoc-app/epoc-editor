<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import { getConditions, saveBadge } from '@/src/shared/services';
import { computed } from 'vue';
import { saveState } from '@/src/shared/services/undoRedo.service';

import ConditionItem from './ConditionItem.vue';

const editorStore = useEditorStore();

const currentBadge = editorStore.getEpocNode.data.formValues['badges'][editorStore.openedBadgeId];

const allConditionsValid = computed(() => {
    return editorStore.tempConditions.every((condition) => {
        return condition.element && condition.verb && condition.value;
    });
});

if(!editorStore.editingConditions) {
    editorStore.tempConditions = getConditions(currentBadge);
    editorStore.editingConditions = true;
}


function addCondition() {
    editorStore.tempConditions.push({});
}

function close() {
    editorStore.tempConditions = [];
    editorStore.conditionModal = false;
    editorStore.editingConditions = false;
}

function updateCondition(values: { value: string, key: string }, index: number) {
    const { value, key } = values;
    editorStore.tempConditions[index][key] = value;
}

function save() {
    saveState(true);
    saveBadge(currentBadge);
    close();
}

</script>

<template>
    <div class="modal-backdrop" />
    <article class="condition-modal">
        <header>
            <div class="content">
                <h2>Conditions d'obtention du badge</h2>
                <button class="btn btn-close" @click="close"><i class="icon-x"></i></button>
            </div>
        </header>
        <div class="content conditions">
            <ConditionItem
                v-for="(condition, index) in editorStore.tempConditions"
                :key="index" 
                :input-value="condition"
                :condition-index="index"
                @remove-condition="editorStore.tempConditions.splice(index, 1)"
                @update-condition="updateCondition($event, index)"
            />
            <button class="add btn btn-form" @click="addCondition">
                <i class="icon-plus"></i>
                Ajouter une condition
            </button>
        </div>
        
        <footer>
            <div class="content">
                <button class="btn-choice cancel" @click="close">ANNULER</button>
                <button :disabled="!allConditionsValid" class="btn-choice save" @click="save">ENREGISTRER</button>
            </div> 
        </footer>
    </article>
</template>

<style scoped lang="scss">
header {
    border-bottom: 1px solid var(--border);
    h2 {
        margin: 0;
    }
}

footer {
    border-top: 1px solid var(--border);
    
    .content {
        display: flex;
        gap: 1.5rem;
    }
}

.conditions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.add {
    display: flex;
    gap: .5rem;
    i {
        font-size: .9rem;
        margin: auto;
    }
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, .2);
    z-index: 150;
}

.content {
    padding: 1rem;
}

h3 {
    margin: 0;
}
.conditions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.condition-modal {
    user-select: none;
    position: fixed;
    margin: auto;
    justify-self: center;
    top: 10%;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    gap: 1rem;
    width: 45rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    max-height: 85%;
    z-index: 200;
}

.btn-choice {
    cursor: pointer;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 500;
    padding: 1rem 2rem;

    &:hover {
        filter: brightness(95%);
    }
    &.cancel {
        background-color: #fff;
        color: var(--inria-grey);
        border: 1px solid var(--inria-grey);
    }
    &.save{
        background-color: #E93100;
        color: #fff;
        
        &:disabled {
            cursor: not-allowed;
            filter:opacity(40%);
        }
    }
    
}
</style>