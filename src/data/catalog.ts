import { KIT_LICENSE, MODEL_REGISTRY } from "@/data/model-registry";

export const RESTAURANT = {
  name: "Koreyaki",
  fullName: "Koreyaki — Authentic Korean Restaurant",
  cuisine: "Korean Restaurant",
  tagline: "Authentic Korean Flavours",
  description:
    "Experience the true taste of Korea at Koreyaki. From sizzling Korean BBQ and crispy Korean fried chicken to comforting ramen, bibimbap, dumplings, and refreshing bubble tea, every dish is prepared with authentic ingredients and bold flavors.",
  phone: "+91 95918 11065",
  phoneHref: "tel:+919591811065",
  whatsapp: "919591811065",
  email: "info@koreyaki.in",
  instagram: "https://www.instagram.com/koreyaki_blr/",
  address: {
    line1: "Koreyaki",
    line2: "11th Main Road, HAL 2nd Stage, Appareddipalya",
    line3: "Indiranagar, Bengaluru, Karnataka 560008",
  },
  geo: { lat: "12.9703305", lng: "77.6361113" },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=12.9703305,77.6361113",
  hours: "Daily: 1:30 PM – 10:30 PM",
  hoursNote: "Open every day · No weekly holiday",
  timeSlots: [
    "1:30 PM",
    "2:30 PM",
    "4:30 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ],
  partySize: ["1-2 Guests", "3-4 Guests", "5-6 Guests", "7-8 Guests", "10+ Guests"],
  occasions: [
    "Casual Dining",
    "Family Gathering",
    "Friends Meet-up",
    "Birthday Celebration",
    "Date Night",
    "Group Dinner",
  ],
  siteUrl: "https://koreyaki.co",
  priceRange: "₹₹",
  googleRating: "4.1",
} as const;

export const FAQS = [
  {
    question: "What type of cuisine does Koreyaki serve?",
    answer:
      "Koreyaki specializes in authentic Korean cuisine, including Korean fried chicken, ramen, bibimbap, tteokbokki, dumplings, rice bowls, and refreshing bubble tea.",
  },
  {
    question: "Where is Koreyaki located?",
    answer:
      "Koreyaki is located on 11th Main Road, HAL 2nd Stage, Appareddipalya, Indiranagar, Bengaluru, Karnataka 560008.",
  },
  {
    question: "What are Koreyaki's opening hours?",
    answer: "Koreyaki is open every day from 1:30 PM to 10:30 PM.",
  },
  {
    question: "Does Koreyaki offer vegetarian options?",
    answer:
      "Yes. Koreyaki offers a selection of vegetarian Korean dishes alongside its non-vegetarian menu. Please confirm the vegetarian status of a specific dish with the restaurant, as recipes can change.",
  },
  {
    question: "Can I reserve a table at Koreyaki?",
    answer:
      "Yes. You can contact the restaurant by phone or WhatsApp to reserve a table in advance. Walk-ins are welcome, subject to availability.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Build your order on this website, then send it to Koreyaki on WhatsApp. The kitchen confirms availability and the final payable total before preparing food. We do not collect card details on this site.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "One of the best places in Bengaluru for authentic Korean food. The ramen was rich and flavorful, and the Korean fried chicken was perfectly crispy. Highly recommended!",
    name: "Aarav Sharma",
    role: "Published on Koreyaki.co",
  },
  {
    quote:
      "The atmosphere is cozy, the staff are friendly, and the food feels genuinely authentic. We especially loved the bibimbap, dumplings, and bubble tea.",
    name: "Sneha Rao",
    role: "Published on Koreyaki.co",
  },
  {
    quote:
      "Koreyaki has become our go-to spot whenever we're craving Korean cuisine. Great portions, fresh ingredients, and consistently delicious food every visit.",
    name: "Rahul Verma",
    role: "Published on Koreyaki.co",
  },
  {
    quote:
      "A fantastic dining experience with authentic flavors and excellent service. Whether you're trying Korean food for the first time or you're already a fan, this place won't disappoint.",
    name: "Priya Nair",
    role: "Published on Koreyaki.co",
  },
] as const;

export const ABOUT = {
  sectionLabel: "Our Story",
  heading: { line1: "Authentic Korean Cuisine,", line2: "Served with Passion." },
  paragraphs: [
    "At Koreyaki, we bring the rich flavors and traditions of Korea to the heart of Indiranagar. Every dish is crafted to deliver an authentic dining experience, from comforting street-food favorites to classic Korean specialties.",
    "Our menu features everything from Korean fried chicken, ramen, bibimbap, tteokbokki, and dumplings to refreshing bubble tea and signature beverages. We use quality ingredients and traditional recipes to ensure every bite captures the true taste of Korea.",
    "Whether you're discovering Korean cuisine for the first time or you're a longtime fan, Koreyaki offers a warm, vibrant space where friends and family can gather, share great food, and create memorable moments together.",
  ],
  pillars: [
    {
      title: "Authentic Korean Recipes",
      desc: "Traditional flavors prepared with quality ingredients and classic Korean cooking techniques.",
    },
    {
      title: "Signature Specialties",
      desc: "Enjoy Korean fried chicken, ramen, bibimbap, tteokbokki, dumplings, and more.",
    },
    {
      title: "Fresh Ingredients",
      desc: "Every dish is freshly prepared to deliver bold flavors and consistent quality.",
    },
    {
      title: "Warm Hospitality",
      desc: "A welcoming dining experience where great food and exceptional service come together.",
    },
  ],
} as const;

export type ModelStatus =
  | "MODEL_READY"
  | "MODEL_PARTIAL"
  | "IMAGE_FALLBACK"
  | "MODEL_UNAVAILABLE";

export type CustomizationControl = "single" | "multi" | "stepper";

export type CatalogOption = {
  id: string;
  label: string;
  pricePaise: number;
  componentId?: string;
  defaultSelected?: boolean;
  description?: string;
};

export type CatalogGroup = {
  id: string;
  name: string;
  control: CustomizationControl;
  required: boolean;
  options: CatalogOption[];
  helper?: string;
};

export type ModelComponent = {
  id: string;
  label: string;
  role: "vessel" | "base" | "primary" | "topping" | "garnish" | "serving";
  restPosition: [number, number, number];
  explodePosition: [number, number, number];
  info: string;
  optional?: boolean;
};

export type FoodAsset = {
  status: ModelStatus;
  kind: "procedural-gltf" | "gltf-kit";
  notes?: string;
  modelUrl: string;
  previewImage: string;
  license: string;
  defaultCamera: { position: [number, number, number]; target: [number, number, number] };
  components: ModelComponent[];
  explodedReady: boolean;
  optimization: string;
};

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  basePricePaise: number;
  image: string;
  description: string;
  tags: string[];
  featured: boolean;
  available: boolean;
  quickAdd: boolean;
  composition: string[];
  dietaryNote: string;
  allergenNote: string;
  groups: CatalogGroup[];
  asset: FoodAsset;
};

