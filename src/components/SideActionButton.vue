<script setup lang="ts">
import { SideAction } from '../shared/interfaces';
import { useEditorStore } from '../shared/stores';
import ContentButton from './ContentButton.vue';

const props = defineProps<{
    sideAction: SideAction;
}>();

const emit = defineEmits<{
    (e: 'showMenu'): void;
}>();

function showMenu(event) {
    if(props.sideAction.type !== 'question') return;
    //TODO: Verify if the behavior of modal dismiss is correct
    event.stopPropagation();
    emit('showMenu');
    console.log('showMenu', editorStore.subSideActions);
}

</script>

<template>
    <div class="container">
        <ContentButton
            :icon="sideAction.icon"
            :class-list="classList"
            :is-active="sideAction.type === 'question' && editorStore.floatingMenu"
            :is-draggable="sideAction.type !== 'question'"
            @dragstart="startDrag($event, sideAction.icon)"
            @click="showMenu($event)"
        />
        <div v-if="editorStore.floatingMenu && sideAction.type === 'question'" class="floating-menu" @click.stop>
            <ContentButton
                v-for="item of editorStore.subSideActions"
                :key="item.icon"
                :icon="item.icon"
                :class-list="{ 'btn-content-blue' : false }"
                :is-draggable="true"
                :is-active="false"
                @dragstart="startDrag($event, item.icon)"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
button {
    margin-bottom: .7rem;
}

.floating-menu {
    background-color: white;
    padding: 1rem;
    position: absolute;
    left: 6rem;
    //? Not sure if this is the best way to do it
    transform: translateY(-59%);
    z-index: 1;
    border-radius: 10px;
}

.container {
    position: relative;
}
</style>