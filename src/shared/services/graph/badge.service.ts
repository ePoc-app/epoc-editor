import { Verbs, ElementType, Condition, Badge } from '@/src/shared/interfaces';
import { Operand, Operands, Rule } from '@epoc/epoc-types/src/v2';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';
import { saveState } from '@/src/shared/services/undoRedo.service';
import { elementVerbs, verbs } from '@/src/shared/data';
import { generateContentId, graphService } from '@/src/shared/services';
import { Operators } from '@epoc/epoc-types/dist/v2';

const { findNode } = useVueFlow('main');

/**
 * Get the verbs associated with an element type
 * @param {ElementType} type
 * @returns {Verbs} - An object containing the verbs with the associated ElementType
 * @returns {undefined} - If the type is not found
 */
export function getVerbs(type: ElementType): Verbs | undefined {
    if (!type || !elementVerbs[type]) return;

    const verbsKeys = elementVerbs[type];
    const res: Verbs = {};

    for (const key of verbsKeys) {
        res[key] = verbs[key];
    }

    return res;
}

/**
 * Get the type of the value associated with a verb
 * @param {string} verbKey
 * @returns {number | boolean} - The value type of the verb
 * @returns {undefined} - If the verb is not found
 */
export function getValueType(verbKey: string): 'number' | 'boolean' | undefined {
    if (!verbs[verbKey]) return;
    return verbs[verbKey].valueType;
}

/**
 * Get the formatted conditions of a badge
 * @param {any} currentBadge
 * @returns {Condition[]} - An array containing the conditions of the badge
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getConditions(currentBadge: any): Condition[] {
    const rules = currentBadge.rule['and'];
    const conditions: Condition[] = [];

    for (const key1 in rules) {
        // key2 is the operator
        for (const key2 in rules[key1]) {
            const [verbs, value] = rules[key1][key2];

            const [type, element, verb] = verbs['var'].split('.');

            const conditionObj: Condition = {
                element,
                verb,
                value,
                elementType: type,
            };

            conditions.push(conditionObj);
        }
    }
    return conditions;
}

/**
 * Create a new rule from an array of conditions
 * @param entry
 * @returns {Rule} - The rule created from the conditions
 */
export function createRule(entry: Condition[]): Rule {
    const rules: Operands = entry.map((item) => {
        const operator: Operators = item.verb === 'scored' ? '>=' : '===';
        const entryRule: Operand = {
            [operator]: [{ var: `${item.elementType}.${item.element}.${item.verb}` }, item.value],
        };
        return entryRule;
    }) as Operands;

    return { and: rules };
}

const phraseType = {
    video: 'la vidéo',
    chapter: 'le chapitre',
    page: 'la page',
    html: 'le texte',
    audio: "l'audio",
    activity: "l'évaluation",
    question: 'la question',
};

const phraseVerb = {
    started: {
        true: 'Avoir commencé',
        false: 'Ne pas avoir pas commencé',
    },
    completed: {
        true: 'Avoir terminé',
        false: 'Ne pas avoir terminé',
    },
    viewed: {
        true: 'Avoir vu',
        false: 'Ne pas avoir vu',
    },
    read: {
        true: 'Avoir lu',
        false: 'Ne pas avoir lu',
    },
    played: {
        true: 'Avoir lancé',
        false: 'Ne pas avoir lancé',
    },
    watched: {
        true: 'Avoir regardé',
        false: 'Ne pas avoir regardé',
    },
    listened: {
        true: 'Avoir écouté',
        false: 'Ne pas avoir écouté',
    },
    attempted: {
        true: 'Avoir tenté',
        false: 'Ne pas avoir tenté',
    },
    passed: {
        true: 'Avoir réussi',
        false: 'Avoir échoué',
    },
    scored: "Avoir obtenu un score d'au moins",
};

/**
 * Create a natural language phrase from a condition and an element type
 * @param {Condition} condition
 * @param {ElementType} elementType
 * @returns {string} - The phrase created from the condition and the element type
 */
