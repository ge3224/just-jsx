import { createDomElement } from "../../src/index";

/**
 * Memory Management Patterns
 *
 * Just JSX doesn't provide automatic cleanup for event listeners.
 * This recipe shows patterns for manual memory management.
 */

// =============================================================================
// Problem: Memory Leaks from Event Listeners
// =============================================================================

console.log("=== Problem: Memory Leak ===");

// BAD: Event listener never cleaned up
function createLeakyButton() {
  const handleClick = () => {
    console.log("Leaked click handler");
  };

  const button = <button onClick={handleClick}>Click me</button>;
  document.body.appendChild(button);

  // Even if button is removed from DOM later,
  // the event listener remains in memory
}

// Calling this multiple times creates memory leaks
for (let i = 0; i < 3; i++) {
  createLeakyButton();
}

// =============================================================================
// Solution 1: Store References and Clean Up Manually
// =============================================================================

console.log("\n=== Solution 1: Manual Cleanup ===");

function createCleanButton() {
  const handleClick = () => {
    console.log("Clean click handler");
  };

  const button = <button onClick={handleClick}>Click me</button>;
  document.body.appendChild(button);

  // Return cleanup function
  return () => {
    button.removeEventListener("click", handleClick);
    button.remove();
    console.log("Cleaned up button");
  };
}

const cleanup = createCleanButton();
// Later, when component unmounts:
setTimeout(() => cleanup(), 1000);

// =============================================================================
// Solution 2: AbortController (Modern, Recommended)
// =============================================================================

console.log("\n=== Solution 2: AbortController ===");

function createButtonWithController() {
  const controller = new AbortController();

  const button = <button>Click me</button> as HTMLButtonElement;

  // Add listener with AbortSignal
  button.addEventListener(
    "click",
    () => console.log("Controlled click"),
    { signal: controller.signal }
  );

  document.body.appendChild(button);

  // Return cleanup that aborts all listeners
  return () => {
    controller.abort();
    button.remove();
    console.log("Aborted all listeners");
  };
}

const cleanup2 = createButtonWithController();
setTimeout(() => cleanup2(), 2000);

// =============================================================================
// Solution 3: Cleanup Manager Pattern
// =============================================================================

console.log("\n=== Solution 3: Cleanup Manager ===");

class CleanupManager {
  private cleanupFns: Array<() => void> = [];

  addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ) {
    element.addEventListener(type, listener);
    this.cleanupFns.push(() => element.removeEventListener(type, listener));
  }

  cleanup() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    console.log("Cleaned up all listeners");
  }
}

function createComponent() {
  const manager = new CleanupManager();

  const button = <button>Click</button> as HTMLButtonElement;
  const input = <input type="text" /> as HTMLInputElement;

  manager.addEventListener(button, "click", () => console.log("Button clicked"));
  manager.addEventListener(input, "input", (e) => console.log("Input:", (e.target as HTMLInputElement).value));

  document.body.appendChild(button);
  document.body.appendChild(input);

  return () => {
    manager.cleanup();
    button.remove();
    input.remove();
  };
}

const cleanup3 = createComponent();
setTimeout(() => cleanup3(), 3000);

// =============================================================================
// Solution 4: Component Wrapper with Lifecycle
// =============================================================================

console.log("\n=== Solution 4: Component with Lifecycle ===");

interface ComponentLifecycle {
  onMount?: () => void;
  onUnmount?: () => void;
}

function createComponentWithLifecycle<T extends HTMLElement>(
  factory: () => T,
  lifecycle: ComponentLifecycle = {}
): { element: T; unmount: () => void } {
  const element = factory();

  // Call mount hook
  lifecycle.onMount?.();

  return {
    element,
    unmount() {
      lifecycle.onUnmount?.();
      element.remove();
    },
  };
}

// Usage:
const { element, unmount } = createComponentWithLifecycle(
  () => {
    const button = <button>Lifecycle Button</button> as HTMLButtonElement;
    const handleClick = () => console.log("Lifecycle click");
    button.addEventListener("click", handleClick);

    // Store handler for cleanup
    (button as any).__cleanup = () => button.removeEventListener("click", handleClick);

    return button;
  },
  {
    onMount: () => console.log("Component mounted"),
    onUnmount: () => {
      (element as any).__cleanup?.();
      console.log("Component unmounted");
    },
  }
);

document.body.appendChild(element);
setTimeout(() => unmount(), 4000);

// =============================================================================
// Solution 5: React-style Hook Pattern
// =============================================================================

console.log("\n=== Solution 5: React Hook Pattern ===");

// Simulated hook for event listeners
function useEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | null,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void
): () => void {
  if (!element) return () => {};

  element.addEventListener(event, handler as EventListener);

  // Return cleanup function (like React useEffect)
  return () => {
    element.removeEventListener(event, handler as EventListener);
  };
}

const hookButton = <button>Hook Button</button> as HTMLButtonElement;
document.body.appendChild(hookButton);

const hookCleanup = useEventListener(hookButton, "click", () => {
  console.log("Hook click");
});

// Cleanup when done
setTimeout(() => {
  hookCleanup();
  hookButton.remove();
}, 5000);

// =============================================================================
// Best Practices Summary
// =============================================================================

console.log("\n=== Best Practices ===");
console.log(`
Memory Management Best Practices:

1. ALWAYS clean up event listeners when removing elements
2. Use AbortController for multiple listeners (modern, recommended)
3. Use CleanupManager for complex components with many listeners
4. Store handler references if adding listeners manually
5. Consider a lightweight lifecycle wrapper for reusable components

Common Patterns:

// Pattern 1: Simple cleanup
const handler = () => console.log('click');
element.addEventListener('click', handler);
// Later: element.removeEventListener('click', handler);

// Pattern 2: AbortController (best for modern apps)
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// Later: controller.abort();

// Pattern 3: Manager class
const manager = new CleanupManager();
manager.addEventListener(element, 'click', handler);
// Later: manager.cleanup();

// Pattern 4: Component with lifecycle
const { unmount } = createComponentWithLifecycle(() => element, {
  onUnmount: () => cleanup()
});
// Later: unmount();
`);
