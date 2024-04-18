<script setup lang="ts">
import { Badge } from '@/src/shared/interfaces';
import { computed } from 'vue';
import { iconsPath } from '@/src/shared/data';
import { useEditorStore } from '@/src/shared/stores';


const props = defineProps<{
    viewMode?: boolean;
    icon?: string;
    inactive?: boolean;
    badge?: Badge;
    invalid?: boolean;
    deleteButton?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click'): void;
    (e: 'remove-icon'): void;
}>();

const editorStore = useEditorStore();

function onClick() {
    if (props.viewMode) return;

    emit('click');
}

const badgeItem = computed(() => {
    return {
        icon: getIconPath(),
        title: props.badge ? props.badge.title : '',
    };
});

function getIconPath() {
    const icon = props.badge ? props.badge.icon : props.icon;
    if (icon.startsWith('blob')) return icon;
    return icon.endsWith('.svg') ? `assets://${icon}` : `${iconsPath}/${icon}.svg`;
}

const isActive = computed(() => {
    return editorStore.openedBadgeId === props.badge?.id;
});

</script>

<template>
    <div class="badge">
        <button v-if="deleteButton" class="btn btn-close" @click="emit('remove-icon')"><i class="icon-x"></i></button>
        <div
            class="badge-background"
            :class="{ clickable: !viewMode && !inactive, inactive: inactive, active: isActive }"
            @mouseup.stop
            @click="onClick"
        >
            <div v-if="!inactive" class="badge-image">
                <img v-if="!invalid" src="/img/badge/shape.svg" class="image-shape" alt="badge" />
                <img v-if="invalid" src="/img/badge/shape-grey.svg" class="image-shape" alt="badge" />

                <img :src="badgeItem.icon" class="image-icon" alt="" />

                <img v-if="!invalid" src="/img/badge/shadow.svg" class="image-shadow" alt="" />
                <img v-else src="/img/badge/shadow-grey.svg" class="image-shadow" alt="" />
            </div>
            <div v-else class="empty-badge" />
        </div>
        <p class="badge-name">{{ badgeItem.title }}</p>
    </div>
</template>

<style scoped lang="scss">
.badge {
    position: relative;
    display: flex;
    flex-direction: column;

    .btn-close {
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        z-index: 200;
    }

    .clickable {
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            background: var(--content);
            box-shadow: 0 2px 5px 0 var(--shadow-outer);
        }
    }

    &-name {
        width: calc(100px + 4px);
        bottom: -1.5rem;

        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
        text-align: center;
    }

    &-background {
        user-select: none;
        background: var(--content);
        border-radius: 8px;
        position: relative;
        width: 100px;
        height: 100px;
        z-index: 150;
        border: 2px solid var(--border);

        &.inactive {
            border: 2px dashed var(--border);
        }

        &.active {
            border: 2px solid var(--editor-yellow)
        }
    }

    .empty-badge {
        width: 100%;
        height: 100%;
        background-size: 2.5rem auto;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2LjAgMTYuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNsaXBQYXRoIGlkPSJpMCI+PHBhdGggZD0iTTUyMDAsMCBMNTIwMCwxODU2IEwwLDE4NTYgTDAsMCBMNTIwMCwwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iaTEiPjxwYXRoIGQ9Ik03LjMxMjUsMCBDNy42MjM0MjE2NywwIDcuODc1LDAuMjUxMzY2OTczIDcuODc1LDAuNTYyMTQ4MDk0IEw3Ljg3NSw2Ljc0OTY0ODA5IEwxNC4wNjI1LDYuNzQ5NjQ4MDkgQzE0LjM3MTg3NDYsNi43NDk2NDgwOSAxNC42MjUsNy4wMDI3NzI5OSAxNC42MjUsNy4zMTIxNDgwOSBDMTQuNjI1LDcuNjIxNTIyNjcgMTQuMzcxODc0Niw3Ljg3NDY0ODA5IDE0LjA2MjUsNy44NzQ2NDgwOSBMNy44NzUsNy44NzQ2NDgwOSBMNy44NzUsMTQuMDYyMTQ4MSBDNy44NzUsMTQuMzczMDY5OCA3LjYyMzQyMTY3LDE0LjYyNSA3LjMxMjUsMTQuNjI1IEM3LjAwMTU3ODMzLDE0LjYyNSA2Ljc1LDE0LjM3MTUyMjcgNi43NSwxNC4wNjIxNDgxIEw2Ljc1LDcuODc0NjQ4MDkgTDAuNTYyNSw3Ljg3NDY0ODA5IEMwLjI1MTU3ODMzMSw3Ljg3NDY0ODA5IDAsNy42MjMyODExMiAwLDcuMzEyNSBDMCw3LjAwMjc3Mjk5IDAuMjUxNzE4ODc5LDYuNzQ5NjQ4MDkgMC41NjI1LDYuNzQ5NjQ4MDkgTDYuNzUsNi43NDk2NDgwOSBMNi43NSwwLjU2MjE0ODA5NCBDNi43NSwwLjI1MTIyNjQyNSA3LjAwMTU3ODMzLDAgNy4zMTI1LDAgWiI+PC9wYXRoPjwvY2xpcFBhdGg+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjEyLjAgLTEzMzguMCkiPjxnIGNsaXAtcGF0aD0idXJsKCNpMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk3OS4wIDExMDMuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2MS4wIDc2LjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNS4wIDAuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCAyMi4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMCA3NS4wKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC42ODc1IDUuMCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMCA0NC45Mzc4NTE5MDU4MjI5OCkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzLjAgMTMuMCkiPjxnIGNsaXAtcGF0aD0idXJsKCNpMSkiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDE0LjYyNSwwIDE0LjYyNSwxNC42MjUgMCwxNC42MjUgMCwwIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM4Q0ExQ0EiPjwvcG9seWdvbj48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==');
        background-repeat: no-repeat;
        background-position: right 50% top 50%;
    }

    &-image {
        position: absolute;
        width: 70%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
            width: 100%;
            height: auto;
            display: block;
        }

        .image-shape {
            width: 100%;
        }

        .image-shadow {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            width: 100%;
        }

        .image-icon {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
        }
    }
}
</style>
