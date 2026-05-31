import { CarouselSlideData } from "../../_shared/components/layouts/CarouselSouverain";

const CTA_SLIDE: CarouselSlideData = {
  type: "cta",
  line1: "Analyse complète sur YouTube",
  line2: "Newsletter → lien en bio",
  handle: "@koraetcartes",
};

export interface CarouselDef {
  id: string;
  title: string;
  slides: CarouselSlideData[];
}

export const CAROUSELS: CarouselDef[] = [
  {
    id: "or-africain",
    title: "Le Ghana a signé l'accord que 6 pays refusaient",
    slides: [
      { type: "hook", title: "Le Ghana a signé l'accord que 6 pays refusaient", subtitle: "Et a tout changé pour l'Afrique" },
      { type: "stat", number: "5%", unit: "de royalties", body: "Depuis 2010, c'est tout ce que le Ghana touchait sur son or — que le prix soit à 1 000 ou 5 000 dollars l'once." },
      { type: "fact", highlight: "5% → 12%", body: "En janvier 2026, l'or dépasse 5 000 dollars l'once. Le Ghana impose des royalties progressives selon le cours." },
      { type: "fact", highlight: "6 pays", body: "ont refusé de rejoindre l'accord. Trop risqué, disaient-ils." },
      { type: "fact", body: "Le Ghana a signé quand même. Les investisseurs ont suivi." },
      { type: "fact", highlight: "4 pays", body: "Mali, Burkina, Niger, Ghana : depuis deux ans, l'Afrique reprend le contrôle de son sous-sol." },
      { type: "fact", highlight: "1 signal.", body: "Discrètement, l'Afrique commence à changer les règles de son propre sous-sol." },
      CTA_SLIDE,
    ],
  },
  {
    id: "vraie-taille",
    title: "Les USA, la Chine et l'Europe tiennent dans l'Afrique",
    slides: [
      { type: "hook", title: "Les cartes du monde vous mentent depuis 500 ans" },
      { type: "fact", body: "La projection Mercator déforme les surfaces pour faciliter la navigation. L'Afrique en paie le prix." },
      { type: "stat", number: "9.8M", unit: "km² USA", body: "Les États-Unis tiennent entièrement dans l'Afrique" },
      { type: "stat", number: "9.6M", unit: "km² Chine", body: "La Chine aussi. Sans déborder." },
      { type: "stat", number: "10.5M", unit: "km² Europe", body: "L'Europe entière tient dans l'Afrique, avec de la place" },
      { type: "stat", number: "30.4M", unit: "km²", body: "C'est la vraie superficie de l'Afrique. Le continent le plus grand après l'Asie." },
      { type: "fact", highlight: "500 ans", body: "de cartes déformées ont façonné la façon dont le monde perçoit l'Afrique" },
      CTA_SLIDE,
    ],
  },
  {
    id: "thiaroye",
    title: "Ils ont libéré la France. Elle les a massacrés.",
    slides: [
      { type: "hook", title: "Ils ont libéré la France.", subtitle: "Elle les a massacrés." },
      { type: "fact", label: "1er décembre 1944", body: "Des soldats africains rentrent de la guerre. Ils réclament leur solde impayée depuis des mois." },
      { type: "fact", highlight: "80 000", body: "Tirailleurs sénégalais ont combattu pour la France pendant la Seconde Guerre mondiale" },
      { type: "fact", body: "À Thiaroye, au Sénégal, l'armée française ouvre le feu sur ses propres soldats" },
      { type: "stat", number: "35→400", unit: "morts", body: "Le vrai bilan est inconnu. Les archives sont encore partiellement scellées." },
      { type: "fact", body: "La France a officiellement reconnu le massacre en 2004. Soixante ans après les faits." },
      { type: "fact", highlight: "Zéro ligne", body: "dans les manuels scolaires français pendant des décennies" },
      CTA_SLIDE,
    ],
  },
  {
    id: "niger-uranium",
    title: "Le Niger recevait 9 centimes sur l'euro depuis 53 ans",
    slides: [
      { type: "hook", title: "Le Niger recevait 9 centimes sur l'euro depuis 53 ans", subtitle: "Pour son propre uranium" },
      { type: "fact", body: "Le Niger possède les 7e plus grandes réserves d'uranium au monde. L'Europe en dépend." },
      { type: "stat", number: "9¢", unit: "sur l'euro", body: "La part que le Niger recevait pour chaque euro de valeur de son uranium extrait" },
      { type: "fact", highlight: "Areva / Orano", body: "a exploité les mines nigériennes depuis 1971. Les conditions n'ont quasiment pas changé en 53 ans." },
      { type: "stat", number: "70%", unit: "sans électricité", body: "La majorité des Nigériens n'a pas accès à l'électricité. Celle que leur uranium produit en France." },
      { type: "fact", body: "En 2023, la junte militaire a expulsé l'ambassadeur français et suspendu les exportations d'uranium" },
      { type: "fact", highlight: "53 ans.", body: "C'est combien de temps il a fallu pour que ça change." },
      CTA_SLIDE,
    ],
  },
  {
    id: "mansa-moussa",
    title: "Il a fait s'effondrer l'or mondial. Par accident.",
    slides: [
      { type: "hook", title: "Il a fait s'effondrer l'or mondial.", subtitle: "Par accident." },
      { type: "fact", label: "1324", body: "Mansa Moussa, Empereur du Mali, part en pèlerinage à La Mecque avec 60 000 personnes" },
      { type: "stat", number: "12", unit: "tonnes d'or", body: "Il distribue de l'or à tous les pauvres qu'il rencontre sur sa route" },
      { type: "fact", body: "En traversant le Caire, il offre tant d'or que le prix de l'or s'effondre dans toute l'Afrique du Nord" },
      { type: "stat", number: "12 ans", unit: "de déflation", body: "L'économie égyptienne met 12 ans à se remettre de sa générosité" },
      { type: "fact", body: "Son empire produisait la moitié de l'or mondial. Il était probablement l'homme le plus riche de l'histoire." },
      { type: "fact", highlight: "1 voyage.", body: "Un homme. Un pèlerinage. Une crise économique mondiale." },
      CTA_SLIDE,
    ],
  },
  {
    id: "empire-ghana",
    title: "Au Sahara, le sel valait autant que l'or",
    slides: [
      { type: "hook", title: "Au Sahara, le sel valait autant que l'or" },
      { type: "fact", body: "Avant le Ghana actuel, il existait un empire qui portait le même nom et contrôlait l'Afrique de l'Ouest" },
      { type: "fact", label: "IVe – XIe siècle", body: "L'Empire du Ghana domine les routes commerciales transsahariennes pendant 700 ans" },
      { type: "fact", highlight: "Sel = Or", body: "Les marchands échangeaient le sel du Sahara contre de l'or — gram pour gram" },
      { type: "stat", number: "40%", unit: "des taxes", body: "L'empire prélevait 40% sur chaque transaction commerciale traversant son territoire" },
      { type: "fact", body: "Les caravanes de 12 000 chameaux traversaient l'empire. Chacune payait l'entrée et la sortie." },
      { type: "fact", highlight: "700 ans", body: "de domination commerciale. Avant que les Almoravides n'attaquent en 1076." },
      CTA_SLIDE,
    ],
  },
  {
    id: "sonjata",
    title: "Il était paralysé. Il a fondé le plus grand empire d'Afrique de l'Ouest",
    slides: [
      { type: "hook", title: "Il était paralysé.", subtitle: "Il a fondé le plus grand empire d'Afrique de l'Ouest." },
      { type: "fact", label: "XIIIe siècle", body: "Soundjata Keïta ne marche pas jusqu'à l'âge de sept ans. Ses frères le méprisent." },
      { type: "fact", body: "Selon l'épopée mandingue, il arrache un baobab pour se lever. La légende est née." },
      { type: "fact", highlight: "1235", body: "Bataille de Kirina. Soundjata défait Soumangourou Kanté et libère le peuple Mandé" },
      { type: "stat", number: "1.2M", unit: "km²", body: "La superficie de l'Empire du Mali à son apogée — du Sénégal au Niger" },
      { type: "fact", body: "Il crée la Charte du Manden — l'un des premiers textes de droits humains au monde, en 1222" },
      { type: "fact", highlight: "800 ans", body: "avant que la plupart des constitutions modernes existent, le Manden codifiait la liberté" },
      CTA_SLIDE,
    ],
  },
  {
    id: "silicon-savannah",
    title: "Le pays qui a inventé le paiement mobile avant Apple",
    slides: [
      { type: "hook", title: "Le pays qui a inventé le paiement mobile avant Apple" },
      { type: "fact", label: "2007", body: "Le Kenya lance M-Pesa — un système de paiement par SMS. Apple Pay n'existe pas encore." },
      { type: "stat", number: "96%", unit: "des adultes", body: "des Kenyans utilisent M-Pesa aujourd'hui. Le cash est devenu l'exception." },
      { type: "fact", body: "Nairobi abrite aujourd'hui plus de 200 startups tech actives. On l'appelle la Silicon Savannah." },
      { type: "stat", number: "1Mds$", unit: "levés en 2022", body: "Les startups africaines ont levé plus d'un milliard de dollars en un an" },
      { type: "fact", highlight: "Safaricom", body: "vaut plus en bourse que plusieurs banques européennes. C'est une entreprise kenyane." },
      { type: "fact", body: "L'Afrique saute l'étape bancaire traditionnelle. Elle construit directement le futur financier." },
      CTA_SLIDE,
    ],
  },
  {
    id: "senegal-petrole",
    title: "Comment le Sénégal évite le piège du Niger",
    slides: [
      { type: "hook", title: "Comment le Sénégal évite le piège du Niger", subtitle: "Pétrole, gaz, et souveraineté" },
      { type: "fact", label: "2014", body: "Le Sénégal découvre d'immenses réserves de pétrole et de gaz. Le jeu commence." },
      { type: "stat", number: "1er", unit: "producteur en 2024", body: "Le Sénégal est devenu producteur de pétrole en 2024 — le premier de son histoire" },
      { type: "fact", body: "Contrairement au Niger avec l'uranium, le Sénégal a négocié dès le départ une participation d'État dans les projets" },
      { type: "stat", number: "10%", unit: "participation", body: "L'État sénégalais détient 10% dans chaque projet pétrolier et gazier" },
      { type: "fact", highlight: "PETROSEN", body: "La compagnie nationale pétrolière siège à la table des négociations — pas juste comme observateur" },
      { type: "fact", body: "La vraie question : est-ce que les revenus financeront les Sénégalais, ou reproduiront le modèle Niger ?" },
      CTA_SLIDE,
    ],
  },
];
