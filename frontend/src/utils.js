
import {HTMLToJSON} from "html-to-json-parser";
/** @type {Array<string>} */
const HTML_TAGS_ARR = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 's', 'samp', 'script', 'search', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

/**
 * @typedef {{a:HTMLElement, abbr: HTMLElement, address: HTMLElement, area: HTMLAreaElement, article: HTMLElement, aside: HTMLElement, audio:HTMLAudioElement, b: HTMLElement, base: HTMLBaseElement, bdi: HTMLElement, bdo: HTMLElement, blockquote: HTMLQuoteElement, br: HTMLBRElement, button: HTMLButtonElement, canvas: HTMLCanvasElement, caption: HTMLElement, cite: HTMLElement, code: HTMLElement, col: HTMLElement, colgroup: HTMLElement, data:HTMLDataElement, datalist:HTMLDataListElement, dd:HTMLElement, del:HTMLElement, details: HTMLDetailsElement, dfn:HTMLElement, dialog:HTMLDialogElement, div:HTMLDivElement, dl:HTMLElement, dt:HTMLElement, em:HTMLElement, embed:HTMLEmbedElement, fieldset: HTMLFieldSetElement, figcaption: HTMLElement, figure: HTMLElement, footer: HTMLElement, forM:HTMLFormElement, h1: HTMLHeadingElement, h2:HTMLHeadingElement, h3: HTMLHeadingElement, h4:HTMLHeadingElement, h5: HTMLHeadingElement, h6: HTMLHeadingElement, header:HTMLElement, hgroup:HTMLElement, hr:HTMLHRElement, i:HTMLElement, iframe: HTMLIFrameElement, img: HTMLImageElement, input: HTMLInputElement, ins: HTMLElement, kbd: HTMLElement, label:HTMLLabelElement, li:HTMLLIElement, link:HTMLLinkElement, main:HTMLElement, map:HTMLMapElement, mark:HTMLElement, menu:HTMLMenuElement, meta:HTMLMetaElement, meter:HTMLMeterElement, nav:HTMLElement, noscript:HTMLElement, object:HTMLObjectElement, ol:HTMLOListElement, optgroup:HTMLOptGroupElement, option:HTMLOptionElement, output:HTMLOutputElement, p:HTMLParagraphElement, param:HTMLParamElement, picture:HTMLPictureElement, pre:HTMLPreElement, progress:HTMLProgressElement, q:HTMLQuoteElement, s:HTMLElement, samp:HTMLElement, script:HTMLScriptElement, search:HTMLElement, section:HTMLElement, select:HTMLSelectElement, small:HTMLElement, source:HTMLSourceElement, span:HTMLSpanElement, strong:HTMLElement, style:HTMLStyleElement, sub:HTMLElement, svg:HTMLElement, table:HTMLTableElement, tbody:HTMLTableSectionElement, td:HTMLTableCellElement, template:HTMLTemplateElement, textarea:HTMLTextAreaElement, tfoot:HTMLTableSectionElement, th:HTMLTableCellElement, thead:HTMLTableSectionElement, time:HTMLTimeElement, title:HTMLTitleElement, tr:HTMLTableRowElement, track:HTMLTrackElement, u:HTMLElement, ul:HTMLUListElement, var:HTMLElement, video:HTMLVideoElement, wbr:HTMLElement }} HTML_TAGS
 */
