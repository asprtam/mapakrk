var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _behaviourConfig, _pos, _size, _window, _focused, _container, _resizeContainer, _footer, _header, _headerInfo, _buttons, _iconElement, _nameElement, _descElement, _contentHolder, _mouseEventPos, _resizeEvents, _resizePoints, _createResizePoints, _movePoint, _id, _name, _type, _icon, _desc, _disableResizeButtons, _enableResizeButtons, _isFullscreen, _userFuncs, _buttonsFuncsStatus, _buttonsFuncs, _aspectRatioScaling, _aspectRatio_wh, _aspectRatio_hw, _sprite, _app, _tooltipTimerClass, _tooltipTimerDeletion, _targetType, _target, _name2, _age, _gender, _lastName, _attributes, _temp, _hovered, _hoverToolTip, _hoverToolTipName, _hoverToolTipAction, _hoverToolTipClosing, _currentTooltipUniqueId, _pinned, _fakeInput, _loader, _mapWindow, _infoWindows, _infoWindowsIndexOf, _infoWindowsIncludes, _humanDataQueue, _createHumanDataQueue;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var lib = {};
var dom = {};
var conventions = {};
var hasRequiredConventions;
function requireConventions() {
  if (hasRequiredConventions) return conventions;
  hasRequiredConventions = 1;
  function find(list, predicate, ac) {
    if (ac === void 0) {
      ac = Array.prototype;
    }
    if (list && typeof ac.find === "function") {
      return ac.find.call(list, predicate);
    }
    for (var i = 0; i < list.length; i++) {
      if (Object.prototype.hasOwnProperty.call(list, i)) {
        var item = list[i];
        if (predicate.call(void 0, item, i, list)) {
          return item;
        }
      }
    }
  }
  function freeze(object, oc) {
    if (oc === void 0) {
      oc = Object;
    }
    return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
  }
  function assign(target, source) {
    if (target === null || typeof target !== "object") {
      throw new TypeError("target is not an object");
    }
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var MIME_TYPE = freeze({
    /**
     * `text/html`, the only mime type that triggers treating an XML document as HTML.
     *
     * @see DOMParser.SupportedType.isHTML
     * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
     * @see https://en.wikipedia.org/wiki/HTML Wikipedia
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
     */
    HTML: "text/html",
    /**
     * Helper method to check a mime type if it indicates an HTML document
     *
     * @param {string} [value]
     * @returns {boolean}
     *
     * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
     * @see https://en.wikipedia.org/wiki/HTML Wikipedia
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
     * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
    isHTML: function(value) {
      return value === MIME_TYPE.HTML;
    },
    /**
     * `application/xml`, the standard mime type for XML documents.
     *
     * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
     * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
     * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
     */
    XML_APPLICATION: "application/xml",
    /**
     * `text/html`, an alias for `application/xml`.
     *
     * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
     * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
     * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
     */
    XML_TEXT: "text/xml",
    /**
     * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
     * but is parsed as an XML document.
     *
     * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
     * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
     */
    XML_XHTML_APPLICATION: "application/xhtml+xml",
    /**
     * `image/svg+xml`,
     *
     * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
     * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
     * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
     */
    XML_SVG_IMAGE: "image/svg+xml"
  });
  var NAMESPACE = freeze({
    /**
     * The XHTML namespace.
     *
     * @see http://www.w3.org/1999/xhtml
     */
    HTML: "http://www.w3.org/1999/xhtml",
    /**
     * Checks if `uri` equals `NAMESPACE.HTML`.
     *
     * @param {string} [uri]
     *
     * @see NAMESPACE.HTML
     */
    isHTML: function(uri) {
      return uri === NAMESPACE.HTML;
    },
    /**
     * The SVG namespace.
     *
     * @see http://www.w3.org/2000/svg
     */
    SVG: "http://www.w3.org/2000/svg",
    /**
     * The `xml:` namespace.
     *
     * @see http://www.w3.org/XML/1998/namespace
     */
    XML: "http://www.w3.org/XML/1998/namespace",
    /**
     * The `xmlns:` namespace
     *
     * @see https://www.w3.org/2000/xmlns/
     */
    XMLNS: "http://www.w3.org/2000/xmlns/"
  });
  conventions.assign = assign;
  conventions.find = find;
  conventions.freeze = freeze;
  conventions.MIME_TYPE = MIME_TYPE;
  conventions.NAMESPACE = NAMESPACE;
  return conventions;
}
var hasRequiredDom;
function requireDom() {
  if (hasRequiredDom) return dom;
  hasRequiredDom = 1;
  var conventions2 = requireConventions();
  var find = conventions2.find;
  var NAMESPACE = conventions2.NAMESPACE;
  function notEmptyString(input) {
    return input !== "";
  }
  function splitOnASCIIWhitespace(input) {
    return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
  }
  function orderedSetReducer(current, element) {
    if (!current.hasOwnProperty(element)) {
      current[element] = true;
    }
    return current;
  }
  function toOrderedSet(input) {
    if (!input) return [];
    var list = splitOnASCIIWhitespace(input);
    return Object.keys(list.reduce(orderedSetReducer, {}));
  }
  function arrayIncludes(list) {
    return function(element) {
      return list && list.indexOf(element) !== -1;
    };
  }
  function copy(src, dest) {
    for (var p in src) {
      if (Object.prototype.hasOwnProperty.call(src, p)) {
        dest[p] = src[p];
      }
    }
  }
  function _extends(Class, Super) {
    var pt = Class.prototype;
    if (!(pt instanceof Super)) {
      let t2 = function() {
      };
      var t = t2;
      t2.prototype = Super.prototype;
      t2 = new t2();
      copy(pt, t2);
      Class.prototype = pt = t2;
    }
    if (pt.constructor != Class) {
      if (typeof Class != "function") {
        console.error("unknown Class:" + Class);
      }
      pt.constructor = Class;
    }
  }
  var NodeType = {};
  var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
  var TEXT_NODE = NodeType.TEXT_NODE = 3;
  var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
  var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
  var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
  var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
  var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
  var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
  var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
  var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
  var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
  var ExceptionCode = {};
  var ExceptionMessage = {};
  ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
  ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
  var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
  ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
  ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
  ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
  ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
  var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
  ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
  var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
  ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
  ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
  ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
  ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
  ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);
  function DOMException(code, message) {
    if (message instanceof Error) {
      var error = message;
    } else {
      error = this;
      Error.call(this, ExceptionMessage[code]);
      this.message = ExceptionMessage[code];
      if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    }
    error.code = code;
    if (message) this.message = this.message + ": " + message;
    return error;
  }
  DOMException.prototype = Error.prototype;
  copy(ExceptionCode, DOMException);
  function NodeList() {
  }
  NodeList.prototype = {
    /**
     * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
     * @standard level1
     */
    length: 0,
    /**
     * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
     * @standard level1
     * @param index  unsigned long
     *   Index into the collection.
     * @return Node
     * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
     */
    item: function(index) {
      return index >= 0 && index < this.length ? this[index] : null;
    },
    toString: function(isHTML, nodeFilter) {
      for (var buf = [], i = 0; i < this.length; i++) {
        serializeToString(this[i], buf, isHTML, nodeFilter);
      }
      return buf.join("");
    },
    /**
     * @private
     * @param {function (Node):boolean} predicate
     * @returns {Node[]}
     */
    filter: function(predicate) {
      return Array.prototype.filter.call(this, predicate);
    },
    /**
     * @private
     * @param {Node} item
     * @returns {number}
     */
    indexOf: function(item) {
      return Array.prototype.indexOf.call(this, item);
    }
  };
  function LiveNodeList(node, refresh) {
    this._node = node;
    this._refresh = refresh;
    _updateLiveList(this);
  }
  function _updateLiveList(list) {
    var inc = list._node._inc || list._node.ownerDocument._inc;
    if (list._inc !== inc) {
      var ls = list._refresh(list._node);
      __set__(list, "length", ls.length);
      if (!list.$$length || ls.length < list.$$length) {
        for (var i = ls.length; i in list; i++) {
          if (Object.prototype.hasOwnProperty.call(list, i)) {
            delete list[i];
          }
        }
      }
      copy(ls, list);
      list._inc = inc;
    }
  }
  LiveNodeList.prototype.item = function(i) {
    _updateLiveList(this);
    return this[i] || null;
  };
  _extends(LiveNodeList, NodeList);
  function NamedNodeMap() {
  }
  function _findNodeIndex(list, node) {
    var i = list.length;
    while (i--) {
      if (list[i] === node) {
        return i;
      }
    }
  }
  function _addNamedNode(el, list, newAttr, oldAttr) {
    if (oldAttr) {
      list[_findNodeIndex(list, oldAttr)] = newAttr;
    } else {
      list[list.length++] = newAttr;
    }
    if (el) {
      newAttr.ownerElement = el;
      var doc = el.ownerDocument;
      if (doc) {
        oldAttr && _onRemoveAttribute(doc, el, oldAttr);
        _onAddAttribute(doc, el, newAttr);
      }
    }
  }
  function _removeNamedNode(el, list, attr) {
    var i = _findNodeIndex(list, attr);
    if (i >= 0) {
      var lastIndex = list.length - 1;
      while (i < lastIndex) {
        list[i] = list[++i];
      }
      list.length = lastIndex;
      if (el) {
        var doc = el.ownerDocument;
        if (doc) {
          _onRemoveAttribute(doc, el, attr);
          attr.ownerElement = null;
        }
      }
    } else {
      throw new DOMException(NOT_FOUND_ERR, new Error(el.tagName + "@" + attr));
    }
  }
  NamedNodeMap.prototype = {
    length: 0,
    item: NodeList.prototype.item,
    getNamedItem: function(key) {
      var i = this.length;
      while (i--) {
        var attr = this[i];
        if (attr.nodeName == key) {
          return attr;
        }
      }
    },
    setNamedItem: function(attr) {
      var el = attr.ownerElement;
      if (el && el != this._ownerElement) {
        throw new DOMException(INUSE_ATTRIBUTE_ERR);
      }
      var oldAttr = this.getNamedItem(attr.nodeName);
      _addNamedNode(this._ownerElement, this, attr, oldAttr);
      return oldAttr;
    },
    /* returns Node */
    setNamedItemNS: function(attr) {
      var el = attr.ownerElement, oldAttr;
      if (el && el != this._ownerElement) {
        throw new DOMException(INUSE_ATTRIBUTE_ERR);
      }
      oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
      _addNamedNode(this._ownerElement, this, attr, oldAttr);
      return oldAttr;
    },
    /* returns Node */
    removeNamedItem: function(key) {
      var attr = this.getNamedItem(key);
      _removeNamedNode(this._ownerElement, this, attr);
      return attr;
    },
    // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
    //for level2
    removeNamedItemNS: function(namespaceURI, localName) {
      var attr = this.getNamedItemNS(namespaceURI, localName);
      _removeNamedNode(this._ownerElement, this, attr);
      return attr;
    },
    getNamedItemNS: function(namespaceURI, localName) {
      var i = this.length;
      while (i--) {
        var node = this[i];
        if (node.localName == localName && node.namespaceURI == namespaceURI) {
          return node;
        }
      }
      return null;
    }
  };
  function DOMImplementation() {
  }
  DOMImplementation.prototype = {
    /**
     * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
     * The different implementations fairly diverged in what kind of features were reported.
     * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
     *
     * @deprecated It is deprecated and modern browsers return true in all cases.
     *
     * @param {string} feature
     * @param {string} [version]
     * @returns {boolean} always true
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
     * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
     */
    hasFeature: function(feature, version) {
      return true;
    },
    /**
     * Creates an XML Document object of the specified type with its document element.
     *
     * __It behaves slightly different from the description in the living standard__:
     * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
     * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
     * - this implementation is not validating names or qualified names
     *   (when parsing XML strings, the SAX parser takes care of that)
     *
     * @param {string|null} namespaceURI
     * @param {string} qualifiedName
     * @param {DocumentType=null} doctype
     * @returns {Document}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
     *
     * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
     * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
     * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
     */
    createDocument: function(namespaceURI, qualifiedName, doctype) {
      var doc = new Document2();
      doc.implementation = this;
      doc.childNodes = new NodeList();
      doc.doctype = doctype || null;
      if (doctype) {
        doc.appendChild(doctype);
      }
      if (qualifiedName) {
        var root = doc.createElementNS(namespaceURI, qualifiedName);
        doc.appendChild(root);
      }
      return doc;
    },
    /**
     * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
     *
     * __This behavior is slightly different from the in the specs__:
     * - this implementation is not validating names or qualified names
     *   (when parsing XML strings, the SAX parser takes care of that)
     *
     * @param {string} qualifiedName
     * @param {string} [publicId]
     * @param {string} [systemId]
     * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
     * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
     * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
     * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
     *
     * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
     * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
     * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
     */
    createDocumentType: function(qualifiedName, publicId, systemId) {
      var node = new DocumentType();
      node.name = qualifiedName;
      node.nodeName = qualifiedName;
      node.publicId = publicId || "";
      node.systemId = systemId || "";
      return node;
    }
  };
  function Node() {
  }
  Node.prototype = {
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibling: null,
    attributes: null,
    parentNode: null,
    childNodes: null,
    ownerDocument: null,
    nodeValue: null,
    namespaceURI: null,
    prefix: null,
    localName: null,
    // Modified in DOM Level 2:
    insertBefore: function(newChild, refChild) {
      return _insertBefore(this, newChild, refChild);
    },
    replaceChild: function(newChild, oldChild) {
      _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
      if (oldChild) {
        this.removeChild(oldChild);
      }
    },
    removeChild: function(oldChild) {
      return _removeChild(this, oldChild);
    },
    appendChild: function(newChild) {
      return this.insertBefore(newChild, null);
    },
    hasChildNodes: function() {
      return this.firstChild != null;
    },
    cloneNode: function(deep) {
      return cloneNode(this.ownerDocument || this, this, deep);
    },
    // Modified in DOM Level 2:
    normalize: function() {
      var child = this.firstChild;
      while (child) {
        var next = child.nextSibling;
        if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
          this.removeChild(next);
          child.appendData(next.data);
        } else {
          child.normalize();
          child = next;
        }
      }
    },
    // Introduced in DOM Level 2:
    isSupported: function(feature, version) {
      return this.ownerDocument.implementation.hasFeature(feature, version);
    },
    // Introduced in DOM Level 2:
    hasAttributes: function() {
      return this.attributes.length > 0;
    },
    /**
     * Look up the prefix associated to the given namespace URI, starting from this node.
     * **The default namespace declarations are ignored by this method.**
     * See Namespace Prefix Lookup for details on the algorithm used by this method.
     *
     * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
     *
     * @param {string | null} namespaceURI
     * @returns {string | null}
     * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
     * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
     * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
     * @see https://github.com/xmldom/xmldom/issues/322
     */
    lookupPrefix: function(namespaceURI) {
      var el = this;
      while (el) {
        var map = el._nsMap;
        if (map) {
          for (var n in map) {
            if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
              return n;
            }
          }
        }
        el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
      }
      return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI: function(prefix) {
      var el = this;
      while (el) {
        var map = el._nsMap;
        if (map) {
          if (Object.prototype.hasOwnProperty.call(map, prefix)) {
            return map[prefix];
          }
        }
        el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
      }
      return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace: function(namespaceURI) {
      var prefix = this.lookupPrefix(namespaceURI);
      return prefix == null;
    }
  };
  function _xmlEncoder(c) {
    return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
  }
  copy(NodeType, Node);
  copy(NodeType, Node.prototype);
  function _visitNode(node, callback) {
    if (callback(node)) {
      return true;
    }
    if (node = node.firstChild) {
      do {
        if (_visitNode(node, callback)) {
          return true;
        }
      } while (node = node.nextSibling);
    }
  }
  function Document2() {
    this.ownerDocument = this;
  }
  function _onAddAttribute(doc, el, newAttr) {
    doc && doc._inc++;
    var ns = newAttr.namespaceURI;
    if (ns === NAMESPACE.XMLNS) {
      el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
    }
  }
  function _onRemoveAttribute(doc, el, newAttr, remove) {
    doc && doc._inc++;
    var ns = newAttr.namespaceURI;
    if (ns === NAMESPACE.XMLNS) {
      delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
    }
  }
  function _onUpdateChild(doc, el, newChild) {
    if (doc && doc._inc) {
      doc._inc++;
      var cs = el.childNodes;
      if (newChild) {
        cs[cs.length++] = newChild;
      } else {
        var child = el.firstChild;
        var i = 0;
        while (child) {
          cs[i++] = child;
          child = child.nextSibling;
        }
        cs.length = i;
        delete cs[cs.length];
      }
    }
  }
  function _removeChild(parentNode, child) {
    var previous = child.previousSibling;
    var next = child.nextSibling;
    if (previous) {
      previous.nextSibling = next;
    } else {
      parentNode.firstChild = next;
    }
    if (next) {
      next.previousSibling = previous;
    } else {
      parentNode.lastChild = previous;
    }
    child.parentNode = null;
    child.previousSibling = null;
    child.nextSibling = null;
    _onUpdateChild(parentNode.ownerDocument, parentNode);
    return child;
  }
  function hasValidParentNodeType(node) {
    return node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE);
  }
  function hasInsertableNodeType(node) {
    return node && (isElementNode(node) || isTextNode(node) || isDocTypeNode(node) || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE);
  }
  function isDocTypeNode(node) {
    return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
  }
  function isElementNode(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
  }
  function isTextNode(node) {
    return node && node.nodeType === Node.TEXT_NODE;
  }
  function isElementInsertionPossible(doc, child) {
    var parentChildNodes = doc.childNodes || [];
    if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
      return false;
    }
    var docTypeNode = find(parentChildNodes, isDocTypeNode);
    return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
  }
  function isElementReplacementPossible(doc, child) {
    var parentChildNodes = doc.childNodes || [];
    function hasElementChildThatIsNotChild(node) {
      return isElementNode(node) && node !== child;
    }
    if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
      return false;
    }
    var docTypeNode = find(parentChildNodes, isDocTypeNode);
    return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
  }
  function assertPreInsertionValidity1to5(parent, node, child) {
    if (!hasValidParentNodeType(parent)) {
      throw new DOMException(HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
    }
    if (child && child.parentNode !== parent) {
      throw new DOMException(NOT_FOUND_ERR, "child not in parent");
    }
    if (
      // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
      !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
      // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
      // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
      // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
      isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE
    ) {
      throw new DOMException(
        HIERARCHY_REQUEST_ERR,
        "Unexpected node type " + node.nodeType + " for parent node type " + parent.nodeType
      );
    }
  }
  function assertPreInsertionValidityInDocument(parent, node, child) {
    var parentChildNodes = parent.childNodes || [];
    var nodeChildNodes = node.childNodes || [];
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      var nodeChildElements = nodeChildNodes.filter(isElementNode);
      if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
      }
      if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
      }
    }
    if (isElementNode(node)) {
      if (!isElementInsertionPossible(parent, child)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
      }
    }
    if (isDocTypeNode(node)) {
      if (find(parentChildNodes, isDocTypeNode)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
      }
      var parentElementChild = find(parentChildNodes, isElementNode);
      if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
      }
      if (!child && parentElementChild) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
      }
    }
  }
  function assertPreReplacementValidityInDocument(parent, node, child) {
    var parentChildNodes = parent.childNodes || [];
    var nodeChildNodes = node.childNodes || [];
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      var nodeChildElements = nodeChildNodes.filter(isElementNode);
      if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
      }
      if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
      }
    }
    if (isElementNode(node)) {
      if (!isElementReplacementPossible(parent, child)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
      }
    }
    if (isDocTypeNode(node)) {
      let hasDoctypeChildThatIsNotChild2 = function(node2) {
        return isDocTypeNode(node2) && node2 !== child;
      };
      var hasDoctypeChildThatIsNotChild = hasDoctypeChildThatIsNotChild2;
      if (find(parentChildNodes, hasDoctypeChildThatIsNotChild2)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
      }
      var parentElementChild = find(parentChildNodes, isElementNode);
      if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
        throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
      }
    }
  }
  function _insertBefore(parent, node, child, _inDocumentAssertion) {
    assertPreInsertionValidity1to5(parent, node, child);
    if (parent.nodeType === Node.DOCUMENT_NODE) {
      (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
    }
    var cp = node.parentNode;
    if (cp) {
      cp.removeChild(node);
    }
    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
      var newFirst = node.firstChild;
      if (newFirst == null) {
        return node;
      }
      var newLast = node.lastChild;
    } else {
      newFirst = newLast = node;
    }
    var pre = child ? child.previousSibling : parent.lastChild;
    newFirst.previousSibling = pre;
    newLast.nextSibling = child;
    if (pre) {
      pre.nextSibling = newFirst;
    } else {
      parent.firstChild = newFirst;
    }
    if (child == null) {
      parent.lastChild = newLast;
    } else {
      child.previousSibling = newLast;
    }
    do {
      newFirst.parentNode = parent;
    } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
    _onUpdateChild(parent.ownerDocument || parent, parent);
    if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
      node.firstChild = node.lastChild = null;
    }
    return node;
  }
  function _appendSingleChild(parentNode, newChild) {
    if (newChild.parentNode) {
      newChild.parentNode.removeChild(newChild);
    }
    newChild.parentNode = parentNode;
    newChild.previousSibling = parentNode.lastChild;
    newChild.nextSibling = null;
    if (newChild.previousSibling) {
      newChild.previousSibling.nextSibling = newChild;
    } else {
      parentNode.firstChild = newChild;
    }
    parentNode.lastChild = newChild;
    _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
    return newChild;
  }
  Document2.prototype = {
    //implementation : null,
    nodeName: "#document",
    nodeType: DOCUMENT_NODE,
    /**
     * The DocumentType node of the document.
     *
     * @readonly
     * @type DocumentType
     */
    doctype: null,
    documentElement: null,
    _inc: 1,
    insertBefore: function(newChild, refChild) {
      if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
        var child = newChild.firstChild;
        while (child) {
          var next = child.nextSibling;
          this.insertBefore(child, refChild);
          child = next;
        }
        return newChild;
      }
      _insertBefore(this, newChild, refChild);
      newChild.ownerDocument = this;
      if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
        this.documentElement = newChild;
      }
      return newChild;
    },
    removeChild: function(oldChild) {
      if (this.documentElement == oldChild) {
        this.documentElement = null;
      }
      return _removeChild(this, oldChild);
    },
    replaceChild: function(newChild, oldChild) {
      _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
      newChild.ownerDocument = this;
      if (oldChild) {
        this.removeChild(oldChild);
      }
      if (isElementNode(newChild)) {
        this.documentElement = newChild;
      }
    },
    // Introduced in DOM Level 2:
    importNode: function(importedNode, deep) {
      return importNode(this, importedNode, deep);
    },
    // Introduced in DOM Level 2:
    getElementById: function(id) {
      var rtv = null;
      _visitNode(this.documentElement, function(node) {
        if (node.nodeType == ELEMENT_NODE) {
          if (node.getAttribute("id") == id) {
            rtv = node;
            return true;
          }
        }
      });
      return rtv;
    },
    /**
     * The `getElementsByClassName` method of `Document` interface returns an array-like object
     * of all child elements which have **all** of the given class name(s).
     *
     * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
     *
     *
     * Warning: This is a live LiveNodeList.
     * Changes in the DOM will reflect in the array as the changes occur.
     * If an element selected by this array no longer qualifies for the selector,
     * it will automatically be removed. Be aware of this for iteration purposes.
     *
     * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
     * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
     */
    getElementsByClassName: function(classNames) {
      var classNamesSet = toOrderedSet(classNames);
      return new LiveNodeList(this, function(base) {
        var ls = [];
        if (classNamesSet.length > 0) {
          _visitNode(base.documentElement, function(node) {
            if (node !== base && node.nodeType === ELEMENT_NODE) {
              var nodeClassNames = node.getAttribute("class");
              if (nodeClassNames) {
                var matches = classNames === nodeClassNames;
                if (!matches) {
                  var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                  matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                }
                if (matches) {
                  ls.push(node);
                }
              }
            }
          });
        }
        return ls;
      });
    },
    //document factory method:
    createElement: function(tagName) {
      var node = new Element2();
      node.ownerDocument = this;
      node.nodeName = tagName;
      node.tagName = tagName;
      node.localName = tagName;
      node.childNodes = new NodeList();
      var attrs = node.attributes = new NamedNodeMap();
      attrs._ownerElement = node;
      return node;
    },
    createDocumentFragment: function() {
      var node = new DocumentFragment();
      node.ownerDocument = this;
      node.childNodes = new NodeList();
      return node;
    },
    createTextNode: function(data) {
      var node = new Text();
      node.ownerDocument = this;
      node.appendData(data);
      return node;
    },
    createComment: function(data) {
      var node = new Comment();
      node.ownerDocument = this;
      node.appendData(data);
      return node;
    },
    createCDATASection: function(data) {
      var node = new CDATASection();
      node.ownerDocument = this;
      node.appendData(data);
      return node;
    },
    createProcessingInstruction: function(target, data) {
      var node = new ProcessingInstruction();
      node.ownerDocument = this;
      node.tagName = node.nodeName = node.target = target;
      node.nodeValue = node.data = data;
      return node;
    },
    createAttribute: function(name) {
      var node = new Attr();
      node.ownerDocument = this;
      node.name = name;
      node.nodeName = name;
      node.localName = name;
      node.specified = true;
      return node;
    },
    createEntityReference: function(name) {
      var node = new EntityReference();
      node.ownerDocument = this;
      node.nodeName = name;
      return node;
    },
    // Introduced in DOM Level 2:
    createElementNS: function(namespaceURI, qualifiedName) {
      var node = new Element2();
      var pl = qualifiedName.split(":");
      var attrs = node.attributes = new NamedNodeMap();
      node.childNodes = new NodeList();
      node.ownerDocument = this;
      node.nodeName = qualifiedName;
      node.tagName = qualifiedName;
      node.namespaceURI = namespaceURI;
      if (pl.length == 2) {
        node.prefix = pl[0];
        node.localName = pl[1];
      } else {
        node.localName = qualifiedName;
      }
      attrs._ownerElement = node;
      return node;
    },
    // Introduced in DOM Level 2:
    createAttributeNS: function(namespaceURI, qualifiedName) {
      var node = new Attr();
      var pl = qualifiedName.split(":");
      node.ownerDocument = this;
      node.nodeName = qualifiedName;
      node.name = qualifiedName;
      node.namespaceURI = namespaceURI;
      node.specified = true;
      if (pl.length == 2) {
        node.prefix = pl[0];
        node.localName = pl[1];
      } else {
        node.localName = qualifiedName;
      }
      return node;
    }
  };
  _extends(Document2, Node);
  function Element2() {
    this._nsMap = {};
  }
  Element2.prototype = {
    nodeType: ELEMENT_NODE,
    hasAttribute: function(name) {
      return this.getAttributeNode(name) != null;
    },
    getAttribute: function(name) {
      var attr = this.getAttributeNode(name);
      return attr && attr.value || "";
    },
    getAttributeNode: function(name) {
      return this.attributes.getNamedItem(name);
    },
    setAttribute: function(name, value) {
      var attr = this.ownerDocument.createAttribute(name);
      attr.value = attr.nodeValue = "" + value;
      this.setAttributeNode(attr);
    },
    removeAttribute: function(name) {
      var attr = this.getAttributeNode(name);
      attr && this.removeAttributeNode(attr);
    },
    //four real opeartion method
    appendChild: function(newChild) {
      if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
        return this.insertBefore(newChild, null);
      } else {
        return _appendSingleChild(this, newChild);
      }
    },
    setAttributeNode: function(newAttr) {
      return this.attributes.setNamedItem(newAttr);
    },
    setAttributeNodeNS: function(newAttr) {
      return this.attributes.setNamedItemNS(newAttr);
    },
    removeAttributeNode: function(oldAttr) {
      return this.attributes.removeNamedItem(oldAttr.nodeName);
    },
    //get real attribute name,and remove it by removeAttributeNode
    removeAttributeNS: function(namespaceURI, localName) {
      var old = this.getAttributeNodeNS(namespaceURI, localName);
      old && this.removeAttributeNode(old);
    },
    hasAttributeNS: function(namespaceURI, localName) {
      return this.getAttributeNodeNS(namespaceURI, localName) != null;
    },
    getAttributeNS: function(namespaceURI, localName) {
      var attr = this.getAttributeNodeNS(namespaceURI, localName);
      return attr && attr.value || "";
    },
    setAttributeNS: function(namespaceURI, qualifiedName, value) {
      var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
      attr.value = attr.nodeValue = "" + value;
      this.setAttributeNode(attr);
    },
    getAttributeNodeNS: function(namespaceURI, localName) {
      return this.attributes.getNamedItemNS(namespaceURI, localName);
    },
    getElementsByTagName: function(tagName) {
      return new LiveNodeList(this, function(base) {
        var ls = [];
        _visitNode(base, function(node) {
          if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === "*" || node.tagName == tagName)) {
            ls.push(node);
          }
        });
        return ls;
      });
    },
    getElementsByTagNameNS: function(namespaceURI, localName) {
      return new LiveNodeList(this, function(base) {
        var ls = [];
        _visitNode(base, function(node) {
          if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
            ls.push(node);
          }
        });
        return ls;
      });
    }
  };
  Document2.prototype.getElementsByTagName = Element2.prototype.getElementsByTagName;
  Document2.prototype.getElementsByTagNameNS = Element2.prototype.getElementsByTagNameNS;
  _extends(Element2, Node);
  function Attr() {
  }
  Attr.prototype.nodeType = ATTRIBUTE_NODE;
  _extends(Attr, Node);
  function CharacterData() {
  }
  CharacterData.prototype = {
    data: "",
    substringData: function(offset, count) {
      return this.data.substring(offset, offset + count);
    },
    appendData: function(text) {
      text = this.data + text;
      this.nodeValue = this.data = text;
      this.length = text.length;
    },
    insertData: function(offset, text) {
      this.replaceData(offset, 0, text);
    },
    appendChild: function(newChild) {
      throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
    },
    deleteData: function(offset, count) {
      this.replaceData(offset, count, "");
    },
    replaceData: function(offset, count, text) {
      var start = this.data.substring(0, offset);
      var end = this.data.substring(offset + count);
      text = start + text + end;
      this.nodeValue = this.data = text;
      this.length = text.length;
    }
  };
  _extends(CharacterData, Node);
  function Text() {
  }
  Text.prototype = {
    nodeName: "#text",
    nodeType: TEXT_NODE,
    splitText: function(offset) {
      var text = this.data;
      var newText = text.substring(offset);
      text = text.substring(0, offset);
      this.data = this.nodeValue = text;
      this.length = text.length;
      var newNode = this.ownerDocument.createTextNode(newText);
      if (this.parentNode) {
        this.parentNode.insertBefore(newNode, this.nextSibling);
      }
      return newNode;
    }
  };
  _extends(Text, CharacterData);
  function Comment() {
  }
  Comment.prototype = {
    nodeName: "#comment",
    nodeType: COMMENT_NODE
  };
  _extends(Comment, CharacterData);
  function CDATASection() {
  }
  CDATASection.prototype = {
    nodeName: "#cdata-section",
    nodeType: CDATA_SECTION_NODE
  };
  _extends(CDATASection, CharacterData);
  function DocumentType() {
  }
  DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
  _extends(DocumentType, Node);
  function Notation() {
  }
  Notation.prototype.nodeType = NOTATION_NODE;
  _extends(Notation, Node);
  function Entity() {
  }
  Entity.prototype.nodeType = ENTITY_NODE;
  _extends(Entity, Node);
  function EntityReference() {
  }
  EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
  _extends(EntityReference, Node);
  function DocumentFragment() {
  }
  DocumentFragment.prototype.nodeName = "#document-fragment";
  DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
  _extends(DocumentFragment, Node);
  function ProcessingInstruction() {
  }
  ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
  _extends(ProcessingInstruction, Node);
  function XMLSerializer() {
  }
  XMLSerializer.prototype.serializeToString = function(node, isHtml, nodeFilter) {
    return nodeSerializeToString.call(node, isHtml, nodeFilter);
  };
  Node.prototype.toString = nodeSerializeToString;
  function nodeSerializeToString(isHtml, nodeFilter) {
    var buf = [];
    var refNode = this.nodeType == 9 && this.documentElement || this;
    var prefix = refNode.prefix;
    var uri = refNode.namespaceURI;
    if (uri && prefix == null) {
      var prefix = refNode.lookupPrefix(uri);
      if (prefix == null) {
        var visibleNamespaces = [
          { namespace: uri, prefix: null }
          //{namespace:uri,prefix:''}
        ];
      }
    }
    serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
    return buf.join("");
  }
  function needNamespaceDefine(node, isHTML, visibleNamespaces) {
    var prefix = node.prefix || "";
    var uri = node.namespaceURI;
    if (!uri) {
      return false;
    }
    if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
      return false;
    }
    var i = visibleNamespaces.length;
    while (i--) {
      var ns = visibleNamespaces[i];
      if (ns.prefix === prefix) {
        return ns.namespace !== uri;
      }
    }
    return true;
  }
  function addSerializedAttribute(buf, qualifiedName, value) {
    buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
  }
  function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
    if (!visibleNamespaces) {
      visibleNamespaces = [];
    }
    if (nodeFilter) {
      node = nodeFilter(node);
      if (node) {
        if (typeof node == "string") {
          buf.push(node);
          return;
        }
      } else {
        return;
      }
    }
    switch (node.nodeType) {
      case ELEMENT_NODE:
        var attrs = node.attributes;
        var len = attrs.length;
        var child = node.firstChild;
        var nodeName = node.tagName;
        isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML;
        var prefixedNodeName = nodeName;
        if (!isHTML && !node.prefix && node.namespaceURI) {
          var defaultNS;
          for (var ai = 0; ai < attrs.length; ai++) {
            if (attrs.item(ai).name === "xmlns") {
              defaultNS = attrs.item(ai).value;
              break;
            }
          }
          if (!defaultNS) {
            for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
              var namespace = visibleNamespaces[nsi];
              if (namespace.prefix === "" && namespace.namespace === node.namespaceURI) {
                defaultNS = namespace.namespace;
                break;
              }
            }
          }
          if (defaultNS !== node.namespaceURI) {
            for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
              var namespace = visibleNamespaces[nsi];
              if (namespace.namespace === node.namespaceURI) {
                if (namespace.prefix) {
                  prefixedNodeName = namespace.prefix + ":" + nodeName;
                }
                break;
              }
            }
          }
        }
        buf.push("<", prefixedNodeName);
        for (var i = 0; i < len; i++) {
          var attr = attrs.item(i);
          if (attr.prefix == "xmlns") {
            visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
          } else if (attr.nodeName == "xmlns") {
            visibleNamespaces.push({ prefix: "", namespace: attr.value });
          }
        }
        for (var i = 0; i < len; i++) {
          var attr = attrs.item(i);
          if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
            var prefix = attr.prefix || "";
            var uri = attr.namespaceURI;
            addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
            visibleNamespaces.push({ prefix, namespace: uri });
          }
          serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
        }
        if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
          var prefix = node.prefix || "";
          var uri = node.namespaceURI;
          addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
          visibleNamespaces.push({ prefix, namespace: uri });
        }
        if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
          buf.push(">");
          if (isHTML && /^script$/i.test(nodeName)) {
            while (child) {
              if (child.data) {
                buf.push(child.data);
              } else {
                serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
              }
              child = child.nextSibling;
            }
          } else {
            while (child) {
              serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
              child = child.nextSibling;
            }
          }
          buf.push("</", prefixedNodeName, ">");
        } else {
          buf.push("/>");
        }
        return;
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        var child = node.firstChild;
        while (child) {
          serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
          child = child.nextSibling;
        }
        return;
      case ATTRIBUTE_NODE:
        return addSerializedAttribute(buf, node.name, node.value);
      case TEXT_NODE:
        return buf.push(
          node.data.replace(/[<&>]/g, _xmlEncoder)
        );
      case CDATA_SECTION_NODE:
        return buf.push("<![CDATA[", node.data, "]]>");
      case COMMENT_NODE:
        return buf.push("<!--", node.data, "-->");
      case DOCUMENT_TYPE_NODE:
        var pubid = node.publicId;
        var sysid = node.systemId;
        buf.push("<!DOCTYPE ", node.name);
        if (pubid) {
          buf.push(" PUBLIC ", pubid);
          if (sysid && sysid != ".") {
            buf.push(" ", sysid);
          }
          buf.push(">");
        } else if (sysid && sysid != ".") {
          buf.push(" SYSTEM ", sysid, ">");
        } else {
          var sub = node.internalSubset;
          if (sub) {
            buf.push(" [", sub, "]");
          }
          buf.push(">");
        }
        return;
      case PROCESSING_INSTRUCTION_NODE:
        return buf.push("<?", node.target, " ", node.data, "?>");
      case ENTITY_REFERENCE_NODE:
        return buf.push("&", node.nodeName, ";");
      //case ENTITY_NODE:
      //case NOTATION_NODE:
      default:
        buf.push("??", node.nodeName);
    }
  }
  function importNode(doc, node, deep) {
    var node2;
    switch (node.nodeType) {
      case ELEMENT_NODE:
        node2 = node.cloneNode(false);
        node2.ownerDocument = doc;
      //var attrs = node2.attributes;
      //var len = attrs.length;
      //for(var i=0;i<len;i++){
      //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
      //}
      case DOCUMENT_FRAGMENT_NODE:
        break;
      case ATTRIBUTE_NODE:
        deep = true;
        break;
    }
    if (!node2) {
      node2 = node.cloneNode(false);
    }
    node2.ownerDocument = doc;
    node2.parentNode = null;
    if (deep) {
      var child = node.firstChild;
      while (child) {
        node2.appendChild(importNode(doc, child, deep));
        child = child.nextSibling;
      }
    }
    return node2;
  }
  function cloneNode(doc, node, deep) {
    var node2 = new node.constructor();
    for (var n in node) {
      if (Object.prototype.hasOwnProperty.call(node, n)) {
        var v = node[n];
        if (typeof v != "object") {
          if (v != node2[n]) {
            node2[n] = v;
          }
        }
      }
    }
    if (node.childNodes) {
      node2.childNodes = new NodeList();
    }
    node2.ownerDocument = doc;
    switch (node2.nodeType) {
      case ELEMENT_NODE:
        var attrs = node.attributes;
        var attrs2 = node2.attributes = new NamedNodeMap();
        var len = attrs.length;
        attrs2._ownerElement = node2;
        for (var i = 0; i < len; i++) {
          node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
        }
        break;
      case ATTRIBUTE_NODE:
        deep = true;
    }
    if (deep) {
      var child = node.firstChild;
      while (child) {
        node2.appendChild(cloneNode(doc, child, deep));
        child = child.nextSibling;
      }
    }
    return node2;
  }
  function __set__(object, key, value) {
    object[key] = value;
  }
  try {
    if (Object.defineProperty) {
      let getTextContent2 = function(node) {
        switch (node.nodeType) {
          case ELEMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE:
            var buf = [];
            node = node.firstChild;
            while (node) {
              if (node.nodeType !== 7 && node.nodeType !== 8) {
                buf.push(getTextContent2(node));
              }
              node = node.nextSibling;
            }
            return buf.join("");
          default:
            return node.nodeValue;
        }
      };
      var getTextContent = getTextContent2;
      Object.defineProperty(LiveNodeList.prototype, "length", {
        get: function() {
          _updateLiveList(this);
          return this.$$length;
        }
      });
      Object.defineProperty(Node.prototype, "textContent", {
        get: function() {
          return getTextContent2(this);
        },
        set: function(data) {
          switch (this.nodeType) {
            case ELEMENT_NODE:
            case DOCUMENT_FRAGMENT_NODE:
              while (this.firstChild) {
                this.removeChild(this.firstChild);
              }
              if (data || String(data)) {
                this.appendChild(this.ownerDocument.createTextNode(data));
              }
              break;
            default:
              this.data = data;
              this.value = data;
              this.nodeValue = data;
          }
        }
      });
      __set__ = function(object, key, value) {
        object["$$" + key] = value;
      };
    }
  } catch (e2) {
  }
  dom.DocumentType = DocumentType;
  dom.DOMException = DOMException;
  dom.DOMImplementation = DOMImplementation;
  dom.Element = Element2;
  dom.Node = Node;
  dom.NodeList = NodeList;
  dom.XMLSerializer = XMLSerializer;
  return dom;
}
var domParser = {};
var entities = {};
var hasRequiredEntities;
function requireEntities() {
  if (hasRequiredEntities) return entities;
  hasRequiredEntities = 1;
  (function(exports) {
    var freeze = requireConventions().freeze;
    exports.XML_ENTITIES = freeze({
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    });
    exports.HTML_ENTITIES = freeze({
      Aacute: "Á",
      aacute: "á",
      Abreve: "Ă",
      abreve: "ă",
      ac: "∾",
      acd: "∿",
      acE: "∾̳",
      Acirc: "Â",
      acirc: "â",
      acute: "´",
      Acy: "А",
      acy: "а",
      AElig: "Æ",
      aelig: "æ",
      af: "⁡",
      Afr: "𝔄",
      afr: "𝔞",
      Agrave: "À",
      agrave: "à",
      alefsym: "ℵ",
      aleph: "ℵ",
      Alpha: "Α",
      alpha: "α",
      Amacr: "Ā",
      amacr: "ā",
      amalg: "⨿",
      AMP: "&",
      amp: "&",
      And: "⩓",
      and: "∧",
      andand: "⩕",
      andd: "⩜",
      andslope: "⩘",
      andv: "⩚",
      ang: "∠",
      ange: "⦤",
      angle: "∠",
      angmsd: "∡",
      angmsdaa: "⦨",
      angmsdab: "⦩",
      angmsdac: "⦪",
      angmsdad: "⦫",
      angmsdae: "⦬",
      angmsdaf: "⦭",
      angmsdag: "⦮",
      angmsdah: "⦯",
      angrt: "∟",
      angrtvb: "⊾",
      angrtvbd: "⦝",
      angsph: "∢",
      angst: "Å",
      angzarr: "⍼",
      Aogon: "Ą",
      aogon: "ą",
      Aopf: "𝔸",
      aopf: "𝕒",
      ap: "≈",
      apacir: "⩯",
      apE: "⩰",
      ape: "≊",
      apid: "≋",
      apos: "'",
      ApplyFunction: "⁡",
      approx: "≈",
      approxeq: "≊",
      Aring: "Å",
      aring: "å",
      Ascr: "𝒜",
      ascr: "𝒶",
      Assign: "≔",
      ast: "*",
      asymp: "≈",
      asympeq: "≍",
      Atilde: "Ã",
      atilde: "ã",
      Auml: "Ä",
      auml: "ä",
      awconint: "∳",
      awint: "⨑",
      backcong: "≌",
      backepsilon: "϶",
      backprime: "‵",
      backsim: "∽",
      backsimeq: "⋍",
      Backslash: "∖",
      Barv: "⫧",
      barvee: "⊽",
      Barwed: "⌆",
      barwed: "⌅",
      barwedge: "⌅",
      bbrk: "⎵",
      bbrktbrk: "⎶",
      bcong: "≌",
      Bcy: "Б",
      bcy: "б",
      bdquo: "„",
      becaus: "∵",
      Because: "∵",
      because: "∵",
      bemptyv: "⦰",
      bepsi: "϶",
      bernou: "ℬ",
      Bernoullis: "ℬ",
      Beta: "Β",
      beta: "β",
      beth: "ℶ",
      between: "≬",
      Bfr: "𝔅",
      bfr: "𝔟",
      bigcap: "⋂",
      bigcirc: "◯",
      bigcup: "⋃",
      bigodot: "⨀",
      bigoplus: "⨁",
      bigotimes: "⨂",
      bigsqcup: "⨆",
      bigstar: "★",
      bigtriangledown: "▽",
      bigtriangleup: "△",
      biguplus: "⨄",
      bigvee: "⋁",
      bigwedge: "⋀",
      bkarow: "⤍",
      blacklozenge: "⧫",
      blacksquare: "▪",
      blacktriangle: "▴",
      blacktriangledown: "▾",
      blacktriangleleft: "◂",
      blacktriangleright: "▸",
      blank: "␣",
      blk12: "▒",
      blk14: "░",
      blk34: "▓",
      block: "█",
      bne: "=⃥",
      bnequiv: "≡⃥",
      bNot: "⫭",
      bnot: "⌐",
      Bopf: "𝔹",
      bopf: "𝕓",
      bot: "⊥",
      bottom: "⊥",
      bowtie: "⋈",
      boxbox: "⧉",
      boxDL: "╗",
      boxDl: "╖",
      boxdL: "╕",
      boxdl: "┐",
      boxDR: "╔",
      boxDr: "╓",
      boxdR: "╒",
      boxdr: "┌",
      boxH: "═",
      boxh: "─",
      boxHD: "╦",
      boxHd: "╤",
      boxhD: "╥",
      boxhd: "┬",
      boxHU: "╩",
      boxHu: "╧",
      boxhU: "╨",
      boxhu: "┴",
      boxminus: "⊟",
      boxplus: "⊞",
      boxtimes: "⊠",
      boxUL: "╝",
      boxUl: "╜",
      boxuL: "╛",
      boxul: "┘",
      boxUR: "╚",
      boxUr: "╙",
      boxuR: "╘",
      boxur: "└",
      boxV: "║",
      boxv: "│",
      boxVH: "╬",
      boxVh: "╫",
      boxvH: "╪",
      boxvh: "┼",
      boxVL: "╣",
      boxVl: "╢",
      boxvL: "╡",
      boxvl: "┤",
      boxVR: "╠",
      boxVr: "╟",
      boxvR: "╞",
      boxvr: "├",
      bprime: "‵",
      Breve: "˘",
      breve: "˘",
      brvbar: "¦",
      Bscr: "ℬ",
      bscr: "𝒷",
      bsemi: "⁏",
      bsim: "∽",
      bsime: "⋍",
      bsol: "\\",
      bsolb: "⧅",
      bsolhsub: "⟈",
      bull: "•",
      bullet: "•",
      bump: "≎",
      bumpE: "⪮",
      bumpe: "≏",
      Bumpeq: "≎",
      bumpeq: "≏",
      Cacute: "Ć",
      cacute: "ć",
      Cap: "⋒",
      cap: "∩",
      capand: "⩄",
      capbrcup: "⩉",
      capcap: "⩋",
      capcup: "⩇",
      capdot: "⩀",
      CapitalDifferentialD: "ⅅ",
      caps: "∩︀",
      caret: "⁁",
      caron: "ˇ",
      Cayleys: "ℭ",
      ccaps: "⩍",
      Ccaron: "Č",
      ccaron: "č",
      Ccedil: "Ç",
      ccedil: "ç",
      Ccirc: "Ĉ",
      ccirc: "ĉ",
      Cconint: "∰",
      ccups: "⩌",
      ccupssm: "⩐",
      Cdot: "Ċ",
      cdot: "ċ",
      cedil: "¸",
      Cedilla: "¸",
      cemptyv: "⦲",
      cent: "¢",
      CenterDot: "·",
      centerdot: "·",
      Cfr: "ℭ",
      cfr: "𝔠",
      CHcy: "Ч",
      chcy: "ч",
      check: "✓",
      checkmark: "✓",
      Chi: "Χ",
      chi: "χ",
      cir: "○",
      circ: "ˆ",
      circeq: "≗",
      circlearrowleft: "↺",
      circlearrowright: "↻",
      circledast: "⊛",
      circledcirc: "⊚",
      circleddash: "⊝",
      CircleDot: "⊙",
      circledR: "®",
      circledS: "Ⓢ",
      CircleMinus: "⊖",
      CirclePlus: "⊕",
      CircleTimes: "⊗",
      cirE: "⧃",
      cire: "≗",
      cirfnint: "⨐",
      cirmid: "⫯",
      cirscir: "⧂",
      ClockwiseContourIntegral: "∲",
      CloseCurlyDoubleQuote: "”",
      CloseCurlyQuote: "’",
      clubs: "♣",
      clubsuit: "♣",
      Colon: "∷",
      colon: ":",
      Colone: "⩴",
      colone: "≔",
      coloneq: "≔",
      comma: ",",
      commat: "@",
      comp: "∁",
      compfn: "∘",
      complement: "∁",
      complexes: "ℂ",
      cong: "≅",
      congdot: "⩭",
      Congruent: "≡",
      Conint: "∯",
      conint: "∮",
      ContourIntegral: "∮",
      Copf: "ℂ",
      copf: "𝕔",
      coprod: "∐",
      Coproduct: "∐",
      COPY: "©",
      copy: "©",
      copysr: "℗",
      CounterClockwiseContourIntegral: "∳",
      crarr: "↵",
      Cross: "⨯",
      cross: "✗",
      Cscr: "𝒞",
      cscr: "𝒸",
      csub: "⫏",
      csube: "⫑",
      csup: "⫐",
      csupe: "⫒",
      ctdot: "⋯",
      cudarrl: "⤸",
      cudarrr: "⤵",
      cuepr: "⋞",
      cuesc: "⋟",
      cularr: "↶",
      cularrp: "⤽",
      Cup: "⋓",
      cup: "∪",
      cupbrcap: "⩈",
      CupCap: "≍",
      cupcap: "⩆",
      cupcup: "⩊",
      cupdot: "⊍",
      cupor: "⩅",
      cups: "∪︀",
      curarr: "↷",
      curarrm: "⤼",
      curlyeqprec: "⋞",
      curlyeqsucc: "⋟",
      curlyvee: "⋎",
      curlywedge: "⋏",
      curren: "¤",
      curvearrowleft: "↶",
      curvearrowright: "↷",
      cuvee: "⋎",
      cuwed: "⋏",
      cwconint: "∲",
      cwint: "∱",
      cylcty: "⌭",
      Dagger: "‡",
      dagger: "†",
      daleth: "ℸ",
      Darr: "↡",
      dArr: "⇓",
      darr: "↓",
      dash: "‐",
      Dashv: "⫤",
      dashv: "⊣",
      dbkarow: "⤏",
      dblac: "˝",
      Dcaron: "Ď",
      dcaron: "ď",
      Dcy: "Д",
      dcy: "д",
      DD: "ⅅ",
      dd: "ⅆ",
      ddagger: "‡",
      ddarr: "⇊",
      DDotrahd: "⤑",
      ddotseq: "⩷",
      deg: "°",
      Del: "∇",
      Delta: "Δ",
      delta: "δ",
      demptyv: "⦱",
      dfisht: "⥿",
      Dfr: "𝔇",
      dfr: "𝔡",
      dHar: "⥥",
      dharl: "⇃",
      dharr: "⇂",
      DiacriticalAcute: "´",
      DiacriticalDot: "˙",
      DiacriticalDoubleAcute: "˝",
      DiacriticalGrave: "`",
      DiacriticalTilde: "˜",
      diam: "⋄",
      Diamond: "⋄",
      diamond: "⋄",
      diamondsuit: "♦",
      diams: "♦",
      die: "¨",
      DifferentialD: "ⅆ",
      digamma: "ϝ",
      disin: "⋲",
      div: "÷",
      divide: "÷",
      divideontimes: "⋇",
      divonx: "⋇",
      DJcy: "Ђ",
      djcy: "ђ",
      dlcorn: "⌞",
      dlcrop: "⌍",
      dollar: "$",
      Dopf: "𝔻",
      dopf: "𝕕",
      Dot: "¨",
      dot: "˙",
      DotDot: "⃜",
      doteq: "≐",
      doteqdot: "≑",
      DotEqual: "≐",
      dotminus: "∸",
      dotplus: "∔",
      dotsquare: "⊡",
      doublebarwedge: "⌆",
      DoubleContourIntegral: "∯",
      DoubleDot: "¨",
      DoubleDownArrow: "⇓",
      DoubleLeftArrow: "⇐",
      DoubleLeftRightArrow: "⇔",
      DoubleLeftTee: "⫤",
      DoubleLongLeftArrow: "⟸",
      DoubleLongLeftRightArrow: "⟺",
      DoubleLongRightArrow: "⟹",
      DoubleRightArrow: "⇒",
      DoubleRightTee: "⊨",
      DoubleUpArrow: "⇑",
      DoubleUpDownArrow: "⇕",
      DoubleVerticalBar: "∥",
      DownArrow: "↓",
      Downarrow: "⇓",
      downarrow: "↓",
      DownArrowBar: "⤓",
      DownArrowUpArrow: "⇵",
      DownBreve: "̑",
      downdownarrows: "⇊",
      downharpoonleft: "⇃",
      downharpoonright: "⇂",
      DownLeftRightVector: "⥐",
      DownLeftTeeVector: "⥞",
      DownLeftVector: "↽",
      DownLeftVectorBar: "⥖",
      DownRightTeeVector: "⥟",
      DownRightVector: "⇁",
      DownRightVectorBar: "⥗",
      DownTee: "⊤",
      DownTeeArrow: "↧",
      drbkarow: "⤐",
      drcorn: "⌟",
      drcrop: "⌌",
      Dscr: "𝒟",
      dscr: "𝒹",
      DScy: "Ѕ",
      dscy: "ѕ",
      dsol: "⧶",
      Dstrok: "Đ",
      dstrok: "đ",
      dtdot: "⋱",
      dtri: "▿",
      dtrif: "▾",
      duarr: "⇵",
      duhar: "⥯",
      dwangle: "⦦",
      DZcy: "Џ",
      dzcy: "џ",
      dzigrarr: "⟿",
      Eacute: "É",
      eacute: "é",
      easter: "⩮",
      Ecaron: "Ě",
      ecaron: "ě",
      ecir: "≖",
      Ecirc: "Ê",
      ecirc: "ê",
      ecolon: "≕",
      Ecy: "Э",
      ecy: "э",
      eDDot: "⩷",
      Edot: "Ė",
      eDot: "≑",
      edot: "ė",
      ee: "ⅇ",
      efDot: "≒",
      Efr: "𝔈",
      efr: "𝔢",
      eg: "⪚",
      Egrave: "È",
      egrave: "è",
      egs: "⪖",
      egsdot: "⪘",
      el: "⪙",
      Element: "∈",
      elinters: "⏧",
      ell: "ℓ",
      els: "⪕",
      elsdot: "⪗",
      Emacr: "Ē",
      emacr: "ē",
      empty: "∅",
      emptyset: "∅",
      EmptySmallSquare: "◻",
      emptyv: "∅",
      EmptyVerySmallSquare: "▫",
      emsp: " ",
      emsp13: " ",
      emsp14: " ",
      ENG: "Ŋ",
      eng: "ŋ",
      ensp: " ",
      Eogon: "Ę",
      eogon: "ę",
      Eopf: "𝔼",
      eopf: "𝕖",
      epar: "⋕",
      eparsl: "⧣",
      eplus: "⩱",
      epsi: "ε",
      Epsilon: "Ε",
      epsilon: "ε",
      epsiv: "ϵ",
      eqcirc: "≖",
      eqcolon: "≕",
      eqsim: "≂",
      eqslantgtr: "⪖",
      eqslantless: "⪕",
      Equal: "⩵",
      equals: "=",
      EqualTilde: "≂",
      equest: "≟",
      Equilibrium: "⇌",
      equiv: "≡",
      equivDD: "⩸",
      eqvparsl: "⧥",
      erarr: "⥱",
      erDot: "≓",
      Escr: "ℰ",
      escr: "ℯ",
      esdot: "≐",
      Esim: "⩳",
      esim: "≂",
      Eta: "Η",
      eta: "η",
      ETH: "Ð",
      eth: "ð",
      Euml: "Ë",
      euml: "ë",
      euro: "€",
      excl: "!",
      exist: "∃",
      Exists: "∃",
      expectation: "ℰ",
      ExponentialE: "ⅇ",
      exponentiale: "ⅇ",
      fallingdotseq: "≒",
      Fcy: "Ф",
      fcy: "ф",
      female: "♀",
      ffilig: "ﬃ",
      fflig: "ﬀ",
      ffllig: "ﬄ",
      Ffr: "𝔉",
      ffr: "𝔣",
      filig: "ﬁ",
      FilledSmallSquare: "◼",
      FilledVerySmallSquare: "▪",
      fjlig: "fj",
      flat: "♭",
      fllig: "ﬂ",
      fltns: "▱",
      fnof: "ƒ",
      Fopf: "𝔽",
      fopf: "𝕗",
      ForAll: "∀",
      forall: "∀",
      fork: "⋔",
      forkv: "⫙",
      Fouriertrf: "ℱ",
      fpartint: "⨍",
      frac12: "½",
      frac13: "⅓",
      frac14: "¼",
      frac15: "⅕",
      frac16: "⅙",
      frac18: "⅛",
      frac23: "⅔",
      frac25: "⅖",
      frac34: "¾",
      frac35: "⅗",
      frac38: "⅜",
      frac45: "⅘",
      frac56: "⅚",
      frac58: "⅝",
      frac78: "⅞",
      frasl: "⁄",
      frown: "⌢",
      Fscr: "ℱ",
      fscr: "𝒻",
      gacute: "ǵ",
      Gamma: "Γ",
      gamma: "γ",
      Gammad: "Ϝ",
      gammad: "ϝ",
      gap: "⪆",
      Gbreve: "Ğ",
      gbreve: "ğ",
      Gcedil: "Ģ",
      Gcirc: "Ĝ",
      gcirc: "ĝ",
      Gcy: "Г",
      gcy: "г",
      Gdot: "Ġ",
      gdot: "ġ",
      gE: "≧",
      ge: "≥",
      gEl: "⪌",
      gel: "⋛",
      geq: "≥",
      geqq: "≧",
      geqslant: "⩾",
      ges: "⩾",
      gescc: "⪩",
      gesdot: "⪀",
      gesdoto: "⪂",
      gesdotol: "⪄",
      gesl: "⋛︀",
      gesles: "⪔",
      Gfr: "𝔊",
      gfr: "𝔤",
      Gg: "⋙",
      gg: "≫",
      ggg: "⋙",
      gimel: "ℷ",
      GJcy: "Ѓ",
      gjcy: "ѓ",
      gl: "≷",
      gla: "⪥",
      glE: "⪒",
      glj: "⪤",
      gnap: "⪊",
      gnapprox: "⪊",
      gnE: "≩",
      gne: "⪈",
      gneq: "⪈",
      gneqq: "≩",
      gnsim: "⋧",
      Gopf: "𝔾",
      gopf: "𝕘",
      grave: "`",
      GreaterEqual: "≥",
      GreaterEqualLess: "⋛",
      GreaterFullEqual: "≧",
      GreaterGreater: "⪢",
      GreaterLess: "≷",
      GreaterSlantEqual: "⩾",
      GreaterTilde: "≳",
      Gscr: "𝒢",
      gscr: "ℊ",
      gsim: "≳",
      gsime: "⪎",
      gsiml: "⪐",
      Gt: "≫",
      GT: ">",
      gt: ">",
      gtcc: "⪧",
      gtcir: "⩺",
      gtdot: "⋗",
      gtlPar: "⦕",
      gtquest: "⩼",
      gtrapprox: "⪆",
      gtrarr: "⥸",
      gtrdot: "⋗",
      gtreqless: "⋛",
      gtreqqless: "⪌",
      gtrless: "≷",
      gtrsim: "≳",
      gvertneqq: "≩︀",
      gvnE: "≩︀",
      Hacek: "ˇ",
      hairsp: " ",
      half: "½",
      hamilt: "ℋ",
      HARDcy: "Ъ",
      hardcy: "ъ",
      hArr: "⇔",
      harr: "↔",
      harrcir: "⥈",
      harrw: "↭",
      Hat: "^",
      hbar: "ℏ",
      Hcirc: "Ĥ",
      hcirc: "ĥ",
      hearts: "♥",
      heartsuit: "♥",
      hellip: "…",
      hercon: "⊹",
      Hfr: "ℌ",
      hfr: "𝔥",
      HilbertSpace: "ℋ",
      hksearow: "⤥",
      hkswarow: "⤦",
      hoarr: "⇿",
      homtht: "∻",
      hookleftarrow: "↩",
      hookrightarrow: "↪",
      Hopf: "ℍ",
      hopf: "𝕙",
      horbar: "―",
      HorizontalLine: "─",
      Hscr: "ℋ",
      hscr: "𝒽",
      hslash: "ℏ",
      Hstrok: "Ħ",
      hstrok: "ħ",
      HumpDownHump: "≎",
      HumpEqual: "≏",
      hybull: "⁃",
      hyphen: "‐",
      Iacute: "Í",
      iacute: "í",
      ic: "⁣",
      Icirc: "Î",
      icirc: "î",
      Icy: "И",
      icy: "и",
      Idot: "İ",
      IEcy: "Е",
      iecy: "е",
      iexcl: "¡",
      iff: "⇔",
      Ifr: "ℑ",
      ifr: "𝔦",
      Igrave: "Ì",
      igrave: "ì",
      ii: "ⅈ",
      iiiint: "⨌",
      iiint: "∭",
      iinfin: "⧜",
      iiota: "℩",
      IJlig: "Ĳ",
      ijlig: "ĳ",
      Im: "ℑ",
      Imacr: "Ī",
      imacr: "ī",
      image: "ℑ",
      ImaginaryI: "ⅈ",
      imagline: "ℐ",
      imagpart: "ℑ",
      imath: "ı",
      imof: "⊷",
      imped: "Ƶ",
      Implies: "⇒",
      in: "∈",
      incare: "℅",
      infin: "∞",
      infintie: "⧝",
      inodot: "ı",
      Int: "∬",
      int: "∫",
      intcal: "⊺",
      integers: "ℤ",
      Integral: "∫",
      intercal: "⊺",
      Intersection: "⋂",
      intlarhk: "⨗",
      intprod: "⨼",
      InvisibleComma: "⁣",
      InvisibleTimes: "⁢",
      IOcy: "Ё",
      iocy: "ё",
      Iogon: "Į",
      iogon: "į",
      Iopf: "𝕀",
      iopf: "𝕚",
      Iota: "Ι",
      iota: "ι",
      iprod: "⨼",
      iquest: "¿",
      Iscr: "ℐ",
      iscr: "𝒾",
      isin: "∈",
      isindot: "⋵",
      isinE: "⋹",
      isins: "⋴",
      isinsv: "⋳",
      isinv: "∈",
      it: "⁢",
      Itilde: "Ĩ",
      itilde: "ĩ",
      Iukcy: "І",
      iukcy: "і",
      Iuml: "Ï",
      iuml: "ï",
      Jcirc: "Ĵ",
      jcirc: "ĵ",
      Jcy: "Й",
      jcy: "й",
      Jfr: "𝔍",
      jfr: "𝔧",
      jmath: "ȷ",
      Jopf: "𝕁",
      jopf: "𝕛",
      Jscr: "𝒥",
      jscr: "𝒿",
      Jsercy: "Ј",
      jsercy: "ј",
      Jukcy: "Є",
      jukcy: "є",
      Kappa: "Κ",
      kappa: "κ",
      kappav: "ϰ",
      Kcedil: "Ķ",
      kcedil: "ķ",
      Kcy: "К",
      kcy: "к",
      Kfr: "𝔎",
      kfr: "𝔨",
      kgreen: "ĸ",
      KHcy: "Х",
      khcy: "х",
      KJcy: "Ќ",
      kjcy: "ќ",
      Kopf: "𝕂",
      kopf: "𝕜",
      Kscr: "𝒦",
      kscr: "𝓀",
      lAarr: "⇚",
      Lacute: "Ĺ",
      lacute: "ĺ",
      laemptyv: "⦴",
      lagran: "ℒ",
      Lambda: "Λ",
      lambda: "λ",
      Lang: "⟪",
      lang: "⟨",
      langd: "⦑",
      langle: "⟨",
      lap: "⪅",
      Laplacetrf: "ℒ",
      laquo: "«",
      Larr: "↞",
      lArr: "⇐",
      larr: "←",
      larrb: "⇤",
      larrbfs: "⤟",
      larrfs: "⤝",
      larrhk: "↩",
      larrlp: "↫",
      larrpl: "⤹",
      larrsim: "⥳",
      larrtl: "↢",
      lat: "⪫",
      lAtail: "⤛",
      latail: "⤙",
      late: "⪭",
      lates: "⪭︀",
      lBarr: "⤎",
      lbarr: "⤌",
      lbbrk: "❲",
      lbrace: "{",
      lbrack: "[",
      lbrke: "⦋",
      lbrksld: "⦏",
      lbrkslu: "⦍",
      Lcaron: "Ľ",
      lcaron: "ľ",
      Lcedil: "Ļ",
      lcedil: "ļ",
      lceil: "⌈",
      lcub: "{",
      Lcy: "Л",
      lcy: "л",
      ldca: "⤶",
      ldquo: "“",
      ldquor: "„",
      ldrdhar: "⥧",
      ldrushar: "⥋",
      ldsh: "↲",
      lE: "≦",
      le: "≤",
      LeftAngleBracket: "⟨",
      LeftArrow: "←",
      Leftarrow: "⇐",
      leftarrow: "←",
      LeftArrowBar: "⇤",
      LeftArrowRightArrow: "⇆",
      leftarrowtail: "↢",
      LeftCeiling: "⌈",
      LeftDoubleBracket: "⟦",
      LeftDownTeeVector: "⥡",
      LeftDownVector: "⇃",
      LeftDownVectorBar: "⥙",
      LeftFloor: "⌊",
      leftharpoondown: "↽",
      leftharpoonup: "↼",
      leftleftarrows: "⇇",
      LeftRightArrow: "↔",
      Leftrightarrow: "⇔",
      leftrightarrow: "↔",
      leftrightarrows: "⇆",
      leftrightharpoons: "⇋",
      leftrightsquigarrow: "↭",
      LeftRightVector: "⥎",
      LeftTee: "⊣",
      LeftTeeArrow: "↤",
      LeftTeeVector: "⥚",
      leftthreetimes: "⋋",
      LeftTriangle: "⊲",
      LeftTriangleBar: "⧏",
      LeftTriangleEqual: "⊴",
      LeftUpDownVector: "⥑",
      LeftUpTeeVector: "⥠",
      LeftUpVector: "↿",
      LeftUpVectorBar: "⥘",
      LeftVector: "↼",
      LeftVectorBar: "⥒",
      lEg: "⪋",
      leg: "⋚",
      leq: "≤",
      leqq: "≦",
      leqslant: "⩽",
      les: "⩽",
      lescc: "⪨",
      lesdot: "⩿",
      lesdoto: "⪁",
      lesdotor: "⪃",
      lesg: "⋚︀",
      lesges: "⪓",
      lessapprox: "⪅",
      lessdot: "⋖",
      lesseqgtr: "⋚",
      lesseqqgtr: "⪋",
      LessEqualGreater: "⋚",
      LessFullEqual: "≦",
      LessGreater: "≶",
      lessgtr: "≶",
      LessLess: "⪡",
      lesssim: "≲",
      LessSlantEqual: "⩽",
      LessTilde: "≲",
      lfisht: "⥼",
      lfloor: "⌊",
      Lfr: "𝔏",
      lfr: "𝔩",
      lg: "≶",
      lgE: "⪑",
      lHar: "⥢",
      lhard: "↽",
      lharu: "↼",
      lharul: "⥪",
      lhblk: "▄",
      LJcy: "Љ",
      ljcy: "љ",
      Ll: "⋘",
      ll: "≪",
      llarr: "⇇",
      llcorner: "⌞",
      Lleftarrow: "⇚",
      llhard: "⥫",
      lltri: "◺",
      Lmidot: "Ŀ",
      lmidot: "ŀ",
      lmoust: "⎰",
      lmoustache: "⎰",
      lnap: "⪉",
      lnapprox: "⪉",
      lnE: "≨",
      lne: "⪇",
      lneq: "⪇",
      lneqq: "≨",
      lnsim: "⋦",
      loang: "⟬",
      loarr: "⇽",
      lobrk: "⟦",
      LongLeftArrow: "⟵",
      Longleftarrow: "⟸",
      longleftarrow: "⟵",
      LongLeftRightArrow: "⟷",
      Longleftrightarrow: "⟺",
      longleftrightarrow: "⟷",
      longmapsto: "⟼",
      LongRightArrow: "⟶",
      Longrightarrow: "⟹",
      longrightarrow: "⟶",
      looparrowleft: "↫",
      looparrowright: "↬",
      lopar: "⦅",
      Lopf: "𝕃",
      lopf: "𝕝",
      loplus: "⨭",
      lotimes: "⨴",
      lowast: "∗",
      lowbar: "_",
      LowerLeftArrow: "↙",
      LowerRightArrow: "↘",
      loz: "◊",
      lozenge: "◊",
      lozf: "⧫",
      lpar: "(",
      lparlt: "⦓",
      lrarr: "⇆",
      lrcorner: "⌟",
      lrhar: "⇋",
      lrhard: "⥭",
      lrm: "‎",
      lrtri: "⊿",
      lsaquo: "‹",
      Lscr: "ℒ",
      lscr: "𝓁",
      Lsh: "↰",
      lsh: "↰",
      lsim: "≲",
      lsime: "⪍",
      lsimg: "⪏",
      lsqb: "[",
      lsquo: "‘",
      lsquor: "‚",
      Lstrok: "Ł",
      lstrok: "ł",
      Lt: "≪",
      LT: "<",
      lt: "<",
      ltcc: "⪦",
      ltcir: "⩹",
      ltdot: "⋖",
      lthree: "⋋",
      ltimes: "⋉",
      ltlarr: "⥶",
      ltquest: "⩻",
      ltri: "◃",
      ltrie: "⊴",
      ltrif: "◂",
      ltrPar: "⦖",
      lurdshar: "⥊",
      luruhar: "⥦",
      lvertneqq: "≨︀",
      lvnE: "≨︀",
      macr: "¯",
      male: "♂",
      malt: "✠",
      maltese: "✠",
      Map: "⤅",
      map: "↦",
      mapsto: "↦",
      mapstodown: "↧",
      mapstoleft: "↤",
      mapstoup: "↥",
      marker: "▮",
      mcomma: "⨩",
      Mcy: "М",
      mcy: "м",
      mdash: "—",
      mDDot: "∺",
      measuredangle: "∡",
      MediumSpace: " ",
      Mellintrf: "ℳ",
      Mfr: "𝔐",
      mfr: "𝔪",
      mho: "℧",
      micro: "µ",
      mid: "∣",
      midast: "*",
      midcir: "⫰",
      middot: "·",
      minus: "−",
      minusb: "⊟",
      minusd: "∸",
      minusdu: "⨪",
      MinusPlus: "∓",
      mlcp: "⫛",
      mldr: "…",
      mnplus: "∓",
      models: "⊧",
      Mopf: "𝕄",
      mopf: "𝕞",
      mp: "∓",
      Mscr: "ℳ",
      mscr: "𝓂",
      mstpos: "∾",
      Mu: "Μ",
      mu: "μ",
      multimap: "⊸",
      mumap: "⊸",
      nabla: "∇",
      Nacute: "Ń",
      nacute: "ń",
      nang: "∠⃒",
      nap: "≉",
      napE: "⩰̸",
      napid: "≋̸",
      napos: "ŉ",
      napprox: "≉",
      natur: "♮",
      natural: "♮",
      naturals: "ℕ",
      nbsp: " ",
      nbump: "≎̸",
      nbumpe: "≏̸",
      ncap: "⩃",
      Ncaron: "Ň",
      ncaron: "ň",
      Ncedil: "Ņ",
      ncedil: "ņ",
      ncong: "≇",
      ncongdot: "⩭̸",
      ncup: "⩂",
      Ncy: "Н",
      ncy: "н",
      ndash: "–",
      ne: "≠",
      nearhk: "⤤",
      neArr: "⇗",
      nearr: "↗",
      nearrow: "↗",
      nedot: "≐̸",
      NegativeMediumSpace: "​",
      NegativeThickSpace: "​",
      NegativeThinSpace: "​",
      NegativeVeryThinSpace: "​",
      nequiv: "≢",
      nesear: "⤨",
      nesim: "≂̸",
      NestedGreaterGreater: "≫",
      NestedLessLess: "≪",
      NewLine: "\n",
      nexist: "∄",
      nexists: "∄",
      Nfr: "𝔑",
      nfr: "𝔫",
      ngE: "≧̸",
      nge: "≱",
      ngeq: "≱",
      ngeqq: "≧̸",
      ngeqslant: "⩾̸",
      nges: "⩾̸",
      nGg: "⋙̸",
      ngsim: "≵",
      nGt: "≫⃒",
      ngt: "≯",
      ngtr: "≯",
      nGtv: "≫̸",
      nhArr: "⇎",
      nharr: "↮",
      nhpar: "⫲",
      ni: "∋",
      nis: "⋼",
      nisd: "⋺",
      niv: "∋",
      NJcy: "Њ",
      njcy: "њ",
      nlArr: "⇍",
      nlarr: "↚",
      nldr: "‥",
      nlE: "≦̸",
      nle: "≰",
      nLeftarrow: "⇍",
      nleftarrow: "↚",
      nLeftrightarrow: "⇎",
      nleftrightarrow: "↮",
      nleq: "≰",
      nleqq: "≦̸",
      nleqslant: "⩽̸",
      nles: "⩽̸",
      nless: "≮",
      nLl: "⋘̸",
      nlsim: "≴",
      nLt: "≪⃒",
      nlt: "≮",
      nltri: "⋪",
      nltrie: "⋬",
      nLtv: "≪̸",
      nmid: "∤",
      NoBreak: "⁠",
      NonBreakingSpace: " ",
      Nopf: "ℕ",
      nopf: "𝕟",
      Not: "⫬",
      not: "¬",
      NotCongruent: "≢",
      NotCupCap: "≭",
      NotDoubleVerticalBar: "∦",
      NotElement: "∉",
      NotEqual: "≠",
      NotEqualTilde: "≂̸",
      NotExists: "∄",
      NotGreater: "≯",
      NotGreaterEqual: "≱",
      NotGreaterFullEqual: "≧̸",
      NotGreaterGreater: "≫̸",
      NotGreaterLess: "≹",
      NotGreaterSlantEqual: "⩾̸",
      NotGreaterTilde: "≵",
      NotHumpDownHump: "≎̸",
      NotHumpEqual: "≏̸",
      notin: "∉",
      notindot: "⋵̸",
      notinE: "⋹̸",
      notinva: "∉",
      notinvb: "⋷",
      notinvc: "⋶",
      NotLeftTriangle: "⋪",
      NotLeftTriangleBar: "⧏̸",
      NotLeftTriangleEqual: "⋬",
      NotLess: "≮",
      NotLessEqual: "≰",
      NotLessGreater: "≸",
      NotLessLess: "≪̸",
      NotLessSlantEqual: "⩽̸",
      NotLessTilde: "≴",
      NotNestedGreaterGreater: "⪢̸",
      NotNestedLessLess: "⪡̸",
      notni: "∌",
      notniva: "∌",
      notnivb: "⋾",
      notnivc: "⋽",
      NotPrecedes: "⊀",
      NotPrecedesEqual: "⪯̸",
      NotPrecedesSlantEqual: "⋠",
      NotReverseElement: "∌",
      NotRightTriangle: "⋫",
      NotRightTriangleBar: "⧐̸",
      NotRightTriangleEqual: "⋭",
      NotSquareSubset: "⊏̸",
      NotSquareSubsetEqual: "⋢",
      NotSquareSuperset: "⊐̸",
      NotSquareSupersetEqual: "⋣",
      NotSubset: "⊂⃒",
      NotSubsetEqual: "⊈",
      NotSucceeds: "⊁",
      NotSucceedsEqual: "⪰̸",
      NotSucceedsSlantEqual: "⋡",
      NotSucceedsTilde: "≿̸",
      NotSuperset: "⊃⃒",
      NotSupersetEqual: "⊉",
      NotTilde: "≁",
      NotTildeEqual: "≄",
      NotTildeFullEqual: "≇",
      NotTildeTilde: "≉",
      NotVerticalBar: "∤",
      npar: "∦",
      nparallel: "∦",
      nparsl: "⫽⃥",
      npart: "∂̸",
      npolint: "⨔",
      npr: "⊀",
      nprcue: "⋠",
      npre: "⪯̸",
      nprec: "⊀",
      npreceq: "⪯̸",
      nrArr: "⇏",
      nrarr: "↛",
      nrarrc: "⤳̸",
      nrarrw: "↝̸",
      nRightarrow: "⇏",
      nrightarrow: "↛",
      nrtri: "⋫",
      nrtrie: "⋭",
      nsc: "⊁",
      nsccue: "⋡",
      nsce: "⪰̸",
      Nscr: "𝒩",
      nscr: "𝓃",
      nshortmid: "∤",
      nshortparallel: "∦",
      nsim: "≁",
      nsime: "≄",
      nsimeq: "≄",
      nsmid: "∤",
      nspar: "∦",
      nsqsube: "⋢",
      nsqsupe: "⋣",
      nsub: "⊄",
      nsubE: "⫅̸",
      nsube: "⊈",
      nsubset: "⊂⃒",
      nsubseteq: "⊈",
      nsubseteqq: "⫅̸",
      nsucc: "⊁",
      nsucceq: "⪰̸",
      nsup: "⊅",
      nsupE: "⫆̸",
      nsupe: "⊉",
      nsupset: "⊃⃒",
      nsupseteq: "⊉",
      nsupseteqq: "⫆̸",
      ntgl: "≹",
      Ntilde: "Ñ",
      ntilde: "ñ",
      ntlg: "≸",
      ntriangleleft: "⋪",
      ntrianglelefteq: "⋬",
      ntriangleright: "⋫",
      ntrianglerighteq: "⋭",
      Nu: "Ν",
      nu: "ν",
      num: "#",
      numero: "№",
      numsp: " ",
      nvap: "≍⃒",
      nVDash: "⊯",
      nVdash: "⊮",
      nvDash: "⊭",
      nvdash: "⊬",
      nvge: "≥⃒",
      nvgt: ">⃒",
      nvHarr: "⤄",
      nvinfin: "⧞",
      nvlArr: "⤂",
      nvle: "≤⃒",
      nvlt: "<⃒",
      nvltrie: "⊴⃒",
      nvrArr: "⤃",
      nvrtrie: "⊵⃒",
      nvsim: "∼⃒",
      nwarhk: "⤣",
      nwArr: "⇖",
      nwarr: "↖",
      nwarrow: "↖",
      nwnear: "⤧",
      Oacute: "Ó",
      oacute: "ó",
      oast: "⊛",
      ocir: "⊚",
      Ocirc: "Ô",
      ocirc: "ô",
      Ocy: "О",
      ocy: "о",
      odash: "⊝",
      Odblac: "Ő",
      odblac: "ő",
      odiv: "⨸",
      odot: "⊙",
      odsold: "⦼",
      OElig: "Œ",
      oelig: "œ",
      ofcir: "⦿",
      Ofr: "𝔒",
      ofr: "𝔬",
      ogon: "˛",
      Ograve: "Ò",
      ograve: "ò",
      ogt: "⧁",
      ohbar: "⦵",
      ohm: "Ω",
      oint: "∮",
      olarr: "↺",
      olcir: "⦾",
      olcross: "⦻",
      oline: "‾",
      olt: "⧀",
      Omacr: "Ō",
      omacr: "ō",
      Omega: "Ω",
      omega: "ω",
      Omicron: "Ο",
      omicron: "ο",
      omid: "⦶",
      ominus: "⊖",
      Oopf: "𝕆",
      oopf: "𝕠",
      opar: "⦷",
      OpenCurlyDoubleQuote: "“",
      OpenCurlyQuote: "‘",
      operp: "⦹",
      oplus: "⊕",
      Or: "⩔",
      or: "∨",
      orarr: "↻",
      ord: "⩝",
      order: "ℴ",
      orderof: "ℴ",
      ordf: "ª",
      ordm: "º",
      origof: "⊶",
      oror: "⩖",
      orslope: "⩗",
      orv: "⩛",
      oS: "Ⓢ",
      Oscr: "𝒪",
      oscr: "ℴ",
      Oslash: "Ø",
      oslash: "ø",
      osol: "⊘",
      Otilde: "Õ",
      otilde: "õ",
      Otimes: "⨷",
      otimes: "⊗",
      otimesas: "⨶",
      Ouml: "Ö",
      ouml: "ö",
      ovbar: "⌽",
      OverBar: "‾",
      OverBrace: "⏞",
      OverBracket: "⎴",
      OverParenthesis: "⏜",
      par: "∥",
      para: "¶",
      parallel: "∥",
      parsim: "⫳",
      parsl: "⫽",
      part: "∂",
      PartialD: "∂",
      Pcy: "П",
      pcy: "п",
      percnt: "%",
      period: ".",
      permil: "‰",
      perp: "⊥",
      pertenk: "‱",
      Pfr: "𝔓",
      pfr: "𝔭",
      Phi: "Φ",
      phi: "φ",
      phiv: "ϕ",
      phmmat: "ℳ",
      phone: "☎",
      Pi: "Π",
      pi: "π",
      pitchfork: "⋔",
      piv: "ϖ",
      planck: "ℏ",
      planckh: "ℎ",
      plankv: "ℏ",
      plus: "+",
      plusacir: "⨣",
      plusb: "⊞",
      pluscir: "⨢",
      plusdo: "∔",
      plusdu: "⨥",
      pluse: "⩲",
      PlusMinus: "±",
      plusmn: "±",
      plussim: "⨦",
      plustwo: "⨧",
      pm: "±",
      Poincareplane: "ℌ",
      pointint: "⨕",
      Popf: "ℙ",
      popf: "𝕡",
      pound: "£",
      Pr: "⪻",
      pr: "≺",
      prap: "⪷",
      prcue: "≼",
      prE: "⪳",
      pre: "⪯",
      prec: "≺",
      precapprox: "⪷",
      preccurlyeq: "≼",
      Precedes: "≺",
      PrecedesEqual: "⪯",
      PrecedesSlantEqual: "≼",
      PrecedesTilde: "≾",
      preceq: "⪯",
      precnapprox: "⪹",
      precneqq: "⪵",
      precnsim: "⋨",
      precsim: "≾",
      Prime: "″",
      prime: "′",
      primes: "ℙ",
      prnap: "⪹",
      prnE: "⪵",
      prnsim: "⋨",
      prod: "∏",
      Product: "∏",
      profalar: "⌮",
      profline: "⌒",
      profsurf: "⌓",
      prop: "∝",
      Proportion: "∷",
      Proportional: "∝",
      propto: "∝",
      prsim: "≾",
      prurel: "⊰",
      Pscr: "𝒫",
      pscr: "𝓅",
      Psi: "Ψ",
      psi: "ψ",
      puncsp: " ",
      Qfr: "𝔔",
      qfr: "𝔮",
      qint: "⨌",
      Qopf: "ℚ",
      qopf: "𝕢",
      qprime: "⁗",
      Qscr: "𝒬",
      qscr: "𝓆",
      quaternions: "ℍ",
      quatint: "⨖",
      quest: "?",
      questeq: "≟",
      QUOT: '"',
      quot: '"',
      rAarr: "⇛",
      race: "∽̱",
      Racute: "Ŕ",
      racute: "ŕ",
      radic: "√",
      raemptyv: "⦳",
      Rang: "⟫",
      rang: "⟩",
      rangd: "⦒",
      range: "⦥",
      rangle: "⟩",
      raquo: "»",
      Rarr: "↠",
      rArr: "⇒",
      rarr: "→",
      rarrap: "⥵",
      rarrb: "⇥",
      rarrbfs: "⤠",
      rarrc: "⤳",
      rarrfs: "⤞",
      rarrhk: "↪",
      rarrlp: "↬",
      rarrpl: "⥅",
      rarrsim: "⥴",
      Rarrtl: "⤖",
      rarrtl: "↣",
      rarrw: "↝",
      rAtail: "⤜",
      ratail: "⤚",
      ratio: "∶",
      rationals: "ℚ",
      RBarr: "⤐",
      rBarr: "⤏",
      rbarr: "⤍",
      rbbrk: "❳",
      rbrace: "}",
      rbrack: "]",
      rbrke: "⦌",
      rbrksld: "⦎",
      rbrkslu: "⦐",
      Rcaron: "Ř",
      rcaron: "ř",
      Rcedil: "Ŗ",
      rcedil: "ŗ",
      rceil: "⌉",
      rcub: "}",
      Rcy: "Р",
      rcy: "р",
      rdca: "⤷",
      rdldhar: "⥩",
      rdquo: "”",
      rdquor: "”",
      rdsh: "↳",
      Re: "ℜ",
      real: "ℜ",
      realine: "ℛ",
      realpart: "ℜ",
      reals: "ℝ",
      rect: "▭",
      REG: "®",
      reg: "®",
      ReverseElement: "∋",
      ReverseEquilibrium: "⇋",
      ReverseUpEquilibrium: "⥯",
      rfisht: "⥽",
      rfloor: "⌋",
      Rfr: "ℜ",
      rfr: "𝔯",
      rHar: "⥤",
      rhard: "⇁",
      rharu: "⇀",
      rharul: "⥬",
      Rho: "Ρ",
      rho: "ρ",
      rhov: "ϱ",
      RightAngleBracket: "⟩",
      RightArrow: "→",
      Rightarrow: "⇒",
      rightarrow: "→",
      RightArrowBar: "⇥",
      RightArrowLeftArrow: "⇄",
      rightarrowtail: "↣",
      RightCeiling: "⌉",
      RightDoubleBracket: "⟧",
      RightDownTeeVector: "⥝",
      RightDownVector: "⇂",
      RightDownVectorBar: "⥕",
      RightFloor: "⌋",
      rightharpoondown: "⇁",
      rightharpoonup: "⇀",
      rightleftarrows: "⇄",
      rightleftharpoons: "⇌",
      rightrightarrows: "⇉",
      rightsquigarrow: "↝",
      RightTee: "⊢",
      RightTeeArrow: "↦",
      RightTeeVector: "⥛",
      rightthreetimes: "⋌",
      RightTriangle: "⊳",
      RightTriangleBar: "⧐",
      RightTriangleEqual: "⊵",
      RightUpDownVector: "⥏",
      RightUpTeeVector: "⥜",
      RightUpVector: "↾",
      RightUpVectorBar: "⥔",
      RightVector: "⇀",
      RightVectorBar: "⥓",
      ring: "˚",
      risingdotseq: "≓",
      rlarr: "⇄",
      rlhar: "⇌",
      rlm: "‏",
      rmoust: "⎱",
      rmoustache: "⎱",
      rnmid: "⫮",
      roang: "⟭",
      roarr: "⇾",
      robrk: "⟧",
      ropar: "⦆",
      Ropf: "ℝ",
      ropf: "𝕣",
      roplus: "⨮",
      rotimes: "⨵",
      RoundImplies: "⥰",
      rpar: ")",
      rpargt: "⦔",
      rppolint: "⨒",
      rrarr: "⇉",
      Rrightarrow: "⇛",
      rsaquo: "›",
      Rscr: "ℛ",
      rscr: "𝓇",
      Rsh: "↱",
      rsh: "↱",
      rsqb: "]",
      rsquo: "’",
      rsquor: "’",
      rthree: "⋌",
      rtimes: "⋊",
      rtri: "▹",
      rtrie: "⊵",
      rtrif: "▸",
      rtriltri: "⧎",
      RuleDelayed: "⧴",
      ruluhar: "⥨",
      rx: "℞",
      Sacute: "Ś",
      sacute: "ś",
      sbquo: "‚",
      Sc: "⪼",
      sc: "≻",
      scap: "⪸",
      Scaron: "Š",
      scaron: "š",
      sccue: "≽",
      scE: "⪴",
      sce: "⪰",
      Scedil: "Ş",
      scedil: "ş",
      Scirc: "Ŝ",
      scirc: "ŝ",
      scnap: "⪺",
      scnE: "⪶",
      scnsim: "⋩",
      scpolint: "⨓",
      scsim: "≿",
      Scy: "С",
      scy: "с",
      sdot: "⋅",
      sdotb: "⊡",
      sdote: "⩦",
      searhk: "⤥",
      seArr: "⇘",
      searr: "↘",
      searrow: "↘",
      sect: "§",
      semi: ";",
      seswar: "⤩",
      setminus: "∖",
      setmn: "∖",
      sext: "✶",
      Sfr: "𝔖",
      sfr: "𝔰",
      sfrown: "⌢",
      sharp: "♯",
      SHCHcy: "Щ",
      shchcy: "щ",
      SHcy: "Ш",
      shcy: "ш",
      ShortDownArrow: "↓",
      ShortLeftArrow: "←",
      shortmid: "∣",
      shortparallel: "∥",
      ShortRightArrow: "→",
      ShortUpArrow: "↑",
      shy: "­",
      Sigma: "Σ",
      sigma: "σ",
      sigmaf: "ς",
      sigmav: "ς",
      sim: "∼",
      simdot: "⩪",
      sime: "≃",
      simeq: "≃",
      simg: "⪞",
      simgE: "⪠",
      siml: "⪝",
      simlE: "⪟",
      simne: "≆",
      simplus: "⨤",
      simrarr: "⥲",
      slarr: "←",
      SmallCircle: "∘",
      smallsetminus: "∖",
      smashp: "⨳",
      smeparsl: "⧤",
      smid: "∣",
      smile: "⌣",
      smt: "⪪",
      smte: "⪬",
      smtes: "⪬︀",
      SOFTcy: "Ь",
      softcy: "ь",
      sol: "/",
      solb: "⧄",
      solbar: "⌿",
      Sopf: "𝕊",
      sopf: "𝕤",
      spades: "♠",
      spadesuit: "♠",
      spar: "∥",
      sqcap: "⊓",
      sqcaps: "⊓︀",
      sqcup: "⊔",
      sqcups: "⊔︀",
      Sqrt: "√",
      sqsub: "⊏",
      sqsube: "⊑",
      sqsubset: "⊏",
      sqsubseteq: "⊑",
      sqsup: "⊐",
      sqsupe: "⊒",
      sqsupset: "⊐",
      sqsupseteq: "⊒",
      squ: "□",
      Square: "□",
      square: "□",
      SquareIntersection: "⊓",
      SquareSubset: "⊏",
      SquareSubsetEqual: "⊑",
      SquareSuperset: "⊐",
      SquareSupersetEqual: "⊒",
      SquareUnion: "⊔",
      squarf: "▪",
      squf: "▪",
      srarr: "→",
      Sscr: "𝒮",
      sscr: "𝓈",
      ssetmn: "∖",
      ssmile: "⌣",
      sstarf: "⋆",
      Star: "⋆",
      star: "☆",
      starf: "★",
      straightepsilon: "ϵ",
      straightphi: "ϕ",
      strns: "¯",
      Sub: "⋐",
      sub: "⊂",
      subdot: "⪽",
      subE: "⫅",
      sube: "⊆",
      subedot: "⫃",
      submult: "⫁",
      subnE: "⫋",
      subne: "⊊",
      subplus: "⪿",
      subrarr: "⥹",
      Subset: "⋐",
      subset: "⊂",
      subseteq: "⊆",
      subseteqq: "⫅",
      SubsetEqual: "⊆",
      subsetneq: "⊊",
      subsetneqq: "⫋",
      subsim: "⫇",
      subsub: "⫕",
      subsup: "⫓",
      succ: "≻",
      succapprox: "⪸",
      succcurlyeq: "≽",
      Succeeds: "≻",
      SucceedsEqual: "⪰",
      SucceedsSlantEqual: "≽",
      SucceedsTilde: "≿",
      succeq: "⪰",
      succnapprox: "⪺",
      succneqq: "⪶",
      succnsim: "⋩",
      succsim: "≿",
      SuchThat: "∋",
      Sum: "∑",
      sum: "∑",
      sung: "♪",
      Sup: "⋑",
      sup: "⊃",
      sup1: "¹",
      sup2: "²",
      sup3: "³",
      supdot: "⪾",
      supdsub: "⫘",
      supE: "⫆",
      supe: "⊇",
      supedot: "⫄",
      Superset: "⊃",
      SupersetEqual: "⊇",
      suphsol: "⟉",
      suphsub: "⫗",
      suplarr: "⥻",
      supmult: "⫂",
      supnE: "⫌",
      supne: "⊋",
      supplus: "⫀",
      Supset: "⋑",
      supset: "⊃",
      supseteq: "⊇",
      supseteqq: "⫆",
      supsetneq: "⊋",
      supsetneqq: "⫌",
      supsim: "⫈",
      supsub: "⫔",
      supsup: "⫖",
      swarhk: "⤦",
      swArr: "⇙",
      swarr: "↙",
      swarrow: "↙",
      swnwar: "⤪",
      szlig: "ß",
      Tab: "	",
      target: "⌖",
      Tau: "Τ",
      tau: "τ",
      tbrk: "⎴",
      Tcaron: "Ť",
      tcaron: "ť",
      Tcedil: "Ţ",
      tcedil: "ţ",
      Tcy: "Т",
      tcy: "т",
      tdot: "⃛",
      telrec: "⌕",
      Tfr: "𝔗",
      tfr: "𝔱",
      there4: "∴",
      Therefore: "∴",
      therefore: "∴",
      Theta: "Θ",
      theta: "θ",
      thetasym: "ϑ",
      thetav: "ϑ",
      thickapprox: "≈",
      thicksim: "∼",
      ThickSpace: "  ",
      thinsp: " ",
      ThinSpace: " ",
      thkap: "≈",
      thksim: "∼",
      THORN: "Þ",
      thorn: "þ",
      Tilde: "∼",
      tilde: "˜",
      TildeEqual: "≃",
      TildeFullEqual: "≅",
      TildeTilde: "≈",
      times: "×",
      timesb: "⊠",
      timesbar: "⨱",
      timesd: "⨰",
      tint: "∭",
      toea: "⤨",
      top: "⊤",
      topbot: "⌶",
      topcir: "⫱",
      Topf: "𝕋",
      topf: "𝕥",
      topfork: "⫚",
      tosa: "⤩",
      tprime: "‴",
      TRADE: "™",
      trade: "™",
      triangle: "▵",
      triangledown: "▿",
      triangleleft: "◃",
      trianglelefteq: "⊴",
      triangleq: "≜",
      triangleright: "▹",
      trianglerighteq: "⊵",
      tridot: "◬",
      trie: "≜",
      triminus: "⨺",
      TripleDot: "⃛",
      triplus: "⨹",
      trisb: "⧍",
      tritime: "⨻",
      trpezium: "⏢",
      Tscr: "𝒯",
      tscr: "𝓉",
      TScy: "Ц",
      tscy: "ц",
      TSHcy: "Ћ",
      tshcy: "ћ",
      Tstrok: "Ŧ",
      tstrok: "ŧ",
      twixt: "≬",
      twoheadleftarrow: "↞",
      twoheadrightarrow: "↠",
      Uacute: "Ú",
      uacute: "ú",
      Uarr: "↟",
      uArr: "⇑",
      uarr: "↑",
      Uarrocir: "⥉",
      Ubrcy: "Ў",
      ubrcy: "ў",
      Ubreve: "Ŭ",
      ubreve: "ŭ",
      Ucirc: "Û",
      ucirc: "û",
      Ucy: "У",
      ucy: "у",
      udarr: "⇅",
      Udblac: "Ű",
      udblac: "ű",
      udhar: "⥮",
      ufisht: "⥾",
      Ufr: "𝔘",
      ufr: "𝔲",
      Ugrave: "Ù",
      ugrave: "ù",
      uHar: "⥣",
      uharl: "↿",
      uharr: "↾",
      uhblk: "▀",
      ulcorn: "⌜",
      ulcorner: "⌜",
      ulcrop: "⌏",
      ultri: "◸",
      Umacr: "Ū",
      umacr: "ū",
      uml: "¨",
      UnderBar: "_",
      UnderBrace: "⏟",
      UnderBracket: "⎵",
      UnderParenthesis: "⏝",
      Union: "⋃",
      UnionPlus: "⊎",
      Uogon: "Ų",
      uogon: "ų",
      Uopf: "𝕌",
      uopf: "𝕦",
      UpArrow: "↑",
      Uparrow: "⇑",
      uparrow: "↑",
      UpArrowBar: "⤒",
      UpArrowDownArrow: "⇅",
      UpDownArrow: "↕",
      Updownarrow: "⇕",
      updownarrow: "↕",
      UpEquilibrium: "⥮",
      upharpoonleft: "↿",
      upharpoonright: "↾",
      uplus: "⊎",
      UpperLeftArrow: "↖",
      UpperRightArrow: "↗",
      Upsi: "ϒ",
      upsi: "υ",
      upsih: "ϒ",
      Upsilon: "Υ",
      upsilon: "υ",
      UpTee: "⊥",
      UpTeeArrow: "↥",
      upuparrows: "⇈",
      urcorn: "⌝",
      urcorner: "⌝",
      urcrop: "⌎",
      Uring: "Ů",
      uring: "ů",
      urtri: "◹",
      Uscr: "𝒰",
      uscr: "𝓊",
      utdot: "⋰",
      Utilde: "Ũ",
      utilde: "ũ",
      utri: "▵",
      utrif: "▴",
      uuarr: "⇈",
      Uuml: "Ü",
      uuml: "ü",
      uwangle: "⦧",
      vangrt: "⦜",
      varepsilon: "ϵ",
      varkappa: "ϰ",
      varnothing: "∅",
      varphi: "ϕ",
      varpi: "ϖ",
      varpropto: "∝",
      vArr: "⇕",
      varr: "↕",
      varrho: "ϱ",
      varsigma: "ς",
      varsubsetneq: "⊊︀",
      varsubsetneqq: "⫋︀",
      varsupsetneq: "⊋︀",
      varsupsetneqq: "⫌︀",
      vartheta: "ϑ",
      vartriangleleft: "⊲",
      vartriangleright: "⊳",
      Vbar: "⫫",
      vBar: "⫨",
      vBarv: "⫩",
      Vcy: "В",
      vcy: "в",
      VDash: "⊫",
      Vdash: "⊩",
      vDash: "⊨",
      vdash: "⊢",
      Vdashl: "⫦",
      Vee: "⋁",
      vee: "∨",
      veebar: "⊻",
      veeeq: "≚",
      vellip: "⋮",
      Verbar: "‖",
      verbar: "|",
      Vert: "‖",
      vert: "|",
      VerticalBar: "∣",
      VerticalLine: "|",
      VerticalSeparator: "❘",
      VerticalTilde: "≀",
      VeryThinSpace: " ",
      Vfr: "𝔙",
      vfr: "𝔳",
      vltri: "⊲",
      vnsub: "⊂⃒",
      vnsup: "⊃⃒",
      Vopf: "𝕍",
      vopf: "𝕧",
      vprop: "∝",
      vrtri: "⊳",
      Vscr: "𝒱",
      vscr: "𝓋",
      vsubnE: "⫋︀",
      vsubne: "⊊︀",
      vsupnE: "⫌︀",
      vsupne: "⊋︀",
      Vvdash: "⊪",
      vzigzag: "⦚",
      Wcirc: "Ŵ",
      wcirc: "ŵ",
      wedbar: "⩟",
      Wedge: "⋀",
      wedge: "∧",
      wedgeq: "≙",
      weierp: "℘",
      Wfr: "𝔚",
      wfr: "𝔴",
      Wopf: "𝕎",
      wopf: "𝕨",
      wp: "℘",
      wr: "≀",
      wreath: "≀",
      Wscr: "𝒲",
      wscr: "𝓌",
      xcap: "⋂",
      xcirc: "◯",
      xcup: "⋃",
      xdtri: "▽",
      Xfr: "𝔛",
      xfr: "𝔵",
      xhArr: "⟺",
      xharr: "⟷",
      Xi: "Ξ",
      xi: "ξ",
      xlArr: "⟸",
      xlarr: "⟵",
      xmap: "⟼",
      xnis: "⋻",
      xodot: "⨀",
      Xopf: "𝕏",
      xopf: "𝕩",
      xoplus: "⨁",
      xotime: "⨂",
      xrArr: "⟹",
      xrarr: "⟶",
      Xscr: "𝒳",
      xscr: "𝓍",
      xsqcup: "⨆",
      xuplus: "⨄",
      xutri: "△",
      xvee: "⋁",
      xwedge: "⋀",
      Yacute: "Ý",
      yacute: "ý",
      YAcy: "Я",
      yacy: "я",
      Ycirc: "Ŷ",
      ycirc: "ŷ",
      Ycy: "Ы",
      ycy: "ы",
      yen: "¥",
      Yfr: "𝔜",
      yfr: "𝔶",
      YIcy: "Ї",
      yicy: "ї",
      Yopf: "𝕐",
      yopf: "𝕪",
      Yscr: "𝒴",
      yscr: "𝓎",
      YUcy: "Ю",
      yucy: "ю",
      Yuml: "Ÿ",
      yuml: "ÿ",
      Zacute: "Ź",
      zacute: "ź",
      Zcaron: "Ž",
      zcaron: "ž",
      Zcy: "З",
      zcy: "з",
      Zdot: "Ż",
      zdot: "ż",
      zeetrf: "ℨ",
      ZeroWidthSpace: "​",
      Zeta: "Ζ",
      zeta: "ζ",
      Zfr: "ℨ",
      zfr: "𝔷",
      ZHcy: "Ж",
      zhcy: "ж",
      zigrarr: "⇝",
      Zopf: "ℤ",
      zopf: "𝕫",
      Zscr: "𝒵",
      zscr: "𝓏",
      zwj: "‍",
      zwnj: "‌"
    });
    exports.entityMap = exports.HTML_ENTITIES;
  })(entities);
  return entities;
}
var sax = {};
var hasRequiredSax;
function requireSax() {
  if (hasRequiredSax) return sax;
  hasRequiredSax = 1;
  var NAMESPACE = requireConventions().NAMESPACE;
  var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
  var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
  var tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$");
  var S_TAG = 0;
  var S_ATTR = 1;
  var S_ATTR_SPACE = 2;
  var S_EQ = 3;
  var S_ATTR_NOQUOT_VALUE = 4;
  var S_ATTR_END = 5;
  var S_TAG_SPACE = 6;
  var S_TAG_CLOSE = 7;
  function ParseError(message, locator) {
    this.message = message;
    this.locator = locator;
    if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
  }
  ParseError.prototype = new Error();
  ParseError.prototype.name = ParseError.name;
  function XMLReader() {
  }
  XMLReader.prototype = {
    parse: function(source, defaultNSMap, entityMap) {
      var domBuilder = this.domBuilder;
      domBuilder.startDocument();
      _copy(defaultNSMap, defaultNSMap = {});
      parse(
        source,
        defaultNSMap,
        entityMap,
        domBuilder,
        this.errorHandler
      );
      domBuilder.endDocument();
    }
  };
  function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
    function fixedFromCharCode(code) {
      if (code > 65535) {
        code -= 65536;
        var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
        return String.fromCharCode(surrogate1, surrogate2);
      } else {
        return String.fromCharCode(code);
      }
    }
    function entityReplacer(a2) {
      var k = a2.slice(1, -1);
      if (Object.hasOwnProperty.call(entityMap, k)) {
        return entityMap[k];
      } else if (k.charAt(0) === "#") {
        return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x")));
      } else {
        errorHandler.error("entity not found:" + a2);
        return a2;
      }
    }
    function appendText(end2) {
      if (end2 > start) {
        var xt = source.substring(start, end2).replace(/&#?\w+;/g, entityReplacer);
        locator && position(start);
        domBuilder.characters(xt, 0, end2 - start);
        start = end2;
      }
    }
    function position(p, m) {
      while (p >= lineEnd && (m = linePattern.exec(source))) {
        lineStart = m.index;
        lineEnd = lineStart + m[0].length;
        locator.lineNumber++;
      }
      locator.columnNumber = p - lineStart + 1;
    }
    var lineStart = 0;
    var lineEnd = 0;
    var linePattern = /.*(?:\r\n?|\n)|.*$/g;
    var locator = domBuilder.locator;
    var parseStack = [{ currentNSMap: defaultNSMapCopy }];
    var closeMap = {};
    var start = 0;
    while (true) {
      try {
        var tagStart = source.indexOf("<", start);
        if (tagStart < 0) {
          if (!source.substr(start).match(/^\s*$/)) {
            var doc = domBuilder.doc;
            var text = doc.createTextNode(source.substr(start));
            doc.appendChild(text);
            domBuilder.currentElement = text;
          }
          return;
        }
        if (tagStart > start) {
          appendText(tagStart);
        }
        switch (source.charAt(tagStart + 1)) {
          case "/":
            var end = source.indexOf(">", tagStart + 3);
            var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, "");
            var config = parseStack.pop();
            if (end < 0) {
              tagName = source.substring(tagStart + 2).replace(/[\s<].*/, "");
              errorHandler.error("end tag name: " + tagName + " is not complete:" + config.tagName);
              end = tagStart + 1 + tagName.length;
            } else if (tagName.match(/\s</)) {
              tagName = tagName.replace(/[\s<].*/, "");
              errorHandler.error("end tag name: " + tagName + " maybe not complete");
              end = tagStart + 1 + tagName.length;
            }
            var localNSMap = config.localNSMap;
            var endMatch = config.tagName == tagName;
            var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
            if (endIgnoreCaseMach) {
              domBuilder.endElement(config.uri, config.localName, tagName);
              if (localNSMap) {
                for (var prefix in localNSMap) {
                  if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                    domBuilder.endPrefixMapping(prefix);
                  }
                }
              }
              if (!endMatch) {
                errorHandler.fatalError("end tag name: " + tagName + " is not match the current start tagName:" + config.tagName);
              }
            } else {
              parseStack.push(config);
            }
            end++;
            break;
          // end elment
          case "?":
            locator && position(tagStart);
            end = parseInstruction(source, tagStart, domBuilder);
            break;
          case "!":
            locator && position(tagStart);
            end = parseDCC(source, tagStart, domBuilder, errorHandler);
            break;
          default:
            locator && position(tagStart);
            var el = new ElementAttributes();
            var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
            var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
            var len = el.length;
            if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
              el.closed = true;
              if (!entityMap.nbsp) {
                errorHandler.warning("unclosed xml attribute");
              }
            }
            if (locator && len) {
              var locator2 = copyLocator(locator, {});
              for (var i = 0; i < len; i++) {
                var a = el[i];
                position(a.offset);
                a.locator = copyLocator(locator, {});
              }
              domBuilder.locator = locator2;
              if (appendElement(el, domBuilder, currentNSMap)) {
                parseStack.push(el);
              }
              domBuilder.locator = locator;
            } else {
              if (appendElement(el, domBuilder, currentNSMap)) {
                parseStack.push(el);
              }
            }
            if (NAMESPACE.isHTML(el.uri) && !el.closed) {
              end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
            } else {
              end++;
            }
        }
      } catch (e2) {
        if (e2 instanceof ParseError) {
          throw e2;
        }
        errorHandler.error("element parse error: " + e2);
        end = -1;
      }
      if (end > start) {
        start = end;
      } else {
        appendText(Math.max(tagStart, start) + 1);
      }
    }
  }
  function copyLocator(f, t) {
    t.lineNumber = f.lineNumber;
    t.columnNumber = f.columnNumber;
    return t;
  }
  function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
    function addAttribute(qname, value2, startIndex) {
      if (el.attributeNames.hasOwnProperty(qname)) {
        errorHandler.fatalError("Attribute " + qname + " redefined");
      }
      el.addValue(
        qname,
        // @see https://www.w3.org/TR/xml/#AVNormalize
        // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
        // - recursive replacement of (DTD) entity references
        // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
        value2.replace(/[\t\n\r]/g, " ").replace(/&#?\w+;/g, entityReplacer),
        startIndex
      );
    }
    var attrName;
    var value;
    var p = ++start;
    var s = S_TAG;
    while (true) {
      var c = source.charAt(p);
      switch (c) {
        case "=":
          if (s === S_ATTR) {
            attrName = source.slice(start, p);
            s = S_EQ;
          } else if (s === S_ATTR_SPACE) {
            s = S_EQ;
          } else {
            throw new Error("attribute equal must after attrName");
          }
          break;
        case "'":
        case '"':
          if (s === S_EQ || s === S_ATTR) {
            if (s === S_ATTR) {
              errorHandler.warning('attribute value must after "="');
              attrName = source.slice(start, p);
            }
            start = p + 1;
            p = source.indexOf(c, start);
            if (p > 0) {
              value = source.slice(start, p);
              addAttribute(attrName, value, start - 1);
              s = S_ATTR_END;
            } else {
              throw new Error("attribute value no end '" + c + "' match");
            }
          } else if (s == S_ATTR_NOQUOT_VALUE) {
            value = source.slice(start, p);
            addAttribute(attrName, value, start);
            errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
            start = p + 1;
            s = S_ATTR_END;
          } else {
            throw new Error('attribute value must after "="');
          }
          break;
        case "/":
          switch (s) {
            case S_TAG:
              el.setTagName(source.slice(start, p));
            case S_ATTR_END:
            case S_TAG_SPACE:
            case S_TAG_CLOSE:
              s = S_TAG_CLOSE;
              el.closed = true;
            case S_ATTR_NOQUOT_VALUE:
            case S_ATTR:
              break;
            case S_ATTR_SPACE:
              el.closed = true;
              break;
            //case S_EQ:
            default:
              throw new Error("attribute invalid close char('/')");
          }
          break;
        case "":
          errorHandler.error("unexpected end of input");
          if (s == S_TAG) {
            el.setTagName(source.slice(start, p));
          }
          return p;
        case ">":
          switch (s) {
            case S_TAG:
              el.setTagName(source.slice(start, p));
            case S_ATTR_END:
            case S_TAG_SPACE:
            case S_TAG_CLOSE:
              break;
            //normal
            case S_ATTR_NOQUOT_VALUE:
            //Compatible state
            case S_ATTR:
              value = source.slice(start, p);
              if (value.slice(-1) === "/") {
                el.closed = true;
                value = value.slice(0, -1);
              }
            case S_ATTR_SPACE:
              if (s === S_ATTR_SPACE) {
                value = attrName;
              }
              if (s == S_ATTR_NOQUOT_VALUE) {
                errorHandler.warning('attribute "' + value + '" missed quot(")!');
                addAttribute(attrName, value, start);
              } else {
                if (!NAMESPACE.isHTML(currentNSMap[""]) || !value.match(/^(?:disabled|checked|selected)$/i)) {
                  errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                }
                addAttribute(value, value, start);
              }
              break;
            case S_EQ:
              throw new Error("attribute value missed!!");
          }
          return p;
        /*xml space '\x20' | #x9 | #xD | #xA; */
        case "":
          c = " ";
        default:
          if (c <= " ") {
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
                s = S_TAG_SPACE;
                break;
              case S_ATTR:
                attrName = source.slice(start, p);
                s = S_ATTR_SPACE;
                break;
              case S_ATTR_NOQUOT_VALUE:
                var value = source.slice(start, p);
                errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                addAttribute(attrName, value, start);
              case S_ATTR_END:
                s = S_TAG_SPACE;
                break;
            }
          } else {
            switch (s) {
              //case S_TAG:void();break;
              //case S_ATTR:void();break;
              //case S_ATTR_NOQUOT_VALUE:void();break;
              case S_ATTR_SPACE:
                el.tagName;
                if (!NAMESPACE.isHTML(currentNSMap[""]) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                  errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                }
                addAttribute(attrName, attrName, start);
                start = p;
                s = S_ATTR;
                break;
              case S_ATTR_END:
                errorHandler.warning('attribute space is required"' + attrName + '"!!');
              case S_TAG_SPACE:
                s = S_ATTR;
                start = p;
                break;
              case S_EQ:
                s = S_ATTR_NOQUOT_VALUE;
                start = p;
                break;
              case S_TAG_CLOSE:
                throw new Error("elements closed character '/' and '>' must be connected to");
            }
          }
      }
      p++;
    }
  }
  function appendElement(el, domBuilder, currentNSMap) {
    var tagName = el.tagName;
    var localNSMap = null;
    var i = el.length;
    while (i--) {
      var a = el[i];
      var qName = a.qName;
      var value = a.value;
      var nsp = qName.indexOf(":");
      if (nsp > 0) {
        var prefix = a.prefix = qName.slice(0, nsp);
        var localName = qName.slice(nsp + 1);
        var nsPrefix = prefix === "xmlns" && localName;
      } else {
        localName = qName;
        prefix = null;
        nsPrefix = qName === "xmlns" && "";
      }
      a.localName = localName;
      if (nsPrefix !== false) {
        if (localNSMap == null) {
          localNSMap = {};
          _copy(currentNSMap, currentNSMap = {});
        }
        currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
        a.uri = NAMESPACE.XMLNS;
        domBuilder.startPrefixMapping(nsPrefix, value);
      }
    }
    var i = el.length;
    while (i--) {
      a = el[i];
      var prefix = a.prefix;
      if (prefix) {
        if (prefix === "xml") {
          a.uri = NAMESPACE.XML;
        }
        if (prefix !== "xmlns") {
          a.uri = currentNSMap[prefix || ""];
        }
      }
    }
    var nsp = tagName.indexOf(":");
    if (nsp > 0) {
      prefix = el.prefix = tagName.slice(0, nsp);
      localName = el.localName = tagName.slice(nsp + 1);
    } else {
      prefix = null;
      localName = el.localName = tagName;
    }
    var ns = el.uri = currentNSMap[prefix || ""];
    domBuilder.startElement(ns, localName, tagName, el);
    if (el.closed) {
      domBuilder.endElement(ns, localName, tagName);
      if (localNSMap) {
        for (prefix in localNSMap) {
          if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
            domBuilder.endPrefixMapping(prefix);
          }
        }
      }
    } else {
      el.currentNSMap = currentNSMap;
      el.localNSMap = localNSMap;
      return true;
    }
  }
  function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
    if (/^(?:script|textarea)$/i.test(tagName)) {
      var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
      var text = source.substring(elStartEnd + 1, elEndStart);
      if (/[&<]/.test(text)) {
        if (/^script$/i.test(tagName)) {
          domBuilder.characters(text, 0, text.length);
          return elEndStart;
        }
        text = text.replace(/&#?\w+;/g, entityReplacer);
        domBuilder.characters(text, 0, text.length);
        return elEndStart;
      }
    }
    return elStartEnd + 1;
  }
  function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
    var pos = closeMap[tagName];
    if (pos == null) {
      pos = source.lastIndexOf("</" + tagName + ">");
      if (pos < elStartEnd) {
        pos = source.lastIndexOf("</" + tagName);
      }
      closeMap[tagName] = pos;
    }
    return pos < elStartEnd;
  }
  function _copy(source, target) {
    for (var n in source) {
      if (Object.prototype.hasOwnProperty.call(source, n)) {
        target[n] = source[n];
      }
    }
  }
  function parseDCC(source, start, domBuilder, errorHandler) {
    var next = source.charAt(start + 2);
    switch (next) {
      case "-":
        if (source.charAt(start + 3) === "-") {
          var end = source.indexOf("-->", start + 4);
          if (end > start) {
            domBuilder.comment(source, start + 4, end - start - 4);
            return end + 3;
          } else {
            errorHandler.error("Unclosed comment");
            return -1;
          }
        } else {
          return -1;
        }
      default:
        if (source.substr(start + 3, 6) == "CDATA[") {
          var end = source.indexOf("]]>", start + 9);
          domBuilder.startCDATA();
          domBuilder.characters(source, start + 9, end - start - 9);
          domBuilder.endCDATA();
          return end + 3;
        }
        var matchs = split(source, start);
        var len = matchs.length;
        if (len > 1 && /!doctype/i.test(matchs[0][0])) {
          var name = matchs[1][0];
          var pubid = false;
          var sysid = false;
          if (len > 3) {
            if (/^public$/i.test(matchs[2][0])) {
              pubid = matchs[3][0];
              sysid = len > 4 && matchs[4][0];
            } else if (/^system$/i.test(matchs[2][0])) {
              sysid = matchs[3][0];
            }
          }
          var lastMatch = matchs[len - 1];
          domBuilder.startDTD(name, pubid, sysid);
          domBuilder.endDTD();
          return lastMatch.index + lastMatch[0].length;
        }
    }
    return -1;
  }
  function parseInstruction(source, start, domBuilder) {
    var end = source.indexOf("?>", start);
    if (end) {
      var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
      if (match) {
        match[0].length;
        domBuilder.processingInstruction(match[1], match[2]);
        return end + 2;
      } else {
        return -1;
      }
    }
    return -1;
  }
  function ElementAttributes() {
    this.attributeNames = {};
  }
  ElementAttributes.prototype = {
    setTagName: function(tagName) {
      if (!tagNamePattern.test(tagName)) {
        throw new Error("invalid tagName:" + tagName);
      }
      this.tagName = tagName;
    },
    addValue: function(qName, value, offset) {
      if (!tagNamePattern.test(qName)) {
        throw new Error("invalid attribute:" + qName);
      }
      this.attributeNames[qName] = this.length;
      this[this.length++] = { qName, value, offset };
    },
    length: 0,
    getLocalName: function(i) {
      return this[i].localName;
    },
    getLocator: function(i) {
      return this[i].locator;
    },
    getQName: function(i) {
      return this[i].qName;
    },
    getURI: function(i) {
      return this[i].uri;
    },
    getValue: function(i) {
      return this[i].value;
    }
    //	,getIndex:function(uri, localName)){
    //		if(localName){
    //
    //		}else{
    //			var qName = uri
    //		}
    //	},
    //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
    //	getType:function(uri,localName){}
    //	getType:function(i){},
  };
  function split(source, start) {
    var match;
    var buf = [];
    var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
    reg.lastIndex = start;
    reg.exec(source);
    while (match = reg.exec(source)) {
      buf.push(match);
      if (match[1]) return buf;
    }
  }
  sax.XMLReader = XMLReader;
  sax.ParseError = ParseError;
  return sax;
}
var hasRequiredDomParser;
function requireDomParser() {
  if (hasRequiredDomParser) return domParser;
  hasRequiredDomParser = 1;
  var conventions2 = requireConventions();
  var dom2 = requireDom();
  var entities2 = requireEntities();
  var sax2 = requireSax();
  var DOMImplementation = dom2.DOMImplementation;
  var NAMESPACE = conventions2.NAMESPACE;
  var ParseError = sax2.ParseError;
  var XMLReader = sax2.XMLReader;
  function normalizeLineEndings(input) {
    return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028]/g, "\n");
  }
  function DOMParser(options) {
    this.options = options || { locator: {} };
  }
  DOMParser.prototype.parseFromString = function(source, mimeType) {
    var options = this.options;
    var sax3 = new XMLReader();
    var domBuilder = options.domBuilder || new DOMHandler();
    var errorHandler = options.errorHandler;
    var locator = options.locator;
    var defaultNSMap = options.xmlns || {};
    var isHTML = /\/x?html?$/.test(mimeType);
    var entityMap = isHTML ? entities2.HTML_ENTITIES : entities2.XML_ENTITIES;
    if (locator) {
      domBuilder.setDocumentLocator(locator);
    }
    sax3.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
    sax3.domBuilder = options.domBuilder || domBuilder;
    if (isHTML) {
      defaultNSMap[""] = NAMESPACE.HTML;
    }
    defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
    var normalize = options.normalizeLineEndings || normalizeLineEndings;
    if (source && typeof source === "string") {
      sax3.parse(
        normalize(source),
        defaultNSMap,
        entityMap
      );
    } else {
      sax3.errorHandler.error("invalid doc source");
    }
    return domBuilder.doc;
  };
  function buildErrorHandler(errorImpl, domBuilder, locator) {
    if (!errorImpl) {
      if (domBuilder instanceof DOMHandler) {
        return domBuilder;
      }
      errorImpl = domBuilder;
    }
    var errorHandler = {};
    var isCallback = errorImpl instanceof Function;
    locator = locator || {};
    function build(key) {
      var fn = errorImpl[key];
      if (!fn && isCallback) {
        fn = errorImpl.length == 2 ? function(msg) {
          errorImpl(key, msg);
        } : errorImpl;
      }
      errorHandler[key] = fn && function(msg) {
        fn("[xmldom " + key + "]	" + msg + _locator(locator));
      } || function() {
      };
    }
    build("warning");
    build("error");
    build("fatalError");
    return errorHandler;
  }
  function DOMHandler() {
    this.cdata = false;
  }
  function position(locator, node) {
    node.lineNumber = locator.lineNumber;
    node.columnNumber = locator.columnNumber;
  }
  DOMHandler.prototype = {
    startDocument: function() {
      this.doc = new DOMImplementation().createDocument(null, null, null);
      if (this.locator) {
        this.doc.documentURI = this.locator.systemId;
      }
    },
    startElement: function(namespaceURI, localName, qName, attrs) {
      var doc = this.doc;
      var el = doc.createElementNS(namespaceURI, qName || localName);
      var len = attrs.length;
      appendElement(this, el);
      this.currentElement = el;
      this.locator && position(this.locator, el);
      for (var i = 0; i < len; i++) {
        var namespaceURI = attrs.getURI(i);
        var value = attrs.getValue(i);
        var qName = attrs.getQName(i);
        var attr = doc.createAttributeNS(namespaceURI, qName);
        this.locator && position(attrs.getLocator(i), attr);
        attr.value = attr.nodeValue = value;
        el.setAttributeNode(attr);
      }
    },
    endElement: function(namespaceURI, localName, qName) {
      var current = this.currentElement;
      current.tagName;
      this.currentElement = current.parentNode;
    },
    startPrefixMapping: function(prefix, uri) {
    },
    endPrefixMapping: function(prefix) {
    },
    processingInstruction: function(target, data) {
      var ins = this.doc.createProcessingInstruction(target, data);
      this.locator && position(this.locator, ins);
      appendElement(this, ins);
    },
    ignorableWhitespace: function(ch, start, length) {
    },
    characters: function(chars, start, length) {
      chars = _toString.apply(this, arguments);
      if (chars) {
        if (this.cdata) {
          var charNode = this.doc.createCDATASection(chars);
        } else {
          var charNode = this.doc.createTextNode(chars);
        }
        if (this.currentElement) {
          this.currentElement.appendChild(charNode);
        } else if (/^\s*$/.test(chars)) {
          this.doc.appendChild(charNode);
        }
        this.locator && position(this.locator, charNode);
      }
    },
    skippedEntity: function(name) {
    },
    endDocument: function() {
      this.doc.normalize();
    },
    setDocumentLocator: function(locator) {
      if (this.locator = locator) {
        locator.lineNumber = 0;
      }
    },
    //LexicalHandler
    comment: function(chars, start, length) {
      chars = _toString.apply(this, arguments);
      var comm = this.doc.createComment(chars);
      this.locator && position(this.locator, comm);
      appendElement(this, comm);
    },
    startCDATA: function() {
      this.cdata = true;
    },
    endCDATA: function() {
      this.cdata = false;
    },
    startDTD: function(name, publicId, systemId) {
      var impl = this.doc.implementation;
      if (impl && impl.createDocumentType) {
        var dt = impl.createDocumentType(name, publicId, systemId);
        this.locator && position(this.locator, dt);
        appendElement(this, dt);
        this.doc.doctype = dt;
      }
    },
    /**
     * @see org.xml.sax.ErrorHandler
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
     */
    warning: function(error) {
      console.warn("[xmldom warning]	" + error, _locator(this.locator));
    },
    error: function(error) {
      console.error("[xmldom error]	" + error, _locator(this.locator));
    },
    fatalError: function(error) {
      throw new ParseError(error, this.locator);
    }
  };
  function _locator(l) {
    if (l) {
      return "\n@" + (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
    }
  }
  function _toString(chars, start, length) {
    if (typeof chars == "string") {
      return chars.substr(start, length);
    } else {
      if (chars.length >= start + length || start) {
        return new java.lang.String(chars, start, length) + "";
      }
      return chars;
    }
  }
  "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(key) {
    DOMHandler.prototype[key] = function() {
      return null;
    };
  });
  function appendElement(hander, node) {
    if (!hander.currentElement) {
      hander.doc.appendChild(node);
    } else {
      hander.currentElement.appendChild(node);
    }
  }
  domParser.__DOMHandler = DOMHandler;
  domParser.normalizeLineEndings = normalizeLineEndings;
  domParser.DOMParser = DOMParser;
  return domParser;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  var dom2 = requireDom();
  lib.DOMImplementation = dom2.DOMImplementation;
  lib.XMLSerializer = dom2.XMLSerializer;
  lib.DOMParser = requireDomParser().DOMParser;
  return lib;
}
var libExports = requireLib();
async function e(e2, n = false) {
  return await new Promise((r, o) => {
    try {
      const o2 = {};
      let s;
      if ("string" == typeof e2) {
        const n2 = new libExports.DOMParser().parseFromString(e2, "text/xml");
        n2.firstChild && (s = n2.firstChild);
      } else s = e2;
      const i = (t, e3 = o2) => {
        e3.type = t.nodeName;
        const n2 = t.childNodes;
        if (null !== n2 && n2.length) {
          e3.content = [];
          for (let t2 = 0; t2 < n2.length; t2++) 3 === n2[t2].nodeType ? n2[t2].nodeValue && e3.content.push(n2[t2].nodeValue) : (e3.content.push({}), i(n2[t2], e3.content[e3.content.length - 1]));
        }
        if (null !== t.attributes && t.attributes.length) {
          e3.attributes = {};
          for (let n3 = 0; n3 < t.attributes.length; n3++) e3.attributes[t.attributes[n3].nodeName] = t.attributes[n3].nodeValue;
        }
      };
      i(s), r(n ? JSON.stringify(o2) : o2);
    } catch (t) {
      o(t);
    }
  });
}
const _Utils = class _Utils {
  constructor() {
  }
};
/**
 * Zwraca niektóre z wartości css w formie liczby (reprezentującej piksele)
 * @param {HTMLElement} element - wybrany element html
 * @param {('column-gap'|'row-gap'|'border-left-width'|'border-right-width'|'border-bottom-width'|'border-top-width'|'padding-top'|'padding-bottom'|'padding-left'|'padding-right'|'margin-top'|'margin-bottom'|'margin-left'|'margin-right'|'width'|'height'|'left'|'top'|'right'|'bottom'|'z-index'|'--rotation'|'--temp_rotation')} valueName - nazwa właściwości
 * @param {Boolean} [useInline=false] - czy uzywać tylko styli wpisanych w inline
 * @returns {Number}
 */
