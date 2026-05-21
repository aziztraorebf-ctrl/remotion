---
name: NEXT SESSION — Abou Bakari II Clips Restants
description: Brief clips restants + swaps valides + budget restant post-session 2026-04-26
type: project
---

# NEXT SESSION — Abou Bakari II : Clips restants

> Mis a jour : 2026-04-26 (session 14)
> Fact-check historique : COMPLETE (7 points verifies, "demi-frere" Option A conserve)
> Dashboard v1.7 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-6LXCXjaaPNMOJyWMynqk8dc11JGfy5.html

---

## STATUT CLIPS (5/9 couverts)

| Scene | Clip | Statut | Notes |
|-------|------|--------|-------|
| ocean (0-13s) | globe Remotion V2 (`out/abou-bakari-final.mp4` extrait 0-13s) | VALIDE | Swap 2026-04-26 |
| empire | `clips/empire-v1.mp4` (9s) | VALIDE | audio ON |
| fleet-a | `clips/fleet-a-v1.mp4` (10s) | VALIDE | audio OFF (content policy) |
| fleet-b | `clips/fleet-b-v1.mp4` (6s) | VALIDE 9/10 | audio ON |
| name | — | A GENERER | 10s, ~$6.83 |
| abdication | — | A GENERER | 10s Seedance + 4s caravane V2 |
| obsession | `clips/ocean-v1.mp4` (utiliser 0-6s) | VALIDE | Swap 2026-04-26 |
| colomb | — | A GENERER | 7s, ~$4.78 |
| close_cta | Remotion pur | PENDING | split-screen fleet-a + colomb |

---

## SWAPS STRATEGIQUES VALIDES (2026-04-26)

### Swap 1 — ocean : globe Remotion V2
- Scene "ocean" (0-13s) : utiliser animation globe espace `out/abou-bakari-final.mp4` (extrait 0-13s)
- Style Remotion pur, epique, "1311" visible a 2s — aucune generation necessaire
- clip ocean-v1 Seedance DEPLACE vers scene obsession

### Swap 2 — obsession : ocean-v1 Seedance reutilise
- Scene "obsession" (67-73s) : utiliser `clips/ocean-v1.mp4` (0-6s seulement)
- Homme silhouette face horizon = lecture "obsession" immediate
- obsession-v1.mp4 ABANDONNE (Abou Bakari se retournait face camera + bateau sur place)

### Swap 3 — abdication complement : caravane V2 au lieu de Video Extend
- Clip Seedance abdication 10s (Mansa Moussa throne) + extrait caravane V2 ~4s (abou-bakari-final.mp4 ~65-70s)
- Video Extend ANNULEE sur toutes les scenes — plus aucune extension prevue

---

## BUDGET

- Budget initial : $30.00
- Depense session 14 : ~$27.93
  - ocean : $6.83 (10s V2)
  - empire : $6.15 (9s V2)
  - fleet-a : $6.83 (10s V2, $0 content policy retry)
  - fleet-b : $4.11 (6s V2)
  - obsession : $4.11 (6s V2, abandonne mais facture)
- **Restant : ~$2.07** — insuffisant pour une generation
- **Recharge necessaire** : ~$18-20 pour name ($6.83) + abdication ($6.83) + colomb ($4.78)

---

## CLIPS A GENERER (apres recharge)

### name (10s, ~$6.83)
- Script : `scripts/tools/seedance-abou-bakari-name.py` (a creer depuis template fleet-b)
- Image source : `public/assets/abou-bakari/scenes/scene-name-v6.png`
- Prompt : voir dashboard section "name" (figure de dos + guards salute ripple + push-in)
- Audio : ON
- Note : scene emotionnellement cle — Abou Bakari de dos toute la scene, ne se retourne jamais

