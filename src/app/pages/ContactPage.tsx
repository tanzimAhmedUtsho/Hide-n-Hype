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

const countryDetails = [
  {
    name: "Finland Office",
    city: "Vuohisillantie 46 E 35,68600 Pietarsaari, Finland",
    phone: "+358 40 2453236",
    email: "hidenhypeofficial@gmail.com",
    hours: "Mon-Fri, 10:00-18:00 EET",
    focus: "Global customer care, retail partnerships, wholesale meetings and brand operations.",
  },
  {
    name: "Bangladesh Office",
    city: "Agargaon, Dhaka, Bangladesh",
    phone: "+880 1756 467670",
    email: "hidenhypeofficial@gmail.com",
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

function CountryPanel({ detail }: { detail: typeof countryDetails[0] }) {
  return (
    <div className="w-full border-t border-border/25 pt-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-accent/10 text-accent">
          <MapPin size={19} />
        </div>
        <div>
          <span
            className="text-accent tracking-[0.4em] uppercase block mb-1"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Office Details
          </span>
          <h2
            className="text-foreground"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {detail.name}
          </h2>
        </div>
      </div>

      <p
        className="text-muted-foreground mb-6"
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: "16px",
          lineHeight: "1.7",
        }}
      >
        {detail.focus}
      </p>

      <div className="space-y-4">
        {[
          { icon: <MapPin size={17} />, label: "Address", value: detail.city },
          { icon: <Phone size={17} />, label: "Phone", value: detail.phone },
          { icon: <Mail size={17} />, label: "Email", value: detail.email },
          { icon: <Clock size={17} />, label: "Hours", value: detail.hours },
        ].map((item) => (
          <div
            key={item.label}
            className="flex gap-3 border-b border-border/20 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="mt-1 text-accent">{item.icon}</div>
            <div>
              <span
                className="text-accent tracking-widest uppercase block mb-1"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {item.label}
              </span>
              <p
                className="text-foreground break-words"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.7",
                }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
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
                  placeholder="Phone number"
                  className="w-full rounded-[8px] border border-border/35 bg-transparent px-4 py-3 text-foreground outline-none transition-all focus:border-accent/80"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                />
                <input
                  type="text"
                  placeholder="Address / city"
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
                placeholder="Message"
                rows={4}
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
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
