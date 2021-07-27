import { XMLSerializer } from 'xmldom';
import { createReferencesState, serializeReferenceState, Reference } from '../../../../src/model/reference';
import { JournalReference } from '../../../../src/model/reference/JournalReference';
import { BookReference } from '../../../../src/model/reference/BookReference';
import { PeriodicalReference } from '../../../../src/model/reference/PeriodicalReference';
import { ReportReference } from '../../../../src/model/reference/ReportReference';
import { DataReference } from '../../../../src/model/reference/DataReference';
import { WebReference } from '../../../../src/model/reference/WebReference';
import { PreprintReference } from '../../../../src/model/reference/PreprintReference';
import { SoftwareReference } from '../../../../src/model/reference/SoftwareReference';
import { ConferenceReference } from '../../../../src/model/reference/ConferenceReference';
import { ThesisReference } from '../../../../src/model/reference/ThesisReference';
import { PatentReference } from '../../../../src/model/reference/PatentReference';
import { parseXML } from '../../../../src/xml-exporter/xml-utils';
import { Manuscript } from '../../../../src/model/manuscript';
const serializer = new XMLSerializer();

jest.mock('uuid', () => ({
    v4: () => 'unique_id',
}));

jest.mock('../../../../src/model/reference/JournalReference');
jest.mock('../../../../src/model/reference/BookReference');
jest.mock('../../../../src/model/reference/PeriodicalReference');
jest.mock('../../../../src/model/reference/ReportReference');
jest.mock('../../../../src/model/reference/DataReference');
jest.mock('../../../../src/model/reference/WebReference');
jest.mock('../../../../src/model/reference/PreprintReference');
jest.mock('../../../../src/model/reference/SoftwareReference');
jest.mock('../../../../src/model/reference/ConferenceReference');
jest.mock('../../../../src/model/reference/ThesisReference');
jest.mock('../../../../src/model/reference/PatentReference');

