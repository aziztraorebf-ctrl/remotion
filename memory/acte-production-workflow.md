---
name: Workflow de production d'un acte Remotion pur
description: Pattern valide 2026-04-13 sur Soundjata Acte VI — narration audio + composition Remotion avec assets Gemini + timings frame-precis
type: reference
---

# Production d'un acte Remotion pur — Pattern valide

> Etabli : 2026-04-13 sur Soundjata Acte VI (Charte du Manden, 20.5s)

Workflow pour creer un acte **100% Remotion** sans clip video — uniquement narration audio + composition animee avec assets Gemini + texte typographique.

---

## Quand utiliser ce pattern

- Acte ou sous-acte narratif OU informatif (listes, chiffres, dates, documents, cartes)
- Pas d'action physique de personnage — le texte et les symboles portent le message
- On veut un look "document historique" ou "infographie premium" (pas de morphing, pas d'artefacts video)
- Exemples : charte/loi, chronologie, liste de droits, comparaison chiffree, statistiques

---

## Pipeline en 5 etapes

### Etape 1 — Transcription Whisper de la narration complete

Script : `scripts/tools/transcribe-openai.py` (reutilisable)

```bash
python scripts/tools/transcribe-openai.py
```

Utilise OpenAI Whisper API (`whisper-1`) avec `timestamp_granularities=["word", "segment"]`.
Cout : ~1 centime pour 2 min audio. **10 secondes**, sortie JSON.

Ne PAS utiliser whisper local — lent sur Mac Apple Silicon meme avec small/medium. L'API est 100x plus rapide et gratuite a cette echelle.

### Etape 2 — Timing TS frame-precis

A partir du JSON Whisper, construire `timing-{projet}.ts` avec :
- `SCENES` : toutes les scenes narratives (clé = nom significatif) avec `start` et `end` en frames
- `ACTS` : groupement logique par acte pour le storyboard

**Regle d'or** : pour eviter les "trous" entre sub-scenes, utiliser les frontieres absolues de chaque segment (le `start` de la suivante devient le `end` de la precedente). Les silences naturels sont absorbes dans la sub-scene precedente.

### Etape 3 — Generation des assets Gemini

Pattern : un script par groupe d'assets. Structure :
- `STYLE_PREAMBLE` : instructions communes (style, palette, "no text", fond blanc pour transparence)
- `ELEMENTS` : dict prompt par asset
- `white_to_transparent()` : PIL helper pour convertir fond blanc → alpha transparent (threshold 240)

Modele : `gemini-3.1-flash-image-preview`

**Checklist obligatoire dans le prompt** :
- "CRITICAL: pure white background (#FFFFFF)" (pour PIL conversion)
- "No text, no letters, no numerals visible anywhere" (Remotion gere le texte)
- "Style: painted 2D illustration, graphic novel aesthetic, bold outlines" (coherence serie)
- Specifier format (1024x1024 carre pour icones, 9:16 vertical pour scenes)

### Etape 4 — Retouche chirurgicale Gemini

Si un asset est proche mais a un defaut (element en trop, detail faux) :
- **Ne PAS regenerer** — retoucher chirurgicalement avec Gemini (prompt + image source)
- Pattern : "Take this image exactly as it is. Make ONE surgical change: [change]. DO NOT change anything else: [list]."
- Valide sur Soundjata (retrait rose des vents sur la carte Mali)

### Etape 5 — Composition Remotion

Structure du fichier principal (ex: `SoundjataCharte.tsx`) :

```tsx
// Constantes
const FPS = 30;
const W = 1080, H = 1920;
const PAL = { /* palette projet */ };
const TITLE_FONT = '"Cormorant Garamond", "Palatino", serif';
const BODY_FONT = '"Cormorant Garamond", "Palatino", serif';
const ASSET = (name: string) => staticFile(`.../charte/${name}`);

// Sub-scenes — frontieres frame-precises
export const SUB_SCENES = {
  sceneA: { start: 0, end: Math.round((endSecABS - startActABS) * 30) },
  // ...
};

// Composants par sub-scene (un par un)
const SceneA: React.FC = () => { /* ... */ };

// Composition principale
export const ActeComposition: React.FC = () => (
  <AbsoluteFill>
    <Audio src={ASSET("narration-acte.mp3")} />
    <ParchmentBackground />  {/* ou autre fond */}
    <Sequence from={SUB_SCENES.sceneA.start} durationInFrames={SUB_SCENES.sceneA.end - SUB_SCENES.sceneA.start}>
      <SceneA />
    </Sequence>
    {/* ... */}
  </AbsoluteFill>
);
```

### Etape 6 — Audio extrait pour test isolé

Pour tester l'acte en isolation avant d'assembler le Short complet :

```bash
ffmpeg -ss {OFFSET_S} -i narration-full.mp3 -t {DUREE_S} -c copy narration-acte.mp3
```

Passer ce fichier au composant via `<Audio src={...} />`. Le render de la composition valide la synchro audio/visuel avant l'assemblage global.

---

## Anti-patterns identifies (ne PAS faire)

### Fond parchemin + carte geographique dans le meme plan
Deux langages visuels (narratif + informatif) qui se concurrencent. La carte doit avoir SON propre plein ecran. Valide 2026-04-13 sur v3 rejete.

### Carte d3-geo en overlay sur parchemin
Bug de viewport : les frontieres debordent du cadre parchemin. Si besoin de carte animee, la mettre en plein ecran dans sa propre Sequence, pas par-dessus un autre fond.

### Timings sur durees relatives au lieu de frontieres absolues
Si on calcule chaque sub-scene comme `{start, duration}` au lieu de `{start, end}`, on cumule des erreurs d'arrondi et on cree des gaps visuels entre scenes. Toujours utiliser les secondes ABSOLUES de la narration et faire `Math.round((nextStart - actStart) * fps)`.

### Whisper local sur Mac Apple Silicon
Modele medium : 10+ min pour 2 min audio (bloque). Modele small : 5+ min sans GPU. Utiliser l'API OpenAI directement — 10 secondes, ~1 centime.

### Icones et medallions trop petits
Sur un ecran 1080x1920, les elements symboliques doivent faire au minimum 260x260 pour les icones et 440x440 pour les medaillons. Plus petit = perdu dans le cadre.

### Gemini genere du texte inutilement
Toujours insister "no text, no letters, no numerals" dans le prompt. Le texte est ajoute dans Remotion pour avoir la typographie exacte et animable.

---

## Timing d'une scene type (reference Soundjata Charte)

Duree totale : 20.56s (617 frames)

| Sub-scene | Duree | Notes |
|-----------|-------|-------|
| empireFonde (carte) | 5.12s | Scene "wide" pour etablir — plein ecran carte Gemini + titre + sous-titre animes |
| extraordinaire (transition) | 2.52s | Pause respiration avant le contenu principal |
| charte (titre principal) | 4.18s | Date + titre principal + sous-titre (3 animations echelonnees) |
| quaranteQuatre (chiffre) | 1.36s | Chiffre geant stamp-in (tres court, punch) |
| droitsArticles (liste icones) | 4.00s | 3 icones qui apparaissent en sequence (delay 30f entre chaque) |
| huitCents (comparaison) | 3.38s | 2 medaillons + texte "800 ANS" en gros |

**Regle** : chaque sub-scene doit caler sur une PHRASE de la narratrice. Pas de phrase qui dechire entre deux sub-scenes.

---

## Typographie

**Police retenue** : Cormorant Garamond (serif calligraphique), fallback Palatino/Book Antiqua/Georgia.
Une seule famille pour titre et body, avec poids/italique pour differencier.

**Tailles reference 1080x1920** :
- Titre majuscule principal : 90-110px
- Chiffre "44" gigantesque : 280px
- Sous-titre italique : 44-54px
- Date/decoration : 40-44px
- Label icone : 54-58px

---

## Assets reutilisables series

Une fois generes pour Soundjata, ces assets sont reutilisables pour d'autres episodes de la serie :

- `parchment-bg.png` — fond sobre universel
- Icones symboliques (vie, protection, dignite) — reutilisables pour Yaa Asantewaa, Nzinga, etc.
- Medaillons Mali/Occident — specifiques Soundjata uniquement

A considerer pour chaque nouvel episode : quels assets existants on peut reutiliser, quels nouveaux assets sont specifiques.
