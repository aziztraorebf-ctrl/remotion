# MUSIQUE-INDEX — inventaire mesure des pistes musicales

> Genere le 2026-07-29 par passe de mesure ffmpeg sur **478 fichiers audio** de `public/`.
> **Complement chiffre de [`INDEX-MUSIQUES.md`](INDEX-MUSIQUES.md)**, qui reste la source de verite
> pour la CLASSIFICATION (familles, usage narratif, doublons) et pour la doctrine de selection.
> Ce fichier-ci apporte : le **LUFS**, l'**amplitude mesuree par fenetres de 5 s**, le **plancher**
> (niveau des trous), et le **tri musique / narration / SFX sur la totalite de `public/`**.
>
> ⛔ **A LIRE AVANT TOUT APPEL Minimax/fal.ai.** Generer sans avoir lu ce fichier, c'est re-payer
> ce qu'on possede deja.

## Compte final

| Categorie | Nb | Detail |
|---|---|---|
| **Pistes MUSICALES** | **72** | dont 2 rejetees d'office, 1 ecartee (ancienne CFA), 4 doublons binaires -> **65 pistes uniques exploitables** |
| Narrations / voix off ecartees | 219 | narration d'episode, hooks, CTA, segments de beat, tests de voix |
| SFX / ambiances ecartes | 187 | bruitages ponctuels (< 30 s) + nappes d'ambiance non musicales |
| Incertains | **0** | les 4 cas douteux ont ete tranches par canaux+debit (voir section dediee) |
| **Total scanne** | **478** | |

⚠️ **L'estimation « 71 pistes » etait juste a une unite pres — mais pour une raison fausse.**
Le compte de 71 portait sur le repo principal seul. Le vrai compte est **72**, parce qu'une piste
vit **hors du repo principal** : `musique-episode.mp3`, dans le worktree `remotion-cfa`. C'est
precisement l'ancienne piste CFA que l'on croyait introuvable (voir « Ecartees »).

## METHODE DE MESURE (reproductible)

Script : **`scripts/tools/measure-music-track.py`** — `python3 scripts/tools/measure-music-track.py <fichier.mp3> [...]` renvoie du JSON.
Toutes les mesures via `ffmpeg`/`ffprobe` 8.0.1, sans aucune ecoute — **aucun jugement
perceptif n'est affirme dans ce fichier**.

| Colonne | Commande | Lecture |
|---|---|---|
| `duree` | `ffprobe -show_entries format=duration` | secondes |
| `LUFS` | `ffmpeg -af loudnorm=print_format=json` -> `input_i` | loudness integre EBU R128 |
| `bande voix` | `ffmpeg -af highpass=f=200,lowpass=f=2000,astats` -> RMS Overall | RMS dans la bande 200 Hz-2 kHz, la ou vit la voix. Plus c'est bas, moins ca masque la narration. |
| `ampl5` ⭐ | voir ci-dessous | **amplitude dynamique** = ecart fort/faible |
| `p90-p10` | percentiles 90 et 10 des memes fenetres | variante robuste, ignore les 2 extremes |
| `plancher` | minimum des memes fenetres | **niveau reel des trous** sous la narration |
| `couture` | `\|RMS(3 s de tete) - RMS(3 s de queue)\|` | ecart au raccord de boucle |

### Comment `ampl5` est calcule (le point critique)

La piste est **reellement tranchee** en fenetres de **5 secondes** (`ffmpeg -ss N -t 5`), le RMS
Overall de chaque tranche est releve, puis :

```
ampl5 = max(RMS des fenetres) - min(RMS des fenetres)
plancher = min(RMS des fenetres)
```

⚠️ **Piege verifie et evite ce jour** : la variante rapide `asetnsamples=n=...,astats=reset=1`
**ne reinitialise pas reellement les compteurs** et renvoie une amplitude quasi nulle (0.6 dB la ou
la vraie valeur est 4.6 dB). Elle a ete abandonnee au profit du decoupage explicite, plus lent
(~11 s/piste) mais non ambigu.

**Seuil de decision** : `ampl5 >= 15 dB` = la piste plonge -> trous audibles sous une narration
continue. C'est le critere qui a fait ecarter l'ancienne piste CFA.

