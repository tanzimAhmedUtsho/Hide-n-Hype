import { useState } from "react";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import logoImage from "../../imports/logo.png";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "NEW ARRIVALS", path: "/new-arrivals" },
    { label: "COLLECTION", path: "/collection", hasDropdown: true },
    { label: "SALE", path: "/sale" },
    { label: "LOOKBOOK", path: "/lookbook" },
    { label: "SOURCING", path: "/sourcing-manufacturing" },
    { label: "ABOUT", path: "/about" },
  ];

  const collectionCategories = [
    { label: "Men", path: "/collection/men" },
    { label: "Women", path: "/collection/women" },
    { label: "Kids", path: "/collection/kids" },
    { label: "Accessories", path: "/collection/accessories" },
    { label: "Leather Items", path: "/collection/leather" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0) 100%)" }}
      >
       
    {/* Logo */}
    <Link to="/" className="flex items-center select-none py-1">
      <img 
        src={logoImage} 
        alt="Hide n Hype" 
        className="h-9 md:h-11 w-auto object-contain" 
      />
    </Link>

        {/* Center links - desktop */}
        <div className="hidden md:flex items-center gap-5 lg:gap-8">
          {navLinks.map((link) => (
            <div
              key={link.path}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setCollectionDropdownOpen(true)}
              onMouseLeave={() => link.hasDropdown && setCollectionDropdownOpen(false)}
            >
              {link.hasDropdown ? (
                <>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-1 transition-colors duration-200 tracking-widest ${
                      location.pathname.startsWith("/collection") ? "text-accent" : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${collectionDropdownOpen ? "rotate-180" : ""}`} />
                  </Link>

                  {/* Collection Dropdown */}
                  <AnimatePresence>
                    {collectionDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-4 border border-border overflow-hidden z-50"
                        style={{
                          background: "rgba(8,8,8,0.98)",
                          backdropFilter: "blur(12px)",
                          minWidth: "200px"
                        }}
                      >
                        {collectionCategories.map((category) => (
                          <Link
                            key={category.path}
                            to={category.path}
                            className="block px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors duration-150"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em" }}
                          >
                            {category.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={link.path}
                  className={`transition-colors duration-200 tracking-widest ${
                    location.pathname === link.path ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", fontWeight: 600 }}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <button className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            <Search size={18} />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            <ShoppingBag size={18} />
          </button>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.path}
                  className="text-foreground hover:text-accent transition-colors tracking-widest"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "32px", fontWeight: 800 }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
