const ridingGearItems = [
  ["Armored Riding Pants", "Technical riding pants with knee panels, adjustable waist tabs, and reflective red accents."],
  ["Quilted Lining Riding Jacket", "Riding jacket showing a quilted lining and bright contrast inner panel."],
  ["Touring Jacket – Olive", "Olive and charcoal touring jacket with reflective detailing and an adjustable fit."],
  ["Mesh Riding Jacket – Navy", "Black mesh riding jacket with navy panels and adjustable sleeve tabs."],
  ["Mesh Riding Jacket – Black", "Black ventilated mesh riding jacket with reflective chest branding."],
  ["Leather Riding Jacket – Black and White", "Black and white color-block leather riding jacket with zip front."],
  ["Mesh Riding Jacket – Red", "Red and black ventilated riding jacket with contrast panels."],
  ["Mesh Riding Jacket – Stealth Black", "Minimal all-black mesh riding jacket with a clean technical finish."],
  ["Olive W5 Touring Jacket", "Olive touring jacket with padded panels, reflective accents, and an adjustable fit."],
  ["Sport Riding Jacket – Red White and Black", "Sport riding jacket with red, white, and black panels and shoulder protection."],
  ["Touring Jacket – Olive Utility", "Olive touring jacket with zip pockets, reinforced elbows, and adjustable cuffs."],
  ["Mesh Riding Jacket – White and Black", "White and black ventilated riding jacket with red contrast trim."],
  ["Leather Riding Jacket – Black Detail", "Close view of a black leather riding jacket with reflective chest graphics."],
  ["Armored Leather Riding Jacket", "Black leather riding jacket with structured shoulder protection and zip pockets."],
  ["Mesh Riding Jacket – White and Black", "White and black ventilated riding jacket with red contrast trim."],
  ["Mesh Riding Jacket – Charcoal", "Charcoal mesh riding jacket with reflective chest graphics and adjustable cuffs."],
  ["Hi-Vis Mesh Riding Jacket – Neon", "Black mesh riding jacket with high-visibility neon panels and reflective details."],
  ["Riding Rain Suit – Model", "Two-piece hooded riding rain suit shown on a model."],
  ["Touring Jacket – Black Reflective", "Black touring jacket with reflective piping and adjustable waist tabs."],
  ["Sport Riding Jacket – Red and Black", "Red and black sport riding jacket with contrast panels and a high collar."],
  ["Riding Rain Suit – Black Set", "Black hooded rain jacket and trousers designed as a coordinated set."],
  ["Riding Rain Suit – Red and Black", "Red and black rain suit with matching protective shoe covers."],
  ["Riding Rain Suit – Reflective Black", "Black two-piece rain suit with reflective bands and adjustable cuffs."],
  ["Riding Rain Jacket – Lifestyle", "Hooded riding rain jacket shown in a wet-weather setting."],
  ["Riding Rain Jacket – Charcoal", "Charcoal hooded rain jacket with reflective sleeve bands."],
  ["Riding Rain Jackets – Hi-Vis Pair", "Two riding rain jacket colorways with reflective safety bands."],
  ["Armored Mesh Jacket – Black", "Black ventilated riding jacket with shoulder protection and reflective trim."],
  ["Wear Shade Graphic T-Shirt", "Black graphic t-shirt styled with motorcycle apparel."],
  ["Mesh Riding Jacket – White and Red", "White ventilated riding jacket with red accents and adjustable sleeve tabs."],
  ["Mesh Riding Jacket – Blue", "Blue and black ventilated riding jacket with contrast detailing."],
  ["One-Piece Riding Rain Suit – Black", "Black one-piece riding rain suit with reflective bands and adjustable waist."],
  ["Mesh Riding Jacket – Neon Green", "High-visibility neon green and black ventilated riding jacket."],
  ["Sport Riding Jacket – Red Black and White", "Sport riding jacket with red, black, and white panels."],
  ["Two-Piece Rain Suit – Black Detail", "Black hooded rain jacket and trousers with reflective branding."],
] as const;

const galleryImagesById: Record<number, number[]> = {
  1: [1, 2],
  4: [5, 4],
  11: [13, 11],
  14: [17, 14],
};

export const ridingGearProducts = ridingGearItems.map(([name, description], index) => {
  const id = index + 1;
  const imagePath = (imageId: number) => `/riding-gear/riding-gear-${String(imageId).padStart(2, "0")}.jpeg`;
  const images = (galleryImagesById[id] ?? [id]).map(imagePath);

  const product = {
    id,
    name,
    slug: `riding-gear-${String(id).padStart(2, "0")}`,
    category: "Riding Gear",
    tag: "NEW",
    image: images[0],
    images,
    alt: description,
    colorOptions: ["#171717", "#73766b", "#c72b37"],
  };

  if (id === 6) {
    return {
      ...product,
      name: "Mesh Riding Jacket",
      alt: "Ventilated mesh riding jacket with contrast color panels and reflective branding.",
      variants: [
        { name: "Navy", color: "#263a5b", images: [imagePath(6)] },
        { name: "Hi-Vis", color: "#d8ee32", images: [imagePath(19)] },
      ],
    };
  }

  return product;
}).filter((product) => ![2, 5, 7, 13, 17, 19, 20, 24, 26, 30].includes(product.id));
