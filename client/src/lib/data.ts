// Quiet Utility reminder: keep catalog content practical, tactile, and easy to scan.
// Use Loop Leaf green #2F6B4F, warm cream surfaces, and specific, honest utility copy.

export type ProductCategory = "Kitchen" | "Bathroom" | "Laundry" | "Cleaning" | "Pantry";
export type ProductType = "Refill" | "Starter kit" | "Bundle" | "Reusable";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  type: ProductType;
  description: string;
  longDescription: string;
  price: number;
  subscriptionPrice: number;
  scent: string;
  badge?: string;
  size: string;
  image: string;
  imageAlt: string;
  details: string[];
  ingredients: string[];
  usage: string;
  sustainability: string;
};

export const products: Product[] = [
  {
    id: "citrus-dish-soap",
    name: "Citrus Grove Dish Soap Refill",
    slug: "citrus-grove-dish-soap-refill",
    category: "Kitchen",
    type: "Refill",
    description: "A bright, grease-cutting concentrate for everyday dishes.",
    longDescription: "A low-waste dish soap refill with plant-based cleansers and a fresh citrus finish. One pouch makes a full bottle of good, hardworking soap.",
    price: 8,
    subscriptionPrice: 6.8,
    scent: "Citrus grove",
    badge: "Best seller",
    size: "16 fl oz / 473 ml",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Amber refill bottles, refill pouch, citrus peel, and sage linen on a cream surface",
    details: ["Mixes with water in your reusable bottle", "Plant-based cleaning agents", "No dyes or chlorine", "Suitable for septic systems"],
    ingredients: ["Purified water", "Decyl glucoside", "Sodium citrate", "Glycerin", "Natural citrus oils"],
    usage: "Add one pouch to a clean bottle, top with water, and gently swirl. Use one or two pumps on a wet sponge or directly on dishes.",
    sustainability: "One lightweight refill pouch uses less material than a new bottle and keeps the same amber bottle in your routine.",
  },
  {
    id: "lavender-laundry",
    name: "Lavender Laundry Detergent Refill",
    slug: "lavender-laundry-detergent-refill",
    category: "Laundry",
    type: "Refill",
    description: "A gentle, concentrated wash with a soft lavender finish.",
    longDescription: "A concentrated laundry refill made for everyday loads. It lifts dirt without leaving your clothes smelling like a perfume counter.",
    price: 14,
    subscriptionPrice: 11.9,
    scent: "Lavender field",
    badge: "Plastic saver",
    size: "32 loads",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Organized open shelf with reusable amber bottles and folded linen towels",
    details: ["Works in standard and HE machines", "Color-safe and cold-water friendly", "Concentrated for 32 loads", "Plant-based formula"],
    ingredients: ["Plant-derived surfactants", "Sodium citrate", "Sodium bicarbonate", "Lavender essential oil"],
    usage: "Pour one measured cap into the drum or detergent drawer. Use half a cap for a small load.",
    sustainability: "A concentrated pouch means fewer trucks and less packaging per wash compared with a new plastic jug.",
  },
  {
    id: "hand-soap-starter",
    name: "Unscented Hand Soap Starter Kit",
    slug: "unscented-hand-soap-starter-kit",
    category: "Bathroom",
    type: "Starter kit",
    description: "One reusable amber pump, plus a no-fuss first refill.",
    longDescription: "Start the refill habit at the sink with a durable amber bottle and a gentle, unscented hand soap refill. Simple, familiar, and easy to keep topped up.",
    price: 22,
    subscriptionPrice: 18.7,
    scent: "Unscented",
    badge: "Starter kit",
    size: "12 fl oz / 355 ml",
    image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg",
    imageAlt: "Amber hand soap pump and refill pouch on a bright bathroom vanity with an oat towel",
    details: ["Amber glass bottle with pump", "One first-use refill included", "Fragrance-free formula", "Ships plastic-light"],
    ingredients: ["Purified water", "Decyl glucoside", "Glycerin", "Aloe vera", "Sodium citrate"],
    usage: "Fill the bottle with the included concentrate, top with water, and gently swirl before fitting the pump.",
    sustainability: "The reusable amber bottle is designed to stay on your sink for years, not weeks.",
  },
  {
    id: "eucalyptus-cleaner",
    name: "Eucalyptus All-Purpose Cleaner",
    slug: "eucalyptus-all-purpose-cleaner",
    category: "Cleaning",
    type: "Refill",
    description: "A fresh, everyday spray for counters, tables, and tile.",
    longDescription: "A practical multi-surface cleaner with a crisp eucalyptus note. Tough on daily messes, calm on your cleaning shelf.",
    price: 10,
    subscriptionPrice: 8.5,
    scent: "Eucalyptus leaf",
    badge: "New",
    size: "24 fl oz / 710 ml",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Refillable amber bottles on a bright kitchen counter beside a folded linen towel",
    details: ["For sealed stone, tile, glass, and wood", "No bleach or ammonia", "Light eucalyptus scent", "Makes one full spray bottle"],
    ingredients: ["Plant-derived surfactants", "Citric acid", "Eucalyptus essential oil", "Purified water"],
    usage: "Mix the pouch with water in your spray bottle. Spray onto a cloth or surface and wipe clean.",
    sustainability: "Refill the same spray bottle again and again instead of replacing a bulky single-use bottle.",
  },
  {
    id: "botanical-shampoo",
    name: "Botanical Shampoo Refill",
    slug: "botanical-shampoo-refill",
    category: "Bathroom",
    type: "Refill",
    description: "A balanced daily shampoo with a soft herbal scent.",
    longDescription: "A gentle shampoo refill with aloe and oat extract for an uncomplicated wash day. Designed to feel at home beside your hand soap, not hidden away.",
    price: 12,
    subscriptionPrice: 10.2,
    scent: "Herbal garden",
    size: "12 fl oz / 355 ml",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Amber bathroom bottle and natural bath accessories in warm morning light",
    details: ["Suitable for daily use", "Aloe and oat extract", "No silicones or parabens", "Color-safe"],
    ingredients: ["Aloe vera", "Oat extract", "Coco-glucoside", "Glycerin", "Rosemary leaf water"],
    usage: "Massage one or two pumps into wet hair. Rinse well and follow with conditioner if desired.",
    sustainability: "One refill arrives flat and light, while your bottle stays in your shower routine.",
  },
  {
    id: "cedar-bathroom",
    name: "Cedar & Sage Bathroom Cleaner",
    slug: "cedar-sage-bathroom-cleaner",
    category: "Cleaning",
    type: "Refill",
    description: "A grounded spray for sinks, tile, and the weekly reset.",
    longDescription: "A bathroom cleaner with a cedar-and-sage profile that makes the weekly reset feel a little more considered.",
    price: 11,
    subscriptionPrice: 9.35,
    scent: "Cedar & sage",
    size: "24 fl oz / 710 ml",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bright clean bathroom with natural linen and amber refill bottle",
    details: ["Cuts through soap scum", "For sinks, tile, and fixtures", "No chlorine bleach", "Fresh cedar and sage scent"],
    ingredients: ["Citric acid", "Plant-derived surfactants", "Sodium citrate", "Cedarwood and sage oils"],
    usage: "Spray, leave for a minute on stubborn marks, then wipe with a damp cloth.",
    sustainability: "A single spray bottle can stay in your cleaning caddy for years with flat refills in the cupboard.",
  },
  {
    id: "spice-refill-set",
    name: "Everyday Spice Refill Set",
    slug: "everyday-spice-refill-set",
    category: "Pantry",
    type: "Bundle",
    description: "Six kitchen staples for a pantry that stays in rotation.",
    longDescription: "A considered set of everyday spices to start a refillable pantry: sea salt, black pepper, smoked paprika, cumin, oregano, and cinnamon.",
    price: 26,
    subscriptionPrice: 22.1,
    scent: "Warm pantry",
    badge: "Bundle",
    size: "6 x 2.5 oz jars",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Glass spice jars and dried herbs arranged on a warm kitchen shelf",
    details: ["Six everyday spices", "Reusable glass jars", "Compostable refill envelopes", "Packed for easy pantry labeling"],
    ingredients: ["Sea salt", "Black pepper", "Smoked paprika", "Cumin", "Oregano", "Cinnamon"],
    usage: "Pour each refill into its matching jar and keep the open envelopes in the compost or paper recycling according to local guidance.",
    sustainability: "The jars are the keeper; the next delivery arrives as compact spice refills instead of new glass.",
  },
  {
    id: "amber-bottle-set",
    name: "Reusable Amber Bottle Set",
    slug: "reusable-amber-bottle-set",
    category: "Kitchen",
    type: "Reusable",
    description: "Three durable bottles to make refilling feel second nature.",
    longDescription: "A set of three amber glass bottles with pumps and a spray trigger, ready for soap, cleaner, and whatever routine you are building next.",
    price: 18,
    subscriptionPrice: 18,
    scent: "No scent",
    badge: "Reusable essential",
    size: "3 x 16 fl oz / 473 ml",
    image: "/manus-storage/refillloop-soap-reference_627d8cdc.jpg",
    imageAlt: "Reusable amber glass bottles with simple pumps on a cream surface",
    details: ["Two pump tops and one spray trigger", "Amber glass helps protect formulas", "Silicone labels included", "Dishwasher-safe glass"],
    ingredients: ["Amber glass", "Aluminum pump components", "Silicone label set"],
    usage: "Rinse and fully dry between formulas. Apply the included label, fill with your refill, and return the top.",
    sustainability: "A starter set that replaces the need to buy new plastic dispensers each time a product runs out.",
  },
];

export const categories = [
  { name: "Kitchen", note: "Keep the sink in rotation", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80" },
  { name: "Bathroom", note: "Small rituals, less waste", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80" },
  { name: "Laundry", note: "Good washes, lighter shelves", image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=900&q=80" },
  { name: "Cleaning", note: "The weekly reset, refilled", image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80" },
  { name: "Pantry", note: "Staples that stay in rotation", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80" },
];

export const findProduct = (slug: string) => products.find((product) => product.slug === slug);

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;
