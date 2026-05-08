export interface Product {
  id: string;
  name: string;
  subName: string;
  price: string;
  image?: string;
  description: string;
  folderPath: string;
  frameCount?: number;
  framePrefix?: string;
  frameExtension?: string;
  themeColor: string;
  gradient: string;
  features: string[];
  stats: { label: string; val: string }[];
  section1: { title: string; subtitle: string };
  section2: { title: string; subtitle: string };
  section3: { title: string; subtitle: string };
  section4: { title: string; subtitle: string };
  detailsSection: { title: string; description: string; imageAlt: string };
  freshnessSection: { title: string; description: string };
  buyNowSection: {
    price: string;
    unit: string;
    processingParams: string[];
    deliveryPromise: string;
    returnPolicy: string;
  };
}

export const products: Product[] = [
  {
    id: "millet-mixture",
    name: "Millet Mixture",
    subName: "Crunch with a conscience.",
    price: "₹80",
    image: "/Crunch Mix.png",
    description: "Puffed Millet - Roasted Lentils - No Maida - Zero Trans Fat",
    folderPath: "/2nd-Product",
    frameCount: 240,
    framePrefix: "ezgif-frame-",
    frameExtension: "jpg",
    themeColor: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    features: ["Puffed Millet Base", "No Maida", "Zero Trans Fat"],
    stats: [
      { label: "Maida", val: "0g" },
      { label: "Millet", val: "100%" },
      { label: "Trans Fat", val: "0g" }
    ],
    section1: { title: "Millet Mixture.", subtitle: "Crunch with a conscience." },
    section2: {
      title: "The guilt-free namkeen.",
      subtitle: "Golden puffed millet, roasted lentils, and curry leaves — crafted for the snacker who doesn't compromise."
    },
    section3: {
      title: "Ancient grain, modern crunch.",
      subtitle: "Foxtail millet delivers slow-release energy that keeps you fuller for longer — no crash, just clarity."
    },
    section4: { title: "Real ingredients. Real crunch.", subtitle: "" },
    detailsSection: {
      title: "The Smarter Namkeen",
      description: "MilletFam Millet Mixture is a bold reimagination of the classic Indian namkeen. Built on a base of air-puffed foxtail millet, roasted split chickpeas, and sun-dried curry leaves, every handful delivers deep savory flavor with none of the refined flour guilt. Seasoned with cold-ground spices to preserve aroma and potency.",
      imageAlt: "Millet Mixture Details"
    },
    freshnessSection: {
      title: "Roasted Fresh, Sealed Fast",
      description: "Our mixture is roasted in small batches and nitrogen-flushed into foil-lined packs within the hour. No stale factory air, no artificial preservatives — just the honest crunch of freshly roasted millet grains, locked in at peak flavor."
    },
    buyNowSection: {
      price: "₹80",
      unit: "per 150g pack",
      processingParams: ["Air Puffed", "Small Batch Roasted", "Nitrogen Sealed"],
      deliveryPromise: "Delivered in crush-proof packaging to keep every grain intact. Pan-India shipping available.",
      returnPolicy: "If it arrives stale or damaged, we replace it. No questions, no forms."
    }
  },
  {
    id: "millet-chikki",
    name: "Millet Chikki",
    subName: "Jaggery-kissed energy.",
    price: "₹60",
    image: "/Energy Bar.png",
    description: "Jaggery Bound - Millet Seeds - Sesame - No Refined Sugar",
    folderPath: "/1st-product",
    frameCount: 240,
    framePrefix: "ezgif-frame-",
    frameExtension: "jpg",
    themeColor: "#92400E",
    gradient: "linear-gradient(135deg, #B45309 0%, #78350F 100%)",
    features: ["Jaggery Bound", "No Refined Sugar", "Natural Energy Bar"],
    stats: [
      { label: "Refined Sugar", val: "0g" },
      { label: "Jaggery", val: "100%" },
      { label: "Millet", val: "Rich" }
    ],
    section1: { title: "Millet Chikki.", subtitle: "Jaggery-kissed energy." },
    section2: {
      title: "The bar your grandmother would approve.",
      subtitle: "Real jaggery, toasted millet seeds, and sesame — an energy bar the Indian way."
    },
    section3: {
      title: "Sustained energy, zero spike.",
      subtitle: "Jaggery releases energy slowly — no sugar crash, just steady fuel through your busiest hours."
    },
    section4: { title: "One bite. Hours of energy.", subtitle: "" },
    detailsSection: {
      title: "The Original Energy Bar",
      description: "Long before protein bars existed, India had chikki. MilletFam's Millet Chikki elevates this tradition with a base of foxtail and pearl millet seeds, bound in pure A-grade jaggery sourced directly from Kolhapur farmers. Each bar is hand-pressed, cut by eye, and cooled slowly to preserve a satisfying, glass-like snap.",
      imageAlt: "Millet Chikki Details"
    },
    freshnessSection: {
      title: "Pressed by Hand, Packed with Care",
      description: "Machine-pressed chikki loses texture. Ours is hand-pressed in small batches, inspected for consistency, and individually wrapped to prevent moisture absorption. The jaggery caramel is cooked to the perfect crack-stage temperature — not a degree more — to preserve its unrefined mineral richness."
    },
    buyNowSection: {
      price: "₹60",
      unit: "per 100g bar pack",
      processingParams: ["Hand Pressed", "Jaggery Bound", "No Refined Sugar"],
      deliveryPromise: "Individually wrapped bars shipped in rigid mailers. Arrives unbroken, guaranteed.",
      returnPolicy: "Broken bar? Compromised taste? Full replacement issued within 24 hours."
    }
  },
  {
    id: "laddus",
    name: "Millet Laddus",
    subName: "Festive. Nourishing. Timeless.",
    price: "₹200",
    image: "/Laddu.png",
    description: "Ghee Roasted - Ragi & Jowar - Jaggery Sweetened - No Preservatives",
    folderPath: "/images/laddus",
    themeColor: "#D97706",
    gradient: "linear-gradient(135deg, #FCD34D 0%, #D97706 100%)",
    features: ["Ghee Roasted", "Jaggery Sweetened", "No Preservatives"],
    stats: [
      { label: "Preservatives", val: "0g" },
      { label: "Ghee", val: "Pure" },
      { label: "Grains", val: "3 Millet" }
    ],
    section1: { title: "Millet Laddus.", subtitle: "Festive. Nourishing. Timeless." },
    section2: {
      title: "Handcrafted with three millets.",
      subtitle: "Ragi, jowar, and bajra slow-roasted in pure desi ghee — the way it's always been done."
    },
    section3: {
      title: "Sweetness you can feel good about.",
      subtitle: "Jaggery and dates replace refined sugar entirely, delivering warmth and iron in every bite."
    },
    section4: { title: "A bite of tradition. A boost of nutrition.", subtitle: "" },
    detailsSection: {
      title: "Three Millets, One Perfect Bite",
      description: "MilletFam Millet Laddus are made using a three-millet blend — ragi for calcium, jowar for fiber, and bajra for iron — slow-roasted in small copper vessels with pure desi ghee. Sweetened exclusively with Kolhapur jaggery and Medjool date paste, they are dense, aromatic, and nourishing. Zero artificial anything.",
      imageAlt: "Millet Laddus Details"
    },
    freshnessSection: {
      title: "Made Fresh. Delivered Fast.",
      description: "Our laddus are rolled by hand in small daily batches and dispatched within 48 hours of production. No batch sits in a warehouse. Packed in food-safe kraft boxes with natural neem-oil-treated paper lining to extend shelf life without chemicals."
    },
    buyNowSection: {
      price: "₹200",
      unit: "per box of 6 laddus",
      processingParams: ["Hand Rolled", "Pure Ghee", "Fresh Batch Daily"],
      deliveryPromise: "Delivered in festive kraft packaging. Perfect as a gift or a daily ritual.",
      returnPolicy: "Not what you expected? We'll make it right — replacement or refund, your call."
    }
  },
  {
    id: "millet-cookies",
    name: "Millet Cookies",
    subName: "Baked good. Actually good.",
    price: "₹120",
    image: "/Cookies.png",
    description: "Whole Grain Millet - Oats - No Maida - Low Sugar - Slow Baked",
    folderPath: "/images/millet-cookies",
    themeColor: "#78716C",
    gradient: "linear-gradient(135deg, #A8A29E 0%, #57534E 100%)",
    features: ["No Maida", "Oats & Millet", "Low Sugar"],
    stats: [
      { label: "Maida", val: "0g" },
      { label: "Whole Grain", val: "100%" },
      { label: "Sugar", val: "Low" }
    ],
    section1: { title: "Millet Cookies.", subtitle: "Baked good. Actually good." },
    section2: {
      title: "The cookie that earns its keep.",
      subtitle: "Ragi flour, rolled oats, and cold-pressed coconut oil — baked slow to a satisfying, crumbly finish."
    },
    section3: {
      title: "Whole grain. Whole flavor.",
      subtitle: "Every bite packs dietary fiber, calcium, and complex carbohydrates — snacking that works for you."
    },
    section4: { title: "Zero Maida. Zero compromise.", subtitle: "" },
    detailsSection: {
      title: "The Cookie Reimagined",
      description: "MilletFam Millet Cookies throw out the rulebook on conventional biscuits. No refined flour, no hydrogenated fat, no artificial flavors. Instead: ragi flour for deep earthiness, rolled oats for texture, jaggery powder for gentle sweetness, and cold-pressed coconut oil for a clean, light finish. Baked low and slow at 160°C to preserve the grain's natural nutrition.",
      imageAlt: "Millet Cookies Details"
    },
    freshnessSection: {
      title: "Slow Baked. Quickly Loved.",
      description: "We bake in small trays, not industrial conveyor ovens. Each tray rests for 20 minutes post-bake before packing — a step most manufacturers skip. This ensures a perfect set, a longer texture life, and a consistent crunch in every single cookie."
    },
    buyNowSection: {
      price: "₹120",
      unit: "per 200g pack (approx. 12 cookies)",
      processingParams: ["Slow Baked", "No Maida", "Cold Pressed Oil"],
      deliveryPromise: "Packed in rigid tins to prevent breakage. Arrives crunchy, as promised.",
      returnPolicy: "Soft cookies on arrival? We re-bake and re-ship. That's our crunch guarantee."
    }
  },
  {
    id: "ragi-chips",
    name: "Ragi Chips",
    subName: "Paper thin. Power packed.",
    price: "₹70",
    image: "/Ragi Crisps.png",
    description: "100% Ragi - Baked Not Fried - High Calcium - No Artificial Flavors",
    folderPath: "/images/ragi-chips",
    themeColor: "#6B3A2A",
    gradient: "linear-gradient(135deg, #9A3412 0%, #431407 100%)",
    features: ["100% Ragi", "Baked Not Fried", "High Calcium"],
    stats: [
      { label: "Fried", val: "Never" },
      { label: "Calcium", val: "High" },
      { label: "Ragi", val: "100%" }
    ],
    section1: { title: "Ragi Chips.", subtitle: "Paper thin. Power packed." },
    section2: {
      title: "The crisp that changed the game.",
      subtitle: "Wafer-thin ragi crisps, baked to a dramatic snap — seasoned with rock salt and cracked pepper."
    },
    section3: {
      title: "Calcium in every crunch.",
      subtitle: "Ragi is one of nature's richest non-dairy calcium sources — making snacking actively good for your bones."
    },
    section4: { title: "Baked. Never fried. Always bold.", subtitle: "" },
    detailsSection: {
      title: "The Ragi Revolution",
      description: "MilletFam Ragi Chips are rolled paper-thin from a pure ragi dough — no fillers, no stretchers, no refined starch. Each chip is baked at high heat for a short burst to achieve a glass-like crunch and a deep, earthy ragi flavor that frying would destroy. Seasoned simply: rock salt, black pepper, and a whisper of cumin. That's it.",
      imageAlt: "Ragi Chips Details"
    },
    freshnessSection: {
      title: "Thin. Baked. Nitrogen Sealed.",
      description: "Thin chips are fragile. We pack them in multi-layer foil pouches with nitrogen flushing immediately after baking to eliminate oxygen — the enemy of crunch. Every bag that leaves our facility passes a seal integrity check. If the chip doesn't snap, it doesn't ship."
    },
    buyNowSection: {
      price: "₹70",
      unit: "per 80g pack",
      processingParams: ["Baked Not Fried", "Nitrogen Flushed", "No Artificial Flavors"],
      deliveryPromise: "Shipped in rigid outer cartons. Crunch integrity guaranteed on arrival.",
      returnPolicy: "Soggy or broken chips? Instant replacement. We stand by every crunch."
    }
  }
];
