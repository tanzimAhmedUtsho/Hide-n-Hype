import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { accessoriesProducts } from "./AccessoriesPage";
import { denimProducts } from "./DenimPage";
import { kidsProducts } from "./KidsPage";
import { leatherProducts } from "./LeatherPage";
import { menProducts } from "./MenPage";
import { womenProducts } from "./WomenPage";
import { newArrivalProducts, productSlug } from "../productCatalog";
import { ridingGearProducts } from "../ridingGearCatalog";

const productDetails = [
  ...newArrivalProducts,
  ...menProducts.map((product) => ({ ...product, slug: productSlug(product.name), category: "Men" })),
  ...womenProducts.map((product) => ({ ...product, slug: productSlug(product.name), category: "Women" })),
  ...kidsProducts.map((product) => ({ ...product, slug: productSlug(product.name), category: "Kids" })),
  ...accessoriesProducts.map((product) => ({ ...product, slug: productSlug(product.name), category: "Accessories" })),
  ...leatherProducts.map((product) => ({ ...product, slug: productSlug(product.name), category: "Leather Goods" })),
  ...denimProducts.map((product) => ({ ...product, slug: productSlug(product.name), category: "Denim" })),
  ...ridingGearProducts,
].filter((product, index, products) => products.findIndex((candidate) => candidate.slug === product.slug) === index);

function colorLabel(color: string) {
  const labels: Record<string, string> = {
    "#1a1a1a": "Black",
    "#171717": "Black",
    "#f0ebe0": "Off White",
    "#c8a84b": "Gold",
    "#41678a": "Denim Blue",
    "#555": "Charcoal",
    "#8b7355": "Brown",
    "#c84b1a": "Rust",
    "#a9a9a9": "Grey",
    "#2d3748": "Navy",
    "#73766b": "Olive",
    "#c72b37": "Red",
  };

  return labels[color.toLowerCase()] ?? color;
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = productDetails.find((item) => item.slug === slug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  useEffect(() => {
    setActiveImageIndex(0);
    setActiveVariantIndex(0);
  }, [slug]);

  if (!product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Product not found
        </h1>
        <Link to="/collection" className="mt-6 text-accent underline underline-offset-4">
          Browse the collection
        </Link>
      </main>
    );
  }

  const productVariants = "variants" in product ? product.variants : undefined;
  const productImages = productVariants?.[activeVariantIndex]?.images ?? ("images" in product ? product.images : [product.image]);
  const productImageBackgrounds = productVariants?.[activeVariantIndex]?.backgrounds ?? ("imageBackgrounds" in product ? product.imageBackgrounds : []);
  const activeImage = productImages[activeImageIndex] ?? productImages[0];
  const activeImageBackground = productImageBackgrounds[activeImageIndex] ?? "#f3f3f3";

  return (
    <main className="px-6 pb-20 pt-28 md:px-16 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <Link to={product.category === "Riding Gear" ? "/collection/riding-gear" : "/new-arrivals"} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
          <ArrowLeft size={16} /> {product.category === "Riding Gear" ? "Back to riding gear" : "Back to new arrivals"}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className={`mx-auto w-full max-w-[430px] overflow-hidden rounded-[8px] border border-border/20 ${product.category === "Riding Gear" ? "" : "bg-card"}`}
            style={product.category === "Riding Gear" ? { backgroundColor: activeImageBackground } : undefined}
          >
            <div className="aspect-[4/4.6]">
              <ImageWithFallback src={activeImage} alt={product.alt} className={`h-full w-full ${product.category === "Riding Gear" ? "object-contain" : "object-cover object-top"}`} />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-2 gap-2 border-t border-black/10 p-2">
                {productImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1} for ${product.name}`}
                    aria-pressed={activeImageIndex === index}
                    className={`aspect-[4/3] overflow-hidden rounded-[4px] border-2 transition-colors ${activeImageIndex === index ? "border-accent" : "border-transparent hover:border-accent/50"}`}
                    style={{ backgroundColor: productImageBackgrounds[index] ?? "#f3f3f3" }}
                  >
                    <ImageWithFallback src={image} alt={`${product.alt} — view ${index + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {product.category} · {product.tag}
            </span>
            <h1 className="mt-4 text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 800, lineHeight: 0.98 }}>
              {product.name}
            </h1>
            <p className="mt-6 max-w-xl text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "17px", lineHeight: 1.8 }}>
              {product.alt}. Contact our team to ask about current availability, size options, and product details.
            </p>

            <div className="mt-8 border-y border-border/30 py-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Color options shown
              </h2>
              <div className="mt-4 flex flex-wrap gap-2.5" aria-label="Colors shown in product imagery">
                {productVariants ? productVariants.map((variant, index) => (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => {
                      setActiveVariantIndex(index);
                      setActiveImageIndex(0);
                    }}
                    aria-label={`Show ${variant.name} color`}
                    aria-pressed={activeVariantIndex === index}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${activeVariantIndex === index ? "border-accent text-foreground" : "border-border/50 text-muted-foreground hover:border-accent/60"}`}
                  >
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: variant.color }} />
                    {variant.name}
                  </button>
                )) : product.colorOptions.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium ${index === 0 ? "border-accent text-foreground" : "border-border/50 text-muted-foreground"}`}
                  >
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                    {colorLabel(color)}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Colors shown are visual references. Ask us to confirm available colors and specifications.
              </p>
            </div>

            <Link
              to="/contact#contact-form"
              className="mt-8 inline-flex items-center gap-3 rounded-[8px] bg-accent px-7 py-3.5 text-accent-foreground transition-colors hover:bg-foreground"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em" }}
            >
              ASK ABOUT THIS PRODUCT <ArrowRight size={16} />
            </Link>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
