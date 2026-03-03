/**
 * Intentional - Product Generator
 *
 * Uses Gemini AI to dynamically generate realistic products.
 * Falls back to a curated static catalog if Gemini is unavailable.
 * Supports pre-generation to minimize player wait time.
 */

import { generateFullProduct } from './geminiService';

/* ═══════════════════════════════════════════════════════
   FALLBACK STATIC CATALOG (used when Gemini is down)
   50 realistic Amazon-style products
   ═══════════════════════════════════════════════════════ */

const FALLBACK_CATALOG = [
  {
    name: "ThermoGrip Stainless Steel Travel Mug",
    category: "Kitchen",
    description: "Double-wall vacuum insulated 20oz travel mug that keeps drinks hot for 8 hours or cold for 12. Leak-proof lid with one-hand operation and non-slip silicone base.",
    price: "$24.99", rating: 4.6, reviews: 8742,
    words: ["coffee", "morning", "steam", "ceramic", "espresso", "latte", "cream", "sugar", "brew", "roast", "filter", "thermos", "sip", "handle", "stainless"],
  },
  {
    name: "PawPerfect Self-Cleaning Slicker Brush",
    category: "Pets",
    description: "Gently removes loose fur, tangles, and knots with retractable bristles that clean with one click. Ergonomic grip designed for daily grooming of all coat types.",
    price: "$16.99", rating: 4.4, reviews: 5231,
    words: ["puppy", "kitten", "fur", "grooming", "collar", "leash", "treat", "belly", "paw", "tail", "shedding", "brush", "gentle", "soft", "coat"],
  },
  {
    name: "LumiGlow Sunset Table Lamp",
    category: "Home",
    description: "Ambient LED lamp that simulates golden hour sunset with 16 warm color modes. Touch-controlled brightness with USB-C charging. Perfect nightstand or desk companion.",
    price: "$34.99", rating: 4.5, reviews: 3187,
    words: ["shadow", "glow", "candle", "bulb", "lantern", "curtain", "dimmer", "cozy", "evening", "warm", "amber", "flicker", "bedside", "mood", "light"],
  },
  {
    name: "QuickSlice Mandoline Slicer Set",
    category: "Kitchen",
    description: "Professional-grade vegetable slicer with 5 interchangeable blades and safety hand guard. BPA-free, dishwasher safe. Julienne, waffle cut, and thin slice options included.",
    price: "$29.99", rating: 4.3, reviews: 6120,
    words: ["tomato", "onion", "cucumber", "carrot", "pepper", "salad", "knife", "cutting", "kitchen", "recipe", "dinner", "crispy", "fresh", "vegetable", "chop"],
  },
  {
    name: "ZenCloud Memory Foam Pillow",
    category: "Wellness",
    description: "Contoured cervical support pillow with cooling gel layer and breathable bamboo cover. Adjustable loft with removable filling. Machine washable cover included.",
    price: "$39.99", rating: 4.4, reviews: 11234,
    words: ["sleep", "pillow", "blanket", "mattress", "dream", "cozy", "cotton", "linen", "rest", "calm", "feather", "snooze", "comfort", "soft", "cloud"],
  },
  {
    name: "TrailBlazer 40L Hiking Backpack",
    category: "Outdoor",
    description: "Lightweight yet durable ripstop nylon daypack with integrated rain cover, hydration sleeve, and ventilated mesh back panel. Multiple compartments for organized packing.",
    price: "$54.99", rating: 4.5, reviews: 4567,
    words: ["trail", "summit", "compass", "campfire", "mountain", "valley", "creek", "pine", "boulder", "ridge", "tent", "hiking", "altitude", "wilderness", "forest"],
  },
  {
    name: "ProType Wireless Mechanical Keyboard",
    category: "Tech",
    description: "Hot-swappable mechanical switches with Bluetooth 5.0 and USB-C connectivity. RGB backlight, 75% compact layout, and 4000mAh battery lasting up to 200 hours.",
    price: "$69.99", rating: 4.6, reviews: 7823,
    words: ["typing", "keyboard", "mouse", "screen", "desktop", "laptop", "cursor", "click", "scroll", "cable", "battery", "wireless", "switch", "button", "digital"],
  },
  {
    name: "FreshSeal Vacuum Food Container Set",
    category: "Kitchen",
    description: "5-piece airtight container set with one-touch vacuum pump lid. Crystal-clear BPA-free plastic, microwave and dishwasher safe. Stackable design saves counter space.",
    price: "$32.99", rating: 4.2, reviews: 3456,
    words: ["lunch", "leftovers", "fridge", "pantry", "fresh", "storage", "seal", "container", "snack", "meal", "prep", "stack", "pour", "freeze", "thaw"],
  },
  {
    name: "GlideRite Ceramic Hair Straightener",
    category: "Fashion",
    description: "Tourmaline ceramic plates heat to 450°F in 30 seconds with adjustable temperature dial. Anti-frizz ionic technology, dual voltage for travel, and 360° swivel cord.",
    price: "$44.99", rating: 4.3, reviews: 9876,
    words: ["hair", "curl", "braid", "comb", "strand", "mirror", "brush", "style", "sleek", "smooth", "shine", "salon", "heat", "clip", "volume"],
  },
  {
    name: "AquaPure Filtered Shower Head",
    category: "Bathroom",
    description: "15-stage filtration system removes chlorine, heavy metals, and impurities. 3 spray modes with water-saving design that reduces usage by 30% without losing pressure.",
    price: "$27.99", rating: 4.4, reviews: 5678,
    words: ["shower", "steam", "towel", "lather", "rinse", "splash", "faucet", "drain", "tile", "marble", "chrome", "spray", "filter", "clean", "refresh"],
  },
  {
    name: "NestNote Leather-Bound Journal",
    category: "Office",
    description: "Premium A5 hardcover journal with 200 pages of 120gsm cream paper. Lay-flat binding, ribbon bookmark, and inner pocket. Refillable with replacement inserts.",
    price: "$19.99", rating: 4.7, reviews: 4321,
    words: ["pen", "ink", "paper", "notebook", "writing", "margin", "page", "draft", "bookmark", "spine", "chapter", "diary", "memo", "letter", "script"],
  },
  {
    name: "SoloPod Bluetooth Earbuds Pro",
    category: "Tech",
    description: "Active noise cancellation with transparency mode, 32-hour total battery life with charging case. IPX5 sweat resistant, touch controls, and hi-res audio codec support.",
    price: "$49.99", rating: 4.5, reviews: 12543,
    words: ["music", "bass", "volume", "melody", "rhythm", "podcast", "wireless", "treble", "echo", "stereo", "beat", "sound", "listen", "audio", "noise"],
  },
  {
    name: "GreenThumb Self-Watering Herb Planter",
    category: "Garden",
    description: "Indoor herb garden kit with built-in water reservoir that keeps plants hydrated for up to 2 weeks. Includes basil, cilantro, and parsley seed pods. LED grow light included.",
    price: "$36.99", rating: 4.3, reviews: 2876,
    words: ["basil", "mint", "seed", "root", "leaf", "stem", "bloom", "soil", "garden", "planter", "water", "green", "herb", "sprout", "harvest"],
  },
  {
    name: "RoadMaster Dashboard Phone Mount",
    category: "Automotive",
    description: "Universal 360° rotating phone holder with strong suction cup base and adjustable arm. Fits all phones 4.7-7 inches. One-touch release button and cable-friendly design.",
    price: "$15.99", rating: 4.2, reviews: 8765,
    words: ["dashboard", "steering", "mirror", "windshield", "parking", "brake", "highway", "cruise", "bumper", "garage", "engine", "tire", "fuel", "seatbelt", "drive"],
  },
  {
    name: "CozyKnit Chunky Throw Blanket",
    category: "Home",
    description: "Handwoven chenille throw in a gorgeous chunky knit pattern. 50x60 inches, machine washable, and incredibly soft. Available in 12 color options to match any decor.",
    price: "$42.99", rating: 4.6, reviews: 6789,
    words: ["blanket", "cozy", "sofa", "cushion", "velvet", "flannel", "fleece", "warm", "winter", "pillow", "knit", "stitch", "fabric", "cotton", "wool"],
  },
  {
    name: "FlexFit Resistance Band Set",
    category: "Sports",
    description: "5 color-coded latex resistance bands from light to extra heavy. Includes door anchor, ankle straps, and carry bag. Perfect for home workouts, physical therapy, and stretching.",
    price: "$22.99", rating: 4.4, reviews: 15234,
    words: ["stretch", "muscle", "workout", "exercise", "fitness", "strength", "flex", "band", "gym", "squat", "lunge", "plank", "sweat", "rep", "tone"],
  },
  {
    name: "Artistry Premium Watercolor Set",
    category: "Art",
    description: "36 vibrant pan watercolors in a portable tin case with built-in mixing palette. Professional-grade pigments, lightfast and blendable. Includes 2 travel brushes.",
    price: "$28.99", rating: 4.5, reviews: 3456,
    words: ["brush", "canvas", "pigment", "palette", "stroke", "blend", "wash", "shade", "tint", "color", "sketch", "paint", "easel", "watercolor", "portrait"],
  },
  {
    name: "TinyTunes Musical Baby Mobile",
    category: "Baby",
    description: "Rotating crib mobile with 12 soothing melodies and a nightlight projector. Soft plush animals detach for independent play. Timer with 15/30/60 minute auto-off.",
    price: "$31.99", rating: 4.3, reviews: 4567,
    words: ["lullaby", "cradle", "rattle", "nursery", "crib", "teddy", "blanket", "pacifier", "mobile", "bottle", "soft", "gentle", "diaper", "giggle", "cuddle"],
  },
  {
    name: "StageReady XLR Microphone",
    category: "Music",
    description: "Cardioid dynamic microphone with rugged metal body and internal shock mount. Low handling noise, wide frequency response, and includes 15ft XLR cable and desk stand.",
    price: "$39.99", rating: 4.4, reviews: 5678,
    words: ["melody", "chord", "rhythm", "tempo", "bass", "treble", "vocal", "guitar", "drum", "piano", "stage", "concert", "amplifier", "recording", "studio"],
  },
  {
    name: "SnapFrame Magnetic Picture Frame Set",
    category: "Home",
    description: "Set of 6 sleek magnetic frames in assorted sizes (4x6 to 8x10). Easy front-loading design, wall mount hardware included. Black matte finish complements any room.",
    price: "$26.99", rating: 4.5, reviews: 3210,
    words: ["photo", "memory", "frame", "wall", "gallery", "portrait", "snapshot", "album", "mount", "display", "border", "glass", "shelf", "decor", "picture"],
  },
  {
    name: "BrewMaster Pour-Over Coffee Maker",
    category: "Kitchen",
    description: "Elegant borosilicate glass carafe with stainless steel reusable filter. Brews 4 cups of rich, clean coffee. Includes measuring scoop and cleaning brush.",
    price: "$27.99", rating: 4.6, reviews: 7654,
    words: ["coffee", "brew", "filter", "roast", "bean", "grind", "espresso", "mug", "morning", "cream", "sugar", "aroma", "bold", "smooth", "drip"],
  },
  {
    name: "NightOwl Kids Astronomy Telescope",
    category: "Science",
    description: "70mm aperture refractor telescope with 2 eyepieces (20x and 40x), adjustable tripod, and smartphone adapter. Includes star map and beginner's astronomy guide.",
    price: "$59.99", rating: 4.3, reviews: 2345,
    words: ["star", "moon", "planet", "orbit", "telescope", "galaxy", "comet", "nebula", "lens", "crater", "jupiter", "saturn", "constellation", "meteor", "space"],
  },
  {
    name: "ShutterPro Camera Lens Cleaning Kit",
    category: "Photography",
    description: "Complete 9-piece kit with air blower, lens pen, microfiber cloths, sensor swabs, and cleaning solution. Works with DSLR, mirrorless, and phone cameras.",
    price: "$14.99", rating: 4.5, reviews: 8901,
    words: ["lens", "camera", "focus", "shutter", "aperture", "flash", "tripod", "zoom", "frame", "exposure", "portrait", "landscape", "filter", "sensor", "capture"],
  },
  {
    name: "WanderLux Packing Cube Set",
    category: "Travel",
    description: "6-piece compression packing cubes in 3 sizes with double zipper and mesh panel. Lightweight ripstop nylon saves up to 60% suitcase space. Includes shoe bag.",
    price: "$21.99", rating: 4.4, reviews: 11234,
    words: ["suitcase", "passport", "luggage", "boarding", "terminal", "flight", "hotel", "souvenir", "customs", "currency", "journey", "vacation", "compass", "ticket", "map"],
  },
  {
    name: "PixelForge RGB Gaming Mouse",
    category: "Gaming",
    description: "Lightweight honeycomb shell with 26000 DPI optical sensor, 6 programmable buttons, and onboard memory for profiles. Paracord cable and PTFE glide feet included.",
    price: "$44.99", rating: 4.5, reviews: 6789,
    words: ["pixel", "render", "click", "scroll", "cursor", "respawn", "combo", "loot", "quest", "boss", "guild", "stream", "headshot", "clutch", "leaderboard"],
  },
  {
    name: "BambooBliss Cutting Board Set",
    category: "Kitchen",
    description: "Set of 3 organic bamboo cutting boards with juice groove and non-slip edges. Naturally antimicrobial, knife-friendly surface. Includes small, medium, and large sizes.",
    price: "$24.99", rating: 4.5, reviews: 9012,
    words: ["knife", "chop", "slice", "cutting", "bamboo", "kitchen", "recipe", "dinner", "meal", "prep", "board", "wooden", "surface", "durable", "cook"],
  },
  {
    name: "CloudStep Orthopedic Insoles",
    category: "Wellness",
    description: "Medical-grade arch support insoles with deep heel cup and shock-absorbing gel. Fits most shoe types, trimmable to size. Relieves plantar fasciitis and flat foot pain.",
    price: "$19.99", rating: 4.3, reviews: 13456,
    words: ["foot", "arch", "heel", "cushion", "comfort", "walking", "support", "sole", "ankle", "stride", "step", "balance", "posture", "relief", "ortho"],
  },
  {
    name: "LittleChef Wooden Play Kitchen Set",
    category: "Toys",
    description: "12-piece pretend play kitchen set with wooden pots, pans, utensils, and food items. Non-toxic water-based paint, smooth rounded edges. Includes storage crate.",
    price: "$28.99", rating: 4.6, reviews: 3456,
    words: ["pretend", "wooden", "kitchen", "spoon", "plate", "pan", "cook", "recipe", "apron", "stir", "serve", "taste", "play", "imagine", "child"],
  },
  {
    name: "EcoFresh Bamboo Toothbrush Set",
    category: "Bathroom",
    description: "Pack of 8 biodegradable bamboo toothbrushes with charcoal-infused BPA-free bristles. Individually numbered for family use. Compostable handles, plastic-free packaging.",
    price: "$11.99", rating: 4.2, reviews: 7890,
    words: ["brush", "bristle", "clean", "rinse", "paste", "mint", "enamel", "gum", "floss", "mirror", "sink", "basin", "fresh", "white", "smile"],
  },
  {
    name: "AutoGlow LED Headlight Bulbs",
    category: "Automotive",
    description: "Ultra-bright 12000 lumens LED headlight conversion kit with plug-and-play installation. 50000-hour lifespan, IP68 waterproof, 6500K cool white. Fits H11/H8/H9 sockets.",
    price: "$34.99", rating: 4.4, reviews: 5432,
    words: ["headlight", "beam", "bright", "bulb", "socket", "voltage", "wiring", "road", "night", "fog", "beam", "install", "hood", "fender", "lens"],
  },
  {
    name: "SummitGear Collapsible Water Bottle",
    category: "Outdoor",
    description: "BPA-free silicone bottle that collapses to half its size when empty. 750ml capacity, leak-proof cap with carabiner clip. Dishwasher safe, rated -40°F to 446°F.",
    price: "$14.99", rating: 4.3, reviews: 6543,
    words: ["water", "hydrate", "bottle", "hike", "trail", "camping", "creek", "stream", "thirst", "adventure", "outdoors", "nature", "canteen", "squeeze", "sip"],
  },
  {
    name: "DeskRise Adjustable Laptop Stand",
    category: "Office",
    description: "Ergonomic aluminum laptop riser with 6 height angles. Open ventilation design prevents overheating. Foldable and portable, fits laptops 10-17 inches. Non-slip pads included.",
    price: "$29.99", rating: 4.5, reviews: 8765,
    words: ["laptop", "desk", "posture", "screen", "typing", "ergonomic", "office", "stand", "aluminum", "angle", "monitor", "height", "adjust", "fold", "work"],
  },
  {
    name: "BerryBlend Smoothie Blender Bottle",
    category: "Kitchen",
    description: "Portable USB-C rechargeable personal blender with 6 stainless steel blades. Makes smoothies in 30 seconds, 18oz capacity. BPA-free Tritan plastic, dishwasher-safe cup.",
    price: "$26.99", rating: 4.2, reviews: 5432,
    words: ["smoothie", "blend", "fruit", "banana", "strawberry", "mango", "protein", "yogurt", "shake", "berry", "spinach", "juice", "vitamin", "refresh", "blend"],
  },
  {
    name: "VelvetTouch Makeup Brush Set",
    category: "Fashion",
    description: "15-piece professional makeup brush collection with synthetic vegan bristles. Includes foundation, contour, blush, eyeshadow, and blending brushes in a leather roll case.",
    price: "$24.99", rating: 4.4, reviews: 9876,
    words: ["brush", "powder", "blush", "contour", "palette", "shade", "blend", "primer", "gloss", "mascara", "liner", "brow", "foundation", "beauty", "mirror"],
  },
  {
    name: "StringMaster Acoustic Guitar Capo",
    category: "Music",
    description: "Professional-grade zinc alloy capo with silicone pad for buzz-free clamping. Spring-loaded single-hand operation. Fits acoustic, electric, and classical guitars.",
    price: "$9.99", rating: 4.6, reviews: 12345,
    words: ["guitar", "string", "chord", "fret", "strum", "pick", "acoustic", "melody", "tuning", "capo", "bridge", "neck", "solo", "riff", "harmony"],
  },
  {
    name: "FrostGuard Windshield Snow Cover",
    category: "Automotive",
    description: "Extra-thick 4-layer windshield cover with magnetic edges and mirror covers. Prevents ice, frost, and snow buildup. Universal fit for cars, trucks, and SUVs. Folds into storage pouch.",
    price: "$18.99", rating: 4.3, reviews: 7654,
    words: ["windshield", "frost", "ice", "snow", "winter", "scraper", "wiper", "cold", "freeze", "defrost", "morning", "cover", "protect", "weather", "clear"],
  },
  {
    name: "TinySprout Montessori Stacking Toy",
    category: "Baby",
    description: "Natural beechwood stacking rings with food-grade silicone pieces in soft pastel colors. Develops fine motor skills and color recognition. Ages 6 months+. CPSIA certified.",
    price: "$18.99", rating: 4.5, reviews: 4321,
    words: ["stack", "ring", "color", "wooden", "baby", "grasp", "learn", "play", "gentle", "safe", "toy", "round", "build", "toddler", "explore"],
  },
  {
    name: "ProKick Indoor Soccer Ball",
    category: "Sports",
    description: "Low-bounce felt-covered indoor soccer ball, size 5. Reduced noise for indoor play, machine-stitched panels. Great for futsal, gym class, and indoor training.",
    price: "$19.99", rating: 4.3, reviews: 3456,
    words: ["kick", "goal", "field", "dribble", "pass", "striker", "penalty", "referee", "jersey", "cleats", "halftime", "score", "corner", "defend", "match"],
  },
  {
    name: "SereneScape Essential Oil Diffuser",
    category: "Wellness",
    description: "Ultrasonic aromatherapy diffuser with 300ml tank, 7 LED color modes, and whisper-quiet operation. Auto shut-off when water runs low. Covers up to 300 sq ft.",
    price: "$24.99", rating: 4.5, reviews: 10234,
    words: ["lavender", "eucalyptus", "jasmine", "mist", "aroma", "scent", "calm", "relax", "diffuser", "essential", "steam", "breathe", "mood", "spa", "tranquil"],
  },
  {
    name: "UrbanPack Convertible Messenger Bag",
    category: "Travel",
    description: "Versatile waxed canvas bag that converts between messenger, backpack, and briefcase modes. Padded 15-inch laptop sleeve, RFID pocket, and waterproof base panel.",
    price: "$49.99", rating: 4.4, reviews: 5678,
    words: ["bag", "strap", "pocket", "zipper", "canvas", "buckle", "shoulder", "laptop", "commute", "travel", "organize", "durable", "messenger", "carry", "urban"],
  },
  {
    name: "SparkCreate 3D Printing Pen",
    category: "Toys",
    description: "Kid-safe 3D printing pen with adjustable speed, USB powered, and low-temperature PLA filament. Includes 12 color refills and stencil template booklet. Ages 8+.",
    price: "$29.99", rating: 4.2, reviews: 4567,
    words: ["create", "draw", "design", "shape", "build", "color", "plastic", "mold", "craft", "art", "imagine", "model", "sculpt", "pen", "print"],
  },
  {
    name: "GreenGuard Plant Moisture Meter",
    category: "Garden",
    description: "3-in-1 soil tester measures moisture, pH, and light levels. No battery needed. Works with indoor and outdoor plants, lawns, and gardens. Includes plant care guide.",
    price: "$12.99", rating: 4.2, reviews: 6789,
    words: ["soil", "moisture", "root", "plant", "garden", "water", "leaf", "seed", "grow", "sunshine", "fertilizer", "pot", "dirt", "compost", "green"],
  },
  {
    name: "SafeStep LED Night Light",
    category: "Home",
    description: "Motion-activated plug-in night light with adjustable brightness and warm/cool white modes. Smart dusk-to-dawn sensor, energy-efficient LED. Perfect for hallways and bathrooms.",
    price: "$12.99", rating: 4.4, reviews: 8765,
    words: ["night", "glow", "hallway", "sensor", "dark", "plug", "bedroom", "stair", "motion", "dim", "bright", "warm", "pathway", "safety", "automatic"],
  },
  {
    name: "CrystalClear Screen Protector Pack",
    category: "Tech",
    description: "3-pack tempered glass screen protectors with 9H hardness rating and oleophobic coating. Bubble-free installation frame included. Ultra-thin 0.33mm with full coverage.",
    price: "$10.99", rating: 4.3, reviews: 15678,
    words: ["screen", "glass", "phone", "crack", "protect", "clear", "thin", "touch", "install", "bubble", "surface", "scratch", "shield", "film", "display"],
  },
  {
    name: "PeakPerformance Climbing Chalk Bag",
    category: "Sports",
    description: "Drawstring chalk bag with fleece-lined interior and zippered pocket for keys. Adjustable waist belt and brush holder loop. Wide opening for easy hand access.",
    price: "$16.99", rating: 4.5, reviews: 3210,
    words: ["chalk", "grip", "climb", "boulder", "wall", "rope", "harness", "summit", "hold", "reach", "ledge", "ascend", "power", "finger", "route"],
  },
  {
    name: "SnugglePaws Calming Dog Bed",
    category: "Pets",
    description: "Donut-shaped self-warming pet bed with ultra-soft faux fur. Raised rim provides head support and security. Machine washable, non-slip bottom. Fits pets up to 45 lbs.",
    price: "$34.99", rating: 4.5, reviews: 8901,
    words: ["dog", "bed", "cozy", "warm", "furry", "nap", "puppy", "snuggle", "soft", "plush", "rest", "sleep", "donut", "calm", "pet"],
  },
  {
    name: "FocusLens Blue Light Glasses",
    category: "Office",
    description: "Lightweight TR90 frames with anti-blue light lenses that reduce eye strain during screen time. Spring hinges for comfort, clear lens with minimal color distortion.",
    price: "$17.99", rating: 4.3, reviews: 11234,
    words: ["screen", "eye", "glasses", "lens", "frame", "focus", "reading", "clear", "vision", "computer", "light", "strain", "comfort", "wear", "office"],
  },
  {
    name: "CanvasCraft Adult Paint-by-Numbers Kit",
    category: "Art",
    description: "Relaxing 16x20 inch paint-by-numbers kit with pre-printed canvas, 24 acrylic paint pots, and 3 brush sizes. Frame-ready when complete. Multiple scenic designs available.",
    price: "$16.99", rating: 4.4, reviews: 6543,
    words: ["paint", "canvas", "brush", "color", "number", "acrylic", "portrait", "frame", "create", "relax", "art", "detail", "stroke", "picture", "hobby"],
  },
];

