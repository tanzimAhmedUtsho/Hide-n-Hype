import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router";

const footerLinks = {
  SHOP: [
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Collection", path: "/collection" },
    { label: "Sale", path: "/sale" },
  ],
  HELP: [
    { label: "FAQ", path: "#" },
    { label: "Shipping & Returns", path: "#" },
    { label: "Size Guide", path: "#" },
    { label: "Track Order", path: "#" },
    { label: "Contact Us", path: "/contact" },
  ],
  BRAND: [
    { label: "Our Story", path: "/about" },
    { label: "Lookbook", path: "/lookbook" },
    { label: "Press", path: "#" },
    { label: "Collaborations", path: "#" },
    { label: "Careers", path: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t border-border"
      style={{ background: "#050505" }}
    >
      <div className="px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="mb-4 inline-block">
              <div
                className="text-foreground tracking-[0.3em] "
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "24px", fontWeight: 700 }}
              >
                Hide n Hype
              </div>
              <div
                className="text-accent tracking-[0.6em] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "9px", fontWeight: 500 }}
              >
                EST. 2026
              </div>
            </Link>
            <p
              className="text-muted-foreground mb-6 max-w-xs leading-relaxed"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "13px" }}
            >
              Bold shaped between Bangladesh and Finland.
              Crafted for the fearless. Worn by the culture.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: <Instagram size={16} />, label: "Instagram", href: "https://www.instagram.com/hidenhype/"},
                { icon: <Facebook size={16} />, label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590884966385"},
                { icon: <Linkedin size={16} />, label: "LinkedIn", href: "https://x.com/HidenHype"},
                { icon: <Twitter size={16} />, label: "Twitter", href: "https://twitter.com/hidenhype"},
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                className="text-foreground mb-4 tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 800 }}
              >
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.path.startsWith("#") ? (
                      <a
                        href={link.path}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                        style={{ fontFamily: "'Barlow', sans-serif", fontSize: "13px" }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-150"
                        style={{ fontFamily: "'Barlow', sans-serif", fontSize: "13px" }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border px-6 md:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span
          className="text-muted-foreground"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "12px" }}
        >
          © 2026 Hide n Hype. All rights reserved.
        </span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "12px" }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
