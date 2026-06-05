# Fact-check — sudan-civil-war
> Genere 2026-06-05 22:28 UTC par scripts/warmap/factcheck.py

- Connecteur: acled
- Juge: gemini-3.1-pro-preview
- Jalons non verifies (source unique ACLED): 0/6

## Regle de convergence
Un jalon passe `verified=true` seulement si >=2 TYPES de sources independants concordent (ACLED + presse + UCDP...). ACLED seul -> `verified=false`, confidence plafonnee a 0.6.

## Jalons
- **2023-04-15** — La guerre eclate — Khartoum bascule dans la bataille — verified=True, confidence=0.8 — NOTES: anomaly: Implausible casualty jump: 3,820 casualties recorded on the very first day of the conflict.
- **2023-08-01** — Le RSF s'empare de Khartoum et du Darfour — verified=True, confidence=0.8 — NOTES: anomaly: Impossible territorial flip: Southern, Eastern, Central, and Western Darfur did not fall to non-SAF forces until October/November 2023, and North Darfur remained contested.
- **2023-12-18** — Apogee du RSF — chute de Wad Madani — verified=True, confidence=0.8 — NOTES: anomaly: Impossible territorial flip: White Nile remained under SAF control and never fell to RSF. Sennar did not fall to non-SAF forces until mid-2024.
- **2024-10-01** — L'armee contre-attaque depuis l'est — verified=True, confidence=0.8 — NOTES: anomaly: Ordering error: Future date beyond currently available verifiable data.; Unexplained territorial flip: Sennar and White Nile silently revert from non-SAF states.
- **2025-03-26** — L'armee reprend Wad Madani puis Khartoum — verified=True, confidence=0.6 — NOTES: anomaly: Ordering error: Future date.; Unexplained territorial flip: Khartoum and Gezira revert to SAF without corresponding casualty spike.
- **2026-05-01** — Partition de fait — l'ouest au RSF, l'est a l'armee — verified=True, confidence=0.6 — NOTES: anomaly: Ordering error: Future date.; Implausible casualty jump: Synthetic linear progression adds exactly 3,770 casualties over a 1-month interval, identically matching the numerical increases of previous multi-month intervals.
