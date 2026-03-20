# GOTCHAS_FRANCAIS — Prononciation ElevenLabs
> Version 1.0 — bugs confirmes en production, workarounds valides
> Modele : eleven_multilingual_v2, voix francophones

---

## Principe general

ElevenLabs multilingual_v2 est excellent en francais MAIS a des comportements specifiques
sur certaines constructions. Ces bugs sont reproductibles et ont des solutions connues.

**Regle : corriger le texte source. Ne pas essayer de contourner avec du SSML complexe.**

---

## 1. Participes passes en "-e" final

**Probleme :** Syllabe finale avalee ou liaisons bizarres.

| Problematique | Correction |
|---------------|-----------|
| `il a tout abandonné` | `il laissa tout` |
| `il fut envoyé` | `on l'envoya` |
| `le trône abandonné` | `le trône qu'il quitta` |
| `il est parti` | OK — verbe etre + participe court = generalement OK |

**Principe :** Preferer le passe simple (laissa, ordonna, monta, abdiqua) ou construction active.

---

## 2. Liaisons "ont + voyelle"

**Probleme :** "t" de liaison sur-prononce, sonne robotique.

| Problematique | Correction |
|---------------|-----------|
| `certains ont estimé` | `certains pensent` / `certains croient` |
| `ils ont envoyé` | `ils envoyerent` |
| `ils ont atteint` | `ils atteignirent` |

---

## 3. Nombres — toujours en lettres

Les chiffres arabes dans le script = comportement imprévisible.

| Chiffres | Lettres |
|----------|---------|
| `1311` (annee) | `mil trois cent onze` |
| `2 000 pirogues` | `deux mille pirogues` |
| `400 milliards` | `quatre cents milliards` |
| `181 ans` | `cent quatre-vingt-un ans` OU `pres de deux siecles` |

---

## 4. Noms propres historiques

**Noms valides sans correction (testes en production) :**
- Abou Bakari, Mansa Moussa, Mali, Atlantique — OK tels quels

**Noms a tester avant validation finale :**
- Noms arabes longs (ex : Ibn Battuta) — tester, corriger en phonetique si besoin
- Noms africains avec consonnes inhabituelles — idem

**Technique de correction phonetique :**
Ecrire avec tirets pour forcer la segmentation :
> `Tombouctou` -> si probleme -> `Tom-bouc-tou`

---

## 5. Majuscules pour l'emphase

ElevenLabs LIT les majuscules avec plus d'emphase. C'est une feature, pas un bug.

**Usage valide (testes en production) :**
- `LUI-MEME` -> insistance forte
- `UN homme` -> "un" accentue
- `TOUT abandonné` -> "tout" accentue

**Regle :** Max 1-2 majuscules d'emphase par phrase. Trop = sonne artificiel.

---

## 6. Points de suspension

`...` cree une pause naturelle de ~0.3-0.4s dans eleven_multilingual_v2.

Valide en production :
- `En 1311...` -> pause courte avant la suite
- `Il ne reviendra... jamais.` -> effet dramatique

Si la pause doit etre plus longue ou precise, utiliser `<break>` explicite.

---

## 7. Constructions a eviter

| Probleme | Exemple | Solution |
|----------|---------|----------|
| Imparfait du subjonctif | "qu'il abandonnât" | passe simple direct |
| Double negation litteraire | "ne... point" | "ne... pas" |
| Abreviations ambigues | "M." | "Monsieur" en toutes lettres |
| Chiffres romains | "Louis XIV" | "Louis quatorze" |

---

## 8. Checklist avant de rendre le script corrige

- [ ] Participes passes en "-e" -> remplaces par passe simple si sensibles
- [ ] "ont + voyelle" -> verifies et remplaces si necessaire
- [ ] Nombres -> tous en lettres
- [ ] Noms propres historiques -> notes comme "a tester" si doute
- [ ] Majuscules -> uniquement sur mots d'emphase intentionnelle
- [ ] Breaks `<break>` -> inseres aux moments de tension maximale
- [ ] Max 3 breaks par paragraphe
