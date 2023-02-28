<script setup lang="ts">
import { useEditorStore } from '../../shared/stores';
import FormButton from './components/FormButton.vue';
import GenericField from './components/GenericField.vue';
import CardGroup from './components/inputs/card/CardGroup.vue';
import { Input } from '@/src/shared/interfaces';
import { Card } from '@/src/shared/interfaces/card.interface';

const editorStore = useEditorStore();

function actionOnForm(action: string) {
    switch (action) {
    case 'delete':
        editorStore.deleteElement(editorStore.openedNodeId);
        break;
    }
}

function addCard(type: string, index: number): void {
    editorStore.addCard(type, index);
}

function deleteCard(cardIndex: number, fieldIndex: number, type: string): void {
    if(type === 'component') {
        const parentNodeId = editorStore.openedParentId ? editorStore.openedParentId : editorStore.openedNodeId;
        editorStore.removeElementFromScreen(cardIndex, parentNodeId);
    } else {
        editorStore.formPanel.fields[fieldIndex].inputs.splice(cardIndex ,1);
    }
}

function moveUpCard(cardIndex, fieldIndex, type: string) {
    const inputs = editorStore.formPanel.fields[fieldIndex].inputs;
    let temp = inputs[cardIndex];
    inputs[cardIndex] = inputs[cardIndex-1];
    inputs[cardIndex-1] = temp;

    if(type === 'component') {
        editorStore.changeElementOrder(cardIndex, cardIndex-1, editorStore.openedNodeId);
    }
}

function moveDownCard(cardIndex, fieldIndex, type: string) {
    const inputs = editorStore.formPanel.fields[fieldIndex].inputs;
    let temp = inputs[cardIndex];
    inputs[cardIndex] = inputs[cardIndex+1];
    inputs[cardIndex+1] = temp;

    if(type === 'component') {
        editorStore.changeElementOrder(cardIndex, cardIndex+1, editorStore.openedNodeId);
    }
}

function changeCards(event, fieldIndex, type: string) {
    const oldIndex = event.moved.oldIndex;
    const newIndex = event.moved.newIndex;
    const inputs = editorStore.formPanel.fields[fieldIndex].inputs;

    const tmp = inputs[oldIndex];
    inputs.splice(oldIndex, 1);
    inputs.splice(newIndex, 0, tmp);

    if(type === 'component') {
        editorStore.changeElementOrder(oldIndex, newIndex, editorStore.openedNodeId);
    }
}

</script>

<template>
    <div class="panel">
        <button class="btn btn-close" @click="editorStore.closeFormPanel"><i class="icon-x"></i></button>
        <div class="title">
            <div class="form-icon"><i :class="editorStore.formPanel.icon"></i></div>
            <h1>{{ editorStore.formPanel.name }}</h1>
        </div>
        <div class="buttons">
            <FormButton
                v-for="button in editorStore.formPanel.buttons"
                :key="button.label"
                :label="button.label"
                :icon="button.icon"
                @click="actionOnForm(button.action)"
            />
        </div>
        <div
            v-for="(field, index) of editorStore.formPanel.fields"
            :key="index"
            class="field"
        >
            <CardGroup
                v-if="field.type === 'cardGroup'"
                :cards="(field.inputs as Card[])"
                :field-name="field.name"
                :field-index="field.index"
                :type="field.inputType"
                @add-card="addCard(field.inputType, index)"
                @delete-card="deleteCard($event, index, field.inputType)"
                @move-up-card="moveUpCard($event, index, field.inputType)"
                @move-down-card="moveDownCard($event, index, field.inputType)"
                @change-cards="changeCards($event, index, field.inputType)"
            />
            <GenericField 
                v-else
                :inputs="(field.inputs as Input[])"
                :field-name="field.name"
                :field-index="field.index"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.panel {
    position: absolute;
    top: 80px;
    right: 0;
    height: calc(100% - 80px);
    width: 26rem;
    background-color: white;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.title {
    display: flex;
    flex-direction: row;
    margin-top: 2.5rem;
    margin-bottom: 2rem;
    h1 {
        margin: 0;
        margin-left: 1rem;
    }
    .form-icon {
        transform: translate(0, 0.2rem);
    }
}

.buttons {
    margin-bottom: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    max-width: 24rem;
}
</style>