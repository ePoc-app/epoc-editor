import { Verbs, ElementType, Condition, Badge } from '@/src/shared/interfaces';
import { Operand, Operands, Rule } from '@epoc/epoc-types/src/v2';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { useVueFlow} from '@vue-flow/core';
import { saveState } from '@/src/shared/services/undoRedo.service';
import { elementVerbs, verbs } from '@/src/shared/data';
import { generateContentId, graphService } from '@/src/shared/services';

const { findNode } = useVueFlow({id: 'main'});


export function getVerbs(type: ElementType): Verbs {
    if(!type || !elementVerbs[type]) return;

    const verbsKeys = elementVerbs[type];
    const res: Verbs = {};

    for (const key of verbsKeys) {
        res[key] = verbs[key];
    }

    return res;
}

export function getValueType(verbKey:string): 'number' | 'boolean' {
    if(!verbs[verbKey]) return;
    return verbs[verbKey].valueType;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getConditions(currentBadge: any): Condition[] {
    const rules = currentBadge.rule['and'];
    const conditions: Condition[] = [];

    for(const key1 in rules) {
        // key2 is the operator
        for(const key2 in rules[key1]) {
            const [verbs, value] = rules[key1][key2];

            const [type, element,verb] = verbs['var'].split('.');

            const conditionObj: Condition = {
                element,
                verb,
                value,
                elementType: type
            };

            conditions.push(conditionObj);
        }
    }
    return conditions;
}

export function createRule(entry: Condition[]): Rule {
    const rules: Operands = entry.map((item) => {
        const entryRule: Operand = {
            '===': [
                { 'var': `${item.elementType}.${item.element}.${item.verb}` }, item.value
            ]
        };
        return entryRule;
    }) as Operands;

    return { 'and': rules };
}


const phraseType = {
    'video': 'la vidéo',
    'chapter': 'le chapitre',
    'page': 'la page',
    'html': 'le texte',
    'audio': 'l\'audio',
    'activity': 'l\'activité',
    'question': 'la question'
};

const phraseVerb = {
    'started': {
        'true': 'Avoir commencé',
        'false': 'Ne pas avoir pas commencé'
    },
    'completed': {
        'true': 'Avoir terminé',
        'false': 'Ne pas avoir terminé'
    },
    'viewed': {
        'true': 'Avoir vu',
        'false': 'Ne pas avoir vu'
    },
    'read': {
        'true': 'Avoir lu',
        'false': 'Ne pas avoir lu'
    },
    'played': {
        'true': 'Avoir lancé',
        'false': 'Ne pas avoir lancé'
    },
    'watched': {
        'true': 'Avoir regardé',
        'false': 'Ne pas avoir regardé'
    },
    'listened': {
        'true': 'Avoir écouté',
        'false': 'Ne pas avoir écouté'
    },
    'attempted': {
        'true': 'Avoir tenté',
        'false': 'Ne pas avoir tenté'
    },
    'passed': {
        'true': 'Avoir réussi',
        'false': 'Avoir échoué'
    } ,
    'scored': 'Avoir obtenu un score d\'au moins'
};

export function createPhrase(condition: Condition, elementType: ElementType) {

    const { verb, value } = condition;
    let firstPart: string;
    if(verb === 'scored') {
        firstPart = `${phraseVerb[verb]} ${value} à`;
    }
    else {
        firstPart = `${phraseVerb[verb][value]}`;
    }

    return `${firstPart} ${phraseType[elementType]}`;
}

export function getConnectedBadges(contentId: string): Badge[] {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;

    const res: Badge[] = [];

    for(const key in badges) {
        const badge = badges[key];
        const conditions = getConditions(badge);
        const elements = conditions.map((condition) => condition.element);

        if(elements.includes(contentId)) {
            res.push({ ...badge, id: key });
        }
    }

    return res;
}

export function saveBadge(badge: Badge) {
    const editorStore = useEditorStore();

    badge.rule = createRule(editorStore.tempConditions);
}

export function deleteConnectedConditions(contentId: string) {
    const connectedBadges= getConnectedBadges(contentId);
    const badges = findNode('1').data.formValues.badges;

    for(const badge of connectedBadges) {
        const conditions = getConditions(badge);
        const newConditions = conditions.filter((condition) => condition.element !== contentId);

        badges[badge.id].rule = createRule(newConditions);
    }
}

export function deleteBadge(id: string) {
    saveState(true);

    const epocNode = findNode('1');
    delete epocNode.data.formValues.badges[id];
}

export function openBadge(badgeId: string) {
    const editorStore = useEditorStore();

    editorStore.openBadgeFormPanel(badgeId, 'custom');
}

export function addNewBadge() {
    const editorStore = useEditorStore();

    saveState(true);

    const epocNode = editorStore.getEpocNode;
    if(!epocNode.data.formValues['badges']) epocNode.data.formValues['badges'] = {};

    const id = generateContentId();
    epocNode.data.formValues['badges'][id] = {
        title: '',
        icon: '',
        description: '',
        rule: {
            'and': []
        }
    };

    openBadge(id);
}

export async function saveCustomIcon(icon: string) {
    const projectStore = useProjectStore();

    const iconPath = await graphService.importFile(icon, 'assets/icons');
    projectStore.addCustomIcon(iconPath);

    return iconPath;
}

export function isBadgeValid(badge): boolean {
    return badge.rule.and.length > 0;
}

export function isBadgeEmpty(badge): boolean {
    return badge.title === ''
        && badge.icon === ''
        && badge.description === ''
        && badge.rule.and.length === 0;
}

export function deleteEmptyBadges() {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;

    for(const badgeId in badges) {
        if(isBadgeEmpty(badges[badgeId])) delete badges[badgeId];
    }
}

export function getValidBadges(){
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;
    if(!badges) return null;
    
    const res = {};
    for(const badgeId in badges) {
        if(isBadgeValid(badges[badgeId])) res[badgeId] = badges[badgeId];
    }
    
    return res;
}