ℹ️ `ampl5` est **systematiquement plus severe** que le `ampl` (p90-p10 sur 1 s) de
`INDEX-MUSIQUES.md` : il retient les extremes au lieu de les ecreter. Les deux colonnes sont
donnees pour que les deux fichiers restent comparables.

⚠️ **La duree n'est PAS un critere** (correction Aziz, 2026-07-29) : les pistes Minimax se bouclent.
La colonne `boucles/268s` dit juste combien de boucles il faut pour un mid-form de 4 min 28.

## PISTES A FAIBLE AMPLITUDE — candidates sures sous narration

Filtre : `ampl5` croissant, pistes >= 60 s, hors rejetees/ecartees. Toutes ont `ampl5 < 15 dB`.
Le **caractere percu n'est PAS renseigne** : il n'a pas ete ecoute. Les noms de fichiers suggerent
un registre, ils ne le prouvent pas.

| # | piste | duree s | boucles/268s | ampl5 | plancher | bande voix | couture | LUFS | chemin |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `music-A-tension-industrielle.mp3` | 141 | 1.9x | **3.3** | -14.7 | -19.8 | 0.3 | -11.2 | `public/souverain/maroc-batteries/audio/music-A-tension-industrielle.mp3` |
| 2 | `score-epic.mp3` | 60 | 4.5x | **3.5** | -14.5 | -23.8 | 1.0 | -11.1 | `public/_shared/audio/sudan-warmap/score-epic.mp3` |
| 3 | `music-C-analytique-tendu.mp3` | 148 | 1.8x | **3.7** | -16.0 | -20.8 | 3.4 | -12.5 | `public/souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3` |
| 4 | `music-E-epic-orchestral.mp3` | 102 | 2.6x | **3.8** | -18.0 | -25.4 | 1.7 | -15.1 | `public/_shared/audio/sahel-warmap/music/music-E-epic-orchestral.mp3` |
| 5 | `music-A.mp3` | 133 | 2.0x | **4.0** | -14.5 | -20.4 | 7.5 | -11.1 | `public/souverain/silicon-savannah/audio/music/music-A.mp3` |
| 6 | `music-v1.mp3` | 219 | 1.2x | **4.7** | -16.7 | -18.0 | 4.8 | -11.1 | `public/souverain/niger-uranium/audio/music-v1.mp3` |
| 7 | `variante-C-epique-balafon-djembe.mp3` | 220 | 1.2x | **4.9** | -17.6 | -21.0 | 1.5 | -13.1 | `public/audio/abou-bakari/music/variante-C-epique-balafon-djembe.mp3` |
| 8 | `historical-map-music-minimax26.mp3` | 111 | 2.4x | **5.1** | -19.2 | -20.9 | 2.5 | -13.4 | `public/assets/geoafrique/audio/historical-map-music-minimax26.mp3` |
| 9 | `v1-B-marche-or.mp3` | 217 | 1.2x | **5.4** | -18.2 | -18.2 | 2.3 | -12.4 | `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3` |
| 10 | `music-C.mp3` | 159 | 1.7x | **5.6** | -17.5 | -17.0 | 2.0 | -11.7 | `public/souverain/silicon-savannah/audio/music/music-C.mp3` |
| 11 | `variante-A-royal-kora-balafon.mp3` | 158 | 1.7x | **5.8** | -16.9 | -17.5 | 3.2 | -11.8 | `public/audio/abou-bakari/music/variante-A-royal-kora-balafon.mp3` |
| 12 | `music-A-ambient-souverain.mp3` | 321 | 0.8x | **5.9** | -18.2 | -18.7 | 2.5 | -13.0 | `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3` |
| 13 | `music-C-cordes-minimales.mp3` | 147 | 1.8x | **5.9** | -19.2 | -18.4 | 8.3 | -13.6 | `public/_shared/audio/sahel-warmap/music/music-C-cordes-minimales.mp3` |
| 14 | `music-C-tension.mp3` | 256 | 1.0x | **6.1** | -18.5 | -16.1 | 0.6 | -12.0 | `public/souverain/zimbabwe-lithium/audio/music/music-C-tension.mp3` |
| 15 | `music-c-desert.mp3` | 256 | 1.0x | **6.1** | -18.5 | -16.1 | 0.6 | -12.0 | `public/atlas/peste-1347/audio/music-c-desert.mp3` |
| 16 | `music-F-military-tendue.mp3` | 129 | 2.1x | **6.2** | -22.2 | -28.1 | 3.6 | -14.3 | `public/_shared/audio/sahel-warmap/music/music-F-military-tendue.mp3` |
| 17 | `v1-A-caravane-tuareg.mp3` | 159 | 1.7x | **6.4** | -17.9 | -19.7 | 4.4 | -12.5 | `public/audio/atlas-empire-ghana/music/v1-A-caravane-tuareg.mp3` |
| 18 | `music-A-revelation.mp3` | 132 | 2.0x | **6.5** | -18.7 | -19.0 | 1.9 | -10.8 | `public/souverain/vraie-taille-afrique/audio/music-A-revelation.mp3` |
| 19 | `soudan-music-B-kora-dundun.mp3` | 127 | 2.1x | **6.8** | -23.8 | -23.7 | 2.3 | -18.5 | `public/_shared/audio/soudan/music/soudan-music-B-kora-dundun.mp3` |
| 20 | `ambiance-raw.mp3` | 163 | 1.6x | **7.3** | -18.7 | -21.1 | 11.4 | -14.0 | `public/audio/ggw-muraille-verte/music/ambiance-raw.mp3` |
| 21 | `music-v1.mp3` | 163 | 1.6x | **7.7** | -23.7 | -20.6 | 4.0 | -15.7 | `public/poc-money-legends/audio/music-v1.mp3` |
| 22 | `music-v1.mp3` | 163 | 1.6x | **7.7** | -23.7 | -20.6 | 4.0 | -15.7 | `public/souverain/or-africain/audio/music-v1.mp3` |
| 23 | `variante-D-royal-sombre-kora.mp3` | 118 | 2.3x | **7.7** | -23.4 | -19.2 | 17.1 | -15.1 | `public/audio/abou-bakari/music/variante-D-royal-sombre-kora.mp3` |
| 24 | `music-C-fierte.mp3` | 219 | 1.2x | **7.8** | -22.0 | -18.9 | 0.0 | -13.6 | `public/souverain/vraie-taille-afrique/audio/music-C-fierte.mp3` |
| 25 | `music-ingoma.mp3` | 171 | 1.6x | **7.8** | -20.1 | -19.6 | 6.8 | -12.2 | `public/atlas-shaka-zulu/audio/music-ingoma.mp3` |
| 26 | `music-B-atlas.mp3` | 383 | 0.7x | **7.9** | -19.2 | -20.3 | 3.1 | -12.1 | `public/souverain/vraie-taille-afrique/audio/music-B-atlas.mp3` |
| 27 | `soudan-music-F-kora-ample.mp3` | 156 | 1.7x | **7.9** | -22.6 | -23.1 | 7.5 | -14.1 | `public/_shared/audio/soudan/music/soudan-music-F-kora-ample.mp3` |
| 28 | `soudan-music-E-kora-melodique.mp3` | 143 | 1.9x | **8.3** | -24.2 | -23.3 | 10.4 | -15.3 | `public/_shared/audio/soudan/music/soudan-music-E-kora-melodique.mp3` |