/** @typedef {{'align-content'?:String, 'align-items'?:String, 'align-self'?:String, 'alignment-adjust'?:String, 'alignment-baseline'?:String, 'all'?:String, 'alt'?:String, 'animation'?:String, 'animation-delay'?:String, 'animation-direction'?:String, 'animation-duration'?:String, 'animation-fill-mode'?:String, 'animation-iteration-count'?:String, 'animation-name'?:String, 'animation-play-state'?:String, 'animation-timing-function'?:String, 'aspect-ratio'?:String, 'azimuth'?:String, 'backface-visibility'?:String, 'background'?:String, 'background-attachment'?:String, 'background-clip'?:String, 'background-color'?:String, 'background-image'?:String, 'background-origin'?:String, 'background-position'?:String, 'background-repeat'?:String, 'background-size'?:String, 'background-blend-mode'?:String, 'baseline-shift'?:String, 'bleed'?:String, 'bookmark-label'?:String, 'bookmark-level'?:String, 'bookmark-state'?:String, 'border'?:String, 'border-color'?:String, 'border-style'?:String, 'border-width'?:String, 'border-bottom'?:String, 'border-bottom-color'?:String, 'border-bottom-style'?:String, 'border-bottom-width'?:String, 'border-left'?:String, 'border-left-color'?:String, 'border-left-style'?:String, 'border-left-width'?:String, 'border-right'?:String, 'border-right-color'?:String, 'border-right-style'?:String, 'border-right-width'?:String, 'border-top'?:String, 'border-top-color'?:String, 'border-top-style'?:String, 'border-top-width'?:String, 'border-collapse'?:String, 'border-image'?:String, 'border-image-outset'?:String, 'border-image-repeat'?:String, 'border-image-slice'?:String, 'border-image-source'?:String, 'border-image-width'?:String, 'border-radius'?:String, 'border-bottom-left-radius'?:String, 'border-bottom-right-radius'?:String, 'border-top-left-radius'?:String, 'border-top-right-radius'?:String, 'border-spacing'?:String, 'bottom'?:String, 'box-decoration-break'?:String, 'box-shadow'?:String, 'box-sizing'?:String, 'box-snap'?:String, 'break-after'?:String, 'break-before'?:String, 'break-inside'?:String, 'buffered-rendering'?:String, 'caption-side'?:String, 'clear'?:String, 'clear-side'?:String, 'clip'?:String, 'clip-path'?:String, 'clip-rule'?:String, 'color'?:String, 'color-adjust'?:String, 'color-correction'?:String, 'color-interpolation'?:String, 'color-interpolation-filters'?:String, 'color-profile'?:String, 'color-rendering'?:String, 'column-fill'?:String, 'column-gap'?:String, 'column-rule'?:String, 'column-rule-color'?:String, 'column-rule-style'?:String, 'column-rule-width'?:String, 'column-span'?:String, 'columns'?:String, 'column-count'?:String, 'column-width'?:String, 'contain'?:String, 'content'?:String, 'counter-increment'?:String, 'counter-reset'?:String, 'counter-set'?:String, 'cue'?:String, 'cue-after'?:String, 'cue-before'?:String, 'cursor'?:String, 'direction'?:String, 'display'?:String, 'display-inside'?:String, 'display-outside'?:String, 'display-extras'?:String, 'display-box'?:String, 'dominant-baseline'?:String, 'elevation'?:String, 'empty-cells'?:String, 'enable-background'?:String, 'fill'?:String, 'fill-opacity'?:String, 'fill-rule'?:String, 'filter'?:String, 'float'?:String, 'float-defer-column'?:String, 'float-defer-page'?:String, 'float-offset'?:String, 'float-wrap'?:String, 'flow-into'?:String, 'flow-from'?:String, 'flex'?:String, 'flex-basis'?:String, 'flex-grow'?:String, 'flex-shrink'?:String, 'flex-flow'?:String, 'flex-direction'?:String, 'flex-wrap'?:String, 'flood-color'?:String, 'flood-opacity'?:String, 'font'?:String, 'font-family'?:String, 'font-size'?:String, 'font-stretch'?:String, 'font-style'?:String, 'font-weight'?:String, 'font-feature-settings'?:String, 'font-kerning'?:String, 'font-language-override'?:String, 'font-size-adjust'?:String, 'font-synthesis'?:String, 'font-variant'?:String, 'font-variant-alternates'?:String, 'font-variant-caps'?:String, 'font-variant-east-asian'?:String, 'font-variant-ligatures'?:String, 'font-variant-numeric'?:String, 'font-variant-position'?:String, 'footnote-policy'?:String, 'glyph-orientation-horizontal'?:String, 'glyph-orientation-vertical'?:String, 'grid'?:String, 'grid-auto-flow'?:String, 'grid-auto-columns'?:String, 'grid-auto-rows'?:String, 'grid-template'?:String, 'grid-template-areas'?:String, 'grid-template-columns'?:String, 'grid-template-rows'?:String, 'grid-area'?:String, 'grid-column'?:String, 'grid-column-start'?:String, 'grid-column-end'?:String, 'grid-row'?:String, 'grid-row-start'?:String, 'grid-row-end'?:String, 'hanging-punctuation'?:String, 'height'?:String, 'hyphenate-character'?:String, 'hyphenate-limit-chars'?:String, 'hyphenate-limit-last'?:String, 'hyphenate-limit-lines'?:String, 'hyphenate-limit-zone'?:String, 'hyphens'?:String, 'icon'?:String, 'image-orientation'?:String, 'image-resolution'?:String, 'image-rendering'?:String, 'ime'?:String, 'ime-align'?:String, 'ime-mode'?:String, 'ime-offset'?:String, 'ime-width'?:String, 'initial-letters'?:String, 'inline-box-align'?:String, 'inset'?:String, 'isolation'?:String, 'justify-content'?:String, 'justify-items'?:String, 'justify-self'?:String, 'kerning'?:String, 'left'?:String, 'letter-spacing'?:String, 'lighting-color'?:String, 'line-box-contain'?:String, 'line-break'?:String, 'line-grid'?:String, 'line-height'?:String, 'line-slack'?:String, 'line-snap'?:String, 'list-style'?:String, 'list-style-image'?:String, 'list-style-position'?:String, 'list-style-type'?:String, 'margin'?:String, 'margin-bottom'?:String, 'margin-left'?:String, 'margin-right'?:String, 'margin-top'?:String, 'marker'?:String, 'marker-end'?:String, 'marker-mid'?:String, 'marker-pattern'?:String, 'marker-segment'?:String, 'marker-start'?:String, 'marker-knockout-left'?:String, 'marker-knockout-right'?:String, 'marker-side'?:String, 'marks'?:String, 'marquee-direction'?:String, 'marquee-play-count'?:String, 'marquee-speed'?:String, 'marquee-style'?:String, 'mask'?:String, 'mask-image'?:String, 'mask-repeat'?:String, 'mask-position'?:String, 'mask-clip'?:String, 'mask-origin'?:String, 'mask-size'?:String, 'mask-box'?:String, 'mask-box-outset'?:String, 'mask-box-repeat'?:String, 'mask-box-slice'?:String, 'mask-box-source'?:String, 'mask-box-width'?:String, 'mask-type'?:String, 'max-height'?:String, 'max-lines'?:String, 'max-width'?:String, 'min-height'?:String, 'min-width'?:String, 'mix-blend-mode'?:String, 'nav-down'?:String, 'nav-index'?:String, 'nav-left'?:String, 'nav-right'?:String, 'nav-up'?:String, 'object-fit'?:String, 'object-position'?:String, 'offset-after'?:String, 'offset-before'?:String, 'offset-end'?:String, 'offset-start'?:String, 'opacity'?:String, 'order'?:String, 'orphans'?:String, 'outline'?:String, 'outline-color'?:String, 'outline-style'?:String, 'outline-width'?:String, 'outline-offset'?:String, 'overflow'?:String, 'overflow-x'?:String, 'overflow-y'?:String, 'overflow-style'?:String, 'overflow-wrap'?:String, 'padding'?:String, 'padding-bottom'?:String, 'padding-left'?:String, 'padding-right'?:String, 'padding-top'?:String, 'page'?:String, 'page-break-after'?:String, 'page-break-before'?:String, 'page-break-inside'?:String, 'paint-order'?:String, 'pause'?:String, 'pause-after'?:String, 'pause-before'?:String, 'perspective'?:String, 'perspective-origin'?:String, 'pitch'?:String, 'pitch-range'?:String, 'play-during'?:String, 'pointer-events'?:String, 'position'?:String, 'quotes'?:String, 'region-fragment'?:String, 'resize'?:String, 'rest'?:String, 'rest-after'?:String, 'rest-before'?:String, 'richness'?:String, 'right'?:String, 'ruby-align'?:String, 'ruby-merge'?:String, 'ruby-position'?:String, 'scroll-behavior'?:String, 'scroll-snap-coordinate'?:String, 'scroll-snap-destination'?:String, 'scroll-snap-points-x'?:String, 'scroll-snap-points-y'?:String, 'scroll-snap-type'?:String, 'shape-image-threshold'?:String, 'shape-inside'?:String, 'shape-margin'?:String, 'shape-outside'?:String, 'shape-padding'?:String, 'shape-rendering'?:String, 'size'?:String, 'speak'?:String, 'speak-as'?:String, 'speak-header'?:String, 'speak-numeral'?:String, 'speak-punctuation'?:String, 'speech-rate'?:String, 'stop-color'?:String, 'stop-opacity'?:String, 'stress'?:String, 'string-set'?:String, 'stroke'?:String, 'stroke-dasharray'?:String, 'stroke-dashoffset'?:String, 'stroke-linecap'?:String, 'stroke-linejoin'?:String, 'stroke-miterlimit'?:String, 'stroke-opacity'?:String, 'stroke-width'?:String, 'tab-size'?:String, 'table-layout'?:String, 'text-align'?:String, 'text-align-all'?:String, 'text-align-last'?:String, 'text-anchor'?:String, 'text-combine-upright'?:String, 'text-decoration'?:String, 'text-decoration-color'?:String, 'text-decoration-line'?:String, 'text-decoration-style'?:String, 'text-decoration-skip'?:String, 'text-emphasis'?:String, 'text-emphasis-color'?:String, 'text-emphasis-style'?:String, 'text-emphasis-position'?:String, 'text-emphasis-skip'?:String, 'text-height'?:String, 'text-indent'?:String, 'text-justify'?:String, 'text-orientation'?:String, 'text-overflow'?:String, 'text-rendering'?:String, 'text-shadow'?:String, 'text-size-adjust'?:String, 'text-space-collapse'?:String, 'text-spacing'?:String, 'text-transform'?:String, 'text-underline-position'?:String, 'text-wrap'?:String, 'top'?:String, 'touch-action'?:String, 'transform'?:String, 'transform-box'?:String, 'transform-origin'?:String, 'transform-style'?:String, 'transition'?:String, 'transition-delay'?:String, 'transition-duration'?:String, 'transition-property'?:String, 'transition-timing-functionunicode-bidi'?:String, 'vector-effect'?:String, 'vertical-align'?:String, 'visibility'?:String, 'voice-balance'?:String, 'voice-duration'?:String, 'voice-family'?:String, 'voice-pitch'?:String, 'voice-range'?:String, 'voice-rate'?:String, 'voice-stress'?:String, 'voice-volumn'?:String, 'volume'?:String, 'white-space'?:String, 'widows'?:String, 'width'?:String, 'will-change'?:String, 'word-break'?:String, 'word-spacing'?:String, 'word-wrap'?:String, 'wrap-flow'?:String, 'wrap-through'?:String, 'writing-mode'?:String, 'z-index'?:String}} CSS_VALUES_NONVAR */
/** @typedef {CSS_VALUES_NONVAR & {[id:String]: String}} CSS_VALUES_NON_AFTER_BEFORE */
/** @typedef {CSS_VALUES_NON_AFTER_BEFORE & {'::before'?: CSS_VALUES_NON_AFTER_BEFORE, '::after'?: CSS_VALUES_NON_AFTER_BEFORE, ':before'?: CSS_VALUES_NON_AFTER_BEFORE, ':after'?: CSS_VALUES_NON_AFTER_BEFORE, 'before'?: CSS_VALUES_NON_AFTER_BEFORE, 'after'?: CSS_VALUES_NON_AFTER_BEFORE, 'hover'?: CSS_VALUES_NON_AFTER_BEFORE, ':hover'?: CSS_VALUES_NON_AFTER_BEFORE,'::hover'?: CSS_VALUES_NON_AFTER_BEFORE}} CSS_VALUES */
/** @typedef {keyof CSS_VALUES_NONVAR|String} CSS_PROPERTY */
/** @typedef {{'accept'?:String, 'accept-charset'?:String, 'accesskey'?:String, 'action'?: String, 'alt'?:String, 'async'?:String, 'autocomplete'?:String, 'autofocus'?:String, 'autoplay'?:String, 'charset'?:String, 'checked'?:String, 'cite'?:String, 'class'?:String, 'cols'?:String, 'colspan'?:String, 'content'?:String, 'contenteditable'?:String, 'controls'?:String, 'coords'?:String, 'data'?:String, 'datetime'?:String, 'default'?:String, 'defer'?:String, 'dir'?:String, 'dirname'?:String, 'disabled'?:String, 'download'?:String, 'draggable'?:String, 'enctype'?:String, 'enterkeyhint'?:String, 'for'?:String, 'form'?:String, 'formaction'?:String, 'headers'?:String, 'height'?:String, 'hidden'?:String, 'high'?:String, 'href'?:String, 'hreflang'?:String, 'http-equiv'?:String, 'id'?:String, 'inert'?:String, 'inputmode'?:String, 'ismap'?:string, 'kind'?:String, 'label'?:String, 'lang'?:String, 'list'?:String, 'loop'?:String, 'low'?:String, 'max'?:String, 'maxlength'?:String, 'media'?:String, 'method'?:String, 'min'?:String, 'multiple'?:String, 'muted'?:String, 'name'?:String, 'novalidate'?:String, 'onabort'?:String, 'onafterprint'?:String, 'onbeforeprint'?:String, 'onbeforeunload'?:String, 'onblur'?:String, 'oncanplay'?:String, 'oncanplaythrough'?:String, 'onchange'?:String, 'onclick'?:String, 'oncontextmenu'?:String, 'oncopy'?:String, 'oncuechange'?:String, 'oncut'?:String, 'ondblclick'?:String, 'ondrag'?:String, 'ondragend'?:String, 'ondragenter'?:String, 'ondragleave'?:String, 'ondragover'?:String, 'ondragstart'?:String, 'ondrop'?:String, 'ondurationchange'?:String, 'onemptied'?:String, 'onended'?:String, 'onerror'?:String, 'onfocus'?:String, 'onhashchange'?:String, 'oninput'?:String, 'oninvalid'?:String, 'onkeydown'?:String, 'onkeypress'?:String, 'onkeyup'?:String, 'onload'?:String, 'onloadeddata'?:String, 'onloadedmetadata'?:String, 'onloadstart'?:String, 'onmousedown'?:String, 'onmousemove'?:String, 'onmouseout'?:String, 'onmouseover'?:String, 'onmouseup'?:String, 'onmousewheel'?:String, 'onoffline'?:String, 'ononline'?:String, 'onpagehide'?:String, 'onpageshow'?:String, 'onpaste'?:String, 'onpause'?:String, 'onplay'?:String, 'onplaying'?:String, 'onpopstate'?:String, 'onprogress'?:String, 'onratechange'?:String, 'onreset'?:String, 'onresize'?:String, 'onscroll'?:String, 'onsearch'?:String, 'onseeked'?:String, 'onseeking'?:String, 'onselect'?:String, 'onstalled'?:String, 'onstorage'?:String, 'onsubmit'?:String, 'onsuspend'?:String, 'ontimeupdate'?:String, 'ontoggle'?:String, 'onunload'?:String, 'onvolumechange'?:String, 'onwaiting'?:String, 'onwheel'?:String, 'open'?:String, 'optimum'?:String, 'pattern'?:String, 'placeholder'?:String, 'popover'?:String, 'popovertarget'?:String, 'popovertargetaction'?:String, 'poster'?:String, 'preload'?:String, 'readonly'?:String, 'rel'?:String, 'required'?:String, 'reversed'?:String, 'rows'?:String, 'rowspan'?:String, 'sandbox'?:String, 'scope'?:String, 'selected'?:String, 'shape'?:String, 'size'?:String, 'sizes'?:String, 'span'?:String, 'spellcheck'?:String, 'src'?:String, 'srcdoc'?:String, 'srclang'?:String, 'srcset'?:String, 'start'?:String, 'step'?:String, 'style'?:String, 'tabindex'?:String, 'target'?:String, 'title'?:String, 'translate'?:String, 'type'?:String, 'usemap'?:String, 'value'?:String, 'width'?:String, 'wrap'?:String }} HTML_ATTRS_NOVAR */
/** @typedef {HTML_ATTRS_NOVAR & {[id:String]: String}} HTML_ATTRS */
/** @typedef {('id'|'accept'|'accept-charset'|'accesskey'|'action'|'alt'|'async'|'autocomplete'|'autofocus'|'autoplay'|'charset'|'checked'|'cite'|'class'|'cols'|'colspan'|'content'|'contenteditable'|'controls'|'coords'|'data'|'datetime'|'default'|'defer'|'dir'|'dirname'|'disabled'|'download'|'draggable'|'enctype'|'enterkeyhint'|'for'|'form'|'formaction'|'headers'|'height'|'hidden'|'high'|'href'|'hreflang'|'http-equiv'|'id'|'inert'|'inputmode'|'ismap'|'kind'|'label'|'lang'|'list'|'loop'|'low'|'max'|'maxlength'|'media'|'method'|'min'|'multiple'|'muted'|'name'|'novalidate'|'onabort'|'onafterprint'|'onbeforeprint'|'onbeforeunload'|'onblur'|'oncanplay'|'oncanplaythrough'|'onchange'|'onclick'|'oncontextmenu'|'oncopy'|'oncuechange'|'oncut'|'ondblclick'|'ondrag'|'ondragend'|'ondragenter'|'ondragleave'|'ondragover'|'ondragstart'|'ondrop'|'ondurationchange'|'onemptied'|'onended'|'onerror'|'onfocus'|'onhashchange'|'oninput'|'oninvalid'|'onkeydown'|'onkeypress'|'onkeyup'|'onload'|'onloadeddata'|'onloadedmetadata'|'onloadstart'|'onmousedown'|'onmousemove'|'onmouseout'|'onmouseover'|'onmouseup'|'onmousewheel'|'onoffline'|'ononline'|'onpagehide'|'onpageshow'|'onpaste'|'onpause'|'onplay'|'onplaying'|'onpopstate'|'onprogress'|'onratechange'|'onreset'|'onresize'|'onscroll'|'onsearch'|'onseeked'|'onseeking'|'onselect'|'onstalled'|'onstorage'|'onsubmit'|'onsuspend'|'ontimeupdate'|'ontoggle'|'onunload'|'onvolumechange'|'onwaiting'|'onwheel'|'open'|'optimum'|'pattern'|'placeholder'|'popover'|'popovertarget'|'popovertargetaction'|'poster'|'preload'|'readonly'|'rel'|'required'|'reversed'|'rows'|'rowspan'|'sandbox'|'scope'|'selected'|'shape'|'size'|'sizes'|'span'|'spellcheck'|'src'|'srcdoc'|'srclang'|'srcset'|'start'|'step'|'style'|'tabindex'|'target'|'title'|'translate'|'type'|'usemap'|'value'|'width'|'wrap')} HTML_ATTR_NOVAR */
/** @typedef {HTML_ATTR_NOVAR|String} HTML_ATTR */
/** @typedef {{type: keyof HTML_TAGS, classNames?:Array<String>, params?:{attibutes?: HTML_ATTRS, css?: CSS_VALUES}, content?: String|Array<CONTENT>}} CONTENT */
/**
 * @typedef {Object} BOUNDS
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */
/** @typedef {{'AliceBlue': '#F0F8FF', 'AntiqueWhite': '#FAEBD7', 'Aqua': '#00FFFF', 'Aquamarine': '#7FFFD4', 'Azure': '#F0FFFF', 'Beige': '#F5F5DC', 'Bisque': '#FFE4C4', 'Black': '#000000', 'BlanchedAlmond': '#FFEBCD', 'Blue': '#0000FF', 'BlueViolet': '#8A2BE2', 'Brown': '#A52A2A', 'BurlyWood': '#DEB887', 'CadetBlue': '#5F9EA0', 'Chartreuse': '#7FFF00', 'Chocolate': '#D2691E', 'Coral': '#FF7F50', 'CornflowerBlue': '#6495ED', 'Cornsilk': '#FFF8DC', 'Crimson': '#DC143C', 'Cyan': '#00FFFF', 'DarkBlue': '#00008B', 'DarkCyan': '#008B8B', 'DarkGoldenRod': '#B8860B', 'DarkGray': '#A9A9A9', 'DarkGrey': '#A9A9A9', 'DarkGreen': '#006400', 'DarkKhaki': '#BDB76B', 'DarkMagenta': '#8B008B', 'DarkOliveGreen': '#556B2F', 'DarkOrange': '#FF8C00', 'DarkOrchid': '#9932CC', 'DarkRed': '#8B0000', 'DarkSalmon': '#E9967A', 'DarkSeaGreen': '#8FBC8F', 'DarkSlateBlue': '#483D8B', 'DarkSlateGray': '#2F4F4F', 'DarkSlateGrey': '#2F4F4F', 'DarkTurquoise': '#00CED1', 'DarkViolet': '#9400D3', 'DeepPink': '#FF1493', 'DeepSkyBlue': '#00BFFF', 'DimGray': '#696969', 'DimGrey': '#696969', 'DodgerBlue': '#696969', 'FireBrick': '#B22222', 'FloralWhite': '#FFFAF0', 'ForestGreen': '#228B22', 'Fuchsia': '#FF00FF', 'Gainsboro': '#DCDCDC', 'GhostWhite': '#F8F8FF', 'Gold': '#FFD700', 'GoldenRod': '#DAA520', 'Gray': '#808080', 'Grey': '#808080', 'Green': '#008000', 'GreenYellow': '#ADFF2F', 'HoneyDew': '#F0FFF0', 'HotPink': '#FF69B4', 'IndianRed': '#CD5C5C', 'Indigo': '#4B0082', 'Ivory': '#FFFFF0', 'Khaki': '#F0E68C', 'Lavender': '#E6E6FA', 'LavenderBlush': '#FFF0F5', 'LawnGreen': '#7CFC00', 'LemonChiffon': '#FFFACD', 'LightBlue': '#ADD8E6', 'LightCoral': '#F08080', 'LightCyan': '#E0FFFF', 'LightGoldenRodYellow': '#FAFAD2', 'LightGray': '#D3D3D3', 'LightGrey': '#D3D3D3', 'LightGreen': '#90EE90', 'LightPink': '#FFB6C1', 'LightSalmon': '#FFA07A', 'LightSeaGreen': '#20B2AA', 'LightSkyBlue': '#87CEFA', 'LightSlateGray': '#778899', 'LightSlateGrey': '#778899', 'LightSteelBlue': '#B0C4DE', 'LightYellow': '#FFFFE0', 'Lime': '#00FF00', 'LimeGreen': '#32CD32', 'Linen': '#FAF0E6', 'Magenta': '#FF00FF', 'Maroon': '#800000', 'MediumAquaMarine': '#66CDAA', 'MediumBlue': '#0000CD', 'MediumOrchid': '#BA55D3', 'MediumPurple': '#9370DB', 'MediumSeaGreen': '#3CB371', 'MediumSlateBlue': '#7B68EE', 'MediumSpringGreen': '#00FA9A', 'MediumTurquoise': '#48D1CC', 'MediumVioletRed': '#C71585', 'MidnightBlue': '#191970', 'MintCream': '#F5FFFA', 'MistyRose': '#FFE4E1', 'Moccasin': '#FFE4B5', 'NavajoWhite': '#FFDEAD', 'Navy': '#000080', 'OldLace': '#FDF5E6', 'Olive': '#808000', 'OliveDrab': '#6B8E23', 'Orange': '#FFA500', 'OrangeRed': '#FF4500', 'Orchid': '#DA70D6', 'PaleGoldenRod': '#EEE8AA', 'PaleGreen': '#98FB98', 'PaleTurquoise': '#AFEEEE', 'PaleVioletRed': '#DB7093', 'PapayaWhip': '#FFEFD5', 'PeachPuff': '#FFDAB9', 'Peru': '#CD853F', 'Pink': '#FFC0CB', 'Plum': '#DDA0DD', 'PowderBlue': '#B0E0E6', 'Purple': '#800080', 'RebeccaPurple': '#663399', 'Red': '#FF0000', 'RosyBrown': '#BC8F8F', 'RoyalBlue': '#4169E1', 'SaddleBrown': '#8B4513', 'Salmon': '#FA8072', 'SandyBrown': '#F4A460', 'SeaGreen': '#2E8B57', 'SeaShell': '#FFF5EE', 'Sienna': '#A0522D', 'Silver': '#C0C0C0', 'SkyBlue': '#87CEEB', 'SlateBlue': '#6A5ACD', 'SlateGray': '#708090', 'SlateGrey': '#708090', 'Snow': '#FFFAFA', 'SpringGreen': '#00FF7F', 'SteelBlue': '#4682B4', 'Tan': '#D2B48C', 'Teal': '#008080', 'Thistle': '#D8BFD8', 'Tomato': '#FF6347', 'Turquoise': '#40E0D0', 'Violet': '#EE82EE', 'Wheat': '#F5DEB3', 'White': '#FFFFFF', 'WhiteSmoke': '#F5F5F5', 'Yellow': '#FFFF00', 'YellowGreen': '#9ACD32'}} BASE_COLORS */
/** @typedef {keyof BASE_COLORS} BASE_COLOR */
/**
 * kolor rgb
 * @typedef {Object} rgb
 * @property {number} r - poziom czerwonego (od 0 do 255)
 * @property {number} g - poziom zielonego (od 0 do 255)
 * @property {number} b - poziom niebieskiego (od 0 do 255)
 */
