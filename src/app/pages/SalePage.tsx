import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Newsletter } from "../components/Newsletter";

const saleProducts = [
  {
    id: 1,
    name: "Urban Fleece Hoodie",
    tag: "40% OFF",
    image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=600&h=750&fit=crop&auto=format",
    alt: "Grey oversized hoodie streetwear fashion",
    colorOptions: ["#555", "#1a1a1a", "#8b7355"],
  },
  {
    id: 2,
    name: "Shadow Cargo Pants",
    tag: "30% OFF",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&auto=format",
    alt: "Black cargo pants streetwear",
    colorOptions: ["#1a1a1a", "#2d3748"],
  },
  {
    id: 3,
    name: "Classic Bomber",
    tag: "35% OFF",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop&auto=format",
    alt: "Bomber jacket streetwear",
    colorOptions: ["#1a1a1a", "#8b7355"],
  },
  {
    id: 4,
    name: "Core Tee Pack",
    tag: "50% OFF",
    image: "https://images.unsplash.com/photo-1779040620684-17e2384f2f1e?w=600&h=750&fit=crop&auto=format",
    alt: "Black tee streetwear",
    colorOptions: ["#1a1a1a", "#f0ebe0", "#555"],
  },
  {
    id: 5,
    name: "Utility Vest",
    tag: "45% OFF",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=750&fit=crop&auto=format",
    alt: "Utility vest streetwear",
    colorOptions: ["#1a1a1a", "#f0ebe0"],
  },
  {
    id: 6,
    name: "Fleece Set",
    tag: "40% OFF",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop&auto=format",
    alt: "Fleece set streetwear",
    colorOptions: ["#1a1a1a", "#555"],
  },
];

function SaleProductCard({ product, index }: { product: typeof saleProducts[0]; index: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-card aspect-[3/4]">
        <ImageWithFallback
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Sale tag */}
        <div
          className="absolute top-4 left-4 px-2 py-1 bg-red-600 text-white"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.15em",
          }}
        >
          {product.tag}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-200"
          style={{ color: liked ? "#d4183d" : "#f0ebe0" }}
        >
          <Heart size={14} fill={liked ? "#d4183d" : "none"} />
        </button>

      </div>

      {/* Product info */}
      <div className="pt-3">
        <h3
          className="text-foreground mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          {product.name}
        </h3>
        {/* Color swatches */}
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

export function SalePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="px-6 md:px-16 mb-8">
        <span
          className="text-red-600 tracking-[0.4em] uppercase block mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          LIMITED TIME ONLY
        </span>
        <h1
          className="text-foreground leading-none mb-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, letterSpacing: "-0.01em" }}
        >
          SALE
        </h1>
        <p
          className="text-muted-foreground max-w-2xl"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
        >
          Up to 50% off on selected items. Limited stock. No returns on sale items.
        </p>
      </div>

      {/* Products grid */}
      <div className="px-6 md:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {saleProducts.map((product, i) => (
            <SaleProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>

      {/*<Newsletter />*/}
    </div>
  );
}
