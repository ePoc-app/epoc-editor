import { Form } from '@/src/shared/interfaces';
import { activityButtons, baseButtons, pageButtons } from './formButtons.data';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const conditionForm: Form = {
    type: 'condition',
    name: t('global.conditions'),
    icon: 'icon-condition',
    buttons: baseButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'condition1',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: t('forms.node.conditionPlaceholder', { condition: '1' }),
                },
                {
                    id: 'condition2',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: t('forms.node.conditionPlaceholder', { condition: '2' }),
                },
            ],
        },
    ],
};

export const legacyConditionForm: Form = {
    type: 'legacy-condition',
    name: 'Conditions (legacy)',
    icon: 'icon-condition',
    buttons: baseButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'label',
                    type: 'text',
                    label: t('global.label'),
                    value: '',
                    placeholder: t('forms.type'),
                },
            ],
        },
        {
            name: 'Choix',
            inputs: [
                {
                    id: 'choices',
                    label: t('forms.node.choice'),
                    type: 'repeat',
                    value: [t('forms.node.course', { course: 'A' }), t('forms.node.course', { course: 'B' })],
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: t('forms.node.course', { course: 'X' }),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('forms.node.conditional'),
            inputs: [
                {
                    id: 'conditionalFlag',
                    label: t('forms.content.text'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'id',
                            type: 'text',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                        {
                            id: 'choice',
                            type: 'select',
                            label: '',
                            placeholder: '',
                            value: '',
                            options: [],
                            linkedOptions: 'choices',
                        },
                    ],
                },
            ],
        },
    ],
};

