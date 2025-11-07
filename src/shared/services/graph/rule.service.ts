import type { Operand, Operands, Rule, Operators } from '@epoc/epoc-types/src/v2';
import type { ElementType, Condition, Badge, Verbs } from '@/src/shared/interfaces';
import { useEditorStore } from '@/src/shared/stores';
import { getActivities, getBadges, getChapters, getEpocNodeData, getPages } from '@/src/shared/services';
import { type ComputedRef, computed } from 'vue';
import { elementVerbs, verbs } from '@/src/shared/data';
import { i18n } from '@/i18n/config';
import type { GraphNode } from '@vue-flow/core';

/**
 * Helper function to normalize item structure
 */
function getItemData(item: Badge | GraphNode, badges: Badge[]) {
    if (badges && badges[item.id]) {
        return badges[item.id];
    }

    return (item as GraphNode).data.formValues;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getConditions(itemData: any): Condition[] {
    const conditions: Condition[] = [];
    if (!itemData?.rule) return conditions;

    const rules = itemData.rule['and'];
    if (!rules) return conditions;

    for (const key1 in rules) {
        for (const key2 in rules[key1]) {
            const [verbs, value] = rules[key1][key2];
            const [type, element, verb] = verbs['var'].split('.');

            conditions.push({
                element,
                verb,
                value,
                elementType: type,
            });
        }
    }

    return conditions;
}

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

export function saveRule(item: Badge | any) {
    const editorStore = useEditorStore();

    item.rule = createRule(editorStore.tempConditions);
}

export function getConnectedItems(contentId: string) {
    const badges = getBadges();
    const chapters = getChapters();
    const pages = getPages();
    const activities = getActivities();
    const items = [...badges, ...chapters, ...pages, ...activities];

    return items.filter((item) => {
        const itemData = getItemData(item, getEpocNodeData().badges);
        const conditions = getConditions(itemData);
        const elements = conditions.map((condition) => condition.element);

        return elements.includes(contentId);
    });
}

export function deleteConnectedConditions(contentId: string) {
    const connectedItems = getConnectedItems(contentId);

    for (const item of connectedItems) {
        const itemData = getItemData(item, getEpocNodeData().badges);
        const conditions = getConditions(itemData);
        const newConditions = conditions.filter((condition) => condition.element !== contentId);

        itemData.rule = createRule(newConditions);
    }
}

export function getVerbs(type: ElementType): ComputedRef<Verbs> {
    if (!type || !elementVerbs[type]) return;

    const verbsKeys = elementVerbs[type];
    const res: ComputedRef<Verbs> = computed(() => ({}));

    for (const key of verbsKeys) {
        res.value[key] = verbs.value[key];
    }

    return res;
}

export function getValueType(verbKey: string): 'number' | 'boolean' {
    if (!verbs.value[verbKey]) return;
    return verbs.value[verbKey].valueType;
}

const phraseType = computed(() => ({
    video: i18n.global.t('badge.phrase.type.video'),
    chapter: i18n.global.t('badge.phrase.type.chapter'),
    page: i18n.global.t('badge.phrase.type.page'),
    html: i18n.global.t('badge.phrase.type.html'),
    audio: i18n.global.t('badge.phrase.type.audio'),
    activity: i18n.global.t('badge.phrase.type.activity'),
    question: i18n.global.t('badge.phrase.type.question'),
}));

const phraseVerb = computed(() => ({
    started: {
        true: i18n.global.t('badge.phrase.verb.started.true'),
        false: i18n.global.t('badge.phrase.verb.started.false'),
    },
    completed: {
        true: i18n.global.t('badge.phrase.verb.completed.true'),
        false: i18n.global.t('badge.phrase.verb.completed.false'),
    },
    viewed: {
        true: i18n.global.t('badge.phrase.verb.viewed.true'),
        false: i18n.global.t('badge.phrase.verb.viewed.false'),
    },
    read: {
        true: i18n.global.t('badge.phrase.verb.read.true'),
        false: i18n.global.t('badge.phrase.verb.read.false'),
    },
    played: {
        true: i18n.global.t('badge.phrase.verb.played.true'),
        false: i18n.global.t('badge.phrase.verb.played.false'),
    },
    watched: {
        true: i18n.global.t('badge.phrase.verb.watched.true'),
        false: i18n.global.t('badge.phrase.verb.watched.false'),
    },
    listened: {
        true: i18n.global.t('badge.phrase.verb.listened.true'),
        false: i18n.global.t('badge.phrase.verb.listened.false'),
    },
    attempted: {
        true: i18n.global.t('badge.phrase.verb.attempted.true'),
        false: i18n.global.t('badge.phrase.verb.attempted.false'),
    },
    passed: {
        true: i18n.global.t('badge.phrase.verb.passed.true'),
        false: i18n.global.t('badge.phrase.verb.passed.false'),
    },
    scored: i18n.global.t('badge.phrase.verb.scored'),
}));

export function createPhrase(condition: Condition, elementType: ElementType) {
    const { verb, value } = condition;
    let firstPart: string;
    if (verb === 'scored') {
        firstPart = i18n.global.t('badge.phrase.scored', { value, verb: phraseVerb[verb] });
    } else {
        firstPart = `${phraseVerb.value[verb][value]}`;
    }

    return `${firstPart} ${phraseType.value[elementType]}`;
}
