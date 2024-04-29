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
                    label: '',
                    value: '',
                    placeholder: 'Saisissez un résumé...',
                },
                {
                    id: 'ai-chat',
                    type: 'ai-chat',
                    label: 'Assistant',
                    value: '',
                    placeholder: 'Posez une question...',
                }
            ],
        },
    ],
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
                    accept: '.mp4',
                    hint: 'Format recommandé: 16:9 (720x480)'
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
                    hint: 'Extensions acceptés: .vtt, .txt <br>Pour les utilisateurs qui ne souhaitent pas ou ne sont pas en capacité écouter la vidéo'
                },
                {
                    id: 'poster',
                    type: 'file',
                    label: 'Vignette',
                    value: '',
                    placeholder: 'Ajouter une vignette',
                    accept: '.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp',
                    hint: 'Format recommandé: idem à la vidéo'
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
                            hint: 'Extensions acceptés: .vtt'
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
                    hint: 'Extensions acceptés: .vtt, .txt <br>Pour les utilisateurs qui ne souhaitent pas ou ne sont pas en capacité écouter la piste audio'
                },
                {
                    id: 'subtitles',
                    type: 'file',
                    label: 'Sous-titres',
                    value: '',
                    placeholder: 'Ajouter des sous-titres',
                    accept: '.vtt',
                    hint: 'Extensions acceptés: .vtt'
                },
            ],
        },
    ],
};

export const elementForms: Form[] = [textForm, videoForm, audioForm];
