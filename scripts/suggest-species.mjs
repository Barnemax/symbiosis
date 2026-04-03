/**
 * suggest-species.mjs
 *
 * Uses the Claude API to suggest new species that would extend the existing
 * ecological web with documented symbiosis, mutualism, or obligate alliances.
 *
 * Usage:
 *   node --env-file=.env.local suggest-species.mjs
 *
 * Requires ANTHROPIC_API_KEY in scripts/.env.local
 * Output is written to suggestions-YYYY-MM-DD.md
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Error: ANTHROPIC_API_KEY is not set in your environment.');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

// ------------------------------------------------------------------ //
// Current dataset — mirrors AppFixtures.php
// ------------------------------------------------------------------ //

const EXISTING_SPECIES = {
  birds: [
    'Garrulus glandarius (Eurasian Jay) | Corvidae',
    'Dendrocopos major (Great Spotted Woodpecker) | Picidae',
    'Loxia curvirostra (Red Crossbill) | Fringillidae',
    'Lophophanes cristatus (Crested Tit) | Paridae',
    'Parus major (Great Tit) | Paridae',
    'Oriolus oriolus (Golden Oriole) | Oriolidae',
    'Sitta europaea (Eurasian Nuthatch) | Sittidae',
    'Erithacus rubecula (European Robin) | Muscicapidae',
    'Sturnus vulgaris (Common Starling) | Sturnidae',
    'Strix aluco (Tawny Owl) | Strigidae',
    'Cyanistes caeruleus (Eurasian Blue Tit) | Paridae',
    'Phylloscopus sibilatrix (Wood Warbler) | Phylloscopidae',
    'Certhia familiaris (Eurasian Treecreeper) | Certhiidae',
    'Certhia brachydactyla (Short-toed Treecreeper) | Certhiidae',
    'Columba oenas (Stock Dove) | Columbidae',
    'Coccothraustes coccothraustes (Hawfinch) | Fringillidae',
    'Fringilla montifringilla (Brambling) | Fringillidae',
    'Turdus viscivorus (Mistle Thrush) | Turdidae',
    'Turdus merula (Common Blackbird) | Turdidae',
    'Picus viridis (European Green Woodpecker) | Picidae',
    'Bombycilla garrulus (Bohemian Waxwing) | Bombycillidae',
    'Dryocopus martius (Black Woodpecker) | Picidae',
    'Pernis apivorus (Honey Buzzard) | Accipitridae',
    'Jynx torquilla (Wryneck) | Picidae',
    'Nucifraga caryocatactes (Spotted Nutcracker) | Corvidae',
  ],
  trees: [
    'Quercus robur (Pedunculate Oak) | Fagaceae',
    'Pinus sylvestris (Scots Pine) | Pinaceae',
    'Populus nigra (Black Poplar) | Salicaceae',
    'Betula pendula (Silver Birch) | Betulaceae',
    'Fagus sylvatica (European Beech) | Fagaceae',
    'Carpinus betulus (Hornbeam) | Betulaceae',
    'Taxus baccata (Common Yew) | Taxaceae',
    'Sorbus aucuparia (Rowan) | Rosaceae',
    'Sambucus nigra (Elder) | Adoxaceae',
    'Fraxinus excelsior (European Ash) | Oleaceae',
    'Populus tremula (Aspen) | Salicaceae',
    'Viscum album (European Mistletoe) | Santalaceae',
    'Picea abies (Norway Spruce) | Pinaceae',
  ],
  fungi: [
    'Boletus edulis (Penny Bun) | Boletaceae',
    'Cantharellus cibarius (Chanterelle) | Cantharellaceae',
    'Amanita muscaria (Fly Agaric) | Amanitaceae',
    'Suillus luteus (Slippery Jack) | Suillaceae',
    'Leccinum scabrum (Brown Birch Bolete) | Boletaceae',
    'Laccaria amethystina (Amethyst Deceiver) | Hydnangiaceae',
    'Inonotus dryadeus (Oak Bracket) | Hymenochaetaceae',
    'Oudemansiella mucida (Porcelain Fungus) | Physalacriaceae',
    'Hericium erinaceus (Lion\'s Mane) | Hericiaceae',
    'Fomitopsis betulina (Birch Polypore) | Fomitopsidaceae',
    'Sparassis crispa (Cauliflower Fungus) | Sparassidaceae',
    'Auricularia auricula-judae (Jelly Ear) | Auriculariaceae',
    'Daldinia concentrica (King Alfred\'s Cakes) | Hypoxylaceae',
    'Fistulina hepatica (Beefsteak Fungus) | Fistulinaceae',
    'Laetiporus sulphureus (Chicken of the Woods) | Polyporaceae',
    'Armillaria mellea (Honey Fungus) | Physalacriaceae',
    'Paxillus involutus (Brown Rollrim) | Paxillaceae',
    'Tuber aestivum (Summer Truffle) | Tuberaceae',
    'Russula emetica (The Sickener) | Russulaceae',
    'Lactarius quietus (Oakbug Milkcap) | Russulaceae',
    'Lactarius torminosus (Woolly Milkcap) | Russulaceae',
    'Phellinus igniarius (Willow Bracket) | Hymenochaetaceae',
    'Cantharellus pallens (Pale Chanterelle) | Cantharellaceae',
    'Fomes fomentarius (Tinder Fungus) | Polyporaceae',
    'Leccinum aurantiacum (Orange Birch Bolete) | Boletaceae',
    'Phellinus tremulae (Aspen Bracket) | Hymenochaetaceae',
    'Evernia prunastri (Oakmoss Lichen) | Parmeliaceae',
    'Lactarius circellatus (Hornbeam Milkcap) | Russulaceae',
    'Cyclocybe cylindracea (Poplar Fieldcap) | Strophariaceae',
  ],
};

const EXISTING_RELATIONSHIPS = [
  'Jay → Oak: disperses_seeds_of',
  'Great Spotted Woodpecker → Oak: nests_in',
  'Great Spotted Woodpecker → Aspen: nests_in',
  'Great Spotted Woodpecker → Oak Bracket: feeds_on',
  'Great Spotted Woodpecker → Birch Polypore: feeds_on',
  'Red Crossbill → Scots Pine: feeds_on',
  'Crested Tit → Scots Pine: nests_in',
  'Great Tit → Oak: feeds_on (caterpillar phenology synchrony)',
  'Golden Oriole → Black Poplar: nests_in',
  'Golden Oriole → Oak: feeds_on',
  'Eurasian Nuthatch → Oak: feeds_on, nests_in',
  'Common Starling → Oak: nests_in',
  'Tawny Owl → Oak: nests_in',
  'Tawny Owl → European Beech: nests_in',
  'Eurasian Blue Tit → Oak: feeds_on (caterpillar phenology)',
  'Wood Warbler → European Beech: nests_in',
  'Eurasian Treecreeper → Scots Pine: feeds_on',
  'Short-toed Treecreeper → Oak: feeds_on',
  'Stock Dove → Oak: nests_in',
  'Hawfinch → Hornbeam: feeds_on (seed crushing)',
  'Brambling → European Beech: feeds_on (mast irruption)',
  'Mistle Thrush → Common Yew: feeds_on',
  'Mistle Thrush → Rowan: feeds_on',
  'Common Blackbird → Elder: disperses_seeds_of',
  'Common Blackbird → Rowan: disperses_seeds_of',
  'Penny Bun → Oak: mycorrhiza_with',
  'Chanterelle → Oak: mycorrhiza_with',
  'Fly Agaric → Oak: mycorrhiza_with',
  'Fly Agaric → Scots Pine: mycorrhiza_with',
  'Fly Agaric → Silver Birch: mycorrhiza_with',
  'Slippery Jack → Scots Pine: mycorrhiza_with',
  'Brown Birch Bolete → Silver Birch: mycorrhiza_with',
  'Amethyst Deceiver → European Beech: mycorrhiza_with',
  'Amethyst Deceiver → Oak: mycorrhiza_with',
  'Oak Bracket → Oak: grows_on (parasitic)',
  'Porcelain Fungus → European Beech: grows_on',
  'Lion\'s Mane → European Beech: grows_on',
  'Birch Polypore → Silver Birch: grows_on',
  'Brown Rollrim → Silver Birch: mycorrhiza_with',
  'Cauliflower Fungus → Scots Pine: grows_on',
  'Jelly Ear → Elder: grows_on',
  'King Alfred\'s Cakes → European Ash: grows_on',
  'Beefsteak Fungus → Oak: grows_on',
  'Chicken of the Woods → Oak: grows_on',
  'Honey Fungus → Oak: grows_on',
  'Mistle Thrush → European Mistletoe: disperses_seeds_of',
  'European Mistletoe → Black Poplar: parasitises',
  'European Mistletoe → European Ash: parasitises',
  'Summer Truffle → Hornbeam: mycorrhiza_with',
  'Summer Truffle → European Beech: mycorrhiza_with',
  'Summer Truffle → Oak: mycorrhiza_with',
  'The Sickener → Scots Pine: mycorrhiza_with',
  'The Sickener → Silver Birch: mycorrhiza_with',
  'Oakbug Milkcap → Oak: mycorrhiza_with',
  'Woolly Milkcap → Silver Birch: mycorrhiza_with',
  'Willow Bracket → Aspen: parasitises',
  'Willow Bracket → Silver Birch: grows_on',
  'Pale Chanterelle → European Beech: mycorrhiza_with',
  'Green Woodpecker → Aspen: nests_in',
  'Green Woodpecker → Black Poplar: nests_in',
  'Bohemian Waxwing → Rowan: disperses_seeds_of',
  'Bohemian Waxwing → Common Yew: disperses_seeds_of',
  'Bohemian Waxwing → Elder: feeds_on',
  'Red Crossbill → Norway Spruce: feeds_on',
  'Chanterelle → Norway Spruce: mycorrhiza_with',
  'Cauliflower Fungus → Norway Spruce: grows_on',
  'Fly Agaric → Norway Spruce: mycorrhiza_with',
  'Crested Tit → Norway Spruce: nests_in',
  'Tinder Fungus → European Beech: parasitises',
  'Tinder Fungus → Silver Birch: parasitises',
  'Tinder Fungus → Aspen: grows_on',
  'Black Woodpecker → European Beech: nests_in',
  'Black Woodpecker → Scots Pine: nests_in',
  'Black Woodpecker → Honey Fungus: feeds_on',
  'Black Woodpecker → Tinder Fungus: symbiosis_with',
  'Orange Birch Bolete → Aspen: mycorrhiza_with',
  'Orange Birch Bolete → Black Poplar: mycorrhiza_with',
  'Honey Buzzard → European Beech: nests_in',
  'Honey Buzzard → Pedunculate Oak: nests_in',
  'Honey Buzzard → Black Woodpecker: symbiosis_with',
  'Wryneck → Aspen: nests_in',
  'Wryneck → Pedunculate Oak: nests_in',
  'Wryneck → Great Spotted Woodpecker: symbiosis_with',
  'Spotted Nutcracker → Norway Spruce: disperses_seeds_of',
  'Spotted Nutcracker → Norway Spruce: feeds_on',
  'Spotted Nutcracker → Scots Pine: feeds_on',
  'Aspen Bracket → Aspen: parasitises',
  'Black Woodpecker → Aspen Bracket: symbiosis_with',
  'Oakmoss Lichen → Pedunculate Oak: grows_on',
  'Oakmoss Lichen → European Ash: grows_on',
  'Oakmoss Lichen → Rowan: grows_on',
  'Golden Oriole → Oakmoss Lichen: symbiosis_with',
  'Hornbeam Milkcap → Hornbeam: mycorrhiza_with',
  'Poplar Fieldcap → Black Poplar: grows_on',
  'Poplar Fieldcap → Aspen: grows_on',
  'Poplar Fieldcap → Elder: grows_on',
];

// Species that were previously suggested but intentionally skipped.
// The model should not re-suggest these.
const SKIPPED_SPECIES = [
  'Kretzschmaria deusta (Brittle Cinder) | overlaps with Tinder Fungus for Beech parasite role; Ash already has King Alfred\'s Cakes',
  'Gymnosporangium cornutum (Rowan Whitebeam Rust) | heteroecious rust requiring Juniper for telial stage; ecologically incomplete without Juniper in DB',
  'Postia fragilis (Yew Powdercap) | single Yew relationship; low chain value; Yew is a peripheral node',
  'Perenniporia fraxinea (Ash Bracket) | single Ash relationship; Ash already strengthened by Oakmoss Lichen',
];

const RELATIONSHIP_TYPES = [
  'nests_in',
  'grows_on',
  'feeds_on',
  'symbiosis_with',
  'disperses_seeds_of',
  'disperses_spores_of',
  'mycorrhiza_with',
  'parasitises',
];

// ------------------------------------------------------------------ //
// Prompt
// ------------------------------------------------------------------ //

const prompt = `You are an ecologist and naturalist advising on expanding a nature encyclopedia database.

The database currently covers three kingdoms: birds, trees, and fungi — all European temperate woodland species. The focus is on **documented ecological relationships** between species, particularly symbiosis, mutualism, obligate alliances, and tight co-dependencies.

## Current species

**Birds (${EXISTING_SPECIES.birds.length}):**
${EXISTING_SPECIES.birds.map(s => `- ${s}`).join('\n')}

**Trees (${EXISTING_SPECIES.trees.length}):**
${EXISTING_SPECIES.trees.map(s => `- ${s}`).join('\n')}

**Fungi (${EXISTING_SPECIES.fungi.length}):**
${EXISTING_SPECIES.fungi.map(s => `- ${s}`).join('\n')}

## Current relationships (summarised)

${EXISTING_RELATIONSHIPS.map(r => `- ${r}`).join('\n')}

## Available relationship types

${RELATIONSHIP_TYPES.map(t => `\`${t}\``).join(', ')}

## Your task

Suggest **8–12 new species** (any kingdom) that would add meaningful new relationships to this web. Prioritise:

1. **Obligate or near-obligate relationships** — species that can barely exist without one of our existing species (like Red Crossbill + Scots Pine)
2. **Mutualistic pairs** — both parties benefit (like mycorrhizal fungus + tree)
3. **Chain extensions** — species that link two already-present species in a new way
4. **Coverage gaps** — trees or fungi with no partners yet (Hornbeam, Yew, Rowan, Ash, Aspen, and Poplar all have few or no fungal partners; Chanterelle has only one tree partner)

Avoid:
- Species already in the database
- Previously suggested species that were reviewed and skipped (listed below)
- Relationships that are generic / not ecologically specific (e.g. "Robin feeds on insects in woodland" — too vague)
- Mammals, reptiles, insects — stay within birds/trees/fungi for now

## Previously skipped (do not re-suggest)

${SKIPPED_SPECIES.map(s => `- ${s}`).join('\n')}

## Output format

For each suggestion, provide:

### [Common name] (*Scientific name*)
- **Kingdom:** bird / tree / fungus
- **Family:** [family name]
- **Why it fits:** [1–2 sentences on the specific relationship and why it is notable — cite a study or well-known ecological fact if possible]
- **Relationships to add:**
  - \`[subject]\` → \`[object]\` : \`[type]\` — [one sentence description, the same style as the existing notes in the database]
- **Fixture snippet:** A ready-to-paste PHP line for AppFixtures.php (variable name + \`$this->species()\` call, then the \`$this->rel()\` calls)

Keep suggestions realistic, scientifically grounded, and specific to the European temperate range.`;

// ------------------------------------------------------------------ //
// Run
// ------------------------------------------------------------------ //

console.log('Querying Claude for species suggestions...\n');

const message = await client.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 8192,
  messages: [{ role: 'user', content: prompt }],
});

const content = message.content[0];
if (content.type !== 'text') {
  console.error('Unexpected response type:', content.type);
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const outputPath = `suggestions-${date}.md`;

const output = `# Species Suggestions — ${date}

_Generated by suggest-species.mjs using Claude ${message.model}_
_Stop reason: ${message.stop_reason} | Input tokens: ${message.usage.input_tokens} | Output tokens: ${message.usage.output_tokens}_

---

${content.text}
`;

writeFileSync(outputPath, output, 'utf8');
console.log(`Done. Suggestions written to scripts/${outputPath}`);
