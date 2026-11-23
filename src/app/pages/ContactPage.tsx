import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";

const countryDetails = [
  {
    name: "Finland Office",
    city: "Vuohisillantie 46 E 35,68600 Pietarsaari, Finland",
    phone: "+358 40 5389232",
    email: "info@hiddenhype.com",
    secondaryEmail: "hidenhypeofficial@gmail.com",
    hours: "Mon-Fri, 10:00-18:00 EET",
    focus: "Global customer care, retail partnerships, wholesale meetings and brand operations.",
  },
  {
    name: "Bangladesh Office",
    city: "Agargaon, Dhaka, Bangladesh",
    phone: "+880 1756 467670",
    email: "info@hiddenhype.com",
    secondaryEmail: "hidenhypeofficial@gmail.com",
    hours: "Sat-Thu, 10:00-18:00 BST",
    focus: "Design direction, sourcing, sampling, production coordination and local support.",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/hidenhype",
    icon: <Instagram size={18} />,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/hidenhype",
    icon: <Facebook size={18} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/hidenhype",
    icon: <Linkedin size={18} />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/hidenhype",
    icon: <Twitter size={18} />,
  },
];

const inquiryTypes = ["General", "Wholesale", "Collaboration", "Press"];

function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const fields = [
    ["Name", data.get("name")],
    ["Email", data.get("email")],
    ["Phone", data.get("phone")],
    ["Address / city", data.get("location")],
    ["Instagram", data.get("instagram")],
    ["Facebook", data.get("facebook")],
    ["Website / portfolio", data.get("website")],
    ["Inquiry type", data.get("inquiry")],
    ["Message", data.get("message")],
  ]
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => `${label}: ${String(value).trim()}`);
  const name = String(data.get("name") ?? "").trim();
  const subject = encodeURIComponent(`Hide n Hype enquiry${name ? ` from ${name}` : ""}`);
  const body = encodeURIComponent(fields.join("\n\n"));

  window.location.href = `mailto:info@hiddenhype.com?subject=${subject}&body=${body}`;
}

function CountryPanel({ detail }: { detail: typeof countryDetails[0] }) {
  return (
    <article className="group relative h-full overflow-hidden border border-border/35 bg-card/30 p-6 transition-colors duration-300 hover:border-accent/45 md:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-accent/70" />
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <span className="mb-2 block text-accent tracking-[0.32em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700 }}>
            {detail.name === "Finland Office" ? "EUROPE · FINLAND" : "SOUTH ASIA · BANGLADESH"}
          </span>
          <h2 className="text-foreground uppercase leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(30px, 3vw, 40px)", fontWeight: 800 }}>
            {detail.name}
          </h2>
        </div>
        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-accent/25 text-accent"><MapPin size={19} /></div>
      </div>

      <p className="mb-7 max-w-lg text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", lineHeight: "1.75" }}>
        {detail.focus}
      </p>

      <a href={`mailto:${detail.email}`} className="mb-5 flex items-center gap-4 border border-accent/35 bg-accent/[0.06] p-4 transition-colors hover:bg-accent/10">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-accent-foreground"><Mail size={18} /></span>
        <span className="min-w-0">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Official email · preferred contact</span>
          <span className="block break-all text-base font-semibold text-foreground transition-colors group-hover:text-accent" style={{ fontFamily: "'Barlow', sans-serif" }}>{detail.email}</span>
        </span>
      </a>

      <div className="divide-y divide-border/25 border-t border-border/25">
        {[
          { icon: <MapPin size={17} />, label: "Address", value: detail.city },
          { icon: <Phone size={17} />, label: "Phone", value: detail.phone },
          { icon: <Clock size={17} />, label: "Hours", value: detail.hours },
        ].map((item) => (
          <div key={`${item.label}-${item.value}`} className="flex gap-4 py-4 first:pt-5 last:pb-4">
            <div className="mt-0.5 text-accent/80">{item.icon}</div>
            <div className="flex flex-1 items-baseline justify-between gap-4 max-sm:flex-col max-sm:gap-1">
              <span className="text-muted-foreground tracking-[0.16em] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", fontWeight: 700 }}>{item.label}</span>
              <p className="text-right text-sm text-foreground max-sm:text-left" style={{ fontFamily: "'Barlow', sans-serif", lineHeight: "1.65" }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 border-t border-border/25 pt-4">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Also reachable at</span>
        <a href={`mailto:${detail.secondaryEmail}`} className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{detail.secondaryEmail}</a>
      </div>
    </article>
  );
}

