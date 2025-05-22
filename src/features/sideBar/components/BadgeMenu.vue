<script setup lang="ts">
import SideMenu from '@/src/components/SideMenu.vue';
import { computed, ComputedRef } from 'vue';
import { Badge } from '@/src/shared/interfaces';
import { useVueFlow } from '@vue-flow/core';
import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import { addNewBadge, isBadgeValid, openBadge } from '@/src/shared/services';
import { useSideBarStore } from '../stores/sideBarStore';

const { findNode } = useVueFlow('main');

const sidebarStore = useSideBarStore();

const epocNode = findNode('1');
const rules = epocNode.data.formValues.badges;

const badges: ComputedRef<Badge[]> = computed(() => {
    const res: Badge[] = [];
    for (let value in rules) {
        const newBadge: Badge = {
            id: value,
            title: rules[value]['title'],
            description: rules[value]['description'],
            icon: rules[value]['icon'],
            rule: rules[value]['rule'],
        };
        res.push(newBadge);
    }

    return res;
});
</script>

<template>
    <SideMenu title="Badges" @close-menu="sidebarStore.badgeMenu = false">
        <div class="badges">
            <button class="add-badge" @click="addNewBadge">
                <i class="icon-plus-circle"></i>
            </button>
            <BadgeItem
                v-for="(badge, index) in badges"
                :key="index"
                :badge="badge"
                :invalid="!isBadgeValid(badge)"
                @click="openBadge(badge.id)"
            />
        </div>
    </SideMenu>
</template>

<style scoped lang="scss">
.badges {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
}

.add-badge {
    // content + border
    width: 104px;
    height: 104px;
    background: var(--content);
    border: 2px solid var(--border);
    border-radius: 8px;

    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
        background: var(--content);
        box-shadow: 0 2px 5px 0 var(--shadow-outer);
    }

    i {
        font-size: 2rem;
        color: var(--dashed-border);
    }
}
</style>
