# Gazoduc AAGP/TSGP — Storyboard macro Actes 2-5 (proposition, à valider Aziz)

> Découpage du texte narré (`SCRIPT-V3-VOIX.md`, 5 parties, narration.mp3 8min37) en actes/beats,
> AVANT tout DA-brief upstream ou code. Suit le gate d'entrée du skill `da-brief-gate` (storyboard
> validé requis avant le DA-brief). Acte 1 (Hook = Partie 1) déjà codé/validé v6, non retouché ici.
>
> **Principe directeur retenu (Aziz, cette session)** : Acte 1 reste le globe (validé). La suite
> passe en **carte D3 plate qui se dessine au fur et à mesure** (`ProtoGazoducAfriqueComplete.tsx`,
> palette CFA — fond **bleu-marine CLAIR** `#182746`, PAS un bleu-nuit sombre : "pas un bleu-nuit
> sombre qui avale le contraste", commentaire du proto lui-même — proto R&D déjà existant, jamais
> mergé en prod) — cohérent avec STATUS.md ("la carte plate reste une option pour un acte plus
> tardif nécessitant plus de précision géographique, 13 pays du tracé"). Le triptyque à 3 registres
> du sujet (carte D3 / scène-lieu narrative / insert schématique) sert de grille pour CHAQUE partie
> ci-dessous.
>
> **⛔ CORRECTION post-1er brouillon (Aziz)** : pas de stick-figure pour les dirigeants (2016,
> Freetown). Registre retenu = **jetons-portraits stylisés** (méthode déjà prouvée sur Soudan :
> `portrait-hemeti.png`/`portrait-burhan.png`, trait d'encre net, détourés, jeton D=76, SFX ping/pop
> à l'apparition) — Mohammed VI/Buhari en jetons-portraits sur la carte, PAS en silhouettes stick-
> figure animées. Objets (pierre symbolique, stylo de signature) en **2D isométrique** sur la carte
> plate, à valider si le rendu isométrique cohabite bien avec une projection carte plate (question
> ouverte pour le DA-brief). Brique n°7 stick-figure (continuité de pose/IK) reste donc EN RÉSERVE,
> pas utilisée sur ce chantier — aucune scène du Gazoduc n'a de sol/décor immersif qui l'appelle.

---

## Rappel doctrine insert vs carte (Soudan, `STATUS.md` § Acte 4)

> "insert SVG plein écran" réservé aux faits conceptuels/institutionnels **SANS ancrage géo fort**
> (jamais aux faits qui ONT un lieu identifiable — ceux-là restent carte, cf Beat 2 Port-Soudan
> repassé de l'insert à la carte après test).

Conséquence pour ce découpage : la genèse 2016 (lieu précis, Rabat ou site de cérémonie) et la
signature de Freetown (lieu précis, sommet CEDEAO) ONT un ancrage géo fort — donc plutôt scène-lieu
GREFFÉE SUR ou À CÔTÉ de la carte (façon Kosti Beat 5 : insert plein écran qui interrompt la carte
un instant, PAS une carte qui les ignore). Les faits VRAIMENT sans lieu (financement manquant,
70% capacité, calendrier qui se rétrécit) sont les candidats naturels à l'insert schématique pur.

---

## PARTIE 2 — AAGP (ligne 23-32 du script, ~55s de narration estimé)

| Segment texte | Registre proposé | Contenu visuel |
|---|---|---|
| "Le 19 juillet 2026, à Freetown... 15 chefs d'État signent" | **Jetons-portraits sur carte** (méthode Soudan) | Jetons-portraits (figures clés identifiables, pas 15 têtes) qui apparaissent à Freetown sur la carte + objet stylo/parchemin en 2D isométrique — écho direct au "décret" du Beat 1 CFA, même méthode que la genèse 2016 ci-dessous, cohérence de registre sur tout l'acte. |
| "près de 6900 km... 13 pays... jusqu'au Maroc... 15 milliards m³ Europe" | **Carte D3 plate** | Tracé AAGP qui se dessine le long de la côte (`strokeDashoffset`), 13 pays qui s'illuminent au passage (comptage incarné façon CFA Beat 2). Le chiffre 6900km peut s'afficher ICI (réservé pour cet acte selon la synthèse DA-brief Acte 1 : "les distances arrivent en Acte 2/3, pas en Acte 1"). |
| "vieux rêve qui remonte à 2016 — roi Mohammed VI et président Buhari posent la première pierre" | **Jetons-portraits sur carte** (méthode Soudan, PAS stick-figure) | Flashback bref. 2 jetons-portraits (Mohammed VI + Buhari, trait d'encre net, détourés, D~76) qui apparaissent sur la carte au point de la cérémonie, + objet symbolique (pierre) en 2D isométrique entre eux. SFX pop/ping à l'apparition (pattern Soudan). |
| "sur le papier tout est parfait... administrations existent, cadre juridique prêt" | **Carte D3 ou overlay UI** | Pastilles/checks qui s'allument sur la carte (gouvernance Abuja/Casablanca — écho double médaillon Beat 3 CFA). |
| "Personne n'a sorti le chéquier... 25 milliards $... aucune FID... discussions préliminaires" | **Insert schématique** (sans ancrage géo — candidat direct) | Jauge/compteur financement qui reste à 0 ou clignote "préliminaire" — écho jauge financement CFA. AUCUN lieu, AUCUN humain requis ici. |

## PARTIE 3 — TSGP (ligne 34-41)

| Segment texte | Registre proposé | Contenu visuel |
|---|---|---|
| "concurrent... gazoduc transsaharien... même point de départ Nigeria... traverse Niger, Sahara, réseaux algériens" | **Carte D3 plate** | Tracé TSGP intérieur (pointillé, distinct du plein AAGP — déjà la convention Acte 1), 3 pays (Nigeria-Niger-Algérie). |
| "4 juin 2026... Algérie annonce travaux... Adrar... pelleteuses déjà sur le terrain... Sonatrach" | **Carte D3 + icône** | Point Adrar qui s'active, icône chantier (Lucide, cohérent avec la boîte à outils Acte 1). Pas de personnage requis — fait d'infrastructure, pas humain. |
| "2x moins cher... 13 milliards... financé par les États eux-mêmes" | **Insert schématique** (comparatif chiffré) | Comparatif visuel 25 Mds$ (AAGP) vs 13 Mds$ (TSGP) — écho direct au cartouche échelle km déjà validé Acte 1. Aucun ancrage géo requis. |
| "zone où Al-Qaïda et État islamique actifs... 25 juin, attaque aéroport Niamey, 35 morts" | **Carte D3** (polygone rouge zone de conflit) | Réutilise directement le pattern Acte 1 (`#d6552e` semi-transparent, jamais aplat) — DÉJÀ validé et prêt à réemployer, cohérence de charte. PAS de scène humaine graphique du drame (ligne éditoriale factuelle/neutre, pas dramatisation). |
| "paradoxe... Maroc tracé pacifié mais suspendu au financement / Algérie fonds propres mais zone de conflit" | **Carte D3 (synthèse visuelle 2 tracés)** | Les 2 tracés visibles ensemble, contraste de style (déjà acquis Acte 1) porte le paradoxe sans texte suppl. |

## PARTIE 4 — Conséquences (ligne 43-48)

| Segment texte | Registre proposé | Contenu visuel |
|---|---|---|
| "pourquoi pas construire les deux... Nigeria n'a pas la capacité... 70% de la production siphonnée" | **Insert schématique pur** (aucun ancrage géo — le meilleur candidat de tout le script) | Jauge production nigériane qui se vide vers 2 tuyaux simultanément, dépasse 100% — mécanisme abstrait pur, écho balance/jauge CFA Beat 3/5a. |
| "pour le Maroc, levier géopolitique... pour l'Algérie, protéger le monopole" | **Carte D3** (2 flèches d'influence Maroc↔Europe vs Algérie↔Europe) OU **insert schématique** (2 médaillons qui s'opposent, écho cadenas EUR↔CFA) | À trancher au DA-brief — les deux registres sont défendables, pas un cas structurellement tranché comme les autres lignes. |
| "calendrier... Europe cherche à remplacer gaz russe... demande européenne va baisser d'ici 2030" | **Insert schématique** (courbe qui décline) | Sans ancrage géo, courbe de demande — écho direct aux courbes de devises CFA Beat 3. |

## PARTIE 5 — Implication (ligne 50-53)

| Segment texte | Registre proposé | Contenu visuel |
|---|---|---|
| "si vous vous chauffez au gaz en France/Espagne/Italie/Allemagne, cette rivalité finira sur votre facture" | **Carte D3** (zoom Europe, 4 pays qui s'allument) | Écho zoom Europe déjà fait Acte 1 (`europeGlowReveal`) — réutilisation directe, cohérence de charte. |
| "qui aura la main sur le robinet... financements internationaux ou États souverains" | **Carte D3 globale** (retour vue large, les 2 tracés ensemble) | Bouclage visuel — retour à une vue proche de l'ouverture Acte 1 pour la cohérence circulaire. |
| "personne ne sait qui ira jusqu'au bout... pendant que certains négocient, d'autres ont commencé à CREUSER" | **Carte D3 + icône finale** | Dernier plan, tracé TSGP qui progresse visuellement (pelleteuse/icône), phrase de sortie "CREUSER" en emphase texte (seule exception épure, comme "UN SEUL" en Acte 1). |

---

## DÉCOUPAGE EN ACTES PROPOSÉ (pour le pipeline de prod)

- **Acte 1** — Partie 1 (Hook). ✅ FAIT, validé v6.
- **Acte 2** — Partie 2 (AAGP). Carte D3 dominante + jetons-portraits (signature Freetown ET genèse
  2016, méthode Soudan) + objets 2D iso + 1 insert schématique (financement).
- **Acte 3** — Partie 3 (TSGP). Carte D3 dominante + icônes, réutilise directement le pattern zone de
  conflit déjà validé Acte 1. Aucun personnage requis a priori.
- **Acte 4** — Partie 4 (Conséquences). Majoritairement insert schématique pur (jauges/courbes),
  aucun ancrage géo — le registre le plus "CFA Beat 3/5a" de tout l'épisode.
- **Acte 5** — Partie 5 (Implication). Retour carte D3, bouclage visuel avec l'Acte 1.

⚠️ Ce découpage en 5 actes est une PROPOSITION de structure, pas un fait acquis — à confirmer/ajuster
par Aziz avant le DA-brief (ex. fusionner 2+3 si trop court, scinder 2 si la scène personnages 2016
mérite son propre acte autonome plutôt qu'un sous-bloc de l'Acte 2).

## DÉCISIONS PRISES (Aziz, cette session, 2026-08-03)

1. ✅ Genèse 2016 + signature Freetown → **jetons-portraits sur carte** (méthode Soudan), PAS
   stick-figure. Objets associés (pierre, stylo/parchemin) en **2D isométrique**. Brique n°7
   stick-figure reste en réserve, non utilisée sur ce chantier.
2. ✅ Découpage en **4 actes séparés** (Acte 2 à 5, un par partie du script) confirmé.
3. ✅ **Un seul DA-brief upstream** couvrant les 4 actes en une passe (pas 4 appels séparés) —
   affiner acte par acte au moment du code si besoin.

## POINTS OUVERTS POUR LE DA-BRIEF (à soumettre aux 3 voix, pas encore tranchés)

- Les objets 2D isométriques cohabitent-ils visuellement bien avec une **carte plate en projection
  D3** (pas une vue isométrique du terrain) ? C'est une combinaison pas encore testée sur ce
  registre carte — le pattern iso existant (mine d'or Soudan) est monté SUR une carte topdown/iso
  cohérente, pas une projection cartographique plate classique. Point technique à faire trancher
  par le DA-brief plutôt que deviner.
- Partie 4 ligne "Maroc levier géopolitique / Algérie protéger monopole" — carte D3 (flèches
  d'influence) ou insert schématique (médaillons opposés) ? Les deux sont défendables.
