/**
 * JSX Rendering Pragma Functions
 *
 * Zero-dependency vanilla TypeScript JSX implementation.
 * Provides createDomElement and createDomFragment functions for JSX transformation.
 */

/** Ref can be a callback or an object with a current property */
export type Ref<T = Element> = ((el: T) => void) | { current: T | null };

/** Creates a ref object that can be passed to JSX elements */
export function createRef<T = Element>(): { current: T | null } {
  return { current: null };
}

/** Style attribute can be a string or an object with CSS properties (kebab-case or camelCase) */
type StyleAttribute = string | { [key: string]: string | number };

/** Common attributes for DOM elements (children, key, ref, etc.) */
type DOMAttributes = {
  children?: JSX.Element | JSX.Element[];
  key?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: Ref<any>;
  style?: StyleAttribute;
  [key: string]: unknown;
};

/** SVG-specific attributes that should accept strings */
type SVGAttributes = {
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  xmlns?: string;
  [key: string]: unknown;
};

/** JSX namespace for TypeScript compiler */
declare global {
  namespace JSX {
    /** Result of JSX expression */
    type Element = Node | DocumentFragment | string | number | boolean | null | undefined | Array<Element> | ReadonlyArray<Element>;

    /** Props for intrinsic HTML/SVG elements */
    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: Omit<Partial<HTMLElementTagNameMap[K]>, 'children' | 'style'> & DOMAttributes;
    } & {
      [K in keyof SVGElementTagNameMap]: SVGAttributes & DOMAttributes;
    };

    /** Props for functional components - tells TS which prop holds children */
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

/** Function that accepts props and returns JSX */
export type FunctionalComponent<P = {}> = (props: P & { children?: JSX.Element | JSX.Element[] }) => JSX.Element;

/** JSX pragma: creates DOM element or invokes component */
export function createDomElement<P = {}>(
  tag: string | FunctionalComponent<P>,
  props: (P & DOMAttributes) | null,
  ...children: (JSX.Element | JSX.Element[])[]
): JSX.Element {
  if (typeof tag === "function") {
    return tag({ ...(props || {} as P), children });
  }

  if (!props && children.length === 1 && typeof children[0] === "string") {
    const element = document.createElement(tag);
    element.textContent = children[0];
    return element;
  }

  if (!props && children.length === 0) {
    return document.createElement(tag);
  }

  const ns = isSvgTag(tag) ? SVG_NS : null;
  const element = ns !== null
    ? document.createElementNS(ns, tag.split("_")[0])
    : document.createElement(tag);

  for (let i = 0; i < children.length; i++) {
    appendDomChild(element, children[i]);
  }

  if (props) {
    const ref = props.ref;
    for (const name in props) {
      setProp(element, name, props[name]);
    }
    if (ref) {
      typeof ref === "function" ? ref(element) : ref.current = element;
    }
  }

  return element;
}

/** JSX fragment pragma: creates DocumentFragment for <>...</> */
export function createDomFragment(
  props: { children?: JSX.Element | JSX.Element[] } | null,
  ...children: (JSX.Element | JSX.Element[])[]
): DocumentFragment {
  const fragment = new DocumentFragment();
  const actualChildren = props?.children || children;
  const childArray = Array.isArray(actualChildren) ? actualChildren : [actualChildren];
  for (let i = 0; i < childArray.length; i++) {
    appendDomChild(fragment, childArray[i]);
  }
  return fragment;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const HTML_NS = "http://www.w3.org/1999/xhtml";
const SVG_TAGS = new Set((`
  a_svg,animate,animatemotion,animatetransform,audio_svg,canvas_svg,circle,clippath,defs,desc,discard,ellipse,
  feblend,fecolormatrix,fecomponenttransfer,fecomposite,feconvolvematrix,fediffuselighting,fedisplacementmap,
  fedistantlight,fedropshadow,feflood,fefunca,fefuncb,fefuncg,fefuncr,fegaussianblur,feimage,femerge,femergenode,
  femorphology,feoffset,fepointlight,fespecularlighting,fespotlight,fetile,feturbulence,filter,foreignobject,g,
  iframe_svg,image_svg,line,lineargradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialgradient,
  rect,script_svg,set,stop,style_svg,svg,switch,symbol,text,textpath,title,tspan,unknown,use,video_svg,view
`).trim().replace(/\s+/g, "").split(","));
const PROPERTY_NAMES: Record<string, string> = {
  value: "value", checked: "checked", selected: "selected", indeterminate: "indeterminate",
  muted: "muted", volume: "volume", currentTime: "currentTime", playbackRate: "playbackRate",
  innerHTML: "innerHTML", textContent: "textContent", innerText: "innerText",
};
const BOOLEAN_ATTRS = new Set((`
  disabled,readonly,required,autofocus,autoplay,controls,loop,multiple,open,hidden,reversed,
  allowfullscreen,default,ismap,novalidate,formnovalidate,defer,async
`).trim().replace(/\s+/g, "").split(","));

function isSvgTag(tag: string): boolean { return SVG_TAGS.has(tag.toLowerCase()); }

function fixNamespaceIfNeeded(parent: Element, child: Element): Element {
  const parentNS = parent.namespaceURI;
  const parentTag = parent.tagName;
  const childNS = child.namespaceURI;
  const childTag = child.tagName;
  const childTagLower = childTag.toLowerCase();

  let expectedNS: string | null = null;

  if (parentTag === 'foreignObject') {
    expectedNS = isSvgTag(childTagLower) ? SVG_NS : HTML_NS;
  } else if (parentNS === SVG_NS) {
    expectedNS = SVG_NS;
  } else if (parentNS === HTML_NS) {
    expectedNS = isSvgTag(childTagLower) ? SVG_NS : HTML_NS;
  }

  if (!expectedNS || childNS === expectedNS) return child;

  const tagForCreation = expectedNS === HTML_NS ? childTagLower : childTag;
  const corrected = document.createElementNS(expectedNS, tagForCreation);

  const attrs = child.attributes;
  for (let i = 0; i < attrs.length; i++) {
    corrected.setAttribute(attrs[i].name, attrs[i].value);
  }

  const childNodes = child.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const grandchild = childNodes[i];
    corrected.appendChild(
      grandchild.nodeType === Node.ELEMENT_NODE
        ? fixNamespaceIfNeeded(corrected, grandchild as Element)
        : grandchild.cloneNode(true)
    );
  }

  return corrected;
}

function appendDomChild(parent: Node, child: JSX.Element | JSX.Element[]): void {
  if (child == null || typeof child === "boolean") return;

  if (Array.isArray(child)) {
    for (let i = 0; i < child.length; i++) {
      appendDomChild(parent, child[i]);
    }
  } else if (typeof child === "string" || typeof child === "number") {
    parent.appendChild(document.createTextNode(String(child)));
  } else if ((child as Node).nodeType === Node.ELEMENT_NODE) {
    parent.appendChild(fixNamespaceIfNeeded(parent as Element, child as Element));
  } else {
    parent.appendChild(child as Node);
  }
}

function styleObjectToString(style: Record<string, string | number>): string {
  const parts: string[] = [];
  for (const key in style) {
    if (/[A-Z]/.test(key)) {
      console.warn(`Style property "${key}" uses camelCase. Use kebab-case instead (e.g., "${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}")`);
    }
    const value = style[key];
    parts.push(`${key}: ${typeof value === "number" ? `${value}px` : value}`);
  }
  return parts.join("; ");
}

function setProp(element: Element, name: string, value: unknown): void {
  if (name === "key" || name === "ref") return;

  if (name.startsWith("on") && typeof value === "function") {
    element.addEventListener(name.toLowerCase().slice(2), value as EventListener);
  } else if (name === "style" && typeof value === "object" && value !== null) {
    element.setAttribute("style", styleObjectToString(value as Record<string, string | number>));
  } else if (BOOLEAN_ATTRS.has(name)) {
    value === false || value == null ? element.removeAttribute(name) : element.setAttribute(name, "");
  } else if (PROPERTY_NAMES[name]) {
    (element as unknown as Record<string, unknown>)[PROPERTY_NAMES[name]] = value;
  } else if (value != null) {
    element.setAttribute(name, String(value));
  }
}
