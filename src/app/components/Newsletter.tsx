import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <section
      className="relative py-24 px-6 md:px-16 overflow-hidden"
      style={{ background: "#c8a84b" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(8,8,8,0.3) 30px, rgba(8,8,8,0.3) 31px)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="tracking-[0.4em] uppercase block mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 700, color: "rgba(8,8,8,0.6)" }}
          >
            JOIN THE MOVEMENT
          </span>
          <h2
            className="leading-none mb-4"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#080808",
            }}
          >
            STAY IN
            <br />
            THE HYPE
          </h2>
          <p
            className="mb-8"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "rgba(8,8,8,0.65)", lineHeight: 1.6 }}
          >
            Get early access to new drops, exclusive offers,
            and behind-the-scenes content. Be first. Always.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <div className="w-8 h-8 bg-black/20 flex items-center justify-center">
                <Check size={16} color="#080808" />
              </div>
              <span
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 700, color: "#080808" }}
              >
                YOU'RE IN. WATCH YOUR INBOX.
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3.5 outline-none"
                style={{
                  background: "rgba(8,8,8,0.15)",
                  color: "#080808",
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "14px",
                  border: "1px solid rgba(8,8,8,0.25)",
                }}
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 hover:bg-opacity-90 transition-all duration-200"
                style={{
                  background: "#080808",
                  color: "#f0ebe0",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                }}
              >
                JOIN <ArrowRight size={14} />
              </button>
            </form>
          )}

          <p
            className="mt-4"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "11px", color: "rgba(8,8,8,0.5)" }}
          >
            No spam. Unsubscribe anytime. We hate boring emails too.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
