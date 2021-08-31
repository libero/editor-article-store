import xmldom from '@xmldom/xmldom';
import nwmatcher from 'nwmatcher';

export function parseXML(xml: string) {
    const xmlDoc = new xmldom.DOMParser().parseFromString(xml, 'text/xml');

    xmlDoc.constructor.prototype.querySelector = function (selectors: string) {
        return nwmatcher({ document: xmlDoc }).first(selectors, this);
    };

    xmlDoc.constructor.prototype.querySelectorAll = function (selectors: string) {
        return nwmatcher({ document: xmlDoc }).select(selectors, this);
    };

    const Element = xmlDoc.createElement('a').constructor;

    Element.prototype.matches = function (selectors: string) {
        return nwmatcher({ document: xmlDoc }).match(this, selectors);
    };

    Element.prototype.hasAttribute = function (attributeName: string) {
        return nwmatcher({ document: xmlDoc }).hasAttribute(this, attributeName);
    };

    Element.prototype.getAttribute = function (attributeName: string) {
        return nwmatcher({ document: xmlDoc }).getAttribute(this, attributeName);
    };

    Element.prototype.querySelector = function (selectors: string) {
        return nwmatcher({ document: xmlDoc }).first(selectors, this);
    };

    Element.prototype.querySelectorAll = function (selectors: string) {
        return nwmatcher({ document: xmlDoc }).select(selectors, this);
    };

    Element.prototype.replaceWith = function () {
        // based on https://github.com/a7ul/child-replace-with-polyfill
        const parent = this.parentNode;
        let i = arguments.length;
        let currentNode;

        if (!parent) return;
        if (!i) parent.removeChild(this);
        while (i--) {
            // eslint-disable-next-line prefer-rest-params
            currentNode = arguments[i];
            if (typeof currentNode !== 'object') {
                currentNode = this.ownerDocument.createTextNode(currentNode);
            } else if (currentNode.parentNode) {
                currentNode.parentNode.removeChild(currentNode);
            }
            if (!i) parent.replaceChild(currentNode, this);
            else parent.insertBefore(this.previousSibling, currentNode);
        }
    };

    function childrenGetter(this: Node) {
        return Array.from(this.childNodes).filter((node: ChildNode) => node.nodeType === 1);
    }
    Object.defineProperty(Element.prototype, 'children', {
        configurable: true,
        get: childrenGetter,
    });

    return xmlDoc;
}

export function clearNode(el: Element) {
    Array.from(el.childNodes).forEach((child) => child.parentNode!.removeChild(child));
}
