# CHECKLIST audio-director (a derouler AVANT chaque generation)

## Pre-generation TTS (ElevenLabs)
- [ ] Script LOCKED par Aziz ?
- [ ] Scan participes "e/ee" : lister TOUS les mots, pas echantillon
- [ ] Scan "ont + voyelle"
- [ ] Scan chiffres (ecrire en lettres)
- [ ] Scan accents manquants
- [ ] Scan noms villes avec "s" final
- [ ] Preview-before-pay : voix + settings + cout annonces a Aziz

## Pre-generation Minimax (musique)
- [ ] Ce projet est-il Sonjata ? Si NON : ne pas reutiliser automatiquement Toumani Diabate / Mande / hook-formule Sonjata. Re-analyser le contexte culturel.
- [ ] Artiste de reference nomme (pas "cinematic", pas "epic")
- [ ] 1-2 instruments max
- [ ] "no synthesizers, no electronic sounds" present dans le prompt
- [ ] 3 variantes ou 1 ? (defaut : 3 variantes parallele)

## Post-generation TTS (NON-NEGOTIABLE — TOUJOURS dans cet ordre)
- [ ] ffprobe duree mesuree
- [ ] Forced Alignment ElevenLabs execute (EXCLUSIVEMENT — JAMAIS Whisper pour les beats)
  - Endpoint : POST https://api.elevenlabs.io/v1/forced-alignment
  - Input : audio mp3 + texte EXACT passe au TTS (pas le script source, pas les tags V3)
  - Output JSON sauvegarde dans public/audio/{projet}/
  - JSON transmis au storyboarder comme source de verite pour timing.ts
- [ ] Silences detectes via silencedetect
- [ ] Rapport a Aziz : metriques + "Je n'ai pas ecoute, validation perceptive Aziz requise"

## Pre-mix (multi-segment only)
- [ ] P1 : buffer cuts +-0.3-0.5s
- [ ] P2 : clamp sur boundary script, pas video
- [ ] P3 : Seedance audio ecoute pure
- [ ] P4 : keep-and-duck ajuste par scene (pas defaut 15% partout)
- [ ] P5 : timestamp drift margin

## Remotion-native audio (integration dans composition)
- [ ] Volume musique par defaut : 0.07 si SFX present, 0.15 si narration seule (valide Thiaroye V5 / Sonjata)
- [ ] SFX : pattern keep-and-duck — duck volume sous narration (scene par scene)
- [ ] hook-sfx ou SFX ponctuels : integrer via `staticFile()` + `<Audio>` avec Sequence timing
- [ ] Pistes separees (narration + musique + SFX) plutot que pre-bake sauf si livraison externe
- [ ] Fades : fade-in 2s scene 1, fade-out 2s avant fin composition