export const CATEGORIES = [
  "K-Sides",
  "Bao Buns",
  "Fried Chicken",
  "Rice & Ramen",
  "Boba Tea",
] as const;

const LICENSE =
  "Original Koreyaki WebGL food models generated as multi-mesh glTF assets for this restaurant platform. Not a third-party marketplace file.";

const CAM = {
  bowl: { position: [2.4, 2.1, 2.4] as [number, number, number], target: [0, 0.35, 0] as [number, number, number] },
  plate: { position: [2.2, 1.8, 2.2] as [number, number, number], target: [0, 0.2, 0] as [number, number, number] },
  cup: { position: [1.8, 1.6, 1.8] as [number, number, number], target: [0, 0.55, 0] as [number, number, number] },
  basket: { position: [2.3, 1.9, 2.3] as [number, number, number], target: [0, 0.25, 0] as [number, number, number] },
};

function asset(
  file: string,
  preview: string,
  camera: FoodAsset["defaultCamera"],
  components: ModelComponent[],
  explodedReady: boolean,
): FoodAsset {
  return {
    status: "MODEL_READY",
    kind: "procedural-gltf",
    modelUrl: `/models/${file}`,
    previewImage: preview,
    license: LICENSE,
    defaultCamera: camera,
    components,
    explodedReady,
    optimization: "Low-poly PBR primitives, lazy-loaded, under 200k verts per dish.",
  };
}

