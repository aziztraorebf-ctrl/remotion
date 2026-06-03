---
name: pattern-or-africain-plaques-relief-sfx
description: 3 décisions validées d'après l'analyse de Or Africain (1:05-1:22) — plaques GeoCountryPlaque, relief pitch 32, plancher SFX 0.50.
metadata:
  type: feedback
---

## Analyse Or Africain (out/PRET-PUBLICATION/or-africain-FINAL.mp4, segment 1:05→1:22 = Beat4LeTwist) — 2026-06-03

Aziz a identifié 3 choses excellentes dans Or Africain à généraliser. Code source : `src/_archive/episodes-livres/souverain/or-africain/Beat4LeTwist.tsx`.

### 1. PLAQUES PAYS (CountryCard) → `GeoCountryPlaque` (NOUVEAU composant partagé)

**Why:** Aziz adore la plaque "MALI" + encart "$430M / saisis à Barrick — Bloomberg, nov. 2025" + compteur "2/4". C'est une manière ÉPURÉE d'afficher nom + donnée + SOURCE, au lieu de tout jeter sur la carte (dots+labels partout).

**How to apply:** `src/projects/_shared/mapbox/GeoCountryPlaque.tsx` — 3 composants : `GeoCountryPlaque` (pilule nom + stat serif gold + source mono), `GeoProgressCounter` (X/N + label), `GeoClimaxOverlay` (gros titre gold glow + carte assombrie, type "4 PAYS. UN MÊME SIGNAL."). Showcase : https://files.catbox.moe/8ww81g.mp4
**RÈGLE Aziz : complément aux dots, PAS un remplaçant.** On garde tous nos dots/templates. On choisit dots OU plaque selon ce qui équilibre le mieux. La plaque brille surtout quand on doit MONTRER UNE SOURCE.

### 2. RELIEF 3D = le PITCH (inclinaison caméra), pas un terrain 3D

**Why:** Aziz a remarqué qu'Or Africain a "plus de relief" que Maroc Batteries. Cause exacte : Or Africain Beat4 = `pitch 25-35°` (CAM_GHANA_HOLD 25, MALI 30, BURKINA 35, NIGER 30). Maroc Beat0 (SweepRevealTerritory) + Beat1 = `pitch: 0` PARTOUT → carte plate, relief perdu. AUCUN terrain 3D/extrusion dans les deux — c'est juste l'inclinaison.

**How to apply:** `camCountryApproach(center, {bearing})` dans `MapboxBase.tsx` → zoom 4.7, pitch 32, léger bearing. Décision Aziz : appliquer aux **FUTURS beats seulement** (Beat0/Beat1 Maroc restent validés tels quels, pas de re-render). Standard pour focus 1-4 pays. Pull back climax : `CAM_MULTI_PULLBACK_DEFAULTS` (zoom 3.4, pitch 15). Tension avec règle Playbook P2bis "altitude plate pour lisibilité" → le pitch 32 prime pour le relief sur les focus pays.

### 3. SFX — PLANCHER 0.50 (Aziz doit toujours monter le son)

**Why:** Aziz entend très bien les SFX d'Or Africain même sur haut-parleur, mais doit toujours monter le son ailleurs. Cause : l'ancienne doctrine "SFX UI 0.25-0.35" était trop basse. Or Africain ping = 0.35 (haut de fourchette). Maroc Beat0/1 avait déjà débordé à 0.42-0.55 (c'est pour ça qu'ils s'entendent).

**How to apply:** DOCTRINE-SOUVERAIN.md section 6 mise à jour : **SFX plancher 0.50, JAMAIS en dessous** (ping, tick, snap, whoosh, swoosh, drone). Peut monter à 0.60 sur gros moments cinématiques (caméra descend/monte, impact). Musique fond 0.12-0.15 (baisser si elle masque). Le swoosh caméra descend/monte = la référence de volume idéal selon Aziz.

## Note technique relief
Le showcase utilise `applyGeoAfriqueV5` (style épuré) — le relief y paraît un peu moins marqué qu'Or Africain qui utilise `dark-v11` standard. À surveiller : si Aziz veut plus de relief, augmenter pitch à 35-40 ou vérifier que le style custom n'aplatit pas. [[feedback_flagfill-templates-decouverte]]
