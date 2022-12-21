import { ePocProject } from '../interfaces';

export async function fetchRecentProjects(): Promise<ePocProject[]> {
    //@ts-ignore
    window.api.send('getRecentProjects');
    let res;
    return new Promise((resolve) => {
        //@ts-ignore
        window.api.receive('getRecentProjects', (data: string) => {
            res =  JSON.parse(data).epocs;
            resolve(res);
        });
    });
}