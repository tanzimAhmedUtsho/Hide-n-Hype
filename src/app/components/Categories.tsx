import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = [
  {
    name: "HOODIES",
    count: "5 styles",
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/v1782452805/image-34_fkhxab.png",
    alt: " Hoodies collection",
    span: "col-span-1 row-span-2",
  },
  {
    name: " PERFORMANCE SHORTS",
    count: "4 styles",
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/v1782377248/image-30_h2zzhg.png",
    alt: "Performance shorts collection",
    span: "col-span-1 row-span-1",
  },
  {
    name: "OVERSIZED T-SHIRTS",
    count: "5 styles",
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1781009211/image-12_jpgpdq.png",
    alt: "Oversized t-shirts collection",
    span: "col-span-1 row-span-1",
  },
  {
    name: "ACCESSORIES",
    count: "15 styles",
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1782112378/image-28_w9n2sg.png",
    alt: "Bags and accessories collection",
    span: "col-span-1 row-span-2",
  },
];

export function Categories() {
  return (
    <section className="bg-background py-20 px-6 md:px-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span
            className="text-accent tracking-[0.4em] uppercase block mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
          >
            BROWSE BY
          </span>
          <h2
            className="text-foreground leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.01em" }}
          >
            CATEGORIES
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-4" style={{ minHeight: "560px" }}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={cat.span}
          >
            <Link
              to="/collection"
              className="group relative overflow-hidden bg-card block w-full h-full"
            >
            <ImageWithFallback
              src={cat.image}
              alt={cat.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ minHeight: "200px" }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ background: "linear-gradient(to top, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.15) 60%)" }}
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(200,168,75,0.12)" }}
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div
                className="text-muted-foreground mb-0.5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em" }}
              >
                {cat.count}
              </div>
              <h3
                className="text-foreground group-hover:text-accent transition-colors duration-200"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900, letterSpacing: "0.03em" }}
              >
                {cat.name}
              </h3>
            </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
