import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Globe2,
  Handshake,
  Layers3,
  PackageCheck,
  Scissors,
  ShieldCheck,
  Shirt,
  Sparkles,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const productCategories = [
  {
    title: "Knitwear",
    description: "Premium knit programs for everyday essentials, fleece, jersey, and elevated casualwear.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=700&h=520&fit=crop&auto=format",
    icon: <Shirt size={20} />,
  },
  {
    title: "Activewear",
    description: "Performance wear designed for comfort, flexibility, durability, and modern movement.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&h=520&fit=crop&auto=format",
    icon: <Sparkles size={20} />,
  },
  {
    title: "Sportswear",
    description: "Technical sports apparel with reliable fits, breathable fabric options, and brand-ready finishing.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=520&fit=crop&auto=format",
    icon: <Layers3 size={20} />,
  },
  {
    title: "Performance Shorts",
    description: "Lightweight shorts for training, lifestyle, and athletic collections with custom trims.",
    image: "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=700&h=520&fit=crop&auto=format",
    icon: <Scissors size={20} />,
  },
  {
    title: "Men's Apparel",
    description: "Complete men's ranges from core basics to premium streetwear and tailored casual pieces.",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=700&h=520&fit=crop&auto=format",
    icon: <Users size={20} />,
  },
  {
    title: "Women's Apparel",
    description: "Fashion-forward women's product development with careful attention to fit and fabrication.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=520&fit=crop&auto=format",
    icon: <Shirt size={20} />,
  },
  {
    title: "Kidswear",
    description: "Comfort-focused kidswear sourcing with dependable materials, finishing, and compliance support.",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=700&h=520&fit=crop&auto=format",
    icon: <BadgeCheck size={20} />,
  },
  {
    title: "Leather Goods",
    description: "Selected leather goods and accessories programs through trusted manufacturing partners.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=520&fit=crop&auto=format",
    icon: <Tags size={20} />,
  },
  {
    title: "Accessories",
    description: "Caps, bags, trims, labels, packaging, and finishing elements for complete brand collections.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&h=520&fit=crop&auto=format",
    icon: <PackageCheck size={20} />,
  },
];

const capabilities = [
  { title: "Product Development", icon: <Layers3 size={22} /> },
  { title: "Sampling", icon: <Scissors size={22} /> },
  { title: "Bulk Production", icon: <Factory size={22} /> },
  { title: "Private Label Manufacturing", icon: <Tags size={22} /> },
  { title: "OEM/ODM Services", icon: <Boxes size={22} /> },
  { title: "Quality Control", icon: <ClipboardCheck size={22} /> },
  { title: "Packaging & Shipping", icon: <Truck size={22} /> },
];

const certifications = ["OEKO-TEX", "BSCI", "WRAP", "SEDEX", "ISO Certified Factories"];

const moqDetails = [
  { label: "Basic Apparel", value: "300 pcs/style" },
  { label: "Activewear", value: "500 pcs/style" },
  { label: "Custom Production", value: "Negotiable" },
];

const leadTimes = [
  { label: "Sampling", value: "7-14 days" },
  { label: "Production", value: "30-60 days" },
  { label: "Shipment", value: "Based on destination" },
];

