# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-08-13 (purge : 26,5 Ko → ce fichier. Sections closes/mergées/dupliquées supprimées, git garde tout)
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"
> ⛔ **Format : 3 lignes max par projet.** Un projet TERMINÉ se SUPPRIME de ce fichier, il ne
> s'accumule pas — c'est faute d'appliquer cette règle qu'il a atteint 116 Ko en juillet, puis 26,5 Ko en août.
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
> ⚠️ **Stashs connus à vérifier** (peuvent être périmés — confirmer avant de dropper, re-vérifiés
> présents le 2026-08-13) : au moins 1 sur la branche Soudan (`wip-soudan-itineraire-avant-rnd-port`,
> chantier « itinéraire multi-étapes » — `ItineraireMultiEtapes16x9.tsx` etc.) et 2 WIP CFA sur
> `feat/cfa-nuit1994-svg-mix`.

---

## 💼 GIG FIVERR ENTRÉE DE GAMME (2026-08-12/13)

Page validée par Aziz (`freelance-linkedin/GIG-PAGE-VALIDEE.md`), persona solo founder/startup.
Reste ouvert : prix réels, nom commercial, portfolio de démo. Détail :
`freelance-linkedin/BRIEF-GIG-ENTREE-DE-GAMME.md` § "Ce qui reste à trancher".

---

## ⭐ KORA & CARTES — 2 pistes de sujet en exploration (2026-08-12/13)

Piste A retenue : "pourquoi l'Afrique évolue / pays qui montent" (entrepreneuriat, démographie) —
relancer SUJET-PRIME 6 étapes dessus en priorité. Piste B (FMI/dette) : angle + squelette narratif
posés ("comment une dette remboursée peut ne jamais diminuer ?"), décision en suspens = script direct
OU fact-check du chiffre-choc d'abord. Diagnostic flop Short CFA CLOS (miniature illisible, fixé).
Détail complet des 3 : `projects/EXPLORATION-DIVERSIFICATION-CHAINES.md` § sessions 2026-08-12 et 2026-08-12/13.

**⭐⭐ Piste Poster Vector/Whiteboard Doodle pour Kora & Cartes — 2 styles VALIDÉS sur mythe Anansi, dialogue+animation OK (2026-08-13)**
Test complet mené sur le mythe Anansi/Nyame (Akan/Ghana, pacte des histoires du monde — angle
"ruse > force pour capturer la valeur", mythologie africaine pure retenue vs piste A/pays-qui-montent).
2 styles H3 VALIDÉS bout en bout par Aziz, chacun en V2 corrigée (dialogue FR propre + geste
animé + upscale 1080p sans passer par le 720p) : **Poster Vector** (flat vector, orbite dorée continue)
et **Whiteboard Doodle** (couleur sélective jaune/bleu choisie spontanément par le modèle, très
appréciée par Aziz — comparable à notre pratique SVG maison). Défaut résiduel (œil qui semblait
"morphé" en 480p) confirmé être un simple artefact de basse résolution, réglé par l'upscale — pas un
vrai défaut H3. Détail technique complet + prompts reproductibles + syntaxe dialogue validée :
`tools/minimax-h3-styles-tests.md`. Assets : `episodes/_rnd/kora-cartes-mythologie/tests-visuels/`.
(ces tests du 2026-08-13 utilisaient le format 6-sections, depuis remplacé par le format officiel
H3-Base — voir `tools/minimax-h3-styles-tests.md` § "FORMAT DE PROMPT OFFICIEL" avant de reproduire
cette méthode sur un nouveau sujet).
**Reste ouvert** : décision de format (insert dans vidéo Mapbox/D3 existante vs vidéo complète) — pas
encore tranché, sujet pas encore choisi non plus (piste A "pays qui montent" vs mythe reste à trancher).

