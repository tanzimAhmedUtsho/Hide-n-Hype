import { StaticRouter, useRoutes } from "react-router";
import { routeConfig } from "./routeConfig";

function AppRoutes() {
  return useRoutes(routeConfig);
}

export function StaticApp({ location }: { location: string }) {
  return (
    <StaticRouter location={location}>
      <AppRoutes />
    </StaticRouter>
  );
}
