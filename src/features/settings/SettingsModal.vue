<script setup lang="ts">
import Modal from '@/src/components/LayoutModal.vue';
import SettingsInput from './SettingsInput.vue';
import { ref, watch } from 'vue';
import { useSettingsStore } from '@/src/shared/stores';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const modal = ref(null);
const settingsStore = useSettingsStore();
const spellcheck = ref(false);
const localeTmp = ref();

function save() {
    locale.value = localeTmp.value;
    settingsStore.setSettings(spellcheck.value);
    modal.value.close();
}

function open() {
    modal.value.open();
}

watch(
    () => modal.value?.isOpen,
    (isOpen) => {
        // set values here to make sure the settings were fetched from the store
        if (isOpen) {
            spellcheck.value = settingsStore?.settings?.spellcheck;
            localeTmp.value = locale.value;
        }
    },
);

defineExpose({
    open,
});
</script>

<template>
    <Modal ref="modal" :title="$t('settings.title')">
        <template v-if="modal" #trigger>
            <slot name="trigger" />
        </template>

        <div class="settings">
            <SettingsInput v-model="spellcheck" type="toggle" :label="$t('settings.spellcheck')" />
            <SettingsInput
                v-model="localeTmp"
                type="select"
                :label="$t('settings.lang')"
                :options="[
                    { label: 'English', value: 'en' },
                    { label: 'Français', value: 'fr' },
                ]"
            />
        </div>

        <template #footer>
            <button class="btn-choice cancel" @click="modal.close">{{ $t('global.cancel') }}</button>
            <button class="btn-choice save" @click="save">{{ $t('global.save') }}</button>
        </template>
    </Modal>
</template>

<style scoped lang="scss">
.settings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
