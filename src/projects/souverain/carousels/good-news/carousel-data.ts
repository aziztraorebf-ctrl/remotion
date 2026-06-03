/**
 * carousel-data.ts — CONTENU des carrousels Good News (séparé du code).
 *
 * Chaque semaine, Claude remplit une nouvelle entrée `GoodNewsEdition` à partir du
 * fichier de recherche produit par `scripts/prepare-goodnews-weekly.py`.
 * La composition `GoodNewsCarousel` lit `CURRENT_EDITION` → render automatique.
 *
 * RÈGLE FACTUELLE : ne remplir qu'avec des faits vérifiés (le script de recherche
 * fournit les sources). Jamais inventer un chiffre. Voir good-news/README.md.
 */

export type FactBrick =
  | { brick: "gauge"; gaugeValue: number; gaugeSuffix?: string; gaugeLabel?: string }
  | { brick: "bars"; challengerName: string; challengerValue: number; leaderName: string; leaderValue: number }
  | { brick: "map"; /* corridor géographique — coords gérées dans GoodNewsSlideMap */ mapKey: string };

export interface FlowSpec {
  sourceLabel: string;
  sourceIcon: string; // clé ICONS (factory, plane, zap, server, droplets, wind, leaf, cpu, globe)
  targetLabel: string;
  targetIcon: string;
  layout?: "horizontal" | "diagonal" | "vertical";
}

export interface NewsItem {
  /** nom court pour le kicker, ex "Maroc" */
  country: string;
  /** slide FAIT : brique data-driven + phrase */
  fact: FactBrick & { body: string };
  /** slide MACRO : flux d'impact + phrase "pourquoi le monde regarde" */
  macro: { flow: FlowSpec; body: string };
}

export interface GoodNewsEdition {
  /** identifiant semaine, ex "2026-W23" */
  weekId: string;
  /** dates couvertes (pour archive) */
  range: string;
  hookTitle: string;
  hookSubtitle: string;
  ctaBody: string;
  ctaSubtitle: string;
  /** exactement 3 nouvelles (structure 8 slides) */
  news: [NewsItem, NewsItem, NewsItem];
}

/**
 * Édition #1 — semaine du 26 mai au 1 juin 2026 (publiée 3 juin).
 * Sert aussi de RÉFÉRENCE de remplissage pour les éditions suivantes.
 */
export const EDITION_2026_W22: GoodNewsEdition = {
  weekId: "2026-W22",
  range: "26 mai – 1 juin 2026",
  hookTitle: "3 avancées africaines qui ont changé la donne mondiale cette semaine",
  hookSubtitle: "Le continent ne reçoit plus. Il fournit.",
  ctaBody: "On décrypte l'impact mondial de l'Afrique, chaque semaine.",
  ctaSubtitle: "Clique sur notre photo de profil pour suivre @koraetcartes",
  news: [
    {
      country: "Maroc",
      fact: {
        brick: "bars",
        challengerName: "Maroc",
        challengerValue: 100,
        leaderName: "Afrique du Sud",
        leaderValue: 86,
        body: "Le Maroc devient la première puissance industrielle d'Afrique, devant l'Afrique du Sud.",
      },
      macro: {
        flow: { sourceLabel: "Usines Maroc", sourceIcon: "factory", targetLabel: "Airbus · Europe", targetIcon: "plane", layout: "diagonal" },
        body: "Automobile et aéronautique : les usines marocaines sont devenues un maillon des chaînes européennes. Un Airbus passe désormais par Tanger.",
      },
    },
    {
      country: "Kenya",
      fact: {
        brick: "gauge",
        gaugeValue: 90,
        gaugeSuffix: "%",
        gaugeLabel: "d'électricité renouvelable",
        body: "Le Kenya produit plus de 90 % de son électricité avec des énergies propres, surtout la géothermie.",
      },
      macro: {
        flow: { sourceLabel: "Énergie verte", sourceIcon: "zap", targetLabel: "Data centers IA", targetIcon: "server", layout: "horizontal" },
        body: "L'IA a soif d'électricité propre. Le Kenya attire les data centers de la Silicon Valley : un calcul plus vert, loin des réseaux européens saturés.",
      },
    },
    {
      country: "Algérie",
      fact: {
        brick: "map",
        mapKey: "alger-berlin",
        body: "Berlin accélère : un corridor d'hydrogène vert reliera l'Algérie à l'Allemagne, via l'Italie, d'ici 2030.",
      },
      macro: {
        flow: { sourceLabel: "Hydrogène vert", sourceIcon: "droplets", targetLabel: "Europe décarbonée", targetIcon: "leaf", layout: "diagonal" },
        body: "L'Europe veut sortir des énergies fossiles. Pour y arriver, elle compte sur l'énergie propre d'Afrique du Nord. L'Afrique passe de cliente à fournisseur stratégique.",
      },
    },
  ],
};

/** Édition active rendue par GoodNewsCarousel. Pointer vers la semaine courante. */
export const CURRENT_EDITION: GoodNewsEdition = EDITION_2026_W22;
