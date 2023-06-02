import { Form } from '@/src/shared/interfaces';
import { contentButtons } from './formButtons.data';

export const textForm: Form = {
    type: 'text',
    name: 'Contenu',
    icon: 'icon-texte',
    buttons: contentButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'html',
                    type: 'html',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez un résumé...'
                }
            ],
        }
    ]
};

export const videoForm: Form = {
    type: 'video',
    name: 'Vidéo',
    icon: 'icon-video',
    buttons: contentButtons,
    fields: [
        {
            inputs: [
                {
                    id: 'source',
                    type: 'file',
                    label: 'Vidéo',
                    placeholder: 'Ajouter une vidéo',
                    value: '',
                    accept: '.mp4'
                },
                {
                    id: 'summary',
                    type: 'html',
                    label: 'Résumé',
                    value: '',
                    placeholder: 'Saisissez...'
                },
                {
                    id: 'transcript',
                    type: 'file',
                    label: 'Transcription',
                    value: '',
                    placeholder: 'Ajouter une transcription',
                    accept: '.txt,.vtt'
                },
                {
                    id: 'poster',
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp'
                }
            ]
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
                            placeholder: 'English'
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
                            accept: '.vtt'
                        }
                    ]
                }
            ]
        }
    ]
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
                    id: 'transcript',
                    type: 'file',
                    label: 'Transcription',
                    value: '',
                    placeholder: 'Ajouter une transcription',
                    accept: '.txt,.vtt'
                },
                {
                    id: 'poster',
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp'
                },
                {
                    id: 'subtitles',
                    type: 'file',
                    label: 'Sous-titres',
                    value: '',
                    placeholder: 'Ajouter des sous-titres',
                    accept: '.vtt'
                }
            ]
        }
    ]
};

export const elementForms: Form[] = [textForm, videoForm, audioForm];