### abdication (10s, ~$6.83)
- Script : `scripts/tools/seedance-abou-bakari-abdication.py` (a creer)
- Image source : `public/assets/abou-bakari/scenes/scene-abdication-v3.png`
- Prompt : voir dashboard section "abdication" (Mansa Moussa arc camera 30 deg droite + scepter RIGID)
- Audio : ON
- Complement post-Seedance : extrait `out/abou-bakari-final.mp4` ~65-70s (caravane chameaux, ~4s)
  Transition Seedance->caravane V2 a gerer au montage Remotion

### colomb (7s, ~$4.78)
- Script : `scripts/tools/seedance-abou-bakari-colomb.py` (a creer)
- Image source : `public/assets/abou-bakari/scenes/scene-colomb-v1.png`
- Prompt : voir dashboard section "colomb" (cold palette, pull-back, pale-skinned crew)
- Audio : ON
- IMPORTANT : palette FROIDE deliberee — contraste avec toutes les scenes precedentes

---

## REGLES CLES RAPPEL

- **R-DOT-EYES-SAFE-VERBS (NEW 2026-04-26)** : INTERDIT "eyes WIDE / wide-eyed / eyes dilated" sur projets dot-eyes. Utiliser RECOILS, STAGGERS, BRACES, SHOUTS — mouth OPEN
- **R-SKIN-EXPLICITE** : clause "DARK BROWN skin — clearly visible" sur chaque perso ouest-africain, meme avec charref
- **Audio ON** par defaut — switcher OFF uniquement si content policy violation (fleet-a precedent)
- **Review frames obligatoire** : ffmpeg extract + Read PNG AVANT de presenter a Aziz
- **Script Python** : copier depuis `scripts/tools/seedance-abou-bakari-fleet-b.py` (template valide)
- **Pricing reel** : ~$0.683/s (V2). 10s=$6.83, 7s=$4.78, 6s=$4.10

---

## APRES CLIPS — ETAPES RESTANTES

1. CTA audio : regenerer `beat09-cta.mp3` avec voix z3gESu49naEZW8Af2Upm
2. Storyboarder : produire `timing.ts` a partir de l'audio force-aligned
3. Remotion composer : assembler tous clips + globe V2 + caravane V2 + audio
4. Quality reviewer : review finale + Kimi
5. Render final + Vercel + Postiz

---

## RAPPELS TECHNIQUES

- **Forced-alignment** : `public/audio/abou-bakari/abou-bakari-alignment.json` — NE PAS utiliser Whisper
- **Outdir clips** : `public/assets/abou-bakari/clips/`
- **Charrefs Vercel** :
  - Abou Bakari Royal : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/abou-bakari-royal-charref-v1-5xPrxyyPAd6pQNGft00fGVx6YOnDTS.png
  - Abou Bakari Marin : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/abou-bakari-marin-charref-v1-XY7veYZWHNdw4Jm4JXiNCWwWhs6JYd.png
  - Capitaine pirogue : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/capitaine-pirogue-charref-v3-UDPEaYJMOjkLNMWXJZUNaU3EoYQJV5.png
  - Mansa Moussa : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/refs/mansa-moussa-charref-v2-vHUPiYqCHGI9b4qKxI79FSZUnXeFlx.png

---

## STARTER PROMPT (copier-coller)

```
Charge la memoire de session :
1. Lis memory/COMPACT_CURRENT.md
2. Lis memory/NEXT-SESSION-abou-bakari-ii-clips.md

Session Abou Bakari II — generation clips restants (apres recharge budget).

Fact-check historique : DEJA COMPLETE (session 2026-04-26).
Clips valides : ocean (globe V2), empire, fleet-a, fleet-b, obsession (reutilise ocean-v1).
Clips restants : name (10s), abdication (10s + caravane V2 4s), colomb (7s).
Budget : recharger ~$20 avant de commencer.

Dashboard v1.7 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-6LXCXjaaPNMOJyWMynqk8dc11JGfy5.html

Lancer dans l'ordre : name -> abdication -> colomb. Validation Aziz apres chaque clip.
```
