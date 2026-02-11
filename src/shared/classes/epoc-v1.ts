import { Chapter, Content, Epoc, html, Parameters, uid } from '@epoc/epoc-types/src/v1';
import { Question } from '@epoc/epoc-types/src/v1/question';
import { Author } from '@epoc/epoc-types/src/v1/author';
import { Badge } from '@epoc/epoc-types/src/v1/badge';
import type { Publisher } from '@epoc/epoc-types/src/v1/publisher';

export class EpocV1 implements Epoc {
    id: string;
    editorVersion: string;
    lang: string;
    title: string;
    image: string;
    objectives: string[];
    summary: html;
    teaser: string;
    teaserSubtitles: { label: string; lang: string; src: string }[];
    thumbnail: string;
    version: string;
    edition: string;
    certificateDisabled?: boolean;
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
    chapterDuration: number;
    prerequisites: string[];
    license: { name: string; url: string; content: string };
    publisher: Publisher;
    tags: string[];

    constructor(
        id: string,
        editorVersion: string,
        title: string,
        image: string,
        objectives: string[],
        summary: html,
        teaser: string,
        teaserSubtitles: { label: string; lang: string; src: string }[],
        thumbnail: string,
        edition: string,
        certificateDisabled: boolean,
        certificateScore: number,
        certificateBadgeCount: number,
        authors: Author[],
        plugins: string[],
        chapterDuration: number,
        lastModif: string,
        lang: string,
        license: { name: string; url: string; content: string },
        publisher: Publisher,
        tags: string[],
    ) {
        this.version = '1';
        this.editorVersion = editorVersion;
        this.id = id;
        this.title = title;
        this.image = image;
        this.objectives = objectives;
        this.summary = summary;
        this.teaser = teaser;
        this.teaserSubtitles = teaserSubtitles;
        this.thumbnail = thumbnail;
        this.edition = edition;
        this.certificateDisabled = certificateDisabled;
        this.certificateScore = certificateScore;
        this.certificateBadgeCount = certificateBadgeCount;
        this.authors = authors;
        this.plugins = plugins;
        this.chapterDuration = chapterDuration;
        this.chapters = {};
        this.contents = {};
        this.badges = {};
        this.questions = {};
        this.lastModif = lastModif;
        this.lang = lang;
        this.license = license;
        this.publisher = publisher;
        this.tags = tags;
    }

    addChapter(id: uid, chapter: Chapter) {
        this.chapters[id] = chapter;
    }

    addContent(id: uid, content: Content): uid {
        this.contents[id] = content;
        return id;
    }

    addQuestion(id: string, question: Question): uid {
        this.questions[id] = question;
        return id;
    }
}