/**
 * kolor rgb
 * @typedef {Object} rgba
 * @property {number} r - poziom czerwonego (od 0 do 255)
 * @property {number} g - poziom zielonego (od 0 do 255)
 * @property {number} b - poziom niebieskiego (od 0 do 255)
 * @property {number} a - poziom alfa (od 0 do 1)
 */
/**
 * kolor hsl
 * @typedef {Object} hsl
 * @property {number} h - zabarwienie (od 0 do 360)
 * @property {number} s - nasycenie
 * @property {number} l - jasność
 */
class Utils {
    /**
     * Zwraca niektóre z wartości css w formie liczby (reprezentującej piksele)
     * @param {HTMLElement} element - wybrany element html
     * @param {('column-gap'|'row-gap'|'border-left-width'|'border-right-width'|'border-bottom-width'|'border-top-width'|'padding-top'|'padding-bottom'|'padding-left'|'padding-right'|'margin-top'|'margin-bottom'|'margin-left'|'margin-right'|'width'|'height'|'left'|'top'|'right'|'bottom'|'z-index'|'--rotation'|'--temp_rotation')} valueName - nazwa właściwości
     * @param {Boolean} [useInline=false] - czy uzywać tylko styli wpisanych w inline
     * @returns {Number}
     */
    static getCssValueAsNumber = (element, valueName, useInline = false) => {
        let returnValue = 0;

        let tempCompStyle = window.getComputedStyle(element);
        let value = tempCompStyle.getPropertyValue(valueName);
        if (useInline) {
            let attrs = this.getCssValuesFromAttr(element);
            if (attrs[valueName]) {
                value = attrs[valueName];
            } else {
                value = '';
            }
        }

        let unit = value.match(/(\%)|(px)|(vw)|(vh)|(lvh)|(lvw)|(dvw)|(dvh)|(deg)/gmi);
        if (unit != null) {
            switch (unit[0]) {
                case '%': {
                    let numberValue = Number(value.replaceAll(/\%/gmi, ''));
                    /** @type {HTMLElement} */ //@ts-ignore
                    let parent = element.offsetParent;
                    if (!isNaN(numberValue) && parent) {
                        switch (valueName) {
                            case 'border-bottom-width':
                            case 'border-top-width':
                            case 'padding-bottom':
                            case 'padding-top':
                            case 'margin-bottom':
                            case 'margin-top':
                            case 'bottom':
                            case 'top':
                            case 'height': {
                                let borderTop = Utils.getCssValueAsNumber(parent, 'border-top-width');
                                let borderBot = Utils.getCssValueAsNumber(parent, 'border-bottom-width');
                                let parentHeight = parent.offsetHeight - (borderBot + borderTop);
                                returnValue = parentHeight * (numberValue / 100);
                                break;
                            }
                            case 'border-left-width':
                            case 'border-right-width':
                            case 'padding-left':
                            case 'padding-right':
                            case 'margin-left':
                            case 'margin-right':
                            case 'left':
                            case 'right':
                            case 'width': {
                                let borderLeft = Utils.getCssValueAsNumber(parent, 'border-left-width');
                                let borderRight = Utils.getCssValueAsNumber(parent, 'border-right-width');
                                let parentWidth = parent.offsetWidth - (borderLeft + borderRight);
                                returnValue = parentWidth * (numberValue / 100);
                                break;
                            }
                            case 'column-gap': {
                                let borderLeft = Utils.getCssValueAsNumber(element, 'border-left-width');
                                let borderRight = Utils.getCssValueAsNumber(element, 'border-right-width');
                                let parentWidth = element.offsetWidth - (borderLeft + borderRight);
                                returnValue = parentWidth * (numberValue / 100);
                                break;
                            }
                            case 'row-gap': {
                                let borderBot = Utils.getCssValueAsNumber(element, 'border-top-width');
                                let borderTop = Utils.getCssValueAsNumber(element, 'border-bottom-width');
                                let parentWidth = element.offsetHeight - (borderBot + borderTop);
                                returnValue = parentWidth * (numberValue / 100);
                                break;
                            }
                        }
                    }
                    break;
                }
                case 'px': {
                    let numberValue = Number(value.replaceAll(/px/gmi, ''));
                    if (!isNaN(numberValue)) {
                        returnValue = numberValue;
                    }
                    break;
                }
                case 'vw':
                case 'lvw':
                case 'dvw': {
                    let numberValue = Number(value.replaceAll(/(vw)|(lvw)|(dvw)/gmi, ''));
                    if (!isNaN(numberValue)) {
                        returnValue = window.innerWidth * (numberValue / 100);
                    }
                    break;
                }
                case 'vh':
                case 'lvh':
                case 'dvh': {
                    let numberValue = Number(value.replaceAll(/(vh)|(lvh)|(dvh)/gmi, ''));
                    if (!isNaN(numberValue)) {
                        returnValue = window.innerHeight * (numberValue / 100);
                    }
                    break;
                }
                case 'deg': {
                    let numberValue = Number(value.replaceAll(/(deg)/gmi, ''));
                    if (!isNaN(numberValue)) {
                        returnValue = numberValue;
                    }
                    break;
                }
            }
        } else if (valueName == 'z-index') {
            let numberValue = Number(value);
            if (!isNaN(numberValue)) {
                returnValue = numberValue;
            }
        }
        return returnValue;
    }
    /**
     * Zwraca daną wartośc css
     * @param {HTMLElement} element - wybrany element html
     * @param {CSS_PROPERTY} valueName
     * @param {Boolean} [useInline=false] - czy uzywać tylko styli wpisanych w inline
     * @returns {String}
     */
    static getCssValue = (element, valueName, useInline = false) => {
        if (useInline) {
            let attrs = this.getCssValuesFromAttr(element);
            if (attrs[valueName]) {
                return attrs[valueName];
            } else {
                return '';
            }
        } else {
            let tempCompStyle = window.getComputedStyle(element);
            return tempCompStyle.getPropertyValue(valueName)
        };
    }

