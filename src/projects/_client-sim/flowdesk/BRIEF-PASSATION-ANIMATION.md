# Brief de passation — Flowdesk, prochaine session (ANIMATION)

## ⭐⭐ MISE A JOUR 2026-08-06 — Volet 2B (personne/émotion) PRODUIT, lire AVANT le reste du fichier

Le reste de ce fichier (ci-dessous) décrit l'état du 2026-08-04, où RIEN n'était animé — c'est
maintenant FAUX pour le Volet 2B. Section conservée pour l'historique des décisions (palette,
leçons par modèle LLM), mais le statut "reste à faire" ne s'applique plus qu'aux points listés ici.

**Livrable produit et validé (panneaux 1 "Chaos" + 2 "Bascule") :**
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/flowdesk-personne-2b-v9-final-UKKPrAI1m7eK91F1hC5aGZfH7OuzHU.mp4
(fallback disque si le lien expire : `out/_r-and-d/flowdesk-personne-2b-v9-final.mp4`)

**Ce qui a été fait** : silhouette du personnage animée via **MiniMax H3** (nouveau modèle
image-to-video, fal.ai, ~$1.30/5s en 2K — voir `memory/tools/minimax.md` section H3 pour le détail
technique, notamment la contrainte ping-pong via `ffmpeg -vf reverse`, pas de reverse natif
Remotion/navigateur) + icônes SVG (Fable5, 2 passes : v1 cercles puis v2 bulles rectangulaires après
comparaison au vrai storyboard de référence) + logo Flowdesk animé (tracé séquentiel SVG) + 6 SFX
notification + 1 lit de tension générés via ElevenLabs Sound Effects API + narration/musique déjà
existantes. Composition : `src/projects/_client-sim/flowdesk/FlowdeskPersonne2B.tsx` (enregistrée
dans `Root.tsx` sous l'id `Flowdesk-Personne-2B`).

**DA-brief upstream lancé pour la première fois sur ce projet** (Gemini+Kimi+DeepSeek, brief adapté
format pub 45s/YouTube-premium) → synthèse tracée complète dans
`src/projects/_client-sim/flowdesk/PLAN-DA-BRIEF-PERSONNE2B.md`.

**Décision de goût notable (Aziz, 2026-08-06)** : exception ASSUMÉE et SCOPÉE à ce panneau précis —
les icônes de notification volent en continu de façon désordonnée sur tout le cadre (haut ET bas),
pas juste apparaître-puis-rester-figées. Le chaos volant EST le sujet du panneau. Ne s'applique PAS
aux autres registres/objets inertes (règle générale CLAUDE.md inchangée par ailleurs).

**⚠️ CHANTIER PARALLÈLE** : une autre session travaille SIMULTANÉMENT sur le même dossier
`flowdesk/`, sur le registre ABSTRAIT (`FlowdeskAbstrait2A.tsx`, `FlowdeskAbstraitV3.tsx`,
`FlowdeskAbstraitV4.tsx`, `camera.ts`, `groups-v3/` — tous untracked, datés d'aujourd'hui). Aucun
conflit de fichier avec le Volet 2B, mais **vérifier l'état des DEUX fronts avant de trancher entre
eux** — Aziz n'a pas encore comparé/choisi entre registre abstrait et registre personne.

**Reste à faire (confirmé par Aziz avant coupure de session)** :
1. Générer les vidéos MiniMax H3 pour panneaux 3 (Mécanisme) et 4 (Résolution), 5s chacune
2. Coder leur animation — fond CRÈME validé pour le panneau 3 (rupture de palette assumée),
   structure tripartite entrée/traitement/sortie suggérée par les 3 modèles du DA-brief mais
   PAS encore débattue en détail avec Aziz
3. Questions ouvertes non tranchées : le dosage du chaos/débordement des icônes panneau 1 en v9
   est-il définitif ou encore à ajuster ? Jugement d'Aziz sur les 6 SFX une fois entendus en contexte ?

---

## État au 2026-08-04 (historique — palette, décisions par registre, leçons LLM)

Session de test client simulé "visual storytelling explicatif" (positionnement freelance, pas
Souverain). Toute la matière STATIQUE est prête. Cette session-ci n'a PAS animé — reste à faire.

## Page de comparaison complète (toutes les images testees, qualite originale)

https://velvet-portal-r5s9.here.now/

Slug `velvet-portal-r5s9`, claimToken sauvegarde dans cette session (a redemander si besoin de
republier — chercher dans les logs de la session precedente ou republier une nouvelle page).

## Dossier de travail

`src/projects/_client-sim/flowdesk/` — tous les fichiers sources (SVG + PNG) sont sur disque,
rien a re-generer sauf si un choix change.

## DECISION PRISE (2026-08-04, fin de session) — ANIMER LES DEUX SEPAREMENT

Aziz a tranche : **on anime les DEUX registres separement, chacun en entier**, pour comparer en
mouvement (pas un mix des deux dans un seul livrable a ce stade) :
1. **Registre abstrait maison** — les 4 panneaux SONT COMPLETS et retenus, a animer integralement.
2. **Registre personne/emotion** — 4 panneaux egalement disponibles (structure du storyboard
   `storyboard-v2-gemini.png`), palette d'origine jugee suffisante pour ce test, **a animer
   integralement aussi**.

⚠️ **Point de vigilance signale par Aziz sur le panneau RESOLUTION (abstrait)** : compare a
l'equivalent Gemini (`storyboard-v1-gemini.png`, panneau 4), le `proto-fable5-resolution.svg`
est "plus beau mais moins clair" — l'anneau ouvert qui se scelle est elegant mais moins
immediatement comprehensible qu'un checkmark. Piste proposee par Aziz : **profiter du fait que
c'est du SVG (pas une image figee) pour faire apparaitre une icone ou un mot bref** au moment du
scellement, qui clarifierait sans casser l'esthetique. A tester en priorite au debut de la session
d'animation — possible que l'animation elle-meme (le mouvement de fermeture) resolve deja une
bonne partie du probleme de clarte, a verifier avant de rajouter du contenu.

Question OUVERTE (a re-evaluer apres avoir vu les deux anime) : lequel devient le livrable final,
ou est-ce qu'un mix des deux (ouverture abstrait, fermeture personne, ou l'inverse) est meilleur ?
Pas de reponse a deviner — comparer une fois les deux animes, puis trancher avec Aziz.

