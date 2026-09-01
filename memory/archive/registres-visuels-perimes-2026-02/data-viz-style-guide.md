# Data Viz Cinematique - Style Guide

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — registre visuel exploré fev 2026, marqué
> "ARCHIVED" dès l'écriture (verdict : "After Effects template", générique, pas d'identité).
> Conservé pour l'historique de décision, voir `style-exploration-analysis.md` (même dossier)
> pour le comparatif complet des styles testés.

## Direction
"Data Viz Cinematique" - traiter les donnees comme un film, pas comme un dashboard.
Mix: 60% data viz + 25% metaphores visuelles SVG + 15% ambiance cinematique

## Ambiance par acte (modele suivi)

| Acte | Role narratif | Couleur fond | Particules | Vignette | Emotion |
|------|--------------|-------------|-----------|---------|---------|
| Hook | Accrocher | Noir profond, serrer la vignette | Rares, rouges, descendent | Forte (0.8), se resserre | Menace, intrigue |
| Setup | Fausse securite | Bleu nuit calme | Bleues, lentes, montent | Moyenne (0.5) | Confiance trompeuse |
| Reveal | Choquer | Transition vers rouge sombre | Rouges, denses, montent | Moyenne (0.6) | Choc, colere |
| CTA | Rassurer | Rouge -> vert sombre | Vertes, montent | Faible (0.5) | Espoir, action |

## Composants reutilisables crees (a l'epoque)

### Ambiance
- **CinematicBackground**: gradient anime + glow pulse + scan line + vignette
- **ParticleField**: particules parametriques (count, color, direction, opacity)

### Metaphores visuelles (SVG)
- **HouseShrink**: maison qui retrecit vs barre interets qui grandit
- **MoneyFlow**: billets qui volent en arc vers silhouette de banque
- **Hourglass**: sablier anime, sable bleu->rouge, compteur d'annees

### Data Viz
- **AnimatedCounter**: compteur numerique avec spring
- **AnimatedBar**: barre horizontale avec glow
- **LineChart**: SVG avec draw progressif
- **DonutChart**: segments animes
- **ComparisonChart**: barres comparatives staggered
- **FadeText**: texte avec fade directionnel + glow

## Script - principes (reste generalement valable)
- Angle provocateur/revelateur, PAS informatif/descriptif
- "Ta banque ne veut pas..." > "Aujourd'hui on va parler de..."
- Marqueurs emotionnels: MAJUSCULES, "...", "!", "--", "Hein?"
- Chaque acte a un ton distinct dans le script (pas monotone sur 70s)
- Ajouter des moments de reflexion ("C'est exactement ce que ta banque veut que tu penses")

## Voice settings (11Labs v3, a l'epoque)
- Voice: Chris (iP95p4xoKVk53GoZ742B)
- stability: 0.0, style: 0.8, similarity_boost: 0.8
- speaker_boost: true, language_code: "fr"
- Music: /v1/sound-generation (free) en loop, volume 0.22

## Anti-patterns identifies (reste generalement valable)
- Meme fond statique pour toute la video = "slideshow"
- Toutes les animations qui tirent en meme temps = fatigue visuelle
- Script descriptif sans angle = generique / Wikipedia
- Voix monotone (stability 0.5+) = detectable comme IA
- Assets externes melanges (itch.io) = incoherence visuelle

## Workflow optimal (structure generale, reste applicable)
1. Research pipeline (multi-step) -> donnees sourcees
2. Script via youtube-scriptwriting skill -> structure de retention
3. Direction artistique par acte (palette, mood, metaphore)
4. Code des composants visuels
5. Generation audio (voix + SFX)
6. Assemblage + synchronisation
7. Iteration sur feedback

## Verdict a l'epoque
"After Effects template", generique, pas d'identite propre. L'effet wow ne suffit pas — il faut
une identite reconnaissable. C'est ce constat qui a motivé l'exploration du style Sketch/Doodle
puis, bien plus tard, le pivot vers les registres Souverain/Atlas/SVG maison actuels.
