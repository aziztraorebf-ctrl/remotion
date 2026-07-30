# INDEX DES MUSIQUES — source de verite unique

> Cree le 2026-07-29 sur consigne d'Aziz : **inventaire AVANT toute generation**.
> Motif : 71 fichiers musicaux existaient dans `public/` sans aucun index — « on a
> probablement deja la bonne piste, et on a paye plusieurs fois des variantes introuvables ».
> ⛔ **A CONSULTER AVANT TOUT APPEL Minimax/fal.ai.** Generer sans avoir lu ce fichier,
> c'est re-payer ce qu'on possede deja.

**71 fichiers · 67 pistes UNIQUES** (4 doublons binaires, cf section dediee).

## ⛔⛔ LA DUREE N'EST PAS UN CRITERE DE SELECTION (correction Aziz, 2026-07-29)

> **« La tres grande majorite des musiques generees via Minimax sont des musiques que l'on
> boucle en tant que telles. Donc le fait que ce ne soient pas des musiques qui vont au
> format long n'est pas discriminant. »**
>
> La 1re version de cet index classait sur `duree >= 249 s` et ne retenait que 12 pistes sur
> 67 : c'etait une **erreur de conception**. Une piste courte se BOUCLE, elle n'est pas
> disqualifiee. La duree est un **attribut** (elle dit combien de boucles il faudra), jamais
> un filtre. Exemple du cout de l'erreur : `soudan-music-B-kora-dundun` (127 s) etait exclue
> alors qu'elle a le **meilleur raccord de boucle de toute la banque** (0.1 dB).

## Les 3 mesures qui decident vraiment

