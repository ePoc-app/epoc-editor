<script setup lang="ts">
import { enterSelectNodeMode } from '@/src/shared/services';

//! Not sure if the displayed value should be the id or the name
const props = defineProps<{
    index: number;
    inputValue: string;
}>();

function onClick() {
    enterSelectNodeMode(props.index);
}
</script>

<template>
    <div class="select">
        {{ $t('global.element') }}
        <div class="select-input" @click="onClick">
            <p>{{ inputValue || $t('global.pleaseSelect') }}</p>
            <i class="icon-cible"></i>
        </div>
    </div>
</template>

<style scoped lang="scss">
.select {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 0.75rem;

    label {
        margin-bottom: 0.5rem;
    }
    &-input {
        display: flex;
        align-items: center;
        appearance: none;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background-color: var(--item-background);
        cursor: pointer;
        font-size: 1rem;
        color: var(--text);

        p {
            flex-grow: 1;
            margin: 0;
            padding: 0;
            line-height: 0;
        }
    }
}
</style>
