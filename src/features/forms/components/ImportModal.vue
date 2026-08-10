<script setup lang="ts">
import ModalRoot from '@/src/components/ModalRoot.vue';
import ProgressBar from '@/src/components/ProgressBar.vue';
import { i18n } from '@/i18n/config';

defineProps<{
    current: number;
    max: number;
}>();
</script>

<template>
    <ModalRoot :closable="false" :title="i18n.global.t('global.importing')">
        <ProgressBar :model-value="current" :max="max" />
    </ModalRoot>
</template>
