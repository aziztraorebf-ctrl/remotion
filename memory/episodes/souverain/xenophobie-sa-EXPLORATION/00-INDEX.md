---
name: Xénophobie SA — Exploration (INDEX)
description: Dossier d'exploration complet, gelé 2026-05-07. À reprendre dans 2-3 mois minimum.
type: project
---

# Xénophobie Afrique du Sud — Dossier d'exploration

**Statut** : EXPLORATION GELÉE 2026-05-07. À reprendre dans 2-3 mois minimum.

**Pourquoi ce dossier existe** : session de pré-production exploratoire très productive (2026-05-07) sur un sujet candidat fort pour Souverain. Au lieu de tout perdre ou de produire trop tôt, on gèle l'état complet de la réflexion : faits vérifiés, angles narratifs, storyboard rectifié, décisions visuelles ouvertes.

**Pourquoi pas produire maintenant** :
- Hannibal = priorité production active
- Sujet récurrent depuis 30 ans → pas urgent (vs Mali blocus qui est urgent mais trop chaud)
- Données primaires (Xenowatch, Afrobarometer, Stats SA) à accéder directement à la reprise
- Évolution probable des faits 2026 (élections municipales SA, suite Addington Primary, etc.)

**À la reprise** : ouvrir ce dossier dans l'ordre, valider/réviser, produire Fact-Sheet officielle via `memory/templates/fact-sheet-souverain-v1.md` (v2), puis lancer pré-production.

---

## Fichiers du dossier (ordre de lecture)

| # | Fichier | Contenu |
|---|---------|---------|
| 00 | **INDEX.md** (ce fichier) | Vue d'ensemble + ordre de lecture |
| 01 | **NOTE-PREPRODUCTION.md** | Note exploratoire 8/10. Score, angles, voix internes, pièges, format Long. **À lire en premier** à la reprise. |
| 02 | **PERPLEXITY-FACT-CHECK.md** | Rapport Perplexity Sonar Deep Research complet (177 lignes, $0.07). Confirme/infirme chaque fait. |
| 03 | **STORYBOARD-V1.md** | Storyboard 9:30 min en 5 actes + CTA. **Stack Or Africain (PAS Atlas)** : Mapbox + Gemini + Remotion + portraits photo/Gemini. Pas de PixelLab. |
| 04 | **DECISIONS-OUVERTES.md** | Décisions tranchées vs en attente. Couleurs (pas de rouge moral), drapeaux sur carte, clip vidéo réel, etc. |
| 05 | **A-FAIRE-A-LA-REPRISE.md** | Checklist : sources primaires à accéder, last30days à relancer, tests visuels à faire, mini-renders à valider. |

---

## Score global du sujet : 8/10

**Pourquoi 8** :
- Faits stabilisés (30+ ans documentation)
- 5 voix sud-africaines internes critiques fortes (Malema, Daily Maverick, Caracal Reports, @Shadaya_Knight, Tobi Ononye)
- Angle "écoles + enfants" (Addington Primary) sous-traité par mainstream
- Diffusion virale TikTok (1,76M vues clip viral)
- Connexion narrative avec Or Africain ("même l'Afrique du Sud")

**Pourquoi pas 9-10** :
- Chiffres cumulatifs nécessitent Xenowatch direct
- Sujet émotionnel, risque récupération diaspora
- Faits 2026 encore en mouvement

---

## Angle narratif retenu (provisoire, à confirmer reprise)

**"Le miroir Mandela / Anger at the wrong target"**

Le paradoxe Souverain : pays libéré par solidarité panafricaine (ANC en exil Tanzanie/Zambie/Mozambique/Angola pendant apartheid) qui voit ses citoyens attaquer ces mêmes Africains aujourd'hui. Cas Addington Primary School (enfants) comme illustration centrale.

**Format** : YouTube Long 8-10 min uniquement (pas Short — test Atlas-natif 3/5 + Récidive structurelle).

---

## Stack technique retenu (Souverain Long)

| Couche | Outil | Note |
|--------|-------|------|
| Cartes | **Mapbox style GéoAfrique** (`STYLE_GEO_AFRIQUE`) | Réutiliser carte v5 Or Africain validée comme base |
| Backgrounds | **Gemini** | Papier vieilli, grilles éditoriales, textures premium |
| Portraits | **Gemini stylisé sépia** OU **photos d'archive réelles** | Selon disponibilité droits (Mandela = archive si possible) |
| Clips vidéo | **Remotion `<OffthreadVideo>`** trimmé, muet | Acte I hook : marche Operation Dudula plutôt que victime |
| Animations | **Remotion pur** | Timeline, compteurs, citations, transitions |
| Audio | **ElevenLabs Narratrice GeoAfrique v2** + **Minimax kora** | Identique Or Africain |
| Sous-titres | **Whisper word-level karaoke** FR | Identique Or Africain |
| Pions/jetons | **SVG inline** ornementés | Pas de PixelLab — incompatible registre documentaire |

**Composant nouveau à créer** : `<DocumentaryQuote />` dans `src/projects/souverain/_shared/` — citations bilingues anglais à l'écran + français en VO. Réutilisable tous épisodes Souverain longs.

---

## Coût pipeline test (session 2026-05-07)

- Perplexity Sonar Deep Research v1 : $0.0344 (rapport tronqué)
- Perplexity Sonar Deep Research v2 : ~$0.04 (rapport complet 177 lignes)
- last30days skill : ~5 min compute
- WebSearches : 7 requêtes ciblées
- **Total Perplexity : ~$0.07**

ROI clair : 2 chiffres invérifiables détectés avant écriture (644 morts, 952 incidents Xenowatch), 4 angles invisibles découverts via last30days (Addington, March and March, Malema EFF, voix résistantes immigrées).

---

## Règles Souverain établies pendant cette session (à appliquer tous épisodes futurs)

1. **Grille sources 3 niveaux** (faits vérifiables / voix narratifs / objet d'étude) — déjà sauvegardée dans `memory/feedback_grille-sources-3-niveaux.md`
2. **Fact-Sheet v2 obligatoire** pour épisodes sensibles — déjà sauvegardée dans `memory/templates/fact-sheet-souverain-v1.md`
3. **Aucune couleur ne code un jugement moral** — voir 04-DECISIONS-OUVERTES.md (à formaliser comme feedback à la reprise)
4. **Test "couper l'audio"** : si on identifie qui sont les méchants par les couleurs seules, la grammaire visuelle a trahi Souverain
5. **Audit assets vidéo source obligatoire** avant script lock pour tout épisode utilisant clips réels (droits, re-victimisation, alternatives)

---

## Quand reprendre

**Pas avant juillet 2026 minimum.** Indicateurs déclencheurs :
- Hannibal terminé et publié
- Élections municipales SA passées (octobre/novembre 2026 ?) → données fraîches Operation Dudula
- Verdict Addington Primary School connu (procédure en cours)
- Stats SA chômage 2026 disponible
- Afrobarometer round 10 SA disponible (selon cycle)

**Première étape à la reprise** :
1. Lire 00-INDEX → 01-NOTE → 02-PERPLEXITY → 03-STORYBOARD → 04-DECISIONS → 05-A-FAIRE
2. Relancer `last30days` SA xenophobia
3. Accéder Xenowatch directement
4. Décider : produire ou re-pauser ?
