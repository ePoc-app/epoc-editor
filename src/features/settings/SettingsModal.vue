<script setup lang="ts">
import Modal from '@/src/components/LayoutModal.vue'
import SettingsInput from './SettingsInput.vue';
import ContentButton from '@/src/components/ContentButton.vue';
import TopActionButton from '@/src/features/topBar/TopActionButton.vue';
import { ref, onMounted, watch } from 'vue';
import { useSettingsStore } from '@/src/shared/stores';

const modal = ref(null);
const settingsStore = useSettingsStore();
const spellcheck = ref(false);

onMounted(() => {
    settingsStore.init();
})

function save() {
    settingsStore.setSettings(spellcheck.value);
    modal.value.close();
}

function open() {
    modal.value.open();
}

watch(() => modal.value?.isOpen, (isOpen) => {
    if (isOpen) spellcheck.value = settingsStore?.settings?.spellcheck;
})

defineExpose({
    open
})

</script>

<template>
    <Modal ref="modal" title="Paramètres">
        <template v-if="modal" #trigger>
            <slot name="trigger" />
        </template>

        <div class="settings">
            <SettingsInput v-model="spellcheck" type="toggle" label="Activer la vérification orthographique" />
        </div>

        <template #footer>
            <button class="btn-choice cancel" @click="modal.close">Annuler</button>
            <button class="btn-choice save" @click="save">Valider</button>
        </template>
    </Modal>
</template>

<style scoped lang="scss">
.settings {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.btn-choice {
    cursor: pointer;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 500;
    padding: 1rem 2rem;

    &:hover {
        filter: brightness(95%);
    }
    &.cancel {
        background-color: #fff;
        color: var(--inria-grey);
        border: 1px solid var(--inria-grey);
    }
    &.save {
        background-color: #e93100;
        color: #fff;

        &:disabled {
            cursor: not-allowed;
            filter: opacity(40%);
        }
    }
}
</style>
