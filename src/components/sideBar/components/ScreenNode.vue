<script setup lang="ts">
import { SideAction } from '../../../shared/interfaces';
import ContentButton from '../../ContentButton.vue';

defineProps<{
    title: string;
    sideActions: SideAction[];
}>();

const emit = defineEmits<{
    (e: 'dragStart', event): void;
}>();

function dragStart(event) {
    emit('dragStart', event);
}

</script>

<template>
    <div class="screen">
        <small>{{ title }}</small>
        <div class="node" draggable="true" @dragstart="dragStart($event)">
            <ContentButton
                v-for="action of sideActions"
                :key="action.type"
                :icon="action.icon"
                :class-list="{ 'btn-content-blue' : false }"
                :is-draggable="false"
                :is-active="false"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.screen {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
}
</style>