## ECARTEES

### Rejetees par le realisateur — ne jamais reproposer

| piste | duree s | ampl5 | raison |
|---|---|---|---|
| `_rejete-thriller/soudan-music-A-affine.mp3` | 125 | 7.3 | **REJETE par Aziz** (registre thriller refuse). Mesures correctes, c'est un refus artistique. |
| `_rejete-thriller/soudan-music-B-brut.mp3` | 38 | 2.9 | **REJETE par Aziz** — idem. Couture de boucle 25.6 dB en prime. |

Chemin : `public/_shared/audio/soudan/music/_rejete-thriller/`.

### Ancienne piste CFA — identifiee

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | couture | chemin |
|---|---|---|---|---|---|---|---|
| `musique-episode.mp3` | 154 | -24.2 | 6.9 | 4.6 | **-31.5** | **5.4** | `remotion-cfa/public/_rnd/cfa-nuit1994/musique-episode.mp3` |

C'est **l'ancienne piste « A-souverain-nocturne »** de l'episode CFA, deja ecartee. Identification
par recoupement, pas par le nom (le fichier a ete renomme `musique-episode.mp3`) :

- **plancher mesure -31.5 dB** vs « chutes a -33.7 dB » dans la note d'Aziz ;
- **couture de boucle 5.4 dB** vs « 5.5 dB -> fade de 4 s » note dans `INDEX-MUSIQUES.md` ;
- c'est le seul fichier musical du dossier de l'episode CFA, et son `md5` ne correspond
  a **aucune** piste du repo principal — elle n'existe que dans le worktree.

