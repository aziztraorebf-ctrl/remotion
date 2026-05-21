# Empire Ghana — Plan SFX validé

> Validé par Aziz 2026-05-04. À intégrer dans le render final assemblé après upload review.

## 7 SFX — minimaliste et stratégique

| # | Beat | Position narrative | Description | Durée | Volume | Trigger frame |
|---|------|-------------------|-------------|-------|--------|--------------|
| 1 | Beat 1 | Mot "secret" | Whoosh subtil de révélation magique | 0.5s | 0.15 | TBD via findWord |
| 2 | Beat 3 | Mot "poids égal" | Chime / cloche subtile équilibre | 0.8s | 0.10 | R_POIDS_EGAL |
| 3 | Beat 4 | Arrivée Almoravides Koumbi | War cry berbère lointain menaçant | 0.8s | 0.20 | R_1076 |
| 4 | Beat 4 | Freeze-frame "1076" | Impact sourd / deep thud | 0.6s | 0.25 | R_1076 |
| 5 | Beat 4 | War-cry Sundiata | Cri victorieux Mande triomphant | 1.0s | 0.25 | R_SUNDIATA_WAR_CRY |
| 6 | Beat 4 | Apparition Niani | Chime shimmer doré ascendant | 1.0s | 0.15 | R_NIANI_APPEAR |
| 7 | Beat 5 | "WAGADOU" final | Drum hit / impact final avec reverb | 0.8s | 0.30 | R_JAMAIS |

## Coût estimé
ElevenLabs sound-generation : ~$0.05 × 7 = ~$0.35

## Workflow
1. Génération via API ElevenLabs sound-generation
2. Upload sur Vercel Blob pour review Aziz
3. Si validé : intégration dans Beat4Consequence.tsx et Beat5CTA.tsx via `<Audio>` Remotion
4. Sync sur frames exactes via timing.ts (et findWord pour SFX 1)