describe('Reference class', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a blank reference', () => {
        const ref = new Reference();

        expect(ref.authors).toEqual([]);
        expect(ref.type).toEqual('journal');
        expect(ref.id).toEqual('unique_id');
        expect(ref.referenceInfo).toBeInstanceOf(JournalReference);
        expect(JournalReference).toBeCalledWith(undefined);
    });

    describe('reference type', () => {
        it('should set book ref type', () => {
            const ref = new Reference();
            ref.type = 'book';
            expect(ref.referenceInfo).toBeInstanceOf(BookReference);
            expect(BookReference).toBeCalledWith(undefined);
        });

        it('should set periodical ref type', () => {
            const ref = new Reference();
            ref.type = 'periodical';
            expect(ref.referenceInfo).toBeInstanceOf(PeriodicalReference);
            expect(PeriodicalReference).toBeCalledWith(undefined);
        });

        it('should set report ref type', () => {
            const ref = new Reference();
            ref.type = 'report';
            expect(ref.referenceInfo).toBeInstanceOf(ReportReference);
            expect(ReportReference).toBeCalledWith(undefined);
        });

        it('should set data ref type', () => {
            const ref = new Reference();
            ref.type = 'data';
            expect(ref.referenceInfo).toBeInstanceOf(DataReference);
            expect(DataReference).toBeCalledWith(undefined);
        });

        it('should set web ref type', () => {
            const ref = new Reference();
            ref.type = 'web';
            expect(ref.referenceInfo).toBeInstanceOf(WebReference);
            expect(WebReference).toBeCalledWith(undefined);
        });

        it('should set preprint ref type', () => {
            const ref = new Reference();
            ref.type = 'preprint';
            expect(ref.referenceInfo).toBeInstanceOf(PreprintReference);
            expect(PreprintReference).toBeCalledWith(undefined);
        });

        it('should set software ref type', () => {
            const ref = new Reference();
            ref.type = 'software';
            expect(ref.referenceInfo).toBeInstanceOf(SoftwareReference);
            expect(SoftwareReference).toBeCalledWith(undefined);
        });

        it('should set confproc ref type', () => {
            const ref = new Reference();
            ref.type = 'confproc';
            expect(ref.referenceInfo).toBeInstanceOf(ConferenceReference);
            expect(ConferenceReference).toBeCalledWith(undefined);
        });

        it('should set thesis ref type', () => {
            const ref = new Reference();
            ref.type = 'thesis';
            expect(ref.referenceInfo).toBeInstanceOf(ThesisReference);
            expect(ThesisReference).toBeCalledWith(undefined);
        });

        it('should set report ref type', () => {
            const ref = new Reference();
            ref.type = 'patent';
            expect(ref.referenceInfo).toBeInstanceOf(PatentReference);
            expect(PatentReference).toBeCalledWith(undefined);
        });
    });

    describe('fromXML', () => {
        const originalXml = parseXML(`<ref id="bib17"><element-citation publication-type=""></element-citation></ref>`);

        it('parses ID corrently', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'journal');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.id).toBe('bib17');
        });

        it('uses UUID if id is not set', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'journal');
            refXml.querySelector('ref')!.setAttribute('id', '');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.id).toBe('unique_id');
        });

        it('parses ID corrently', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'journal');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.id).toBe('bib17');
        });

        it('creates a journal reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'journal');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('journal');
            expect(JournalReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a book reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'book');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('book');
            expect(BookReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a periodical reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'periodical');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('periodical');
            expect(PeriodicalReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a report reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'report');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('report');
            expect(ReportReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a data reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'data');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('data');
            expect(DataReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a web reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'web');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('web');
            expect(WebReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a preprint reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'preprint');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('preprint');
            expect(PreprintReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a software reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'software');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('software');
            expect(SoftwareReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a confproc reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'confproc');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('confproc');
            expect(ConferenceReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a thesis reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'thesis');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('thesis');
            expect(ThesisReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });

        it('creates a patent reference', () => {
            const refXml = originalXml.cloneNode(true) as Element;
            refXml.querySelector('element-citation')!.setAttribute('publication-type', 'patent');
            const ref = new Reference(refXml.querySelector('element-citation')!);

            expect(ref.type).toBe('patent');
            expect(PatentReference).toBeCalledWith(refXml.querySelector('element-citation'));
        });
    });

    describe('parse authors from XML', () => {
        it('parses authors list', () => {
            const xml = parseXML(`<ref id="bib26">
        <element-citation publication-type="journal">
          <person-group person-group-type="author">
            <name><surname>Zz</surname> <given-names>J</given-names></name>
            <name><surname>Daniel</surname> <given-names>CR</given-names></name>
            <name><surname>Hess</surname> <given-names>KR</given-names></name>
          </person-group>
          <year iso-8601-date="2019">2019</year>
          <article-title>The association of BMI and outcomes in metastatic melanoma: a retrospective, multicohort analysis of patients treated with targeted therapy, immunotherapy, or chemotherapy</article-title>
          <source>The Lancet. Oncology</source>
        </element-citation>
      </ref>`);

            const ref = new Reference(xml.querySelector('element-citation')!);
            expect(ref.authors.length).toBe(3);
            expect(ref.authors).toEqual([
                { firstName: 'J', lastName: 'Zz' },
                { firstName: 'CR', lastName: 'Daniel' },
                { firstName: 'KR', lastName: 'Hess' },
            ]);
        });

        it('parses group authors list', () => {
            const xml = parseXML(`<ref id="bib26">
        <element-citation publication-type="journal">
          <person-group person-group-type="author">
            <collab>Zz J</collab>
            <collab>Daniel CR</collab>
            <collab>Hess KR</collab>
          </person-group>
          <year iso-8601-date="2019">2019</year>
          <article-title>The association of BMI and outcomes in metastatic melanoma: a retrospective, multicohort analysis of patients treated with targeted therapy, immunotherapy, or chemotherapy</article-title>
          <source>The Lancet. Oncology</source>
        </element-citation>
      </ref>`);

            const ref = new Reference(xml.querySelector('element-citation')!);
            expect(ref.authors.length).toBe(3);
            expect(ref.authors).toEqual([{ groupName: 'Zz J' }, { groupName: 'Daniel CR' }, { groupName: 'Hess KR' }]);
        });

        it('parses mixed type authors list', () => {
            const xml = parseXML(`<ref id="bib26">
        <element-citation publication-type="journal">
          <person-group person-group-type="author">
            <name><surname>Zz</surname> <given-names>J</given-names></name>
            <collab>Hess KR</collab>
          </person-group>
          <year iso-8601-date="2019">2019</year>
          <article-title>The association of BMI and outcomes in metastatic melanoma: a retrospective, multicohort analysis of patients treated with targeted therapy, immunotherapy, or chemotherapy</article-title>
          <source>The Lancet. Oncology</source>
        </element-citation>
      </ref>`);

            const ref = new Reference(xml.querySelector('element-citation')!);
            expect(ref.authors.length).toBe(2);
            expect(ref.authors).toEqual([{ firstName: 'J', lastName: 'Zz' }, { groupName: 'Hess KR' }]);
        });

        it('parses inventors list', () => {
            const xml = parseXML(`<ref id="bib26">
        <element-citation publication-type="journal">
          <person-group person-group-type="inventor">
            <name><surname>Zz</surname> <given-names>J</given-names></name>
            <collab>Hess KR</collab>
          </person-group>
          <year iso-8601-date="2019">2019</year>
          <article-title>The association of BMI and outcomes in metastatic melanoma: a retrospective, multicohort analysis of patients treated with targeted therapy, immunotherapy, or chemotherapy</article-title>
          <source>The Lancet. Oncology</source>
        </element-citation>
      </ref>`);

            const ref = new Reference(xml.querySelector('element-citation')!);
            expect(ref.authors.length).toBe(2);
            expect(ref.authors).toEqual([{ firstName: 'J', lastName: 'Zz' }, { groupName: 'Hess KR' }]);
        });

        it('parses mixed authors and inventors lists', () => {
            const xml = parseXML(`<ref id="bib26">
        <element-citation publication-type="journal">
         <person-group person-group-type="author">
            <collab>Daniel CR</collab>
          </person-group>
          <person-group person-group-type="inventor">
            <name><surname>Zz</surname> <given-names>J</given-names></name>
            <collab>Hess KR</collab>
          </person-group>
          <year iso-8601-date="2019">2019</year>
          <article-title>The association of BMI and outcomes in metastatic melanoma: a retrospective, multicohort analysis of patients treated with targeted therapy, immunotherapy, or chemotherapy</article-title>
          <source>The Lancet. Oncology</source>
        </element-citation>
      </ref>`);

            const ref = new Reference(xml.querySelector('element-citation')!);
            expect(ref.authors.length).toBe(3);
            expect(ref.authors).toEqual([
                { groupName: 'Daniel CR' },
                { firstName: 'J', lastName: 'Zz' },
                { groupName: 'Hess KR' },
            ]);
        });

        it('parses empty authors lists', () => {
            const xml = parseXML(`<ref id="bib26">
        <element-citation publication-type="journal">
         <person-group person-group-type="author"></person-group>
          <year iso-8601-date="2019">2019</year>
          <article-title>The association of BMI and outcomes in metastatic melanoma: a retrospective, multicohort analysis of patients treated with targeted therapy, immunotherapy, or chemotherapy</article-title>
          <source>The Lancet. Oncology</source>
        </element-citation>
      </ref>`);

            const ref = new Reference(xml.querySelector('element-citation')!);
            expect(ref.authors.length).toBe(0);
            expect(ref.authors).toEqual([]);
        });
    });

    describe('fromJSON', () => {
        it('assigns reference info correctly', () => {
            const json = {
                _id: 'some_id',
                _type: 'journal',
                authors: [{ firstName: 'John', lastName: 'Doe' }],
                referenceInfo: {},
            };

            const ref = new Reference(json);
            expect(ref.authors).toEqual(json.authors);
            expect(ref.authors).not.toBe(json.authors);
            expect(ref.id).toBe(json._id);
        });

        it('uses UUID if id is not set on JSON', () => {
            const json = {
                _type: 'journal',
                authors: [{ firstName: 'John', lastName: 'Doe' }],
                referenceInfo: {},
            };

            const ref = new Reference(json);
            expect(ref.id).toBe('unique_id');
        });

        it('creates a journal reference', () => {
            const json = { _id: 'some_id', _type: 'journal', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('journal');
            expect(JournalReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a book reference', () => {
            const json = { _id: 'some_id', _type: 'book', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('book');
            expect(BookReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a periodical reference', () => {
            const json = { _id: 'some_id', _type: 'periodical', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('periodical');
            expect(PeriodicalReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a report reference', () => {
            const json = { _id: 'some_id', _type: 'report', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('report');
            expect(ReportReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a data reference', () => {
            const json = { _id: 'some_id', _type: 'data', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('data');
            expect(DataReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a web reference', () => {
            const json = { _id: 'some_id', _type: 'web', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('web');
            expect(WebReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a preprint reference', () => {
            const json = { _id: 'some_id', _type: 'preprint', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('preprint');
            expect(PreprintReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a software reference', () => {
            const json = { _id: 'some_id', _type: 'software', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('software');
            expect(SoftwareReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a confproc reference', () => {
            const json = { _id: 'some_id', _type: 'confproc', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('confproc');
            expect(ConferenceReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a thesis reference', () => {
            const json = { _id: 'some_id', _type: 'thesis', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('thesis');
            expect(ThesisReference).toBeCalledWith(json.referenceInfo);
        });

        it('creates a patent reference', () => {
            const json = { _id: 'some_id', _type: 'patent', authors: [], referenceInfo: {} };

            const ref = new Reference(json);
            expect(ref.type).toBe('patent');
            expect(PatentReference).toBeCalledWith(json.referenceInfo);
        });
    });

    describe('toXml', () => {
        beforeEach(() => {
            (JournalReference as jest.Mock).mockImplementationOnce((data) => {
                return new (jest.requireActual('../../../../src/model/reference/JournalReference').JournalReference)(
                    data,
                );
            });
        });

        it('serializes a reference to xml', () => {
            const json = {
                _id: 'some_id',
                _type: 'journal',
                authors: [{ firstName: 'John', lastName: 'Doe' }],
                referenceInfo: {
                    articleTitle: {
                        doc: {
                            content: [
                                {
                                    text: 'I am articleTitle text',
                                    type: 'text',
                                },
                            ],
                            type: 'annotatedReferenceInfoDoc',
                        },
                        selection: {
                            anchor: 0,
                            head: 0,
                            type: 'text',
                        },
                    },
                    source: {
                        doc: {
                            content: [
                                {
                                    text: 'I am source text',
                                    type: 'text',
                                },
                            ],
                            type: 'annotatedReferenceInfoDoc',
                        },
                        selection: {
                            anchor: 0,
                            head: 0,
                            type: 'text',
                        },
                    },
                    doi: 'DOI',
                    elocationId: 'elocationId',
                    firstPage: 'firstPage',
                    inPress: true,
                    lastPage: 'lastPage',
                    pmid: 'pmid',
                    pmcid: 'pmcid',
                    volume: 'volume',
                    year: 'year',
                },
            };

            const ref = new Reference(json);
            expect(serializer.serializeToString(ref.toXml(4))).toBe(
                '<ref id="bib4">' +
                    '<element-citation publication-type="journal">' +
                    '<person-group person-group-type="author">' +
                    '<name><given-names>John</given-names><surname>Doe</surname></name></person-group>' +
                    '<elocation-id>elocationId</elocation-id>' +
                    '<fpage>firstPage</fpage>' +
                    '<lpage>lastPage</lpage>' +
                    '<year iso-8601-date="year">year</year>' +
                    '<article-title>I am articleTitle text</article-title>' +
                    '<source>I am source text</source>' +
                    '<pub-id pub-id-type="doi">DOI</pub-id>' +
                    '<pub-id pub-id-type="pmid">pmid</pub-id>' +
                    '<pub-id pub-id-type="pmcid">pmcid</pub-id>' +
                    '<volume>volume</volume>' +
                    '<comment>In press</comment>' +
                    '</element-citation>' +
                    '</ref>',
            );
        });
    });

    describe('createReferencesState', () => {
        it('creates an empty references state', () => {
            const state = createReferencesState([]);
            expect(state).toEqual([]);
        });

        it('creates a state with one reference', () => {
            const xml = parseXML(`<article>
        <ref id="bib25">
          <element-citation publication-type="journal">
            <person-group person-group-type="author">
              <name>
                <surname>Zoolander</surname> <given-names>D</given-names>
              </name>
              <name>
                <surname>Hansel</surname>
              </name>
              <name>
                <surname>Mugatu</surname> <given-names>J</given-names>
              </name>
            </person-group>
            <year iso-8601-date="2019">2019</year>
            <article-title>Second related article title (if present)</article-title>
            <source>eLife</source>
            <volume>8</volume>
            <elocation-id>e00067</elocation-id>
            <pub-id pub-id-type="doi">10.7554/eLife.00067</pub-id>
            <pub-id pub-id-type="pmid">00030000</pub-id>
            <pub-id pub-id-type="pmcid">PMC00005</pub-id>
          </element-citation>
        </ref>
      </article>`);

            const state = createReferencesState(Array.from(xml.querySelectorAll('element-citation')));
            expect(state).toEqual([
                {
                    _id: 'bib25',
                    authors: [
                        { firstName: 'D', lastName: 'Zoolander' },
                        { firstName: '', lastName: 'Hansel' },
                        { firstName: 'J', lastName: 'Mugatu' },
                    ],
                    _type: 'journal',
                    referenceInfo: expect.any(JournalReference),
                },
            ]);

            expect(JournalReference).toBeCalledWith(xml.querySelectorAll('element-citation')[0]);
        });

        it('creates a state with multiple references', () => {
            const xml = parseXML(`<article>
        <ref id="bib25">
          <element-citation publication-type="book">
            <person-group person-group-type="author">
              <name> <surname>Zoolander</surname> <given-names>D</given-names> </name>
              <name> <surname>Hansel</surname> </name>
              <name> <surname>Mugatu</surname> <given-names>J</given-names> </name>
            </person-group>
            <year iso-8601-date="2019">2019</year>
            <article-title>Second related article title (if present)</article-title>
            <source>eLife</source>
            <volume>8</volume>
            <elocation-id>e00067</elocation-id>
            <pub-id pub-id-type="doi">10.7554/eLife.00067</pub-id>
            <pub-id pub-id-type="pmid">00030000</pub-id>
            <pub-id pub-id-type="pmcid">PMC00005</pub-id>
          </element-citation>
        </ref>
        <ref id="bib24">
          <element-citation publication-type="periodical">
            <person-group person-group-type="author">
              <name> <surname>Zhang</surname> <given-names>S</given-names> </name>
              <name> <surname>Huang</surname> <given-names>CH</given-names> </name>
              <name> <surname>Aj</surname> <given-names>Y</given-names> </name>
            </person-group>
            <year iso-8601-date="2014">2014</year>
            <article-title>Sequential effects: a bayesian analysis of prior bias on reaction time and behavioral choice</article-title>
            <source>Cognitive Science Society</source>
          </element-citation>
        </ref>
      </article>`);

            const state = createReferencesState(Array.from(xml.querySelectorAll('element-citation')));
            expect(state).toEqual([
                {
                    _id: 'bib25',
                    authors: [
                        { firstName: 'D', lastName: 'Zoolander' },
                        { firstName: '', lastName: 'Hansel' },
                        { firstName: 'J', lastName: 'Mugatu' },
                    ],
                    _type: 'book',
                    referenceInfo: expect.any(BookReference),
                },
                {
                    _id: 'bib24',
                    authors: [
                        { firstName: 'S', lastName: 'Zhang' },
                        { firstName: 'CH', lastName: 'Huang' },
                        { firstName: 'Y', lastName: 'Aj' },
                    ],
                    _type: 'periodical',
                    referenceInfo: expect.any(PeriodicalReference),
                },
            ]);

            expect(BookReference).toBeCalledWith(xml.querySelectorAll('element-citation')[0]);
            expect(PeriodicalReference).toBeCalledWith(xml.querySelectorAll('element-citation')[1]);
        });
    });
});

describe('serializeReferenceState', () => {
    beforeAll(() => {
        (JournalReference as jest.Mock).mockImplementation((data) => {
            return new (jest.requireActual('../../../../src/model/reference/JournalReference').JournalReference)(data);
        });
    });
    afterAll(() => {
        (JournalReference as jest.Mock).mockReset();
    });
    it('returns references in order', () => {
        const xml = parseXML(`<article><back/></article>`);
        const mockManuscript = {
            references: [
                new Reference({
                    _type: 'journal',
                    authors: [{ firstName: 'Bob', lastName: 'Bobson' }],
                    referenceInfo: { year: '1999' },
                }),
                new Reference({
                    _type: 'journal',
                    authors: [{ firstName: 'Bob', lastName: 'Bobson' }],
                    referenceInfo: { year: '1991' },
                }),
                new Reference({
                    _type: 'journal',
                    authors: [{ firstName: 'Alice', lastName: 'Alison' }],
                    referenceInfo: { year: '2002' },
                }),
            ],
        } as unknown as Manuscript;

        serializeReferenceState(xml, mockManuscript);
        expect(serializer.serializeToString(xml)).toBe(
            '<article><back><ref-list><title>References</title>' +
                '<ref id="bib1"><element-citation publication-type="journal"><person-group person-group-type="author"><name><given-names>Alice</given-names><surname>Alison</surname></name></person-group><year iso-8601-date="2002">2002</year></element-citation></ref>' +
                '<ref id="bib2"><element-citation publication-type="journal"><person-group person-group-type="author"><name><given-names>Bob</given-names><surname>Bobson</surname></name></person-group><year iso-8601-date="1991">1991</year></element-citation></ref>' +
                '<ref id="bib3"><element-citation publication-type="journal"><person-group person-group-type="author"><name><given-names>Bob</given-names><surname>Bobson</surname></name></person-group><year iso-8601-date="1999">1999</year></element-citation></ref>' +
                '</ref-list></back></article>',
        );
    });
});
