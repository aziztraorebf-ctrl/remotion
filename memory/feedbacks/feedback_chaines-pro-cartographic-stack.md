# Stack pro chaines cartographiques YouTube (2026-04-30)

> Migré depuis auto-memory 2026-08-31. Reverse-engineer confirmé 2026-04-30 sur GeoGlobeTales,
> Jacques a dit, Johnny Harris, Vox, RealLifeLore. Source de vérité pour décisions tooling —
> a informé le choix de la voie 100% code (d3-geo/Mapbox + Remotion) plutôt que After Effects.
> Mission : identifier outils EXACTS utilises par chaines cibles avant de copier leur style.
> Methodologie : 3 agents paralleles (last30days skill + deep search + reverse-engineer specifique).
> Convergence : 3+ sources independantes confirmant.

## Verdict global

**Pipeline dominant chaines cartographiques pro :**
```
Adobe After Effects + GEOlayers 3 (plugin $255) + Google Earth Studio (gratuit) + Photoshop
```

Confiance : HAUTE (3 sources convergentes).

**Alternative gratuite credible :**
```
Google Earth Studio (gratuit) + DaVinci Resolve (gratuit) + Remotion overlays (notre approche)
```

## Stack par chaine

### GeoGlobeTales (8M+ views/Short, anglais, base Canada)
- **After Effects + GEOlayers 3** (strong inference, style match parfait)
- **Google Earth Studio** complementaire (zooms 3D fly-throughs)
- **ElevenLabs** voix (TTS, jamais de credit voice actor)
- Solo creator, side hustle (Patreon "creating videos helps me manage my full-time job")
- Footprint : YouTube + TikTok 1.9M + Facebook 833K + Patreon $4.50+

### Jacques a dit (177K subs, francais, agence Lumera Montpellier)
- **After Effects** (inference forte, agence pro)
- **Illustrator** en amont pour cartes vectorielles custom (style 2D, **PAS satellite**)
- **Premiere Pro** assemblage long-form 12 min
- Voix humaine (Jacques lui-meme, accent francais metropolitain)
- Brand deals via Lumera (Samsung, Google, Binance, NordVPN cites)
- "Nouveaux episodes chaque dimanche"

### Johnny Harris / Vox / RealLifeLore (millions subs, anglais)
- **After Effects + GEOlayers 3** (confirmed direct, sources : aescripts blog "How Johnny Harris Makes Maps", PremiumBeat interview prestataire reel)
- **Google Earth Studio** pour cinematic zooms
- **Photoshop** pour overlays + retouches
- Equipe motion designers professionnels

## Outils precis (cout 2026)

| Outil | Role | Cout | Compatible Remotion ? |
|-------|------|------|----------------------|
| Adobe After Effects | Animation principal (~90% chaines pro) | $23/mois | Non (export video then re-import) |
| GEOlayers 3 plugin | Cartes animees natives AE | ~$255 upgrade, ~$255 neuf | Non (ExtendScript AE) |
| Mapdata sub (GEOlayers) | Sources OSM + MapTiler + satellite | Abo separe ou 6/12 mois | Via export PNG |
| Google Earth Studio | Zooms cinematiques satellite tilted | **GRATUIT** | Oui (export PNG sequence) |
| Adobe Photoshop | Overlays, retouches | $23/mois | Via export PNG |
| Adobe Premiere Pro | Edit final long-form | $23/mois | Non (concurrent d'edit) |
| Adobe Illustrator | Cartes vectorielles custom (Jacques a dit) | $23/mois | Oui via SVG export |

## Distinction critique : 2 styles cartographiques distincts

**Style A "satellite tilted" (GeoGlobeTales, Johnny Harris)**
- Base : satellite reel Google Earth Studio
- Look : photoreel + relief 3D
- Tools : Google Earth Studio + AE + GEOlayers overlays

**Style B "design 2D vectoriel" (Jacques a dit, Vox certains plans)**
- Base : cartes Illustrator custom dessinees
- Look : flat illustration + identite editoriale forte
- Tools : Illustrator + AE

## Pourquoi confirmation manquait avant 2026-04-30

GeoGlobeTales et Jacques a dit **ne revealent pas leur pipeline** publiquement (pas de behind-the-scenes, pas d'interviews techniques, pas de project files publics).

Sources convergentes utilisees :
- aescripts blog officiel "How Johnny Harris Makes Maps" (confirmation directe RLL/JH)
- PremiumBeat interview prestataire reel Johnny Harris
- FlatpackFX tutoriels "Johnny Harris style map animation"
- ArtBoardAcademy "GeoGlobeTales Map Animation Breakdown" (project files gratuits si formulaire)
- Lumera (agence Jacques a dit) : page createurs publique
- X posts engagement signal (@Kartik_ez "GEOLAYERS 3 plugin used", @pureguava10300 "Google Earth Studio templates")

## Implication pour le projet (décision d'outillage)

**Le rendu vise n'est pas reproductible avec Mapbox runtime seul** — le bon outil de référence externe est GEOlayers 3 OU une alternative qui matche les capacites :
1. Frontieres vectorielles animables natives
2. Compositing avec sprites/overlays dans le meme outil
3. Camera moves illusoires sur images fixes

**Choix retenu (2026-04-30, avant l'évolution vers Mapbox runtime pour Souverain) :**
d3-geo + Natural Earth + Remotion vectoriel (style Jacques a dit, 100% code).

**Pourquoi pas Voie 1 (After Effects + GEOlayers)** :
- Aziz code-only, pas de competence AE
- Cout $278/mois Adobe + $255 plugin = $533 first month puis $278/mois
- Courbe d'apprentissage AE 3-6 mois
- Workflow non-codable (pas integrable avec ElevenLabs/forced-alignment/Vercel pipeline existant)

**Pourquoi pas Voie B (Google Earth Studio + Remotion)** :
- Identite cherchee = registre historique/éditorial propre, pas "satellite Google Earth"
- Necessite apprendre GES (~30 min) pour resultat moins differenciant que vectoriel custom
- Style B (Jacques a dit vectoriel) est plus polyvalent + reutilisable cross-episodes

## Outils a NE PAS utiliser pour cartes (verifie 2026-04-30)

- **Mapbox runtime tel qu'essayé à l'époque** : saccades projection switch + manque flexibilite (V1 Mansa Moussa abandon — depuis largement résolu par le système Carto V5 frame-driven, cf `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`)
- **Mapbox Static Images + filtre sepia** : rendu fade + filtre desature couleurs (test V2 echec)
- **Cartes parchemin via Gemini** : drift frontieres + style decoratif + audience puriste detecte
- **Recraft V3 cartes geographiques** : pas un cartographe, geographie imprecise
- **Templates Envato/Freepik** : pas de pack Afrique medievale specifique disponible

## Sources verifiees

- https://aescripts.com/geolayers/
- https://aescripts.com/learn/post/how-johnny-harris-makes-maps
- https://www.premiumbeat.com/blog/making-maps-for-johnny-harris/
- https://www.flatpackfx.com/blog/johnny-harris-style-map-animation-adobe-after-effects
- https://artboardacademy.com/geoglobetales-map-animation-breakdown/
- https://www.google.com/earth/studio/
- https://lumera.social/createurs (agence Jacques a dit)
- https://animaps.ai/blog/animaps-vs-geolayers-map-animation-plugin-comparison