__publicField(_Utils, "getCssValueAsNumber", (element, valueName, useInline = false) => {
  let returnValue = 0;
  let tempCompStyle = window.getComputedStyle(element);
  let value = tempCompStyle.getPropertyValue(valueName);
  if (useInline) {
    let attrs = _Utils.getCssValuesFromAttr(element);
    if (attrs[valueName]) {
      value = attrs[valueName];
    } else {
      value = "";
    }
  }
  let unit = value.match(/(\%)|(px)|(vw)|(vh)|(lvh)|(lvw)|(dvw)|(dvh)|(deg)/gmi);
  if (unit != null) {
    switch (unit[0]) {
      case "%": {
        let numberValue = Number(value.replaceAll(/\%/gmi, ""));
        let parent = element.offsetParent;
        if (!isNaN(numberValue) && parent) {
          switch (valueName) {
            case "border-bottom-width":
            case "border-top-width":
            case "padding-bottom":
            case "padding-top":
            case "margin-bottom":
            case "margin-top":
            case "bottom":
            case "top":
            case "height": {
              let borderTop = _Utils.getCssValueAsNumber(parent, "border-top-width");
              let borderBot = _Utils.getCssValueAsNumber(parent, "border-bottom-width");
              let parentHeight = parent.offsetHeight - (borderBot + borderTop);
              returnValue = parentHeight * (numberValue / 100);
              break;
            }
            case "border-left-width":
            case "border-right-width":
            case "padding-left":
            case "padding-right":
            case "margin-left":
            case "margin-right":
            case "left":
            case "right":
            case "width": {
              let borderLeft = _Utils.getCssValueAsNumber(parent, "border-left-width");
              let borderRight = _Utils.getCssValueAsNumber(parent, "border-right-width");
              let parentWidth = parent.offsetWidth - (borderLeft + borderRight);
              returnValue = parentWidth * (numberValue / 100);
              break;
            }
            case "column-gap": {
              let borderLeft = _Utils.getCssValueAsNumber(element, "border-left-width");
              let borderRight = _Utils.getCssValueAsNumber(element, "border-right-width");
              let parentWidth = element.offsetWidth - (borderLeft + borderRight);
              returnValue = parentWidth * (numberValue / 100);
              break;
            }
            case "row-gap": {
              let borderBot = _Utils.getCssValueAsNumber(element, "border-top-width");
              let borderTop = _Utils.getCssValueAsNumber(element, "border-bottom-width");
              let parentWidth = element.offsetHeight - (borderBot + borderTop);
              returnValue = parentWidth * (numberValue / 100);
              break;
            }
          }
        }
        break;
      }
      case "px": {
        let numberValue = Number(value.replaceAll(/px/gmi, ""));
        if (!isNaN(numberValue)) {
          returnValue = numberValue;
        }
        break;
      }
      case "vw":
      case "lvw":
      case "dvw": {
        let numberValue = Number(value.replaceAll(/(vw)|(lvw)|(dvw)/gmi, ""));
        if (!isNaN(numberValue)) {
          returnValue = window.innerWidth * (numberValue / 100);
        }
        break;
      }
      case "vh":
      case "lvh":
      case "dvh": {
        let numberValue = Number(value.replaceAll(/(vh)|(lvh)|(dvh)/gmi, ""));
        if (!isNaN(numberValue)) {
          returnValue = window.innerHeight * (numberValue / 100);
        }
        break;
      }
      case "deg": {
        let numberValue = Number(value.replaceAll(/(deg)/gmi, ""));
        if (!isNaN(numberValue)) {
          returnValue = numberValue;
        }
        break;
      }
    }
  } else if (valueName == "z-index") {
    let numberValue = Number(value);
    if (!isNaN(numberValue)) {
      returnValue = numberValue;
    }
  }
  return returnValue;
});
/**
 * Zwraca daną wartośc css
 * @param {HTMLElement} element - wybrany element html
 * @param {CSS_PROPERTY} valueName
 * @param {Boolean} [useInline=false] - czy uzywać tylko styli wpisanych w inline
 * @returns {String}
 */
