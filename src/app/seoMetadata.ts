import { catalogProductRoutes } from "./productCatalog";
import { ridingGearProducts } from "./ridingGearCatalog";

export const siteUrl = "https://www.hidenhype.com";
export const socialImageUrl = `${siteUrl}/hnh-social-preview.png`;

export const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Hide n Hype | Bangladesh Apparel Sourcing & Streetwear",
    description:
      "Hide n Hype connects global brands with apparel sourcing and manufacturing from Bangladesh, alongside bold streetwear collections.",
  },
  "/new-arrivals": {
    title: "New Arrivals | Hide n Hype",
    description: "Explore the latest streetwear styles and new apparel from Hide n Hype.",
  },
  "/sale": {
    title: "Sale Streetwear & Apparel | Hide n Hype",
    description: "Explore selected streetwear and apparel offers from Hide n Hype. Contact our team for product and wholesale enquiries.",
  },
  "/collection": {
    title: "Apparel Collection | Hide n Hype",
    description:
      "Browse the Hide n Hype apparel collection, including streetwear, denim, accessories, and more.",
  },
  "/collection/men": {
    title: "Men's Apparel Collection | Hide n Hype",
    description: "Explore men's streetwear, apparel, and everyday essentials from Hide n Hype.",
  },
  "/collection/women": {
    title: "Women's Apparel Collection | Hide n Hype",
    description: "Explore women's streetwear and apparel styles from Hide n Hype.",
  },
  "/collection/kids": {
    title: "Kids' Apparel Collection | Hide n Hype",
    description: "Explore comfortable kids' streetwear and apparel from Hide n Hype.",
  },
  "/collection/accessories": {
    title: "Streetwear Accessories | Hide n Hype",
    description: "Browse bags, caps, and streetwear accessories from Hide n Hype.",
  },
  "/collection/leather": {
    title: "Leather Goods Collection | Hide n Hype",
    description: "Explore leather goods and accessories from Hide n Hype.",
  },
  "/collection/denim": {
    title: "Denim Collection | Hide n Hype",
    description:
      "Explore denim jeans, jackets, shirts, and streetwear styles from the Hide n Hype denim collection.",
  },
  "/collection/riding-gear": {
    title: "Motorcycle Riding Gear | Hide n Hype",
    description: "Browse motorcycle riding jackets, rain suits, and protective gear from Hide n Hype.",
  },
  "/lookbook": {
    title: "Lookbook | Hide n Hype",
    description: "Discover Hide n Hype streetwear styling, collections, and seasonal looks.",
  },
  "/about": {
    title: "About Hide n Hype | Apparel Sourcing & Manufacturing",
    description:
      "Learn about Hide n Hype, a Bangladesh-based apparel sourcing and manufacturing partner for global brands.",
  },
  "/contact": {
    title: "Contact Hide n Hype | Apparel Sourcing Enquiries",
    description:
      "Contact Hide n Hype for apparel sourcing, manufacturing, product development, and business enquiries.",
  },
  "/profile": {
    title: "My Profile | Hide n Hype",
    description: "Manage your Hide n Hype customer profile and delivery details.",
  },
  "/faq": {
    title: "Frequently Asked Questions | Hide n Hype",
    description: "Find answers about Hide n Hype product enquiries, apparel sourcing, manufacturing, order quantities, and lead times.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Hide n Hype",
    description: "Learn how Hide n Hype handles personal information across its Finland and Bangladesh operations.",
  },
  "/cookie-policy": {
    title: "Cookie Policy | Hide n Hype",
    description: "Learn how Hide n Hype uses essential browser storage and consent-based Google Analytics.",
  },
  "/sourcing-manufacturing": {
    title: "Apparel Sourcing & Manufacturing in Bangladesh | Hide n Hype",
    description:
      "Hide n Hype supports global buyers with apparel sourcing, manufacturing, sampling, quality control, and export coordination from Bangladesh.",
  },
};

for (const product of catalogProductRoutes) {
  pageMetadata[`/products/${product.slug}`] = {
    title: `${product.name} | Hide n Hype`,
    description: `Explore the ${product.name} in the Hide n Hype ${product.category} collection. View product details and contact us about this style.`,
  };
}

for (const product of ridingGearProducts) {
  pageMetadata[`/products/${product.slug}`] = {
    title: `${product.name} | Hide n Hype`,
    description: `${product.alt} Explore this motorcycle riding gear style from Hide n Hype and contact us for product enquiries.`,
  };
}
