# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-08-04 (ménage mémoire initial 2026-07-30 : 116 Ko → ce fichier. Sections closes supprimées, git garde tout)
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

## ⭐⭐ MiniMax H3 via Comfy Cloud — SESSION D'ENCHAÎNEMENT FAITE (2026-08-08), prototypes archivés

**Découverte de session** : H3 open-weight tourne gratuitement (inclus abonnement, ~$3.83 pour 7 clips
ce soir) via Comfy Cloud MCP — 5-23x moins cher que Seedance 2.0 pour un résultat comparable, si le
prompt est écrit avec la même rigueur que Seedance. Setup + bilan complet : `memory/tools/minimax.md`
§ Comfy Cloud (tout en haut du fichier).

**⭐⭐⭐ Découverte clé confirmée sur toute la session** : le laxisme du prompt (pas H3 lui-même) est la
cause des hallucinations/désynchronisations. Toujours passer par `visual-producer` (discipline
Seedance 2.0 : séquençage par tranches + clause négative répétée + décor verrouillé + **clause de
causalité explicite pour tout objet manipulé** — ajout de cette session, corrige le défaut "objet qui
se déforme sans main visible").

**✅ 2 prototypes validés par Aziz, archivés comme référence** :
`out/_r-and-d/minimax-h3-prototypes/sonjata-vertical/` (2 clips + prompts exacts + image source +
README). Prouvent : ratio vertical natif 480x864 fiable, nommer précisément qui réagit > "the crowd",
ombres portées cohérentes avec le mouvement. Piste #1 (enchaînement 2 plans) et #2 (foule nommée) de
la session précédente = FAITES, ne pas refaire.

⛔ **Limite trouvée** : au-delà de ~12-15s (proche du plafond documenté H3) ou avec des tranches
temporelles qui ne couvrent pas toute la durée réelle, artefact de dégradation progressive possible
(triangle noir observé). Rester sous ~10-12s ou couvrir explicitement 100% de la durée en tranches.
⚠️ **Incident non résolu** : un run a livré un contenu totalement étranger au prompt (statut
"succeeded" mais scène aberrante) — diagnostic a écarté toute cause de notre côté, probable incident
Comfy Cloud. Règle ajoutée : toujours logger le `prompt_id` de chaque `run_template` (voir
`minimax.md` tout en haut) pour pouvoir enquêter si ça se reproduit.

**Session 2026-08-09 — les 3 pistes ci-dessus sont FAITES, ne pas les re-proposer comme "à tester" :**
1. Workflow "personnages posés puis animés" — testé indirectement (scène composée avant animation), fonctionne.
2. Multi-référence façon Seedance Omni (node 139 comme vraie 2e référence) — CONFIRMÉ FONCTIONNEL.
3. Format horizontal — CONFIRMÉ FONCTIONNEL, natif sans fix requis.
Détail complet + prompts + vitesse par résolution : `memory/tools/minimax.md` § Comfy Cloud.

**⭐ Nouvelle piste ouverte, non résolue — storyboard multi-panneaux séquentiel** : le prompt seul,
même segmenté par blocs de temps, atténue mais NE RÉSOUT PAS le blending entre panneaux (les
panneaux d'un storyboard-grille se mélangent visuellement au lieu de rester distincts). Prochaine
étape : recherche communautaire dédiée (YouTube "last 30 days") avant de retenter un essai de prompt
à l'aveugle. Détail : `memory/tools/minimax.md` § storyboard multi-panneaux.

Assets déjà utilisés pour les tests archivés : `scene2-humiliation-v2-13s.mp4`/frame extraite (Sonjata,
prototypes validés), `scene4-final-keepandduck.mp4` (orbite barre de fer, résultat mitigé — voir
minimax.md pour le détail complet). Le projet Sonjata complet (28 clips papercraft) vit dans
`public/assets/sonjata-papercraft/clips/`. Nouveau personnage créé cette session : "visiteur-age-dakar"
(homme âgé, cape verte, robe indigo, canne), registre `public/_shared/refs/characters/visiteur-age-dakar/`.

---

## ⭐⭐ GAZODUC ACTE 3 (TSGP) — À TRANCHER EN PRIORITÉ

Rendu v2 corrigé après DA-brief critique, lien
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/acte3-v2-Sw435S8sYbHTbgMbmvDkRfPMdkyhFT.mp4
— Aziz doit le revoir. ⭐⭐ **Plan de refonte v3 produit par 4 agents vierges (2026-08-07)**, diagnostic
transversal + point de goût Segment B non tranché (registre "vie qui s'éteint sans acteur" vs variante
état-major) : `memory/episodes/souverain/gazoduc-aagp-tsgp/PLAN-ACTES2-5.md` § "TEST STUDIO RÉUTILISABLE".
Ne PAS scanner `MAPBOX-COMPOSANTS.md`/`COMPOSANTS-INDEX.md` après coup, AVANT de recoder — déjà fait par
le plan v3, à lire d'abord.

---

## 🔧 BACKLOG — Studio réutilisable (Mécanisme 1 Gardien, pas urgent)

✅ **Mécanisme 2 (Extracteur) codé et validé fonctionnel** (2026-08-07) — rattrapage rétroactif fait
(Soudan, CFA, AES, Sénégal Short D3, Gazoduc Actes 1+2, Peste 1347, Flowdesk : ~30 briques indexées dans
`COMPOSANTS-INDEX.md`, `WARMAP-COMPOSANTS-INDEX.md` + nouvelle section Globe D3, nouveau
`_client-sim/CLIENT-SIM-COMPOSANTS-INDEX.md`) + test de découvrabilité 6 agents concluant (convergence
3/3, section Globe D3 retrouvée sans être nommée). Détail complet : `memory/doctrines/
STUDIO-REUTILISABLE-GATE.md` + leçon méthodologique `feedback_catalogue-position-liste-et-brief-restrictif-
cachent-brique-existante.md`.
⚠️ **5 entrées catalogue corrigées le 2026-08-07** (détectées par les agents de test, pas par moi en
écrivant) : `PriceTagImpact` (chemin faux) + `ImpactStamp`/`TetherFlow`/`PopulationDots`/
`SelfWritingSignatures` (noms de composants inventés, jamais isolés sous ce nom dans le code réel — marqués
⚠️ dans `COMPOSANTS-INDEX.md`, à réexaminer avant toute extraction réelle).
⚠️ **Point d'hygiène toujours non tranché** : le CFA mid-form vit dans un worktree `remotion-cfa` (branche
`feat/cfa-nuit1994-svg-mix`) jamais mergé — plusieurs briques CFA indexées pointent vers ce worktree. À
trancher avec Aziz (merger ou fermer) avant de promouvoir ces briques vers `_shared/`.
**Mécanisme 1 (Gardien)** : toujours pas codé, volontairement — catalogues mieux peuplés maintenant, à
réévaluer si c'est suffisant avant de l'activer. Rien d'urgent ici, juste observer 1-2 sessions.

---

## 📤 PUBLICATION — LA PRIORITÉ ACTIVE

> ⭐⭐ **La chaîne publie enfin.** Après 25 jours de blocage, la publication est démarrée. **Vider le
> calendrier éditorial est la priorité n°1** — le GAZODUC vient après.
>
> | Vidéo | État |
> |---|---|
> | 🇸🇳 Sénégal Pétrole & Gaz (longue) | ✅ **PUBLIÉ** le 2026-07-30 |
> | 🇸🇳 Sénégal (Short 9:16) | ✅ **PROGRAMMÉ** 2026-08-01 15h30 UTC (2 posts TryPost) |
> | ⚔️ War-Map Sahel AES (longue) | ⛔ **PUBLIÉE 2026-08-04, ÉCHEC (5 vues/24h, VPH 0.19) — REFONTE EN COURS, voir bloc ci-dessous** |
> | ⚔️ AES (Short 90s) | ✅ **PROGRAMMÉ** 2026-08-04 19h UTC (2 posts TryPost) — CTA renvoie vers la longue, à re-vérifier après refonte |
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

## ⚔️ REFONTE AES — retiming V6 fait, PAS ENCORE assemblé/render final

> Script V6 découpé+tagué+généré (audio complet validé Aziz), retiming complet des constantes F_* +
> bornes de segments fait et VALIDÉ par check-frame-continuity.py (0 trou/0 chevauchement). RIEN commité.
> ⛔ Piège trouvé cette session : `SahelActe1-Final` ≠ FINAL publié, utiliser `SahelActe1-Refonte`.
> Reste : render complet 5 segments + assemblage + validation Aziz + miniature/titre + republication.
> Détail complet + ordre des étapes : `memory/episodes/warmap-sahel/STATUS.md` (bandeau 2026-08-06 soir).

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
> ✅ **Socle de base MERGÉ DANS `master` le 2026-07-29** (fast-forward) — disponible pour tout le monde.
> ⚠️ **Le 2e cas d'usage du 2026-08-03 (héritage de pose, commit `14990278`) n'est PAS dans ce merge** —
> vérifié 2026-08-08 : ce commit vit uniquement sur la branche de travail courante à ce moment-là
> (`feat/gazoduc-acte1-hook-globe`), absent de `master` (figé au 2026-07-31). Ne pas supposer ce
> 2e cas disponible partout tant qu'il n'a pas été explicitement porté/mergé.
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

## ⭐⭐ GAZODUC (AAGP vs TSGP) — ACTE 1+2 TERMINÉS, ACTE 3 CODÉ v1→v2, EN ATTENTE REVUE AZIZ

**État (2026-08-07)** : Acte 1 (hook, globe D3, 84.68s) et Acte 2 (127.4s, 4 segments) validés en
finale — détail : `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md`. **Acte 3 (TSGP) : voir
section en tête de ce fichier** ("DEUX CHANTIERS SÉPARÉS OUVERTS LE 2026-08-07") pour l'état à jour
et le lien du rendu v2 — ne pas se fier à l'ancienne mention "à démarrer" ci-dessous, périmée.
Repère sujet : `memory/projects/GAZODUC-MEGAPROJETS-SUJET.md`.

> ✅ **Tests client-sim "Flowdesk" (2026-08-06), "NorthShield" (2026-08-08) et "MOCH-IT"
> (2026-08-09) — TOUS CLOS**, sujet secondaire, détail isolé de ce fichier →
> `memory/client-sim-tests/INDEX.md`. NorthShield : livrable final
> `out/_client-sim/noteshield/FINAL/northshield-v3-FINAL.mp4`, validé par Aziz. MOCH-IT : nouvelle
> méthode de test prouvée — reproduire/dépasser une vraie vidéo de référence externe (pub Fiverr)
> au lieu d'inventer un brief fictif, avec un **breakdown comparatif 2-vidéos** (référence + notre
> rendu envoyés ensemble à Gemini+Kimi, script réutilisable `scripts/tools/da-brief-compare-2videos.py`)
> pour corriger les écarts avec des mesures chiffrées plutôt qu'un jugement à l'œil. Livrable final
> uploadé sur Vercel Blob (pas de fichier local conservé). Ne change rien à la priorité Gazoduc
> Acte 3 ci-dessus (le sujet principal reste YouTube/Souverain).

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
