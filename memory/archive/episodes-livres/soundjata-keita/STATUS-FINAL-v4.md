# Sonjata Papercraft — FINAL v4 (PUBLIÉ)

> Migré depuis auto-memory 2026-08-31. Consolidé 2026-04-26. Sessions 1 a 10.
> **VALIDE PAR AZIZ le 2026-04-26. Publié** — livrable dans `out/PRET-PUBLICATION/sonjata-v7-FINAL.mp4`.
> Composants Remotion archivés dans `src/_archive/episodes-livres/geoafrique-shorts/Sonjata*.tsx`.

## Status final (2026-04-26 session 10) — v4
- **Render final v4** : `sonjata-final-v4-compressed.mp4` (86MB, ~163s, 1080x1920, H.264/AAC)
- **4 corrections v4** (2026-04-26) :
  - SFX Kirina restaures : scene7 re-rendue (war-drums-menacing.mp3 intact)
  - Citation 3 scene9 : "aboli" -> "reduit en esclavage par razzia" (precision historique Kouroukan Fouga)
  - Scene10 : "deux siecles" -> "cinq cent cinquante-quatre ans" (correction audio sonjata-correction-s9s10.mp3)
  - "jamais" scene7 complet : SCENE7D etendu 6s->8s (total scene7 : 24s->26s)
- **Structure** : Hook 5s (silence + narration Cesar) + Scenes 1-10 (147s) + CTA 10s
- **Total frames** : 4860 @ 30fps
- **Musique** : Minimax 2.6 v2-A-griot-intime (Toumani Diabate, 157s) — continue maintenant sous le CTA avec fade-out 2s
- **Hook v2 (Cesar)** : "Il ne pouvait pas marcher. Il a fonde un empire plus grand que l'Europe medievale." (4.96s)
- **CTA v2 (Cesar)** : "Et toi, tu savais que les premiers droits de l'homme sont nes en Afrique ? Chaque matin dans notre newsletter, l'Afrique qu'on ne t'apprend pas. Lien en bio." (9.76s)

## 3 fixes audio session 2026-04-23 (appliques dans SonjataShortFull.tsx)

### Fix 1 : scene 7 "jamais" coupe
- **Probleme** : clip scene7-assembled.mp4 coupait le mot "jamais" a 107.98s master, fin attendue 108.22s.
- **Solution** : mute audio du clip scene7 + Audio overlay du master `sonjata-short-v2.mp3` a partir de 83.94s + duree scene7 allongee 24s -> 25s pour donner respiration avant scene 8.

### Fix 2 : bruit de flute parasite scene 8
- **Probleme** : Seedance V2 avait genere une flute en fond (generate_audio ON) qui contrariait le climax musical de la Charte Mande.
- **Solution** : mute audio du clip scene8 + Audio overlay du master `sonjata-short-v2.mp3` a partir de 109.34s.

### Fix 3 : coupure brute musique -> CTA
- **Probleme** : musique Toumani s'arretait net au debut du CTA (silence brutal).
- **Solution** : Sequence musique etendue a `SCENES_DURATION + CTA_FRAMES` (= 156s total), fade-out 2s deplace sur les 2 dernieres secondes du CTA.

## Pipeline valide
```
Image Gemini ($0.04-0.08) -> Clip Seedance i2v ($1.50-4.50) -> Remotion assemblage (keep-and-duck) -> Render 1080x1920
```

## Character sheets canoniques (generes 2026-04-20)
| Personnage | Ref | Scenes |
|---|---|---|
| Sunjata enfant | `sonjata-papercraft/refs/sunjata-child-charsheet-v1.png` | 1-5 |
| Sunjata guerrier | `sonjata-papercraft/refs/sunjata-adult-charsheet-v1.png` | 6-7 |
| Sunjata roi | `sonjata-papercraft/refs/sunjata-king-charsheet-v1.png` | 8-10 |

## Audio
- Voix : Narratrice GeoAfrique v2 (`z3gESu49naEZW8Af2Upm`), Voice Remixing V3
- Fichier : `sonjata-papercraft/audio/sonjata-short-v2.mp3` (153s)
- Forced alignment : `sonjata-papercraft/audio/sonjata-short-v2-alignment.json` — SOURCE DE VERITE

## Progression scenes — 10/10 COMPLETES

