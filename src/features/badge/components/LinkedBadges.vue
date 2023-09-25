<script setup lang="ts">
import { getContentIdFromId } from '@/src/shared/services/graph';
import { computed } from 'vue';
import { getConnectedBadges } from '@/src/shared/services';
import { useEditorStore } from '@/src/shared/stores';

import BadgeItem from './BadgeItem.vue';

const editorStore = useEditorStore();

const props = defineProps<{
    elementId: string;
}>();

const contentId = getContentIdFromId(props.elementId);
const connectedBadges = computed(() => getConnectedBadges(contentId));

function openBadge(badgeId: string) {
    editorStore.openBadgeFormPanel(badgeId, 'custom');
}

</script>

<template>
    <template v-if="connectedBadges.length > 0">
        <h3 class="field-title">Badges associés</h3>
        <hr class="separator">
        <div class="badges">
            <BadgeItem
                v-for="(badge, index) of connectedBadges"
                :key="index"
                :invalid="Object.keys(badge.rule.and).length === 0"
                :badge="badge"
                @click="openBadge(badge.id)"
            />
        </div>
    </template>
</template>

<style scoped lang="scss">
.badges {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
}

</style>