import { BackmatterEntity } from './backmatter-entity';
import {JSONObject} from "./types";
import {Manuscript} from "../model/manuscript";

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

export function serializeRelatedArticles(xmlDoc: Document, manuscript: Manuscript)  {
  console.log(xmlDoc.querySelectorAll('article-meta > related-article').length);
  xmlDoc.querySelectorAll('article-meta > related-article')
    .forEach((el: Element) => el.parentNode!.removeChild(el));

  const articleMeta = xmlDoc.querySelector('article-meta');
  manuscript.relatedArticles.forEach((article: RelatedArticle) => {
    const articleXml = xmlDoc.createElement('related-article');
    articleXml.setAttribute('ext-link-type', 'doi');
    articleXml.setAttribute('id', article.id);
    articleXml.setAttribute('related-article-type', article.articleType);
    articleXml.setAttribute('xlink:href', article.href);

    articleMeta!.appendChild(articleXml)
  })
}
