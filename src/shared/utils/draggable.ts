import { questions } from '@/src/shared/data';

export function moveGuard(event) {
    const allowed = canBeMoved(event.draggedContext.element, event.to, event.relatedContext.list);
    if (!allowed) {
        document.body.classList.remove('cursor-allowed');
        document.body.classList.add('cursor-not-allowed');
    } else {
        document.body.classList.remove('cursor-not-allowed');
        document.body.classList.add('cursor-allowed');
    }
    return allowed;
}

function canBeMoved (elem, to, list) : boolean {
    const type = elem.type ? elem.type : Array.isArray(elem) ? elem[0].type : elem.action.type;
    if (to.classList.contains('page-node')) {
        const isQuestion = questions.some(q => q.type === type);
        return !isQuestion || (isQuestion && !list.some(e => {
            return questions.some(q => q.type === e.action.type);
        }));
    } else if (to.classList.contains('activity-node')) {
        return questions.some(q => q.type === type);
    } else {
        return false;
    }
}