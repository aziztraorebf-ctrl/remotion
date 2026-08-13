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

---

## ⭐⭐ NOUVELLE CHAÎNE CANADA EN — test PIPELINE en cours (2026-08-13)

Marché EN validé (TubeLab, RPM jusqu'à 20$+). Script V3 FR validé jury 4 LLM ("baleine volée de Red
Bay"), 2 tests visuels réussis (SVG Fable5 MAX, clip MiniMax H3). Décision à prendre : scène Mapbox
réelle ou assembler la 1ère scène complète. Détail : `episodes/_rnd/canada-red-bay/STATUS.md`.

---

## ⚠️ MiniMax H3 — défaut racine non résolu, contournement prouvé (2026-08-10/12)

Scène multi-personnages dense (3+, contact physique) : écran noir/personnage disparaît, **toujours NON
résolu** — seuil de délégation agent dédié atteint et non déclenché. Contournement PROUVÉ : 2
personnages max, zéro contact croisé (4 clips testés, succès complet). Guide de prompting officiel +
storyboard multi-panneaux également testés. Détail complet : `tools/minimax.md`.

---

## ⭐⭐ GAZODUC — Acte 1+2 TERMINÉS, Acte 3 codé v1→v2, EN ATTENTE REVUE AZIZ

Rendu v2 corrigé après DA-brief critique :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/acte3-v2-Sw435S8sYbHTbgMbmvDkRfPMdkyhFT.mp4
— Aziz doit le revoir. Plan de refonte v3 (4 agents vierges) + point de goût Segment B non tranché :
`episodes/souverain/gazoduc-aagp-tsgp/PLAN-ACTES2-5.md` § "TEST STUDIO RÉUTILISABLE" (lire avant de
recoder, ne pas rescanner les catalogues, déjà fait). Tests client-sim (Flowdesk/NorthShield/MOCH-IT)
TOUS CLOS, détail isolé `client-sim-tests/INDEX.md`. Repère sujet : `projects/GAZODUC-MEGAPROJETS-SUJET.md`.

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