## REGISTRE ABSTRAIT — les 4 panneaux retenus (source de verite)

Storyboard narratif : ETAT INITIAL (chaos) -> BASCULE (convergence/vortex) -> MECANISME
(aiguillage automatique) -> RESOLUTION (boucle fermee/confirmation).

| Panneau | Fichier SVG source retenu | Modele | Notes |
|---|---|---|---|
| 1. Chaos | `mix-fable5-gpt56sol-chaos.svg` | MIX Fable5+GPT-5.6Sol | Fable5 = moitie gauche (chaos), GPT-5.6Sol = moitie droite (hub/fleches). Couture a x=960, verifiee propre par mesure de luminance. |
| 2. Bascule | `proto-fable5-reproduce-bascule.svg` | Fable 5 seul | Meilleur des 3 modeles testes, vraie structure 3D (trompette + anneaux inclines). Aziz : "a utiliser tel quel". |
| 3. Mecanisme | `proto-fable5-mecanisme.svg` | Fable 5 seul | Module d'aiguillage isometrique en perspective, 5 destinations. |
| 4. Resolution | `proto-fable5-resolution.svg` | Fable 5 seul | Anneau OUVERT que le paquet vient sceller (pas un checkmark generique) — meilleur des 3, tres epure par design. |

**viewBox** : panneau 1 (mix) = 1920x1080 (2 moities de 960 chacune). Panneaux 2/3/4 = 960x1080
chacun (format demi-largeur, PAS le meme ratio que le panneau 1 — a harmoniser au moment du
montage/composition Remotion, pas encore fait).

**Palette stricte respectee partout** : `#0B1F3A` (bleu fonce, fond) / `#FFFFFF` (blanc) /
`#FF6B1A` (orange accent). Verifiee par grep sur chaque fichier au moment de la generation.

## REGISTRE PERSONNE/EMOTION — A ANIMER INTEGRALEMENT (4 panneaux disponibles)

- Storyboard de reference (structure/composition validee par Aziz) : `storyboard-v2-gemini.png`
  (4 panneaux : SURCHARGE MENTALE -> REORGANISATION -> SYSTEME ORDONNE -> CONTROLE CALME).
- Palette d'origine (bleu-violet Gemini) **jugee suffisante par Aziz pour voir a quoi ca
  ressemblerait avec les icones** — PAS besoin de repousser la correction de palette plus loin
  avant l'animation.
- Silhouette isolee la plus reussie (fond transparent, detourable, pour composition Remotion) :
  `silhouette-gpt-isolee.png` (GPT-5.4-image-2). Recolor manuel valide separement :
  `silhouette-gemini-recolor-manuel.png` (chroma-key vert->bleu, zero derive de contenu).
