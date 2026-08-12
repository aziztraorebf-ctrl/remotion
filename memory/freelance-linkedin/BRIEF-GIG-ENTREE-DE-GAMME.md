# Brief — Gig Fiverr entrée de gamme "explainer simple"

> Créé 2026-08-11, déclenché par l'analyse d'un vendeur Fiverr whiteboard (2200+ vidéos livrées,
> tiers 507-649 CA$, script vidéo `frame_001-024.jpg` dans le scratchpad de session). Complète
> [freelance-dataviz-fiverr-pro.md] (positionnement premium 300-2000$, carto éditoriale B2B) sans
> le remplacer — **2 gigs séparés, 2 rôles différents**, décision Aziz 2026-08-11.

## Pourquoi un 2e gig, pas une fusion

`STRATEGIE-LINKEDIN-FREELANCE.md` § 3 est déjà tranché : un prix bas DISQUALIFIE auprès des clients
premium sérieux. Mettre ce format dans le même panier que la carto éditoriale tirerait tout le
positionnement vers le bas. Séparés, les deux jouent un rôle complémentaire :

| | Gig premium (existant) | Gig entrée de gamme (ce brief) |
|---|---|---|
| Segment | B2B premium, think tanks, médias, cabinets | PME/solopreneurs/créateurs, besoin simple |
| Prix visé | 300-2000$ | ~80-250 CA$ (aligné marché, cf tiers analysés) |
| Rôle | Le revenu cible, moat data/récurrence | Porte d'entrée, cash rapide, avis, volume |
| Canal | Fiverr Pro (vetting) + LinkedIn démarchage | Fiverr standard, listable tout de suite |
| Risque si fusionné | Dilution du positionnement premium | — |

Le vendeur analysé prouve la demande sur ce segment (2200+ commandes, cadence hebdo) — mais avec une
exécution line-art basique. Notre exécution SVG maison est déjà au-dessus visuellement, à coût de
production comparable (pas de génération IA payante, pipeline maison).

## Ce qu'on prend du vendeur observé, ce qu'on ne prend PAS

**On prend** (logique d'offre, transférable indépendamment du style — même principe que la leçon
`animonpro`/Alex dans freelance-dataviz-fiverr-pro.md § "NE PAS imiter, TRADUIRE") :
- Un gig qui se reconnaît en 3 secondes, vend UN problème résolu, pas un catalogue de capacités.
- Le script/l'histoire porte la vente, pas la sophistication de l'animation — chaque scène est un
  argument (problème → mécanique → preuve sociale → CTA), pas une explication pédagogique neutre.
- 3 tiers clairs avec delta net entre eux (Basic sans voix off / Best Seller avec / Competition
  Killer avec script writing inclus) — chaque tier résout une objection précise, pas juste "plus cher".
- Delivery rapide annoncé (7 jours) — la vitesse EST une partie de la valeur perçue sur ce segment.

**On ne prend PAS** :
- Le style line-art scanné / reveal manuel — remplacé par du SVG maison animé (scènes génératives,
  cf `src/projects/_shared/INTENTION-FORME-INDEX.md`), qualité visuelle supérieure à coût comparable.
- "Révision gratuite illimitée" comme argument — voir section dédiée ci-dessous, risque identifié par
  Aziz 2026-08-11.

## ⛔ Révisions : bordées, pas illimitées (correction du réflexe "révision gratuite" du moat premium)

Le moat documenté dans `STRATEGIE-LINKEDIN-FREELANCE.md` ("la révision est gratuite et exacte")
est vrai et vendable, mais suppose un **changement ponctuel sur un paramètre déjà verrouillé**
(un chiffre, un mot, une couleur — le reste bit-identique). Ce n'est PAS une licence à réouvrir la
conception indéfiniment.

