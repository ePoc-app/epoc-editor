import { TestForm } from '@/tests/types';

async function openForm(window, testId: string) {
    const element = await window.getByTestId(testId);
    const elementBox = await element.boundingBox();
    
    const clickLocation = {
        x: elementBox.x + 10,
        y: elementBox.y + 10
    };
    await window.mouse.click(clickLocation.x, clickLocation.y);
}

export async function fillForm(window, form: TestForm, testId: string) {
    await openForm(window, testId);
    
    //TODO: detect form type
    
    for(const input of form.inputs) {
        switch(input.type) {
            case 'text': {
                const inputLabel = await window.getByLabel(input.label, { exact: true });
                await inputLabel.fill(input.value as string);
                break;
            }
            
            case 'html': {
                const label = await window.getByText(input.label);
                await label.click();
                await label.pressSequentially(input.value as string);
                break;
            }
        
            case 'checkbox': {
                const checkbox = await window.getByLabel(input.label);
                if(input.value) await checkbox.check();
                break;
            }
            
            case 'score': {
                const score = await window.getByLabel(input.label);
                await score.type(input.value as string);
                break;
            }
        }
    }
}