export const MENU_ITEMS: CatalogItem[] = [
  {
    id: "korean-fried-chicken",
    slug: "korean-fried-chicken",
    name: "Korean Fried Chicken",
    category: "Fried Chicken",
    basePricePaise: 24900,
    image: "/images/menu/korean-fried-chicken.jpg",
    description:
      "Crispy Korean fried chicken coated in signature seasonings and bold house flavors.",
    tags: ["Best Seller"],
    featured: true,
    available: true,
    quickAdd: true,
    composition: ["Crispy fried chicken", "Signature seasoning coating", "Bold house flavors"],
    dietaryNote:
      "Non-vegetarian. Vegetarian alternatives are available on the wider menu — ask the restaurant to confirm a specific plate.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "korean-fried-chicken.gltf",
      "/images/menu/korean-fried-chicken.jpg",
      CAM.basket,
      [
        {
          id: "basket",
          label: "Serving basket",
          role: "serving",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.35, 0],
          info: "Wire serving basket used to present the fried chicken.",
        },
        {
          id: "chicken",
          label: "Fried chicken",
          role: "primary",
          restPosition: [0, 0.22, 0],
          explodePosition: [0, 0.55, 0],
          info: "Crispy Korean fried chicken pieces from the official menu description.",
        },
        {
          id: "seasoning",
          label: "Signature seasoning",
          role: "base",
          restPosition: [0, 0.32, 0],
          explodePosition: [0.7, 0.85, 0.15],
          info: "Signature seasoning coating and bold house flavors described on koreyaki.co.",
        },
      ],
      true,
    ),
  },
  {
    id: "kimchi-fried-rice",
    slug: "kimchi-fried-rice",
    name: "Kimchi Fried Rice",
    category: "Rice & Ramen",
    basePricePaise: 29900,
    image: "/images/menu/kimchi-fried-rice.jpg",
    description: "Traditional kimchi fried rice packed with authentic Korean flavors and spices.",
    tags: ["Popular"],
    featured: true,
    available: true,
    quickAdd: true,
    composition: ["Kimchi fried rice", "Authentic Korean spices"],
    dietaryNote:
      "Kimchi recipes sometimes include seafood. Confirm vegetarian status with the restaurant before ordering.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "kimchi-fried-rice.gltf",
      "/images/menu/kimchi-fried-rice.jpg",
      CAM.bowl,
      [
        {
          id: "bowl",
          label: "Bowl",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.4, 0],
          info: "Serving bowl for the fried rice.",
        },
        {
          id: "rice",
          label: "Kimchi fried rice",
          role: "primary",
          restPosition: [0, 0.28, 0],
          explodePosition: [0, 0.55, 0],
          info: "Traditional kimchi fried rice from the official menu.",
        },
        {
          id: "spices",
          label: "Korean spices",
          role: "garnish",
          restPosition: [0, 0.42, 0],
          explodePosition: [0.55, 0.95, 0.2],
          info: "Authentic Korean flavors and spices described on koreyaki.co.",
        },
      ],
      true,
    ),
  },
  {
    id: "korean-ramen",
    slug: "korean-ramen",
    name: "Korean Ramen",
    category: "Rice & Ramen",
    basePricePaise: 34900,
    image: "/images/menu/korean-ramen.jpg",
    description: "Rich Korean ramen served with flavorful broth and carefully selected toppings.",
    tags: ["Signature"],
    featured: true,
    available: true,
    quickAdd: false,
    composition: ["Ramen noodles", "Flavorful broth", "Carefully selected toppings"],
    dietaryNote:
      "Ask Koreyaki whether a vegetarian broth is available for this bowl. Do not assume it is vegetarian.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "korean-ramen.gltf",
      "/images/menu/korean-ramen.jpg",
      CAM.bowl,
      [
        {
          id: "bowl",
          label: "Bowl",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.45, 0],
          info: "Ramen bowl.",
        },
        {
          id: "broth",
          label: "Broth",
          role: "base",
          restPosition: [0, 0.22, 0],
          explodePosition: [0, 0.35, 0],
          info: "Flavorful Korean ramen broth from the official description.",
        },
        {
          id: "noodles",
          label: "Noodles",
          role: "primary",
          restPosition: [0, 0.28, 0],
          explodePosition: [0, 0.72, 0],
          info: "Ramen noodles served in the broth.",
        },
        {
          id: "toppings",
          label: "Toppings",
          role: "topping",
          restPosition: [0, 0.4, 0],
          explodePosition: [0.75, 1.05, 0.15],
          info: "Carefully selected toppings — the public menu does not list each topping by name.",
        },
      ],
      true,
    ),
  },
  {
    id: "bao-buns",
    slug: "bao-buns",
    name: "Bao Buns",
    category: "Bao Buns",
    basePricePaise: 29900,
    image: "/images/menu/bao-buns.jpg",
    description: "Soft steamed bao buns filled with delicious Korean-inspired fillings.",
    tags: ["Chef's Pick"],
    featured: true,
    available: true,
    quickAdd: true,
    composition: ["Steamed bao bun", "Korean-inspired filling"],
    dietaryNote:
      "Fillings are described as Korean-inspired on koreyaki.co. Confirm vegetarian or meat filling with the restaurant.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "bao-buns.gltf",
      "/images/menu/bao-buns.jpg",
      CAM.plate,
      [
        {
          id: "steamer",
          label: "Steamer",
          role: "serving",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.35, 0],
          info: "Bamboo-style steamer used to present the buns.",
        },
        {
          id: "bun",
          label: "Steamed bun",
          role: "vessel",
          restPosition: [0, 0.28, 0],
          explodePosition: [0, 0.55, 0],
          info: "Soft steamed bao bun from the official menu.",
        },
        {
          id: "filling",
          label: "Filling",
          role: "primary",
          restPosition: [0, 0.32, 0],
          explodePosition: [0.7, 0.85, 0],
          info: "Korean-inspired filling. The public menu does not name the exact filling.",
        },
      ],
      true,
    ),
  },
  {
    id: "tteokbokki",
    slug: "tteokbokki",
    name: "Tteokbokki",
    category: "K-Sides",
    basePricePaise: 24900,
    image: "/images/menu/tteokbokki.jpg",
    description: "Korean rice cakes cooked in a sweet and spicy gochujang sauce.",
    tags: ["Popular"],
    featured: true,
    available: true,
    quickAdd: true,
    composition: ["Korean rice cakes", "Sweet and spicy gochujang sauce"],
    dietaryNote:
      "Ask the restaurant to confirm whether this preparation is vegetarian.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "tteokbokki.gltf",
      "/images/menu/tteokbokki.jpg",
      CAM.bowl,
      [
        {
          id: "bowl",
          label: "Bowl",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.4, 0],
          info: "Serving bowl.",
        },
        {
          id: "sauce",
          label: "Gochujang sauce",
          role: "base",
          restPosition: [0, 0.18, 0],
          explodePosition: [0, 0.28, 0],
          info: "Sweet and spicy gochujang sauce from the official description.",
        },
        {
          id: "rice-cakes",
          label: "Rice cakes",
          role: "primary",
          restPosition: [0, 0.3, 0],
          explodePosition: [0, 0.75, 0],
          info: "Korean rice cakes (tteok).",
        },
      ],
      true,
    ),
  },
  {
    id: "dumplings",
    slug: "dumplings",
    name: "Dumplings",
    category: "K-Sides",
    basePricePaise: 22000,
    image: "/images/menu/dumplings.jpg",
    description: "Steamed dumplings served with a savory dipping sauce.",
    tags: ["Best Seller"],
    featured: true,
    available: true,
    quickAdd: true,
    composition: ["Steamed dumplings", "Savory dipping sauce"],
    dietaryNote:
      "Filling is not named on the public menu. Confirm vegetarian or meat dumplings with Koreyaki.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "dumplings.gltf",
      "/images/menu/dumplings.jpg",
      CAM.plate,
      [
        {
          id: "plate",
          label: "Plate",
          role: "serving",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.3, 0],
          info: "Serving plate.",
        },
        {
          id: "dumplings",
          label: "Steamed dumplings",
          role: "primary",
          restPosition: [0, 0.18, 0],
          explodePosition: [0, 0.55, 0],
          info: "Steamed dumplings from the official menu.",
        },
        {
          id: "sauce",
          label: "Dipping sauce",
          role: "base",
          restPosition: [0.7, 0.08, 0.15],
          explodePosition: [1.05, 0.35, 0.35],
          info: "Savory dipping sauce served with the dumplings.",
        },
      ],
      true,
    ),
  },
  {
    id: "corn-dogs",
    slug: "corn-dogs",
    name: "Corn Dogs",
    category: "K-Sides",
    basePricePaise: 22000,
    image: "/images/menu/corn-dogs.jpg",
    description: "Golden Korean-style corn dogs with a crispy outer coating.",
    tags: [],
    featured: false,
    available: true,
    quickAdd: true,
    composition: ["Korean-style corn dog", "Crispy outer coating"],
    dietaryNote:
      "Typically non-vegetarian. Confirm the filling with the restaurant if you need a vegetarian option.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "corn-dogs.gltf",
      "/images/menu/corn-dogs.jpg",
      CAM.plate,
      [
        {
          id: "stick",
          label: "Skewer",
          role: "serving",
          restPosition: [0, 0.05, 0],
          explodePosition: [0, -0.25, 0],
          info: "Serving stick.",
        },
        {
          id: "coating",
          label: "Crispy coating",
          role: "base",
          restPosition: [0, 0.55, 0],
          explodePosition: [0.55, 0.7, 0],
          info: "Crispy outer coating described on koreyaki.co.",
        },
        {
          id: "core",
          label: "Corn dog",
          role: "primary",
          restPosition: [0, 0.55, 0],
          explodePosition: [0, 0.95, 0],
          info: "Golden Korean-style corn dog.",
        },
      ],
      true,
    ),
  },
  {
    id: "kimbap",
    slug: "kimbap",
    name: "Kimbap",
    category: "Rice & Ramen",
    basePricePaise: 39900,
    image: "/images/menu/kimbap.jpg",
    description: "Fresh seaweed rice rolls filled with vegetables and signature ingredients.",
    tags: ["Signature"],
    featured: true,
    available: true,
    quickAdd: true,
    composition: ["Seaweed", "Rice", "Vegetables", "Signature ingredients"],
    dietaryNote:
      "Filled with vegetables and signature ingredients. Confirm whether a fully vegetarian roll is being served.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "kimbap.gltf",
      "/images/menu/kimbap.jpg",
      CAM.plate,
      [
        {
          id: "plate",
          label: "Plate",
          role: "serving",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.28, 0],
          info: "Serving plate.",
        },
        {
          id: "seaweed",
          label: "Seaweed",
          role: "vessel",
          restPosition: [0, 0.16, 0],
          explodePosition: [0, 0.28, 0],
          info: "Seaweed wrapper from the official description.",
        },
        {
          id: "rice",
          label: "Rice",
          role: "base",
          restPosition: [0, 0.16, 0],
          explodePosition: [0, 0.55, 0],
          info: "Rice inside the kimbap rolls.",
        },
        {
          id: "filling",
          label: "Vegetables & signature ingredients",
          role: "primary",
          restPosition: [0, 0.16, 0],
          explodePosition: [0, 0.88, 0],
          info: "Vegetables and signature ingredients. Individual filling names are not listed on the public menu.",
        },
      ],
      true,
    ),
  },
  {
    id: "katsu-ramen",
    slug: "katsu-ramen",
    name: "Katsu Ramen",
    category: "Rice & Ramen",
    basePricePaise: 41900,
    image: "/images/menu/katsu-ramen.jpg",
    description: "Hearty ramen topped with crispy katsu and rich Korean-style broth.",
    tags: ["Chef's Pick"],
    featured: true,
    available: true,
    quickAdd: false,
    composition: ["Ramen noodles", "Korean-style broth", "Crispy katsu"],
    dietaryNote:
      "Includes crispy katsu. Confirm the katsu protein with Koreyaki; do not assume a vegetarian katsu.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "katsu-ramen.gltf",
      "/images/menu/katsu-ramen.jpg",
      CAM.bowl,
      [
        {
          id: "bowl",
          label: "Bowl",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.45, 0],
          info: "Ramen bowl.",
        },
        {
          id: "broth",
          label: "Korean-style broth",
          role: "base",
          restPosition: [0, 0.22, 0],
          explodePosition: [0, 0.32, 0],
          info: "Rich Korean-style broth from the official description.",
        },
        {
          id: "noodles",
          label: "Noodles",
          role: "primary",
          restPosition: [0, 0.28, 0],
          explodePosition: [0, 0.7, 0],
          info: "Ramen noodles.",
        },
        {
          id: "katsu",
          label: "Crispy katsu",
          role: "topping",
          restPosition: [0.15, 0.42, 0.05],
          explodePosition: [0.85, 1.05, 0.2],
          info: "Crispy katsu topping described on koreyaki.co.",
        },
      ],
      true,
    ),
  },
  {
    id: "boba-tea",
    slug: "boba-tea",
    name: "Boba Tea",
    category: "Boba Tea",
    basePricePaise: 22000,
    image: "/images/menu/boba-tea.jpg",
    description: "Classic bubble tea available in a variety of refreshing flavors.",
    tags: ["Refreshing"],
    featured: true,
    available: true,
    quickAdd: false,
    composition: ["Bubble tea", "Boba pearls"],
    dietaryNote:
      "Ask Koreyaki about milk versus fruit bases if you have a dietary requirement.",
    allergenNote:
      "Flavour list is not published on koreyaki.co. Confirm ingredients and allergens with the restaurant. Do not assume a drink is allergen-free.",
    groups: [
      {
        id: "flavour-note",
        name: "Flavour preference",
        control: "single",
        required: false,
        helper:
          "The public menu states a variety of refreshing flavors without listing them. Send a preference — Koreyaki will confirm what is available today. No extra charge is published.",
        options: [
          {
            id: "chef-choice",
            label: "Kitchen’s available flavour",
            pricePaise: 0,
            defaultSelected: true,
          },
          {
            id: "ask-fruit",
            label: "Prefer a fruit flavour (confirm on WhatsApp)",
            pricePaise: 0,
          },
          {
            id: "ask-milk",
            label: "Prefer a milk-tea flavour (confirm on WhatsApp)",
            pricePaise: 0,
          },
        ],
      },
    ],
    asset: asset(
      "boba-tea.gltf",
      "/images/menu/boba-alt.jpg",
      CAM.cup,
      [
        {
          id: "cup",
          label: "Cup",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.25, 0],
          info: "Serving cup.",
        },
        {
          id: "tea",
          label: "Bubble tea",
          role: "base",
          restPosition: [0, 0.45, 0],
          explodePosition: [0, 0.55, 0],
          info: "Classic bubble tea. Specific flavours are not listed on the public menu.",
        },
        {
          id: "pearls",
          label: "Boba pearls",
          role: "primary",
          restPosition: [0, 0.12, 0],
          explodePosition: [0, 0.95, 0],
          info: "Chewy boba pearls.",
        },
      ],
      true,
    ),
  },
  {
    id: "milkshake-boba",
    slug: "milkshake-boba",
    name: "Milkshake Boba",
    category: "Boba Tea",
    basePricePaise: 23900,
    image: "/images/menu/milkshake-boba.jpg",
    description: "Creamy milkshake blended with chewy boba pearls.",
    tags: ["Popular"],
    featured: false,
    available: true,
    quickAdd: true,
    composition: ["Creamy milkshake", "Boba pearls"],
    dietaryNote: "Contains a milkshake base. Confirm dairy content with the restaurant.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "milkshake-boba.gltf",
      "/images/menu/milkshake-boba.jpg",
      CAM.cup,
      [
        {
          id: "cup",
          label: "Cup",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.25, 0],
          info: "Serving cup.",
        },
        {
          id: "shake",
          label: "Milkshake",
          role: "base",
          restPosition: [0, 0.45, 0],
          explodePosition: [0, 0.55, 0],
          info: "Creamy milkshake from the official description.",
        },
        {
          id: "pearls",
          label: "Boba pearls",
          role: "primary",
          restPosition: [0, 0.12, 0],
          explodePosition: [0, 0.95, 0],
          info: "Chewy boba pearls blended into the shake.",
        },
      ],
      true,
    ),
  },
  {
    id: "fizzy-boba",
    slug: "fizzy-boba",
    name: "Fizzy Boba",
    category: "Boba Tea",
    basePricePaise: 18000,
    image: "/images/menu/fizzy-boba.jpg",
    description: "Sparkling fruit drink with refreshing boba pearls and vibrant flavors.",
    tags: ["Signature"],
    featured: false,
    available: true,
    quickAdd: true,
    composition: ["Sparkling fruit drink", "Boba pearls"],
    dietaryNote: "Fruit-based sparkling drink. Confirm syrups and fruit with the restaurant if needed.",
    allergenNote:
      "Allergen and cross-contact information is not published item-by-item. Please ask the Koreyaki team before ordering if you have an allergy.",
    groups: [],
    asset: asset(
      "fizzy-boba.gltf",
      "/images/menu/fizzy-boba.jpg",
      CAM.cup,
      [
        {
          id: "cup",
          label: "Cup",
          role: "vessel",
          restPosition: [0, 0, 0],
          explodePosition: [0, -0.25, 0],
          info: "Serving cup.",
        },
        {
          id: "soda",
          label: "Sparkling fruit drink",
          role: "base",
          restPosition: [0, 0.45, 0],
          explodePosition: [0, 0.55, 0],
          info: "Sparkling fruit drink with vibrant flavors from the official description.",
        },
        {
          id: "pearls",
          label: "Boba pearls",
          role: "primary",
          restPosition: [0, 0.12, 0],
          explodePosition: [0, 0.95, 0],
          info: "Refreshing boba pearls.",
        },
      ],
      true,
    ),
  },
];

