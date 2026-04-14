# Scene Composition Archive — Pixel Art Director

## EnluminureGravureProto — hook_03_galeres (2026-02-21) — SVG pur

**Perspective**: Side-view horizontal, galeres gauche→droite, camera statique
**Resolution**: 1920x1080 SVG natif (pas de pixel scaling)
**7 layers** : ciel (Z0), nuages (Z10), horizon (Z20), mer-fond (Z30), galeres (Z40), vagues-avant (Z50), data overlay (Z9999 HORS feColorMatrix)

**Galeres** : bbox 380-420px large x 280-320px haut = 26-30% ecran. Max 3 simultanees.
**Transition** : feColorMatrix saturate [30,90] 1->0 + bg-color interpolate OBLIGATOIRE en parallele.
**Data overlay** : coin superieur gauche Y=60-130 X=80-200. Barre progress 240px, frame [30,150].
**Warning** : feColorMatrix seul = gris terne. Toujours coupler avec bg-color.
**Verdict** : COMPOSITIONALLY SOUND

---

## Scene Ouverture Village 1347 (2026-02-21) — Remotion side-view

**Perspective**: Side-view, pan horizontal lent gauche->droite (0.9px/frame natif, spring damping=200)
**GROUND_Y**: 943px (87.3% de 1080 — constante immuable projet)
**Resolution**: 480x270 x4 = 1920x1080

**Bâtiments confirmés sur disque** :
- Avant-plan (L50, pied Y=943, speed 1.5x) : house-timbered.png scale x3.2, facade-a.png scale x3.2, facade-c.png scale x3.2, inn.png scale x2.8
- Mid-ground (L30, pied Y=910, speed 1.0x) : inn.png scale x2.2, facade-b.png scale x2.2
- BG silhouettes (L20, opacity 0.5, CSS saturate(0.3) brightness(0.7), speed 0.5x) : church.png scale x1.8, facade-d.png scale x1.5

**NPCs confirmés** (walking east/west 6 frames chacun) :
- peasant-man east 1.8px/fr, peasant-woman west 1.4px/fr, monk east 1.0px/fr, merchant west 1.6px/fr
- Scale x4.5 = 288px hauteur = 40% bâtiment (dans fenêtre 35-50% OK)
- Walk offsets [0, 2, 4, 1]

**child-side** : dossier vide confirmé. DEUX OPTIONS transmises à Aziz :
- Option A : create_character view="side" size=64, CSS scale=0.75 en Remotion
- Option B : retirer mention enfants de la VO

**Palette** (28 couleurs) :
- Ciel : #4A7AB5 → #7DB8E8 → #A8D4F5 → #D4EEF7
- Nuages : #F0EDE8
- Bois colombage : #3D2B1A → #C4956A
- Pierre : #5A5040 → #D4C8A8
- Toit : #5C2020 → #B05540
- Sol cobble : existant (gris + mousse)
- Overlay solaire : rgba(255,220,120,0.12)

**3 effets vivants** :
1. Nuages SVG 3 nuages (vitesses 0.18/0.25/0.30 px/frame)
2. Fumée cheminée CSS (45 frames cycle, color #C8C0B8)
3. Overlay solaire oscillant (0.14-0.22 opacity, 90fr période)

**Texte** : "L'Europe. 1347." frames 0-75 visible + fade 75-90. Font serif bold 96px #F5ECD0. Y=380px.

**Verdict** : COMPOSITIONALLY SOUND (1 blocage narratif = child absent)

---

## Scenes 6 & 7 (hook_06_reveal + hook_07_reflexes) — 2026-02-17

**Perspective**: Side-view cinematic parallax, camera STATIQUE
**Resolution**: 480x270 x4 = 1920x1080
**Ground line**: Y=810px (75% height — ANCIEN, maintenant 943px = référence projet)
**Lanes**: 3 lanes at Y=780/810/840px, 180px minimum spacing
**Color grade S6->S7**: CSS filter hue-rotate(-15deg) saturate(0.85) brightness(0.95)
**Verdict**: COMPOSITIONALLY SOUND (score Kimi 8.0/10 validé)

---

## Village Medieval Isometrique (2026-02-21) — REJECTED

**Proposition**: Scène iso 3/4 avec personnages top-down existants
**Verdict**: WRONG APPROACH — 4 blocages :
1. Sprites `low top-down` incompatibles avec projection iso (même root cause que painted-bg)
2. Bâtiments side-view existants = zero face visible en iso, tous à régénérer
3. Remotion incompatible avec Y-sort dynamique requis par iso (recalcul par frame)
4. Coût régénération : 40min + 10-14 crédits

---

## Village Medieval Phaser3 (2026-02-21) — COMPOSITIONALLY SOUND

**Perspective**: Side-view statique, camera fixe, 4 NPCs traversent le frame
**GROUND_Y**: 943px. Lanes: A=903 (scale 4.5x), B=943 (scale 5.0x), C=983 (scale 5.5x)
**Bâtiments**: house-a/c = x2.6, house-b = x2.2. setOrigin(0.5,1.0), y=GROUND_Y
**Ratio NPC/bâtiment**: 44-49% (fenêtre 35-50% respectée)
**Tint jour**: 0xFFE8C0 (bg), 0xD4B890 (mid), 0xF0D4A0 (buildings), 0xFFEECC (NPCs), 0xE8D4A0 (sol)
**Overlay lumière**: rectangle 0xF4A020 alpha=0.18 depth=400
**Walk cycle**: 12fps, offsets [0,2,4,7]
**Monk PixelLab**: exclu (style clash GothicVania)
