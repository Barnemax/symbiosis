<?php

namespace App\DataFixtures;

use App\Entity\CommonName;
use App\Entity\Family;
use App\Entity\Relationship;
use App\Entity\Species;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // ------------------------------------------------------------------ //
        // Families
        // ------------------------------------------------------------------ //

        $corvidae = $this->family($manager, 'Corvidae', 'bird');
        $picidae = $this->family($manager, 'Picidae', 'bird');
        $fringillidae = $this->family($manager, 'Fringillidae', 'bird');
        $paridae = $this->family($manager, 'Paridae', 'bird');
        $oriolidae = $this->family($manager, 'Oriolidae', 'bird');
        $sittidae = $this->family($manager, 'Sittidae', 'bird');
        $muscicapidae = $this->family($manager, 'Muscicapidae', 'bird');
        $sturnidae = $this->family($manager, 'Sturnidae', 'bird');
        $strigidae = $this->family($manager, 'Strigidae', 'bird');
        $certhiidae = $this->family($manager, 'Certhiidae', 'bird');
        $columbidae = $this->family($manager, 'Columbidae', 'bird');
        $turdidae = $this->family($manager, 'Turdidae', 'bird');
        $phylloscopidae = $this->family($manager, 'Phylloscopidae', 'bird');
        $bombycillidae = $this->family($manager, 'Bombycillidae', 'bird');

        $fagaceae = $this->family($manager, 'Fagaceae', 'tree');
        $pinaceae = $this->family($manager, 'Pinaceae', 'tree');
        $salicaceae = $this->family($manager, 'Salicaceae', 'tree');
        $betulaceae = $this->family($manager, 'Betulaceae', 'tree');
        $taxaceae = $this->family($manager, 'Taxaceae', 'tree');
        $rosaceae = $this->family($manager, 'Rosaceae', 'tree');
        $adoxaceae = $this->family($manager, 'Adoxaceae', 'tree');
        $oleaceae = $this->family($manager, 'Oleaceae', 'tree');
        $santalaceae = $this->family($manager, 'Santalaceae', 'tree');

        $boletaceae = $this->family($manager, 'Boletaceae', 'fungus');
        $cantharellaceae = $this->family($manager, 'Cantharellaceae', 'fungus');
        $amanitaceae = $this->family($manager, 'Amanitaceae', 'fungus');
        $suillaceae = $this->family($manager, 'Suillaceae', 'fungus');
        $hydnangiaceae = $this->family($manager, 'Hydnangiaceae', 'fungus');
        $hymenochaetaceae = $this->family($manager, 'Hymenochaetaceae', 'fungus');
        $physalacriaceae = $this->family($manager, 'Physalacriaceae', 'fungus');
        $hericiaceae = $this->family($manager, 'Hericiaceae', 'fungus');
        $fomitopsidaceae = $this->family($manager, 'Fomitopsidaceae', 'fungus');
        $sparassidaceae = $this->family($manager, 'Sparassidaceae', 'fungus');
        $auriculariaceae = $this->family($manager, 'Auriculariaceae', 'fungus');
        $hypoxylaceae = $this->family($manager, 'Hypoxylaceae', 'fungus');
        $fistulinaceae = $this->family($manager, 'Fistulinaceae', 'fungus');
        $polyporaceae = $this->family($manager, 'Polyporaceae', 'fungus');
        $paxillaceae = $this->family($manager, 'Paxillaceae', 'fungus');
        $russulaceae = $this->family($manager, 'Russulaceae', 'fungus');
        $tuberaceae = $this->family($manager, 'Tuberaceae', 'fungus');

        // ------------------------------------------------------------------ //
        // Species | Birds
        // ------------------------------------------------------------------ //

        $jay = $this->species($manager, 'Garrulus glandarius', $corvidae, 'LC', 'Deciduous and mixed woodland', wingspan: 54.0);
        $this->names($manager, $jay, 'Eurasian Jay', 'Geai des chênes');

        $woodpecker = $this->species($manager, 'Dendrocopos major', $picidae, 'LC', 'Woodland, parks, gardens', wingspan: 36.0);
        $this->names($manager, $woodpecker, 'Great Spotted Woodpecker', 'Pic épeiche');

        $crossbill = $this->species($manager, 'Loxia curvirostra', $fringillidae, 'LC', 'Coniferous forest', wingspan: 29.0);
        $this->names($manager, $crossbill, 'Red Crossbill', 'Bec-croisé des sapins');

        $crestedTit = $this->species($manager, 'Lophophanes cristatus', $paridae, 'LC', 'Coniferous and mixed forest', wingspan: 18.0);
        $this->names($manager, $crestedTit, 'Crested Tit', 'Mésange huppée');

        $greatTit = $this->species($manager, 'Parus major', $paridae, 'LC', 'Woodland, parks, gardens, hedgerows', wingspan: 24.0);
        $this->names($manager, $greatTit, 'Great Tit', 'Mésange charbonnière');

        $oriole = $this->species($manager, 'Oriolus oriolus', $oriolidae, 'LC', 'Tall deciduous woodland, riparian forest, orchards', wingspan: 44.0);
        $this->names($manager, $oriole, 'Golden Oriole', 'Loriot d\'Europe');

        $nuthatch = $this->species($manager, 'Sitta europaea', $sittidae, 'LC', 'Mature deciduous woodland, parks', wingspan: 27.0);
        $this->names($manager, $nuthatch, 'Eurasian Nuthatch', 'Sittelle torchepot');

        $robin = $this->species($manager, 'Erithacus rubecula', $muscicapidae, 'LC', 'Woodland, gardens, hedgerows', wingspan: 20.0);
        $this->names($manager, $robin, 'European Robin', 'Rouge-gorge familier');

        $starling = $this->species($manager, 'Sturnus vulgaris', $sturnidae, 'LC', 'Farmland, woodland edge, urban areas', wingspan: 37.0);
        $this->names($manager, $starling, 'Common Starling', 'Étourneau sansonnet');

        $tawnyOwl = $this->species($manager, 'Strix aluco', $strigidae, 'LC', 'Mature deciduous and mixed woodland, parks, large gardens', wingspan: 95.0);
        $this->names($manager, $tawnyOwl, 'Tawny Owl', 'Chouette hulotte');

        $blueTit = $this->species($manager, 'Cyanistes caeruleus', $paridae, 'LC', 'Deciduous woodland, parks, gardens, hedgerows', wingspan: 19.0);
        $this->names($manager, $blueTit, 'Eurasian Blue Tit', 'Mésange bleue');

        $woodWarbler = $this->species($manager, 'Phylloscopus sibilatrix', $phylloscopidae, 'LC', 'Mature deciduous woodland with closed canopy and sparse ground cover', wingspan: 21.0);
        $this->names($manager, $woodWarbler, 'Wood Warbler', 'Pouillot siffleur');

        $treecreeper = $this->species($manager, 'Certhia familiaris', $certhiidae, 'LC', 'Coniferous and mixed woodland, especially with rough-barked conifers', wingspan: 18.0);
        $this->names($manager, $treecreeper, 'Eurasian Treecreeper', 'Grimpereau des bois');

        $shortToedTreecreeper = $this->species($manager, 'Certhia brachydactyla', $certhiidae, 'LC', 'Mature deciduous woodland, parks, orchards', wingspan: 18.0);
        $this->names($manager, $shortToedTreecreeper, 'Short-toed Treecreeper', 'Grimpereau des jardins');

        $stockDove = $this->species($manager, 'Columba oenas', $columbidae, 'LC', 'Mature deciduous woodland, farmland with veteran trees', wingspan: 60.0);
        $this->names($manager, $stockDove, 'Stock Dove', 'Pigeon colombin');

        $hawfinch = $this->species($manager, 'Coccothraustes coccothraustes', $fringillidae, 'LC', 'Mature deciduous woodland, orchards, parks with Hornbeam or Cherry', wingspan: 32.0);
        $this->names($manager, $hawfinch, 'Hawfinch', 'Grosbec casse-noyaux');

        $brambling = $this->species($manager, 'Fringilla montifringilla', $fringillidae, 'LC', 'Boreal birch and conifer forest (breeding); Beech woodland (wintering)', wingspan: 26.0);
        $this->names($manager, $brambling, 'Brambling', 'Pinson du Nord');

        $mistleThrush = $this->species($manager, 'Turdus viscivorus', $turdidae, 'LC', 'Open woodland, woodland edge, parks, upland moors', wingspan: 42.0);
        $this->names($manager, $mistleThrush, 'Mistle Thrush', 'Grive draine');

        $blackbird = $this->species($manager, 'Turdus merula', $turdidae, 'LC', 'Woodland, gardens, hedgerows, parks. One of Europe\'s most adaptable birds', wingspan: 34.0);
        $this->names($manager, $blackbird, 'Common Blackbird', 'Merle noir');

        $greenWoodpecker = $this->species($manager, 'Picus viridis', $picidae, 'LC', 'Deciduous woodland, parkland, and orchards with open ground for ant foraging', wingspan: 40.0);
        $this->names($manager, $greenWoodpecker, 'European Green Woodpecker', 'Pic vert');

        $waxwing = $this->species($manager, 'Bombycilla garrulus', $bombycillidae, 'LC', 'Boreal conifer and birch forest (breeding); irruptive winter visitor to woodland edge, parks, and berry-bearing trees', wingspan: 35.0);
        $this->names($manager, $waxwing, 'Bohemian Waxwing', 'Jaseur boréal');

        $blackWoodpecker = $this->species($manager, 'Dryocopus martius', $picidae, 'LC', 'Mature beech and pine forest with large-diameter trees; requires extensive home range', wingspan: 68.0);
        $this->names($manager, $blackWoodpecker, 'Black Woodpecker', 'Pic noir');

        // ------------------------------------------------------------------ //
        // Species | Trees
        // ------------------------------------------------------------------ //

        $oak = $this->species($manager, 'Quercus robur', $fagaceae, 'LC', 'Lowland deciduous woodland, hedgerows', maxHeight: 40.0);
        $this->names($manager, $oak, 'Pedunculate Oak', 'Chêne pédonculé');

        $pine = $this->species($manager, 'Pinus sylvestris', $pinaceae, 'LC', 'Boreal and montane coniferous forest', maxHeight: 35.0);
        $this->names($manager, $pine, 'Scots Pine', 'Pin sylvestre');

        $poplar = $this->species($manager, 'Populus nigra', $salicaceae, 'NT', 'Riparian corridors, floodplains, river banks', maxHeight: 30.0);
        $this->names($manager, $poplar, 'Black Poplar', 'Peuplier noir');

        $birch = $this->species($manager, 'Betula pendula', $betulaceae, 'LC', 'Heathland, open woodland, moorland', maxHeight: 25.0);
        $this->names($manager, $birch, 'Silver Birch', 'Bouleau verruqueux');

        $beech = $this->species($manager, 'Fagus sylvatica', $fagaceae, 'LC', 'Temperate deciduous forest on well-drained soils', maxHeight: 45.0);
        $this->names($manager, $beech, 'European Beech', 'Hêtre commun');

        $hornbeam = $this->species($manager, 'Carpinus betulus', $betulaceae, 'LC', 'Mixed deciduous woodland, often understorey beneath Oak and Beech', maxHeight: 30.0);
        $this->names($manager, $hornbeam, 'Hornbeam', 'Charme commun');

        $yew = $this->species($manager, 'Taxus baccata', $taxaceae, 'LC', 'Ancient woodland, chalk downland, churchyards; extremely long-lived', maxHeight: 20.0);
        $this->names($manager, $yew, 'Common Yew', 'If commun');

        $rowan = $this->species($manager, 'Sorbus aucuparia', $rosaceae, 'LC', 'Upland woodland, moorland, mountain slopes. Highly tolerant of poor soils', maxHeight: 15.0);
        $this->names($manager, $rowan, 'Rowan', 'Sorbier des oiseleurs');

        $elder = $this->species($manager, 'Sambucus nigra', $adoxaceae, 'LC', 'Woodland edge, hedgerows, disturbed ground, riparian scrub', maxHeight: 10.0);
        $this->names($manager, $elder, 'Elder', 'Sureau noir');

        $ash = $this->species($manager, 'Fraxinus excelsior', $oleaceae, 'LC', 'Mixed deciduous woodland, hedgerows, river banks. Threatened by Ash Dieback', maxHeight: 40.0);
        $this->names($manager, $ash, 'European Ash', 'Frêne commun');

        $aspen = $this->species($manager, 'Populus tremula', $salicaceae, 'LC', 'Woodland clearings, moorland edge, montane scrub. Fast-growing pioneer', maxHeight: 25.0);
        $this->names($manager, $aspen, 'Aspen', 'Tremble');

        $mistletoe = $this->species($manager, 'Viscum album', $santalaceae, 'LC', 'Obligate hemiparasite of broadleaved trees; found in parkland, orchards, and open woodland wherever host species grow', maxHeight: 1.0);
        $this->names($manager, $mistletoe, 'European Mistletoe', 'Gui commun');

        $spruce = $this->species($manager, 'Picea abies', $pinaceae, 'LC', 'Dominant tree of boreal and montane coniferous forest across northern and central Europe', maxHeight: 55.0);
        $this->names($manager, $spruce, 'Norway Spruce', 'Épicéa commun');

        // ------------------------------------------------------------------ //
        // Species | Fungi
        // ------------------------------------------------------------------ //

        $pennyBun = $this->species($manager, 'Boletus edulis', $boletaceae, null, 'Broadleaf and coniferous woodland soil', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $pennyBun, 'Penny Bun', 'Cèpe de Bordeaux');

        $chanterelle = $this->species($manager, 'Cantharellus cibarius', $cantharellaceae, null, 'Deciduous and coniferous woodland soil', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $chanterelle, 'Chanterelle', 'Girolle');

        $flyAgaric = $this->species($manager, 'Amanita muscaria', $amanitaceae, null, 'Woodland soil near birch, oak, pine', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $flyAgaric, 'Fly Agaric', 'Amanite tue-mouches');

        $slipperyJack = $this->species($manager, 'Suillus luteus', $suillaceae, null, 'Soil under Scots Pine', substrate: 'Ectomycorrhizal, soil under pine');
        $this->names($manager, $slipperyJack, 'Slippery Jack', 'Bolet jaune');

        $birchBolete = $this->species($manager, 'Leccinum scabrum', $boletaceae, null, 'Soil under birch', substrate: 'Ectomycorrhizal, obligate birch associate');
        $this->names($manager, $birchBolete, 'Brown Birch Bolete', 'Bolet rude');

        $amethystDeceiver = $this->species($manager, 'Laccaria amethystina', $hydnangiaceae, null, 'Damp deciduous and coniferous woodland soil', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $amethystDeceiver, 'Amethyst Deceiver', 'Laccaire améthyste');

        $oakBracket = $this->species($manager, 'Inonotus dryadeus', $hymenochaetaceae, null, 'Base of mature oak trunks', substrate: 'Parasitic, decaying heartwood');
        $this->names($manager, $oakBracket, 'Oak Bracket', 'Inonotus des chênes');

        $porcelainFungus = $this->species($manager, 'Oudemansiella mucida', $physalacriaceae, null, 'Dead and dying Beech branches and trunks', substrate: 'Saprotrophic, dead Beech wood');
        $this->names($manager, $porcelainFungus, 'Porcelain Fungus', 'Oudemansiella muqueux');

        $lionsMane = $this->species($manager, 'Hericium erinaceus', $hericiaceae, null, 'Veteran Beech and Oak heartwood. UK Priority Species', substrate: 'Parasitic/saprotrophic, veteran deciduous heartwood');
        $this->names($manager, $lionsMane, 'Lion\'s Mane', 'Hérisson de mer');

        $birchPolypore = $this->species($manager, 'Fomitopsis betulina', $fomitopsidaceae, null, 'Dead Silver Birch trunks and branches', substrate: 'Parasitic/saprotrophic, obligate Birch associate');
        $this->names($manager, $birchPolypore, 'Birch Polypore', 'Polypore du bouleau');

        $cauliflowerFungus = $this->species($manager, 'Sparassis crispa', $sparassidaceae, null, 'Base of Scots Pine and other conifers', substrate: 'Parasitic, Scots Pine root associate');
        $this->names($manager, $cauliflowerFungus, 'Cauliflower Fungus', 'Sparassis crépu');

        $jellyEar = $this->species($manager, 'Auricularia auricula-judae', $auriculariaceae, null, 'Dead and dying Elder wood, occasionally other deciduous species', substrate: 'Saprotrophic, primarily Elder wood');
        $this->names($manager, $jellyEar, 'Jelly Ear', 'Oreille de Judas');

        $kingsAlfred = $this->species($manager, 'Daldinia concentrica', $hypoxylaceae, null, 'Dead Ash wood. Threatened alongside host by Ash Dieback', substrate: 'Saprotrophic, dead Ash wood');
        $this->names($manager, $kingsAlfred, 'King Alfred\'s Cakes', 'Daldinia concentrique');

        $beefsteak = $this->species($manager, 'Fistulina hepatica', $fistulinaceae, null, 'Veteran Oak and Sweet Chestnut heartwood', substrate: 'Parasitic, veteran Oak heartwood. Creates prized brown oak timber');
        $this->names($manager, $beefsteak, 'Beefsteak Fungus', 'Langue de bœuf');

        $chickenOfWoods = $this->species($manager, 'Laetiporus sulphureus', $polyporaceae, null, 'Oak, Sweet Chestnut, Yew and other veteran deciduous trees', substrate: 'Parasitic/saprotrophic, hardwood heartwood');
        $this->names($manager, $chickenOfWoods, 'Chicken of the Woods', 'Polypore soufré');

        $honeyFungus = $this->species($manager, 'Armillaria mellea', $physalacriaceae, null, 'Roots and stumps of deciduous trees, especially Oak', substrate: 'Parasitic/saprotrophic, root and stump pathogen');
        $this->names($manager, $honeyFungus, 'Honey Fungus', 'Armillaire couleur de miel');

        $brownRollrim = $this->species($manager, 'Paxillus involutus', $paxillaceae, null, 'Soil under Silver Birch and other deciduous trees', substrate: 'Ectomycorrhizal, birch-associated soil');
        $this->names($manager, $brownRollrim, 'Brown Rollrim', 'Paxille enroulé');

        $summerTruffle = $this->species($manager, 'Tuber aestivum', $tuberaceae, null, 'Calcareous broadleaf woodland soil, hypogeous under Hornbeam, Beech, and Oak', substrate: 'Ectomycorrhizal, hypogeous (subterranean)');
        $this->names($manager, $summerTruffle, 'Summer Truffle', 'Truffe d\'été');

        $russulaSickener = $this->species($manager, 'Russula emetica', $russulaceae, null, 'Acidic coniferous and mixed woodland, especially boggy pine-birch stands', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $russulaSickener, 'The Sickener', 'Russule émétique');

        $oakbugMilkcap = $this->species($manager, 'Lactarius quietus', $russulaceae, null, 'Deciduous woodland floor, near-exclusively under Pedunculate Oak', substrate: 'Ectomycorrhizal, soil. Near-obligate Quercus associate');
        $this->names($manager, $oakbugMilkcap, 'Oakbug Milkcap', 'Lactaire tranquille');

        $woollyMilkcap = $this->species($manager, 'Lactarius torminosus', $russulaceae, null, 'Birch woodland, heathland, and mixed pine-birch forest', substrate: 'Ectomycorrhizal, obligate Betula associate');
        $this->names($manager, $woollyMilkcap, 'Woolly Milkcap', 'Lactaire tormineux');

        $willowBracket = $this->species($manager, 'Phellinus igniarius', $hymenochaetaceae, null, 'Living trunks of Aspen, Poplar, and Willow in wet woodland and riparian margins', substrate: 'Parasitic, causes white heart rot in living hardwood');
        $this->names($manager, $willowBracket, 'Willow Bracket', 'Polypore igné');

        $paleChanterelle = $this->species($manager, 'Cantharellus pallens', $cantharellaceae, null, 'Calcareous beech woodland on well-drained soils', substrate: 'Ectomycorrhizal, soil under Fagus');
        $this->names($manager, $paleChanterelle, 'Pale Chanterelle', 'Chanterelle pâle');

        $tinderFungus = $this->species($manager, 'Fomes fomentarius', $polyporaceae, null, 'Living and dead Beech and Birch trunks throughout temperate and boreal Europe', substrate: 'Parasitic/saprotrophic, white rot of hardwood');
        $this->names($manager, $tinderFungus, 'Tinder Fungus', 'Amadouvier');

        $orangeBolete = $this->species($manager, 'Leccinum aurantiacum', $boletaceae, null, 'Soil under Aspen and Black Poplar in riparian and mixed woodland', substrate: 'Ectomycorrhizal, near-obligate Populus associate');
        $this->names($manager, $orangeBolete, 'Orange Birch Bolete', 'Bolet orangé');

        // ------------------------------------------------------------------ //
        // Ecological relationships
        // ------------------------------------------------------------------ //

        // Oak
        $this->rel($manager, $jay, $oak, 'disperses_seeds_of', 'Primary disperser of oak across Europe. Buries acorns and forgets many of them.');
        $this->rel($manager, $woodpecker, $oak, 'nests_in', 'Excavates nesting cavities in mature oak trunks.');
        $this->rel($manager, $pennyBun, $oak, 'mycorrhiza_with', 'Ectomycorrhizal partner. Extends root reach in exchange for sugars.');
        $this->rel($manager, $chanterelle, $oak, 'mycorrhiza_with', 'Ectomycorrhizal partner commonly found under oak.');
        $this->rel($manager, $flyAgaric, $oak, 'mycorrhiza_with', 'Ectomycorrhizal partner of oak and birch.');

        // Scots Pine
        $this->rel($manager, $crossbill, $pine, 'feeds_on', 'Beak evolved specifically to extract seeds from closed pine cones. Nearly obligate on conifers.');
        $this->rel($manager, $crestedTit, $pine, 'nests_in', 'Nests almost exclusively in dead Scots Pine wood. Rare outside conifer stands.');
        $this->rel($manager, $slipperyJack, $pine, 'mycorrhiza_with', 'Highly pine-specific ectomycorrhizal fungus. Rarely found away from Pinus species.');
        $this->rel($manager, $flyAgaric, $pine, 'mycorrhiza_with', 'Also partners with pine. Sharing the dual oak/pine association.');

        // Black Poplar
        $this->rel($manager, $oriole, $poplar, 'nests_in', 'Nests almost exclusively in tall riparian trees. Black Poplar along river corridors is the classic breeding habitat in France and southern Europe.');

        // Oak (additional birds)
        $this->rel($manager, $greatTit, $oak, 'feeds_on', 'A keystone relationship: Great Tit populations track winter moth caterpillar peaks on oak. Timing of egg-laying has evolved to match oak bud-burst.');
        $this->rel($manager, $nuthatch, $oak, 'feeds_on', 'Caches acorns and invertebrates in oak bark crevices. Forages head-down along trunks in a manner unique among European birds.');
        $this->rel($manager, $nuthatch, $oak, 'nests_in', 'Uses natural holes in mature oaks. Plasters the entrance with mud to reduce the opening to fit its body exactly.');
        $this->rel($manager, $starling, $oak, 'nests_in', 'Colonises old woodpecker cavities in veteran oaks. One of the main secondary users of holes excavated by Great Spotted Woodpecker.');
        $this->rel($manager, $oriole, $oak, 'feeds_on', 'Forages on oak caterpillars (especially defoliating moth larvae) during the breeding season when insect demand is highest.');

        // Silver Birch
        $this->rel($manager, $birchBolete, $birch, 'mycorrhiza_with', 'Obligate ectomycorrhizal associate of birch. Virtually never found without a Betula host nearby.');
        $this->rel($manager, $flyAgaric, $birch, 'mycorrhiza_with', 'The iconic fly agaric–birch association. Birch is its primary pioneer-woodland host alongside pine.');

        // European Beech
        $this->rel($manager, $amethystDeceiver, $beech, 'mycorrhiza_with', 'Characteristic ectomycorrhizal fungus of beech woodland floors. Its violet colour makes it unmistakable in autumn litter.');

        // Oak (fungi | additional)
        $this->rel($manager, $amethystDeceiver, $oak, 'mycorrhiza_with', 'Also forms mycorrhiza with oak, though less diagnostic than its beech association.');
        $this->rel($manager, $oakBracket, $oak, 'grows_on', 'Parasitic bracket fungus that colonises the heartwood of veteran oaks, causing white rot at the root collar. Mature infected trees remain standing for decades and their soft wood attracts woodpeckers.');

        // Three-way link: Oak Bracket → Woodpecker
        $this->rel($manager, $woodpecker, $oakBracket, 'feeds_on', 'Excavates infected oak wood weakened by Inonotus dryadeus to reach beetle larvae. Bracket-infected oaks are disproportionately represented in woodpecker foraging sites.');

        // Tawny Owl
        $this->rel($manager, $tawnyOwl, $oak, 'nests_in', 'Obligate cavity nester. Relies on large-diameter veteran oaks with natural hollows or old woodpecker excavations. One of the most extensively studied nest-site associations in European ornithology.');
        $this->rel($manager, $tawnyOwl, $beech, 'nests_in', 'Also uses cavities in mature Beech, particularly in continental Europe where Beech replaces Oak as the dominant veteran tree.');

        // Blue Tit - oak phenology
        $this->rel($manager, $blueTit, $oak, 'feeds_on', 'Nestling diet is dominated by oak caterpillars during the critical growth window. Blue Tit breeding phenology has evolved to synchronise with oak bud-burst - a flagship example in climate change ecology (Visser et al.; Charmantier et al. 2008).');

        // Wood Warbler - beech specialist
        $this->rel($manager, $woodWarbler, $beech, 'nests_in', 'Breeds almost exclusively in mature Beech woodland with a closed canopy and bare, leaf-litter floor - one of the tightest habitat associations of any European warbler. UK populations have declined sharply as Beech woodland structure has changed.');

        // Treecreepers
        $this->rel($manager, $treecreeper, $pine, 'feeds_on', 'Forages under the rough scales of Scots Pine bark for spiders and insects; also nests behind loose bark slabs, a nesting habit unique to this family. The association with pine is particularly strong in Scottish Highland populations.');
        $this->rel($manager, $shortToedTreecreeper, $oak, 'feeds_on', 'The deciduous-woodland counterpart of the Common Treecreeper. The two species replace each other ecologically, with Short-toed specialising in the rough bark of Pedunculate Oak and other broadleaves across continental Europe.');

        // Stock Dove
        $this->rel($manager, $stockDove, $oak, 'nests_in', 'Obligate cavity nester that cannot breed in open trees, entirely dependent on large natural hollows in veteran Pedunculate Oak. Unlike Woodpigeon, it has no alternative nest site. Population size is closely tied to veteran oak availability.');

        // Hawfinch + Hornbeam (the centrepiece coevolution story)
        $this->rel($manager, $hawfinch, $hornbeam, 'feeds_on', 'The Hawfinch\'s beak generates approximately 50-70 kg of crushing force, sufficient to split Hornbeam nutlets that no other European passerine can open. This morphological specialisation is one of the most striking examples of beak-seed coevolution in European birds.');

        // Brambling + Beech (irruption story)
        $this->rel($manager, $brambling, $beech, 'feeds_on', 'Brambling flocks irrupt in millions across central Europe in Beech mast years, then largely absent in poor mast years. One of the most dramatic examples of nomadic irruption tied to a single food source in the Western Palearctic (Jenni 1987).');

        // Mistle Thrush
        $this->rel($manager, $mistleThrush, $yew, 'feeds_on', 'Defends Yew berry crops aggressively in winter, chasing off Blackbirds and Fieldfares. A textbook example of resource-defense behaviour (Snow & Snow 1988). The Yew aril is consumed whole while the toxic seed passes unharmed.');
        $this->rel($manager, $mistleThrush, $rowan, 'feeds_on', 'Also defends Rowan berry crops in upland areas using the same resource-defense strategy; a key disperser of Rowan seeds into open habitats above the treeline.');

        // Blackbird
        $this->rel($manager, $blackbird, $elder, 'disperses_seeds_of', 'Consumes Elder berries in large quantities in late summer and autumn; seeds pass through the gut intact and are deposited in new locations. Blackbird is one of the primary dispersers of Elder across woodland edge and hedgerow habitats.');
        $this->rel($manager, $blackbird, $rowan, 'disperses_seeds_of', 'One of the most important Rowan dispersers in lowland Britain; strips berries quickly in autumn and deposits seeds across a wide radius.');

        // Aspen - woodpecker nesting
        $this->rel($manager, $woodpecker, $aspen, 'nests_in', 'Excavates nest holes in Aspen more readily than in oak. The soft, fast-decaying wood requires significantly less effort. Aspen stands are disproportionately important for woodpecker nesting density relative to tree abundance.');

        // Beech fungi
        $this->rel($manager, $porcelainFungus, $beech, 'grows_on', 'Grows almost exclusively on dead and dying Beech wood. So diagnostic that it is a reliable indicator of Beech presence. The translucent, mucus-coated caps earn it the alternative name "beech ghost".');
        $this->rel($manager, $lionsMane, $beech, 'grows_on', 'In Europe, found almost exclusively on veteran Beech heartwood; used as an indicator species for ancient Beech woodland continuity. Listed as a UK Priority Species and BAP species, its presence signals a woodland of exceptional ecological age.');

        // Silver Birch fungi (additional)
        $this->rel($manager, $birchPolypore, $birch, 'grows_on', 'Obligate on Silver Birch, virtually never recorded on any other host. Causes a brown rot that softens the trunk; infected birches are preferentially selected by Great Spotted Woodpecker for nest excavation.');
        $this->rel($manager, $brownRollrim, $birch, 'mycorrhiza_with', 'Well-documented ectomycorrhizal associate of Silver Birch. Historically eaten across Europe before its cumulative haemolytic toxicity was established, a rare case of a mycorrhizal fungus proving fatal to humans.');

        // Birch Polypore → Woodpecker chain
        $this->rel($manager, $woodpecker, $birchPolypore, 'feeds_on', 'Preferentially excavates Birch Polypore-infected Birch trunks, where the brown rot created by Fomitopsis betulina softens the wood sufficiently for cavity creation. A documented three-way chain: Birch → Birch Polypore → Woodpecker.');

        // Scots Pine fungi (additional)
        $this->rel($manager, $cauliflowerFungus, $pine, 'grows_on', 'A near-obligate root parasite of Scots Pine, fruiting at the tree\'s base as a spectacular cream-coloured mass of curling fronds. Causes a butt rot that can eventually kill the host, but infected trees may stand for many years.');

        // Elder fungi
        $this->rel($manager, $jellyEar, $elder, 'grows_on', 'The association is so strong that the fungus\'s folk name "Judas\'s Ear" refers to the Elder tree from which Judas Iscariot is said to have hanged himself. Near-obligate on Elder in practice, though occasional records exist on other hosts.');

        // Ash fungi
        $this->rel($manager, $kingsAlfred, $ash, 'grows_on', 'So closely associated with dead Ash wood that it is practically diagnostic of the species. The relationship carries conservation urgency, Ash Dieback (Hymenoscyphus fraxineus) threatens both the host tree and this fungus across Europe.');

        // Oak fungi (additional bracket species)
        $this->rel($manager, $beefsteak, $oak, 'grows_on', 'Found almost exclusively on veteran Pedunculate Oak, where it causes a distinctive brown rot that ironically produces the prized "brown oak" timber sought by craftspeople. One of the most oak-faithful bracket fungi in Europe.');
        $this->rel($manager, $chickenOfWoods, $oak, 'grows_on', 'A flagship oak-associated bracket fungus, parasitising the heartwood of mature and veteran trees. Its vivid sulphur-yellow fruiting bodies can weigh over 40 kg and are conspicuous from a distance.');
        $this->rel($manager, $honeyFungus, $oak, 'grows_on', 'One of the most significant woodland pathogens in Europe, spreads via black rhizomorphs through the soil and can kill mature oaks over several years. Simultaneously a decomposer of dead stumps and a parasite of living trees.');

        // Viscum album (European Mistletoe)
        $this->rel($manager, $mistleThrush, $mistletoe, 'disperses_seeds_of', 'Primary ornithochorous disperser; sticky seeds are wiped from the bill onto host branches after ingestion. The namesake mutualism from which the bird\'s English name derives (Snow & Snow 1988).');
        $this->rel($manager, $mistletoe, $poplar, 'parasitises', 'Obligate hemiparasite tapping host xylem for water and minerals; Black Poplar is a preferred continental host, frequently colonised in floodplain woodlands.');
        $this->rel($manager, $mistletoe, $ash, 'parasitises', 'Ash is a frequent mistletoe host in western European woodlands, particularly in Britain and France.');

        // Summer Truffle | Hornbeam, Beech, Oak
        $this->rel($manager, $summerTruffle, $hornbeam, 'mycorrhiza_with', 'Ectomycorrhizal; Hornbeam is a principal host in calcareous European woodlands. Fills the significant gap of Hornbeam having no previous fungal partners in the database.');
        $this->rel($manager, $summerTruffle, $beech, 'mycorrhiza_with', 'Classic ectomycorrhizal association on well-drained calcareous soils under European Beech.');
        $this->rel($manager, $summerTruffle, $oak, 'mycorrhiza_with', 'Common ectomycorrhizal partner of Pedunculate Oak; frequently co-occurs with Penny Bun and Chanterelle in the same stands.');

        // Russulaceae | new mycorrhizal family
        $this->rel($manager, $russulaSickener, $pine, 'mycorrhiza_with', 'Obligate ectomycorrhizal partner of Scots Pine on acidic, boggy soils; rarely recorded away from Pinus.');
        $this->rel($manager, $russulaSickener, $birch, 'mycorrhiza_with', 'Also ectomycorrhizal with Silver Birch in mixed pine-birch heathland.');
        $this->rel($manager, $oakbugMilkcap, $oak, 'mycorrhiza_with', 'Near-obligate on Quercus; almost never found away from oak woodland. Used as an indicator species for oak-dominated stands (Heilmann-Clausen et al. 2014).');
        $this->rel($manager, $woollyMilkcap, $birch, 'mycorrhiza_with', 'Obligately ectomycorrhizal with Betula; rarely or never recorded with other host genera (Nuytinck & Verbeken 2003).');

        // Phellinus igniarius | heart-rot and cavity creation chain
        $this->rel($manager, $willowBracket, $aspen, 'parasitises', 'A primary heart-rot pathogen of living Aspen, creating decay columns that are subsequently excavated by woodpeckers as nest cavities. A documented fungus → bird facilitation chain.');
        $this->rel($manager, $willowBracket, $birch, 'grows_on', 'Common perennial bracket on older Birch, contributing to standing deadwood habitat on which many saproxylic species depend.');

        // Pale Chanterelle | extends Cantharellaceae to Beech
        $this->rel($manager, $paleChanterelle, $beech, 'mycorrhiza_with', 'Ectomycorrhizal; found characteristically in beech litter on calcareous soils; extends the Cantharellaceae to a second tree host.');

        // European Green Woodpecker
        $this->rel($manager, $greenWoodpecker, $aspen, 'nests_in', 'Excavates nest cavities in soft aspen heartwood, especially where fungal heart-rot is present; Aspen\'s rapid decay makes it a preferred nesting substrate in mixed woodland.');
        $this->rel($manager, $greenWoodpecker, $poplar, 'nests_in', 'Excavates cavities in the soft wood of Black Poplar in floodplain woodland; a key secondary nesting tree across continental Europe.');

        // Bohemian Waxwing
        $this->rel($manager, $waxwing, $rowan, 'disperses_seeds_of', 'Specialist frugivore whose irruptive winter movements into temperate Europe are driven by Rowan mast crop failures in Fennoscandia. Seeds swallowed whole and passed intact (Svensson 1975).');
        $this->rel($manager, $waxwing, $yew, 'disperses_seeds_of', 'Swallows Yew arils whole, passing the enclosed seed intact. One of the few birds to consume Taxus fruit in significant quantity. A critical dispersal link for a tree with few avian partners.');
        $this->rel($manager, $waxwing, $elder, 'feeds_on', 'Feeds extensively on Elder berries during winter irruptions into western Europe, often in large flocks alongside Blackbirds and Fieldfares.');

        // Norway Spruce | cross-kingdom hub
        $this->rel($manager, $crossbill, $spruce, 'feeds_on', 'Spruce cones are a primary food source across much of the European range; mandible morphology is adapted to prise open conifer cone scales.');
        $this->rel($manager, $chanterelle, $spruce, 'mycorrhiza_with', 'Dominant ectomycorrhizal association in Scandinavian and Central European spruce forests.');
        $this->rel($manager, $cauliflowerFungus, $spruce, 'grows_on', 'Causes butt rot in Norway Spruce; a major secondary host alongside Scots Pine.');
        $this->rel($manager, $flyAgaric, $spruce, 'mycorrhiza_with', 'Ectomycorrhizal partner of Norway Spruce throughout its European range.');
        $this->rel($manager, $crestedTit, $spruce, 'nests_in', 'Nests in rotting stumps and cavities in spruce-dominated boreal and montane forests.');

        // Tinder Fungus | white-rot parasite of Beech and Birch
        $this->rel($manager, $tinderFungus, $beech, 'parasitises', 'Primary white-rot parasite of living Beech; causes extensive heartwood decay that creates the cavities essential for hole-nesting birds.');
        $this->rel($manager, $tinderFungus, $birch, 'parasitises', 'Major parasite of Silver Birch in northern European forests; often co-occurs with Birch Polypore on the same host.');
        $this->rel($manager, $tinderFungus, $aspen, 'grows_on', 'Saprotrophic and weakly parasitic on Aspen in boreal and montane woodland.');

        // Black Woodpecker | keystone cavity excavator
        $this->rel($manager, $blackWoodpecker, $beech, 'nests_in', 'Primary nest tree in Central and Western European beech forests; preferentially selects trunks with heartrot from Fomes fomentarius.');
        $this->rel($manager, $blackWoodpecker, $pine, 'nests_in', 'Primary nest tree in boreal and eastern European pine forests.');
        $this->rel($manager, $blackWoodpecker, $honeyFungus, 'feeds_on', 'Forages on wood colonised by Honey Fungus, feeding on both the fungal tissue and associated beetle larvae.');
        $this->rel($manager, $blackWoodpecker, $tinderFungus, 'symbiosis_with', 'Preferentially nests in Beech trunks infected with Tinder Fungus. The fungus softens heartwood while the bird\'s cavity promotes further fungal colonisation (Zahner et al. 2012).');

        // Orange Birch Bolete | first mycorrhizal partner for Populus species
        $this->rel($manager, $orangeBolete, $aspen, 'mycorrhiza_with', 'Near-obligate ectomycorrhizal partner; Aspen is the primary host throughout the European range.');
        $this->rel($manager, $orangeBolete, $poplar, 'mycorrhiza_with', 'Ectomycorrhizal association with Black Poplar in riparian and mixed woodland.');

        $manager->flush();
    }

    // ------------------------------------------------------------------ //
    // Helpers
    // ------------------------------------------------------------------ //

    private function family(ObjectManager $manager, string $name, string $kingdom): Family
    {
        $f = (new Family())->setName($name)->setKingdom($kingdom);
        $manager->persist($f);

        return $f;
    }

    private function species(
        ObjectManager $manager,
        string $scientificName,
        Family $family,
        ?string $conservationStatus,
        ?string $habitat,
        ?float $wingspan = null,
        ?float $maxHeight = null,
        ?string $substrate = null,
    ): Species {
        $s = (new Species())
            ->setScientificName($scientificName)
            ->setSlug(strtolower(str_replace(' ', '-', $scientificName)))
            ->setFamily($family)
            ->setConservationStatus($conservationStatus)
            ->setHabitat($habitat)
            ->setWingspan($wingspan)
            ->setMaxHeight($maxHeight)
            ->setSubstrate($substrate);
        $manager->persist($s);

        return $s;
    }

    private function names(ObjectManager $manager, Species $species, string $en, string $fr): void
    {
        foreach (['en' => $en, 'fr' => $fr, 'la' => $species->getScientificName()] as $locale => $name) {
            $cn = (new CommonName())->setSpecies($species)->setLocale($locale)->setName($name);
            $manager->persist($cn);
        }
    }

    private function rel(
        ObjectManager $manager,
        Species $subject,
        Species $object,
        string $type,
        ?string $notes = null,
    ): void {
        $r = (new Relationship())->setSubject($subject)->setObject($object)->setType($type)->setNotes($notes);
        $manager->persist($r);
    }
}
