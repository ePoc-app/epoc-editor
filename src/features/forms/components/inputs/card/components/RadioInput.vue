<script setup lang="ts">

defineProps<{
    radioValue: number;
    index: number;
}>();

const emit = defineEmits<{
    (e: 'radioCheck', value: number): void;
}>();

</script>

<template>
    <div class="radio">
        <label class="group-label" for="radio-group">Réponse</label>
        <div id="radio-group" class="radio-group">
            <div class="radio-btn">
                <input
                    id="left"
                    :name="'pos' + index"
                    type="radio"
                    class="radio-input"
                    :checked="radioValue === 1"
                    @change="emit('radioCheck', 1)"
                >
                <label for="left">Choix gauche</label>
            </div>
            <div class="radio-btn">
                <input
                    id="right"
                    :name="'pos' + index"
                    type="radio"
                    class="radio-input"
                    :checked="radioValue === 2"
                    @change="emit('radioCheck', 2)"
                >
                <label for="right">Choix droite</label>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.radio {
    margin: 0 1rem 1rem 1rem;

    .radio-group {
        margin-top: .5rem;
        display: flex;
        justify-content: space-between;

        .radio-btn {
            display: flex;
            &:last-child {
            margin-right: 0.5rem;
            }

            label {
                margin-left: .5rem;
            }
            input[type="radio"] {
                appearance: none;
                width: 20px;
                height: 20px;
                border: 2px solid var(--border);
                border-radius: 50%;
                margin: 0;
                cursor: pointer;
                transform: translateY(0.075rem);
                display: grid;
                place-content: center;
                
                &::before {
                    content: '';
                    width: 12px;
                    height: 12px;
                    transform: scale(0);
                    transition: .1s transform ease-in-out;
                    border-radius: 50%;
                    background-color: var(--editor-blue);
                }

                &:checked::before {
                    transform: scale(1);
                }
            }
        }
    }
}
</style>