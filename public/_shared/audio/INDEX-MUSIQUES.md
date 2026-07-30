# INDEX DES MUSIQUES — source de verite unique

> Cree le 2026-07-29 sur consigne d'Aziz : **inventaire AVANT toute generation**.
> Motif : 71 fichiers musicaux existaient dans `public/` sans aucun index — « on a
> probablement deja la bonne piste, et on a paye plusieurs fois des variantes introuvables ».
> ⛔ **A CONSULTER AVANT TOUT APPEL Minimax/fal.ai.** Generer une piste sans avoir lu ce
> fichier, c'est re-payer ce qu'on possede.

**71 fichiers · 67 pistes UNIQUES** (4 doublons binaires exacts, cf section dediee).

## Comment lire les mesures (et pourquoi ce sont celles-la)

| Colonne | Ce que c'est | Pourquoi ca decide |
|---|---|---|
| **duree** | longueur reelle | >= 249 s couvre un mid-form (fenetre 19.5->268 s) **sans boucle**. Plus court = `acrossfade` obligatoire, donc risque de couture audible. |
| **ampl** | ecart p90-p10 du RMS par seconde | **> 15 dB = la piste plonge** -> trous audibles sous la narration. L'ancienne piste de l'episode CFA (19 dB) a ete ecartee pour ca. |
| **bande** | RMS filtre **200 Hz-2 kHz** | C'est **la bande de la voix**. Plus c'est bas, mieux la narration passe. ⭐ Une mesure RMS *globale* correcte ne garantit RIEN : voix et musique peuvent vivre dans la meme bande = **masquage frequentiel** (lecon CFA 2026-07-26). |
| **rms** | niveau global | Indicatif seulement. Ne jamais decider dessus seul. |

