import {get} from 'lodash';
import {
  DOMParser as ProseMirrorDOMParser,
  DOMSerializer,
  Fragment,
  Node as ProsemirrorNode,
  Schema
} from 'prosemirror-model';
import xmldom from "xmldom";
import { getLicenseUrl } from '../figure';

const MISSING_NODES_SELECTORS_MAP = {
  figureTitle: 'fig > caption > title',
  figureLegend: 'fig > caption > p',
  figureAttribution: 'fig > attrib'
};

export function parseFigure(dom: Element, schema: Schema): Fragment {
  const figureContent = ProseMirrorDOMParser.fromSchema(schema).parseSlice(dom).content;
  const missingNodes = Object.entries(MISSING_NODES_SELECTORS_MAP).reduce((acc, nodeEntry) => {
    const [nodeName, selector] = nodeEntry;
    if (!dom.querySelector(selector)) {
      acc.push(schema.nodes[nodeName].createAndFill() as ProsemirrorNode);
    }
    return acc;
  }, [] as ProsemirrorNode[]);
  const content = figureContent.append(Fragment.fromArray(missingNodes));
  return content;
}

export function serializeFigure(node: ProsemirrorNode): Element {
  const xmlDoc = new xmldom.DOMImplementation().createDocument('', '', null);
  const figure = xmlDoc.createElement('fig');

  const label = xmlDoc.createElement('label');
  label.appendChild(xmlDoc.createTextNode(node.attrs.label));
  figure.appendChild(label);

  const graphic = xmlDoc.createElement('graphic');
  graphic.setAttribute('mime-subtype', get(node.attrs.img.match(/\.([^\.]+)$/), '1', ''));
  graphic.setAttribute(' xlink:href', node.attrs.img);
  graphic.setAttribute('mimetype', 'image');
  figure.appendChild(graphic);

  const caption = xmlDoc.createElement('caption');
  const title = findNodes(node, 'figureTitle')[0];
  caption.appendChild(serializeFigureNode(title, xmlDoc));
  const legend = findNodes(node, 'figureLegend')[0];
  caption.appendChild(serializeFigureNode(legend, xmlDoc));
  const attrib = findNodes(node, 'figureAttribution')[0];
  caption.appendChild(serializeFigureNode(attrib, xmlDoc));
  figure.appendChild(caption);

  findNodes(node, 'figureLicense').map(licenseNode => figure.appendChild(serializeFigureLicense(licenseNode, xmlDoc)));

  return figure;
}

function serializeFigureNode(node: ProsemirrorNode, document: Document): Node {
  const serializer = DOMSerializer.fromSchema(node.type.schema);
  return serializer.serializeNode(node, {document});
}

function serializeFigureLicense(node: ProsemirrorNode, xmlDoc: Document) {
  const permissions = xmlDoc.createElement('permissions');

  const ccStmt = xmlDoc.createElement('copyright-statement');
  ccStmt.appendChild(xmlDoc.createTextNode(node.attrs.licenseInfo.copyrightStatement));
  permissions.appendChild(ccStmt);

  const ccYear = xmlDoc.createElement('copyright-year');
  ccYear.appendChild(xmlDoc.createTextNode(node.attrs.licenseInfo.copyrightYear));
  permissions.appendChild(ccYear);

  const ccHolder = xmlDoc.createElement('copyright-holder');
  ccHolder.appendChild(xmlDoc.createTextNode(node.attrs.licenseInfo.copyrightHolder));
  permissions.appendChild(ccHolder);

  const licenseEl = xmlDoc.createElement('license');
  licenseEl.setAttribute(' xlink:href', getLicenseUrl(node.attrs.licenseInfo.licenseType));
  licenseEl.appendChild(serializeFigureNode(node, xmlDoc));
  permissions.appendChild(licenseEl);

  return permissions;
}

function findNodes(parentNode: ProsemirrorNode, nodeName: string): ProsemirrorNode[] {
  const result: ProsemirrorNode[] = [];

  parentNode.descendants((node: ProsemirrorNode, pos: number, parent: ProsemirrorNode) => {
    if (node.type.name === nodeName) {
      result.push(node);
    }
    return Boolean(node.childCount);
  });

  return result;
}
