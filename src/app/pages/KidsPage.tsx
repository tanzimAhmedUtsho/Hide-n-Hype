import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Newsletter } from "../components/Newsletter";
import { CategoryFilter } from "../components/CategoryFilter";

export const kidsProducts = [
  {
    id: 1,
    name: "Kids Oversized Hoodie",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=750&fit=crop&auto=format",
    alt: "Kids oversized hoodie",
    colorOptions: ["#1a1a1a", "#f0ebe0", "#c8a84b"],
  },
  {
    id: 2,
    name: "Mini Streetwear Tee",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=750&fit=crop&auto=format",
    alt: "Kids graphic tee",
    colorOptions: ["#1a1a1a", "#f0ebe0"],
  },
  {
    id: 3,
    name: "Kids Cargo Shorts",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=750&fit=crop&auto=format",
    alt: "Kids cargo shorts",
    colorOptions: ["#1a1a1a", "#8b7355", "#2d3748"],
  },
  {
    id: 4,
    name: "Junior Bomber",
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e4?w=600&h=750&fit=crop&auto=format",
    alt: "Kids bomber jacket",
    colorOptions: ["#1a1a1a", "#c84b1a"],
  },
  {
    id: 5,
    name: "Youth Joggers",
    tag: "BEST",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=750&fit=crop&auto=format",
    alt: "Kids joggers",
    colorOptions: ["#1a1a1a", "#555"],
  },
  {
    id: 6,
    name: "Kids Track Jacket",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1529391409740-9e3e98e20c4b?w=600&h=750&fit=crop&auto=format",
    alt: "Kids track jacket",
    colorOptions: ["#1a1a1a", "#f0ebe0", "#8b7355"],
  },
];

function ProductCard({ product, index }: { product: typeof kidsProducts[0]; index: number }) {
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
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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

export function KidsPage() {
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
            KIDS COLLECTION
          </h1>
          <CategoryFilter currentCategory="kids" />
        </div>
        <p
          className="text-muted-foreground max-w-2xl"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
        >
          Mini streetwear for the next generation. Bold styles sized down for the little hypebeasts.
        </p>
      </div>

      <div className="px-6 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kidsProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/*<Newsletter />*/}
    </div>
  );
}
