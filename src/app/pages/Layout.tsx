import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LiveChat } from "../components/LiveChat";

const siteUrl = "https://www.hidenhype.com";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Hide n Hype | Bangladesh Apparel Sourcing & Streetwear",
    description:
      "Hide n Hype connects global brands with apparel sourcing and manufacturing from Bangladesh, alongside bold streetwear collections.",
  },
  "/new-arrivals": {
    title: "New Arrivals | Hide n Hype",
    description: "Explore the latest streetwear styles and new apparel from Hide n Hype.",
  },
  "/collection": {
    title: "Apparel Collection | Hide n Hype",
    description:
      "Browse the Hide n Hype apparel collection, including streetwear, denim, accessories, and more.",
  },
  "/collection/men": {
    title: "Men's Apparel Collection | Hide n Hype",
    description: "Explore men's streetwear, apparel, and everyday essentials from Hide n Hype.",
  },
  "/collection/women": {
    title: "Women's Apparel Collection | Hide n Hype",
    description: "Explore women's streetwear and apparel styles from Hide n Hype.",
  },
  "/collection/kids": {
    title: "Kids' Apparel Collection | Hide n Hype",
    description: "Explore comfortable kids' streetwear and apparel from Hide n Hype.",
  },
  "/collection/accessories": {
    title: "Streetwear Accessories | Hide n Hype",
    description: "Browse bags, caps, and streetwear accessories from Hide n Hype.",
  },
  "/collection/leather": {
    title: "Leather Goods Collection | Hide n Hype",
    description: "Explore leather goods and accessories from Hide n Hype.",
  },
  "/collection/denim": {
    title: "Denim Collection | Hide n Hype",
    description:
      "Explore denim jeans, jackets, shirts, and streetwear styles from the Hide n Hype denim collection.",
  },
  "/lookbook": {
    title: "Lookbook | Hide n Hype",
    description: "Discover Hide n Hype streetwear styling, collections, and seasonal looks.",
  },
  "/about": {
    title: "About Hide n Hype | Apparel Sourcing & Manufacturing",
    description:
      "Learn about Hide n Hype, a Bangladesh-based apparel sourcing and manufacturing partner for global brands.",
  },
  "/contact": {
    title: "Contact Hide n Hype | Apparel Sourcing Enquiries",
    description:
      "Contact Hide n Hype for apparel sourcing, manufacturing, product development, and business enquiries.",
  },
  "/sourcing-manufacturing": {
    title: "Apparel Sourcing & Manufacturing in Bangladesh | Hide n Hype",
    description:
      "Hide n Hype supports global buyers with apparel sourcing, manufacturing, sampling, quality control, and export coordination from Bangladesh.",
  },
};

function updateMetaTag(selector: string, attribute: string, key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[pathname] ?? {
      title: "Hide n Hype | Apparel Sourcing & Streetwear",
      description:
        "Discover apparel sourcing, manufacturing, and streetwear collections from Hide n Hype.",
    };
    const canonicalUrl = `${siteUrl}${pathname === "/" ? "/" : pathname}`;

    document.title = metadata.title;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    updateMetaTag('meta[name="description"]', "name", "description", metadata.description);
    updateMetaTag('meta[name="robots"]', "name", "robots", "index, follow");
    updateMetaTag('meta[property="og:title"]', "property", "og:title", metadata.title);
    updateMetaTag('meta[property="og:description"]', "property", "og:description", metadata.description);
    updateMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    updateMetaTag('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
    updateMetaTag('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
  }, [pathname]);

  return (
    <div className="bg-background min-h-screen" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <Navbar />
      <Outlet />
      <Footer />
      <LiveChat />
    </div>
  );
}