**⭐⭐ SVG codé direct (Fable5 mode MAX, sans jury LLM) — VALIDÉ sur 2 cas distincts, méthode fiable (2026-08-13)**
Hypothèse d'Aziz confirmée deux fois : un agent Claude en mode MAX, codant DIRECTEMENT en SVG en
observant une image de référence Gemini (zéro appel API externe, zéro jury), produit un résultat au
niveau ou au-dessus de la référence — ET produit des groupes SVG adressables/animables (avantage net
sur une image figée). **Cas 1** (scène dette/FMI, objets fabriqués simples — piles de billets,
factures, flèches, pièces) : réussi, mais géographie réelle (continent Afrique) a échoué 2× à main
levée avant de pivoter vers de vraies données `d3-geo`/Natural Earth — **jamais dessiner un contour de
pays à l'œil, même dans une scène par ailleurs simple**, règle confirmée sur ce 2e cas aussi. **Cas 2**
(décor complet aéroport Niamey Gazoduc Acte 3 — architecture + atmosphère nocturne + lumières
multiples, PAS juste des objets simples) : jugé par Aziz supérieur au décor existant, **action directe
prise** — voir bloc GAZODUC ci-dessous. Composants sources : `src/projects/_rnd/svg-scenes/
DetteFmiMecanismeSVG.tsx` + `GazoducAeroportFable5Test.tsx`. Réserve d'Aziz : pas encore un pilier
du workflow, à retester sur plusieurs styles/registres dans une session dédiée avant de généraliser
davantage — mais déjà utilisable au cas par cas dès maintenant (2 preuves suffisantes pour un test
ponctuel, pas encore pour une automatisation).

**⭐⭐⭐ Storyboard cartographique multi-modèles (Gemini+GPT) — méthode NOUVELLE, documentée, 1er usage réel en cours (2026-08-13)**
Découverte majeure de session : un DA-brief textuel seul (3 voix, `da-brief.py`) ne suffit PAS à éviter
un rendu de carte plat — le storyboard VISUEL reste nécessaire même après un brief écrit soigné (constat
direct d'Aziz sur l'Acte 3 Gazoduc, "tracés plats qui ne représentent pas grand-chose" malgré 3 DA-briefs
déjà faits). Méthode découverte et validée : donner à Gemini/GPT une frame réelle de NOTRE carte +
nos capacités techniques listées explicitement + le texte du script + des références de chaînes connues
(Vox Atlas "montrer le terrain", discipline Kurzgesagt "peu d'éléments bien timés") → 3 concepts
DISTINCTS (1 image = 1 concept, jamais un montage multi-concepts en une image basse résolution) →
Aziz choisit/mix-and-match les meilleures idées → Claude écrit directement le breakdown de fusion
(pas de 3e aller-retour image). **Verdict comparatif GPT Image 2 vs Gemini** : GPT supérieur pour ce
type de storyboard annoté (français propre, annotations caméra réalisateur explicites et utiles —
ne PAS les brider, les encourager explicitement dans le prompt). Doctrine complète mise à jour :
`doctrines/STORYBOARD-MAPBOX.md` § "EXTENSION D3 + VERDICT GPT vs GEMINI" (2026-08-13) — **à proposer
systématiquement dès qu'une scène carte D3/Mapbox est jugée plate/statique**, référencé dans ROUTAGE.md.

---

## ⭐⭐ NOUVELLE CHAÎNE CANADA EN — test PIPELINE en cours (2026-08-14)

