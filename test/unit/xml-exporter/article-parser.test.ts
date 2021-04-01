import {readFileSync} from "fs";
import {join, resolve} from "path";
import {getArticleManuscript} from "../../../src/xml-exporter/article-parser";
import {EditorState} from "prosemirror-state";
import {get} from "lodash";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('ArticleParser', function () {
  it('should parse article XML', () => {
    const xml = readFileSync(resolve(join(__dirname, '../..', '/test-files/manuscript.xml'))).toString('utf8');
    const article = {
      articleId: "1",
      datatype: "text/xml",
      fileName: "manuscript.xml",
      version: "1.0",
      xml
    };
    const manuscript = getArticleManuscript(article);

    expect(manuscript.articleInfo).toEqual({
      _id: 'unique_id',
      articleDOI: "10.7554/eLife.00104",
      articleType: "Insight",
      copyrightStatement: "© 2019, Atherden and Smith",
      dtd: "1.2",
      elocationId: "e00104",
      licenseText: expect.any(EditorState),
      licenseType: "CC-BY-4",
      publicationDate: "2019-11-30",
      publisherId: "00104",
      subjects: ['Cell Biology', 'Genetics and Genomics'],
      volume: "8"
    });

    expect(manuscript.title).toBeInstanceOf(EditorState);
    expect(manuscript.title.doc.textContent)
      .toBe(`Example eLife Insight2 article with a complete2 reference 'front' section`);

    expect(manuscript.abstract).toBeInstanceOf(EditorState);
    expect(manuscript.abstract.doc.textContent)
      .toBe(`New studies examine how the different sub-structures in the sed nisi neque2, ornare id enim1 et, dapibus rutrum urna.`);

    expect(manuscript.impactStatement).toBeInstanceOf(EditorState);
    expect(manuscript.impactStatement.doc.textContent)
      .toBe(`New studies examine how the different sub-structures in the sed nisi neque2, ornare id enim1 et, dapibus rutrum urna.`);

    expect(manuscript.acknowledgements).toBeInstanceOf(EditorState);
    expect(manuscript.acknowledgements.doc.textContent)
      .toBe(`Acknowledgements section containing only paragraph type elements (no block content such as tables, figures and so on).`);

    expect(manuscript.body).toBeInstanceOf(EditorState);
    expect(manuscript.body.doc.textContent).toMatchSnapshot();

    expect(manuscript.keywordGroups).toEqual(expect.objectContaining({
      'author-keywords': {
        title: undefined,
        keywords: [
          {_id: "unique_id", content: expect.any(EditorState)},
          {_id: "unique_id", content: expect.any(EditorState)},
          {_id: "unique_id", content: expect.any(EditorState)},
          {_id: "unique_id", content: expect.any(EditorState)},
          {_id: "unique_id", content: expect.any(EditorState)}
        ],
        newKeyword: {_id: "unique_id", content: expect.any(EditorState)}
      },
      'research-organism': {
        title: 'Research organism',
        keywords: [{_id: "unique_id", content: expect.any(EditorState)}],
        newKeyword: {_id: "unique_id", content: expect.any(EditorState)}
      }
    }));

    expect(get(manuscript, 'keywordGroups.author-keywords.keywords.0.content.doc.textContent')).toBe('cerebellum');
    expect(get(manuscript, 'keywordGroups.author-keywords.keywords.1.content.doc.textContent')).toBe('climbing fiber');
    expect(get(manuscript, 'keywordGroups.author-keywords.keywords.2.content.doc.textContent')).toBe('reinforcement learning');
    expect(get(manuscript, 'keywordGroups.author-keywords.keywords.3.content.doc.textContent')).toBe('vitae');
    expect(get(manuscript, 'keywordGroups.author-keywords.keywords.4.content.doc.textContent')).toBe('Purkinje cells');
    expect(get(manuscript, 'keywordGroups.research-organism.keywords.0.content.doc.textContent')).toBe('Mouse');

    expect(manuscript.authors.length).toBe(5);
    expect(manuscript.authors[0]).toStrictEqual(expect.objectContaining({
      _id: 'unique_id',
      firstName: 'Fred',
      lastName: 'Atherden',
      suffix: '',
      isAuthenticated: true,
      orcid: '0000-0002-6048-1470',
      bio: expect.any(EditorState),
      email: 'f.atherden@elifesciences.org',
      isCorrespondingAuthor: true,
      affiliations: ['aff1', 'aff2'],
      hasCompetingInterest: true,
      competingInterestStatement: 'Is an employee of eLife. No other competing interests exist'
    }));

    expect(manuscript.authors[1]).toStrictEqual(expect.objectContaining({
      _id: 'unique_id',
      firstName: 'Jeanine',
      lastName: 'Smith',
      suffix: 'III',
      isAuthenticated: false,
      orcid: '',
      bio: expect.any(EditorState),
      email: '',
      isCorrespondingAuthor: false,
      affiliations: ['aff2'],
      hasCompetingInterest: true,
      competingInterestStatement: 'No competing interests declared'
    }));

    expect(manuscript.authors[2]).toStrictEqual(expect.objectContaining({
      _id: 'unique_id',
      firstName: 'Jack',
      lastName: 'London',
      suffix: 'III',
      isAuthenticated: false,
      orcid: '',
      bio: expect.any(EditorState),
      email: '',
      isCorrespondingAuthor: false,
      affiliations: ['aff2'],
      hasCompetingInterest: false,
      competingInterestStatement: ''
    }));

    expect(manuscript.authors[3]).toStrictEqual(expect.objectContaining({
      _id: 'unique_id',
      firstName: 'Mark',
      lastName: 'Twain',
      suffix: 'III',
      isAuthenticated: false,
      orcid: '',
      bio: expect.any(EditorState),
      email: '',
      isCorrespondingAuthor: false,
      affiliations: ['aff2'],
      hasCompetingInterest: false,
      competingInterestStatement: ''
    }));

    expect(manuscript.authors[4]).toStrictEqual(expect.objectContaining({
      _id: 'unique_id',
      firstName: 'Alexandr',
      lastName: 'Solzhenitsin',
      suffix: 'III',
      isAuthenticated: false,
      orcid: '',
      bio: expect.any(EditorState),
      email: '',
      isCorrespondingAuthor: false,
      affiliations: ['aff2'],
      hasCompetingInterest: true,
      competingInterestStatement: 'No competing interests declared'
    }));

    expect(get(manuscript, 'authors.0.bio.doc.textContent'))
      .toBe('Fred Atherden is in the Production Department, eLife Sciences, Cambridge, United Kingdoms Creative Commons Attribution License');
    expect(get(manuscript, 'authors.1.bio.doc.textContent'))
      .toBe('Jeanine Smith III is in the Department, University, City, Country');
    expect(get(manuscript, 'authors.2.bio.doc.textContent'))
      .toBe('Jeanine Smith III is in the Department, University, City, Country');
    expect(get(manuscript, 'authors.3.bio.doc.textContent'))
      .toBe('Jeanine Smith III is in the Department, University, City, Country');
    expect(get(manuscript, 'authors.4.bio.doc.textContent')).toBe('');

    expect(manuscript.affiliations).toEqual([
      {
        "_id": "aff1",
        "address": {
          "city": "Cambridge",
        },
        "country": "United Kingdom",
        "institution": {
          "name": "Production Department, eLife Sciences",
        },
        "label": "1",
      },
      {
        "_id": "aff2",
        "address": {
          "city": "City",
        },
        "country": "Country",
        "institution": {
          "name": "Department, University",
        },
        "label": "2",
      },
    ]);

    expect(manuscript.relatedArticles).toEqual([{
      "_id": "ra1",
      "articleType": "commentary-article",
      "href": "10.7554/eLife.42697"
    }, {
      "_id": "ra2",
      "articleType": "commentary-article",
      "href": "10.7554/eLife.00067"
    }]);

    expect(manuscript.references).toMatchSnapshot();

  });
});
