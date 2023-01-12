<script setup lang="ts">
import { SideAction } from '../../../shared/interfaces';
import { useEditorStore } from '../../../shared/stores';
import ContentButton from '../../../components/ContentButton.vue';
import ModelMenu from './ModelMenu.vue';

const props = defineProps<{
    sideAction: SideAction;
}>();

const emit = defineEmits<{
    (e: 'showMenu'): void;
}>();

function showMenu(event) {
    if(props.sideAction.type !== 'question' && props.sideAction.type != 'model') return;
    //TODO: Verify if the behavior of modal dismiss is correct (maybe on mouse down instead of click)
    event.stopPropagation();
    emit('showMenu');
}

const editorStore = useEditorStore();


//TODO: Using this remove the indicator of the drop zone when dragging, find a way to keep it
function startDrag(event, sideAction) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(sideAction));
}

function startDragModel({event, sideAction}) {
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('sideAction', JSON.stringify(sideAction));
}

const classList = props.sideAction.type === 'question' || props.sideAction.type === 'model' ? { 'btn-content-blue-question' : true, 'btn-content-blue' : true } : { 'btn-content-blue' : true };

</script>

<template>
    <div class="container">
        <ContentButton
            :icon="sideAction.icon"
            :class-list="classList"
            :is-active="sideAction.type === 'question' && editorStore.floatingMenu || sideAction.type === 'model' && editorStore.modelMenu"
            :is-draggable="sideAction.type !== 'question' && sideAction.type !== 'model'"
            @dragstart="startDrag($event, sideAction)"
            @click="showMenu($event)"
        />
        <!-- Question floating menu -->
        <Transition>
            <div v-if="editorStore.floatingMenu && sideAction.type === 'question'" class="floating-menu" @click.stop>
                <ContentButton
                    v-for="(item, index) of editorStore.subSideActions"
                    :key="index"
                    :icon="item.icon"
                    :class-list="{ 'btn-content-blue' : false }"
                    :is-draggable="true"
                    :is-active="false"
                    @dragstart="startDrag($event, item)"
                />
            </div>
        </Transition>
        <!-- Screen model menu -->
        <Transition>
            <ModelMenu
                v-if="editorStore.modelMenu && sideAction.type == 'model'"   
                @drag-start="startDragModel"         
            />
            <!-- <div v-if="editorStore.modelMenu && sideAction.type == 'model'" class="model-menu" @click.stop>
               
            </div> -->
        </Transition>
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

// Modal transition
.v-enter-active,
.v-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.container {
    position: relative;
}
</style>