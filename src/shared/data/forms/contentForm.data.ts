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
            name: 'Sous-titres',
            inputs: [
                {
                    id: 'subtitles',
                    label: 'Sous-titres',
                    type: 'repeat',
                    value: [],
                    inputs: [
                        {
                            id: 'label',
                            type: 'text',
                            label: 'Nom de la langue',
                            value: '',
                            placeholder: 'English',
                        },
                        {
                            id: 'lang',
                            type: 'text',
                            label: 'Code de langue',
                            value: '',
                            placeholder: 'en',
                        },
                        {
                            id: 'src',
                            type: 'file',
                            label: 'Fichier',
                            value: '',
                            placeholder: 'Ajouter des sous-titres',
                            accept: '.vtt',
                            hint: 'Extensions acceptées : .vtt',
                        },
                    ],
                },
            ],
        },
    ],
};

export const audioForm: Form = {
    type: 'audio',
    name: 'Audio',
    icon: 'icon-audio',
    buttons: contentButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'source',
                    type: 'file',
                    label: 'Piste audio',
                    placeholder: 'Ajouter une piste audio',
                    value: '',
                    accept: '.mp3',
                },
                {
                    id: 'summary',
                    type: 'html',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez...',
                },
                {
                    id: 'transcript',
                    type: 'file',
                    label: 'Transcription',
                    value: '',
                    placeholder: 'Ajouter une transcription',
                    accept: '.txt,.vtt',
                    hint: "Extensions acceptées : .vtt, .txt <br>Pour les utilisateurs qui ne souhaitent pas ou ne sont pas en capacité d'écouter la piste audio",
                },
                {
                    id: 'subtitles',
                    type: 'file',
                    label: 'Sous-titres',
                    value: '',
                    placeholder: 'Ajouter des sous-titres',
                    accept: '.vtt',
                    hint: 'Extensions acceptées: .vtt',
                },
            ],
        },
    ],
};

export const elementForms: Form[] = [textForm, videoForm, audioForm];
