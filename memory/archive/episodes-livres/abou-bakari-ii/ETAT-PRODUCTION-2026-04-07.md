# GeoAfrique — Abou Bakari II : État de Production (2026-04-07)

> Migré depuis auto-memory 2026-08-31. Snapshot de production, projet GeoAfrique désormais archivé.
> Conservé pour l'historique et les timings/settings techniques si le sujet est un jour repris.

## Statut global (au 2026-04-07)
- **Beats 01-09** : TOUS COMPLETES via pipeline Seedance V2
- **Reste (à l'époque)** : musique Suno + render final assemblage Remotion
- **Blocker** : décision Format 6 + crédits Dreamina

## Sujet
Abou Bakari II — Mansa du Mali, ~1311. Abdique son trône pour traverser l'Atlantique avec 2000 pirogues. Ne revient jamais. 181 ans avant Colomb.

**Nuance historique** : "Abou Bakari II" = erreur de traduction XIXe siècle. Source = al-Umari (1337), 3e main. Le nom a été gardé avec honnêteté épistémique dans le script.

## Style Visuel
- **Style** : Flat design 2D — Seedance 2.0 (principal) + Kling (4K/API backup) + Remotion overlays
- **Fond** : gradient vertical #050208 (zenith) -> #080d1a (horizon)
- **Or** : #D4AF37 | **Ambre** : #C8820A | **Crème** : #F5E6C8
- **Format** : 1080x1920 (9:16 Short)

## Voix
- **Voix officielle** : Stephyra (ElevenLabs)
- **Voice ID** : `QMNPncWXVcTVhJ9rDEQO`
- **Settings** : stability 0.60, similarity_boost 0.80, style 0.10, eleven_v3

⚠️ Note projet (2026-08-31) : la doctrine actuelle (CLAUDE.md) marque **Stephyra PVC interdit** dans
les règles agent 5-agents — vérifier si cette interdiction s'applique rétroactivement ou concerne un
usage différent avant de reprendre ce projet.

## Timings Whisper (30fps)

| Beat | Start (s) | End (s) | Frame Start | Frame End |
|------|-----------|---------|-------------|-----------|
| ocean | 0.00 | 5.76 | 0 | 173 |
| empire | 6.56 | 8.92 | 197 | 268 |
| fleet | 9.56 | 14.90 | 287 | 447 |
| name | 15.66 | 23.42 | 470 | 703 |
| abdication | 23.92 | 30.54 | 718 | 916 |
| timeline | 31.26 | 43.38 | 938 | 1301 |
| colomb | 43.90 | 52.68 | 1317 | 1580 |
| close | 52.68 | 54.00 | 1580 | 1620 |

## Pipeline utilisé (V2 — Seedance)
```
Seedance 2.0 via Dreamina web -> ffmpeg strip audio -> Remotion OffthreadVideo + Audio ElevenLabs
```
Pipeline legacy Gemini->Kling gardé comme backup pour 4K et quand API Seedance indisponible.

## Fichiers clés (historique, projet archivé)
```
src/_archive/episodes-livres/geoafrique-shorts/  (chemin d'archivage actuel probable — à vérifier)
  AbouBakariShort.tsx     <- Composant principal
  timing.ts               <- Timings Whisper en frames
```

## Tests Seedance validés sur ce projet
- Format 6 Abou Bakari 3 époques : 9.5/10
- Extension vidéo (V2V) flotte : 7.5/10
- Contraste chromatique : 10/10 (hook parfait)
- Beat sync 10 shots : 9.5/10
- Dialogue Abou Bakari/Moussa lip sync : 10/10