export const chapterForm: Form = {
    type: 'chapter',
    name: t('global.chapter'),
    icon: 'icon-chapitre',
    buttons: baseButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: t('forms.node.title'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'duration',
                    type: 'score',
                    label: t('forms.node.duration'),
                    value: 0,
                },
            ],
        },
        {
            name: t('forms.node.objectives'),
            inputs: [
                {
                    id: 'objectives',
                    label: t('global.objective'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
    ],
};

export const epocForm: Form = {
    type: 'epoc',
    name: t('forms.node.about'),
    icon: 'icon-epoc',
    buttons: [],
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: t('forms.node.title'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'image',
                    type: 'file',
                    label: t('forms.node.cover.title'),
                    placeholder: t('forms.node.cover.placeholder'),
                    value: '',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: t('forms.node.cover.hint'),
                },
                {
                    id: 'teaser',
                    type: 'file',
                    label: t('forms.node.teaser.title'),
                    value: '',
                    placeholder: t('forms.node.teaser.placeholder'),
                    accept: '.mp4',
                    hint: t('forms.node.teaser.hint'),
                },
                {
                    id: 'thumbnail',
                    type: 'file',
                    label: t('forms.node.thumbnail.title'),
                    value: '',
                    placeholder: t('content.thumbnail.placeholder'),
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: t('forms.node.thumbnail.hint'),
                },
                {
                    id: 'summary',
                    type: 'html-text',
                    label: t('forms.node.presentation'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'edition',
                    type: 'text',
                    label: t('forms.node.edition'),
                    value: String(new Date().getFullYear()),
                },
            ],
        },
        {
            name: t('forms.node.author.title', 2),
            inputs: [
                {
                    id: 'authors',
                    label: t('forms.node.author.title', 1),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'name',
                            type: 'text',
                            label: t('global.name'),
                            placeholder: t('forms.node.author.placeholder'),
                            value: '',
                        },
                        {
                            id: 'image',
                            type: 'file',
                            label: t('forms.node.author.image.title'),
                            placeholder: t('forms.node.author.image.placeholder'),
                            value: '',
                            accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                            hint: t('forms.node.author.image.hint'),
                        },
                        {
                            id: 'title',
                            type: 'text',
                            label: t('forms.node.author.position.title'),
                            placeholder: t('forms.node.author.position.placeholder'),
                            value: '',
                            hint: t('forms.node.author.position.hint'),
                        },
                        {
                            id: 'description',
                            type: 'html-text',
                            label: t('forms.node.author.biography'),
                            placeholder: t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('forms.node.objectives'),
            inputs: [
                {
                    id: 'objectives',
                    label: t('global.objective'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: t('settings.title'),
            inputs: [
                {
                    id: 'certificateBadgeCount',
                    type: 'score',
                    label: t('forms.node.certificateBadge'),
                    value: 1,
                },
                {
                    id: 'certificateScore',
                    type: 'score',
                    label: t('forms.node.certificateScore'),
                    value: 10,
                    hint: t('forms.node.certificateScoreHint'),
                },
                {
                    id: 'chapterParameter',
                    type: 'text',
                    label: t('forms.node.chapterLabel'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'chapterDuration',
                    type: 'score',
                    label: t('forms.node.chapterDuration'),
                    value: 0,
                },
            ],
        },
        {
            name: t('forms.node.plugin.title', 2),
            inputs: [
                {
                    id: 'plugins',
                    label: t('forms.node.plugin.title', 1),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'script',
                            type: 'file',
                            label: t('forms.node.plugin.script'),
                            placeholder: t('forms.node.plugin.scriptPlaceholder'),
                            targetDirectory: 'plugins',
                            value: '',
                            accept: '.js',
                        },
                        {
                            id: 'template',
                            type: 'file',
                            label: t('forms.node.plugin.template'),
                            placeholder: t('forms.node.plugin.templatePlaceholder'),
                            targetDirectory: 'plugins',
                            value: '',
                            accept: 'html',
                        },
                    ],
                },
            ],
        },
        {
            name: t('forms.node.licence.title'),
            inputs: [
                {
                    id: 'licenceName',
                    type: 'text',
                    label: t('global.name'),
                    placeholder: 'CC-BY 4.0',
                    value: '',
                    hint: t('forms.node.licence.hint'),
                },
                {
                    id: 'licenceUrl',
                    type: 'text',
                    label: t('forms.node.licence.url'),
                    placeholder: t('forms.node.licence.urlPlaceholder'),
                    value: '',
                    hint: t('forms.node.licence.urlHint'),
                },
            ],
        },
    ],
};

export const pageForm: Form = {
    type: 'page',
    name: t('forms.node.page.title'),
    icon: 'icon-ecran',
    buttons: pageButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: t('forms.node.title'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: t('forms.node.subtitle'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'hidden',
                    type: 'checkbox',
                    label: t('forms.node.page.hidden'),
                    value: false,
                },
                {
                    id: 'conditional',
                    type: 'checkbox',
                    label: t('forms.node.page.conditional'),
                    value: false,
                    hint: t('forms.node.page.conditionalHint'),
                },
            ],
        },
        {
            name: t('forms.node.page.components'),
            inputs: [
                {
                    id: 'components',
                    label: t('forms.node.page.components'),
                    type: 'repeat',
                    value: [],
                    addButton: false,
                    inputs: [],
                },
            ],
        },
    ],
};

export const activityForm: Form = {
    type: 'activity',
    name: t('forms.node.activity'),
    icon: 'icon-ecran',
    buttons: activityButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: t('forms.node.title'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: t('forms.node.subtitle'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'summary',
                    type: 'textarea',
                    label: t('forms.content.summary'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'hidden',
                    type: 'checkbox',
                    label: t('forms.node.page.hidden'),
                    value: false,
                },
                {
                    id: 'conditional',
                    type: 'checkbox',
                    label: t('forms.node.page.conditional'),
                    value: false,
                    hint: t('forms.node.page.conditionalHint'),
                },
            ],
        },
        {
            name: t('forms.node.page.components'),
            inputs: [
                {
                    id: 'components',
                    label: t('forms.node.page.components'),
                    type: 'repeat',
                    value: [],
                    addButton: false,
                    inputs: [],
                },
            ],
        },
    ],
};

export const nodeForms: Form[] = [chapterForm, pageForm, epocForm, conditionForm, legacyConditionForm, activityForm];
