<script setup lang='ts'>
import { useEditorStore } from '@/src/shared/stores';
import GenericInput from './GenericInput.vue';
import AddCard from './card/AddCard.vue';
import { Input, SideAction } from '@/src/shared/interfaces';
import { ref } from 'vue';
import { generateContentId } from '@/src/shared/services/graph.service';

const props = defineProps<{
    inputs: Input[];
    label: string;
    inputValues: string[];
    fieldIndex: number;
    addButton: boolean;
}>();

const emit = defineEmits<{
    (e: 'change', value: object | string): void;
    (e: 'add-undo-action', value: { 
        type: string, 
        id: string,
        index: number,
        value: { oldValue: string | boolean, newValue: string | boolean }
    })
}>();

const editorStore = useEditorStore();

const currentNode = editorStore.getCurrentGraphNode;
const disabled = currentNode.data.type === 'template';

const drag = ref(false);

const dragOptions = {
    animation: 200,
    group: 'cards',
    disabled: false,
    ghostClass: 'card-ghost',
};

const isLast = (index) => props.inputValues.length - 1 === index;

function onInput(value, id: string, index: number) {
    emit('change', {
        type: 'change',
        value,
        id,
        index
    });
}

function addCard() {
    const defaultValues = props.inputs.length === 1 
        ? props.inputs[0].value 
        : props.inputs.reduce((defaultValues, input) => {
            defaultValues[input.id] = input.type === 'hidden'
                ? generateContentId()
                : input.value;
            return defaultValues;
        }, {});
    
    emit('change', { type: 'add', defaultValues });
}

function removeCard(index: number) {
    emit('change', {
        type: 'remove',
        index
    });
}


function moveCard(event, oldIndex?: number, newIndex?: number) {

    if(!oldIndex && !newIndex) {
        if(!event.moved) return;

        oldIndex = event.moved.oldIndex;
        newIndex = event.moved.newIndex;
    }

    emit('change', {
        type: 'move',
        oldIndex,
        newIndex
    });
}

function onCheck(value, id: string, index: number) {
    emit('change', {
        type: 'change',
        value,
        id,
        index
    });
    
    emit('add-undo-action', {
        type: 'change',
        value: {
            oldValue: !value,
            newValue: value
        },
        id,
        index
    });
}

function onClick(index: number, action: SideAction | null) {
    const element = currentNode.data.elements?.[index];

    if(element && action) {
        const { id, formType, formValues, parentId } = element;
        editorStore.openFormPanel(id, formType, formValues, parentId);
    }
}

function onAddUndoAction(value: { oldValue: string | boolean, newValue: string | boolean }, id: string, index: number) {
    emit('add-undo-action', {
        type: 'change',
        value,
        id,
        index
    });
}

function start() {
    drag.value = true;
    editorStore.draggedElement = null;
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed');
}

function end() {
    drag.value = false;
    document.body.classList.remove('cursor-not-allowed', 'cursor-allowed', 'cursor-move');
}

function dragOver(event: DragEvent) {
    if(editorStore.draggedElement) return;
    event.preventDefault();
    document.body.classList.add('cursor-move');
}

</script>

<template>
    <VueDraggable
        key="draggable"
        v-bind="dragOptions"
        :model-value="inputValues"
        item-key="index"
        handle=".card-header"
        filter=".fixed"
        :disabled="disabled"
        @change="moveCard"
        @start="start"
        @dragover="dragOver"
        @end="end"
    >
        <template #item="{ element, index }">
            <div :key="index" class="card draggable-card">
                <div 
                    class="card-header" 
                    :class="{ 'border-bottom': inputs.length >= 1, 'clickable': element.action }" 
                    @click="onClick(index, element.action)"
                >
                    <div v-if="element.action" class="component-container">
                        <div class="form-icon"><i :class="element.action.icon"></i></div>
                        <h3>{{ element.action.label }}</h3>
                    </div>
                    <h3 v-else>{{ label }} {{ index + 1 }}</h3>
                    <div v-if="addButton !== false" class="card-header-icon">
                        <i class="icon-supprimer delete" @click.stop="removeCard(index)"></i>
                        <hr v-if="!(isLast(index) && index === 0)" class="vertical-separator">
                        <i v-if="!isLast(index)" class="icon-bas" @click.stop="moveCard($event, index, index + 1)"></i>
                        <i v-if="index !== 0" class="icon-haut" @click.stop="moveCard($event, index, index - 1)"></i>
                        <hr v-if="!disabled" class="vertical-separator">
                        <i v-if="!disabled" class="icon-glisser"></i>
                    </div>
                </div>
                <div v-if="!element.action" class="card-content">
                    <GenericInput 
                        v-for="(input, indexKey) in inputs"
                        :key="indexKey"
                        :input="input"
                        :field-index="fieldIndex"
                        :input-value="inputs.length > 1 ? element[input.id] : element"
                        :inside-card="true"
                        :pos="index"
                        @input="onInput($event, input.id, index)"
                        @check="onCheck($event, input.id, index)"
                        @add-undo-action="onAddUndoAction($event, input.id, index)"
                    />
                </div>
            </div>
        </template>
    </VueDraggable>
    <AddCard
        v-if="addButton !== false"
        placeholder="Ajouter"
        class="add-card"
        @click="addCard"
    />
