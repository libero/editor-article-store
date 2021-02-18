import xmldom from "xmldom";
import nwmatcher from "nwmatcher";

export function parseXML(xml: string) {

  const xmlDoc = new xmldom.DOMParser().parseFromString(xml, 'text/xml');

  xmlDoc.constructor.prototype.querySelector = function (selectors: string) {
    return nwmatcher({document: xmlDoc}).first(selectors, this);
  };

  xmlDoc.constructor.prototype.querySelectorAll = function (selectors: string) {
    return nwmatcher({document: xmlDoc}).select(selectors, this);
  };

  xmlDoc.createElement('a').constructor.prototype.matches = function (selectors: string) {
    return nwmatcher({document: xmlDoc}).match(this, selectors);
  };

  xmlDoc.createElement('a').constructor.prototype.hasAttribute = function (attributeName: string) {
    return nwmatcher({document: xmlDoc}).hasAttribute(this, attributeName);
  };

  xmlDoc.createElement('a').constructor.prototype.getAttribute = function (attributeName: string) {
    return nwmatcher({document: xmlDoc}).getAttribute(this, attributeName);
  };

  return xmlDoc;
}
