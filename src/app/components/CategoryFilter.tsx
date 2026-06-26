import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";

const categories = [
  { label: "All Collection", path: "/collection" },
  { label: "Men", path: "/collection/men" },
  { label: "Women", path: "/collection/women" },
  { label: "Kids", path: "/collection/kids" },
  { label: "Accessories", path: "/collection/accessories" },
  { label: "Leather Items", path: "/collection/leather" },
];

interface CategoryFilterProps {
  currentCategory?: string;
}

export function CategoryFilter({ currentCategory = "all" }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    categories.find((cat) => cat.path.includes(currentCategory))?.label || "All Collection";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 border border-border bg-card px-6 py-3 hover:border-accent transition-all duration-200"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          minWidth: "200px",
        }}
      >
        <span className="text-foreground flex-1 text-left">{currentLabel}</span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 border border-border bg-card z-50 overflow-hidden"
              style={{ minWidth: "200px" }}
            >
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-3 transition-colors duration-150 ${
                    category.path.includes(currentCategory) && currentCategory !== "all"
                      ? "bg-accent text-accent-foreground"
                      : category.path === "/collection" && currentCategory === "all"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
                  }`}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                >
                  {category.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
