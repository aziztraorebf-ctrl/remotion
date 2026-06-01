---
name: verif-factuelle
description: Vérifie qu'un carrousel / dérivé / réécriture colle aux faits de la vidéo source AVANT publication. Use AVANT d'écrire les textes d'un carrousel, un post, une caption, ou toute réécriture d'un contenu déjà produit en vidéo. La vidéo finale publiée = source de vérité unique.
---

# Skill : /verif-factuelle

Vérifie qu'un dérivé (carrousel, caption, post, réécriture) est factuellement aligné sur la VIDÉO SOURCE. Évite de republier des chiffres/dates faux issus de brouillons.

## Principe non-négociable

**La vidéo finale publiée EST la source de vérité unique.** Nos vidéos sont fact-checkées rigoureusement (ex: Or Africain = Perplexity 2026-05-07, Thiaroye = recherche 2026-06-01). Quand une vidéo est en version FINALE, ses faits SONT vérifiés.

- ⛔ NE JAMAIS faire confiance à `carousel-data.ts`, un brouillon, ou la mémoire : ils peuvent contenir des chiffres PRÉ-fact-check.
- ⛔ NE JAMAIS écrire les textes d'un carrousel avant d'avoir lu le transcript de la vidéo.
- Tout chiffre/date/fait du dérivé doit correspondre EXACTEMENT à ce que dit la vidéo.

## Étapes

### 1. Lire le transcript de la vidéo source

Reconstruire la narration depuis les whisper words :
```bash
python3 -c "
import re
f='src/_archive/episodes-livres/<...>/whisper-words-<episode>.ts'
print(' '.join(re.findall(r'word:\s*\"([^\"]+)\"', open(f).read())))
"
```
Sinon : manifest `narration`/`historical_fact`, ou transcript whisper de la vidéo.

### 2. Extraire les faits durs

Lister chaque chiffre / date / nom / lieu que la vidéo affirme. Ce sont les SEULS faits autorisés dans le dérivé.

### 3. Confronter le dérivé

Pour chaque slide/phrase du dérivé : le chiffre/fait correspond-il EXACTEMENT au transcript ?
- Match → OK.
- Différent → le DÉRIVÉ est faux. Corriger sur la vidéo, jamais l'inverse.
- Absent du transcript (ex: "48%" qui n'est nulle part) → retirer ou remplacer par un fait réellement dit.

### 4. (Optionnel) Vérif externe si fait sensible/récent

Si un fait est post-cutoff, polémique, ou que Aziz doute : lancer une recherche web pour confirmer/nuancer AVANT publication. Distinguer [Certain]/[Probable]/[Hypothèse].

### 5. Signaler

Produire un tableau : Affirmation dérivé | Transcript vidéo | Verdict (OK / corrigé). Présenter à Aziz avant de finaliser.

## Anti-piège

- Un chiffre "approximatif" dans la vidéo (ex: choix narratif "3 tirailleurs") n'est PAS un fait — ne jamais le présenter comme tel dans le dérivé.
- Erreur déjà commise : carrousel Or Africain écrit sur `carousel-data.ts` → 3 chiffres faux (3% vs 5%, 2023/10% vs janvier 2026/5%→12%, 48% non sourcé) → tout refait. Ne pas reproduire.