⚠️ Les **19 dB d'amplitude** de la note d'Aziz ne se retrouvent pas dans ma mesure (`ampl5` 6.9,
`p90-p10` 4.6). Deux lectures possibles, **non tranchees** : soit les 19 dB ont ete mesures sur une
autre fenetre/methode, soit sur une version anterieure du fichier. Le **plancher a -31.5 dB reste
le vrai probleme** et suffit a la maintenir ecartee : c'est lui qui creuse les trous sous la voix.

### Amplitude trop forte pour un fond sous narration (`ampl5 >= 15 dB`)

Restent utilisables en pleine bande, sans voix par-dessus.

| piste | ampl5 | plancher | duree s |
|---|---|---|---|
| `music-C-oud-analytique.mp3` | 15.2 | -29.0 | 184 |
| `variante-B-kora-ngoni.mp3` | 15.2 | -30.5 | 182 |
| `variante-A-balafon-dundun.mp3` | 15.4 | -28.6 | 346 |
| `cacao-music-CHOISI.mp3` | 18.5 | -33.0 | 496 |
| `variante-C-balafon-solo.mp3` | 19.4 | -31.0 | 170 |
| `v1-B-alpes-tension.mp3` | 19.8 | -31.6 | 243 |
| `music-D-montee-maitrisee.mp3` | 20.8 | -31.0 | 538 |
| `a2_nuit.mp3` | 22.3 | -41.2 | 20 |
| `music-B-tension-desertique.mp3` | 24.1 | -31.7 | 418 |

### Non retenues comme musique (nappes / boucles d'ambiance)

Comptees en SFX-ambiance, pas en musique : `ocean-cargo-ambient.mp3`, `sfx-music.mp3`,
`sfx-nuit-1/2/3.mp3`, `sfx-foule.mp3`, `chiptune-loop.mp3`, `sfx-ambient.mp3`.
Ce sont des textures d'ambiance, pas un score. Mesurees quand meme, au cas ou.

## INCERTAINS — aucun

Les 4 seuls fichiers que le nom et la duree ne suffisaient pas a trancher ont ete resolus par
**canaux + debit**, discriminant fiable sur ce corpus (narration ElevenLabs = **mono 128 kb/s** ;
musique Minimax = **stereo**, souvent 256 kb/s) :

| fichier | duree s | profil | verdict |
|---|---|---|---|
| `data-viz-explainer/setup.mp3` | 23.8 | mono 128k | NARRATION |
| `data-viz-explainer/reveal.mp3` | 18.4 | mono 128k | NARRATION |
| `brutalist-finance/setup.mp3` | 32.7 | mono 128k | NARRATION |
| `brutalist-finance/mecanisme.mp3` | 36.0 | mono 128k | NARRATION |

Controle : dans le meme dossier, `data-viz-explainer/bg-music.mp3` est **stereo** et
`hook.mp3` **mono 128k** — le discriminant separe bien les deux familles.

## INVENTAIRE COMPLET par dossier

`ampl5` en gras = le critere de decision. `bande voix` = RMS 200 Hz-2 kHz.

### `/Users/clawdbot/Workspace/remotion-cfa/public/_rnd/cfa-nuit1994`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `musique-episode.mp3` | 154 | -24.2 | **6.9** | 4.6 | -31.5 | -29.5 | 5.4 | **ancienne piste CFA, ECARTEE** · couture 5 dB |

