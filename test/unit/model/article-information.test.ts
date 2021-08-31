import { ArticleInformation, serializeArticleInformaion } from '../../../src/model/article-information';
import { EditorState } from 'prosemirror-state';
import { parseXML } from '../../../src/xml-exporter/xml-utils';
import { Person } from '../../../src/model/person';
import xmldom from '@xmldom/xmldom';
import { Manuscript } from '../../../src/model/manuscript';

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
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
      <license xlink:href="http://creativecommons.org/licenses/by/4.0/">
      <license-p>Three miles long EULA</license-p>
      </license>
</license>
    </permissions>
    <elocation-id>e00104</elocation-id>
    <article-categories>
      <subj-group subj-group-type="heading"><subject>Insight</subject></subj-group>
      <subj-group subj-group-type="major-subject"><subject>Cell Biology</subject></subj-group>
      <subj-group subj-group-type="major-subject"><subject>Genetics and Genomics</subject></subj-group>
    </article-categories>
  </article-meta>
</article>`;

describe('ArticleInformation', () => {
    describe('Constructor', () => {
        it('Creates an empty ArticleInformation', () => {
            const articleInfo = new ArticleInformation();
            expect(articleInfo).toEqual({
                _id: 'unique_id',
                articleDOI: '',
                articleType: '',
                copyrightStatement: '',
                dtd: '',
                elocationId: '',
                licenseText: expect.any(EditorState),
                licenseType: '',
                publicationDate: '',
                publisherId: '',
                subjects: [],
                volume: '',
            });

            expect(articleInfo.licenseText!.doc.textContent).toBe('');
        });

        it('Creates an ArticleInformation from JSON', () => {
            const articleInfo = new ArticleInformation({
                articleDOI: '10.7554/eLife.00104',
                articleType: 'Insight',
                copyrightStatement: '',
                dtd: '1.2',
                elocationId: 'e00104',
                licenseText: {
                    doc: {
                        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Three miles long EULA' }] }],
                        type: 'doc',
                    },
                    selection: {
                        anchor: 0,
                        head: 0,
                        type: 'text',
                    },
                },
                licenseType: 'CC-BY-4',
                publicationDate: '2019-11-30',
                publisherId: '00104',
                subjects: ['Cell Biology', 'Genetics and Genomics'],
                volume: '8',
            });

            expect(articleInfo).toStrictEqual(
                expect.objectContaining({
                    _id: 'unique_id',
                    articleDOI: '10.7554/eLife.00104',
                    articleType: 'Insight',
                    copyrightStatement: '',
                    dtd: '1.2',
                    elocationId: 'e00104',
                    licenseText: expect.any(EditorState),
                    licenseType: 'CC-BY-4',
                    publicationDate: '2019-11-30',
                    publisherId: '00104',
                    subjects: ['Cell Biology', 'Genetics and Genomics'],
                    volume: '8',
                }),
            );

            expect(articleInfo.licenseText!.doc.textContent).toBe('Three miles long EULA');
        });

        it('Creates an empty ArticleInformation from XML', () => {
            const xmlDoc = parseXML(ARTICLE_XML);
            const articleInfo = new ArticleInformation(xmlDoc.documentElement);
            expect(articleInfo).toEqual({
                _id: 'unique_id',
                articleDOI: '10.7554/eLife.00104',
                articleType: 'Insight',
                copyrightStatement: '',
                dtd: '1.2',
                elocationId: 'e00104',
                licenseText: expect.any(EditorState),
                licenseType: 'CC-BY-4',
                publicationDate: '2019-11-30',
                publisherId: '00104',
                subjects: ['Cell Biology', 'Genetics and Genomics'],
                volume: '8',
            });

            expect(articleInfo.licenseText!.doc.textContent).toBe('Three miles long EULA');
        });

        it('Creates an ArticleInformation from XML with CC0', () => {
            const xmlDoc = parseXML(ARTICLE_XML);

            xmlDoc
                .querySelector('license')!
                .setAttribute('xlink:href', 'http://creativecommons.org/publicdomain/zero/1.0/');
            const articleInfo = new ArticleInformation(xmlDoc.documentElement);
            expect(articleInfo).toEqual({
                _id: 'unique_id',
                articleDOI: '10.7554/eLife.00104',
                articleType: 'Insight',
                copyrightStatement: '',
                dtd: '1.2',
                elocationId: 'e00104',
                licenseText: expect.any(EditorState),
                licenseType: 'CC0',
                publicationDate: '2019-11-30',
                publisherId: '00104',
                subjects: ['Cell Biology', 'Genetics and Genomics'],
                volume: '8',
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

            xmlDoc
                .querySelector('license')!
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

            xmlDoc
                .querySelector('license')!
                .setAttribute('xlink:href', 'http://creativecommons.org/publicdomain/zero/1.0/');
            const articleInfo = new ArticleInformation(xmlDoc.documentElement, [author1]);
            expect(articleInfo.copyrightStatement).toBe('Test copyright statement');
        });
    });

    describe('toXml', () => {
        it('serializes an empty ArticleInformation to XML', () => {
            const articleInformation = new ArticleInformation();
            const articleInfoXml = articleInformation.toXml();
            expect(articleInfoXml.articleDOI).toBeUndefined();
            expect(articleInfoXml.elocationId).toBeUndefined();
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.permissions)).toBe(
                '<permissions><ali:free_to_read/></permissions>',
            );
            expect(articleInfoXml.publicationDate).toBeUndefined();
            expect(articleInfoXml.publisherId).toBeUndefined();
            expect(articleInfoXml.subjects).toBeUndefined();
            expect(articleInfoXml.volume).toBeUndefined();
        });

        it('serializes a populated ArticleInformation to XML', () => {
            const articleInformation = new ArticleInformation({
                articleDOI: '10.7554/eLife.00104',
                articleType: 'Insight',
                copyrightStatement: '',
                dtd: '1.2',
                elocationId: 'e00104',
                licenseType: 'CC-BY-4',
                publicationDate: '2019-11-30',
                publisherId: '00104',
                subjects: ['Cell Biology', 'Genetics and Genomics'],
                volume: '8',
            });

            const articleInfoXml = articleInformation.toXml();
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.articleDOI as Element)).toBe(
                '<article-id pub-id-type="doi">10.7554/eLife.00104</article-id>',
            );
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.elocationId as Element)).toBe(
                '<elocation-id>e00104</elocation-id>',
            );
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.permissions as Element)).toBe(
                `<permissions><ali:free_to_read/><license xlink:href="http://creativecommons.org/licenses/by/4.0/"><ali:license_ref>http://creativecommons.org/licenses/by/4.0/</ali:license_ref><license-p>This article is distributed under the terms of the 
    <ext-link ext-link-type="uri" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://creativecommons.org/licenses/by/4.0/">
        Creative Commons Attribution License</ext-link>, which permits unrestricted use and redistribution provided that the original author 
    and source are credited.</license-p></license></permissions>`,
            );
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.publicationDate as Element)).toBe(
                '<pub-date date-type="pub" publication-format="electronic" iso-8601-date="2019-11-30"><year>2019</year><month>11</month><day>30</day></pub-date>',
            );
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.publisherId as Element)).toBe(
                '<article-id pub-id-type="publisher-id">00104</article-id>',
            );
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.subjects as Element)).toBe(
                '<subj-group subj-group-type="major-subject"><subject>Cell Biology</subject><subject>Genetics and Genomics</subject></subj-group>',
            );
            expect(new xmldom.XMLSerializer().serializeToString(articleInfoXml.volume as Element)).toBe('<volume>8</volume>');
        });
    });

    describe('serializeArticleInformaion', () => {
        it('serializes the ArticleInformation to the xml document', () => {
            const articleInfo = new ArticleInformation({
                articleDOI: '10.7554/eLife.00104',
                articleType: 'Insight',
                copyrightStatement: '© 2019, Bar et al.',
                dtd: '1.2',
                elocationId: 'e00104',
                licenseType: 'CC-BY-4',
                publicationDate: '2019-11-30',
                publisherId: '00104',
                subjects: ['Cell Biology', 'Genetics and Genomics'],
                volume: '8',
            });

            const mockManuscript = {
                articleInfo,
            } as unknown as Manuscript;

            const mockXml = parseXML(`
            <article>
                <article-meta>
                    <article-categories>
                        <subj-group subj-group-type="major-subject">
                            <subject>Foo</subject>
                        </subj-group>
                    </article-categories>
                    <article-id pub-id-type="doi">DOI</article-id>
                    <article-id pub-id-type="publisher-id">PUBLISHER ID</article-id>
                    <elocation-id>ELOCATION ID</elocation-id>
                    <volume>8</volume>
                    <pub-date date-type="pub" publication-format="electronic" iso-8601-date="2001-01-01">
                        <year>2001</year>
                        <month>01</month>
                        <day>01</day>
                    </pub-date>
                    <permissions>
                        <ali:free_to_read/>
                        <copyright-statement>© 2001, Fooo et al.</copyright-statement>
                        <copyright-holder>Fooo et al.</copyright-holder>
                        <copyright-year>2001</copyright-year>
                        <license xlink:href="http://creativecommons.org/publicdomain/zero/1.0/">
                            <ali:license_ref>http://creativecommons.org/publicdomain/zero/1.0/</ali:license_ref>
                            <license-p>
                                This is an open-access article, free of all copyright, and may be freely reproduced, 
    distributed, transmitted, modified, built upon, or otherwise used by anyone for any lawful purpose.
    The work is made available under the
    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons CC0 public domain dedication</ext-link>.
                            </license-p>
                        </license>
                    </permissions>
                </article-meta>
            </article>
            `);
            serializeArticleInformaion(mockXml, mockManuscript);
            expect(new xmldom.XMLSerializer().serializeToString(mockXml)).toMatchInlineSnapshot(`
