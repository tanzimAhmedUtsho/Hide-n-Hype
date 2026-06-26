import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Newsletter } from "../components/Newsletter";
import { CategoryFilter } from "../components/CategoryFilter";

export const accessoriesProducts = [
  {
    id: 1,
    name: "Hide n Hype Cap",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=750&fit=crop&auto=format",
    alt: "Streetwear baseball cap",
    colorOptions: ["#1a1a1a", "#f0ebe0"],
  },
  {
    id: 2,
    name: "Urban Backpack",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop&auto=format",
    alt: "Black urban backpack",
    colorOptions: ["#1a1a1a"],
  },
  {
    id: 3,
    name: "Crossbody Bag",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&auto=format",
    alt: "Streetwear crossbody bag",
    colorOptions: ["#1a1a1a", "#8b7355"],
  },
  {
    id: 4,
    name: "Beanie",
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=750&fit=crop&auto=format",
    alt: "Knit beanie",
    colorOptions: ["#1a1a1a", "#f0ebe0", "#c8a84b"],
  },
  {
    id: 5,
    name: "Chain Necklace",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&fit=crop&auto=format",
    alt: "Silver chain necklace",
    colorOptions: ["#c0c0c0", "#c8a84b"],
  },
  {
    id: 6,
    name: "Belt Bag",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=750&fit=crop&auto=format",
    alt: "Streetwear belt bag",
    colorOptions: ["#1a1a1a", "#f0ebe0"],
  },
];

function ProductCard({ product, index }: { product: typeof accessoriesProducts[0]; index: number }) {
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
            background: product.tag === "HOT" || product.tag === "BEST" ? "#c8a84b" : "#f0ebe0",
            color: product.tag === "HOT" || product.tag === "BEST" ? "#080808" : "#080808",
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

export function AccessoriesPage() {
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
            ACCESSORIES
          </h1>
          <CategoryFilter currentCategory="accessories" />
        </div>
        <p
          className="text-muted-foreground max-w-2xl"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
        >
          Complete your look. Bags, caps, jewelry, and more to elevate your streetwear game.
        </p>
      </div>

      <div className="px-6 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {accessoriesProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/*<Newsletter />*/}
    </div>
  );
}
