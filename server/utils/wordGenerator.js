/**
 * Intentional - Hidden word generator
 * 300 hidden words — simple, subtle, easy to slip into a sentence
 */

const HIDDEN_WORDS = [
  "banana", "triangle", "velvet", "glacier", "spark", "tunnel", "marble",
  "compass", "shadow", "feather", "crystal", "anchor", "breeze", "ember",
  "lantern", "meadow", "puzzle", "ribbon", "sunset", "whistle", "blossom",
  "comet", "dagger", "falcon", "garden", "harbor", "island", "jasmine",
  "kettle", "lemon", "mirror", "nectar", "orchid", "pepper", "quartz",
  "raven", "silver", "thunder", "violet", "walnut", "bamboo", "candle",
  "desert", "eclipse", "forest", "goblet", "hatchet", "ivory", "jungle",
  "kernel", "liberty", "magnet", "nimble", "oxygen", "palace", "quiver",
  "rescue", "saddle", "temple", "urchin", "voyage", "willow", "zenith",
  "alpine", "beacon", "canyon", "dragon", "engine", "fossil", "galaxy",
  "hollow", "ignite", "jackal", "knight", "lagoon", "mystic", "nebula",
  "oracle", "pirate", "rattle", "scarlet", "timber", "unicorn", "vertex",
  "waffle", "zigzag", "apricot", "blanket", "cabinet", "diamond", "elastic",
  "flannel", "granite", "harvest", "impulse", "journal", "koala", "license",
  "monsoon", "nucleus", "octagon", "pilgrim", "quantum", "replica", "scatter",
  "topaz", "umbrella", "vanilla", "wander", "yellow", "zipper", "acrobat",
  "buffalo", "cactus", "dolphin", "express", "gadget", "horizon", "insect",
  "jubilee", "kingdom", "leopard", "mustard", "napkin", "olive", "parrot",
  "racquet", "salmon", "tornado", "village", "wizard", "anchor", "basket",
  "carpet", "donkey", "emerald", "fiddle", "geyser", "helmet", "iceberg",
  "juggler", "kitten", "ladder", "mermaid", "noodle", "oyster", "penguin",
  "riddle", "satchel", "ticket", "vessel", "window", "yogurt", "arctic",
  "bonfire", "cherry", "drizzle", "furnace", "gorilla", "hammock", "jigsaw",
  "lanyard", "mango", "needle", "peacock", "quicksand", "ridgeline", "squirrel",
  "thimble", "vintage", "wreath", "biscuit", "caramel", "dandelion", "falcon",
  "goblin", "hubcap", "javelin", "kindling", "lullaby", "mitten", "nutmeg",
  "octopus", "pebble", "railway", "sandcastle", "tangerine", "umbrella",
  "volcano", "windmill", "almond", "blizzard", "clover", "dewdrop", "evergreen",
  "firefly", "gazelle", "horseshoe", "icicle", "jackpot", "kaleidoscope",
  "lighthouse", "marshmallow", "nightingale", "oatmeal", "pinecone", "quail",
  "rosemary", "starfish", "trapeze", "velveteen", "waterfall", "acorn",
  "buttercup", "cinnamon", "drumstick", "eggplant", "foxglove", "gargoyle",
  "hemlock", "inkwell", "jellybean", "keystone", "lilac", "moonbeam",
  "nutshell", "origami", "panther", "quicksilver", "raindrop", "sapphire",
  "tadpole", "undertow", "vineyard", "whirlpool", "blanket", "cardinal",
  "driftwood", "footprint", "goldfinch", "harpoon", "ironclad", "jackrabbit",
  "keepsake", "lobster", "mushroom", "nocturnal", "overcoat", "pumpkin",
  "remnant", "seashell", "twilight", "upholster", "valiant", "woodpecker",
  "absolute", "barnacle", "cocoon", "domino", "eclipse", "flamingo",
  "grizzly", "hibiscus", "impala", "jasper", "ketchup", "lavender",
  "mackerel", "neutron", "obsidian", "porcelain", "rampart", "saffron",
  "tapestry", "utensil", "viaduct", "warbler", "capsule", "dynasty",
  "figment", "gondola", "hydrant", "jackknife", "kinetic", "lattice"
];

/**
 * Get a random hidden word, optionally excluding previously used words
 * @param {string[]} exclude - Array of words to exclude
 * @returns {string} A random hidden word
 */
function getRandomWord(exclude = []) {
  const available = HIDDEN_WORDS.filter(w => !exclude.includes(w));
  if (available.length === 0) return HIDDEN_WORDS[Math.floor(Math.random() * HIDDEN_WORDS.length)];
  return available[Math.floor(Math.random() * available.length)];
}

module.exports = { HIDDEN_WORDS, getRandomWord };
