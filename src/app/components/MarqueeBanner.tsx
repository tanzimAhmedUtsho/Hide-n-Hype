import { motion } from "motion/react";

const items = [
  "UNCOMPROMISED QUALITY ONLY",
  "★ NEW DROP: SHADOW SERIES",
  "LIMITED EDITION PIECES AVAILABLE NOW",
  "★ USE CODE HYPE10 FOR 10% OFF",
  "AUTHENTIC STREETWEAR — HIDE N HYPE",
  "★ WORLDWIDE SHIPPING",
];

export function MarqueeBanner() {
  const repeated = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden py-3"
      style={{ background: "#c8a84b" }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#080808",
            }}
          >
            {item}
            <span className="text-black/40">|</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
