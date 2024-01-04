const { BrowserWindow } = require('electron');

const isDev = process.env.IS_DEV === 'true';

function getTemplateFromContext(callback, data) {
    const onClick = (label, data) => {
        callback(BrowserWindow.getFocusedWindow(), label, data);
    };
    const standardActions = [
        {
            label: 'Undo',
            click: () => onClick('undo'),
        },
        {
            label: 'Redo',
            click: () => onClick('redo'),
        },
    ];

    const menu = [];

    if (data.context === 'flow') {
        menu.push(
            {
                label: 'Ajouter',
                submenu: getPagesFromContext(onClick, { position: data.position }, 'addPage', data.context),
            },
            {
                label: 'Coller ici',
                click: () => onClick('paste', { position: data.position }),
            }
        );
    } else if (data.context === 'page' || data.context === 'activity' || data.context === 'pageWithQuestion') {
        if (isDev) {
            menu.push({
                label: 'Ajouter',
                submenu: getContentFromContext(onClick, { id: data.id }, data.context),
            });
        }
        menu.push(
            {
                label: 'Insérer après',
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertAfter', data.context),
            },
            {
                label: 'Insérer avant',
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertBefore', data.context),
            },
            {
                label: 'Dupliquer',
                click: () => onClick('duplicatePage', { id: data.id }),
            },
            {
                label: 'Supprimer',
                click: () => onClick('deleteNode', { id: data.id }),
            },
            {
                type: 'separator',
            },
            {
                label: 'Copier',
                click: () => onClick('copy', { id: data.id }),
            }
        );
    } else if (data.context === 'content') {
        menu.push(
            {
                label: 'Supprimer',
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
                label: 'Insérer à la fin',
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertAtEnd', data.context),
            },
            {
                label: 'Insérer au début',
                submenu: getPagesFromContext(onClick, { id: data.id }, 'insertAtStart', data.context),
            },
            {
                label: 'Supprimer',
                click: () => onClick('deleteNode', { id: data.id }),
            }
        );
    } else if (data.context === 'epoc') {
        menu.push({
            label: 'Ajouter un nouveau chapitre',
            click: () => onClick('addChapter'),
        });
    } else if (data.context === 'selection') {
        menu.push(
            {
                label: 'Supprimer',
                click: () => onClick('deleteSelection', { selection: data.selection }),
            },
            {
                label: 'Copier',
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
            label: 'Ajouter une page Texte',
            click: () => onClick(event, { type: 'text', ...data }),
        },
        {
            label: 'Ajouter une page Vidéo',
            click: () => onClick(event, { type: 'video', ...data }),
        },
        {
            label: 'Ajouter une page Audio',
            click: () => onClick(event, { type: 'audio', ...data }),
        },
    ];

    const questions = [
        {
            label: 'Ajouter une activité QCM',
            click: () => onClick(event, { type: 'choice', ...data }),
        },
        {
            label: 'Ajouter une activité Drag & Drop',
            click: () => onClick(event, { type: 'drag-and-drop', ...data }),
        },
        {
            label: 'Ajouter une activité Reorder',
            click: () => onClick(event, { type: 'reorder', ...data }),
        },
        {
            label: 'Ajouter une activité Swipe',
            click: () => onClick(event, { type: 'swipe', ...data }),
        },
        {
            label: 'Ajouter une activité Liste Déroulante',
            click: () => onClick(event, { type: 'dropdown-list', ...data }),
        },
    ];

    const menu = [...contents, { type: 'separator' }, ...questions];

    if (context === 'flow') {
        const addChapter = [
            { type: 'separator' },
            {
                label: 'Ajouter un chapitre',
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
            label: 'Ajouter une question QCM',
            click: () => onClick('addContent', { type: 'choice', ...data }),
        },
        {
            label: 'Ajouter une question Drag & Drop',
            click: () => onClick('addContent', { type: 'drag-and-drop', ...data }),
        },
        {
            label: 'Ajouter une question Reorder',
            click: () => onClick('addContent', { type: 'reorder', ...data }),
        },
        {
            label: 'Ajouter une question Swipe',
            click: () => onClick('addContent', { type: 'swipe', ...data }),
        },
        {
            label: 'Ajouter une question Liste Déroulante',
            click: () => onClick('addContent', { type: 'dropdown-list', ...data }),
        },
    ];

    const contents = [
        {
            label: 'Ajouter un contenu Texte',
            click: () => onClick('addContent', { type: 'text', ...data }),
        },
        {
            label: 'Ajouter un contenu Vidéo',
            click: () => onClick('addContent', { type: 'video', ...data }),
        },
        {
            label: 'Ajouter un contenu Audio',
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