__publicField(_Utils, "getCssValue", (element, valueName, useInline = false) => {
  if (useInline) {
    let attrs = _Utils.getCssValuesFromAttr(element);
    if (attrs[valueName]) {
      return attrs[valueName];
    } else {
      return "";
    }
  } else {
    let tempCompStyle = window.getComputedStyle(element);
    return tempCompStyle.getPropertyValue(valueName);
  }
});
/**
 * Zwraca daną wartość css, rozpatrując tylko właściwości wpisane inline
 * @param {String} attrString 
 * @returns {{[id:string]: string}}
 */
__publicField(_Utils, "getCssValuesFromString", (attrString) => {
  let attrs = {};
  if (attrString) {
    const atrrArr = attrString.split(";");
    atrrArr.forEach((atrrData) => {
      if (atrrData.length > 0) {
        let attrName = atrrData.slice(0, atrrData.indexOf(":")).replaceAll(/\s/gmi, "");
        let attrValue = atrrData.slice(atrrData.indexOf(":") + 1).replaceAll("!important", "").replaceAll(/(\s*$)|(^\s*)/gmi, "");
        attrs[attrName] = attrValue;
      }
    });
  }
  return attrs;
});
/**
 * Zwraca daną wartość css, rozpatrując tylko właściwości wpisane inline
 * @param {HTMLElement} element 
 * @returns {{[id:string]: string}}
 */
