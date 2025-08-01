import { useState } from "hono/jsx";
import { render } from "hono/jsx/dom";

function App() {
  return (
    <>
      <h1>Hello hono/jsx/dom!</h1>
      <h2>Example of useState()</h2>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}

const root = document.getElementById("root")!;
render(<App />, root);
