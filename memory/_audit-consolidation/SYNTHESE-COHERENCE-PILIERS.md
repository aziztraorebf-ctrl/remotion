# Synthèse audit COHÉRENCE A→Z par pilier — 2026-06-25

> 6 agents Sonnet 4.6 (lecture seule) : Souverain, Atlas, War-Map, SVG + Scripts transverse + Feedbacks transverse.
> Angle = chaîne doctrine→feedback→script fonctionnelle de ZÉRO à RENDU pour un agent vierge.
> Document décisionnel — CHECKPOINT 3.

## ✅ CONSTAT RASSURANT
- **0 modèle API périmé dans les scripts ACTIFS** (Gemini tous 3.1, Claude 4.x, GLM/Kimi/voix conformes). Les périmés sont confinés à `scripts/_archive/`. Le hook `gemini-model-guard.sh` fonctionne.
- Aucun lien mort script→fichier dans SCRIPTS-INDEX.
- Les doctrines de fond sont saines ; les contradictions restantes sont des **résidus non rétropropagés**.

## 🔴 LE PATTERN DOMINANT : la doctrine évolue, les feedbacks/scripts-index ne suivent pas
La cause racine de TOUS les problèmes de cohérence : **quand une doctrine est révisée, les feedbacks et index plus anciens gardent l'ancienne version** et la contredisent activement. C'est le "système 2-vitesses".

### Contradictions feedback↔doctrine (CRITIQUE — un agent vierge lit le feedback et fait FAUX)
| Feedback périmé | Dit | Doctrine actuelle dit |
|---|---|---|
| `feedback_flagfill-templates-decouverte` | `useClipFlags`/`fill-pattern` = NON-NEGOTIABLE | CARTO-OVERLAYS-PRINCIPES V5 : BANNIS au pitch → `MapboxCountryFlagDecal` |
| `feedback_recherche-templates-obligatoire` + `feedback_workflow-beat-template` | scan catalogue AVANT de coder | CONTINUITE-INTENTION-DABORD : INTENTION→FORME→PUIS scan |
| `feedback_pipeline-mapbox-maturite-autonomie` | GeoFlowConnection = BACKLOG à coder | déjà CODÉ (même session) |
| `feedback_workflow-beat-template` | SFX UI 0.40-0.45 | DOCTRINE-SOUVERAIN : plancher 0.50 pour TOUS |
| ⚠️ **CLAUDE.md ligne 91** | drapeaux = useClipFlags | V5 dit MapboxCountryFlagDecal au pitch (CLAUDE.md lui-même en retard) |

### Incohérences doctrine↔doctrine résiduelles
- **WARMAP-LONG-DOCTRINE en-tête** dit encore "overlays semi-transparents" (mot banni par GRAMMAIRE §9, malgré le renvoi). + **WARMAP-PLAYBOOK R2** "overlay explicatif semi-transparent" sans dépréciation (R4 a son exception, R2 non).
- **DOCTRINE-SOUVERAIN §5.3** dit fond `#16213a` "par défaut" ; `_PALETTE-BACKGROUNDS` dit PARCHEMIN par défaut data-viz depuis 2026-06-20.
- **SOUVERAIN-REMOTION-PLAYBOOK §2bis** dit Gemini pour breakdown ; WORKFLOW-DATAVIZ dit GPT-5.5.
- **rules-atlas-production §7** dit encore `flipX:true` (bug moonwalk) malgré le bandeau ajouté ailleurs.

## 🔴 SCRIPTS — index en retard + 2 trous
- **8 scripts SVG génératifs ABSENTS de SCRIPTS-INDEX** (svg-scene-narrative, svg-faisabilite-brief, llm-gen-svg, kimi-svg-ideation, etc.) — invisibles pour un agent vierge. + `dataviz-selfreview.py` ("LE VRAI GATE") absent aussi.
- **`openai/gpt-5.5` utilisé dans 8 scripts mais ABSENT du tableau CLAUDE.md** (modèles verrouillés). Validé en prod, mais un agent vierge ne sait pas qu'il est légitime (risque de confusion avec le phantom `gpt-5.5-image`). → à AJOUTER à CLAUDE.md.
- **`svg-scene-libre.py` déprécié mais sans bandeau** dans le fichier (piège agent vierge).
- `transcribe-openai.py` : chemin Soundjata en dur cassé. `warmap/config.py` : `MODEL_FACTCHECK_GROK` variable morte.
- Phases manquantes dans SCRIPTS-INDEX : `mapbox-session.py` (breakdown), `beat-session.py` (4 phases sur 8).

## 🔴 TROUS DE PARCOURS (agent vierge bloqué)
- **PLAN-ASSEMBLAGE-FINAL War-Map** : confirmé manquant (prochaine étape opérationnelle, décrite nulle part).
- **Playbook ASSEMBLAGE multi-beats SVG** : manquant. + `B7MosaiqueFinal.tsx` dit "FINAL" dans ETAT-GGW mais absent du git tree.
- **3 nouveaux fichiers moteur War-Map** (SahelTimings/Cameras/Actors) ABSENTS de WARMAP-INDEX (refactor invisible).
- **ROUTAGE SVG** envoie à SCENES-GENERATIVES (étape 1) en sautant FAISABILITE-AMONT (étape 0).
- **`PLAN-ORCHESTRATION-VIDEO.md`** cité 3× (ROUTAGE/SYSTEME-AGENTIQUE/STORYBOARD-MAPBOX) mais SUPPRIMÉ en vague 1 → liens morts internes.
- **atlas-template-v1.md** : 8 chemins `quebec-jacques-poc/` morts. **atlas-session.py** ne marche que pour peste-1347 (Hannibal plante). **STATUS Hannibal** manquant. **PIXELLAB-INDEX** périmé (persos Peste + Order of Battle absents).

## 🟡 PROPRETÉ
- `_rnd/svg-scenes/` : 49 fichiers dont ~17 variantes écartées mélangées aux 12 réfs (sous-dossier `_archive/` préconisé, non fait).
- Doublons feedbacks : 4 Mapbox + 3 PixelLab (fusion ou cross-ref).
- `apis-and-tools.md` périmé (cite Nano Banana / gemini-3-pro-image).

## Découpage réparation (lots disjoints)
- LOT A2 War-Map (doctrines overlay résidus + WARMAP-INDEX + PLAN-ASSEMBLAGE) · LOT B2 SVG (ROUTAGE ordre + bandeau svg-scene-libre + _archive svg-scenes + playbook assemblage) · LOT C2 Atlas (rules §7 flip + atlas-template + STATUS Hannibal + PIXELLAB-INDEX) · LOT D2 Souverain (§5.3 fond + §2bis breakdown) · LOT E2 Feedbacks (5 MAJ contradictions) · LOT F2 Scripts/CLAUDE.md (SCRIPTS-INDEX SVG + gpt-5.5 dans CLAUDE.md + nettoyage transcribe/grok).
- ⚠️ CLAUDE.md + PLAN-ORCHESTRATION-VIDEO = SENSIBLES → moi.
