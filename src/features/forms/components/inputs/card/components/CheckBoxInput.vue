<script setup lang="ts">

defineProps<{
    inputValue: string;
    label: string;
}>();


const emit = defineEmits<{
    (e: 'change', value: string): void;
}>();

</script>

<template>
    <div class="checkbox">
        <input
            :id="label"
            class="checkbox-input"
            type="checkbox"
            :checked="JSON.parse(inputValue)"
            @change="emit('change', String(($event.target as HTMLInputElement).checked))"
        >
        <label :for="label">{{ label }}</label>
    </div>
</template>

<style scoped lang="scss">
.checkbox {
    display: flex;
    margin: 1rem 0 .5rem 0;
    input[type="checkbox"] {
        appearance: none;
        margin: 0;
        margin-right: .5rem;
        font: inherit;
        width: 20px;
        height: 20px;
        border: 1px solid var(--border);
        border-radius: 4px;
        transform: translateY(-0.075em);
        background-color: var(--item-background);

        cursor: pointer;

        display: grid;
        place-content: center;
        
        &:checked::before {
            transform: scale(1);
        }

        &::before {
            content: '';
            width: 14px;
            height: 14px;
            transform: scale(0);
            transition: .1s transform ease-in-out;
            border-radius: 4px;
            background-color: var(--editor-blue);
        }
    }
}
</style>