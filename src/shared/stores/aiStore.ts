import { defineStore } from 'pinia';
import { chat } from '@/src/shared/services/ai.service';

interface AIState {
    messages: {
        content: string;
        role: string
    }[];
}

export const useAIStore = defineStore('AI', {
    state: (): AIState => ({
        messages: [
            {
                content: 'You are a helpful assistant',
                role: 'system'
            }
        ]
    }),
    
    getters: {
        // Get all the messages but the first one
        getMessages() {
            return this.messages.slice(1);
        }
    },
    
    actions: {
        async chat(message: string) {
            console.log('chatting');
            
            this.messages.push({
                content: message,
                role: 'user'
            });
            
            const response = await chat(this.messages);
            
            this.messages.push(response);
        }
    }
});
