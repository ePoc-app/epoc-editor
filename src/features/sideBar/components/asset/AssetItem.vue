<script setup lang="ts">
import { default as DropdownMenu, type MenuItem } from '@/src/components/ui/UiDropdown.vue';
import { goToElement } from '@/src/shared/services';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();

const props = defineProps<{
    asset: {
        filename: string;
        type: string;
        linkedPages: string[];
    };
}>();

const emit = defineEmits<{
    (e: 'delete'): void;
}>();

const items: MenuItem[][] = [
    [
        {
            label: t('assets.goto'),
            icon: 'icon-arrow-up-right',
            onClick: () => {
                goToElement(props.asset.linkedPages[0]);
            },
            disabled: computed(() => Boolean(!props.asset.linkedPages.length)),
        },
    ],
    [
        {
            label: t('context.delete'),
            icon: 'icon-trash-2',
            variant: 'destructive',
            onClick: () => {
                emit('delete');
            },
            disabled: computed(() => Boolean(props.asset.linkedPages.length)),
            tooltip: `Cannot delete items that are currently in use (used by ${props.asset.linkedPages.length} elements)`,
        },
    ],
];
</script>

<template>
    <div class="asset-item">
        <div class="asset-preview">
            <img v-if="asset.type === 'image'" :src="`assets://assets/${asset.filename}`" />
            <video v-else-if="asset.type === 'application'" :src="`assets://assets/${asset.filename}`" controls />
            <audio v-else-if="asset.type === 'audio'" :src="`assets://assets/${asset.filename}`" controls />
            <div v-else-if="asset.type === 'text'" class="file-preview">
                <i class="icon-fichier"></i>
            </div>
            <p v-else>{{ asset.type }}</p>
        </div>
        <div class="content">
            <a v-if="asset.linkedPages.length" class="item-link" @click="goToElement(asset.linkedPages[0])">
                {{ asset.filename }}
            </a>
            <p v-else class="item-link">{{ asset.filename }}</p>
            <DropdownMenu :items="items" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.asset-item {
    width: 325px;
    border: 1px solid black;
    border-radius: 8px;
    border: 2px solid var(--border);
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .content {
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;

        .item-link {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            flex-shrink: 1;
            min-width: 0;
        }

        button {
            width: 2rem;
            height: 2rem;
            padding: 0.25rem;
            margin-left: 0.25rem;
        }
    }

    .asset-preview {
        flex: 1;
        object-fit: contain;
        overflow: hidden;
        display: flex;
        padding: 0.5rem;

        * {
            max-width: 100%;
            margin: auto;
            border-radius: 8px;
        }
    }

    .file-preview {
        .icon-fichier {
            font-size: 5rem;
            margin: auto;
        }
    }

    a {
        color: var(--editor-blue);
        font-weight: 600;
        cursor: pointer;
    }
}
</style>