Marché EN validé (TubeLab, RPM jusqu'à 20$+). Script V3 FR validé jury 4 LLM. **3 styles H3 validés**
(Hand Drawn, Poster Vector narratif + Poster Vector SaaS/logo/scène-2-personnages) + **format de prompt
H3 officiel découvert et adopté par défaut** (l'ancien format 6-sections n'était pas le vrai format
documenté) — détail `tools/minimax-h3-styles-tests.md` § "FORMAT DE PROMPT OFFICIEL". Reste à tester :
Whiteboard Doodle. Décision à prendre : scène Mapbox réelle ou assembler la 1ère scène complète.
Détail : `episodes/_rnd/canada-red-bay/STATUS.md`.

---

## ⚠️ MiniMax H3 — défaut racine non résolu, contournement prouvé (2026-08-10/12)

Scène multi-personnages dense (3+, contact physique) : écran noir/personnage disparaît, **toujours NON
résolu** — seuil de délégation agent dédié atteint et non déclenché. Contournement PROUVÉ : 2
personnages max, zéro contact croisé (4 clips testés, succès complet). Guide de prompting officiel +
storyboard multi-panneaux également testés. Détail complet : `tools/minimax-h3-comfy-cloud.md`.

---

## ⛔⛔ GAZODUC — ACTE 3 GELÉ EN WIP (décision Aziz 2026-08-14). PROCHAINE ÉTAPE = ACTE 4, PAS L'ACTE 3.

**NE PAS reprendre l'Acte 3 à la prochaine session.** Aziz a explicitement décidé de l'arrêter en
l'état : il n'est pas validé, il reste beaucoup de travail, et on s'acharne dessus depuis trop de
sessions (même pattern que le **Soudan Acte 4** : doute + non-avancement sur un acte du milieu).
**On produit les Actes 4 et 5 d'abord, on revient compléter l'Acte 3 après.**

Raison structurelle (pas seulement de la fatigue) : un acte du milieu se juge par rapport à ses
voisins. L'Acte 3 est coincé entre un Acte 2 validé et des Actes 4/5 inexistants, donc sa fin se
juge dans le vide — le conflit de budget du Beat 4 (15.2s demandés vs 1.9s disponibles) en est la
preuve directe, et il se tranchera bien mieux une fois le climax de l'Acte 4 écrit.

État gelé complet (acquis + ce qui reste cassé, mesuré) : `episodes/souverain/gazoduc-aagp-tsgp/
STATUS.md` § "ACTE 3 — GELÉ EN WIP" (en tête de fichier). Rendu de référence :
`out/episodes/gazoduc-aagp-tsgp/versions/acte3-segmentA-suite-V12-WIP.mp4`.
Commit `9e302fb2` (`feat/gazoduc-acte1-hook-globe`).
⚠️ Le starter `memory/starters/STARTER-PROMPT-gazoduc-acte3-suite.md` est PÉRIMÉ (il fait reprendre
l'Acte 3) — ne pas l'utiliser tel quel à la reprise.

**Acquis à ne PAS refaire** : Beat 1 validé (caméra continue) · Beat 2 = vrai insert composé (clip H3,
jauge, badge, connecteur) — le principe de l'insert composé est le gain de ces sessions · Segment B
décor Fable5 porté.

**Actes 4 et 5 : rien n'existe** (vérifié — aucun fichier, aucune composition). Acte 4 = conséquences,
avec les **70% de production siphonnée en pic de rupture de forme** carte→insert physique. Acte 5 =
implication, avec **le robinet géant + mains stylisées** (`PLAN-ACTES2-5.md` L118). ⚠️ Avant de croire
l'audio manquant : `narration.mp3` (516s) couvre probablement les 5 parties.

**Leçon caméra (3 itérations perdues)** : un mouvement « par à-coups » n'est presque jamais un problème
de dosage. `easeInOut` appliqué PAR SEGMENT met la vitesse à exactement 0 à chaque point de passage.
**Mesurer la vitesse frame à frame avant de retoucher une valeur**, et chercher la brique existante
(le mécanisme continu était déjà dans l'Acte 2 validé + un prototype dédié).

(ARCHIVE — approche abandonnée, ne pas repartir dessus) Le rendu v2 et le plan de refonte v3 par 4 agents
vierges (`PLAN-ACTES2-5.md` § "TEST STUDIO RÉUTILISABLE") ont été DÉPASSÉS le 2026-08-14 : on repart
désormais du storyboard V5 + ses 4 breakdowns JSON, directement. Le v3 a été explicitement rejeté par
Aziz. Point de goût Segment B : tranché (décor Fable5 porté, fait).

Repère sujet : `projects/GAZODUC-MEGAPROJETS-SUJET.md`. Tests client-sim (Flowdesk/NorthShield/MOCH-IT)
TOUS CLOS, détail isolé `client-sim-tests/INDEX.md`.

---

## 🔧 BACKLOG — Studio réutilisable (Mécanisme 1 Gardien, pas urgent)

Mécanisme 2 (Extracteur) codé et validé (~30 briques indexées) — détail `doctrines/STUDIO-REUTILISABLE-GATE.md`.
Mécanisme 1 (Gardien) : pas codé, volontairement — à réévaluer si besoin, rien d'urgent.
⚠️ **Dette CTA Short CFA** : worktree `remotion-cfa` (`feat/cfa-short-9x16`) jamais mergé, `SceneCta.tsx:152`
dit encore "EN DESCRIPTION" alors que le rendu publié a été patché en aval par splice ffmpeg direct sur
le fichier final — le fix n'est PAS dans la source. À trancher : appliquer le fix dans la source (resync)
ou fermer le worktree si le repo principal fait foi. Un futur re-render depuis ce worktree réintroduirait le bug.

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

## ⚔️ REFONTE AES — retiming V6 fait, PAS ENCORE assemblé/render final

Script V6 découpé+tagué+généré (audio validé Aziz), retiming complet validé par
check-frame-continuity.py (0 trou/0 chevauchement). RIEN commité. Reste : render 5 segments +
assemblage + validation Aziz + miniature/titre + republication. Détail :
`episodes/warmap-sahel/STATUS.md` (bandeau 2026-08-06 soir).

---

## 1. Maroc Batteries Short — reste A5 Géographie + assemblage

⚠️ L'état « A5 = STUB » est FAUX (`Beat4Geographie.tsx` fait 417 lignes, Mapbox complet, vérifié
2026-07-30). Les 5 autres beats sont FINAUX. RENDRE ET REGARDER avant de conclure quoi que ce soit.
Starter (à revérifier) : `archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`.

---

## ⏳ ACTIONS OUVERTES

### Recharger le crédit OpenAI
Quota épuisé le 2026-07-25 (`429 insufficient_quota`). Bloque `whisper-align.py`/`transcribe-openai.py`.
Contournement en place : `scripts/tools/forced-align.py` (ElevenLabs).

### Activer les routines /schedule — NON FAIT, rappeler à Aziz
Re-signaler en début de session jusqu'à confirmation. 2 routines cloud Postiz (Aziz les crée lui-même) :
`/schedule jeudi 9h ... postiz-weekly-check.py` · `/schedule samedi 10h ... postiz-weekly-report.py`.
Ajouter `POSTIZ_API_KEY` en env. **Quand Aziz confirme → supprimer cette section.**

### Audit des skills du workspace — demandé le 2026-07-11, jamais fait
88 dossiers sous `~/.claude/skills/` (global), suspicion de redondance. Cadrage : génériques vs
spécifiques Remotion, traces d'usage réel, doublons fonctionnels, agents-vierges-en-parallèle.

---

## 💡 BACKLOG (rien d'actif — ne pas lancer sans décision d'Aziz)

- **Carrousel « Good News »** — pipeline prêt, jamais relancé : `python3 scripts/prepare-goodnews-weekly.py`.
- **Carousels Instagram** — Or Africain + Thiaroye prêts, Mansa Moussa à refaire. Reco : Sénégal Pétrole.
- **Système hook + CTA commentaire** — checklist hook 20s + template CTA 30-60s, jamais construits.
- **Xénophobie SA** — angle validé (« double face »), données 2026 intégrées. Gate : demande TubeLab.
  Dossier : `episodes/souverain/xenophobie-sa-EXPLORATION/`.
- **Pipeline Shorts automatisé trending** — pas maintenant, revenir quand le long format est en place.
- **Peste 1347 mid-form horizontal** — concept validé, backlog après AES + Maroc Batteries.
  Fiche : `projects/peste-1347-midform.md`. 2 chantiers actés (narration voix vivante, multi-agent
  post-fix) : `episodes/peste-1347/STATUS.md`.
- **`GeoFlowConnection`** (pipeline Mapbox) — lignes/arcs animés entre pays. À coder au 1er sujet à flux.
- **Patterns `_reference-atlas-poc/` non portés** : `AtlasParcheminGlobe.tsx` · `AnimatedCaravan.tsx` ·
  `atlas-parchemin-mande.json`.
- **Vox Papercraft** — pipeline officialisé (`doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md`). Reste :
  halo détourage, retirer noms d'États, photo halftone, séquence multi-plans.
- **R&D D3 16:9** — moteur agnostique ratio, prouvé sur Soudan. Backlog : sol enrichi, globe 2.0,
  data-viz cartographique, flux `d3-force`/`d3-chord`, HUD tactique. Détail : `_rnd/d3-16x9/README.md`.
- **Seedance personnage** — technique prouvée mais ÉCARTÉE (coût ~6.85$/clip). SVG reste la voie par défaut.

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
