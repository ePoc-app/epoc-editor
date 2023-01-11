<script setup lang="ts">
import { useEditorStore } from '../../shared/stores';
import GenericInput from './inputs/GenericInput.vue';

const editorStore = useEditorStore();

function close() {
    editorStore.formPanel.isOpen = false;
    console.log('form', editorStore.formPanel.form);
}

</script>

<template>
    <div class="panel">
        <button class="btn btn-close" @click="close"><i class="icon-x"></i></button>
        <div class="title">
            <div class="form-icon"><i :class="editorStore.formPanel.form.icon"></i></div>
            <h1>{{ editorStore.formPanel.form.name }}</h1>
        </div>
        <!-- didn't find a solution using v-model -->
        <GenericInput 
            v-for="(input, index) of editorStore.formPanel.form.inputs"
            :key="index"
            :type="input.type"
            :label="input.label"
            :placeholder="input.placeholder"
            :accept="input.accept"
            :input-value="input.value"
            @input="input.value = $event"
        />
    </div>
</template>

<style scoped lang="scss">
.panel {
    position: absolute;
    top: 80px;
    right: 0;
    height: 100%;
    background-color: white;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
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
</style>