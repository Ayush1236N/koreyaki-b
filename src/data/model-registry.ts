import type { ModelStatus } from "@/data/catalog";

/**
 * 3D asset registry for Koreyaki dishes.
 *
 * Every piece points at a real GLB file in /public/models/kit (Kenney Food Kit, CC0).
 * Where the kit has no exact match for a menu ingredient, the piece is a stand-in and
 * the dish is marked MODEL_PARTIAL with a note explaining what is approximated.
 * Nothing here is invented: if a node is missing from a file, the viewer skips it and logs a warning.
 */

export type KitRole = "vessel" | "base" | "primary" | "topping" | "garnish" | "serving";

export type KitPiece = {
  /** GLB file name inside /public/models/kit */
  file: string;
  /** glTF node name inside that file */
  node: string;
  /** which match to use when the node name occurs more than once (default 0) */
  index?: number;
  /** descendant node names to leave out of this piece (they belong to another component) */
  exclude?: string[];
  /** how many copies to place around the piece (e.g. several rolls or dumplings) */
  copies?: number;
};

export type KitComponent = {
  id: string;
  label: string;
  role: KitRole;
  info: string;
  pieces: KitPiece[];
};

export type KitEntry = {
  status: ModelStatus;
  notes: string;
  components: KitComponent[];
};

export const KIT_LICENSE =
  "Kenney Food Kit — CC0 1.0 Universal (public domain). No attribution required. Source: https://kenney.nl/assets/food-kit";

const ramenComponents = (extra: KitComponent[]): KitComponent[] => [
  {
    id: "bowl",
    label: "Ramen bowl",
    role: "vessel",
    info: "Ceramic ramen bowl from the CC0 kit. Holds the broth.",
    pieces: [{ file: "bowl-broth.glb", node: "bowl-broth", exclude: ["Group"] }],
  },
  {
    id: "broth",
    label: "Broth & noodles",
    role: "base",
    info: "Broth and noodles are one mesh in the kit, so they are shown together and not separated.",
    pieces: [{ file: "bowl-broth.glb", node: "Group" }],
  },
  ...extra,
  {
    id: "chopsticks",
    label: "Chopsticks",
    role: "serving",
    info: "Chopsticks served with the bowl.",
    pieces: [{ file: "chopstick.glb", node: "chopstick" }],
  },
];

