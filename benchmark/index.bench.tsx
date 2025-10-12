import { bench, describe } from "vitest";
import { createDomElement, createDomFragment } from "../src/index";

/**
 * Benchmark Suite for Just JSX
 *
 * This file contains benchmarks organized by category:
 * 1. Basic Operations - Core API performance
 * 2. DOM Operations - Prop/attribute setting, event listeners
 * 3. Scaling Tests - Performance with many elements
 * 4. Real-world Scenarios - Common usage patterns
 * 5. Special Cases - SVG, namespace handling, edge cases
 */

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

function buildTodos(count: number): TodoItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: `Task ${i}`,
    done: i % 3 === 0
  }));
}

interface TableRow {
  id: number;
  name: string;
  email: string;
  age: number;
}

function buildTableData(count: number): TableRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    age: 20 + (i % 50)
  }));
}

// =============================================================================
// 1. Basic Operations
// =============================================================================

describe("Basic Operations", () => {
  bench("create simple element", () => {
    createDomElement("div", null);
  });

  bench("create element with text child", () => {
    createDomElement("div", null, "Hello");
  });

  bench("create element with props", () => {
    createDomElement("div", { class: "box", id: "main" });
  });

  bench("create element with children", () => {
    createDomElement("div", null,
      createDomElement("span", null, "Child 1"),
      createDomElement("span", null, "Child 2")
    );
  });

  bench("create fragment", () => {
    createDomFragment(null,
      createDomElement("div", null, "Item 1"),
      createDomElement("div", null, "Item 2")
    );
  });

  bench("create functional component", () => {
    const Component = ({ name }: { name: string }) => (
      createDomElement("div", null, `Hello, ${name}`)
    );
    createDomElement(Component, { name: "World" });
  });
});

// =============================================================================
// 2. DOM Operations
// =============================================================================

describe("Props and Attributes", () => {
  bench("set single attribute", () => {
    createDomElement("div", { class: "container" });
  });

  bench("set multiple attributes", () => {
    createDomElement("div", {
      class: "container",
      id: "main",
      "data-test": "value",
      "aria-label": "Main container"
    });
  });

  bench("set event listener", () => {
    createDomElement("button", { onClick: () => {} });
  });

  bench("set multiple event listeners", () => {
    createDomElement("button", {
      onClick: () => {},
      onMouseOver: () => {},
      onMouseOut: () => {}
    });
  });

  bench("set style object", () => {
    createDomElement("div", {
      style: { color: "red", "font-size": "16px", margin: "10px" }
    });
  });

  bench("set boolean attributes", () => {
    createDomElement("button", { disabled: true, autofocus: false });
  });

  bench("set form properties", () => {
    createDomElement("input", {
      type: "text",
      value: "hello",
      checked: true
    });
  });
});

// =============================================================================
// 3. Scaling Tests
// =============================================================================

describe("Scaling: List Rendering", () => {
  bench("render 10 items", () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    createDomElement("ul", null,
      ...items.map(i => createDomElement("li", null, `Item ${i}`))
    );
  });

  bench("render 100 items", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    createDomElement("ul", null,
      ...items.map(i => createDomElement("li", null, `Item ${i}`))
    );
  });

  bench("render 1,000 items", () => {
    const items = Array.from({ length: 1000 }, (_, i) => i);
    createDomElement("ul", null,
      ...items.map(i => createDomElement("li", null, `Item ${i}`))
    );
  });
});