    /**
     * Zwraca daną wartość css, rozpatrując tylko właściwości wpisane inline
     * @param {String} attrString 
     * @returns {{[id:string]: string}}
     */
    static getCssValuesFromString = (attrString) => {
        let attrs = {};
        if(attrString) {
            const atrrArr = attrString.split(';');
            atrrArr.forEach((atrrData) => {
                if(atrrData.length > 0) {
                    let attrName = atrrData.slice(0, atrrData.indexOf(':')).replaceAll(/\s/gmi, '');
                    let attrValue = atrrData.slice(atrrData.indexOf(':') + 1).replaceAll('!important', '').replaceAll(/(\s*$)|(^\s*)/gmi, '');
                    attrs[attrName] = attrValue;
                }
            });
        }
        //@ts-ignore
        return attrs;
    }
    /**
     * Zwraca daną wartość css, rozpatrując tylko właściwości wpisane inline
     * @param {HTMLElement} element 
     * @returns {{[id:string]: string}}
     */
    static getCssValuesFromAttr = (element) => {
        let attrs = {};
        const attrString = element.getAttribute('style');
        if (attrString) {
            const atrrArr = attrString.split(';');
            atrrArr.forEach((atrrData) => {
                if (atrrData.length > 0) {
                    let attrName = atrrData.slice(0, atrrData.indexOf(':')).replaceAll(/\s/gmi, '');
                    let attrValue = atrrData.slice(atrrData.indexOf(':') + 1).replaceAll('!important', '').replaceAll(/(\s*$)|(^\s*)/gmi, '');
                    attrs[attrName] = attrValue;
                }
            });
        }
        //@ts-ignore
        return attrs;
    }
    /**
     * @param {HTMLElement} element
     * @returns {BOUNDS}
     */
    static getPosition = (element) => {
        /** @type {BOUNDS} */
        let bounds = { left: element.offsetLeft, top: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
        /** @type {HTMLElement|Null} */ //@ts-ignore
        let currentEl = element.offsetParent;
        while (currentEl) {
            bounds.left += currentEl.offsetLeft;
            bounds.top += currentEl.offsetTop;//@ts-ignore
            currentEl = currentEl.offsetParent;
        }
        return bounds;
    }
    /**
     * @param {HTMLElement} element0 
     * @param {HTMLElement} element1
     * @returns {BOUNDS}
     */
    static getPositionRelativeTo = (element0, element1) => {
        let bounds0 = this.getPosition(element0);
        let bounds1 = this.getPosition(element1);
        bounds0.left = bounds0.left - bounds1.left;
        bounds0.top = bounds0.top - bounds1.top;
        return bounds0;
    }
    /**
     * @param {Array<HTMLElement>|HTMLElement} elements
     * @returns {Number}
     */
    static getTransitionTime = (elements) => {
        let time = 0;
        const getTime = (element) => {
            let tempCompStyle = window.getComputedStyle(element);
            let transitionTime = 0;
            if (!isNaN(Number(tempCompStyle.getPropertyValue('transition-duration').replaceAll(/[^123456789\-\.\,]/gmi, '')))) {
                transitionTime = Number(tempCompStyle.getPropertyValue('transition-duration').replaceAll(/[^123456789\-\.\,]/gmi, '')) * 1000;
            }
            if (!isNaN(Number(tempCompStyle.getPropertyValue('transition-delay').replaceAll(/[^123456789\-\.\,]/gmi, '')))) {
                transitionTime += Number(tempCompStyle.getPropertyValue('transition-delay').replaceAll(/[^123456789\-\.\,]/gmi, '')) * 1000;
            }
            let animationTime = 0;
            if (!isNaN(Number(tempCompStyle.getPropertyValue('animation-duration').replaceAll(/[^123456789\-\.\,]/gmi, '')))) {
                animationTime = Number(tempCompStyle.getPropertyValue('animation-duration').replaceAll(/[^123456789\-\.\,]/gmi, '')) * 1000;
            }
            if (!isNaN(Number(tempCompStyle.getPropertyValue('animation-delay').replaceAll(/[^123456789\-\.\,]/gmi, '')))) {
                animationTime += Number(tempCompStyle.getPropertyValue('animation-delay').replaceAll(/[^123456789\-\.\,]/gmi, '')) * 1000;
            }
            if (time < Math.max(transitionTime, animationTime)) {
                time = Math.max(transitionTime, animationTime);
            }
        }
        if(Array.isArray(elements)) {
            elements.forEach((element) => {
                getTime(element);
            });
        } else {
            getTime(elements);
        }
        return time;
    }
    /**
     * generuje unikalne id (nie powtarzane w obrebie jednej strony/zadania), id moze byc poprzedzone i zakonczone podanym ciagiem znakow
     * @param {number} [length=10] - długośc id
     * @param {string} [startWith=''] - początkowy ciąg znaków
     * @param {string} [endWith=''] - końcowy ciąg znaków
     * @param {('all'|'lowercase'|'uppercase'|'none')} [charcase='all'] - jakich znaków uzywać w tworzonym id
     * @param {Boolean} [allowNumbers=true] - czy uzywać liczb
     * @returns {string}
     */
    static makeId = (length = 10, startWith = '', endWith = '', charcase = 'all', allowNumbers = true) => {
        /**
         * @param {Number} _length 
         * @returns {String}
         */
        let make = (_length) => {
            let result = '';
            let characters = '';
            switch (charcase) {
                case "all": // @ts-ignore
                case "lowercase": {
                    characters += 'abcdefghijklmnopqrstuvwxyz';
                    if (charcase == 'lowercase') {
                        break;
                    }
                }
                case "uppercase": {
                    characters += 'ABCDEFGHIJKLMNOPQRSTUVXYZ';
                    break;
                }
            }
            if (allowNumbers) {
                characters += '0123456789';
            } else if (characters.length == 0) {
                characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';
            }
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < _length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        }
        return `${startWith}${make(length)}${endWith}`;
    };
    /**
     * @param {Number} [min] 
     * @param {Number} [max] 
     * @returns {Number}
     */
    static randomInRange = (min=0, max=Number.MAX_SAFE_INTEGER) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @template {*} SRC_ARR_TYPE
     * @param {Array<SRC_ARR_TYPE>} arr
     * @returns {SRC_ARR_TYPE}
     */
    static getRandomArrayElement = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    /**
     * @template {{[id:string]:Number}} PROBABILITY
     * @param {PROBABILITY} probability 
     * @returns {keyof PROBABILITY}
     */
    static getRandomWithProbability = (probability) => {
        let max = 0;

        let tenthPow = 0;

        Object.keys(probability).forEach((key) => {
            let currentPow = 0;
            while(Math.floor(probability[key] * Math.pow(10, currentPow)) !== probability[key] * Math.pow(10, currentPow)) {
                currentPow++;
            }
            if(currentPow > tenthPow) {
                tenthPow = currentPow+0;
            }
        });
        
        /** @type {{[id:string]: {min: Number, max: Number}}} */
        let parsedProbability = {};
        Object.keys(probability).forEach((key) => {
            parsedProbability[key] = {min: max+0, max: 0};
            max += probability[key]*Math.pow(10, tenthPow);
            parsedProbability[key].max = max+0;
        });

        let random = Math.floor(Math.random() * max);
        /** @type {keyof PROBABILITY|null} */
        let foundKey = null;
        let iterator = 0;

        while(foundKey == null && iterator < Object.keys(parsedProbability).length) {
            if (random >= parsedProbability[Object.keys(parsedProbability)[iterator]].min && random < parsedProbability[Object.keys(parsedProbability)[iterator]].max) {
                foundKey = `${Object.keys(parsedProbability)[iterator]}`;
            }
            iterator++;
        }
        if(foundKey == null) {
            return `${Object.keys(probability)[Math.floor(Math.random() * Object.keys(probability).length)]}`;
        }

        return foundKey;
    }

    /**
     * @template {keyof HTML_TAGS} T
     * @param {T} type
     * @param {Array<String>} [classNames=[]]
     * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
     * @param {String|null|Array<CONTENT>} [content=null]
     * @returns {HTML_TAGS[T]}
     */
    static createHTMLElement = (type, classNames = [], params = {}, content=null) => {
        /** @type {HTML_TAGS[T]} */  //@ts-ignore
        const element = document.createElement(type);
        if(params.attibutes) {
            Object.keys(params.attibutes).forEach((key) => {
                element.setAttribute(key, params.attibutes[key]);
            });
        }
        classNames.forEach((className) => { element.classList.add(className); })
        if(params.css) {
            let cssString = '';
            if(params.attibutes) {
                if(params.attibutes.style) {
                    cssString = `${params.attibutes.style.trim()}`;
                }
            }
            Object.keys(params.css).forEach((key) => {
                switch(key.trim().toLowerCase()) {
                    case 'after':
                    case 'before':
                    case ':after':
                    case 'hover':
                    case ':hover':
                    case '::hover':
                    case ':before':
                    case '::after':
                    case '::before': {
                        if (typeof params.css[key] == 'object' && !Array.isArray(params.css)) {
                            let id = '';
                            if (params?.attibutes?.id) {
                                id = params.attibutes.id.trim();
                            } else {
                                id = Utils.makeId(10, '', '', "uppercase", false);
                            }
                            let _cssString = `${id}:before {`;
                            Object.keys(params.css[key]).forEach((_key) => {
                                _cssString += ` ${_key.trim().replaceAll(/[\"\'\`\:]/gmi, '')}: ${params.css[key][_key].trim().replaceAll(';', '')};`;
                            });
                            _cssString += ` }`;
                            Utils.createAndAppendHTMLElement(document.body, 'style', [], {attibutes: {'data-style-of': id}}, _cssString);
                        }
                        break;
                    }
                    default: {
                        cssString += ` ${key.trim().replaceAll(/[\"\'\`\:]/gmi, '')}: ${params.css[key].trim().replaceAll(';', '')};`;
                        break;
                    }
                }
            });
            if(cssString.trim() !== '') {
                element.setAttribute('style', cssString);
            }
        }
        if (content) {
            if (typeof content == 'string') {
                element.innerHTML = content.trim();
            } else if (Array.isArray(content)) {
                content.forEach((entry) => {
                    let classNames = [];
                    if (entry.classNames) {
                        classNames = entry.classNames;
                    }
                    let params = {};
                    if (entry.params) {
                        params = entry.params;
                    }
                    let content = null;
                    if (entry.content) {
                        content = content;
                    }
                    Utils.createAndAppendHTMLElement(element, entry.type, classNames, params, content);
                });
            }
        }
        return element;
    }

    /**
     * @template {keyof HTML_TAGS} T
     * @param {HTMLElement} parent
     * @param {T} type
     * @param {Array<String>} [classNames=[]]
     * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
     * @param {String|null|Array<CONTENT>} [content=null]
     * @returns {HTML_TAGS[T]}
     */
    static createAndAppendHTMLElement = (parent, type, classNames = [], params = {}, content=null) => {
        /** @type {HTML_TAGS[T]} */  //@ts-ignore
        const element = Utils.createHTMLElement(type, classNames, params, content);
        parent.append(element);
        return element;
    }

    /**
     * @template {keyof HTML_TAGS} T
     * @param {HTMLElement} parent
     * @param {T} type
     * @param {Array<String>} [classNames=[]]
     * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
     * @param {String|null|Array<CONTENT>} [content=null]
     * @returns {HTML_TAGS[T]}
     */
    static createAndPreppendHTMLElement = (parent, type, classNames = [], params = {}, content = null) => {
        /** @type {HTML_TAGS[T]} */  //@ts-ignore
        const element = Utils.createHTMLElement(type, classNames, params, content);
        parent.prepend(element);
        return element;
    }

    /**
     * @template {keyof HTML_TAGS} T
     * @param {HTMLElement} sibling
     * @param {T} type
     * @param {Array<String>} [classNames=[]]
     * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
     * @param {String|null|Array<CONTENT>} [content=null]
     * @returns {HTML_TAGS[T]}
     */
    static createAndInsertBeforeHTMLElement = (sibling, type, classNames = [], params = {}, content = null) => {
        /** @type {HTML_TAGS[T]} */  //@ts-ignore
        const element = Utils.createHTMLElement(type, classNames, params, content);
        sibling.before(element);
        return element;
    }

    /**
     * @template {keyof HTML_TAGS} T
     * @param {HTMLElement} sibling
     * @param {T} type
     * @param {Array<String>} [classNames=[]]
     * @param {{attibutes?: HTML_ATTRS, css?: CSS_VALUES}} [params = {}]
     * @param {String|null|Array<CONTENT>} [content=null]
     * @returns {HTML_TAGS[T]}
     */
    static createAndInsertAfterHTMLElement = (sibling, type, classNames = [], params = {}, content = null) => {
        /** @type {HTML_TAGS[T]} */  //@ts-ignore
        const element = Utils.createHTMLElement(type, classNames, params, content);
        sibling.after(element);
        return element;
    }

    /**
     * Nadaje elementowi właściwości css
     * @param {HTMLElement} element - Element do którego dodać właściwościś
     * @param {CSS_VALUES} [cssAttributes={}] - Obiekt zawierający właściwości css które nalezy dodać do tego elementu. Atrybuty powinny być podane w formie {"nazwa właściwości 1": "wartość 1", "nazwa właściwości 2": "wartość 2"}, zarówno tag jak i wartość musi być stringiem.
     */
    static addCssAttributes = (element, cssAttributes = {}) => {
        Object.keys(cssAttributes).forEach((key) => {
            if (cssAttributes[key].match(/\!important/gmi) != null) {
                element.style.setProperty(key, cssAttributes[key].replaceAll(/\!important/gmi, ''), 'important');
            } else {
                element.style.setProperty(key, cssAttributes[key]);
            }
        });
    }

    /**
     * Tłumaczy event myszki na dotyk
     * @param {TouchEvent} e
     * @returns {MouseEvent}
     */
    static translateTouchToMouse = (e) => {
        let newEventData = {sourceCapabilities: {firesTouchEvents:false}, which:1, clientX:0, clientY:0, x:0, y:0, pageX:0, pageY: 0, screenX:0, screenY:0, layerX:0, layerY:0};
        if(e.touches[0]) {
            newEventData.clientX = e.touches[0].clientX;
            newEventData.clientY = e.touches[0].clientY;
            newEventData.x = e.touches[0].clientX;
            newEventData.y = e.touches[0].clientY;
            newEventData.pageX = e.touches[0].pageX;
            newEventData.pageY = e.touches[0].pageY;
            newEventData.layerX = e.touches[0].pageX;
            newEventData.layerY = e.touches[0].pageY;
            newEventData.screenX = e.touches[0].screenX;
            newEventData.screenY = e.touches[0].screenY;
        }
        ['isTrusted', 'altKey', 'bubbles', 'cancelBubble', 'cancelable', 'composed', 'ctrlKey', 'currentTarget', 'defaultPrevented', 'detail', 'eventPhase', 'metaKey', 'returnValue', 'shiftKey', 'srcElement', 'target', 'timeStamp', 'view'].forEach((key) => {
            Object.defineProperty(newEventData, key, {
                set: () => {},
                get: () => { return e[key] },
                enumerable: true
            })
        });
        //@ts-ignore
        return newEventData;
    }

        /**
     * zaokragla podana liczbe do ulamka o podanym mianowniku
     * @param {number} num - numer do zaokrąglenia
     * @param {number} [denominator=2] - mianownik ułamka
     * @returns {number}
     */
    static roundToFraction = (num = 0.31221, denominator = 2) => {
        if(denominator <= 0) {
            return Math.round(num);
        }
        return (num - num%1) + Math.round((num%1)*denominator)/denominator;
    }

    /**
     * zaokragla w gore podana liczbe do ulamka o podanym mianowniku
     * @param {number} num - numer do zaokrąglenia
     * @param {number} [denominator=2] - mianownik ułamka
     * @returns {number}
     */
    static ceilToFraction = (num = 0.31221, denominator = 2) => {
        if(denominator <= 0) {
            return Math.ceil(num);
        }
        return (num - num%1) + Math.ceil((num%1)*denominator)/denominator;
    }

    /**
     * zaokragla w dol podana liczbe do ulamka o podanym mianowniku
     * @param {number} num - numer do zaokrąglenia
     * @param {number} [denominator=2] - mianownik ułamka
     * @returns {number}
     */
    static floorToFraction = (num = 0.31221, denominator = 2) => {
        if(denominator <= 0) {
            return Math.floor(num);
        }
        return (num - num%1) + Math.floor((num%1)*denominator)/denominator;
    }

    /** 
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     */
    static gcd = (a, b) => {
        if (b) {
            return Utils.gcd(b, a % b);
        } else {
            return Math.abs(a);
        }
    }

    /**
     * Czy coś jest obiektem HTMLOWYM
     * @param {*} element
     * @returns {Boolean}
     */
    static isElement = (element) => {
        return element instanceof Element || element instanceof Document || element instanceof HTMLElement;
    }

    /**
     * @param {Number} waitTime
     */
    static waitFor = (waitTime) => {
        return new Promise((res) => {
            setTimeout(() => {
                res(undefined);
            }, waitTime);
        });
    }

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
    static jsonToHTML = (jsonHTML, refs=[], collectAttributes=false) => {
        let _refs = {};
        let _collected = {};
        /** 
         * @template {keyof HTML_TAGS} T
         * @param {{type: T, attributes?: {[id:String]:String}, content?: Array<jsonHTML<keyof HTML_TAGS>|String>}} src
         * @param {HTMLElement|undefined} [appendTo]
         * @returns {HTML_TAGS[T]}
         */
        const parseOne = (src, appendTo=undefined) => {
            /** @type {Array<String>} */
            let classes = [];
            /** @type {CSS_VALUES} */
            let css = {};
            /** @type {HTML_ATTRS} */
            let attributes = {};
            if(src?.attributes?.class) {
                src.attributes.class.split(' ').forEach((el) => {
                    if(!classes.includes(el) && el !== '') {
                        classes.push(el);
                    }
                });
            }
            if(src?.attributes?.style) {
                css = this.getCssValuesFromString(src.attributes.style);
            }
            if(src.attributes) {
                Object.keys(src.attributes).forEach((key) => {
                    if(!['class', 'style', 'ref'].includes(key)) {
                        attributes[key] = src.attributes[key];
                    }
                });
            }
            let element = Utils.createHTMLElement(src.type, classes, {attibutes: attributes, css: css});
            if(src.content) {
                for(let entry of src.content) {
                    switch(typeof entry) {
                        case "string":
                        case "number":
                        case "bigint":
                        case "boolean":
                        case "undefined": {
                            if(`${entry}`.trim() !== '') {
                                element.innerText += `${entry}`;
                            }
                            break;
                        }
                        case "symbol": {
                            break;
                        }
                        case "object":
                        case "function": { //@ts-ignore
                            parseOne(src.content, element);
                            break;
                        }
                    }
                }
            }
            if(src?.attributes?.ref) { //@ts-ignore
                if(refs.includes(src.attributes.ref.trim())) {
                    _refs[src.attributes.ref.trim()] = element;
                }
            }
            if(collectAttributes) { //@ts-ignore
                collectAttributes.forEach(/** @param {String} attributeName */(attributeName) => {
                    if(Object.keys(attributes).includes(attributeName.trim())) {
                        if(Object.keys(_collected).includes(attributeName.trim())) {
                            _collected[attributeName.trim()].push(element);
                        } else {
                            _collected[attributeName.trim()] = [element];
                        }
                    }
                });
            }
            if(appendTo) {
                appendTo.appendChild(element);
            }
            return element;
        }

        let element = parseOne(jsonHTML);
        if(collectAttributes) { //@ts-ignore
            return {element: element, refs: _refs, collected: _collected};
        } else { //@ts-ignore
            return {element: element, refs: _refs};
        }
    }

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
    static createHTML = (outerHTML, refs=[], collectAttributes=false) => {
        return new Promise((res, rej) => {
            HTMLToJSON(outerHTML).then((result) => {
                if(collectAttributes) {
                    res(Utils.jsonToHTML(result, refs, collectAttributes));
                } else {
                    res(Utils.jsonToHTML(result, refs));
                }
            }, (e) => {
                rej(e);
            });
        });
    }


    constructor() {
    }
}

class CustomScroll {
    /** @type {HTMLElement} */
    #element;
    /** @type {String} */
    #className;

    /** @type {Number} */
    #elementBorderTop = 0;
    /** @type {Number} */
    #elementBorderBottom = 0;

    /** @type {Boolean} */
    #areElementsExisting = false;
    /** @type {Boolean} */
    #isAttached = false;
    /** @type {Boolean} */
    #hasScrollEvent = false;
    /** @type {Boolean} */
    #hasWheelEvent = false;
    /** @type {Boolean} */
    #isDragging = false;
    /** @type {Boolean} */
    #hasStartDragEvent = false;
    /** @type {Boolean} */
    #hasClickEvent = false;
    /** @type {Boolean} */
    #hasHoverEventOn = false;
    /** @type {Boolean} */
    #hasHoverEventOut = false;
    /** @type {Boolean} */
    #isScrolling = false;
    /** @type {Boolean} */
    #isOverscrolling = false;
    /** @type {Boolean} */
    #overscrollReverseDirection = false;
    /** @type {Number} */
    #currentOverscroll = 0;

    /** @type {Number} */
    #elementHeight = 0;
    /** @type {Number} */
    #elementScrollHeight = 0;

    /** @type {Number} */
    #currentScroll = 0;
    /** @type {Number} */
    #startY = 0;

