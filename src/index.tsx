import React from "react";
import ReactDOMServer from "react-dom/server";
import Counter from "./counter.tsx";

export default async function render(_url: string, document: string) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <Counter />
    </React.StrictMode>
  );
  return document.replace("<!--app-html-->", html);
}