### `public/_shared/audio/sahel-warmap/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-E-epic-orchestral.mp3` | 102 | -15.1 | **3.8** | 2.7 | -18.0 | -25.4 | 1.7 | — |
| `music-C-cordes-minimales.mp3` | 147 | -13.6 | **5.9** | 2.7 | -19.2 | -18.4 | 8.3 | couture 8 dB |
| `music-F-military-tendue.mp3` | 129 | -14.3 | **6.2** | 2.8 | -22.2 | -28.1 | 3.6 | — |
| `music-A-ostinato-grave.mp3` | 146 | -12.9 | **10.5** | 8.7 | -22.8 | -18.5 | 10.3 | couture 10 dB |
| `music-D-montee-maitrisee.mp3` | 538 | -13.7 | **20.8** | 8.7 | -31.0 | -26.5 | 12.2 | ampl forte · couture 12 dB |
| `music-B-tension-desertique.mp3` | 418 | -10.3 | **24.1** | 2.2 | -31.7 | -21.9 | 26.5 | ampl forte · couture 26 dB |

### `public/_shared/audio/soudan/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `soudan-music-B-kora-dundun.mp3` | 127 | -18.5 | **6.8** | 3.0 | -23.8 | -23.7 | 2.3 | — |
| `soudan-music-F-kora-ample.mp3` | 156 | -14.1 | **7.9** | 3.7 | -22.6 | -23.1 | 7.5 | couture 8 dB |
| `soudan-music-E-kora-melodique.mp3` | 143 | -15.3 | **8.3** | 3.3 | -24.2 | -23.3 | 10.4 | couture 10 dB |
| `soudan-music-C-percussion-tendue.mp3` | 162 | -17.1 | **8.7** | 4.3 | -25.4 | -24.6 | 1.7 | — |
| `soudan-music-D-kora-douce.mp3` | 373 | -14.9 | **9.2** | 5.5 | -23.7 | -20.7 | 19.5 | couture 20 dB |
| `soudan-music-A-ambient-grave.mp3` | 99 | -15.5 | **11.1** | 9.7 | -25.0 | -23.1 | 7.2 | couture 7 dB |

### `public/_shared/audio/soudan/music/_rejete-thriller`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `soudan-music-B-brut.mp3` | 38 | -22.4 | **2.9** | 2.9 | -26.6 | -29.7 | 25.6 | **REJETE realisateur** · couture 26 dB |
| `soudan-music-A-affine.mp3` | 125 | -11.9 | **7.3** | 4.4 | -18.6 | -18.9 | 4.3 | **REJETE realisateur** |

### `public/_shared/audio/sudan-warmap`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `score.mp3` | 22 | -11.8 | **1.3** | 1.0 | -12.9 | -24.3 | 0.9 | — |
| `score-long.mp3` | 32 | -11.2 | **1.8** | 1.4 | -12.9 | -24.0 | 1.6 | — |
| `score-epic.mp3` | 60 | -11.1 | **3.5** | 3.0 | -14.5 | -23.8 | 1.0 | — |

### `public/assets/geoafrique/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `historical-map-music.mp3` | 30 | -21.7 | **1.0** | 0.7 | -24.4 | -27.5 | 0.0 | — |
| `historical-map-music-minimax26-v2-30s.mp3` | 30 | -21.9 | **3.0** | 2.4 | -27.0 | -26.7 | 0.5 | — |
| `historical-map-music-minimax26.mp3` | 111 | -13.4 | **5.1** | 1.9 | -19.2 | -20.9 | 2.5 | — |
| `historical-map-music-minimax26-v2.mp3` | 279 | -12.6 | **14.9** | 12.0 | -27.0 | -17.5 | 12.1 | couture 12 dB |

### `public/atlas-shaka-zulu/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-ingoma.mp3` | 171 | -12.2 | **7.8** | 2.9 | -20.1 | -19.6 | 6.8 | couture 7 dB |
| `music-isicathamiya.mp3` | 430 | -12.8 | **10.0** | 6.7 | -22.4 | -17.9 | 4.1 | — |

### `public/atlas/peste-1347/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-c-desert.mp3` | 256 | -12.0 | **6.1** | 3.8 | -18.5 | -16.1 | 0.6 | — |
| `music-a-mande.mp3` | 127 | -12.1 | **10.1** | 7.5 | -22.2 | -15.5 | 18.8 | couture 19 dB |
| `music-b-tension.mp3` | 228 | -11.1 | **11.0** | 3.3 | -22.1 | -17.1 | 0.5 | — |

