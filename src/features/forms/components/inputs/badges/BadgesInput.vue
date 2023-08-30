<script setup lang="ts">
import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import AddBadge from './components/AddBadge.vue';
import { useEditorStore } from '@/src/shared/stores/editorStore';
import { computed, ComputedRef } from 'vue';
import { generateContentId } from '@/src/shared/services';
import { Badge } from '@/src/shared/interfaces';
import { saveState } from '@/src/shared/services/undoRedo.service';

const editorStore = useEditorStore();

const props = defineProps<{
    inputValue: string[];
}>();

function openBadge(badgeId: string) {
    editorStore.openBadgeFormPanel(badgeId, 'custom');
}

const badges: ComputedRef<Badge[]> = computed(() => {
    const res: Badge[] = [];
    for(let value in props.inputValue) {
        const newBadge: Badge = {
            id: value,
            title: props.inputValue[value]['title'],
            description: props.inputValue[value]['description'],
            icon: props.inputValue[value]['icon'],
            rule: props.inputValue[value]['rule'],
        };
        res.push(newBadge);
    }

    return res;
});

function addNewBadge() {
    saveState(true);

    const epocNode = editorStore.getEpocNode;
    if(!epocNode.data.formValues['badges']) epocNode.data.formValues['badges'] = {};

    const id = generateContentId();
    epocNode.data.formValues['badges'][id] = {
        title: '',
        icon: '',
        description: '',
        rule: {
            'and': []
        }
    };
    openBadge(id);
}

</script>

<template>
    <AddBadge
        placeholder="Ajouter un nouveau badge"
        @click="addNewBadge"
    />
    <div class="badges">
        <BadgeItem
            v-for="(badge, index) in badges"
            :key="index"
            :badge="badge"
            :invalid="Object.keys(badge.rule.and).length === 0"
            @click="openBadge(badge.id)"
        />
    </div>
</template>

<style scoped lang="scss">
.badges {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
}
</style>