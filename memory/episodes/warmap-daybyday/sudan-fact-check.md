# Fact-check — sudan-civil-war
> Genere 2026-06-05 22:19 UTC par scripts/warmap/factcheck.py

- Connecteur: acled-fixture
- Juge: skipped (no key)
- Jalons non verifies (source unique ACLED): 6/6

## Regle de convergence
Un jalon passe `verified=true` seulement si >=2 TYPES de sources independants concordent (ACLED + presse + UCDP...). ACLED seul -> `verified=false`, confidence plafonnee a 0.6.

## Jalons
- **2023-04-15** — La guerre eclate — Khartoum bascule dans la bataille — verified=False, confidence=0.6
- **2023-08-01** — Le RSF s'empare de Khartoum et du Darfour — verified=False, confidence=0.6
- **2023-12-18** — Apogee du RSF — chute de Wad Madani — verified=False, confidence=0.6
- **2024-10-01** — L'armee contre-attaque depuis l'est — verified=False, confidence=0.6
- **2025-03-26** — L'armee reprend Wad Madani puis Khartoum — verified=False, confidence=0.6
- **2026-05-01** — Partition de fait — l'ouest au RSF, l'est a l'armee — verified=False, confidence=0.6

> Juge LLM non execute (pas de cle / mode fixtures). Verification croisee a refaire avec ACLED reel + presse + UCDP.
