import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { ArrowDown, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { cmsApiBase, cmsProductImage } from "../cmsProducts";
import type { ComponentType } from "react";
import { Home } from "./Home";
import { NewArrivalsPage } from "./NewArrivalsPage";
import { SalePage } from "./SalePage";
import { CollectionPage } from "./CollectionPage";
import { MenPage } from "./MenPage";
import { WomenPage } from "./WomenPage";
import { KidsPage } from "./KidsPage";
import { AccessoriesPage } from "./AccessoriesPage";
import { LeatherPage } from "./LeatherPage";
import { DenimPage } from "./DenimPage";
import { LookbookPage } from "./LookbookPage";
import { AboutPage } from "./AboutPage";
import { OurBusinessPage } from "./OurBusinessPage";
import { ContactPage } from "./ContactPage";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LiveChat } from "../components/LiveChat";

const websitePageComponents: Record<string, ComponentType> = {
  home: Home, "new-arrivals": NewArrivalsPage, sale: SalePage, collection: CollectionPage,
  "collection/men": MenPage, "collection/women": WomenPage, "collection/kids": KidsPage,
  "collection/accessories": AccessoriesPage, "collection/leather": LeatherPage, "collection/denim": DenimPage,
  lookbook: LookbookPage, about: AboutPage, "our-business": OurBusinessPage, "sourcing-manufacturing": OurBusinessPage, contact: ContactPage,
};

type LandingData = {
  title: string; slug: string; pageType: "product" | "campaign" | "website"; template: string; productName?: string; sourcePage?: string;
  eyebrow?: string; heroTitle: string; description: string; image?: string; highlights?: string; ctaLabel?: string;
  seoTitle?: string; seoDescription?: string;
};

function updateMeta(selector: string, attribute: string, key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attribute, key); document.head.appendChild(tag); }
  tag.content = value;
}

