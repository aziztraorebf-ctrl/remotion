# STATUS — Hannibal : Traversée des Alpes (Atlas)
> Mis à jour : 2026-06-25
> Épisode en **PAUSE** (déprioritisé, mémoire préservée).

---

## ÉTAT

| Beat | Fichier | Render FINAL | Notes |
|------|---------|-------------|-------|
| Hook + Beat 1 (Contexte) | `src/projects/atlas/hannibal/` ou `src/_archive/episodes-livres/atlas/hannibal/` | état à confirmer | PIPELINE.md : Beat 1 livré |
| Beat 2 (Rhône + Volques) | scènes dans `scenes/` | non livré | Phase C (code scène principale) non codée |
| Beat 3–5 | non codés | — | VAGUE-1-LOCKED planifié mais non implémenté |

Code actif : `src/_archive/episodes-livres/atlas/hannibal/` (timing.ts, scenes/, components/).

---

## DÉCISIONS VERROUILLÉES (DECISIONS-LOCKED 2026-05-05)

- Palette : fond `NOIR_GUERRE #0F1A1F`, route ambre `#D4A843`, Carthage rouge `#8B3A2A`, Rome pourpre `#5C3D6E`
- Carte : `data/geo/hannibal-data.json` (4 vues : context, south, alpes, italia)
- Hook : Version A validée (fond noir textuel, Cinzel 84px)
- Éléphant canonique : `War Elephant Carthage` ID `40e0497b-63fa-4ffb-8d20-4a511d561623` (6 anims)
- Hannibal canonique : `Hannibal v4a Minimal` ID `4ae3e075-a091-4089-befc-c0f35fd0559d` (8 dirs)
- Musique : `v1-A-marche-punique.mp3` (Beats 1-3) + `v1-B-alpes-tension.mp3` (Beats 4-5)

---

## PROCHAINE ACTION (si reprise)

1. Lire `MANIFEST-V1.md` (référence visuelle beat-par-beat) + `VAGUE-1-LOCKED.md` (7 idées techniques)
2. Vérifier état réel du code dans `src/_archive/episodes-livres/atlas/hannibal/`
3. Commencer Beat 2 Phase C (camera-track sprite éléphant-radeau sur Rhône)
4. Lancer `python3 scripts/atlas-session.py --episode hannibal --beat 2` (⚠️ peut planter — voir PIPELINE.md)

---

## ASSETS CLÉS

- Sprites : `public/hannibal/assets/characters/` (hannibal-v4a, volque, numide) + `public/hannibal/assets/map-objects/`
- Éléphant radeau : `public/hannibal/assets/map-objects/elephant-radeau/` (v2 + v3, anims walk-on-raft)
- Audio narration : `public/hannibal/audio/narration-v2.mp3` (147.77s)

---

## POINTS D'ATTENTION

- `atlas-session.py` ne marche que pour peste-1347 au moment de la pause (Hannibal plante — état à confirmer)
- Beat 2 Rhône = scène la plus complexe (camera-track + sprites + speed ramp + orbital)
- VAGUE-1-LOCKED : 7 idées validées jury (dont sprite-decay 37 éléphants + FocusBubble + compteur)
