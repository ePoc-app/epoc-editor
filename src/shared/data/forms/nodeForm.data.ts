import { Form } from '@/src/shared/interfaces';
import { activityButtons, baseButtons, pageButtons } from './formButtons.data';
import { computed, ComputedRef } from 'vue';
import { i18n } from '@/i18n/config';
import { languages } from '../languages.data';

export const conditionForm: ComputedRef<Form> = computed(() => ({
    type: 'condition',
    name: i18n.global.t('global.conditions'),
    icon: 'icon-condition',
    buttons: baseButtons.value,
    fields: [
        {
            inputs: [
                {
                    id: 'condition1',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('forms.node.conditionPlaceholder', { condition: '1' }),
                },
                {
                    id: 'condition2',
                    type: 'text',
                    label: '',
                    value: '',
                    placeholder: i18n.global.t('forms.node.conditionPlaceholder', { condition: '2' }),
                },
            ],
        },
    ],
}));

export const legacyConditionForm: ComputedRef<Form> = computed(() => ({
    type: 'legacy-condition',
    name: 'Conditions (legacy)',
    icon: 'icon-condition',
    buttons: baseButtons.value,
    fields: [
        {
            inputs: [
                {
                    id: 'label',
                    type: 'text',
                    label: i18n.global.t('global.label'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
            ],
        },
        {
            name: 'Choix',
            inputs: [
                {
                    id: 'choices',
                    label: i18n.global.t('forms.node.choice'),
                    type: 'repeat',
                    value: [
                        i18n.global.t('forms.node.course', { course: 'A' }),
                        i18n.global.t('forms.node.course', { course: 'B' }),
                    ],
                    inputs: [
                        {
                            id: '',
                            type: 'text',
                            label: '',
                            placeholder: i18n.global.t('forms.node.course', { course: 'X' }),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.conditional'),
            inputs: [
                {
                    id: 'conditionalFlag',
                    label: i18n.global.t('forms.content.text'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'id',
                            type: 'text',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
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
}));

export const chapterForm: ComputedRef<Form> = computed(() => ({
    type: 'chapter',
    name: i18n.global.t('global.chapter'),
    icon: 'icon-chapitre',
    buttons: baseButtons.value,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: i18n.global.t('forms.node.title'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: i18n.global.t('forms.node.subtitle'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'duration',
                    type: 'score',
                    label: i18n.global.t('forms.node.duration'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.objectives'),
            inputs: [
                {
                    id: 'objectives',
                    label: i18n.global.t('global.objective'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
    ],
}));

export const epocForm: ComputedRef<Form> = computed(() => ({
    type: 'epoc',
    name: i18n.global.t('forms.node.about'),
    icon: 'icon-epoc',
    buttons: [],
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: i18n.global.t('forms.node.title'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'image',
                    type: 'file',
                    label: i18n.global.t('forms.node.cover.title'),
                    placeholder: i18n.global.t('forms.node.cover.placeholder'),
                    value: '',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: i18n.global.t('forms.node.cover.hint'),
                },
                {
                    id: 'teaser',
                    type: 'file',
                    label: i18n.global.t('forms.node.teaser.title'),
                    value: '',
                    placeholder: i18n.global.t('forms.node.teaser.placeholder'),
                    accept: '.mp4',
                    hint: i18n.global.t('forms.node.teaser.hint'),
                },
                {
                    id: 'thumbnail',
                    type: 'file',
                    label: i18n.global.t('forms.node.thumbnail.title'),
                    value: '',
                    placeholder: i18n.global.t('forms.content.thumbnail.placeholder'),
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: i18n.global.t('forms.node.thumbnail.hint'),
                },
                {
                    id: 'summary',
                    type: 'html-text',
                    label: i18n.global.t('forms.node.presentation'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'edition',
                    type: 'text',
                    label: i18n.global.t('forms.node.edition'),
                    value: String(new Date().getFullYear()),
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.author.title', 2),
            inputs: [
                {
                    id: 'authors',
                    label: i18n.global.t('forms.node.author.title', 1),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'name',
                            type: 'text',
                            label: i18n.global.t('global.name'),
                            placeholder: i18n.global.t('forms.node.author.placeholder'),
                            value: '',
                        },
                        {
                            id: 'image',
                            type: 'file',
                            label: i18n.global.t('forms.node.author.image.title'),
                            placeholder: i18n.global.t('forms.node.author.image.placeholder'),
                            value: '',
                            accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                            hint: i18n.global.t('forms.node.author.image.hint'),
                        },
                        {
                            id: 'title',
                            type: 'text',
                            label: i18n.global.t('forms.node.author.position.title'),
                            placeholder: i18n.global.t('forms.node.author.position.placeholder'),
                            value: '',
                            hint: i18n.global.t('forms.node.author.position.hint'),
                        },
                        {
                            id: 'description',
                            type: 'html-text',
                            label: i18n.global.t('forms.node.author.biography'),
                            placeholder: i18n.global.t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.objectives'),
            inputs: [
                {
                    id: 'objectives',
                    label: i18n.global.t('global.objective'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: '',
                            type: 'textarea',
                            label: '',
                            placeholder: i18n.global.t('forms.type'),
                            value: '',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('settings.title'),
            inputs: [
                {
                    id: 'certificateBadgeCount',
                    type: 'score',
                    label: i18n.global.t('forms.node.certificateBadge'),
                    value: 1,
                },
                {
                    id: 'certificateScore',
                    type: 'score',
                    label: i18n.global.t('forms.node.certificateScore'),
                    value: 10,
                    hint: i18n.global.t('forms.node.certificateScoreHint'),
                },
                {
                    id: 'chapterDuration',
                    type: 'score',
                    label: i18n.global.t('forms.node.chapterDuration'),
                    value: 0,
                },
            ],
        },
        {
            name: i18n.global.t('menu.app.lang'),
            inputs: [
                {
                    id: 'lang',
                    type: 'select',
                    label: '',
                    placeholder: '',
                    value: '',
                    options: [{ value: '', label: i18n.global.t('forms.node.languageSelection') }, ...languages],
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.plugin.title', 2),
            inputs: [
                {
                    id: 'plugins',
                    label: i18n.global.t('forms.node.plugin.title', 1),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'script',
                            type: 'file',
                            label: i18n.global.t('forms.node.plugin.script'),
                            placeholder: i18n.global.t('forms.node.plugin.scriptPlaceholder'),
                            targetDirectory: 'plugins',
                            value: '',
                            accept: '.js',
                        },
                        {
                            id: 'template',
                            type: 'file',
                            label: i18n.global.t('forms.node.plugin.template'),
                            placeholder: i18n.global.t('forms.node.plugin.templatePlaceholder'),
                            targetDirectory: 'plugins',
                            value: '',
                            accept: 'html',
                        },
                    ],
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.licence.title'),
            inputs: [
                {
                    id: 'licenceName',
                    type: 'text',
                    label: i18n.global.t('global.name'),
                    placeholder: 'CC-BY 4.0',
                    value: '',
                    hint: i18n.global.t('forms.node.licence.hint'),
                },
                {
                    id: 'licenceUrl',
                    type: 'text',
                    label: i18n.global.t('forms.node.licence.url'),
                    placeholder: i18n.global.t('forms.node.licence.urlPlaceholder'),
                    value: '',
                    hint: i18n.global.t('forms.node.licence.urlHint'),
                },
            ],
        },
    ],
}));

export const pageForm: ComputedRef<Form> = computed(() => ({
    type: 'page',
    name: i18n.global.t('forms.node.page.title'),
    icon: 'icon-ecran',
    buttons: pageButtons.value,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: i18n.global.t('forms.node.title'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: i18n.global.t('forms.node.subtitle'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'hidden',
                    type: 'checkbox',
                    label: i18n.global.t('forms.node.page.hidden'),
                    value: false,
                },
                {
                    id: 'conditional',
                    type: 'checkbox',
                    label: i18n.global.t('forms.node.page.conditional'),
                    value: false,
                    hint: i18n.global.t('forms.node.page.conditionalHint'),
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.page.components'),
            inputs: [
                {
                    id: 'components',
                    label: i18n.global.t('forms.node.page.components'),
                    type: 'repeat',
                    value: [],
                    addButton: false,
                    inputs: [],
                },
            ],
        },
    ],
}));

export const activityForm: ComputedRef<Form> = computed(() => ({
    type: 'activity',
    name: i18n.global.t('forms.node.activity'),
    icon: 'icon-ecran',
    buttons: activityButtons.value,
    fields: [
        {
            inputs: [
                {
                    id: 'title',
                    type: 'text',
                    label: i18n.global.t('forms.node.title'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'subtitle',
                    type: 'text',
                    label: i18n.global.t('forms.node.subtitle'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'summary',
                    type: 'textarea',
                    label: i18n.global.t('forms.content.summary'),
                    value: '',
                    placeholder: i18n.global.t('forms.type'),
                },
                {
                    id: 'hidden',
                    type: 'checkbox',
                    label: i18n.global.t('forms.node.page.hidden'),
                    value: false,
                },
                {
                    id: 'conditional',
                    type: 'checkbox',
                    label: i18n.global.t('forms.node.page.conditional'),
                    value: false,
                    hint: i18n.global.t('forms.node.page.conditionalHint'),
                },
            ],
        },
        {
            name: i18n.global.t('forms.node.page.components'),
            inputs: [
                {
                    id: 'components',
                    label: i18n.global.t('forms.node.page.components'),
                    type: 'repeat',
                    value: [],
                    addButton: false,
                    inputs: [],
                },
            ],
        },
    ],
}));

export const nodeForms: ComputedRef<Form[]> = computed(() => [
    chapterForm.value,
    pageForm.value,
    epocForm.value,
    conditionForm.value,
    legacyConditionForm.value,
    activityForm.value,
]);
