import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

export const marks = {
  subscript: {
    parseDOM: [{ tag: 'sub' }],
    toDOM(): DOMOutputSpecArray {
      return ['sub', 0];
    }
  },

  superscript: {
    parseDOM: [{ tag: 'sup' }],
    toDOM(): DOMOutputSpecArray {
      return ['sup', 0];
    }
  },

  italic: {
    parseDOM: [{ tag: 'italic' }],
    toDOM(): DOMOutputSpecArray {
      return ['italic', 0];
    }
  },

  strikethrough: {
    parseDOM: [{ tag: 'sc' }],
    toDOM(): DOMOutputSpecArray {
      return ['sc', 0];
    }
  },

  underline: {
    parseDOM: [{ tag: 'underline' }],
    toDOM(): DOMOutputSpecArray {
      return ['underline', 0];
    }
  },

  bold: {
    parseDOM: [{ tag: 'bold' }],
    toDOM(): DOMOutputSpecArray {
      return ['bold', 0];
    }
  },
  link: {
    attrs: {
      href: { default: undefined }
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'ext-link[ext-link-type="uri"]',
        getAttrs(dom: Element) {
          return { href: dom.getAttribute('xlink:href') };
        }
      }
    ],
    toDOM(node: ProsemirrorNode) {
      const { href } = node.attrs;
      return ['ext-link', { 'xlink:href': href, 'ext-link-type': 'uri' }, 0];
    }
  }
};
