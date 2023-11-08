<script setup lang="ts">
import BadgeItem from '@/src/features/badge/components/BadgeItem.vue';
import AddBadge from './components/AddBadge.vue';
import { computed, ComputedRef } from 'vue';
import { Badge } from '@/src/shared/interfaces';
import { addNewBadge, isBadgeValid, openBadge } from '@/src/shared/services';

const props = defineProps<{
    inputValue: string[];
}>();

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
            :invalid="!isBadgeValid(badge)"
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