__publicField(_Utils, "getCssValuesFromAttr", (element) => {
  let attrs = {};
  const attrString = element.getAttribute("style");
  if (attrString) {
    const atrrArr = attrString.split(";");
    atrrArr.forEach((atrrData) => {
      if (atrrData.length > 0) {
        let attrName = atrrData.slice(0, atrrData.indexOf(":")).replaceAll(/\s/gmi, "");
        let attrValue = atrrData.slice(atrrData.indexOf(":") + 1).replaceAll("!important", "").replaceAll(/(\s*$)|(^\s*)/gmi, "");
        attrs[attrName] = attrValue;
      }
    });
  }
  return attrs;
});
/**
 * @param {HTMLElement} element
 * @returns {BOUNDS}
 */
__publicField(_Utils, "getPosition", (element) => {
  let bounds = { left: element.offsetLeft, top: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
  let currentEl = element.offsetParent;
  while (currentEl) {
    bounds.left += currentEl.offsetLeft;
    bounds.top += currentEl.offsetTop;
    currentEl = currentEl.offsetParent;
  }
  return bounds;
});
/**
 * @param {HTMLElement} element0 
 * @param {HTMLElement} element1
 * @returns {BOUNDS}
 */
__publicField(_Utils, "getPositionRelativeTo", (element0, element1) => {
  let bounds0 = _Utils.getPosition(element0);
  let bounds1 = _Utils.getPosition(element1);
  bounds0.left = bounds0.left - bounds1.left;
  bounds0.top = bounds0.top - bounds1.top;
  return bounds0;
});
/**
 * @param {Array<HTMLElement>|HTMLElement} elements
 * @returns {Number}
 */
__publicField(_Utils, "getTransitionTime", (elements) => {
  let time = 0;
  const getTime = (element) => {
    let tempCompStyle = window.getComputedStyle(element);
    let transitionTime = 0;
    if (!isNaN(Number(tempCompStyle.getPropertyValue("transition-duration").replaceAll(/[^123456789\-\.\,]/gmi, "")))) {
      transitionTime = Number(tempCompStyle.getPropertyValue("transition-duration").replaceAll(/[^123456789\-\.\,]/gmi, "")) * 1e3;
    }
    if (!isNaN(Number(tempCompStyle.getPropertyValue("transition-delay").replaceAll(/[^123456789\-\.\,]/gmi, "")))) {
      transitionTime += Number(tempCompStyle.getPropertyValue("transition-delay").replaceAll(/[^123456789\-\.\,]/gmi, "")) * 1e3;
    }
    let animationTime = 0;
    if (!isNaN(Number(tempCompStyle.getPropertyValue("animation-duration").replaceAll(/[^123456789\-\.\,]/gmi, "")))) {
      animationTime = Number(tempCompStyle.getPropertyValue("animation-duration").replaceAll(/[^123456789\-\.\,]/gmi, "")) * 1e3;
    }
    if (!isNaN(Number(tempCompStyle.getPropertyValue("animation-delay").replaceAll(/[^123456789\-\.\,]/gmi, "")))) {
      animationTime += Number(tempCompStyle.getPropertyValue("animation-delay").replaceAll(/[^123456789\-\.\,]/gmi, "")) * 1e3;
    }
    if (time < Math.max(transitionTime, animationTime)) {
      time = Math.max(transitionTime, animationTime);
    }
  };
  if (Array.isArray(elements)) {
    elements.forEach((element) => {
      getTime(element);
    });
  } else {
    getTime(elements);
  }
  return time;
});
/**
 * generuje unikalne id (nie powtarzane w obrebie jednej strony/zadania), id moze byc poprzedzone i zakonczone podanym ciagiem znakow
 * @param {number} [length=10] - długośc id
 * @param {string} [startWith=''] - początkowy ciąg znaków
 * @param {string} [endWith=''] - końcowy ciąg znaków
 * @param {('all'|'lowercase'|'uppercase'|'none')} [charcase='all'] - jakich znaków uzywać w tworzonym id
 * @param {Boolean} [allowNumbers=true] - czy uzywać liczb
 * @returns {string}
 */
__publicField(_Utils, "makeId", (length = 10, startWith = "", endWith = "", charcase = "all", allowNumbers = true) => {
  let make = (_length) => {
    let result = "";
    let characters = "";
    switch (charcase) {
      case "all":
      // @ts-ignore
      case "lowercase": {
        characters += "abcdefghijklmnopqrstuvwxyz";
        if (charcase == "lowercase") {
          break;
        }
      }
      case "uppercase": {
        characters += "ABCDEFGHIJKLMNOPQRSTUVXYZ";
        break;
      }
    }
    if (allowNumbers) {
      characters += "0123456789";
    } else if (characters.length == 0) {
      characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789";
    }
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < _length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };
  return `${startWith}${make(length)}${endWith}`;
});
/**
 * @param {Number} [min] 
 * @param {Number} [max] 
 * @returns {Number}
 */
__publicField(_Utils, "randomInRange", (min = 0, max = Number.MAX_SAFE_INTEGER) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
});
/**
 * @template {*} SRC_ARR_TYPE
 * @param {Array<SRC_ARR_TYPE>} arr
 * @returns {SRC_ARR_TYPE}
 */
__publicField(_Utils, "getRandomArrayElement", (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
});
/**
 * @template {{[id:string]:Number}} PROBABILITY
 * @param {PROBABILITY} probability 
 * @returns {keyof PROBABILITY}
 */
__publicField(_Utils, "getRandomWithProbability", (probability) => {
  let max = 0;
  let tenthPow = 0;
  Object.keys(probability).forEach((key) => {
    let currentPow = 0;
    while (Math.floor(probability[key] * Math.pow(10, currentPow)) !== probability[key] * Math.pow(10, currentPow)) {
      currentPow++;
    }
    if (currentPow > tenthPow) {
      tenthPow = currentPow + 0;
    }
  });
  let parsedProbability = {};
  Object.keys(probability).forEach((key) => {
    parsedProbability[key] = { min: max + 0, max: 0 };
    max += probability[key] * Math.pow(10, tenthPow);
    parsedProbability[key].max = max + 0;
  });
  let random = Math.floor(Math.random() * max);
  let foundKey = null;
  let iterator = 0;
  while (foundKey == null && iterator < Object.keys(parsedProbability).length) {
    if (random >= parsedProbability[Object.keys(parsedProbability)[iterator]].min && random < parsedProbability[Object.keys(parsedProbability)[iterator]].max) {
      foundKey = `${Object.keys(parsedProbability)[iterator]}`;
    }
    iterator++;
  }
  if (foundKey == null) {
    return `${Object.keys(probability)[Math.floor(Math.random() * Object.keys(probability).length)]}`;
  }
  return foundKey;
});
/**
 * @template {keyof HTML_TAGS} T
 * @param {T} type
 * @param {Array<String>} [classNames=[]]
 * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
 * @param {String|null|Array<CONTENT>} [content=null]
 * @returns {HTML_TAGS[T]}
 */