- Piste Recraft (nouvelle, hors pipeline principal) : `recraft-gen-v2-palette.svg` — meilleure
  silhouette obtenue toutes sources confondues (mains/visage credibles), MAIS sans groupes SVG
  nommes (juste des `<path>` bruts) -> animable seulement comme BLOC ENTIER RIGIDE (fade/scale
  d'ensemble), PAS par partie (bras separe de la tete). A savoir avant de planifier l'animation
  de cette piste specifiquement.

### Piste a tester en debut de session animation — icones/objets SVG low-cost pour ce registre

Aziz veut verifier si des modeles moins chers que GPT-5.6 Sol/Kimi K3 suffisent pour LES ICONES
(pas la silhouette — deja tranchee) de ce registre, avant de lancer l'animation complete :
- **GLM-5.2** (`z-ai/glm-5.2` via OpenRouter, ~5-7x moins cher que GPT-5.5, deja adopte comme 3e
  modele complementaire dans le registre Souverain pour jetons/assets en lot — voir
  `memory/tools/openrouter-svg.md`). A tester ici sur les icones de canaux (email/chat/Slack/HR/
  document) du panneau 1, meme registre flat-design que la silhouette retenue.
- **Fable 5 en mode ELEVE** (pas MAX — Aziz precise "mode eleve", coherent avec la doctrine
  CLAUDE.md : mode eleve = scenes normales + objets/jetons, MAX reserve au complexe/organique/
  visage). Tester si Fable 5 reproduit les icones du storyboard aussi bien qu'il a reproduit les
  panneaux abstraits, mais SANS le cout du mode MAX (economie de temps agent).
- **Recraft** (deja teste sur la silhouette, a tester specifiquement sur les icones cette fois —
  son point fort demontre = objets/pictogrammes propres en peu de `<path>`).

But du test : si GLM-5.2/Fable-mode-eleve/Recraft reproduisent les icones a un niveau suffisant,
ca valide qu'on peut mixer un pipeline economique (icones low-cost) + une brique premium (la
silhouette, deja tranchee sur GPT-5.4) — reproductible comme methode pour de futurs projets
clients avec budget serre.

## LECONS TECHNIQUES DE CETTE SESSION (a ne pas re-decouvrir)

- **Fable 5 (agent Claude Code, mode MAX) est LE meilleur modele sur le registre abstrait
  geometrique** — gagnant 3/3 sur bascule/mecanisme/resolution face a GPT-5.6 Sol et Kimi K3.
  Produit du VRAI SVG vectoriel (verifie : zero image raster encodee, uniquement des primitives
  path/circle/ellipse), y compris des structures en volume/3D (la trompette du panneau bascule).
  Gratuit (inclus abonnement Claude Max) contre des appels API payants pour les autres modeles.
- **Kimi K3 via OpenRouter** : le parametre `reasoning.max_tokens` ET `reasoning.effort` sont
  MUTUELLEMENT EXCLUSIFS (erreur 400 si les deux passes ensemble). Pour pousser l'effort au
  maximum : `"reasoning": {"effort": "high"}` SEUL, sans `max_tokens` dans le meme objet. Sans
  aucune borne/effort, Kimi K3 peut rendre `content: null` (tout part en reasoning) — voir
  `memory/tools/kimi-k3-reasoning-borne.md` (regle generale du repo) pour le cas standard.
- **Gemini image-to-image pour une correction de palette stricte NE TIENT PAS la fidelite** :
  teste 2 fois, a chaque fois il derive (soit garde une partie de l'ancienne palette, soit — pire
  — invente du texte marketing non demande). Pour un simple remplacement de couleur sur une image
  existante, preferer un recolor MANUEL (chroma-key / remplacement RGB direct via PIL/Pillow) —
  plus lent a coder mais 100% fidele, zero risque de derive de contenu.
- **Gemini a un garde-fou anti-marque qui bloque sur un logo FICTIF** genere par lui-meme dans un
  storyboard anterieur (a pris le "F" stylise de Flowdesk pour une vraie marque protegee). Prompt
  fix : preciser explicitement "logo fictif, aucune marque reelle, tu as le droit de le modifier".
- **Recraft MCP est connecte et fonctionnel** (`mcp__recraft__*`), 7380 credits disponibles au
  04/08. `vectorize_image` sur une image raster produit un SVG a des MILLIERS de `<path>` sans
  groupe nomme (8835 sur notre test) — inutilisable pour de l'animation par partie. `generate_image`
  avec `style: vector_illustration` produit un SVG propre (14-16 path) et le MEILLEUR rendu de
  silhouette humaine obtenu toutes sources confondues, mais le style/substyle choisi peut ecraser
  la consigne de couleur du prompt texte (notre test est sorti en noir/blanc malgre la consigne
  bleu/orange) — prevoir un recolor manuel systematique apres generation Recraft.