export function createPhrase(condition: Condition, elementType: ElementType): string {
    const { verb, value } = condition;
    let firstPart: string;
    if (verb === 'scored') {
        firstPart = `${phraseVerb[verb]} ${value} à`;
    } else {
        firstPart = `${phraseVerb[verb][value]}`;
    }

    return `${firstPart} ${phraseType[elementType]}`;
}

/**
 * Get the badges connected to a content
 * @param {string} contentId
 * @returns {Badge[]}
 */
export function getConnectedBadges(contentId: string): Badge[] {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;

    const res: Badge[] = [];

    for (const key in badges) {
        const badge = badges[key];
        const conditions = getConditions(badge);
        const elements = conditions.map((condition) => condition.element);

        if (elements.includes(contentId)) {
            res.push({ ...badge, id: key });
        }
    }

    return res;
}

/**
 * Save badge by creating the rule from the conditions
 * @param {Badge} badge
 */
export function saveBadge(badge: Badge) {
    const editorStore = useEditorStore();

    badge.rule = createRule(editorStore.tempConditions);
}

/**
 * Delete conditions connected to a content & recalculate the related rules
 * @param {string} contentId
 */
export function deleteConnectedConditions(contentId: string) {
    const connectedBadges = getConnectedBadges(contentId);
    const badges = findNode('1').data.formValues.badges;

    for (const badge of connectedBadges) {
        const conditions = getConditions(badge);
        const newConditions = conditions.filter((condition) => condition.element !== contentId);

        badges[badge.id].rule = createRule(newConditions);
    }
}

/**
 * Delete a badge
 * @param {string} id
 */
export function deleteBadge(id: string) {
    saveState(true);

    const epocNode = findNode('1');
    delete epocNode.data.formValues.badges[id];
}

/**
 * Open the badge form panel
 * @param {string} badgeId
 */
export function openBadge(badgeId: string) {
    const editorStore = useEditorStore();

    editorStore.openBadgeFormPanel(badgeId, 'custom');
}

/**
 * Add a new empty badge
 */
export function addNewBadge() {
    const editorStore = useEditorStore();

    saveState(true);

    const epocNode = editorStore.getEpocNode;
    if (!epocNode.data.formValues['badges']) epocNode.data.formValues['badges'] = {};

    const id = generateContentId();
    epocNode.data.formValues['badges'][id] = {
        title: '',
        icon: '',
        description: '',
        rule: {
            and: [],
        },
    };

    openBadge(id);
}

/**
 * Save & add a custom icon to the project
 * @param {string} icon
 * @returns {Promise<string>} - The path of the icon
 */
export async function saveCustomIcon(icon: string): Promise<string> {
    const projectStore = useProjectStore();

    const iconPath = await graphService.importFile(icon, 'assets/icons');
    projectStore.addCustomIcon(iconPath);

    return iconPath;
}

/**
 * Verify if a badge is valid
 * @param {Badge} badge
 * @returns {boolean}
 */
export function isBadgeValid(badge: Badge): boolean {
    return badge.rule.and.length > 0;
}

/**
 * Verify if a badge is empty
 * @param {Badge} badge
 * @returns {boolean}
 */
export function isBadgeEmpty(badge: Badge): boolean {
    return badge.title === '' && badge.icon === '' && badge.description === '' && badge.rule.and.length === 0;
}

/**
 * Delete all empty badges
 */
export function deleteEmptyBadges() {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;

    for (const badgeId in badges) {
        if (isBadgeEmpty(badges[badgeId])) delete badges[badgeId];
    }
}

/**
 * Get all valid badges
 * @returns {object} - an object containing the valid badges
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValidBadges(): object{
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;
    if (!badges) return null;

    const res = {};
    for (const badgeId in badges) {
        if (isBadgeValid(badges[badgeId])) res[badgeId] = badges[badgeId];
    }

    return res;
}
