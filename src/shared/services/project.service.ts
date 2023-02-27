import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { useVueFlow } from '@vue-flow/core';

declare const api: ApiInterface;

const { toObject, onNodesChange }  = useVueFlow({ id: 'main' });

function saveProjectData(): void {
    const data = JSON.stringify(toObject());
    api.send('writeProjectData', data);
}

function importFile(filepath): Promise<string> {
    api.send('importFile', filepath);

    return new Promise((resolve) => {
        api.receiveOnce('fileImported', (data) => {
            resolve(data);
        });
    });
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
    importFile
};