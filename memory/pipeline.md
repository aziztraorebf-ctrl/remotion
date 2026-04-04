# Pipeline Shorts GeoAfrique — Ordre INVIOLABLE
> Ne JAMAIS changer cet ordre. Zero clip avant timing.ts stable.
> Mise a jour : 2026-04-02

---

## Ordre de production (NON-NEGOTIABLE)

```
1. Script definitif valide par Aziz
2. Generation audio ElevenLabs V3
3. Whisper -> mesure timings reels par segment
4. timing.ts stable et valide
4b. KIMI DA REVIEW — direction artistique sur TOUS les clips
    Brief structure : contraintes generateur + nuance morale + frame chaining + script complet
    Output : prompts finaux avec ponts visuels entre clips
    Max 3 iterations. Cout : ~$0.01-0.02/passe.
    Ref : `.claude/skills/batch-short-production/references/kimi-direction-example.md`
5. Generation clips Kling/Seedance (duree = timing reel du beat)
   Frame chaining : extraire derniere frame clip N comme ref clip N+1
6. Integration Remotion + mini-render
```

Si le script change apres l'etape 1 -> recommencer depuis l'etape 2.
Si Kimi propose de restructurer les clips -> valider avec Aziz AVANT de regenerer.

---

## Quel outil pour quel plan ?

| Plan | Outil | Modele/Config |
|------|-------|---------------|
| Gros plan visage / emotion | Gemini -> Seedance ou Kling V3 Pro | cfg 0.4 |
| Plan epique / armee / territoire | Recraft vivid_shapes -> Kling O3 | cfg 0.35 |
| Transition cinematique (dolly in) | Gemini start+end -> Kling O3 | cfg 0.4 |
| Carte / timeline / data | SVG Remotion spring() pur | -- |
| Close-up expressions/gestes | Seedance (SECONDS format) | 80-120 cr |
| Flotte/foule massive | Seedance | 80 cr |
| Dialogue lip sync | Seedance (Audio-Guided) | 80-120 cr |
| POV / transition perspective | Seedance | 80 cr |
| Plan 4K / >15s | Kling | API fal.ai |

**Strategie hybride** : Seedance = close-ups, dialogues, POV, foules, <15s. Kling = plans larges 4K, start+end frame, API.

### Architecture Format 6 pour Shorts (VALIDE 2026-04-04)

Pour les Shorts 60-90s, privilegier le Format 6 (2-3 scenes par clip de 15s avec transitions slow-mo internes) au lieu de 1 beat = 1 clip. Avantages : moins de generations, zero couture, transitions cinematographiques naturelles, moins de credits. Audio ElevenLabs + musique Suno en overlay Remotion.

---

## Regles generales

- **NO TEXT dans frames source** : ZERO texte/chiffre dans toute image envoyee a Kling ou Seedance
- **Audio-first** : generer audio -> mesurer ffprobe -> coder
- **Mini-render apres chaque beat** : `npx remotion render --frames=START-END`
- **Contrat Visuel AVANT code** (toute scene >10s)
- **Seedance audio = TOUJOURS remplacer** : strip audio ffmpeg + overlay ElevenLabs dans Remotion

---

## Skill complet

`.claude/skills/batch-short-production/` — 9 phases, scripts, checkpoints.
