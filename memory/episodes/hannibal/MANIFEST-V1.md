# MANIFEST — Hannibal : Traversée des Alpes — V2
> Validé Aziz 2026-05-05. Source de vérité visuelle AVANT tout code.
> Règle : mouvement caméra toutes les 5-8s maximum. Jamais statique.
> Timing source : `src/projects/atlas/hannibal/timing.ts`
> Format 1080×1920 @30fps

---

## RÈGLE INSERTS (NON-NÉGOCIABLE)

**Insert plein écran ou overlay PixelLab** = uniquement dans 2 cas :
1. La scène est trop complexe pour être rendue de manière convaincante sur la carte avec nos outils actuels (ex: vinaigre sur rocher, intérieur tente)
2. Briser la monotonie carte sur un beat long — max 1-2 inserts par beat, jamais consécutifs

**INTERDIT** : remplacer une scène qui peut être animée sur la carte (sprite sur fleuve, route qui se trace, camera-track personnage) par un insert. Si on peut le faire sur la carte de manière convaincante → on le fait sur la carte.

**Inserts PixelLab > Gemini statique** : toujours préférer un asset PixelLab animé (rotation 360°, pulse, bob) à une illustration Gemini statique. Cohérence style RPG + animation gratuite dans Remotion.

---

## HOOK (frames 2→225 — ~7.4s)
**Script** : "Quarante-six mille soldats entrent dans les Alpes. Vingt mille en ressortent. Quinze jours."

### Version A — Fond noir textuel (cinématographique)
| T | Action | Device |
|---|--------|--------|
| 0s | Fond NOIR_GUERRE total | — |
| 0→2s | "Quarante-six mille" fade-in IVOIRE, Cinzel 84px | Flash-in |
| 2→4s | "Vingt mille en ressortent." swap couleur ROUGE_MORT | Couleur sémantique |
| 4→6s | "Quinze jours." fade-in METAL_FROID | Fade-in |
| 6→7.4s | Tout disparaît | Fade-to-black |

### Version B — Carte sombre + chiffres
| T | Action | Device |
|---|--------|--------|
| 0s | Carte vue `context`, bgOpacity 0.85 | Ken Burns subtil |
| 0→2s | "46 000" JetBrains Mono 120px OR_SOLDAT | Flash-in |
| 2→4s | Swap → "20 000" ROUGE_MORT | Couleur sémantique |
| 4→7.4s | "15 jours" IVOIRE + carte visible | Ken Burns |

> Coder les deux versions. Aziz choisit au visionnage.

---

## BEAT 1 — CONTEXTE (frames 225→641 — ~13.9s)
**Script** : "Nous sommes en deux cent dix-huit avant notre ère. Hannibal Barca, trente ans, commande l'armée carthaginoise en Espagne. Rome le cherche au sud. Il choisit le nord. Par les Alpes. En automne."

| T | Action | Device |
|---|--------|--------|
| 0→3s | Vue `south` — Espagne large, mer visible | Ken Burns actif (drift 4px) |
| 0s | Cartouche "218 av. J.-C." fade-in haut frame | HUD cartouche |
| 0s | Label "Carthagène" + point CARTHAGE pulse breathing | Pulse POI |
| 3→6s | Push-in vers Espagne (1.0→1.8x) — "commande l'armée" | Push-in narratif |
| 4s | Label "ROME" apparaît est, pourpre ROME_VIF | POI reveal |
| 6→8s | **Whip-pan** nord 8 frames + flash blanc 2 frames — "Il choisit le nord" | 🆕 Whip-pan |
| 8→10s | Pan vertical lent nord (carte glisse) — "Par les Alpes" | Pan vertical |
| 10→13s | Route strokeDashoffset Carthagène→Pyrénées | Route animée |
| 13s | **Freeze-frame** 1s sur Pyrénées + label pulse — "En automne." | 🆕 Freeze |

**Musique** : v1-A-marche-punique.mp3, volume 0.15, fade-in 2s

---

