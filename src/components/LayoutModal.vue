<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    title: string;
    triggerClassList?: string;
    closeOnUnfocus?: boolean;
}>();

const isOpen = ref(false);

function open() {
    isOpen.value = true;
}

function close() {
    isOpen.value = false;
}

defineExpose({
    open,
    close,
    isOpen
})
</script>

<template>
    <div class="modal-container">
        <slot name="trigger" />
        <div v-if="isOpen" class="modal-backdrop" tabindex="0" @keyup.esc="close" @click="() => { if(closeOnUnfocus) close() }">
            <section role="dialog" class="modal" @click.stop>
                <header class="content">
                    <h2>{{ title }}</h2>
                    <button class="btn btn-close" @click="close"><i class="icon-x" /></button>
                </header>
                <div class="content">
                    <slot />
                </div>
                <footer class="content">
                    <slot name="footer" />
                </footer>
            </section>
        </div>
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
    display: flex;
    gap: 1rem;
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

.modal-container {
    display: flex;
}

.content {
    padding: 1rem;
}

.modal {
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
    width: 40rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    max-height: 85%;
    z-index: 200;
}
</style>
