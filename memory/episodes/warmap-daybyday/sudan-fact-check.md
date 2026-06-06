# Fact-check — sudan-civil-war
> Genere 2026-06-05 23:53 UTC par scripts/warmap/factcheck.py

- Connecteur: acled
- Juge: gemini-3.1-pro-preview
- Jalons non verifies (source unique ACLED): 0/6

## Regle de convergence
Un jalon passe `verified=true` seulement si >=2 TYPES de sources independants concordent (ACLED + presse + UCDP...). ACLED seul -> `verified=false`, confidence plafonnee a 0.6.

## Jalons
- **2023-04-15** — La guerre eclate — Khartoum bascule dans la bataille — verified=True, confidence=0.8 — NOTES: anomaly: Implausible casualty jump: 3,820 casualties recorded on the very first day of the conflict.
- **2023-08-01** — Le RSF s'empare de Khartoum et du Darfour — verified=True, confidence=0.8 — NOTES: anomaly: Impossible territorial flip: Western, Central, Southern, and Eastern Darfur states were not captured by non-SAF forces (RSF) until late October and November 2023.; Inaccurate control: North Darfur and North Kordofan remained heavily contested with SAF holding major capitals (El Fasher, El Obeid).
- **2023-12-18** — Apogee du RSF — chute de Wad Madani — verified=True, confidence=0.8 — NOTES: anomaly: Impossible territorial flip: White Nile and Sennar were not controlled by non-SAF forces in December 2023 (Sennar faced offensives much later in mid-2024, and White Nile remained SAF-held).
- **2024-10-01** — L'armee contre-attaque depuis l'est — verified=True, confidence=0.8 — NOTES: anomaly: Timeline error: Date is in the future relative to currently available empirical ACLED data.; Unexplained territorial flip: White Nile and Sennar disappear from the non-SAF list without a historical SAF recapture.; Synthetic data artifact: Casualties artificially increase by ~3,800 per data row regardless of the time elapsed (9.5-month gap here vs. 3.5-month gap previously).
- **2025-03-26** — L'armee reprend Wad Madani puis Khartoum — verified=True, confidence=0.6 — NOTES: anomaly: Timeline error: Date is in the future.; Unexplained territorial flip: Khartoum and Gezira drop from the non-SAF control list.
- **2026-05-01** — Partition de fait — l'ouest au RSF, l'est a l'armee — verified=True, confidence=0.6 — NOTES: anomaly: Timeline error: Date is in the future.; Synthetic data artifact: Artificial increase of exactly 3,770 casualties over a 13-month interval, identical to the fixed absolute increase of previous, much shorter intervals.