## BEAT 2 — LE RHÔNE (frames 641→1546 — ~30.2s)
**Script** : "Avant même les montagnes, il y a le Rhône. Un fleuve large. Un courant violent. Trente-sept éléphants de guerre à faire traverser. Hannibal construit des radeaux de bois recouverts de terre. Les éléphants croient marcher sur une rive. Ils flottent sans le savoir. Mais sur l'autre rive, les Volques les attendent. Hannibal envoie sa cavalerie numide en amont, les prend à revers. Première victoire."

**Scène principale : camera-track sprite éléphant-radeau sur path SVG Rhône — tout sur la carte.**

| T | Action | Device |
|---|--------|--------|
| 0→3s | Dolly-in sur RHONE_CROSSING (1.0→2.5x) | Dolly-in |
| 0s | Rhône SVG s'illumine — stroke MER_VIF épaissit | Fleuve révélé |
| 3→5s | Spotlight insert "37 éléphants" OR_SOLDAT + sprite statique | Spotlight HUD |
| 5→15s | **Camera-track** : sprite éléphant-radeau traverse Rhône ouest→est sur path SVG, caméra suit à zoom 2.5x | Camera-track (scène principale) |
| 10s | **Speed ramp** : zoom accélère puis ralentit d'un coup à l'arrivée rive est | 🆕 Speed ramp |
| 15→17s | **Whip-pan** nord 8 frames vers cavalerie numide — label "Numides" | 🆕 Whip-pan |
| 17→22s | **Orbital** léger 10° autour RHONE_CROSSING — vue d'ensemble tactique | 🆕 Orbital |
| 22→25s | Spotlight "Première victoire." cartouche CARTHAGE_VIF | Spotlight |
| 25→30s | Dolly-out 2.5→1.6x — armée franchie, route tracée | Dolly-out |

**Musique** : v1-A-marche-punique.mp3 continue

---

## BEAT 3 — LA MONTAGNE (frames 1546→3051 — ~50.2s)
**Script** : "Puis vient la montagne. Les Allobroges contrôlent les cols..."
**Structure** : 4 sous-séquences (VAGUE-1-LOCKED Idée 4)

### Sub-1 (~6s) — Col + Allobroges en hauteur
| T | Action | Device |
|---|--------|--------|
| 0s | Cut sec — vue `alpes` zoom serré | Cut |
| 0→6s | Pan lent nord + zone Allobroges fill rouge-brun progressif | Pan + fill SVG |
| 2s | Route strokeDashoffset reprend — Pyrénées→Col | Route animée |
| 3→6s | Push-in non-linéaire vers le col (speed ramp) | 🆕 Speed ramp |

### Sub-2 (~6s) — Nuit sur le rocher
| T | Action | Device |
|---|--------|--------|
| 0s | Fade doux depuis sub-1 | Fade 15f |
| 0→6s | FocusBubble zoom=1.45 blur=3.5 — Hannibal tiers haut, Allobroges flous bas | FocusBubble |
| 2s | Pulse breathing lent sur Hannibal (1.0→1.04 sin) | Pulse |

### Sub-3 (~6s) — Vinaigre + rocher
| T | Action | Device |
|---|--------|--------|
| 0s | **Cut brutal** (zéro fade — surprise) | Cut sec |
| 0→2s | Dutch tilt rotate(4deg) + scale(1.08) + spring oscillation ±1.5deg | Dutch tilt |
| 2→5s | **INSERT PLEIN ÉCRAN** : asset PixelLab "rocher + fissure" rotation lente + pulse — scène impossible à rendre sur carte 2D | 🆕 Insert PixelLab animé |
| 5→6s | Retour carte — stabilisation spring({damping:200}) | Retour |
| **CRITIQUE** | Sous-titres + UI dans AbsoluteFill frère hors du rotate | Isolation |

### Sub-4 (~7s) — Révélation Italie
| T | Action | Device |
|---|--------|--------|
| 0→2s | Fade depuis sub-3 | Fade |
| 0s | StatGauge altitude verticale "~2 400m" apparaît right:60px | StatGauge |
| 2→4s | Dolly-out `alpes`→`italia` (1.6→1.0) synchro "Vous traverserez les murs de Rome" | Dolly-out ITALIA |
| 4s | Label "ITALIA" fade-in OR_SOLDAT — +10 frames après scale cible | Label reveal |
| 4→5s | Fade-to-color bref OR 20% opacity sur Italie | 🆕 Fade-to-color |
| 5→6s | StatGauge disparaît | StatGauge out |
| 6→7s | Carte stable — ITALIA visible — Ken Burns | Ken Burns |

