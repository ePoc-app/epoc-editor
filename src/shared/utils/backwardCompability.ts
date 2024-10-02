import { useVueFlow } from '@vue-flow/core';

const { nodes } = useVueFlow('main');

const backwardCompatibilityMap = {
    '0.1.9-beta': () => {
        addChapterIndex();
    }
};

/**
 * Apply backward compatibility functions for versions lower than the given version
 * @param version
 */
export function applyBackwardCompatibility(version: string) {
    if(!version) version = '0.0.0-beta';

    for (const [versionKey, backwardCompatabilityFunction] of Object.entries(backwardCompatibilityMap)) {
        if (version < versionKey) {
            backwardCompatabilityFunction();
        }
    }
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
