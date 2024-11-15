import { useVueFlow } from '@vue-flow/core';
import { generateId } from '@/src/shared/services';

const { nodes, edges } = useVueFlow('main');

const backwardCompatibilityMap = {
    '0.1.9-beta': () => {
        addChapterIndex();
    },
    '0.1.10-beta': () => {
        redrawEdges();
        fixChapterId();
    }
};

/**
 * Apply backward compatibility functions for versions lower than the given version
 * @param version
 */
export function applyBackwardCompatibility(version: string) {
    if(!version) version = '0.0.0-beta';

    for (const [versionKey, backwardCompatabilityFunction] of Object.entries(backwardCompatibilityMap)) {
        if (compareVersions(version, versionKey) < 0) {
            backwardCompatabilityFunction();
        }
    }
}
function compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('-')[0].split('.');
    const v2Parts = version2.split('-')[0].split('.');

    const maxLength = Math.max(v1Parts.length, v2Parts.length);

    for (let i = 0; i < maxLength; i++) {
        const v1Part = parseInt(v1Parts[i] || '0', 10);
        const v2Part = parseInt(v2Parts[i] || '0', 10);

        if (v1Part > v2Part) {
            return 1;
        } else if (v1Part < v2Part) {
            return -1;
        }
    }

    const v1PreRelease = version1.split('-')[1] || '';
    const v2PreRelease = version2.split('-')[1] || '';

    if (v1PreRelease && !v2PreRelease) {
        return -1;
    } else if (!v1PreRelease && v2PreRelease) {
        return 1;
    } else if (v1PreRelease && v2PreRelease) {
        return v1PreRelease.localeCompare(v2PreRelease);
    }

    return 0;
}

/**
 * Add index property to chapters
 * @version 0.1.9-beta
 */
export function addChapterIndex() {
    const chapters = nodes.value.filter((node) => node.type === 'chapter');

    // Order chapters by y position
    chapters.sort((a, b) => a.position.y - b.position.y);

    chapters.forEach((chapter, index) => {
        chapter.data.index = index + 1;
    });
}

export function redrawEdges() {
    for (const edge of edges.value) {
        edge.targetHandle = undefined;
        edge.sourceHandle = undefined;
    }
}

export function fixChapterId() {
    const chapters = nodes.value.filter((node) => node.type === 'chapter');

    chapters.forEach((chapter) => {
        const oldId = chapter.id;
        chapter.id = generateId();
        edges.value.forEach((edge) => {
            if (edge.target === oldId) {
                edge.target = chapter.id;
            }
            if (edge.source === oldId) {
                edge.source = chapter.id;
            }
        });
    });
}
