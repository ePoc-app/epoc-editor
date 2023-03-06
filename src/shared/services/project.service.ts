import { ApiInterface } from '@/src/shared/interfaces/api.interface';
import { useProjectStore } from '../stores';
import { getConnectedEdges, useVueFlow } from '@vue-flow/core';

declare const api: ApiInterface;

const { toObject, onNodesChange, nodes, edges, findNode }  = useVueFlow({ id: 'main' });
const projectStore = useProjectStore();

function saveProjectData(): void {
    debounceFunction(500, () => {
        const data = JSON.stringify(toObject());
        api.send('writeProjectData', data);
    });
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
    saveProjectData();
});


function createContentJSON() {
    // const content = {};
    // content['chapters'] = {};
    // content['contents'] = {};
    // const startingNode = nodes.value.filter((node) => { return node.type === 'epoc' || node.type === 'chapter';});
    // startingNode.forEach((node) => {
    //     if(node.type === 'epoc') {
    //         const inputs = node.data.form.fields[0].inputs;
    //         content['lastModif'] = new Date().toISOString();
    //         content['title'] = inputs[0].value;
    //         content['image']= inputs[2].value;
    //         content['thumbnail'] = inputs[3].value;
    //         content['teaser'] = inputs[4].value;
    //         content['summary'] = inputs[5].value;
    //         content['id'] = inputs[6].value;
    //         content['edition'] = inputs[7].value;
    //         content['parameters'] = {
    //             'chapterParameters': inputs[1].value
    //         };

    //         //TODO
    //         content['author'] = {};
    //         content['certificateScore'] = 0;
    //         content['plugins'] = [];
    //     }
    //     if(node.type === 'chapter') {
    //         const chapter = {};
    //         const titleInputs = node.data.form.fields[0].inputs;
    //         chapter['title'] = titleInputs[0].value;
    //         const objectiveInputs = node.data.form.fields[1].inputs;
    //         const objectives = [];
    //         for(const objective of objectiveInputs) {
    //             objectives.push(objective.inputs[0].value);
    //         }
    //         chapter['objective'] = objectives;

    //         chapter['contents'] = [];
            
    //         let nextEdge = getNextEdge(node);
    //         while (nextEdge) {
    //             const nextNode = findNode(nextEdge.target);
    //             chapter['contents'].push(nextNode.data.contentId);
                
    //             const type = identifyTemplate(nextNode);
    //             const element = {};
    //             if(type === 'video') {
    //                 const titleInput = nextNode.data.form.fields[0].inputs[0].value;
    //                 const summaryInput = nextNode.data.elements[0].form.fields[0].inputs[1].value;
                    
    //                 element['type'] = 'video';
    //                 element['title'] = titleInput;
    //                 element['summary'] = summaryInput;
                    
    //                 //TODO
    //                 element['source'] = '';
    //                 element['subtitles'] = [];
    //                 element['transcript'] = '';
    //                 element['poster'] = '';
                    
    //             } else if(type === 'text') {
    //                 const titleInput = nextNode.data.form.fields[0].inputs[0].value;
    //                 const htmlInput = nextNode.data.elements[0].form.fields[0].inputs[0].value;

    //                 element['type'] = 'html';
    //                 element['title'] = titleInput;
    //                 element['html'] = htmlInput;

    //             } else {
    //                 const question = {};
    //                 const element = nextNode.data.elements[0];
    //                 question['type'] = element.action.type;

    //                 const fields = element.form.fields;

    //                 question['score'] = fields[0].inputs[1].value;
    //                 question['statement'] = fields[0].inputs[0].value;
    //                 question['']

    //                 console.log('question:',question);
    //                 console.log('node:', nextNode);
    //             }
    //             content['contents'][nextNode.data.contentId] = element;
                
    //             nextEdge = getNextEdge(nextNode);
    //         }
    //         content['chapters'][node.data.contentId] = chapter;
    //     }
    // });
    // console.log('content:', JSON.stringify(content));
}

function getNextEdge(node) {
    const edge = getConnectedEdges([node], edges.value).filter((edge) => edge.source === node.id)[0];
    return edge ? { target: edge.target, source: edge.source } : null;
}

function identifyTemplate(node) {
    if(node.data.type !== 'template'){
        return null;
    } else {
        return node.data.elements[0].action.type;
    }
}

export const projectService = {
    importFile,
    saveProjectData,
    createContentJSON,
};