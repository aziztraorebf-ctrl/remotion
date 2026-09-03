# NEXT-ACTION — Recommandations actives

## ⛔⛔ À TRAITER — incident git : travail perdu puis récupéré par chance (2026-08-31)

Le ménage de branches du 28/08 a supprimé `feat/cfa-nuit1994-svg-mix` alors qu'elle portait
2 fichiers jamais commités (récupérés via `git fsck --unreachable`, chance pure — un `git gc`
les aurait perdus pour de bon). Diagnostic + 3 pistes de correctif à trancher avec Aziz :
`memory/projects/INCIDENT-BRANCHE-SUPPRIMEE-TRAVAIL-PERDU.md`. Ne pas refaire de ménage de
branches sans avoir lu ce fichier.

## ⛔⛔⭐⭐⭐ PRIORITÉ — CÂBLER NOTRE SYSTÈME SUR LE TRAVAIL CLIENT (constat d'Aziz, 2026-09-03)

> **Session dédiée à ouvrir.** Chantier d'analyse en profondeur, à NE PAS entamer au fil d'une
> session de production. Branche suggérée : `fix/cablage-systeme-travail-client`.

**Le constat, dans les mots d'Aziz** : « notre repo ne sert à rien si on ne l'utilise pas quand
vient le temps de régler des problèmes, autre que pour la vidéo YouTube. Surtout si c'est pour des
clients Upwork, il devrait servir aussi à partir de maintenant. »

**Ce qui l'a déclenché** : sur le contrat chill-meter (2 jours, 4 tentatives échouées sur un écart
de teinte), Aziz a proposé de consulter des modèles externes. Ça a débloqué le problème en un
appel. ⛔ **Or c'est exactement ce que fait le DA-brief, qui existe, est outillé, a un skill dédié
— et n'a JAMAIS été invoqué sur ce contrat.** Je l'ai réimplémenté à la main (planche comparative
+ brief + 3 appels) sans reconnaître que je refaisais un outil qu'on possède.

**Ce n'est pas un oubli isolé — c'est un schéma, 4 occurrences sur le même contrat** :
- DA-brief (existe, outillé, skill dédié) → jamais invoqué
- `FICHE-BRIEF-CLIENT.md` portait « exiger l'ÉTAT NEUTRE quand la réf client montre l'état FINAL »
  → ne s'injectait pas sur `src/projects/_rnd/chill-meter/`, corrigé APRÈS avoir payé l'erreur
- Règle « matière finale d'abord, code ajusté ensuite » → j'ai failli rendre un clip d'animation
  sur un châssis qu'on savait devoir changer (rattrapé par Aziz, pas par le système)
- Protocole « déléguer à un agent dédié dès le 2e échec » → j'en étais au 4e

**La cause commune** : le système est câblé pour la PRODUCTION VIDÉO. Les gates visent
`src/projects/souverain/`, les fiches ciblent des chemins de beats, les skills parlent storyboard
et scènes. Le travail client vit ailleurs (`src/projects/_rnd/`, `memory/client-sim-tests/`,
`src/projects/_client-sim/`) et **traverse le système sans rien déclencher**.
⭐ Le repo n'est pas inutile : il est **ADRESSÉ AU MAUVAIS ENDROIT**. C'est la 3e occurrence
connue du défaut d'adressage (FICHE-MOCKUP-3D 26/08, FICHE-BRIEF-CLIENT 02/09).

**Le chantier, 4 étapes** :
1. Recenser ce qui DEVRAIT se déclencher sur du travail client (DA-brief, fiche client, gates de
   vérification, protocole de délégation, règles de message client, conventions de nommage).
2. **TESTER lesquels s'activent réellement** sur un chemin client — par exécution du hook avec un
   `file_path` ET un `content` (⚠️ `fiche-inject.sh` sort en 0 sans contenu : un test sans
   `new_string` donne un faux négatif, vécu le 02/09), **jamais par relecture**.
