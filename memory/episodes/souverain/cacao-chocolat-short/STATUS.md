# Cacao → Chocolat SHORT — STATUS (fiche de reprise)

> Projet ouvert 2026-06-28. Pilier = Souverain. Format = SHORT SVG vertical 9:16 (~1min35), registre encre/parchemin GGW.
> Sujet-parapluie = "L'Afrique n'est pas pauvre, elle est sous-payee pour ce qu'elle produit" (cacao->chocolat = porte
> d'entree figurative + teaser format long). ⛔ NE PAS re-chercher/re-fact-checker/re-jurer : tout est fait et verrouille.

## ⭐ OU ON EN EST (2026-06-28)
- ✅ Sujet VALIDE (TubeLab 6 appels + transcripts/commentaires Machi+Bhargav, ~24k likes convergents).
- ✅ SCRIPT FINAL = **SCRIPT-V4.md** (NE PAS repartir des V1/V2/V3). Hook paradoxe brut + CTA pont vers long.
- ✅ Fact-check triple FAIT (Tavily + Deep Research) -> FACT-CHECK-RESULTAT.md. Chiffres verrouilles.
- ✅ Jury LLM FAIT (GPT-5.5 / Gemini 3.1 Pro / Kimi K2.5 = 8,5/10 unanime) -> cacao-jury-RESULT.md (scratchpad).
- ✅ NARRATION ElevenLabs GENEREE + CORRIGEE + VALIDEE AZIZ (timbre GeoAfrique V2, pipeline voix vivante).
- ⬜ NEXT = DA-brief animation -> storyboard SVG-d'abord -> code Remotion -> render.

## 🔊 AUDIO FINAL — SOURCE DE VERITE (ne pas chercher ailleurs)
**Dossier** : `out/episodes/cacao-chocolat-short/audio/`
5 beats SEPARES (chacun regenerable independamment) + version complete. CES fichiers = les BONNES versions validees.

| Beat | Fichier (local) | Duree | Catbox |
|---|---|---|---|
| 1 — Hook paradoxe | `cacao-beat1-FINAL.mp3` | 12,17s | files.catbox.moe/k22oab.mp3 |
| 2 — Vraie source | `cacao-beat2-FINAL.mp3` | 9,52s | files.catbox.moe/l1c7a0.mp3 |
| 3 — Extraction/chiffre | `cacao-beat3-FINAL.mp3` | 19,13s | files.catbox.moe/u6vr06.mp3 |
| 4 — Renversement+nuance | `cacao-beat4-FINAL.mp3` | 28,33s | files.catbox.moe/pezn6p.mp3 |
| 5 — Pont+CTA | `cacao-beat5-FINAL.mp3` | 25,63s | files.catbox.moe/z6lagv.mp3 |
| COMPLET (concat propre) | `cacao-narration-COMPLETE.mp3` | 94,78s | litter.catbox.moe/gyhgcc.mp3 (72h) |

- ⛔ Les anciennes versions (avant corrections "pese"/"payee"/CTA) sont PERIMEES : seules les `-FINAL.mp3` comptent.
- Corrections appliquees 2026-06-28 : beat3 "pese"->phonetique, beat4 accent "sous-payée", beat5 CTA "la version
  longue de cette video" + "quel produit t'interesse le plus que tu voudrais voir traite en video".
- Sources texte par beat : `scratchpad/cacao-beats/beat1..5.txt` (tags V3 anglais [serious]/[reflective]/[solemn]/[deliberate]).
- Pipeline : Oceane V3 FR -> STS GeoAfrique V2 (z3gESu49naEZW8Af2Upm). Script : generate-narration-expressive.py.

## ⚠️ POINTS A SURVEILLER EN PROD (decisions reportees a la prod, voir AVIS-CHAUD-AZIZ.md)
- Beat 4 (28,33s) = DENSE. Decision Aziz : NE PAS casser l'audio maintenant -> trancher le decoupage VISUEL au
  storyboard (1 audio peut couvrir 2 sous-scenes via Remotion <Sequence>). Idem Beat 5 (25,63s).
- Si Beat 5 essouffle a l'animation : plan B = couper "soixante ans apres les independances".

## 🎵 MUSIQUE — 3 SAMPLES MINIMAX (2026-06-28, en attente choix Aziz)
**Dossier** : `out/episodes/cacao-chocolat-short/music/`. Modele `fal-ai/minimax-music/v2.6`, instrumental.
| Sample | Direction | Fichier | Catbox (72h) |
|---|---|---|---|
| A | Tension documentaire (piano mineur + cordes graves, sobre) | `cacao-music-A-tension-doc.mp3` | litter.catbox.moe/m5hgoa.mp3 |
| B | Afro-melancolique (kora/ngoni, organique, digne) | `cacao-music-B-afro-melancolique.mp3` | litter.catbox.moe/z7735x.mp3 |
| C | Cinematique montant (piano qui grandit, fond d'espoir) | `cacao-music-C-cinematique-montant.mp3` | litter.catbox.moe/uz223y.mp3 |
### ✅ MUSIQUE CHOISIE (Aziz 2026-06-28) = **B — Afro-melancolique (kora/ngoni, organique)**
- Fichier retenu : `out/episodes/cacao-chocolat-short/music/cacao-music-CHOISI.mp3` (= copie de cacao-music-B-afro-melancolique.mp3).
  Catbox 72h : litter.catbox.moe/z7735x.mp3. Brut = 496s (8min16) -> a BOUCLER/COUPER au montage (fenetre ~95s).
- Pose : UNE couche globale a l'assemblage, volume ~0.08-0.12 (sous la narration), fade in/out (cf doctrine GGW).
- ⛔ NB : on avait aussi genere 3 variantes "style GGW" (G1/G2/G3) — NON retenues, Aziz prefere le sample B initial.
  (G1 litter.catbox.moe/vmpkml.mp3 · G2 oe1npb.mp3 · G3 8men0o.mp3 — gardees au cas ou, dans music/.)

## 📂 FICHIERS DU PROJET (memory/episodes/souverain/cacao-chocolat-short/)
- SCRIPT-V4.md ⭐ = script final de prod. · FACT-CHECK-RESULTAT.md = chiffres verrouilles + sources.
- AVIS-CHAUD-AZIZ.md = vision animation beat-par-beat (evolutif). · SCRIPT-V1/V2/V3 = historique (NE PAS utiliser).
- Decisions animation : SCRIPT-V2.md § DECISIONS D'ANIMATION + encart graphique Beat extraction (barre valeur).

## NEXT SESSION (dire "on reprend le cacao")
1. DA-brief LLM sur les decisions d'animation (remapper SCRIPT-V2 § animation sur les 5 beats V4).
2. Storyboard SVG-d'abord par beat (d3-geo pour Suisse/CI/Ghana en style encre ; cabosse/champ SVG pur).
3. Code Remotion (audio-derived timing depuis les durees ci-dessus) -> render -> review.