</template>

<style lang="scss" scoped>
.form-icon {
    margin: .7rem .7rem .7rem 0;
}
.component-container {
    display: flex;
    flex-direction: row;
    flex-grow:1;
}

.card {
    border: 2px solid var(--border);
    width: 25rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: all .2s linear;
    transition: text .2s linear;
    &-header {
        padding: 0 .7rem;
        display: flex;
        flex-direction: row;
        cursor: move;

        &.clickable {
            cursor: pointer;
        }

        &.border-bottom {
            border-bottom: 2px solid var(--border);
        }
        
        h3 {
            font-weight: bold;
            font-size: 1rem;
            margin: .7rem 0;
            flex-grow: 1;
            margin: auto;
        }
        &-icon {
            display: flex;
            flex-direction: row;
            width: fit-content;
            text-align: end;
            margin: auto;
            hr {
                margin-right: .5rem;
            }
            i {
                cursor: pointer;
                color: var(--editor-grayblue);
                margin: auto;
                &:not(:last-child) {
                    margin-right: .5rem;
                }

                &.delete:hover {
                    color: var(--editor-red);
                }
            }
        }

        .icon-glisser{
            cursor: move;
        }
    }
    &-content {
        padding: .7rem;
        display: flex;
        flex-direction: column;
    }
    &.card-ghost {
        background-color: var(--item-background);
        border: 2px dashed var(--border);
        * {
            opacity: 0;
        }
        background-size: 2.5rem auto;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2LjAgMTYuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNsaXBQYXRoIGlkPSJpMCI+PHBhdGggZD0iTTUyMDAsMCBMNTIwMCwxODU2IEwwLDE4NTYgTDAsMCBMNTIwMCwwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iaTEiPjxwYXRoIGQ9Ik03LjMxMjUsMCBDNy42MjM0MjE2NywwIDcuODc1LDAuMjUxMzY2OTczIDcuODc1LDAuNTYyMTQ4MDk0IEw3Ljg3NSw2Ljc0OTY0ODA5IEwxNC4wNjI1LDYuNzQ5NjQ4MDkgQzE0LjM3MTg3NDYsNi43NDk2NDgwOSAxNC42MjUsNy4wMDI3NzI5OSAxNC42MjUsNy4zMTIxNDgwOSBDMTQuNjI1LDcuNjIxNTIyNjcgMTQuMzcxODc0Niw3Ljg3NDY0ODA5IDE0LjA2MjUsNy44NzQ2NDgwOSBMNy44NzUsNy44NzQ2NDgwOSBMNy44NzUsMTQuMDYyMTQ4MSBDNy44NzUsMTQuMzczMDY5OCA3LjYyMzQyMTY3LDE0LjYyNSA3LjMxMjUsMTQuNjI1IEM3LjAwMTU3ODMzLDE0LjYyNSA2Ljc1LDE0LjM3MTUyMjcgNi43NSwxNC4wNjIxNDgxIEw2Ljc1LDcuODc0NjQ4MDkgTDAuNTYyNSw3Ljg3NDY0ODA5IEMwLjI1MTU3ODMzMSw3Ljg3NDY0ODA5IDAsNy42MjMyODExMiAwLDcuMzEyNSBDMCw3LjAwMjc3Mjk5IDAuMjUxNzE4ODc5LDYuNzQ5NjQ4MDkgMC41NjI1LDYuNzQ5NjQ4MDkgTDYuNzUsNi43NDk2NDgwOSBMNi43NSwwLjU2MjE0ODA5NCBDNi43NSwwLjI1MTIyNjQyNSA3LjAwMTU3ODMzLDAgNy4zMTI1LDAgWiI+PC9wYXRoPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjEyLjAgLTEzMzguMCkiPjxnIGNsaXAtcGF0aD0idXJsKCNpMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk3OS4wIDExMDMuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2MS4wIDc2LjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNS4wIDAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyMi4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3NS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC42ODc1IDUuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA0NC45Mzc4NTE5MDU4MjI5OCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjAgMTMuMCkiPjxnIGNsaXAtcGF0aD0idXJsKCNpMSkiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDE0LjYyNSwwIDE0LjYyNSwxNC42MjUgMCwxNC42MjUgMCwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM4Q0ExQ0EiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==");
        background-repeat: no-repeat;
        background-position: right 50% top 50%;
    }
}
</style>