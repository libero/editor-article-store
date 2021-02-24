/**
 * @jest-environment jsdom
 */
import {createRelatedArticleState, RelatedArticle} from "../../../src/model/related-article";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Related Article model', () => {
  it('creates a related article from object ', () => {
    expect(new RelatedArticle({articleType: 'SOME_ARTICLE_TYPE', href: 'URL'})).toMatchSnapshot();
  });

  it('creates a related article from xml', () => {
    const el = document.createElement('related-article');
    el.setAttribute('related-article-type', 'commentary-article');
    el.setAttribute('xlink:href', '10.7554/eLife.48498');
    expect(new RelatedArticle(el)).toMatchSnapshot();
  });

  it('creates an empty article if attributes are missing', () => {
    const el = document.createElement('related-article');
    expect(new RelatedArticle(el)).toMatchSnapshot();
  });

  it('creates an empty related article', () => {
    expect(new RelatedArticle()).toMatchSnapshot();
  });

  it('clones a related article', () => {
    const article = new RelatedArticle({articleType: 'SOME_ARTICLE_TYPE', href: 'URL'});
    const clonedArticle = article.clone();
    expect(clonedArticle).not.toBe(article);
    expect(clonedArticle).toEqual(article);
  });

  it('creates related article state', () => {
    const el = document.createElement('div');
    el.innerHTML = `
        <related-article related-article-type="commentary-article" xlink:href="10.7554/eLife.48496"/>
        <related-article related-article-type="commentary-article" xlink:href="10.7554/eLife.48497"/>
        <related-article related-article-type="commentary-article" xlink:href="10.7554/eLife.48498"/>
    `;
    const state =createRelatedArticleState(Array.from(el.querySelectorAll('related-article')));
    expect(state.length).toBe(3);
    expect(state[0].href).toBe('10.7554/eLife.48496');
    expect(state[1].href).toBe('10.7554/eLife.48497');
    expect(state[2].href).toBe('10.7554/eLife.48498');
  });

  it('creates empty state', () => {
    const state = createRelatedArticleState([]);
    expect(state.length).toBe(0);
  });
});