/* ═══════════════════════════════════════════════════════
   PRE-GENERATION QUEUE
   ═══════════════════════════════════════════════════════ */

let _preGenerated = null;     // next product ready to use
let _preGenPromise = null;    // promise for in-flight generation
let _usedProductNames = [];
let _usedWordsList = [];
let _geminiAvailable = true;  // tracks if Gemini is responding
let _fallbackIndex = 0;       // cycles through fallback catalog

/**
 * Shuffle fallback catalog on first load
 */
const _shuffledFallback = [...FALLBACK_CATALOG].sort(() => Math.random() - 0.5);

/**
 * Get a fallback product from the static catalog
 */
function getFallbackProduct(exclude = []) {
  for (let i = 0; i < _shuffledFallback.length; i++) {
    const idx = (_fallbackIndex + i) % _shuffledFallback.length;
    const p = _shuffledFallback[idx];
    if (!exclude.includes(p.name)) {
      _fallbackIndex = idx + 1;
      return { ...p, imageUrl: null };
    }
  }
  // All used — reset and return any
  _fallbackIndex = 0;
  return { ..._shuffledFallback[0], imageUrl: null };
}

/**
 * Try to generate a product via Gemini, fall back to static catalog.
 * @param {string[]} usedNames
 * @returns {Promise<object>}
 */
