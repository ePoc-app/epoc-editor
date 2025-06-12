<script setup lang="ts">
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from 'reka-ui';
import Button from '@/src/components/ui/UiButton.vue';
import { ref } from 'vue';

export interface MenuItem {
    label: string;
    icon?: string;
    variant?: 'destructive';
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
}

defineProps<{
    items: MenuItem[][];
}>();

const toggleState = ref(false);

function getItemClasses(item: MenuItem) {
    return {
        'dropdown-item-destructive': item.variant === 'destructive',
        'dropdown-item': true,
    };
}
</script>

<template>
    <DropdownMenuRoot v-model:open="toggleState">
        <DropdownMenuTrigger aria-label="more" as-child>
            <Button size="icon" variant="outline">
                <i class="icon-more-vertical" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent class="dropdown-content" :side-offset="5">
                <template v-for="(menu, index) of items" :key="menu">
                    <DropdownMenuItem
                        v-for="item of menu"
                        :key="item.label"
                        :class="getItemClasses(item)"
                        :disabled="item.disabled"
                        @click="item.onClick"
                    >
                        <i v-if="item.icon" :class="[item.icon]" style="margin-right: 0.25rem" />
                        {{ item.label }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator v-if="index + 1 < items.length" class="dropdown-separator" />
                </template>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>

<style scoped lang="scss">
:deep(.dropdown-content) {
    min-width: 140px;
    background: white !important;
    border-radius: 8px;
    box-shadow: 0 1px 8px 0 var(--shadow);
    border: 1px solid var(--border);
    z-index: 9999 !important;
    position: relative;
    animation: dropdown-fade-in 0.2s ease-out;
    will-change: transform, opacity;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.dropdown-separator {
    height: 1px;
    background-color: var(--border);
}

.dropdown-content,
[data-radix-popper-content-wrapper] {
    z-index: 9999 !important;
}

@keyframes dropdown-fade-in {
    from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    margin: 0.3rem;
    transition: all 0.15s ease;
    outline: none;
    border: none;
    background: transparent;
    text-align: left;

    &:hover {
        background: var(--item-background);
    }

    &-destructive {
        color: #dc2626;
        &:hover {
            background: #fef2f2;
        }
    }

    &[data-disabled] {
        opacity: 0.6;
        pointer-events: none;
    }
}
</style>
