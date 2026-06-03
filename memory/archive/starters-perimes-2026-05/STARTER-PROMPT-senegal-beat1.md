# STARTER PROMPT — Session Sénégal Pétrole & Gaz — Beat 1

## Contexte rapide

On construit un épisode mid-form 7 minutes sur le pétrole sénégalais.
Stack : Remotion + Mapbox GL + Tailwind + d3-geo.
Format : 1920x1080, 30fps, audio 420s.

La session précédente (2026-05-20) a posé les fondations :
- timing.ts recalibré (zéro estimation, 100% audio-dérivé)
- Storyboard Beat 1 validé (5 panels)
- Composants UI premium codés mais pas encore extraits en shared
- Fond standard épisode : grain SVG navy (TestTextureB.tsx)

**On n'a pas encore écrit une seule ligne du vrai Beat 1.**

---

## Tâche principale de cette session

Construire `Beat1AnomalieV4.tsx` — Acte 1 complet, 43.3s (f0→f1299).

---

## Ordre de travail OBLIGATOIRE

### Étape 0 — Lire avant tout (5 min)
- `memory/NEXT-SESSION-senegal-petrole-gaz-beat1.md`
- `memory/episodes/souverain/senegal-petrole-gaz/SESSION-2026-05-20.md`
- `memory/feedback_premium-visual-guidelines.md`
- `src/projects/souverain/senegal-petrole-gaz/timing.ts` (ancres frames)
- Dashboard templates : `dashboard/templates-souverain.html`

### Étape 1 — Intégration Mapbox Storytelling (15 min)
Créer `src/projects/souverain/senegal-petrole-gaz/camera-chapters.ts` :
- Structure JSON inspirée de https://github.com/mapbox/storytelling
- Adapté Remotion : chapitres définis par plages de frames, pas par scroll
- Pas de npm install — pattern pur, zéro dépendance externe
- Couvrir les 3 phases caméra de Beat 1 :
  - Chapter 1 (f0→f180) : Atlantique large, zoom=3, pitch=0, bearing=0
  - Chapter 2 (f180→f555) : Zoom Sénégal côte, zoom=6, pitch=20, bearing=-10
  - Chapter 3 (f555→f1299) : Zoom champs offshore Sangomar/GTA, zoom=8, pitch=40

### Étape 2 — Audit templates existants (15 min)
Avant de coder quoi que ce soit, mapper les 5 panels du storyboard vers des templates déjà dans notre bibliothèque :
- Ouvrir `public/_shared/ASSETS-INDEX.md`
- Pour chaque panel : "existe-t-il un template qu'on peut réutiliser ?"
- Ne coder que ce qui manque vraiment

### Étape 3 — Extraire shared components (20 min)
Depuis `TestWaveReveal.tsx` et `TestTextureB.tsx`, extraire vers `src/projects/_shared/components/ui/` :
- `GoldLine.tsx`
- `CountUp.tsx`
- `Badge.tsx`
- `Baseline.tsx`
- `SVGGrain.tsx`

### Étape 4 — Coder Beat1AnomalieV4.tsx
En utilisant :
- `camera-chapters.ts` pour les mouvements Mapbox
- Shared components extraits à l'étape 3
- Templates existants identifiés à l'étape 2
- Fond SVGGrain navy pour TOUS les panels non-Mapbox
- Audio startFrom=0 (beat standalone)
- premountFor={fps} sur toutes les Sequence

### Étape 5 — Render + review
- `./scripts/render-mapbox.sh SPG-Beat1-V4 out/episodes/senegal-petrole-gaz/wip/beat1_v1.mp4`
- Extraire 5 frames, regarder soi-même avant de présenter
- Upload catbox + ntfy

---

## Storyboard de référence

https://files.catbox.moe/17jwte.jpg

Panel 1 (f0→f180) — Carte Atlantique large. Texte : "TOUT COMMENCE PAR UN CHIFFRE."
Panel 2 (f180→f555) — Zoom Sénégal + 2 dots blancs : Sangomar + GTA. Sous-titre actif.
Panel 3 (f555→f871) — BigStat reveal : $8,000,000 / JOUR. CountUp + glow + GoldLine + Badge.
Panel 4 (f871→f1119) — Retour carte. Badge amber "L'ÉTAT N'EST PAS CERTAIN DU MONTANT EXACT".
Panel 5 (f1119→f1299) — Fond dark. Texte centré : "UNE MÉCANIQUE À TESTER EN DIRECT."

---

## Ancres timing (extrait de timing.ts)

```
BEAT_DUR          = 1299 frames (43.3s)
bigstatReveal     = f555  (18.5s)  ← countUp démarre ici
contradictionBeat = f871  (29.04s) ← badge "L'ÉTAT N'EST PAS CERTAIN"
thesisIntro       = f1119 (37.3s)  ← panel 5 thesis
acte1LastWord     = f1260 (42.0s)  ← dernier mot VO
```

---

## Charte graphique épisode

```
Fond        : #0b1f35 (navy) + grain SVG feTurbulence (seed=2, baseFrequency=0.72)
Or          : #d4a93c
Texte       : #f5f0e8 (ivoire)
Badge rouge : #5a1010 / border #8b2020
Badge amber : #7a4a10 / border #c47a20
Sous-titres : barre noire semi-transparente, mot courant en #d4a93c
Mapbox style: dark-v11 (ou style GeoAfrique V5 si disponible)
Sénégal fill: #d4a93c (or)
Dots offshore: blanc, radius 8px, pulse SVG
```

---

## Règles non-négociables

- R1 : max 8s sans changement visible — chaque panel doit avoir du mouvement
- Mapbox : `map.jumpTo()` AVANT `map.project()` dans le même useEffect
- Render Mapbox : `./scripts/render-mapbox.sh` — jamais `npx remotion render` direct
- Audio : `startFrom={0}`, `trimAfter={1299}` sur le beat standalone
- Tailwind : zéro couleur/spacing inline si token existe
- Pas de vague verte — OilLevelBg rejetée (ressemble à de l'herbe)

---

## Références visuelles

- Notre meilleur rendu actuel (fond grain + countUp) : https://files.catbox.moe/9rgo1k.mp4
- Or Africain (niveau de référence à atteindre) : out/PRET-PUBLICATION/or-africain-FINAL.mp4
- Guidelines Polymatters/Vox/Harris : `memory/feedback_premium-visual-guidelines.md`