### `public/audio/abou-bakari/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `variante-C-epique-balafon-djembe.mp3` | 220 | -13.1 | **4.9** | 2.9 | -17.6 | -21.0 | 1.5 | — |
| `variante-A-royal-kora-balafon.mp3` | 158 | -11.8 | **5.8** | 4.3 | -16.9 | -17.5 | 3.2 | — |
| `variante-D-royal-sombre-kora.mp3` | 118 | -15.1 | **7.7** | 4.7 | -23.4 | -19.2 | 17.1 | couture 17 dB |
| `variante-B-mysterieux-kora-dundun.mp3` | 177 | -12.2 | **12.7** | 7.1 | -23.2 | -18.6 | 11.8 | couture 12 dB |
| `variante-E-royal-contemplatif-ngoni.mp3` | 232 | -13.6 | **14.7** | 9.3 | -26.0 | -21.2 | 6.3 | couture 6 dB |

### `public/audio/atlas-empire-ghana/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `v1-B-marche-or.mp3` | 217 | -12.4 | **5.4** | 2.1 | -18.2 | -18.2 | 2.3 | — |
| `v1-A-caravane-tuareg.mp3` | 159 | -12.5 | **6.4** | 3.7 | -17.9 | -19.7 | 4.4 | — |
| `v1-C-empire-or.mp3` | 127 | -17.0 | **14.9** | 8.3 | -31.6 | -21.8 | 17.6 | couture 18 dB |

### `public/audio/brutalist-finance`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `bg-music.mp3` | 30 | -13.3 | **4.9** | 4.6 | -17.2 | -21.7 | 5.5 | couture 6 dB |

### `public/audio/data-viz-explainer`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `bg-music.mp3` | 15 | -11.2 | **1.1** | 0.9 | -13.3 | -18.4 | 1.6 | — |

### `public/audio/ggw-muraille-verte/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `ambiance-raw.mp3` | 163 | -14.0 | **7.3** | 4.6 | -18.7 | -21.1 | 11.4 | couture 11 dB |

### `public/audio/peste-pixel`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music.mp3` | 30 | -11.7 | **4.4** | 2.7 | -17.7 | -15.7 | 16.1 | couture 16 dB |
| `hookbloca-luth.mp3` | 30 | -14.1 | **4.8** | 3.9 | -19.1 | -18.6 | 27.7 | couture 28 dB |

### `public/audio/silhouette-conte/ambiance`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `a1_savane.mp3` | 20 | -20.4 | **3.4** | 2.8 | -25.3 | -30.5 | 5.6 | couture 6 dB |
| `a4_aurore.mp3` | 20 | -15.1 | **3.4** | 3.0 | -19.7 | -21.9 | 2.1 | — |
| `a3_aube.mp3` | 20 | -15.3 | **8.3** | 6.0 | -25.7 | -20.2 | 8.1 | couture 8 dB |
| `a2_nuit.mp3` | 20 | -17.0 | **22.3** | 16.3 | -41.2 | -30.0 | 34.3 | ampl forte · couture 34 dB |

### `public/audio/sonjata-papercraft`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-toumani.mp3` | 157 | -16.4 | **11.5** | 6.5 | -26.3 | -21.8 | 5.7 | couture 6 dB |

### `public/audio/thiaroye-1944/music-variantes`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `variante-B-kora-ngoni.mp3` | 182 | -19.6 | **15.2** | 6.2 | -30.5 | -23.7 | 1.4 | ampl forte |
| `variante-A-balafon-dundun.mp3` | 346 | -13.1 | **15.4** | 3.9 | -28.6 | -20.9 | 3.3 | ampl forte |
| `variante-C-balafon-solo.mp3` | 170 | -12.3 | **19.4** | 12.0 | -31.0 | -18.4 | 28.2 | ampl forte · couture 28 dB |

### `public/audio/veilleur-ombre`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `ambiance_nuit.mp3` | 30 | -25.4 | **3.0** | 2.7 | -30.5 | -31.2 | 0.9 | — |

