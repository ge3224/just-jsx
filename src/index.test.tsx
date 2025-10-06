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