__publicField(_Utils, "createHTMLElement", (type, classNames = [], params = {}, content = null) => {
  const element = document.createElement(type);
  if (params.attibutes) {
    Object.keys(params.attibutes).forEach((key) => {
      element.setAttribute(key, params.attibutes[key]);
    });
  }
  classNames.forEach((className) => {
    element.classList.add(className);
  });
  if (params.css) {
    let cssString = "";
    if (params.attibutes) {
      if (params.attibutes.style) {
        cssString = `${params.attibutes.style.trim()}`;
      }
    }
    Object.keys(params.css).forEach((key) => {
      var _a;
      switch (key.trim().toLowerCase()) {
        case "after":
        case "before":
        case ":after":
        case "hover":
        case ":hover":
        case "::hover":
        case ":before":
        case "::after":
        case "::before": {
          if (typeof params.css[key] == "object" && !Array.isArray(params.css)) {
            let id = "";
            if ((_a = params == null ? void 0 : params.attibutes) == null ? void 0 : _a.id) {
              id = params.attibutes.id.trim();
            } else {
              id = _Utils.makeId(10, "", "", "uppercase", false);
            }
            let _cssString = `${id}:before {`;
            Object.keys(params.css[key]).forEach((_key) => {
              _cssString += ` ${_key.trim().replaceAll(/[\"\'\`\:]/gmi, "")}: ${params.css[key][_key].trim().replaceAll(";", "")};`;
            });
            _cssString += ` }`;
            _Utils.createAndAppendHTMLElement(document.body, "style", [], { attibutes: { "data-style-of": id } }, _cssString);
          }
          break;
        }
        default: {
          cssString += ` ${key.trim().replaceAll(/[\"\'\`\:]/gmi, "")}: ${params.css[key].trim().replaceAll(";", "")};`;
          break;
        }
      }
    });
    if (cssString.trim() !== "") {
      element.setAttribute("style", cssString);
    }
  }
  if (content) {
    if (typeof content == "string") {
      element.innerHTML = content.trim();
    } else if (Array.isArray(content)) {
      content.forEach((entry) => {
        let classNames2 = [];
        if (entry.classNames) {
          classNames2 = entry.classNames;
        }
        let params2 = {};
        if (entry.params) {
          params2 = entry.params;
        }
        let content2 = null;
        if (entry.content) {
          content2 = content2;
        }
        _Utils.createAndAppendHTMLElement(element, entry.type, classNames2, params2, content2);
      });
    }
  }
  return element;
});
/**
 * @template {keyof HTML_TAGS} T
 * @param {HTMLElement} parent
 * @param {T} type
 * @param {Array<String>} [classNames=[]]
 * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
 * @param {String|null|Array<CONTENT>} [content=null]
 * @returns {HTML_TAGS[T]}
 */
__publicField(_Utils, "createAndAppendHTMLElement", (parent, type, classNames = [], params = {}, content = null) => {
  const element = _Utils.createHTMLElement(type, classNames, params, content);
  parent.append(element);
  return element;
});
/**
 * @template {keyof HTML_TAGS} T
 * @param {HTMLElement} parent
 * @param {T} type
 * @param {Array<String>} [classNames=[]]
 * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
 * @param {String|null|Array<CONTENT>} [content=null]
 * @returns {HTML_TAGS[T]}
 */
__publicField(_Utils, "createAndPreppendHTMLElement", (parent, type, classNames = [], params = {}, content = null) => {
  const element = _Utils.createHTMLElement(type, classNames, params, content);
  parent.prepend(element);
  return element;
});
/**
 * @template {keyof HTML_TAGS} T
 * @param {HTMLElement} sibling
 * @param {T} type
 * @param {Array<String>} [classNames=[]]
 * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
 * @param {String|null|Array<CONTENT>} [content=null]
 * @returns {HTML_TAGS[T]}
 */
__publicField(_Utils, "createAndInsertBeforeHTMLElement", (sibling, type, classNames = [], params = {}, content = null) => {
  const element = _Utils.createHTMLElement(type, classNames, params, content);
  sibling.before(element);
  return element;
});
/**
 * @template {keyof HTML_TAGS} T
 * @param {HTMLElement} sibling
 * @param {T} type
 * @param {Array<String>} [classNames=[]]
 * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
 * @param {String|null|Array<CONTENT>} [content=null]
 * @returns {HTML_TAGS[T]}
 */
__publicField(_Utils, "createAndInsertAfterHTMLElement", (sibling, type, classNames = [], params = {}, content = null) => {
  const element = _Utils.createHTMLElement(type, classNames, params, content);
  sibling.after(element);
  return element;
});
/**
 * Nadaje elementowi właściwości css
 * @param {HTMLElement} element - Element do którego dodać właściwościś
 * @param {CSS_VALUES} [cssAttributes={}] - Obiekt zawierający właściwości css które nalezy dodać do tego elementu. Atrybuty powinny być podane w formie {"nazwa właściwości 1": "wartość 1", "nazwa właściwości 2": "wartość 2"}, zarówno tag jak i wartość musi być stringiem.
 */
__publicField(_Utils, "addCssAttributes", (element, cssAttributes = {}) => {
  Object.keys(cssAttributes).forEach((key) => {
    if (cssAttributes[key].match(/\!important/gmi) != null) {
      element.style.setProperty(key, cssAttributes[key].replaceAll(/\!important/gmi, ""), "important");
    } else {
      element.style.setProperty(key, cssAttributes[key]);
    }
  });
});
/**
 * Tłumaczy event myszki na dotyk
 * @param {TouchEvent} e
 * @returns {MouseEvent}
 */
__publicField(_Utils, "translateTouchToMouse", (e2) => {
  let newEventData = { sourceCapabilities: { firesTouchEvents: false }, which: 1, clientX: 0, clientY: 0, x: 0, y: 0, pageX: 0, pageY: 0, screenX: 0, screenY: 0, layerX: 0, layerY: 0 };
  if (e2.touches[0]) {
    newEventData.clientX = e2.touches[0].clientX;
    newEventData.clientY = e2.touches[0].clientY;
    newEventData.x = e2.touches[0].clientX;
    newEventData.y = e2.touches[0].clientY;
    newEventData.pageX = e2.touches[0].pageX;
    newEventData.pageY = e2.touches[0].pageY;
    newEventData.layerX = e2.touches[0].pageX;
    newEventData.layerY = e2.touches[0].pageY;
    newEventData.screenX = e2.touches[0].screenX;
    newEventData.screenY = e2.touches[0].screenY;
  }
  ["isTrusted", "altKey", "bubbles", "cancelBubble", "cancelable", "composed", "ctrlKey", "currentTarget", "defaultPrevented", "detail", "eventPhase", "metaKey", "returnValue", "shiftKey", "srcElement", "target", "timeStamp", "view"].forEach((key) => {
    Object.defineProperty(newEventData, key, {
      set: () => {
      },
      get: () => {
        return e2[key];
      },
      enumerable: true
    });
  });
  return newEventData;
});
/**
* zaokragla podana liczbe do ulamka o podanym mianowniku
* @param {number} num - numer do zaokrąglenia
* @param {number} [denominator=2] - mianownik ułamka
* @returns {number}
*/
__publicField(_Utils, "roundToFraction", (num = 0.31221, denominator = 2) => {
  if (denominator <= 0) {
    return Math.round(num);
  }
  return num - num % 1 + Math.round(num % 1 * denominator) / denominator;
});
/**
 * zaokragla w gore podana liczbe do ulamka o podanym mianowniku
 * @param {number} num - numer do zaokrąglenia
 * @param {number} [denominator=2] - mianownik ułamka
 * @returns {number}
 */
__publicField(_Utils, "ceilToFraction", (num = 0.31221, denominator = 2) => {
  if (denominator <= 0) {
    return Math.ceil(num);
  }
  return num - num % 1 + Math.ceil(num % 1 * denominator) / denominator;
});
/**
 * zaokragla w dol podana liczbe do ulamka o podanym mianowniku
 * @param {number} num - numer do zaokrąglenia
 * @param {number} [denominator=2] - mianownik ułamka
 * @returns {number}
 */
__publicField(_Utils, "floorToFraction", (num = 0.31221, denominator = 2) => {
  if (denominator <= 0) {
    return Math.floor(num);
  }
  return num - num % 1 + Math.floor(num % 1 * denominator) / denominator;
});
/** 
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
__publicField(_Utils, "gcd", (a, b) => {
  if (b) {
    return _Utils.gcd(b, a % b);
  } else {
    return Math.abs(a);
  }
});
/**
 * Czy coś jest obiektem HTMLOWYM
 * @param {*} element
 * @returns {Boolean}
 */
__publicField(_Utils, "isElement", (element) => {
  return element instanceof Element || element instanceof Document || element instanceof HTMLElement;
});
/**
 * @param {Number} waitTime
 */
__publicField(_Utils, "waitFor", (waitTime) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(void 0);
    }, waitTime);
  });
});
/** 
 * @template {String} T
 * @typedef {Array<T>} HACK_ARR_STRING
 */
/**
 * @template {keyof HTML_TAGS} T
 * @typedef {Object} jsonHTML
 * @property {T} type
 * @property {{[id:String]:String}} [attributes]
 * @property {Array<jsonHTML<keyof HTML_TAGS>|String>} [content]
 */
/**
 * @overload
 * @param {jsonHTML<keyof HTML_TAGS>} jsonHTML
 * @param {Array<String>} [refs=[]]
 * @param {Array<String>} [collectAttributes=false]
 * @returns {{element: HTML_TAGS[keyof HTML_TAGS], refs: {[id: String]:HTML_TAGS[keyof HTML_TAGS]}, collected: {[id: String]: Array<HTML_TAGS[keyof HTML_TAGS]>}}}
 */
/**
 * @template {Array<String>} T
 * @param {jsonHTML<keyof HTML_TAGS>} jsonHTML
 * @param {Array<T>} [refs=[]]
 * @param {false} [collectAttributes=false]
 * @returns {{element: HTML_TAGS[keyof HTML_TAGS], refs: {[key in T]:HTML_TAGS[keyof HTML_TAGS]}}}
 */
//@ts-ignore
__publicField(_Utils, "jsonToHTML", (jsonHTML, refs = [], collectAttributes = false) => {
  let _refs = {};
  let _collected = {};
  const parseOne = (src, appendTo = void 0) => {
    var _a, _b, _c;
    let classes = [];
    let css = {};
    let attributes = {};
    if ((_a = src == null ? void 0 : src.attributes) == null ? void 0 : _a.class) {
      src.attributes.class.split(" ").forEach((el) => {
        if (!classes.includes(el) && el !== "") {
          classes.push(el);
        }
      });
    }
    if ((_b = src == null ? void 0 : src.attributes) == null ? void 0 : _b.style) {
      css = _Utils.getCssValuesFromString(src.attributes.style);
    }
    if (src.attributes) {
      Object.keys(src.attributes).forEach((key) => {
        if (!["class", "style", "ref"].includes(key)) {
          attributes[key] = src.attributes[key];
        }
      });
    }
    let element2 = _Utils.createHTMLElement(src.type, classes, { attibutes: attributes, css });
    if (src.content) {
      for (let entry of src.content) {
        switch (typeof entry) {
          case "string":
          case "number":
          case "bigint":
          case "boolean":
          case "undefined": {
            if (`${entry}`.trim() !== "") {
              element2.innerText += `${entry}`;
            }
            break;
          }
          case "symbol": {
            break;
          }
          case "object":
          case "function": {
            parseOne(src.content, element2);
            break;
          }
        }
      }
    }
    if ((_c = src == null ? void 0 : src.attributes) == null ? void 0 : _c.ref) {
      if (refs.includes(src.attributes.ref.trim())) {
        _refs[src.attributes.ref.trim()] = element2;
      }
    }
    if (collectAttributes) {
      collectAttributes.forEach(
        /** @param {String} attributeName */
        (attributeName) => {
          if (Object.keys(attributes).includes(attributeName.trim())) {
            if (Object.keys(_collected).includes(attributeName.trim())) {
              _collected[attributeName.trim()].push(element2);
            } else {
              _collected[attributeName.trim()] = [element2];
            }
          }
        }
      );
    }
    if (appendTo) {
      appendTo.appendChild(element2);
    }
    return element2;
  };
  let element = parseOne(jsonHTML);
  if (collectAttributes) {
    return { element, refs: _refs, collected: _collected };
  } else {
    return { element, refs: _refs };
  }
});
/**
 * @overload
 * @param {String} outerHTML
 * @param {Array<String>} [refs=[]]
 * @param {Array<String>} [collectAttributes]
 * @returns {Promise<{element: HTML_TAGS[keyof HTML_TAGS], refs: {[id:String]: HTML_TAGS[keyof HTML_TAGS]}, collected: {[id:String]: HTML_TAGS[keyof HTML_TAGS]}}>}
 */
/**
 * @template {String} T
 * @param {String} outerHTML
 * @param {HACK_ARR_STRING<T>} [refs=[]]
 * @param {false} [collectAttributes]
 * @returns {Promise<{element: HTML_TAGS[keyof HTML_TAGS], refs: {[key in HACK_ARR_STRING<T>]: HTML_TAGS[keyof HTML_TAGS]}}>}
 */
