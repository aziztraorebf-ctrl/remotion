# Soudan mid-form — Décision AUDIO MIX (passe finale, 2026-07-21)

## MUSIQUE choisie
- **Variante B — `soudan-music-B-kora-dundun.mp3`** (kora + dundun, 127s, notre signature Kora et Cartes).
- Fichier : `public/_shared/audio/soudan/music/soudan-music-B-kora-dundun.mp3`
- Rejetées : les 2 variantes "thriller/synth" Gemini (dans `_rejete-thriller/`) — trop énergétiques, ne collent pas.
- Autres candidates gardées en banque : A, C, D, E, F (kora douces). E (mélodique) était finaliste, B a gagné le duel zone-doc.

## RÉGLAGE MIX (figé Aziz)
- **Volume musique = 0.08** (zone doc standard, ~-13 dB sous la narration).
- **Basses domptées** : filtre `bass=g=-7:f=200:w=0.6` (la kora reste présente, le dundun/basse n'enterre pas la voix).
- **SFX volume = 0.5**.
- **Voix REINE** (narration ElevenLabs déjà dans les actes).
- ⚠️ **NOTE AZIZ** : si à l'assemblage complet l'audio déplaît / reste trop fort → **descendre le volume musique à 0.06** (re-mix ffmpeg simple, ne PAS toucher au reste).

## BOUCLE musique (organique, zéro raccord)
- Musique 127s < vidéo 626s → boucle par **crossfade triangulaire 3s** entre répétitions (6 copies), + fade-in 2s / fade-out 3s.
- Script boucle : `scratchpad/music-B-loop-626.mp3` déjà construit (626s).

## 7 SFX (timecodes globaux, calés sur l'assemblage)
`public/_shared/sfx/soudan/` : mines=6s · fracture=86s · connexion=189s · russie=284s · drone=363s · veto=535s · bilan=600s.
- Ajustements SFX éventuels = round 2 final (Aziz OK pour garder tels quels pour l'instant).

## Script de mix
- `scratchpad/mix-soudan.sh` (paramétrable) OU commande ffmpeg inline (musique loop + 7 SFX adelay + amix normalize=0).
- Vérifier max_volume < 0 dB (pas de clipping) après mix.

## ORDRE RESTANT passe finale
1. Re-render 6 actes AVEC visuels LOT 1-5 (Mapbox actes 1-2 via `render-mapbox.sh` ; D3 actes 3-6 classique).
2. Concat (ffmpeg) → nouvel assemblage visuel.
3. Mix audio (musique B loop + 7 SFX) sur cet assemblage → mid-form FINAL.
4. Promotion FINAL (Acte 1/3/4 + assemblage complet).
