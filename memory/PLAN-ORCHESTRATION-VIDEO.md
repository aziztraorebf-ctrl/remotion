# PLAN — Orchestration vidéo (Claude chef d'orchestre, agents frais exécutants)

> Né de la session 2026-06-19 (anti-fouillis → orchestration). Idée d'Aziz : au lieu que Claude principal
> code chaque scène à la main en fin de session longue (contexte saturé → erreurs), Claude devient
> **CHEF D'ORCHESTRE** : il découpe, lance des **agents frais** (effort élevé, contexte vierge) pour
> produire/vérifier les scènes, vérifie leurs sorties, reste en supervision. Prouvé : 2 agents frais
> (sur sonnet ≈ mode médium) ont produit des scènes premium en suivant le système, ~12 min chacun.
>
> Pré-requis FAITS cette session : les 11 ambiguïtés qui faisaient dériver un agent frais sont fermées
> (A1-A11, voir commits `ae9abbe` / `711536d` / `0e9bc11`). Le terrain est délégable.

---

## POURQUOI (le vrai gain)

Quand Claude principal code en fin de session, son contexte porte mille micro-décisions → bruit. Un agent
**frais**, lancé pour UNE scène, à **effort élevé dès la 1ʳᵉ seconde**, sans dette de contexte, est souvent
MEILLEUR à cet instant précis. Claude principal garde ce qu'il fait le mieux : tenir la **cible finale**,
découper, arbitrer le goût, synthétiser. Il n'exécute plus chaque pixel.

## LE CONTRAT DE PARALLÉLISME = `timing.ts`

Règle d'or : **tant que `timing.ts` n'est pas figé, on ne fan-out pas.** Une fois figé (frames ABSOLUES),
chaque beat est une cellule indépendante → zéro collision inter-beats (pas de cumul, fichiers `/tmp`
namespacés `{ep}-beat{N}`, mp4 wip séparés). C'est ce qui rend le fan-out sûr.

