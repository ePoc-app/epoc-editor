const { BrowserWindow } = require('electron');
const { t } = require('./utils');

const isDev = process.env.IS_DEV === 'true';

function getTemplateFromContext(callback, data) {
    const onClick = (label, data) => {
        callback(BrowserWindow.getFocusedWindow(), label, data);
    };
    const standardActions = [
        {
            label: t('menu.edit.undo'),
            click: () => onClick('undo'),
        },
        {
            label: t('menu.edit.redo'),
            click: () => onClick('redo'),
        },
    ];

    const menu = [];

    if (data.context === 'flow') {
        menu.push(
            {
                label: t('context.add'),
                submenu: getPagesFromContext(onClick, { position: data.position }, 'addPage', data.context),
            },
            {
                label: t('context.pasteHere'),
                click: () => onClick('paste', { position: data.position }),
            }
        );
    } else if (data.context === 'page' || data.context === 'activity' || data.context === 'pageWithQuestion') {
        if (isDev) {
            menu.push({
                label: t('context.add'),
                submenu: getContentFromContext(onClick, { id: data.id }, data.context),
            });
        }
        menu.push(
            {
                label: t('context.insertAfter'),
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertAfter', data.context),
            },
            {
                label: t('context.insertBefore'),
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertBefore', data.context),
            },
            {
                label: t('context.duplicate'),
                click: () => onClick('duplicatePage', { id: data.id }),
            },
            {
                label: t('context.delete'),
                click: () => onClick('deleteNode', { id: data.id }),
            },
            {
                type: 'separator',
            },
            {
                label: t('menu.edit.copy'),
                click: () => onClick('copy', { id: data.id }),
            },
            {
                label: t('context.swapNext'),
                click: () => onClick('swapNodeWithNext', { id: data.id }),
            },
            {
                label: t('context.swapPrevious'),
                click: () => onClick('swapNodeWithPrevious', { id: data.id }),
            }
        );
    } else if (data.context === 'content') {
        menu.push(
            {
                label: t('context.delete'),
                click: () => onClick('deleteContent', { pageId: data.pageId, id: data.id }),
            }
            // {
            //     label: 'Dupliquer',
            //     click: () => onClick('duplicateContent', { pageId: data.pageId, id: data.id })
            // },
        );
    } else if (data.context === 'chapter') {
        menu.push(
            {
                label: t('context.insertEnd'),
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertAtEnd', data.context),
            },
            {
                label: t('context.insertStart'),
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertAtStart', data.context),
            },
            {
                label: t('context.insertChapterBefore'),
                click: () => onClick('insertChapterBefore', { id: data.id }),
            },
            {
                label: t('context.insertChapterAfter'),
                click: () => onClick('insertChapterAfter', { id: data.id }),
            },
            {
                label: t('context.swapPrevious'),
                click: () => onClick('swapChapterWithPrevious', { id: data.id }),
            },
            {
                label: t('context.swapNext'),
                click: () => onClick('swapChapterWithNext', { id: data.id }),
            },
            {
                label: t('context.delete'),
                click: () => onClick('deleteNode', { id: data.id }),
            },
            {
                label: t('context.copyChapter'),
                click: () => onClick('copyChapter', { id: data.id }),
            }
        );
    } else if (data.context === 'epoc') {
        menu.push({
            label: t('context.addChapter'),
            click: () => onClick('addChapter'),
        });
    } else if (data.context === 'selection') {
        menu.push(
            {
                label: t('context.delete'),
                click: () => onClick('deleteSelection', { selection: data.selection }),
            },
            {
                label: t('menu.edit.copy'),
                click: () => onClick('copySelection', { selection: data.selection }),
            }
        );
    }

    menu.push({ type: 'separator' }, ...standardActions);

    return menu;
}

function getPagesFromContext(onClick, data, event, context) {
    const contents = [
        {
            label: t('context.addText'),
            click: () => onClick(event, { type: 'text', ...data }),
        },
        {
            label: t('context.addVideo'),
            click: () => onClick(event, { type: 'video', ...data }),
        },
        {
            label: t('context.addAudio'),
            click: () => onClick(event, { type: 'audio', ...data }),
        },
    ];

    const questions = [
        {
            label: t('context.addChoice'),
            click: () => onClick(event, { type: 'choice', ...data }),
        },
        {
            label: t('context.addDragAndDrop'),
            click: () => onClick(event, { type: 'drag-and-drop', ...data }),
        },
        {
            label: t('context.addReorder'),
            click: () => onClick(event, { type: 'reorder', ...data }),
        },
        {
            label: t('context.addSwipe'),
            click: () => onClick(event, { type: 'swipe', ...data }),
        },
        {
            label: t('context.addDropdown'),
            click: () => onClick(event, { type: 'dropdown-list', ...data }),
        },
        {
            label: t('context.addCustom'),
            click: () => onClick(event, { type: 'custom', ...data }),
        },
    ];

    const menu = [...contents, { type: 'separator' }, ...questions];

    if (context === 'flow') {
        const addChapter = [
            { type: 'separator' },
            {
                label: t('context.addChapter'),
                click: () => onClick('addChapter'),
            },
        ];
        return [...menu, ...addChapter];
    }

    return menu;
}

function getContentFromContext(onClick, data, context) {
    const questions = [
        {
            label: t('context.addQuestion'),
            click: () => onClick('addContent', { type: 'choice', ...data }),
        },
        {
            label: t('context.addDragAndDrop'),
            click: () => onClick('addContent', { type: 'drag-and-drop', ...data }),
        },
        {
            label: t('context.addReorder'),
            click: () => onClick('addContent', { type: 'reorder', ...data }),
        },
        {
            label: t('context.addSwipe'),
            click: () => onClick('addContent', { type: 'swipe', ...data }),
        },
        {
            label: t('context.addDropdownList'),
            click: () => onClick('addContent', { type: 'dropdown-list', ...data }),
        },
        {
            label: t('context.addCustom'),
            click: () => onClick('addContent', { type: 'custom', ...data }),
        },
    ];

    const contents = [
        {
            label: t('context.addText'),
            click: () => onClick('addContent', { type: 'text', ...data }),
        },
        {
            label: t('context.addVideo'),
            click: () => onClick('addContent', { type: 'video', ...data }),
        },
        {
            label: t('context.addAudio'),
            click: () => onClick('addContent', { type: 'audio', ...data }),
        },
    ];

    if (context === 'activity') {
        return questions;
    } else if (context === 'page') {
        return [...contents, { type: 'separator' }, ...questions];
    } else if (context === 'pageWithQuestion') {
        return contents;
    }
}

module.exports = {
    getTemplateFromContext,
};
