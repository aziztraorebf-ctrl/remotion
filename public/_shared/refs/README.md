# Références Visuelles — Source de Vérité Unique

> **LIRE EN PREMIER avant tout appel Seedance / Grok / Gemini / Kling.**
> Un seul dossier, tout est ici. Rien d'autre n'est valide.

---

## Structure

```
refs/
├── style/          ← Style visuel actuel (frames finales validées)
├── characters/     ← Character sheets par personnage (continuité identité)
├── motion/         ← Références de mouvement caméra (mp4 + preview)
└── _archive-deprecated/  ← Anciennes itérations (ne pas utiliser)
```

---

## style/ — Le style qu'on utilise

Deux styles actifs, extraits directement des vidéos PRET-PUBLICATION.

### `style/sonjata-storybook-warm/` — Style épisodes historiques africains
- Contours épais noirs, proportions cartoon légèrement trapues
- Palette sépia/ambre chaud, texture papier vieilli
- Décors complets (baobabs, huttes, terre rouge)
- REF: `REF-sonjata-ironbar.png` (Sonjata + barre de fer, village, foule)
- REF: `REF-sonjata-battle.png` (Sonjata combat, même palette)
- Source: `out/PRET-PUBLICATION/sonjata-v7-FINAL.mp4`

### `style/thiaroye-storybook-cold/` — Style épisodes colonialisme/guerre
- Même style cartoon contours épais, mais palette froide (gris, bleu colonial)
- Décors portuaires, militaires, barrières
- REF: `REF-camp-soldiers.png` (soldats intérieur, lumière dure)
- REF: `REF-port-scene.png` (soldat camp militaire, ciel gris)
- Source: `out/PRET-PUBLICATION/thiaroye-v5-FINAL.mp4`

**Règle : toujours joindre 1-2 images de `style/` comme référence visuelle dans tout prompt Seedance/Grok/Gemini.**

---

## characters/ — Character sheets par personnage

| Personnage | Fichiers | Usage |
|---|---|---|
| `abou-bakari/` | character-sheet-v1.png, throne-lastframe.png | Roi du Mali XIV, robes or, bonnet brodé |
| `sonjata/` | sonjata-ironbar-scene.png | Sonjata enfant, sash rouge, cheveux courts |
| `amanirenas/` | warrior-type-REF-canonical.png, portrait-REF-v4-patch.png | Reine guerrière koushite |
| `mariama-ba/` | mariama-ba-charsheet-CANONICAL.png | Femme sénégalaise, tenue blanche, turban |
| `moussa/` | mansa-moussa-character-sheet-v1.png | Mansa Moussa, robes impériales |

**Règle : toujours joindre le character sheet du personnage principal comme référence d'identité dans tout prompt.**

---

## motion/ — Références de mouvement caméra

| Dossier | Contenu | Usage |
|---|---|---|
| `combat/` | anime-duel-8s.mp4 | Duel, combat rapproché |
| `discours-proclamation/` | hero-shot-gladiator-15s.mp4, push-in-oppenheimer-6s.mp4 | Discours, révélation, moment héroïque |
| `foule-armee/` | pullback-drone-beach-6s.mp4 | Armée, foule, vue aérienne |
| `marche-voyage/` | tracking-walk-boulevard-6s.mp4 | Personnage qui marche, tracking shot |
| `moment-dramatique/` | crane-pullback-samurai-15s.mp4, dolly-in-intense-6s.mp4 | Climax, révélation dramatique |
| `panorama-lieu/` | aerial-drone-paris-6s.mp4, arc-orbit-basterds-6s.mp4, fpv-ancient-kingdom-15s.mp4 | Révéler un lieu, établissement |

---

## Comment utiliser (recette standard)

```
Prompt Seedance/Grok :
@Image1 = style/sonjata-storybook-warm/REF-sonjata-ironbar.png  ← style
@Image2 = characters/sonjata/sonjata-ironbar-scene.png           ← identité personnage

"@Image1 defines the visual style. @Image2 is the character.
[description de la scène et du mouvement]"
```

---

## Ajouter une nouvelle REF (règle)

1. Extraire la frame depuis `out/PRET-PUBLICATION/<episode>-FINAL.mp4`
2. Nommer clairement : `REF-<episode>-<description>.png`
3. Placer dans `style/<nom-style>/` ou `characters/<personnage>/`
4. Mettre à jour ce README

**Ne jamais ajouter une REF qui vient d'une exploration/test non validé.**
