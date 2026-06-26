import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const products = [
  {
    id: 1,
    name: "Shadow Oversized Tee",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1779040620684-17e2384f2f1e?w=600&h=750&fit=crop&auto=format",
    alt: "Dark graphic oversized t-shirt streetwear",
    colorOptions: ["#1a1a1a", "#f0ebe0", "#c8a84b"],
  },
  {
    id: 2,
    name: "Urban Fleece Hoodie",
    tag: "SALE",
    image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=600&h=750&fit=crop&auto=format",
    alt: "Grey oversized hoodie streetwear fashion",
    colorOptions: ["#555", "#1a1a1a", "#8b7355"],
  },
  {
    id: 3,
    name: "Hype Cargo Jacket",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1554925051-f668ed70d520?w=600&h=750&fit=crop&auto=format",
    alt: "Orange and black cargo jacket streetwear",
    colorOptions: ["#c84b1a", "#1a1a1a"],
  },
  {
    id: 4,
    name: "Street Layer Longline",
    tag: "HOT",
    image: "https://images.unsplash.com/photo-1532074198010-97d0c3700b7a?w=600&h=750&fit=crop&auto=format",
    alt: "Man in minimal streetwear against white wall",
    colorOptions: ["#f0ebe0", "#1a1a1a", "#2d3748"],
  },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [liked, setLiked] = useState(false);

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
        <ImageWithFallback
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Tag */}
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

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-200"
          style={{ color: liked ? "#d4183d" : "#f0ebe0" }}
        >
          <Heart size={14} fill={liked ? "#d4183d" : "none"} />
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em" }}
          >
            <ShoppingBag size={14} />
            ADD TO CART
          </button>
        </div>
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

export function NewArrivals() {
  return (
    <section id="new-arrivals" className="bg-background py-20 px-6 md:px-16">
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
            className="text-foreground leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.01em" }}
          >
            NEW ARRIVALS
          </h2>
        </div>
        <a
          href="#"
          className="text-muted-foreground hover:text-accent transition-colors tracking-widest underline underline-offset-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 600 }}
        >
          VIEW ALL PRODUCTS →
        </a>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
