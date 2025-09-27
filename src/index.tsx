import React from "react";
import ReactDOMServer from "react-dom/server";
import { SearchParamController } from "./rspc.tsx";

export default async function render(_url: string, document: string) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <SearchParamController name="x">
        <input type="text" name="test" />
      </SearchParamController>
    </React.StrictMode>
  );
  return document.replace("<!--app-html-->", html);
}
