import { EventEmitter } from 'events';

class BackendStore {
    constructor() {
        this.state = {
            projects: {},
        };

        this.em = new EventEmitter();
    }

    updateState(key, value) {
        this.state[key] = { ...this.state[key], ...value };
        this.em.emit('stateUpdated');
    }
}

const store = new BackendStore();
export default store;
