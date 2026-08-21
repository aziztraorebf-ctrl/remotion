# LES 5 PILIERS B2B — quelle brique pour quelle demande client

> Posé le 2026-08-20 (constat d'Aziz, session shotcraft). **Voie B2B / freelance**, distincte de la
> voie YouTube. Ce fichier répond à UNE question : *« un client demande X — quel pilier ? »*
> ⛔ Ce n'est PAS un catalogue de composants (ça c'est `INTENTION-FORME-INDEX.md`), ni une doctrine
> de production. C'est un **aiguillage**.

## Pourquoi ce fichier existe

Cinq capacités ont été construites séparément, pour la chaîne. Mises ensemble, elles couvrent la
majorité de ce qu'un client B2B peut demander — mais seulement si on sait **laquelle sortir**. Sans
aiguillage, on retombe sur le pilier qu'on a en tête (vécu : Flowdesk fait 100 % en SVG abstrait,
rejeté « illisible sans le son », alors que la demande appelait un écran).

## L'AIGUILLAGE

| Le client veut… | Pilier | Fiche à ouvrir |
|---|---|---|
| montrer **où** ça se passe, un territoire, une route, un flux entre pays | **1. CARTE** | `FICHE-CAMERA.md` · doctrines Mapbox/D3 |
| expliquer un **mécanisme**, une tension, un blocage, une idée sans forme physique | **2. SCÈNE SVG** | `FICHE-SVG-DESSINE.md` |
| montrer **son produit**, son app, son dashboard, un écran qui existe | **3. UI PRODUIT** | `FICHE-UI-PRODUIT.md` ⭐ |
| un **graphisme** : chiffre-choc, portrait, cartouche, lockup, liens animés, badges | **4. MOTION DESIGN REACT** ⭐ | `INTENTION-FORME-INDEX.md` · `COMPOSANTS-INDEX.md` |
| une **scène filmée**, un personnage, une matière organique | **5. VIDÉO GÉNÉRÉE** | `FICHE-CLIP-GENERE.md` |

## LES 5 PILIERS EN DÉTAIL

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

### 4. MOTION DESIGN REACT — Remotion pur ⭐ (le socle qu'on oublie de compter)
**Ajouté le 2026-08-20 sur constat d'Aziz** : « Remotion n'est pas juste pour coller nos vidéos
ensemble, c'est aussi pour créer des graphismes, du motion design. »
Le pilier le PLUS ancien, le plus utilisé, et le seul sans aucune dépendance externe — donc celui
qu'on oublie de compter, précisément parce qu'il est partout.

