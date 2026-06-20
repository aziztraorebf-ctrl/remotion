# SYSTÈME AGENTIQUE — carte d'orientation (le point d'entrée unique)

> ⭐ **Active ce système à n'importe quel moment** (début, milieu, ou quand ça devient complexe). Déclencheur :
> Aziz dit « consulte notre système agentique » / « active le système » — ou une instance le lit au démarrage
> (référencé dans MEMORY.md + ROUTAGE.md). Une fois lu, tu sais comment produire/refaire une scène avec tout
> ce qu'on a construit (2026-06-19→20).
>
> ⛔ **Ce fichier ORIENTE, il ne duplique pas.** Il dit OÙ aller pour chaque besoin. Le détail vit dans les
> doctrines pointées — toujours les ouvrir avant d'agir.

---

## TU REPRENDS UNE VIDÉO / TU REFAIS UNE SCÈNE ? → LE FLUX (le cas le plus fréquent)

Ex : refonte Sénégal V3 (voix V3), refonte AES, ou toute scène à refaire. Suis CES étapes, dans l'ordre :

1. **ÉTAT RÉEL d'abord** (ne pas croire les notes) : ouvre le `STATUS.md` de l'épisode + vérifie l'état RÉEL
   dans le livrable (extraire frames/audio de la vidéo, lire le code du beat). Les notes périment — le livrable
   est la vérité. (Règle CLAUDE.md « fichiers de navigation périment ».)
2. **INTENTION → FORME** : pour la scène, déduis l'intention (1 verbe : ce qu'elle doit faire RESSENTIR), puis
   la forme. JAMAIS partir du template. Porte d'entrée : `src/projects/_shared/INTENTION-FORME-INDEX.md`.
   Doctrine : `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` ⭐⭐.
   ✅ **Registre OPÉRATIONNEL (2026-06-20)** : enrichi des ~60 acquis tranchés de TOUS les piliers (2 règles
   maîtresses Data-Hero + carte/overlay, catégories incarnation Atlas & conceptuel War-Map, tags pilier).
   ⛔ **Lire la section REJETS** du registre : 15 formes déjà essayées ET abandonnées (drawFlagCanvas, flyTo,
   pitch 3D, semitransp…) — ne pas les re-tenter. Vérifie aussi que le composant cité existe RÉELLEMENT (les index périment).
3. **STORYBOARD (le modèle propose la direction)** : génère un storyboard multi-états (évolution + épure) via
   `scripts/tools/storyboard-dual-gen.py` (Gemini + GPT). Le modèle PROPOSE, tu ne dictes pas.
   - Data-viz/Remotion → choisir un **fond** dans la palette : `public/_shared/refs/backgrounds/_PALETTE-BACKGROUNDS.md`.
   - Carte/Mapbox → suivre `memory/doctrines/STORYBOARD-MAPBOX.md` : joindre NOTRE carte (`public/_shared/refs/cartes/`)
     + citer les chaînes de réf + passer l'ARSENAL (`public/_shared/refs/cartes/_ARSENAL.md`, « va plus loin »)
     + directive carte vivante. La géo du storyboard est approximative = OK (vraie géo au CODE).
4. **AZIZ VALIDE la direction** (point de contrôle goût). On ne code/breakdown PAS une direction non validée.
5. **BREAKDOWN** : on décode le storyboard validé en plan technique. ⛔ Il TRANSCRIT, il ne CRÉE pas (la
   direction est déjà tranchée au storyboard) → ne peut pas brider, il PROTÈGE. Data-viz/Remotion → composants +
   timing. ✅ **Carte/Mapbox → FORMAT DÉFINI + ÉPROUVÉ** (JSON par état : caméra frame-driven, `intention_etat`
   libre, `forme_connue`/`si_nouveau` anti-rabotage, `cout_estime`, `fallback_si_echec`, `forbid`) →
   `memory/doctrines/STORYBOARD-MAPBOX.md` § FORMAT.
