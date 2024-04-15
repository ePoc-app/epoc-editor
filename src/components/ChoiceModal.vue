<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
    acceptLabel: string;
    cancelLabel: string;
}

withDefaults(defineProps<Props>(), {
    acceptLabel: 'Accepter',
    cancelLabel: 'Annuler',
});

const emits = defineEmits<{
    (e: 'accept'): void;
    (e: 'cancel'): void;
}>();

const modalScreen = ref<HTMLElement | null>(null);

function validate() {
    emits('accept');
}

function cancel() {
    emits('cancel');
}

onMounted(() => {
    modalScreen.value.focus();
});
</script>

<template>
    <div
        ref="modalScreen"
        class="modal-backdrop"
        tabindex="0"
        @keyup.enter="validate"
        @keyup.esc="cancel"
    >
        <div class="modal">
            <slot />
            <button class="btn btn-close" @click="cancel"><i class="icon-x"></i></button>
            <button class="btn-choice accept" @click="validate">{{ acceptLabel }}</button>
            <button class="btn-choice cancel" @click="cancel">{{ cancelLabel }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
}

.modal {
    user-select: none;
    position: relative;
    padding: 2rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    gap: 1rem;
    width: 22rem;
}

.btn-choice {
    cursor: pointer;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 500;
    padding: 1rem;

    &:hover {
        filter: brightness(95%);
    }
    &.cancel {
        background-color: #fff;
        color: var(--inria-grey);
        border: 1px solid var(--inria-grey);
    }
    &.accept {
        background-color: #e93100;
        color: #fff;
    }
}
</style>