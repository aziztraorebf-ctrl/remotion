# Synthèse Jury Jour 4 — 3 LLMs (Kimi K2.6 + Gemini 3.1 Flash Lite + GPT-4o)
> 3/3 verdicts. Kimi K2.6 = thinking model (reasoning_content), max_tokens 16000 requis.

## Tableau de décision final

| Template | Kimi K2.6 | Gemini 3.1 Flash Lite | GPT-4o | Verdict consensus |
|---|---|---|---|---|
| A1 BrutalHeadline (placeholder) | TWEAK (photo B&W obligatoire, pas placeholder) | KEEP | TWEAK (or plus vif) | **TWEAK** — A1 doit forcer photo B&W/duotone, pas couleur brute |
| A2 DataCard kraft | KEEP | TWEAK (contraste texte brun) | KEEP | **TWEAK** — assombrir texte brun légèrement |
| A3 DataCard dark | KEEP | KEEP | KEEP | **KEEP** — consensus 3/3 |
| A4 BigStat | KEEP | KEEP | KEEP | **KEEP** — consensus 3/3 |
| B1 NewsClipping V1 posé | DROP | REWORK | REWORK | **DROP** — remplacé par V2, consensus 3/3 |
| B2 DateBar fullscreen | KEEP | KEEP | KEEP | **KEEP** — consensus 3/3 |
| B3 DateBar bottom | KEEP | KEEP | KEEP | **KEEP** — consensus 3/3 |
| V2A NewsClipping V2 crème | KEEP | KEEP | KEEP | **KEEP** — référence à adopter, consensus 3/3 |
| V2B NewsClipping V2 grain | TWEAK (retirer rotation, rouge → rouge brique) | TWEAK (retirer rotation) | TWEAK (vérifier lisibilité grain) | **TWEAK** — supprimer rotation, rouge → rouge brique/sienne |
| V2C BrutalHeadline + B&W | KEEP | KEEP | KEEP | **KEEP** — consensus 3/3, priorité n°1 |
| V2D BrutalHeadline + illus | KEEP | KEEP | KEEP | **KEEP** — consensus 3/3 |
| V2E BrutalHeadline + drapeau | DROP | DROP | TWEAK | **DROP** — Kimi + Gemini tranchent, concept trop faible |

## Score global

- Kimi K2.6 : **7/10** (monte à 8,5/10 avec tweaks + drops)
- Gemini 3.1 Flash Lite : **8/10**
- GPT-4o : **8/10**

## 3 tweaks à appliquer

1. **DataCard kraft** : assombrir légèrement le texte brun (`#2a1e0e` → `#1a1009`)
2. **NewsClipping V2 grain** : supprimer la rotation (rester droit, plein écran cohérent)
3. **NewsClipping V2 grain** : couleur accent rouge → rouge brique/sienne (rester dans palette chaude)

## Réponses jury aux questions d'Aziz

**BrutalHeadline = thumbnail clickbait ?**
Kimi : *"C'est une force, à condition d'éviter les codes clickbait (flèches rouges, smileys). L'absence de clichés + palette no/or + typo serrée = ton sérieux maintenu."*
Gemini : *"Ce n'est pas un problème, c'est une force. Un cheval de Troie éditorial — hacker le code visuel TikTok avec du contenu sérieux."*
Recommandation background : **B&W photo (V2-C) en default** > illustration gravure (V2-D) > drapeau DROP.

**DataCard vs BigStat** : complémentaires. BigStat = emphase narrative (chiffre s'imprime en 1 fraction de seconde). DataCard = preuve documentaire (source + contexte). Usage : BigStat pour "écoutez bien ce chiffre", DataCard pour "voici la donnée sourcée".

**DateBar** : les deux usages conservés. Fullscreen = transition chapitre fort / "titre de section". Bottom = calage temporel discret sur b-roll ou carte.

**NewsClipping V1 vs V2** : V2 plein écran unanimement supérieur (consensus 3/3). V1 (posé) = DROP. V2-A = standard citation adopté.

## Recommandations systémiques (Kimi)

1. **Traitement photo BrutalHeadline** : TOUS les visuels = B&W ou duotone noir/or/sable. A1 doit intégrer cette règle.
2. **Famille papier** : KraftCard (Jour 3) + DataCard kraft (A2) + NewsClipping grain (V2-B) doivent partager même intensité grain pour former bloc "archives/documents".
3. **Système de tags** : Unifier coin supérieur gauche. Soit "SOUVERAIN" partout, soit taxonomie 3 termes max (ENQUÊTE / CHRONO / ARCHIVES).
4. **Dualité typographique** : sans-serif condensé (données + titres chocs) vs serif (citations longues) — maintenir.

## Note technique : Kimi K2.6

Thinking model — réponse dans `reasoning_content` (content peut être vide). `max_tokens: 16000` requis. Timeout 300s. Base64 images en local (pas URL réseau).