### `public/hannibal/audio/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `v1-A-marche-punique.mp3` | 60 | -11.9 | **11.1** | 9.6 | -21.5 | -19.5 | 9.0 | couture 9 dB |
| `v1-C-victoire-carthage.mp3` | 163 | -14.8 | **11.1** | 7.7 | -24.3 | -21.4 | 5.6 | couture 6 dB |
| `v1-B-alpes-tension.mp3` | 243 | -13.4 | **19.8** | 5.5 | -31.6 | -24.0 | 7.2 | ampl forte · couture 7 dB |

### `public/poc-money-legends/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-v1.mp3` | 163 | -15.7 | **7.7** | 4.5 | -23.7 | -20.6 | 4.0 | — |

### `public/souverain/cacao-chocolat-short/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `cacao-music-CHOISI.mp3` | 496 | -15.3 | **18.5** | 6.8 | -33.0 | -19.3 | 8.8 | ampl forte · couture 9 dB |

### `public/souverain/maroc-batteries/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-A-tension-industrielle.mp3` | 141 | -11.2 | **3.3** | 2.5 | -14.7 | -19.8 | 0.3 | — |
| `music-C-analytique-tendu.mp3` | 148 | -12.5 | **3.7** | 2.3 | -16.0 | -20.8 | 3.4 | — |
| `music-B-drive-maghrebin.mp3` | 217 | -10.2 | **13.0** | 3.8 | -22.2 | -19.3 | 7.3 | couture 7 dB |
| `music-B-gnawa-industriel.mp3` | 69 | -15.3 | **13.5** | 3.8 | -28.6 | -24.8 | 9.5 | couture 10 dB |
| `music-C-oud-analytique.mp3` | 184 | -12.8 | **15.2** | 2.7 | -29.0 | -16.5 | 2.5 | ampl forte |

### `public/souverain/niger-uranium/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-v1.mp3` | 219 | -11.1 | **4.7** | 2.3 | -16.7 | -18.0 | 4.8 | — |

### `public/souverain/or-africain/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-v1.mp3` | 163 | -15.7 | **7.7** | 4.5 | -23.7 | -20.6 | 4.0 | — |

### `public/souverain/senegal-petrole-gaz/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-A-ambient-souverain.mp3` | 321 | -13.0 | **5.9** | 4.0 | -18.2 | -18.7 | 2.5 | — |
| `music-C-sabar-cinematique.mp3` | 258 | -12.8 | **12.0** | 6.0 | -24.0 | -22.4 | 14.7 | couture 15 dB |
| `music-B-kora-percussion.mp3` | 184 | -13.2 | **14.2** | 3.0 | -26.6 | -19.9 | 2.6 | — |

### `public/souverain/silicon-savannah/audio/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-A.mp3` | 133 | -11.1 | **4.0** | 1.6 | -14.5 | -20.4 | 7.5 | couture 8 dB |
| `music-C.mp3` | 159 | -11.7 | **5.6** | 2.7 | -17.5 | -17.0 | 2.0 | — |
| `music-B.mp3` | 149 | -12.0 | **12.7** | 4.0 | -24.4 | -22.9 | 13.1 | couture 13 dB |

### `public/souverain/vraie-taille-afrique/audio`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-A-revelation.mp3` | 132 | -10.8 | **6.5** | 2.4 | -18.7 | -19.0 | 1.9 | — |
| `music-C-fierte.mp3` | 219 | -13.6 | **7.8** | 3.3 | -22.0 | -18.9 | 0.0 | — |
| `music-B-atlas.mp3` | 383 | -12.1 | **7.9** | 2.5 | -19.2 | -20.3 | 3.1 | — |

### `public/souverain/zimbabwe-lithium/audio/music`

| piste | duree s | LUFS | ampl5 | p90-p10 | plancher | bande voix | couture | note |
|---|---|---|---|---|---|---|---|---|
| `music-C-tension.mp3` | 256 | -12.0 | **6.1** | 3.8 | -18.5 | -16.1 | 0.6 | — |
| `music-A-contemplatif.mp3` | 127 | -12.1 | **10.1** | 7.5 | -22.2 | -15.5 | 18.8 | couture 19 dB |
| `music-B-geopolitique.mp3` | 228 | -11.1 | **11.0** | 3.3 | -22.1 | -17.1 | 0.5 | — |

---

Voir aussi `INDEX-MUSIQUES.md` (memes pistes, classees par famille + doublons binaires).
