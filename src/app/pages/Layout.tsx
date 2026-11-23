import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LiveChat } from "../components/LiveChat";
import { CookieConsent } from "../components/CookieConsent";
import { pageMetadata, siteUrl, socialImageUrl } from "../seoMetadata";
import { cmsProductImage, loadCmsProducts } from "../cmsProducts";

function updateMetaTag(selector: string, attribute: string, key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function setCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function applyMetadata(path: string, metadata: { title: string; description: string }, image = socialImageUrl, type = "website") {
  const canonicalUrl = `${siteUrl}${path === "/" ? "/" : path}`;
  document.title = metadata.title;
  setCanonical(canonicalUrl);
  updateMetaTag('meta[name="description"]', "name", "description", metadata.description);
  updateMetaTag('meta[name="robots"]', "name", "robots", "index, follow");
  updateMetaTag('meta[property="og:type"]', "property", "og:type", type);
  updateMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "Hide n Hype");
  updateMetaTag('meta[property="og:image"]', "property", "og:image", image);
  updateMetaTag('meta[property="og:title"]', "property", "og:title", metadata.title);
  updateMetaTag('meta[property="og:description"]', "property", "og:description", metadata.description);
  updateMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  updateMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  updateMetaTag('meta[name="twitter:title"]', "name", "twitter:title", metadata.title);
  updateMetaTag('meta[name="twitter:description"]', "name", "twitter:description", metadata.description);
  updateMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);
}

function compactDescription(value: string, limit = 160) {
  const text = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const shortened = text.slice(0, limit - 1);
  const wordEnd = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, wordEnd > 0 ? wordEnd : shortened.length)}...`;
}

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const metadata = pageMetadata[normalizedPath];
    document.getElementById("cms-product-jsonld")?.remove();

    const productPath = normalizedPath.match(/^\/products\/([^/]+)$/);
    if (!metadata && productPath) {
      const controller = new AbortController();
      updateMetaTag('meta[name="robots"]', "name", "robots", "noindex, follow");
      loadCmsProducts(controller.signal).then(products => {
        const product = products.find(item => item.slug === productPath[1] && String(item.status).toLowerCase() === "published");
        if (!product) {
          document.title = "Product not found | Hide n Hype";
          document.head.querySelector('link[rel="canonical"]')?.remove();
          return;
        }

        const category = product.collection || product.category || "Apparel";
        const fallbackTitle = `${product.name} | Hide n Hype`;
        const title = (product.seoTitle?.trim() || fallbackTitle).slice(0, 60);
        const fallbackDescription = `Explore the ${product.name}, a style from Hide n Hype. Contact our team for wholesale, sourcing, and product enquiries.`;
        const description = compactDescription(product.seoDescription?.trim() || product.description || fallbackDescription) || compactDescription(fallbackDescription);
        const image = cmsProductImage(product.image) || socialImageUrl;
        applyMetadata(normalizedPath, { title, description }, image, "product");

        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description,
          image,
          sku: product.sku,
          category,
          brand: { "@type": "Brand", name: "Hide n Hype" },
          url: `${siteUrl}${normalizedPath}`,
        };
        const script = document.createElement("script");
        script.id = "cms-product-jsonld";
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }).catch(() => {
        document.title = "Product not found | Hide n Hype";
        document.head.querySelector('link[rel="canonical"]')?.remove();
      });

      return () => {
        controller.abort();
        document.getElementById("cms-product-jsonld")?.remove();
      };
    }

    if (!metadata) {
      document.title = "Page not found | Hide n Hype";
      updateMetaTag('meta[name="robots"]', "name", "robots", "noindex, follow");
      document.head.querySelector('link[rel="canonical"]')?.remove();
      return;
    }

    applyMetadata(normalizedPath, metadata);
  }, [pathname]);

  return (
    <div className="bg-background min-h-screen" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <Navbar />
      <Outlet />
      <Footer />
      <LiveChat />
      <CookieConsent />
    </div>
  );
}
