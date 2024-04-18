<script setup lang="ts">
defineProps<{
    title: string;
}>();

const emits = defineEmits<{
    (e: 'close'): void;
}>();

function close() {
    emits('close');
}

</script>

<template>
    <div class="side-menu">
        <header>
            <h3>{{ title }}</h3>
            <button class="btn btn-close" @click="close"><i class="icon-x"></i></button>
        </header>

        <hr class="separator" />

        <div class="side-menu-content">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.side-menu {
    z-index: 100;
    position: fixed;
    top: 80px;
    left: 100px;
    height: 100vh;
    background-color: white;
    border-right: 1px solid var(--border);

    width: fit-content;

    header {
        h3 {
            margin-left: 1rem;
        }
    }

    hr {
        margin-bottom: 1rem;
    }

    &-content {
        padding: 1rem;
    }
}
</style>