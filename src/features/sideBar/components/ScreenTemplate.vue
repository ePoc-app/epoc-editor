<script setup lang="ts">
import { SideAction } from '../../../shared/interfaces';
import ContentButton from '../../../components/ContentButton.vue';
import { ref } from 'vue';

defineProps<{
    title: string;
    sideActions: SideAction[];
}>();

const dragging = ref(false);

const emit = defineEmits<{
    (e: 'dragStart', event): void;
}>();

function dragStart(event) {
    emit('dragStart', event);
    dragging.value = true;
}

</script>

<template>
    <div class="screen" :class="{ 'dragging': dragging }">
        <small>{{ title }}</small>
        <div
            class="node node-list screen-node"
            draggable="true"
            @dragstart="dragStart($event)"
            @dragend="dragging = false"
        >
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
    transform: translate(0, 0);
    cursor: grab !important;
    transition: opacity .1s ease-in-out;
    &.dragging {
        opacity: .5;
    }
}
</style>