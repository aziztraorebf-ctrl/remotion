# Gazoduc AAGP vs TSGP — STATUS

**Mis à jour** : 2026-08-02

## État — AUDIO COMPLET ✅
5 parties audio individuellement validées par Aziz (voix Harmonie→GéoAfrique, méthode texte
paragraphes fusionnés + CAPS + tags ciblés, corrections via `scripts/tools/splice-segment.py`),
**concaténées et uploadées** : `out/episodes/gazoduc-aagp-tsgp/narration.mp3` (8min37, mono 44100Hz
uniforme, garde-fou forced-align 1053/1053 mots sur le fichier complet).
Upload : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/gazoduc-aagp-tsgp/narration-SC6MI24buZKc8Z2HirtddmBDy9WLyu.mp3`
`SCRIPT-V3-VOIX.md` mis à jour avec le texte définitif (tags/CAPS/corrections).
**Prochaine étape = storyboard/timing puis code de la 1ère scène** (plus rien à faire côté audio).

## Fichiers finaux validés (à concaténer)
1. **P1** — `out/_voix-test/p1-harmonie-final-full.mp3` (validé Round 4, aucune correction ultérieure)
2. **P2** — `out/_voix-test/splice-p2/p2-final-v2.mp3` (splice "de longer"→"de suivre" + 2 pauses,
   marges corrigées — Round 11)
3. **P3** — `out/_voix-test/p3-harmonie-final-full.mp3` (validé Round 3, aucune correction ultérieure)
4. **P4** — `out/_voix-test/p4-v3-pause-native-full.mp3` (régénération complète avec `[pause]` native
   + corrections indispensable/demande/rétrécit déjà dans le texte — Round 13, **version finale
   confirmée par Aziz**)
5. **P5** — `out/_voix-test/p5-harmonie-final-full.mp3` (validé Round 5, aucune correction)

## Prochaine étape (session suivante)
Storyboard/timing (forced-align complet déjà fait sur `narration.mp3`, `.alignment.json` disponible)
PUIS code de la 1ère scène (voir NEXT-ACTION.md § Gazoduc). Note : léger doublon lexical dans P4
("la demande de gaz de leur client" / "la demande européenne" 2 phrases après) laissé tel quel car
c'est le texte qui a produit l'audio validé — signalé pour info, pas bloquant.

## Découvertes méthodologiques de cette session (détail complet : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`)
- Voix source Harmonie remplace Océane (défaut du pipeline).
- Paragraphes fusionnés + CAPS ciblées > tags seuls pour l'expressivité.
- Tags de réaction humaine (souffle, choc) fonctionnent bien ; `[laughs]`/`[clears throat]` à éviter.
- Nouvel outil `scripts/tools/splice-segment.py` : remplace un segment fautif sans re-tirer tout le
  bloc, fonctionne n'importe où dans la timeline (y compris tout début de clip).
- ⛔ Bug trouvé et corrigé : les coupes ffmpeg (splice ET pauses `pauses-sur-original.py`) doivent
  avoir une marge de sécurité (~40ms) autour des timestamps forced-align — coller à 0ms tranche
  l'attaque des mots voisins.
- Pause **NATIVE dans le texte** (`[pause]` envoyé au TTS) donne une transition bien plus naturelle
  qu'un silence splicé après-coup (`sil_s` mécanique, collage sec) — Aziz préfère nettement cette
  méthode. Pour les futures pauses : privilégier `[pause]` dans le texte dès la génération plutôt que
  `pauses-sur-original.py`, sauf réparation chirurgicale sur un audio déjà validé par ailleurs.
