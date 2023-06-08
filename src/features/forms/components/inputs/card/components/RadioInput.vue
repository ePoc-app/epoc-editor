<script setup lang="ts">

defineProps<{
   inputValue: string;
   label: string;
   pos: number
}>();

const emit = defineEmits<{
    (e: 'change', value: string): void;
    (e: 'add-undo-action', value: {oldValue: string, newValue: string}): void;
}>();

function onChange(value: string) {
    emit('change', value);
    
    const oldValue = value === '1' ? '2' : '1';
    emit('add-undo-action', {oldValue, newValue: value});
}

</script>

<template>
    <div class="radio">
        <label class="group-label" :for="String(pos)">Réponse</label>
        <div :id="String(pos)" class="radio-group">
            <div class="radio-btn">
                <input
                    :id="'left-' + String(pos)"
                    :name="'pos' + pos"
                    type="radio"
                    class="radio-input"
                    :checked="inputValue === '1'"
                    @change="onChange('1')"
                >
                <label :for="'left-' + String(pos)">Choix gauche</label>
            </div>
            <div class="radio-btn">
                <input
                    :id="'right-' + String(pos)"
                    :name="'pos' + pos"
                    type="radio"
                    class="radio-input"
                    :checked="inputValue === '2'"
                    @change="onChange('2')"
                >
                <label :for="'right-' + String(pos)">Choix droite</label>
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
                cursor: pointer;
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