    /** @type {ResizeObserver} */
    #observer;

    /** @type {HTMLElement} */
    #cont;
    /** @type {HTMLElement} */
    #scrollBelt;
    /** @type {HTMLElement} */
    #scrollThumb;

    /** @type {any} */
    #timeout = null;

    /** @type {any} */
    #scrollingEnd_timeout = null;

    /** @type {(() => void)|((currentScroll:Number) => void)|null} */
    #onScrollStartFuncs = null;

    /** @type {(() => void)|((currentScroll:Number) => void)|null} */
    #onScrollFuncs = null;

    /** @type {(() => void)|((currentScroll:Number) => void)|null} */
    #onScrollEndFuncs = null;

    /** @type {Number} */
    get currentScroll() {
        return this.#currentScroll;
    }
    /** @param {Number} newScroll */
    set currentScroll(newScroll) {
        if (newScroll < 0) {
            this.#currentScroll = 0;
        } else if (newScroll > this.maxScroll) {
            this.#currentScroll = this.maxScroll;
        }
        this.#element.scrollTop = this.#currentScroll;
        this.#scrollThumb.style.setProperty('height', `${this.thumbSize}px`);
        this.#scrollThumb.style.setProperty('top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
    }

    get currentScrollPercent() {
        return this.#currentScroll / this.maxScroll;
    }

    get maxScroll() {
        return this.#elementScrollHeight - this.#elementHeight;
    }

    get thumbSizePercent() {
        return this.#elementHeight / this.#elementScrollHeight;
    }

    get thumbSize() {
        return this.thumbSizePercent * this.#elementHeight;
    }

    /** @param {(() => void)|((currentScroll:Number) => void)|null} func */
    set onScroll(func) {
        this.#onScrollFuncs = func;
    }

    /** @param {(() => void)|((currentScroll:Number) => void)|null} func */
    set onScrollStart(func) {
        this.#onScrollStartFuncs = func;
    }

    /** @param {(() => void)|((currentScroll:Number) => void)|null} func */
    set onScrollEnd(func) {
        this.#onScrollEndFuncs = func;
    }

    #runScrollStartFuncs = () => {
        if (this.#onScrollStartFuncs !== null) {
            this.#onScrollStartFuncs(this.#currentScroll);
        }
    }

