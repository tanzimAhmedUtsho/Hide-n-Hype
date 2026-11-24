"use client";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ExternalLink, Monitor, Plus, Search, Smartphone, Upload, X } from "lucide-react";

type RecordItem = { id: string; [key: string]: unknown };
type Product = { id: string; name: string; slug?: string; image?: string; description?: string; price?: string | number; sizes?: string; colors?: string; status?: string };
type LandingForm = Record<string, string>;
const templates = [
  { id: "product-enquiry", name: "Product enquiry", description: "One product, key details and an enquiry form.", tag: "PRODUCT" },
  { id: "collection-campaign", name: "Campaign story", description: "A campaign hero with benefits and a clear CTA.", tag: "CAMPAIGN" },
  { id: "wholesale", name: "Wholesale / sourcing", description: "A focused page for brands and buying teams.", tag: "BUSINESS" },
  { id: "minimal", name: "Minimal", description: "A short page with one message and one action.", tag: "SIMPLE" },
];
const websitePages = [
  ["home", "Home page"], ["new-arrivals", "New Arrivals"], ["sale", "Sale"], ["collection", "Collection"],
  ["collection/men", "Men collection"], ["collection/women", "Women collection"], ["collection/kids", "Kids collection"],
  ["collection/accessories", "Accessories"], ["collection/leather", "Leather"], ["collection/denim", "Denim"],
  ["lookbook", "Lookbook"], ["sourcing-manufacturing", "Our Business"], ["about", "About Hide n Hype"], ["contact", "Contact"],
];
const initialForm: LandingForm = {
  pageType: "product", template: "product-enquiry", productId: "", productName: "", sourcePage: "",
  title: "", slug: "", eyebrow: "HIDE N HYPE", heroTitle: "", description: "", image: "",
  highlights: "Premium quality\nMade for everyday wear\nAsk us about availability",
  ctaLabel: "Enquire now", status: "Draft", seoTitle: "", seoDescription: "",
};
const slugify = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function LandingPagesManager() {
  const [pages, setPages] = useState<RecordItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<LandingForm | null>(null);
  const [editingId, setEditingId] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const [pagesResponse, productsResponse] = await Promise.all([
      fetch("/api/data?collection=landingPages", { cache: "no-store" }),
      fetch("/api/data?collection=products", { cache: "no-store" }),
    ]);
    if (!pagesResponse.ok || !productsResponse.ok) throw new Error("Could not load landing pages or products.");
    setPages(await pagesResponse.json() as RecordItem[]);
    setProducts((await productsResponse.json() as Product[]).filter(product => String(product.status ?? "published").toLowerCase() === "published"));
  }

  useEffect(() => { void load().catch(reason => setError(reason instanceof Error ? reason.message : "Could not load landing pages.")); }, []);

  const filteredPages = useMemo(() => pages.filter(page => `${page.title ?? ""} ${page.slug ?? ""} ${page.status ?? ""}`.toLowerCase().includes(search.toLowerCase())), [pages, search]);
  const selectedProduct = products.find(product => product.id === form?.productId);
  const websitePreviewBase = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname) ? "http://localhost:5173" : "https://www.hidenhype.com";
  const selectedWebsitePath = form?.sourcePage === "our-business" ? "sourcing-manufacturing" : form?.sourcePage;

  function update(key: string, value: string) {
    setForm(current => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (key === "title" && !editingId && (!current.slug || current.slug === slugify(current.title))) next.slug = slugify(value);
      return next;
    });
  }

  function chooseWebsitePage(value: string) {
    const label = websitePages.find(([path]) => path === value)?.[1] ?? "";
    setForm(current => current ? {
      ...current, pageType: value ? "website" : "campaign", sourcePage: value, productId: "", productName: "",
      title: current.title && !websitePages.some(([, name]) => current.title === `${name} landing page`) ? current.title : label ? `${label} landing page` : "",
      slug: !current.slug || websitePages.some(([, name]) => current.slug === slugify(`${name}-landing-page`)) ? slugify(`${value.replaceAll("/", "-")}-landing-page`) : current.slug,
      heroTitle: label || current.heroTitle,
      description: current.description || (label ? `Explore ${label} from Hide n Hype and send us an enquiry.` : ""),
    } : current);
  }

  function openNew() { setEditingId(""); setError(""); setNotice(""); setForm({ ...initialForm }); }
  function openEdit(page: RecordItem) {
    setEditingId(page.id);
    setError(""); setNotice("");
    setForm(Object.fromEntries(Object.keys(initialForm).map(key => [key, String(page[key] ?? initialForm[key])] )));
  }
  function chooseProduct(id: string) {
    const product = products.find(entry => entry.id === id);
    if (!product) { setForm(current => current ? { ...current, productId: "", productName: "" } : current); return; }
    setForm(current => current ? {
      ...current, pageType: "product", productId: product.id, productName: product.name,
      title: !current.title || current.title === `${current.productName} enquiry` ? `${product.name} enquiry` : current.title,
      slug: !current.slug || current.slug === `${slugify(current.productName)}-enquiry` ? `${slugify(product.slug || product.name)}-enquiry` : current.slug,
      heroTitle: !current.heroTitle || current.heroTitle === current.productName ? product.name : current.heroTitle,
      description: !current.description || current.description === String(products.find(entry => entry.id === current.productId)?.description || "Ask our team about this product.") ? String(product.description || "Ask our team about this product.") : current.description,
      image: !current.image || current.image === String(products.find(entry => entry.id === current.productId)?.image || "") ? String(product.image || "") : current.image,
    } : current);
  }

  async function uploadHero(file?: File) {
    if (!file || !form) return;
    const data = new FormData(); data.set("file", file); setBusy(true); setError("");
    try {
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not upload this image.");
      update("image", result.url);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not upload this image."); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!form) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/data?collection=landingPages${editingId ? `&id=${encodeURIComponent(editingId)}` : ""}`, {
        method: editingId ? "PATCH" : "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, status: form.status.toLowerCase() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save this landing page.");
      setForm(null); setNotice(`${form.status === "Published" ? "Landing page published" : "Draft saved"}.`); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this landing page."); }
    finally { setBusy(false); }
  }

  async function remove(page: RecordItem) {
    if (!confirm(`Delete landing page “${String(page.title ?? page.slug)}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/data?collection=landingPages&id=${encodeURIComponent(page.id)}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setError(result.error || "Could not delete this landing page."); return; }
    setNotice("Landing page deleted."); await load();
  }

  return <>
    {notice && <div className="success" role="status" style={{ marginBottom: 14 }} onClick={() => setNotice("")}>{notice} &nbsp;x</div>}
    {error && !form && <div className="error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
    <section className="panel">
      <div className="toolbar"><div className="lp-search"><Search size={16}/><input className="field" placeholder="Search landing pages..." value={search} onChange={event => setSearch(event.target.value)}/></div><span className="muted" style={{ marginLeft: "auto", alignSelf: "center" }}>{filteredPages.length} pages</span><button className="button" type="button" onClick={openNew}><Plus size={15}/> New landing page</button></div>
      {filteredPages.length ? <table className="admin-record-table"><thead><tr><th>Page</th><th>Type</th><th>Template</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredPages.map(page => <tr key={page.id}><td data-label="Page"><strong>{String(page.title ?? "Untitled")}</strong><small className="lp-slug">/landing/{String(page.slug ?? "")}</small></td><td data-label="Type">{page.pageType === "product" ? String(page.productName ?? "Product") : page.pageType === "website" ? `Website: ${websitePages.find(([path]) => path === page.sourcePage)?.[1] ?? page.sourcePage}` : "Campaign / page"}</td><td data-label="Template">{templates.find(template => template.id === page.template)?.name ?? String(page.template ?? "-")}</td><td data-label="Status"><span className={`badge ${String(page.status).toLowerCase() === "published" ? "green" : "orange"}`}>{String(page.status ?? "Draft")}</span></td><td data-label="Actions"><div className="lp-actions"><button className="linkbutton" onClick={() => openEdit(page)}>Edit</button>{String(page.status).toLowerCase() === "published" && <a className="linkbutton" href={`${websitePreviewBase}/landing/${String(page.slug ?? "")}`} target="_blank" rel="noreferrer">View</a>}<button className="linkbutton dangerlink" onClick={() => void remove(page)}>Delete</button></div></td></tr>)}</tbody></table> : <div className="empty">{search ? "No matching landing pages." : "No landing pages yet. Create one for a product or campaign."}</div>}
    </section>
    {form && <div className="lp-builder" role="dialog" aria-modal="true" aria-label={editingId ? "Edit landing page" : "Create landing page"}>
      <header className="lp-builder-header"><div><strong>{editingId ? "Edit landing page" : "New landing page"}</strong><small>Choose a product or campaign, select a template, then preview before publishing.</small></div><div className="lp-builder-actions"><button className="button light" type="button" onClick={() => setForm(null)}>Cancel</button><button form="landing-page-form" className="button" disabled={busy}>{busy ? "Saving..." : form.status === "Published" ? "Publish page" : "Save draft"}</button></div></header>
      <form id="landing-page-form" className="lp-builder-grid" onSubmit={save}>
        <div className="lp-builder-left">
          <section className="lp-step"><h2><span>1</span> Choose a starting point</h2><div className="lp-type-tabs"><button type="button" className={form.pageType === "product" ? "selected" : ""} onClick={() => update("pageType", "product")}>Product page</button><button type="button" className={form.pageType === "campaign" ? "selected" : ""} onClick={() => setForm(current => current ? { ...current, pageType: "campaign", sourcePage: "", productId: "", productName: "" } : current)}>Blank campaign</button><button type="button" className={form.pageType === "website" ? "selected" : ""} onClick={() => setForm(current => current ? { ...current, pageType: "website", productId: "", productName: "" } : current)}>Website page</button></div>
            {form.pageType === "product" ? <><label className="lp-label">Choose a product *<select required value={form.productId} onChange={event => chooseProduct(event.target.value)}><option value="">Select a published product</option>{products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>{selectedProduct && <div className="lp-selected-product">{selectedProduct.image && <img src={selectedProduct.image} alt=""/>}<div><strong>{selectedProduct.name}</strong><small>{selectedProduct.sizes || "Sizes on request"} · {selectedProduct.colors || "Colours on request"}</small></div></div>}</> : form.pageType === "website" || form.pageType === "campaign" ? <label className="lp-label">{form.pageType === "website" ? "Select an existing website page *" : "Optional: use a website page as the basis"}<select required={form.pageType === "website"} value={form.sourcePage} onChange={event => chooseWebsitePage(event.target.value)}><option value="">{form.pageType === "campaign" ? "Blank campaign page" : "Choose a website page"}</option>{websitePages.map(([path, label]) => <option key={path} value={path}>{label}</option>)}</select><small>{form.sourcePage ? "The selected page's real website content will appear on your landing page, followed by an enquiry form." : "Choose a page to reuse its current content."}</small></label> : null}
          </section>
          <section className="lp-step"><h2><span>2</span> Choose a template</h2><div className="lp-template-list">{templates.map(template => <button type="button" key={template.id} className={`lp-template ${form.template === template.id ? "selected" : ""}`} onClick={() => update("template", template.id)}><i className={`lp-template-swatch ${template.id}`}/><span><strong>{template.name}</strong><small>{template.description}</small></span><em>{template.tag}</em></button>)}</div></section>
          <section className="lp-step"><h2><span>3</span> Publish settings</h2><label className="lp-label">Page status<select value={form.status} onChange={event => update("status", event.target.value)}><option>Draft</option><option>Published</option></select></label><p className="lp-note">Published pages open at <strong>hidenhype.com/landing/{form.slug || "your-url"}</strong> and stay out of the main menu.</p></section>
        </div>
        <div className="lp-builder-right">
          <section className="lp-step"><h2><span>4</span> Page content</h2><div className="lp-form-grid"><label className="lp-label">Page title *<input required maxLength={120} value={form.title} onChange={event => update("title", event.target.value)} placeholder="e.g. New season product enquiry"/></label><label className="lp-label">URL slug *<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={event => update("slug", slugify(event.target.value))} placeholder="summer-product-enquiry"/><small>/landing/{form.slug || "your-url"}</small></label><label className="lp-label">Eyebrow<input maxLength={80} value={form.eyebrow} onChange={event => update("eyebrow", event.target.value)}/></label><label className="lp-label">Button text<input maxLength={50} value={form.ctaLabel} onChange={event => update("ctaLabel", event.target.value)}/></label><label className="lp-label lp-wide">Main headline *<input required maxLength={120} value={form.heroTitle} onChange={event => update("heroTitle", event.target.value)} placeholder="A strong, clear campaign headline"/></label><label className="lp-label lp-wide">Short description *<textarea required maxLength={600} rows={3} value={form.description} onChange={event => update("description", event.target.value)} placeholder="Explain the product or offer in a few clear lines."/></label><label className="lp-label lp-wide">Hero image URL<input value={form.image} onChange={event => update("image", event.target.value)} placeholder="Paste an image URL or upload an image"/><span className="lp-upload"><Upload size={14}/><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { void uploadHero(event.target.files?.[0]); event.currentTarget.value = ""; }}/><small>Upload image</small></span></label><label className="lp-label lp-wide">Key benefits <small>One benefit per line</small><textarea rows={3} value={form.highlights} onChange={event => update("highlights", event.target.value)} placeholder="Quality fabric\nAvailable colours\nAsk our team"/></label></div></section>
          <section className="lp-step"><div className="lp-preview-heading"><h2><span>5</span> Preview</h2><div><button type="button" aria-label="Desktop preview" className={previewMode === "desktop" ? "active" : ""} onClick={() => setPreviewMode("desktop")}><Monitor size={15}/></button><button type="button" aria-label="Mobile preview" className={previewMode === "mobile" ? "active" : ""} onClick={() => setPreviewMode("mobile")}><Smartphone size={15}/></button></div></div><div className={`lp-preview-shell ${previewMode}`}>{form.sourcePage ? <div className="lp-existing-page-preview"><iframe title={`Preview: ${websitePages.find(([path]) => path === form.sourcePage)?.[1] ?? "website page"}`} src={`${websitePreviewBase}/${selectedWebsitePath}`} loading="lazy"/><a href={`${websitePreviewBase}/${selectedWebsitePath}`} target="_blank" rel="noreferrer">Open this page in a new tab ↗</a><small>The landing page will show this page content, then the enquiry form.</small></div> : <div className={`lp-preview ${form.template}`}><div className="lp-preview-brand">Hide n <b>Hype</b></div><div className="lp-preview-content">{form.image && <img className="lp-preview-image" src={form.image} alt=""/>}<div className="lp-preview-copy"><small>{form.eyebrow || "HIDE N HYPE"}</small><h3>{form.heroTitle || "Your campaign headline"}</h3><p>{form.description || "Your product or campaign message will appear here."}</p>{form.pageType === "product" && (selectedProduct?.sizes || selectedProduct?.colors) && <p className="lp-preview-variants">{[selectedProduct?.sizes, selectedProduct?.colors].filter(Boolean).join(" · ")}</p>}<ul>{form.highlights.split("\n").map(line => line.trim()).filter(Boolean).slice(0, 3).map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}</ul><button type="button">{form.ctaLabel || "Enquire now"}</button><small className="lp-preview-form-note">An enquiry form will appear below the campaign.</small></div></div></div>}</div><label className="lp-label lp-seo">Search title (optional)<input maxLength={60} value={form.seoTitle} onChange={event => update("seoTitle", event.target.value)} placeholder="Uses the page title if blank"/></label><label className="lp-label lp-seo">Search description (optional)<textarea maxLength={160} rows={2} value={form.seoDescription} onChange={event => update("seoDescription", event.target.value)} placeholder="Short summary for search results"/></label></section>
          {error && <p className="error" role="alert">{error}</p>}
        </div>
      </form>
      <footer className="lp-builder-footer"><button className="button light" type="button" onClick={() => setForm(null)}>Cancel</button><button form="landing-page-form" className="button" disabled={busy}>{busy ? "Saving..." : form.status === "Published" ? "Publish page" : "Save draft"}</button></footer>
    </div>}
  </>;
}
