import { TestForm } from '@/tests/types';

async function openForm(window, testId: string) {
    const element = await window.getByTestId(testId);
    const elementBox = await element.boundingBox();
    
    const clickLocation = {
        x: 0,
        y: 0
    };
    
    //? epoc-node isn't squared, so we need to click in the middle
    if(testId === 'epoc-node') {
        clickLocation.x = elementBox.x + elementBox.width / 2;
        clickLocation.y = elementBox.y + elementBox.height / 2;
    } else {
        clickLocation.x = elementBox.x + 10;
        clickLocation.y = elementBox.y + 10;
    }
    
    await window.mouse.click(clickLocation.x, clickLocation.y);
}

export async function fillForm(window, form: TestForm, testId: string) {
    await openForm(window, testId);
    
    //TODO: detect form type
    
    for(const input of form.inputs) {
        switch(input.type) {
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
            
            default: {
                const inputLabel = await window.getByLabel(input.label, { exact: true });
                await inputLabel.fill(input.value as string);
                break;
            }
        }
    }
}