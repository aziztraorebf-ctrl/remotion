# Script Atlas v3 — Mali / Mansa Moussa (LOCKED FINAL)

> Sujet : Mansa Moussa et l'or du Mali XIVe siecle
> Created V1 : 2026-04-27 · V2 : 2026-04-29 (fact-check) · V3 : 2026-04-29 (CTA + tags eleven_v3)
> Statut : LOCKED — narration complete prete a generer

---

## Changes V2 -> V3

1. **CTA reformule** (decision Aziz) : "Pas lui" -> "Et pourtant, la vraie reponse, c'est Mansa Moussa." (antithese explicite + repetition nom = punch + memorabilite)
2. **Tags eleven_v3 inline** ajoutes : `[mysterious]` `[fast]` `[curious]` `[serious]` `[dramatic]` `[confident]` (validation pretest 2 — tous fonctionnent)
3. Reste : V2 inchange (12 ans corrige, Sorbonne 2 000 conservee)

---

## Metadonnees

| Champ | Valeur |
|-------|--------|
| Duree cible | 80s (~13s CTA confirmes pretest2 = scale ~80s narration totale) |
| Mots totaux | ~171 (avec CTA V3) |
| Voix | Narratrice GeoAfrique v2 (z3gESu49naEZW8Af2Upm) |
| Modele | eleven_v3 |
| Settings | stability 0.22, similarity 0.55, style 0.55 |
| Tags actifs | [mysterious] [fast] [curious] [serious] [dramatic] [confident] |

---

## Texte FINAL pour ElevenLabs (avec tags)

```
[mysterious] Cet homme a fait s'effondrer le cours de l'or pendant douze ans.

[fast] Mali, mille trois cent vingt-quatre. Tu regardes une carte d'Afrique de l'Ouest. Cette zone-la, c'est l'empire du Mali. Plus grand que l'Europe occidentale. [curious] Et il a un secret.

[fast] A cette epoque, le Mali produit la moitie de l'or qui circule dans le monde. [serious] La moitie. [fast] Tombouctou compte plus de bibliotheques que Paris. L'universite de Sankore accueille vingt-cinq mille etudiants. Pendant ce temps, la Sorbonne en a deux mille.

[dramatic] Mais le moment qui marque l'histoire, c'est ca. [fast] Douze ans apres son couronnement, l'empereur du Mali part a La Mecque. Avec lui : soixante mille hommes. Douze mille esclaves. Et quatre-vingts chameaux qui portent chacun cent cinquante kilos d'or pur.

[fast] Sur la route, il distribue tellement d'or au Caire que l'economie egyptienne s'effondre. Pendant douze ans, le prix de l'or chute dans toute la Mediterranee. [serious] Un seul homme. Un continent qui s'effondre.

[confident] Cet homme s'appelait Mansa Moussa. [fast] Demande qui est l'homme le plus riche de l'histoire. On te repondra Rockefeller, Bezos, Musk. [dramatic] Et pourtant, la vraie reponse, c'est Mansa Moussa.
```

---

## Logique tags par scene

| Scene | Tag | Effet recherche |
|-------|-----|-----------------|
| Hook | `[mysterious]` | Installer la question, mystere |
| Setup | `[fast]` | Suivre rythme cartographique |
| "Et il a un secret" | `[curious]` | Micro-cliffhanger |
| Densite Cesar | `[fast]` | Maintenir momentum |
| "La moitie." | `[serious]` | Repetition prend du poids |
| Climax pivot | `[dramatic]` | Bascule narrative |
| Climax stats | `[fast]` | Avalanche chiffres |
| Consequence | `[fast]` | Vitesse chute economique |
| "Un seul homme" | `[serious]` | Gravite morale |
| CTA ouverture | `[confident]` | Affirmation calme |
| CTA enumeration | `[fast]` | Liste rythme |
| CTA punch | `[dramatic]` | Antithese + revelation |

---

## Settings ElevenLabs (canonique Atlas V8)

```python
model_id = "eleven_v3"
voice_settings = {
    "stability": 0.22,
    "similarity_boost": 0.55,
    "style": 0.55,
    "speed": 1.0,
}
```

---

## Pretest validations 2026-04-29

- **Pretest 1** (4 mots) : prononciation Mansa/Moussa/Rockefeller/Bezos/Musk OK ($0.004, 11.84s)
  - URL : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/wip/pretest-words-chJUA0FJoHAOwmQIYjYPneEHtDDJjr.mp3
- **Pretest 2** (CTA + tags) : `[confident]` `[fast]` `[dramatic]` validates ($0.006, 13.04s)
  - URL : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/wip/pretest2-cta-qKRKR0W3qsSUwp0TQdqvU4eaCFAzH0.mp3

---

## Cout total etape 1 + 1bis

- Pretest 1 : $0.004
- Pretest 2 : $0.006
- **Total** : $0.010

---

## Prochaine etape : Etape 2 — Narration complete 80s

Scripts a executer :
1. `generate-mansa-moussa-narration.py` (a creer) — narration complete avec tags
2. `forced-alignment.py` adapte (output JSON timings)
3. `generate-sfx-mansa-moussa.py` (a creer) — 4-5 SFX (B impact villes x3, C ink-draw route, D cartouche thud, vent Sahara)
4. `generate-music-v2-mansa-moussa.py` (a creer) — Minimax variante C par defaut