//@ts-ignore
__publicField(_Utils, "createHTML", (outerHTML, refs = [], collectAttributes = false) => {
  return new Promise((res, rej) => {
    e(outerHTML).then((result) => {
      if (collectAttributes) {
        res(_Utils.jsonToHTML(result, refs, collectAttributes));
      } else {
        res(_Utils.jsonToHTML(result, refs));
      }
    }, (e2) => {
      rej(e2);
    });
  });
});
let Utils = _Utils;
class DisplayWindow {
  /**
   * @param {CONTENT|String|Number|HTMLElement} content 
   * @param {DisplayWindow_creationConfig} [config={}]
   */
  constructor(content, config = {}) {
    /** @type {DisplayWindow_behaviourConfig} */
    __privateAdd(this, _behaviourConfig, { close: false, fullscreen: true, minimize: true, resize: true, move: true });
    /** @type {{x: Number, y: Number}} */
    __privateAdd(this, _pos, { x: 0, y: 0 });
    /** @type {{width: Number, height:Number}} */
    __privateAdd(this, _size, { width: 100, height: 100 });
    /** @type {HTMLElement} */
    __privateAdd(this, _window);
    __privateAdd(this, _focused, false);
    /** @type {HTMLElement} */
    __privateAdd(this, _container);
    /** @type {HTMLElement} */
    __privateAdd(this, _resizeContainer);
    /** @type {HTMLElement} */
    __privateAdd(this, _footer);
    /** @type {HTMLElement} */
    __privateAdd(this, _header);
    /** @type {HTMLElement} */
    __privateAdd(this, _headerInfo);
    /** @type {HTMLElement} */
    __privateAdd(this, _buttons);
    /** @type {HTMLElement} */
    __privateAdd(this, _iconElement);
    /** @type {HTMLElement} */
    __privateAdd(this, _nameElement);
    /** @type {HTMLElement} */
    __privateAdd(this, _descElement);
    /** @type {HTMLElement} */
    __privateAdd(this, _contentHolder);
    /** @type {{x: Number, y: Number}} */
    __privateAdd(this, _mouseEventPos, { x: 0, y: 0 });
    /** 
     * @typedef {Object} resizeFuncs
     * @property {(e:MouseEvent) => void} down
     * @property {(e:MouseEvent) => void} move
     * @property {(e:MouseEvent) => void} up
     * @property {() => void} enable
     * @property {() => void} disable
     * @property {{up:Boolean, down: Boolean, move: Boolean}} hasEvent
     */
    /** @type {{top: resizeFuncs, topLeft: resizeFuncs, topRight: resizeFuncs, left: resizeFuncs, right: resizeFuncs, bottom: resizeFuncs, bottomRight: resizeFuncs, bottomLeft: resizeFuncs}} */
    __privateAdd(this, _resizeEvents, {
      top: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "top");
          if (__privateGet(this, _resizeEvents).top.hasEvent.down) {
            __privateGet(this, _resizeEvents).top.hasEvent.down = false;
            __privateGet(this, _resizePoints).top.removeEventListener("mousedown", __privateGet(this, _resizeEvents).top.down);
          }
          if (!document.body.classList.contains("resizing-top")) {
            document.body.classList.add("resizing-top");
          }
          if (!__privateGet(this, _resizeEvents).top.hasEvent.up) {
            __privateGet(this, _resizeEvents).top.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).top.up);
          }
          if (!__privateGet(this, _resizeEvents).top.hasEvent.move) {
            __privateGet(this, _resizeEvents).top.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).top.move);
          }
        },
        move: (e2) => {
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          if (__privateGet(this, _aspectRatioScaling)) {
            this.size = { width: (__privateGet(this, _size).height + diffY) * __privateGet(this, _aspectRatio_hw), height: __privateGet(this, _size).height + diffY };
          } else {
            this.size = { width: __privateGet(this, _size).width, height: __privateGet(this, _size).height + diffY };
          }
          this.pos = { x: __privateGet(this, _pos).x, y: __privateGet(this, _pos).y - diffY };
          __privateGet(this, _mouseEventPos).y = e2.clientY;
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).top.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).top.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).top.hasEvent.up) {
            __privateGet(this, _resizeEvents).top.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).top.up);
          }
          if (__privateGet(this, _resizeEvents).top.hasEvent.move) {
            __privateGet(this, _resizeEvents).top.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).top.move);
          }
          if (!__privateGet(this, _resizeEvents).top.hasEvent.down) {
            __privateGet(this, _resizeEvents).top.hasEvent.down = true;
            __privateGet(this, _resizePoints).top.addEventListener("mousedown", __privateGet(this, _resizeEvents).top.down);
          }
          if (document.body.classList.contains("resizing-top")) {
            document.body.classList.remove("resizing-top");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).top.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).top.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).top.hasEvent.up) {
            __privateGet(this, _resizeEvents).top.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).top.up);
          }
          if (__privateGet(this, _resizeEvents).top.hasEvent.move) {
            __privateGet(this, _resizeEvents).top.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).top.move);
          }
          if (__privateGet(this, _resizeEvents).top.hasEvent.down) {
            __privateGet(this, _resizeEvents).top.hasEvent.down = false;
            __privateGet(this, _resizePoints).top.removeEventListener("mousedown", __privateGet(this, _resizeEvents).top.down);
          }
          if (document.body.classList.contains("resizing-top")) {
            document.body.classList.remove("resizing-top");
          }
        }
      },
      topLeft: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "topLeft");
          if (__privateGet(this, _resizeEvents).topLeft.hasEvent.down) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.down = false;
            __privateGet(this, _resizePoints).topLeft.removeEventListener("mousedown", __privateGet(this, _resizeEvents).topLeft.down);
          }
          if (!document.body.classList.contains("resizing-topLeft")) {
            document.body.classList.add("resizing-topLeft");
          }
          if (!__privateGet(this, _resizeEvents).topLeft.hasEvent.up) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).topLeft.up);
          }
          if (!__privateGet(this, _resizeEvents).topLeft.hasEvent.move) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).topLeft.move);
          }
        },
        move: (e2) => {
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          if (__privateGet(this, _aspectRatioScaling)) {
            if (diffX > diffY) {
              let prevHeight = __privateGet(this, _size).height + 0;
              this.size = { width: __privateGet(this, _size).width + diffX, height: (__privateGet(this, _size).width + diffX) * __privateGet(this, _aspectRatio_wh) };
              diffY = this.size.height - prevHeight;
            } else {
              let prevWidth = __privateGet(this, _size).width + 0;
              this.size = { width: (__privateGet(this, _size).height + diffY) * __privateGet(this, _aspectRatio_hw), height: __privateGet(this, _size).height + diffY };
              diffX = this.size.width - prevWidth;
            }
          } else {
            this.size = { width: __privateGet(this, _size).width + diffX, height: __privateGet(this, _size).height + diffY };
          }
          this.pos = { x: __privateGet(this, _pos).x - diffX, y: __privateGet(this, _pos).y - diffY };
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).topLeft.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).topLeft.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).topLeft.hasEvent.up) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).topLeft.up);
          }
          if (__privateGet(this, _resizeEvents).topLeft.hasEvent.move) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).topLeft.move);
          }
          if (!__privateGet(this, _resizeEvents).topLeft.hasEvent.down) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.down = true;
            __privateGet(this, _resizePoints).topLeft.addEventListener("mousedown", __privateGet(this, _resizeEvents).topLeft.down);
          }
          if (document.body.classList.contains("resizing-topLeft")) {
            document.body.classList.remove("resizing-topLeft");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).topLeft.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).topLeft.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).topLeft.hasEvent.up) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).topLeft.up);
          }
          if (__privateGet(this, _resizeEvents).topLeft.hasEvent.move) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).topLeft.move);
          }
          if (__privateGet(this, _resizeEvents).topLeft.hasEvent.down) {
            __privateGet(this, _resizeEvents).topLeft.hasEvent.down = false;
            __privateGet(this, _resizePoints).topLeft.removeEventListener("mousedown", __privateGet(this, _resizeEvents).topLeft.down);
          }
          if (document.body.classList.contains("resizing-topLeft")) {
            document.body.classList.remove("resizing-topLeft");
          }
        }
      },
      topRight: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "topRight");
          if (__privateGet(this, _resizeEvents).topRight.hasEvent.down) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.down = false;
            __privateGet(this, _resizePoints).topRight.removeEventListener("mousedown", __privateGet(this, _resizeEvents).topRight.down);
          }
          if (!document.body.classList.contains("resizing-topRight")) {
            document.body.classList.add("resizing-topRight");
          }
          if (!__privateGet(this, _resizeEvents).topRight.hasEvent.up) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).topRight.up);
          }
          if (!__privateGet(this, _resizeEvents).topRight.hasEvent.move) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).topRight.move);
          }
        },
        move: (e2) => {
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          if (__privateGet(this, _aspectRatioScaling)) {
            if (diffX > diffY) {
              let prevHeight = __privateGet(this, _size).height + 0;
              this.size = { width: __privateGet(this, _size).width - diffX, height: (__privateGet(this, _size).width - diffX) * __privateGet(this, _aspectRatio_wh) };
              diffY = this.size.height - prevHeight;
            } else {
              let prevWidth = __privateGet(this, _size).width + 0;
              this.size = { width: (__privateGet(this, _size).height + diffY) * __privateGet(this, _aspectRatio_hw), height: __privateGet(this, _size).height + diffY };
              diffX = this.size.width - prevWidth;
            }
          } else {
            this.size = { width: __privateGet(this, _size).width - diffX, height: __privateGet(this, _size).height + diffY };
          }
          this.pos = { x: __privateGet(this, _pos).x, y: __privateGet(this, _pos).y - diffY };
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).topRight.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).topRight.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).topRight.hasEvent.up) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).topRight.up);
          }
          if (__privateGet(this, _resizeEvents).topRight.hasEvent.move) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).topRight.move);
          }
          if (!__privateGet(this, _resizeEvents).topRight.hasEvent.down) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.down = true;
            __privateGet(this, _resizePoints).topRight.addEventListener("mousedown", __privateGet(this, _resizeEvents).topRight.down);
          }
          if (document.body.classList.contains("resizing-topRight")) {
            document.body.classList.remove("resizing-topRight");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).topRight.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).topRight.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).topRight.hasEvent.up) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).topRight.up);
          }
          if (__privateGet(this, _resizeEvents).topRight.hasEvent.move) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).topRight.move);
          }
          if (__privateGet(this, _resizeEvents).topRight.hasEvent.down) {
            __privateGet(this, _resizeEvents).topRight.hasEvent.down = false;
            __privateGet(this, _resizePoints).topRight.removeEventListener("mousedown", __privateGet(this, _resizeEvents).topRight.down);
          }
          if (document.body.classList.contains("resizing-topRight")) {
            document.body.classList.remove("resizing-topRight");
          }
        }
      },
      left: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "left");
          if (__privateGet(this, _resizeEvents).left.hasEvent.down) {
            __privateGet(this, _resizeEvents).left.hasEvent.down = false;
            __privateGet(this, _resizePoints).left.removeEventListener("mousedown", __privateGet(this, _resizeEvents).left.down);
          }
          if (!document.body.classList.contains("resizing-left")) {
            document.body.classList.add("resizing-left");
          }
          if (!__privateGet(this, _resizeEvents).left.hasEvent.up) {
            __privateGet(this, _resizeEvents).left.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).left.up);
          }
          if (!__privateGet(this, _resizeEvents).left.hasEvent.move) {
            __privateGet(this, _resizeEvents).left.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).left.move);
          }
        },
        move: (e2) => {
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          if (__privateGet(this, _aspectRatioScaling)) {
            this.size = { height: (__privateGet(this, _size).width + diffX) * __privateGet(this, _aspectRatio_wh), width: __privateGet(this, _size).width + diffX };
          } else {
            this.size = { height: __privateGet(this, _size).height, width: __privateGet(this, _size).width + diffX };
          }
          this.pos = { y: __privateGet(this, _pos).y, x: __privateGet(this, _pos).x - diffX };
          __privateGet(this, _mouseEventPos).x = e2.clientX;
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).left.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).left.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).left.hasEvent.up) {
            __privateGet(this, _resizeEvents).left.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).left.up);
          }
          if (__privateGet(this, _resizeEvents).left.hasEvent.move) {
            __privateGet(this, _resizeEvents).left.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).left.move);
          }
          if (!__privateGet(this, _resizeEvents).left.hasEvent.down) {
            __privateGet(this, _resizeEvents).left.hasEvent.down = true;
            __privateGet(this, _resizePoints).left.addEventListener("mousedown", __privateGet(this, _resizeEvents).left.down);
          }
          if (document.body.classList.contains("resizing-left")) {
            document.body.classList.remove("resizing-left");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).left.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).left.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).left.hasEvent.up) {
            __privateGet(this, _resizeEvents).left.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).left.up);
          }
          if (__privateGet(this, _resizeEvents).left.hasEvent.move) {
            __privateGet(this, _resizeEvents).left.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).left.move);
          }
          if (__privateGet(this, _resizeEvents).left.hasEvent.down) {
            __privateGet(this, _resizeEvents).left.hasEvent.down = false;
            __privateGet(this, _resizePoints).left.removeEventListener("mousedown", __privateGet(this, _resizeEvents).left.down);
          }
          if (document.body.classList.contains("resizing-left")) {
            document.body.classList.remove("resizing-left");
          }
        }
      },
      right: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "right");
          if (__privateGet(this, _resizeEvents).right.hasEvent.down) {
            __privateGet(this, _resizeEvents).right.hasEvent.down = false;
            __privateGet(this, _resizePoints).right.removeEventListener("mousedown", __privateGet(this, _resizeEvents).right.down);
          }
          if (!document.body.classList.contains("resizing-right")) {
            document.body.classList.add("resizing-right");
          }
          if (!__privateGet(this, _resizeEvents).right.hasEvent.up) {
            __privateGet(this, _resizeEvents).right.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).right.up);
          }
          if (!__privateGet(this, _resizeEvents).right.hasEvent.move) {
            __privateGet(this, _resizeEvents).right.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).right.move);
          }
        },
        move: (e2) => {
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          if (__privateGet(this, _aspectRatioScaling)) {
            this.size = { height: (__privateGet(this, _size).width - diffX) * __privateGet(this, _aspectRatio_wh), width: __privateGet(this, _size).width - diffX };
          } else {
            this.size = { height: __privateGet(this, _size).height, width: __privateGet(this, _size).width - diffX };
          }
          __privateGet(this, _mouseEventPos).x = e2.clientX;
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).right.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).right.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).right.hasEvent.up) {
            __privateGet(this, _resizeEvents).right.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).right.up);
          }
          if (__privateGet(this, _resizeEvents).right.hasEvent.move) {
            __privateGet(this, _resizeEvents).right.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).right.move);
          }
          if (!__privateGet(this, _resizeEvents).right.hasEvent.down) {
            __privateGet(this, _resizeEvents).right.hasEvent.down = true;
            __privateGet(this, _resizePoints).right.addEventListener("mousedown", __privateGet(this, _resizeEvents).right.down);
          }
          if (document.body.classList.contains("resizing-right")) {
            document.body.classList.remove("resizing-right");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).right.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).right.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).right.hasEvent.up) {
            __privateGet(this, _resizeEvents).right.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).right.up);
          }
          if (__privateGet(this, _resizeEvents).right.hasEvent.move) {
            __privateGet(this, _resizeEvents).right.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).right.move);
          }
          if (__privateGet(this, _resizeEvents).right.hasEvent.down) {
            __privateGet(this, _resizeEvents).right.hasEvent.down = false;
            __privateGet(this, _resizePoints).right.removeEventListener("mousedown", __privateGet(this, _resizeEvents).right.down);
          }
          if (document.body.classList.contains("resizing-right")) {
            document.body.classList.remove("resizing-right");
          }
        }
      },
      bottom: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "bottom");
          if (__privateGet(this, _resizeEvents).bottom.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.down = false;
            __privateGet(this, _resizePoints).bottom.removeEventListener("mousedown", __privateGet(this, _resizeEvents).bottom.down);
          }
          if (!document.body.classList.contains("resizing-bottom")) {
            document.body.classList.add("resizing-bottom");
          }
          if (!__privateGet(this, _resizeEvents).bottom.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).bottom.up);
          }
          if (!__privateGet(this, _resizeEvents).bottom.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).bottom.move);
          }
        },
        move: (e2) => {
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          if (__privateGet(this, _aspectRatioScaling)) {
            this.size = { width: (__privateGet(this, _size).height - diffY) * __privateGet(this, _aspectRatio_hw), height: __privateGet(this, _size).height - diffY };
          } else {
            this.size = { width: __privateGet(this, _size).width, height: __privateGet(this, _size).height - diffY };
          }
          __privateGet(this, _mouseEventPos).y = e2.clientY;
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).bottom.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).bottom.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).bottom.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).bottom.up);
          }
          if (__privateGet(this, _resizeEvents).bottom.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).bottom.move);
          }
          if (!__privateGet(this, _resizeEvents).bottom.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.down = true;
            __privateGet(this, _resizePoints).bottom.addEventListener("mousedown", __privateGet(this, _resizeEvents).bottom.down);
          }
          if (document.body.classList.contains("resizing-bottom")) {
            document.body.classList.remove("resizing-bottom");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).bottom.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).bottom.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).bottom.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).bottom.up);
          }
          if (__privateGet(this, _resizeEvents).bottom.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).bottom.move);
          }
          if (__privateGet(this, _resizeEvents).bottom.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottom.hasEvent.down = false;
            __privateGet(this, _resizePoints).bottom.removeEventListener("mousedown", __privateGet(this, _resizeEvents).bottom.down);
          }
          if (document.body.classList.contains("resizing-bottom")) {
            document.body.classList.remove("resizing-bottom");
          }
        }
      },
      bottomRight: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "bottomRight");
          if (__privateGet(this, _resizeEvents).bottomRight.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.down = false;
            __privateGet(this, _resizePoints).bottomRight.removeEventListener("mousedown", __privateGet(this, _resizeEvents).bottomRight.down);
          }
          if (!document.body.classList.contains("resizing-bottomRight")) {
            document.body.classList.add("resizing-bottomRight");
          }
          if (!__privateGet(this, _resizeEvents).bottomRight.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).bottomRight.up);
          }
          if (!__privateGet(this, _resizeEvents).bottomRight.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).bottomRight.move);
          }
        },
        move: (e2) => {
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          if (__privateGet(this, _aspectRatioScaling)) {
            if (diffX > diffY) {
              let prevHeight = __privateGet(this, _size).height + 0;
              this.size = { width: __privateGet(this, _size).width - diffX, height: (__privateGet(this, _size).width - diffX) * __privateGet(this, _aspectRatio_wh) };
              diffY = this.size.height - prevHeight;
            } else {
              let prevWidth = __privateGet(this, _size).width + 0;
              this.size = { width: (__privateGet(this, _size).height - diffY) * __privateGet(this, _aspectRatio_hw), height: __privateGet(this, _size).height - diffY };
              diffX = this.size.width - prevWidth;
            }
          } else {
            this.size = { width: __privateGet(this, _size).width - diffX, height: __privateGet(this, _size).height - diffY };
          }
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).bottomRight.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).bottomRight.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).bottomRight.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).bottomRight.up);
          }
          if (__privateGet(this, _resizeEvents).bottomRight.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).bottomRight.move);
          }
          if (!__privateGet(this, _resizeEvents).bottomRight.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.down = true;
            __privateGet(this, _resizePoints).bottomRight.addEventListener("mousedown", __privateGet(this, _resizeEvents).bottomRight.down);
          }
          if (document.body.classList.contains("resizing-bottomRight")) {
            document.body.classList.remove("resizing-bottomRight");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).bottomRight.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).bottomRight.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).bottomRight.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).bottomRight.up);
          }
          if (__privateGet(this, _resizeEvents).bottomRight.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).bottomRight.move);
          }
          if (__privateGet(this, _resizeEvents).bottomRight.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottomRight.hasEvent.down = false;
            __privateGet(this, _resizePoints).bottomRight.removeEventListener("mousedown", __privateGet(this, _resizeEvents).bottomRight.down);
          }
          if (document.body.classList.contains("resizing-bottomRight")) {
            document.body.classList.remove("resizing-bottomRight");
          }
        }
      },
      bottomLeft: {
        hasEvent: { up: false, down: false, move: false },
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).disable();
          }
          __privateGet(this, _disableResizeButtons).call(this, "bottomLeft");
          if (__privateGet(this, _resizeEvents).bottomLeft.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.down = false;
            __privateGet(this, _resizePoints).bottomLeft.removeEventListener("mousedown", __privateGet(this, _resizeEvents).bottomLeft.down);
          }
          if (!document.body.classList.contains("resizing-bottomLeft")) {
            document.body.classList.add("resizing-bottomLeft");
          }
          if (!__privateGet(this, _resizeEvents).bottomLeft.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _resizeEvents).bottomLeft.up);
          }
          if (!__privateGet(this, _resizeEvents).bottomLeft.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _resizeEvents).bottomLeft.move);
          }
        },
        move: (e2) => {
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          if (__privateGet(this, _aspectRatioScaling)) {
            if (diffX > diffY) {
              let prevHeight = __privateGet(this, _size).height + 0;
              this.size = { width: __privateGet(this, _size).width + diffX, height: (__privateGet(this, _size).width + diffX) * __privateGet(this, _aspectRatio_wh) };
              diffY = this.size.height - prevHeight;
            } else {
              let prevWidth = __privateGet(this, _size).width + 0;
              this.size = { width: (__privateGet(this, _size).height - diffY) * __privateGet(this, _aspectRatio_hw), height: __privateGet(this, _size).height - diffY };
              diffX = this.size.width - prevWidth;
            }
          } else {
            this.size = { width: __privateGet(this, _size).width + diffX, height: __privateGet(this, _size).height - diffY };
          }
          this.pos = { x: __privateGet(this, _pos).x - diffX, y: __privateGet(this, _pos).y };
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        },
        enable: () => {
          if (__privateGet(this, _resizePoints).bottomLeft.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).bottomLeft.classList.remove("disabled");
          }
          if (__privateGet(this, _resizeEvents).bottomLeft.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).bottomLeft.up);
          }
          if (__privateGet(this, _resizeEvents).bottomLeft.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).bottomLeft.move);
          }
          if (!__privateGet(this, _resizeEvents).bottomLeft.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.down = true;
            __privateGet(this, _resizePoints).bottomLeft.addEventListener("mousedown", __privateGet(this, _resizeEvents).bottomLeft.down);
          }
          if (document.body.classList.contains("resizing-bottomLeft")) {
            document.body.classList.remove("resizing-bottomLeft");
          }
        },
        disable: () => {
          if (!__privateGet(this, _resizePoints).bottomLeft.classList.contains("disabled")) {
            __privateGet(this, _resizePoints).bottomLeft.classList.add("disabled");
          }
          if (__privateGet(this, _resizeEvents).bottomLeft.hasEvent.up) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.up = false;
            document.body.removeEventListener("mouseup", __privateGet(this, _resizeEvents).bottomLeft.up);
          }
          if (__privateGet(this, _resizeEvents).bottomLeft.hasEvent.move) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.move = false;
            document.body.removeEventListener("mousemove", __privateGet(this, _resizeEvents).bottomLeft.move);
          }
          if (__privateGet(this, _resizeEvents).bottomLeft.hasEvent.down) {
            __privateGet(this, _resizeEvents).bottomLeft.hasEvent.down = false;
            __privateGet(this, _resizePoints).bottomLeft.removeEventListener("mousedown", __privateGet(this, _resizeEvents).bottomLeft.down);
          }
          if (document.body.classList.contains("resizing-bottomLeft")) {
            document.body.classList.remove("resizing-bottomLeft");
          }
        }
      }
    });
    /** @type {{top: HTMLElement, topLeft: HTMLElement, topRight: HTMLElement, left: HTMLElement, right: HTMLElement, bottom: HTMLElement, bottomRight: HTMLElement, bottomLeft: HTMLElement}} */
    __privateAdd(this, _resizePoints);
    /** @returns {{top: HTMLElement, topLeft: HTMLElement, topRight: HTMLElement, left: HTMLElement, right: HTMLElement, bottom: HTMLElement, bottomRight: HTMLElement, bottomLeft: HTMLElement}} */
    __privateAdd(this, _createResizePoints, () => {
      let el = {
        top: Utils.createHTMLElement("div", ["resizePoint", "top"]),
        topLeft: Utils.createHTMLElement("div", ["resizePoint", "topLeft"]),
        topRight: Utils.createHTMLElement("div", ["resizePoint", "topRight"]),
        left: Utils.createHTMLElement("div", ["resizePoint", "left"]),
        right: Utils.createHTMLElement("div", ["resizePoint", "right"]),
        bottom: Utils.createHTMLElement("div", ["resizePoint", "bottom"]),
        bottomRight: Utils.createHTMLElement("div", ["resizePoint", "bottomRight"]),
        bottomLeft: Utils.createHTMLElement("div", ["resizePoint", "bottomLeft"])
      };
      return el;
    });
    /** @type {{el: HTMLElement, hasEvent: {down: Boolean, up: Boolean, move: Boolean}, enable: () => void, disable: () => void, funcs: {down: (e:MouseEvent) => void, up: (e:MouseEvent) => void, move: (e:MouseEvent) => void}}} */
    __privateAdd(this, _movePoint, {
      el: Utils.createHTMLElement("div", ["movePoint"]),
      hasEvent: { down: false, up: false, move: false },
      funcs: {
        down: (e2) => {
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
          if (!document.body.classList.contains("windowMoving")) {
            document.body.classList.add("windowMoving");
          }
          __privateGet(this, _disableResizeButtons).call(this);
          if (__privateGet(this, _movePoint).hasEvent.down) {
            __privateGet(this, _movePoint).hasEvent.down = false;
            __privateGet(this, _movePoint).el.removeEventListener("mousedown", __privateGet(this, _movePoint).funcs.down);
          }
          if (!__privateGet(this, _movePoint).hasEvent.up) {
            __privateGet(this, _movePoint).hasEvent.up = true;
            document.body.addEventListener("mouseup", __privateGet(this, _movePoint).funcs.up);
          }
          if (!__privateGet(this, _movePoint).hasEvent.move) {
            __privateGet(this, _movePoint).hasEvent.move = true;
            document.body.addEventListener("mousemove", __privateGet(this, _movePoint).funcs.move);
          }
        },
        move: (e2) => {
          let diffX = __privateGet(this, _mouseEventPos).x - e2.clientX;
          let diffY = __privateGet(this, _mouseEventPos).y - e2.clientY;
          this.pos = { x: __privateGet(this, _pos).x - diffX, y: __privateGet(this, _pos).y - diffY };
          __privateSet(this, _mouseEventPos, { x: e2.clientX, y: e2.clientY });
        },
        up: (e2) => {
          if (__privateGet(this, _behaviourConfig).move) {
            __privateGet(this, _movePoint).enable();
          }
          __privateGet(this, _enableResizeButtons).call(this);
        }
      },
      enable: () => {
        if (__privateGet(this, _movePoint).el.classList.contains("disabled")) {
          __privateGet(this, _movePoint).el.classList.remove("disabled");
        }
        if (__privateGet(this, _movePoint).hasEvent.up) {
          __privateGet(this, _movePoint).hasEvent.up = false;
          document.body.removeEventListener("mouseup", __privateGet(this, _movePoint).funcs.up);
        }
        if (__privateGet(this, _movePoint).hasEvent.move) {
          __privateGet(this, _movePoint).hasEvent.move = false;
          document.body.removeEventListener("mousemove", __privateGet(this, _movePoint).funcs.move);
        }
        if (!__privateGet(this, _movePoint).hasEvent.down) {
          __privateGet(this, _movePoint).hasEvent.down = true;
          __privateGet(this, _movePoint).el.addEventListener("mousedown", __privateGet(this, _movePoint).funcs.down);
        }
        if (document.body.classList.contains("windowMoving")) {
          document.body.classList.remove("windowMoving");
        }
      },
      disable: () => {
        if (!__privateGet(this, _movePoint).el.classList.contains("disabled")) {
          __privateGet(this, _movePoint).el.classList.add("disabled");
        }
        if (__privateGet(this, _movePoint).hasEvent.up) {
          __privateGet(this, _movePoint).hasEvent.up = false;
          document.body.removeEventListener("mouseup", __privateGet(this, _movePoint).funcs.up);
        }
        if (__privateGet(this, _movePoint).hasEvent.move) {
          __privateGet(this, _movePoint).hasEvent.move = false;
          document.body.removeEventListener("mousemove", __privateGet(this, _movePoint).funcs.move);
        }
        if (__privateGet(this, _movePoint).hasEvent.down) {
          __privateGet(this, _movePoint).hasEvent.down = false;
          __privateGet(this, _movePoint).el.removeEventListener("mousedown", __privateGet(this, _movePoint).funcs.down);
        }
        if (document.body.classList.contains("windowMoving")) {
          document.body.classList.remove("windowMoving");
        }
      }
    });
    /** @type {String} */
    __privateAdd(this, _id);
    /** @type {String} */
    __privateAdd(this, _name, "");
    /** @type {String} */
    __privateAdd(this, _type, "none");
    /** @type {String} */
    __privateAdd(this, _icon, "");
    /** @type {String} */
    __privateAdd(this, _desc, "");
    /** @param {null|"top"|"topLeft"|"topRight"|"left"|"top"|"right"|"bottom"|"bottomRight"|"bottomLeft"} [skip=null] */
    __privateAdd(this, _disableResizeButtons, (skip = null) => {
      if (__privateGet(this, _behaviourConfig).resize) {
        Object.keys(__privateGet(this, _resizeEvents)).forEach((key) => {
          if (key !== skip) {
            __privateGet(this, _resizeEvents)[key].disable();
          }
        });
      }
    });
    /** @param {null|"top"|"topLeft"|"topRight"|"left"|"top"|"right"|"bottom"|"bottomRight"|"bottomLeft"} [skip=null] */
    __privateAdd(this, _enableResizeButtons, (skip = null) => {
      if (__privateGet(this, _behaviourConfig).resize) {
        Object.keys(__privateGet(this, _resizeEvents)).forEach((key) => {
          if (key !== skip) {
            __privateGet(this, _resizeEvents)[key].enable();
          }
        });
      }
    });
    /** @type {Boolean} */
    __privateAdd(this, _isFullscreen, false);
    /** @type {{onClose: () => Promise<*>, onFullscreen: () => Promise<*>}} */
    __privateAdd(this, _userFuncs, { onClose: () => {
      return new Promise((res) => {
        res(null);
      });
    }, onFullscreen: () => {
      return new Promise((res) => {
        res(null);
      });
    } });
    /** @type {{handleClick_close: Boolean, handleClick_fullscreen_on: Boolean, handleClick_fullscreen_off: Boolean, handleClick_minimize: Boolean}} */
    __privateAdd(this, _buttonsFuncsStatus, { handleClick_close: false, handleClick_fullscreen_off: false, handleClick_fullscreen_on: false, handleClick_minimize: false });
    /** @type {{handleClick_close: () => void, handleClick_fullscreen_on: () => void, handleClick_fullscreen_off: () => void, handleClick_minimize: () => void}} */
    __privateAdd(this, _buttonsFuncs, {
      handleClick_close: async () => {
        if (!__privateGet(this, _window).classList.contains("closing")) {
          __privateGet(this, _window).classList.add("closing");
        }
        __privateGet(this, _disableResizeButtons).call(this);
        if (__privateGet(this, _behaviourConfig).move) {
          __privateGet(this, _movePoint).disable();
        }
        let waitTime = Utils.getTransitionTime([__privateGet(this, _window)]);
        await __privateGet(this, _userFuncs).onClose();
        setTimeout(() => {
          __privateGet(this, _window).remove();
        }, waitTime);
      },
      handleClick_fullscreen_off: () => {
        this.isFullscreen = false;
      },
      handleClick_fullscreen_on: () => {
        this.isFullscreen = true;
      },
      handleClick_minimize: () => {
      }
    });
    /** @type {Boolean} */
    __privateAdd(this, _aspectRatioScaling, false);
    /** @type {Number} */
    __privateAdd(this, _aspectRatio_wh, 1);
    /** @type {Number} */
    __privateAdd(this, _aspectRatio_hw, 1);
    /** @type {{close: {el: HTMLButtonElement, disable: () => void, enable: () => void}, fullscreen: {el: HTMLButtonElement, disable: () => void, enable: () => void}, minimize:{el: HTMLButtonElement, disable: () => void, enable: () => void}}} */
    __publicField(this, "buttons");
    /** @type {HTMLElement} */
    __publicField(this, "content");
    /**
     * 
     * @param {{x: Number, y:Number}} pos 
     * @param {Boolean} [animation=true]
     * @returns {Promise<Null>}
     */
    __publicField(this, "move", (pos, animation = true) => {
      return new Promise((res) => {
        if (!__privateGet(this, _isFullscreen)) {
          if (animation) {
            __privateGet(this, _disableResizeButtons).call(this);
            if (__privateGet(this, _behaviourConfig).move) {
              __privateGet(this, _movePoint).disable();
            }
            if (!__privateGet(this, _window).classList.contains("moving")) {
              __privateGet(this, _window).classList.add("moving");
            }
            let waitTime = Utils.getTransitionTime(__privateGet(this, _window));
            this.pos = pos;
            setTimeout(() => {
              if (__privateGet(this, _window).classList.contains("moving")) {
                __privateGet(this, _window).classList.remove("moving");
              }
              __privateGet(this, _enableResizeButtons).call(this);
              if (__privateGet(this, _behaviourConfig).move) {
                __privateGet(this, _movePoint).enable();
              }
              res(null);
            }, waitTime);
          } else {
            this.pos = pos;
            res(null);
          }
        } else {
          __privateSet(this, _pos, pos);
          res(null);
        }
      });
    });
    /**
     * 
     * @param {{width: Number, height:Number}} size 
     * @param {Boolean} [animation=true]
     * @returns {Promise<Null>}
     */
    __publicField(this, "resize", (size, animation = true) => {
      return new Promise((res) => {
        if (!__privateGet(this, _isFullscreen)) {
          if (animation) {
            __privateGet(this, _disableResizeButtons).call(this);
            if (!__privateGet(this, _window).classList.contains("resizing")) {
              __privateGet(this, _window).classList.add("resizing");
            }
            let waitTime = Utils.getTransitionTime(__privateGet(this, _window));
            this.size = size;
            setTimeout(() => {
              if (__privateGet(this, _window).classList.contains("resizing")) {
                __privateGet(this, _window).classList.remove("resizing");
              }
              __privateGet(this, _enableResizeButtons).call(this);
              if (__privateGet(this, _behaviourConfig).move) {
                __privateGet(this, _movePoint).enable();
              }
              res(null);
            }, waitTime);
          } else {
            this.size = size;
            res(null);
          }
        } else {
          __privateSet(this, _size, size);
          res(null);
        }
      });
    });
    let windowClassNames = ["window"];
    if (config.className) {
      if (typeof config.className == "string") {
        if (!windowClassNames.includes(config.className)) {
          windowClassNames.push(config.className);
        }
      } else if (Array.isArray(config.className)) {
        config.className.forEach((className) => {
          if (!windowClassNames.includes(className)) {
            windowClassNames.push(className);
          }
        });
      }
    }
    __privateSet(this, _id, Utils.makeId(10, "unnamedWindow-"));
    if (config.type) {
      __privateSet(this, _type, config.type);
    }
    if (config.id) {
      __privateSet(this, _id, `${config.id}`);
      __privateSet(this, _name, `${__privateGet(this, _id)}`);
    }
    if (config.name) {
      __privateSet(this, _name, config.name);
    }
    if (config.desc) {
      __privateSet(this, _desc, config.desc);
    }
    if (config.icon) {
      __privateSet(this, _icon, config.icon);
    }
    if (config.funcs) {
      if (config.funcs.onClose) {
        __privateGet(this, _userFuncs).onClose = config.funcs.onClose;
      }
      if (config.funcs.onFullscreen) {
        __privateGet(this, _userFuncs).onFullscreen = config.funcs.onFullscreen;
      }
    }
    if (config.size) {
      if (config.size.height !== null) {
        __privateGet(this, _size).height = config.size.height;
      }
      if (config.size.width !== null) {
        __privateGet(this, _size).width = config.size.width;
      }
    }
    let gdc = Utils.gcd(__privateGet(this, _size).width, __privateGet(this, _size).height);
    __privateSet(this, _aspectRatio_hw, __privateGet(this, _size).width / gdc / (__privateGet(this, _size).height / gdc));
    __privateSet(this, _aspectRatio_wh, __privateGet(this, _size).height / gdc / (__privateGet(this, _size).width / gdc));
    if (config.aspectRatioScaling) {
      __privateSet(this, _aspectRatioScaling, true);
    }
    if (config.pos) {
      if (config.pos.x !== null) {
        __privateGet(this, _pos).x = config.pos.x;
      }
      if (config.pos.y !== null) {
        __privateGet(this, _pos).y = config.pos.y;
      }
    }
    if (config.behaviour) {
      if (typeof config.behaviour.close == "boolean") {
        __privateGet(this, _behaviourConfig).close = config.behaviour.close;
      }
      if (typeof config.behaviour.fullscreen == "boolean") {
        __privateGet(this, _behaviourConfig).fullscreen = config.behaviour.fullscreen;
      }
      if (typeof config.behaviour.minimize == "boolean") {
        __privateGet(this, _behaviourConfig).minimize = config.behaviour.minimize;
      }
      if (typeof config.behaviour.resize == "boolean") {
        __privateGet(this, _behaviourConfig).resize = config.behaviour.resize;
      }
      if (typeof config.behaviour.move == "boolean") {
        __privateGet(this, _behaviourConfig).move = config.behaviour.move;
      }
    }
    __privateSet(this, _window, Utils.createHTMLElement("section", windowClassNames, { attibutes: { "id": __privateGet(this, _id) }, css: { "position": "absolute", "left": `${this.pos.x}px`, "top": `${this.pos.y}px`, "width": `${this.size.width}px`, "height": `${this.size.height}px` } }));
    __privateSet(this, _container, Utils.createAndAppendHTMLElement(__privateGet(this, _window), "div", ["container"]));
    __privateSet(this, _resizeContainer, Utils.createAndAppendHTMLElement(__privateGet(this, _window), "div", ["resizers"]));
    __privateSet(this, _header, Utils.createAndAppendHTMLElement(__privateGet(this, _container), "header"));
    __privateSet(this, _headerInfo, Utils.createAndAppendHTMLElement(__privateGet(this, _header), "div", ["info"]));
    if (__privateGet(this, _icon).trim() !== "") {
      __privateSet(this, _iconElement, Utils.createAndAppendHTMLElement(__privateGet(this, _headerInfo), "div", ["icon"], { css: { "--icon": `url('${__privateGet(this, _icon)}')` } }));
    } else {
      __privateSet(this, _iconElement, Utils.createAndAppendHTMLElement(__privateGet(this, _headerInfo), "div", ["icon", "empty"]));
    }
    __privateSet(this, _nameElement, Utils.createAndAppendHTMLElement(__privateGet(this, _headerInfo), "h1", ["name"], {}, __privateGet(this, _name)));
    if (__privateGet(this, _name).trim() == "") {
      if (!__privateGet(this, _nameElement).classList.contains("empty")) {
        __privateGet(this, _nameElement).classList.add("empty");
      }
    } else {
      if (__privateGet(this, _nameElement).classList.contains("empty")) {
        __privateGet(this, _nameElement).classList.remove("empty");
      }
    }
    if (__privateGet(this, _desc).length <= 10) {
      __privateSet(this, _descElement, Utils.createAndAppendHTMLElement(__privateGet(this, _headerInfo), "h2", ["desc"], {}, __privateGet(this, _desc)));
      if (__privateGet(this, _desc).trim() == "") {
        if (!__privateGet(this, _descElement).classList.contains("empty")) {
          __privateGet(this, _descElement).classList.add("empty");
        }
      } else {
        if (__privateGet(this, _descElement).classList.contains("empty")) {
          __privateGet(this, _descElement).classList.remove("empty");
        }
      }
    } else {
      __privateSet(this, _descElement, Utils.createAndAppendHTMLElement(__privateGet(this, _headerInfo), "h2", ["desc"], {}, `${__privateGet(this, _desc).slice(0, 10)}...`));
      if (__privateGet(this, _descElement).classList.contains("empty")) {
        __privateGet(this, _descElement).classList.remove("empty");
      }
    }
    __privateSet(this, _buttons, Utils.createAndAppendHTMLElement(__privateGet(this, _header), "div", ["buttons"]));
    this.buttons = {
      minimize: {
        el: Utils.createHTMLElement("button", ["minimize"], {}, '<div class="face"></div>'),
        disable: () => {
          if (!this.buttons.minimize.el.classList.contains("disabled")) {
            this.buttons.minimize.el.classList.add("disabled");
          }
          if (__privateGet(this, _buttonsFuncsStatus).handleClick_close) {
            __privateGet(this, _buttonsFuncsStatus).handleClick_close = false;
            this.buttons.minimize.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_minimize);
          }
        },
        enable: () => {
          if (this.buttons.minimize.el.classList.contains("disabled")) {
            this.buttons.minimize.el.classList.remove("disabled");
          }
          if (!__privateGet(this, _buttonsFuncsStatus).handleClick_close) {
            __privateGet(this, _buttonsFuncsStatus).handleClick_close = true;
            this.buttons.minimize.el.addEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_minimize);
          }
        }
      },
      fullscreen: {
        el: Utils.createHTMLElement("button", ["fullscreen"], {}, '<div class="face"></div>'),
        disable: () => {
          if (!this.buttons.fullscreen.el.classList.contains("disabled")) {
            this.buttons.fullscreen.el.classList.add("disabled");
          }
          if (__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off) {
            __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off = false;
            this.buttons.fullscreen.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_off);
          }
          if (__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on) {
            __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on = false;
            this.buttons.fullscreen.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_on);
          }
        },
        enable: () => {
          if (this.buttons.fullscreen.el.classList.contains("disabled")) {
            this.buttons.fullscreen.el.classList.remove("disabled");
          }
          if (__privateGet(this, _isFullscreen)) {
            if (__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on) {
              __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on = false;
              this.buttons.fullscreen.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_on);
            }
            if (!__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off) {
              __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off = true;
              this.buttons.fullscreen.el.addEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_off);
            }
          } else {
            if (__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off) {
              __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off = false;
              this.buttons.fullscreen.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_off);
            }
            if (!__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on) {
              __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on = true;
              this.buttons.fullscreen.el.addEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_on);
            }
          }
        }
      },
      close: {
        el: Utils.createHTMLElement("button", ["close"], {}, '<div class="face"></div>'),
        disable: () => {
          if (!this.buttons.close.el.classList.contains("disabled")) {
            this.buttons.close.el.classList.add("disabled");
          }
          if (__privateGet(this, _buttonsFuncsStatus).handleClick_close) {
            __privateGet(this, _buttonsFuncsStatus).handleClick_close = false;
            this.buttons.close.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_close);
          }
        },
        enable: () => {
          if (this.buttons.close.el.classList.contains("disabled")) {
            this.buttons.close.el.classList.remove("disabled");
          }
          if (!__privateGet(this, _buttonsFuncsStatus).handleClick_close) {
            __privateGet(this, _buttonsFuncsStatus).handleClick_close = true;
            this.buttons.close.el.addEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_close);
          }
        }
      }
    };
    if (__privateGet(this, _behaviourConfig).minimize) {
      __privateGet(this, _buttons).appendChild(this.buttons.minimize.el);
      this.buttons.minimize.enable();
    }
    if (__privateGet(this, _behaviourConfig).fullscreen) {
      __privateGet(this, _buttons).appendChild(this.buttons.fullscreen.el);
      this.buttons.fullscreen.enable();
    }
    if (__privateGet(this, _behaviourConfig).close) {
      __privateGet(this, _buttons).appendChild(this.buttons.close.el);
      __privateGet(this, _buttonsFuncsStatus).handleClick_close = false;
      this.buttons.close.enable();
    }
    __privateSet(this, _resizePoints, __privateGet(this, _createResizePoints).call(this));
    if (__privateGet(this, _behaviourConfig).resize) {
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).topLeft);
      __privateGet(this, _resizeEvents).topLeft.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).topRight);
      __privateGet(this, _resizeEvents).topRight.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).bottomRight);
      __privateGet(this, _resizeEvents).bottomRight.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).bottomLeft);
      __privateGet(this, _resizeEvents).bottomLeft.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).left);
      __privateGet(this, _resizeEvents).left.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).right);
      __privateGet(this, _resizeEvents).right.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).top);
      __privateGet(this, _resizeEvents).top.enable();
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _resizePoints).bottom);
      __privateGet(this, _resizeEvents).bottom.enable();
    }
    if (__privateGet(this, _behaviourConfig).move) {
      __privateGet(this, _resizeContainer).appendChild(__privateGet(this, _movePoint).el);
      __privateGet(this, _movePoint).enable();
    }
    __privateSet(this, _contentHolder, Utils.createAndAppendHTMLElement(__privateGet(this, _container), "section", ["contentHolder"]));
    if (typeof content == "string" || typeof content == "number") {
      this.content = Utils.createAndAppendHTMLElement(__privateGet(this, _contentHolder), "div", ["content"], {}, `${content}`);
    } else if (Utils.isElement(content)) {
      if (!content.classList.contains("content")) {
        content.classList.add("content");
      }
      __privateGet(this, _contentHolder).appendChild(content);
      this.content = content;
    } else {
      let classNames = ["content"];
      if (content.classNames) {
        content.classNames.forEach((className) => {
          if (!classNames.includes(className)) {
            classNames.push(className);
          }
        });
      }
      this.content = Utils.createAndAppendHTMLElement(__privateGet(this, _contentHolder), content.type, classNames, content.params, content.content);
    }
    __privateSet(this, _footer, Utils.createAndAppendHTMLElement(__privateGet(this, _container), "footer"));
    this.focused = true;
  }
  /** @type {{x: Number, y: Number}} */
  get pos() {
    return __privateGet(this, _pos);
  }
  /** @type {{x: Number, y: Number}} */
  set pos(_pos2) {
    __privateSet(this, _pos, _pos2);
    __privateGet(this, _window).style.setProperty("top", `${__privateGet(this, _pos).y}px`);
    __privateGet(this, _window).style.setProperty("left", `${__privateGet(this, _pos).x}px`);
  }
  /** @type {{width: Number, height:Number}} */
  get size() {
    return __privateGet(this, _size);
  }
  /** @type {{width: Number, height: Number}} */
  set size(_size2) {
    __privateSet(this, _size, _size2);
    if (__privateGet(this, _size).width < 0) {
      __privateGet(this, _size).width = 0;
    }
    if (__privateGet(this, _size).height < 0) {
      __privateGet(this, _size).height = 0;
    }
    __privateGet(this, _window).style.setProperty("width", `${__privateGet(this, _size).width}px`);
    __privateGet(this, _window).style.setProperty("height", `${__privateGet(this, _size).height}px`);
  }
  /** @type {HTMLElement} */
  get window() {
    return __privateGet(this, _window);
  }
  get focused() {
    return __privateGet(this, _focused);
  }
  set focused(val) {
    if (val) {
      if (!__privateGet(this, _window).classList.contains("focused")) {
        __privateGet(this, _window).classList.add("focused");
      }
    } else {
      if (__privateGet(this, _window).classList.contains("focused")) {
        __privateGet(this, _window).classList.remove("focused");
      }
    }
    __privateSet(this, _focused, val);
  }
  get id() {
    return __privateGet(this, _id);
  }
  /** @type {String} */
  get name() {
    return __privateGet(this, _name);
  }
  set name(newName) {
    __privateSet(this, _name, newName);
    __privateGet(this, _nameElement).innerHTML = newName;
    if (__privateGet(this, _name).trim() == "") {
      if (!__privateGet(this, _nameElement).classList.contains("empty")) {
        __privateGet(this, _nameElement).classList.add("empty");
      }
    } else {
      if (__privateGet(this, _nameElement).classList.contains("empty")) {
        __privateGet(this, _nameElement).classList.remove("empty");
      }
    }
  }
  /** @type {String} */
  get icon() {
    return __privateGet(this, _icon);
  }
  set icon(newIcon) {
    __privateSet(this, _icon, newIcon);
    if (__privateGet(this, _icon).trim() == "") {
      __privateGet(this, _iconElement).style.removeProperty("--icon");
      if (!__privateGet(this, _iconElement).classList.contains("empty")) {
        __privateGet(this, _iconElement).classList.add("empty");
      }
    } else {
      __privateGet(this, _iconElement).style.setProperty("--icon", `${__privateGet(this, _icon).trim()}`);
      if (__privateGet(this, _iconElement).classList.contains("empty")) {
        __privateGet(this, _iconElement).classList.remove("empty");
      }
    }
  }
  /** @type {String} */
  get desc() {
    return __privateGet(this, _desc);
  }
  set desc(newDesc) {
    __privateSet(this, _desc, newDesc);
    if (__privateGet(this, _desc).length <= 10) {
      __privateGet(this, _descElement).innerHTML = newDesc;
      if (__privateGet(this, _desc).trim() == "") {
        if (!__privateGet(this, _descElement).classList.contains("empty")) {
          __privateGet(this, _descElement).classList.add("empty");
        }
      } else {
        if (__privateGet(this, _descElement).classList.contains("empty")) {
          __privateGet(this, _descElement).classList.remove("empty");
        }
      }
    } else {
      __privateGet(this, _descElement).innerHTML = `${newDesc.slice(0, 10)}...`;
      if (__privateGet(this, _descElement).classList.contains("empty")) {
        __privateGet(this, _descElement).classList.remove("empty");
      }
    }
  }
  /** @type {Boolean} */
  get isFullscreen() {
    return __privateGet(this, _isFullscreen);
  }
  /** @type {Boolean} */
  set isFullscreen(_isFullscreen2) {
    if (_isFullscreen2 == true) {
      if (!__privateGet(this, _window).classList.contains("fullscreen")) {
        __privateGet(this, _window).classList.add("fullscreen");
      }
      if (!this.buttons.fullscreen.el.classList.contains("on")) {
        this.buttons.fullscreen.el.classList.add("on");
      }
      if (__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on) {
        __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on = false;
        this.buttons.fullscreen.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_on);
      }
      if (!__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off) {
        __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off = true;
        this.buttons.fullscreen.el.addEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_off);
      }
      __privateGet(this, _disableResizeButtons).call(this);
      if (__privateGet(this, _behaviourConfig).move) {
        __privateGet(this, _movePoint).disable();
      }
    } else {
      if (__privateGet(this, _window).classList.contains("fullscreen")) {
        __privateGet(this, _window).classList.remove("fullscreen");
      }
      if (!__privateGet(this, _window).classList.contains("fullscreenExit")) {
        __privateGet(this, _window).classList.add("fullscreenExit");
      }
      let waitTime = Utils.getTransitionTime(__privateGet(this, _window));
      setTimeout(() => {
        if (__privateGet(this, _window).classList.contains("fullscreenExit")) {
          __privateGet(this, _window).classList.remove("fullscreenExit");
        }
      }, waitTime);
      if (this.buttons.fullscreen.el.classList.contains("on")) {
        this.buttons.fullscreen.el.classList.remove("on");
      }
      if (__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off) {
        __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_off = false;
        this.buttons.fullscreen.el.removeEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_off);
      }
      if (!__privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on) {
        __privateGet(this, _buttonsFuncsStatus).handleClick_fullscreen_on = true;
        this.buttons.fullscreen.el.addEventListener("click", __privateGet(this, _buttonsFuncs).handleClick_fullscreen_on);
      }
      __privateGet(this, _enableResizeButtons).call(this);
      if (__privateGet(this, _behaviourConfig).move) {
        __privateGet(this, _movePoint).enable();
      }
      this.size = __privateGet(this, _size);
      this.pos = __privateGet(this, _pos);
    }
    __privateSet(this, _isFullscreen, _isFullscreen2);
    __privateGet(this, _userFuncs).onFullscreen();
  }
  /** @type {() => Promise<*>} */
  get onFullscreen() {
    return __privateGet(this, _userFuncs).onFullscreen;
  }
  /** @type {() => Promise<*>} */
  set onFullscreen(val) {
    __privateGet(this, _userFuncs).onFullscreen = val;
  }
  /** @type {() => Promise<*>} */
  get onClose() {
    return __privateGet(this, _userFuncs).onClose;
  }
  /** @type {() => Promise<*>} */
  set onClose(val) {
    __privateGet(this, _userFuncs).onClose = val;
  }
}
_behaviourConfig = new WeakMap();
_pos = new WeakMap();
_size = new WeakMap();
_window = new WeakMap();
_focused = new WeakMap();
_container = new WeakMap();
_resizeContainer = new WeakMap();
_footer = new WeakMap();
_header = new WeakMap();
_headerInfo = new WeakMap();
_buttons = new WeakMap();
_iconElement = new WeakMap();
_nameElement = new WeakMap();
_descElement = new WeakMap();
_contentHolder = new WeakMap();
_mouseEventPos = new WeakMap();
_resizeEvents = new WeakMap();
_resizePoints = new WeakMap();
_createResizePoints = new WeakMap();
_movePoint = new WeakMap();
_id = new WeakMap();
_name = new WeakMap();
_type = new WeakMap();
_icon = new WeakMap();
_desc = new WeakMap();
_disableResizeButtons = new WeakMap();
_enableResizeButtons = new WeakMap();
_isFullscreen = new WeakMap();
_userFuncs = new WeakMap();
_buttonsFuncsStatus = new WeakMap();
_buttonsFuncs = new WeakMap();
_aspectRatioScaling = new WeakMap();
_aspectRatio_wh = new WeakMap();
_aspectRatio_hw = new WeakMap();
const colors = { "color3": { base: "#A2D92B", dark: { "color3-dark-90": "#101604" } }, "color9": { light: { "color9-light-30": "#c46be4" } } };
class SimulationGlobals {
  constructor() {
  }
}
/** @type {Number} */
__publicField(SimulationGlobals, "tickTime", 100);
/** @type {Number} */
__publicField(SimulationGlobals, "fps", 20);
/** @type {Number} */
__publicField(SimulationGlobals, "currentSpeed", 1);
/** @type {Number} */
__publicField(SimulationGlobals, "mapScalingFactor", 16);
/** @type {Number} */
__publicField(SimulationGlobals, "startHumans", 10);
/** @type {Number} */
__publicField(SimulationGlobals, "requiredFactor", 8);
/** @type {Number} */
__publicField(SimulationGlobals, "startHospitalities", 20);
/** @type {Number} */
__publicField(SimulationGlobals, "boredomRatio", 20);
const _Sprite = class _Sprite {
  /**
   * @param {App} app 
   */
  constructor(app) {
    /** @type {SPRITE} */
    __privateAdd(this, _sprite, { size: { width: 1, height: 1 }, data: [[false]] });
    /** @type {App} */
    __privateAdd(this, _app);
    /**
     * @param {String} name 
     * @returns {Promise<Boolean>}
     */
    __publicField(this, "get", (name) => {
      return new Promise(async (res) => {
        const responseSprite = await fetch(`${__privateGet(this, _app).serverUrl}/sprite/${name}`);
        if (responseSprite.status == 200) {
          const jsonSprite = await responseSprite.json();
          if (jsonSprite.data) {
            if (Array.isArray(jsonSprite.data)) {
              if (jsonSprite.data.length > 0) {
                if (Array.isArray(jsonSprite.data[0])) {
                  if (jsonSprite.data[0].length > 0) {
                    __privateSet(this, _sprite, jsonSprite);
                    res(true);
                  } else {
                    res(false);
                  }
                } else {
                  res(false);
                }
              } else {
                res(false);
              }
            } else {
              res(false);
            }
          } else {
            res(false);
          }
        } else {
          res(false);
        }
      });
    });
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x: Number, y: Number}} pos
     * @param {Number} scalingFactor
     * @param {Number} requiredFactor
     * @param {String} color
     */
    __publicField(this, "draw", (ctx, pos, scalingFactor, requiredFactor, color) => {
      _Sprite.draw(ctx, pos, scalingFactor, requiredFactor, __privateGet(this, _sprite), color);
    });
    __privateSet(this, _app, app);
  }
  get width() {
    return __privateGet(this, _sprite).size.width;
  }
  get height() {
    return __privateGet(this, _sprite).size.height;
  }
};
_sprite = new WeakMap();
_app = new WeakMap();
/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {{x: Number, y: Number}} pos 
 * @param {Number} scalingFactor 
 * @param {Number} requiredFactor 
 * @param {SPRITE} sprite
 * @param {String} color
 */
