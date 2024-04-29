<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useAIStore } from '@/src/shared/stores/aiStore';

const AIStore = useAIStore();

const input = ref('');
const loading = ref(false);
const messages: Ref<HTMLDivElement | null> = ref(null);

async function handleChat() {
    if(!input.value) return;

    loading.value = true;
    AIStore.chat(input.value).then(() => {
        loading.value = false;
        messages.value?.scrollTo(0, messages.value.scrollHeight);
    });
    input.value = '';
    setTimeout(() => messages.value?.scrollTo(0, messages.value.scrollHeight), 10);
}

</script>

<template>
    <div class="container">
        <div ref="messages" class="messages">
            <p v-for="message of AIStore.getMessages" :key="message" :class="{ 'ai': message.role === 'assistant' }">
                {{ message.content }}
            </p>
            <p v-if="loading" class="ai loading">
                <span>.</span><span>.</span><span>.</span>
            </p>
        </div>
        <div class="input-group">
            <input
                v-model="input"
                class="input"
                type="text"
                placeholder="Type a message..."
                @keydown.enter="handleChat"
            />
            <button class="btn btn-form" @click="handleChat">Send</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.input-group {
    margin-top: 1rem;
    display: flex;
    gap: .5rem;

    input {
        flex: 1;
    }

    button {
        padding: .5rem;
        height: fit-content;

    }
}

.loading span {
    font-size: 1.5rem;
    animation: dot-flashing 1s infinite linear alternate;
    display: inline-block;
}

.loading span:nth-child(2) {
    animation-delay: 0.2s;
}

.loading span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes dot-flashing {
    0% { opacity: 1; }
    50%, 100% { opacity: 0.1; }
}

.loading {
    padding: 0 .5rem;
}

.messages {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    max-height: 400px;
    overflow-y: auto;
}

p {
    border: 2px solid var(--editor-blue);
    padding: .2rem .5rem;
    border-radius: 8px;
    margin: 0;

    width: 50%;
    align-self: flex-end;

    &.ai {
        border: solid 2px var(--border);
        align-self: flex-start;
    }
}
</style>