import { TestForm, TestInput } from '@/tests/types';

async function openForm(window, testId: string) {
    const element = await window.getByTestId(testId);
    const elementBox = await element.boundingBox();

    const clickLocation = {
        x: 0,
        y: 0,
    };

    //? epoc-node isn't squared, so we need to click in the middle
    if (testId === 'epoc-node') {
        clickLocation.x = elementBox.x + elementBox.width / 2;
        clickLocation.y = elementBox.y + elementBox.height / 2;
    } else {
        clickLocation.x = elementBox.x + 10;
        clickLocation.y = elementBox.y + 10;
    }

    await window.mouse.click(clickLocation.x, clickLocation.y);
}

async function fillInput(target, input: TestInput) {
    switch (input.type) {
        case 'html': {
            const label = await target.getByText(input.label);
            await label.click();
            await label.pressSequentially(input.value as string);
            break;
        }

        case 'checkbox': {
            const checkbox = await target.getByLabel(input.label);
            if (input.value) await checkbox.check();
            break;
        }

        case 'score': {
            const score = await target.getByLabel(input.label);
            await score.type(input.value as string);
            break;
        }

        default: {
            const inputLabel = await target.getByLabel(input.label, { exact: true });
            await inputLabel.fill(input.value as string);
            break;
        }
    }
}

export async function fillForm(window, form: TestForm, testId: string) {
    await openForm(window, testId);

    for (const input of form.inputs) {
        if (input.type === 'repeat') {
            const addButton = await window.getByTestId(`${input.id}-add`);

            for (const item of input.cards) {
                const index = input.cards.indexOf(item);

                await addButton.click();
                const card = await window.getByTestId(`${input.id}-${index}`);

                for (const repeatInput of item.value) {
                    await fillInput(card, repeatInput);
                }
            }
        } else {
            await fillInput(window, input);
        }
    }
}