describe("Scaling: Deep Nesting", () => {
  bench("5 levels deep", () => {
    createDomElement("div", null,
      createDomElement("div", null,
        createDomElement("div", null,
          createDomElement("div", null,
            createDomElement("div", null, "Deep")
          )
        )
      )
    );
  });

  bench("10 levels deep", () => {
    createDomElement("div", null,
      createDomElement("div", null,
        createDomElement("div", null,
          createDomElement("div", null,
            createDomElement("div", null,
              createDomElement("div", null,
                createDomElement("div", null,
                  createDomElement("div", null,
                    createDomElement("div", null,
                      createDomElement("div", null, "Very deep")
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  });
});

describe("Scaling: Wide Children", () => {
  bench("10 siblings", () => {
    createDomElement("div", null,
      ...Array.from({ length: 10 }, (_, i) =>
        createDomElement("span", null, `Child ${i}`)
      )
    );
  });

  bench("100 siblings", () => {
    createDomElement("div", null,
      ...Array.from({ length: 100 }, (_, i) =>
        createDomElement("span", null, `Child ${i}`)
      )
    );
  });
});

// =============================================================================
// 4. Real-world Scenarios
// =============================================================================

describe("Real-world: Todo List", () => {
  const todos = buildTodos(100);

  bench("render 100 todos", () => {
    createDomElement("ul", { class: "todo-list" },
      ...todos.map(todo =>
        createDomElement("li", { class: todo.done ? "completed" : "" },
          createDomElement("input", { type: "checkbox", checked: todo.done }),
          createDomElement("span", null, todo.text),
          createDomElement("button", { onClick: () => {} }, "Delete")
        )
      )
    );
  });
});

describe("Real-world: Data Table", () => {
  const rows = buildTableData(100);

  bench("render 100-row table", () => {
    createDomElement("table", null,
      createDomElement("thead", null,
        createDomElement("tr", null,
          createDomElement("th", null, "ID"),
          createDomElement("th", null, "Name"),
          createDomElement("th", null, "Email"),
          createDomElement("th", null, "Age")
        )
      ),
      createDomElement("tbody", null,
        ...rows.map(row =>
          createDomElement("tr", null,
            createDomElement("td", null, String(row.id)),
            createDomElement("td", null, row.name),
            createDomElement("td", null, row.email),
            createDomElement("td", null, String(row.age))
          )
        )
      )
    );
  });
});

describe("Real-world: Form", () => {
  bench("render complex form", () => {
    createDomElement("form", { class: "signup-form" },
      createDomElement("div", { class: "field" },
        createDomElement("label", { for: "username" }, "Username"),
        createDomElement("input", {
          type: "text",
          id: "username",
          name: "username",
          required: true
        })
      ),
      createDomElement("div", { class: "field" },
        createDomElement("label", { for: "email" }, "Email"),
        createDomElement("input", {
          type: "email",
          id: "email",
          name: "email",
          required: true
        })
      ),
      createDomElement("div", { class: "field" },
        createDomElement("label", { for: "password" }, "Password"),
        createDomElement("input", {
          type: "password",
          id: "password",
          name: "password",
          required: true
        })
      ),
      createDomElement("div", { class: "field" },
        createDomElement("label", null,
          createDomElement("input", { type: "checkbox", name: "terms" }),
          " I agree to terms"
        )
      ),
      createDomElement("button", { type: "submit" }, "Sign Up")
    );
  });
});

describe("Real-world: Card Grid", () => {
  bench("render 50 cards", () => {
    createDomElement("div", { class: "card-grid" },
      ...Array.from({ length: 50 }, (_, i) =>
        createDomElement("div", { class: "card" },
          createDomElement("img", { src: `https://placeholder.com/${i}`, alt: `Card ${i}` }),
          createDomElement("h3", null, `Card Title ${i}`),
          createDomElement("p", null, `Description for card ${i}`),
          createDomElement("button", { onClick: () => {} }, "Learn More")
        )
      )
    );
  });
});

// =============================================================================
// 5. Special Cases
// =============================================================================

describe("SVG Elements", () => {
  bench("create simple SVG", () => {
    createDomElement("svg", { width: "100", height: "100" },
      createDomElement("circle", { cx: "50", cy: "50", r: "40", fill: "blue" })
    );
  });

  bench("create complex SVG", () => {
    createDomElement("svg", { width: "200", height: "200", viewBox: "0 0 200 200" },
      createDomElement("rect", { x: "10", y: "10", width: "180", height: "180", fill: "lightgray" }),
      createDomElement("circle", { cx: "100", cy: "100", r: "80", fill: "blue" }),
      createDomElement("path", { d: "M100,20 L180,180 L20,180 Z", fill: "red" }),
      createDomElement("text", { x: "100", y: "105", "text-anchor": "middle", fill: "white" }, "SVG")
    );
  });

  bench("render 100 SVG circles", () => {
    createDomElement("svg", { width: "1000", height: "1000" },
      ...Array.from({ length: 100 }, (_, i) =>
        createDomElement("circle", {
          cx: String((i % 10) * 100),
          cy: String(Math.floor(i / 10) * 100),
          r: "40",
          fill: `hsl(${i * 3.6}, 70%, 50%)`
        })
      )
    );
  });
});

describe("Array Children", () => {
  bench("flat array children", () => {
    const items = Array.from({ length: 50 }, (_, i) =>
      createDomElement("li", null, `Item ${i}`)
    );
    createDomElement("ul", null, items);
  });

  bench("nested array children", () => {
    const groups = Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 5 }, (_, j) =>
        createDomElement("li", null, `Item ${i}-${j}`)
      )
    );
    createDomElement("ul", null, groups);
  });
});

describe("Edge Cases", () => {
  bench("null/undefined children", () => {
    createDomElement("div", null, null, undefined, false, true, "text");
  });

  bench("mixed primitive children", () => {
    createDomElement("div", null, "text", 42, 0, "more text");
  });

  bench("empty fragment", () => {
    createDomFragment(null);
  });

  bench("fragment with nulls", () => {
    createDomFragment(null, null, undefined, false);
  });
});

// =============================================================================
// 6. Comparison: Just JSX vs Vanilla
// =============================================================================

describe("Comparison: Just JSX vs Vanilla", () => {
  bench("Just JSX: simple div", () => {
    createDomElement("div", { class: "box" }, "Hello");
  });

  bench("Vanilla: simple div", () => {
    const div = document.createElement("div");
    div.setAttribute("class", "box");
    div.textContent = "Hello";
  });

  bench("Just JSX: nested structure", () => {
    createDomElement("div", { class: "container" },
      createDomElement("h1", null, "Title"),
      createDomElement("p", null, "Paragraph")
    );
  });

  bench("Vanilla: nested structure", () => {
    const div = document.createElement("div");
    div.setAttribute("class", "container");
    const h1 = document.createElement("h1");
    h1.textContent = "Title";
    const p = document.createElement("p");
    p.textContent = "Paragraph";
    div.appendChild(h1);
    div.appendChild(p);
  });

  bench("Just JSX: 10-item list", () => {
    createDomElement("ul", null,
      ...Array.from({ length: 10 }, (_, i) =>
        createDomElement("li", null, `Item ${i}`)
      )
    );
  });

  bench("Vanilla: 10-item list", () => {
    const ul = document.createElement("ul");
    for (let i = 0; i < 10; i++) {
      const li = document.createElement("li");
      li.textContent = `Item ${i}`;
      ul.appendChild(li);
    }
  });
});
