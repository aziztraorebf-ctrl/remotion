# LES 4 PILIERS B2B — quelle brique pour quelle demande client

> Posé le 2026-08-20 (constat d'Aziz, session shotcraft). **Voie B2B / freelance**, distincte de la
> voie YouTube. Ce fichier répond à UNE question : *« un client demande X — quel pilier ? »*
> ⛔ Ce n'est PAS un catalogue de composants (ça c'est `INTENTION-FORME-INDEX.md`), ni une doctrine
> de production. C'est un **aiguillage**.

## Pourquoi ce fichier existe

Quatre capacités ont été construites séparément, pour la chaîne. Mises ensemble, elles couvrent la
majorité de ce qu'un client B2B peut demander — mais seulement si on sait **laquelle sortir**. Sans
aiguillage, on retombe sur le pilier qu'on a en tête (vécu : Flowdesk fait 100 % en SVG abstrait,
rejeté « illisible sans le son », alors que la demande appelait un écran).

## L'AIGUILLAGE

| Le client veut… | Pilier | Fiche à ouvrir |
|---|---|---|
| montrer **où** ça se passe, un territoire, une route, un flux entre pays | **1. CARTE** | `FICHE-CAMERA.md` · doctrines Mapbox/D3 |
| expliquer un **mécanisme**, une tension, un blocage, une idée sans forme physique | **2. SCÈNE SVG** | `FICHE-SVG-DESSINE.md` |
| montrer **son produit**, son app, son dashboard, un écran qui existe | **3. UI PRODUIT** | `FICHE-UI-PRODUIT.md` ⭐ |
| une **scène filmée**, un personnage, une matière organique, du photoréaliste | **4. VIDÉO GÉNÉRÉE** | `FICHE-CLIP-GENERE.md` |

## LES 4 PILIERS EN DÉTAIL

### 1. CARTE — Mapbox + D3
Territoire réel, géographie exacte. **Engage une promesse d'EXACTITUDE** (géo zéro approximation) que
les 3 autres piliers n'engagent pas — c'est ce qui en fait un métier à part, et la raison pour laquelle
il mérite **son propre gig** plutôt que d'être noyé dans un service généraliste (décision Aziz 2026-08-19).
Rendu lourd (`render-mapbox.sh` obligatoire, WebGL headless). Mot-clé marché : *animated map*.

### 2. SCÈNE SVG — objet, métaphore, rapport de force
Notre socle historique : 9 registres visuels prouvés (blueprint, papier-découpé, néon/data-terminal,
gravure, braise…), stick-figures, inserts-bloc. Déterministe, révisable au paramètre.
⭐ Le geste le plus vendable et le moins concurrencé : **le rapport de force abstrait** (deux masses,
une tension, une ligne qui retient) — `BlocImpasseB6.tsx` en est la preuve produite.
⛔ Frontière dure : **objet vs organique vivant**. Pas de visages qui jouent, pas de mains articulées.

### 3. UI PRODUIT — capture + shotcraft ⭐ (nouveau, 2026-08-20)
Le pilier qui manquait, et le plus demandé en B2B : *« montrez mon logiciel »*.
Pipeline : page servie → capture Puppeteer (plaque 2x + découpes + **bbox réelles**) → `PageCam`.
**Prouvé agnostique du design** : même film en registre sombre ET en light mode SaaS, sans changer un
composant. Socle importé de video-shotcraft (Apache-2.0). Détail complet : `memory/fiches/FICHE-UI-PRODUIT.md`.

### 4. VIDÉO GÉNÉRÉE — MiniMax H3 (+ Comfy)
Matière filmée, personnages, organique — tout ce que le SVG s'interdit.
⚠️ **Le seul pilier non déterministe.** On ne peut pas garantir une révision au paramètre près, donc
⛔ **ne pas le vendre comme un service autonome** : c'est un INGRÉDIENT dans un film porté par les
autres piliers. Un client peut obtenir de la génération ailleurs, moins cher.

## ⭐ CE QUI FAIT L'OFFRE — le moat est le DÉTERMINISME (piliers 1-2-3)

Trois piliers sur quatre sont du code frame-driven. En langage client :
- **« vous voyez le mouvement réel avant que je finisse »** — pas un storyboard statique. L'aperçu
  animé EST le livrable, à l'habillage près.
- **« une correction est un ajustement, pas une reprise »** — je change une valeur, pas un rendu.
- **« si votre produit change dans six mois, on modifie, on ne recommence pas »**.

C'est ce que la génération d'image/vidéo ne peut pas promettre. C'est l'argument, pas la technique.

## COMMENT ON LES COMBINE

Un explainer B2B complet fait souvent **2 → 3** : le problème abstrait (pourquoi c'est cassé), puis
l'écran qui le résout. L'échec de Flowdesk vient d'avoir tenté tout le trajet en pilier 2.
Le pilier 1 reste **à part** (gig distinct). Le pilier 4 n'apparaît jamais seul.

## ÉTAT COMMERCIAL (2026-08-20)

- Page de gig généraliste rédigée et validée : `memory/freelance-linkedin/GIG-PAGE-VALIDEE.md`
  ⚠️ **prix et délais non mesurés** sur une vraie commande de bout en bout.
- Décidé : **un seul gig d'abord** (piliers 2+3), la carto en second, jamais les deux mélangés.
- ⏭️ Manque : le **cut vente 60-90 s** (charte DA écrite le 2026-08-15, matière disponible) et une
  démo par geste. Sans artefact partageable, le studio est vendable en capacité mais pas en pratique.

## Liens
`memory/fiches/FICHE-UI-PRODUIT.md` (pilier 3, détail) · `memory/doctrines/SVG-SCENES-GENERATIVES.md`
(pilier 2) · `memory/doctrines/CHARTE-DA-FREELANCE.md` (la DA commune) ·
`memory/projects/SHOWCASE-CAPACITES.md` (le cut vente) · `memory/tools/minimax-h3-*.md` (pilier 4).
