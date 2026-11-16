import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LiveChat } from "../components/LiveChat";
import { pageMetadata, siteUrl, socialImageUrl } from "../seoMetadata";

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
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const metadata = pageMetadata[normalizedPath];

    if (!metadata) {
      document.title = "Page not found | Hide n Hype";
      updateMetaTag('meta[name="robots"]', "name", "robots", "noindex, follow");
      document.head.querySelector('link[rel="canonical"]')?.remove();
      return;
    }

    const canonicalUrl = `${siteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;

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
    updateMetaTag('meta[property="og:type"]', "property", "og:type", "website");
    updateMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "Hide n Hype");
    updateMetaTag('meta[property="og:image"]', "property", "og:image", socialImageUrl);
    updateMetaTag('meta[property="og:title"]', "property", "og:title", metadata.title);
    updateMetaTag('meta[property="og:description"]', "property", "og:description", metadata.description);
    updateMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    updateMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
    updateMetaTag('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
    updateMetaTag('meta[name="twitter:image"]', "name", "twitter:image", socialImageUrl);
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
