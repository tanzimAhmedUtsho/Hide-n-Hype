import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { collectionKey, cmsProductImage, loadCmsProducts, type CmsProduct } from "../cmsProducts";

export function CmsProductsGrid({ collection = "all" }: { collection?: string }) {
  const [products, setProducts] = useState<CmsProduct[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    loadCmsProducts(controller.signal)
      .then(setProducts)
      .catch(() => setProducts([]));
    return () => controller.abort();
  }, []);

  const visible = products.filter(product => {
    if (String(product.status).toLowerCase() !== "published") return false;
    if (collection === "all") return true;
    if (collection === "Sale") return collectionKey(product.collection) === "sale" || Number(product.salePrice) > 0;
    if (collection === "New Arrivals") return product.newArrival === true || collectionKey(product.collection) === collectionKey(collection);
    return collectionKey(product.collection) === collectionKey(collection);
  });

  return <>
    {visible.map((product, index) => {
      const price = Number(product.salePrice || product.price || 0);
      const originalPrice = Number(product.price || 0);
      const badges = [
        product.availableToCustomers === false ? "Unavailable" : "",
        product.preOrder ? "Pre-order" : "",
        product.bestSeller ? "Best Seller" : "",
        product.newArrival ? "New Arrival" : "",
        product.featured ? "Featured" : "",
        product.topSelling ? "Top Selling" : "",
        product.comboPackage ? "Combo" : "",
        product.freeDelivery ? "Free Delivery" : "",
      ].filter(Boolean).slice(0, 2);
      return (
      <article key={product.id} className="group relative" style={{ animation: "cms-product-in 350ms ease both", animationDelay: `${Math.min(index, 8) * 35}ms` }}>
        <div className="relative aspect-[3/4] overflow-hidden bg-card">
          {product.image ? <ImageWithFallback src={cmsProductImage(product.image)} alt={product.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No product image</div>}
          {badges.length > 0 && <div className="pointer-events-none absolute left-2 top-2 z-[2] flex flex-wrap gap-1.5">{badges.map(badge => <span key={badge} className="rounded-sm bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">{badge}</span>)}</div>}
          <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0 z-[1]" />
        </div>
        <div className="pt-3">
          <Link to={`/products/${product.slug}`} className="inline-block hover:text-accent"><h3 className="mb-1 text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>{product.name}</h3></Link>
          {price > 0 && <div className="flex items-center gap-2 text-sm"><span className="text-foreground">BDT {price.toLocaleString()}</span>{Number(product.salePrice) > 0 && originalPrice > 0 && <span className="text-xs text-muted-foreground line-through">BDT {originalPrice.toLocaleString()}</span>}</div>}
        </div>
      </article>
      );
    })}
  </>;
}
