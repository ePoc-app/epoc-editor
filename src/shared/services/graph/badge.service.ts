import { Badge } from '@/src/shared/interfaces';
import { useEditorStore, useProjectStore } from '@/src/shared/stores';
import { useVueFlow } from '@vue-flow/core';
import { saveState } from '@/src/shared/services/undoRedo.service';
import { generateContentId, graphService } from '@/src/shared/services';
import { getConditions } from '@/src/shared/services';

const { findNode } = useVueFlow('main');

export function getBadges(): Badge[] {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;

    if (!badges) {
        return [];
    }

    return Object.keys(badges).map((key) => ({ ...badges[key], id: key }));
}

export function getConnectedBadges(contentId: string): Badge[] {
    const badges = getBadges();

    return badges.filter((badge) => {
        const conditions = getConditions(badge);
        const elements = conditions.map((condition) => condition.element);
        return elements.includes(contentId);
    });
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
    return badge.title === '' && badge.icon === '' && badge.description === '' && badge.rule.and.length === 0;
}

export function deleteEmptyBadges() {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;

    for (const badgeId in badges) {
        if (isBadgeEmpty(badges[badgeId])) delete badges[badgeId];
    }
}

export function getValidBadges() {
    const epocNode = findNode('1');
    const badges = epocNode.data.formValues.badges;
    if (!badges) return null;

    const res = {};
    for (const badgeId in badges) {
        if (isBadgeValid(badges[badgeId])) res[badgeId] = badges[badgeId];
    }

    return res;
}
