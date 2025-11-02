import { describe, it, expect, beforeEach, vi } from "vitest";
import { FunctionalComponent, DOMAttributes, createDomElement, createDomFragment } from "./index";

describe("Test createDomElement", () => {
  let errorWatch: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    errorWatch = vi.spyOn(console, "error").mockImplementation(() => { });
  });

  it("processes a JSX component", () => {
    document.body.appendChild(<p>Hello, world!</p>);
    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Hello, world!</p>");
  });

  it("processes an empty JSX element (fast path)", () => {
    document.body.appendChild(<div />);
    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("processes a JSX component with children", () => {
    const Component = () => {
      return (
        <div>
          <h1>Greeting</h1>
          <div>
            <p>Hello, world!</p>
          </div>
        </div>
      );
    };
    document.body.appendChild(<Component />);

    // content expectations
    expect(document.getElementsByTagName("h1")[0].textContent).toBe("Greeting");
    expect(document.getElementsByTagName("p")[0].textContent).toBe(
      "Hello, world!",
    );
    expect(document.getElementsByTagName("div").length).toBe(2);

    // hierarchical expectations
    expect(document.body.childNodes.length).toBe(1);
    expect(document.body.firstChild.childNodes.length).toBe(2);
    expect(document.body.firstChild.lastChild.childNodes.length).toBe(1);
  });

  it("processes a JSX component with an expression", () => {
    document.body.appendChild(<div>{"He" + "llo"}</div>);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<div>Hello</div>");
  });

  it("processes a JSX component with a prop", () => {
    const Component = ({ prop }) => {
      return <div>{prop}</div>;
    };
    document.body.appendChild(<Component prop={"Hello"} />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<div>Hello</div>");
  });

  it("processes a JSX component with an event listener", () => {
    const id = "clickMe";
    const handler = vi.fn();
    const Component = ({ handler }) => {
      return (
        <div id={id} onClick={handler}>
          Hello
        </div>
      );
    };
    document.body.appendChild(<Component handler={handler} />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe(`<div id="${id}">Hello</div>`);

    const el = document.getElementById(id);
    el.click();
    expect(errorWatch).not.toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
  });

  it("processes inline SVG elements", () => {
    const Component = () => {
      return (
        <svg width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="green"
            stroke-width="4"
            fill="yellow"
          />
        </svg>
      );
    };
    document.body.appendChild(<Component />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe(
      '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle></svg>',
    );
  });

  it("ignores null children", () => {
    document.body.appendChild(<div>{null}</div>);
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("ignores undefined children", () => {
    const value = undefined;
    document.body.appendChild(<div>{value}</div>);
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("ignores boolean children", () => {
    document.body.appendChild(
      <div>
        {true}
        {false}
      </div>
    );
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("handles conditional rendering with boolean operators", () => {
    const showContent = false;
    document.body.appendChild(
      <div>{showContent && <span>Content</span>}</div>
    );
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("handles mixed null/undefined/content children", () => {
    document.body.appendChild(
      <div>
        {null}
        <span>Hello</span>
        {undefined}
        {false}
        <span>World</span>
        {true}
      </div>
    );
    expect(document.body.innerHTML).toBe("<div><span>Hello</span><span>World</span></div>");
  });

  it("handles input value as property", () => {
    const input = <input value="initial" /> as HTMLInputElement;
    document.body.appendChild(input);

    expect(input.value).toBe("initial");
  });

  it("handles checkbox checked as property", () => {
    const checkedBox = <input type="checkbox" checked={true} /> as HTMLInputElement;
    document.body.appendChild(checkedBox);

    expect(checkedBox.checked).toBe(true);
  });

  it("handles checkbox indeterminate as property", () => {
    const checkbox = <input type="checkbox" indeterminate={true} /> as HTMLInputElement;
    document.body.appendChild(checkbox);

    expect(checkbox.indeterminate).toBe(true);
  });

  it("handles for attribute on labels", () => {
    const label = <label for="input-id">Name</label> as HTMLLabelElement;
    document.body.appendChild(label);

    expect(label.getAttribute("for")).toBe("input-id");
    expect(label.htmlFor).toBe("input-id"); // DOM automatically maps for -> htmlFor
  });

  it("handles select value as property", () => {
    const select = (
      <select value="option2">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    ) as HTMLSelectElement;

    document.body.appendChild(select);
    expect(select.value).toBe("option2");
  });

  it("handles boolean attribute disabled=false", () => {
    const button = <button disabled={false}>Click me</button> as HTMLButtonElement;
    document.body.appendChild(button);

    expect(button.hasAttribute("disabled")).toBe(false);
    expect(button.disabled).toBe(false);
  });

  it("handles boolean attribute disabled=true", () => {
    const button = <button disabled={true}>Click me</button> as HTMLButtonElement;
    document.body.appendChild(button);

    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it("handles boolean attribute required=false", () => {
    const input = <input required={false} /> as HTMLInputElement;
    document.body.appendChild(input);

    expect(input.hasAttribute("required")).toBe(false);
    expect(input.required).toBe(false);
  });

  it("handles boolean attribute readonly=true", () => {
    const input = <input readonly={true} /> as HTMLInputElement;
    document.body.appendChild(input);

    expect(input.hasAttribute("readonly")).toBe(true);
    expect(input.readOnly).toBe(true);
  });

  it("handles multiple boolean attributes", () => {
    const input = <input required={true} readonly={false} /> as HTMLInputElement;
    document.body.appendChild(input);

    expect(input.hasAttribute("required")).toBe(true);
    expect(input.required).toBe(true);
    expect(input.hasAttribute("readonly")).toBe(false);
    expect(input.readOnly).toBe(false);
  });

  it("handles style object with kebab-case properties", () => {
    const div = <div style={{ color: 'red', 'font-size': '14px' }} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("color: red; font-size: 14px");
  });

  it("handles style object with number values", () => {
    const div = <div style={{ width: 100, height: 200 }} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("width: 100px; height: 200px");
  });

  it("handles style object with mixed values", () => {
    const div = <div style={{ color: 'blue', 'margin-top': 10, padding: '5px' }} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("color: blue; margin-top: 10px; padding: 5px");
  });

  it("handles style string (not object)", () => {
    const div = <div style="color: green" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("color: green");
  });

  it("warns when camelCase is used in style object", () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    const div = <div style={{ fontSize: '14px' }} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(warnSpy).toHaveBeenCalledWith(
      'Style property "fontSize" uses camelCase. Use kebab-case instead (e.g., "font-size")'
    );
    warnSpy.mockRestore();
  });

  it("passes children in props.children", () => {
    const Container = ({ children }) => {
      return <div class="container">{children}</div>;
    };
    document.body.appendChild(
      <Container>
        <p>Child 1</p>
        <p>Child 2</p>
      </Container>
    );

    expect(document.body.innerHTML).toBe(
      '<div class="container"><p>Child 1</p><p>Child 2</p></div>'
    );
  });

  it("allows destructuring children from props", () => {
    const Wrapper = ({ children, title }) => {
      return (
        <div>
          <h1>{title}</h1>
          {children}
        </div>
      );
    };
    document.body.appendChild(
      <Wrapper title="My Title">
        <p>Content</p>
      </Wrapper>
    );

    expect(document.body.innerHTML).toBe(
      '<div><h1>My Title</h1><p>Content</p></div>'
    );
  });

  it("handles number children", () => {
    document.body.appendChild(<div>{0}</div>);
    expect(document.body.innerHTML).toBe("<div>0</div>");
  });

  it("handles number children with other content", () => {
    document.body.appendChild(<div>Count: {42}</div>);
    expect(document.body.innerHTML).toBe("<div>Count: 42</div>");
  });

  it("handles decimal number children", () => {
    document.body.appendChild(<span>{123.45}</span>);
    expect(document.body.innerHTML).toBe("<span>123.45</span>");
  });

  it("handles negative number children", () => {
    document.body.appendChild(<p>{-10}</p>);
    expect(document.body.innerHTML).toBe("<p>-10</p>");
  });

  it("filters out key prop", () => {
    document.body.appendChild(<div key="item-1">Hello</div>);
    expect(document.body.innerHTML).toBe("<div>Hello</div>");
  });

  it("filters out ref prop", () => {
    document.body.appendChild(<div ref="myRef">World</div>);
    expect(document.body.innerHTML).toBe("<div>World</div>");
  });

  it("handles SVG namespace correctly", () => {
    const svg = <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" />
    </svg> as SVGElement;
    document.body.appendChild(svg);

    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    const circle = svg.querySelector("circle") as SVGElement;
    expect(circle.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("handles foreignObject with HTML inside SVG", () => {
    const svg = (
      <svg width="200" height="200">
        <foreignObject x="10" y="10" width="100" height="100">
          <div>HTML content</div>
        </foreignObject>
      </svg>
    ) as SVGElement;
    document.body.appendChild(svg);

    const foreignObject = svg.querySelector("foreignObject") as SVGElement;
    const div = foreignObject.querySelector("div") as HTMLElement;

    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(foreignObject.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(div.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
  });

  it("handles nested SVG inside HTML inside SVG", () => {
    const svg = (
      <svg width="200" height="200">
        <foreignObject x="10" y="10" width="100" height="100">
          <div>
            <svg width="50" height="50">
              <circle cx="25" cy="25" r="20" />
            </svg>
          </div>
        </foreignObject>
      </svg>
    ) as SVGElement;
    document.body.appendChild(svg);

    const outerSvg = svg;
    const foreignObject = svg.querySelector("foreignObject") as SVGElement;
    const div = foreignObject.querySelector("div") as HTMLElement;
    const innerSvg = div.querySelector("svg") as SVGElement;
    const circle = innerSvg.querySelector("circle") as SVGElement;

    expect(outerSvg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(foreignObject.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(div.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(innerSvg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(circle.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("handles manually constructed element with wrong namespace and children", () => {
    // Manually create a div in the WRONG namespace (SVG) with children
    const wrongNamespaceDiv = document.createElementNS("http://www.w3.org/2000/svg", "div");

    // Add text node child
    wrongNamespaceDiv.appendChild(document.createTextNode("Text content "));

    // Add element child (also in wrong namespace)
    const wrongNamespaceSpan = document.createElementNS("http://www.w3.org/2000/svg", "span");
    wrongNamespaceSpan.textContent = "in span";
    wrongNamespaceDiv.appendChild(wrongNamespaceSpan);

    // Verify it's in wrong namespace before correction
    expect(wrongNamespaceDiv.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(wrongNamespaceSpan.namespaceURI).toBe("http://www.w3.org/2000/svg");

    // Use it in a context where it should be HTML (inside foreignObject)
    const container = (
      <svg>
        <foreignObject x="0" y="0" width="200" height="100">
          {wrongNamespaceDiv}
        </foreignObject>
      </svg>
    ) as SVGElement;

    document.body.appendChild(container);

    // After insertion, it should be corrected to HTML namespace
    const correctedDiv = container.querySelector("div") as HTMLElement;
    const correctedSpan = correctedDiv?.querySelector("span") as HTMLElement;

    expect(correctedDiv).not.toBeNull();
    expect(correctedDiv.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(correctedDiv.textContent).toBe("Text content in span");

    // The span child should also be corrected
    expect(correctedSpan).not.toBeNull();
    expect(correctedSpan.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
  });

  it("handles SVG path element", () => {
    const svg = (
      <svg width="100" height="100">
        <path d="M10 10 L90 90" stroke="black" />
      </svg>
    ) as SVGElement;
    document.body.appendChild(svg);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(path.getAttribute("d")).toBe("M10 10 L90 90");
  });

  it("handles SVG polygon element", () => {
    const svg = (
      <svg width="100" height="100">
        <polygon points="50,10 90,90 10,90" fill="red" />
      </svg>
    ) as SVGElement;
    document.body.appendChild(svg);

    const polygon = svg.querySelector("polygon") as SVGPolygonElement;
    expect(polygon.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(polygon.getAttribute("points")).toBe("50,10 90,90 10,90");
  });

  it("handles SVG line and rect elements", () => {
    const svg = (
      <svg width="100" height="100">
        <rect x="10" y="10" width="30" height="30" fill="blue" />
        <line x1="0" y1="0" x2="100" y2="100" stroke="green" />
      </svg>
    ) as SVGElement;
    document.body.appendChild(svg);

    const rect = svg.querySelector("rect") as SVGRectElement;
    const line = svg.querySelector("line") as SVGLineElement;

    expect(rect.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(line.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("handles array children", () => {
    const items = ["Apple", "Banana", "Cherry"];
    document.body.appendChild(
      <ul>
        {items.map(item => <li>{item}</li>)}
      </ul>
    );
    expect(document.body.innerHTML).toBe("<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>");
  });

  it("handles mixed array and single children", () => {
    const items = ["Item 1", "Item 2"];
    document.body.appendChild(
      <div>
        <h1>Title</h1>
        {items.map(item => <p>{item}</p>)}
        <footer>End</footer>
      </div>
    );
    expect(document.body.innerHTML).toBe("<div><h1>Title</h1><p>Item 1</p><p>Item 2</p><footer>End</footer></div>");
  });

  it("handles deeply nested array children", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"]
    ];
    document.body.appendChild(
      <div>
        {matrix.map(row => row.map(cell => <span>{cell}</span>))}
      </div>
    );
    expect(document.body.innerHTML).toBe("<div><span>a</span><span>b</span><span>c</span><span>d</span></div>");
  });

  it("handles empty array children", () => {
    const items: string[] = [];
    document.body.appendChild(
      <div>
        {items.map(item => <p>{item}</p>)}
      </div>
    );
    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("handles style with empty object", () => {
    const div = <div style={{}} /> as HTMLDivElement;
    document.body.appendChild(div);
    expect(div.getAttribute("style")).toBe("");
  });

  it("handles style with unitless properties that need px", () => {
    const div = <div style={{ width: 100, height: 50, 'z-index': 10 }} /> as HTMLDivElement;
    document.body.appendChild(div);
    expect(div.getAttribute("style")).toBe("width: 100px; height: 50px; z-index: 10px");
  });

  it("handles style with string values that already have units", () => {
    const div = <div style={{ width: '50%', height: '2em', margin: '10px 20px' }} /> as HTMLDivElement;
    document.body.appendChild(div);
    expect(div.getAttribute("style")).toBe("width: 50%; height: 2em; margin: 10px 20px");
  });

  it("handles className attribute", () => {
    const div = <div className="test-class" /> as HTMLDivElement;
    document.body.appendChild(div);
    expect(div.getAttribute("classname")).toBe("test-class");
    expect(div.className).toBe("");
  });

  it("handles class attribute", () => {
    const div = <div class="test-class" /> as HTMLDivElement;
    document.body.appendChild(div);
    expect(div.getAttribute("class")).toBe("test-class");
    expect(div.className).toBe("test-class");
  });

  it("handles htmlFor on label", () => {
    const label = <label htmlFor="input-id">Label</label> as HTMLLabelElement;
    document.body.appendChild(label);
    expect(label.getAttribute("htmlfor")).toBe("input-id");
  });

  it("handles video element properties", () => {
    const video = <video muted={true} volume={0.5} currentTime={10} /> as HTMLVideoElement;
    document.body.appendChild(video);

    expect(video.muted).toBe(true);
    expect(video.volume).toBe(0.5);
    expect(video.currentTime).toBe(10);
  });

  it("handles audio element properties", () => {
    const audio = <audio muted={true} playbackRate={1.5} /> as HTMLAudioElement;
    document.body.appendChild(audio);

    expect(audio.muted).toBe(true);
    expect(audio.playbackRate).toBe(1.5);
  });

  it("handles innerHTML property", () => {
    const div = <div innerHTML="<strong>Bold</strong>" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.innerHTML).toBe("<strong>Bold</strong>");
  });

  it("handles textContent property", () => {
    const div = <div textContent="Plain text" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.textContent).toBe("Plain text");
  });

  it("handles innerText property", () => {
    const div = <div innerText="Inner text" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.innerText).toBe("Inner text");
  });

  it("handles multiple event listeners on same element", () => {
    const clickHandler = vi.fn();
    const mouseoverHandler = vi.fn();
    const button = <button onClick={clickHandler} onMouseover={mouseoverHandler}>Test</button> as HTMLButtonElement;
    document.body.appendChild(button);

    button.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);

    button.dispatchEvent(new MouseEvent("mouseover"));
    expect(mouseoverHandler).toHaveBeenCalledTimes(1);
  });

  it("handles onInput event", () => {
    const inputHandler = vi.fn();
    const input = <input onInput={inputHandler} /> as HTMLInputElement;
    document.body.appendChild(input);

    input.dispatchEvent(new InputEvent("input"));
    expect(inputHandler).toHaveBeenCalledTimes(1);
  });

  it("handles onChange event", () => {
    const changeHandler = vi.fn();
    const input = <input onChange={changeHandler} /> as HTMLInputElement;
    document.body.appendChild(input);

    input.dispatchEvent(new Event("change"));
    expect(changeHandler).toHaveBeenCalledTimes(1);
  });

  it("handles onKeypress event", () => {
    const keypressHandler = vi.fn();
    const input = <input onKeypress={keypressHandler} /> as HTMLInputElement;
    document.body.appendChild(input);

    input.dispatchEvent(new KeyboardEvent("keypress"));
    expect(keypressHandler).toHaveBeenCalledTimes(1);
  });

  it("handles onFocus and onBlur events", () => {
    const focusHandler = vi.fn();
    const blurHandler = vi.fn();
    const input = <input onFocus={focusHandler} onBlur={blurHandler} /> as HTMLInputElement;
    document.body.appendChild(input);

    input.dispatchEvent(new FocusEvent("focus"));
    expect(focusHandler).toHaveBeenCalledTimes(1);

    input.dispatchEvent(new FocusEvent("blur"));
    expect(blurHandler).toHaveBeenCalledTimes(1);
  });

  it("handles data-* attributes", () => {
    const div = <div data-id="123" data-name="test" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("data-id")).toBe("123");
    expect(div.getAttribute("data-name")).toBe("test");
  });

  it("handles aria-* attributes", () => {
    const button = <button aria-label="Close" aria-hidden="true" /> as HTMLButtonElement;
    document.body.appendChild(button);

    expect(button.getAttribute("aria-label")).toBe("Close");
    expect(button.getAttribute("aria-hidden")).toBe("true");
  });

  it("handles role attribute", () => {
    const div = <div role="button" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("role")).toBe("button");
  });

  it("handles attribute with value 0", () => {
    const div = <div tabindex={0} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("tabindex")).toBe("0");
  });

  it("handles attribute with empty string", () => {
    const div = <div title="" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("title")).toBe("");
  });

  it("handles prop value NaN", () => {
    const div = <div data-value={NaN} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("data-value")).toBe("NaN");
  });

  it("handles functional component without children", () => {
    const SimpleComponent = () => <div>No children</div>;
    document.body.appendChild(<SimpleComponent />);

    expect(document.body.innerHTML).toBe("<div>No children</div>");
  });

  it("handles functional component with no children prop passed", () => {
    const Component = ({ title }) => <div>{title}</div>;
    document.body.appendChild(<Component title="Test" />);

    expect(document.body.innerHTML).toBe("<div>Test</div>");
  });

  it("handles functional component with undefined props", () => {
    const Component = (props) => <div>{props.value || "default"}</div>;
    document.body.appendChild(<Component value={undefined} />);

    expect(document.body.innerHTML).toBe("<div>default</div>");
  });

  it("handles functional component with null props", () => {
    const Component = (props) => <div>{props.value || "default"}</div>;
    document.body.appendChild(<Component value={null} />);

    expect(document.body.innerHTML).toBe("<div>default</div>");
  });
});

describe("Test createDomFragment", () => {
  let errorWatch: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    errorWatch = vi.spyOn(console, "error").mockImplementation(() => { });
  });

  it("processes a JSX fragment", () => {
    const Frag = () => {
      return (
        <>
          <p>Hello</p>
          <p>World!</p>
        </>
      );
    };
    document.body.appendChild(<Frag />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Hello</p><p>World!</p>");
  });

  it("processes a nested JSX fragment", () => {
    const Nested = () => {
      return (
        <div>
          <>
            <p>Hello</p>
          </>
          <p>World!</p>
        </div>
      );
    };
    document.body.appendChild(<Nested />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe(
      "<div><p>Hello</p><p>World!</p></div>",
    );
  });

  it("processes a JSX fragment with an expression", () => {
    const Frag = () => {
      return (
        <>
          <p>{"He" + "llo"}</p>
          <p>World!</p>
        </>
      );
    };
    document.body.appendChild(<Frag />);
    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Hello</p><p>World!</p>");
  });

  it("processes a JSX fragment with a prop", () => {
    const prop = "Hello";
    const Frag = ({ prop }) => {
      return (
        <>
          <p>{prop}</p>
          <p>World!</p>
        </>
      );
    };
    document.body.appendChild(<Frag prop={prop} />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Hello</p><p>World!</p>");
  });

  it("processes a JSX fragment with an event listener", () => {
    const id = "clickMe";
    const handler = vi.fn();
    const Frag = ({ props }) => {
      return (
        <>
          <p id={props.id} onClick={props.callback}>
            Hello
          </p>
          <p>World!</p>
        </>
      );
    };
    document.body.appendChild(<Frag props={{ id: id, callback: handler }} />);
    const el = document.getElementById(id);
    el.click();

    expect(errorWatch).not.toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
    expect(document.body.innerHTML).toBe(
      `<p id="${id}">Hello</p><p>World!</p>`,
    );
  });

  it("handles empty fragment", () => {
    const EmptyFrag = () => <></>;
    document.body.appendChild(<EmptyFrag />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("");
  });

  it("handles fragment with null children", () => {
    const Frag = () => (
      <>
        {null}
        <p>Content</p>
        {null}
      </>
    );
    document.body.appendChild(<Frag />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Content</p>");
  });

  it("handles fragment with undefined children", () => {
    const value = undefined;
    const Frag = () => (
      <>
        {value}
        <p>Content</p>
      </>
    );
    document.body.appendChild(<Frag />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Content</p>");
  });

  it("handles fragment with boolean children", () => {
    const Frag = () => (
      <>
        {true}
        {false}
        <p>Content</p>
      </>
    );
    document.body.appendChild(<Frag />);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Content</p>");
  });

  it("handles fragment with single non-array child via props", () => {
    // Pass single child via props.children (not array)
    const frag = createDomFragment({ children: <p>Props child</p> });
    document.body.appendChild(frag);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Props child</p>");
  });

  it("handles fragment with single non-array child via rest params", () => {
    // Manually call createDomFragment with a single child (not array)
    const frag = createDomFragment(null, <p>Single child</p>);
    document.body.appendChild(frag);

    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Single child</p>");
  });

  it("handles manually constructed HTML element used as SVG child", () => {
    // Create an HTML circle element (wrong namespace for SVG)
    const htmlCircle = document.createElement("CIRCLE");
    htmlCircle.setAttribute("cx", "25");
    htmlCircle.setAttribute("cy", "25");
    htmlCircle.setAttribute("r", "20");
    htmlCircle.appendChild(document.createTextNode("text"));

    // Verify it's in HTML namespace
    expect(htmlCircle.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(htmlCircle.tagName).toBe("CIRCLE");

    // Try to use it as an SVG child
    const container = (
      <svg width="100" height="100">
        {htmlCircle}
      </svg>
    ) as SVGElement;

    document.body.appendChild(container);

    // After insertion, check if it was corrected
    // SVG querySelector is case-sensitive, HTML created "CIRCLE" but SVG needs "circle"
    const children = Array.from(container.children);
    expect(children.length).toBe(1);

    const corrected = children[0] as Element;
    expect(corrected.tagName.toLowerCase()).toBe("circle");
    expect(corrected.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(corrected.getAttribute("cx")).toBe("25");
    expect(corrected.textContent).toBe("text");
  });

  it("handles SVG element in wrong namespace inside foreignObject", () => {
    // Create an SVG circle element but in HTML namespace (wrong!)
    const wrongNsCircle = document.createElement("circle");
    wrongNsCircle.setAttribute("cx", "50");
    wrongNsCircle.setAttribute("cy", "50");
    wrongNsCircle.setAttribute("r", "40");

    // Verify it's in HTML namespace (wrong for SVG element)
    // HTML elements have uppercase tag names
    expect(wrongNsCircle.namespaceURI).toBe("http://www.w3.org/1999/xhtml");
    expect(wrongNsCircle.tagName).toBe("CIRCLE");

    // Use it inside foreignObject - SVG element inside foreignObject should be corrected to SVG namespace
    const container = (
      <svg width="200" height="200">
        <foreignObject x="0" y="0" width="100" height="100">
          {wrongNsCircle}
        </foreignObject>
      </svg>
    ) as SVGElement;

    document.body.appendChild(container);

    // The circle should be corrected to SVG namespace
    const foreignObject = container.querySelector("foreignObject") as SVGForeignObjectElement;
    const children = Array.from(foreignObject.children);
    expect(children.length).toBe(1);

    const correctedCircle = children[0] as SVGCircleElement;
    expect(correctedCircle.tagName.toLowerCase()).toBe("circle");
    expect(correctedCircle.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(correctedCircle.getAttribute("cx")).toBe("50");
  });
});
