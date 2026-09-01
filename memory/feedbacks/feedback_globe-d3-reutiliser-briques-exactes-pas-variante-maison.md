# Globe D3 — réutiliser les briques EXACTES déjà prouvées, jamais une variante « maison »

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Le probleme** (2026-08-02, Gazoduc Acte 1 v1 -> rejet Aziz -> v2) : j'ai ecrit
`GazoducActe1Hook.tsx` en PARTANT de `Globe2Proto16x9.tsx` (proto R&D) et en INVENTANT ma propre
palette (`COL = {...}`) et mon propre mecanisme de reveal (`fillOpacity` simple), au lieu d'IMPORTER
directement `THEMES.mixte`, `BorderPulse`, `GlowBorder` depuis `SoudanActe3GlobeProto16x9.tsx` /
`SoudanActe3GlobeInsert.tsx` — alors que ces briques existent, sont prouvees, et que j'avais MOI-MEME
cite `globeCamera.ts` avec sa doctrine ("~4.4 = plein cadre") dans mon propre breakdown sans jamais
appliquer cette amplitude dans le code reel (je suis reste plafonne a scaleMul 2.5 max).

**Symptome vu par Aziz** : "le globe reste immobile", "pas de vrais mouvements de camera", "on ne
rentre jamais dans le globe" (comparaison directe avec Soudan Acte 6 et les autres actes) + "les
contours de pays ne se dessinent pas comme le prototype qu'on avait valide" (= `BorderPulse`, jamais
utilise dans le v1).

**Cause racine** : lire une doctrine/un fichier de reference (je l'avais bien lu, cite avec chemins
et numeros de ligne dans le breakdown) ne suffit PAS a garantir que le code final l'applique. Entre
la lecture et l'ecriture, j'ai glisse vers une reinterpretation "dans le meme esprit" au lieu d'un
import direct + reutilisation des VALEURS/COMPOSANTS exacts. Le breakdown disait juste
"forme_verifiee: globeCamera.ts" sans forcer la vraie amplitude numerique dans les keyframes ecrites.

**Regle a appliquer desormais, pour tout nouveau beat globe D3** :
1. **IMPORTER les composants exacts** (`BorderPulse`, `GlowBorder`/pattern equivalent, `THEMES.<nom>`)
   depuis leur fichier source — ne jamais recopier/reinventer une palette ou un mecanisme "similaire".
   Si le composant n'est pas exporte, l'exporter depuis la source plutot que de dupliquer son code.
2. **Verifier les VALEURS reelles**, pas juste l'existence du mecanisme : pour la camera, grep les
   `scaleMul` deja utilises sur des beats valides (`grep -o "scaleMul: [0-9.]*" globeCamera.ts | sort -n`)
   et caler ses propres keyframes sur la MEME amplitude (1.2->4.4 sur Soudan), pas une fourchette plus
   timide qui "a l'air d'aller dans le meme sens".
3. **Avant de presenter, comparer visuellement une frame serree du nouveau beat avec une frame serree
   d'un beat de reference deja valide** — si le nouveau beat ne produit jamais un cadrage aussi
   rapproche que la reference, c'est le signal que l'amplitude camera est restee trop timide.

**Lien avec la doctrine existante** : c'est une instance specifique de
[[feedback_enrichir-existant-vs-composant-partage-geometrie]] et de la regle CLAUDE.md "ameliorer
l'existant avant de creer" — mais le piege ici est plus subtil : je N'AI PAS cree un fichier neuf par
negligence, j'ai cite le bon fichier de reference et quand meme fini par re-ecrire une variante
degradee a cote. Le risque n'est pas seulement "ne pas chercher l'existant", c'est aussi "citer
l'existant sans en importer/appliquer les valeurs reelles".

Voir aussi [[feedback_pose-manquante-chercher-registre-avant-inventer]] : meme piege racine
rencontre sur un registre d'ANIMATION (poses/gestes) plutot que du code — ne pas chercher assez
large dans le registre avant de conclure a l'impossibilite et de tatonner une pose "maison".

**2e occurrence (2026-08-03, Gazoduc Acte 1 v3 -> v4)** : meme piege, cette fois sur le SYSTEME
CAMERA plutot que sur les briques de rendu. En ecrivant le fichier de production final (84.68s,
10 beats), j'ai reecrit la camera en 10 fonctions separees (une par beat) au lieu de reutiliser
`camAt()`/`CamKey` — le systeme continu a UN SEUL tableau de keyframes espacees deja prouve dans
le prototype `ProtoGazoducGlobeFusion.tsx` que j'avais pourtant lu en entier avant de coder. Le
decoupage par beat semblait "plus lisible/maintenable" mais a detruit la continuite physique/
l'amplitude du mouvement (chaque segment repart d'une position fixe au lieu de s'inscrire dans
un seul trajet ample) — Aziz : "le globe reste moins dynamique que le prototype original".
Cause root confirmee par comparaison directe code-a-code entre le prototype et la v3, corrige en
v4 en revenant a `camAt()`.

**Regle etendue** : le piege ne concerne pas seulement les COMPOSANTS de rendu (BorderPulse, THEMES)
— il concerne aussi les SYSTEMES/MECANISMES entiers (ici, le moteur d'interpolation camera lui-meme).
Reutiliser une brique validee, ce n'est pas seulement importer le bon composant : c'est aussi
GARDER l'architecture du mecanisme (ex: keyframes espacees + interpolation continue sur tout le
trajet) plutot que de la refondre "dans le meme esprit" pour un decoupage qui parait plus propre
en apparence. Avant de reecrire un systeme deja valide en fichier de production, comparer
explicitement l'architecture cible au fichier source AVANT d'ecrire, pas seulement s'inspirer des
valeurs numeriques.
