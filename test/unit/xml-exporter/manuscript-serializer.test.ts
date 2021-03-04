import {EditorState} from "prosemirror-state";
import {DOMSerializer} from "prosemirror-model";
import xmldom from "xmldom";
import {
  createXmlDomSerializer,
  serializeManuscript,
  serializeManuscriptSection
} from "../../../src/xml-exporter/manuscript-serializer";

import {Manuscript} from "../../../src/model/manuscript";
import {serializeAbstractState, serializeImpactStatementState} from "../../../src/model/abstract";
import {serializeTitleState} from "../../../src/model/title";
import {serializeAcknowledgementState} from '../../../src/model/acknowledgements';
import {createBodyState, serializeBodyState} from "../../../src/model/body";
import {serializeRelatedArticles} from "../../../src/model/related-article";

jest.mock('../../../src/model/abstract');
jest.mock('../../../src/model/title');
jest.mock('../../../src/model/acknowledgements');
jest.mock('../../../src/model/body', () => ({
  serializeBodyState: jest.fn(),
  createBodyState: jest.requireActual('../../../src/model/body').createBodyState
}));
jest.mock('../../../src/model/related-article');

describe('serializeManuscript', () => {
  it('invokes all serializers', () => {
    const manuscript: Manuscript = {
      abstract: new EditorState(),
      acknowledgements: new EditorState(),
      affiliations: [],
      authors: [],
      body: new EditorState(),
      impactStatement: new EditorState(),
      journalMeta: {
        publisherName: '',
        issn: ''
      },
      relatedArticles: [],
      title: new EditorState()
    };
    const outputXML = serializeManuscript({
      articleId: "",
      datatype: "",
      fileName: "",
      version: "",
      xml: '<xml-tag>sample xml</xml-tag>'
    }, manuscript);

    const DocumentClass = new xmldom.DOMImplementation().createDocument('', '', null).constructor
    expect(serializeImpactStatementState).toHaveBeenCalledWith(expect.any(DocumentClass), manuscript);
    expect(serializeAbstractState).toHaveBeenCalledWith(expect.any(DocumentClass), manuscript);
    expect(serializeTitleState).toHaveBeenCalledWith(expect.any(DocumentClass), manuscript);
    expect(serializeAcknowledgementState).toHaveBeenCalledWith(expect.any(DocumentClass), manuscript);
    expect(serializeBodyState).toHaveBeenCalledWith(expect.any(DocumentClass), manuscript);
    expect(serializeRelatedArticles).toHaveBeenCalledWith(expect.any(DocumentClass), manuscript);
    expect(outputXML).toBe('<xml-tag>sample xml</xml-tag>')
  });
});

describe('EditorState serializer', () => {
  it('creates a DOMSerializer', () => {
    const xml = new xmldom.DOMImplementation().createDocument('', '', null).createElement('p');
    const editorState = createBodyState(xml);
    const serializer = createXmlDomSerializer(editorState);

    expect(serializer).toBeInstanceOf(DOMSerializer);
    expect(Object.keys(serializer.marks)).toEqual([
      'italic',
      'bold',
      'subscript',
      'superscript',
      'strikethrough',
      'underline',
      'link'
    ]);

    expect(Object.keys(serializer.nodes)).toEqual([
      'paragraph',
      'refCitation',
      'heading',
      'boxText',
      'figureLicense',
      'figure',
      'figureTitle',
      'figureAttribution',
      'figureCitation',
      'figureLegend',
      'listItem',
      'orderedList',
      'bulletList',
      'text'
    ]);
  });

  it('serializes EditorState', () => {
    const xml = new xmldom.DOMImplementation().createDocument('', '', null).createElement('p');
    xml.appendChild(xml.ownerDocument.createTextNode('Test content'));
    const editorState = createBodyState(xml);
    const xmlFragment = serializeManuscriptSection(editorState, xml.ownerDocument);
    expect(xmlFragment.textContent).toBe('Test content');
    expect(xmlFragment).toBeInstanceOf(xml.ownerDocument.createDocumentFragment().constructor);
  });
});

