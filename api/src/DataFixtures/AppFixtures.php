<?php

namespace App\DataFixtures;

use App\Entity\CommonName;
use App\Entity\Family;
use App\Entity\Kingdoms\BirdSpecies;
use App\Entity\Kingdoms\FungusSpecies;
use App\Entity\Kingdoms\TreeSpecies;
use App\Entity\Relationship;
use App\Entity\RelationshipTranslation;
use App\Entity\Species;
use App\Entity\SpeciesTranslation;
use App\Enum\Kingdom;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // ------------------------------------------------------------------ //
        // Families
        // ------------------------------------------------------------------ //

        $accipitridae = $this->family($manager, 'Accipitridae', Kingdom::Bird);
        $corvidae = $this->family($manager, 'Corvidae', Kingdom::Bird);
        $picidae = $this->family($manager, 'Picidae', Kingdom::Bird);
        $fringillidae = $this->family($manager, 'Fringillidae', Kingdom::Bird);
        $paridae = $this->family($manager, 'Paridae', Kingdom::Bird);
        $oriolidae = $this->family($manager, 'Oriolidae', Kingdom::Bird);
        $sittidae = $this->family($manager, 'Sittidae', Kingdom::Bird);
        $muscicapidae = $this->family($manager, 'Muscicapidae', Kingdom::Bird);
        $sturnidae = $this->family($manager, 'Sturnidae', Kingdom::Bird);
        $strigidae = $this->family($manager, 'Strigidae', Kingdom::Bird);
        $certhiidae = $this->family($manager, 'Certhiidae', Kingdom::Bird);
        $columbidae = $this->family($manager, 'Columbidae', Kingdom::Bird);
        $turdidae = $this->family($manager, 'Turdidae', Kingdom::Bird);
        $phylloscopidae = $this->family($manager, 'Phylloscopidae', Kingdom::Bird);
        $bombycillidae = $this->family($manager, 'Bombycillidae', Kingdom::Bird);

        $fagaceae = $this->family($manager, 'Fagaceae', Kingdom::Tree);
        $pinaceae = $this->family($manager, 'Pinaceae', Kingdom::Tree);
        $salicaceae = $this->family($manager, 'Salicaceae', Kingdom::Tree);
        $betulaceae = $this->family($manager, 'Betulaceae', Kingdom::Tree);
        $taxaceae = $this->family($manager, 'Taxaceae', Kingdom::Tree);
        $rosaceae = $this->family($manager, 'Rosaceae', Kingdom::Tree);
        $adoxaceae = $this->family($manager, 'Adoxaceae', Kingdom::Tree);
        $oleaceae = $this->family($manager, 'Oleaceae', Kingdom::Tree);
        $santalaceae = $this->family($manager, 'Santalaceae', Kingdom::Tree);

        $boletaceae = $this->family($manager, 'Boletaceae', Kingdom::Fungus);
        $cantharellaceae = $this->family($manager, 'Cantharellaceae', Kingdom::Fungus);
        $amanitaceae = $this->family($manager, 'Amanitaceae', Kingdom::Fungus);
        $suillaceae = $this->family($manager, 'Suillaceae', Kingdom::Fungus);
        $hydnangiaceae = $this->family($manager, 'Hydnangiaceae', Kingdom::Fungus);
        $hymenochaetaceae = $this->family($manager, 'Hymenochaetaceae', Kingdom::Fungus);
        $physalacriaceae = $this->family($manager, 'Physalacriaceae', Kingdom::Fungus);
        $hericiaceae = $this->family($manager, 'Hericiaceae', Kingdom::Fungus);
        $fomitopsidaceae = $this->family($manager, 'Fomitopsidaceae', Kingdom::Fungus);
        $sparassidaceae = $this->family($manager, 'Sparassidaceae', Kingdom::Fungus);
        $auriculariaceae = $this->family($manager, 'Auriculariaceae', Kingdom::Fungus);
        $hypoxylaceae = $this->family($manager, 'Hypoxylaceae', Kingdom::Fungus);
        $fistulinaceae = $this->family($manager, 'Fistulinaceae', Kingdom::Fungus);
        $polyporaceae = $this->family($manager, 'Polyporaceae', Kingdom::Fungus);
        $parmeliaceae = $this->family($manager, 'Parmeliaceae', Kingdom::Fungus);
        $paxillaceae = $this->family($manager, 'Paxillaceae', Kingdom::Fungus);
        $russulaceae = $this->family($manager, 'Russulaceae', Kingdom::Fungus);
        $strophariaceae = $this->family($manager, 'Strophariaceae', Kingdom::Fungus);
        $tuberaceae = $this->family($manager, 'Tuberaceae', Kingdom::Fungus);

        // ------------------------------------------------------------------ //
        // Species | Birds
        // ------------------------------------------------------------------ //

        $jay = $this->species($manager, 'Garrulus glandarius', $corvidae, 'LC', 'Deciduous and mixed woodland', wingspan: 54.0);
        $this->names($manager, $jay, 'Eurasian Jay', 'Geai des chênes');
        $this->translate($manager, $jay, 'fr', 'Forêts de feuillus et mixtes');

        $woodpecker = $this->species($manager, 'Dendrocopos major', $picidae, 'LC', 'Woodland, parks, gardens', wingspan: 36.0);
        $this->names($manager, $woodpecker, 'Great Spotted Woodpecker', 'Pic épeiche');
        $this->translate($manager, $woodpecker, 'fr', 'Forêts, parcs, jardins');

        $crossbill = $this->species($manager, 'Loxia curvirostra', $fringillidae, 'LC', 'Coniferous forest', wingspan: 29.0);
        $this->names($manager, $crossbill, 'Red Crossbill', 'Bec-croisé des sapins');
        $this->translate($manager, $crossbill, 'fr', 'Forêts de conifères');

        $crestedTit = $this->species($manager, 'Lophophanes cristatus', $paridae, 'LC', 'Coniferous and mixed forest', wingspan: 18.0);
        $this->names($manager, $crestedTit, 'Crested Tit', 'Mésange huppée');
        $this->translate($manager, $crestedTit, 'fr', 'Forêts de conifères et mixtes');

        $greatTit = $this->species($manager, 'Parus major', $paridae, 'LC', 'Woodland, parks, gardens, hedgerows', wingspan: 24.0);
        $this->names($manager, $greatTit, 'Great Tit', 'Mésange charbonnière');
        $this->translate($manager, $greatTit, 'fr', 'Forêts, parcs, jardins, haies');

        $oriole = $this->species($manager, 'Oriolus oriolus', $oriolidae, 'LC', 'Tall deciduous woodland, riparian forest, orchards', wingspan: 44.0);
        $this->names($manager, $oriole, 'Golden Oriole', 'Loriot d\'Europe');
        $this->translate($manager, $oriole, 'fr', 'Grandes forêts de feuillus, forêts riveraines, vergers');

        $nuthatch = $this->species($manager, 'Sitta europaea', $sittidae, 'LC', 'Mature deciduous woodland, parks', wingspan: 27.0);
        $this->names($manager, $nuthatch, 'Eurasian Nuthatch', 'Sittelle torchepot');
        $this->translate($manager, $nuthatch, 'fr', 'Forêts de feuillus matures, parcs');

        $robin = $this->species($manager, 'Erithacus rubecula', $muscicapidae, 'LC', 'Woodland, gardens, hedgerows', wingspan: 20.0);
        $this->names($manager, $robin, 'European Robin', 'Rouge-gorge familier');
        $this->translate($manager, $robin, 'fr', 'Forêts, jardins, haies');

        $starling = $this->species($manager, 'Sturnus vulgaris', $sturnidae, 'LC', 'Farmland, woodland edge, urban areas', wingspan: 37.0);
        $this->names($manager, $starling, 'Common Starling', 'Étourneau sansonnet');
        $this->translate($manager, $starling, 'fr', 'Terres agricoles, lisières forestières, zones urbaines');

        $tawnyOwl = $this->species($manager, 'Strix aluco', $strigidae, 'LC', 'Mature deciduous and mixed woodland, parks, large gardens', wingspan: 95.0);
        $this->names($manager, $tawnyOwl, 'Tawny Owl', 'Chouette hulotte');
        $this->translate($manager, $tawnyOwl, 'fr', 'Forêts de feuillus et mixtes matures, parcs, grands jardins');

        $blueTit = $this->species($manager, 'Cyanistes caeruleus', $paridae, 'LC', 'Deciduous woodland, parks, gardens, hedgerows', wingspan: 19.0);
        $this->names($manager, $blueTit, 'Eurasian Blue Tit', 'Mésange bleue');
        $this->translate($manager, $blueTit, 'fr', 'Forêts de feuillus, parcs, jardins, haies');

        $woodWarbler = $this->species($manager, 'Phylloscopus sibilatrix', $phylloscopidae, 'LC', 'Mature deciduous woodland with closed canopy and sparse ground cover', wingspan: 21.0);
        $this->names($manager, $woodWarbler, 'Wood Warbler', 'Pouillot siffleur');
        $this->translate($manager, $woodWarbler, 'fr', 'Forêts de feuillus matures à canopée fermée et couverture au sol éparse');

        $treecreeper = $this->species($manager, 'Certhia familiaris', $certhiidae, 'LC', 'Coniferous and mixed woodland, especially with rough-barked conifers', wingspan: 18.0);
        $this->names($manager, $treecreeper, 'Eurasian Treecreeper', 'Grimpereau des bois');
        $this->translate($manager, $treecreeper, 'fr', 'Forêts de conifères et mixtes, notamment avec des conifères à écorce rugueuse');

        $shortToedTreecreeper = $this->species($manager, 'Certhia brachydactyla', $certhiidae, 'LC', 'Mature deciduous woodland, parks, orchards', wingspan: 18.0);
        $this->names($manager, $shortToedTreecreeper, 'Short-toed Treecreeper', 'Grimpereau des jardins');
        $this->translate($manager, $shortToedTreecreeper, 'fr', 'Forêts de feuillus matures, parcs, vergers');

        $stockDove = $this->species($manager, 'Columba oenas', $columbidae, 'LC', 'Mature deciduous woodland, farmland with veteran trees', wingspan: 60.0);
        $this->names($manager, $stockDove, 'Stock Dove', 'Pigeon colombin');
        $this->translate($manager, $stockDove, 'fr', 'Forêts de feuillus matures, terres agricoles avec arbres vétérans');

        $hawfinch = $this->species($manager, 'Coccothraustes coccothraustes', $fringillidae, 'LC', 'Mature deciduous woodland, orchards, parks with Hornbeam or Cherry', wingspan: 32.0);
        $this->names($manager, $hawfinch, 'Hawfinch', 'Grosbec casse-noyaux');
        $this->translate($manager, $hawfinch, 'fr', 'Forêts de feuillus matures, vergers, parcs avec Charme ou Cerisier');

        $brambling = $this->species($manager, 'Fringilla montifringilla', $fringillidae, 'LC', 'Boreal birch and conifer forest (breeding); Beech woodland (wintering)', wingspan: 26.0);
        $this->names($manager, $brambling, 'Brambling', 'Pinson du Nord');
        $this->translate($manager, $brambling, 'fr', 'Forêts boréales de bouleau et de conifères (nidification) ; hêtraies (hivernage)');

        $mistleThrush = $this->species($manager, 'Turdus viscivorus', $turdidae, 'LC', 'Open woodland, woodland edge, parks, upland moors', wingspan: 42.0);
        $this->names($manager, $mistleThrush, 'Mistle Thrush', 'Grive draine');
        $this->translate($manager, $mistleThrush, 'fr', 'Forêts ouvertes, lisières forestières, parcs, landes d\'altitude');

        $blackbird = $this->species($manager, 'Turdus merula', $turdidae, 'LC', 'Woodland, gardens, hedgerows, parks. One of Europe\'s most adaptable birds', wingspan: 34.0);
        $this->names($manager, $blackbird, 'Common Blackbird', 'Merle noir');
        $this->translate($manager, $blackbird, 'fr', 'Forêts, jardins, haies, parcs. L\'un des oiseaux les plus adaptables d\'Europe');

        $greenWoodpecker = $this->species($manager, 'Picus viridis', $picidae, 'LC', 'Deciduous woodland, parkland, and orchards with open ground for ant foraging', wingspan: 40.0);
        $this->names($manager, $greenWoodpecker, 'European Green Woodpecker', 'Pic vert');
        $this->translate($manager, $greenWoodpecker, 'fr', 'Forêts de feuillus, parcs et vergers avec sol ouvert pour la recherche de fourmis');

        $waxwing = $this->species($manager, 'Bombycilla garrulus', $bombycillidae, 'LC', 'Boreal conifer and birch forest (breeding); irruptive winter visitor to woodland edge, parks, and berry-bearing trees', wingspan: 35.0);
        $this->names($manager, $waxwing, 'Bohemian Waxwing', 'Jaseur boréal');
        $this->translate($manager, $waxwing, 'fr', 'Forêts boréales de conifères et de bouleaux (nidification) ; visiteur hivernant irruptif en lisières forestières, parcs et arbres à baies');

        $blackWoodpecker = $this->species($manager, 'Dryocopus martius', $picidae, 'LC', 'Mature beech and pine forest with large-diameter trees; requires extensive home range', wingspan: 68.0);
        $this->names($manager, $blackWoodpecker, 'Black Woodpecker', 'Pic noir');
        $this->translate($manager, $blackWoodpecker, 'fr', 'Hêtraies et pinèdes matures avec des arbres de grand diamètre ; nécessite un vaste domaine vital');

        $honeyBuzzard = $this->species($manager, 'Pernis apivorus', $accipitridae, 'LC', 'Mature deciduous and mixed woodland, forest edge, with open foraging ground', wingspan: 135.0);
        $this->names($manager, $honeyBuzzard, 'Honey Buzzard', 'Bondrée apivore');
        $this->translate($manager, $honeyBuzzard, 'fr', 'Forêts de feuillus et mixtes matures, lisières forestières, avec terrain de chasse ouvert');

        $wryneck = $this->species($manager, 'Jynx torquilla', $picidae, 'LC', 'Open woodland, orchards, parkland, and woodland edge with old trees bearing existing cavities', wingspan: 27.0);
        $this->names($manager, $wryneck, 'Wryneck', 'Torcol fourmilier');
        $this->translate($manager, $wryneck, 'fr', 'Forêts ouvertes, vergers, parcs et lisières forestières avec de vieux arbres présentant des cavités existantes');

        $spottedNutcracker = $this->species($manager, 'Nucifraga caryocatactes', $corvidae, 'LC', 'Montane and boreal coniferous forest, especially Norway Spruce and Swiss Stone Pine stands', wingspan: 52.0);
        $this->names($manager, $spottedNutcracker, 'Spotted Nutcracker', 'Cassenoix moucheté');
        $this->translate($manager, $spottedNutcracker, 'fr', 'Forêts de conifères montagnardes et boréales, notamment à Épicéa commun et Pin cembro');

        // ------------------------------------------------------------------ //
        // Species | Trees
        // ------------------------------------------------------------------ //

        $oak = $this->species($manager, 'Quercus robur', $fagaceae, 'LC', 'Lowland deciduous woodland, hedgerows', maxHeight: 40.0);
        $this->names($manager, $oak, 'Pedunculate Oak', 'Chêne pédonculé');
        $this->translate($manager, $oak, 'fr', 'Forêts de feuillus de plaine, haies');

        $pine = $this->species($manager, 'Pinus sylvestris', $pinaceae, 'LC', 'Boreal and montane coniferous forest', maxHeight: 35.0);
        $this->names($manager, $pine, 'Scots Pine', 'Pin sylvestre');
        $this->translate($manager, $pine, 'fr', 'Forêts de conifères boréales et montagnardes');

        $poplar = $this->species($manager, 'Populus nigra', $salicaceae, 'NT', 'Riparian corridors, floodplains, river banks', maxHeight: 30.0);
        $this->names($manager, $poplar, 'Black Poplar', 'Peuplier noir');
        $this->translate($manager, $poplar, 'fr', 'Corridors riverains, plaines inondables, berges de rivières');

        $birch = $this->species($manager, 'Betula pendula', $betulaceae, 'LC', 'Heathland, open woodland, moorland', maxHeight: 25.0);
        $this->names($manager, $birch, 'Silver Birch', 'Bouleau verruqueux');
        $this->translate($manager, $birch, 'fr', 'Landes, forêts ouvertes, tourbières');

        $beech = $this->species($manager, 'Fagus sylvatica', $fagaceae, 'LC', 'Temperate deciduous forest on well-drained soils', maxHeight: 45.0);
        $this->names($manager, $beech, 'European Beech', 'Hêtre commun');
        $this->translate($manager, $beech, 'fr', 'Forêts tempérées de feuillus sur sols bien drainés');

        $hornbeam = $this->species($manager, 'Carpinus betulus', $betulaceae, 'LC', 'Mixed deciduous woodland, often understorey beneath Oak and Beech', maxHeight: 30.0);
        $this->names($manager, $hornbeam, 'Hornbeam', 'Charme commun');
        $this->translate($manager, $hornbeam, 'fr', 'Forêts de feuillus mixtes, souvent en sous-étage sous Chêne et Hêtre');

        $yew = $this->species($manager, 'Taxus baccata', $taxaceae, 'LC', 'Ancient woodland, chalk downland, churchyards; extremely long-lived', maxHeight: 20.0);
        $this->names($manager, $yew, 'Common Yew', 'If commun');
        $this->translate($manager, $yew, 'fr', 'Forêts anciennes, coteaux calcaires, cimetières ; extrêmement longévif');

        $rowan = $this->species($manager, 'Sorbus aucuparia', $rosaceae, 'LC', 'Upland woodland, moorland, mountain slopes. Highly tolerant of poor soils', maxHeight: 15.0);
        $this->names($manager, $rowan, 'Rowan', 'Sorbier des oiseleurs');
        $this->translate($manager, $rowan, 'fr', 'Forêts d\'altitude, landes, versants montagnards. Très tolérant sur sols pauvres');

        $elder = $this->species($manager, 'Sambucus nigra', $adoxaceae, 'LC', 'Woodland edge, hedgerows, disturbed ground, riparian scrub', maxHeight: 10.0);
        $this->names($manager, $elder, 'Elder', 'Sureau noir');
        $this->translate($manager, $elder, 'fr', 'Lisières forestières, haies, terrains perturbés, fourrés riverains');

        $ash = $this->species($manager, 'Fraxinus excelsior', $oleaceae, 'LC', 'Mixed deciduous woodland, hedgerows, river banks. Threatened by Ash Dieback', maxHeight: 40.0);
        $this->names($manager, $ash, 'European Ash', 'Frêne commun');
        $this->translate($manager, $ash, 'fr', 'Forêts de feuillus mixtes, haies, berges. Menacé par la chalarose du frêne');

        $aspen = $this->species($manager, 'Populus tremula', $salicaceae, 'LC', 'Woodland clearings, moorland edge, montane scrub. Fast-growing pioneer', maxHeight: 25.0);
        $this->names($manager, $aspen, 'Aspen', 'Tremble');
        $this->translate($manager, $aspen, 'fr', 'Clairières forestières, lisières de landes, fourrés montagnards. Pionnier à croissance rapide');

        $mistletoe = $this->species($manager, 'Viscum album', $santalaceae, 'LC', 'Obligate hemiparasite of broadleaved trees; found in parkland, orchards, and open woodland wherever host species grow', maxHeight: 1.0);
        $this->names($manager, $mistletoe, 'European Mistletoe', 'Gui commun');
        $this->translate($manager, $mistletoe, 'fr', 'Hémiparasite obligatoire des arbres feuillus ; présent dans les parcs, vergers et forêts ouvertes où poussent ses espèces hôtes');

        $spruce = $this->species($manager, 'Picea abies', $pinaceae, 'LC', 'Dominant tree of boreal and montane coniferous forest across northern and central Europe', maxHeight: 55.0);
        $this->names($manager, $spruce, 'Norway Spruce', 'Épicéa commun');
        $this->translate($manager, $spruce, 'fr', 'Arbre dominant des forêts de conifères boréales et montagnardes d\'Europe du Nord et centrale');

        // ------------------------------------------------------------------ //
        // Species | Fungi
        // ------------------------------------------------------------------ //

        $pennyBun = $this->species($manager, 'Boletus edulis', $boletaceae, null, 'Broadleaf and coniferous woodland soil', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $pennyBun, 'Penny Bun', 'Cèpe de Bordeaux');
        $this->translate($manager, $pennyBun, 'fr', 'Sols de forêts de feuillus et de conifères', 'Ectomycorhizien, sol');

        $chanterelle = $this->species($manager, 'Cantharellus cibarius', $cantharellaceae, null, 'Deciduous and coniferous woodland soil', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $chanterelle, 'Chanterelle', 'Girolle');
        $this->translate($manager, $chanterelle, 'fr', 'Sols de forêts de feuillus et de conifères', 'Ectomycorhizien, sol');

        $flyAgaric = $this->species($manager, 'Amanita muscaria', $amanitaceae, null, 'Woodland soil near birch, oak, pine', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $flyAgaric, 'Fly Agaric', 'Amanite tue-mouches');
        $this->translate($manager, $flyAgaric, 'fr', 'Sol forestier près du bouleau, du chêne, du pin', 'Ectomycorhizien, sol');

        $slipperyJack = $this->species($manager, 'Suillus luteus', $suillaceae, null, 'Soil under Scots Pine', substrate: 'Ectomycorrhizal, soil under pine');
        $this->names($manager, $slipperyJack, 'Slippery Jack', 'Bolet jaune');
        $this->translate($manager, $slipperyJack, 'fr', 'Sol sous Pin sylvestre', 'Ectomycorhizien, sol sous pin');

        $birchBolete = $this->species($manager, 'Leccinum scabrum', $boletaceae, null, 'Soil under birch', substrate: 'Ectomycorrhizal, obligate birch associate');
        $this->names($manager, $birchBolete, 'Brown Birch Bolete', 'Bolet rude');
        $this->translate($manager, $birchBolete, 'fr', 'Sol sous bouleau', 'Ectomycorhizien, associé obligatoire du bouleau');

        $amethystDeceiver = $this->species($manager, 'Laccaria amethystina', $hydnangiaceae, null, 'Damp deciduous and coniferous woodland soil', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $amethystDeceiver, 'Amethyst Deceiver', 'Laccaire améthyste');
        $this->translate($manager, $amethystDeceiver, 'fr', 'Sol humide de forêts de feuillus et de conifères', 'Ectomycorhizien, sol');

        $oakBracket = $this->species($manager, 'Inonotus dryadeus', $hymenochaetaceae, null, 'Base of mature oak trunks', substrate: 'Parasitic, decaying heartwood');
        $this->names($manager, $oakBracket, 'Oak Bracket', 'Inonotus des chênes');
        $this->translate($manager, $oakBracket, 'fr', 'Base des troncs de chênes matures', 'Parasite, aubier en décomposition');

        $porcelainFungus = $this->species($manager, 'Oudemansiella mucida', $physalacriaceae, null, 'Dead and dying Beech branches and trunks', substrate: 'Saprotrophic, dead Beech wood');
        $this->names($manager, $porcelainFungus, 'Porcelain Fungus', 'Oudemansiella muqueux');
        $this->translate($manager, $porcelainFungus, 'fr', 'Branches et troncs de hêtres morts ou mourants', 'Saprotrophe, bois mort de hêtre');

        $lionsMane = $this->species($manager, 'Hericium erinaceus', $hericiaceae, null, 'Veteran Beech and Oak heartwood. UK Priority Species', substrate: 'Parasitic/saprotrophic, veteran deciduous heartwood');
        $this->names($manager, $lionsMane, 'Lion\'s Mane', 'Hérisson de mer');
        $this->translate($manager, $lionsMane, 'fr', 'Aubier de hêtres et chênes vétérans. Espèce prioritaire au Royaume-Uni', 'Parasite/saprotrophe, aubier de feuillus vétérans');

        $birchPolypore = $this->species($manager, 'Fomitopsis betulina', $fomitopsidaceae, null, 'Dead Silver Birch trunks and branches', substrate: 'Parasitic/saprotrophic, obligate Birch associate');
        $this->names($manager, $birchPolypore, 'Birch Polypore', 'Polypore du bouleau');
        $this->translate($manager, $birchPolypore, 'fr', 'Troncs et branches de Bouleaux argentés morts', 'Parasite/saprotrophe, associé obligatoire du bouleau');

        $cauliflowerFungus = $this->species($manager, 'Sparassis crispa', $sparassidaceae, null, 'Base of Scots Pine and other conifers', substrate: 'Parasitic, Scots Pine root associate');
        $this->names($manager, $cauliflowerFungus, 'Cauliflower Fungus', 'Sparassis crépu');
        $this->translate($manager, $cauliflowerFungus, 'fr', 'Base des Pins sylvestres et autres conifères', 'Parasite, associé racinaire du Pin sylvestre');

        $jellyEar = $this->species($manager, 'Auricularia auricula-judae', $auriculariaceae, null, 'Dead and dying Elder wood, occasionally other deciduous species', substrate: 'Saprotrophic, primarily Elder wood');
        $this->names($manager, $jellyEar, 'Jelly Ear', 'Oreille de Judas');
        $this->translate($manager, $jellyEar, 'fr', 'Bois de sureau mort ou mourant, parfois d\'autres essences de feuillus', 'Saprotrophe, principalement bois de sureau');

        $kingsAlfred = $this->species($manager, 'Daldinia concentrica', $hypoxylaceae, null, 'Dead Ash wood. Threatened alongside host by Ash Dieback', substrate: 'Saprotrophic, dead Ash wood');
        $this->names($manager, $kingsAlfred, 'King Alfred\'s Cakes', 'Daldinia concentrique');
        $this->translate($manager, $kingsAlfred, 'fr', 'Bois de frêne mort. Menacé en même temps que son hôte par la chalarose du frêne', 'Saprotrophe, bois de frêne mort');

        $beefsteak = $this->species($manager, 'Fistulina hepatica', $fistulinaceae, null, 'Veteran Oak and Sweet Chestnut heartwood', substrate: 'Parasitic, veteran Oak heartwood. Creates prized brown oak timber');
        $this->names($manager, $beefsteak, 'Beefsteak Fungus', 'Langue de bœuf');
        $this->translate($manager, $beefsteak, 'fr', 'Aubier de chênes et châtaigniers vétérans', 'Parasite, aubier de chêne vétéran. Produit le précieux bois de chêne brun');

        $chickenOfWoods = $this->species($manager, 'Laetiporus sulphureus', $polyporaceae, null, 'Oak, Sweet Chestnut, Yew and other veteran deciduous trees', substrate: 'Parasitic/saprotrophic, hardwood heartwood');
        $this->names($manager, $chickenOfWoods, 'Chicken of the Woods', 'Polypore soufré');
        $this->translate($manager, $chickenOfWoods, 'fr', 'Chêne, Châtaignier, If et autres arbres de feuillus vétérans', 'Parasite/saprotrophe, aubier de feuillus');

        $honeyFungus = $this->species($manager, 'Armillaria mellea', $physalacriaceae, null, 'Roots and stumps of deciduous trees, especially Oak', substrate: 'Parasitic/saprotrophic, root and stump pathogen');
        $this->names($manager, $honeyFungus, 'Honey Fungus', 'Armillaire couleur de miel');
        $this->translate($manager, $honeyFungus, 'fr', 'Racines et souches d\'arbres de feuillus, notamment le chêne', 'Parasite/saprotrophe, pathogène des racines et des souches');

        $brownRollrim = $this->species($manager, 'Paxillus involutus', $paxillaceae, null, 'Soil under Silver Birch and other deciduous trees', substrate: 'Ectomycorrhizal, birch-associated soil');
        $this->names($manager, $brownRollrim, 'Brown Rollrim', 'Paxille enroulé');
        $this->translate($manager, $brownRollrim, 'fr', 'Sol sous Bouleau argenté et autres arbres de feuillus', 'Ectomycorhizien, sol associé au bouleau');

        $summerTruffle = $this->species($manager, 'Tuber aestivum', $tuberaceae, null, 'Calcareous broadleaf woodland soil, hypogeous under Hornbeam, Beech, and Oak', substrate: 'Ectomycorrhizal, hypogeous (subterranean)');
        $this->names($manager, $summerTruffle, 'Summer Truffle', 'Truffe d\'été');
        $this->translate($manager, $summerTruffle, 'fr', 'Sol calcaire de forêts de feuillus, hypogé sous Charme, Hêtre et Chêne', 'Ectomycorhizien, hypogé (souterrain)');

        $russulaSickener = $this->species($manager, 'Russula emetica', $russulaceae, null, 'Acidic coniferous and mixed woodland, especially boggy pine-birch stands', substrate: 'Ectomycorrhizal, soil');
        $this->names($manager, $russulaSickener, 'The Sickener', 'Russule émétique');
        $this->translate($manager, $russulaSickener, 'fr', 'Forêts de conifères et mixtes acides, notamment les pessières-boulaies marécageuses', 'Ectomycorhizien, sol');

        $oakbugMilkcap = $this->species($manager, 'Lactarius quietus', $russulaceae, null, 'Deciduous woodland floor, near-exclusively under Pedunculate Oak', substrate: 'Ectomycorrhizal, soil. Near-obligate Quercus associate');
        $this->names($manager, $oakbugMilkcap, 'Oakbug Milkcap', 'Lactaire tranquille');
        $this->translate($manager, $oakbugMilkcap, 'fr', 'Sol de forêts de feuillus, presque exclusivement sous Chêne pédonculé', 'Ectomycorhizien, sol. Associé quasi obligatoire du Quercus');

        $woollyMilkcap = $this->species($manager, 'Lactarius torminosus', $russulaceae, null, 'Birch woodland, heathland, and mixed pine-birch forest', substrate: 'Ectomycorrhizal, obligate Betula associate');
        $this->names($manager, $woollyMilkcap, 'Woolly Milkcap', 'Lactaire tormineux');
        $this->translate($manager, $woollyMilkcap, 'fr', 'Forêts de bouleaux, landes et forêts mixtes pin-bouleau', 'Ectomycorhizien, associé obligatoire du Betula');

        $willowBracket = $this->species($manager, 'Phellinus igniarius', $hymenochaetaceae, null, 'Living trunks of Aspen, Poplar, and Willow in wet woodland and riparian margins', substrate: 'Parasitic, causes white heart rot in living hardwood');
        $this->names($manager, $willowBracket, 'Willow Bracket', 'Polypore igné');
        $this->translate($manager, $willowBracket, 'fr', 'Troncs vivants de Tremble, Peuplier et Saule en forêts humides et lisières riveraines', 'Parasite, provoque la carie blanche du cœur des feuillus vivants');

        $paleChanterelle = $this->species($manager, 'Cantharellus pallens', $cantharellaceae, null, 'Calcareous beech woodland on well-drained soils', substrate: 'Ectomycorrhizal, soil under Fagus');
        $this->names($manager, $paleChanterelle, 'Pale Chanterelle', 'Chanterelle pâle');
        $this->translate($manager, $paleChanterelle, 'fr', 'Hêtraies calcaires sur sols bien drainés', 'Ectomycorhizien, sol sous Fagus');

        $tinderFungus = $this->species($manager, 'Fomes fomentarius', $polyporaceae, null, 'Living and dead Beech and Birch trunks throughout temperate and boreal Europe', substrate: 'Parasitic/saprotrophic, white rot of hardwood');
        $this->names($manager, $tinderFungus, 'Tinder Fungus', 'Amadouvier');
        $this->translate($manager, $tinderFungus, 'fr', 'Troncs de hêtres et de bouleaux vivants et morts à travers l\'Europe tempérée et boréale', 'Parasite/saprotrophe, carie blanche des feuillus');

        $orangeBolete = $this->species($manager, 'Leccinum aurantiacum', $boletaceae, null, 'Soil under Aspen and Black Poplar in riparian and mixed woodland', substrate: 'Ectomycorrhizal, near-obligate Populus associate');
        $this->names($manager, $orangeBolete, 'Orange Birch Bolete', 'Bolet orangé');
        $this->translate($manager, $orangeBolete, 'fr', 'Sol sous Tremble et Peuplier noir en forêts riveraines et mixtes', 'Ectomycorhizien, associé quasi obligatoire du Populus');

        $aspenBracket = $this->species($manager, 'Phellinus tremulae', $hymenochaetaceae, null, 'Living Aspen trunks in boreal and montane mixed woodland; strictly host-specific', substrate: 'Parasitic, white heart rot of living Aspen');
        $this->names($manager, $aspenBracket, 'Aspen Bracket', 'Polypore du tremble');
        $this->translate($manager, $aspenBracket, 'fr', 'Troncs de Tremble vivants en forêts mixtes boréales et montagnardes ; strictement hôte-spécifique', 'Parasite, carie blanche du cœur du Tremble vivant');

        $oakmoss = $this->species($manager, 'Evernia prunastri', $parmeliaceae, null, 'Bark of broadleaved and coniferous trees in open woodland, hedgerows, and upland scrub', substrate: 'Lichenised fungus, epiphytic on bark');
        $this->names($manager, $oakmoss, 'Oakmoss Lichen', 'Mousse de chêne');
        $this->translate($manager, $oakmoss, 'fr', 'Écorce de feuillus et de conifères dans les forêts ouvertes, les haies et les fourrés d\'altitude', 'Champignon lichénisé, épiphyte sur écorce');

        $hornbeamMilkcap = $this->species($manager, 'Lactarius circellatus', $russulaceae, null, 'Calcareous deciduous woodland floor, near-exclusively under Hornbeam', substrate: 'Ectomycorrhizal, near-obligate Carpinus associate');
        $this->names($manager, $hornbeamMilkcap, 'Hornbeam Milkcap', 'Lactaire du charme');
        $this->translate($manager, $hornbeamMilkcap, 'fr', 'Sol de forêts de feuillus calcaires, presque exclusivement sous Charme', 'Ectomycorhizien, associé quasi obligatoire du Carpinus');

        $poplarFieldcap = $this->species($manager, 'Cyclocybe cylindracea', $strophariaceae, null, 'Dead and dying Poplar and Aspen wood in riparian and mixed woodland; also occasional on elder', substrate: 'Saprotrophic/weakly parasitic, dead Populus wood');
        $this->names($manager, $poplarFieldcap, 'Poplar Fieldcap', 'Pholiote du peuplier');
        $this->translate($manager, $poplarFieldcap, 'fr', 'Bois de Peuplier et Tremble mort ou mourant en forêt riveraine et mixte ; parfois sur sureau', 'Saprotrophe/faiblement parasitaire, bois mort de Populus');

        // ------------------------------------------------------------------ //
        // Ecological relationships
        // ------------------------------------------------------------------ //

        // Oak
        $r = $this->rel($manager, $jay, $oak, 'disperses_seeds_of', 'Primary disperser of oak across Europe. Buries acorns and forgets many of them.');
        $this->relTranslate($manager, $r, 'fr', 'Principal disperseur de chênes en Europe. Enterre des glands et en oublie une grande partie.');

        $r = $this->rel($manager, $woodpecker, $oak, 'nests_in', 'Excavates nesting cavities in mature oak trunks.');
        $this->relTranslate($manager, $r, 'fr', 'Creuse des cavités de nidification dans les troncs de chênes matures.');

        $r = $this->rel($manager, $pennyBun, $oak, 'mycorrhiza_with', 'Ectomycorrhizal partner. Extends root reach in exchange for sugars.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien. Étend la portée des racines en échange de sucres.');

        $r = $this->rel($manager, $chanterelle, $oak, 'mycorrhiza_with', 'Ectomycorrhizal partner commonly found under oak.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien couramment trouvé sous les chênes.');

        $r = $this->rel($manager, $flyAgaric, $oak, 'mycorrhiza_with', 'Ectomycorrhizal partner of oak and birch.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien du chêne et du bouleau.');

        // Scots Pine
        $r = $this->rel($manager, $crossbill, $pine, 'feeds_on', 'Beak evolved specifically to extract seeds from closed pine cones. Nearly obligate on conifers.');
        $this->relTranslate($manager, $r, 'fr', 'Bec spécialement adapté pour extraire les graines des cônes de pin fermés. Presque exclusivement inféodé aux conifères.');

        $r = $this->rel($manager, $crestedTit, $pine, 'nests_in', 'Nests almost exclusively in dead Scots Pine wood. Rare outside conifer stands.');
        $this->relTranslate($manager, $r, 'fr', 'Niche presque exclusivement dans le bois de Pin sylvestre mort. Rare en dehors des peuplements de conifères.');

        $r = $this->rel($manager, $slipperyJack, $pine, 'mycorrhiza_with', 'Highly pine-specific ectomycorrhizal fungus. Rarely found away from Pinus species.');
        $this->relTranslate($manager, $r, 'fr', 'Champignon ectomycorhizien hautement spécifique du pin. Rarement trouvé loin des espèces de Pinus.');

        $r = $this->rel($manager, $flyAgaric, $pine, 'mycorrhiza_with', 'Also partners with pine. Sharing the dual oak/pine association.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire du pin également. Partage l\'association double chêne/pin.');

        // Black Poplar
        $r = $this->rel($manager, $oriole, $poplar, 'nests_in', 'Nests almost exclusively in tall riparian trees. Black Poplar along river corridors is the classic breeding habitat in France and southern Europe.');
        $this->relTranslate($manager, $r, 'fr', 'Niche presque exclusivement dans les grands arbres riverains. Le Peuplier noir le long des corridors fluviaux est l\'habitat de nidification classique en France et en Europe du Sud.');

        // Oak (additional birds)
        $r = $this->rel($manager, $greatTit, $oak, 'feeds_on', 'A keystone relationship: Great Tit populations track winter moth caterpillar peaks on oak. Timing of egg-laying has evolved to match oak bud-burst.');
        $this->relTranslate($manager, $r, 'fr', 'Une relation fondamentale : les populations de Mésange charbonnière suivent les pics de chenilles de la phalène d\'hiver sur le chêne. La ponte a évolué pour coïncider avec le débourrement du chêne.');

        $r = $this->rel($manager, $nuthatch, $oak, 'feeds_on', 'Caches acorns and invertebrates in oak bark crevices. Forages head-down along trunks in a manner unique among European birds.');
        $this->relTranslate($manager, $r, 'fr', 'Cache des glands et des invertébrés dans les fissures de l\'écorce du chêne. Cherche sa nourriture tête en bas le long des troncs, comportement unique parmi les oiseaux européens.');

        $r = $this->rel($manager, $nuthatch, $oak, 'nests_in', 'Uses natural holes in mature oaks. Plasters the entrance with mud to reduce the opening to fit its body exactly.');
        $this->relTranslate($manager, $r, 'fr', 'Utilise les cavités naturelles dans les chênes matures. Réduit l\'entrée avec de la boue pour l\'ajuster exactement à la taille de son corps.');

        $r = $this->rel($manager, $starling, $oak, 'nests_in', 'Colonises old woodpecker cavities in veteran oaks. One of the main secondary users of holes excavated by Great Spotted Woodpecker.');
        $this->relTranslate($manager, $r, 'fr', 'Colonise les anciennes cavités de pics dans les chênes vétérans. L\'un des principaux utilisateurs secondaires des trous creusés par le Pic épeiche.');

        $r = $this->rel($manager, $oriole, $oak, 'feeds_on', 'Forages on oak caterpillars (especially defoliating moth larvae) during the breeding season when insect demand is highest.');
        $this->relTranslate($manager, $r, 'fr', 'Se nourrit de chenilles du chêne (notamment les larves de lépidoptères défoliateurs) pendant la saison de reproduction, lorsque la demande en insectes est la plus forte.');

        // Silver Birch
        $r = $this->rel($manager, $birchBolete, $birch, 'mycorrhiza_with', 'Obligate ectomycorrhizal associate of birch. Virtually never found without a Betula host nearby.');
        $this->relTranslate($manager, $r, 'fr', 'Associé ectomycorhizien obligatoire du bouleau. Pratiquement jamais trouvé sans un hôte Betula à proximité.');

        $r = $this->rel($manager, $flyAgaric, $birch, 'mycorrhiza_with', 'The iconic fly agaric–birch association. Birch is its primary pioneer-woodland host alongside pine.');
        $this->relTranslate($manager, $r, 'fr', 'L\'association iconique amanite tue-mouches–bouleau. Le bouleau est son hôte principal en forêts pionnières, aux côtés du pin.');

        // European Beech
        $r = $this->rel($manager, $amethystDeceiver, $beech, 'mycorrhiza_with', 'Characteristic ectomycorrhizal fungus of beech woodland floors. Its violet colour makes it unmistakable in autumn litter.');
        $this->relTranslate($manager, $r, 'fr', 'Champignon ectomycorhizien caractéristique des sols de hêtraies. Sa couleur violette le rend inimitable dans la litière d\'automne.');

        // Oak (fungi | additional)
        $r = $this->rel($manager, $amethystDeceiver, $oak, 'mycorrhiza_with', 'Also forms mycorrhiza with oak, though less diagnostic than its beech association.');
        $this->relTranslate($manager, $r, 'fr', 'Forme également des mycorhizes avec le chêne, bien que moins diagnostique que son association avec le hêtre.');

        $r = $this->rel($manager, $oakBracket, $oak, 'grows_on', 'Parasitic bracket fungus that colonises the heartwood of veteran oaks, causing white rot at the root collar. Mature infected trees remain standing for decades and their soft wood attracts woodpeckers.');
        $this->relTranslate($manager, $r, 'fr', 'Champignon parasite en console qui colonise l\'aubier des chênes vétérans, provoquant une carie blanche au collet. Les arbres infectés matures restent debout pendant des décennies et leur bois ramolli attire les pics.');

        // Three-way link: Oak Bracket → Woodpecker
        $r = $this->rel($manager, $woodpecker, $oakBracket, 'feeds_on', 'Excavates infected oak wood weakened by Inonotus dryadeus to reach beetle larvae. Bracket-infected oaks are disproportionately represented in woodpecker foraging sites.');
        $this->relTranslate($manager, $r, 'fr', 'Creuse le bois de chêne infecté affaibli par Inonotus dryadeus pour atteindre les larves de coléoptères. Les chênes infectés par des polypores sont surreprésentés dans les sites de recherche alimentaire des pics.');

        // Tawny Owl
        $r = $this->rel($manager, $tawnyOwl, $oak, 'nests_in', 'Obligate cavity nester. Relies on large-diameter veteran oaks with natural hollows or old woodpecker excavations. One of the most extensively studied nest-site associations in European ornithology.');
        $this->relTranslate($manager, $r, 'fr', 'Nicheur obligatoire en cavité. Dépend des chênes vétérans de grand diamètre avec des cavités naturelles ou d\'anciennes excavations de pics. L\'une des associations de sites de nidification les plus étudiées en ornithologie européenne.');

        $r = $this->rel($manager, $tawnyOwl, $beech, 'nests_in', 'Also uses cavities in mature Beech, particularly in continental Europe where Beech replaces Oak as the dominant veteran tree.');
        $this->relTranslate($manager, $r, 'fr', 'Utilise également les cavités dans les hêtres matures, notamment en Europe continentale où le Hêtre remplace le Chêne comme arbre vétéran dominant.');

        // Blue Tit - oak phenology
        $r = $this->rel($manager, $blueTit, $oak, 'feeds_on', 'Nestling diet is dominated by oak caterpillars during the critical growth window. Blue Tit breeding phenology has evolved to synchronise with oak bud-burst - a flagship example in climate change ecology (Visser et al.; Charmantier et al. 2008).');
        $this->relTranslate($manager, $r, 'fr', 'L\'alimentation des poussins est dominée par les chenilles du chêne pendant la fenêtre de croissance critique. La phénologie de reproduction de la Mésange bleue a évolué pour se synchroniser avec le débourrement du chêne — un exemple phare en écologie du changement climatique (Visser et al. ; Charmantier et al. 2008).');

        // Wood Warbler - beech specialist
        $r = $this->rel($manager, $woodWarbler, $beech, 'nests_in', 'Breeds almost exclusively in mature Beech woodland with a closed canopy and bare, leaf-litter floor - one of the tightest habitat associations of any European warbler. UK populations have declined sharply as Beech woodland structure has changed.');
        $this->relTranslate($manager, $r, 'fr', 'Niche presque exclusivement dans les hêtraies matures à canopée fermée et sol nu couvert de litière — l\'une des associations habitat les plus étroites de toutes les fauvettes européennes. Les populations britanniques ont fortement décliné avec l\'évolution de la structure des hêtraies.');

        // Treecreepers
        $r = $this->rel($manager, $treecreeper, $pine, 'feeds_on', 'Forages under the rough scales of Scots Pine bark for spiders and insects; also nests behind loose bark slabs, a nesting habit unique to this family. The association with pine is particularly strong in Scottish Highland populations.');
        $this->relTranslate($manager, $r, 'fr', 'Cherche araignées et insectes sous les écailles rugueuses de l\'écorce du Pin sylvestre ; niche également derrière des plaques d\'écorce décollée, habitude unique à cette famille. L\'association avec le pin est particulièrement forte dans les populations des Highlands écossais.');

        $r = $this->rel($manager, $shortToedTreecreeper, $oak, 'feeds_on', 'The deciduous-woodland counterpart of the Common Treecreeper. The two species replace each other ecologically, with Short-toed specialising in the rough bark of Pedunculate Oak and other broadleaves across continental Europe.');
        $this->relTranslate($manager, $r, 'fr', 'Le pendant du Grimpereau des bois en forêt de feuillus. Les deux espèces se remplacent écologiquement, le Grimpereau des jardins se spécialisant dans l\'écorce rugueuse du Chêne pédonculé et d\'autres feuillus en Europe continentale.');

        // Stock Dove
        $r = $this->rel($manager, $stockDove, $oak, 'nests_in', 'Obligate cavity nester that cannot breed in open trees, entirely dependent on large natural hollows in veteran Pedunculate Oak. Unlike Woodpigeon, it has no alternative nest site. Population size is closely tied to veteran oak availability.');
        $this->relTranslate($manager, $r, 'fr', 'Nicheur obligatoire en cavité qui ne peut se reproduire dans des arbres ouverts, entièrement dépendant des grandes cavités naturelles dans les chênes pédonculés vétérans. Contrairement au Pigeon ramier, il n\'a pas d\'autre site de nidification. La taille de la population est étroitement liée à la disponibilité des chênes vétérans.');

        // Hawfinch + Hornbeam (the centrepiece coevolution story)
        $r = $this->rel($manager, $hawfinch, $hornbeam, 'feeds_on', 'The Hawfinch\'s beak generates approximately 50-70 kg of crushing force, sufficient to split Hornbeam nutlets that no other European passerine can open. This morphological specialisation is one of the most striking examples of beak-seed coevolution in European birds.');
        $this->relTranslate($manager, $r, 'fr', 'Le bec du Grosbec casse-noyaux génère environ 50 à 70 kg de force d\'écrasement, suffisants pour briser les akènes du Charme qu\'aucun autre passereau européen ne peut ouvrir. Cette spécialisation morphologique est l\'un des exemples les plus frappants de coévolution bec-graine chez les oiseaux européens.');

        // Brambling + Beech (irruption story)
        $r = $this->rel($manager, $brambling, $beech, 'feeds_on', 'Brambling flocks irrupt in millions across central Europe in Beech mast years, then largely absent in poor mast years. One of the most dramatic examples of nomadic irruption tied to a single food source in the Western Palearctic (Jenni 1987).');
        $this->relTranslate($manager, $r, 'fr', 'Des millions de Pinsons du Nord déferlent sur l\'Europe centrale lors des années de fructification du Hêtre, puis sont largement absents lors des mauvaises années. L\'un des exemples les plus spectaculaires d\'irruption nomade liée à une seule source alimentaire dans le Paléarctique occidental (Jenni 1987).');

        // Mistle Thrush
        $r = $this->rel($manager, $mistleThrush, $yew, 'feeds_on', 'Defends Yew berry crops aggressively in winter, chasing off Blackbirds and Fieldfares. A textbook example of resource-defense behaviour (Snow & Snow 1988). The Yew aril is consumed whole while the toxic seed passes unharmed.');
        $this->relTranslate($manager, $r, 'fr', 'Défend agressivement les récoltes de baies d\'If en hiver, chassant Merles noirs et Lithornes. Un exemple classique de comportement de défense des ressources (Snow & Snow 1988). L\'arille de l\'If est consommé entier tandis que la graine toxique passe sans dommage.');

        $r = $this->rel($manager, $mistleThrush, $rowan, 'feeds_on', 'Also defends Rowan berry crops in upland areas using the same resource-defense strategy; a key disperser of Rowan seeds into open habitats above the treeline.');
        $this->relTranslate($manager, $r, 'fr', 'Défend également les récoltes de baies de Sorbier dans les zones d\'altitude avec la même stratégie ; un disperseur clé des graines de Sorbier dans les habitats ouverts au-delà de la limite des arbres.');

        // Blackbird
        $r = $this->rel($manager, $blackbird, $elder, 'disperses_seeds_of', 'Consumes Elder berries in large quantities in late summer and autumn; seeds pass through the gut intact and are deposited in new locations. Blackbird is one of the primary dispersers of Elder across woodland edge and hedgerow habitats.');
        $this->relTranslate($manager, $r, 'fr', 'Consomme des baies de sureau en grande quantité à la fin de l\'été et en automne ; les graines traversent l\'intestin intactes et sont déposées dans de nouveaux endroits. Le Merle noir est l\'un des principaux disperseurs du sureau dans les lisières forestières et les haies.');

        $r = $this->rel($manager, $blackbird, $rowan, 'disperses_seeds_of', 'One of the most important Rowan dispersers in lowland Britain; strips berries quickly in autumn and deposits seeds across a wide radius.');
        $this->relTranslate($manager, $r, 'fr', 'L\'un des disperseurs de Sorbier les plus importants dans les basses terres ; dépouille rapidement les baies en automne et dépose les graines sur un large rayon.');

        // Aspen - woodpecker nesting
        $r = $this->rel($manager, $woodpecker, $aspen, 'nests_in', 'Excavates nest holes in Aspen more readily than in oak. The soft, fast-decaying wood requires significantly less effort. Aspen stands are disproportionately important for woodpecker nesting density relative to tree abundance.');
        $this->relTranslate($manager, $r, 'fr', 'Creuse des trous de nidification dans le Tremble plus facilement que dans le chêne. Le bois mou et à décomposition rapide demande nettement moins d\'effort. Les peuplements de Tremble sont disproportionnellement importants pour la densité de nidification des pics.');

        // Beech fungi
        $r = $this->rel($manager, $porcelainFungus, $beech, 'grows_on', 'Grows almost exclusively on dead and dying Beech wood. So diagnostic that it is a reliable indicator of Beech presence. The translucent, mucus-coated caps earn it the alternative name "beech ghost".');
        $this->relTranslate($manager, $r, 'fr', 'Pousse presque exclusivement sur le bois de Hêtre mort ou mourant. Si diagnostique qu\'il est un indicateur fiable de la présence du Hêtre. Ses chapeaux translucides et recouverts de mucus lui valent le surnom de « fantôme du hêtre ».');

        $r = $this->rel($manager, $lionsMane, $beech, 'grows_on', 'In Europe, found almost exclusively on veteran Beech heartwood; used as an indicator species for ancient Beech woodland continuity. Listed as a UK Priority Species and BAP species, its presence signals a woodland of exceptional ecological age.');
        $this->relTranslate($manager, $r, 'fr', 'En Europe, trouvé presque exclusivement dans l\'aubier de Hêtres vétérans ; utilisé comme espèce indicatrice de la continuité des anciennes hêtraies. Classé espèce prioritaire au Royaume-Uni, sa présence signale une forêt d\'un âge écologique exceptionnel.');

        // Silver Birch fungi (additional)
        $r = $this->rel($manager, $birchPolypore, $birch, 'grows_on', 'Obligate on Silver Birch, virtually never recorded on any other host. Causes a brown rot that softens the trunk; infected birches are preferentially selected by Great Spotted Woodpecker for nest excavation.');
        $this->relTranslate($manager, $r, 'fr', 'Obligatoire sur le Bouleau argenté, pratiquement jamais enregistré sur un autre hôte. Provoque une carie brune qui ramollit le tronc ; les bouleaux infectés sont préférentiellement sélectionnés par le Pic épeiche pour l\'excavation de nids.');

        $r = $this->rel($manager, $brownRollrim, $birch, 'mycorrhiza_with', 'Well-documented ectomycorrhizal associate of Silver Birch. Historically eaten across Europe before its cumulative haemolytic toxicity was established, a rare case of a mycorrhizal fungus proving fatal to humans.');
        $this->relTranslate($manager, $r, 'fr', 'Associé ectomycorhizien bien documenté du Bouleau argenté. Historiquement consommé en Europe avant que sa toxicité hémolytique cumulative ne soit établie, cas rare d\'un champignon mycorhizien mortel pour l\'homme.');

        // Birch Polypore → Woodpecker chain
        $r = $this->rel($manager, $woodpecker, $birchPolypore, 'feeds_on', 'Preferentially excavates Birch Polypore-infected Birch trunks, where the brown rot created by Fomitopsis betulina softens the wood sufficiently for cavity creation. A documented three-way chain: Birch → Birch Polypore → Woodpecker.');
        $this->relTranslate($manager, $r, 'fr', 'Creuse préférentiellement les troncs de Bouleau infectés par le Polypore du bouleau, où la carie brune créée par Fomitopsis betulina ramollit le bois pour la création de cavités. Une chaîne documentée : Bouleau → Polypore du bouleau → Pic.');

        // Scots Pine fungi (additional)
        $r = $this->rel($manager, $cauliflowerFungus, $pine, 'grows_on', 'A near-obligate root parasite of Scots Pine, fruiting at the tree\'s base as a spectacular cream-coloured mass of curling fronds. Causes a butt rot that can eventually kill the host, but infected trees may stand for many years.');
        $this->relTranslate($manager, $r, 'fr', 'Parasite racinaire quasi obligatoire du Pin sylvestre, fructifiant à la base de l\'arbre en une spectaculaire masse de frondes crépues couleur crème. Provoque une pourriture du pied pouvant finalement tuer l\'hôte, mais les arbres infectés peuvent rester debout de nombreuses années.');

        // Elder fungi
        $r = $this->rel($manager, $jellyEar, $elder, 'grows_on', 'The association is so strong that the fungus\'s folk name "Judas\'s Ear" refers to the Elder tree from which Judas Iscariot is said to have hanged himself. Near-obligate on Elder in practice, though occasional records exist on other hosts.');
        $this->relTranslate($manager, $r, 'fr', 'L\'association est si forte que le nom populaire « Oreille de Judas » fait référence au Sureau dont Judas Iscariote se serait pendu. Quasi obligatoire sur le Sureau en pratique, bien que des observations occasionnelles existent sur d\'autres hôtes.');

        // Ash fungi
        $r = $this->rel($manager, $kingsAlfred, $ash, 'grows_on', 'So closely associated with dead Ash wood that it is practically diagnostic of the species. The relationship carries conservation urgency, Ash Dieback (Hymenoscyphus fraxineus) threatens both the host tree and this fungus across Europe.');
        $this->relTranslate($manager, $r, 'fr', 'Si étroitement associé au bois de frêne mort qu\'il en est pratiquement diagnostique. La chalarose du frêne (Hymenoscyphus fraxineus) menace à la fois l\'arbre hôte et ce champignon à travers l\'Europe.');

        // Oak fungi (additional bracket species)
        $r = $this->rel($manager, $beefsteak, $oak, 'grows_on', 'Found almost exclusively on veteran Pedunculate Oak, where it causes a distinctive brown rot that ironically produces the prized "brown oak" timber sought by craftspeople. One of the most oak-faithful bracket fungi in Europe.');
        $this->relTranslate($manager, $r, 'fr', 'Trouvé presque exclusivement sur les Chênes pédonculés vétérans, où il provoque une carie brune distinctive produisant ironiquement le précieux « bois de chêne brun » recherché par les artisans. L\'un des champignons en console les plus fidèles au chêne en Europe.');

        $r = $this->rel($manager, $chickenOfWoods, $oak, 'grows_on', 'A flagship oak-associated bracket fungus, parasitising the heartwood of mature and veteran trees. Its vivid sulphur-yellow fruiting bodies can weigh over 40 kg and are conspicuous from a distance.');
        $this->relTranslate($manager, $r, 'fr', 'Un champignon en console emblématique associé au chêne, parasitant l\'aubier des arbres matures et vétérans. Ses carpophores d\'un jaune soufre vif peuvent peser plus de 40 kg et sont visibles de loin.');

        $r = $this->rel($manager, $honeyFungus, $oak, 'grows_on', 'One of the most significant woodland pathogens in Europe, spreads via black rhizomorphs through the soil and can kill mature oaks over several years. Simultaneously a decomposer of dead stumps and a parasite of living trees.');
        $this->relTranslate($manager, $r, 'fr', 'L\'un des pathogènes forestiers les plus importants en Europe, se propage via des rhizomorphes noirs dans le sol et peut tuer des chênes matures en quelques années. Simultanément décomposeur de souches mortes et parasite d\'arbres vivants.');

        // Viscum album (European Mistletoe)
        $r = $this->rel($manager, $mistleThrush, $mistletoe, 'disperses_seeds_of', 'Primary ornithochorous disperser; sticky seeds are wiped from the bill onto host branches after ingestion. The namesake mutualism from which the bird\'s English name derives (Snow & Snow 1988).');
        $this->relTranslate($manager, $r, 'fr', 'Principal disperseur ornithochore ; les graines collantes sont essuyées du bec sur les branches hôtes après ingestion. Le mutualisme éponyme dont dérive le nom anglais de l\'oiseau (Snow & Snow 1988).');

        $r = $this->rel($manager, $mistletoe, $poplar, 'parasitises', 'Obligate hemiparasite tapping host xylem for water and minerals; Black Poplar is a preferred continental host, frequently colonised in floodplain woodlands.');
        $this->relTranslate($manager, $r, 'fr', 'Hémiparasite obligatoire puisant l\'eau et les minéraux dans le xylème de l\'hôte ; le Peuplier noir est un hôte continental privilégié, fréquemment colonisé dans les forêts inondables.');

        $r = $this->rel($manager, $mistletoe, $ash, 'parasitises', 'Ash is a frequent mistletoe host in western European woodlands, particularly in Britain and France.');
        $this->relTranslate($manager, $r, 'fr', 'Le Frêne est un hôte fréquent du Gui dans les forêts d\'Europe occidentale, notamment en Grande-Bretagne et en France.');

        // Summer Truffle | Hornbeam, Beech, Oak
        $r = $this->rel($manager, $summerTruffle, $hornbeam, 'mycorrhiza_with', 'Ectomycorrhizal; Hornbeam is a principal host in calcareous European woodlands. Fills the significant gap of Hornbeam having no previous fungal partners in the database.');
        $this->relTranslate($manager, $r, 'fr', 'Ectomycorhizien ; le Charme est un hôte principal dans les forêts calcaires européennes. Comble l\'absence notable de partenaires fongiques pour le Charme dans la base de données.');

        $r = $this->rel($manager, $summerTruffle, $beech, 'mycorrhiza_with', 'Classic ectomycorrhizal association on well-drained calcareous soils under European Beech.');
        $this->relTranslate($manager, $r, 'fr', 'Association ectomycorhizienne classique sur les sols calcaires bien drainés sous Hêtre commun.');

        $r = $this->rel($manager, $summerTruffle, $oak, 'mycorrhiza_with', 'Common ectomycorrhizal partner of Pedunculate Oak; frequently co-occurs with Penny Bun and Chanterelle in the same stands.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien courant du Chêne pédonculé ; coexiste fréquemment avec le Cèpe de Bordeaux et la Girolle dans les mêmes peuplements.');

        // Russulaceae | new mycorrhizal family
        $r = $this->rel($manager, $russulaSickener, $pine, 'mycorrhiza_with', 'Obligate ectomycorrhizal partner of Scots Pine on acidic, boggy soils; rarely recorded away from Pinus.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien obligatoire du Pin sylvestre sur les sols acides et marécageux ; rarement signalé loin des Pinus.');

        $r = $this->rel($manager, $russulaSickener, $birch, 'mycorrhiza_with', 'Also ectomycorrhizal with Silver Birch in mixed pine-birch heathland.');
        $this->relTranslate($manager, $r, 'fr', 'Également ectomycorhizien avec le Bouleau argenté dans les landes mixtes pin-bouleau.');

        $r = $this->rel($manager, $oakbugMilkcap, $oak, 'mycorrhiza_with', 'Near-obligate on Quercus; almost never found away from oak woodland. Used as an indicator species for oak-dominated stands (Heilmann-Clausen et al. 2014).');
        $this->relTranslate($manager, $r, 'fr', 'Quasi obligatoire sur Quercus ; presque jamais trouvé loin des chênaies. Utilisé comme espèce indicatrice des peuplements à dominance de chêne (Heilmann-Clausen et al. 2014).');

        $r = $this->rel($manager, $woollyMilkcap, $birch, 'mycorrhiza_with', 'Obligately ectomycorrhizal with Betula; rarely or never recorded with other host genera (Nuytinck & Verbeken 2003).');
        $this->relTranslate($manager, $r, 'fr', 'Ectomycorhizien obligatoire avec Betula ; rarement ou jamais signalé avec d\'autres genres hôtes (Nuytinck & Verbeken 2003).');

        // Phellinus igniarius | heart-rot and cavity creation chain
        $r = $this->rel($manager, $willowBracket, $aspen, 'parasitises', 'A primary heart-rot pathogen of living Aspen, creating decay columns that are subsequently excavated by woodpeckers as nest cavities. A documented fungus → bird facilitation chain.');
        $this->relTranslate($manager, $r, 'fr', 'Pathogène primaire de carie du cœur du Tremble vivant, créant des colonnes de décomposition ensuite excavées par les pics comme cavités de nidification. Une chaîne de facilitation champignon → oiseau documentée.');

        $r = $this->rel($manager, $willowBracket, $birch, 'grows_on', 'Common perennial bracket on older Birch, contributing to standing deadwood habitat on which many saproxylic species depend.');
        $this->relTranslate($manager, $r, 'fr', 'Console pérenne commune sur les Bouleaux plus âgés, contribuant à l\'habitat de bois mort sur pied dont de nombreuses espèces saproxyliques dépendent.');

        // Pale Chanterelle | extends Cantharellaceae to Beech
        $r = $this->rel($manager, $paleChanterelle, $beech, 'mycorrhiza_with', 'Ectomycorrhizal; found characteristically in beech litter on calcareous soils; extends the Cantharellaceae to a second tree host.');
        $this->relTranslate($manager, $r, 'fr', 'Ectomycorhizien ; trouvé caractéristiquement dans la litière de hêtre sur sols calcaires ; étend les Cantharellaceae à un second hôte arboré.');

        // European Green Woodpecker
        $r = $this->rel($manager, $greenWoodpecker, $aspen, 'nests_in', 'Excavates nest cavities in soft aspen heartwood, especially where fungal heart-rot is present; Aspen\'s rapid decay makes it a preferred nesting substrate in mixed woodland.');
        $this->relTranslate($manager, $r, 'fr', 'Creuse des cavités de nidification dans l\'aubier mou du Tremble, notamment là où une carie fongique est présente ; la décomposition rapide du Tremble en fait un substrat de nidification privilégié en forêt mixte.');

        $r = $this->rel($manager, $greenWoodpecker, $poplar, 'nests_in', 'Excavates cavities in the soft wood of Black Poplar in floodplain woodland; a key secondary nesting tree across continental Europe.');
        $this->relTranslate($manager, $r, 'fr', 'Creuse des cavités dans le bois mou du Peuplier noir en forêt alluviale ; un arbre de nidification secondaire important en Europe continentale.');

        // Bohemian Waxwing
        $r = $this->rel($manager, $waxwing, $rowan, 'disperses_seeds_of', 'Specialist frugivore whose irruptive winter movements into temperate Europe are driven by Rowan mast crop failures in Fennoscandia. Seeds swallowed whole and passed intact (Svensson 1975).');
        $this->relTranslate($manager, $r, 'fr', 'Frugivore spécialiste dont les mouvements hivernaux irruptifs vers l\'Europe tempérée sont causés par les échecs de fructification du Sorbier en Fennoscandie. Les graines sont avalées entières et passent intactes (Svensson 1975).');

        $r = $this->rel($manager, $waxwing, $yew, 'disperses_seeds_of', 'Swallows Yew arils whole, passing the enclosed seed intact. One of the few birds to consume Taxus fruit in significant quantity. A critical dispersal link for a tree with few avian partners.');
        $this->relTranslate($manager, $r, 'fr', 'Avale entiers les arilles de l\'If, laissant passer la graine intacte. L\'un des rares oiseaux à consommer des fruits de Taxus en quantité significative. Un maillon de dispersion crucial pour un arbre ayant peu de partenaires aviaires.');

        $r = $this->rel($manager, $waxwing, $elder, 'feeds_on', 'Feeds extensively on Elder berries during winter irruptions into western Europe, often in large flocks alongside Blackbirds and Fieldfares.');
        $this->relTranslate($manager, $r, 'fr', 'Se nourrit abondamment de baies de sureau lors de ses irruptions hivernales en Europe occidentale, souvent en grands groupes aux côtés des Merles noirs et des Lithornes.');

        // Norway Spruce | cross-kingdom hub
        $r = $this->rel($manager, $crossbill, $spruce, 'feeds_on', 'Spruce cones are a primary food source across much of the European range; mandible morphology is adapted to prise open conifer cone scales.');
        $this->relTranslate($manager, $r, 'fr', 'Les cônes d\'Épicéa sont une source alimentaire principale sur une grande partie de l\'aire européenne ; la morphologie mandibulaire est adaptée pour forcer les écailles des cônes de conifères.');

        $r = $this->rel($manager, $chanterelle, $spruce, 'mycorrhiza_with', 'Dominant ectomycorrhizal association in Scandinavian and Central European spruce forests.');
        $this->relTranslate($manager, $r, 'fr', 'Association ectomycorhizienne dominante dans les pessières scandinaves et d\'Europe centrale.');

        $r = $this->rel($manager, $cauliflowerFungus, $spruce, 'grows_on', 'Causes butt rot in Norway Spruce; a major secondary host alongside Scots Pine.');
        $this->relTranslate($manager, $r, 'fr', 'Provoque la pourriture du pied de l\'Épicéa commun ; un hôte secondaire majeur aux côtés du Pin sylvestre.');

        $r = $this->rel($manager, $flyAgaric, $spruce, 'mycorrhiza_with', 'Ectomycorrhizal partner of Norway Spruce throughout its European range.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien de l\'Épicéa commun dans toute son aire européenne.');

        $r = $this->rel($manager, $crestedTit, $spruce, 'nests_in', 'Nests in rotting stumps and cavities in spruce-dominated boreal and montane forests.');
        $this->relTranslate($manager, $r, 'fr', 'Niche dans les souches en décomposition et les cavités des forêts boréales et montagnardes à dominance d\'épicéa.');

        // Tinder Fungus | white-rot parasite of Beech and Birch
        $r = $this->rel($manager, $tinderFungus, $beech, 'parasitises', 'Primary white-rot parasite of living Beech; causes extensive heartwood decay that creates the cavities essential for hole-nesting birds.');
        $this->relTranslate($manager, $r, 'fr', 'Principal parasite de carie blanche du Hêtre vivant ; provoque une décomposition extensive de l\'aubier qui crée les cavités essentielles pour les oiseaux nichant dans les trous.');

        $r = $this->rel($manager, $tinderFungus, $birch, 'parasitises', 'Major parasite of Silver Birch in northern European forests; often co-occurs with Birch Polypore on the same host.');
        $this->relTranslate($manager, $r, 'fr', 'Parasite majeur du Bouleau argenté dans les forêts d\'Europe du Nord ; coexiste souvent avec le Polypore du bouleau sur le même hôte.');

        $r = $this->rel($manager, $tinderFungus, $aspen, 'grows_on', 'Saprotrophic and weakly parasitic on Aspen in boreal and montane woodland.');
        $this->relTranslate($manager, $r, 'fr', 'Saprotrophe et faiblement parasitaire sur le Tremble dans les forêts boréales et montagnardes.');

        // Black Woodpecker | keystone cavity excavator
        $r = $this->rel($manager, $blackWoodpecker, $beech, 'nests_in', 'Primary nest tree in Central and Western European beech forests; preferentially selects trunks with heartrot from Fomes fomentarius.');
        $this->relTranslate($manager, $r, 'fr', 'Principal arbre de nidification dans les hêtraies d\'Europe centrale et occidentale ; sélectionne préférentiellement les troncs atteints de carie par Fomes fomentarius.');

        $r = $this->rel($manager, $blackWoodpecker, $pine, 'nests_in', 'Primary nest tree in boreal and eastern European pine forests.');
        $this->relTranslate($manager, $r, 'fr', 'Principal arbre de nidification dans les pinèdes boréales et d\'Europe orientale.');

        $r = $this->rel($manager, $blackWoodpecker, $honeyFungus, 'feeds_on', 'Forages on wood colonised by Honey Fungus, feeding on both the fungal tissue and associated beetle larvae.');
        $this->relTranslate($manager, $r, 'fr', 'Cherche sa nourriture dans le bois colonisé par l\'Armillaire, se nourrissant à la fois du tissu fongique et des larves de coléoptères associées.');

        $r = $this->rel($manager, $blackWoodpecker, $tinderFungus, 'symbiosis_with', 'Preferentially nests in Beech trunks infected with Tinder Fungus. The fungus softens heartwood while the bird\'s cavity promotes further fungal colonisation (Zahner et al. 2012).');
        $this->relTranslate($manager, $r, 'fr', 'Niche préférentiellement dans les troncs de Hêtre infectés par l\'Amadouvier. Le champignon ramollit l\'aubier tandis que la cavité de l\'oiseau favorise une colonisation fongique ultérieure (Zahner et al. 2012).');

        // Orange Birch Bolete | first mycorrhizal partner for Populus species
        $r = $this->rel($manager, $orangeBolete, $aspen, 'mycorrhiza_with', 'Near-obligate ectomycorrhizal partner; Aspen is the primary host throughout the European range.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien quasi obligatoire ; le Tremble est l\'hôte principal dans toute l\'aire européenne.');

        $r = $this->rel($manager, $orangeBolete, $poplar, 'mycorrhiza_with', 'Ectomycorrhizal association with Black Poplar in riparian and mixed woodland.');
        $this->relTranslate($manager, $r, 'fr', 'Association ectomycorhizienne avec le Peuplier noir en forêt riveraine et mixte.');

        // Honey Buzzard
        $r = $this->rel($manager, $honeyBuzzard, $beech, 'nests_in', 'Preferentially nests in canopy of mature beech woodland, often re-using large stick nests.');
        $this->relTranslate($manager, $r, 'fr', 'Niche préférentiellement dans la canopée des hêtraies matures, réutilisant souvent de grands nids de brindilles.');

        $r = $this->rel($manager, $honeyBuzzard, $oak, 'nests_in', 'Also nests in large oaks where beech is unavailable.');
        $this->relTranslate($manager, $r, 'fr', 'Niche également dans les grands chênes lorsque le hêtre est absent.');

        $r = $this->rel($manager, $honeyBuzzard, $blackWoodpecker, 'symbiosis_with', 'Frequently re-uses or nests near Black Woodpecker cavities in mature beech; commensal facilitation.');
        $this->relTranslate($manager, $r, 'fr', 'Réutilise fréquemment ou niche à proximité des cavités du Pic noir dans les hêtres matures ; facilitation commensale.');

        // Wryneck
        $r = $this->rel($manager, $wryneck, $aspen, 'nests_in', 'Obligate secondary cavity nester, strongly associated with aspen woodpecker holes.');
        $this->relTranslate($manager, $r, 'fr', 'Nicheur secondaire en cavité obligatoire, fortement associé aux trous de pics dans les trembles.');

        $r = $this->rel($manager, $wryneck, $oak, 'nests_in', 'Uses existing woodpecker cavities in mature oaks.');
        $this->relTranslate($manager, $r, 'fr', 'Utilise les cavités de pics existantes dans les chênes matures.');

        $r = $this->rel($manager, $wryneck, $woodpecker, 'symbiosis_with', 'Depends on cavities excavated by Great Spotted Woodpecker; obligate commensal.');
        $this->relTranslate($manager, $r, 'fr', 'Dépend des cavités creusées par le Pic épeiche ; commensal obligatoire.');

        // Spotted Nutcracker
        $r = $this->rel($manager, $spottedNutcracker, $spruce, 'disperses_seeds_of', 'Caches enormous quantities of Norway Spruce seeds; primary long-distance disperser in montane and boreal-temperate forests.');
        $this->relTranslate($manager, $r, 'fr', 'Cache d\'énormes quantités de graines d\'Épicéa commun ; principal disperseur à longue distance dans les forêts montagnardes et boréales-tempérées.');

        $r = $this->rel($manager, $spottedNutcracker, $spruce, 'feeds_on', 'Seeds of Norway Spruce form a major dietary component.');
        $this->relTranslate($manager, $r, 'fr', 'Les graines d\'Épicéa commun constituent un composant alimentaire majeur.');

        $r = $this->rel($manager, $spottedNutcracker, $pine, 'feeds_on', 'Also extracts and caches Scots Pine seeds as supplementary food source.');
        $this->relTranslate($manager, $r, 'fr', 'Extrait et cache également les graines de Pin sylvestre comme source alimentaire complémentaire.');

        // Aspen Bracket
        $r = $this->rel($manager, $aspenBracket, $aspen, 'parasitises', 'Obligate host-specific white-rot parasite of Aspen; causes the heartwood decay essential for cavity-nesting birds.');
        $this->relTranslate($manager, $r, 'fr', 'Parasite obligatoire hôte-spécifique de carie blanche du Tremble ; provoque la décomposition de l\'aubier essentielle pour les oiseaux nichant en cavité.');

        $r = $this->rel($manager, $blackWoodpecker, $aspenBracket, 'symbiosis_with', 'Black Woodpecker preferentially excavates nest cavities in aspen trunks infected by this fungus; decay softens heartwood to enable excavation (Zahner et al. 2012).');
        $this->relTranslate($manager, $r, 'fr', 'Le Pic noir creuse préférentiellement des cavités de nidification dans les troncs de Tremble infectés par ce champignon ; la décomposition ramollit l\'aubier pour permettre l\'excavation (Zahner et al. 2012).');

        // Oakmoss Lichen
        $r = $this->rel($manager, $oakmoss, $oak, 'grows_on', 'Epiphytic lichenised fungus with strong preference for acidic-barked broadleaves; extremely common on mature oak.');
        $this->relTranslate($manager, $r, 'fr', 'Champignon lichénisé épiphyte à forte préférence pour les feuillus à écorce acide ; extrêmement commun sur les chênes matures.');

        $r = $this->rel($manager, $oakmoss, $ash, 'grows_on', 'Also abundant on ash bark, particularly in moist western woodlands.');
        $this->relTranslate($manager, $r, 'fr', 'Également abondant sur l\'écorce du frêne, notamment dans les forêts humides de l\'Ouest.');

        $r = $this->rel($manager, $oakmoss, $rowan, 'grows_on', 'Commonly colonises rowan bark in upland and montane woodland.');
        $this->relTranslate($manager, $r, 'fr', 'Colonise couramment l\'écorce du Sorbier dans les forêts d\'altitude et montagnardes.');

        $r = $this->rel($manager, $oriole, $oakmoss, 'symbiosis_with', 'Golden Oriole incorporates oakmoss lichen as key camouflage and structural material in its suspended nest.');
        $this->relTranslate($manager, $r, 'fr', 'Le Loriot d\'Europe incorpore la mousse de chêne comme matériau de camouflage et de structure dans son nid suspendu.');

        // Hornbeam Milkcap
        $r = $this->rel($manager, $hornbeamMilkcap, $hornbeam, 'mycorrhiza_with', 'Near-obligate ectomycorrhizal partner of Hornbeam; one of the most host-specific Lactarius species in Europe.');
        $this->relTranslate($manager, $r, 'fr', 'Partenaire ectomycorhizien quasi obligatoire du Charme ; l\'une des espèces de Lactarius les plus hôte-spécifiques d\'Europe.');

        // Poplar Fieldcap
        $r = $this->rel($manager, $poplarFieldcap, $poplar, 'grows_on', 'Saprotrophic and weakly parasitic on living and dead Black Poplar wood; strong host preference for Populus.');
        $this->relTranslate($manager, $r, 'fr', 'Saprotrophe et faiblement parasitaire sur le bois de Peuplier noir vivant et mort ; forte préférence hôte pour les Populus.');

        $r = $this->rel($manager, $poplarFieldcap, $aspen, 'grows_on', 'Also commonly found on Aspen stumps and standing deadwood.');
        $this->relTranslate($manager, $r, 'fr', 'Également couramment trouvée sur les souches de Tremble et le bois mort sur pied.');

        $r = $this->rel($manager, $poplarFieldcap, $elder, 'grows_on', 'Occasionally fruits on elder trunks, a recorded secondary host.');
        $this->relTranslate($manager, $r, 'fr', 'Fructifie occasionnellement sur les troncs de Sureau, un hôte secondaire documenté.');

        $manager->flush();
    }

    // ------------------------------------------------------------------ //
    // Helpers
    // ------------------------------------------------------------------ //

    private function family(ObjectManager $manager, string $name, Kingdom $kingdom): Family
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
        $s = match ($family->getKingdom()) {
            Kingdom::Bird => new BirdSpecies(),
            Kingdom::Tree => new TreeSpecies(),
            Kingdom::Fungus => new FungusSpecies(),
        };

        $s
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
    ): Relationship {
        $r = (new Relationship())->setSubject($subject)->setObject($object)->setType($type)->setNotes($notes);
        $manager->persist($r);

        return $r;
    }

    private function relTranslate(
        ObjectManager $manager,
        Relationship $rel,
        string $locale,
        ?string $notes,
    ): void {
        $t = (new RelationshipTranslation())->setRelationship($rel)->setLocale($locale)->setNotes($notes);
        $manager->persist($t);
    }

    private function translate(
        ObjectManager $manager,
        Species $species,
        string $locale,
        ?string $habitat,
        ?string $substrate = null,
    ): void {
        $t = (new SpeciesTranslation())
            ->setSpecies($species)
            ->setLocale($locale)
            ->setHabitat($habitat)
            ->setSubstrate($substrate);
        $manager->persist($t);
    }
}
