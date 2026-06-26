import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Newsletter } from "../components/Newsletter";

const lookbookImages = [
  {
    id: 1,
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1781886566/image-25_i3jzgc.png",
    alt: "Hide n Hype lookbook streetwear model",
    title: "Men's T-Shirt & Pant",
    season: "SUMMER 2026",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop&auto=format",
    alt: "Urban streetwear styling",
    title: "URBAN ESSENTIALS",
    season: "SPRING 2026",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1781886371/image-22_ysaqqh.png",
    alt: "Cargo collection lookbook",
    title: "Men's T-Shirt & Pant",
    season: "SUMMER 2026",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1616030257764-0fe6a2f05138?w=800&h=600&fit=crop&auto=format",
    alt: "Minimal streetwear lookbook",
    title: "MINIMAL HYPE",
    season: "SPRING 2026",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1554925051-f668ed70d520?w=800&h=1000&fit=crop&auto=format",
    alt: "Statement pieces lookbook",
    title: "STATEMENT PIECES",
    season: "SPRING 2026",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&auto=format",
    alt: "Core collection lookbook",
    title: "CORE COLLECTION",
    season: "SPRING 2026",
  },
];

export function LookbookPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="px-6 md:px-16 mb-12">
        <span
          className="text-accent tracking-[0.4em] uppercase block mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          SPRING 2026
        </span>
        <h1
          className="text-foreground leading-none mb-4"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900, letterSpacing: "-0.01em" }}
        >
          LOOKBOOK
        </h1>
        <p
          className="text-muted-foreground max-w-2xl"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
        >
          Experience Hide n Hype through our lens. Raw streets, bold styling, unapologetic attitude.
        </p>
      </div>

      {/* Masonry grid */}
      <div className="px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lookbookImages.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden bg-card"
              style={{ aspectRatio: i % 3 === 2 ? "4/3" : "3/4" }}
            >
              <ImageWithFallback
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.3) 50%, transparent 100%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span
                  className="text-accent uppercase block mb-1 tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", fontWeight: 700 }}
                >
                  {item.season}
                </span>
                <h3
                  className="text-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px", fontWeight: 800 }}
                >
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/*<Newsletter />*/}
    </div>
  );
}
