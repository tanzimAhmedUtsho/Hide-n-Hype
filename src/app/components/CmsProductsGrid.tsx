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
    return collectionKey(product.collection) === collectionKey(collection);
  });

  return <>
    {visible.map((product, index) => {
      const price = Number(product.salePrice || product.price || 0);
      const originalPrice = Number(product.price || 0);
      return (
      <article key={product.id} className="group relative" style={{ animation: "cms-product-in 350ms ease both", animationDelay: `${Math.min(index, 8) * 35}ms` }}>
        <div className="relative aspect-[3/4] overflow-hidden bg-card">
          {product.image ? <ImageWithFallback src={cmsProductImage(product.image)} alt={product.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No product image</div>}
          <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0 z-[1]" />
        </div>
        <div className="pt-3">
          <Link to={`/products/${product.slug}`} className="inline-block hover:text-accent"><h3 className="mb-1 text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>{product.name}</h3></Link>
          <div className="flex items-center gap-2 text-sm">{price > 0 ? <><span className="text-foreground">৳{price.toLocaleString()}</span>{Number(product.salePrice) > 0 && originalPrice > 0 && <span className="text-xs text-muted-foreground line-through">৳{originalPrice.toLocaleString()}</span>}</> : <span className="text-muted-foreground">Price on request</span>}</div>
        </div>
      </article>
      );
    })}
  </>;
}
