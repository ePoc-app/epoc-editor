import { TestNode } from '../types';

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function dragAndDrop(window, source, dropLocation) {
    await source.hover();
    await window.mouse.down();
    await window.mouse.move(dropLocation.x, dropLocation.y);
    await window.mouse.up();
}

export async function dragAndDropTo(window, source, target) {
    await window.mouse.move(source.x, source.y);
    await window.mouse.down();
    await window.mouse.move(target.x, target.y);
    await window.mouse.up();
}

export async function addChapter(window) {
    await window.getByTestId('add-chapter').click();
}

export async function createLinkedNode(window, sourceNode: TestNode, newNode: TestNode ) {
    let sideAction = null;
    const questionMenu = await window.getByTestId('questions-menu');

    if(newNode.type === 'page') {
        sideAction = await window.getByTestId(`${newNode.contentType}-content`);
    } else if(newNode.type === 'activity') {
        await questionMenu.click();
        sideAction = await window.getByTestId(`${newNode.activityType}-question`);
    }

    const sourceNodeBox = await window.getByTestId(`${sourceNode.type}-${sourceNode.index}`).boundingBox();

    const dropLocation = {
        x: sourceNodeBox.x + sourceNodeBox.width + 100,
        y: sourceNodeBox.y + sourceNodeBox.height / 2
    };

    await dragAndDrop(window, sideAction, dropLocation);

    await linkNodes(window, sourceNode, newNode);
}

/*
    This function is used to add content to a page.
    ! Doesn't work for the moment, not sure i can make it work.
 */
export async function addContentToNode(window, type, node: TestNode) {
    const sideAction = await window.getByTestId(`${type}-content`);

    const nodeBox = await window.getByTestId(`${node.type}-${node.index}`).boundingBox();

    const dropLocation = {
        x: nodeBox.x + nodeBox.width / 2,
        y: nodeBox.y + nodeBox.height / 2
    };

    await dragAndDrop(window, sideAction, dropLocation);
}

export async function linkNodes(window, sourceNode: TestNode, targetNode: TestNode) {
    const sourceHandle = await window.getByTestId(`source-${sourceNode.type}-${sourceNode.index}`);
    const targetHandle = await window.getByTestId(`target-${targetNode.type}-${targetNode.index}`);

    const sourceBox = await sourceHandle.boundingBox();
    const targetBox = await targetHandle.boundingBox();

    const sourceLocation = {
        x: sourceBox.x + sourceBox.width / 2,
        y: sourceBox.y + sourceBox.height / 2
    };

    const targetLocation = {
        x: targetBox.x + targetBox.width / 2,
        y: targetBox.y + targetBox.height / 2
    };

    if(!sourceHandle || !targetHandle) return;

    await dragAndDropTo(window, sourceLocation, targetLocation);
}