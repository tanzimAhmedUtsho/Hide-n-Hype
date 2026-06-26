import { createBrowserRouter } from "react-router";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { NewArrivalsPage } from "./pages/NewArrivalsPage";
import { CollectionPage } from "./pages/CollectionPage";
import { MenPage } from "./pages/MenPage";
import { WomenPage } from "./pages/WomenPage";
import { KidsPage } from "./pages/KidsPage";
import { AccessoriesPage } from "./pages/AccessoriesPage";
import { LeatherPage } from "./pages/LeatherPage";
import { LookbookPage } from "./pages/LookbookPage";
import { AboutPage } from "./pages/AboutPage";
import { SalePage } from "./pages/SalePage";
import { ContactPage } from "./pages/ContactPage";
import { SourcingManufacturingPage } from "./pages/SourcingManufacturingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "new-arrivals", Component: NewArrivalsPage },
      { path: "collection", Component: CollectionPage },
      { path: "collection/men", Component: MenPage },
      { path: "collection/women", Component: WomenPage },
      { path: "collection/kids", Component: KidsPage },
      { path: "collection/accessories", Component: AccessoriesPage },
      { path: "collection/leather", Component: LeatherPage },
      { path: "lookbook", Component: LookbookPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "sale", Component: SalePage },
      { path: "sourcing-manufacturing", Component: SourcingManufacturingPage },
    ],
  },
]);
