Avant de présenter un rendu qui réutilise ou prolonge un beat déjà codé (v1, v2, v3…), **grep la note
de storyboard/breakdown associée à CE beat** en cherchant « VERDICT », « REJETÉ », « ne pas repartir ».
Pas seulement vérifier code + visuel (règle déjà en place, cf CLAUDE.md § « Vérifier CODE + VISUEL ») :
chercher spécifiquement un **verdict de rejet documenté sur ce même artefact**.

Vécu 2026-08-14, Gazoduc Acte 3 : j'ai rendu et présenté à Aziz la suite (Beats 2/3/4) en la croyant à
jour. Elle était en réalité la v3 condamnée. Le fichier
`memory/episodes/souverain/gazoduc-aagp-tsgp/BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md` contenait déjà une
section « ⛔⛔ VERDICT AZIZ SUR LE V3 CODÉ — REJETÉ » listant **exactement les 3 défauts** que je venais de
mesurer (widgets en bord d'écran, insert réduit à une icône posée, quasi-immobilité), et se terminait par
« **Ne PAS repartir du code v3 actuel** ». Je ne l'avais pas lue avant de présenter. C'est Aziz qui a dû
me dire que la scène était invalide.

**Why:** faire redécouvrir à Aziz un rejet qu'il a déjà formulé et fait documenter lui coûte un
aller-retour complet et donne l'impression que ses retours se perdent. L'information existait, écrite,
au bon endroit — seule la lecture manquait.

**How to apply:**
- Avant de rendre/présenter un beat hérité : `grep -n "VERDICT\|REJET\|ne PAS repartir\|rejeté"` sur le
  breakdown, le STATUS et le doc de fusion de l'épisode.
- Un livrable dont le rejet est documenté ne se « vérifie » pas, il se **refait depuis la source
  approuvée** (ici : le storyboard V5 + ses breakdowns JSON).
- Corollaire : quand un beat est refait, les beats voisins non refaits restent condamnés — ne jamais
  supposer qu'un fichier est homogène en qualité parce qu'une partie a été retravaillée.

Distinct de [[deux-compositions-remotion-verifier-vs-livrable-reel]] (confusion entre DEUX compositions
différentes) : ici c'est la même version, dont le verdict n'a pas été consulté.
Voir aussi [[verifier-souvenir-comme-verdict-llm]].