Briques vérifiées présentes : `PortraitDossier` · `PortraitEditorial` (imageUrl + stats + rubrique) ·
`PortraitGeometry` · `PortraitSilhouette` · `DiscFrame` (disque paramétrable qui accueille n'importe
quel contenu — **les « photos rondes » d'un plan carte+personnes**) · `NoeudTisserand` ·
`MilitaryMarchLine` · compteurs, cartouches, lockups.
Registre : chiffre-choc, portrait encadré, badges de certification, grille d'icônes, liens animés,
carte + avatars, générique de fin. C'est le pilier qui **RELIE** les autres et porte l'habillage commun.

⛔ **ERREUR À NE PAS REFAIRE (commise le 2026-08-20, dans cette même session)** : devant le plan
« carte du UK + photos rondes de personnes » de la vidéo Aikido, j'ai répondu « pilier carte + vidéo
générée » — en cherchant la solution dans l'outil NOUVEAU alors qu'un `PortraitEditorial`/`DiscFrame`
posé sur une carte D3 la donne, en déterministe et révisable au paramètre.
C'est le pattern [[feedback_registre-visuel-briques-existantes-non-consultees]].
**Réflexe : avant de router vers un pilier externe, vérifier si c'est un graphisme composable.**

### 5. VIDÉO GÉNÉRÉE — MiniMax H3 (+ Comfy)
Matière filmée, personnages, organique — tout ce que le SVG s'interdit.
⚠️ **Le seul pilier non déterministe.** On ne peut pas garantir une révision au paramètre près, donc
⛔ **ne pas le vendre comme un service autonome** : c'est un INGRÉDIENT dans un film porté par les
autres piliers. Un client peut obtenir de la génération ailleurs, moins cher.

## ⭐ CE QUI FAIT L'OFFRE — le moat est le DÉTERMINISME (piliers 1-2-3-4)

**Quatre piliers sur cinq** sont du code frame-driven, déterministe, révisable au paramètre. En langage client :
- **« vous voyez le mouvement réel avant que je finisse »** — pas un storyboard statique. L'aperçu
  animé EST le livrable, à l'habillage près.
- **« une correction est un ajustement, pas une reprise »** — je change une valeur, pas un rendu.
- **« si votre produit change dans six mois, on modifie, on ne recommence pas »**.

C'est ce que la génération d'image/vidéo ne peut pas promettre. C'est l'argument, pas la technique.

## COMMENT ON LES COMBINE

Un explainer B2B complet fait souvent **2 → 3** : le problème abstrait (pourquoi c'est cassé), puis
l'écran qui le résout. L'échec de Flowdesk vient d'avoir tenté tout le trajet en pilier 2.
Le pilier 1 reste **à part** (gig distinct). Le pilier 5 n'apparaît jamais seul.

### ⭐⭐⭐ Combiner 5 + 4 DANS UN MÊME PLAN — « est-ce que ça se lit ? » (prouvé 2026-08-20)

Les piliers ne s'enchaînent pas seulement plan par plan : **ils se superposent dans un plan**. Le
pilier 5 (clip H3) porte la couche du fond, le pilier 4 (Remotion) pose par-dessus tout ce qui doit
être EXACT. Critère de tri unique :
- **abstrait** (matière, corps qui souffle, objets qui s'empilent) → **5. H3**
- **précis** (texte, chiffres, dates, sous-titres, logo) → **4. Remotion** — ⛔ H3 ne sait pas écrire.

Mécanisme : demander à H3 de **laisser la zone vide** (`EMPTY WALL LOCK`), pas retirer après coup.
⛔ Et donner au personnage une **INTENTION**, jamais un ordre d'immobilité (un `STILLNESS LOCK` a fait
lâcher le clip à 6,5 s ; l'intention « il souffle » l'a stabilisé sur 9 s).
Recette complète, prompts et livrables : [[REVERSE-STYLE-VIDEO-VERS-ASSETS]] § EXTENSION 2026-08-20.
⭐ Ce geste est aussi **un service vendable en soi** : poser une couche exacte sur une vidéo existante
(sous-titres, chiffre-clé, cartouche) — y compris sur un clip fourni par le client.

## ⭐⭐⭐ LE GABARIT DE CHOIX — ce qu'on vend AVANT le projet (posé 2026-08-20)

> **L'acquis commercial le plus important de la session** (formulé par Aziz). Vaut pour 3 piliers.

**⛔ LA PROMESSE À NE PAS FAIRE** : « on peut changer de style en cours de projet ». C'est vrai
techniquement (seed constant → même animation réhabillée, corrélation 0,90+), et c'est précisément
pour ça qu'il ne faut PAS le vendre : annoncer qu'un changement de style est facile **fabrique** les
demandes de changement de style, en cours de production, plusieurs fois. On transforme une capacité
en promesse de révisions illimitées.

**✅ CE QU'ON VEND À LA PLACE** : la capacité se dépense **UNE fois, en AVANT-VENTE**.
On montre au client **2-3 registres × UNE scène de son projet, animée 5-10 s**. Il choisit.
Le choix ferme la question du style pour toute la production.

| Ce que ça produit | Pourquoi ça vaut plus qu'un portfolio |
|---|---|
| le client choisit sur **SA** scène | un portfolio le fait choisir le travail d'un AUTRE |
| il l'a vu **BOUGER** avant de payer | il ne peut plus dire « ce n'est pas ce que j'imaginais » |
| le désaccord de goût arrive **avant le code** | aujourd'hui il arrive après le rendu, quand il coûte cher |
| le style est **arrêté** à cette étape | protège la production au lieu de l'exposer |

C'est la logique de notre storyboard interne (« le modèle propose, on valide, PUIS on code »),
portée côté client — [[CONTINUITE-SCENE-INTENTION-DABORD]].

**Décliné par pilier** (chacun a SA variable, ne pas les confondre) :

| Pilier | Ce qu'on montre | La variable |
|---|---|---|
| **5. vidéo générée** | 1 scène animée × 3 registres (Sunjata · gravure sépia · poster vector) | le REGISTRE graphique |
| **2. scène SVG** | 1 scène × 2-3 traitements, animée | le registre de DESSIN. ⚠️ La signature du SVG reste le **mix and match** (composer des éléments hétérogènes) — argument distinct, ne pas mélanger |
| **3. UI produit** | le même film d'écran en plusieurs teintes | la PALETTE, pas le montage (agnosticité déjà prouvée : `NorthShieldPromoV4` sombre / `NorthShieldPromoLight` clair) |

**⛔ 3 GARDE-FOUS (chacun payé dans le test du 2026-08-20)** :
1. **Relire chaque planche à l'œil.** Sur 5 styles générés, 1 avait dérivé (fenêtre devenue tableau)
   et 1 prompt a fait PEINDRE le texte sur le mur. Générer coûte ~0 ; relire, non. Une planche fautive
   fait juger notre rigueur, pas notre style.
2. **3 registres, pas 5.** Deux des cinq se disputaient le même terrain (ligne claire vs flat vector).
   Trop de choix affaiblit chaque option et rend la décision plus difficile.
3. **Fermer le choix par écrit.** Une phrase dans l'offre : « le style est arrêté à cette étape ; la
   production s'y tient ». Sans elle, on a offert le choix ET gardé le risque.

⭐ **Bonus** : le triptyque est aussi la **démo d'entrée** qui manquait — un prospect comprend la
méthode en 10 s, sans explication. Plus court à produire que le cut vente 60-90 s en attente.
Recette technique + prompts + livrables : [[REVERSE-STYLE-VIDEO-VERS-ASSETS]] § EXTENSION 2026-08-20.

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