const valuePoints = [
  { title: "Reliable sourcing network", icon: <Globe2 size={21} /> },
  { title: "Premium quality assurance", icon: <ShieldCheck size={21} /> },
  { title: "Competitive pricing", icon: <Tags size={21} /> },
  { title: "Flexible production capacity", icon: <Factory size={21} /> },
  { title: "Strong communication", icon: <Handshake size={21} /> },
  { title: "On-time delivery", icon: <CalendarDays size={21} /> },
];

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <span
          className="mb-3 block uppercase tracking-[0.35em] text-accent"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
        >
          {eyebrow}
        </span>
        <h2
          className="max-w-3xl text-foreground leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          {title}
        </h2>
      </div>
      {text && (
        <p
          className="max-w-md text-muted-foreground"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.8", fontWeight: 300 }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: typeof moqDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="rounded-[8px] border border-border/35 bg-background/55 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3
          className="text-foreground uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "28px", fontWeight: 800, letterSpacing: "0.02em" }}
        >
          {title}
        </h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent/12 text-accent">
          {title === "MOQ" ? <Boxes size={20} /> : <CalendarDays size={20} />}
        </div>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 rounded-[8px] bg-card/50 px-4 py-3">
            <span className="text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px" }}>
              {item.label}
            </span>
            <strong
              className="text-right text-foreground"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", fontWeight: 600, letterSpacing: "0.01em" }}
            >
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SourcingManufacturingPage() {
  useEffect(() => {
    document.title = "Sourcing & Manufacturing | Hide n Hype";

    const description =
      "Hide n Hype provides premium apparel sourcing, manufacturing, activewear production, OEM/ODM, sampling, QC, and export support from Bangladesh.";
    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);
  }, []);

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1800&h=1200&fit=crop&auto=format"
            alt="Modern apparel manufacturing facility and professional production workspace"
            className="h-full w-full object-cover"
            style={{ filter: "brightness(0.28) contrast(1.08)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,8,8,0.96)_0%,rgba(8,8,8,0.68)_52%,rgba(8,8,8,0.3)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(to_top,#080808_0%,transparent_100%)]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-end px-6 pb-20 pt-32 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-5xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-accent" />
              <span
                className="uppercase tracking-[0.4em] text-accent"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
              >
                Bangladesh Apparel Sourcing
              </span>
            </div>
            <h1
              className="max-w-5xl text-foreground leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(54px, 9vw, 112px)", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Sourcing & Manufacturing Excellence
            </h1>
            <p
              className="mt-6 max-w-2xl text-muted-foreground"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "18px", lineHeight: "1.8", fontWeight: 300 }}
            >
              Your trusted sourcing and manufacturing partner for premium apparel and activewear production from Bangladesh.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact#contact-form"
                className="group flex items-center justify-center gap-3 rounded-[8px] bg-accent px-7 py-3.5 text-accent-foreground transition-colors hover:bg-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em" }}
              >
                REQUEST A QUOTE
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact#contact-form"
                className="flex items-center justify-center gap-3 rounded-[8px] border border-foreground/20 bg-background/35 px-7 py-3.5 text-foreground backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em" }}
              >
                BOOK A MEETING
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16">
        <SectionHeader
          eyebrow="What We Source"
          title="Product categories built for global buyers"
          text="From core apparel programs to performance-led activewear, Hide n Hype connects international buyers with dependable production partners."
        />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((category, index) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className="group"
            >
              <div className="relative aspect-[1.35] overflow-hidden rounded-[8px]">
                <ImageWithFallback
                  src={category.image}
                  alt={`${category.title} sourcing by Hide n Hype`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.86)_0%,rgba(8,8,8,0.12)_62%)]" />
                <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-accent text-accent-foreground">
                  {category.icon}
                </div>
              </div>
              <div className="pt-5">
                <h3
                  className="mb-2 text-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "24px", fontWeight: 800, letterSpacing: "0.02em" }}
                >
                  {category.title}
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", lineHeight: "1.8", fontWeight: 300 }}>
                  {category.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-border/25 bg-[#0b0b0b] px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Capabilities"
            title="Manufacturing support from idea to shipment"
            text="A streamlined process for buyers who need sampling, controlled production, brand finishing, and export-ready coordination."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="group rounded-[8px] border border-border/30 bg-background/45 p-5 transition-colors duration-300 hover:border-accent/55 hover:bg-background/75"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent/12 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    {item.icon}
                  </div>
                  <span
                    className="text-muted-foreground/55"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-foreground/95" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "21px", fontWeight: 600, letterSpacing: "0.04em" }}>
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span
              className="mb-3 block uppercase tracking-[0.35em] text-accent"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
            >
              Certifications & Compliance
            </span>
            <h2
              className="mb-6 text-foreground leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(38px, 5vw, 70px)", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Built around responsible production
            </h2>
            <p className="text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", lineHeight: "1.8", fontWeight: 300 }}>
              We work with compliant and certified manufacturing partners to ensure quality, sustainability, and ethical production standards.
            </p>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-2">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex min-h-24 items-center rounded-[8px] border border-border/30 bg-card/35 p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-accent/12 text-accent">
                    <CheckCircle2 size={21} />
                  </div>
                  <span
                    className="block text-foreground/95"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "23px", fontWeight: 600, letterSpacing: "0.08em" }}
                  >
                    {cert}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0b0b] px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="MOQ & Lead Time"
            title="Clear production expectations"
            text="Flexible programs for brands, buyers, importers, and sourcing teams planning reliable Bangladesh production."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <InfoCard title="MOQ" items={moqDetails} />
            <InfoCard title="Lead Time" items={leadTimes} />
          </div>
          <p className="mt-6 text-center text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "14px", lineHeight: "1.7", fontWeight: 300 }}>
            Production timelines may vary depending on order volume and customization requirements.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why Choose Hide n Hype"
            title="A sourcing partner made for serious growth"
            text="We combine local manufacturing access with international buyer communication, quality discipline, and production transparency."
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {valuePoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group flex min-h-24 items-center gap-4 rounded-[8px] border border-border/30 bg-card/30 p-5 transition-colors hover:border-accent/50 hover:bg-card/55"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-accent/12 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  {point.icon}
                </div>
                <h3 className="text-foreground/95" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "23px", fontWeight: 600, letterSpacing: "0.04em" }}>
                  {point.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden border-y border-border/25 px-6 py-14 text-center md:px-12 md:py-16"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(200,168,75,0.16)_0%,rgba(17,17,17,0.95)_42%,rgba(8,8,8,1)_100%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2
              className="text-foreground leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(42px, 6vw, 78px)", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Looking for a Reliable Manufacturing Partner?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "17px", lineHeight: "1.8", fontWeight: 300 }}>
              Let's build your next collection with quality, precision, and trust.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="flex items-center justify-center rounded-[8px] bg-foreground px-7 py-3.5 text-background transition-colors hover:bg-accent hover:text-accent-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em" }}
              >
                CONTACT US
              </Link>
              <Link
                to="/contact#contact-form"
                className="group flex items-center justify-center gap-3 rounded-[8px] border border-border bg-background/45 px-7 py-3.5 text-foreground transition-colors hover:border-accent hover:text-accent"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em" }}
              >
                SEND INQUIRY
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
