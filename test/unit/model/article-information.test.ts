import {ArticleInformation} from "../../../src/model/article-information";
import {EditorState} from "prosemirror-state";
import {parseXML} from "../../../src/xml-exporter/xml-utils";
import {Person} from "../../../src/model/person";

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

const ARTICLE_XML = `
<article dtd-version="1.2">
  <article-meta>
    <article-id pub-id-type="publisher-id">00104</article-id>
    <article-id pub-id-type="doi">10.7554/eLife.00104</article-id>
    <volume>8</volume>
    <pub-date date-type="pub" publication-format="electronic">
      <day>30</day> <month>11</month> <year>2019</year>
    </pub-date>
    <permissions>
      <license xlink:href="http://creativecommons.org/licenses/by/4.0/" />
    </permissions>
    <elocation-id>e00104</elocation-id>
    <article-categories>
      <subj-group subj-group-type="heading"><subject>Insight</subject></subj-group>
      <subj-group subj-group-type="subject"><subject>Cell Biology</subject></subj-group>
      <subj-group subj-group-type="subject"><subject>Genetics and Genomics</subject></subj-group>
    </article-categories>
  </article-meta>
</article>`

describe('ArticleInformation', () => {
  describe('Constructor', () => {
    it('Creates an empty ArticleInformation', () => {
      const articleInfo = new ArticleInformation();
      expect(articleInfo).toEqual({
        "_id": "unique_id",
        "articleDOI": "",
        "articleType": "",
        "copyrightStatement": "",
        "dtd": "",
        "elocationId": "",
        "licenseText": expect.any(EditorState),
        "licenseType": "",
        "publicationDate": "",
        "publisherId": "",
        "subjects": [],
        "volume": "",
      });
    });

    it('Creates an ArticleInformation from JSON', () => {
      const articleInfo = new ArticleInformation({});
    });

    it('Creates an empty ArticleInformation from XML', () => {
      const xmlDoc = parseXML(ARTICLE_XML);
      const articleInfo = new ArticleInformation(xmlDoc.documentElement);
      expect(articleInfo).toEqual({
        _id: "unique_id",
        articleDOI: "10.7554/eLife.00104",
        articleType: "Insight",
        copyrightStatement: "",
        dtd: "1.2",
        elocationId: "e00104",
        licenseText: expect.any(EditorState),
        licenseType: "CC-BY-4",
        publicationDate: "2019-11-30",
        publisherId: "00104",
        subjects: ['Cell Biology', 'Genetics and Genomics'],
        volume: "8",
      });
    });

    it('Creates an ArticleInformation from XML with CC0', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      xmlDoc.querySelector('license')!
        .setAttribute('xlink:href', 'http://creativecommons.org/publicdomain/zero/1.0/');
      const articleInfo = new ArticleInformation(xmlDoc.documentElement);
      expect(articleInfo).toEqual({
        _id: "unique_id",
        articleDOI: "10.7554/eLife.00104",
        articleType: "Insight",
        copyrightStatement: "",
        dtd: "1.2",
        elocationId: "e00104",
        licenseText: expect.any(EditorState),
        licenseType: "CC0",
        publicationDate: "2019-11-30",
        publisherId: "00104",
        subjects: ['Cell Biology', 'Genetics and Genomics'],
        volume: "8",
      });
    });

    it('Creates an ArticleInformation with copyright statement and single author', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const author = new Person();
      author.firstName = 'John';
      author.lastName = 'Doe';

      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author]);
      expect(articleInfo.copyrightStatement).toBe('© 2019, Doe');
    });

    it('Creates an ArticleInformation with copyright statement and two authors', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const author1 = new Person();
      author1.firstName = 'John';
      author1.lastName = 'Doe';

      const author2 = new Person();
      author2.firstName = 'Edgar';
      author2.lastName = 'Po';

      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1, author2]);
      expect(articleInfo.copyrightStatement).toBe('© 2019, Doe and Po');
    });

    it('Creates an ArticleInformation with copyright statement and more than two authors', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const author1 = new Person();
      author1.firstName = 'John';
      author1.lastName = 'Doe';

      const author2 = new Person();
      author2.firstName = 'Edgar';
      author2.lastName = 'Po';

      const author3 = new Person();
      author2.firstName = 'Author 3';
      author2.lastName = 'Author 3';

      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1, author2, author3]);
      expect(articleInfo.copyrightStatement).toBe('© 2019, Doe et al');
    });

    it('Creates an ArticleInformation with empty copyright statement when license is CC0', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const author1 = new Person();
      author1.firstName = 'John';
      author1.lastName = 'Doe';

      xmlDoc.querySelector('license')!
        .setAttribute('xlink:href', 'http://creativecommons.org/publicdomain/zero/1.0/');
      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1]);
      expect(articleInfo.copyrightStatement).toBe('');
    });

    it('Creates an ArticleInformation with empty license when no license found in XML', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const author1 = new Person();
      author1.firstName = 'John';
      author1.lastName = 'Doe';

      const licenseEl = xmlDoc.querySelector('license')!;
      licenseEl!.parentNode!.removeChild(licenseEl);
      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1]);
      expect(articleInfo.copyrightStatement).toBe('');
    });

    it('Creates an ArticleInformation with empty license when license is empty', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const author1 = new Person();
      author1.firstName = 'John';
      author1.lastName = 'Doe';

      xmlDoc.querySelector('license')!.setAttribute('xlink:href', '');
      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1]);
      expect(articleInfo.copyrightStatement).toBe('');
    });

    it('Creates an ArticleInformation with copyright statement from xml', () => {
      const xmlDoc = parseXML(ARTICLE_XML);

      const copyrightEl = xmlDoc.createElement('copyright-statement');
      copyrightEl.appendChild(xmlDoc.createTextNode('Test copyright statement'));
      xmlDoc.querySelector('permissions')!.appendChild(copyrightEl);

      const author1 = new Person();
      author1.firstName = 'John';
      author1.lastName = 'Doe';

      xmlDoc.querySelector('license')!
        .setAttribute('xlink:href', 'http://creativecommons.org/publicdomain/zero/1.0/');
      const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1]);
      expect(articleInfo.copyrightStatement).toBe('Test copyright statement');
    });
  });
});
