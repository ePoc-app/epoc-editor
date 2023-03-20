import { Chapter, Content, Epoc, html, Parameters, uid, Video } from '@epoc/epoc-types/dist/v1';
import { Question } from '@epoc/epoc-types/dist/v1/question';
import { Author } from '@epoc/epoc-types/dist/v1/author';

export class EpocV1 implements Epoc {
    id: string;
    title: string;
    image: string;
    objectives: string[];
    summary: html;
    teaser: string;
    thumbnail: string;
    version: string;
    certificateScore: number;
    download: string;
    lastModif: string;
    chaptersCount: number;
    assessmentsCount: number;
    authors:Author[];
    parameters: Parameters;
    chapters: Record<uid, Chapter>;
    contents: Record<uid, Content>;
    questions: Record<uid, Question>;

    constructor(
        id: string, title: string, image: string, objectives: string[], summary: html, teaser: string,
        thumbnail: string, version: string, certificateScore: number, authors: Author[],
        chapterParameter: string
    ) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.objectives = objectives;
        this.summary = summary;
        this.teaser = teaser;
        this.thumbnail = thumbnail;
        this.version = version;
        this.certificateScore = certificateScore;
        this.authors = authors;
        this.parameters = {
            chapterParameter
        };
        this.chapters = {};
        this.contents = {};
        this.questions = {};
        this.chaptersCount = 0;
        this.assessmentsCount = 0;
        this.download = '';
    }

    addChapter(id: uid, chapter: Chapter) {
        this.chapters[id] = chapter;
    }

    addContent(id: uid, content: Content) : uid {
        this.contents[id] = content;
        return id;
    }

    addQuestion(id, question) : uid {
        this.questions[id] = question;
        return id;
    }
}

export class VideoContent implements Video {

    constructor(content: Video) {
        
    }

    type: 'video';
    id: uid;
    poster: string;
    source: string;
    subtitles: { label: string; lang: string; src: string }[];
    summary: html;
    title: string;
    transcript: string;
}