| Colonne | Ce que c'est | Pourquoi ca decide |
|---|---|---|
| **ampl** | ecart p90-p10 du RMS par seconde | **> 15 dB = la piste plonge** -> trous audibles sous la narration. Vrai quelle que soit la duree. L'ancienne piste CFA (19 dB) a ete ecartee pour ca. |
| **bande** | RMS filtre **200 Hz-2 kHz** | C'est **la bande de la voix**. Plus c'est bas, mieux la narration passe. ⭐ Un RMS *global* correct ne garantit RIEN : voix et musique peuvent vivre dans la meme bande = **masquage frequentiel** (lecon CFA 2026-07-26). |
| **loop** | ecart de niveau tete(3s) <-> queue(3s) | ⭐ **LE critere pour une piste bouclee** : un gros ecart fait une **couture audible a chaque boucle**. < 2 dB = boucle presque transparente ; > 5 dB = `acrossfade` long obligatoire (l'ancienne piste CFA : 5.5 dB -> fade de 4 s). |
| duree | longueur reelle | **Pas un filtre.** Indique le nombre de boucles : 268 s d'episode / 127 s de piste = ~2 boucles. |

⚠️ Le **volume de mix est a RECALCULER pour chaque piste** (le `0.26` du CFA etait calibre pour
l'ancienne ; le defaut `0.07` de la doctrine aurait donne une musique inaudible). Toujours
verifier **par bande**, jamais en global.

## ⭐ Classement pour un FOND SOUS NARRATION (amplitude < 15 dB), meilleure boucle d'abord

Toutes utilisables, courtes comprises. `boucles` = combien il en faut pour 268 s.

| # | piste | famille | duree | boucles | ampl | bande | **loop** |
|---|---|---|---|---|---|---|---|
| 1 | `soudan-music-B-kora-dundun.mp3` | Afrique instr. | 127 s | 2.1x | 9.5 | -24.6 | **0.1 dB** |
| 2 | `music-C-fierte.mp3` | Epique/ample | 219 s | 1.2x | 8.0 | -19.4 | **0.1 dB** |
| 3 | `music-A-tension-industrielle.mp3` | Tension | 141 s | 1.9x | 7.1 | -21.4 | **0.5 dB** |
| 4 | `music-b-tension.mp3` | Tension | 228 s | 1.2x | 9.4 | -18.1 | **0.6 dB** |
| 5 | `music-B-geopolitique.mp3` ⚠️dup | Analytique/froid | 228 s | 1.2x | 9.4 | -18.1 | **0.6 dB** |
| 6 | `bg-music.mp3` | Analytique/froid | 15 s | 17.9x | 4.5 | -20.6 | **0.8 dB** |
| 7 | `historical-map-music.mp3` | Non classe | 30 s | 8.9x | 5.0 | -29.4 | **0.9 dB** |
| 8 | `music-c-desert.mp3` | Grave/desert | 256 s | 1.0x | 6.5 | -16.8 | **1.1 dB** |
| 9 | `music-C-tension.mp3` ⚠️dup | Tension | 256 s | 1.0x | 6.5 | -16.8 | **1.1 dB** |
| 10 | `music-C.mp3` | Non classe | 159 s | 1.7x | 4.5 | -17.5 | **1.2 dB** |
| 11 | `music-E-epic-orchestral.mp3` | Epique/ample | 102 s | 2.6x | 8.9 | -25.8 | **1.5 dB** |
| 12 | `variante-C-epique-balafon-djembe.mp3` | Afrique instr. | 220 s | 1.2x | 5.2 | -21.5 | **1.5 dB** |
| 13 | `variante-B-kora-ngoni.mp3` | Afrique instr. | 182 s | 1.5x | 10.0 | -24.5 | **1.6 dB** |
| 14 | `soudan-music-C-percussion-tendue.mp3` | Tension | 162 s | 1.7x | 9.1 | -25.3 | **1.8 dB** |
| 15 | `ambiance_nuit.mp3` | Ambient/nappe | 30 s | 8.9x | 12.9 | -33.0 | **1.9 dB** |
| 16 | `music-A-ambient-souverain.mp3` | Ambient/nappe | 321 s | 0.8x | 6.9 | -19.4 | **2.0 dB** |
| 17 | `v1-B-marche-or.mp3` | Epique/ample | 217 s | 1.2x | 4.4 | -18.5 | **2.4 dB** |
| 18 | `historical-map-music-minimax26.mp3` | Non classe | 111 s | 2.4x | 4.4 | -21.4 | **2.6 dB** |
| 19 | `music-C-oud-analytique.mp3` | Analytique/froid | 184 s | 1.5x | 8.2 | -16.9 | **2.8 dB** |
| 20 | `music-C-analytique-tendu.mp3` | Tension | 148 s | 1.8x | 10.2 | -22.5 | **3.2 dB** |
| 21 | `music-v1.mp3` | Non classe | 163 s | 1.6x | 5.4 | -21.5 | **3.4 dB** |
| 22 | `music-v1.mp3` ⚠️dup | Non classe | 163 s | 1.6x | 5.4 | -21.5 | **3.4 dB** |
| 23 | `variante-A-royal-kora-balafon.mp3` | Afrique instr. | 158 s | 1.7x | 7.8 | -18.8 | **3.6 dB** |
| 24 | `music-A-revelation.mp3` | Non classe | 132 s | 2.0x | 7.4 | -20.7 | **3.6 dB** |
| 25 | `variante-A-balafon-dundun.mp3` | Afrique instr. | 346 s | 0.8x | 8.5 | -21.4 | **3.7 dB** |
| 26 | `v1-A-caravane-tuareg.mp3` | Afrique instr. | 159 s | 1.7x | 10.8 | -20.7 | **3.9 dB** |
| 27 | `music-B-kora-percussion.mp3` | Afrique instr. | 184 s | 1.5x | 12.7 | -20.6 | **3.9 dB** |
| 28 | `music-v1.mp3` | Non classe | 219 s | 1.2x | 7.3 | -19.5 | **4.0 dB** |
| 29 | `music-B-atlas.mp3` | Non classe | 383 s | 0.7x | 6.2 | -21.3 | **4.0 dB** |
| 30 | `a1_savane.mp3` | Ambient/nappe | 20 s | 13.4x | 13.1 | -32.0 | **5.2 dB** |
| 31 | `bg-music.mp3` | Analytique/froid | 30 s | 8.9x | 9.2 | -24.1 | **5.4 dB** |
| 32 | `music-toumani.mp3` | Afrique instr. | 157 s | 1.7x | 10.0 | -22.4 | **5.7 dB** |
| 33 | `music-A.mp3` | Non classe | 133 s | 2.0x | 3.8 | -21.4 | **5.7 dB** |
| 34 | `v1-C-victoire-carthage.mp3` | Epique/ample | 163 s | 1.6x | 10.5 | -22.5 | **5.9 dB** |
| 35 | `music-isicathamiya.mp3` | Afrique instr. | 430 s | 0.6x | 8.5 | -18.6 | **6.0 dB** |
| 36 | `soudan-music-A-ambient-grave.mp3` | Ambient/nappe | 99 s | 2.7x | 12.1 | -23.9 | **7.3 dB** |
| 37 | `soudan-music-F-kora-ample.mp3` | Afrique instr. | 156 s | 1.7x | 10.5 | -23.5 | **7.7 dB** |
| 38 | `cacao-music-CHOISI.mp3` | Tension | 496 s | 0.5x | 8.9 | -20.8 | **7.7 dB** |
| 39 | `music-C-cordes-minimales.mp3` | Ambient/nappe | 147 s | 1.8x | 6.6 | -19.2 | **8.1 dB** |
| 40 | `music-ingoma.mp3` | Afrique instr. | 171 s | 1.6x | 8.1 | -20.4 | **8.4 dB** |
| 41 | `v1-A-marche-punique.mp3` | Epique/ample | 60 s | 4.5x | 11.8 | -20.0 | **8.6 dB** |
| 42 | `music-B-drive-maghrebin.mp3` | Non classe | 217 s | 1.2x | 9.0 | -20.9 | **9.6 dB** |
| 43 | `music-A-ostinato-grave.mp3` | Grave/desert | 146 s | 1.8x | 9.4 | -19.2 | **9.9 dB** |
| 44 | `ambiance-raw.mp3` | Ambient/nappe | 163 s | 1.6x | 8.6 | -22.1 | **10.2 dB** |
| 45 | `variante-B-mysterieux-kora-dundun.mp3` | Afrique instr. | 177 s | 1.5x | 14.1 | -22.6 | **11.5 dB** |
| 46 | `historical-map-music-minimax26-v2.mp3` | Non classe | 279 s | 1.0x | 11.8 | -17.9 | **11.9 dB** |
| 47 | `music-D-montee-maitrisee.mp3` | Non classe | 539 s | 0.5x | 10.0 | -27.1 | **12.1 dB** |
| 48 | `a3_aube.mp3` | Ambient/nappe | 20 s | 13.4x | 13.4 | -21.6 | **12.3 dB** |
| 49 | `soudan-music-E-kora-melodique.mp3` | Afrique instr. | 143 s | 1.9x | 10.5 | -24.0 | **13.0 dB** |
| 50 | `music-B.mp3` | Non classe | 149 s | 1.8x | 11.3 | -23.4 | **13.4 dB** |
| 51 | `music.mp3` | Non classe | 30 s | 8.9x | 4.3 | -15.7 | **15.8 dB** |
| 52 | `music-C-sabar-cinematique.mp3` | Afrique instr. | 258 s | 1.0x | 10.4 | -22.7 | **17.2 dB** |
| 53 | `variante-D-royal-sombre-kora.mp3` | Afrique instr. | 118 s | 2.3x | 9.6 | -19.5 | **17.6 dB** |
| 54 | `v1-C-empire-or.mp3` | Epique/ample | 127 s | 2.1x | 14.9 | -23.4 | **18.7 dB** |
| 55 | `soudan-music-D-kora-douce.mp3` | Afrique instr. | 373 s | 0.7x | 6.5 | -22.1 | **19.0 dB** |
| 56 | `music-a-mande.mp3` | Afrique instr. | 127 s | 2.1x | 10.6 | -16.5 | **19.7 dB** |
| 57 | `music-A-contemplatif.mp3` ⚠️dup | Ambient/nappe | 127 s | 2.1x | 10.6 | -16.5 | **19.7 dB** |
| 58 | `music-B-tension-desertique.mp3` | Tension | 418 s | 0.6x | 5.0 | -22.4 | **28.4 dB** |

## Par FAMILLE (classification provisoire, deduite des NOMS — a affiner a l'ecoute)

⚠️ Ces familles viennent du **nom de fichier**, pas d'une analyse du contenu. Elles aident a
degrossir, elles ne remplacent pas l'ecoute. Chantier ouvert (cf. section suivante).

### Afrique instr. (20)

- `soudan-music-B-kora-dundun.mp3` — 127 s · ampl 9.5 · bande -24.6 · loop 0.1 dB
- `variante-C-epique-balafon-djembe.mp3` — 220 s · ampl 5.2 · bande -21.5 · loop 1.5 dB
- `variante-B-kora-ngoni.mp3` — 182 s · ampl 10.0 · bande -24.5 · loop 1.6 dB
- `variante-A-royal-kora-balafon.mp3` — 158 s · ampl 7.8 · bande -18.8 · loop 3.6 dB
- `variante-A-balafon-dundun.mp3` — 346 s · ampl 8.5 · bande -21.4 · loop 3.7 dB
- `v1-A-caravane-tuareg.mp3` — 159 s · ampl 10.8 · bande -20.7 · loop 3.9 dB
- `music-B-kora-percussion.mp3` — 184 s · ampl 12.7 · bande -20.6 · loop 3.9 dB
- `music-toumani.mp3` — 157 s · ampl 10.0 · bande -22.4 · loop 5.7 dB
- `music-isicathamiya.mp3` — 430 s · ampl 8.5 · bande -18.6 · loop 6.0 dB
- `variante-E-royal-contemplatif-ngoni.mp3` — 232 s · ampl 15.2 · bande -21.7 · loop 6.5 dB
- `music-B-gnawa-industriel.mp3` — 69 s · ampl 24.6 · bande -25.5 · loop 7.0 dB
- `soudan-music-F-kora-ample.mp3` — 156 s · ampl 10.5 · bande -23.5 · loop 7.7 dB
- `music-ingoma.mp3` — 171 s · ampl 8.1 · bande -20.4 · loop 8.4 dB
- `variante-B-mysterieux-kora-dundun.mp3` — 177 s · ampl 14.1 · bande -22.6 · loop 11.5 dB
- `soudan-music-E-kora-melodique.mp3` — 143 s · ampl 10.5 · bande -24.0 · loop 13.0 dB
- `music-C-sabar-cinematique.mp3` — 258 s · ampl 10.4 · bande -22.7 · loop 17.2 dB
- `variante-D-royal-sombre-kora.mp3` — 118 s · ampl 9.6 · bande -19.5 · loop 17.6 dB
- `soudan-music-D-kora-douce.mp3` — 373 s · ampl 6.5 · bande -22.1 · loop 19.0 dB
- `music-a-mande.mp3` — 127 s · ampl 10.6 · bande -16.5 · loop 19.7 dB
- `variante-C-balafon-solo.mp3` — 170 s · ampl 18.4 · bande -18.8 · loop 28.1 dB

### Ambient/nappe (10)

- `ambiance_nuit.mp3` — 30 s · ampl 12.9 · bande -33.0 · loop 1.9 dB
- `music-A-ambient-souverain.mp3` — 321 s · ampl 6.9 · bande -19.4 · loop 2.0 dB
- `a4_aurore.mp3` — 20 s · ampl 17.0 · bande -23.0 · loop 2.3 dB
- `a1_savane.mp3` — 20 s · ampl 13.1 · bande -32.0 · loop 5.2 dB
- `soudan-music-A-ambient-grave.mp3` — 99 s · ampl 12.1 · bande -23.9 · loop 7.3 dB
- `music-C-cordes-minimales.mp3` — 147 s · ampl 6.6 · bande -19.2 · loop 8.1 dB
- `ambiance-raw.mp3` — 163 s · ampl 8.6 · bande -22.1 · loop 10.2 dB
- `a3_aube.mp3` — 20 s · ampl 13.4 · bande -21.6 · loop 12.3 dB
- `music-A-contemplatif.mp3` — 127 s · ampl 10.6 · bande -16.5 · loop 19.7 dB
- `a2_nuit.mp3` — 20 s · ampl 44.0 · bande -31.4 · loop 42.8 dB

### Analytique/froid (4)

- `music-B-geopolitique.mp3` — 228 s · ampl 9.4 · bande -18.1 · loop 0.6 dB
- `bg-music.mp3` — 15 s · ampl 4.5 · bande -20.6 · loop 0.8 dB
- `music-C-oud-analytique.mp3` — 184 s · ampl 8.2 · bande -16.9 · loop 2.8 dB
- `bg-music.mp3` — 30 s · ampl 9.2 · bande -24.1 · loop 5.4 dB

### Epique/ample (7)

- `music-C-fierte.mp3` — 219 s · ampl 8.0 · bande -19.4 · loop 0.1 dB
- `score-epic.mp3` — 60 s · ampl 29.0 · bande -23.8 · loop 1.0 dB
- `music-E-epic-orchestral.mp3` — 102 s · ampl 8.9 · bande -25.8 · loop 1.5 dB
- `v1-B-marche-or.mp3` — 217 s · ampl 4.4 · bande -18.5 · loop 2.4 dB
- `v1-C-victoire-carthage.mp3` — 163 s · ampl 10.5 · bande -22.5 · loop 5.9 dB
- `v1-A-marche-punique.mp3` — 60 s · ampl 11.8 · bande -20.0 · loop 8.6 dB
- `v1-C-empire-or.mp3` — 127 s · ampl 14.9 · bande -23.4 · loop 18.7 dB

### Grave/desert (2)

- `music-c-desert.mp3` — 256 s · ampl 6.5 · bande -16.8 · loop 1.1 dB
- `music-A-ostinato-grave.mp3` — 146 s · ampl 9.4 · bande -19.2 · loop 9.9 dB

### Non classe (17)

- `historical-map-music-minimax26-v2-30s.mp3` — 30 s · ampl 15.4 · bande -27.0 · loop 0.5 dB
- `score.mp3` — 22 s · ampl 19.2 · bande -24.3 · loop 0.9 dB
- `historical-map-music.mp3` — 30 s · ampl 5.0 · bande -29.4 · loop 0.9 dB
- `music-C.mp3` — 159 s · ampl 4.5 · bande -17.5 · loop 1.2 dB
- `score-long.mp3` — 32 s · ampl 29.0 · bande -24.1 · loop 1.7 dB
- `historical-map-music-minimax26.mp3` — 111 s · ampl 4.4 · bande -21.4 · loop 2.6 dB
- `music-v1.mp3` — 163 s · ampl 5.4 · bande -21.5 · loop 3.4 dB
- `music-v1.mp3` — 163 s · ampl 5.4 · bande -21.5 · loop 3.4 dB
- `music-A-revelation.mp3` — 132 s · ampl 7.4 · bande -20.7 · loop 3.6 dB
- `music-v1.mp3` — 219 s · ampl 7.3 · bande -19.5 · loop 4.0 dB
- `music-B-atlas.mp3` — 383 s · ampl 6.2 · bande -21.3 · loop 4.0 dB
- `music-A.mp3` — 133 s · ampl 3.8 · bande -21.4 · loop 5.7 dB
- `music-B-drive-maghrebin.mp3` — 217 s · ampl 9.0 · bande -20.9 · loop 9.6 dB
- `historical-map-music-minimax26-v2.mp3` — 279 s · ampl 11.8 · bande -17.9 · loop 11.9 dB
- `music-D-montee-maitrisee.mp3` — 539 s · ampl 10.0 · bande -27.1 · loop 12.1 dB
- `music-B.mp3` — 149 s · ampl 11.3 · bande -23.4 · loop 13.4 dB
- `music.mp3` — 30 s · ampl 4.3 · bande -15.7 · loop 15.8 dB

### Tension (9)

- `music-A-tension-industrielle.mp3` — 141 s · ampl 7.1 · bande -21.4 · loop 0.5 dB
- `music-b-tension.mp3` — 228 s · ampl 9.4 · bande -18.1 · loop 0.6 dB
- `music-C-tension.mp3` — 256 s · ampl 6.5 · bande -16.8 · loop 1.1 dB
- `soudan-music-C-percussion-tendue.mp3` — 162 s · ampl 9.1 · bande -25.3 · loop 1.8 dB
- `music-C-analytique-tendu.mp3` — 148 s · ampl 10.2 · bande -22.5 · loop 3.2 dB
- `music-F-military-tendue.mp3` — 129 s · ampl 18.9 · bande -28.2 · loop 3.7 dB
- `v1-B-alpes-tension.mp3` — 243 s · ampl 15.4 · bande -24.5 · loop 6.2 dB
- `cacao-music-CHOISI.mp3` — 496 s · ampl 8.9 · bande -20.8 · loop 7.7 dB
- `music-B-tension-desertique.mp3` — 418 s · ampl 5.0 · bande -22.4 · loop 28.4 dB

## 🚧 CHANTIER OUVERT — la vraie classification (Aziz, 2026-07-29)

> **« Le veritable defi sera peut-etre la classification et l'organisation. »**

Ce qui manque encore, et qui ne se deduit PAS d'un nom de fichier :
- **le registre reel** (tempo, instrumentation, densite) — demande une analyse du signal ou une ecoute ;
- **l'usage narratif** : sous quel type de beat cette piste marche (hook / demonstration / climax / chute) ;
- **le lien piste <-> episode ou elle a DEJA servi** (evite de reutiliser la signature d'un autre film) ;
- **un moyen d'ECOUTER plusieurs pistes d'affilee** : uploader un lot vers Vercel Blob + une page
  d'ecoute comparative. Aziz : « je pense que ce n'est pas non plus le plus complexe » — a faire.

## Toutes les pistes (inventaire brut)

| piste | duree | ampl | bande | loop | rms | chemin |
|---|---|---|---|---|---|---|
| `music-A-ostinato-grave.mp3` | 146 s | 9.4 | -19.2 | 9.9 | -16.6 | `public/_shared/audio/sahel-warmap/music/music-A-ostinato-grave.mp3` |
| `music-B-tension-desertique.mp3` | 418 s | 5.0 | -22.4 | 28.4 | -10.2 | `public/_shared/audio/sahel-warmap/music/music-B-tension-desertique.mp3` |
| `music-C-cordes-minimales.mp3` | 147 s | 6.6 | -19.2 | 8.1 | -16.2 | `public/_shared/audio/sahel-warmap/music/music-C-cordes-minimales.mp3` |
| `music-D-montee-maitrisee.mp3` | 539 s | 10.0 | -27.1 | 12.1 | -13.5 | `public/_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3` |
| `music-E-epic-orchestral.mp3` | 102 s | 8.9 | -25.8 | 1.5 | -16.3 | `public/_shared/audio/sahel-warmap/music/music-E-epic-orchestral.mp3` |
| `music-F-military-tendue.mp3` | 129 s | 18.9 | -28.2 | 3.7 | -17.6 | `public/_shared/audio/sahel-warmap/music/music-F-military-tendue.mp3` |
| `soudan-music-A-affine.mp3` ⛔REJETE | 125 s | 7.9 | -20.0 | 5.3 | -13.9 | `public/_shared/audio/soudan/music/_rejete-thriller/soudan-music-A-affine.mp3` |
| `soudan-music-B-brut.mp3` ⛔REJETE | 37 s | 5.8 | -31.0 | 25.6 | -26.4 | `public/_shared/audio/soudan/music/_rejete-thriller/soudan-music-B-brut.mp3` |
| `soudan-music-A-ambient-grave.mp3` | 99 s | 12.1 | -23.9 | 7.3 | -17.5 | `public/_shared/audio/soudan/music/soudan-music-A-ambient-grave.mp3` |
| `soudan-music-B-kora-dundun.mp3` | 127 s | 9.5 | -24.6 | 0.1 | -20.3 | `public/_shared/audio/soudan/music/soudan-music-B-kora-dundun.mp3` |
| `soudan-music-C-percussion-tendue.mp3` | 162 s | 9.1 | -25.3 | 1.8 | -20.3 | `public/_shared/audio/soudan/music/soudan-music-C-percussion-tendue.mp3` |
| `soudan-music-D-kora-douce.mp3` | 373 s | 6.5 | -22.1 | 19.0 | -18.4 | `public/_shared/audio/soudan/music/soudan-music-D-kora-douce.mp3` |
| `soudan-music-E-kora-melodique.mp3` | 143 s | 10.5 | -24.0 | 13.0 | -19.3 | `public/_shared/audio/soudan/music/soudan-music-E-kora-melodique.mp3` |
| `soudan-music-F-kora-ample.mp3` | 156 s | 10.5 | -23.5 | 7.7 | -17.4 | `public/_shared/audio/soudan/music/soudan-music-F-kora-ample.mp3` |
| `score-epic.mp3` | 60 s | 29.0 | -23.8 | 1.0 | -12.3 | `public/_shared/audio/sudan-warmap/score-epic.mp3` |
| `score-long.mp3` | 32 s | 29.0 | -24.1 | 1.7 | -12.3 | `public/_shared/audio/sudan-warmap/score-long.mp3` |
| `score.mp3` | 22 s | 19.2 | -24.3 | 0.9 | -12.7 | `public/_shared/audio/sudan-warmap/score.mp3` |
| `historical-map-music-minimax26-v2-30s.mp3` | 30 s | 15.4 | -27.0 | 0.5 | -25.6 | `public/assets/geoafrique/audio/historical-map-music-minimax26-v2-30s.mp3` |
| `historical-map-music-minimax26-v2.mp3` | 279 s | 11.8 | -17.9 | 11.9 | -16.6 | `public/assets/geoafrique/audio/historical-map-music-minimax26-v2.mp3` |
| `historical-map-music-minimax26.mp3` | 111 s | 4.4 | -21.4 | 2.6 | -15.4 | `public/assets/geoafrique/audio/historical-map-music-minimax26.mp3` |
| `historical-map-music.mp3` | 30 s | 5.0 | -29.4 | 0.9 | -25.9 | `public/assets/geoafrique/audio/historical-map-music.mp3` |
| `music-ingoma.mp3` | 171 s | 8.1 | -20.4 | 8.4 | -14.7 | `public/atlas-shaka-zulu/audio/music-ingoma.mp3` |
| `music-isicathamiya.mp3` | 430 s | 8.5 | -18.6 | 6.0 | -16.1 | `public/atlas-shaka-zulu/audio/music-isicathamiya.mp3` |
| `music-a-mande.mp3` | 127 s | 10.6 | -16.5 | 19.7 | -15.9 | `public/atlas/peste-1347/audio/music-a-mande.mp3` |
| `music-b-tension.mp3` | 228 s | 9.4 | -18.1 | 0.6 | -14.6 | `public/atlas/peste-1347/audio/music-b-tension.mp3` |
| `music-c-desert.mp3` | 256 s | 6.5 | -16.8 | 1.1 | -16.2 | `public/atlas/peste-1347/audio/music-c-desert.mp3` |
| `variante-A-royal-kora-balafon.mp3` | 158 s | 7.8 | -18.8 | 3.6 | -13.6 | `public/audio/abou-bakari/music/variante-A-royal-kora-balafon.mp3` |
| `variante-B-mysterieux-kora-dundun.mp3` | 177 s | 14.1 | -22.6 | 11.5 | -15.6 | `public/audio/abou-bakari/music/variante-B-mysterieux-kora-dundun.mp3` |
| `variante-C-epique-balafon-djembe.mp3` | 220 s | 5.2 | -21.5 | 1.5 | -15.1 | `public/audio/abou-bakari/music/variante-C-epique-balafon-djembe.mp3` |
| `variante-D-royal-sombre-kora.mp3` | 118 s | 9.6 | -19.5 | 17.6 | -18.8 | `public/audio/abou-bakari/music/variante-D-royal-sombre-kora.mp3` |
| `variante-E-royal-contemplatif-ngoni.mp3` | 232 s | 15.2 | -21.7 | 6.5 | -16.4 | `public/audio/abou-bakari/music/variante-E-royal-contemplatif-ngoni.mp3` |
| `v1-A-caravane-tuareg.mp3` | 159 s | 10.8 | -20.7 | 3.9 | -15.1 | `public/audio/atlas-empire-ghana/music/v1-A-caravane-tuareg.mp3` |
| `v1-B-marche-or.mp3` | 217 s | 4.4 | -18.5 | 2.4 | -14.3 | `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3` |
| `v1-C-empire-or.mp3` | 127 s | 14.9 | -23.4 | 18.7 | -21.6 | `public/audio/atlas-empire-ghana/music/v1-C-empire-or.mp3` |
| `bg-music.mp3` | 30 s | 9.2 | -24.1 | 5.4 | -14.2 | `public/audio/brutalist-finance/bg-music.mp3` |
| `bg-music.mp3` | 15 s | 4.5 | -20.6 | 0.8 | -15.0 | `public/audio/data-viz-explainer/bg-music.mp3` |
| `ambiance-raw.mp3` | 163 s | 8.6 | -22.1 | 10.2 | -15.2 | `public/audio/ggw-muraille-verte/music/ambiance-raw.mp3` |
| `music.mp3` | 30 s | 4.3 | -15.7 | 15.8 | -14.2 | `public/audio/peste-pixel/music.mp3` |
| `a1_savane.mp3` | 20 s | 13.1 | -32.0 | 5.2 | -27.7 | `public/audio/silhouette-conte/ambiance/a1_savane.mp3` |
| `a2_nuit.mp3` | 20 s | 44.0 | -31.4 | 42.8 | -22.8 | `public/audio/silhouette-conte/ambiance/a2_nuit.mp3` |
| `a3_aube.mp3` | 20 s | 13.4 | -21.6 | 12.3 | -20.6 | `public/audio/silhouette-conte/ambiance/a3_aube.mp3` |
| `a4_aurore.mp3` | 20 s | 17.0 | -23.0 | 2.3 | -18.7 | `public/audio/silhouette-conte/ambiance/a4_aurore.mp3` |
| `music-toumani.mp3` | 157 s | 10.0 | -22.4 | 5.7 | -19.3 | `public/audio/sonjata-papercraft/music-toumani.mp3` |
| `variante-A-balafon-dundun.mp3` | 346 s | 8.5 | -21.4 | 3.7 | -16.3 | `public/audio/thiaroye-1944/music-variantes/variante-A-balafon-dundun.mp3` |
| `variante-B-kora-ngoni.mp3` | 182 s | 10.0 | -24.5 | 1.6 | -23.0 | `public/audio/thiaroye-1944/music-variantes/variante-B-kora-ngoni.mp3` |
| `variante-C-balafon-solo.mp3` | 170 s | 18.4 | -18.8 | 28.1 | -15.1 | `public/audio/thiaroye-1944/music-variantes/variante-C-balafon-solo.mp3` |
| `ambiance_nuit.mp3` | 30 s | 12.9 | -33.0 | 1.9 | -32.2 | `public/audio/veilleur-ombre/ambiance_nuit.mp3` |
| `v1-A-marche-punique.mp3` | 60 s | 11.8 | -20.0 | 8.6 | -13.9 | `public/hannibal/audio/music/v1-A-marche-punique.mp3` |
| `v1-B-alpes-tension.mp3` | 243 s | 15.4 | -24.5 | 6.2 | -15.0 | `public/hannibal/audio/music/v1-B-alpes-tension.mp3` |
| `v1-C-victoire-carthage.mp3` | 163 s | 10.5 | -22.5 | 5.9 | -17.6 | `public/hannibal/audio/music/v1-C-victoire-carthage.mp3` |
| `music-v1.mp3` | 163 s | 5.4 | -21.5 | 3.4 | -19.5 | `public/poc-money-legends/audio/music-v1.mp3` |
| `cacao-music-CHOISI.mp3` | 496 s | 8.9 | -20.8 | 7.7 | -19.4 | `public/souverain/cacao-chocolat-short/audio/cacao-music-CHOISI.mp3` |
| `music-A-tension-industrielle.mp3` | 141 s | 7.1 | -21.4 | 0.5 | -13.4 | `public/souverain/maroc-batteries/audio/music-A-tension-industrielle.mp3` |
| `music-B-drive-maghrebin.mp3` | 217 s | 9.0 | -20.9 | 9.6 | -11.9 | `public/souverain/maroc-batteries/audio/music-B-drive-maghrebin.mp3` |
| `music-B-gnawa-industriel.mp3` | 69 s | 24.6 | -25.5 | 7.0 | -19.1 | `public/souverain/maroc-batteries/audio/music-B-gnawa-industriel.mp3` |
| `music-C-analytique-tendu.mp3` | 148 s | 10.2 | -22.5 | 3.2 | -14.2 | `public/souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3` |
| `music-C-oud-analytique.mp3` | 184 s | 8.2 | -16.9 | 2.8 | -16.3 | `public/souverain/maroc-batteries/audio/music-C-oud-analytique.mp3` |
| `music-v1.mp3` | 219 s | 7.3 | -19.5 | 4.0 | -14.3 | `public/souverain/niger-uranium/audio/music-v1.mp3` |
| `music-v1.mp3` ⚠️dup | 163 s | 5.4 | -21.5 | 3.4 | -19.5 | `public/souverain/or-africain/audio/music-v1.mp3` |
| `music-A-ambient-souverain.mp3` | 321 s | 6.9 | -19.4 | 2.0 | -15.6 | `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3` |
| `music-B-kora-percussion.mp3` | 184 s | 12.7 | -20.6 | 3.9 | -14.9 | `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3` |
| `music-C-sabar-cinematique.mp3` | 258 s | 10.4 | -22.7 | 17.2 | -14.6 | `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3` |
| `music-A.mp3` | 133 s | 3.8 | -21.4 | 5.7 | -12.1 | `public/souverain/silicon-savannah/audio/music/music-A.mp3` |
| `music-B.mp3` | 149 s | 11.3 | -23.4 | 13.4 | -13.4 | `public/souverain/silicon-savannah/audio/music/music-B.mp3` |
| `music-C.mp3` | 159 s | 4.5 | -17.5 | 1.2 | -14.5 | `public/souverain/silicon-savannah/audio/music/music-C.mp3` |
| `music-A-revelation.mp3` | 132 s | 7.4 | -20.7 | 3.6 | -15.1 | `public/souverain/vraie-taille-afrique/audio/music-A-revelation.mp3` |
| `music-B-atlas.mp3` | 383 s | 6.2 | -21.3 | 4.0 | -14.3 | `public/souverain/vraie-taille-afrique/audio/music-B-atlas.mp3` |
| `music-C-fierte.mp3` | 219 s | 8.0 | -19.4 | 0.1 | -16.6 | `public/souverain/vraie-taille-afrique/audio/music-C-fierte.mp3` |
| `music-A-contemplatif.mp3` ⚠️dup | 127 s | 10.6 | -16.5 | 19.7 | -15.9 | `public/souverain/zimbabwe-lithium/audio/music/music-A-contemplatif.mp3` |
| `music-B-geopolitique.mp3` ⚠️dup | 228 s | 9.4 | -18.1 | 0.6 | -14.6 | `public/souverain/zimbabwe-lithium/audio/music/music-B-geopolitique.mp3` |
| `music-C-tension.mp3` ⚠️dup | 256 s | 6.5 | -16.8 | 1.1 | -16.2 | `public/souverain/zimbabwe-lithium/audio/music/music-C-tension.mp3` |

## ⚠️ Doublons binaires exacts (meme fichier, noms differents)

Preuve concrete du gaspillage que cet index doit stopper.

- **2 copies** (4.1 Mo) :
  - `public/atlas/peste-1347/audio/music-a-mande.mp3`
  - `public/souverain/zimbabwe-lithium/audio/music/music-A-contemplatif.mp3`
- **2 copies** (7.3 Mo) :
  - `public/atlas/peste-1347/audio/music-b-tension.mp3`
  - `public/souverain/zimbabwe-lithium/audio/music/music-B-geopolitique.mp3`
- **2 copies** (8.2 Mo) :
  - `public/atlas/peste-1347/audio/music-c-desert.mp3`
  - `public/souverain/zimbabwe-lithium/audio/music/music-C-tension.mp3`
- **2 copies** (5.2 Mo) :
  - `public/poc-money-legends/audio/music-v1.mp3`
  - `public/souverain/or-africain/audio/music-v1.mp3`

**24.8 Mo dupliques.** Ne pas supprimer sans `grep -r` prealable (du code peut pointer dessus).

## ⛔ Ecarte d'office

- `public/_shared/audio/soudan/music/_rejete-thriller/` — **deja refuse par Aziz**, ne jamais ressortir.
- Amplitude >= 15 dB pour un fond sous narration (trous audibles). Reste utilisable en pleine bande sans voix.

