import { questions } from '@/src/shared/data';
import { NodeElement, SideAction } from '@/src/shared/interfaces';
import env from '@/src/shared/utils/env';

export function moveGuard(event) {
    const args: [NodeElement | SideAction, HTMLElement, NodeElement[]] = [
        event.draggedContext.element,
        event.to,
        event.relatedContext.list,
    ];
    const allowed = env.isDev ? canBeMoved(...args) : canBeMovedV1(...args);
    if (!allowed) {
        document.body.classList.remove('cursor-allowed');
        document.body.classList.add('cursor-not-allowed');
    } else {
        document.body.classList.remove('cursor-not-allowed');
        document.body.classList.add('cursor-allowed');
        event.to.classList.add('hover');
        event.to.addEventListener('dragleave', (e) => {
            if (e.relatedTarget.closest('.node-list') !== event.to) {
                event.to.classList.remove('hover');
            }
        });
    }
    return allowed;
}

function canBeMoved(elem: NodeElement | SideAction, to: HTMLElement, list: NodeElement[]): boolean {
    const type = getElemType(elem);
    if (to.classList.contains('page-node')) {
        const isQuestion = questions.value.some((q) => q.type === type);
        return (
            !isQuestion ||
            (isQuestion &&
                !list.some((e) => {
                    return questions.value.some((q) => q.type === e.action.type);
                }))
        );
    } else if (to.classList.contains('activity-node')) {
        return questions.value.some((q) => q.type === type);
    } else {
        return false;
    }
}

function canBeMovedV1(elem: NodeElement | SideAction, to: HTMLElement, list: NodeElement[]): boolean {
    const type = getElemType(elem);
    if (to.classList.contains('page-node')) {
        const isQuestion = questions.value.some((q) => q.type === type);
        return !isQuestion && list.length < 1;
    } else if (to.classList.contains('activity-node')) {
        return questions.value.some((q) => q.type === type);
    } else {
        return false;
    }
}

function getElemType(elem: NodeElement | SideAction) {
    return (
        'type' in elem ? elem.type
        : Array.isArray(elem) ? elem[0].type
        : elem.action.type
    );
}
