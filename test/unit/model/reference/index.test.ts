import {Reference} from "../../../../src/model/reference";
import {JournalReference} from "../../../../src/model/reference/JournalReference";
import {BookReference} from "../../../../src/model/reference/BookReference";
import {PeriodicalReference} from "../../../../src/model/reference/PeriodicalReference";
import {ReportReference} from "../../../../src/model/reference/ReportReference";
import {DataReference} from "../../../../src/model/reference/DataReference";
import {WebReference} from "../../../../src/model/reference/WebReference";
import {PreprintReference} from "../../../../src/model/reference/PreprintReference";
import {SoftwareReference} from "../../../../src/model/reference/SoftwareReference";
import {ConferenceReference} from "../../../../src/model/reference/ConferenceReference";
import {ThesisReference} from "../../../../src/model/reference/ThesisReference";
import {PatentReference} from "../../../../src/model/reference/PatentReference";
import {parseXML} from "../../../../src/xml-exporter/xml-utils";

jest.mock("uuid", () => ({
  v4: () => "unique_id",
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
});
