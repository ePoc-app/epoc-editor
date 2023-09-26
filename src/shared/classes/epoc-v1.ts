import { Chapter, Content, Epoc, html, Parameters, uid } from '@epoc/epoc-types/src/v1';
import { Question } from '@epoc/epoc-types/src/v1/question';
import { Author } from '@epoc/epoc-types/src/v1/author';
import { Badge } from '@/src/shared/interfaces';

export class EpocV1 implements Epoc {
    id: string;
    title: string;
    image: string;
    objectives: string[];
    summary: html;
    teaser: string;
    thumbnail: string;
    version: string;
    edition: string;
    certificateScore: number;
    download: string;
    lastModif: string;
    chaptersCount: number;
    assessmentsCount: number;
    authors: Author[];
    parameters: Parameters;
    plugins: string[];
    chapters: Record<uid, Chapter>;
    contents: Record<uid, Content>;
    questions: Record<uid, Question>;
    badges: Record<uid, Badge>;
    certificateBadgeCount: number;

    constructor(
        id: string, title: string, image: string, objectives: string[], summary: html, teaser: string,
        thumbnail: string, edition: string, certificateScore: number, certificateBadgeCount: number, authors: Author[],
        plugins: string[], chapterParameter: string, lastModif: string
    ) {
        this.version = '1';
        this.id = id;
        this.title = title;
        this.image = image;
        this.objectives = objectives;
        this.summary = summary;
        this.teaser = teaser;
        this.thumbnail = thumbnail;
        this.edition = edition;
        this.certificateScore = certificateScore;
        this.certificateBadgeCount = certificateBadgeCount;
        this.authors = authors;
        this.plugins = plugins;
        this.parameters = {
            chapterParameter
        };
        this.chapters = {};
        this.contents = {};
        this.badges = {};
        this.questions = {};
        this.lastModif = lastModif;
    }

    addChapter(id: uid, chapter: Chapter) {
        this.chapters[id] = chapter;
    }

    addContent(id: uid, content: Content): uid {
        this.contents[id] = content;
        return id;
    }

    addQuestion(id: string, question: Question) : uid {
        this.questions[id] = question;
        return id;
    }
}