export const MENU_FOOTNOTE =
  "All prices subject to applicable taxes. Vegetarian and non-vegetarian options available. Allergen information available — please ask our team for assistance.";

export function formatInrFromPaise(paise: number): string {
  const rupees = Math.round(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function getItemBySlug(slug: string): CatalogItem | undefined {
  const normalized = slug.toLowerCase().trim();
  if (normalized === "kfc") return MENU_ITEMS.find((item) => item.id === "korean-fried-chicken");
  if (normalized === "ramen") return MENU_ITEMS.find((item) => item.id === "korean-ramen");
  if (normalized === "boba") return MENU_ITEMS.find((item) => item.id === "boba-tea");
  return MENU_ITEMS.find((item) => item.slug === normalized || item.id === normalized);
}

// Attach real kit models: every dish's components and status come from the registry.
for (const item of MENU_ITEMS) {
  const entry = MODEL_REGISTRY[item.id];
  if (!entry) continue;
  item.asset = {
    ...item.asset,
    status: entry.status,
    kind: "gltf-kit",
    modelUrl: `/models/kit/${entry.components[0].pieces[0].file}`,
    previewImage: item.image,
    license: KIT_LICENSE,
    notes: entry.notes,
    explodedReady: entry.components.length > 1,
    optimization:
      "Kenney Food Kit GLBs (CC0), loaded only when the dish viewer opens. One shared colour texture.",
    components: entry.components.map((c) => ({
      id: c.id,
      label: c.label,
      role: c.role,
      info: c.info,
      restPosition: [0, 0, 0] as [number, number, number],
      explodePosition: [0, 0, 0] as [number, number, number],
    })),
  };
}

export function coverageRows() {
  return MENU_ITEMS.map((item) => ({
    item: item.name,
    slug: item.slug,
    category: item.category,
    verifiedBasePrice: formatInrFromPaise(item.basePricePaise),
    image: Boolean(item.image),
    ingredientData: item.composition.length > 0 ? "From official description" : "Not published",
    model: item.asset.status,
    exploded: item.asset.explodedReady,
    customization:
      item.groups.length > 0
        ? "Configured options (no unpublished surcharge)"
        : "Quantity + kitchen note (no unpublished add-ons)",
    ordering: item.available ? "WhatsApp handoff" : "Unavailable",
  }));
}
