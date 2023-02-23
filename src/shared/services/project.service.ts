import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { useProjectStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';

declare const api: ApiInterface;

const { toObject, onNodesChange }  = useVueFlow({ id: 'main' });
const projectStore = useProjectStore();

function saveProjectData(): void {
    const data = JSON.stringify(toObject());
    api.send('writeProjectData', data);
}

function restoreProjectData(flow) {
    projectStore.restore(flow);
}

let timerId = null;

const debounceFunction = function (delay, cb) {
    clearTimeout(timerId);
    timerId = setTimeout(cb, delay);
};

onNodesChange(() => {
    debounceFunction(500, () => {
        saveProjectData();
    });
});

export const projectService = {
    restoreProjectData
};