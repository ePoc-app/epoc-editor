<script setup lang="ts">
import { useEditorStore } from '../../shared/stores';
import FormButton from './components/FormButton.vue';
import GenericField from './components/GenericField.vue';
import CardGroup from './components/inputs/card/CardGroup.vue';

const editorStore = useEditorStore();

function actionOnForm(action: string) {
    switch (action) {
    case 'delete':
        editorStore.deleteCurrentElement();
        break;
    }
}

function addCard(type: string, index: number) {
    editorStore.addInput(type, index);
}

</script>

<template>
    <div class="panel">
        <button class="btn btn-close" @click="editorStore.closeFormPanel"><i class="icon-x"></i></button>
        <div class="title">
            <div class="form-icon"><i :class="editorStore.formPanel.form.icon"></i></div>
            <h1>{{ editorStore.formPanel.form.name }}</h1>
        </div>
        <div class="buttons">
            <FormButton
                v-for="button in editorStore.formPanel.form.buttons"
                :key="button.label"
                :label="button.label"
                :icon="button.icon"
                @click="actionOnForm(button.action)"
            />
        </div>
        <div
            v-for="(field, index) of editorStore.formPanel.form.fields"
            :key="index"
            class="field"
        >
            <CardGroup
                v-if="field.type === 'cardGroup'"
                :inputs="field.inputs"
                :field-name="field.name"
                :field-index="field.index"
                :type="field.inputType"
                @add-card="addCard(field.inputType, index)"
            />
            <GenericField 
                v-else
                :inputs="field.inputs"
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