async function generateProduct(usedNames = []) {
  if (!_geminiAvailable) {
    return getFallbackProduct(usedNames);
  }

  try {
    const product = await generateFullProduct(usedNames);
    if (product) {
      _geminiAvailable = true;
      return product;
    }
    // Gemini returned null — use fallback
    return getFallbackProduct(usedNames);
  } catch (err) {
    console.warn('[ProductGen] Gemini failed, using fallback:', err.message);
    _geminiAvailable = false;
    // Re-enable after 60s
    setTimeout(() => { _geminiAvailable = true; }, 60000);
    return getFallbackProduct(usedNames);
  }
}

/* ═══════════════════════════════════════════════════════
   PUBLIC API — matches the old sync API shape but async
   ═══════════════════════════════════════════════════════ */

/**
 * Start pre-generating the next product in the background.
 * Call this at the start of each round so the next one is ready.
 * @param {string[]} usedNames
 */
export function preGenerateNextProduct(usedNames = []) {
  if (_preGenPromise) return; // already generating

  _preGenPromise = generateProduct(usedNames)
    .then((product) => {
      _preGenerated = product;
      _preGenPromise = null;
      console.log('[ProductGen] Pre-generated:', product.name);
    })
    .catch((err) => {
      _preGenPromise = null;
      console.warn('[ProductGen] Pre-generation failed:', err.message);
    });
}

