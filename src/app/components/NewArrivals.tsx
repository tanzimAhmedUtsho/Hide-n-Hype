import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { newArrivalProducts, type CatalogProduct } from "../productCatalog";
import { CmsProductsGrid } from "./CmsProductsGrid";

function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-card aspect-[3/4]">
        <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="block h-full w-full">
          <ImageWithFallback
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/*
        <div
          className="absolute top-4 left-4 px-2 py-1"
          style={{
            background: product.tag === "SALE" ? "#d4183d" : product.tag === "HOT" ? "#c8a84b" : "#f0ebe0",
            color: product.tag === "HOT" ? "#080808" : product.tag === "SALE" ? "#fff" : "#080808",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.15em",
          }}
        >
          {product.tag}
        </div>
        */}

        {/*
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-200"
        >
          <Heart size={14} />
        </button>
        */}

        {/*
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em" }}
          >
            ADD TO CART
          </button>
        </div>
        */}
      </div>

      {/* Product info */}
      <div className="pt-3">
        <Link to={`/products/${product.slug}`} className="inline-block">
        <h3
          className="text-foreground mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          {product.name}
        </h3>
        </Link>
      </div>
    </motion.div>
  );
}

export function NewArrivals() {
  return (
    <section id="new-arrivals" className="bg-background px-6 pt-12 pb-16 md:px-16 md:pt-14 md:pb-20">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span
            className="text-accent tracking-[0.4em] uppercase block mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
          >
            JUST DROPPED
          </span>
          <h2
            className="collection-title text-foreground leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            NEW ARRIVALS
          </h2>
        </div>
        <Link
          to="/collection"
          className="text-muted-foreground hover:text-accent transition-colors tracking-widest underline underline-offset-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 600 }}
        >
          VIEW ALL PRODUCTS →
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {newArrivalProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
        <CmsProductsGrid collection="New Arrivals" />
      </div>
    </section>
  );
}
