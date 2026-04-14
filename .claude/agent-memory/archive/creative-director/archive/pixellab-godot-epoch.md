# Creative Director — Archive Epoch PixelLab/Godot (2026-02-17 à 2026-02-20)

> ARCHIVÉ 2026-02-22. Style abandonné. Conservé pour référence historique uniquement.
> NE PAS utiliser ces règles pour le projet Peste 1347 actuel (SVG enluminure).

---

## Architecture Decision (confirmed 2026-02-17)
- Side-view cinematic parallax replaces top-down painted background approach
- Top-down failed 10+ times due to ambiguous ground plane + painted bg compositing
- Side-view: unambiguous ground line, flipX for directions, 5-6 parallax layers
- All character sprites need regeneration: view="side", east+west walk only
- Slow lane-based walking is the approved movement pattern (not freeze, not scatter)

## Pipeline B Decision (confirmed 2026-02-18 — FINALE)
- Godot = moteur de rendu pour toutes les scenes animees (vrai ground plane Y=943)
- Remotion = text overlays + audio sync + export final UNIQUEMENT
- Plus de CSS sprites sur image peinte (10+ echecs documentes)
- write-movie Godot = feedback visuel headless (Metal GPU, PNG sequences)
- Formule ancrage pied : GROUND_Y - PIVOT_Y_NATIVE * SCALE (pas de centering en PIL)
- PIVOT_Y_NATIVE = 56 (pixel opaque le plus bas sur canvas 64px = bas de la semelle)
- FOOT_OFFSET_Y = -(56-32) = -24 en natif Godot (avec scale=3, pieds exactement sur GROUND_Y)

## Godot Pipeline Rules (2026-02-18)
- Bâtiments : position.y = GROUND_Y - lowest_opaque_pixel * scale (calcul PIL pour chaque asset)
  - house-timbered : 943 - 121*4 = 459
  - church : 943 - 119*4 = 467
  - inn : 943 - 105*4 = 523
- NPC position.y = GROUND_Y exactement (Godot centered=false + offset Vector2(0,-24))
- Tileset via TileMapLayer ou Sprite2D repeat=Enabled (PAS TextureRect)
- Project settings > Rendering > Textures > Default Texture Filter = Nearest (OBLIGATOIRE)
- write-movie commande : `Godot --write-movie /path/frame.png --fixed-fps 30 --quit-after N`
- Circuit breaker Godot : reset via .claude/circuit-breaker-state.json (supprimer la cle du fichier scene)

## Direction Briefs History (Epoch PixelLab)

### 2026-02-17 - Scenes 6+7 (hook_06_reveal + hook_07_reflexes) - Side-view approach
- Verdict: NEEDS ANSWERS (3 questions) + NEEDS ASSETS (8 chars to regenerate)
- Key finding: ALL 8 characters are low top-down view, ZERO are usable for side-view
- Key finding: cobblestone tileset + painted bg are top-down, cannot be reused
- Proposed: 5-layer parallax, slow lane-walking, dramatic = lighting not action
- Questions pending: num of chars on screen, shared bg scenes 6+7, text style
- Full brief: `.claude/agent-memory/shared/PIPELINE.md` Stage 1

### 2026-02-17 - Background PixelLab (Layers 2, 3, 4)
- Layer 1 (ciel CSS) : CONSERVE (gradient valide, Kimi approuve)
- Layer 2 (silhouettes) : 3x map_object, width=96, height=80, flat shading, no outline, view=side
- Layer 3 (facades) : 3x map_object, width=120, height=96, basic shading, single color black outline, view=side
- Layer 4 (sol) : 1x sidescroller_tileset, tile_size=16x16 (upscale 4x=64px)
- Budget: 7 credits, ~10 min
- Cobblestone existant INUTILISABLE (view="high top-down" confirme metadata.json)
- REGLE: 100% PixelLab, pas GothicVania
- Full brief: PIPELINE.md Stage 1b

### 2026-02-17 - Preflight hook-bloc1-sideview.mp4
- Verdict: GO avec 1 correction recommandee (black cut overlap Issue #1)
- Architecture side-view: VALIDE (3 lanes, z-index, timing)
- Background CSS placeholder: safe (pas de painted-bg pattern)

### 2026-02-17 - Final Verdict hook-bloc1-sideview.mp4 (apres Kimi score 6.5/10)
- Verdict: MINOR FIX (pas RE-EVALUATE, pas APPROVE)
- Raisonnement: 6.5 = score du CSS placeholder, pas de l'architecture
- Fix 1: drop-shadow NPCs (contraste background, 15 min)
- Fix 2: parallaxe translateX buildings (profondeur, 20 min)
- Refuse: vignette radiale (masque le probleme), rebuild CSS bg (placeholder temporaire)
- Architecture validee: side-view pipeline fonctionne, pas de circuit breaker

## Error Patterns (Epoch PixelLab)
| Pattern | Count | Last Seen | Status |
|---------|-------|-----------|--------|
| Sprites on painted bg | 10+ | 2026-02-18 | RESOLVED via Godot |
| TextureRect cobblestone broken | 1 | 2026-02-18 | Utiliser Sprite2D repeat=Enabled |
| Headless Godot viewport null | 1 | 2026-02-18 | Utiliser --write-movie |
| Building position formula fausse | 1 | 2026-02-18 | centered=false + offset FAUX. Formule correcte ci-dessus |
| NPCs invisibles en headless | 1 | 2026-02-19 | PNG sans .import sidecar. Toujours générer .import + --import |
| Godot binary disparu | 2 | 2026-02-19 | Downloads/Godot.app vide entre sessions. Restaurer ZIP |
| NPC scale trop grand | 1 | 2026-02-19 | scale=5 rejeté. scale=3 correct |
| Aseprite CLI Steam vs DMG | 1 | 2026-02-19 | /Applications = Steam (pas de CLI). CLI = DMG /Volumes/ |
