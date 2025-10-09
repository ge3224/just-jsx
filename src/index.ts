/**
 * JSX Rendering Pragma Functions
 *
 * This TypeScript module provides custom pragma functions that enable the SWC
 * (Super-fast Web Compiler) to process JSX components and fragments, converting
 * them into HTML that can be appended to the DOM.
 *
 * The module includes the following functions:
 *
 * 1. createDomElement: A pragma function that processes JSX components. It accepts
 *    a tag (string or function), props (component properties), and children (DOM
 *    nodes or strings), and returns a DOM element created based on the provided
 *    information. If the tag is a function, it invokes the function with props
 *    and children.
 *
 * 2. createDomFragment: A pragma function that processes JSX fragments (empty
 *    tags `<></>`). It converts the fragments into a DocumentFragment, which can
 *    hold multiple DOM nodes and is used for efficient batch appending to the DOM.
 *
 * 3. appendDomChild: A helper function used to append children to a parent node.
 *    It handles arrays of children, text nodes, and regular DOM nodes by appending
 *    them to the parent.
 *
 * These pragma functions allow developers to write JSX-like syntax in TypeScript
 * and utilize the SWC compiler to efficiently transform and render components
 * and fragments to the DOM.
 */

/**
 * appendDomChild is a helper function that appends child nodes (DOM nodes,
 * strings, or numbers) to a parent node. This function is used by the
 * createDomElement and createDomFragment functions.
 *
 * @param parent - The parent node to which children will be appended.
 * @param child  - The child node (DOM node, string, or number) to be appended
 *                 to the parent.
 */
function appendDomChild(parent: Node, child: Node | string | number | (Node | string | number)[]): void {
  // Ignore null, undefined, and boolean values (like React does)
  if (child == null || typeof child === "boolean") {
    return;
  }

  if (Array.isArray(child)) {
    // If child is an array, recursively append each nested child
    child.forEach((nestedChild) => appendDomChild(parent, nestedChild));
  } else if (typeof child === "string" || typeof child === "number") {
    // If child is a string or number, create a text node
    parent.appendChild(document.createTextNode(String(child)));
  } else {
    // Child is a DOM node, append it directly
    parent.appendChild(child);
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

const svgTagNames: string[] = [
  "a_svg",
  "animate",
  "animateMotion",
  "animateTransform",
  "audio_svg",
  "canvas_svg",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "discard",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "iframe_svg",
  "image_svg",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "script_svg",
  "set",
  "stop",
  "style_svg",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "title",
  "tspan",
  "unknown",
  "use",
  "video_svg",
  "view",
];

function isSvgTag(tagName: string): boolean {
  // Check if the tagName is in the list of SVG tag names
  return svgTagNames.includes(tagName.toLowerCase());
}

function namespace(tag: string): string | null {
  if (isSvgTag(tag)) {
    return SVG_NS;
  }
  return null;
}

// Properties that should be set as DOM properties, not attributes
const PROPERTY_NAMES: Record<string, string> = {
  // Form elements - dynamic state
  value: "value",
  checked: "checked",
  selected: "selected",
  indeterminate: "indeterminate",
  // Media elements
  muted: "muted",
  volume: "volume",
  currentTime: "currentTime",
  playbackRate: "playbackRate",
  // Content properties
  innerHTML: "innerHTML",
  textContent: "textContent",
  innerText: "innerText",
};

// Boolean attributes that should be removed when false
const BOOLEAN_ATTRIBUTES = new Set([
  "disabled",
  "readonly",
  "required",
  "autofocus",
  "autoplay",
  "controls",
  "loop",
  "multiple",
  "open",
  "hidden",
  "reversed",
  "allowfullscreen",
  "default",
  "ismap",
  "novalidate",
  "formnovalidate",
  "defer",
  "async",
]);

/**
 * Converts a style object to a CSS string
 * Example: {color: 'red', 'font-size': '14px'} -> "color: red; font-size: 14px"
 * Note: Keys should be kebab-case strings (following SolidJS convention)
 */
function styleObjectToString(style: Record<string, string | number>): string {
  return Object.entries(style)
    .map(([key, value]) => {
      // Warn if camelCase is detected (React habit)
      if (/[A-Z]/.test(key)) {
        console.warn(
          `Style property "${key}" uses camelCase. Use kebab-case instead (e.g., "${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}")`
        );
      }
      const cssValue = typeof value === "number" ? `${value}px` : value;
      return `${key}: ${cssValue}`;
    })
    .join("; ");
}

/**
 * Sets a property or attribute on a DOM element based on the prop name and value
 */
function setProp(element: Element, name: string, value: any): void {
  // Filter out reserved props (key, ref)
  if (name === "key" || name === "ref") {
    return;
  }

  // Handle event listeners
  if (name.startsWith("on") && typeof value === "function") {
    element.addEventListener(name.toLowerCase().slice(2), value);
    return;
  }

  // Handle style objects
  if (name === "style" && typeof value === "object" && value !== null) {
    element.setAttribute("style", styleObjectToString(value));
    return;
  }

  // Handle boolean attributes - remove when false, add when true
  if (BOOLEAN_ATTRIBUTES.has(name)) {
    if (value === false || value == null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, "");
    }
    return;
  }

  // Use DOM property for known property names
  if (PROPERTY_NAMES[name]) {
    (element as any)[PROPERTY_NAMES[name]] = value;
    return;
  }

  // Default: set as attribute
  element.setAttribute(name, value.toString());
}

/**
 * createDomElement is a custom pragma function used by SWC to process
 * JSX components. It converts JSX components and their props
 * into corresponding HTML elements that are then appended to the DOM.
 *
 * @param tag      - The HTML tag name or a functional component.
 * @param props    - An object containing the attributes and properties to be
 *                   applied to the HTML element.
 * @param children - An array of child nodes (DOM nodes, strings, or numbers)
 *                   to be appended to the HTML element.
 * @returns        - The generated HTML element or the result of invoking a
 *                   functional component.
 */
export function createDomElement(
  tag: string | ((props: any) => any),
  props: Record<string, any>,
  ...children: (Node | string | number)[]
) {
  // If the tag is a function, invoke it with props (including children)
  if (typeof tag === "function") {
    return tag({ ...(props || {}), children });
  }

  // Determine whether the element is an SVG element
  const ns = namespace(tag);

  // Create a new DOM element with the specified tag and namespace
  const element = (ns !== null)
    ? document.createElementNS(ns, tag.split("_")[0])
    : document.createElement(tag);

  // Append children first (needed for select value to work)
  children.forEach((child) => {
    appendDomChild(element, child);
  });

  // Set properties, attributes, and event listeners from the props object
  // This must happen after children for select elements to work correctly
  Object.entries(props || {}).forEach(([name, value]) => {
    setProp(element, name, value);
  });

  return element;
}

/**
 * createDomFragment is a custom pragma function used by SWC to process
 * JSX fragments (`<></>`). It converts JSX fragments and their children
 * into a DocumentFragment that can be appended to the DOM.
 *
 * @param props    - Props object that may contain children.
 * @param children - Child nodes (DOM nodes, strings, or numbers) to be included
 *                   in the DocumentFragment.
 * @returns        - The generated DocumentFragment containing the children.
 */
export function createDomFragment(props: any, ...children: (Node | string | number)[]) {
  const fragment = new DocumentFragment();
  // Children might be in props.children (when called from a component) or as spread arguments
  const actualChildren = props?.children || children;
  const childArray = Array.isArray(actualChildren) ? actualChildren : [actualChildren];
  childArray.forEach((child) => appendDomChild(fragment, child));
  return fragment;
}
