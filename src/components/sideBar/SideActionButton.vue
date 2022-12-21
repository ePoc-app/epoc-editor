<script setup lang="ts">
import { SideAction } from '../../shared/interfaces';
import { useEditorStore } from '../../shared/stores';
import ContentButton from '../ContentButton.vue';

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
}

const editorStore = useEditorStore();


//TODO: Using this remove the indicator of the drop zone when dragging, find a way to keep it
function startDrag(event, icon) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('icon', icon);
}

const classList = props.sideAction.type === 'question' || props.sideAction.type === 'model' ? { 'btn-content-blue-question' : true, 'btn-content-blue' : true } : { 'btn-content-blue' : true };

</script>

<template>
    <div class="container">
        <ContentButton
            :icon="sideAction.icon"
            :class-list="classList"
            :is-active="sideAction.type === 'question' && editorStore.floatingMenu"
            :is-draggable="sideAction.type !== 'question' && sideAction.type !== 'model'"
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