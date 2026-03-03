/**
 * Intentional - Product name generator
 * 200 fictional product names for game rounds
 */

const PRODUCTS = [
  "Smart Pillow", "Gravity Shoes", "AI Toothbrush", "Invisible Umbrella",
  "Pocket Weather Machine", "Self-Stirring Mug", "Bluetooth Candle", "Solar Backpack",
  "Magnetic Socks", "Holographic Notebook", "Digital Compass Ring", "Quantum Eraser",
  "Echo Blanket", "Nano Bookmark", "Cloud Hammock", "Vapor Jacket",
  "Pixel Sunglasses", "Telepathic Earbuds", "Infinity Mirror Coaster", "Whisper Microphone",
  "Fog Machine Pen", "Crystal USB Drive", "Levitating Lamp", "Thermal Chopsticks",
  "Sonic Toothpick", "Plasma Globe Watch", "Anti-Gravity Chair", "Dream Recorder Headband",
  "Mood Ring Speaker", "Tornado Water Bottle", "Origami Laptop Stand", "Bioluminescent Sticker",
  "Teleporting Doorbell", "Inflatable Desk", "Smoke Signal Phone Case", "Chameleon Paint Roller",
  "Puzzle Lock Box", "Aroma Diffuser Keyboard", "Balloon Powered Charger", "Invisible Ink Printer",
  "Foldable Bathtub", "Gyroscope Wallet", "Rainbow Flashlight", "Magnetic Sand Timer",
  "Floating Bookshelf", "Solar Powered Fan Hat", "Noise Cancelling Scarf", "Edible Tape",
  "Self Folding Towel", "Bluetooth Chopsticks", "GPS Dog Collar", "Electric Paper Airplane",
  "Smell-O-Vision Headset", "Antigravity Popcorn Maker", "Voice Activated Curtain",
  "Temperature Changing Spoon", "Glow in the Dark Yoga Mat", "Musical Shower Head",
  "Wireless Jump Rope", "AI Powered Comb", "Robotic Dustpan", "Hover Skateboard",
  "Mood Lighting Fork", "Time Freeze Camera", "Pocket Planetarium", "Sound Wave Canvas",
  "Gravity Defying Plant Pot", "Neon Watering Can", "Digital Sundial", "Expanding Briefcase",
  "Vibrating Pen", "Echoing Picture Frame", "Collapsible Kayak", "Retractable Staircase",
  "Singing Alarm Pillow", "Bubble Wrap Phone Case", "Magnetic Fishing Rod", "Crystal Ball Speaker",
  "Dissolving Notebook", "Invisible Fence Generator", "Reflective Running Gloves",
  "Self Heating Lunch Box", "Portable Cloud Generator", "Binary Abacus", "Glowing Umbrella",
  "Kinetic Sculpture Desk Toy", "Neural Network Notepad", "Fractal Coaster Set",
  "Rotating Bookend", "Aura Reading Lamp", "Whispering Gallery Mug", "Elastic Keyboard",
  "Memory Foam Mousepad", "Transparent Toaster", "Modular Planter Box", "Reversible Blanket Fort",
  "Perpetual Motion Toy", "Steam Powered Clock", "Chromatic Tuning Fork", "Zero Gravity Pen",
  "Acoustic Wallpaper", "Biodegradable Speaker", "Prismatic Desk Lamp", "Kinetic Wind Chime",
  "Singing Bowl Alarm", "Calligraphy Robot Pen", "Thermal Bookmark", "Liquid Metal Fidget Toy",
  "Sonic Ice Cream Scoop", "Magnetic Poetry Fridge", "Portable Zen Garden", "Ambient Noise Jar",
  "Origami Lampshade", "Self Watering Cactus Pot", "Geometric Terrarium", "Bamboo Power Bank",
  "Sunrise Simulation Mug", "Infinity Cube Charger", "Nebula Projector Jar", "Handshake Simulator",
  "Digital Wind Vane", "Retro Pixel Watch", "Cosmic Dust Paperweight", "Velocity Sneakers",
  "Phase Shift Hoodie", "Quantum Coin Purse", "Nebula Backpack", "Static Shock Gloves",
  "Warp Speed Blender", "Polarity Headphones", "Graviton Belt", "Fusion Flask",
  "Photon Bookmark", "Antimatter Pencil Case", "Vortex Desk Fan", "Spectrum Glasses",
  "Cipher Lock Diary", "Tesseract Tissue Box", "Dark Matter Mug", "Pulsar Night Light",
  "Zenith Yoga Block", "Apex Trail Boots", "Summit Sleeping Bag", "Tidal Wave Surfboard",
  "Monsoon Raincoat", "Avalanche Snow Globe", "Ember Candle Holder", "Mirage Sunscreen",
  "Oasis Water Filter", "Dune Sand Art Frame", "Glacier Ice Tray", "Aurora Light Strip",
  "Typhoon Hair Dryer", "Fjord Soap Dispenser", "Mesa Plant Stand", "Reef Aquarium Lamp",
  "Caldera Hot Plate", "Canyon Echo Speaker", "Lagoon Bath Bomb", "Tundra Cooling Pad",
  "Savanna Table Runner", "Coral Desk Organizer", "Steppe Pencil Holder", "Fjord Candle",
  "Bayou Incense Burner", "Prairie Wind Spinner", "Delta Pen Holder", "Estuary Soap Dish",
  "Plateau Cutting Board", "Archipelago Coasters", "Atoll Ring Dish", "Peninsula Shelf",
  "Isthmus Bookend", "Tributary USB Hub", "Meridian Desk Clock", "Equinox Timer",
  "Solstice Lamp", "Eclipse Blindfold", "Zenith Water Bottle", "Nadir Coffee Mug",
  "Horizon Monitor Stand", "Latitude Ruler", "Longitude Tape Measure", "Compass Rose Rug",
  "Cartography Placemat", "Topography Puzzle", "Bathymetry Bath Mat", "Seismograph Art Print",
  "Barometer Bookmark", "Thermoscope Coaster", "Hygrometer Plant Stake", "Anemometer Pinwheel",
  "Pluviometer Garden Stake", "Cryogenic Cooler Bag", "Heliograph Mirror", "Astrolabe Keychain",
  "Sextant Bottle Opener", "Chronometer Wristband", "Gyroscope Ornament", "Pendulum Earrings"
];

/**
 * Get a random product name, optionally excluding previously used products
 * @param {string[]} exclude - Array of product names to exclude
 * @returns {string} A random product name
 */
function getRandomProduct(exclude = []) {
  const available = PRODUCTS.filter(p => !exclude.includes(p));
  if (available.length === 0) return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  return available[Math.floor(Math.random() * available.length)];
}

module.exports = { PRODUCTS, getRandomProduct };
