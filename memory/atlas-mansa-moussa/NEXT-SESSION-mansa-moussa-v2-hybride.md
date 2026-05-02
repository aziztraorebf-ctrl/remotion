---
name: NEXT SESSION - Mansa Moussa V2 hybride (cartes statiques + Remotion compositing)
description: Pivot architectural majeur. Abandon Mapbox-gl runtime, passage 100% statique + Remotion. Tous assets V1 reutilisables. Brief self-contained.
type: project
---

# NEXT SESSION — Atlas Mansa Moussa V2 hybride

> Cree : 2026-04-29 fin session V1
> Statut : V1 livree et validee satisfaisante par Aziz, V2 demandee
> Ce brief est self-contained — toute info necessaire pour reprendre

---

## CONTEXTE — V1 livree (NE PAS REFAIRE)

### V1 (2026-04-29) — Pipeline Mapbox-gl runtime

- **URL V1** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/wip/showcase-v1-jLa2TD5cGTG1VCmaw77RQytNODfrGi.mp4
- **Duree** : 81.04s (2446 frames @ 30fps, 1080x1920)
- **Cout** : $0.52 (ElevenLabs $0.052 + Kimi $0.015 + Minimax $0.10 + Gemini $0.35)
- **Fichier composition** : `quebec-jacques-poc/src/AtlasMansaMoussaShowcase.tsx`
- **Render time** : ~12 min
- **Verdict Aziz** : satisfaisante mais veut V2 hybride avant publication

### Verdict V1 — pourquoi V2 necessaire

