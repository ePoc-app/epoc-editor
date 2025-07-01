import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';
import { computed, ComputedRef } from 'vue';
import { i18n } from '@/i18n/config';

export const textForm: ComputedRef<Form> = computed(() => {
    return {
        type: 'text',
        name: i18n.global.t('forms.content.text'),
        icon: 'icon-texte',
        buttons: contentButtons.value,
        fields: [
            {
                inputs: [
                    {
                        id: 'html',
                        type: 'html',
                        label: '',
                        value: '',
                        placeholder: i18n.global.t('type'),
                    },
                ],
            },
        ],
    };
});

export const videoForm: ComputedRef<Form> = computed(() => {
    return {
        type: 'video',
        name: i18n.global.t('forms.content.video.label'),
        icon: 'icon-video',
        buttons: contentButtons.value,
        fields: [
            {
                inputs: [
                    {
                        id: 'source',
                        type: 'video',
                        label: i18n.global.t('forms.content.video.label'),
                        placeholder: i18n.global.t('forms.content.video.placeholder'),
                        value: '',
                        accept: '.mp4',
                        hint: i18n.global.t('forms.content.video.hint', { format: '16:9 (720x480)' }),
                    },
                    {
                        id: 'summary',
                        type: 'html',
                        label: i18n.global.t('forms.content.summary'),
                        value: '',
                        placeholder: i18n.global.t('forms.type'),
                    },
                    {
                        id: 'transcript',
                        type: 'file',
                        label: i18n.global.t('forms.content.transcription.label'),
                        value: '',
                        placeholder: i18n.global.t('forms.content.transcription.placeholder'),
                        accept: '.txt,.vtt',
                        hint: i18n.global.t('forms.content.transcription.hint', { extensions: '.txt,.vtt' }),
                    },
                    {
                        id: 'poster',
                        type: 'file',
                        label: i18n.global.t('forms.content.thumbnail.label'),
                        value: '',
                        placeholder: i18n.global.t('forms.content.thumbnail.placeholder'),
                        accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                        hint: i18n.global.t('forms.content.thumbnail.hint'),
                    },
                ],
            },
            {
                name: i18n.global.t('forms.node.subtitle'),
                inputs: [
                    {
                        id: 'subtitles',
                        label: i18n.global.t('forms.node.subtitle'),
                        type: 'repeat',
                        value: [],
                        inputs: [
                            {
                                id: 'label',
                                type: 'text',
                                label: i18n.global.t('forms.content.subtitle.label'),
                                value: '',
                                placeholder: 'English',
                            },
                            {
                                id: 'lang',
                                type: 'text',
                                label: i18n.global.t('forms.content.subtitle.code'),
                                value: '',
                                placeholder: 'en',
                            },
                            {
                                id: 'src',
                                type: 'file',
                                label: i18n.global.t('global.file'),
                                value: '',
                                placeholder: i18n.global.t('forms.content.subtitle.placeholder'),
                                accept: '.vtt',
                                hint: i18n.global.t('forms.content.subtitle.hint', { extensions: '.vtt' }),
                            },
                        ],
                    },
                ],
            },
        ],
    };
});

export const audioForm: ComputedRef<Form> = computed(() => {
    return {
        type: 'audio',
        name: i18n.global.t('forms.content.audio.label'),
        icon: 'icon-audio',
        buttons: contentButtons.value,
        fields: [
            {
                inputs: [
                    {
                        id: 'source',
                        type: 'file',
                        label: i18n.global.t('forms.content.audio.label'),
                        placeholder: i18n.global.t('forms.content.audio.placeholder'),
                        value: '',
                        accept: '.mp3',
                    },
                    {
                        id: 'summary',
                        type: 'html',
                        label: i18n.global.t('forms.content.summary'),
                        value: '',
                        placeholder: i18n.global.t('forms.type'),
                    },
                    {
                        id: 'transcript',
                        type: 'file',
                        label: i18n.global.t('forms.content.transcription.label'),
                        placeholder: i18n.global.t('forms.content.transcription.placeholder'),
                        value: '',
                        accept: '.txt,.vtt',
                        hint: i18n.global.t('forms.content.transcription.hint', { extensions: '.txt,.vtt' }),
                    },
                    {
                        id: 'subtitles',
                        type: 'file',
                        label: i18n.global.t('forms.content.subtitle.label'),
                        value: '',
                        placeholder: i18n.global.t('forms.content.subtitle.placeholder'),
                        accept: '.vtt',
                        hint: i18n.global.t('forms.content.subtitle.hint', { extensions: '.vtt' }),
                    },
                ],
            },
        ],
    };
});

export const elementForms: ComputedRef<Form[]> = computed(() => [textForm.value, videoForm.value, audioForm.value]);
