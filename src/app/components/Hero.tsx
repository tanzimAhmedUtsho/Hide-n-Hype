import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-background">
      {/* Background model image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://res.cloudinary.com/djdrghfqs/image/upload/v1782379663/image-33_urrrop.png"
          alt="Hide n Hype campaign model in urban setting"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35) contrast(1.1)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.4) 50%, rgba(8,8,8,0.1) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: "linear-gradient(to top, #080808 0%, transparent 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 pb-16 pt-24 md:px-16 md:pb-20 md:pt-28 lg:justify-end">
        <div className="max-w-5xl">
          {/* Season label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-accent" />
            <span
              className="text-accent tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
            >
              SS 2026 COLLECTION
            </span>
          </motion.div>

 {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-foreground leading-none mb-4"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(58px, min(14vw, 16svh), 180px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 0.88,
            }}
          >
            Hide
            <br />
            <span className="text-accent">n</span>
            <br />
            Hype
          </motion.h1>

          {/* Subtext + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:gap-6 md:mt-8"
          >
            <p
              className="text-muted-foreground max-w-xs"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: 1.7 }}
            >
              Built for confidence.
              <br />
              Hide Your Doubts, Hype your Style.
            </p>
            <Link
              to="/collection"
              className="group flex items-center gap-3 bg-foreground text-background px-7 py-3.5 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.2em" }}
            >
              SHOP NOW
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-6 right-6 flex gap-5 sm:gap-8 md:bottom-8 md:right-16"
        >
          {[
            { num: "30+", label: "STYLES" },
            { num: "15K+", label: "DROPS SOLD" },
            { num: "4.7★", label: "RATING" },
          ].map((stat) => (
            <div key={stat.label} className="text-right">
              <div
                className="text-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 800 }}
              >
                {stat.num}
              </div>
              <div
                className="text-muted-foreground tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", fontWeight: 600 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
