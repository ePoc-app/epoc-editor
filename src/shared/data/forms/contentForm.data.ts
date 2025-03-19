import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';
import { i18n } from '@/src/i18n/config';

const { t } = i18n.global;

export const textForm: Form = {
    type: 'text',
    name: t('forms.content.text'),
    icon: 'icon-texte',
    buttons: contentButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'html',
                    type: 'html',
                    label: '',
                    value: '',
                    placeholder: t('type'),
                },
            ],
        },
    ],
};

export const videoForm: Form = {
    type: 'video',
    name: t('forms.content.video.label'),
    icon: 'icon-video',
    buttons: contentButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'source',
                    type: 'file',
                    label: t('forms.content.video.label'),
                    placeholder: t('forms.content.video.placeholder'),
                    value: '',
                    accept: '.mp4',
                    hint: t('forms.content.video.hint'),
                },
                {
                    id: 'summary',
                    type: 'html',
                    label: t('forms.content.summary'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'transcript',
                    type: 'file',
                    label: t('forms.content.transcription.label'),
                    value: '',
                    placeholder: t('forms.content.transcription.placeholder'),
                    accept: '.txt,.vtt',
                    hint: t('forms.content.transcription.hint', { extensions: '.txt,.vtt' }),
                },
                {
                    id: 'poster',
                    type: 'file',
                    label: t('forms.content.thumbnail.label'),
                    value: '',
                    placeholder: t('forms.content.thumbnail.placeholder'),
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: t('forms.content.thumbnail.hint'),
                },
            ],
        },
        {
            name: t('forms.node.subtitle'),
            inputs: [
                {
                    id: 'subtitles',
                    label: t('forms.node.subtitle'),
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: t('forms.content.subtitle.label'),
                            value: '',
                            placeholder: 'English',
                        },
                        {
                            id: 'lang',
                            type: 'text',
                            label: t('forms.content.subtitle.code'),
                            value: '',
                            placeholder: 'en',
                        },
                        {
                            id: 'src',
                            type: 'file',
                            label: t('global.file'),
                            value: '',
                            placeholder: t('forms.content.subtitle.placeholder'),
                            accept: '.vtt',
                            hint: t('forms.content.subtitle.hint', { extensions: '.vtt' }),
                        },
                    ],
                },
            ],
        },
    ],
};

export const audioForm: Form = {
    type: 'audio',
    name: t('forms.content.audio.label'),
    icon: 'icon-audio',
    buttons: contentButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'source',
                    type: 'file',
                    label: t('forms.content.audio.label'),
                    placeholder: t('forms.content.audio.placeholder'),
                    value: '',
                    accept: '.mp3',
                },
                {
                    id: 'summary',
                    type: 'html',
                    label: t('forms.content.summary'),
                    value: '',
                    placeholder: t('forms.type'),
                },
                {
                    id: 'transcript',
                    type: 'file',
                    label: t('forms.content.transcription.label'),
                    placeholder: t('forms.content.transcription.placeholder'),
                    value: '',
                    accept: '.txt,.vtt',
                    hint: t('forms.content.transcription.hint', { extensions: '.txt,.vtt' }),
                },
                {
                    id: 'subtitles',
                    type: 'file',
                    label: t('forms.content.subtitle.label'),
                    value: '',
                    placeholder: t('forms.content.subtitle.placeholder'),
                    accept: '.vtt',
                    hint: t('forms.content.subtitle.hint', { extensions: '.vtt' }),
                },
            ],
        },
    ],
};

export const elementForms: Form[] = [textForm, videoForm, audioForm];