export function LandingPage() {
  const { slug = "" } = useParams();
  const [page, setPage] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setPageError(""); setPage(null);
    fetch(`${cmsApiBase}/api/public/landing-pages/${encodeURIComponent(slug)}`, { cache: "no-store", signal: controller.signal })
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error || "This page is unavailable."); return result as LandingData; })
      .then(result => {
        setPage(result);
        const canonical = `https://www.hidenhype.com/landing/${encodeURIComponent(result.slug)}`;
        document.title = (result.seoTitle || `${result.title} | Hide n Hype`).slice(0, 60);
        updateMeta('meta[name="description"]', "name", "description", result.seoDescription || result.description);
        updateMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
        updateMeta('meta[property="og:title"]', "property", "og:title", result.seoTitle || result.title);
        updateMeta('meta[property="og:description"]', "property", "og:description", result.seoDescription || result.description);
        updateMeta('meta[property="og:url"]', "property", "og:url", canonical);
        const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') || document.createElement("link");
        link.rel = "canonical"; link.href = canonical; if (!link.parentElement) document.head.appendChild(link);
      })
      .catch(reason => { if (!controller.signal.aborted) setPageError(reason instanceof Error ? reason.message : "This page is unavailable."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!page) return;
    const formElement = event.currentTarget;
    setSending(true); setError(""); setNotice("");
    const data = new FormData(event.currentTarget);
    const utm = new URLSearchParams(window.location.search);
    const payload = {
      customer: String(data.get("name") ?? "").trim(), email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(), shippingAddress: String(data.get("address") ?? "").trim(),
      product: page.productName || page.title, message: String(data.get("message") ?? "").trim(), landingPageSlug: page.slug,
      utmSource: utm.get("utm_source") ?? "", utmMedium: utm.get("utm_medium") ?? "", utmCampaign: utm.get("utm_campaign") ?? "",
    };
    try {
      const response = await fetch(`${cmsApiBase}/api/public/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not send your enquiry.");
      formElement.reset(); setNotice(`Thanks — your enquiry ${result.orderNumber} has been sent. Our team will contact you.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not send your enquiry."); }
    finally { setSending(false); }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#090909] text-white"><LoaderCircle className="animate-spin text-[#c7a64b]"/></main>;
  if (pageError || !page) return <main className="grid min-h-screen place-items-center bg-[#090909] px-6 text-center text-white"><div><h1 className="text-3xl font-semibold">Page unavailable</h1><p className="mt-3 text-white/60">{pageError || "This landing page may have been removed."}</p><Link className="mt-6 inline-block text-[#c7a64b]" to="/">Return to Hide n Hype</Link></div></main>;

  const image = cmsProductImage(page.image) || "";
  const highlights = String(page.highlights ?? "").split("\n").map(value => value.trim()).filter(Boolean).slice(0, 6);
  const wholesale = page.template === "wholesale";
  const background = wholesale ? "bg-[#101512]" : page.template === "collection-campaign" ? "bg-[#11100d]" : "bg-[#090909]";
  const ExistingWebsitePage = page.sourcePage ? websitePageComponents[page.sourcePage] : null;

  return <>
  {ExistingWebsitePage && <Navbar/>}
  <main className={`min-h-screen ${background} text-[#f3f0e7]`} style={{ fontFamily: "'Barlow', sans-serif" }}>
    {!ExistingWebsitePage && <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10"><Link to="/" className="font-bold tracking-tight">Hide n <span className="text-[#c7a64b]">Hype</span></Link><span className="text-xs uppercase tracking-[0.2em] text-white/45">{page.pageType === "product" ? "Product enquiry" : "Campaign"}</span></header>}
    {ExistingWebsitePage ? <ExistingWebsitePage/> : <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-5 md:grid-cols-2 md:gap-14 md:px-10 md:pb-20 md:pt-10">
      <div className={image ? "order-2 md:order-1" : "order-2 md:order-1"}>
        {page.eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c7a64b]">{page.eyebrow}</p>}
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] md:text-6xl">{page.heroTitle}</h1>
        <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-7 text-white/65 md:text-lg">{page.description}</p>
        {highlights.length > 0 && <ul className="mt-6 grid gap-3 text-sm text-white/80">{highlights.map((item, index) => <li key={`${index}-${item}`} className="flex items-start gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#c7a64b]"/>{item}</li>)}</ul>}
        <a href="#enquiry-form" className="mt-8 inline-flex items-center gap-3 bg-[#c7a64b] px-6 py-3 font-semibold text-black transition hover:bg-[#ddbd65]">{page.ctaLabel || "Enquire now"}<ArrowDown size={16}/></a>
        {page.productName && <p className="mt-4 text-xs text-white/40">Enquire about: {page.productName}</p>}
      </div>
      <div className="order-1 md:order-2">{image ? <img src={image} alt={page.productName || page.title} className="max-h-[620px] w-full object-cover"/> : <div className="grid aspect-[4/3] place-items-center border border-white/10 bg-white/[0.03] text-center"><div><p className="text-xs uppercase tracking-[0.25em] text-[#c7a64b]">{page.eyebrow || "HIDE N HYPE"}</p><p className="mt-3 px-8 text-3xl font-bold">{page.title}</p></div></div>}</div>
    </section>}
    <section id="enquiry-form" className="border-t border-white/10 bg-black/20 px-5 py-14 md:px-10 md:py-20"><div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16"><div><p className="text-xs uppercase tracking-[0.2em] text-[#c7a64b]">Talk to our team</p><h2 className="mt-3 text-3xl font-semibold md:text-4xl">Ask us about this {page.pageType === "product" ? "product" : page.pageType === "website" ? "page" : "campaign"}</h2><p className="mt-4 max-w-md leading-7 text-white/55">Send your details and our team will get back to you about availability, pricing or next steps.</p></div><form onSubmit={submit} className="grid gap-3 sm:grid-cols-2"><input required name="name" minLength={2} maxLength={120} autoComplete="name" placeholder="Your name *" className="border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c7a64b]"/><input name="email" type="email" maxLength={254} autoComplete="email" placeholder="Email address (optional)" className="border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c7a64b]"/><input required name="phone" minLength={6} maxLength={40} autoComplete="tel" placeholder="Phone / WhatsApp *" className="border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c7a64b]"/><input name="address" maxLength={500} autoComplete="street-address" placeholder="District or delivery address (optional)" className="border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c7a64b]"/><textarea name="message" maxLength={1500} rows={3} placeholder="What would you like to know? (optional)" className="border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c7a64b] sm:col-span-2"/>{(error || notice) && <p className={`text-sm sm:col-span-2 ${error ? "text-red-300" : "text-emerald-300"}`} role="status">{error || notice}</p>}<button disabled={sending} className="inline-flex items-center justify-center gap-2 bg-[#c7a64b] px-5 py-3 font-semibold text-black disabled:opacity-60 sm:col-span-2">{sending ? "Sending..." : <>{page.ctaLabel || "Send enquiry"}<ArrowRight size={16}/></>}</button><p className="text-xs text-white/45 sm:col-span-2">We will use these details to respond to your enquiry. Read our <Link to="/privacy-policy" className="text-[#c7a64b] underline underline-offset-2">Privacy Policy</Link> to learn how we handle your information.</p></form></div></section>
    <footer className="px-5 py-7 text-center text-xs text-white/35">© {new Date().getFullYear()} Hide n Hype</footer>
  </main>
  {ExistingWebsitePage && <><Footer/><LiveChat/></>}
  </>;
}