| Scene | Titre | Narration (s) | Etat | Cout |
|---|---|---|---|---|
| 1 | Prophetie + naissance | 0.08-11.46 | ASSEMBLE | $3.72 |
| 2 | Humiliation Sassouma | 12.14-25.60 | ASSEMBLE (dialogue lip-sync) | $8.00 |
| 3 | Assez + forgeron + cercle | 26.56-39.38 | ASSEMBLE (storyboard 6 panels) | ~$4.80 |
| 4 | Mains sur fer + IL SE LEVE | 40.28-52.08 | ASSEMBLE (start/end + orbite 180) | ~$3.76 |
| 5 | Barre en arc + baobab | 52.94-65.02 | ASSEMBLE (5A Ken Burns + 5B) | ~$2.28 |
| 6 | Exil + guerrier + messager | 66.19-82.98 | ASSEMBLE (6A+6B+6C) | ~$3.44 |
| 7 | Soumaoro + Kirina + defaite | 83.94-108.22 | ASSEMBLE (7A-7D) | ~$7.20 |
| 8 | Mansa + Charte | 109.34-126.94 | ASSEMBLE (8A+8B Seedance V2) | ~$5.44 |
| 9 | Citations Charte | 128.08-135.66 | ASSEMBLE (Remotion pur, parchemin + Cinzel Decorative + symboles Gemini) | ~$0.24 |
| 10 | Close + droits de l'homme | 137.00-152.86 | ASSEMBLE (timeline 1235/1789 + split video + signature) | $0 |

**Cout cumule** : ~$52.50
**Render complet** : `public/assets/sonjata-papercraft/sonjata-short-full.mp4` (204MB, 146s, 1080x1920)

## Compositions Remotion (archivées)
- `SonjataScene8.tsx` — 8A Mansa + 8B Charte (18s)
- `SonjataScene9.tsx` — Remotion pur, parchemin Gemini, Cinzel Decorative, 3 symboles Gemini (arbre vie / bouclier / chaines brisees), SFX plume
- `SonjataScene10.tsx` — 3 parties (timeline 1235/1789, split video, close signature Heros Oublies)
- `SonjataShortFull.tsx` — assemblage 10 scenes via OffthreadVideo
- `SonjataCTA.tsx` — CTA

## Scene 8 — Details session 7 (2026-04-21 PM)
- 2 images Gemini avec charsheet roi : Mansa devant Niani + Proclamation Charte sous baobab
- Edition chirurgicale : inscriptions N'Ko ajoutees sur tablette 8B
- Proportions corrigees sur 8A (Sunjata meme taille que figurants)
- 2 clips Seedance V2 9s chacun — valides par Aziz ("parmi les meilleurs clips")
- Orbite 90 camera = confirme effet pseudo-3D isometrique (4eme confirmation)

## Scene 9 — Details session 7
- Fond parchemin Gemini (bords brunis, bordure Mande, sans texte)
- Police Cinzel Decorative (`@remotion/google-fonts/CinzelDecorative`)
- 3 symboles Gemini fond transparent (arbre de vie, bouclier+main, chaines brisees+oiseau)
  - Transparence obtenue par post-traitement PIL (seuil brightness > 160 → alpha 0)
- SFX plume (ElevenLabs SFX API, `quill-writing.mp3`)
- Citations apparaissent en cascade synchronisees avec narration (spring + translateY)

## Scene 10 — Details session 7
- 10A : timeline 1235 (or) vs 1789 (gris), barre progresse, "554 ans d'avance"
- 10B : split vertical video — scene 2 (matrone pointe, frame 210) | scene 8A (Mansa sceptre, frame 10)
  - Sunjata recentre dans le frame droit (objectPosition 40%, marginLeft -80%)
- 10C : "SOUNDJATA KEITA" + "HEROS OUBLIES" en Cinzel Decorative or, fade to black

## Erreurs codifiees (utile pour futurs episodes similaires)
1. Forced alignment = source de verite, PAS le manifest
2. Storyboard corrections = regenerer le complet
3. Character sheets AVANT production
4. UN SEUL job Seedance a la fois — TOUJOURS via visual-producer
5. `[pause]` tag prononce par ElevenLabs V2 multilingual — utiliser `...` a la place
6. `generate_audio: true` + "No music" dans prompt = conflit, comportement inconsistant
