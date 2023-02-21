const events = require('events');

class BackendStore {
    constructor (){
        this.state = {
            currentProject: null
        };

        this.em = new events.EventEmitter();
    }

    updateState (key, value){
        this.state[key] = value;
        this.em.emit('stateUpdated');
    }
}
const store = new BackendStore();
module.exports = store;