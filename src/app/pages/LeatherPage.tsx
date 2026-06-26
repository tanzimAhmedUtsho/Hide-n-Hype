import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Newsletter } from "../components/Newsletter";
import { CategoryFilter } from "../components/CategoryFilter";

export const leatherProducts = [
  {
    id: 1,
    name: "Classic Leather Jacket",
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop&auto=format",
    alt: "Black leather jacket",
    colorOptions: ["#1a1a1a", "#8b7355"],
  },
  {
    id: 2,
    name: "Leather Bomber",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1520975867597-0af37a22e31e?w=600&h=750&fit=crop&auto=format",
    alt: "Brown leather bomber jacket",
    colorOptions: ["#8b7355", "#1a1a1a"],
  },
  {
    id: 3,
    name: "Leather Crossbody",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&auto=format",
    alt: "Leather crossbody bag",
    colorOptions: ["#1a1a1a", "#8b7355"],
  },
  {
    id: 4,
    name: "Moto Leather Jacket",
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=750&fit=crop&auto=format",
    alt: "Moto style leather jacket",
    colorOptions: ["#1a1a1a"],
  },
  {
    id: 5,
    name: "Leather Belt",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583b8?w=600&h=750&fit=crop&auto=format",
    alt: "Premium leather belt",
    colorOptions: ["#1a1a1a", "#8b7355", "#c8a84b"],
  },
  {
    id: 6,
    name: "Leather Backpack",
    tag: "PREMIUM",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=750&fit=crop&auto=format",
    alt: "Leather backpack",
    colorOptions: ["#8b7355", "#1a1a1a"],
  },
];

function ProductCard({ product, index }: { product: typeof leatherProducts[0]; index: number }) {
  const [liked, setLiked] = useState(false);

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
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute top-4 left-4 px-2 py-1"
          style={{
            background: product.tag === "PREMIUM" ? "#c8a84b" : "#f0ebe0",
            color: product.tag === "PREMIUM" ? "#080808" : "#080808",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.15em",
          }}
        >
          {product.tag}
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-200"
          style={{ color: liked ? "#d4183d" : "#f0ebe0" }}
        >
          <Heart size={14} fill={liked ? "#d4183d" : "none"} />
        </button>
      </div>
      <div className="pt-3">
        <h3
          className="text-foreground mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          {product.name}
        </h3>
        <div className="flex gap-1.5 mt-2">
          {product.colorOptions.map((color, i) => (
            <button
              key={i}
              className="w-4 h-4 border border-border hover:border-foreground transition-all duration-150"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function LeatherPage() {
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
            LEATHER GOODS
          </h1>
          <CategoryFilter currentCategory="leather" />
        </div>
        <p
          className="text-muted-foreground max-w-2xl"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
        >
          Premium leather pieces. Timeless craftsmanship meets modern streetwear edge.
        </p>
      </div>

      <div className="px-6 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {leatherProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/*<Newsletter />*/}
    </div>
  );
}
