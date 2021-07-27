import { BackmatterEntity } from './backmatter-entity';
import { JSONObject } from './types';
import { Manuscript } from '../model/manuscript';
import { DOMImplementation } from 'xmldom';

export class RelatedArticle extends BackmatterEntity {
    public articleType: string = '';
    public href: string = '';

    constructor(data?: JSONObject | Element) {
        super();
        this.createEntity(data);
    }

    public clone(): RelatedArticle {
        const newArticle = new RelatedArticle();
        newArticle._id = this._id;
        newArticle.articleType = this.articleType;
        newArticle.href = this.href;
        return newArticle;
    }

    public toXml(listIndex: number): Element {
        const xmlDoc = new DOMImplementation().createDocument(null, null);
        const articleXml = xmlDoc.createElement('related-article');
        articleXml.setAttribute('ext-link-type', 'doi');
        articleXml.setAttribute('id', `ra${listIndex}`);
        articleXml.setAttribute('related-article-type', this.articleType);
        articleXml.setAttribute('xlink:href', this.href);
        return articleXml;
    }

    protected fromXML(xmlNode: Element): void {
        this._id = xmlNode.getAttribute('id') || this.id;
        this.articleType = xmlNode.getAttribute('related-article-type') || '';
        this.href = xmlNode.getAttribute('xlink:href') || '';
    }

    protected fromJSON(json: JSONObject): void {
        this._id = (json._id as string) || this.id;
        this.articleType = json.articleType as string;
        this.href = json.href as string;
    }

    protected createBlank(): void {
        this.articleType = '';
        this.href = '';
    }
}

export function createRelatedArticleState(relatedArticlesXml: Element[]): RelatedArticle[] {
    return relatedArticlesXml.map((xml: Element) => new RelatedArticle(xml));
}

export function serializeRelatedArticles(xmlDoc: Document, manuscript: Manuscript) {
    xmlDoc.querySelectorAll('article-meta > related-article').forEach((el: Element) => el.parentNode!.removeChild(el));

    const articleMeta = xmlDoc.querySelector('article-meta');
    manuscript.relatedArticles.forEach((article: RelatedArticle, index: number) => {
        articleMeta!.appendChild(article.toXml(index + 1));
    });
}
