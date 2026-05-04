# Hannibal — Décisions post-Jury Pass 1
> Date : 2026-05-04. Validé Aziz.

---

## Décisions architecturales

### Projection carte Méditerranée
**DÉCIDÉ : Option A + C combinées**
- Hook (5s) : vue large Méd (contexte global visible) — Option C
- Beat 2 onwards : pan progressif sud→nord (Espagne→Alpes→Italie) — Option A
- Jamais de projection rotée NW-SE (R&D non validée, risque trop élevé)

### Hook visuel
**DÉCIDÉ : Tester fond noir d'abord**
- Option fond noir : typographie cinématographique 100% Remotion pur. Chaque ligne = impact visuel (flash + spring opacity). SFX percussion sur chaque ligne.
- Option carte : si fond noir décevant au visionnage, fallback carte dès le départ
- Coder les deux versions, Aziz choisit au visionnage.

---

## Top 7 idées retenues (Jury Pass 1 → production)

| # | Idée | Outil | Priorité |
|---|------|-------|----------|
| 1 | Sprite-decay éléphants : 37 icônes SVG s'éteignent 1 à 1, dernier pulse or | SVG + interpolate() | MUST HAVE |
| 2 | FocusBubble nuit sur le rocher escarpé (Allobroges) | FocusBubble _shared/ | MUST HAVE |
| 3 | Compteur numérique gros plan 46 000 → 20 000 | StatGauge | MUST HAVE |
| 4 | Beat 3 structuré en 4 sous-séquences de ~6s | Multi-Sequence | MUST HAVE |
| 5 | Barre d'altitude HUD (voir règle ci-dessous) | StatGauge SVG vertical | CONDITIONNEL |
| 6 | Dutch tilt + vibration vinaigre (3-5°) | transform + spring() | NICE TO HAVE |
| 7 | Dolly-out révèle "ITALIA" + plaine du Pô fin Beat 4 | interpolate() | NICE TO HAVE |

**En réserve Pass 2** : bezier Rhône animé (Beat 2 optionnel), trait pointillé doré "cicatrice"

---

## Règle barre d'altitude HUD (correction leçon Empire Ghana balance)

**PROBLÈME IDENTIFIÉ** : Empire Ghana avait une balance permanente à l'écran — erreur. Un HUD permanent qui "est là pour être là" perd son sens.

**RÈGLE POUR HANNIBAL** :
- La barre d'altitude apparaît **ponctuellement**, pas en permanence
- Elle doit marquer un **moment significatif** (ex: arrivée au col, pic de l'ascension)
- Quand elle apparaît : grand, visible, overlay bien lisible — pas discrète
- Pattern : apparaît → remplit la jauge → disparaît (comme une confirmation RPG)
- Couplée idéalement à la narration ("Après neuf jours de montée, le col est atteint")

**Ne PAS** : barre visible en fond pendant toute la traversée comme un altimètre permanent

---

## Corrections mémoire appliquées (2026-05-04)

### vary_object ≠ animate_object (correction Lab Phase 2)
- Le "saccadé" Lab Phase 2 était dû à `vary_object` (états statiques), PAS à animate_object
- `animate_object` (4-8 frames, description action) = fluide — prouvé chameaux + ville Koumbi
- Pour rocher vinaigre : `animate_object("rock cracks and splits", frame_count=6)` = difficulté MOYENNE, pas HAUTE
- Pour éléphant sur radeau : générer un state composite "éléphant sur radeau de bois" + animate_object pour traversée = correct

### Radeau Rhône — approche correcte
- Générer 1 asset PixelLab "éléphant sur radeau" (pas assembler 2 assets en temps réel)
- Animer ce state sur bezier SVG du Rhône (fleuve tracé d3-geo Natural Earth)
- FocusBubble zoom sur zone Rhône pour rendre le fleuve visible à l'échelle
- Difficulté : MOYENNE (pas HAUTE comme évalué initialement)
