<script setup lang="ts">
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { defaultBadgeIcons } from '@/src/shared/data';
import { saveState } from '@/src/shared/services/undoRedo.service';

import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import BadgePreview from '@/src/features/badge/components/BadgePreview.vue';
import { saveCustomIcon } from '@/src/shared/services';
import { onMounted, ref } from 'vue';

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

async function chooseCustomIcon(icon: string) {
    const iconPath = await saveCustomIcon(icon);

    chooseIcon(iconPath);
}

function removeCustomIcon(index: number) {
    projectStore.customIcons.splice(index, 1);
}

const modalScreen = ref(null);
onMounted(() => {
    modalScreen.value.focus();
});
</script>

<template>
    <div ref="modalScreen" class="modal-backdrop" tabindex="0" @keyup.esc="close">
        <article class="condition-modal">
            <header>
                <div class="content">
                    <h2>{{ $t('badge.selectIcon') }}</h2>
                    <button class="btn btn-close" @click="close"><i class="icon-x"></i></button>
                </div>
            </header>
            <div class="content">
                <h3>{{ $t('badge.defaultIcons') }}</h3>
                <hr class="separator" />
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
                <h3>{{ $t('badge.customIcons') }}</h3>
                <hr class="separator" />
                <div class="badges">
                    <BadgeItem
                        v-for="(icon, index) in projectStore.customIcons"
                        :key="index"
                        :icon="icon"
                        :delete-button="true"
                        @click="chooseIcon(icon)"
                        @remove-icon="removeCustomIcon(index)"
                    />
                </div>
                <BadgePreview @click="chooseCustomIcon($event)" />
            </div>
        </article>
    </div>
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
    gap: 0.5rem;
    i {
        font-size: 0.9rem;
        margin: auto;
    }
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
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
