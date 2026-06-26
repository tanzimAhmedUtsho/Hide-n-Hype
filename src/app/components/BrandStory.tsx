import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BrandStory() {
  return (
    <section
      className="relative py-28 px-6 md:px-16 overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(240,235,224,0.5) 40px, rgba(240,235,224,0.5) 41px)`,
        }}
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="text-accent tracking-[0.4em] uppercase block mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
          >
            OUR STORY
          </span>
          <h2
            className="text-foreground leading-none mb-8"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
            }}
          >
            LUXURY IN
            <br />
            THE DETAIL
            <br />
            <span className="text-accent">WORN</span>
            <br />
            EVERYWHERE
          </h2>
          <p
            className="text-muted-foreground mb-6 leading-relaxed max-w-md"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", fontWeight: 400 }}
          >
            It all started with a simple vision — to connect the world through quality fashion.
          </p>
          <p
            className="text-muted-foreground leading-relaxed max-w-md"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", fontWeight: 400 }}
          >
           We faced challenges, learned from experience, and continued to grow stronger. Because for us, it’s not just about supplying garments — it’s about building long-term partnerships.
          </p>

          {/* Values */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
            {[
              { value: "100%", label: "Premium Fabric" },
              { value: "4.7★", label: "Avg. Review" },
              { value: "2026", label: "Est. Year" },
            ].map((item) => (
              <div key={item.label}>
                <div
                  className="text-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "28px", fontWeight: 900 }}
                >
                  {item.value}
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "12px" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
            <ImageWithFallback
              src="https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1781009211/image-12_jpgpdq.png"
              alt="Hide n Hype brand story — urban fashion model"
              className="w-full h-full object-cover"
            />
            {/* Accent border */}
            <div
              className="absolute -bottom-4 -right-4 border-2 border-accent pointer-events-none"
              style={{ width: "70%", height: "60%", zIndex: -1 }}
            />
          </div>
          {/* Floating badge */}
          <div
            className="absolute top-6 -left-6 bg-accent text-accent-foreground px-4 py-3 hidden md:block"
          >
            <div
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.2em" }}
            >
              MADE IN
            </div>
            <div
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 900 }}
            >
              BANGLADESH
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