3. Corriger les déclencheurs qui ratent.
4. Écrire une entrée de routage « TRAVAIL CLIENT » dans `ROUTAGE.md` : quoi ouvrir au début d'un
   contrat, comme il en existe une pour les épisodes.

⚠️ **Nuance à garder** : le DA-brief n'aurait probablement pas évité CE problème précis (il
intervient avant de coder, ici on réagissait à un retour client). Mais la MÉTHODE qu'il porte —
plusieurs voix externes plutôt que moi seul — est exactement ce qui a débloqué. Ce n'est pas
l'outil qui manquait, c'est le RÉFLEXE de l'invoquer hors production vidéo.

📄 Méthode née de l'incident, déjà documentée :
`memory/tools/consultation-llm-externe-probleme-visuel-bloque.md`

## ⭐⭐⭐ REPRENDRE ICI — Pièce portfolio « Le cauri » (2026-09-02)

Brief + recherche TERMINÉS, aucun pixel produit. Étape suivante : faire dessiner le jeu de
formes avec la contrainte de morphing (une matière en 7 états, pas 7 dessins).
→ **`memory/starters/STARTER-piece-cauri.md`** — tout y est.

⛔ Les 3 repros TED-Ed = **R&D interne, jamais montrées**
(`out/_r-and-d/fable-vs-opus-ted-ed-style/STATUT.md`). On garde les RIGS, pas les fichiers.

## Spark Icon (Upwork) — envoyée 2026-09-01, attente passive

Rien à faire tant que le client n'a pas répondu. → `memory/client-sim-tests/upwork-spark-icon/STATUS.md`.

---

## ⭐⭐⭐ DÉCISION DU 2026-08-24 — LA CHAÎNE EST UNE VITRINE, LE FREELANCE PORTE L'EFFORT

Décision d'Aziz : la chaîne (Gazoduc) prouve les capacités, elle ne monétise pas. ⭐ 1er contrat
Upwork GAGNÉ le 29/08 (350 $, cf section chill-meter plus bas) — ne valide PAS le « déterminisme »,
qui reste hypothèse. Doctrine + fer de lance (pilier 2, objets animés par code) :
`memory/doctrines/PILIERS-B2B.md`.

**Acquis technique** : pipeline **SVG → Lottie** prouvé (2 outils officiels LottieFiles), matte
`tt` porté (commits `a42af19b`/`b4a53d3e`, 5/5 pochoirs, écart 0,03 %) → détail complet
`memory/client-sim-tests/lottie-ui-lcd/STATUS.md` · `corpus-kamotion/CORPUS-REFERENCE-UI.md`.
⛔ Chantier repro UI **CLOS le 2026-08-30** (corpus épuisé, 3 pièces livrées).