/**
 * Get the next product. Uses pre-generated if available,
 * otherwise generates on-the-fly (with loading delay).
 * @param {string[]} exclude - Product names to exclude
 * @returns {Promise<object>} Full product object
 */
export async function getRandomProduct(exclude = []) {
  // If we have a pre-generated product and it's not excluded
  if (_preGenerated && !exclude.includes(_preGenerated.name)) {
    const product = _preGenerated;
    _preGenerated = null;
    return product;
  }

  // If pre-generation is in flight, wait for it
  if (_preGenPromise) {
    await _preGenPromise;
    if (_preGenerated && !exclude.includes(_preGenerated.name)) {
      const product = _preGenerated;
      _preGenerated = null;
      return product;
    }
  }

  // Generate on the fly
  return await generateProduct(exclude);
}

/**
 * Get a random word from a product's word pool (sync).
 * @param {object} product
 * @param {string[]} exclude
 * @returns {string}
 */
export function getMatchedWord(product, exclude = []) {
  const pool = product.words || [];
  const available = pool.filter((w) => !exclude.includes(w));
  if (available.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)] || 'secret';
  }
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Reset generator state (call on new game start)
 */
export function resetGenerator() {
  _preGenerated = null;
  _preGenPromise = null;
  _usedProductNames = [];
  _usedWordsList = [];
  _fallbackIndex = 0;
}

export { FALLBACK_CATALOG };
