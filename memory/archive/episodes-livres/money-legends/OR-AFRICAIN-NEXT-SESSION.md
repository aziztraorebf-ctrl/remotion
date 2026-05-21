# Or Africain — Reprise prochaine session

> Session du 2026-05-07. 5 beats validés sur 6 (84% du Short fini).
> CTA remplacé 2026-05-08 — générique like/commente/abonne-toi + newsletter en description. Audio cta-v2.mp3 (6.56s). FINAL validé Aziz.

## État actuel — Beats validés

| Beat | Durée | URL Catbox | Composition Remotion |
|---|---|---|---|
| Beat 1 — Hook | 9.7s | https://files.catbox.moe/fc7x6w.mp4 | `OrAfricainBeat1` |
| Beat 2 — Contexte | 17.6s | https://files.catbox.moe/0x7l4g.mp4 | `OrAfricainBeat2` |
| Beat 3a — Le Fait | 14.7s | https://files.catbox.moe/mx6818.mp4 | `OrAfricainBeat3a` |
| Beat 3b — La Pression | 14.0s | https://files.catbox.moe/8xy1o9.mp4 | `OrAfricainBeat3b` |
| Beat 4 — Le Twist | 29.5s | https://files.catbox.moe/q23qqb.mp4 | `OrAfricainBeat4` |

**Total : ~85s sur 101s.**

## Ce qu'il reste — Beat 5 + CTA

### DECISION VALIDEE 2026-05-07 — Re-record audio Beat 5

Aziz a relevé que la phrase "Le Ghana a signé la loi" en début de Beat 5 fait trop redondance avec :
- Beat 1 hook "Le Ghana a signé quand même"
- Beat 3a/3b "Le Ghana a signé quand même" (2e occurrence)

Soit 3 mentions de la même idée en 100s = trop.

**Decision** : re-générer l'audio Beat 5 sans cette phrase. Beat 5 commence directement par "L'Afrique commence à changer les règles de son propre sous-sol."

Avantage : Beat 5 + CTA ne sont pas encore codés, donc zéro contrainte de timing existante. Re-record propre.

### Plan d'execution prochaine session

1. **Re-record audio Beat 5 via ElevenLabs**
   - Voix canonique : Narratrice GeoAfrique v2 `z3gESu49naEZW8Af2Upm`
   - Texte (avec scan TTS obligatoire AVANT appel API) :
     > "L'Afrique commence à changer les règles de son propre sous-sol. Discrètement. Sans que personne n'en parle."
   - Sortie : `public/souverain/or-africain/audio/narration-beat5-v2.mp3`
   - Cout : ~$0.05

2. **Whisper alignment** sur le nouveau fichier → `narration-beat5-v2-alignment.json`

3. **Coder Beat 5** (`Beat5Verdict.tsx`) :
   - Fond parchemin v4 (coherence Beats 1-2)
   - 3 lignes typographiques en serif elegant (Garamond/Georgia) qui apparaissent en sync narration
   - Closure badge "$5,589" en haut a droite, opacity 0.5 (boucle avec Beat 1)
   - Flash crimson bref sur "Discretement" avant silence
   - Musique fade-out

4. **Coder le CTA** (`OrAfricainCTA.tsx`) :
   - Audio existant `narration-or-africain-cta-v1.mp3` (3.92s)
   - Fond noir + grain overlay
   - 2 lignes : "Si tu veux des histoires que les médias ne racontent pas / — abonne-toi."
   - Pas de karaoké
   - Micro-scintillement or sur les 15 dernieres frames

5. **Assembler `OrAfricainFull`** (master 6 compositions)

6. **Mix musique** sur l'ensemble :
   - `music-v1.mp3` existe deja (163s) mais pas integre dans les beats
   - Beat 1 : fade-in a f90 (deja code)
   - Beats 2, 3a, 3b, 4 : musique manquante a ajouter
   - Beat 5 : fade-out sur "Discretement"
   - CTA : silence + scintillement audio leger

7. **Render final + test mobile + publication**

### Estimation temps

Total : ~2h de session focused.
