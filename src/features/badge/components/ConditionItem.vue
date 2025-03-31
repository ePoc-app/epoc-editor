<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import ConditionElementSelector from './ConditionElementSelector.vue';
import ConditionValue from './ConditionValue.vue';
import { getVerbs, getValueType, createPhrase } from '@/src/shared/services';
import { Condition, ElementType, Verbs } from '@/src/shared/interfaces';
import { getElementType } from '@/src/shared/services/graph';

const props = defineProps<{
    inputValue: Condition;
    conditionIndex: number;
}>();

const emit = defineEmits<{
    (e: 'removeCondition'): void;
    (e: 'updateCondition', values: { value: string | number | boolean; key: string }): void;
}>();

// const logicChoice: Ref<'and' | 'or'> = ref('and');

const currentCondition: ComputedRef<Condition> = computed(() => {
    return {
        element: props.inputValue.element || '',
        verb: props.inputValue.verb || '',
        value: props.inputValue.value !== '' ? props.inputValue.value : '',
    };
});

const verbDisabled: ComputedRef<boolean> = computed(() => {
    return !currentCondition.value.element;
});

const valueDisabled: ComputedRef<boolean> = computed(() => {
    return !currentCondition.value.element || !currentCondition.value.verb;
});

const elementType: ComputedRef<ElementType> = computed(() => {
    if (!currentCondition.value.element) return null;
    return getElementType(currentCondition.value.element);
});

function removeCondition() {
    emit('removeCondition');
}

function updateCondition(value: string | number | boolean, key: string) {
    emit('updateCondition', { value, key });
}

function resetValue(value: boolean, verb?: boolean) {
    if (verb) updateCondition('', 'verb');
    if (value) updateCondition('', 'value');
}

function handleVerbChange(value: string) {
    resetValue(true);
    updateCondition(value, 'verb');
}

const verbs: ComputedRef<Verbs> = computed(() => {
    if (!elementType.value) return {};
    const res = getVerbs(elementType.value);
    return res.value;
});
</script>

<template>
    <div v-if="conditionIndex !== 0" class="gap"></div>
    <article>
        <i class="icon-supprimer delete" @click.stop="removeCondition"></i>
        <div class="logic-condition">
            <button class="logic-choice active">{{ $t('global.and').toUpperCase() }}</button>
        </div>
        <!-- Condition switch -->
        <!-- <div v-if="conditionIndex !== 0" class="logic-condition">
            <button class="logic-choice" :class="{ 'active' : logicChoice === 'and'}" @click="logicChoice = 'and'">
                ET
            </button>
            <button class="logic-choice" :class="{ 'active' : logicChoice === 'or'}" @click="logicChoice = 'or'">
                OU
            </button>
        </div> -->
        <div class="grid-container">
            <ConditionElementSelector
                :input-value="currentCondition.element"
                :index="conditionIndex"
                class="grid-item"
            />
            <div class="select">
                {{ $t('global.condition') }}
                <select
                    id="condition"
                    :disabled="verbDisabled"
                    class="grid-item"
                    :value="currentCondition.verb"
                    @change="handleVerbChange(($event.target as HTMLSelectElement).value)"
                >
                    <option value="">{{ $t('global.pleaseSelect') }}</option>
                    <option v-for="(description, verb) in verbs" :key="verb" :value="verb">
                        {{ description.label }}
                    </option>
                </select>
            </div>
            <ConditionValue
                :verb="currentCondition.verb"
                :input-value="currentCondition.value"
                :value-type="valueDisabled ? null : getValueType(currentCondition.verb)"
                class="grid-item"
                @change="updateCondition($event, 'value')"
            />
        </div>
        <p v-if="!valueDisabled && currentCondition.value !== ''">
            {{ `${createPhrase(currentCondition, elementType)} ${currentCondition.element}` }}
        </p>
    </article>
</template>

<style scoped lang="scss">
.delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    color: var(--editor-grayblue);

    &:hover {
        color: var(--editor-red);
    }
}

.logic-condition {
    position: absolute;
    transform: translateY(calc(-1rem - 50%));

    .logic-choice {
        cursor: pointer;
        border: 1px solid var(--border);
        background: white;
        padding: 0.5rem 0.75rem;
        color: var(--inria-grey);

        border-radius: 8px;

        // &:first-child {
        //     border-right: none;
        //     border-radius: 8px 0 0 8px;
        // }
        // &:last-child {
        //     border-radius: 0 8px 8px 0;
        // }

        &.active {
            background: var(--inria-grey);
            color: white;
        }
    }
}

article {
    position: relative;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    border-radius: 4px;

    p {
        margin: 0;
    }
}

.select {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 0.75rem;

    label {
        margin-bottom: 0.5rem;
    }
    select {
        appearance: none;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background-color: var(--item-background);
        cursor: pointer;
        font-size: 1rem;
        color: var(--text);

        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjExcHgiIGhlaWdodD0iN3B4IiB2aWV3Qm94PSIwIDAgMTEuMCA3LjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjbGlwUGF0aCBpZD0iaTAiPjxwYXRoIGQ9Ik0yNDE4LDAgTDI0MTgsMjQyNiBMMCwyNDI2IEwwLDAgTDI0MTgsMCBaIj48L3BhdGg+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImkxIj48cGF0aCBkPSJNOS4yMDE3MjIyNywwIEM5LjYxNjUwNDA2LDAgOS45OTA4OTcyMSwwLjI3MzU1MDk4NyAxMC4xNDk4ODU5LDAuNjk0MzM1OTM3IEMxMC4zMDg4NzQ2LDEuMTE1MTIwODkgMTAuMjQ5ODk0OSwxLjU5OTYwOTM3IDkuOTU0OTk2NjMsMS45MTk1MzE0NiBMNS44ODA5MDQ1NSw2LjQxOTUzMTQ2IEM1LjY1MzMxOTM0LDYuNjQxMDE1NDEgNS4zOTA0NzQ3Niw2Ljc1IDUuMTI3NjMwMTksNi43NSBDNC44NjQ3ODU2Miw2Ljc1IDQuNjAyNTgxNzgsNi42NDAxMzY3MiA0LjQwMjI0Mjg2LDYuNDIwNDEwMTYgTDAuMzI4MTUwMjkxLDEuOTIwNDEwMTYgQzAuMDA2MTQ2NTU1MTksMS41OTk2MDkzNyAtMC4wODE2OTQ5MjIzLDEuMTE0NDUzMDIgMC4wNzcxMDE1NTQ3LDAuNjk2MDkzODU3IEMwLjIzNTg5ODAzMiwwLjI3NzczNDY5NyAwLjYxMDIyNzEwNiwwIDEuMDI0Njg4NTMsMCBMOS4yMDE3MjIyNywwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMwNC4wIC0xMDYyLjApIj48ZyBjbGlwLXBhdGg9InVybCgjaTApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5ODAuMCA5MC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3MjkuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA1MS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuMCAxNTAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyNC4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjg5LjM3MjM2OTgwNjgwMSAxOC4wKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kxKSI+PHBvbHlnb24gcG9pbnRzPSItMS4xMTAyMjMwMmUtMTYsMCAxMC4yMzYwMTA0LDAgMTAuMjM2MDEwNCw2Ljc1IC0xLjExMDIyMzAyZS0xNiw2Ljc1IC0xLjExMDIyMzAyZS0xNiwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiMzNTQyNTgiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=');
        background-repeat: no-repeat;
        background-position: right 0.7rem top 50%;
        background-size: 0.8rem auto;

        &:disabled {
            cursor: not-allowed;
        }
    }
}

.grid-container {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
}
</style>
