import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          rel="stylesheet"
          href="https://cdn.simplecss.org/simple.min.css"
        />
        <script type="module" src="/src/client.tsx" />
      </head>
      <body>
        <div id="root" />
      </body>
    </html>
  `);
});

  

export default app;
