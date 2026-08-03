# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-07-30 (ménage mémoire : 116 Ko → ce fichier. Sections closes supprimées, git garde tout)
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"
> ⛔ **Format : 3 lignes max par projet.** Un projet TERMINÉ se SUPPRIME de ce fichier, il ne
> s'accumule pas — c'est faute d'appliquer cette règle qu'il a atteint 116 Ko (~85% de contenu mort).
> ⭐ **RÈGLE DE MAINTENANCE (issue de 2 échecs, 07-27 et 07-30) : ce bloc reste le PREMIER du fichier.**
> Toute nouvelle section de session s'insère APRÈS lui, jamais avant — sinon l'avertissement descend
> et se fait enterrer, et un état périmé est annoncé à Aziz malgré l'avertissement présent et lu.

## ⛔⛔ AVANT DE LIRE QUOI QUE CE SOIT — LES CHANTIERS VIVANTS SONT DANS DES WORKTREES

> **Ce fichier (repo principal) est structurellement EN RETARD** sur les chantiers qui vivent ailleurs.
> ⛔ **Ne JAMAIS recopier ici une table figée des worktrees** (elle se périme en 1-3 jours — vécu 2×,
> 2026-07-27 et 2026-07-30, alors même que l'avertissement était présent et lu). **Toujours exécuter** :
> ```bash
> for w in $(git worktree list --porcelain | grep ^worktree | cut -d' ' -f2); do
>   echo "=== $w [$(git -C $w branch --show-current)]"; git -C $w log --oneline -3
> done
> git stash list
> ```
> Un commit récent dans un worktree **prime toujours** sur ce fichier-ci.
>
> ⚠️ **Stashs connus à vérifier** (peuvent être périmés — confirmer avant de dropper) : au moins
> 1 sur la branche Soudan (`wip-soudan-itineraire-avant-rnd-port`, chantier « itinéraire multi-étapes »
> — `ItineraireMultiEtapes16x9.tsx` etc.) et 2 WIP CFA sur `feat/cfa-nuit1994-svg-mix`.

---

## 📤 PUBLICATION — LA PRIORITÉ ACTIVE

> ⭐⭐ **La chaîne publie enfin.** Après 25 jours de blocage, la publication est démarrée. **Vider le
> calendrier éditorial est la priorité n°1** — le GAZODUC vient après.
>
> | Vidéo | État |
> |---|---|
> | 🇸🇳 Sénégal Pétrole & Gaz (longue) | ✅ **PUBLIÉ** le 2026-07-30 |
> | 🇸🇳 Sénégal (Short 9:16) | ✅ **PROGRAMMÉ** 2026-08-01 15h30 UTC (2 posts TryPost) |
> | ⚔️ War-Map Sahel AES (longue) | 🗓️ **PROGRAMMÉ** 2026-08-04 |
> | ⚔️ AES (Short 90s) | ✅ **PROGRAMMÉ** 2026-08-04 19h UTC (2 posts TryPost) |
> | 💰 Franc CFA (longue) | 🗓️ **PROGRAMMÉ** 2026-08-11 |
> | 💰 Franc CFA (Short 9:16) | ✅ **PROGRAMMÉ** 2026-08-11 15h UTC (2 posts TryPost) |
> | 🇸🇩 Soudan mid-form (longue) | 🗓️ **PROGRAMMÉ** 2026-08-20 (titre/thumbnail/description faits le 2026-07-31) |
> | 🇸🇩 Soudan (Short) | ⚠️ **N'EXISTE PAS ENCORE** — seul chantier Short restant |
>
> ⛔ Règle générale (corrigée 2026-07-31) : un Short lié à une longue sort **le MÊME JOUR** (jamais
> avant, jamais plusieurs jours après — le Short booste l'algo de la longue en lancement).
> ✅ **2026-08-01 : les 3 Shorts existants (Sénégal/AES/CFA) sont TOUS programmés** — crédits TryPost
> rechargés, bug MCP résolu (cf `memory/tools/mcp-servers-env-resolution.md`), CTA corrigé "EN BIO"
> (cf `feedback_cta-lien-en-bio-shorts-multiplateforme.md`). Détail complet + IDs de posts :
> `calendrier-publication-2026-08.md`.
> ⏭️ **Prochaine session** : **CONSTRUIRE** le Short Soudan (boucle NotebookLM, scripts déjà présents
> dans `scripts/tools/soudan-short-audio/`) — dernier Short manquant. Puis **GAZODUC**.
>
> ⚠️ **Dette signalée 2026-08-01** : le worktree `/Users/clawdbot/Workspace/remotion-cfa` (branche
> `feat/cfa-short-9x16`) contient une version DU SHORT CFA NON CORRIGÉE (CTA dit encore "EN
> DESCRIPTION") — divergente du repo principal qui, lui, a le fix. Contient aussi un fichier
> `cfaShortWhisperWords.ts` orphelin (jamais importé, sans risque sur le publié — vérifié). À trancher
> explicitement avec Aziz : soit appliquer le même fix là-bas pour resynchroniser, soit fermer ce
> worktree si le repo principal fait désormais foi (le Short CFA est déjà publié/programmé depuis le
> repo principal, ce worktree n'a peut-être plus d'utilité).
>
> **Source de vérité unique** (dates, titres figés, thumbnails, interdits) :
> `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
> Outils : `scripts/tools/jury-titres-llm.py` · `scripts/tools/jury-thumbnail-llm.py` ·
> ROUTAGE.md § « Publier une vidéo ».
>
> ⚠️ **Leçon structurelle** : ce qui n'est pas outillé ne se fait pas — zéro checklist « de FINAL à
> publié » a coûté 25 j de blocage (2 vidéos finies dormaient depuis le 5 juillet). Si une session
> démarre une prod alors qu'un FINAL non publié dort → le signaler.
>
> **LinkedIn** : compte perso Aziz connecté à TryPost (vide). Titre + section "À propos" rédigés et
> validés (ton casual, assume l'IA franchement) — Aziz doit encore les coller manuellement sur son
> profil (aucun outil ne peut éditer un profil LinkedIn). Vérifier si fait avant de proposer le
> premier post — cf `memory/freelance-linkedin/STRATEGIE-LINKEDIN-FREELANCE.md`.

---

## 🏁 CFA = TERMINÉ

> **L'épisode est PROMU** → `out/PRET-PUBLICATION/franc-cfa-midform-FINAL.mp4`
> (4 min 28 · 8046 frames · −17,2 LUFS). Musique `music-A-ambient-souverain`, volume **0.0716**,
> fenêtre 19,6→259,7 s, aucune boucle. Titre `Une nuit, l'argent a fondu. Le système est resté.`
> (48 car.) · miniature `public/_shared/thumbnails-library/franc-cfa/minuit.png` — **figés le 30/07**.
> **Reste = upload MANUEL YouTube Studio (~11 août)** — ⛔ une vidéo LONGUE ne passe JAMAIS par
> TryPost (règle d'or `memory/tools/trypost.md`).
>
> ⛔ **Chantiers ÉCARTÉS APRÈS TEST, ne pas rouvrir** : le grain (invisible jusqu'à 6× le réglage) ·
> les creux d'animation (jugés non gênants). ⛔ **Ne PAS re-assembler depuis les rushes `beats/`** :
> `beat5b-levier-FINAL.mp4` est la version PRÉ-COUPE — un re-assemblage naïf rallongerait de 10 s.
> ⭐⭐ **Sur 4 recommandations LLM testées, ZÉRO correction** : 3 étaient factuellement fausses contre
> le code. Leçon : `feedback_defaut-signale-par-llm-verifier-quil-nous-concerne.md`.
>
> **2 chantiers "session future" sont FAITS** : (1) preuve de concept slide NotebookLM → scène SVG
> réussie (`RND-PiliersGouffre`) — ⛔ **destinée au GAZODUC, pas au CFA** (Aziz a tranché : une scène
> plus belle qui dit moins de choses n'est pas un gain — la 6b porte le sac+Sira+« ? », les piliers
> non). (2) Boucle NotebookLM long→short documentée → `memory/tools/notebooklm-boucle-short.md`.
>
> **Reste ouvert (jamais commencé)** → `memory/starters/STARTER-PROMPT-notebooklm-planche-slides-et-videos.md` :
> planche de slides pour idéer les scènes du GAZODUC (candidat n°1 — piège de la carte : sujet abstrait).

---

## 🎭🎭 SCÈNES À PERSONNAGES — SOCLE COMPLET, R&D CLOSE

> ⭐⭐⭐ **LIRE `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`** — tout y est détaillé.
> ✅ **MERGÉ DANS `master` le 2026-07-29** (fast-forward) — disponible pour tout le monde.
>
> ### ⛔ DÉCISION DE FIN DE SESSION (Aziz) : ON ARRÊTE LA R&D, ON PASSE À LA PRODUCTION
> « Continuer éternellement pourrait être un piège pour faire ce qui est le plus important : créer
> des vidéos et les publier. » Les questions qui restent demandent un vrai sujet, pas un labo.
> ⏭️ **PROCHAINE VIDÉO = LE GAZODUC**, en SVG — c'est là qu'on testera pour de vrai (et un gazoduc
> est spatial/causal = peut-être plutôt de la CARTE ; un résultat en soi).

**Acquis, ne pas re-prouver** : 3 registres (CONTEMPLATIF / SCHÉMATIQUE / DÉMONSTRATIF, choix au
script) · le personnage qui AGIT (`PorteurCharge16x9`, une charge grossit, lui ne change pas) · la
scène NARRÉE (`PorteurNarre16x9`, geste calé sur forced-align) · le personnage RICHE (2-3 archétypes
max désignés au script) · zoom push-in + sol qui fléchit = utile ; décor riche/grille/compteur/sueur
= inutile, **le fond reste UNI**.

**2 règles générales** : (1) un élément doit porter une info que les autres ne portent pas déjà **ET**
utile à la démonstration — participer ne suffit pas. (2) un effort poussé à fond dégrade la lecture
avant d'ajouter du sens (`lean` 23°→14°).
⛔ **Hiérarchie** : ABSENCE > PARTICIPANT > INERTE — vaut pour cette scène-là (funambule, métaphore déjà
complète), pas une loi générale (un lieu qui porte une info propre pourrait inverser la réponse).

⭐ **2026-08-03 — Héritage de pose CONFIRMÉ sur 2e cas + pose "au sol" débloquée.** Brique n°7
(continuité par héritage, jamais fondu) prouvée sur un 2e enchaînement indépendant (gestes expressifs
sans objet). La pose "corps effondré au sol", jugée impossible sur `<Stick>` après 2 rounds de
tâtonnement, était en fait DÉJÀ VALIDÉE sur l'autre moteur (`<Figure>`, geste `BandeChute`/`P_SOL`) —
portée par IK + paramètre `headTuck` manquant. Effondrement validé visuellement par Aziz sur rendu.
Commit `14990278` (repo principal, PAS le worktree remotion-cfa — voir décision ci-dessous).
Détail : `src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` brique n°7.
⛔ **DÉCISION EN ATTENTE** : intégrer ce résultat dans une vraie scène de production (pas juste
`_rnd/fable-libre/`), et généraliser la méthode de portage IK en fonction réutilisable (2 cas réels
seulement pour l'instant, seuil de généralisation à rediscuter avec Aziz).

⚠️ **Bug `BRAS_LAG` non appliqué par `Figure`** — ~9% du cycle en pose dégénérée, touche potentiellement
toutes les scènes stick figure. Parade côté appelant en place ; socle non corrigé (décision Aziz en
attente, corriger obligerait à revalider 6 planches).
⚠️ **3 améliorations relevées, non traitées** : objet qui « pop » à l'épaule · premier plan qui se vide
si les allures varient trop · figurants d'arrière-plan trop statiques (piste : varier la POSTURE).
⛔ **Pistes écartées, ne pas ressortir** : personnage + carte · vues de dos/3-4 (profil seul) · tout visage.

---

## 1. Maroc Batteries Short — reste A5 Géographie + assemblage

⚠️ **L'état « A5 = STUB / placeholder » est FAUX** (noté 2026-06-03, jamais revérifié depuis) :
`Beat4Geographie.tsx` fait **417 lignes avec Mapbox complet** (vérifié 2026-07-30, 2 branches).
**→ RENDRE ET REGARDER le beat avant de conclure quoi que ce soit** (règle CODE + VISUEL).
Les 5 autres beats (Hook, Phosphate, Cailloux, Acteurs, Question) sont FINAUX.
**Starter** (à revérifier avant usage vu l'erreur ci-dessus) : `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`.

---

## ⭐⭐ GAZODUC (AAGP vs TSGP) — ACTE 1 GLOBE D3 PROTOTYPÉ, DRAPEAUX NON TRANCHÉS

**État (2026-08-03)** : audio complet (Harmonie, `narration.mp3`). Prototype de l'Acte 1 (hook) codé
en globe D3 (`src/projects/_rnd/d3-16x9/ProtoGazoducGlobeFusion.tsx`, 8 rounds d'itération) — PAS
encore le fichier de production (`GazoducActe1Hook.tsx` existant est une version antérieure buguée,
à remplacer pas patcher). Registre retenu = **globe D3**, pas une scène-lieu SVG genèse 2016 (piste
écartée). Review upstream à 3 voix (Gemini+Kimi+GPT-5.6 Sol) faite et synthétisée.
⛔ **DÉCISION EN ATTENTE (priorité à la reprise)** : les 3 modèles convergent pour dire que le
remplissage plein par drapeau (Espagne/Algérie) lit comme amateur ("carte de Risk") — options
proposées (suppression / pastille+halo / flash puis désaturation), Aziz doit trancher avec un
regard neuf avant de continuer.
Détail complet : `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md` +
`memory/episodes/souverain/gazoduc-aagp-tsgp/da-brief-acte1-v8-review/SYNTHESE.md`.
Repère sujet : `memory/projects/GAZODUC-MEGAPROJETS-SUJET.md`.

---

## ⏳ ACTIONS OUVERTES

### Recharger le crédit OpenAI
Quota épuisé le 2026-07-25 (`429 insufficient_quota`). Bloque `whisper-align.py` / `transcribe-openai.py`.
**Contournement en place** : `scripts/tools/forced-align.py` (moteur ElevenLabs) couvre l'alignement.

### Activer les routines /schedule — NON FAIT, rappeler à Aziz
Aziz a demandé un rappel persistant jusqu'à confirmation ; **re-signaler en début de session**.
2 routines cloud de monitoring Postiz (Aziz les crée lui-même — clé API en env cloud = sa décision
sécurité) : `/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a
échoué` · `/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan`.
Ajouter `POSTIZ_API_KEY` en variable d'environnement. **Quand Aziz confirme → supprimer cette section.**

### Audit des skills du workspace — demandé le 2026-07-11, jamais fait
88 dossiers sous `.claude/skills/`, suspicion de redondance/inutilisation. Report volontaire (tête
fraîche dédiée). Cadrage : distinguer génériques vs spécifiques Remotion · chercher les traces d'usage
réel (grep `PIPELINE.md`/`STATUS.md`) · chercher les doublons fonctionnels · même méthode agents-vierges-
en-parallèle-puis-trancher-ensemble que les ménages du 30/07.

---

## 💡 BACKLOG (rien d'actif — ne pas lancer sans décision d'Aziz)

- **Carrousel « Good News »** — pipeline hebdo PRÊT, jamais relancé depuis #1. Démarrer :
  `python3 scripts/prepare-goodnews-weekly.py` puis suivre le BRIEF généré.
- **Carousels Instagram** — Or Africain + Thiaroye prêts, Mansa Moussa à refaire.
  *Décision en attente* : par quoi commencer. *Ma reco* : Sénégal Pétrole (matière fraîche, publié 30/07).
- **Système hook + CTA commentaire** — checklist hook universelle (20 premières secondes) + template
  CTA à 30-60 s, jamais construits.
- **Xénophobie SA** — angle validé (« double face », apartheid économique), données 2026 intégrées.
  *Gate avant production* : validation demande d'audience TubeLab.
  Dossier : `memory/episodes/souverain/xenophobie-sa-EXPLORATION/`.
- **Pipeline Shorts automatisé trending** — décision : pas maintenant, y revenir quand le long format
  est bien en place.
- **Peste 1347 mid-form horizontal** — concept validé 2026-06-07, backlog (ne pas commencer avant
  fin AES + Maroc Batteries). Fiche : `memory/projects/peste-1347-midform.md`.
- **Peste 1347 — 2 chantiers actés** (détail `episodes/peste-1347/STATUS.md`) : régénérer la narration
  avec le pipeline voix vivante (actuelle antérieure au pipeline, jugée monotone) · système multi-agent
  d'amélioration post-fix.
- **`GeoFlowConnection`** (pipeline Mapbox) — lignes/arcs animés entre pays, centroïdes dérivés des
  bbox projetées. À coder au PREMIER sujet à flux.
- **Patterns `_reference-atlas-poc/` non portés** : `AtlasParcheminGlobe.tsx` (caméra sphérique →
  Mercator) · `AnimatedCaravan.tsx` (route commerciale animée) · `atlas-parchemin-mande.json`
  (style historique).
- **Vox Papercraft** (reproduire un style vidéo tiers sans Higgsfield) — 1re partie validée, pipeline
  officialisé (`memory/doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md`). Finitions restantes : halo
  détourage résiduel, retirer noms d'États, intégrer photo halftone, puis monter une séquence multi-plans.
- **R&D D3 16:9** — moteur agnostique au ratio, prouvé sur Soudan (Actes 3/5/6 en Globe D3). Backlog
  restant : sol enrichi (relief simulé, pour rattraper le "terrain habité" Mapbox) · globe 2.0 (arcs
  `geoInterpolate`, terminateur jour/nuit) · data-viz cartographique (choroplèthe, cartogramme, small
  multiples) · flux & réseaux (`d3-force`, `d3-chord`) · registre vidéoludique (HUD tactique, timeline-
  scrubber). Détail : `src/projects/_rnd/d3-16x9/README.md`.
- **Seedance personnage** — technique prouvée (suit un prompt narratif riche sans dérive de style) mais
  ÉCARTÉE par décision coût (~6.85$/clip). SVG reste la voie par défaut. Backlog conditionnel si le
  budget/contexte change un jour (détail méthode dans l'historique git si besoin).

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

**Format : 3 lignes max par projet** (Etat / Decision en attente / Recommandation).

⛔ **Un projet TERMINÉ se SUPPRIME de ce fichier** — son état vit dans `memory/episodes/<ep>/STATUS.md`
et sa publication dans le calendrier. Ne jamais garder de « trace historique » ici : git la conserve.
Ce fichier avait atteint **116 Ko dont ~85% de sections closes** faute d'appliquer cette règle.
