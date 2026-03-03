/**
 * Intentional - Product Catalog (categorized with descriptions + matched words)
 * Each product has a category, a description, a price, a rating, and a pool
 * of hidden words that "make sense" for that type of product.
 */

const CATALOG = [
  // ─── Kitchen & Food ─────────────────────────────────
  {
    name: "Warp Speed Blender", category: "Kitchen",
    description: "Blend your smoothies in under 3 seconds with patented vortex technology. 12-speed motor, BPA-free pitcher, and whisper-quiet operation.",
    price: "$79.99", rating: 4.3, reviews: 1247,
    words: ["banana", "mango", "strawberry", "smoothie", "blueberry", "spinach", "protein", "vanilla", "almond", "yogurt"],
  },
  {
    name: "Temperature Changing Spoon", category: "Kitchen",
    description: "This smart spoon changes color when your food is too hot. Perfect for parents feeding little ones or impatient soup lovers. Dishwasher safe.",
    price: "$14.99", rating: 4.1, reviews: 832,
    words: ["cereal", "soup", "oatmeal", "honey", "cinnamon", "sugar", "cream", "butter", "silver", "stainless"],
  },
  {
    name: "Self-Stirring Mug", category: "Kitchen",
    description: "Tired of stirring? This battery-operated mug keeps your coffee, hot chocolate, or matcha perfectly mixed. Stainless steel interior with heat-resistant handle.",
    price: "$24.99", rating: 3.9, reviews: 2103,
    words: ["coffee", "chocolate", "morning", "caramel", "frothy", "steam", "ceramic", "latte", "mocha", "espresso"],
  },
  {
    name: "Thermal Chopsticks", category: "Kitchen",
    description: "Heat-sensing chopsticks that glow when food is above 65°C. Made from food-grade titanium with silicone grip tips. Great for hot pot nights.",
    price: "$19.99", rating: 4.5, reviews: 567,
    words: ["noodle", "sushi", "bamboo", "ginger", "wasabi", "sesame", "teriyaki", "dumpling", "tofu", "broth"],
  },
  {
    name: "Transparent Toaster", category: "Kitchen",
    description: "Watch your bread turn golden through the see-through glass panels. Even toasting technology with 6 browning settings. Crumb tray included.",
    price: "$49.99", rating: 4.2, reviews: 1891,
    words: ["bread", "butter", "crispy", "golden", "breakfast", "wheat", "bagel", "crunchy", "toast", "jam"],
  },
  {
    name: "Sonic Ice Cream Scoop", category: "Kitchen",
    description: "Ultrasonic vibrations melt through even the hardest frozen ice cream. Ergonomic handle, no batteries required — powered by your grip pressure.",
    price: "$29.99", rating: 4.7, reviews: 443,
    words: ["vanilla", "chocolate", "cherry", "sprinkle", "waffle", "sundae", "caramel", "fudge", "scoop", "frozen"],
  },
  {
    name: "Mood Lighting Fork", category: "Kitchen",
    description: "LED-embedded fork that changes color based on the food's temperature. Party mode included. USB-C rechargeable. Food-safe silicone coating.",
    price: "$17.99", rating: 3.6, reviews: 289,
    words: ["pasta", "salad", "rainbow", "dinner", "candle", "glow", "sparkle", "neon", "prong", "steak"],
  },
  {
    name: "Antigravity Popcorn Maker", category: "Kitchen",
    description: "Hot air pops kernels upward into any bowl placed on top. No oil needed. Makes 12 cups in under 2 minutes. Perfect movie night companion.",
    price: "$39.99", rating: 4.4, reviews: 1456,
    words: ["butter", "kernel", "movie", "salt", "caramel", "cheese", "kettle", "snack", "crunchy", "theater"],
  },
  {
    name: "Caldera Hot Plate", category: "Kitchen",
    description: "Volcanic-inspired design with rapid induction heating. Reaches 400°F in 30 seconds. Built-in timer, auto shutoff, and lava-flow LED indicator ring.",
    price: "$59.99", rating: 4.6, reviews: 710,
    words: ["pepper", "garlic", "sizzle", "flame", "copper", "skillet", "griddle", "sear", "simmer", "smoke"],
  },
  {
    name: "Plateau Cutting Board", category: "Kitchen",
    description: "Multi-level bamboo cutting board with built-in juice grooves and collapsible food catch bins. Reversible surface — butcher block on one side, carving grooves on the other.",
    price: "$34.99", rating: 4.8, reviews: 2340,
    words: ["tomato", "onion", "knife", "parsley", "garlic", "lemon", "cilantro", "slice", "chop", "basil"],
  },

  // ─── Tech & Gadgets ─────────────────────────────────
  {
    name: "Telepathic Earbuds", category: "Tech",
    description: "AI noise-cancellation learns your preferences over time. Translates 40 languages in real-time. 8-hour battery with wireless charging case.",
    price: "$199.99", rating: 4.4, reviews: 5621,
    words: ["volume", "bass", "podcast", "rhythm", "silence", "melody", "wireless", "treble", "echo", "stereo"],
  },
  {
    name: "AI Toothbrush", category: "Tech",
    description: "Tracks brushing coverage with sensors that map your teeth. App-connected with daily reports. Pressure sensor prevents gum damage. 90-day battery.",
    price: "$89.99", rating: 4.0, reviews: 3214,
    words: ["sparkle", "minty", "bristle", "enamel", "whitening", "fluoride", "rinse", "plaque", "polish", "fresh"],
  },
  {
    name: "Holographic Notebook", category: "Tech",
    description: "Write on the e-ink surface with the included stylus — pages sync to cloud instantly. Holographic cover projects your notes in 3D. 200-page capacity.",
    price: "$129.99", rating: 4.2, reviews: 1876,
    words: ["pencil", "doodle", "margin", "sketch", "eraser", "scribble", "diagram", "pixel", "cursor", "draft"],
  },
  {
    name: "Crystal USB Drive", category: "Tech",
    description: "64GB storage encased in genuine quartz crystal. LED illuminated data indicator. Shockproof, waterproof, and looks stunning on any keychain.",
    price: "$29.99", rating: 4.3, reviews: 921,
    words: ["diamond", "sparkle", "prism", "quartz", "facet", "pendant", "gem", "glimmer", "shard", "geode"],
  },
  {
    name: "Retro Pixel Watch", category: "Tech",
    description: "8-bit pixel display meets modern smart watch. Steps, heart rate, notifications. Customizable pixel art watch faces. 5-day battery life.",
    price: "$149.99", rating: 4.6, reviews: 4532,
    words: ["arcade", "pixel", "joystick", "vintage", "sprite", "retro", "bezel", "buckle", "wrist", "strap"],
  },
  {
    name: "Quantum Eraser", category: "Tech",
    description: "Say goodbye to white-out. This electronic eraser uses targeted UV pulse to remove ink from paper without damaging the surface. Rechargeable.",
    price: "$44.99", rating: 3.8, reviews: 672,
    words: ["pencil", "mistake", "smudge", "graphite", "carbon", "streak", "rubber", "residue", "particle", "fragment"],
  },
  {
    name: "Plasma Globe Watch", category: "Tech",
    description: "Miniature plasma display on your wrist. Touch-reactive lightning arcs. Also tells time. Conversation starter guaranteed at every party.",
    price: "$69.99", rating: 4.1, reviews: 1345,
    words: ["lightning", "voltage", "spark", "current", "pulse", "static", "electron", "flicker", "coil", "glow"],
  },
  {
    name: "Dream Recorder Headband", category: "Tech",
    description: "EEG sensors capture your dream patterns. AI reconstructs dream summaries. Sleep coaching included. Comfortable fabric band with 10-hour battery.",
    price: "$249.99", rating: 3.7, reviews: 891,
    words: ["pillow", "moonlight", "whisper", "cloud", "slumber", "twilight", "blanket", "snore", "lullaby", "drift"],
  },
  {
    name: "Invisible Ink Printer", category: "Tech",
    description: "Print secret messages only visible under UV light. Works with standard A4 paper. Includes UV flashlight pen. Perfect for escape rooms and surprises.",
    price: "$119.99", rating: 4.0, reviews: 543,
    words: ["cipher", "envelope", "stamp", "riddle", "clue", "mystery", "codebook", "journal", "invisible", "decrypt"],
  },
  {
    name: "Infinity Cube Charger", category: "Tech",
    description: "Wireless charging cube that also works as a fidget toy. Qi-compatible, charges through cases up to 5mm thick. Satisfying magnetic hinges.",
    price: "$34.99", rating: 4.5, reviews: 2876,
    words: ["battery", "cable", "magnet", "socket", "adapter", "voltage", "watt", "circuit", "copper", "lithium"],
  },

  // ─── Outdoor & Sports ───────────────────────────────
  {
    name: "Gravity Shoes", category: "Outdoor",
    description: "Spring-loaded soles with adjustable bounce. Feel like walking on the moon. Three modes: walk, jog, bounce. Reflective accents for night runs.",
    price: "$159.99", rating: 4.3, reviews: 3421,
    words: ["lace", "trail", "gravel", "sprint", "rubber", "stride", "ankle", "tread", "cushion", "jogger"],
  },
  {
    name: "Hover Skateboard", category: "Outdoor",
    description: "Magnetic levitation deck glides 2 inches above any metal surface. 15 mph top speed, regenerative braking. Carrying handle doubles as kickstand.",
    price: "$499.99", rating: 4.7, reviews: 876,
    words: ["ramp", "concrete", "grind", "helmet", "kickflip", "sidewalk", "wheel", "deck", "rail", "pavement"],
  },
  {
    name: "Collapsible Kayak", category: "Outdoor",
    description: "Full-size kayak that folds into a backpack. Fits in your trunk. Origami-inspired design with rigid hull. Paddle included. 250 lb capacity.",
    price: "$349.99", rating: 4.5, reviews: 1234,
    words: ["paddle", "river", "current", "rapids", "splash", "upstream", "sandbar", "creek", "canoe", "wetsuit"],
  },
  {
    name: "Apex Trail Boots", category: "Outdoor",
    description: "Carbon-fiber reinforced hiking boots with self-lacing mechanism. Gore-Tex waterproof lining, Vibram sole, and built-in ankle support system.",
    price: "$189.99", rating: 4.8, reviews: 5432,
    words: ["summit", "boulder", "canyon", "ridge", "glacier", "cliff", "pebble", "granite", "valley", "moss"],
  },
  {
    name: "Tidal Wave Surfboard", category: "Outdoor",
    description: "GPS-enabled smart surfboard that tracks your waves, speed, and hang time. Lightweight carbon-foam core with bioluminescent edge strips for dawn patrol.",
    price: "$399.99", rating: 4.6, reviews: 654,
    words: ["coral", "salt", "riptide", "dolphin", "seagull", "driftwood", "sandcastle", "breeze", "jellyfish", "shore"],
  },
  {
    name: "GPS Dog Collar", category: "Outdoor",
    description: "Real-time GPS tracking with 500-foot range alerts. Activity monitoring, waterproof, and glows at night. App shows walking routes and play stats.",
    price: "$49.99", rating: 4.4, reviews: 7654,
    words: ["leash", "squirrel", "bark", "fetch", "kennel", "puppy", "paw", "treat", "whistle", "collar"],
  },
  {
    name: "Magnetic Fishing Rod", category: "Outdoor",
    description: "Telescoping rod with rare-earth magnet tip for treasure hunting in lakes and rivers. Also works as a regular fishing rod. Carbon fiber construction.",
    price: "$79.99", rating: 4.2, reviews: 987,
    words: ["trout", "worm", "bobber", "tackle", "sinker", "catfish", "bait", "hook", "reel", "minnow"],
  },
  {
    name: "Monsoon Raincoat", category: "Outdoor",
    description: "Triple-layer waterproof with sealed seams. Packs into its own pocket. Reflective trim, pit zips for ventilation, and a built-in rain gauge on the sleeve.",
    price: "$89.99", rating: 4.5, reviews: 3210,
    words: ["puddle", "drizzle", "thunder", "umbrella", "foggy", "overcast", "rainbow", "hail", "gust", "drench"],
  },
  {
    name: "Summit Sleeping Bag", category: "Outdoor",
    description: "Rated to -20°F with synthetic down fill. Mummy style with draft collar and hood. Compression sack included. 2.8 lbs — ultralight for alpine adventures.",
    price: "$219.99", rating: 4.7, reviews: 2109,
    words: ["campfire", "marshmallow", "starlight", "ember", "lantern", "firewood", "raccoon", "pinecone", "tent", "cocoon"],
  },
  {
    name: "Velocity Sneakers", category: "Outdoor",
    description: "Lightweight running shoes with reactive foam midsole. Knit upper adapts to your foot shape. Reflective heel strip. Available in 12 colors.",
    price: "$129.99", rating: 4.4, reviews: 8765,
    words: ["marathon", "pavement", "blister", "finish", "muscle", "sweat", "sprint", "tempo", "hurdle", "podium"],
  },

  // ─── Home & Decor ──────────────────────────────────
  {
    name: "Levitating Lamp", category: "Home",
    description: "Magnetic levitation base suspends a glowing orb in mid-air. Touch-dimming, warm to cool color temperature. Conversation piece for any living room.",
    price: "$89.99", rating: 4.6, reviews: 4321,
    words: ["shadow", "curtain", "lampshade", "flicker", "bulb", "dimmer", "filament", "candle", "glow", "lantern"],
  },
  {
    name: "Acoustic Wallpaper", category: "Home",
    description: "Sound-absorbing wallpaper in designer patterns. Reduces echo by 60%. Peel and stick application. Perfect for home studios, offices, and nurseries.",
    price: "$39.99/roll", rating: 4.3, reviews: 1567,
    words: ["plaster", "brick", "texture", "stripe", "border", "ceiling", "molding", "stencil", "panel", "fabric"],
  },
  {
    name: "Aurora Light Strip", category: "Home",
    description: "Addressable RGBIC LED strip that projects aurora borealis patterns on your wall. Music sync mode, app-controlled, and works with voice assistants.",
    price: "$44.99", rating: 4.5, reviews: 6543,
    words: ["prism", "violet", "sunset", "spectrum", "neon", "gradient", "shimmer", "twilight", "galaxy", "indigo"],
  },
  {
    name: "Singing Alarm Pillow", category: "Home",
    description: "Memory foam pillow with embedded flat speakers. Plays nature sounds or music as your alarm, getting louder until you wake. Machine washable cover.",
    price: "$54.99", rating: 4.1, reviews: 2345,
    words: ["feather", "cotton", "snooze", "mattress", "duvet", "linen", "cushion", "velvet", "flannel", "silk"],
  },
  {
    name: "Floating Bookshelf", category: "Home",
    description: "Invisible wall-mounted shelf makes your books look like they're floating. Holds up to 15 lbs. Easy 2-screw installation. Powder-coated steel.",
    price: "$24.99", rating: 4.7, reviews: 8765,
    words: ["chapter", "bookmark", "spine", "novel", "author", "fable", "library", "paperback", "fiction", "atlas"],
  },
  {
    name: "Geometric Terrarium", category: "Home",
    description: "Pentagon-shaped glass terrarium for succulents and air plants. Brass-finished metal frame. Opens from the top for watering. Looks like a gemstone.",
    price: "$32.99", rating: 4.4, reviews: 1987,
    words: ["moss", "fern", "cactus", "pebble", "orchid", "sprout", "dew", "blossom", "petal", "vine"],
  },
  {
    name: "Nebula Projector Jar", category: "Home",
    description: "Mason jar-shaped projector casts swirling nebula clouds on any surface. 8 color modes, auto-rotate, and sleep timer. USB-C powered.",
    price: "$27.99", rating: 4.3, reviews: 3456,
    words: ["comet", "constellation", "orbit", "meteor", "stardust", "cosmic", "lunar", "asteroid", "horizon", "eclipse"],
  },
  {
    name: "Origami Lampshade", category: "Home",
    description: "Flat-packed shade that folds into a stunning geometric sculpture. Tyvek material — looks like paper, lasts like plastic. 5 shapes included.",
    price: "$19.99", rating: 4.2, reviews: 1234,
    words: ["crane", "paper", "crease", "triangle", "fold", "polygon", "bamboo", "pattern", "symmetry", "tessellate"],
  },
  {
    name: "Kinetic Wind Chime", category: "Home",
    description: "Stainless steel arms spin in the breeze creating mesmerizing patterns. No sound — pure visual zen. Powder-coated for all-weather outdoor use.",
    price: "$49.99", rating: 4.6, reviews: 2109,
    words: ["breeze", "willow", "porch", "garden", "copper", "rustle", "patio", "swing", "dangle", "chime"],
  },
  {
    name: "Reversible Blanket Fort", category: "Home",
    description: "Pop-up blanket fort for kids: one side is a castle, flip it for a spaceship. Magnetic panels, glow-in-the-dark stars inside, collapses flat for storage.",
    price: "$69.99", rating: 4.8, reviews: 5678,
    words: ["pillow", "flashlight", "dragon", "rocket", "blanket", "fortress", "tunnel", "hideout", "drawbridge", "turret"],
  },

  // ─── Wellness & Self-care ──────────────────────────
  {
    name: "Glow in the Dark Yoga Mat", category: "Wellness",
    description: "Photoluminescent surface guides your poses in the dark. Alignment markers visible for 8+ hours. Non-slip, 6mm thick, TPE eco-friendly material.",
    price: "$59.99", rating: 4.5, reviews: 3456,
    words: ["stretch", "lotus", "incense", "meditate", "bamboo", "balance", "chakra", "breathe", "namaste", "zenith"],
  },
  {
    name: "Lagoon Bath Bomb", category: "Wellness",
    description: "Pack of 12 artisan bath bombs in ocean-inspired colors. Essential oils, coconut butter, and vitamin E. Each one dissolves into a different lagoon shade.",
    price: "$22.99", rating: 4.7, reviews: 6789,
    words: ["lavender", "bubble", "soak", "eucalyptus", "jasmine", "chamomile", "rosemary", "vanilla", "lather", "seashell"],
  },
  {
    name: "Musical Shower Head", category: "Wellness",
    description: "Bluetooth speaker built into a rainfall shower head. Waterproof, pairs with your phone. 3 spray patterns and LED temperature indicator.",
    price: "$49.99", rating: 4.2, reviews: 4321,
    words: ["lather", "shampoo", "rinse", "steam", "towel", "droplet", "faucet", "tile", "sponge", "cascade"],
  },
  {
    name: "Portable Zen Garden", category: "Wellness",
    description: "Desktop sand garden with black volcanic sand, polished stones, and a miniature bamboo rake. Magnetic base keeps everything in place. Stress relief in a box.",
    price: "$29.99", rating: 4.4, reviews: 2345,
    words: ["pebble", "sand", "tranquil", "ripple", "bamboo", "stone", "calm", "harmony", "serenity", "gravel"],
  },
  {
    name: "Aura Reading Lamp", category: "Wellness",
    description: "Infrared sensor analyzes your hand temperature and displays a corresponding color aura. Color therapy guide included. Also works as a great desk lamp.",
    price: "$44.99", rating: 3.9, reviews: 890,
    words: ["crystal", "amethyst", "topaz", "opal", "sapphire", "energy", "aura", "spectrum", "emerald", "quartz"],
  },

  // ─── Accessories & Fashion ─────────────────────────
  {
    name: "Pixel Sunglasses", category: "Fashion",
    description: "LED matrix display on the lenses — show animations, messages, or just look cool. App-controlled. Polarized when display is off. UV400 protection.",
    price: "$79.99", rating: 4.1, reviews: 2345,
    words: ["mirror", "frame", "lens", "tinted", "aviator", "visor", "glare", "shade", "bridge", "temple"],
  },
  {
    name: "Chameleon Paint Roller", category: "Fashion",
    description: "Thermochromic roller that changes the painted surface's color with temperature. Hot room? Blue wall. Cold night? Purple. Includes 3 color-shift paints.",
    price: "$34.99", rating: 4.0, reviews: 765,
    words: ["pigment", "canvas", "stroke", "palette", "swatch", "roller", "primer", "tint", "mural", "acrylic"],
  },
  {
    name: "Gyroscope Wallet", category: "Fashion",
    description: "RFID-blocking slim wallet with a built-in gyroscopic fidget spinner on the money clip. Genuine leather, 8-card capacity, and anti-theft alert.",
    price: "$39.99", rating: 4.3, reviews: 1678,
    words: ["pocket", "receipt", "leather", "buckle", "zipper", "stitch", "clasp", "suede", "wallet", "snap"],
  },
  {
    name: "Phase Shift Hoodie", category: "Fashion",
    description: "Color-shifting fabric that changes hue based on viewing angle. Heavyweight 380gsm cotton fleece, kangaroo pocket, oversized fit, ribbed cuffs.",
    price: "$74.99", rating: 4.5, reviews: 3456,
    words: ["sleeve", "zipper", "cotton", "thread", "denim", "flannel", "stitch", "collar", "cuff", "velvet"],
  },
  {
    name: "Noise Cancelling Scarf", category: "Fashion",
    description: "Cashmere-blend scarf with embedded bone-conduction speakers and ANC microphones. Take calls hands-free while staying warm. 6-hour battery.",
    price: "$99.99", rating: 4.2, reviews: 1234,
    words: ["wool", "knit", "cashmere", "fringe", "plaid", "tweed", "pashmina", "fleece", "weave", "tassel"],
  },

  // ─── Office & Productivity ─────────────────────────
  {
    name: "Inflatable Desk", category: "Office",
    description: "Full-size standing desk that inflates in 60 seconds. Built-in air pump, cable management grooves, and cup holder. Supports 50 lbs. Deflates flat for travel.",
    price: "$129.99", rating: 4.0, reviews: 876,
    words: ["stapler", "folder", "memo", "binder", "drawer", "swivel", "cubicle", "monitor", "sticky", "planner"],
  },
  {
    name: "Cipher Lock Diary", category: "Office",
    description: "Leather journal with a 4-digit mechanical combination lock. 240 acid-free pages, ribbon bookmark, inner pocket for notes. Your secrets are safe.",
    price: "$34.99", rating: 4.6, reviews: 5678,
    words: ["quill", "inkwell", "parchment", "chapter", "margin", "fountain", "calligraphy", "wax", "seal", "script"],
  },
  {
    name: "Anti-Gravity Chair", category: "Office",
    description: "Zero-gravity reclining office chair with lumbar heat, massage nodes, and memory foam headrest. Breathable mesh back, 360° swivel, and silent casters.",
    price: "$449.99", rating: 4.7, reviews: 4321,
    words: ["posture", "cushion", "armrest", "lumbar", "lever", "headrest", "recline", "backrest", "roller", "spring"],
  },
  {
    name: "Memory Foam Mousepad", category: "Office",
    description: "Ergonomic wrist rest with temperature-sensitive memory foam. Micro-textured surface for precise tracking. Anti-slip rubber base. Machine washable.",
    price: "$19.99", rating: 4.4, reviews: 7654,
    words: ["cursor", "click", "scroll", "keyboard", "trackpad", "desktop", "pixel", "pointer", "browser", "toolbar"],
  },
  {
    name: "Ambient Noise Jar", category: "Office",
    description: "Twist the lid to select from 20 ambient sound environments: rain, café, forest, ocean, fireplace. High-fidelity 360° speaker. Beautiful ceramic design.",
    price: "$59.99", rating: 4.5, reviews: 2345,
    words: ["raindrop", "thunder", "cricket", "whisper", "fountain", "breeze", "birdsong", "rustle", "crackle", "murmur"],
  },

  // ─── Travel & Adventure ────────────────────────────
  {
    name: "Solar Backpack", category: "Travel",
    description: "25L daypack with integrated flexible solar panel. Charges your phone in 3 hours of sunlight. Water-resistant, laptop sleeve, and hidden anti-theft pocket.",
    price: "$89.99", rating: 4.3, reviews: 3456,
    words: ["passport", "compass", "sunburn", "altitude", "horizon", "luggage", "terminal", "boarding", "itinerary", "souvenir"],
  },
  {
    name: "Invisible Umbrella", category: "Travel",
    description: "Air-curtain technology creates an invisible shield of air that deflects rain droplets. Battery-powered handle lasts 4 hours. Feels like magic.",
    price: "$69.99", rating: 3.8, reviews: 1234,
    words: ["puddle", "drizzle", "mist", "overcoat", "galosh", "sprinkle", "downpour", "cloudy", "slicker", "raindrop"],
  },
  {
    name: "Pocket Weather Machine", category: "Travel",
    description: "Handheld weather station: temperature, humidity, barometric pressure, UV index, wind speed, and altitude. Bluetooth syncs to your phone. Carabiner clip included.",
    price: "$59.99", rating: 4.4, reviews: 2109,
    words: ["forecast", "barometer", "drizzle", "cumulus", "breeze", "humidity", "dewpoint", "cyclone", "tornado", "gust"],
  },
  {
    name: "Tornado Water Bottle", category: "Travel",
    description: "Creates a mini vortex when shaken to mix powders and supplements. Leak-proof, double-walled insulation keeps drinks cold for 24 hours. 750ml capacity.",
    price: "$24.99", rating: 4.5, reviews: 6789,
    words: ["glacier", "spring", "filter", "hydrate", "mineral", "sparkling", "aqua", "stream", "sip", "crisp"],
  },
  {
    name: "Cryogenic Cooler Bag", category: "Travel",
    description: "Phase-change cooling inserts keep contents frozen for 72 hours without ice. Collapsible when empty. Holds 24 cans. Shoulder strap and bottle opener included.",
    price: "$79.99", rating: 4.6, reviews: 4321,
    words: ["icebox", "frost", "glacier", "arctic", "blizzard", "tundra", "icicle", "snowflake", "cooler", "penguin"],
  },

  // ─── Toys & Games ─────────────────────────────────
  {
    name: "Puzzle Lock Box", category: "Toys",
    description: "3D wooden puzzle box that only opens when you solve all 5 mechanical challenges. Hide gifts, money, or secrets inside. Handcrafted from walnut.",
    price: "$44.99", rating: 4.6, reviews: 3456,
    words: ["riddle", "maze", "clue", "jigsaw", "labyrinth", "cipher", "enigma", "padlock", "trick", "hinge"],
  },
  {
    name: "Liquid Metal Fidget Toy", category: "Toys",
    description: "Gallium-alloy blob in a sealed glass case. Melts and reforms with your body heat. Mesmerizing to watch. Desktop stress relief for adults.",
    price: "$19.99", rating: 4.3, reviews: 5678,
    words: ["mercury", "bubble", "sphere", "droplet", "wobble", "stretch", "morph", "gooey", "silicone", "marble"],
  },
  {
    name: "Electric Paper Airplane", category: "Toys",
    description: "Motor module clips onto any paper airplane for powered flight. 30-second flights, auto-circle mode, and propeller guard. USB rechargeable.",
    price: "$14.99", rating: 4.7, reviews: 8765,
    words: ["runway", "cockpit", "turbine", "altitude", "wingspan", "propeller", "glider", "hangar", "breeze", "takeoff"],
  },
  {
    name: "Perpetual Motion Toy", category: "Toys",
    description: "Elegant desk sculpture with balanced arms that swing continuously using ambient vibrations. Brass and walnut construction. Hypnotic to watch.",
    price: "$39.99", rating: 4.1, reviews: 1234,
    words: ["pendulum", "balance", "orbit", "spindle", "cradle", "Newton", "momentum", "kinetic", "gravity", "pivot"],
  },
  {
    name: "Topography Puzzle", category: "Toys",
    description: "1000-piece jigsaw puzzle of a procedurally generated mountain range. Every puzzle is unique — scan the QR code to see the 3D model of your completed landscape.",
    price: "$29.99", rating: 4.5, reviews: 2345,
    words: ["mountain", "contour", "plateau", "summit", "valley", "ridge", "terrain", "elevation", "peak", "slope"],
  },

  // ─── Pets & Animals ────────────────────────────────
  {
    name: "Mood Ring Speaker", category: "Pets",
    description: "Pet-safe Bluetooth speaker that plays calming frequencies. Mood ring LED shows your pet's stress level via ambient noise analysis. Waterproof bowl design.",
    price: "$39.99", rating: 4.2, reviews: 1234,
    words: ["kibble", "squeaky", "leash", "kennel", "whisker", "snout", "collar", "belly", "paw", "fetch"],
  },
  {
    name: "Self Watering Cactus Pot", category: "Pets",
    description: "Smart pot with reservoir that waters your cactus for up to 3 weeks. Moisture sensor LED tells you when to refill. Ceramic with drainage. Plant not included.",
    price: "$24.99", rating: 4.4, reviews: 3456,
    words: ["thorn", "desert", "succulent", "sprout", "terracotta", "root", "stem", "prickly", "aloe", "bloom"],
  },
];

/**
 * Get a random product with its full metadata
 * @param {string[]} exclude - Product names to exclude
 * @returns {{ name, category, description, price, rating, reviews, words }}
 */
export function getRandomProduct(exclude = []) {
  const available = CATALOG.filter((p) => !exclude.includes(p.name));
  if (available.length === 0) return CATALOG[Math.floor(Math.random() * CATALOG.length)];
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Get a random word from a product's word pool
 * @param {object} product - A product from CATALOG
 * @param {string[]} exclude - Words to exclude
 * @returns {string}
 */
export function getMatchedWord(product, exclude = []) {
  const pool = product.words || [];
  const available = pool.filter((w) => !exclude.includes(w));
  if (available.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return available[Math.floor(Math.random() * available.length)];
}

export { CATALOG };
export default CATALOG;
