/**
 * @jest-environment jsdom
 */
import {
  createAbstractState,
  createImpactStatementState,
  serializeAbstractState,
  serializeImpactStatementState
} from '../../../src/model/abstract';

import {parseXML} from "../../../src/xml-exporter/xml-utils";
import {Manuscript} from "../../../src/model/manuscript";

describe('Manuscript state factory', () => {
  it('creates abstract state', () => {
    const el = document.createElement('abstract');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createAbstractState(el);
    expect(editorState).toMatchSnapshot();
  });

  it('creates empty abstract state', () => {
    const editorState = createAbstractState(undefined);
    expect(editorState.doc.textContent).toBe('');
  });

  it('creates impact statement state', () => {
    const el = document.createElement('abstract');
    el.innerHTML = 'A sample <italic>text</italic> with <sub>a</sub> variety of <sup>tags</sup>';
    const editorState = createImpactStatementState(el);
    expect(editorState).toMatchSnapshot();
  });

  it('creates empty impact statement state', () => {
    const editorState = createImpactStatementState(undefined);
    expect(editorState.doc.textContent).toBe('');
  });

  it('serializes abstract', () => {
    const xmlDoc = parseXML(`<article>
        <article-meta>
            <abstract>Initial abstract content</abstract>
        </article-meta>
    </article>`);

    let state = createAbstractState(xmlDoc.querySelector('abstract')!);
    state = state.apply(state.tr.insertText('additional content. '));
    serializeAbstractState(xmlDoc, { 'abstract': state } as Manuscript);
    expect(xmlDoc.querySelector('abstract')!.textContent)
      .toBe('additional content. Initial abstract content')
  });

  it('inserts abstract if not present', () => {
    const xmlDoc = parseXML(`<article>
        <article-meta>
            <abstract>Initial abstract content</abstract>
        </article-meta>
    </article>`);
    const abstractXml = xmlDoc.querySelector('abstract')!;

    let state = createAbstractState(abstractXml);
    abstractXml.parentNode!.removeChild(abstractXml);
    state = state.apply(state.tr.insertText('additional content. '));
    serializeAbstractState(xmlDoc, { 'abstract': state } as Manuscript);
    expect(xmlDoc.querySelector('abstract')!.textContent)
      .toBe('additional content. Initial abstract content')
  });

  it('serializes impact statement', () => {
    const xmlDoc = parseXML(`<article>
        <article-meta>
            <abstract abstract-type="toc">Initial impact statement content</abstract>
        </article-meta>
    </article>`);

    let state = createImpactStatementState(xmlDoc.querySelector('abstract')!);
    state = state.apply(state.tr.insertText('additional content. '));
    serializeImpactStatementState(xmlDoc, { impactStatement: state } as Manuscript);
    expect(xmlDoc.querySelector('abstract')!.textContent)
      .toBe('additional content. Initial impact statement content')
  });

  it('inserts impact statement if not present', () => {
    const xmlDoc = parseXML(`<article>
        <article-meta>
            <abstract abstract-type="toc">Initial abstract content</abstract>
        </article-meta>
    </article>`);
    const abstractXml = xmlDoc.querySelector('abstract')!;

    let state = createImpactStatementState(abstractXml);
    abstractXml.parentNode!.removeChild(abstractXml);
    state = state.apply(state.tr.insertText('additional content. '));
    serializeImpactStatementState(xmlDoc, { impactStatement: state } as Manuscript);
    expect(xmlDoc.querySelector('abstract')!.textContent)
      .toBe('additional content. Initial abstract content')
  });


});
