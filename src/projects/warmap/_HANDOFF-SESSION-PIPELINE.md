# ⚠️ HANDOFF — À LIRE si tu es la session "pipeline de recherche War-Map"

> Écrit 2026-06-05 par une AUTRE session (réorganisation/blindage du pilier).
> Tu travailles sur `feat/warmap-research-pipeline`. **Des fichiers ont été DÉPLACÉS pendant ton absence.**
> Ce fichier existe pour t'éviter de chercher l'ancien code aux anciens chemins. Supprime-le quand lu.

## CE QUI A CHANGÉ (réorganisation du 3e pilier, commit `64e79c4`)

Le code War-Map a été **unifié et réorganisé** pour parité Souverain/Atlas. Conversions de chemins :

| AVANT (ce que tu connaissais) | MAINTENANT |
|---|---|
| `src/projects/_rnd/sudan-warmap/SudanWarMapFlat.tsx` | `src/projects/warmap/engine/WarMapEngine.tsx` (RENOMMÉ) |
| `src/projects/_rnd/sudan-warmap/sudanControlData.ts` | `src/projects/warmap/engine/sudanControlData.ts` |
| `src/projects/_rnd/sudan-warmap/warmapVehicles.ts` | `src/projects/warmap/engine/warmapVehicles.ts` |
| `src/projects/_rnd/sudan-warmap/WarMapDataOverlay.tsx` | `src/projects/warmap/engine/WarMapDataOverlay.tsx` |
| `src/projects/_rnd/sudan-warmap/VehicleSymbols.tsx` | `src/projects/warmap/engine/VehicleSymbols.tsx` |
| `src/projects/warmap/schema.ts` | `src/projects/warmap/data/schema.ts` |
| `src/projects/warmap/adapter.ts` | `src/projects/warmap/data/adapter.ts` |
| `src/projects/_rnd/sudan-warmap/SudanWarMap.tsx` (satellite) | **SUPPRIMÉ** (satellite 3D rejeté) |

- Le composant **`SudanWarMapFlat` s'appelle maintenant `WarMapEngine`** (moteur générique). Les IDs de
  composition Root (`SudanWarMapEpic60`, etc.) sont INCHANGÉS.
- `data/sudan.warmap.json` est INCHANGÉ (même chemin). `config.py` pointe déjà dessus correctement.
- **Ton CSV `scripts/warmap/fixtures/ucdp/GEDEvent_v25_1.csv` n'a PAS été touché.** Il est intact.
- Ton pipeline `scripts/warmap/` n'a PAS été touché.

## CE QUI N'A PAS ÉTÉ FAIT (volontairement, pour ne pas te perturber)

- **Aucun merge dans master.** Ton pipeline est du WIP non fini → c'est À TOI de merger quand prêt.
- **Le CSV UCDP n'a pas été sorti de git** (optimisation reportée — c'est lourd ~50-100MB mais utilisé par toi).

## NOUVEAU POINT D'ENTRÉE (à utiliser désormais)

- **`src/projects/warmap/WARMAP-INDEX.md`** = carte maître du pilier (où est quoi, LA référence).
- **LA référence vidéo = `SudanWarMapEpic60`** (60s, catbox `4dwqit`), PAS les variantes courtes.
- Mémoire : `memory/doctrines/WARMAP-PLAYBOOK.md` (design) + `WARMAP-RESEARCH-PLAYBOOK.md` (ta partie, données).

## QUAND TU AURAS FINI TON PIPELINE
Merger `feat/warmap-research-pipeline` → master inclura ET ton pipeline ET la réorg (tout est sur la
même branche). Vérifier le diff (`git diff master..HEAD --stat`) AVANT — décider à ce moment si le CSV
brut va dans git ou dans `.gitignore` (reco : `.gitignore`, les données externes se re-téléchargent).
