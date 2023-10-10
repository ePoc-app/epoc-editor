import { Content } from '.';

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function dragAndDrop(window, source, dropLocation) {
    await source.hover();
    await window.mouse.down();

    await window.mouse.move(dropLocation.x, dropLocation.y);

    await window.mouse.up();
}

export async function addChapter(window) {
    await window.getByTestId('add-chapter').click();
}

export async function createLinkedNode(window, type, previousNodeBox) {
    const sideAction = window.getByTestId(`${type}-content`);

    const dropLocation = {
        x: previousNodeBox.x + previousNodeBox.width + 150,
        y: previousNodeBox.y + previousNodeBox.height / 2
    };

    await dragAndDrop(window, sideAction, dropLocation);

    await sleep(2000);
}