"
            <article>
                <article-meta>
                    <article-categories>
                        <subj-group subj-group-type=\\"major-subject\\"><subject>Cell Biology</subject><subject>Genetics and Genomics</subject></subj-group>
                    </article-categories>
                    <article-id pub-id-type=\\"doi\\">10.7554/eLife.00104</article-id>
                    <article-id pub-id-type=\\"publisher-id\\">00104</article-id>
                    <elocation-id>e00104</elocation-id>
                    <volume>8</volume>
                    <pub-date date-type=\\"pub\\" publication-format=\\"electronic\\" iso-8601-date=\\"2019-11-30\\"><year>2019</year><month>11</month><day>30</day></pub-date>
                    <permissions><copyright-statement>© 2019, Bar et al.</copyright-statement><copyright-holder>Bar et al.</copyright-holder><copyright-year>2019</copyright-year><ali:free_to_read/><license xlink:href=\\"http://creativecommons.org/licenses/by/4.0/\\"><ali:license_ref>http://creativecommons.org/licenses/by/4.0/</ali:license_ref><license-p>This article is distributed under the terms of the 
    <ext-link ext-link-type=\\"uri\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xlink:href=\\"http://creativecommons.org/licenses/by/4.0/\\">
        Creative Commons Attribution License</ext-link>, which permits unrestricted use and redistribution provided that the original author 
    and source are credited.</license-p></license></permissions>
                </article-meta>
            </article>"
`);
        });
    });
});
