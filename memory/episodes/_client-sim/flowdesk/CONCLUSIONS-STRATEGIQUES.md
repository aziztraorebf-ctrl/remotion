# Test client-sim Flowdesk — conclusions stratégiques (2026-08-06, affinées par analyse GPT)

> Migré depuis auto-memory 2026-08-31. Contexte : test client simulé "Flowdesk" (SaaS fictif),
> positionnement freelance distinct de Souverain. Détail technique complet du chantier V4 dans
> `STATUS.md` (même dossier) — ce fichier-ci ne garde QUE les conclusions
> stratégiques/méthode, pas la mécanique (pointeur, pas de duplication).
>
> Ce fichier a été réécrit après un débrief GPT-5.6 (post-mortem sur le rendu final) qui a
> reformulé et affiné la première synthèse d'Aziz sur plusieurs points précis — la version
> ci-dessous intègre ces affinages, pas juste la 1ère intuition.

## Ce que Flowdesk a prouvé — le test est réussi, pas juste "acceptable"

Flowdesk devait répondre à UNE question : *la méthode narrative SVG née sur un sujet
géopolitique (Souverain) survit-elle transportée dans un explainer SaaS complètement
différent ?* Réponse : **oui, à condition de ne plus considérer le SVG comme l'intégralité de
la méthode.** C'est la découverte la plus importante du test, pas la vidéo elle-même (qui reste
un prototype, pas une pièce de portfolio finie).

Checklist de ce qui était inconnu AVANT Flowdesk et tranché maintenant :
- Ça fonctionne hors géopolitique ? → Oui.
- On peut faire du SaaS ? → Oui.
- Les personnages sont possibles ? → Pas nativement en SVG, mais oui via pipeline hybride.
- On peut mélanger vidéo et SVG sans que ça se voie ? → Oui — au Panneau 4, le personnage vivant
  dans le container circulaire entouré d'éléments SVG ne lit PAS comme deux techniques collées.
- L'abstraction fonctionne comme explainer ? → Oui, MAIS seulement ancrée sémantiquement (voir
  section CONCRET→ABSTRAIT→CONCRET ci-dessous) — la 1ère version 100% abstraite (V1/V2, sans le
  personnage) avait déjà été rejetée pour cette raison exacte ("lignes → particules → nœud, sans
  savoir ce qu'elles signifient").
- Deux directions de storyboard sont utiles ? → Énormément, y compris la direction la plus
  faible seule (2B, personnage seul) qui redevient une banque de composants excellente une fois
  mixée.

## La vraie découverte : pas "Minimax fonctionne", mais "le pipeline a un emplacement pour la vidéo générée"

Le générateur (MiniMax H3 ici) est interchangeable — demain un autre modèle, peu importe. Ce qui
compte structurellement :

```
LLM/conception -> SVG
LLM/conception -> image -> vidéo générée
UI réelle -> screen capture
        ↓
   compositing
        ↓
  motion design final
```

Ça élimine une limite sérieuse identifiée sur la 1ère passe Flowdesk (V1/V2 100% SVG) : *que
fait-on quand le SVG devient mauvais pour représenter quelque chose (un visage, une émotion, un
geste humain) ?* Réponse : on ne force plus le SVG à tout faire — on bascule vers un générateur
vidéo pour ce que le SVG ne sait pas rendre, et on compose les deux.

## Méthode adoptée pour les prochains tests SaaS — Direction A/B, PAS "storyboard perso vs abstrait" figé

**Reformulation GPT, plus juste que la 1ère version d'Aziz** ("toujours storyboard émotions +
toujours storyboard abstrait" créerait une nouvelle prison — figer "Human" en "il faut un
personnage" est trop restrictif) :

- **Direction A — Human/Narrative** : le problème expliqué via personnes, situations, objets
  reconnaissables, émotions. "Human" n'implique pas forcément un humain — pour un autre produit
  ça peut être un colis, un bâtiment, une voiture, une facture, une transaction : n'importe quel
  objet concret et reconnaissable qui porte le narratif.
- **Direction B — System/Conceptual** : le problème expliqué via systèmes, relations, flux,
  données, architecture, métaphores (le registre abstrait SVG maison).

Process : produire les deux directions en parallèle (nos différents modèles LLM, même logique
que le storyboard-dual-gen existant côté Souverain) → **Semantic Test** (que comprend-on sans la
narration, juste en regardant les 2 storyboards ?) → **mix-and-match** scène par scène, pas un
choix binaire A ou B.

## CONCRET → ABSTRAIT → CONCRET — la structure narrative qui rend l'abstraction lisible

Observation clé (GPT, absente de la 1ère synthèse d'Aziz) : dans la V4, les panneaux abstraits
(P2 bascule, P3 mécanisme) fonctionnent *parce que* le spectateur a déjà vu le personnage
concret au P1 (chaos) — il sait donc ce que l'abstraction représente une fois qu'elle arrive.
**L'abstraction n'est pas mauvaise en soi ; l'abstraction SANS ancrage concret est dangereuse.**
C'est exactement le défaut qui avait fait rejeter la version 100% abstraite (V1/V2) en amont de
ce test.

Structure à retenir pour les futurs explainers :
```
Personne débordée (CONCRET)
     ↓
Flowdesk / flux / routage (ABSTRAIT)
     ↓
Personne + tâche traitée (CONCRET)
```

## Règle à 3 voies : Structure = draw-on · Information = mouvement · Humain = vit

Règle actionnable pour trancher QUEL comportement graphique appliquer à QUEL type d'élément
(remplace le réflexe "stroke-dasharray partout", qui deviendrait vite un gimmick) :

- **Objets structurels → draw-on** (stroke-dasharray/dashoffset, la scène se construit sous les
  yeux) : containers, routes/connecteurs, architecture du système, cercles, contours importants.
  C'est la signature visuelle premium du registre SVG maison (déjà prouvée sur les vidéos
  géopolitiques), difficile à reproduire pour un studio qui ne fait que de l'After Effects.
- **Information → apparition/mouvement** (PAS de draw-on) : emails, messages, notifications,
  documents, données. Ces éléments circulent, ils ne se "construisent" pas.
- **Éléments vivants → vidéo/mouvement organique** : personnage, gestuelle, réaction — le
  registre du générateur vidéo, pas du SVG.

Bénéfice secondaire : ça résout un problème de rythme sans ajouter d'objets. Au lieu de "il ne
se passe pas assez de choses → ajoutons 5 icônes" (le réflexe de dosage qu'on a suivi sur cette
V4), on fait "construisons le système devant le spectateur" — densité informationnelle
identique, sensation de production supérieure.

