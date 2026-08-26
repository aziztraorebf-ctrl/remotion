# STARTER — Lottie : le TEXTE, puis ANIMER UNE VRAIE SCÈNE

> Écrit le 2026-08-26 en clôture. Ordre demandé par Aziz.
> Branche : `feat/lottie-courbes-bezier` (tout y est commité).

## À copier-coller en début de session

```
Session Lottie, suite du 25-26 août. Ordre fixé par Aziz :

1. LE TEXTE — le bloqueur le plus fréquent : 83 scènes sur 172 en contiennent.
   Méthode PROUVÉE sur les dégradés, à rejouer à l'identique :
   poser dans Creator via le MCP → lire la structure produite → la porter dans
   svg2lottie_scene.py → mesurer avec compare_render.py.
   Le MCP expose create_text, set_text_style, split_text, measure_text_units, list_fonts.

2. ANIMER UNE SCÈNE DENSE — « sans animation qui joue, cela ne sert à rien » (Aziz).
   Tout est prouvé sur 24 calques (maison) et 8 groupes (Soudan) ; JAMAIS sur 498
   (aéroport). Candidat proposé par Aziz : une scène de rue/port.
   ⚠️ Grouper AVANT d'animer (group_layers.py) : une partition sur des calques
   `path-248` est ingérable.

3. RÉTROSPECTIVE de tout ce qui a été prouvé (voir plus bas).

Lire d'abord : memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md
(table de décision + ce qui reste ouvert) et memory/tools/lottie-creator-mcp.md.
```

## ⛔ Rappels qui ont coûté cette session

- **Le MCP Creator exige : onglet ouvert + MCP activé + UNE SEULE session Claude Code.**
  Le port 3847 est unique ; une 2e session échoue en silence (« No Creator tab is connected »
  alors que le navigateur dit « connected »). Diagnostic dans `memory/tools/lottie-creator-mcp.md`.
- **Importer un Lottie dans Creator exige une URL HTTPS PUBLIQUE AVEC CORS.**
  Testé : `uguu.se` → « Failed to fetch » (pas de CORS) · `localhost` → « Invalid URL » ·
  **`scripts/tools/upload-to-blob.py` (Vercel Blob) → fonctionne.**
  Le SVG inline (`content`) évite le problème mais plafonne vers ~10 Ko.
- **⛔⛔ LE PIÈGE RÉCURRENT — 4 fois en 2 jours, toujours la même signature :**
  fichier valide + rapport annonçant « porté » + **rien à l'écran**.
  (1) contours mangés par l'ordre de peinture · (2) ancre au coin de l'écran ·
  (3) keyframes hors de la plage ip/op du calque · (4) type `gf` absent du tri des styles.
  **L'élément était correct à chaque fois — c'est son AIGUILLAGE qui l'annulait.**
  → Ne JAMAIS conclure sur le rapport : `compare_render.py` puis REGARDER.
- **La spec décrit le rendu SVG, pas la meilleure conversion.** J'ai « corrigé » le rayon
  radial en raisonnant sur la spec : régression (11,58 → 11,91 %). Les 4 formules ont dû être
  MESURÉES. Quand le format cible ne peut pas représenter la source, seule la mesure tranche.

## Ce qui est PROUVÉ (ne pas re-prouver)

| Acquis | Preuve |
|---|---|
| Grammaire SVG complète + primitives | 36 tests, arcs < 5e-04 px |
| Extraction de nos scènes React | `extract-remotion-svg.mjs`, résolution par frame vérifiée |
| Dégradés linéaires et radiaux | aéroport 57,74 → **11,58 %** |
| Animation par transformation | maison validée dans Creator par Aziz |
| Animation par recalcul de forme | flamme : **78 px/frame** vs 98 à l'original |
| Calques groupés et nommés | Soudan 71 → 8 groupes |
| Poids | 10 s d'animation = **2,3 Ko** compressés |
| MCP Creator | 110 outils, lecture + écriture en direct |

## Les questions d'Aziz restées ouvertes
1. **Animation interactive** : le MCP expose `add_state_machine`, `add_input`,
   `add_pointer_interaction`. Lottie semble savoir faire du piloté-par-l'utilisateur.
   **NON TESTÉ** — enjeu : séparer « animation qui joue » de « composant interactif ».
2. **Combien de calques livrer ?** Web : aucun problème. Embarqué : rédhibitoire.
   Client qui modifie : illisible sans regroupement.
3. **Le client contrôle-t-il l'animation ?** Il peut la MODIFIER (Creator, After Effects) —
   vérifié. Il ne la contrôle PAS à la lecture, sauf peut-être via state machines (point 1).

## Fichiers de test prêts
`/tmp/LOTTIE-A-TESTER/` — ⚠️ **`/tmp` est effacé au redémarrage du Mac.**
Les sources sont dans le repo ; le dossier se régénère avec les outils de
`src/projects/_client-sim/lottie-ui/tools/`.
