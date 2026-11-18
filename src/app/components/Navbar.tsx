import { useMemo, useState } from "react";
import { ShoppingBag, Search, Menu, X, ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import logoImage from "../../imports/logo.png";
import { menProducts } from "../pages/MenPage";
import { womenProducts } from "../pages/WomenPage";
import { kidsProducts } from "../pages/KidsPage";
import { accessoriesProducts } from "../pages/AccessoriesPage";
import { leatherProducts } from "../pages/LeatherPage";
import { denimProducts } from "../pages/DenimPage";
import { productSlug } from "../productCatalog";
import { ridingGearProducts } from "../ridingGearCatalog";

const searchableProducts = [
  ...menProducts.map((product) => ({ ...product, category: "Men", path: `/products/${productSlug(product.name)}` })),
  ...womenProducts.map((product) => ({ ...product, category: "Women", path: `/products/${productSlug(product.name)}` })),
  ...kidsProducts.map((product) => ({ ...product, category: "Kids", path: `/products/${productSlug(product.name)}` })),
  ...denimProducts.map((product) => ({ ...product, category: "Denim", path: `/products/${productSlug(product.name)}` })),
  ...accessoriesProducts.map((product) => ({ ...product, category: "Accessories", path: `/products/${productSlug(product.name)}` })),
  ...leatherProducts.map((product) => ({ ...product, category: "Leather Items", path: `/products/${productSlug(product.name)}` })),
  ...ridingGearProducts.map((product) => ({ ...product, path: `/products/${product.slug}` })),
];

const searchableCategories = [
  { name: "Men", path: "/collection/men" },
  { name: "Women", path: "/collection/women" },
  { name: "Kids", path: "/collection/kids" },
  { name: "Denim", path: "/collection/denim" },
  { name: "Riding Gear", path: "/collection/riding-gear" },
  { name: "Accessories", path: "/collection/accessories" },
  { name: "Leather Items", path: "/collection/leather" },
  { name: "All Collection", path: "/collection" },
];

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isOneEditAway(left: string, right: string) {
  if (Math.abs(left.length - right.length) > 1) return false;

  let leftIndex = 0;
  let rightIndex = 0;
  let differences = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    differences += 1;
    if (differences > 1) return false;

    if (left.length > right.length) leftIndex += 1;
    else if (right.length > left.length) rightIndex += 1;
    else {
      leftIndex += 1;
      rightIndex += 1;
    }
  }

  return differences + Number(leftIndex < left.length || rightIndex < right.length) <= 1;
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderForm, setOrderForm] = useState({ customer: "", email: "", phone: "", product: "", message: "" });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const location = useLocation();
  const searchResults = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    if (!query) return { products: [], categories: [] };

    const exactProducts = searchableProducts.filter(
      (product) => normalizeSearchText(product.name) === query,
    );
    if (exactProducts.length > 0) {
      return { products: exactProducts, categories: [] };
    }

    const matchingProducts = searchableProducts.filter((product) =>
      normalizeSearchText(`${product.name} ${product.category}`).includes(query),
    );
    const queryWords = query.split(" ");
    const typoMatches =
      matchingProducts.length === 0
        ? searchableProducts.filter((product) => {
            const productWords = normalizeSearchText(product.name).split(" ");
            return queryWords.every((queryWord) =>
              productWords.some(
                (productWord) =>
                  queryWord === productWord ||
                  (Math.max(queryWord.length, productWord.length) >= 5 &&
                    isOneEditAway(queryWord, productWord)),
              ),
            );
          })
        : [];

    return {
      products: (matchingProducts.length > 0 ? matchingProducts : typoMatches)
        .slice(0, 5),
      categories: searchableCategories
        .filter((category) => normalizeSearchText(category.name).includes(query))
        .slice(0, 3),
    };
  }, [searchQuery]);

  async function submitOrderInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (orderSubmitting) return;
    setOrderSubmitting(true);
    setOrderMessage("");
    try {
      const apiBase = import.meta.env.VITE_CMS_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/public/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your enquiry.");
      setOrderMessage(`Thanks. Your enquiry ${result.orderNumber} has been sent. Our team will contact you to confirm availability and pricing.`);
      setOrderForm({ customer: "", email: "", phone: "", product: "", message: "" });
    } catch (error) {
      setOrderMessage(error instanceof Error ? error.message : "Could not send your enquiry.");
    } finally {
      setOrderSubmitting(false);
    }
  }

  const navLinks = [
    { label: "NEW ARRIVALS", path: "/new-arrivals" },
    { label: "COLLECTION", path: "/collection", hasDropdown: true },
    //{ label: "SALE", path: "/sale" },
    { label: "LOOKBOOK", path: "/lookbook" },
    { label: "OUR BUSINESS", path: "/sourcing-manufacturing" },
    { label: "ABOUT", path: "/about" },
  ];

  const collectionCategories = [
    { label: "Men", path: "/collection/men" },
    { label: "Women", path: "/collection/women" },
    { label: "Kids", path: "/collection/kids" },
    { label: "Denim", path: "/collection/denim" },
    { label: "Riding Gear", path: "/collection/riding-gear" },
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
          <Link
            to="/contact"
            aria-label="Contact Hide n Hype"
            title="Contact us"
            className="hidden h-8 w-9 items-center justify-center gap-2 rounded-full border border-accent/35 text-accent/90 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground md:flex xl:w-auto xl:px-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em" }}
          >
            <Mail size={14} />
            <span className="hidden xl:inline">CONTACT</span>
          </Link>
          <Link
            to="/contact"
            aria-label="Contact Hide n Hype"
            title="Contact us"
            className="text-muted-foreground transition-colors hover:text-accent md:hidden"
          >
            <Mail size={16} />
          </Link>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => {
              setBagOpen((open) => !open);
              setSearchOpen(false);
              setMenuOpen(false);
            }}
            aria-label={bagOpen ? "Close shopping bag" : "Open shopping bag"}
            aria-expanded={bagOpen}
          >
            {bagOpen ? <X size={18} /> : <ShoppingBag size={18} />}
          </button>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close search"
              className="fixed inset-0 z-[55] cursor-default bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed right-4 top-20 z-[60] w-[calc(100%-2rem)] max-w-md border border-border bg-background p-4 shadow-xl md:right-10"
            >
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Search size={18} className="shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setSearchOpen(false);
                  }}
                  placeholder="Search products and collections"
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  aria-label="Search products and collections"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {searchQuery.trim() && (
                <div className="max-h-[60vh] overflow-y-auto pt-3">
                  {searchResults.products.map((product) => (
                    <Link
                      key={`${product.category}-${product.id}`}
                      to={product.path}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="block border-b border-border/60 px-2 py-3 hover:bg-accent/10"
                    >
                      <span className="block text-sm text-foreground">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </Link>
                  ))}
                  {searchResults.categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="block border-b border-border/60 px-2 py-3 text-sm text-accent hover:bg-accent/10"
                    >
                      Browse {category.name} collection
                    </Link>
                  ))}
                  {searchResults.products.length === 0 && searchResults.categories.length === 0 && (
                    <p className="px-2 py-4 text-sm text-muted-foreground">No matching products or collections.</p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bagOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close shopping bag"
              className="fixed inset-0 z-[55] cursor-default bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBagOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="shopping-bag-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 z-[60] flex h-full w-[min(100%,400px)] flex-col border-l border-border bg-background p-6 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-5">
                <h2
                  id="shopping-bag-title"
                  className="text-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "24px", fontWeight: 800, letterSpacing: "0.08em" }}
                >
                  YOUR BAG
                </h2>
                <button
                  type="button"
                  onClick={() => setBagOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close shopping bag"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto py-5">
                <div className="mb-5 text-center">
                  <ShoppingBag size={28} className="mx-auto mb-3 text-accent" />
                  <p className="mb-1 text-foreground">Ask us about a product</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">Send an enquiry and our team will contact you to confirm price, stock and delivery.</p>
                </div>
                {orderMessage && <p role="status" className="mb-4 rounded border border-border p-3 text-sm text-foreground">{orderMessage}</p>}
                <form onSubmit={submitOrderInquiry} className="grid gap-3">
                  <select required aria-label="Choose a product" value={orderForm.product} onChange={event => setOrderForm(current => ({ ...current, product: event.target.value }))} className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground">
                    <option value="">Choose a product</option>
                    {searchableProducts.map(product => <option key={`${product.category}-${product.name}`} value={`${product.name} (${product.category})`}>{product.name} · {product.category}</option>)}
                  </select>
                  <input required maxLength={120} value={orderForm.customer} onChange={event => setOrderForm(current => ({ ...current, customer: event.target.value }))} placeholder="Your name" autoComplete="name" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
                  <input required type="email" maxLength={254} value={orderForm.email} onChange={event => setOrderForm(current => ({ ...current, email: event.target.value }))} placeholder="Email address" autoComplete="email" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
                  <input required type="tel" maxLength={40} value={orderForm.phone} onChange={event => setOrderForm(current => ({ ...current, phone: event.target.value }))} placeholder="Phone / WhatsApp" autoComplete="tel" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
                  <textarea maxLength={1500} value={orderForm.message} onChange={event => setOrderForm(current => ({ ...current, message: event.target.value }))} placeholder="Size, colour or delivery questions (optional)" rows={3} className="w-full resize-none border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground" />
                  <button disabled={orderSubmitting} type="submit" className="mt-1 w-full bg-accent px-5 py-3 text-sm font-semibold tracking-widest text-accent-foreground transition-colors hover:bg-foreground disabled:opacity-60" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {orderSubmitting ? "SENDING…" : "SEND PRODUCT ENQUIRY"}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">This sends an order enquiry, not a payment or confirmed purchase.</p>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.07 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-accent/60 px-6 py-3 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "0.12em" }}
                onClick={() => setMenuOpen(false)}
              >
                <Mail size={20} /> CONTACT US
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