## Lacune de la V4 : le draw-on n'était pas assez présent (diagnostiquée ET corrigée)

Le retour d'Aziz en cours de session ("le stroke-dasharray ne se voit pas assez") était juste.
**Root cause réelle** (diagnostiquée par extraction dense 10fps, pas juste des stills espacés) :
la technique était bien codée mathématiquement mais enveloppée dans un easing `ease-in-out` sur
le `dashoffset` — le trait reste quasi invisible sur le premier tiers de la fenêtre d'animation
puis "explose" à sa longueur quasi complète en quelques frames au milieu (lecture en POP soudain,
pas en dessin continu). Corrigé : easing LINÉAIRE pur pour un tracé perceptible à vitesse
constante.

**Leçon générale pour tout futur usage de stroke-dasharray comme signature de mouvement** :
- Ne jamais envelopper le `dashoffset` dans un easing d'apparence (spring, ease-in-out) pensé
  pour un fade/pop — ça détruit la perception de "dessin en train de se faire".
- Vérifier par extraction de frames denses (10fps sur la fenêtre de dessin, pas 2-3 stills
  espacés de plusieurs secondes) que le trait progresse visiblement d'une frame à l'autre avant
  de considérer la technique "acquise".
- Appliquer la règle à 3 voies ci-dessus pour savoir OÙ l'utiliser (structure, pas information)
  — évite de re-tomber dans le panneau 1 de cette V4 où des icônes d'INFORMATION (email, chat)
  avaient été considérées candidates au draw-on alors qu'elles auraient dû rester en
  apparition/mouvement.

## Pipeline SaaS V1 — formalisé (GPT), à réutiliser comme squelette de production

```
BRIEF
  ↓
Analyse sémantique (qu'est-ce qui doit réellement être compris ?)
  ↓
Direction A — Human/Narrative     Direction B — System/Conceptual
  ↓
Semantic Test (que comprend-on sans narration ?)
  ↓
Sélection + Mix & Match
  ↓
Storyboard final
  ↓
Choix du média scène par scène (SVG / illustration / vidéo générée / UI réelle / typographie / cartes)
  ↓
Motion Proof
  ↓
Production
  ↓
Draw-on / Mouvement / Compositing (règle à 3 voies ci-dessus)
  ↓
UI réelle si pertinente
  ↓
Son + voix off
  ↓
FINAL
```

Point non testé volontairement par Flowdesk : l'intégration d'une VRAIE interface produit
(screen capture UI réelle). Pas à combler artificiellement sur ce test — une future étude SaaS
avec un produit/interface réellement disponible sera plus pertinente pour ce point précis.

## Fichiers de référence

- Détail technique complet (géométrie, bugs, timings) : `STATUS.md` (même dossier)
- Code : `src/projects/_client-sim/flowdesk/FlowdeskAbstraitV4.tsx`
- Livrable final (v4, post da-brief downstream + fix stroke-dasharray) :
  https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abstrait-v4-chT0OJSJAcfDDErUCEnRNYhQOEfnej.mp4
- Da-brief downstream (3 modèles, Gemini+Kimi vidéo native + GPT frames) : méthode documentée
  dans STATUS.md, sorties brutes éphémères sous `/tmp/da-refs/` (non versionnées).