    #runScrollFuncs = () => {
        if (this.#onScrollFuncs !== null) {
            this.#onScrollFuncs(this.#currentScroll);
        }
    }

    #runScrollEndFuncs = () => {
        if (this.#onScrollEndFuncs !== null) {
            this.#onScrollEndFuncs(this.#currentScroll);
        }
    }

    /**
     * @param {PointerEvent} e
     */
    #handleDragStop = (e) => {
        if (!this.#hasStartDragEvent) {
            this.#hasStartDragEvent = true;
            this.#element.addEventListener('pointerdown', this.#handleStartDrag);
            this.#cont.addEventListener('pointerdown', this.#handleStartDrag);
        }
        //@ts-ignore
        if (e.target.getAttribute('data-scroll-of') !== `${this.#element.getAttribute('id')}` && !this.#cont.contains(e.target)) {
            this.#handleScrollEnd(false);
        } else if (!this.#hasHoverEventOut) {
            this.#hasHoverEventOut = true;
            document.body.addEventListener('mousemove', this.#handleMouseOut_scrollBar);
        }

        if (!this.#hasScrollEvent) {
            this.#hasScrollEvent = true;
            this.#element.addEventListener('scroll', this.#handleScroll);
        }
        if (this.#isDragging) {
            this.#isDragging = false;
            if (document.body) {
                document.body.removeEventListener('pointermove', this.#handleDragMove);
                document.body.removeEventListener('pointerup', this.#handleDragStop);
            }
        }
        this.#runScrollEndFuncs();
    }
    /**
     * @param {PointerEvent} e 
     */
    #handleDragMove = (e) => {
        this.#runScrollFuncs();
        e.preventDefault();

        let diff = e.clientY - this.#startY;
        this.#startY = e.clientY;
        let factor = this.#elementScrollHeight / this.#elementHeight;
        let newScroll = Math.round(this.#currentScroll + diff * factor);

        if (newScroll < 0) {
            this.#currentScroll = 0;
            this.#isOverscrolling = true;
            this.#currentOverscroll = newScroll;
        } else if (newScroll > this.maxScroll) {
            this.#currentScroll = this.maxScroll;
            this.#isOverscrolling = true;
            this.#currentOverscroll = this.maxScroll - newScroll;
        } else {
            this.#currentScroll = newScroll;
            this.#isOverscrolling = false;
            this.#currentOverscroll = 0;
        }

        this.#element.scrollTop = this.#currentScroll;
        this.#scrollThumb.style.setProperty('height', `${this.thumbSize}px`);
        this.#scrollThumb.style.setProperty('top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
        this.#scrollThumb.style.setProperty('--top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
        this.#scrollThumb.style.setProperty('--overscroll', `${this.#currentOverscroll}px`);
    }
    /**
     * @param {PointerEvent} e 
     */
    #handleStartDrag = (e) => {
        this.#runScrollStartFuncs();
        this.#runScrollFuncs();
        this.#startY = e.clientY;
        if (this.#hasStartDragEvent) {
            this.#hasStartDragEvent = false;
            this.#element.removeEventListener('pointerdown', this.#handleStartDrag);
            this.#cont.removeEventListener('pointerdown', this.#handleStartDrag);
        }
        if (!this.#isDragging) {
            this.#isDragging = true;
            if (document.body) {
                document.body.addEventListener('pointermove', this.#handleDragMove);
                document.body.addEventListener('pointerup', this.#handleDragStop);
            }
        }
        if (!this.#element.classList.contains('scrolling')) {
            this.#element.classList.add('scrolling');
        }
        if (!this.#cont.classList.contains('scrolling')) {
            this.#cont.classList.add('scrolling');
        }
        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
            this.#timeout = null;
        }
        if (this.#hasScrollEvent) {
            this.#hasScrollEvent = false;
            this.#element.removeEventListener('scroll', this.#handleScroll);
        }
        if (this.#hasWheelEvent) {
            this.#hasWheelEvent = false;
            this.#element.removeEventListener('wheel', this.#handleWheel);
        }
    }
    /**
     * 
     * @param {WheelEvent} e 
     */
    #handleWheel = (e) => {
        console.log('handleWheel', e);

        let time = 100;
        if (time < Utils.getTransitionTime([this.#cont])) {
            time = Utils.getTransitionTime([this.#cont]);
        }
        this.#isOverscrolling = true;
        this.#currentOverscroll = e.deltaY;

        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
            this.#timeout = null;
        }

        // this.#scrollLogic();
    }

    #handleMouseOver_scrollBar = () => {
        if (!this.#isScrolling && !this.#isDragging) {
            if (!this.#element.classList.contains('scrolling')) {
                this.#element.classList.add('scrolling');
            }
            if (this.#cont) {
                if (!this.#cont.classList.contains('scrolling')) {
                    this.#cont.classList.add('scrolling');
                }
                if (this.#cont.classList.contains('scrolling-end')) {
                    this.#cont.classList.remove('scrolling-end');
                }
            }
            if (this.#hasHoverEventOn) {
                this.#hasHoverEventOn = false;
                this.#cont.removeEventListener('mouseover', this.#handleMouseOver_scrollBar);
            }
            setTimeout(() => {
                if (!this.#hasHoverEventOut) {
                    this.#hasHoverEventOut = true;
                    document.body.addEventListener('mousemove', this.#handleMouseOut_scrollBar);
                }
            });
        }
    }

    #handleMouseOut_scrollBar = (e) => {
        if (this.#cont) {
            if (!this.#isScrolling && !this.#isDragging && !this.#cont.contains(e.target) && e.target.getAttribute('data-scroll-of') !== `${this.#element.getAttribute('id')}`) {
                if (this.#timeout !== null) {
                    clearTimeout(this.#timeout);
                }

                let time = 100;
                if (time < Utils.getTransitionTime([this.#cont])) {
                    time = Utils.getTransitionTime([this.#cont]);
                }
                if (this.#hasHoverEventOut) {
                    this.#hasHoverEventOut = false;
                    document.body.removeEventListener('mousemove', this.#handleMouseOut_scrollBar);
                }
                this.#timeout = setTimeout(() => {
                    this.#handleScrollEnd();
                }, time);
            }
        }
    }
    /**
     * @param {Boolean} [runFuncs=true]
     */
    #handleScrollEnd = (runFuncs = true) => {
        let time = 0;
        if (this.#cont) {
            if (!this.#cont.classList.contains('scrolling-end')) {
                this.#cont.classList.add('scrolling-end');
            }
            if (time < Utils.getTransitionTime([this.#cont])) {
                time = Utils.getTransitionTime([this.#cont]);
            }
        }
        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
        }
        if (this.#scrollingEnd_timeout !== null) {
            clearTimeout(this.#scrollingEnd_timeout);
        }
        this.#isOverscrolling = false;
        this.#currentOverscroll = 0;
        this.#scrollingEnd_timeout = setTimeout(() => {
            if (this.#element.classList.contains('scrolling')) {
                this.#element.classList.remove('scrolling');
            }
            if (this.#cont) {
                if (this.#cont.classList.contains('scrolling')) {
                    this.#cont.classList.remove('scrolling');
                }
                if (this.#cont.classList.contains('scrolling-end')) {
                    this.#cont.classList.remove('scrolling-end');
                }
                if (!this.#hasHoverEventOn) {
                    this.#hasHoverEventOn = true;
                    this.#cont.addEventListener('mouseover', this.#handleMouseOver_scrollBar);
                }
            }
            if (this.#hasHoverEventOut) {
                this.#hasHoverEventOut = false;
                document.body.removeEventListener('mousemove', this.#handleMouseOut_scrollBar);
            }
            this.#scrollingEnd_timeout = null;
        }, time);
        this.#timeout = null;
        this.#isScrolling = false;
        if (runFuncs) {
            this.#runScrollEndFuncs();
        }
    }

    #handleScroll = () => {
        this.#runScrollFuncs();
        if (!this.#isScrolling) {
            this.#isScrolling = true;
            this.#runScrollStartFuncs();
        }

        this.#scrollLogic();

        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
        }

        let time = 100;
        if (time < Utils.getTransitionTime([this.#cont])) {
            time = Utils.getTransitionTime([this.#cont]);
        }

        this.#timeout = setTimeout(() => {
            this.#handleScrollEnd();
        }, time);
    }

    #scrollLogic = () => {
        if (!this.#element.classList.contains('scrolling')) {
            this.#element.classList.add('scrolling');
        }
        if (this.#scrollingEnd_timeout !== null) {
            clearTimeout(this.#scrollingEnd_timeout);
            this.#scrollingEnd_timeout = null;
        }
        if (this.#cont) {
            if (!this.#cont.classList.contains('scrolling')) {
                this.#cont.classList.add('scrolling');
            }
            if (this.#cont.classList.contains('scrolling-end')) {
                this.#cont.classList.remove('scrolling-end');
            }
            if (this.#hasHoverEventOn) {
                this.#hasHoverEventOn = false;
                this.#cont.removeEventListener('mouseover', this.#handleMouseOver_scrollBar);
            }
        }
        if (this.#hasHoverEventOut) {
            this.#hasHoverEventOut = false;
            document.body.removeEventListener('mousemove', this.#handleMouseOut_scrollBar);
        }
        this.#currentScroll = this.#element.scrollTop;

        if (this.#currentScroll > 0 && this.#currentScroll < this.maxScroll) {
            if (this.#scrollThumb) {
                this.#scrollThumb.style.setProperty('height', `${this.thumbSize}px`);
                this.#scrollThumb.style.setProperty('top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
                this.#scrollThumb.style.setProperty('--top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
                this.#scrollThumb.style.setProperty('--overscroll', `0px`);
            }
            this.#isOverscrolling = false;
            this.#currentOverscroll = 0;
        } else if (this.#currentScroll <= 0) {
            if (this.#scrollThumb) {
                this.#scrollThumb.style.setProperty('top', '0px');
                this.#scrollThumb.style.setProperty('--top', '0px');
                this.#scrollThumb.style.setProperty('--overscroll', `${this.#currentOverscroll}px`);
            }
        } else if (this.#currentScroll >= this.maxScroll) {
            if (this.#scrollThumb) {
                this.#scrollThumb.style.setProperty('top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
                this.#scrollThumb.style.setProperty('--top', `${(this.currentScrollPercent * this.#elementHeight) - (this.currentScrollPercent * this.thumbSize)}px`);
                this.#scrollThumb.style.setProperty('--overscroll', `${this.#currentOverscroll}px`);
            }
        }

        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
        }
        if (this.#scrollingEnd_timeout !== null) {
            clearTimeout(this.#scrollingEnd_timeout);
            this.#scrollingEnd_timeout = null;
        }

        let time = 100;
        if (time < Utils.getTransitionTime([this.#cont])) {
            time = Utils.getTransitionTime([this.#cont]);
        }
        this.#timeout = setTimeout(() => {
            this.#handleScrollEnd();
        }, time);
    }

    #createElements = () => {
        if (!this.#areElementsExisting) {

            this.#elementHeight = this.#element.offsetHeight - (this.#elementBorderTop + this.#elementBorderBottom);

            const contCss = {
                'height': `${this.#elementHeight}px`,
                'position': 'absolute',
                //@ts-ignore
                'right': `${this.#element.offsetParent.offsetWidth - (this.#element.offsetLeft + this.#element.offsetWidth + Utils.getCssValueAsNumber(this.#element.offsetParent, 'border-left-width') + Utils.getCssValueAsNumber(this.#element.offsetParent, 'border-right-width'))}px`,
                'top': `${this.#element.offsetTop}px`,
            };
            //@ts-ignore
            this.#cont = Utils.createAndAppendHTMLElement(this.#element.parentElement, 'div', [`${this.#className}`], { attibutes: { 'data-scroll-of': `${this.#element.getAttribute('id')}`, 'id': `scroll-${this.#element.getAttribute('id')}`} }, contCss);
            this.#scrollBelt = Utils.createAndAppendHTMLElement(this.#cont, 'div', [`${this.#className}-belt`]);
            this.#scrollThumb = Utils.createAndAppendHTMLElement(this.#cont, 'div', [`${this.#className}-thumb`], { css: { 'position': 'absolute', 'box-sizing': 'border-box', 'top': '0px', '--top': '0px', '--overscroll': '0px'}  });

            this.#areElementsExisting = true;
        }
    }

    #deleteElements = () => {
        if (this.#areElementsExisting) {
            if (this.#hasStartDragEvent) {
                this.#hasStartDragEvent = false;
                this.#element.removeEventListener('pointerdown', this.#handleStartDrag);
                if (this.#cont) {
                    this.#cont.removeEventListener('pointerdown', this.#handleStartDrag);
                }
            }
            if (this.#hasHoverEventOn) {
                this.#hasHoverEventOn = false;
                if (this.#cont) {
                    this.#cont.removeEventListener('mouseover', this.#handleMouseOver_scrollBar);
                }
            }
            if (this.#hasHoverEventOut) {
                this.#hasHoverEventOut = false;
                document.body.removeEventListener('mousemove', this.#handleMouseOut_scrollBar);
            }
            this.#isDragging = false;
            this.#hasStartDragEvent = false;
            this.#hasClickEvent = false;
            this.#hasHoverEventOn = false;
            this.#hasHoverEventOut = false;
            this.#areElementsExisting = false;

            if (this.#cont) {
                let prevCont = this.#cont;
                if (prevCont.classList.contains(`${this.#className}-closing`)) {
                    prevCont.classList.add(`${this.#className}-closing`);
                }
                let waitTime = Utils.getTransitionTime([prevCont]);
                setTimeout(() => {
                    prevCont.remove();
                }, waitTime);
            }
            this.#cont = null;
        }
    }

    #handleSizeChange = () => {
        this.#elementHeight = this.#element.offsetHeight - (this.#elementBorderTop + this.#elementBorderBottom);
        this.#elementScrollHeight = this.#element.scrollHeight;

        if (this.#element.offsetHeight > 0 && this.#element.offsetHeight < this.#element.scrollHeight) {
            this.#createElements();

            const contCss = {
                'height': `${this.#elementHeight}px`,
                'top': `${this.#element.offsetTop}px`,
                //@ts-ignore
                'right': `${this.#element.offsetParent.offsetWidth - (this.#element.offsetLeft + this.#element.offsetWidth + Utils.getCssValueAsNumber(this.#element.offsetParent, 'border-left-width') + Utils.getCssValueAsNumber(this.#element.offsetParent, 'border-right-width'))}px`
            };
            Utils.addCssAttributes(this.#cont, contCss);

            this.#scrollThumb.style.setProperty('height', `${this.thumbSize}px`);

            if (!this.#hasScrollEvent) {
                this.#hasScrollEvent = true;
                this.#element.addEventListener('scroll', this.#handleScroll);
            }
            if (!this.#hasStartDragEvent) {
                this.#hasStartDragEvent = true;
                this.#element.addEventListener('pointerdown', this.#handleStartDrag);
                this.#cont.addEventListener('pointerdown', this.#handleStartDrag);
            }
            if (!this.#hasHoverEventOn) {
                this.#hasHoverEventOn = true;
                this.#cont.addEventListener('mouseover', this.#handleMouseOver_scrollBar);
            }
            if (this.#hasHoverEventOut) {
                this.#hasHoverEventOut = false;
                document.body.removeEventListener('mousemove', this.#handleMouseOut_scrollBar);
            }

            if (this.#isDragging) {
                this.#isDragging = false;
                if (document.body) {
                    document.body.removeEventListener('pointermove', this.#handleDragMove);
                    document.body.removeEventListener('pointerup', this.#handleDragStop);
                }
            }
            this.#scrollLogic();
        } else {
            this.#deleteElements();
        }
    }

    dettachObserver = () => {
        if (this.#isAttached) {
            this.#isAttached = false;

            this.#observer.unobserve(this.#element);
            this.#deleteElements();

            if (this.#hasScrollEvent) {
                this.#hasScrollEvent = false;
                this.#element.removeEventListener('scroll', this.#handleScroll);
            }
            if (this.#hasWheelEvent) {
                this.#hasWheelEvent = false;
                this.#element.removeEventListener('wheel', this.#handleWheel);
            }
            if (this.#hasStartDragEvent) {
                this.#hasStartDragEvent = false;
                this.#element.removeEventListener('pointerdown', this.#handleStartDrag);
                this.#cont.removeEventListener('pointerdown', this.#handleStartDrag);
            }
            if (this.#hasHoverEventOn) {
                this.#hasHoverEventOn = false;
                this.#cont.removeEventListener('mouseover', this.#handleMouseOver_scrollBar);
            }
            if (this.#hasHoverEventOut) {
                this.#hasHoverEventOut = false;
                document.body.removeEventListener('mousemove', this.#handleMouseOut_scrollBar);
            }
            this.#isScrolling = false;
            this.#isOverscrolling = false;
            this.#currentOverscroll = 0;
            if (this.#isDragging) {
                this.#isDragging = false;
                if (document.body) {
                    document.body.removeEventListener('pointermove', this.#handleDragMove);
                    document.body.removeEventListener('pointerup', this.#handleDragStop);
                }
            }
        }
    }

    attachObserver = () => {
        if (!this.#isAttached) {
            this.#isAttached = true;

            this.#handleSizeChange();
            this.#observer.observe(this.#element);
        }
    }

    /**
     * 
     * @param {HTMLElement} target 
     * @param {String} [className='custom-scroll']
     */
    constructor(target, className = 'custom-scroll') {
        this.#element = target;
        this.#element.style.setProperty('overscroll-behavior', 'none', 'important');
        if (this.#element.getAttribute('id') == '' || this.#element.getAttribute('id') == null) {
            this.#element.setAttribute('id', Utils.makeId(10, 'unnamed-'));
        }
        this.#className = className;
        this.#elementBorderTop = Utils.getCssValueAsNumber(this.#element, 'border-top-width');
        this.#elementBorderBottom = Utils.getCssValueAsNumber(this.#element, 'border-bottom-width');
        this.#observer = new ResizeObserver(this.#handleSizeChange);

        if (this.#timeout !== null) {
            clearTimeout(this.#timeout);
        }
        this.#timeout = setTimeout(() => {
            this.#handleScrollEnd();
        }, 100);
    }
}

class Color {
    /** @type {String} */
    #hexCode;
    /** @type {Number} */
    alpha = 0;

    /** @type {BASE_COLORS} */
    static BASE_COLORS = {
        'AliceBlue': '#F0F8FF', 'AntiqueWhite': '#FAEBD7', 'Aqua': '#00FFFF', 'Aquamarine': '#7FFFD4', 'Azure': '#F0FFFF', 'Beige': '#F5F5DC', 'Bisque': '#FFE4C4', 'Black': '#000000', 'BlanchedAlmond': '#FFEBCD', 'Blue': '#0000FF', 'BlueViolet': '#8A2BE2', 'Brown': '#A52A2A', 'BurlyWood': '#DEB887', 'CadetBlue': '#5F9EA0', 'Chartreuse': '#7FFF00', 'Chocolate': '#D2691E', 'Coral': '#FF7F50', 'CornflowerBlue': '#6495ED', 'Cornsilk': '#FFF8DC', 'Crimson': '#DC143C', 'Cyan': '#00FFFF', 'DarkBlue': '#00008B', 'DarkCyan': '#008B8B', 'DarkGoldenRod': '#B8860B', 'DarkGray': '#A9A9A9', 'DarkGrey': '#A9A9A9', 'DarkGreen': '#006400', 'DarkKhaki': '#BDB76B', 'DarkMagenta': '#8B008B', 'DarkOliveGreen': '#556B2F', 'DarkOrange': '#FF8C00', 'DarkOrchid': '#9932CC', 'DarkRed': '#8B0000', 'DarkSalmon': '#E9967A', 'DarkSeaGreen': '#8FBC8F', 'DarkSlateBlue': '#483D8B', 'DarkSlateGray': '#2F4F4F', 'DarkSlateGrey': '#2F4F4F', 'DarkTurquoise': '#00CED1', 'DarkViolet': '#9400D3', 'DeepPink': '#FF1493', 'DeepSkyBlue': '#00BFFF', 'DimGray': '#696969', 'DimGrey': '#696969', 'DodgerBlue': '#696969', 'FireBrick': '#B22222', 'FloralWhite': '#FFFAF0', 'ForestGreen': '#228B22', 'Fuchsia': '#FF00FF', 'Gainsboro': '#DCDCDC', 'GhostWhite': '#F8F8FF', 'Gold': '#FFD700', 'GoldenRod': '#DAA520', 'Gray': '#808080', 'Grey': '#808080', 'Green': '#008000', 'GreenYellow': '#ADFF2F', 'HoneyDew': '#F0FFF0', 'HotPink': '#FF69B4', 'IndianRed': '#CD5C5C', 'Indigo': '#4B0082', 'Ivory': '#FFFFF0', 'Khaki': '#F0E68C', 'Lavender': '#E6E6FA', 'LavenderBlush': '#FFF0F5', 'LawnGreen': '#7CFC00', 'LemonChiffon': '#FFFACD', 'LightBlue': '#ADD8E6', 'LightCoral': '#F08080', 'LightCyan': '#E0FFFF', 'LightGoldenRodYellow': '#FAFAD2', 'LightGray': '#D3D3D3', 'LightGrey': '#D3D3D3', 'LightGreen': '#90EE90', 'LightPink': '#FFB6C1', 'LightSalmon': '#FFA07A', 'LightSeaGreen': '#20B2AA', 'LightSkyBlue': '#87CEFA', 'LightSlateGray': '#778899', 'LightSlateGrey': '#778899', 'LightSteelBlue': '#B0C4DE', 'LightYellow': '#FFFFE0', 'Lime': '#00FF00', 'LimeGreen': '#32CD32', 'Linen': '#FAF0E6', 'Magenta': '#FF00FF', 'Maroon': '#800000', 'MediumAquaMarine': '#66CDAA', 'MediumBlue': '#0000CD', 'MediumOrchid': '#BA55D3', 'MediumPurple': '#9370DB', 'MediumSeaGreen': '#3CB371', 'MediumSlateBlue': '#7B68EE', 'MediumSpringGreen': '#00FA9A', 'MediumTurquoise': '#48D1CC', 'MediumVioletRed': '#C71585', 'MidnightBlue': '#191970', 'MintCream': '#F5FFFA', 'MistyRose': '#FFE4E1', 'Moccasin': '#FFE4B5', 'NavajoWhite': '#FFDEAD', 'Navy': '#000080', 'OldLace': '#FDF5E6', 'Olive': '#808000', 'OliveDrab': '#6B8E23', 'Orange': '#FFA500', 'OrangeRed': '#FF4500', 'Orchid': '#DA70D6', 'PaleGoldenRod': '#EEE8AA', 'PaleGreen': '#98FB98', 'PaleTurquoise': '#AFEEEE', 'PaleVioletRed': '#DB7093', 'PapayaWhip': '#FFEFD5', 'PeachPuff': '#FFDAB9', 'Peru': '#CD853F', 'Pink': '#FFC0CB', 'Plum': '#DDA0DD', 'PowderBlue': '#B0E0E6', 'Purple': '#800080', 'RebeccaPurple': '#663399', 'Red': '#FF0000', 'RosyBrown': '#BC8F8F', 'RoyalBlue': '#4169E1', 'SaddleBrown': '#8B4513', 'Salmon': '#FA8072', 'SandyBrown': '#F4A460', 'SeaGreen': '#2E8B57', 'SeaShell': '#FFF5EE', 'Sienna': '#A0522D', 'Silver': '#C0C0C0', 'SkyBlue': '#87CEEB', 'SlateBlue': '#6A5ACD', 'SlateGray': '#708090', 'SlateGrey': '#708090', 'Snow': '#FFFAFA', 'SpringGreen': '#00FF7F', 'SteelBlue': '#4682B4', 'Tan': '#D2B48C', 'Teal': '#008080', 'Thistle': '#D8BFD8', 'Tomato': '#FF6347', 'Turquoise': '#40E0D0', 'Violet': '#EE82EE', 'Wheat': '#F5DEB3', 'White': '#FFFFFF', 'WhiteSmoke': '#F5F5F5', 'Yellow': '#FFFF00', 'YellowGreen': '#9ACD32'
    }
    /** @type {{[id:string]: string}} */
    static get BASE_COLORS_LOWERCASE() {
        let returnObj = {};

        Object.keys(this.BASE_COLORS).forEach((key) => {
            Object.defineProperty(returnObj, key.toLowerCase(), {
                set: () => { },
                get: () => {
                    return this.BASE_COLORS[key];
                },
                enumerable: true
            })
        });

        //@ts-ignore
        return returnObj;
    }

    /**
     * Zmienia hue koloru
     * @param {String|rgba|rgb|hsl|BASE_COLOR} color 
     * @param {Number} factor 
     * @returns {String}
     */
    static hueShift = (color, factor) => {
        let colorToShift = this.hexToHsl(this.toHex(color));
        colorToShift.h += factor;
        while (colorToShift.h < 0) {
            colorToShift.h += 360;
        }
        colorToShift.h = colorToShift.h % 360;
        return this.toHex(colorToShift);
    }

    // stare metody do poprawy

    /**
     * zamienia string zawierający kolor hsl na obiekt
     * @param {string} hslString - string zawierający kolor hsl
     * @returns {hsl}
     */
    static hslStringToObj = (hslString = 'hsl(0, 0%, 0%)') => {
        let hsl = { h: 0, s: 0, l: 0 };

        if (hslString.match(/rgb/gmi) != null) {
            return this.rgbToHsl(this.rgbStringToObj(hslString));
        } else if (hslString.match(/\#/gmi) != null) {
            return this.hexToHsl(hslString);
        }

        let bracketMatch = hslString.match(/\([^\)]*\)/gm);
        if (bracketMatch != null) {
            let colorsAsString = bracketMatch[0].slice(1, bracketMatch[0].length - 1).replaceAll(/[\%\s]/gm, '').split(',');
            if (colorsAsString[0]) {
                hsl.h = Number(colorsAsString[0]);
            }
            if (colorsAsString[1]) {
                hsl.s = Number(colorsAsString[1]);
            }
            if (colorsAsString[2]) {
                hsl.l = Number(colorsAsString[2]);
            }
        }

        return hsl;
    }
    /**
     * zamienia string zawierający kolor rgb na hex
     * @param {rgb} _rgb - obiekt reprezentujący kolor rgb
     * @returns {string}
     */
    static rgbToHex = (_rgb = { r: 0, g: 0, b: 0 }) => {
        let rgb = _rgb;
        if (typeof _rgb == 'string') {
            _rgb = this.rgbStringToObj(_rgb);
        }
        let returnString = `#`;
        ['r', 'g', 'b'].forEach((color) => {
            let colorString = _rgb[color].toString(16);
            if (colorString.length < 2) {
                colorString = `0${colorString}`;
            }
            returnString += colorString;
        });
        return returnString;
    };
    /**
     * zamienia string zawierający kolor rgb na hex
     * @param {rgba} _rgba - obiekt reprezentujący kolor rgb
     * @returns {string}
     */
    static rgbaToHex = (_rgba = { r: 0, g: 0, b: 0, a: 0 }) => {
        let rgba = _rgba;
        if (typeof _rgba == 'string') {
            rgba = this.rgbaStringToObj(_rgba);
        }
        let returnString = `#`;
        ['r', 'g', 'b'].forEach((color) => {
            let colorString = rgba[color].toString(16);
            if (colorString.length < 2) {
                colorString = `0${colorString}`;
            }
            returnString += colorString;
        });
        let alphaString = '';
        if (rgba.a != 1) {
            alphaString = Math.round(rgba.a * 256).toString(16);
            if (alphaString.length < 2) {
                alphaString = `0${alphaString}`;
            }
            returnString += alphaString;
        }
        return returnString;
    };
    /**
     * 
     * @param {string} hexString 
     * @returns {rgb}
     */
    static hexToRgb = (hexString = '#000') => {
        let rgb = { r: 0, g: 0, b: 0 };

        if (hexString.slice(0, 1) == '#') {
            hexString = hexString.slice(1);
        } else if (hexString.slice(0, 3) == 'rgb') {
            return this.rgbStringToObj(hexString);
        } else if (hexString.slice(0, 3) == 'hsl') {
            return this.hslToRgb(this.hslStringToObj(hexString));
        }

        if (hexString.length == 3) {
            let newHexString = '';
            hexString.split('').forEach((char) => {
                newHexString = `${newHexString}${char}${char}`;
            });
            hexString = newHexString;
        }

        if (hexString.length >= 6) {
            let hexArr = hexString.slice(0, 6).split('');
            rgb.r = parseInt(`${hexArr[0]}${hexArr[1]}`, 16);
            rgb.g = parseInt(`${hexArr[2]}${hexArr[3]}`, 16);
            rgb.b = parseInt(`${hexArr[4]}${hexArr[5]}`, 16);
        }
        return rgb;
    }
    /**
     * @param {rgb} color
     * @returns {rgba}
     */
    static rgbToRgba = (color) => {
        return { r: color.r, g: color.g, b: color.b, a: 1 }
    }
    /**
     * 
     * @param {String} hexString
     * @returns {rgba}
     */
    static hexToRgba = (hexString = '#000') => {
        let rgb = { r: 0, g: 0, b: 0, a: 1 };

        if (hexString.slice(0, 1) == '#') {
            hexString = hexString.slice(1);
        } else if (hexString.slice(0, 3) == 'rgb') {
            return this.rgbToRgba(this.rgbStringToObj(hexString));
        } else if (hexString.slice(0, 3) == 'rgba') {
            return this.rgbaStringToObj(hexString);
        } else if (hexString.slice(0, 3) == 'hsl') {
            return this.rgbToRgba(this.hslToRgb(this.hslStringToObj(hexString)));
        }

        if (hexString.length == 3) {
            let newHexString = '';
            hexString.split('').forEach((char) => {
                newHexString = `${newHexString}${char}${char}`;
            });
            hexString = newHexString;
        }

        if (hexString.length >= 6) {
            let hexArr = hexString.slice(0, 6).split('');
            rgb.r = parseInt(`${hexArr[0]}${hexArr[1]}`, 16);
            rgb.g = parseInt(`${hexArr[2]}${hexArr[3]}`, 16);
            rgb.b = parseInt(`${hexArr[4]}${hexArr[5]}`, 16);
            if (hexString.length > 6) {
                let alpha = hexString.slice(6);
                rgb.a = parseInt(`${alpha}`, 16) / 256
            }
        }
        return rgb;
    }
    /**
     * funkcja zamienająca kolor hsl na rgb
     * @param {hsl} _hsl - obiekt reprezentujący kolor hsl
     * @returns {rgb}
     */
    static hslToRgb = (_hsl = { h: 0, s: 0, l: 0 }) => {
        let hsl = null;

        if (typeof _hsl == 'string') {
            hsl = this.hslStringToObj(_hsl);
        } else {
            hsl = _hsl;
        }

        let h = hsl.h;
        let s = hsl.s / 100;
        let l = hsl.l / 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255)
        if (r > 255) {
            r = 255;
        } else if (r < 0) {
            r = 0;
        }
        if (g > 255) {
            g = 255;
        } else if (g < 0) {
            g = 0;
        }
        if (b > 255) {
            b = 255;
        } else if (b < 0) {
            b = 0;
        }

        return { r: r, g: g, b: b };

    }
    /**
     * funkcja zamienająca kolor hsl na hex
     * @param {hsl} _hsl - obiekt reprezentujący kolor hsl
     * @returns {string}
     */
    static hslToHex = (_hsl = { h: 0, s: 0, l: 0 }) => {
        return this.rgbToHex(this.hslToRgb(_hsl));
    }
    /**
     * funkcja zamienająca kolor rgb na hsl
     * @param {rgb} _rgb - obiekt reprezentujący kolor rgb
     * @returns {hsl}
     */
    static rgbToHsl = (_rgb = { r: 0, g: 0, b: 0 }) => {
        let rgb = null;
        if (typeof _rgb == 'string') {
            rgb = this.rgbStringToObj(_rgb);
        } else {
            rgb = _rgb;
        }

        let r = rgb.r / 255;
        let g = rgb.g / 255;
        let b = rgb.b / 255;

        let cmin = Math.min(r, g, b);
        let cmax = Math.max(r, g, b);
        let delta = cmax - cmin;
        let h = 0;
        let s = 0;
        let l = 0;

        if (delta == 0) {
            h = 0;
        } else if (cmax == r) {
            h = ((g - b) / delta) % 6;
        } else if (cmax == g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4
        }
        h = Math.round(h * 60);

        if (h < 0) {
            h += 360;
        }

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        s = s * 100;
        l = l * 100;
        return { h: h, s: s, l: l };
    }
    /**
     * funkcja zamienająca kolor hex na hsl
     * @param {string} hexString - string reprezentujący kolor hex
     * @returns {hsl}
     */
    static hexToHsl = (hexString = '#ffffff') => {
        return this.rgbToHsl(this.hexToRgb(hexString));
    }
    /**
     * zamienia string zawierający kolor rgb na obiekt
     * @param {string} rgbString - string zawierający kolor rgb
     * @returns {rgb}
     */
    static rgbStringToObj = (rgbString) => {
        let rgb = { r: 0, g: 0, b: 0 };

        if (rgbString.match(/hsl/gmi) != null) {
            return this.hslToRgb(this.hslStringToObj(rgbString));
        } else if (rgbString.match(/\#/gmi) != null) {
            return this.hexToRgb(rgbString);
        }

        let bracketMatch = rgbString.match(/\([^\)]*\)/gm);
        if (bracketMatch != null) {
            let colorsAsString = bracketMatch[0].slice(1, bracketMatch[0].length - 1).replaceAll(/\s/gm, '').split(',');
            if (colorsAsString[0]) {
                rgb.r = Number(colorsAsString[0]);
            }
            if (colorsAsString[1]) {
                rgb.g = Number(colorsAsString[1]);
            }
            if (colorsAsString[2]) {
                rgb.b = Number(colorsAsString[2]);
            }
        }

        return rgb;
    }
    /**
     * zamienia string zawierający kolor rgb na obiekt
     * @param {string} rgbString - string zawierający kolor rgb
     * @returns {rgba}
     */
    static rgbaStringToObj = (rgbString) => {
        let rgb = { r: 0, g: 0, b: 0, a: 1 };

        if (rgbString.match(/hsl/gmi) != null) {
            return this.rgbToRgba(this.hslToRgb(this.hslStringToObj(rgbString)));
        } else if (rgbString.match(/\#/gmi) != null) {
            return this.hexToRgba(rgbString);
        }

        let bracketMatch = rgbString.match(/\([^\)]*\)/gm);
        if (bracketMatch != null) {
            let colorsAsString = bracketMatch[0].slice(1, bracketMatch[0].length - 1).replaceAll(/\s/gm, '').split(',');
            if (colorsAsString[0]) {
                rgb.r = Number(colorsAsString[0]);
            }
            if (colorsAsString[1]) {
                rgb.g = Number(colorsAsString[1]);
            }
            if (colorsAsString[2]) {
                rgb.b = Number(colorsAsString[2]);
            }
            if (colorsAsString[3]) {
                rgb.a = Number(colorsAsString[3]);
            }
        }

        return rgb;
    }
    /**
     * @param {String} rgbaString - string zawierający kolor rgba
     * @returns {rgba}
     */

    /**
     * zwraca poziom jasności danego koloru
     * @param {string|rgb|hsl} color 
     * @returns {number}
     */
    static getLuminocity = (color) => {
        let hsl = { h: 0, s: 0, l: 0 };

        if (typeof color == 'string') {
            hsl = this.hslStringToObj(color);
            // @ts-ignore
        } else if (color.h == undefined || color.s == undefined || color.l == undefined) {
            // @ts-ignore
            if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                // @ts-ignore
                hsl = this.rgbToHsl(color);
            }
        } else {
            // @ts-ignore
            hsl = color;
        }

        return hsl.l / 100;
    }
    /**
     * zwraca ciemniejszy kolor (metoda hsl)
     * @param {string|rgb|hsl} color 
     * @param {number} [factor=0.1] - procent o ile ściemnić (od 0 do 1)
     * @returns {string}
     */
    static getDarkerColor_method2 = (color, factor = 0.1) => {
        let hsl = { h: 0, s: 0, l: 0 };
        if (typeof color == 'string') {
            hsl = this.hslStringToObj(color);
            // @ts-ignore
        } else if (color.h == undefined || color.s == undefined || color.l == undefined) {
            // @ts-ignore
            if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                // @ts-ignore
                hsl = this.rgbToHsl(color);
            }
        } else {
            // @ts-ignore
            hsl = color;
        }
        hsl.s = Math.round(hsl.s * (1 - factor));
        hsl.l = Math.round(hsl.l * (1 - factor));
        return this.hslToHex(hsl);
    }
    /**
     * zwraca jaśniejszy kolor (metoda hsl)
     * @param {string|rgb|hsl} color 
     * @param {number} [factor=0.1] - procent o ile rozjaśnić (od 0 do 1)
     * @returns {string}
     */
    static getLighterColor_method2 = (color, factor = 0.1) => {
        let hsl = { h: 0, s: 0, l: 0 };
        if (typeof color == 'string') {
            hsl = this.hslStringToObj(color);
            // @ts-ignore
        } else if (color.h == undefined || color.s == undefined || color.l == undefined) {
            // @ts-ignore
            if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                // @ts-ignore
                hsl = this.rgbToHsl(color);
            }
        } else {
            // @ts-ignore
            hsl = color;
        }
        hsl.s = Math.round(hsl.s * (1 + factor));
        hsl.l = Math.round(hsl.l * (1 + factor));
        if (hsl.s > 100) {
            hsl.s = 100;
        }
        if (hsl.l > 100) {
            hsl.l = 100;
        }
        return this.hslToHex({ h: hsl.h, s: hsl.s * (1 + factor), l: hsl.l * (1 + factor) });
    }
    /**
     * zwraca ciemniejszy kolor (metoda rgb z https://maketintsandshades.com/)
     * @param {string|rgb|hsl} color 
     * @param {number} [factor=0.1] - procent o ile ściemnić (od 0 do 1)
     * @returns {string}
     */
    static getDarkerColor = (color, factor = 0.1) => {
        let rgb = { r: 0, g: 0, b: 0 };

        if (typeof color == 'string') {
            rgb = this.rgbStringToObj(color);
            // @ts-ignore
        } else if (color.r == undefined || color.g == undefined || color.b == undefined) {
            // @ts-ignore
            if (color.h !== undefined && color.s !== undefined && color.l !== undefined) {
                // @ts-ignore
                rgb = this.hslToRgb(color);
            }
        } else {
            // @ts-ignore
            rgb = color;
        }

        rgb.r = Math.round(rgb.r * (1 - factor));
        rgb.g = Math.round(rgb.g * (1 - factor));
        rgb.b = Math.round(rgb.b * (1 - factor));

        return this.rgbToHex(rgb);
    }
    /**
     * zwraca jaśniejszy kolor (metoda rgb z https://maketintsandshades.com/)
     * @param {string|rgb|hsl} color 
     * @param {number} [factor=0.1] - procent o ile rozjaśnić (od 0 do 1)
     * @returns {string}
     */
    static getLighterColor = (color, factor = 0.1) => {
        let rgb = { r: 0, g: 0, b: 0 };

        if (typeof color == 'string') {
            rgb = this.rgbStringToObj(color);
            // @ts-ignore
        } else if (color.r == undefined || color.g == undefined || color.b == undefined) {
            // @ts-ignore
            if (color.h !== undefined && color.s !== undefined && color.l !== undefined) {
                // @ts-ignore
                rgb = this.hslToRgb(color);
            }
        } else {
            // @ts-ignore
            rgb = color;
        }

        rgb.r = Math.round(rgb.r + ((255 - rgb.r) * factor));
        rgb.g = Math.round(rgb.g + ((255 - rgb.g) * factor));
        rgb.b = Math.round(rgb.b + ((255 - rgb.b) * factor));

        return this.rgbToHex(rgb);
    }

    /*
    __________ Nowe Metody _________
    */

    /**
     * 
     * @param {*} color 
     * @returns {String}
     */
    static toHex = (color) => {
        switch (this.typeof(color)) {
            case 'hex': {
                return color;
                break;
            }
            case "rgb": {
                return this.rgbToHex(color);
                break;
            }
            case "hsl": {
                return this.rgbToHex(this.hslToRgb(color));
                break;
            }
            case "rgb_string": {
                return this.rgbToHex(this.rgbStringToObj(color));
                break;
            }
            case "hsl_string": {
                return this.rgbToHex(this.hslToRgb(this.hslStringToObj(color)));
                break;
            }
            case "predefined":
                return this.predefinedToHex(color);
                break;
        }
        return '#808080';
    }
    /**
     * Sprawdza czy kolor jest jednym z predefiniowanych kolorów
     * @param {String} color
     * @returns {Boolean}
     */
    static isPredef = (color) => {
        let colors = Object.keys(this.BASE_COLORS).map((colorName) => { return colorName.toLowerCase(); });
        let colorCode = color.replaceAll(/[\#\s\;]/gm, '').toLowerCase();
        if (colors.includes(colorCode)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * Sprawdza czy kolor jest kolrem hex
     * @param {String} color
     * @returns {Boolean} 
     */
    static isHex = (color) => {
        if (color.match(/(^\#?[01234567890abcdef]{3}$)|(^\#?[01234567890abcdef]{6}$)/gmi) != null) {
            return true;
        }
        return false;
    }
    /**
     * Sprawdza czy kolor jest kolorem rgb
     * @param {Object|String} color
     * @returns {Boolean} 
     */
    static isRGB = (color) => {
        switch (typeof color) {
            case "string": {
                if (color.match(/rgb\(\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\)/gmi) != null) {
                    return true;
                }
                return false;
                break;
            }
            case "function":
            case "object": {
                if (typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number') {
                    return true;
                }
                return false;
                break;
            }
            default: {
                return false;
                break;
            }
        }
    }
    /**
     * Sprawdza czy kolor to string rgba
     * @param {Object|String} color
     * @returns {Boolean}
     */
    static isRgba = (color) => {
        switch (typeof color) {
            case "string": {
                if (color.match(/(rgba\(\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\,\s*\d\))|(rgba\(\d{1,3}\s*\,\s*\d{1,3}\s*\,\s*\d{1,3}\,\s*\d\.\d*\))/gmi) != null) {
                    return true;
                }
                return false;
                break;
            }
            case "function":
            case "object": {
                if (typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number' && typeof color.a === 'number') {
                    return true;
                }
                return false;
                break;
            }
            default: {
                return false;
                break;
            }
        }
    }
    /**
     * Sprawdza czy kolor jest kolorem hsl
     * @param {Object|String} color
     * @returns {Boolean} 
     */
    static isHSL = (color) => {
        switch (typeof color) {
            case "string": {
                if (color.match(/hsl\(\d{1,3}\s*\,\s*\d{1,3}\%{0,1}\s*\,\s*\d{1,3}\%{0,1}\)/gmi) != null) {
                    return true;
                }
                return false;
                break;
            }
            case "function":
            case "object": {
                if (typeof color.h === 'number' && typeof color.s === 'number' && typeof color.l === 'number') {
                    return true;
                }
                return false;
                break;
            }
            default: {
                return false;
                break;
            }
        }
    }
    /** 
     * Zwraca stringa z typem koloru
     * @param {Object|String} color
     * @returns {('rgb'|'hsl'|'hex'|'rgb_string'|'hsl_string'|'undefined'|'predefined'|'color')}
     */
    static typeof = (color) => {
        switch (typeof color) {
            case "string": {
                if (this.isHex(color)) {
                    return 'hex';
                }
                if (this.isHSL(color)) {
                    return 'hsl_string';
                }
                if (this.isRGB(color)) {
                    return 'rgb_string';
                }
                if (this.isPredef(color)) {
                    return 'predefined';
                }
                break;
            }
            case "object":
            case "function": {
                if (color == undefined || color == null) {
                    return 'undefined';
                } else if (this.isHSL(color)) {
                    return 'hsl';
                } else if (this.isRGB(color)) {
                    return 'rgb';
                } else {
                    return 'color';
                }
                break;
            }
        }
        return 'undefined';
    }
    /**
     * Zwraca kod hex koloru podstawowego
     * @param {keyof BASE_COLORS} baseColor
     * @returns {String}
     */
    static predefinedToHex = (baseColor) => {
        if (Object.keys(this.BASE_COLORS).includes(baseColor)) {
            return this.BASE_COLORS[baseColor];
        } else if (Object.keys(this.BASE_COLORS_LOWERCASE).includes(baseColor.toLowerCase())) {
            return this.BASE_COLORS_LOWERCASE[baseColor.toLowerCase()];
        } else {
            return '#808080';
        }
    }
    /**
     * Zwraca obiekt hsl koloru podstawowego
     * @param {keyof BASE_COLORS} baseColor
     * @returns {hsl}
     */
    static predefinedToHsl = (baseColor) => {
        return this.hexToHsl(this.predefinedToHex(baseColor));
    }
    /**
     * Zwraca obiekt rgb koloru podstawowego
     * @param {keyof BASE_COLORS} baseColor
     * @returns {rgb}
     */
    static predefinedToRgb = (baseColor) => {
        return this.hexToRgb(this.predefinedToHex(baseColor));
    }

    /**
     * sdsd
     * @param {rgb} rgb
     * @returns {String}
     */
    static rgbToPredefined = (rgb) => {
        return 'Black'
    }
    /**
     * sdsd
     * @param {hsl} hsl
     * @returns {String}
     */
    static hslToPredefined = (hsl) => {
        return 'Black'
    }
    /**
     * sdsd
     * @param {String} hex
     * @returns {String}
     */
    static hexToPredefined = (hex) => {
        return 'Black'
    }
    /**
     * Zwraca string reprezentujący kolor hsl
     * @param {hsl} _hsl
     * @returns {String}
     */
    static hslObjToString = (_hsl) => {
        let hsl = _hsl;
        switch (this.typeof(_hsl)) {
            case "undefined": {
                return 'hsl(0, 0%, 0%)';
                break;
            }
            case "rgb": {
                //@ts-ignore
                hsl = this.rgbToHsl(_hsl);
                break;
            }
            case "hex": {
                //@ts-ignore
                hsl = this.hexToHsl(_hsl);
                break;
            }
            case "rgb_string": {
                //@ts-ignore
                hsl = this.rgbToHsl(_hsl);
                break;
            }
            case "hsl_string": {
                //@ts-ignore
                return _hsl;
                break;
            }
            case "predefined": {
                //@ts-ignore
                hsl = this.predefinedToHsl(_hsl);
                break;
            }
        }
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    /**
     * Zwraca string reprezentujący kolor rgb
     * @param {rgb} _rgb
     * @returns {String}
     */
    static rgbObjToString = (_rgb) => {
        let rgb = _rgb;
        switch (this.typeof(_rgb)) {
            case "undefined": {
                return 'rgb(0, 0, 0)';
                break;
            }
            case "hsl": {
                //@ts-ignore
                rgb = this.hslToRgb(_hsl);
                break;
            }
            case "hex": {
                //@ts-ignore
                rgb = this.hexToHsl(_hsl);
                break;
            }
            case "rgb_string": {
                //@ts-ignore
                return _rgb;
                break;
            }
            case "hsl_string": {
                //@ts-ignore
                rgb = this.hslToRgb(this.hslStringToObj(_rgb));
                break;
            }
            case "predefined": {
                //@ts-ignore
                rgb = this.predefinedToRgb(_hsl);
                break;
            }
        }
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    /** @type {String} */
    get hex() {
        return this.#hexCode;
    }
    /** @type {rgb} */
    get rgb() {
        return Color.hexToRgb(this.#hexCode);
    }
    /** @type {String} */
    get rgb_string() {
        return Color.rgbObjToString(Color.hexToRgb(this.#hexCode));
    }
    /** @type {String} */
    get rgba_string() {
        return Color.rgbObjToString(Color.hexToRgb(this.#hexCode));
    }
    /** @type {hsl} */
    get hsl() {
        return Color.hexToHsl(this.#hexCode);
    }
    /** @type {String} */
    get hsl_string() {
        return Color.hslObjToString(Color.hexToHsl(this.#hexCode));
    }
    /**
     * 
     * @param {Number} [count=20]
     * @returns {Array<String>}
     */
    getDarkerShades = (count = 20) => {
        let colorsArr = [];
        for (let i = 1; i < count; i++) {
            colorsArr.push(Color.getDarkerColor(this.#hexCode, i / count));
        }
        return colorsArr;
    }
    /**
     * 
     * @param {Number} [count=20]
     * @returns {Array<String>}
     */
    getLighterShades = (count = 20) => {
        let colorsArr = [];
        for (let i = 1; i < count; i++) {
            colorsArr.push(Color.getLighterColor(this.#hexCode, i / count));
        }
        return colorsArr;
    }
    /** @typedef {{"object": {[id:String]: {dark: {[id:String]: String}, light: {[id:String]: String}}}, "string": String, "objString": {[id:String]: String}}} createAltColors_mode */
    /**
     * @template {keyof createAltColors_mode} MODE
     * @param {{[id: String]: Color|String}} colors 
     * @param {MODE|("string"|"object"|"objString")} [mode="string"]
     * @param {{lighter?: String, darker?:String, prefix?:String, colors?: Number}} [config = { lighter: '-light-', darker: '-dark-', prefix: ""}]
     * @returns {createAltColors_mode[MODE]}
     */
    static createAltColors = (colors, mode = "string", config = { lighter: '-light-', darker: '-dark-', prefix: "", colors: 10}) => {
        let conf = { lighter: '-light-', darker: '-dark-', prefix: "", colors: 10 };
        Object.keys(conf).forEach((key) => {
            if(!Object.keys(config).includes(key)) {
                config[key] = conf[key];
            } else {
                conf[key] = config[key];
            }
        });
        switch(mode) {
            case "string": {
                let returnString = '';

                Object.keys(colors).forEach((colorName) => {
                    let color = Color.toHex(colors[colorName]);
                    let currentColorDarkString = '';
                    let currentColorLightString = '';
                    if (color != '') {
                        for (let i = 1; i < config.colors; i++) {
                            let lighterColor = Color.getLighterColor(color, (config.colors - i) / config.colors);
                            let darkerColor = Color.getDarkerColor(color, i / config.colors);
                            currentColorLightString += `${config.prefix}${colorName}${config.lighter}${Math.round(((config.colors - i) / config.colors) * 100)}: ${lighterColor};\n`;
                            currentColorDarkString += `${config.prefix}${colorName}${config.darker}${Math.round((i / config.colors) * 100)}: ${darkerColor};\n`;
                        }
                    }
                    returnString+=`${currentColorLightString}${currentColorDarkString}`;
                });
                if(returnString.length > 0) {
                    returnString = returnString.slice(0, -1);
                }

                //@ts-ignore
                return returnString;
                break;
            }
            case "objString": {
                /** @type {{[id:String]: String}} *///@ts-ignore
                let returnObj = {};

                Object.keys(colors).forEach((colorName) => {
                    let color = Color.toHex(colors[colorName]);
                    let currentColorDarkString = '';
                    let currentColorLightString = '';
                    if (color != '') {
                        for (let i = 1; i < config.colors; i++) {
                            let lighterColor = Color.getLighterColor(color, (config.colors - i) / config.colors);
                            let darkerColor = Color.getDarkerColor(color, i / config.colors);
                            currentColorLightString += `${config.prefix}${colorName}${config.lighter}${Math.round(((config.colors - i) / config.colors) * 100)}: ${lighterColor};\n`;
                            currentColorDarkString += `${config.prefix}${colorName}${config.darker}${Math.round((i / config.colors) * 100)}: ${darkerColor};\n`;
                        }
                    }
                    returnObj[colorName] = `${currentColorLightString}${currentColorDarkString}`;
                    if (returnObj[colorName].length > 0) {
                        returnObj[colorName] = returnObj[colorName].slice(0, -1);
                    }
                });

                //@ts-ignore
                return returnObj;
                break;
            }
            case "object": {
                /** @type {{[id:String]: {dark: {[id:String]: String}, light: {[id:String]: String}}}} *///@ts-ignore
                let returnObj = {};

                Object.keys(colors).forEach((colorName) => {
                    let color = Color.toHex(colors[colorName]);
                    /** @type {{dark: {[id:String]: String}, light: {[id:String]: String}}} */
                    let colorObj = {dark: {}, light: {}};
                    if (color != '') {
                        for (let i = 1; i < config.colors; i++) {
                            let lighterColor = Color.getLighterColor(color, (config.colors - i) / config.colors);
                            let darkerColor = Color.getDarkerColor(color, i / config.colors);
                            colorObj.light[`${config.prefix}${colorName}${config.lighter}${Math.round(((config.colors - i) / config.colors) * 100)}`] = lighterColor;
                            colorObj.dark[`${config.prefix}${colorName}${config.darker}${Math.round((i / config.colors) * 100)}`] = darkerColor;
                        }
                    }
                    returnObj[colorName] = colorObj;
                });

                //@ts-ignore
                return returnObj;
                break;
            }
        }
    }

    /**
     * 
     * @param {rgb|hsl|String} color 
     */
    constructor(color) {
        let hexCode = '#808080';
        switch (Color.typeof(color)) {
            case "hex": {
                //@ts-ignore
                hexCode = color;
                if (hexCode.slice(0, 1) !== '#') {
                    hexCode = `#${hexCode}`;
                }
                break;
            }
            case "rgb_string": {
                //@ts-ignore
                hexCode = Color.rgbToHex(Color.rgbStringToObj(color));
                break;
            }
            case "hsl_string": {
                //@ts-ignore
                hexCode = Color.hslToHex(Color.hslStringToObj(color));
                break;
            }
            case 'hsl': {
                //@ts-ignore
                hexCode = Color.hslToHex(color);
                break;
            }
            case 'rgb': {
                //@ts-ignore
                hexCode = Color.rgbToHex(color);
                break;
            }
            case "predefined": {
                //@ts-ignore
                hexCode = Color.predefinedToHex(color);
                break;
            }
            case "undefined": {
                //@ts-ignore
                hexCode = '#808080';
                break;
            }
        }
        this.#hexCode = hexCode;
    }
}

export { Utils, CustomScroll, Color };