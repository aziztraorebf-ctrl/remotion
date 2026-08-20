# Template Starter Prompt — Isolation Atomique Beat
> Réutilisable pour tout projet Souverain
> Toute instance Claude peut améliorer ce template — incrémenter la version + noter le changement
> Version : 1.1 — 2026-05-14

---

## USAGE

Copier ce template, remplacer les `[VARIABLES]`, coller dans une nouvelle session Claude.
Une session = un beat = un dossier isolé.

---

## TEMPLATE

```
SESSION ISOLATION ATOMIQUE — [PROJET] Beat [X]

━━━ LECTURE OBLIGATOIRE (dans cet ordre) ━━━
1. memory/episodes/souverain/[PROJET]/PROTOCOLE-SESSIONS-AUTONOMES.md
2. src/projects/souverain/[PROJET]/beat[X]/manifest.ts
3. memory/tools/gemini.md (modèles — ligne 11)
4. memory/rules/rules-souverain-editorial.md Section 0B (règle background)

Scope unique : beat[X]/ uniquement. Zéro autre fichier modifié.

━━━ PHASE 1 — STORYBOARD GEMINI ━━━
(À faire AVANT tout code. Montrer à Aziz. Valider avant de continuer.)

Script audio Beat [X] ([DURÉE]s) :
"[TEXTE EXACT DE LA NARRATION]"

Références à joindre comme images :
- Frames Or Africain + Niger Uranium (refs i2i dans memory/tools/gemini.md)
- public/souverain/[PROJET]/bg-beat1.png  ← niveau discrétion background cible
- [autres backgrounds validés du projet]
- beat[X]/bg.png si déjà présent

Appel 1 — IMAGE_MODEL (import depuis scripts/tools/gemini_models.py ; defaut Lite, 1K max)
Prompt système à inclure :
  "Avant de générer les images, remplis ce tableau de validation R1.
   Règle R1 : aucun segment ne peut dépasser 8 secondes sans changement
   visuel (nouveau composant, nouveau texte, nouvelle couleur).
   Le permanent motion seul (pulse, glow) ne compte PAS comme changement.
   Si un segment dépasse 8s, subdivise-le AVANT de continuer.

   | Segment | Début | Fin | Durée | R1 OK ? |
   |---------|-------|-----|-------|---------|
   | [X].1   |  0s   |  ?s |  ?s   |   ?     |
   | [X].2   |  ?s   |  ?s |  ?s   |   ?     |
   ...

   Seulement quand tous les segments sont R1 OK → générer les images."

Output attendu : tableau R1 rempli + images storyboard (une par segment)

Appel 2 — gemini-3.1-pro-preview
Input : images Appel 1 + script audio
Output JSON attendu :
{
  "beat": "beat[X]",
  "duration_s": [DURÉE],
  "r1_segments": [
    { "id": "[X].1", "start_s": 0, "end_s": 7, "duration_s": 7, "r1_ok": true, "change": "description du changement visuel" }
  ],
  "assets_to_generate": [
    { "type": "background", "prompt": "prompt exact IMAGE_MODEL" },
    { "type": "icon", "prompt": "..." }
  ],
  "components_suggested": ["ComponentA", "ComponentB"],
  "tailwind_tokens": ["text-gold", "text-ivory", "bg-navy-deep"]
}

Phase 1 autonome — à la fin :
1. Sauvegarder beat[X]/storyboard.md (transcription JSON)
2. Publier storyboard (images embarquees base64 obligatoire) :
   ./scripts/publish-storyboard.sh /tmp/beat[X]_storyboard beat[X]
   Capturer l'URL retournee (ex: https://xxx.here.now/)
   VERIFICATION : grep "data:image" dans le HTML avant publication — si absent, STOP
3. Envoyer notif avec URL : ./scripts/ntfy-notify.sh storyboard_ready beat[X] <URL_HERE_NOW>
4. S'arrêter — attendre que Aziz lance /goal

━━━ PHASE 2 — ASSETS ━━━
Depuis le JSON Phase 1 :
- Générer background avec IMAGE_MODEL (Lite ; background = matiere de travail, jamais publiee telle quelle) + prompt exact du JSON
- Générer autres assets si listés
- Sauvegarder dans beat[X]/

━━━ PHASE 3 — CODE ━━━
Avant d'écrire une ligne :
  Lister les segments R1 du storyboard avec leurs frames :
  | Segment | Frames    | Durée | Changement visuel          |
  |---------|-----------|-------|----------------------------|
  | [X].1   | 0→210     | 7s    | [description]              |
  | [X].2   | 210→420   | 7s    | [nouveau composant/texte]  |
  Confirmer que chaque ligne a un changement explicite dans le code.

Règles code :
- Timings : SEG.* depuis beat[X]/manifest.ts UNIQUEMENT
- Audio : <Audio src={staticFile(AUDIO)} /> sans offset
- Couleurs/typo : Tailwind tokens UNIQUEMENT (text-gold, text-ivory, bg-navy-deep)
- Jamais #000000 — minimum #0d1420 pour les fonds sombres
- touch /tmp/shared-components-read après lecture _shared/

Render : out/episodes/[PROJET]/wip/beat[X]_v1.mp4

━━━ PHASE 4 — REVIEW ITÉRATIVE ━━━
Appel gemini-3.1-pro-preview à chaque itération.
Input : 5 frames 432p du render + storyboard beat[X]/storyboard.md

JSON de review attendu (champs obligatoires) :
{
  "score": 0.0,
  "verdict": "APPROVE | NEEDS_WORK",
  "r1_violations": [
    { "segment": "[X].2", "static_duration_s": 10.5, "fix": "subdiviser en [X].2a et [X].2b" }
  ],
  "delta": [
    { "segment": "[X].1", "issue": "...", "fix": "..." }
  ],
  "strengths": ["..."]
}

Règle : si r1_violations non vide → score automatiquement < 8.5 → itérer.
Condition de sortie : score ≥ 8.5 ET r1_violations vide.
Condition de sortie : score >= 8.5 ET r1_violations vide
→ ./scripts/ntfy-notify.sh beat_done beat[X]
→ STOP

Borne : max 3 iterations → score < 8.5
→ ./scripts/ntfy-notify.sh blocked beat[X] "Score <8.5 apres 3 iterations"
→ STOP

━━━ CONTRAINTES GLOBALES ━━━
- R1 : max 8s sans changement visible (validé Phase 1, vérifié Phase 3, mesuré Phase 4)
- Palette : #0d1420 fond, #FFB800 or, #f5efe0 ivoire
- Background : texture photographique discrète — test : "disparaît-il quand le texte arrive ?"
- Modèles : IMAGE_MODEL (images — ⛔ jamais l'identifiant en dur, importer depuis `scripts/tools/gemini_models.py` ; IMAGE_MODEL_HQ seulement si l'image est publiee telle quelle) / gemini-3.1-pro-preview (review)
- Score cible : ≥ 8.5/10 ET r1_violations vide
- Zéro entropie : 3 bugs bloquants = STOP + notifier Aziz
```

---

## VARIABLES À REMPLACER

| Variable | Exemple |
|----------|---------|
| `[PROJET]` | silicon-savannah |
| `[X]` | 2 |
| `[DURÉE]` | 14.66 |
| `[TEXTE EXACT DE LA NARRATION]` | "Tout commence en deux mille sept..." |

---

## CHANGELOG

| Version | Date | Changement | Par |
|---------|------|------------|-----|
| 1.0 | 2026-05-14 | Création — R1 validé en 3 phases (storyboard + code + review) | Aziz + Claude |
| 1.1 | 2026-05-14 | Phase 1 autonome + ntfy notifications (storyboard_ready, beat_done, blocked) | Aziz + Claude |
| 1.2 | 2026-05-14 | Fix images base64 obligatoire (here.now ne recoit que le HTML) + ntfy avec lien Click | Aziz + Claude |
