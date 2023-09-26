<script setup lang="ts">
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { defaultBadgeIcons } from '@/src/shared/data';
import { saveState } from '@/src/shared/services/undoRedo.service';

import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import BadgePreview from '@/src/features/badge/components/BadgePreview.vue';

const editorStore = useEditorStore();
const projectStore = useProjectStore();

function close() {
    editorStore.iconModal = false;
}


function chooseIcon(icon: string) {
    saveState(true);

    const epocNode = editorStore.getEpocNode;
    const currentBadgeId = editorStore.openedBadgeId;

    epocNode.data.formValues['badges'][currentBadgeId]['icon'] = icon;
    close();
}

function chooseCustomIcon(icon: string) {
    projectStore.addCustomIcon(icon);
    chooseIcon(icon);
}

</script>

<template>
    <div class="modal-backdrop"></div>
    <article class="condition-modal">
        <header>
            <div class="content">
                <h2>Sélectionner une icône</h2>
                <button class="btn btn-close" @click="close"><i class="icon-x"></i></button>
            </div>
        </header>
        <div class="content">
            <h3>Icônes par défaut</h3>
            <hr class="separator">
            <div class="badges">
                <BadgeItem
                    v-for="(icon, index) in defaultBadgeIcons"
                    :key="index"
                    :icon="icon"
                    @click="chooseIcon(icon)"
                />
            </div>
        </div>

        <div class="content">
            <h3>Icônes personnalisées</h3>
            <hr class="separator">
            <div class="badges">
                <BadgeItem
                    v-for="(icon, index) in projectStore.customIcons"
                    :key="index"
                    :icon="icon"
                    @click="chooseIcon(icon)"
                />
            </div>
            <BadgePreview
                @click="chooseCustomIcon($event)"
            />
        </div>
    </article>
</template>

<style scoped lang="scss">
header {
    border-bottom: 1px solid var(--border);
    h2 {
        margin: 0;
    }
}

footer {
    border-top: 1px solid var(--border);
}


hr {
    margin-top: 1rem;
}

.badges {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
}

.add {
    margin-top: 1rem;
    display: flex;
    gap: .5rem;
    i {
        font-size: .9rem;
        margin: auto;
    }
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, .2);
    z-index: 150;
}

.content {
    padding: 1.5rem;
}

h3 {
    margin: 0;
}
.conditions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.condition-modal {
    user-select: none;
    position: fixed;
    margin: auto;
    justify-self: center;
    top: 10%;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    gap: 1rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    max-height: 85%;
    z-index: 200;
}
</style>