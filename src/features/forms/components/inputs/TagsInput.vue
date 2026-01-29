<script setup lang="ts">
import { getCurrentState } from '@/src/shared/services/undoRedo.service';
import { TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot } from 'reka-ui';

const props = defineProps<{
    inputValue: string[];
    placeholder?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', value: string[]): void;
    (e: 'saveGivenState', state: string): void;
}>();

let savedState = '';
let startValue = [];

function onFocus() {
    savedState = getCurrentState(true);

    startValue = props.inputValue;
}

function onBlur() {
    if (startValue !== props.inputValue) emit('saveGivenState', savedState);
    savedState = '';
    startValue = [];
}

function onRemove() {
    savedState = getCurrentState(true);
    if (startValue !== props.inputValue) emit('saveGivenState', savedState);

    savedState = '';
}
</script>

<template>
    <TagsInputRoot
        :model-value="inputValue"
        :disabled="disabled"
        class="input tags-input-root"
        @update:model-value="emit('input', $event)"
        @remove-tag="onRemove"
    >
        <TagsInputItem v-for="item in inputValue" :key="item" :value="item" class="tags-input-item">
            <TagsInputItemText class="tags-input-item-text" />
            <TagsInputItemDelete class="tags-input-delete">
                <i class="icon-x" />
            </TagsInputItemDelete>
        </TagsInputItem>

        <TagsInputInput :placeholder="placeholder" class="tags-input-input" @focus="onFocus" @blur="onBlur" />
    </TagsInputRoot>
</template>

<style scoped lang="scss">
.tags-input {
    &-input {
        border: none;
        background: inherit;
        flex-grow: 1;
        width: 100%;
        font-size: 1.1rem;

        &:focus {
            outline: none;
        }

        &::placeholder {
            color: var(--editor-grayblue);
        }
    }

    &-item {
        font-size: 0.75rem;
        display: flex;
        gap: 0.25rem;
        background: var(--background);
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
        border-radius: 4px;
    }

    &-root {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        &:focus-within {
            outline: 1px solid var(--editor-blue);
            box-shadow: 0 1px 8px 0 var(--editor-blue-shadow);
        }
    }

    &-delete {
        padding: 0.1rem;
        background: transparent;
        border: none;
    }
}
</style>
