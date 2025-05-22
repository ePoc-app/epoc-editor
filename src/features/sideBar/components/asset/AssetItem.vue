<script setup lang="ts">
defineProps<{
    asset: {
        filename: string;
        type: string;
    };
}>();
</script>

<template>
    <div class="asset-item">
        <img v-if="asset.type === 'image'" :src="`assets://assets/${asset.filename}`" />
        <video v-else-if="asset.type === 'application'" :src="`assets://assets/${asset.filename}`" controls />
        <audio
            v-else-if="asset.type === 'audio'"
            :src="`assets://assets/${asset.filename}`"
            controls
            class="file-preview"
        />
        <div v-else-if="asset.type === 'text'" class="file-preview">
            <i class="icon-fichier"></i>
        </div>
        <p v-else>{{ asset.type }}</p>
        <div class="content">
            <span>{{ asset.filename }}</span>
            <button class="btn btn-form">
                <i class="icon-trash-2" />
            </button>
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
    overflow: hidden;

    .content {
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
            aspect-ratio: 1/1;
            width: 2rem;
            padding: 0.25rem;
            margin: 0;
        }
    }

    .file-preview {
        margin: auto;

        .icon-fichier {
            font-size: 5rem;
            margin: auto;
        }
    }
}
</style>