⚠️ Le **volume de mix est a RECALCULER pour chaque piste** (le `0.26` du CFA etait calibre pour
l'ancienne piste ; le defaut `0.07` de la doctrine aurait donne une musique inaudible).
Toujours verifier **par bande**, jamais en global.

## ⭐ Pistes longues ET stables (>= 249 s, amplitude < 15 dB)

Les seules utilisables **telles quelles sur un mid-form**, sans boucle ni retouche.
Triees par bande de voix la plus basse = la narration passe le mieux en haut de tableau.

| # | piste | duree | ampl | bande | chemin |
|---|---|---|---|---|---|
| 1 | `music-D-montee-maitrisee.mp3` | 539 s | 10.0 dB | **-27.1 dB** | `public/_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3` |
| 2 | `music-C-sabar-cinematique.mp3` | 258 s | 10.4 dB | **-22.7 dB** | `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3` |
| 3 | `music-B-tension-desertique.mp3` | 418 s | 5.0 dB | **-22.4 dB** | `public/_shared/audio/sahel-warmap/music/music-B-tension-desertique.mp3` |
| 4 | `soudan-music-D-kora-douce.mp3` | 373 s | 6.5 dB | **-22.1 dB** | `public/_shared/audio/soudan/music/soudan-music-D-kora-douce.mp3` |
| 5 | `variante-A-balafon-dundun.mp3` | 346 s | 8.5 dB | **-21.4 dB** | `public/audio/thiaroye-1944/music-variantes/variante-A-balafon-dundun.mp3` |
| 6 | `music-B-atlas.mp3` | 383 s | 6.2 dB | **-21.3 dB** | `public/souverain/vraie-taille-afrique/audio/music-B-atlas.mp3` |
| 7 | `cacao-music-CHOISI.mp3` | 496 s | 8.9 dB | **-20.8 dB** | `public/souverain/cacao-chocolat-short/audio/cacao-music-CHOISI.mp3` |
| 8 | `music-A-ambient-souverain.mp3` | 321 s | 6.9 dB | **-19.4 dB** | `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3` |
| 9 | `music-isicathamiya.mp3` | 430 s | 8.5 dB | **-18.6 dB** | `public/atlas-shaka-zulu/audio/music-isicathamiya.mp3` |
| 10 | `historical-map-music-minimax26-v2.mp3` | 279 s | 11.8 dB | **-17.9 dB** | `public/assets/geoafrique/audio/historical-map-music-minimax26-v2.mp3` |
| 11 | `music-c-desert.mp3` | 256 s | 6.5 dB | **-16.8 dB** | `public/atlas/peste-1347/audio/music-c-desert.mp3` |
| 12 | `music-C-tension.mp3` ⚠️dup | 256 s | 6.5 dB | **-16.8 dB** | `public/souverain/zimbabwe-lithium/audio/music/music-C-tension.mp3` |

## Toutes les pistes (inventaire complet)

| piste | duree | ampl | bande | rms | chemin |
|---|---|---|---|---|---|
| `music-A-ostinato-grave.mp3` | 146 s | 9.4 | -19.2 | -16.6 | `public/_shared/audio/sahel-warmap/music/music-A-ostinato-grave.mp3` |
| `music-B-tension-desertique.mp3` ⭐ | 418 s | 5.0 | -22.4 | -10.2 | `public/_shared/audio/sahel-warmap/music/music-B-tension-desertique.mp3` |
| `music-C-cordes-minimales.mp3` | 147 s | 6.6 | -19.2 | -16.2 | `public/_shared/audio/sahel-warmap/music/music-C-cordes-minimales.mp3` |
| `music-D-montee-maitrisee.mp3` ⭐ | 539 s | 10.0 | -27.1 | -13.5 | `public/_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3` |
| `music-E-epic-orchestral.mp3` | 102 s | 8.9 | -25.8 | -16.3 | `public/_shared/audio/sahel-warmap/music/music-E-epic-orchestral.mp3` |
| `music-F-military-tendue.mp3` | 129 s | 18.9 | -28.2 | -17.6 | `public/_shared/audio/sahel-warmap/music/music-F-military-tendue.mp3` |
| `soudan-music-A-affine.mp3` ⛔REJETE | 125 s | 7.9 | -20.0 | -13.9 | `public/_shared/audio/soudan/music/_rejete-thriller/soudan-music-A-affine.mp3` |
| `soudan-music-B-brut.mp3` ⛔REJETE | 37 s | 5.8 | -31.0 | -26.4 | `public/_shared/audio/soudan/music/_rejete-thriller/soudan-music-B-brut.mp3` |
| `soudan-music-A-ambient-grave.mp3` | 99 s | 12.1 | -23.9 | -17.5 | `public/_shared/audio/soudan/music/soudan-music-A-ambient-grave.mp3` |
| `soudan-music-B-kora-dundun.mp3` | 127 s | 9.5 | -24.6 | -20.3 | `public/_shared/audio/soudan/music/soudan-music-B-kora-dundun.mp3` |
| `soudan-music-C-percussion-tendue.mp3` | 162 s | 9.1 | -25.3 | -20.3 | `public/_shared/audio/soudan/music/soudan-music-C-percussion-tendue.mp3` |
| `soudan-music-D-kora-douce.mp3` ⭐ | 373 s | 6.5 | -22.1 | -18.4 | `public/_shared/audio/soudan/music/soudan-music-D-kora-douce.mp3` |
| `soudan-music-E-kora-melodique.mp3` | 143 s | 10.5 | -24.0 | -19.3 | `public/_shared/audio/soudan/music/soudan-music-E-kora-melodique.mp3` |
| `soudan-music-F-kora-ample.mp3` | 156 s | 10.5 | -23.5 | -17.4 | `public/_shared/audio/soudan/music/soudan-music-F-kora-ample.mp3` |
| `score-epic.mp3` | 60 s | 29.0 | -23.8 | -12.3 | `public/_shared/audio/sudan-warmap/score-epic.mp3` |
| `score-long.mp3` | 32 s | 29.0 | -24.1 | -12.3 | `public/_shared/audio/sudan-warmap/score-long.mp3` |
| `score.mp3` | 22 s | 19.2 | -24.3 | -12.7 | `public/_shared/audio/sudan-warmap/score.mp3` |
| `historical-map-music-minimax26-v2-30s.mp3` | 30 s | 15.4 | -27.0 | -25.6 | `public/assets/geoafrique/audio/historical-map-music-minimax26-v2-30s.mp3` |
| `historical-map-music-minimax26-v2.mp3` ⭐ | 279 s | 11.8 | -17.9 | -16.6 | `public/assets/geoafrique/audio/historical-map-music-minimax26-v2.mp3` |
| `historical-map-music-minimax26.mp3` | 111 s | 4.4 | -21.4 | -15.4 | `public/assets/geoafrique/audio/historical-map-music-minimax26.mp3` |
| `historical-map-music.mp3` | 30 s | 5.0 | -29.4 | -25.9 | `public/assets/geoafrique/audio/historical-map-music.mp3` |
| `music-ingoma.mp3` | 171 s | 8.1 | -20.4 | -14.7 | `public/atlas-shaka-zulu/audio/music-ingoma.mp3` |
| `music-isicathamiya.mp3` ⭐ | 430 s | 8.5 | -18.6 | -16.1 | `public/atlas-shaka-zulu/audio/music-isicathamiya.mp3` |
| `music-a-mande.mp3` | 127 s | 10.6 | -16.5 | -15.9 | `public/atlas/peste-1347/audio/music-a-mande.mp3` |
| `music-b-tension.mp3` | 228 s | 9.4 | -18.1 | -14.6 | `public/atlas/peste-1347/audio/music-b-tension.mp3` |
| `music-c-desert.mp3` ⭐ | 256 s | 6.5 | -16.8 | -16.2 | `public/atlas/peste-1347/audio/music-c-desert.mp3` |
| `variante-A-royal-kora-balafon.mp3` | 158 s | 7.8 | -18.8 | -13.6 | `public/audio/abou-bakari/music/variante-A-royal-kora-balafon.mp3` |
| `variante-B-mysterieux-kora-dundun.mp3` | 177 s | 14.1 | -22.6 | -15.6 | `public/audio/abou-bakari/music/variante-B-mysterieux-kora-dundun.mp3` |
| `variante-C-epique-balafon-djembe.mp3` | 220 s | 5.2 | -21.5 | -15.1 | `public/audio/abou-bakari/music/variante-C-epique-balafon-djembe.mp3` |
| `variante-D-royal-sombre-kora.mp3` | 118 s | 9.6 | -19.5 | -18.8 | `public/audio/abou-bakari/music/variante-D-royal-sombre-kora.mp3` |
| `variante-E-royal-contemplatif-ngoni.mp3` | 232 s | 15.2 | -21.7 | -16.4 | `public/audio/abou-bakari/music/variante-E-royal-contemplatif-ngoni.mp3` |
| `v1-A-caravane-tuareg.mp3` | 159 s | 10.8 | -20.7 | -15.1 | `public/audio/atlas-empire-ghana/music/v1-A-caravane-tuareg.mp3` |
| `v1-B-marche-or.mp3` | 217 s | 4.4 | -18.5 | -14.3 | `public/audio/atlas-empire-ghana/music/v1-B-marche-or.mp3` |
| `v1-C-empire-or.mp3` | 127 s | 14.9 | -23.4 | -21.6 | `public/audio/atlas-empire-ghana/music/v1-C-empire-or.mp3` |
| `bg-music.mp3` | 30 s | 9.2 | -24.1 | -14.2 | `public/audio/brutalist-finance/bg-music.mp3` |
| `bg-music.mp3` | 15 s | 4.5 | -20.6 | -15.0 | `public/audio/data-viz-explainer/bg-music.mp3` |
| `ambiance-raw.mp3` | 163 s | 8.6 | -22.1 | -15.2 | `public/audio/ggw-muraille-verte/music/ambiance-raw.mp3` |
| `music.mp3` | 30 s | 4.3 | -15.7 | -14.2 | `public/audio/peste-pixel/music.mp3` |
| `a1_savane.mp3` | 20 s | 13.1 | -32.0 | -27.7 | `public/audio/silhouette-conte/ambiance/a1_savane.mp3` |
| `a2_nuit.mp3` | 20 s | 44.0 | -31.4 | -22.8 | `public/audio/silhouette-conte/ambiance/a2_nuit.mp3` |
| `a3_aube.mp3` | 20 s | 13.4 | -21.6 | -20.6 | `public/audio/silhouette-conte/ambiance/a3_aube.mp3` |
| `a4_aurore.mp3` | 20 s | 17.0 | -23.0 | -18.7 | `public/audio/silhouette-conte/ambiance/a4_aurore.mp3` |
| `music-toumani.mp3` | 157 s | 10.0 | -22.4 | -19.3 | `public/audio/sonjata-papercraft/music-toumani.mp3` |
| `variante-A-balafon-dundun.mp3` ⭐ | 346 s | 8.5 | -21.4 | -16.3 | `public/audio/thiaroye-1944/music-variantes/variante-A-balafon-dundun.mp3` |
| `variante-B-kora-ngoni.mp3` | 182 s | 10.0 | -24.5 | -23.0 | `public/audio/thiaroye-1944/music-variantes/variante-B-kora-ngoni.mp3` |
| `variante-C-balafon-solo.mp3` | 170 s | 18.4 | -18.8 | -15.1 | `public/audio/thiaroye-1944/music-variantes/variante-C-balafon-solo.mp3` |
| `ambiance_nuit.mp3` | 30 s | 12.9 | -33.0 | -32.2 | `public/audio/veilleur-ombre/ambiance_nuit.mp3` |
| `v1-A-marche-punique.mp3` | 60 s | 11.8 | -20.0 | -13.9 | `public/hannibal/audio/music/v1-A-marche-punique.mp3` |
| `v1-B-alpes-tension.mp3` | 243 s | 15.4 | -24.5 | -15.0 | `public/hannibal/audio/music/v1-B-alpes-tension.mp3` |
| `v1-C-victoire-carthage.mp3` | 163 s | 10.5 | -22.5 | -17.6 | `public/hannibal/audio/music/v1-C-victoire-carthage.mp3` |
| `music-v1.mp3` | 163 s | 5.4 | -21.5 | -19.5 | `public/poc-money-legends/audio/music-v1.mp3` |
| `cacao-music-CHOISI.mp3` ⭐ | 496 s | 8.9 | -20.8 | -19.4 | `public/souverain/cacao-chocolat-short/audio/cacao-music-CHOISI.mp3` |
| `music-A-tension-industrielle.mp3` | 141 s | 7.1 | -21.4 | -13.4 | `public/souverain/maroc-batteries/audio/music-A-tension-industrielle.mp3` |
| `music-B-drive-maghrebin.mp3` | 217 s | 9.0 | -20.9 | -11.9 | `public/souverain/maroc-batteries/audio/music-B-drive-maghrebin.mp3` |
| `music-B-gnawa-industriel.mp3` | 69 s | 24.6 | -25.5 | -19.1 | `public/souverain/maroc-batteries/audio/music-B-gnawa-industriel.mp3` |
| `music-C-analytique-tendu.mp3` | 148 s | 10.2 | -22.5 | -14.2 | `public/souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3` |
| `music-C-oud-analytique.mp3` | 184 s | 8.2 | -16.9 | -16.3 | `public/souverain/maroc-batteries/audio/music-C-oud-analytique.mp3` |
| `music-v1.mp3` | 219 s | 7.3 | -19.5 | -14.3 | `public/souverain/niger-uranium/audio/music-v1.mp3` |
| `music-v1.mp3` ⚠️dup | 163 s | 5.4 | -21.5 | -19.5 | `public/souverain/or-africain/audio/music-v1.mp3` |
| `music-A-ambient-souverain.mp3` ⭐ | 321 s | 6.9 | -19.4 | -15.6 | `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3` |
| `music-B-kora-percussion.mp3` | 184 s | 12.7 | -20.6 | -14.9 | `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3` |
| `music-C-sabar-cinematique.mp3` ⭐ | 258 s | 10.4 | -22.7 | -14.6 | `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3` |
| `music-A.mp3` | 133 s | 3.8 | -21.4 | -12.1 | `public/souverain/silicon-savannah/audio/music/music-A.mp3` |
| `music-B.mp3` | 149 s | 11.3 | -23.4 | -13.4 | `public/souverain/silicon-savannah/audio/music/music-B.mp3` |
| `music-C.mp3` | 159 s | 4.5 | -17.5 | -14.5 | `public/souverain/silicon-savannah/audio/music/music-C.mp3` |
| `music-A-revelation.mp3` | 132 s | 7.4 | -20.7 | -15.1 | `public/souverain/vraie-taille-afrique/audio/music-A-revelation.mp3` |
| `music-B-atlas.mp3` ⭐ | 383 s | 6.2 | -21.3 | -14.3 | `public/souverain/vraie-taille-afrique/audio/music-B-atlas.mp3` |
| `music-C-fierte.mp3` | 219 s | 8.0 | -19.4 | -16.6 | `public/souverain/vraie-taille-afrique/audio/music-C-fierte.mp3` |
| `music-A-contemplatif.mp3` ⚠️dup | 127 s | 10.6 | -16.5 | -15.9 | `public/souverain/zimbabwe-lithium/audio/music/music-A-contemplatif.mp3` |
| `music-B-geopolitique.mp3` ⚠️dup | 228 s | 9.4 | -18.1 | -14.6 | `public/souverain/zimbabwe-lithium/audio/music/music-B-geopolitique.mp3` |
| `music-C-tension.mp3` ⚠️dup ⭐ | 256 s | 6.5 | -16.8 | -16.2 | `public/souverain/zimbabwe-lithium/audio/music/music-C-tension.mp3` |

## ⚠️ Doublons binaires exacts (meme fichier, noms differents)

Preuve concrete du gaspillage que cet index doit stopper : des pistes payees puis
re-generees ailleurs faute de pouvoir les retrouver.

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

**24.8 Mo dupliques.** Ne pas supprimer sans verifier qu'aucun code ne pointe dessus (`grep -r`).

## ⛔ Ecarte d'office

- `public/_shared/audio/soudan/music/_rejete-thriller/` — **deja refuse par Aziz**, ne jamais ressortir.
- Toute piste d'amplitude >= 15 dB pour un fond sous narration (voir colonne `ampl`).