⭐⭐⭐ **PRIORITÉ 1 (décision d'Aziz, 30/08) — PORTFOLIO ANIMÉ** : corpus épuisé, on crée
désormais **nos** pièces sur ce que le marché valide (pas de copie). Plan 6 étapes (MCP Fiverr →
rétro-ingénierie → SVG → code → `da-brief-anim.py` → itération) :
→ **`memory/starters/STARTER-portfolio-anime.md`** ⭐⭐

⏸️ Personnage HUMAIN en pause (`STARTER-PERSO-VECTORIEL-V4.md`) — si besoin d'un perso : registre
CHIEN (mascotte) ou modèle pro existant animé (prouvé sur le douanier).
⛔ Ne PAS refondre le gabarit d'ouverture vidéo : 4 courbes de rétention INFIRMENT un défaut
systématique → `memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md` § LES 5 FORMES DE COURBE.

---

## ⛔ DETTE MESURÉE LE 2026-08-30 — `kimi-k2.5` PÉRIMÉ dans 16 fichiers de code + 2 index

CLAUDE.md impose **`kimi-k3` UNIQUEMENT** (décision d'Aziz 20/08) + import depuis
`scripts/tools/api_models.py`. 16 fichiers de code actif portent encore `kimi-k2.5` en dur, plus
`REVIEW-TOOLS-INDEX.md`/`SCRIPTS-INDEX.md` qui le citent (la doctrine se propage à l'envers).
⛔ Un modèle périmé peut répondre en se dégradant silencieusement (pas d'erreur garantie).

⭐ **Le patron existe déjà** : `scripts/tools/da-brief-anim.py` (30/08) importe ses 4 identifiants
d'`api_models.py`, zéro en dur, et applique le vrai fix `reasoning_content` de k3 — recopier, ne pas
réinventer. ⚠️ Réserve avant de migrer les 2 scripts VIDÉO NATIVE (`da-brief-video-3voix.py:40`,
`da-brief-compare-2videos.py:31`) : vérifier que k3 accepte la vidéo native via Moonshot direct avant
de basculer.

**Chantier mécanique, ~30 min, à faire en DÉBUT de session** (16 fichiers à relire un par un, pas
un remplacement de masse — cf. migration Gemini du 20/08).

---

## 🌿 ÉTAT GIT — **4 branches vivantes** (corrigé 2026-08-31, la note du 30/08 était périmée dès l'ouverture d'une nouvelle branche le 31)

⛔ **Dérive détectée par le wrap du 31/08** : cette section affirmait "1 SEULE branche vivante"
alors que 3 branches non mergées existent réellement. Toujours vérifier `git branch --list` avant
de faire confiance à cette section — elle se périme au premier `git checkout -b`.

État réel (`git branch --merged master` ne retourne QUE `master`, les 3 suivantes portent du
contenu unique) :

- **`feat/chill-meter-jalon1`** — branche COURANTE (session 31/08). Porte le contrat chill-meter
  (métal, README, jalons) + le travail du 31/08 (récupération CFA, MCP Upwork, hook
  outbound-message-guard). Contient aussi tous les commits de `feat/portfolio-onboarding-generique`
  (ancêtre commun) — la fusionner absorbe l'autre.
- **`feat/portfolio-onboarding-generique`** — 5 commits, tous déjà présents dans
  `feat/chill-meter-jalon1`. Candidate à suppression une fois cette dernière mergée dans master.
- ⚠️ **`feat/zambia-demo-2concepts`** — 1 commit unique (`7b024e66`, 21/08) : `gallery/index.html`,
  `gallery/styles.css`, poster PageCam. ⛔ NE PAS supprimer sans décider : ces fichiers n'existent
  PAS sur master, et la galerie déployée sur GitHub Pages a peut-être son code de référence ailleurs
  — vérifier où avant de merger OU supprimer.

⛔⛔ **Avant tout futur ménage de branches** : lire
`memory/projects/INCIDENT-BRANCHE-SUPPRIMEE-TRAVAIL-PERDU.md` — une branche supprimée le 28/08
portait 2 fichiers jamais commités, récupérés par chance seulement. Toujours vérifier
`git status`/modifications non commitées sur une branche AVANT de la supprimer, pas seulement ses
commits.

## ⭐⭐⭐ CONTRAT UPWORK chill-meter — RÉVISION 1 du jalon 1 TRAITÉE le 2026-09-02, RIEN RENVOYÉ

**Premier contrat freelance, actif.** Offre v2 acceptée le 30/08 (350 $ → 297,50 $ net, 3 jalons,
3/7/11 sept.) — les 3 points de révision (dossier source + README, dates, 2 tours de révision par
jalon) sont tous dans le contrat signé.

⏭️ **PROCHAINE ACTION : tester la piste 3D, PUIS renvoyer le jalon 1.** Abigail a répondu : elle
valide la structure et demande 6 révisions (toutes traitées le 02/09 — labels boutons, flocons du
titre, bouton power recentré de 11 px, SCALE 0.52→0.374, passe Fable sur le métal). Décision d'Aziz :
ne pas renvoyer tout de suite, explorer d'abord la piste 3D pour un envoi UNIQUE (il ne reste qu'1
révision sur ce jalon). Le vrai écart restant est le **givre** (« neige posée » chez nous vs
« frimas adhérent » chez elle), pas le métal — mesuré par comparaison à état égal.
→ Détail complet + bug ouvert `ChillMeter-Metal-*` : `memory/client-sim-tests/upwork-chill-meter/STATUS.md`.
⏸️ Prospection Upwork en PAUSE par Aziz (01/09), 1-2j — déjà 4 fronts ouverts. Ne pas relancer sans
confirmation d'Aziz.
⚠️ Retraits Upwork bloqués tant que les infos fiscales ne sont pas fournies — à régler avant le 3 sept.

✅ **Chantier métal du châssis bouclé le 31/08** (4 passes, chacune corrigeant un défaut qu'Aziz a
repéré) : gradients morts → concours 5 modèles (métal gagné, icy blue perdu) → couleur corrigée mais
silhouette dérivée → géométrie EXACTE reverifiée (32/32 tracés identiques). Finition **Machined**
retenue (contraste mesuré 153 vs 122), intégrée en production, 2 bugs corrigés après signalement.
⭐ 2 leçons de brief transposables : `feedback_deleguer-un-defaut-nommer-ce-qui-ne-doit-pas-changer.md`
· `feedback_ameliorer-vs-remplacer-preciser-dans-le-brief.md`

⛔ Ne PAS lui dire que les 6 états sont déjà rendus (atout de négociation). ⛔ Brief client PDF
(`BRIEF-CLIENT-ORIGINAL.pdf`, gitignoré) se RELIT avant toute action.

→ **Source de vérité unique** : `memory/client-sim-tests/upwork-chill-meter/STATUS.md`.

---

## 🔧 SESSION D'AUDIT DU WORKSPACE — à planifier (constitué le 2026-08-27, rien d'urgent)

**1. ⭐⭐⭐ Outiller le protocole des 2 échecs** (point le plus rentable). Règle déjà écrite
(`CLAUDE.md` global § Protocole agent de diagnostic dédié), 3 preuves de valeur (18/07, 02/08, 29/08
— cette dernière montre que 2 vérifications peuvent partager le même angle mort et sembler
indépendantes à tort). ⛔ Mais rien ne compte les tentatives — pattern
`regle-ecrite-insuffisante-sans-gate-outille`. Base : `.claude/hooks/circuit-breaker.sh` compte déjà
les éditions répétées d'un fichier ; reste à définir « tentative sur le même problème » et le seuil
de délégation. Détail : `feedback_transparence-lue-comme-bug.md` § extension 2026-08-29.
**2.** Audit des ~90 skills (demandé 11/07, non urgent). **3.** Vérifier que les gates ne meurent
pas en silence (le circuit-breaker était mort le 12/07 sans que personne le remarque).

---

## 🔧 BACKLOG TECHNIQUE — dette Gemini/outillage (2026-08-20, NON URGENT)

Migration image faite (défaut LITE, -50 %). Reste : (1) ⚠️ `visual-producer.md:407` cite l'ancien
identifiant image, agent qui dépense réellement, à traiter en premier (~28 mentions passives ailleurs,
au fil de l'eau). (2) ⛔⛔ `VISION_MODEL` non importé par aucun script, en dur dans 42 fichiers
(79 occurrences) : changer la constante ne change rien aujourd'hui. (3) `gemini-3.7-flash` à tester
à l'aveugle avant bascule (−62%/−69% coût) → `memory/tools/gemini.md`. (4) Migrer ~75 fichiers vers
`api_models.py`, étalé ; `da-brief.py` reste sur k2.5, vrai fix dans `kimi-k3-reasoning-borne.md`.
(5) `mkprevis-camera-seule.py` non commité. ⛔⛔ Ne jamais re-graver un chiffre de lignes de fiche
ici : mesurer à la demande (`wc -l`).


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
> ⚠️ **Stashs connus à vérifier** (peuvent être périmés — confirmer avant de dropper) : ≥1 sur la
> branche Soudan (`wip-soudan-itineraire-avant-rnd-port`) et 2 WIP CFA sur `feat/cfa-nuit1994-svg-mix`.
>
> ⛔⛔ **UNE AUTRE SESSION PEUT CHANGER LA BRANCHE ET LANCER UN MERGE PENDANT QUE TU TRAVAILLES**
> (vécu 2026-08-20). Symptôme : `git checkout <fichier>` échoue en `path is unmerged`, ou un typecheck
> révèle des imports dupliqués absents de `HEAD` — cause : `.git/MERGE_HEAD` d'une autre session.
> **Vérifier avant de conclure sur un fichier partagé** (`src/Root.tsx` en tête) :
> ```bash
> git branch --show-current && ls -d .git/MERGE_HEAD 2>/dev/null && echo "MERGE EN COURS"
> ```
> ⛔ Ne JAMAIS résoudre/abandonner le merge d'une autre session (`reset`, `stash`, `merge --abort`,
> `checkout` d'un fichier unmerged) : c'est son travail vivant. Signaler à Aziz, continuer ailleurs.
> ⚠️ Corollaire : cette même session peut aussi commiter TON travail à ta place (vécu : `e6657203`).
> Relire `git log` avant de supposer qu'un commit est de toi.

---

## 🔧 BACKLOG dormant — 5 chantiers en pause, aucun n'a bougé depuis 2+ semaines

- **2e test démo client carto** (EN ATTENTE) : validé sur 1 seul brief (Zambie) — pari, pas une
  brique. Starter complet (6 rappels payés) : `memory/starters/STARTER-PROMPT-2e-test-demo-carto.md`.
- **Chantier FMI** : rien commencé (script seulement) → `memory/projects/CHANTIER-FMI.md` (163 l.).
- **H3 audio `reference_audio_urls`** (exploratoire, à prendre quand l'Acte 3 est soldé) : styles
  FAITS (20/08), reste l'audio régénéré par H3 (corrélation 0,46). Piste jamais testée :
  `reference_audio_urls` (H3, pluriel — ne pas confondre avec `reference_audio_url` minimax-music,
  singulier, inexistant en v2.6). Prérequis : archiver `.prompt.txt`+`.meta.json` (SEED) par clip →
  `memory/tools/edition-video-ciblee-omni-seedance.md`.
- **Showcase des capacités** : reste LE DÉROULÉ (ordre/durée/musique) → cut vente 60-90s, zéro
  composant neuf à coder. Charte DA déjà FAITE (`doctrines/CHARTE-DA-FREELANCE.md`).
  → `memory/projects/SHOWCASE-CAPACITES.md`
- **Gig Fiverr entrée de gamme** : page validée, reste prix réels/nom commercial/portfolio démo →
  `freelance-linkedin/BRIEF-GIG-ENTREE-DE-GAMME.md` § "Ce qui reste à trancher".
- **Kora & Cartes** (dormant depuis 16j) : 2 décisions ouvertes — quel sujet (Afrique qui monte vs
  mythologie) et quel format (insert vs vidéo complète) → `memory/projects/EXPLORATION-DIVERSIFICATION-CHAINES.md`.
- **Chaîne Canada EN** : pipeline conclu (marché validé TubeLab, script V3 jury 4 LLM, 3 styles H3
  validés), 1 décision en attente (Mapbox réel vs 1ère scène) → `episodes/_rnd/canada-red-bay/STATUS.md`.
- **MiniMax H3 — défaut racine non résolu** : scène multi-persos dense (3+, contact physique) =
  écran noir, toujours NON résolu. Contournement prouvé : 2 persos max, zéro contact croisé →
  `tools/minimax-h3-comfy-cloud.md`.

---

## ⭐⭐⭐ GAZODUC — ACTE 3 : 1 segment FINAL (C) · A débloqué à VALIDER · B à porter (gel levé le 28/08)

**Actes 1, 2, 4, 5 : FINAUX.** L'Acte 3 est le dernier en chantier, et il a été DÉBLOQUÉ le 18/08
après des semaines de gel.

| Segment | État |
|---|---|
| A / Beats 1-2 (0→55 s) | ⭐ **débloqué, à faire valider** — `versions/acte3-segmentA-beats12-V3.mp4` |
| A / Beat 3 (55→72,3 s) | ⏭️ **PROCHAINE ACTION** — spec V5 complète, codée à moitié |
| B (73,9→105,8 s) | ⏭️ porter l'animation sur le décor Fable 5 |
| C (105,8→123,1 s) | ✅ **FINAL** — `acte3-segmentC-verrou-FINAL.mp4` |

**⏭️ PAR QUOI REPRENDRE — le Beat 3 (panneau financement).** Le plus prêt : spec au pixel près dans
`breakdown-v5-json/beat3-breakdown.json`, aucune décision de goût à prendre, image-cible déjà montrée
à Aziz. Manquent : banque barrée DANS le panneau, trio ALGÉRIE→vanne←NIGERIA, cylindres comparatifs.
Détail : STATUS.md § ACTE 3.

⛔ NE PAS ressortir la TRANCHÉE (retirée le 18/08, hors script). ⛔ NE PAS prolonger la rupture
plein écran au-delà de 155 frames (ne boucle pas). ⛔ NE PAS remettre l'encart Adrar après la
rupture (redite, décision d'Aziz).

**Reste ensuite** : assemblage Acte 4 (3 fichiers, 300ms de marges à rogner, `concat=n=N:v=1:a=0`) ·
CTA de fin (jamais commencé, pas d'interpellation directe) · passe palette sombre `PAL_GPT` pour
Actes 1/2/3 (pas acte par acte).

⭐ Méthode storyboard refondue cette session (audit tiers obligatoire, 3 modèles dessinateurs 1 appel
chacun, liseré au lieu d'écrire) → `memory/fiches/FICHE-STORYBOARD.md`.

---

## 🔧 BACKLOG — Studio réutilisable (Mécanisme 1 Gardien, pas urgent)

Mécanisme 2 (Extracteur) codé et validé (~30 briques indexées) — `doctrines/STUDIO-REUTILISABLE-GATE.md`.
Mécanisme 1 (Gardien) : pas codé, volontairement, rien d'urgent.
⚠️ **Dette CTA Short CFA** : worktree `remotion-cfa` jamais mergé, `SceneCta.tsx:152` dit encore
"EN DESCRIPTION" alors que le rendu publié a été patché en aval par splice ffmpeg — le fix n'est PAS
dans la source. À trancher : resync la source ou fermer le worktree (sinon un re-render y réintroduit le bug).

---

## 📤 PUBLICATION

> ⭐⭐ La chaîne publie. Calendrier détaillé + IDs de posts + interdits :
> `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
> (source de vérité unique — ce fichier-ci ne recopie plus l'état, qui périme trop vite).
>
> ⏭️ **Prochaine action** : construire le Short Soudan (boucle NotebookLM, scripts déjà présents dans
> `scripts/tools/soudan-short-audio/`) — dernier Short manquant du calendrier. Puis GAZODUC.
> Outils : `scripts/tools/jury-titres-llm.py` · `scripts/tools/jury-thumbnail-llm.py` · ROUTAGE.md § « Publier ».

---

## ⛔ NE PAS PROPOSER — AES abandonné volontairement (décision Aziz 2026-08-17). PAS une dette.

Ne plus le proposer ni le compter dans le reste-à-faire. La refonte V6 ne sera PAS assemblée ni
republiée : l'échec à 5 vues/24h est un problème de TITRE/MINIATURE/SUJET, pas de production —
republier ne rachète pas la distribution. Reste utile : script V6 comme gold-standard de script
dense (pointeur dans `ROUTAGE.md`). Détail : `episodes/warmap-sahel/STATUS.md`.

---

## ⏳ ACTIONS OUVERTES

- **Recharger le crédit OpenAI** : quota épuisé 25/07 (`429`), bloque `whisper-align.py`/
  `transcribe-openai.py` (contournement en place : `forced-align.py` ElevenLabs). OpenRouter renvoie
  aussi `402` depuis le 25/08 — a empêché de tester GPT-5.5 dans le comparatif 3D, trou de mesure à
  combler après recharge.
- **Activer les routines /schedule** — NON FAIT, re-signaler en début de session jusqu'à confirmation
  d'Aziz. 2 routines cloud Postiz (`postiz-weekly-check.py` jeudi 9h, `postiz-weekly-report.py`
  samedi 10h), ajouter `POSTIZ_API_KEY`. Supprimer cette ligne une fois confirmé.
- **Audit des skills du workspace** — demandé 11/07, jamais fait. 88 dossiers `~/.claude/skills/`,
  suspicion de redondance (génériques vs spécifiques Remotion, doublons fonctionnels).

---

## 💡 BACKLOG (rien d'actif — ne pas lancer sans décision d'Aziz)

- **Carrousel « Good News »** — pipeline prêt, jamais relancé : `scripts/prepare-goodnews-weekly.py`.
- **Carousels Instagram** — Or Africain + Thiaroye prêts, Mansa Moussa à refaire. Reco : Sénégal Pétrole.
- **Système hook + CTA commentaire** — checklist hook 20s + template CTA 30-60s, jamais construits.
- **Xénophobie SA** — angle validé (« double face »), données 2026 intégrées, gate demande TubeLab →
  `episodes/souverain/xenophobie-sa-EXPLORATION/`.
- **Pipeline Shorts automatisé trending** — pas maintenant, revenir quand le long format est en place.
- **Peste 1347 mid-form horizontal** — concept validé → `projects/peste-1347-midform.md`,
  `episodes/peste-1347/STATUS.md`.
- **`GeoFlowConnection`** — composant EXISTE et est publié (Soudan Actes 3/4/5). ⚠️ 2 fichiers du
  même nom, contrats opposés : `warmap/_shared/` (publié) vs `_shared/mapbox/` (dormant) →
  `INTENTION-FORME-INDEX.md`.
- **Patterns `_reference-atlas-poc/` non portés** : `AtlasParcheminGlobe.tsx` · `AnimatedCaravan.tsx`.
- **Vox Papercraft** — pipeline officialisé. Reste : halo détourage, noms d'États, photo halftone,
  séquence multi-plans → `doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md`.
- **R&D D3 16:9** — moteur agnostique ratio, prouvé sur Soudan → `_rnd/d3-16x9/README.md`.
- **Seedance personnage** — technique prouvée mais ÉCARTÉE (coût ~6.85$/clip). SVG reste le défaut.

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

**Format : 3 lignes max par projet** (Etat / Decision en attente / Recommandation).

⛔ **Un projet TERMINÉ se SUPPRIME de ce fichier** — son état vit dans `memory/episodes/<ep>/STATUS.md`
et sa publication dans le calendrier. Ne jamais garder de « trace historique » ici : git la conserve.
Ce fichier a déjà dépassé 116 Ko (juillet) puis 26,5 Ko (août) faute d'appliquer cette règle en continu.

## 🔧 BACKLOG — 3 fiches saturées, à SCINDER (relevé au wrap 2026-08-27)

Budget d'une fiche = **55 lignes** (contexte injecté à chaque édition). 3 fiches le dépassent au
point qu'un simple retrait ne sert à rien — scission à faire en DÉBUT de session (pas en clôture,
risque de rendre une fiche muette sans l'éprouver ensuite) :

| Fiche | Lignes | Scission proposée |
|---|---|---|
| `FICHE-CLIP-GENERE.md` | 272 (5×) | sortir § previs/générateurs vers une fiche PREVIS. |
| `FICHE-UI-PRODUIT.md` | 196 (3,6×) | sortir § MONTAGE+CURSEUR+SON vers `FICHE-ASSEMBLAGE`. |
| `FICHE-ASSEMBLAGE.md` | 132 (2,4×) | fusionner 2 sections qui redisent le plafond Artifact 16 Mo. |
