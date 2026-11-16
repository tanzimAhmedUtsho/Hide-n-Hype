import { renderToString } from "react-dom/server";
import { StaticApp } from "./app/StaticApp";

export function renderPage(location: string) {
  return renderToString(<StaticApp location={location} />);
}
