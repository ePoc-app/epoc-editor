import { ePocProject } from '@/src/shared/interfaces';

export async function openEPOC(): Promise<ePocProject> {
    //@ts-ignore
    window.api.send('openEPOC');

    return new Promise((resolve, reject) => {
        //@ts-ignore
        window.api.receive('sendEPOC', (data: string) => {
            resolve(JSON.parse(data));
        });
    });
}