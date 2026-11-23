import { BrandStory } from "../components/BrandStory";
import { Testimonials } from "../components/Testimonials";
import { TeamSection } from "../components/TeamSection";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export function AboutPage() {
  return (
    <div className="pt-20 md:pt-24">
     
      <div className="mx-auto mb-16 w-full max-w-7xl px-5 md:mb-24 md:px-16">
        
       
        <div className="mb-10 text-left md:mb-16 md:text-center">
          
          <h1
            className="text-foreground text-[40px] leading-[0.95] sm:text-[48px] md:text-[clamp(40px,6vw,68px)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            About Hide n Hype
          </h1>
        </div>

       
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-36 lg:gap-40">
          
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[8px] border border-border/30 bg-card/25 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:border-0 md:bg-transparent md:p-0 md:shadow-none"
          >
            <h2
              className="mb-4 text-foreground text-[25px] font-[700] leading-none md:mb-6 md:text-[28px] md:font-[800]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}
            >
              Founded 2026
            </h2>
            <p
              className="mb-4 text-muted-foreground text-[15px] leading-[1.75] md:mb-5 md:text-[16px] md:leading-[1.8]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              Founded with a global vision, Hide n Hype creates high-quality apparel for bold, premium brands. We turn ambitious design concepts into polished, high-end production.
            </p>
            <p
              className="text-muted-foreground text-[15px] leading-[1.75] md:text-[16px] md:leading-[1.8]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              We connect world-class design with scalable manufacturing through smart supply-chain solutions and rigorous quality control—serving as a strategic partner in our clients’ growth.
            </p>
          </motion.div>

        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[8px] border border-border/30 bg-card/25 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] md:border-0 md:bg-transparent md:p-0 md:shadow-none"
          >
            <h2
              className="mb-4 text-foreground text-[25px] font-[700] leading-none md:mb-6 md:text-[28px] md:font-[800]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}
            >
              Global Operations & Network
            </h2>
            <p
              className="mb-4 text-muted-foreground text-[15px] leading-[1.75] md:mb-5 md:text-[16px] md:leading-[1.8]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              As a garment buying and sourcing company, we connect global buyers with trusted apparel manufacturers and make collaboration with international clients clear and seamless.
            </p>
            <p
              className="text-muted-foreground text-[15px] leading-[1.75] md:text-[16px] md:leading-[1.8]"
              style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}
            >
              We work with brands, retailers, and importers to deliver competitive pricing, transparent production tracking, timely delivery, and dependable quality.
            </p>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex justify-center md:mt-14"
        >
          <Link
            to="/contact"
            className="group flex w-full items-center justify-center gap-3 rounded-[8px] bg-accent px-7 py-3.5 text-accent-foreground transition-colors hover:bg-foreground sm:w-auto"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em" }}
          >
            CONTACT US
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <BrandStory />
      <TeamSection />
      <Testimonials />
      {/*<Newsletter />*/}
    </div>
  );
}