export function ContactPage() {
  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="px-6 md:px-16 mb-14">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative border-b border-border/25 pb-10 pt-8 text-center flex flex-col items-center justify-center"
          >
            <span
              className="text-accent tracking-[0.4em] uppercase block mb-3"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              CONTACT US
            </span>
            
            <h1
              className="text-foreground leading-none mb-6 tracking-tight uppercase"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "clamp(40px, 6vw, 76px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              FINLAND TO
              <br />
              BANGLADESH
            </h1>
            
            <p
              className="text-muted-foreground max-w-2xl leading-relaxed mb-8"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "1.8",
              }}
            >
              Hide n Hype is building a fashion business between the clean
              edge of Finland and the raw creative pulse of Bangladesh. Select
              the right country contact below, or send one message and our
              team will route it to the right place.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  title={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 md:px-16 space-y-10 w-full">
       
        <div className="grid md:grid-cols-2 gap-6 xl:gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <CountryPanel detail={countryDetails[0]} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <CountryPanel detail={countryDetails[1]} />
          </motion.div>
        </div>

      
        <div className="w-full flex justify-center pt-8">
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-border/25 p-0 pt-8 w-full max-w-4xl mx-auto"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent/10 text-accent">
                <MessageSquare size={20} />
              </div>
              <div>
                <span
                  className="text-accent tracking-widest uppercase block"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  Start a Conversation
                </span>
                <h2
                  className="text-foreground"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                  }}
                >
                  TELL US WHAT YOU NEED
                </h2>
              </div>
            </div>

            <form
              className="grid gap-4"
              onSubmit={handleContactSubmit}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  aria-label="Name"
                  placeholder="Name"
                  autoComplete="name"
                  required
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  aria-label="Email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  aria-label="Phone number"
                  placeholder="Phone number"
                  autoComplete="tel"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
                <input
                  type="text"
                  name="location"
                  aria-label="Address or city"
                  placeholder="Address / city"
                  autoComplete="address-level2"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  type="url"
                  name="instagram"
                  aria-label="Instagram link"
                  placeholder="Instagram link"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
                <input
                  type="url"
                  name="facebook"
                  aria-label="Facebook link"
                  placeholder="Facebook link"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
                <input
                  type="url"
                  name="website"
                  aria-label="Website or portfolio"
                  placeholder="Website / portfolio"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {inquiryTypes.map((type) => (
                  <label
                    key={type}
                    className="cursor-pointer rounded-[8px] border border-border/35 px-4 py-2 text-muted-foreground transition-colors hover:border-accent/70 hover:text-foreground has-[:checked]:border-accent/80 has-[:checked]:text-accent"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                    }}
                  >
                    <input
                      type="radio"
                      name="inquiry"
                      value={type}
                      className="sr-only"
                    />
                    {type.toUpperCase()}
                  </label>
                ))}
              </div>

              <textarea
                name="message"
                aria-label="Message"
                placeholder="Message"
                rows={4}
                required
                className="w-full resize-none rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.7",
                }}
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-accent px-7 py-3.5 text-accent-foreground transition-colors hover:bg-foreground sm:w-fit"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                }}
              >
                SEND MESSAGE <ArrowRight size={15} />
              </button>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif", lineHeight: "1.7" }}>
                This opens your email app with your enquiry ready to send. If it does not open, email{" "}
                <a href="mailto:info@hiddenhype.com" className="text-accent underline underline-offset-4">info@hiddenhype.com</a>.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