Probleme identifie : Mapbox-gl runtime cree des saccades aux switch globe->mercator + manque de flexibilite creative (pas de personnages animes sur la carte, style cartographique fige). Aziz a analyse une video reference (https://youtube.com/shorts/-VWk5IDn3CA - Hundred Years War) qui utilise un pipeline statique et est visuellement bien plus dynamique.

---

## DECISION ARCHITECTURALE V2 — VALIDEE 2026-04-29

**Pivot** : abandon Mapbox-gl runtime, passage 100% Remotion compositing avec cartes statiques pre-rendues.

### Pourquoi (insights Aziz session courante)
1. **Flexibilite creative** : carte vierge = canvas total, possibilite de colorier pays, ajouter personnages chibi, animer effets
2. **Vitesse perçue** : transformations CSS/SVG sur images fixes = 60fps natif
3. **Identite de marque** : controle total sur palette + style + composition
4. **Mouvements camera = illusion** : `scale + translate` sur image fixe simule "vol au-dessus du Sahara" sans Mapbox-gl
5. **Reutilisable pour TOUS futurs Atlas** : un seul investissement architectural amortit sur Songhai, Ghana, Aksoum, Kanem-Bornou, etc.

### Pattern technique observe dans la reference (Hundred Years War)

**Cartes** : 3 styles different intercales dans le meme Short
- Type A : Carte satellite (Google Earth tilt 60-70°) - intro + scenes modernes
- Type B : Carte parchemin / old map - climax narratif
- Type C : Vue aerienne ville - scenes locales (batailles, evenements)

**Overlays sur cartes** :
- Pays colories en aplats opacity 0.7-0.8 (rouge/bleu/jaune)
- Personnages chibi/PNG flat illustration
- Drapeaux flottants animes (translation Y + rotation breathing)
- Labels typographiques Cinzel/serif italique blanc + ombre noire
- Fleches directionnelles blanches pour mouvements
- Sous-titres karaoke TikTok mot-par-mot

**Scenes narratives intercales (sans carte)** :
- Personnages chibi sur fond realiste flou (village, champ bataille, foret)
- Effets visuels (flammes, fumee, brouillard) en surimpression
- Cuts directs entre carte et scene (pas de transition complexe)

**Rythme** :
- Cuts toutes les 3-5s
- Camera quasi-statique sur chaque plan
- Dynamisme = animation overlays + sous-titres karaoke

---

## 4 TYPES D'ANIMATION IDENTIFIES (REUTILISABLES)

### Type 1 — Transform CSS-like (le plus courant)
PNG unique + transforms en boucle (translate Y ±3px + rotate ±2° + scale ±0.05) sur 30-60 frames. Donne illusion "vivant" sans frames multiples.

```tsx
const breathingY = Math.sin(frame * 0.15) * 4;
const breathingRotate = Math.sin(frame * 0.1) * 2;
<Img style={{ transform: `translate(${posX}px, ${posY + breathingY}px) rotate(${breathingRotate}deg)` }} />
```

**Usage Mansa Moussa V2** : drapeau Mali ondulation, pulse markers, breathing personnages.

### Type 2 — Spritesheet frames multiples
4-8 PNG cycles joues a 12fps. Utilise pour anim complexes (archer qui tire).

```tsx
const frameIndex = Math.floor((frame % 24) / 6);
<Img src={staticFile(`characters/archer-${frameIndex}.png`)} />
```

**Usage Mansa Moussa V2** : skip pour V2, pas necessaire.

### Type 3 — Trajectoire courbe Bezier
PNG fixe + position calculee le long d'une courbe + rotation tangente.

```tsx
const t = interpolate(frame, [T.hadjStart, T.caireArrival], [0, 1]);
const pathPoint = pathRef.current.getPointAtLength(t * pathTotalLength);
```

**Usage Mansa Moussa V2** : caravane chibi qui voyage Mali -> Caire -> Mecque.

### Type 4 — Apparition spring + breathing
Apparition spring scale 0->1 sur 0.5s + Type 1 breathing apres apparu.

**Usage Mansa Moussa V2** : Mansa Moussa chibi apparait scene 1, marchand cairote scene 4 (optionnel).

---

## ARCHITECTURE V2 PROPOSEE

### Cartes statiques a generer (Recraft ou Gemini)

| Carte | Usage scenes | Style | Cout |
|-------|--------------|-------|------|
| C1 — Afrique de l'Ouest XIVe parchemin | 1-2 (Empire + Sankore) | Parchemin Mande sepia | ~$0.07 |
| C2 — Sahara + Mediterranee + Egypte | 3-4 (caravane + Caire) | Parchemin Mande wide | ~$0.07 |
| C3 — Caire close-up (optionnel) | 4 (effondrement) | Parchemin Mande | ~$0.07 |

**Total cartes** : $0.14 - $0.21

### Personnages PNG transparents

| PNG | Usage | Type anim | Cout |
|-----|-------|-----------|------|
| Caravane chibi (chameau + cavalier Mande) | Scene 3 trajectoire | Type 3 + Type 1 | ~$0.07 |
| Mansa Moussa chibi mini (different des portraits A/B) | Scene 1 carte | Type 4 + Type 1 | ~$0.07 |
| Pepite or | Scene 4 pulse Caire | Type 1 SVG pur | $0 |
| Marchand cairote effrayé (optionnel) | Scene 4 effondrement | Type 4 | ~$0.07 (skip V2 simple) |

**Total personnages** : $0.14 - $0.21

### Reutilisable de V1 (DEJA GENERES, NE PAS REFAIRE)

- Audio : narration v3 + 4 SFX + musique Minimax C
- Forced alignment : `narration-v3-alignment.json`
- timing.ts : `src/timing-mansa-moussa.ts`
- Portraits CTA : `mansa-portrait-A-v2-canonique.png` + `mansa-portrait-B-v2-canonique-trone.png`
- Medaillon Gizeh : `gizeh-medallion.png`
- Polygones GeoJSON : `mali-polygon.json` (moderne) + `mali-empire-1300-polygon.json` + `egypt-polygon.json`

### Fichiers composition

- **Nouveau fichier** : `quebec-jacques-poc/src/AtlasMansaMoussaShowcaseV2.tsx`
- **Garder V1** : `AtlasMansaMoussaShowcase.tsx` reste comme reference architecturale

### Sous-titres TikTok karaoke
- Pattern reutilisable : `memory/templates/subtitles-shorts.md` (Sonjata)
- Source : `narration-v3-alignment.json` (deja genere V1)
- Implementation : SVG text avec opacity interpolate par mot
- Theme couleur : or `#D4A574` ou parchemin `#F2E5C8`

---

## COUT V2 ESTIME

| Poste | Cout |
|-------|------|
| 2-3 cartes statiques Recraft/Gemini | $0.14 - $0.21 |
| 2 personnages chibi (caravane + Mansa mini) | $0.14 |
| Sous-titres (recyclage alignment) | $0 |
| **Total V2 additionnel** | **$0.28 - $0.35** |

Cumule V1 + V2 : ~$0.80 - $0.87. Reste raisonnable.

---

## TEMPS V2 ESTIME

| Tache | Duree |
|-------|-------|
| Generer + valider 2-3 cartes statiques | 30-45 min |
| Generer 2 personnages chibi PNG | 15-20 min |
| Recriture composition Remotion architecture cuts | 90-120 min |
| Sous-titres karaoke (adapter pattern Sonjata) | 30-45 min |
| Mini-renders validation par scene | 30 min |
| Render final + upload Vercel | 20 min |
| **Total** | **3h30 - 4h30** |

80% du code sera reutilisable pour futurs Atlas.

---

## STARTER PROMPT NEXT SESSION

```
Charge la memoire de session :
1. MEMORY.md (auto-charge)
2. memory/atlas-mansa-moussa/NEXT-SESSION-mansa-moussa-v2-hybride.md (ce brief)
3. memory/atlas-mansa-moussa/SESSION-2026-04-29-LEARNINGS.md (apprentissages session V1)
4. memory/atlas-mansa-moussa/RECAP-V1-PRODUCTION.md (recap complet V1)
5. memory/feedback_static-maps-vs-mapbox-runtime.md (decision pivot)

Session Atlas Mansa Moussa V2 hybride.

V1 livree et validee satisfaisante mais Aziz veut V2 avec pivot architectural :
- Cartes statiques pre-rendues au lieu de Mapbox-gl runtime
- Personnages chibi PNG animes sur la carte (caravane Mali->Mecque)
- Sous-titres TikTok karaoke
- Reference visuelle : `research/reference-shorts/ref-france-england.webm`
  (Hundred Years War Short - pattern observe documente dans le brief)

Action prioritaire :
1. Generer 1 carte statique test (parchemin Mande Afrique Ouest) pour valider style
2. Si OK, lancer pipeline complet V2

Audio + portraits A/B + medaillon Gizeh + timing.ts + GeoJSON polygones = TOUS reutilisables de V1.
Pas refaire ce qui existe.
```

---

## DECISIONS DEJA ACTEES (NE PAS REOUVRIR)

1. Pivot architectural Mapbox-gl runtime -> Remotion compositing statique : **valide**
2. Style cartes statiques : **parchemin Mande** (coherent V1 + identite GeoAfrique forte)
3. Sous-titres TikTok karaoke : **OUI** en V2
4. Portraits A v2 + B v2 cross-fade scene 5 : **conserves V1, reutiliser tels quels**
5. Empire Mali 1300 (Historical Basemaps) overlay SVG : **conserve, reutilisable**
6. Voie hybride 98% statique / 2% Mapbox globe : **abandonnee** — full statique simplifie tout
7. Publication V1 : **en attente de V2** pour comparaison avant publication

---

## RISQUES IDENTIFIES

1. **Coherence visuelle entre cartes statiques** : si on genere 3 cartes separees, risque de drift palette/style. **Mitigation** : utiliser meme prompt de base + parametres Recraft strictes, ou regenerer avec ref de la premiere validee.

2. **Personnages chibi qui ne respectent pas le canon GeoAfrique** : risque rupture style. **Mitigation** : utiliser char-ref Abou Bakari + portrait Mansa Moussa A/B comme references Gemini.

3. **Sous-titres karaoke trop denses (170 mots / 81s)** : risque pollution visuelle. **Mitigation** : tester 1 scene en mini-render avant de pousser sur tout.

4. **Performance render** : V1 a render 81s en 12min. V2 statique devrait etre PLUS rapide (pas de tiles loading). A confirmer.

---

## A NE PAS OUBLIER NEXT SESSION

- Mettre a jour `atlas-template-v1.md` -> `atlas-template-v2.md` une fois V2 validee
- Documenter pattern "carte statique + chibi + karaoke" comme nouveau standard Atlas
- Archiver V1 URL en reference architecturale historique
- Comparer rendu V1 vs V2 cote a cote pour validation Aziz