**Risque signalé par Aziz** : annoncer "révisions gratuites illimitées" sur un gig à petit ticket
attire mécaniquement le client qui négocie 15 allers-retours parce que rien ne lui coûte à demander.
Même avec un pipeline outillé, chaque intégration (nouveau graphisme, timing qui se recale, cohérence
d'ensemble) a un coût réel de vérification — "gratuit" ne veut pas dire "sans friction pour nous".

**Règle retenue pour ce gig** :
- **Révisions incluses en nombre fixe** (aligné marché : 2-3, cf tiers analysés) — pas "illimité".
- Gratuites/instantanées SEULEMENT sur les paramètres verrouillés en amont pendant le brief
  (texte affiché, palette, timing/durée d'un beat) — c'est la vraie révision chirurgicale.
- Toute demande de changement de CONCEPTION (nouvelle scène, nouvel angle narratif, structure
  différente) = révision de conception, hors forfait, devis séparé.
- Formuler l'argument commercial comme "révisions précises incluses" ou "ajustements exacts sans
  refaire le tournage", jamais "illimité" — le mot lui-même est le problème, pas seulement l'usage.

## ⭐⭐ Structure de gig révisée (Aziz 2026-08-11/12) — l'axe qui différencie n'est PAS la techno, c'est le RÔLE du personnage + la richesse du décor

Refonte après le test H3 complet (voir § Tests de faisabilité ci-dessous). Deux corrections
importantes par rapport à la 1re version de ce brief :

1. **Les 2 directions visuelles d'aperçu (proposées initialement pour Premium seulement) sont
   incluses DÈS Standard.** Elles ne coûtent presque rien chez nous (`storyboard-dual-gen.py`,
   génération parallèle 2 images via 2 modèles, + Kimi K3/GLM-5.2 ~0,03-0,05$/scène, <1min) — donc
   pas de raison de les réserver au tier le plus cher. Argument anti-friction validé par Aziz : évite
   le cycle "j'envoie un design, le client n'aime pas, je dois deviner mieux au 2e essai" — le client
   choisit entre 2 options dès le départ, ou demande une révision sur celle qu'il préfère.
2. **Le vrai delta Basic/Standard vs Premium n'est plus "type de personnage" mais deux axes
   indépendants** (décision Aziz) :
   - **Rôle narratif du personnage** : Basic/Standard = personnage qui exécute une action isolée
     (marche, tape, réagit seul) — ce qu'on a prouvé en 1er (entrepreneur au bureau). Premium =
     **personnages qui interagissent entre eux**, portent un dialogue, une vraie scène jouée à
     plusieurs — prouvé faisable en 2e temps (voir § Test 2).
   - **Richesse du décor**, indépendante du personnage : Basic/Standard = décor minimaliste façon
     `FunambuleProfil` (CFA Acte 4 — le sujet porte l'attention, pas l'environnement). Premium =
     décor riche et habité (un lieu qui existe vraiment : marché, supermarché, village) — ce qui a
     ÉTÉ le décor du test 2 (rayon de supermarché détaillé).
3. **GeminiRig abandonné** (décision Aziz) — déjà noté "écarté en prod" dans notre propre mémoire
   (`PERSONNAGE-VIVANT-INDEX.md` : "pantin pas maîtrisé"), et H3 couvre maintenant le besoin
   d'expressivité en gros plan avec une méthode prouvée fonctionnelle. Ne plus le proposer comme
   option Premium.
4. **Piste ouverte, pas encore tranchée** : remplacer/compléter les cartes vivantes Mapbox par notre
   style SVG signature (tracés, territoires teintés — celui du CFA/Gazoduc) comme argument Premium
   alternatif — différenciant et moins coûteux/complexe qu'un pipeline Mapbox complet. Aziz : "à voir
   ce qu'on préfère" — décision à prendre avant publication, pas figée ici.

| | Basic | Standard | Premium |
|---|---|---|---|
| Directions visuelles avant production | 1 aperçu | **2 directions comparées** (quasi gratuit chez nous) | 2 directions + mix and match |
| Personnage | Stick figure, action isolée, décor minimal | Stick figure, gestes riches, décor minimal à moyen | **Personnages qui interagissent/dialoguent**, décor riche et habité (H3) |
| Voix off | Non | Oui | Oui |
| Script | Client fournit | Client fournit | On l'écrit ensemble |
| Révisions | 2 | 3 | 3 |
| Délai | 5-7 jours | 7 jours | 7-10 jours |
| Prix indicatif | ~90-120 CA$ | ~180-220 CA$ | ~280-350 CA$ |

⚠️ Prix indicatifs à valider contre le marché actuel avant publication (les tiers observés vont de
507 à 649 CA$ pour un vendeur Top Rated établi avec 2200+ avis — nous démarrons sans historique,
donc positionnement d'entrée plus bas est cohérent, mais à re-vérifier via 2-3 gigs comparables
au moment de publier, pas figé ici).

**Argument de vente Premium confirmé** : contrairement au vendeur whiteboard analysé au début de ce
brief (personnages qui APPARAISSENT par reveal de trait puis restent figés, jamais de vraie scène
jouée à 2), notre tier Premium peut inclure une VRAIE scène à 2 personnages qui interagissent — pas
un gadget, une continuité narrative complète (dialogue à deux sens, déplacement dans l'espace, retour
à la position) prouvée sur un cas concret (§ Test 2 ci-dessous). Aucun concurrent Fiverr identifié
dans ce segment n'offre ça avec un pipeline stock/reveal.

## ⭐ Test 1 — mix SVG statique + 1 moment animé, personnage seul (fait 2026-08-11)

Session dédiée au test du procédé "scène SVG statique + 1 moment de réaction/action animée par H3"
envisagé pour le tier Premium initial. **Verdict : procédé validé, méthode technique fiable identifiée.**

- **Ce qui a été prouvé** : une image de référence générée (style flat/explainer, cohérent avec notre
  registre) peut être animée par H3 pour produire une vraie micro-chorégraphie de réaction (main qui
  bouge, tête qui se relève, expression qui passe de l'inquiétude au soulagement) — pas un simple
  changement d'image, une continuité de mouvement crédible.
- **2 corrections nécessaires avant d'obtenir un clip livrable** — à anticiper dans le TEMPS de
  production, pas juste dans le prix : (1) la géométrie de caméra de l'image de référence doit être
  pensée AVANT génération (ex. si un personnage regarde un écran, décider explicitement si la caméra
  montre l'écran — vue over-the-shoulder — ou seulement le personnage — vue 3/4 avec dos d'écran —
  sinon incohérence visuelle, erreur commise au 1er essai) ; (2) éviter toute formulation de prompt
  impliquant la parole ("as if about to speak") si aucun dialogue n'est voulu — H3 peut générer un
  mouvement de bouche non désiré en réponse littérale à ce type de clause.
- **Fiabilité technique de génération** : un défaut de méthode a été trouvé et corrigé pendant ce
  test (pas un défaut du modèle H3 lui-même) — voir `memory/tools/minimax.md` § "CAUSE RACINE
  TROUVÉE ET CORRIGÉE" pour le détail. `run_template`+`input_overrides` peut silencieusement ignorer
  l'image/le prompt envoyés sur ce template — la méthode corrigée (`submit_workflow` + graphe câblé
  en dur, gabarit conservé dans `scripts/tools/comfy-graphs/minimax-h3-r2v-graph-template.json`) est
  maintenant la référence à utiliser pour toute future génération H3 R2V.

## ⭐⭐ Test 2 — 2 personnages qui interagissent + continuité multi-clips (fait 2026-08-11/12)

Test décisif pour valider l'argument Premium "personnages qui dialoguent" (proposé par Aziz après le
Test 1). **Risque identifié avant de tester** : la mémoire documentait déjà un défaut connu sur
scènes H3 multi-personnages (Sonjata, 08/08) — "personnage qui disparaît + écran noir karaoké" sur un
geste de contact physique (mains jointes) + dialogue long continu, 3-4 personnages. Seuil "2 échecs
sur le même problème" déjà atteint sur ce défaut précis à l'époque.

**Protocole de test pour éviter de reproduire le défaut connu** : scène à 2 personnages SEULEMENT
(pas 3-4), dialogue COURT en un seul segment continu (pas de pause interne — le facteur qui avait
fonctionné dans le test Sonjata), ZÉRO contact physique croisé entre les personnages (chacun garde
ses mains/bras dans son propre espace), clause anti-écran-noir explicite ajoutée au prompt par
prudence.

**Résultat : succès complet sur les 4 clips testés, aucune reproduction des défauts connus.**
- Clip 1 (dialogue A→réaction, scène marché supermarché, 6.5s, 158 frames) : vérification EXHAUSTIVE
  (toutes les frames + mesure de luminosité automatisée pour détecter tout écran noir) — 2
  personnages stables sur 100% des frames, jamais de disparition, jamais d'écran noir, zéro contact
  physique. Décor riche (rayon de supermarché) stable sur toute la durée.
- Clip 2 (transition silencieuse, bras qui se baisse, 3s) : utilisé pour créer un point de jonction
  propre avant les 2 tests de continuité — succès net.
- Clip 3 (dialogue BIDIRECTIONNEL, homme parle → femme répond, 5.5s, 141 frames, partant de la
  dernière frame réelle du clip 2) : succès complet, vérification exhaustive, aucun défaut.
- Clip 4 (déplacement : l'homme marche vers le rayon, ramasse un objet, revient à sa position tout en
  la femme reste immobile, 8s, 192 frames, partant de la même frame de base que le clip 3) : succès
  global (2 personnages stables, aucun écran noir, la femme reste bien immobile, l'homme revient bien
  avec l'objet en main) — MAIS le moment précis où il "ramasse" l'objet est visuellement un peu flou/
  pas parfaitement net (cohérent avec le biais déjà documenté "H3 compresse puis résout vite l'action
  utile"). Pas un échec, mais moins net que le dialogue statique — **le dialogue entre 2 personnages
  est le point fort le plus solide, le déplacement+manipulation d'objet un peu moins fiable.**

**Mécanisme de continuité confirmé** : chaîner 2 clips séparés en utilisant la DERNIÈRE FRAME RÉELLE
du clip précédent comme image de référence du clip suivant (pas régénérer une image) garantit une
continuité parfaite (mêmes personnages, même décor, même posture de départ) — même principe déjà
validé sur Sonjata scene2→plan2 (08/08), reconfirmé ici sur un cas multi-personnages.

**Audio généré H3 — jugement au cas par cas, pas une règle automatique** : chaque clip H3 génère une
piste audio qui MIXE voix parlée ET musique/son ambiant en une seule piste stéréo (pas de pistes
séparées, confirmé par `ffprobe`) — impossible d'isoler/garder juste la voix en coupant la musique.
**Verdict Aziz sur ce test précis (2026-08-12) : la voix et la musique générées étaient bonnes sur
les 2 clips de dialogue** — pas un défaut à corriger systématiquement. Écouter chaque clip et décider :
si l'audio convient, le garder ; sinon (ou pour un clip muet à resonoriser via ElevenLabs +
`INDEX-MUSIQUES.md`), le signaler et couper avec `ffmpeg -an`. Détail complet :
`memory/tools/minimax.md` § "Défaut 3 — audio généré non désiré".

**Conclusion pour le brief** : l'argument Premium "personnages qui dialoguent, vraie scène jouée à 2"
est confirmé techniquement viable et fiable — à condition de respecter la discipline de prompt
identifiée (dialogue court en un seul segment, zéro contact physique croisé, nommer précisément
chaque personnage). Le déplacement+manipulation d'objet reste possible mais moins net — à proposer
avec prudence, pas comme un acquis aussi solide que le dialogue statique.

**Coût réel cumulé (Test 1 + Test 2, même session)** : 0 crédit mensuel consommé (voie GPU
open-weight Comfy Cloud, forfait) sur tous les essais, y compris les 2 clips cassés du diagnostic
initial. Seul coût = temps GPU + temps de prompt-engineering humain — un futur usage avec la méthode
et les prompts déjà validés sera nettement plus rapide qu'un 1er essai from scratch.

## Ce qui reste à trancher avant publication (pas décidé dans cette session)

1. **Le nom commercial du style** — le vendeur analysé n'a pas de nom de style distinctif autre que
   "whiteboard" (générique, saturé). `freelance-dataviz-fiverr-pro.md` § leçon designcamp_ insiste :
   "le client achète un style NOMMÉ". Trouver le nom de notre variante SVG pour CE gig (pas juste
   réutiliser le vocabulaire Souverain/Atlas qui vise l'autre segment).
2. **Prix réels** — aucun n'a été dit à voix haute (même limite que le gig premium, cf
   STRATEGIE-LINKEDIN-FREELANCE.md § 6 point 2). Comparer contre 3-5 gigs "explainer simple SVG/2D"
   actuels sur Fiverr avant de figer.
3. **Portfolio de démo** — produire 1-2 exemples courts (30-45s) dans ce format avant listing, pour
   avoir un aperçu vendeur non vide au lancement.
4. **Canal** : Fiverr standard (pas Pro, pas de vetting requis) — cohérent avec le rôle "cash rapide
   pendant que le premium mûrit". Repartir de `freelance-dataviz-fiverr-pro.md` § "3 SYSTEMES
   DISTINCTS" — Niveaux New→Level 1 se construisent par commandes, pas par candidature.

## Prochaine étape suggérée

Produire 1 exemple concret (30-45s, SVG animé maison, sujet neutre type "comment fonctionne X") pour
valider le rendu ET tester le rythme de production réel avant d'écrire les 3 descriptions de tiers
définitives — le prix et le délai annoncés doivent correspondre à un temps de production mesuré, pas
estimé à froid (cf `STRATEGIE-LINKEDIN-FREELANCE.md` § 3 : "le coût caché du perfectionnement, c'est
construire à l'aveugle").
