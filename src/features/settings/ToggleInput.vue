<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
    id: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const data = useVModel(props, 'modelValue', emit);
</script>

<template>
    <label class="switch">
        <input :id="id" v-model="data" type="checkbox" />
        <span class="slider"></span>
    </label>
</template>

<style scoped lang="scss">
.switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 20px;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border);
    transition: .25s;
    border-radius: 34px;

    &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .25s;
        border-radius: 50%;
    }
}

input {
    &:checked + .slider {
        background-color: var(--editor-blue);
    }

    &:focus + .slider {
        box-shadow: 0 0 1px var(--editor-blue);
    }

    &:checked + .slider:before {
        transform: translateX(13px);
    }
}

</style>
