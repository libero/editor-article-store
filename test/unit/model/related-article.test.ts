/**
 * @jest-environment jsdom
 */
import {
  createRelatedArticleState,
  RelatedArticle,
  serializeRelatedArticles,
} from "../../../src/model/related-article";
import { Manuscript } from "../../../src/model/manuscript";
import {parseXML} from "../../../src/xml-exporter/xml-utils";
import xmldom from "xmldom";

jest.mock("uuid", () => ({
  v4: () => "unique_id",
}));

describe("Related Article model", () => {
  describe("Model class", () => {
    it("creates a related article from object ", () => {
      expect(
        new RelatedArticle({ articleType: "SOME_ARTICLE_TYPE", href: "URL" })
      ).toMatchSnapshot();
    });

    it("creates a related article from xml", () => {
      const el = document.createElement("related-article");
      el.setAttribute("related-article-type", "commentary-article");
      el.setAttribute("xlink:href", "10.7554/eLife.48498");
      expect(new RelatedArticle(el)).toMatchSnapshot();
    });

    it("creates an empty article if attributes are missing", () => {
      const el = document.createElement("related-article");
      expect(new RelatedArticle(el)).toMatchSnapshot();
    });

    it("creates an empty related article", () => {
      expect(new RelatedArticle()).toMatchSnapshot();
    });

    it("clones a related article", () => {
      const article = new RelatedArticle({
        articleType: "SOME_ARTICLE_TYPE",
        href: "URL",
      });
      const clonedArticle = article.clone();
      expect(clonedArticle).not.toBe(article);
      expect(clonedArticle).toEqual(article);
    });
    describe('toXml', () => {
      const xmlSerializer = new xmldom.XMLSerializer();
      it('serializes an empty relatedArticle to xml', () => {
        const relatedArticle = new RelatedArticle();
        expect(xmlSerializer.serializeToString(relatedArticle.toXml())).toBe('<related-article ext-link-type="doi" id="unique_id" related-article-type="" xlink:href=""/>')
      });
    });
  });

  describe("Related articles state", () => {
    it("creates related article state", () => {
      const el = document.createElement("div");
      el.innerHTML = `
          <related-article related-article-type="commentary-article" xlink:href="10.7554/eLife.48496"/>
          <related-article related-article-type="commentary-article" xlink:href="10.7554/eLife.48497"/>
          <related-article related-article-type="commentary-article" xlink:href="10.7554/eLife.48498"/>
      `;
      const state = createRelatedArticleState(
        Array.from(el.querySelectorAll("related-article"))
      );
      expect(state.length).toBe(3);
      expect(state[0].href).toBe("10.7554/eLife.48496");
      expect(state[1].href).toBe("10.7554/eLife.48497");
      expect(state[2].href).toBe("10.7554/eLife.48498");
    });

    it("creates empty state", () => {
      const state = createRelatedArticleState([]);
      expect(state.length).toBe(0);
    });
  });

  describe("Related articles XML", () => {
    const xmlSerializer = new xmldom.XMLSerializer();
    it('serializes an empty relatedArticles array', () => {
      const xmlDoc = parseXML('<article><article-meta/></article>');
      serializeRelatedArticles(xmlDoc, ({
        relatedArticles: []
      } as unknown) as Manuscript);

      expect(xmlSerializer.serializeToString(xmlDoc)).toBe('<article><article-meta/></article>');
    });
    it('serializes a populated relatedArticles array', () => {
      const relatedArticles = [
        new RelatedArticle({ articleType: "SOME_ARTICLE_TYPE", href: "URL1" }),
        new RelatedArticle({
          articleType: "SOME_OTHER_ARTICLE_TYPE",
          href: "URL2",
        }),
      ];
      const xmlDoc = parseXML('<article><article-meta/></article>');
      serializeRelatedArticles(xmlDoc, ({
        relatedArticles
      } as unknown) as Manuscript);

      expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
        '<article>' +
          '<article-meta>' +
            '<related-article ext-link-type="doi" id="unique_id" related-article-type="SOME_ARTICLE_TYPE" xlink:href="URL1"/>' +
            '<related-article ext-link-type="doi" id="unique_id" related-article-type="SOME_OTHER_ARTICLE_TYPE" xlink:href="URL2"/>' +
          '</article-meta>' +
        '</article>'
      );
    });
    it("removes related articles if list is empty", () => {
      const xmlDoc = parseXML('<article><article-meta><related-article ext-link-type="doi" id="old-article" related-article-type="SOME_ARTICLE_TYPE" xlink:href="URL0" /></article-meta></article>');
      serializeRelatedArticles(xmlDoc, ({
        relatedArticles: []
      } as unknown) as Manuscript);

      expect(xmlSerializer.serializeToString(xmlDoc)).toBe('<article><article-meta/></article>');
    });
    it('replaces related articles with manuscript relatedArticles', () => {
      const xmlDoc = parseXML('<article><article-meta><related-article ext-link-type="doi" id="old-article" related-article-type="SOME_ARTICLE_TYPE" xlink:href="URL0" /></article-meta></article>');
      const relatedArticles = [
        new RelatedArticle({ articleType: "SOME_ARTICLE_TYPE", href: "URL1" }),
        new RelatedArticle({
          articleType: "SOME_OTHER_ARTICLE_TYPE",
          href: "URL2",
        }),
      ];
      serializeRelatedArticles(xmlDoc, ({
        relatedArticles
      } as unknown) as Manuscript);

      expect(xmlSerializer.serializeToString(xmlDoc)).toBe(
        '<article>' +
          '<article-meta>' +
            '<related-article ext-link-type="doi" id="unique_id" related-article-type="SOME_ARTICLE_TYPE" xlink:href="URL1"/>' +
            '<related-article ext-link-type="doi" id="unique_id" related-article-type="SOME_OTHER_ARTICLE_TYPE" xlink:href="URL2"/>' +
          '</article-meta>' +
        '</article>'
      );    
    });
  });
});
