import type { RouteObject } from "react-router";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { NewArrivalsPage } from "./pages/NewArrivalsPage";
import { CollectionPage } from "./pages/CollectionPage";
import { MenPage } from "./pages/MenPage";
import { WomenPage } from "./pages/WomenPage";
import { KidsPage } from "./pages/KidsPage";
import { AccessoriesPage } from "./pages/AccessoriesPage";
import { LeatherPage } from "./pages/LeatherPage";
import { DenimPage } from "./pages/DenimPage";
import { LookbookPage } from "./pages/LookbookPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { OurBusinessPage } from "./pages/OurBusinessPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { RidingGearPage } from "./pages/RidingGearPage";
import { FaqPage } from "./pages/FaqPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";

export const routeConfig: RouteObject[] = [
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
      { path: "collection/denim", Component: DenimPage },
      { path: "collection/riding-gear", Component: RidingGearPage },
      { path: "lookbook", Component: LookbookPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "faq", Component: FaqPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "cookie-policy", Component: CookiePolicyPage },
      { path: "sourcing-manufacturing", Component: OurBusinessPage },
      { path: "products/:slug", Component: ProductDetailPage },
    ],
  },
];
