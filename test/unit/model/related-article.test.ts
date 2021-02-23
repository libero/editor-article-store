/**
 * @jest-environment jsdom
 */
import {RelatedArticle} from "../../../src/model/related-article";

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

});
