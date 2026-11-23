import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ridingGearProducts } from "../ridingGearCatalog";
import { CmsProductsGrid } from "../components/CmsProductsGrid";

export function RidingGearPage() {
  return (
    <main className="px-6 pb-20 pt-28 md:px-16 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-border/30 pb-8 md:mb-12 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block uppercase tracking-[0.35em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}>
              Collection / Performance Apparel
            </span>
            <h1 className="text-foreground leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800 }}>
              RIDING GEAR
            </h1>
          </div>
          <p className="max-w-xl text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", lineHeight: 1.75 }}>
            Explore technical riding jackets, trousers, and rainwear. Select a style to view its product details and ask our team about specifications.
          </p>
        </div>

        <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-muted-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <span>Riding Gear</span>
          <span>{ridingGearProducts.length} styles</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
          {ridingGearProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.04 }}
              className="group"
            >
              <Link to={`/products/${product.slug}`} aria-label={`View details for ${product.name}`} className="block">
                <div className="aspect-[3/4] overflow-hidden" style={{ backgroundColor: product.imageBackgrounds[0] }}>
                  <ImageWithFallback src={product.image} alt={product.alt} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="pt-3">
                  <h2 className="text-foreground transition-colors group-hover:text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "0.025em" }}>
                    {product.name}
                  </h2>
                </div>
              </Link>
            </motion.article>
          ))}
          <CmsProductsGrid collection="Riding Gear" />
        </div>
      </div>
    </main>
  );
}
