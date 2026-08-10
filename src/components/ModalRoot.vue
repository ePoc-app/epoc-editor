<script setup lang="ts">
import { ref, onMounted } from 'vue';

withDefaults(defineProps<{ closable?: boolean; title?: string }>(), { closable: true, title: undefined });
const emit = defineEmits<{ (e: 'close'): void }>();

const modalScreen = ref<HTMLElement | null>(null);

onMounted(() => {
    modalScreen.value.focus();
});
</script>

<template>
    <div ref="modalScreen" class="modal-backdrop" tabindex="0">
        <div class="modal">
            <div v-if="$slots.header || title" class="modal-header">
                <slot name="header">
                    <h2>{{ title }}</h2>
                </slot>
            </div>

            <button v-if="closable" class="btn btn-close" @click="emit('close')"><i class="icon-x" /></button>

            <div class="modal-body">
                <slot />
            </div>

            <div v-if="$slots.footer" class="modal-footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal {
    background: var(--content);
    position: relative;
    min-width: 30rem;
    border-radius: 10px;

    &-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border);
    }

    &-body {
        padding: 1.5rem;
    }

    &-footer {
        display: flex;
        align-items: center;
        padding: 1rem;
    }

    h2 {
        margin: 0;
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
</style>