- **LottieFiles Creator MCP** (question posee par Aziz, non installe/non teste) : d'apres sa
  documentation, ce n'est PAS un generateur d'illustration organique — c'est un assistant
  d'EDITION d'animation (import de SVG existant, puis retouche position/timing/couleurs via IA).
  Registre "formes abstraites/UI" (spinners, progress bars), pas personnages. Pas necessaire pour
  ce chantier — notre pipeline SVG->Remotion (spring/interpolate) fait deja ce role, et un import
  Lottie ajouterait une couche de conversion sans gain net. A revisiter seulement si besoin futur
  precis de motion-design UI hors registre narratif.

## AUDIO — decisions prises (2026-08-04)

- **Voix** : Harmonie V3 (voix GeoAfrique deja en usage sur le registre Souverain) — Aziz precise
  explicitement que ce n'est PAS grave de reutiliser cette voix pour un test client hors-registre,
  pas besoin d'en chercher une autre pour ce test.
- **Musique** : Aziz veut une musique **DIFFERENTE** du registre kora/africain habituel — quelque
  chose qui va avec ce type de graphisme (abstrait geometrique premium, style SaaS/tech). A
  chercher/generer specifiquement pour ce chantier, ne PAS reutiliser un morceau Souverain existant.
  Pas de piste precise donnee — a proposer en session (Minimax via fal.ai, meme outil que
  d'habitude, mais brief de genre totalement different — voir `memory/tools/` pour la doc Minimax).
- **Duree cible** : ~45 secondes (le brief client d'origine), Aziz precise que depasser legerement
  n'est "pas la fin du monde" — pas une contrainte stricte a la frame pres, mais rester proche.
- **Script a ecrire** : pas encore fait. A rediger en debut de session animation, cale sur les 4
  panneaux (abstrait ET/OU personne selon lequel est anime), rythme "video assez dynamique" selon
  Aziz.

## PLAN PROPOSE POUR LA PROCHAINE SESSION (2 volets independants + tests low-cost)

### Volet 1 — Ecriture + audio (prealable aux deux animations)
1. Ecrire un script court (~45s, ton dynamique, aligne sur le message Flowdesk : chaos->solution).
2. Generer la narration (ElevenLabs, voix Harmonie V3) + mesurer l'audio (ffprobe/Whisper) pour le
   timing-derive obligatoire.
3. Generer/choisir la musique (Minimax via fal.ai, brief de genre NOUVEAU — pas kora/africain,
   plutot electronique/corporate-premium/synth coherent avec le graphisme abstrait geometrique).

### Volet 2A — Animation registre ABSTRAIT (les 4 panneaux DEJA retenus, prets a l'emploi)
1. Harmoniser les viewBox (panneau 1 = 1920x1080 en 2 moities, panneaux 2-4 = 960x1080 chacun) —
   probablement recadrer/repositionner pour 1920x1080 plein cadre partout avant composition Remotion.
2. Tester en priorite une solution au probleme de clarte du panneau RESOLUTION (voir section
   dediee plus haut) — animation seule peut suffire, sinon ajouter un element de clarification
   discret (icone/mot) sans casser l'esthetique "plus beau que Gemini".
3. Convertir chaque SVG statique en composition Remotion animee (spring/interpolate, jamais
   hardcode, cale sur l'audio du Volet 1), transitions entre les 4 panneaux.

### Volet 2B — Animation registre PERSONNE/EMOTION (4 panneaux, silhouette tranchee)
1. Tester d'abord GLM-5.2 / Fable-mode-eleve / Recraft sur LES ICONES (email/chat/Slack/HR/
   document) du storyboard `storyboard-v2-gemini.png` — voir section dediee plus haut, but =
   valider un pipeline low-cost pour les icones a cote de la silhouette premium deja choisie.
2. Composer silhouette (GPT-5.4 `silhouette-gpt-isolee.png`, fond transparent) + icones retenues +
   fond bleu marque, en 4 etats animes (surcharge -> reorganisation -> systeme ordonne -> controle
   calme), cale sur le meme audio que le Volet 2A (meme narration, meme duree ~45s).

### Volet 3 — Comparaison finale + decision
Une fois les 2 registres animes (meme audio, meme duree), les comparer en mouvement reel (pas en
statique) et trancher avec Aziz : lequel devient le livrable final du test, ou un mix des deux.

### Orchestration suggeree (pas figee, a l'appreciation de la session)
Etant donne le volume (2 animations completes + tests low-cost + audio), envisager de deleguer les
volets 2A et 2B a des agents/sessions paralleles une fois le Volet 1 (audio) termine — chaque volet
est independant une fois l'audio disponible, se prete bien a une execution parallele plutot que
sequentielle pour ne pas allonger indument la session.
