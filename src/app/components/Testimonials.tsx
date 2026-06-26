import { motion } from "motion/react";

const founders = [
  {
    name: "Gulam Saroar Noyon",
    //role: "Co-Founder & Director",
    quote: "We don’t just manufacture clothes; we build the core of your brand. From the first thread to the final shipment, our focus is on bringing absolute precision, transparency, and international quality straight from Bangladesh.",
    image: "https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1781938991/copy_of_1e9c61b4-d39e-44b0-b83c-59425499e1fa.png", 
    initials: "TAU",
  },
  {
    name: "Tanzim Ahmed Utsho", 
    //role: "Co-Founder & MD",
    quote: "Hide n Hype was built to bridge the gap between global design expectations and local production reality. We treat every client's collection as our own growth journey, ensuring reliability at every single step.",
    image:"https://res.cloudinary.com/djdrghfqs/image/upload/q_auto/f_auto/v1781939021/copy_of_tanzim_ahmed_korh5a.jpg",
    initials: "HnH",
  },
];

export function Testimonials() {
  return (
    <section className="bg-background py-20 px-6 md:px-16">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span
          className="text-accent tracking-[0.4em] uppercase block mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          OUR PHILOSOPHY
        </span>
        <h2
          className="text-foreground uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Leadership & Commitment
        </h2>
      </div>

      {/* Two Founders Columns Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {founders.map((founder, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="rounded-[12px] border border-border/40 bg-[#0b0b0b] overflow-hidden flex flex-col justify-between"
          >
            {/* Top Content Area */}
            <div className="p-8 md:p-10">
              <span
                className="text-accent tracking-[0.3em] uppercase block mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 600 }}
              >
                FOUNDER STATEMENT
              </span>
              
              <blockquote 
                className="text-foreground/85 leading-relaxed relative pl-4 border-l-2 border-accent"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", fontWeight: 300, fontStyle: "italic" }}
              >
                "{founder.quote}"
              </blockquote>
            </div>

            {/* Bottom Profile Area */}
            <div className="p-8 bg-card/30 border-t border-border/30 flex items-center justify-between gap-4">
              <div>
                <h4 
                  className="text-foreground  tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 550 }}
                >
                  {founder.name}
                </h4>
                <p 
                  className="text-accent  tracking-widest mt-0.5"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 550 }}
                >
                  {founder.role}
                </p>
              </div>

              
              <div className="h-12 w-12 shrink-0 rounded-full border border-border/40 bg-neutral-900 overflow-hidden flex items-center justify-center">
                {founder.image ? (
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span 
                    className="text-neutral-500 text-xs font-bold tracking-wider"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {founder.initials}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}