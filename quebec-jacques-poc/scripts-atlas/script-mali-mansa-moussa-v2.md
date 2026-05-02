# Script Atlas v2 — Mali / Mansa Moussa (LOCKED)

> Sujet : Mansa Moussa et l'or du Mali XIVe siècle
> Type : richesse-record (Atlas pur, formule Cesar complète)
> Créé V1 : 2026-04-27
> Lock V2 : 2026-04-29 après fact-check + decisions Aziz
> Statut : LOCKED, prêt pour production audio

---

## Changes V1 → V2

1. **Scène 3** : "Quatorze ans" → "Douze ans" (correction fact-check : couronnement 1312 + hajj 1324 = 12 ans)
2. **Bonus narratif** : "douze ans" se répète scène 3 et scène 4 — coïncidence narrative gardée naturelle, pas forcée
3. **Scène 2** : Sorbonne 2 000 conservée (decision Aziz — render test, dynamique Cesar prime)
4. Reste du script : identique V1

---

## Métadonnées

| Champ | Valeur |
|-------|--------|
| Durée cible | 80s |
| Mots totaux | ~167 |
| Densité | 2.2 mots/s |
| Stats chiffrées | 9 |
| Pivots Atlas | 3 |
| Voix | Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm) |
| Modèle TTS | eleven_multilingual_v2 |
| Settings | stability 0.5, similarity 0.75, style 0.3 |

---

## Le script V2 (LOCKED)

### **HOOK (0-4s)**
> *"Cet homme a fait s'effondrer le cours de l'or pendant douze ans."*

### **SCÈNE 1 — Setup (4-16s)**
> *"Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest. Cette zone-là, c'est l'empire du Mali. Plus grand que l'Europe occidentale. Et il a un secret."*

### **SCÈNE 2 — Densité Cesar (16-34s)**
> *"À cette époque, le Mali produit la moitié de l'or qui circule dans le monde. La moitié. Tombouctou compte plus de bibliothèques que Paris. L'université de Sankoré accueille vingt-cinq mille étudiants. Pendant ce temps, la Sorbonne en a deux mille."*

### **SCÈNE 3 — Climax Hadj (34-50s)** [CORRIGÉ V2]
> *"Mais le moment qui marque l'histoire, c'est ça. Douze ans après son couronnement, l'empereur du Mali part à La Mecque. Avec lui : soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur."*

### **SCÈNE 4 — Conséquence (50-62s)**
> *"Sur la route, il distribue tellement d'or au Caire que l'économie égyptienne s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Méditerranée. Un seul homme. Un continent qui s'effondre."*

### **SCÈNE 5 — CTA antithèse (62-72s)**
> *"Cet homme s'appelait Mansa Moussa. Demande qui est l'homme le plus riche de l'histoire. On te répondra Rockefeller, Bezos, Musk. Pas lui."*

---

## Texte unique pour ElevenLabs (copier-coller direct)

```
Cet homme a fait s'effondrer le cours de l'or pendant douze ans.

Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest. Cette zone-là, c'est l'empire du Mali. Plus grand que l'Europe occidentale. Et il a un secret.

À cette époque, le Mali produit la moitié de l'or qui circule dans le monde. La moitié. Tombouctou compte plus de bibliothèques que Paris. L'université de Sankoré accueille vingt-cinq mille étudiants. Pendant ce temps, la Sorbonne en a deux mille.

Mais le moment qui marque l'histoire, c'est ça. Douze ans après son couronnement, l'empereur du Mali part à La Mecque. Avec lui : soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur.

Sur la route, il distribue tellement d'or au Caire que l'économie égyptienne s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Méditerranée. Un seul homme. Un continent qui s'effondre.

Cet homme s'appelait Mansa Moussa. Demande qui est l'homme le plus riche de l'histoire. On te répondra Rockefeller, Bezos, Musk. Pas lui.
```

---

## Scan TTS V2 — checklist NON-NEGOTIABLE

### Règles ElevenLabs FR appliquées (CLAUDE.md)
- [x] Zéro participe passé en "e/ee" en fin de groupe
- [x] Zéro "ont + voyelle"
- [x] Nombres en lettres (1324 → "mille trois cent vingt-quatre", 25000 → "vingt-cinq mille", 60000 → "soixante mille", 12000 → "douze mille", 80 → "quatre-vingts", 150 → "cent cinquante", 12 → "douze")

### Mots à risque — pré-test obligatoire avant narration complète

| Mot | Risque | Test |
|-----|--------|------|
| **Rockefeller** | Prononciation FR vs EN | Pré-test ElevenLabs |
| **Bezos** | "Bé-zoss" vs "Bi-zos" | Pré-test ElevenLabs |
| **Mansa** | Nom propre africain, accent FR | Pré-test ElevenLabs |
| **Moussa** | Nom propre africain | Pré-test ElevenLabs |
| **Musk** | Probablement OK | Inclus dans pré-test |

### Mots vérifiés OK
- "fait s'effondrer" ✅ (pas de participe en "é" final)
- "qui s'effondre" ✅ (corrigé V1, OK)
- "couronnement" ✅
- "vingt-cinq mille étudiants" ✅
- "Méditerranée" ✅ (pas de liaison problématique)
- "régionale", "occidentale" → absents du script ✅

---

## Décisions production figées V2

- Voix : **Narratrice GeoAfrique v2** (z3gESu49naEZW8Af2Upm) — pas Chris
- Modèle : **eleven_multilingual_v2**
- Durée cible : **80s** (Aziz 2026-04-29 — voie A test pipeline Atlas long)
- Style portraits : **2 versions A/B testées** (Paper-Craft pur vs BD flat + palette imposée + médaillon indigo)
- Musique : **Variante C Mande Contemplatif** (par défaut) — possible test variante alternative dramatique pour climax
- SFX additionnel : **+1 SFX vent Sahara** (diégétique scène 3 caravane)
- Skip : nuages mer, grain, cliquetis or, bulle info flottante (cf décisions session 2026-04-29)
