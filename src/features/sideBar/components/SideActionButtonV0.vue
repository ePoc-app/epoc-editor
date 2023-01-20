<script setup lang="ts">
import { SideAction } from '../../../shared/interfaces';
import { ref } from 'vue';
import ContentButton from '../../../components/ContentButton.vue';

defineProps<{
    sideAction:SideAction;
}>();

const classList = { 'btn-content-blue': true };

const dragging = ref(false);

function dragStart(event, sideAction) {
    event.dataTransfer.dropEffect= 'move';
    event.dataTransfer.effectAllowed= 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(sideAction));
    dragging.value = true;
}

</script>

<template>
    <ContentButton
        class="question"
        :class="{ 'dragging' : dragging }"
        :icon="sideAction.icon"
        :class-list="classList"
        :is-active="false"
        :is-draggable="true"
        @dragstart="dragStart($event, sideAction)"
        @dragend="dragging = false"
    />
</template>

<style scoped lang="scss">

.dragging {
    transition: opacity .1s ease-in-out;
    opacity: .5;
    box-shadow: none;
}

.question {
    margin-bottom: 1.5rem;
}

</style>