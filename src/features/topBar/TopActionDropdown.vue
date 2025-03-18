<script setup lang="ts">
defineProps<{
    icon: string;
    inputValue: number;
    text?: string;
    textBefore?: string;
    disabled?: boolean;
}>();

const onSelect = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const value = Number.parseFloat(target.value);
    emit('change', value);
};

const emit = defineEmits<{
    (e: 'change', value: number): void;
}>();
</script>

<template>
    <div class="select btn btn-top-bar">
        <span v-if="textBefore" class="text-top-bar zoom-span">{{ textBefore }}</span>
        <i :class="icon" />
        <span v-if="text" class="text-top-bar">{{ text }}</span>
        <select id="select-box" :value="inputValue" :disabled="disabled" class="select-box" @change="onSelect">
            <option value="0">{{ $t('header.adjust') }}</option>
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.5">150%</option>
        </select>
    </div>
</template>

<style scoped lang="scss">
.select {
    position: relative;

    &:disabled {
        opacity: 0.5;
    }
}

select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}
</style>
