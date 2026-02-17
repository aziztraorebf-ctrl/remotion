# PixelLab Prompts - Peste 1347

## Rules (EVERY prompt must follow these)

1. **Perspective**: `low top-down, facing south` -- NEVER change this
2. **Outline**: `single color black outline` -- consistency
3. **Shading**: `medium shading` -- not flat, not over-detailed
4. **No background**: Characters ALWAYS on transparent background
5. **Objects visible**: `object clearly visible all directions, held in foreground hand`
6. **Style reference**: Children of Morta / Eastward / Wytchwood -- pixel art dramatique, pas cartoon

---

## Luminance Profiles

### Alpha (Segments 1-2: Life before plague)
```
bright warm afternoon, golden hour light, high saturation, clear sky, warm ochre tones
```

### Miasme (Segments 3-4: Plague arrives)
```
overcast sky, greenish tint, desaturated colors, sickly atmosphere, muted earth tones
```

### Neant (Segments 5-7: Death and aftermath)
```
pitch black night, flickering torchlight only, high contrast, deep shadows, cold blue undertones
```

---

## Characters - Validated Prompts

### Paysan (homme)
```
medieval european peasant man, 14th century, brown tunic, simple cloth pants, leather shoes, tired expression, weathered face
```
- Size: 56x56
- Directions: 4 (S, E, N, W)
- Animations: idle, walk, run, panic, collapse

### Paysanne (femme)
```
medieval european peasant woman, 14th century, long brown dress, white head covering, carrying wicker basket, object clearly visible all directions held in foreground hand
```
- Size: 56x56
- Directions: 4
- Animations: idle, walk, run, hide_face, pray

### Marchand
```
medieval merchant, 14th century, colorful surcoat with embroidery, leather belt with pouches, fur-trimmed cap, confident posture
```
- Size: 56x56
- Directions: 4
- Animations: idle, walk, point_finger, panic

### Moine franciscain
```
franciscan monk, 14th century, brown hooded robe with rope belt, tonsured head, wooden cross necklace, humble posture
```
- Size: 56x56
- Directions: 4
- Animations: idle, walk, pray, carry

### Medecin de la peste
```
plague doctor, 14th century, long black leather robe, beaked mask filled with herbs, wide-brimmed hat, walking staff in hand, object clearly visible all directions
```
- Size: 56x56
- Directions: 4
- Animations: idle, walk

### Noble
```
medieval noble lord, 14th century, rich velvet doublet in deep red, fur-lined cloak, gold chain of office, feathered hat
```
- Size: 56x56
- Directions: 4
- Animations: idle, walk, point_finger

### Enfant
```
medieval peasant child, 14th century, simple short tunic, barefoot, messy hair, small stature about half adult height
```
- Size: 40x40 (smaller than adults)
- Directions: 4
- Animations: idle, walk, run

---

## Tilesets - Top-Down

### Place du village (cobblestones)
```
lower: "packed dirt ground, medieval, worn"
upper: "cobblestone road, medieval european, weathered gray stones"
```

### Transition place -> herbe
```
lower: "cobblestone road, medieval european"
upper: "grass and weeds, overgrown, medieval"
```

### Transition herbe -> terre
```
lower: "grass, green, medieval countryside"
upper: "dry dirt path, medieval, dusty"
```

---

## Map Objects

### Fontaine
```
medieval stone fountain with running water, ornate carved basin, moss-covered base, low top-down view
```

### Etal de marche
```
medieval market stall, wooden frame with canvas cover, displaying fruits and bread, baskets on ground
```

### Charrette
```
medieval wooden cart with two wheels, half-loaded with hay bales, worn and weathered
```

### Puits
```
medieval stone well with wooden bucket and rope, low stone wall around opening
```

### Tonneau
```
medieval wooden barrel, iron bands, slightly worn, standing upright
```

### Cadavre (Segments 3+)
```
dead body lying on ground, medieval clothing, face down, dark stain around body, tragic pose
```

### Bucher (Segment 5+)
```
burning funeral pyre, stacked wooden logs, dark smoke rising, medieval setting
```

---

## Group Sprites (static, for background crowd)

### Groupe de villageois discutant
```
group of 3-4 medieval peasants standing close together talking, varied clothing colors, natural poses, seen from low top-down view, on transparent background
```
- Size: 128x64
- Usage: Background layer, no animation needed

### Groupe de marchands
```
group of 2-3 medieval merchants at market stall, one gesturing, varied goods visible, low top-down view, on transparent background
```
- Size: 128x64

---

## Interaction Sprites (emotional, for key moments)

### Villageois pointant du doigt
```
medieval peasant pointing finger accusingly to the right, angry expression, other hand clenched in fist, dramatic pose
```
- Animations: 4-8 frames

### Villageois se cachant le visage
```
medieval peasant covering face with both hands, hunched shoulders, grief-stricken pose
```
- Animations: 4-8 frames

### Villageois en priere
```
medieval peasant kneeling in prayer, hands clasped together raised to sky, desperate expression
```
- Animations: 4-8 frames

### Villageois qui s'effondre
```
medieval peasant collapsing to the ground, clutching stomach, falling to knees then face down
```
- Animations: 8-12 frames

---

## Palette Hex (inject via color_image or prompt)

```
Skin: #E8C8A0, #C4956A, #8B6344
Cloth: #5C3A1E, #BFA67A, #8B2020, #2B4570, #3B5E3B, #5A5A5A
Environment: #6B6B6B, #8B7355, #6B4226, #8B8B7A, #A08050
Atmosphere: #87CEEB, #CC7744, #0A0A1A, #FFB347
```