export const MODEL_REGISTRY: Record<string, KitEntry> = {
  "korean-fried-chicken": {
    status: "MODEL_PARTIAL",
    notes:
      "Plate and cooked-meat pieces come from the CC0 kit. The kit has no fried-chicken or sauce mesh, so the seasoning layer is not modelled.",
    components: [
      {
        id: "plate",
        label: "Serving plate",
        role: "serving",
        info: "Serving plate from the kit, standing in for the basket the chicken is served in.",
        pieces: [{ file: "plate-dinner.glb", node: "plate-dinner" }],
      },
      {
        id: "chicken",
        label: "Fried chicken pieces",
        role: "primary",
        info: "Crispy Korean fried chicken from the official menu. Shape is a generic cooked-meat model.",
        pieces: [{ file: "meat-cooked.glb", node: "meat-cooked", copies: 4 }],
      },
    ],
  },

  "kimbap": {
    status: "MODEL_READY",
    notes:
      "Seaweed rice rolls and plate from the CC0 kit. Individual filling colours are not modelled.",
    components: [
      {
        id: "plate",
        label: "Serving plate",
        role: "serving",
        info: "Serving plate for the rolls.",
        pieces: [{ file: "plate.glb", node: "plate" }],
      },
      {
        id: "rolls",
        label: "Kimbap rolls",
        role: "primary",
        info: "Kimbap: seaweed rice rolls with vegetables and signature ingredients, as described on koreyaki.co.",
        pieces: [{ file: "maki-vegetable.glb", node: "maki-vegetable", copies: 4 }],
      },
    ],
  },

  "dumplings": {
    status: "MODEL_READY",
    notes:
      "Bamboo steamer (lid and three tiers) with steamed dumplings, all from the CC0 kit. Dipping sauce is not modelled.",
    components: [
      {
        id: "lid",
        label: "Steamer lid",
        role: "topping",
        info: "Steamer lid, lifted off to show the dumplings.",
        pieces: [{ file: "steamer.glb", node: "lid" }],
      },
      {
        id: "steamer",
        label: "Steamer tiers",
        role: "vessel",
        info: "Bamboo-style steamer tiers that hold the dumplings.",
        pieces: [
          { file: "steamer.glb", node: "layer", index: 0 },
          { file: "steamer.glb", node: "layer", index: 1 },
          { file: "steamer.glb", node: "layer", index: 2 },
        ],
      },
      {
        id: "dumplings",
        label: "Steamed dumplings",
        role: "primary",
        info: "Steamed dumplings from the official menu.",
        pieces: [{ file: "dim-sum.glb", node: "dim-sum", copies: 5 }],
      },
    ],
  },

  "bao-buns": {
    status: "MODEL_PARTIAL",
    notes:
      "Steamer tiers come from the CC0 kit. Bao buns are stood in by round kit buns, so the fillings are not modelled.",
    components: [
      {
        id: "lid",
        label: "Steamer lid",
        role: "topping",
        info: "Steamer lid from the kit.",
        pieces: [{ file: "steamer.glb", node: "lid" }],
      },
      {
        id: "steamer",
        label: "Steamer tiers",
        role: "vessel",
        info: "Steamer tiers from the kit that hold the buns.",
        pieces: [
          { file: "steamer.glb", node: "layer", index: 0 },
          { file: "steamer.glb", node: "layer", index: 1 },
          { file: "steamer.glb", node: "layer", index: 2 },
        ],
      },
      {
        id: "buns",
        label: "Steamed bao buns (stand-in)",
        role: "primary",
        info: "Soft steamed bao bun from the official menu. The kit model is a generic round bun.",
        pieces: [{ file: "rice-ball.glb", node: "rice-ball", copies: 3 }],
      },
    ],
  },

  "tteokbokki": {
    status: "MODEL_PARTIAL",
    notes:
      "Bowl from the CC0 kit. Rice cakes are stood in by tubular kit pieces, and the gochujang sauce is not modelled separately.",
    components: [
      {
        id: "bowl",
        label: "Sauce bowl",
        role: "vessel",
        info: "Bowl holding the sweet and spicy gochujang sauce.",
        pieces: [{ file: "bowl-soup.glb", node: "bowl-soup" }],
      },
      {
        id: "rice-cakes",
        label: "Rice cakes (stand-in)",
        role: "primary",
        info: "Korean rice cakes cooked in gochujang sauce. The kit model is a tubular stand-in.",
        pieces: [{ file: "sausage.glb", node: "sausage", copies: 5 }],
      },
    ],
  },

  "corn-dogs": {
    status: "MODEL_PARTIAL",
    notes:
      "Corn dog model from the CC0 kit, split into its two child parts. The split follows the kit's node structure, not a verified recipe breakdown.",
    components: [
      {
        id: "coating",
        label: "Crispy coating",
        role: "base",
        info: "Golden crispy outer coating, as described on koreyaki.co.",
        pieces: [{ file: "corn-dog.glb", node: "corn-dog", exclude: ["dog"] }],
      },
      {
        id: "core",
        label: "Corn dog core",
        role: "primary",
        info: "Core of the Korean-style corn dog.",
        pieces: [{ file: "corn-dog.glb", node: "dog" }],
      },
    ],
  },

  "kimchi-fried-rice": {
    status: "MODEL_PARTIAL",
    notes:
      "Bowl, rice mound and fried egg from the CC0 kit. Kimchi pieces are not modelled as separate meshes.",
    components: [
      {
        id: "bowl",
        label: "Bowl",
        role: "vessel",
        info: "Bowl the kimchi fried rice is served in.",
        pieces: [{ file: "bowl-cereal.glb", node: "bowl-cereal" }],
      },
      {
        id: "rice",
        label: "Fried rice",
        role: "primary",
        info: "Traditional kimchi fried rice. The kit model is a rice mound.",
        pieces: [{ file: "rice-ball.glb", node: "rice-ball" }],
      },
      {
        id: "egg",
        label: "Fried egg",
        role: "garnish",
        info: "Egg on top of the fried rice.",
        pieces: [{ file: "egg-cooked.glb", node: "egg-cooked" }],
      },
    ],
  },

  "korean-ramen": {
    status: "MODEL_PARTIAL",
    notes:
      "Bowl, egg and chopsticks from the CC0 kit. Broth and noodles are a single kit mesh, so the noodles cannot be separated from the broth.",
    components: ramenComponents([
      {
        id: "egg",
        label: "Soft egg",
        role: "garnish",
        info: "Egg topping. The official menu does not list each topping, so this is shown as an egg.",
        pieces: [{ file: "egg-half.glb", node: "egg-half" }],
      },
    ]),
  },

  "katsu-ramen": {
    status: "MODEL_PARTIAL",
    notes:
      "Bowl, broth group and chopsticks from the CC0 kit. The katsu cutlet is stood in by a cooked-meat piece, and noodles are not separated from the broth.",
    components: ramenComponents([
      {
        id: "katsu",
        label: "Crispy katsu (stand-in)",
        role: "topping",
        info: "Crispy katsu topping from the official description. The kit model is a generic cooked-meat piece.",
        pieces: [{ file: "meat-cooked.glb", node: "meat-cooked" }],
      },
      {
        id: "egg",
        label: "Soft egg",
        role: "garnish",
        info: "Egg topping shown as a kit egg.",
        pieces: [{ file: "egg-half.glb", node: "egg-half" }],
      },
    ]),
  },

  "boba-tea": {
    status: "MODEL_PARTIAL",
    notes:
      "Cup and straw from the CC0 kit. Boba pearls are not in the kit, so the pearls layer is not modelled.",
    components: [
      {
        id: "cup",
        label: "Tea cup",
        role: "vessel",
        info: "Cup for the bubble tea.",
        pieces: [{ file: "cup-tea.glb", node: "cup-tea" }],
      },
      {
        id: "straw",
        label: "Straw",
        role: "topping",
        info: "Straw for the bubble tea.",
        pieces: [{ file: "soda-glass.glb", node: "straw" }],
      },
    ],
  },

  "milkshake-boba": {
    status: "MODEL_PARTIAL",
    notes:
      "Frappé cup, whipped cream and straw from the CC0 kit. Boba pearls are not in the kit, so they are not modelled.",
    components: [
      {
        id: "cup",
        label: "Milkshake cup",
        role: "vessel",
        info: "Cup holding the creamy milkshake.",
        pieces: [{ file: "frappe.glb", node: "frappe" }],
      },
      {
        id: "cream",
        label: "Whipped cream",
        role: "garnish",
        info: "Whipped cream topping.",
        pieces: [{ file: "whipped-cream.glb", node: "whipped-cream" }],
      },
      {
        id: "straw",
        label: "Straw",
        role: "topping",
        info: "Straw for the milkshake.",
        pieces: [{ file: "soda-glass.glb", node: "straw" }],
      },
    ],
  },

  "fizzy-boba": {
    status: "MODEL_PARTIAL",
    notes:
      "Glass, straw and lemon garnish from the CC0 kit. Boba pearls are not in the kit, and the lemon is a stand-in for the fruit garnish.",
    components: [
      {
        id: "glass",
        label: "Sparkling drink glass",
        role: "base",
        info: "Glass holding the sparkling fruit drink.",
        pieces: [{ file: "soda-glass.glb", node: "soda-glass", exclude: ["straw", "lemon"] }],
      },
      {
        id: "straw",
        label: "Straw",
        role: "topping",
        info: "Straw for the sparkling drink.",
        pieces: [{ file: "soda-glass.glb", node: "straw" }],
      },
      {
        id: "lemon",
        label: "Fruit garnish (stand-in)",
        role: "garnish",
        info: "Fruit garnish. The kit model is a lemon.",
        pieces: [{ file: "soda-glass.glb", node: "lemon" }],
      },
    ],
  },
};
