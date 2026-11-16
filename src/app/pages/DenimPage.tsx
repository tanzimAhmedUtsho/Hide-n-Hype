import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CategoryFilter } from "../components/CategoryFilter";
import { Link } from "react-router";
import { productSlug } from "../productCatalog";

export const denimProducts = [
  {
    id: 1,
    name: "Classic Denim Jeans",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=750&fit=crop&auto=format",
    alt: "Classic blue denim jeans",
    colorOptions: ["#41678a", "#1a1a1a", "#a9a9a9"],
  },
  {
    id: 2,
    name: "Oversized Denim Jacket",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&h=750&fit=crop&auto=format",
    alt: "Blue denim jacket",
    colorOptions: ["#41678a", "#1a1a1a"],
  },
  {
    id: 3,
    name: "Relaxed Fit Jeans",
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=750&fit=crop&auto=format",
    alt: "Relaxed fit blue jeans",
    colorOptions: ["#41678a", "#2d3748", "#a9a9a9"],
  },
  {
    id: 4,
    name: "Denim Cargo Pants",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=600&h=750&fit=crop&auto=format",
    alt: "Blue denim cargo pants",
    colorOptions: ["#41678a", "#1a1a1a"],
  },
  {
    id: 5,
    name: "Washed Denim Shirt",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=750&fit=crop&auto=format",
    alt: "Washed blue denim shirt",
    colorOptions: ["#41678a", "#a9a9a9"],
  },
  {
    id: 6,
    name: "Denim Shorts",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=750&fit=crop&auto=format",
    alt: "Blue denim shorts",
    colorOptions: ["#41678a", "#1a1a1a", "#a9a9a9"],
  },
];

function ProductCard({ product, index }: { product: typeof denimProducts[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-card aspect-[3/4]">
        <ImageWithFallback
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <Link to={`/products/${productSlug(product.name)}`} aria-label={`View details for ${product.name}`} className="absolute inset-0 z-[1]" />
        {/*
        <div
          className="absolute top-4 left-4 px-2 py-1"
          style={{
            background: product.tag === "HOT" || product.tag === "BEST" ? "#c8a84b" : "#f0ebe0",
            color: "#080808",
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
      </div>
      <div className="pt-3">
        <Link to={`/products/${productSlug(product.name)}`} className="inline-block hover:text-accent">
        <h3
          className="text-foreground mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          {product.name}
        </h3>
        </Link>
        <div className="flex gap-1.5 mt-2">
          {product.colorOptions.map((color, i) => (
            <button
              key={i}
              className="w-4 h-4 border border-border hover:border-foreground transition-all duration-150"
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function DenimPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="px-6 md:px-16 mb-8">
        <span
          className="text-accent tracking-[0.4em] uppercase block mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          SHOP
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <h1
            className="text-foreground leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, letterSpacing: "-0.01em" }}
          >
            DENIM COLLECTION
          </h1>
          <CategoryFilter currentCategory="denim" />
        </div>
        <p
          className="text-muted-foreground max-w-2xl"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
        >
          Everyday denim with a streetwear edge. Explore relaxed fits, classic layers, and essential blue washes.
        </p>
      </div>

      <div className="px-6 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {denimProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