## LES 3 BARRIÈRES (série incompressible)
```
Script LOCKED (Aziz) → AUDIO (1 agent) → timing.ts (1 agent) → [FAN-OUT BEATS] → ASSEMBLAGE (chef)
```
- **Audio** avant timing (le storyboarder exige l'audio mesuré : ffprobe/Whisper).
- **timing.ts** avant tout code (tout beat importe ses frames absolues).
- **Assemblage** après TOUS les beats FINAL.

## CE QUI SE DÉLÈGUE vs CE QUE SEUL LE CHEF FAIT

**Chef d'orchestre (Opus principal, contexte vidéo) — non délégable :**
1. Lock script + validation éditoriale (sujet/angle/titre).
2. Validation des prompts AVANT asset payant (Aziz a brûlé 100$+ sur prompts non validés).
3. Décisions de goût **regroupées** en UN point de contrôle (jamais éclatées sur N agents).
4. Découpage en beats + figeage de `timing.ts` (combien d'agents, quels beats).
5. Arbitrage entre 2 variantes d'un beat (choix esthétique).
6. Synthèse des scores Gemini (SIGNAL jamais juge) — décide quoi appliquer, l'agent ne boucle pas.
7. Circuit breaker (3+ issues structurelles → STOP → Aziz).
8. Assemblage final + promotion FINAL + publication.

**Agent frais (effort élevé, contexte vierge) — délégable :** toute la **fabrication d'un beat**
(scan → breakdown → assets approuvés → code → render → self-review scriptée → review → corrections vraies),
+ self-review mécanique, + upload/ntfy. Optionnellement audio et timing (agents dédiés, mais séquentiels).

Règle de partage (CLAUDE.md) : **trancher le technique, regrouper le goût.** Objectif (frame, import, token
Tailwind, score scripté) → agent. Goût/coûteux-à-défaire (asset payant, refaire un beat, narratif) → chef → Aziz.

---

## SCHÉMA D'ORCHESTRATION D'UNE VIDÉO COMPLÈTE (multi-beats)

```
┌─ PHASE 0 — CHEF (série) ───────────────────────────────────────────────────┐
│ 0.1  Aziz lock script + sujet/angle/titre                                  │
│ 0.2  Spawn audio-director → narration.mp3 + alignment.json   [BARRIÈRE 1]  │
│ 0.3  Spawn storyboarder  → timing.ts (frames absolues)       [BARRIÈRE 2]  │
│ 0.4  Chef découpe beat0..beatN. Décide isolation worktree par beat.        │
└────────────────────────────────────────────────────────────────────────────┘
                                   │  FAN-OUT TEMPS 1 — CONCEPTION (1 message, N agents //)
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌─ TEMPS 1 : N AGENTS-BEAT — CONCEPTION (parallèle, puis STOP) ──────────────┐
│   1. /beat → route Mapbox/Remotion. scan → intention (1 verbe) → FORME.    │
│   2. MINI DA-BRIEF premium du beat : références visuelles + intention de   │
│      MOTION (le geste, pas l'objet) + niveau d'ambition. (force le premium)│
│   3. 1-2 versions de STORYBOARD VISUEL (Gemini/GPT, storyboard-dual-gen).  │
│   4. [prompt assets payants éventuels] → REMONTE AU CHEF, ne génère pas.   │
│   5. STOP. Remonte DA-brief + storyboards au chef.                        │
└────────────────────────────────────────────────────────────────────────────┘
        └──────────────────────────┼──────────────────────────┘
                                   ▼
╔═ CHECKPOINT 1 (GOÛT) — CHEF → AZIZ, GROUPÉ ════════════════════════════════╗
║ Chef rassemble les N DA-briefs + storyboards + prompts assets → présente   ║
║ EN UN LOT à Aziz (jamais N interruptions). Aziz VOIT LE VISUEL avant tout  ║
║ code. Valide / ajuste (« Beat1 : veines minérales, pas un damier ») /      ║
║ rejette. Débloque les agents en lot. ← C'EST L'ÉTAPE QUI FORCE LE PREMIUM. ║
╚════════════════════════════════════════════════════════════════════════════╝
                                   ▼  TEMPS 2 — EXÉCUTION (agents reprennent //)
┌─ TEMPS 2 : N AGENTS-BEAT — CODE sur storyboard VALIDÉ ─────────────────────┐
│   6. breakdown (Gemini 1) → code le beat sur le storyboard validé → render │
│   7. self-review scriptée (≥19/23 ou ≥10/12, BLOQUANT)                     │
│   8. review (Gemini 2, max 2 appels) → boucle corrections jusqu'à ≥8/10    │
│      → <mp4>.review.json adjacent → [BEAT-N] COMPLETE dans PIPELINE.md     │
└────────────────────────────────────────────────────────────────────────────┘
                                   ▼
╔═ CHECKPOINT 2 (GOÛT) — CHEF → AZIZ ════════════════════════════════════════╗
║ Chef synthétise les reviews, arbitre corrections/variantes, présente les   ║
║ beats finaux. Circuit breaker si un beat RE-EVALUATE.                       ║
╚════════════════════════════════════════════════════════════════════════════╝
                                   ▼
┌─ BARRIÈRE 3 — ASSEMBLAGE (chef) ───────────────────────────────────────────┐
│ concat ffmpeg beat0..N (audio déjà embarqué par beat) → mix → PRET-PUBLI.  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Les 3 points de contrôle goût** (révisés après le test RDC cobalt 2026-06-19) :
0. **Script** (éditorial) — avant la chaîne série.
1. **Storyboard + DA-brief premium GROUPÉS, AVANT le code** ⭐ (le 3e ajouté). Déplace le jugement de goût
   d'APRÈS le render (trop tard, coûteux) vers AVANT le code (gratuit à changer). C'est ce qui force le
   premium et empêche le « basique par défaut » (cause du damier de Beat1 au test).
2. **Après reviews** — synthèse scores + arbitrage.
Entre les checkpoints → **exécution longue sans interruption**.

> ⚠️ LEÇON DU TEST RDC COBALT (2026-06-19) : sans le checkpoint storyboard, un agent laissé seul sur un vide
> visuel produit du JUSTE mais BASIQUE (Beat1 = damier de mallettes cobalt). Les beats à forme évidente
> (Beat2 chiffre, Beat3 flux) sont sortis premium SANS storyboard — mais on ne peut pas parier là-dessus.
> Le storyboard validé en amont est ce qui garantit le premium partout, pas seulement là où la forme est évidente.
> ✅ Ce que le test a VALIDÉ : vocal bien synchronisé, changements de palette (Beat3 carte→noir révèle le tracé
> Chine), agents capables d'intégrer nos templates + improviser juste sur une intention claire.

---

## RÈGLES D'IMPLÉMENTATION (non négociables pour que ça marche)

- **Handoff = fichier sur disque**, jamais TodoWrite (non fiable cross-agent). Chaque agent-beat écrit sa
  complétion dans `.claude/agent-memory/shared/PIPELINE.md` (`[BEAT-N] ... COMPLETE : <mp4> + score`) ET
  dépose le `<mp4>.review.json` à côté du mp4 (lu par le hook de présentation).
- **Isolation `worktree`** par agent-beat dès qu'ils écrivent du code/assets en parallèle (sinon working
  tree partagé → corruption). Le tool Agent supporte `isolation: "worktree"`. Merge = `git add` chirurgical par beat.
- **Un seul agent touche `src/Root.tsx` à la fois** (liste d'imports linéaire = collision). Cf. procédure sûre
  dans `src/projects/_rnd/_README.md`.
- **Gemini = 1 seul appel/beat, signal jamais juge** — à inscrire dans le prompt de chaque agent-beat.
- **Le fan-out se fait en UN message** (N agents dans le même tour) pour qu'ils tournent vraiment en parallèle.
  Puis le chef attend les complétions (notifications) avant les points de contrôle.

## OUTIL : Agent vs Workflow
- **Agent (par défaut)** : le chef lance N agents-beat en un message, les suit, synthétise. Suffit pour
  2-6 beats. C'est le mode normal.
- **Workflow (opt-in explicite Aziz, coûteux)** : harnais déterministe fan-out→vérifie→synthétise pour les
  gros cas (audit, migration, review multi-dimensions). À n'utiliser que si Aziz le demande (« ultracode » /
  « lance un workflow »). Pour la vidéo courante, l'Agent suffit.

## AUTONOMIE (validée Aziz 2026-06-19)
« Autonomie large jusqu'au livrable » : le chef orchestre tout jusqu'à un livrable présentable, n'interrompt
Aziz qu'aux 2 points de contrôle goût (prompts payants / arbitrage reviews) ou si bloqué.

---

## DETTE RESTANTE (non bloquante)
- **A11** : `GeoClimaxOverlay` exige `frame` en prop (pas de `useCurrentFrame` interne) + `fontSize=200`
  déborde sur mots longs. Piège mineur. Fix futur : `useCurrentFrame` interne par défaut + auto-fit fontSize.
- **A8 (fond)** : Root.tsx monolithe reste fragile. Option future : `Root.proto.tsx` séparé pour isoler les
  protos jetables hors du monolithe (réduit le risque de collision/casse en multi-agents).
- Migration `_proto-16-9/` → `_rnd/` au fil de l'eau (Chantier C, pas big-bang).

## TEST DE VALIDATION
Le vrai test : lancer une mini-vidéo 2-3 beats en mode orchestration réel (chef + N agents-beat) et mesurer
si les 2 points de contrôle suffisent, si aucun agent ne dérive (les fixes A1-A11 tiennent), si le hook de
présentation joue son rôle. À faire en session dédiée.
