<script setup lang="ts">
import { useEditorStore } from '@/src/shared/stores';
import GenericInput from './GenericInput.vue';
import AddCard from './card/AddCard.vue';
import {
    DraggableChange,
    Input,
    RepeatAddEvent,
    RepeatChangeEvent,
    RepeatInputEvent,
    RepeatMoveEvent,
    RepeatRemoveEvent,
} from '@/src/shared/interfaces';
import { ref } from 'vue';
import { generateContentId } from '@/src/shared/services/graph.service';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    id: string;
    inputs: Input[];
    label: string;
    inputValues: string[];
    fieldIndex: number;
    addButton?: boolean;
    collapsible?: boolean;
    collapsibleLabel?: string;
}>();

const emit = defineEmits<{
    (e: 'change', value: RepeatInputEvent): void;
    (e: 'saveGivenState', state: string): void;
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

const isLast = (index: number) => props.inputValues.length - 1 === index;

function onInput(value: string | string[], id: string, index: number) {
    const changeEvent: RepeatChangeEvent = {
        type: 'change',
        value,
        id,
        index,
    };
    emit('change', changeEvent);
}

function addCard() {
    const defaultValues =
        props.inputs.length === 1 ?
            props.inputs[0].value
        :   props.inputs.reduce((defaultValues, input) => {
                defaultValues[input.id] = input.type === 'hidden' ? generateContentId() : input.value;
                return defaultValues;
            }, {});

    const addEvent: RepeatAddEvent = {
        type: 'add',
        defaultValues,
    };
    emit('change', addEvent);
}

function removeCard(index: number) {
    const removeEvent: RepeatRemoveEvent = {
        type: 'remove',
        index,
    };
    emit('change', removeEvent);
}

function moveCard(oldIndex: number, newIndex: number) {
    const moveEvent: RepeatMoveEvent = {
        type: 'move',
        oldIndex,
        newIndex,
    };

    emit('change', moveEvent);
}

function dragCard(event: DraggableChange) {
    if (!event.moved) return;

    const { oldIndex, newIndex } = event.moved;
    moveCard(oldIndex, newIndex);
}

function onCheck(value: boolean, id: string, index: number) {
    const changeEvent: RepeatChangeEvent = {
        type: 'change',
        value,
        id,
        index,
    };
    emit('change', changeEvent);
}

function onClick(index: number, action: string) {
    const element = currentNode.data.elements?.[index];

    if (element && action) {
        const { id, formType, parentId } = element;
        editorStore.openFormPanel(id, formType, { nodeId: parentId });
    }
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
    if (editorStore.draggedElement) return;
    event.preventDefault();
    document.body.classList.add('cursor-move');
}

// Used to get "choice left/right" on swipe choice
function getLabelIdentifier(index) {
    if (props.addButton === false) {
        return index === 0 ? t('global.right') : t('global.left');
    } else return index + 1;
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
        @change="dragCard"
        @start="start"
        @dragover="dragOver"
        @end="end"
    >
        <!--suppress VueUnrecognizedSlot -->
        <template #item="{ element, index }">
            <div :key="index" class="card draggable-card" :data-testid="`${id}-${index}`">
                <div
                    class="card-header"
                    :class="{ 'border-bottom': inputs.length >= 1, clickable: element.action }"
                    @click="onClick(index, element.action)"
                >
                    <div v-if="element.action" class="component-container">
                        <div class="form-icon"><i :class="element.action.icon"></i></div>
                        <h3>{{ element.action.label }}</h3>
                    </div>
                    <h3 v-else>{{ label }} {{ getLabelIdentifier(index) }}</h3>
                    <div v-if="addButton !== false" class="card-header-icon">
                        <i class="icon-supprimer delete" @click.stop="removeCard(index)"></i>
                        <hr v-if="!(isLast(index) && index === 0)" class="vertical-separator" />
                        <i v-if="!isLast(index)" class="icon-bas" @click.stop="moveCard(index, index + 1)"></i>
                        <i v-if="index !== 0" class="icon-haut" @click.stop="moveCard(index, index - 1)"></i>
                        <hr v-if="!disabled" class="vertical-separator" />
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
                        :collapsible="input.collapsible"
                        :collapsible-label="input.collapsibleLabel"
                        @input="onInput($event, input.id, index)"
                        @check="onCheck($event, input.id, index)"
                        @save-given-state="emit('saveGivenState', $event)"
                    />
                </div>
            </div>
        </template>
    </VueDraggable>
    <AddCard
        v-if="addButton !== false"
        :data-testid="`${id}-add`"
        :placeholder="t('global.add')"
        class="add-card"
        @click="addCard"
    />
</template>

<!--suppress CssOverwrittenProperties -->
<style lang="scss" scoped>
.form-icon {
    margin: 0.7rem 0.7rem 0.7rem 0;
}
.component-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

.card {
    border: 2px solid var(--border);
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: all 0.2s linear;
    transition: text 0.2s linear;
    &-header {
        padding: 0 0.7rem;
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
                margin-right: 0.5rem;
            }
            i {
                cursor: pointer;
                color: var(--editor-grayblue);
                margin: auto;
                &:not(:last-child) {
                    margin-right: 0.5rem;
                }

                &.delete:hover {
                    color: var(--editor-red);
                }
            }
        }

        .icon-glisser {
            cursor: move;
        }
    }
    &-content {
        padding: 0.7rem;
        display: flex;
        flex-direction: column;
    }
    &.card-ghost {
        background-color: var(--item-background);
        border: 2px dashed var(--border);
        background-size: 2.5rem auto;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2LjAgMTYuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNsaXBQYXRoIGlkPSJpMCI+PHBhdGggZD0iTTUyMDAsMCBMNTIwMCwxODU2IEwwLDE4NTYgTDAsMCBMNTIwMCwwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iaTEiPjxwYXRoIGQ9Ik03LjMxMjUsMCBDNy42MjM0MjE2NywwIDcuODc1LDAuMjUxMzY2OTczIDcuODc1LDAuNTYyMTQ4MDk0IEw3Ljg3NSw2Ljc0OTY0ODA5IEwxNC4wNjI1LDYuNzQ5NjQ4MDkgQzE0LjM3MTg3NDYsNi43NDk2NDgwOSAxNC42MjUsNy4wMDI3NzI5OSAxNC42MjUsNy4zMTIxNDgwOSBDMTQuNjI1LDcuNjIxNTIyNjcgMTQuMzcxODc0Niw3Ljg3NDY0ODA5IDE0LjA2MjUsNy44NzQ2NDgwOSBMNy44NzUsNy44NzQ2NDgwOSBMNy44NzUsMTQuMDYyMTQ4MSBDNy44NzUsMTQuMzczMDY5OCA3LjYyMzQyMTY3LDE0LjYyNSA3LjMxMjUsMTQuNjI1IEM3LjAwMTU3ODMzLDE0LjYyNSA2Ljc1LDE0LjM3MTUyMjcgNi43NSwxNC4wNjIxNDgxIEw2Ljc1LDcuODc0NjQ4MDkgTDAuNTYyNSw3Ljg3NDY0ODA5IEMwLjI1MTU3ODMzMSw3Ljg3NDY0ODA5IDAsNy42MjMyODExMiAwLDcuMzEyNSBDMCw3LjAwMjc3Mjk5IDAuMjUxNzE4ODc5LDYuNzQ5NjQ4MDkgMC41NjI1LDYuNzQ5NjQ4MDkgTDYuNzUsNi43NDk2NDgwOSBMNi43NSwwLjU2MjE0ODA5NCBDNi43NSwwLjI1MTIyNjQyNSA3LjAwMTU3ODMzLDAgNy4zMTI1LDAgWiI+PC9wYXRoPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjEyLjAgLTEzMzguMCkiPjxnIGNsaXAtcGF0aD0idXJsKCNpMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk3OS4wIDExMDMuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2MS4wIDc2LjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNS4wIDAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyMi4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3NS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC42ODc1IDUuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA0NC45Mzc4NTE5MDU4MjI5OCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjAgMTMuMCkiPjxnIGNsaXAtcGF0aD0idXJsKCNpMSkiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDE0LjYyNSwwIDE0LjYyNSwxNC42MjUgMCwxNC42MjUgMCwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM4Q0ExQ0EiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==');
        background-repeat: no-repeat;
        background-position: right 50% top 50%;
        * {
            opacity: 0;
        }
    }
}
</style>