__publicField(_Sprite, "draw", (ctx, pos, scalingFactor, requiredFactor, sprite, color) => {
  let _pos2 = pos;
  let pixel = scalingFactor / requiredFactor;
  ctx.fillStyle = color;
  sprite.data.forEach((column, column_id) => {
    column.forEach((filled, row_id) => {
      if (filled && _pos2.x + column_id * pixel >= 0 && _pos2.y + row_id * pixel >= 0) {
        ctx.fillRect(_pos2.x + column_id * pixel, _pos2.y + row_id * pixel, pixel, pixel);
      }
    });
  });
});
let Sprite = _Sprite;
const localisation = {
  attributes: "Umiejętności",
  statuses: "Statusy",
  attributeNames: {
    social: `społeczne`,
    physical: `fizyczne`,
    intelligence: `umysłowe`
  },
  statusNames: {
    boredom: "poziom nudy"
  },
  infoNames: {
    age: "Wiek",
    gender: "Płeć"
  }
};
const attriburesList = ["physical", "social", "intelligence"];
const statusList = ["boredom"];
class DisplayedHumanStatusWindow {
  /**
   * @param {DisplayedHuman} human 
   */
  constructor(human) {
    /** @type {DisplayedHuman} */
    __publicField(this, "human");
    /** @type {DisplayWindow} */
    __publicField(this, "windowEl");
    /** @type {HTMLElement} */
    __publicField(this, "windowContent");
    /** @type {HTMLElement} */
    __publicField(this, "basicInfoCont");
    /** @type {HTMLElement} */
    __publicField(this, "basicInfoName");
    /** @type {HTMLElement} */
    __publicField(this, "basicInfoAction");
    /** @type {HTMLElement} */
    __publicField(this, "basicInfoSubCont");
    /** @type {{age: INFO_VALUES_AGE, gender: INFO_VALUES}} */
    //@ts-ignore
    __publicField(this, "basicInfoValues", {
      age: {
        cont: Utils.createHTMLElement("div", ["valueCont", "age"]),
        name: Utils.createHTMLElement("h2", ["name"], {}, `${localisation.infoNames.age}:`),
        value: Utils.createHTMLElement("span", ["value"]),
        suffix: Utils.createHTMLElement("span", ["suffix"])
      },
      gender: {
        cont: Utils.createHTMLElement("div", ["valueCont", "gender"]),
        name: Utils.createHTMLElement("h2", ["name"], {}, `${localisation.infoNames.gender}:`),
        value: Utils.createHTMLElement("div", ["genderIcon"])
      }
    });
    /** @type {HTMLElement} */
    __publicField(this, "attributesCont", Utils.createHTMLElement("div", ["attributes"], {}, `<h2>${localisation.attributes}</h2>`));
    /** @type {{[key in keyof HUMAN_ATTRIBUTES]: INFO_VALUES}} */
    //@ts-ignore
    __publicField(this, "attributesValues", {});
    /** @type {HTMLElement} */
    __publicField(this, "statusesCont", Utils.createHTMLElement("div", ["statuses"], {}, `<h2>${localisation.statuses}</h2>`));
    /** @type {{[key in keyof HUMAN_STATUSES]: INFO_VALUES}} */
    //@ts-ignore
    __publicField(this, "statusesValues", {});
    /** @type {Boolean} */
    __publicField(this, "pinPermanently", false);
    __publicField(this, "updateAction", () => {
      switch (this.human.action) {
        case "in home": {
          if (!this.basicInfoAction.classList.contains("inHome")) {
            this.basicInfoAction.classList.add("inHome");
          }
          ["walking", "meeting", "inHospitality"].forEach((className) => {
            if (this.basicInfoAction.classList.contains(className)) {
              this.basicInfoAction.classList.remove(className);
            }
          });
          this.basicInfoAction.innerHTML = `w <span class="location">domu</span>`;
          break;
        }
        case "walking": {
          if (!this.basicInfoAction.classList.contains("walking")) {
            this.basicInfoAction.classList.add("walking");
          }
          ["inHome", "meeting", "inHospitality"].forEach((className) => {
            if (this.basicInfoAction.classList.contains(className)) {
              this.basicInfoAction.classList.remove(className);
            }
          });
          if (this.human.targetType == "home") {
            this.basicInfoAction.innerHTML = `idzie do <span class="location">domu</span>`;
          } else {
            this.basicInfoAction.innerHTML = `idzie do <span class="location">${this.human.target}</span>`;
          }
          break;
        }
        case "meeting": {
          if (!this.basicInfoAction.classList.contains("meeting")) {
            this.basicInfoAction.classList.add("meeting");
          }
          ["walking", "inHome", "inHospitality"].forEach((className) => {
            if (this.basicInfoAction.classList.contains(className)) {
              this.basicInfoAction.classList.remove(className);
            }
          });
          this.basicInfoAction.innerHTML = "spotyka się";
          break;
        }
        case "in hospitality": {
          if (!this.basicInfoAction.classList.contains("inHospitality")) {
            this.basicInfoAction.classList.add("inHospitality");
          }
          ["walking", "inHome", "meeting"].forEach((className) => {
            if (this.basicInfoAction.classList.contains(className)) {
              this.basicInfoAction.classList.remove(className);
            }
          });
          this.basicInfoAction.innerHTML = `w <span class="location">${this.human.target}</span>`;
          break;
        }
      }
    });
    /**
     * @param {HUMAN_STATUS_SOCKET_MESSAGE} data 
     */
    __publicField(this, "updateStatuses", (data) => {
      Object.keys(data.status).forEach((statusName) => {
        if (this.statusesValues[statusName]) {
          this.statusesValues[statusName].value.innerHTML = `${Math.round(data.status[statusName])}`;
        }
      });
    });
    this.human = human;
    this.human.pinned = true;
    this.windowContent = Utils.createHTMLElement("div", ["content"]);
    this.basicInfoCont = Utils.createAndAppendHTMLElement(this.windowContent, "div", ["basicInfo"]);
    this.basicInfoName = Utils.createAndAppendHTMLElement(this.basicInfoCont, "h1");
    this.basicInfoName.innerHTML = `${this.human.name} ${this.human.lastName}`;
    this.basicInfoAction = Utils.createAndAppendHTMLElement(this.basicInfoCont, "div", ["action"]);
    this.basicInfoSubCont = Utils.createAndAppendHTMLElement(this.basicInfoCont, "div", ["subCont"]);
    this.basicInfoValues.age.value.innerHTML = `${this.human.age}`;
    if (this.human.age <= 21 || this.human.age % 2 == 1 || this.human.age % 10 == 0 || this.human.age % 10 >= 8) {
      this.basicInfoValues.age.suffix.innerHTML = "lat";
    } else {
      this.basicInfoValues.age.suffix.innerHTML = "lata";
    }
    this.basicInfoSubCont.appendChild(this.basicInfoValues.age.cont);
    this.basicInfoValues.age.cont.appendChild(this.basicInfoValues.age.name);
    this.basicInfoSubCont.appendChild(this.basicInfoValues.gender.cont);
    this.basicInfoValues.gender.cont.append(this.basicInfoValues.gender.name);
    this.basicInfoValues.gender.value.classList.add(`${this.human.gender}`);
    switch (this.human.gender) {
      case "male": {
        this.basicInfoValues.gender.value.innerHTML = "♂";
        break;
      }
      case "female": {
        this.basicInfoValues.gender.value.innerHTML = "♀";
        break;
      }
      case "other": {
        this.basicInfoValues.gender.value.innerHTML = "⚧";
        break;
      }
    }
    this.basicInfoValues.gender.cont.append(this.basicInfoValues.gender.value);
    const ageH3 = Utils.createAndAppendHTMLElement(this.basicInfoValues.age.cont, "h3");
    ageH3.appendChild(this.basicInfoValues.age.value);
    ageH3.appendChild(this.basicInfoValues.age.suffix);
    attriburesList.forEach((attributeName) => {
      let obj = {};
      obj.cont = Utils.createAndAppendHTMLElement(this.attributesCont, "div", ["valueCont", `${attributeName}`]);
      obj.name = Utils.createAndAppendHTMLElement(obj.cont, "h2", ["name"], {}, `${localisation.attributeNames[attributeName]}:`);
      obj.value = Utils.createAndAppendHTMLElement(obj.cont, "h3", ["attribute"], {}, `${this.human.attributes[attributeName]}`);
      this.attributesValues[attributeName] = obj;
    });
    statusList.forEach((statusName) => {
      let obj = {};
      obj.cont = Utils.createAndAppendHTMLElement(this.statusesCont, "div", ["valueCont", `${statusName}`]);
      obj.name = Utils.createAndAppendHTMLElement(obj.cont, "h2", ["name"], {}, `${localisation.statusNames[statusName]}:`);
      obj.value = Utils.createAndAppendHTMLElement(obj.cont, "h3", ["status"]);
      this.statusesValues[statusName] = obj;
    });
    this.windowContent.appendChild(this.attributesCont);
    this.windowContent.appendChild(this.statusesCont);
    this.windowEl = new DisplayWindow(this.windowContent, {
      className: ["humanStatus", "open"],
      id: `humanStatus-${this.human.id}`,
      name: `${this.human.name} ${this.human.lastName}`,
      type: `humanStatus-window`,
      behaviour: { minimize: false, fullscreen: false, close: true },
      size: { width: 400, height: 500 },
      pos: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 250 }
    });
    this.windowEl.onClose = () => {
      return new Promise((res) => {
        this.human.parent.removeInfoWindow(this.windowEl);
        this.human.statusWindow = null;
        this.human.parent.socket.send(`humanStatusRevoke-${this.human.id}`);
        if (!this.pinPermanently) {
          this.human.pinned = false;
        }
        res(true);
      });
    };
    this.human.parent.appCont.append(this.windowEl.window);
    this.human.parent.addInfoWindow(this.windowEl);
    this.updateAction();
    let waitTime = Utils.getTransitionTime(this.windowEl.window);
    setTimeout(() => {
      if (this.windowEl.window.classList.contains("open")) {
        this.windowEl.window.classList.remove("open");
      }
      this.human.parent.focusInfoWindow(this.windowEl);
      this.windowEl.window.addEventListener("pointerdown", () => {
        this.human.parent.focusInfoWindow(this.windowEl);
      });
    }, waitTime);
  }
}
class DisplayedHuman {
  /**
   * @param {App} parent 
   * @param {Number} id 
   * @param {{x: Number, y: Number}} pos
   * @param {'in home'|'walking'|'meeting'|'in hospitality'} action
   */
  constructor(parent, id, pos, action) {
    /** @type {Number} */
    __publicField(this, "tooltipTimeout", 1e3);
    __privateAdd(this, _tooltipTimerClass, null);
    __privateAdd(this, _tooltipTimerDeletion, null);
    /** @type {App} */
    __publicField(this, "parent");
    /** @type {Number} */
    __publicField(this, "id");
    /** @type {{x: Number, y: Number}} */
    __publicField(this, "pos", { x: 0, y: 0 });
    /** @type {{x: Number, y: Number}} */
    __publicField(this, "lastPos", { x: 0, y: 0 });
    /** @type {{x: Number, y: Number}} */
    __publicField(this, "renderedPos", { x: 0, y: 0 });
    /** @type {{x: Number, y: Number}} */
    /** @type {HUMAN_ACTION} */
    __publicField(this, "action");
    /** @type {HUMAN_TARGET_TYPE} */
    __privateAdd(this, _targetType, "home");
    /** @type {Number|Null} */
    __privateAdd(this, _target, null);
    /** @type {String} */
    __privateAdd(this, _name2);
    /** @type {Number} */
    __privateAdd(this, _age);
    /** @type {('male'|'female'|'other')} */
    __privateAdd(this, _gender);
    /** @type {String} */
    __privateAdd(this, _lastName);
    /** @type {HUMAN_ATTRIBUTES} */
    __privateAdd(this, _attributes);
    /** @type {{data: HUMAN_DATA}} */
    //@ts-ignore
    __privateAdd(this, _temp, {});
    /** @type {DisplayedHumanStatusWindow|null} */
    __publicField(this, "statusWindow", null);
    __publicField(this, "handleClick", () => {
      if (this.statusWindow === null) {
        this.parent.socket.send(`humanStatus-${this.id}`);
        this.statusWindow = new DisplayedHumanStatusWindow(this);
      }
    });
    /**
     * @param {HUMAN_STATUS_SOCKET_MESSAGE} data 
     */
    __publicField(this, "updateStatuses", (data) => {
      if (this.statusWindow) {
        this.statusWindow.updateStatuses(data);
      }
    });
    /** @type {*|Null|Number} */
    __publicField(this, "deleteDataTimer", null);
    __publicField(this, "stopDeleteDataTimer", () => {
      if (this.deleteDataTimer) {
        clearTimeout(this.deleteDataTimer);
        this.deleteDataTimer = null;
      }
    });
    __publicField(this, "startDeleteDataTimer", () => {
      this.stopDeleteDataTimer();
      this.deleteDataTimer = setTimeout(() => {
        this.deleteData();
      }, 6e4);
    });
    __publicField(this, "deleteData", () => {
      if (__privateGet(this, _temp).data) {
        delete __privateGet(this, _temp).data;
      }
      if (this.deleteDataTimer) {
        clearTimeout(this.deleteDataTimer);
        this.deleteDataTimer = null;
      }
    });
    /** @type {Boolean} */
    __privateAdd(this, _hovered, false);
    /** @type {HTMLElement} */
    __privateAdd(this, _hoverToolTip);
    /** @type {HTMLElement} */
    __privateAdd(this, _hoverToolTipName);
    /** @type {HTMLElement} */
    __privateAdd(this, _hoverToolTipAction);
    /** @type {Boolean} */
    __privateAdd(this, _hoverToolTipClosing, false);
    /** @type {String} */
    __privateAdd(this, _currentTooltipUniqueId, "");
    /** @type {Boolean} */
    __privateAdd(this, _pinned, false);
    __publicField(this, "updateTooltipPos", () => {
      if (__privateGet(this, _hoverToolTip)) {
        __privateGet(this, _hoverToolTip).style.setProperty("left", `${this.renderedPos.x * (this.parent.currentMapDisplayScale / 1e3) + this.parent.mapCut.x}px`);
        __privateGet(this, _hoverToolTip).style.setProperty("top", `${this.renderedPos.y * (this.parent.currentMapDisplayScale / 1e3) + this.parent.mapCut.y}px`);
      }
    });
    __publicField(this, "updateTooltipAction", () => {
      if (__privateGet(this, _hoverToolTipAction)) {
        switch (this.action) {
          case "in home": {
            if (!__privateGet(this, _hoverToolTipAction).classList.contains("inHome")) {
              __privateGet(this, _hoverToolTipAction).classList.add("inHome");
            }
            ["walking", "meeting", "inHospitality"].forEach((className) => {
              if (__privateGet(this, _hoverToolTipAction).classList.contains(className)) {
                __privateGet(this, _hoverToolTipAction).classList.remove(className);
              }
            });
            __privateGet(this, _hoverToolTipAction).innerHTML = `w <span class="location">domu</span>`;
            break;
          }
          case "walking": {
            if (!__privateGet(this, _hoverToolTipAction).classList.contains("walking")) {
              __privateGet(this, _hoverToolTipAction).classList.add("walking");
            }
            ["inHome", "meeting", "inHospitality"].forEach((className) => {
              if (__privateGet(this, _hoverToolTipAction).classList.contains(className)) {
                __privateGet(this, _hoverToolTipAction).classList.remove(className);
              }
            });
            if (__privateGet(this, _targetType) == "home") {
              __privateGet(this, _hoverToolTipAction).innerHTML = `idzie do <span class="location">domu</span>`;
            } else {
              __privateGet(this, _hoverToolTipAction).innerHTML = `idzie do <span class="location">${__privateGet(this, _target)}</span>`;
            }
            break;
          }
          case "meeting": {
            if (!__privateGet(this, _hoverToolTipAction).classList.contains("meeting")) {
              __privateGet(this, _hoverToolTipAction).classList.add("meeting");
            }
            ["walking", "inHome", "inHospitality"].forEach((className) => {
              if (__privateGet(this, _hoverToolTipAction).classList.contains(className)) {
                __privateGet(this, _hoverToolTipAction).classList.remove(className);
              }
            });
            __privateGet(this, _hoverToolTipAction).innerHTML = "spotyka się";
            break;
          }
          case "in hospitality": {
            if (!__privateGet(this, _hoverToolTipAction).classList.contains("inHospitality")) {
              __privateGet(this, _hoverToolTipAction).classList.add("inHospitality");
            }
            ["walking", "inHome", "meeting"].forEach((className) => {
              if (__privateGet(this, _hoverToolTipAction).classList.contains(className)) {
                __privateGet(this, _hoverToolTipAction).classList.remove(className);
              }
            });
            __privateGet(this, _hoverToolTipAction).innerHTML = `w <span class="location">${__privateGet(this, _target)}</span>`;
            break;
          }
        }
      }
      if (this.statusWindow) {
        this.statusWindow.updateAction();
      }
    });
    /** @param {Boolean} [forceInstant=false] */
    __publicField(this, "hideToolTip", (forceInstant = false) => {
      if (__privateGet(this, _tooltipTimerClass)) {
        clearTimeout(__privateGet(this, _tooltipTimerClass));
        __privateSet(this, _tooltipTimerClass, null);
      }
      if (!__privateGet(this, _hoverToolTipClosing)) {
        if (__privateGet(this, _tooltipTimerDeletion)) {
          clearTimeout(__privateGet(this, _tooltipTimerDeletion));
          __privateSet(this, _tooltipTimerDeletion, null);
        }
      }
      const hideFunc = () => {
        __privateSet(this, _hovered, false);
        __privateSet(this, _hoverToolTipClosing, true);
        let waitTime = 0;
        if (__privateGet(this, _hoverToolTip)) {
          if (!__privateGet(this, _hoverToolTip).classList.contains("close")) {
            __privateGet(this, _hoverToolTip).classList.add("close");
          }
          waitTime = Utils.getTransitionTime(__privateGet(this, _hoverToolTip));
        }
        __privateSet(this, _tooltipTimerDeletion, setTimeout(() => {
          if (__privateGet(this, _hoverToolTipName)) {
            __privateGet(this, _hoverToolTipName).remove();
            __privateSet(this, _hoverToolTipName, void 0);
          }
          if (__privateGet(this, _hoverToolTipAction)) {
            __privateGet(this, _hoverToolTipAction).remove();
            __privateSet(this, _hoverToolTipAction, void 0);
          }
          if (__privateGet(this, _hoverToolTip)) {
            __privateGet(this, _hoverToolTip).remove();
            __privateSet(this, _hoverToolTip, void 0);
          }
          __privateSet(this, _hoverToolTipClosing, false);
          __privateSet(this, _currentTooltipUniqueId, "");
          this.startDeleteDataTimer();
        }, waitTime));
      };
      const hideFuncRest = () => {
        let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"]`));
        hoverToolTips.forEach((el) => {
          let unqId = el.getAttribute("data-id");
          if (unqId) {
            if (unqId !== __privateGet(this, _currentTooltipUniqueId)) {
              el.remove();
            } else {
              if (__privateGet(this, _hoverToolTip) == void 0 || __privateGet(this, _hoverToolTip) == null) {
                __privateSet(this, _hoverToolTip, el);
              }
            }
          } else {
            el.remove();
          }
        });
      };
      hideFuncRest();
      if (forceInstant) {
        if (!__privateGet(this, _hoverToolTipClosing)) {
          hideFunc();
        }
      } else {
        __privateSet(this, _tooltipTimerClass, setTimeout(() => {
          hideFunc();
        }, this.tooltipTimeout));
      }
    });
    __publicField(this, "showToolTip", async () => {
      if (__privateGet(this, _tooltipTimerClass)) {
        clearTimeout(__privateGet(this, _tooltipTimerClass));
        __privateSet(this, _tooltipTimerClass, null);
      }
      if (__privateGet(this, _tooltipTimerDeletion)) {
        clearTimeout(__privateGet(this, _tooltipTimerDeletion));
        __privateSet(this, _tooltipTimerDeletion, null);
      }
      if (__privateGet(this, _hoverToolTip) == void 0 || __privateGet(this, _hoverToolTip) == null) {
        let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"]`));
        if (hoverToolTips.length > 0) {
          __privateSet(this, _hoverToolTip, hoverToolTips[hoverToolTips.length - 1]);
          __privateSet(this, _currentTooltipUniqueId, __privateGet(this, _hoverToolTip).getAttribute("data-id"));
          if (!__privateGet(this, _currentTooltipUniqueId)) {
            __privateSet(this, _currentTooltipUniqueId, Utils.makeId(10));
            __privateGet(this, _hoverToolTip).setAttribute("data-id", __privateGet(this, _currentTooltipUniqueId));
          } else if (__privateGet(this, _currentTooltipUniqueId).trim() == "") {
            __privateSet(this, _currentTooltipUniqueId, Utils.makeId(10));
            __privateGet(this, _hoverToolTip).setAttribute("data-id", __privateGet(this, _currentTooltipUniqueId));
          }
          hoverToolTips = hoverToolTips.slice(0, -1);
          hoverToolTips.forEach((el) => {
            el.remove();
          });
          if (typeof __privateGet(this, _name2) == "undefined" || typeof __privateGet(this, _lastName) == "undefined") {
            if (typeof __privateGet(this, _temp).data == "undefined") {
              __privateGet(this, _temp).data = await this.parent.getHumanData(this.id);
            }
            __privateSet(this, _name2, `${__privateGet(this, _temp).data.info.name}`);
            __privateSet(this, _lastName, `${__privateGet(this, _temp).data.info.lastname}`);
            __privateSet(this, _attributes, JSON.parse(JSON.stringify(__privateGet(this, _temp).data.attributes)));
            __privateSet(this, _age, __privateGet(this, _temp).data.info.age + 0);
            __privateSet(this, _gender, `${__privateGet(this, _temp).data.info.gender}`);
          }
          if (__privateGet(this, _pinned)) {
            if (!__privateGet(this, _hoverToolTip).classList.contains("pinned")) {
              __privateGet(this, _hoverToolTip).classList.add("pinned");
            }
          } else {
            if (!__privateGet(this, _hoverToolTip).classList.contains("pinned")) {
              __privateGet(this, _hoverToolTip).classList.remove("pinned");
            }
          }
          let hoverToolTipInner = document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"] .content`);
          if (hoverToolTipInner == null || hoverToolTipInner == void 0) {
            hoverToolTipInner = Utils.createAndAppendHTMLElement(__privateGet(this, _hoverToolTip), "div", ["content"]);
            __privateSet(this, _hoverToolTipName, Utils.createAndAppendHTMLElement(hoverToolTipInner, "p", ["name"], {}, `<span class="firstname">${__privateGet(this, _name2)}</span> <span class="lastname">${__privateGet(this, _lastName)}</span>`));
            __privateSet(this, _hoverToolTipAction, Utils.createAndAppendHTMLElement(hoverToolTipInner, "p", ["action"]));
            this.updateTooltipAction();
          } else {
            __privateSet(this, _hoverToolTipName, document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"] .content .name`));
            if (__privateGet(this, _hoverToolTipName) == null || __privateGet(this, _hoverToolTipName) == void 0) {
              __privateSet(this, _hoverToolTipName, Utils.createAndAppendHTMLElement(hoverToolTipInner, "p", ["name"], {}, `<span class="firstname">${__privateGet(this, _name2)}</span> <span class="lastname">${__privateGet(this, _lastName)}</span>`));
            }
            __privateSet(this, _hoverToolTipAction, document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"] .content .name`));
            if (__privateGet(this, _hoverToolTipAction) == null || __privateGet(this, _hoverToolTipAction) == void 0) {
              __privateSet(this, _hoverToolTipAction, Utils.createAndAppendHTMLElement(hoverToolTipInner, "p", ["action"]));
            }
            this.updateTooltipAction();
          }
        } else {
          if (typeof __privateGet(this, _name2) == "undefined" || typeof __privateGet(this, _lastName) == "undefined") {
            if (typeof __privateGet(this, _temp).data == "undefined") {
              __privateGet(this, _temp).data = await this.parent.getHumanData(this.id);
            }
            __privateSet(this, _name2, `${__privateGet(this, _temp).data.info.name}`);
            __privateSet(this, _lastName, `${__privateGet(this, _temp).data.info.lastname}`);
            __privateSet(this, _attributes, JSON.parse(JSON.stringify(__privateGet(this, _temp).data.attributes)));
            __privateSet(this, _age, __privateGet(this, _temp).data.info.age + 0);
            __privateSet(this, _gender, `${__privateGet(this, _temp).data.info.gender}`);
          }
          const classArr = ["tooltip"];
          if (__privateGet(this, _pinned)) {
            classArr.push("pinned");
          }
          __privateSet(this, _currentTooltipUniqueId, Utils.makeId(10));
          __privateSet(this, _hoverToolTip, Utils.createHTMLElement("div", classArr, { attibutes: { "id": `tooltipHuman-${this.id}`, "data-id": __privateGet(this, _currentTooltipUniqueId) } }, '<div class="face"><div class="bg"></div><div class="arrow"></div></div>'));
          const hoverToolTipInner = Utils.createAndAppendHTMLElement(__privateGet(this, _hoverToolTip), "div", ["content"]);
          __privateSet(this, _hoverToolTipName, Utils.createAndAppendHTMLElement(hoverToolTipInner, "p", ["name"], {}, `<span class="firstname">${__privateGet(this, _name2)}</span> <span class="lastname">${__privateGet(this, _lastName)}</span>`));
          __privateSet(this, _hoverToolTipAction, Utils.createAndAppendHTMLElement(hoverToolTipInner, "p", ["action"]));
          this.updateTooltipAction();
          this.parent.tooltipsCont.appendChild(__privateGet(this, _hoverToolTip));
        }
      } else {
        let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"]`));
        hoverToolTips.forEach((el) => {
          let unqId = el.getAttribute("data-id");
          if (unqId) {
            if (unqId !== __privateGet(this, _currentTooltipUniqueId)) {
              el.remove();
            }
          } else {
            el.remove();
          }
        });
        if (__privateGet(this, _hoverToolTip).classList.contains("close")) {
          __privateGet(this, _hoverToolTip).classList.remove("close");
        }
        if (__privateGet(this, _pinned)) {
          if (!__privateGet(this, _hoverToolTip).classList.contains("pinned")) {
            __privateGet(this, _hoverToolTip).classList.add("pinned");
          }
        } else {
          if (__privateGet(this, _hoverToolTip).classList.contains("pinned")) {
            __privateGet(this, _hoverToolTip).classList.remove("pinned");
          }
        }
        this.updateTooltipAction();
      }
      this.updateTooltipPos();
      if (!__privateGet(this, _pinned)) {
        this.hideToolTip();
      }
    });
    __publicField(this, "hover", () => {
      __privateSet(this, _hovered, true);
      this.showToolTip();
    });
    /** @param {Boolean} [forceInstant=false] */
    __publicField(this, "unHover", (forceInstant = false) => {
      if (__privateGet(this, _pinned)) {
        __privateSet(this, _hovered, false);
      } else {
        this.hideToolTip(forceInstant);
      }
    });
    /**
     * @param {{x: Number, y: Number}} point0
     * @param {{x: Number, y: Number}} point1
     * @param {Number} factor
     * @returns {{x: Number, y: Number}}
     */
    __publicField(this, "getBetweenPoint", (point0, point1, factor) => {
      switch (factor) {
        case 0: {
          return point0;
        }
        case 1: {
          return point1;
        }
        default: {
          if (point0.x == point1.x) {
            let desiredDistance = (Math.max(point0.y, point1.y) - Math.min(point0.y, point1.y)) * factor;
            if (point0.y < point1.y) {
              return { x: point0.x, y: point0.y + desiredDistance };
            } else {
              return { x: point0.x, y: point0.y - desiredDistance };
            }
          } else if (point0.y == point1.y) {
            let desiredDistance = (Math.max(point0.x, point1.x) - Math.min(point0.x, point1.x)) * factor;
            if (point0.x < point1.x) {
              return { x: point0.x + desiredDistance, y: point0.y };
            } else {
              return { x: point0.x - desiredDistance, y: point0.y };
            }
          } else {
            let returnPoint = { x: point0.x, y: point1.y };
            let distance = Math.sqrt(Math.pow(point0.x - point1.x, 2) + Math.pow(point0.y - point1.y, 2));
            let desiredDistance = distance * factor;
            if (point0.x < point1.x) {
              returnPoint.x = point0.x + desiredDistance;
            } else {
              returnPoint.x = point0.x - desiredDistance;
            }
            if (point0.y < point1.y) {
              returnPoint.y = point0.y + desiredDistance;
            } else {
              returnPoint.y = point0.y - desiredDistance;
            }
            return returnPoint;
          }
        }
      }
    });
    /** @param {{x: Number, y: Number}} pos */
    __publicField(this, "drawPos", (pos = this.pos, log = false) => {
      let startX = Math.round(pos.x * this.parent.mapScalingFactor) + this.parent.mapScalingFactor / 2;
      let startY = Math.round(pos.y * this.parent.mapScalingFactor) + this.parent.mapScalingFactor / 2;
      this.renderedPos = { x: startX, y: startY };
      this.updateTooltipPos();
      if (__privateGet(this, _pinned)) {
        this.parent.spriteHuman.draw(this.parent.pinnedHumansCanvasCTX, { x: this.renderedPos.x - this.parent.humanDisplayWidth / 2 * this.parent.mapScalingFactor, y: this.renderedPos.y - this.parent.humanDisplayWidth / 2 * this.parent.mapScalingFactor }, this.parent.mapScalingFactor, this.parent.requiredFactor, colors.color9.light["color9-light-30"]);
      } else {
        this.parent.spriteHuman.draw(this.parent.humansCanvasCTX, { x: this.renderedPos.x - this.parent.humanDisplayWidth / 2 * this.parent.mapScalingFactor, y: this.renderedPos.y - this.parent.humanDisplayWidth / 2 * this.parent.mapScalingFactor }, this.parent.mapScalingFactor, this.parent.requiredFactor, "#fff");
      }
    });
    /** @param {Number} factor */
    __publicField(this, "draw", (factor) => {
      this.drawPos(this.getBetweenPoint(this.lastPos, this.pos, factor));
    });
    /**
     * @param {TICK_HUMAN_DATA} data
     */
    __publicField(this, "update", (data) => {
      if (this.id == data.id) {
        this.lastPos = { x: this.pos.x + 0, y: this.pos.y + 0 };
        this.pos = data.pos;
        this.action = data.action;
        __privateSet(this, _target, data.target);
        __privateSet(this, _targetType, data.targetType);
        this.updateTooltipAction();
      }
    });
    this.parent = parent;
    this.id = id;
    this.pos = pos;
    this.lastPos = { x: pos.x + 0, y: pos.y + 0 };
    this.action = action;
    this.drawPos();
  }
  get targetType() {
    return __privateGet(this, _targetType);
  }
  get target() {
    return __privateGet(this, _target);
  }
  get name() {
    return __privateGet(this, _name2);
  }
  get age() {
    return __privateGet(this, _age);
  }
  get gender() {
    return __privateGet(this, _gender);
  }
  get lastName() {
    return __privateGet(this, _lastName);
  }
  get attributes() {
    return __privateGet(this, _attributes);
  }
  get hovered() {
    return __privateGet(this, _hovered);
  }
  /** @type {Boolean} */
  get pinned() {
    return __privateGet(this, _pinned);
  }
  /** @type {Boolean} */
  set pinned(val) {
    if (__privateGet(this, _tooltipTimerClass)) {
      clearTimeout(__privateGet(this, _tooltipTimerClass));
      __privateSet(this, _tooltipTimerClass, null);
    }
    if (__privateGet(this, _tooltipTimerDeletion)) {
      clearTimeout(__privateGet(this, _tooltipTimerDeletion));
      __privateSet(this, _tooltipTimerDeletion, null);
    }
    if (val) {
      if (!__privateGet(this, _pinned)) {
        __privateSet(this, _pinned, true);
        if (!this.parent.pinnedHumanIds.includes(this.id)) {
          this.parent.pinnedHumanIds.push(this.id);
        }
      }
      this.showToolTip();
      this.stopDeleteDataTimer();
    } else {
      if (__privateGet(this, _pinned)) {
        __privateSet(this, _pinned, false);
        let indexof = this.parent.pinnedHumanIds.indexOf(this.id);
        if (indexof >= 0) {
          this.parent.pinnedHumanIds = this.parent.pinnedHumanIds.slice(0, indexof).concat(this.parent.pinnedHumanIds.slice(indexof + 1));
        }
      }
      if (__privateGet(this, _hoverToolTip)) {
        if (__privateGet(this, _hoverToolTip).classList.contains("pinned")) {
          __privateGet(this, _hoverToolTip).classList.remove("pinned");
        }
      }
      this.hideToolTip(true);
    }
  }
}
_tooltipTimerClass = new WeakMap();
_tooltipTimerDeletion = new WeakMap();
_targetType = new WeakMap();
_target = new WeakMap();
_name2 = new WeakMap();
_age = new WeakMap();
_gender = new WeakMap();
_lastName = new WeakMap();
_attributes = new WeakMap();
_temp = new WeakMap();
_hovered = new WeakMap();
_hoverToolTip = new WeakMap();
_hoverToolTipName = new WeakMap();
_hoverToolTipAction = new WeakMap();
_hoverToolTipClosing = new WeakMap();
_currentTooltipUniqueId = new WeakMap();
_pinned = new WeakMap();
class App {
  constructor(params) {
    /** @type {{showPinnedOnly: Boolean}} */
    __publicField(this, "displayConfig", { showPinnedOnly: false });
    /** @type {String} */
    __publicField(this, "serverUrl");
    /** @type {String} */
    __publicField(this, "wsUrl");
    /** @type {Boolean} */
    __publicField(this, "noSimulation", false);
    /** @type {Array<DisplayWindow>} */
    __publicField(this, "windows", []);
    /** @type {{[id:String]: Array<DisplayWindow>}} */
    __publicField(this, "windowsByType", {});
    /** @type {HTMLElement} */
    __publicField(this, "appCont");
    /** @type {{width: Number, height:Number}} */
    __publicField(this, "mapSize", { width: 1, height: 1 });
    /** @type {Number} */
    __publicField(this, "requiredFactor", SimulationGlobals.requiredFactor + 0);
    /** @type {Number} */
    __publicField(this, "mapScalingFactor", SimulationGlobals.mapScalingFactor + 0);
    /** @type {Number} */
    __publicField(this, "tickTime", SimulationGlobals.tickTime + 0);
    /** @type {Number} */
    __publicField(this, "lastFetchTime", SimulationGlobals.tickTime + 0);
    /** @type {Number} */
    __publicField(this, "humanDisplayWidth", 1);
    /** @type {Number} */
    __publicField(this, "humanDisplayHeight", 1);
    /** @type {Number} */
    __publicField(this, "humanPixelWidth", 0);
    /** @type {Number} */
    __publicField(this, "humanPixelHeight", 0);
    /** @type {{width: Number, height: Number}} */
    //@ts-ignore
    __publicField(this, "mapSizeScaled", {});
    /** @type {HTMLInputElement} */
    __privateAdd(this, _fakeInput);
    /** @type {HTMLElement|undefined} */
    __privateAdd(this, _loader);
    /** @type {DisplayWindow|undefined} */
    __privateAdd(this, _mapWindow);
    /** @type {HTMLElement} */
    __publicField(this, "mapWindowCont", Utils.createHTMLElement("div", ["map"]));
    /** @type {HTMLElement} */
    __publicField(this, "mapScreen", Utils.createHTMLElement("div", ["screen", "outlines"]));
    /** @type {HTMLCanvasElement} */
    __publicField(this, "mapCanvas");
    /** @type {CanvasRenderingContext2D} */
    __publicField(this, "mapCanvasCTX");
    /** @type {HTMLElement} */
    __publicField(this, "humansScreen", Utils.createHTMLElement("div", ["screen", "humans"]));
    /** @type {HTMLCanvasElement} */
    __publicField(this, "humansCanvas");
    /** @type {CanvasRenderingContext2D} */
    __publicField(this, "humansCanvasCTX");
    /** @type {HTMLElement} */
    __publicField(this, "pinnedHumansScreen", Utils.createHTMLElement("div", ["screen", "humans", "pinned"]));
    /** @type {HTMLCanvasElement} */
    __publicField(this, "pinnedHumansCanvas");
    /** @type {CanvasRenderingContext2D} */
    __publicField(this, "pinnedHumansCanvasCTX");
    /** @type {HTMLElement} */
    __publicField(this, "fakeScreen", Utils.createHTMLElement("div", ["screen", "fake"]));
    /** @type {HTMLElement} */
    __publicField(this, "tooltipsCont", Utils.createHTMLElement("div", ["tooltips"]));
    /** @type {HTMLCanvasElement} */
    __publicField(this, "fakeCanvas");
    /** @type {CanvasRenderingContext2D} */
    __publicField(this, "fakeCanvasCTX");
    /** @type {Array<DisplayedHuman>} */
    __publicField(this, "humans", []);
    /** @type {Array<Number>} */
    __publicField(this, "pinnedHumanIds", []);
    /** @type {*|null} */
    __publicField(this, "humansFetchTimer", null);
    /** @type {TICK_DATA} */
    __publicField(this, "lastTick", { id: 0, humanPos: [] });
    /** @type {Number} */
    __publicField(this, "frameTime", 1e3 / SimulationGlobals.fps);
    /** @type {null|DRAWING_INSTANCE} */
    __publicField(this, "drawingInstance", null);
    __publicField(this, "promFirstFetch", Promise.withResolvers());
    /** @type {Number} */
    __publicField(this, "currentMapDisplayScale", 1e3);
    /** @type {Number} */
    __publicField(this, "mapMinDisplayScale", 1e3);
    /** @type {Number} */
    __publicField(this, "mapMaxDisplayScale", 2e3);
    /** @type {{x: Number, y: Number}} */
    __publicField(this, "mapDisplayFocusPoint", { x: 0, y: 0 });
    /** @type {{x: Number, y: Number}} */
    __publicField(this, "mapCut", { x: 0, y: 0 });
    __publicField(this, "mapDisplayFocusPointLimits", { x: { max: 0, min: 0 }, y: { max: 0, min: 0 } });
    /** @type {Number} */
    __publicField(this, "startTime");
    /** @type {Number} */
    __publicField(this, "lastTime");
    /** @type {WebSocket} */
    __publicField(this, "socket");
    /** @type {Sprite} */
    __publicField(this, "spriteHuman");
    /** @type {Array<DisplayWindow>} */
    __privateAdd(this, _infoWindows, []);
    /**
     * @param {DisplayWindow} displayWindow
     * @returns {Number|null}
     */
    __privateAdd(this, _infoWindowsIndexOf, (displayWindow) => {
      let foundId = null;
      for (let i = 0; i < __privateGet(this, _infoWindows).length; i++) {
        if (__privateGet(this, _infoWindows)[i].id == displayWindow.id) {
          foundId = i + 0;
          break;
        }
      }
      return foundId;
    });
    /**
     * @param {DisplayWindow} displayWindow
     * @returns {Boolean}
     */
    __privateAdd(this, _infoWindowsIncludes, (displayWindow) => {
      let includes = false;
      for (let _displayWindow of __privateGet(this, _infoWindows)) {
        if (_displayWindow.id == displayWindow.id) {
          includes = true;
          break;
        }
      }
      return includes;
    });
    /** 
     * @param {DisplayWindow} displayWindow
     */
    __publicField(this, "addInfoWindow", (displayWindow) => {
      if (!__privateGet(this, _infoWindowsIncludes).call(this, displayWindow)) {
        __privateGet(this, _infoWindows).push(displayWindow);
      }
    });
    /**
     * @param {DisplayWindow} displayWindow
     */
    __publicField(this, "focusInfoWindow", (displayWindow) => {
      this.addInfoWindow(displayWindow);
      __privateGet(this, _infoWindows).forEach((_displayWindow) => {
        if (_displayWindow.id !== displayWindow.id) {
          _displayWindow.focused = false;
        } else {
          _displayWindow.focused = true;
        }
      });
    });
    /** 
     * @param {DisplayWindow} displayWindow
     */
    __publicField(this, "removeInfoWindow", (displayWindow) => {
      let indexOf = __privateGet(this, _infoWindowsIndexOf).call(this, displayWindow);
      while (indexOf !== null) {
        __privateSet(this, _infoWindows, __privateGet(this, _infoWindows).slice(0, indexOf).concat(__privateGet(this, _infoWindows).slice(indexOf + 1)));
        indexOf = __privateGet(this, _infoWindowsIndexOf).call(this, displayWindow);
      }
    });
    /**
     * @typedef {Object} HUMAN_DATA_QUEUE
     * @property {Array<Number>} requestedIds
     * @property {(id:Number) => Promise<HUMAN_DATA>} request
     * @property {(id:Number, data: HUMAN_DATA) => void} resolve
     */
    /** @type {HUMAN_DATA_QUEUE} */
    __privateAdd(this, _humanDataQueue);
    /** @returns {HUMAN_DATA_QUEUE} */
    __privateAdd(this, _createHumanDataQueue, () => {
      let _requests = {};
      let _preResolved = {};
      let humanDataQueue = {};
      Object.defineProperty(humanDataQueue, "requestedIds", {
        set: () => {
        },
        get: () => {
          let _requestsIds = Object.keys(_requests).map((key) => {
            return Number(key);
          });
          Object.keys(_preResolved).forEach((key) => {
            if (!_requestsIds.includes(Number(key))) {
              _requestsIds.push(Number(key));
            }
          });
          return _requestsIds;
        },
        enumerable: true
      });
      humanDataQueue.request = (id) => {
        if (Object.keys(_preResolved).includes(`${id}`)) {
          return new Promise((res) => {
            let _preResolvedData = JSON.parse(JSON.stringify(_preResolved[`${id}`]));
            let _newPreResolved = {};
            Object.keys(_newPreResolved).forEach((key) => {
              if (key !== `${id}`) {
                _newPreResolved[key] = _preResolved[key];
              }
            });
            _preResolved = _newPreResolved;
            res(_preResolvedData);
          });
        } else if (Object.keys(_requests).includes(`${id}`)) {
          return _requests[`${id}`].promise;
        } else {
          _requests[`${id}`] = Promise.withResolvers();
          this.promFirstFetch.promise.then(() => {
            this.socket.send(`humanData-${id}`);
          });
          return _requests[`${id}`].promise;
        }
      };
      humanDataQueue.resolve = (id, data) => {
        if (Object.keys(_requests).includes(`${id}`)) {
          let _newRequests = {};
          Object.keys(_requests).forEach((key) => {
            if (key !== `${id}`) {
              _newRequests[key] = _requests[key];
            } else {
              _requests[key].resolve(data);
            }
          });
          _requests = _newRequests;
        } else if (!Object.keys(_preResolved).includes(`${id}`)) {
          _preResolved[`${id}`] = data;
        }
      };
      return humanDataQueue;
    });
    /** @returns {HTMLElement} */
    __publicField(this, "createLoader", () => {
      let loader = document.querySelector("body .loader");
      if (loader == void 0 || loader == null) {
        loader = Utils.createHTMLElement("div", ["loader"]);
        let cont = Utils.createAndAppendHTMLElement(loader, "div", ["cont"]);
        let belt = Utils.createAndAppendHTMLElement(cont, "div", ["belt"]);
        Utils.createAndAppendHTMLElement(belt, "div", ["border", "cutCornersBefore", "cutCornersAfter"]);
        let symbolsBag = Utils.createAndAppendHTMLElement(Utils.createAndAppendHTMLElement(belt, "div", ["symbols", "cutCorners"]), "div", ["symbolsBag"]);
        const elementCount = 17;
        const timeFactor = 8;
        for (let i = 0; i < elementCount; i++) {
          Utils.createAndAppendHTMLElement(symbolsBag, "div", [`symbol`, `symbol-${i + 1}`], { css: { "animation-delay": `${i / timeFactor}s`, "animation-duration": `${(elementCount - 1) / timeFactor}s` } });
        }
        document.body.prepend(loader);
      }
      if (!document.body.classList.contains("loading")) {
        document.body.classList.add("loading");
      }
      return loader;
    });
    /** @returns {Promise<Boolean>} */
    __publicField(this, "removeLoader", () => {
      return new Promise((res) => {
        if (!document.body.classList.contains("loading-close")) {
          document.body.classList.add("loading-close");
        }
        let elements = [document.body];
        if (__privateGet(this, _loader)) {
          elements.push(__privateGet(this, _loader));
        }
        let waitTime = Utils.getTransitionTime(elements);
        setTimeout(() => {
          if (document.body.classList.contains("loading")) {
            document.body.classList.remove("loading");
          }
          if (document.body.classList.contains("loading-close")) {
            document.body.classList.remove("loading-close");
          }
          if (__privateGet(this, _loader)) {
            __privateGet(this, _loader).remove();
            __privateSet(this, _loader, void 0);
          }
          res(true);
        }, waitTime);
      });
    });
    __publicField(this, "removeWindow", (id) => {
    });
    /**
     * @param {Number} id 
     * @returns {Promise<HUMAN_DATA>}
     */
    __publicField(this, "getHumanData", (id) => {
      return __privateGet(this, _humanDataQueue).request(id);
    });
    /**
     * @typedef {Object} DRAWING_INSTANCE
     * @property {() => void} stop
     * @property {Promise} finish
     */
    /** 
     * @param {Number} length
     * @param {TICK_DATA} tickData
     * @returns {DRAWING_INSTANCE}
     */
    __publicField(this, "drawHumans", (length = this.lastFetchTime, tickData) => {
      const drawingInstancePromise = Promise.withResolvers();
      this.pinnedHumansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
      this.fakeCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
      this.humansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
      for (let human of this.humans) {
        human.drawPos();
      }
      drawingInstancePromise.resolve(true);
      return { stop: () => {
      }, finish: drawingInstancePromise.promise };
    });
    __publicField(this, "startDataFetch", () => {
    });
    __publicField(this, "stopDataFetch", () => {
    });
    /** 
     * @param {TICK_DATA} lastTick
     * @returns {Promise<Boolean>}
     */
    __publicField(this, "onNewData", (lastTick) => {
      return new Promise(async (res) => {
        lastTick.humanPos.forEach(
          /** @param {TICK_HUMAN_DATA} set */
          (set) => {
            if (this.humans[set.id]) {
              this.humans[set.id].update(set);
            }
          }
        );
        if (this.drawingInstance) {
          this.drawingInstance.stop();
          await this.drawingInstance.finish;
          this.drawingInstance = null;
        }
        this.lastFetchTime = performance.now() - this.startTime;
        this.lastFetchTime = Math.round(this.lastFetchTime / this.frameTime) * this.frameTime;
        this.startTime = performance.now();
        this.drawingInstance = this.drawHumans(this.lastFetchTime + 0, lastTick);
        this.drawingInstance.finish.then(() => {
          res(true);
        });
      });
    });
    __publicField(this, "dispose", () => {
      this.stopDataFetch();
    });
    /**
     * 
     * @param {MessageEvent} event 
     */
    __publicField(this, "handleSocketMessage", (event) => {
      let indexOfDash = event.data.indexOf("-");
      if (indexOfDash >= 0) {
        let tag = event.data.slice(0, indexOfDash);
        let rest = event.data.slice(indexOfDash + 1);
        switch (tag) {
          case "tickData": {
            this.onNewData(JSON.parse(JSON.stringify(this.lastTick)));
            this.lastTick = JSON.parse(rest);
            break;
          }
          case "humanStatus": {
            let data = JSON.parse(rest);
            if (this.humans[data.id]) {
              this.humans[data.id].updateStatuses(data);
            }
            break;
          }
          case "humanData": {
            let humanData = JSON.parse(rest);
            __privateGet(this, _humanDataQueue).resolve(humanData.id, humanData);
            break;
          }
        }
      }
    });
    __publicField(this, "createHumansLayer", () => {
      return new Promise(async (resolve, reject) => {
        this.spriteHuman = new Sprite(this);
        await this.spriteHuman.get("human");
        this.humanDisplayWidth = this.spriteHuman.width / this.requiredFactor;
        this.humanDisplayHeight = this.spriteHuman.height / this.requiredFactor;
        let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
        this.humansCanvas = Utils.createAndAppendHTMLElement(this.humansScreen, "canvas", ["humans-canvas"], { attibutes: { "width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}` }, css: { "aspect-ratio": `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, "width": `${this.mapSizeScaled.width}px`, "height": `${this.mapSizeScaled.height}px` } });
        this.humansCanvasCTX = this.humansCanvas.getContext("2d");
        this.mapWindowCont.appendChild(this.humansScreen);
        this.pinnedHumansCanvas = Utils.createAndAppendHTMLElement(this.pinnedHumansScreen, "canvas", ["humans-canvas", "pinned"], { attibutes: { "width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}` }, css: { "aspect-ratio": `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, "width": `${this.mapSizeScaled.width}px`, "height": `${this.mapSizeScaled.height}px` } });
        this.pinnedHumansCanvasCTX = this.humansCanvas.getContext("2d");
        this.socket = new WebSocket(this.wsUrl);
        const startTime = performance.now();
        let unpassed = true;
        this.socket.addEventListener("open", () => {
        });
        let handleFirstMessage = (event) => {
          if (unpassed) {
            if (event.data.slice(0, "tickData-".length) == "tickData-") {
              this.lastTick = JSON.parse(event.data.slice("tickData-".length));
              this.lastTick.humanPos.forEach((set) => {
                this.humans[set.id] = new DisplayedHuman(this, set.id, set.pos, set.action);
              });
              this.lastFetchTime = performance.now() - startTime;
              if (this.lastFetchTime < this.tickTime) {
                this.lastFetchTime = this.tickTime + 0;
              }
              this.lastFetchTime = Math.ceil(this.lastFetchTime / this.frameTime) * this.frameTime;
              this.startTime = performance.now();
              this.lastTime = performance.now();
              this.socket.removeEventListener("message", handleFirstMessage);
              this.socket.addEventListener("message", this.handleSocketMessage);
              this.promFirstFetch.resolve(true);
              unpassed = false;
              resolve(true);
            }
          }
        };
        this.socket.addEventListener("message", handleFirstMessage);
      });
    });
    __publicField(this, "createMap", () => {
      return new Promise(async (resolve, reject) => {
        Promise.all([fetch(`${this.serverUrl}/sprite/tile`), fetch(`${this.serverUrl}/rawMap`)]).then(async ([responseSprite, response]) => {
          if (response.status == 200 && responseSprite.status == 200) {
            const responseJson = await response.json();
            const jsonSprite = await responseSprite.json();
            if (Array.isArray(responseJson) && Array.isArray(jsonSprite == null ? void 0 : jsonSprite.data)) {
              if (responseJson.length > 0 && jsonSprite.data.length > 0) {
                if (Array.isArray(responseJson[0]) && Array.isArray(jsonSprite.data[0])) {
                  if (responseJson[0].length > 0 && jsonSprite.data[0].length > 0) {
                    this.mapSize = { width: responseJson.length, height: responseJson[0].length };
                    let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
                    this.mapCanvas = Utils.createAndAppendHTMLElement(this.mapScreen, "canvas", ["screen-canvas"], { attibutes: { "width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}` }, css: { "aspect-ratio": `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, "width": `${this.mapSizeScaled.width}px`, "height": `${this.mapSizeScaled.height}px` } });
                    this.mapCanvasCTX = this.mapCanvas.getContext("2d");
                    this.mapCanvasCTX.fillStyle = colors.color3.dark["color3-dark-90"];
                    this.mapCanvasCTX.fillRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                    responseJson.forEach((column, column_id) => {
                      column.forEach((point, row_id) => {
                        if (point == 1) {
                          Sprite.draw(this.mapCanvasCTX, { x: column_id * this.mapScalingFactor, y: row_id * this.mapScalingFactor }, this.mapScalingFactor, this.requiredFactor, jsonSprite, colors.color3.base);
                        }
                      });
                    });
                    this.mapWindowCont.appendChild(this.mapScreen);
                    resolve(true);
                  } else {
                    reject(500);
                  }
                } else {
                  reject(500);
                }
              } else {
                reject(500);
              }
            } else {
              reject(500);
            }
          } else {
            reject(503);
          }
        }, (e2) => {
          console.log(e2);
          reject(503);
        });
      });
    });
    __publicField(this, "init", () => {
      return new Promise((resolve, reject) => {
        this.createMap().then((res) => {
          this.createHumansLayer().then((_res) => {
            resolve(_res);
          }, (code) => {
            setTimeout(() => {
              reject(code);
            }, 5e3);
          });
        }, (code) => {
          setTimeout(() => {
            reject(code);
          }, 5e3);
        });
      });
    });
    /**
     * @param {KeyboardEvent} e 
     */
    __publicField(this, "handleKey", (e2) => {
      e2.preventDefault();
    });
    /** @param {Number} code */
    __publicField(this, "bluescreen", async (code) => {
      let el = await Utils.createHTML(`<div class="test" ref="main"></div>`, ["main"]);
      console.log(el, el.element.outerHTML);
    });
    this.serverUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
    this.wsUrl = `ws://${window.location.hostname}:3000`;
    if (params) {
      if (params.noSimulation) {
        this.noSimulation = true;
      }
    }
    __privateSet(this, _loader, this.createLoader());
    __privateSet(this, _humanDataQueue, __privateGet(this, _createHumanDataQueue).call(this));
    this.appCont = Utils.createAndAppendHTMLElement(document.body, "div", ["app"], { attibutes: { id: "app" } });
    Object.defineProperty(this.mapSizeScaled, "width", {
      set: () => {
      },
      get: () => {
        return this.mapSize.width * this.mapScalingFactor;
      },
      enumerable: true
    });
    Object.defineProperty(this.mapSizeScaled, "height", {
      set: () => {
      },
      get: () => {
        return this.mapSize.height * this.mapScalingFactor;
      },
      enumerable: true
    });
    document.body.addEventListener("keydown", this.handleKey);
    if (this.mapScalingFactor % this.requiredFactor != 0) {
      this.mapScalingFactor = this.mapScalingFactor + (this.requiredFactor - this.mapScalingFactor % this.requiredFactor);
    }
    if (this.humanDisplayWidth <= 0) {
      this.humanDisplayWidth = 1;
    }
    this.init().then(() => {
      let factor = Utils.floorToFraction((window.innerWidth - 20) / this.mapSize.width);
      if (Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height) < factor) {
        factor = Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height);
      }
      let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
      this.fakeScreen.appendChild(this.tooltipsCont);
      this.fakeCanvas = Utils.createAndAppendHTMLElement(this.fakeScreen, "canvas", ["fake-canvas"], { attibutes: { "width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}` }, css: { "aspect-ratio": `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, "width": `${this.mapSizeScaled.width}px`, "height": `${this.mapSizeScaled.height}px` } });
      this.mapWindowCont.appendChild(this.fakeScreen);
      this.fakeCanvasCTX = this.fakeCanvas.getContext("2d");
      this.fakeCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
      __privateSet(this, _mapWindow, new DisplayWindow(this.mapWindowCont, { className: "map-window", id: "map-window", type: "map-window", name: "Mapa", behaviour: { close: false }, size: { width: this.mapSize.width * factor, height: this.mapSize.height * factor + 35 }, pos: { x: 10, y: 10 }, aspectRatioScaling: true }));
      this.appCont.appendChild(__privateGet(this, _mapWindow).window);
      setTimeout(() => {
        const mapZoomControlCont = Utils.createAndAppendHTMLElement(this.mapWindowCont, "div", ["zoom-controls"]);
        this.mapMinDisplayScale = Math.ceil(this.mapWindowCont.offsetWidth / this.mapSizeScaled.width * 1e3);
        this.currentMapDisplayScale = this.mapMinDisplayScale + 0;
        const mapZoomInput = Utils.createAndAppendHTMLElement(mapZoomControlCont, "input", ["zoom-input"], { attibutes: { type: "range", min: `${this.mapMinDisplayScale}`, max: `${this.mapMaxDisplayScale}`, step: "1" } });
        mapZoomInput.value = `${this.currentMapDisplayScale}`;
        this.mapDisplayFocusPointLimits = { x: { min: -50, max: -50 }, y: { min: -50, max: -50 } };
        let baseX = 0;
        let baseY = 0;
        const setMapCut = () => {
          let bounds = this.mapCanvas.getBoundingClientRect();
          let bounds_parent = this.humansScreen.getBoundingClientRect();
          this.mapCut = { x: bounds.left - bounds_parent.left - baseX, y: bounds.top - bounds_parent.top - baseY };
        };
        const setHumanPixelWidth = () => {
          this.humanPixelWidth = this.mapScalingFactor * this.humanDisplayWidth * (this.currentMapDisplayScale / 1e3);
          this.humanPixelHeight = this.mapScalingFactor * this.humanDisplayHeight * (this.currentMapDisplayScale / 1e3);
          this.mapWindowCont.style.setProperty("--humanPixelWidth", `${Utils.roundToFraction(this.humanPixelWidth, 2)}px`);
          this.mapWindowCont.style.setProperty("--humanPixelHeight", `${Utils.roundToFraction(this.humanPixelHeight, 2)}px`);
        };
        const resizeInner = () => {
          let sizePercent = (this.currentMapDisplayScale - this.mapMinDisplayScale) / (this.mapMaxDisplayScale - this.mapMinDisplayScale);
          this.mapDisplayFocusPointLimits.x.min = -50 - 90 * sizePercent;
          this.mapDisplayFocusPointLimits.x.max = -50 + 90 * sizePercent;
          this.mapDisplayFocusPointLimits.y.min = -50 - 80 * sizePercent;
          this.mapDisplayFocusPointLimits.y.max = -50 + 80 * sizePercent;
          if (this.mapDisplayFocusPoint.x <= this.mapDisplayFocusPointLimits.x.min) {
            this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.min + 0;
          }
          if (this.mapDisplayFocusPoint.x >= this.mapDisplayFocusPointLimits.x.max) {
            this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.max + 0;
          }
          if (this.mapDisplayFocusPoint.y <= this.mapDisplayFocusPointLimits.y.min) {
            this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.min + 0;
          }
          if (this.mapDisplayFocusPoint.y >= this.mapDisplayFocusPointLimits.y.max) {
            this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.max + 0;
          }
          this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
          this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
          this.mapWindowCont.style.setProperty("--currentMapScale", `${this.currentMapDisplayScale / 1e3}`);
          setMapCut();
          setHumanPixelWidth();
          this.humans.forEach((human) => {
            human.updateTooltipPos();
          });
        };
        const handleResize = () => {
          this.mapMinDisplayScale = Math.ceil(this.mapWindowCont.offsetWidth / this.mapSizeScaled.width * 1e3);
          mapZoomInput.setAttribute("min", `${this.mapMinDisplayScale}`);
          if (this.currentMapDisplayScale <= this.mapMinDisplayScale) {
            this.currentMapDisplayScale = this.mapMinDisplayScale + 0;
            resizeInner();
          }
        };
        let zoomTimeout = null;
        mapZoomInput.addEventListener("input", () => {
          if (!isNaN(Number(mapZoomInput.value))) {
            if (Number(mapZoomInput.value) >= this.mapMinDisplayScale && Number(mapZoomInput.value) <= this.mapMaxDisplayScale) {
              if (!this.fakeScreen.classList.contains("zooming")) {
                this.fakeScreen.classList.add("zooming");
              }
              if (this.fakeScreen.classList.contains("dragging")) {
                this.fakeScreen.classList.remove("dragging");
              }
              if (this.fakeScreen.classList.contains("hoverHuman")) {
                this.fakeScreen.classList.remove("hoverHuman");
              }
              this.currentMapDisplayScale = Number(mapZoomInput.value);
              let sizePercent = (this.currentMapDisplayScale - this.mapMinDisplayScale) / (this.mapMaxDisplayScale - this.mapMinDisplayScale);
              this.mapDisplayFocusPointLimits.x.min = -50 - 80 * sizePercent;
              this.mapDisplayFocusPointLimits.x.max = -50 + 80 * sizePercent;
              this.mapDisplayFocusPointLimits.y.min = -50 - 80 * sizePercent;
              this.mapDisplayFocusPointLimits.y.max = -50 + 80 * sizePercent;
              if (this.mapDisplayFocusPoint.x <= this.mapDisplayFocusPointLimits.x.min) {
                this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.min + 0;
              }
              if (this.mapDisplayFocusPoint.x >= this.mapDisplayFocusPointLimits.x.max) {
                this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.max + 0;
              }
              if (this.mapDisplayFocusPoint.y <= this.mapDisplayFocusPointLimits.y.min) {
                this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.min + 0;
              }
              if (this.mapDisplayFocusPoint.y >= this.mapDisplayFocusPointLimits.y.max) {
                this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.max + 0;
              }
              this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
              this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
              this.mapWindowCont.style.setProperty("--currentMapScale", `${this.currentMapDisplayScale / 1e3}`);
              setMapCut();
              setHumanPixelWidth();
              this.humans.forEach((human) => {
                human.updateTooltipPos();
              });
              if (zoomTimeout) {
                clearTimeout(zoomTimeout);
              }
              zoomTimeout = setTimeout(() => {
                if (this.fakeScreen.classList.contains("zooming")) {
                  this.fakeScreen.classList.remove("zooming");
                }
                if (zoomTimeout) {
                  clearTimeout(zoomTimeout);
                }
                zoomTimeout = null;
              }, 100);
            }
          }
        });
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(this.mapWindowCont);
        this.mapDisplayFocusPoint = { x: -50, y: -50 };
        let dragStartPos = { x: 0, y: 0 };
        const handleDragMouse = (e2) => {
          const diffX = (e2.offsetX - dragStartPos.x) / this.mapSizeScaled.width * 100;
          const diffY = (e2.offsetY - dragStartPos.y) / this.mapSizeScaled.height * 100;
          this.mapDisplayFocusPoint.x = this.mapDisplayFocusPoint.x + diffX;
          if (this.mapDisplayFocusPoint.x <= this.mapDisplayFocusPointLimits.x.min) {
            this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.min + 0;
          }
          if (this.mapDisplayFocusPoint.x >= this.mapDisplayFocusPointLimits.x.max) {
            this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.max + 0;
          }
          this.mapDisplayFocusPoint.y = this.mapDisplayFocusPoint.y + diffY;
          if (this.mapDisplayFocusPoint.y <= this.mapDisplayFocusPointLimits.y.min) {
            this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.min + 0;
          }
          if (this.mapDisplayFocusPoint.y >= this.mapDisplayFocusPointLimits.y.max) {
            this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.max + 0;
          }
          this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
          this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
          setMapCut();
          this.humans.forEach((human) => {
            human.updateTooltipPos();
          });
        };
        __privateGet(this, _mapWindow).onFullscreen = () => {
          return new Promise((res) => {
            for (let i = 1; i <= 500; i++) {
              setTimeout(() => {
                this.mapMinDisplayScale = Math.ceil(this.mapWindowCont.offsetWidth / this.mapSizeScaled.width * 1e3);
                mapZoomInput.setAttribute("min", `${this.mapMinDisplayScale}`);
                resizeInner();
              }, i);
            }
            res(true);
          });
        };
        const handleMouseMoveNormal = (e2) => {
          let pos = { x: e2.offsetX, y: e2.offsetY };
          let half = this.mapScalingFactor * 3;
          const humansToHover = [];
          const humansToUnhover = [];
          this.humans.forEach((human) => {
            if (pos.x >= human.renderedPos.x - half && pos.x <= human.renderedPos.x + half && (pos.y >= human.renderedPos.y - half && pos.y <= human.renderedPos.y + half) && (this.displayConfig.showPinnedOnly && human.pinned || !this.displayConfig.showPinnedOnly)) {
              humansToHover.push(human);
            } else {
              humansToUnhover.push(human);
            }
          });
          let instant = humansToHover.length > 0;
          humansToUnhover.forEach((human) => {
            human.unHover(instant);
          });
          if (instant) {
            if (!this.fakeScreen.classList.contains("hoverHuman")) {
              this.fakeScreen.classList.add("hoverHuman");
            }
            humansToHover.forEach((human) => {
              human.hover();
            });
          } else {
            if (this.fakeScreen.classList.contains("hoverHuman")) {
              this.fakeScreen.classList.remove("hoverHuman");
            }
          }
          if (zoomTimeout) {
            clearTimeout(zoomTimeout);
            zoomTimeout = null;
          }
          if (this.fakeScreen.classList.contains("dragging")) {
            this.fakeScreen.classList.remove("dragging");
          }
          if (this.fakeScreen.classList.contains("zooming")) {
            this.fakeScreen.classList.remove("zooming");
          }
        };
        const handleMouseDown = (e2) => {
          let pos = { x: e2.offsetX, y: e2.offsetY };
          let half = this.mapScalingFactor * 2;
          dragStartPos = { x: pos.x + 0, y: pos.y + 0 };
          let hasClickedOnHuman = false;
          this.humans.forEach((human) => {
            if (pos.x >= human.renderedPos.x - half && pos.x <= human.renderedPos.x + half && (pos.y >= human.renderedPos.y - half && pos.y <= human.renderedPos.y + half) && (this.displayConfig.showPinnedOnly && human.pinned || !this.displayConfig.showPinnedOnly)) {
              hasClickedOnHuman = true;
              human.handleClick();
            }
          });
          if (this.fakeScreen.classList.contains("hoverHuman")) {
            this.fakeScreen.classList.remove("hoverHuman");
          }
          if (!hasClickedOnHuman && this.currentMapDisplayScale > this.mapMinDisplayScale) {
            mapZoomInput.disabled = true;
            if (!this.fakeScreen.classList.contains("dragging")) {
              this.fakeScreen.classList.add("dragging");
            }
            this.fakeCanvas.removeEventListener("mousedown", handleMouseDown);
            this.fakeCanvas.removeEventListener("mousemove", handleMouseMoveNormal);
            this.fakeCanvas.addEventListener("mousemove", handleDragMouse);
            this.fakeCanvas.addEventListener("mouseup", handleStopDrag);
            this.fakeCanvas.addEventListener("mouseout", handleStopDrag);
            this.humans.forEach((human) => {
              human.unHover(true);
            });
          }
        };
        const handleStopDrag = (e2) => {
          mapZoomInput.disabled = false;
          if (this.fakeScreen.classList.contains("dragging")) {
            this.fakeScreen.classList.remove("dragging");
          }
          if (this.fakeScreen.classList.contains("hoverHuman")) {
            this.fakeScreen.classList.remove("hoverHuman");
          }
          if (this.fakeScreen.classList.contains("zooming")) {
            this.fakeScreen.classList.remove("zooming");
          }
          if (zoomTimeout) {
            clearTimeout(zoomTimeout);
            zoomTimeout = null;
          }
          this.fakeCanvas.removeEventListener("mousemove", handleDragMouse);
          this.fakeCanvas.removeEventListener("mouseup", handleStopDrag);
          this.fakeCanvas.removeEventListener("mouseout", handleStopDrag);
          this.fakeCanvas.addEventListener("mousedown", handleMouseDown);
          this.fakeCanvas.addEventListener("mousemove", handleMouseMoveNormal);
        };
        setTimeout(() => {
          this.mapWindowCont.style.setProperty("--currentMapScale", `${this.currentMapDisplayScale / 1e3}`);
          this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
          this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
          let bounds = this.mapCanvas.getBoundingClientRect();
          let bounds_parent = this.humansScreen.getBoundingClientRect();
          baseX = bounds.left - bounds_parent.left;
          baseY = bounds.top - bounds_parent.top;
          this.humanPixelWidth = this.mapScalingFactor * this.humanDisplayWidth * (this.currentMapDisplayScale / 1e3);
          this.humanPixelHeight = this.mapScalingFactor * this.humanDisplayHeight * (this.currentMapDisplayScale / 1e3);
          this.mapWindowCont.style.setProperty("--humanPixelWidth", `${Utils.roundToFraction(this.humanPixelWidth, 2)}px`);
          this.mapWindowCont.style.setProperty("--humanPixelHeight", `${Utils.roundToFraction(this.humanPixelHeight, 2)}px`);
          this.fakeCanvas.addEventListener("mousedown", handleMouseDown);
          this.fakeCanvas.addEventListener("mousemove", handleMouseMoveNormal);
          this.removeLoader();
        });
      });
    }, (e2) => {
      console.error(e2);
      this.bluescreen(e2);
    });
  }
  /** @type {Array<DisplayedHuman>} */
  get pinnedHummans() {
    let arr = [];
    this.pinnedHumanIds.forEach((id) => {
      arr[arr.length] = this.humans[id];
    });
    return arr;
  }
}
_fakeInput = new WeakMap();
_loader = new WeakMap();
_mapWindow = new WeakMap();
_infoWindows = new WeakMap();
_infoWindowsIndexOf = new WeakMap();
_infoWindowsIncludes = new WeakMap();
_humanDataQueue = new WeakMap();
_createHumanDataQueue = new WeakMap();
try {
  const app = new App();
} catch (err) {
  console.error(err);
}
