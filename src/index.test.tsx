import { describe, it, expect, beforeEach, vi } from "vitest";
import { createDomElement, createDomFragment } from "./index";

describe("Test createDomElement", () => {
  let errorWatch: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    errorWatch = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("processes a JSX component", () => {
    document.body.appendChild(<p>Hello, world!</p>);
    expect(errorWatch).not.toHaveBeenCalled();
    expect(document.body.innerHTML).toBe("<p>Hello, world!</p>");
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
    const div = <div style={{color: 'red', 'font-size': '14px'}} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("color: red; font-size: 14px");
  });

  it("handles style object with number values", () => {
    const div = <div style={{width: 100, height: 200}} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("width: 100px; height: 200px");
  });

  it("handles style object with mixed values", () => {
    const div = <div style={{color: 'blue', 'margin-top': 10, padding: '5px'}} /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("color: blue; margin-top: 10px; padding: 5px");
  });

  it("handles style string (not object)", () => {
    const div = <div style="color: green" /> as HTMLDivElement;
    document.body.appendChild(div);

    expect(div.getAttribute("style")).toBe("color: green");
  });

  it("warns when camelCase is used in style object", () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const div = <div style={{fontSize: '14px'}} /> as HTMLDivElement;
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
});

describe("Test createDomFragment", () => {
  let errorWatch: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    errorWatch = vi.spyOn(console, "error").mockImplementation(() => {});
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
});
