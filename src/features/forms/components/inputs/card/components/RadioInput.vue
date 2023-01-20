<script setup lang="ts">

defineProps<{
   inputValue: string;
   label: string;
   pos: number
}>();

const emit = defineEmits<{
    (e: 'change', value: string): void;
}>();

</script>

<template>
    <div class="radio">
        <label class="group-label" for="radio-group">Réponse</label>
        <div id="radio-group" class="radio-group">
            <div class="radio-btn">
                <input
                    id="left"
                    :name="'pos' + pos"
                    type="radio"
                    class="radio-input"
                    :checked="inputValue === '1'"
                    @change="emit('change', '1')"
                >
                <label for="left">Choix gauche</label>
            </div>
            <div class="radio-btn">
                <input
                    id="right"
                    :name="'pos' + pos"
                    type="radio"
                    class="radio-input"
                    :checked="inputValue === '2'"
                    @change="emit('change', '2')"
                >
                <label for="right">Choix droite</label>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.radio {
    margin: 1rem 0 .5rem 0;

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