6. **CODE** dans le bon emplacement (règle 3 zones, voir INTENTION-FORME-INDEX § « OÙ RANGER ») : livrable →
   `<pilier>/<episode>/`. Passe par la **session** (`/beat` → `beat-session.py` ou `mapbox-session.py`).
7. **REVIEW + PRÉSENTATION** : la session écrit `<mp4>.review.json` adjacent (Gemini, seuil 8/10). Le **hook**
   `pre-presentation-review.sh` BLOQUE la présentation tant que la review n'est pas faite. Donc : toujours
   `--phase review` avant de montrer.

---

## LES BRIQUES DU SYSTÈME (où est quoi)

| Besoin | Où aller |
|---|---|
| Produire/refaire une scène (porte unique) | `/beat` (`.claude/commands/beat.md`) → route Mapbox vs Remotion vs proto |
| Storyboard (le modèle propose) | `_PALETTE-BACKGROUNDS.md` (§ storyboard) · `STORYBOARD-MAPBOX.md` · outil `storyboard-dual-gen.py` |
| Palette de fonds + arsenal de capacités | `public/_shared/refs/backgrounds/` · `public/_shared/refs/cartes/_ARSENAL.md` |
| ORCHESTRATION (chef + agents frais) | `memory/PLAN-ORCHESTRATION-VIDEO.md` — découper, fan-out N beats, 2-3 checkpoints, isolation worktree |
| Intention → forme → template | `src/projects/_shared/INTENTION-FORME-INDEX.md` + `CONTINUITE-SCENE-INTENTION-DABORD.md` |
| Où ranger un fichier (3 zones) | INTENTION-FORME-INDEX § « OÙ RANGER » (livrable / `_rnd` proto / `_shared` brique) |
| Hooks actifs (garde-fous) | `.claude/hooks/` — auto-vérif présentation, model-guard, preflight carte, **rappel registre intention→forme avant toute scène `.tsx`** (`beat-preflight.sh`, non bloquant), lint |
| État anti-fouillis (pourquoi le système) | `memory/PLAN-SYSTEME-ANTI-FOUILLIS.md` |
| Scripts par cas d'usage | `scripts/SCRIPTS-INDEX.md` |

---

## LES 3 PRINCIPES QUI GOUVERNENT (rappel — détail dans CLAUDE.md § règles de travail)

1. **Le modèle PROPOSE, on valide, PUIS breakdown → code.** Goût jugé avant-code (gratuit), pas après-render (cher).
2. **Guider sans brider** : exigence + arsenal d'inspiration (« va plus loin ») + interdits, JAMAIS dicter la
   technique ni cocher une checklist.
3. **Déléguer à un agent frais** : un contexte vierge bat un contexte saturé pour produire/vérifier. Claude =
   chef d'orchestre, pas exécutant de chaque pixel.

---

## ⚠️ CE QUI N'EST PAS ENCORE BRANCHÉ (au 2026-06-20 — voir NEXT-ACTION pour le détail)
- ✅ **RÉSOLU 2026-06-20** : l'étape 2 (INTENTION→FORME) est désormais OPÉRATIONNELLE — registre rempli des
  ~60 acquis + section REJETS + rappel par hook (avant, le flux pointait vers un registre à moitié vide).
  Validé par agents vierges (2/3 trouvent la forme du 1er coup sans connaître l'historique).
- Le storyboard est prouvé en isolé mais pas encore une étape OBLIGATOIRE des sessions (à câbler).
- ✅ **RÉSOLU 2026-06-20** : le format du breakdown Mapbox (pont storyboard→code carte) est DÉFINI et ÉPROUVÉ
  (agent réel, piège créatif → idée préservée). → `STORYBOARD-MAPBOX.md` § FORMAT.
- L'orchestration complète bout-en-bout reste à éprouver sur une vraie mini-vidéo propre (le révélateur des
  lacunes restantes de l'étape 3 storyboard).
→ En attendant : on peut suivre le flux ci-dessus À LA MAIN (générer le storyboard, valider, coder via session).
