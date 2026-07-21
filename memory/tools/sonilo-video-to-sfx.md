---
name: sonilo-video-to-sfx
description: Sonilo v1.1 (fal.ai) video-to-sound-effects TESTE et ECARTE pour notre pipeline SFX — c'est un scoreur MUSICAL deguise, pas du foley ponctuel.
metadata:
  type: reference
---

# Sonilo v1.1 video-to-sound-effects (fal.ai) — TESTE, ECARTE (2026-07-21)

Endpoint `sonilo/v1.1/video-to-sound-effects`. Teste sur Soudan Acte 4 globe
(131 s, 2 passes, ~2,40 $ total). Verdict Aziz : **echec clair pour notre usage.**

## Ce que c'est vraiment
Sonilo est un modele **video -> MUSIQUE** licencie (compose une BO qui suit l'arc
emotionnel). L'endpoint "sound-effects" est une **facade sur le meme moteur
musical** : il declenche des musiques (style Game of Thrones), PAS du foley
ponctuel discret — **meme quand on l'ordonne explicitement via `segments` +
`prompt` anti-musique**. Le steering n'y change rien = c'est la nature du modele.

## Preuves du test
- **Test 1** (video muette, sans steering) : cale grossierement l'ENERGIE sur
  l'action (calme au debut, pic au climax), mais matiere = drone/nappe parfois
  stridente. "Rien qu'on n'aurait pas fait nous-memes."
- **Test 2** (video AVEC narration + 6 segments "SFX ponctuels, pas de musique") :
  PIRE calage. Ignore la plupart des evenements (points armee, traces, navire
  Port-Soudan). Declenche 2 musiques differentes mal dosees vs la voix (musique
  parfois plus forte que la narration). Seul SFX correct = petite explosion du
  drone sur l'insert Kosti. Le steering a DEGRADE, pas ameliore.

## Pourquoi ecarte (raison de fond)
Sonilo vend un **remplaçant** de pipeline audio (piste finale figee, a prendre ou
a laisser), pas un **composant** orchestrable. Notre moat = composition
deterministe ou Claude ajuste chaque volume/timing. Un mix fige perd toujours.
Cf [[feedback_vox-generation-vs-composition-deterministe-moat]].

## Economie (le tueur)
~1,20 $/scene × 6 = ~7 $ pour un resultat a JETER. Alternative gardee :
ElevenLabs (SFX, centimes/effet) + Minimax (`fal-ai/minimax-music/v2.6`, 2-3
musiques) + mixage Claude = fraction du cout ET controle total des volumes.

## Contrat API (si on recroise Sonilo pour MUSIQUE pure un jour)
Le validateur `segments` est strict (appris par 4 erreurs successives) :
- champs exacts : `start` / `end` / `prompt` (PAS `start_time`/`end_time`)
- segments **contigus obligatoires** : `segment[N].end` == `segment[N+1].start`, zero trou
- dernier `end` <= duree reelle de la video (ffprobe, pas arrondi au-dessus)
- input top-level : `video_url` (requis), `audio_format` (wav/mp3/aac/flac),
  `prompt` (optionnel, steering global), `segments` (optionnel)
- output : `audio` {url, content_type, file_size} + `audios[]`. Prix 0,009 $/s.
- upload video : `fal_client.upload_file()` (catbox etait down). Appel via
  `fal_client.subscribe(ENDPOINT, arguments={...})`.

## Verdict
ECARTE pour SFX et pour toute pipeline exigeante. Eventuellement note pour de la
musique AUTO sur video sans voix + sans exigence de precision — jamais chez nous.
