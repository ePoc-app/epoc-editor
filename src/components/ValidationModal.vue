<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useEditorStore } from '../shared/stores';
import { deleteSelectedNodes } from '../shared/services/graph';

const editorStore = useEditorStore();

const modalScreen = ref(null);

onMounted(() => {
    modalScreen.value.focus();
});


</script>

<template>
    <div
        ref="modalScreen"
        class="modal-backdrop"
        tabindex="0"
        @keyup.enter="deleteSelectedNodes"
        @keyup.escape="editorStore.validationModal = false"
    >
        <div class="modal">
            <h3>Souhaitez-vous vraiment supprimer cet élément ?</h3>
            <button class="btn btn-close" @click="editorStore.validationModal = false"><i class="icon-x"></i></button>
            <button class="btn-choice accept" @click="deleteSelectedNodes">OUI, SUPPRIMER</button>
            <button class="btn-choice cancel" @click="editorStore.validationModal = false">NON, NE PAS SUPPRIMER</button>
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

h3 {
    text-align: center;
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
        background-color: #E93100;
        color: #fff;
    }
}
</style>