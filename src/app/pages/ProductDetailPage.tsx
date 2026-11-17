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

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = productDetails.find((item) => item.slug === slug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => setActiveImageIndex(0), [slug]);

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

  const productImages = "images" in product ? product.images : [product.image];
  const activeImage = productImages[activeImageIndex] ?? productImages[0];

  return (
    <main className="px-6 pb-20 pt-28 md:px-16 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <Link to={product.category === "Riding Gear" ? "/collection/riding-gear" : "/new-arrivals"} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
          <ArrowLeft size={16} /> {product.category === "Riding Gear" ? "Back to riding gear" : "Back to new arrivals"}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className={product.category === "Riding Gear" ? "overflow-hidden bg-[#e7e6e2]" : "overflow-hidden bg-card"}
          >
            <div className="aspect-[4/5]">
              <ImageWithFallback src={activeImage} alt={product.alt} className={`h-full w-full ${product.category === "Riding Gear" ? "object-contain mix-blend-multiply" : "object-cover object-top"}`} />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-2 gap-2 p-2">
                {productImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1} for ${product.name}`}
                    aria-pressed={activeImageIndex === index}
                    className={`aspect-[4/3] overflow-hidden border-2 bg-[#e7e6e2] transition-colors ${activeImageIndex === index ? "border-accent" : "border-transparent hover:border-accent/50"}`}
                  >
                    <ImageWithFallback src={image} alt={`${product.alt} — view ${index + 1}`} className="h-full w-full object-contain mix-blend-multiply" />
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
              <div className="mt-4 flex flex-wrap gap-3" aria-label="Colors shown in product imagery">
                {product.colorOptions.map((color, index) => (
                  <span key={`${color}-${index}`} className="h-7 w-7 rounded-full border border-white/25" style={{ backgroundColor: color }} />
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