**Musique** : v1-A crossfade → v1-B-alpes-tension.mp3 à Sub-3 (moment de tension)

---

## BEAT 4 — LA DESCENTE (frames 3051→3679 — ~20.9s)
**Script** : "La descente est pire. La neige fraîche recouvre la glace ancienne. Les éléphants basculent. Les chevaux refusent d'avancer. Six jours de descente. À l'arrivée dans la plaine du Pô..."

| T | Action | Device |
|---|--------|--------|
| 0→3s | **INSERT PLEIN ÉCRAN** fond noir : compteur géant 46 000 OR_SOLDAT — impact maximal | Insert plein écran |
| 0→8s | Compteur animé 46k→26k→20k, couleur interpolate OR→ROUGE_MORT | Compteur |
| 3s | Sous-compteur "37 éléphants → 1" apparaît +30f en dessous | Sous-compteur |
| 8→11s | **Match-cut** retour carte vue `italia` — Ken Burns | Match-cut |
| 11→14s | Route finale Alpes→Plaine du Pô strokeDashoffset | Route animée |
| 14→17s | Push-in sur PLAINE_PO (1.0→1.6x) | Push-in |
| 17→19s | Spotlight "6 jours" + cartouche arrivée | Spotlight |
| 19→20.9s | **Flash-cut** 2 frames blanc → Beat 5 | 🆕 Flash-cut |

**Musique** : v1-B-alpes-tension.mp3, volume 0.15

---

## BEAT 5 — CONSÉQUENCE + CTA (frames 3679→4433 — ~25.2s)
**Script** : "La moitié d'une armée a disparu dans la montagne. Et avec ce qui reste, Hannibal va remporter les trois plus grandes victoires de sa vie..."

| T | Action | Device |
|---|--------|--------|
| 0→18s | **INSERT PLEIN ÉCRAN** fond NOIR_GUERRE : grille 37 sprites éléphants PixelLab | Insert plein écran |
| 0→18s | Decay droite→gauche progressif — extinction un par un | Sprite-decay |
| 8s | Dernier éléphant pulse OR spring({damping:12}) scale 1→1.3→1 | Pulse doré |
| 10s | Cartouche "La Trébie. Trasimène. Cannes." IVOIRE | Cartouche |
| 18→21s | Retour carte — zoom sur ROME (1.0→3.5x non-linéaire, 8 frames) | 🆕 Freeze-zoom ROME |
| 21s | Freeze-frame Rome zoomée + "50 000" ROUGE_MORT | Freeze |
| 21→25s | Dolly-out lent — CTA — Ken Burns | Dolly-out CTA |

**Musique** : v1-B continue, fade-out 2s avant fin

---

## Résumé mouvements par beat

| Beat | Durée | Mouvements | Inserts |
|------|-------|-----------|---------|
| Hook | 7s | Fond noir textuel (V.A) / Ken Burns (V.B) | — |
| Beat 1 | 14s | Ken Burns + Push-in + Whip-pan + Pan vertical + Freeze | HUD cartouche + POI |
| Beat 2 | 30s | Dolly-in + Camera-track + Speed ramp + Whip-pan + Orbital + Dolly-out | Spotlight HUD |
| Beat 3 | 50s | Pan + FocusBubble + Dutch tilt + Speed ramp + Dolly-out ITALIA + Fade-to-color | Insert PixelLab rocher (sub-3 seulement) |
| Beat 4 | 21s | Compteur plein écran + Match-cut + Route + Push-in + Flash-cut | Compteur plein écran |
| Beat 5 | 25s | Sprite-decay plein écran + Freeze-zoom ROME + Dolly-out | Grille éléphants plein écran |

**Nouveaux mouvements jamais essayés** (🆕) : Whip-pan, Speed ramp, Orbital, Fade-to-color, Flash-cut, Freeze-zoom
**Règle respectée** : aucune séquence >8s sans mouvement actif.
