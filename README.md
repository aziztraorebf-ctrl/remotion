# Remotion - Animated Video Project

Projet de creation de videos animees avec des personnages (stick figures) en utilisant Remotion, un framework React pour la video programmatique.

## Stack technique

- **Remotion** v4.0 - Framework video React
- **11Labs** - Voix-off (TTS) et effets sonores
- **Auphonic** - Polissage audio (normalisation, denoise)
- **TypeScript** strict mode
- **SVG** pour les personnages et decors

## Structure du projet

```
src/
  characters/          Personnages reutilisables (StickFigure)
  animations/          Bibliotheque de mouvements (idle, walk, jump, wave...)
  components/          Decors partages (OutdoorBackground, Sun)
  projects/
    hello-world/       Premier projet video (10s)
      scenes/          Compositions Remotion
      audio/           Configuration audio (timing, volumes)
scripts/
  generate-audio.ts    Pipeline 11Labs (voix-off + SFX)
  polish-audio.ts      Pipeline Auphonic (polissage voix)
public/audio/          Fichiers audio generes (non versionnes)
out/                   Videos rendues (non versionnees)
```

## Demarrage rapide

```bash
# Installer les dependances
npm install

# Lancer le Studio Remotion (preview)
npm run dev

# Generer les fichiers audio (necessite cles API dans .env)
npx tsx scripts/generate-audio.ts

# Polir les voix-off avec Auphonic
npx tsx scripts/polish-audio.ts

# Rendre la video finale en MP4
npx remotion render HelloWorld out/HelloWorld.mp4
```

## Configuration

Creer un fichier `.env` a la racine :

```
ELEVENLABS_API_KEY=sk_...
AUPHONIC_API_KEY=...
```

## Videos

### HelloWorld (10 secondes)

Video de demonstration avec Bob le stick figure :
1. Bob respire tranquillement
2. Il remarque quelque chose
3. Il marche vers la droite
4. Il fait un salut
5. Il saute de joie

Avec narration francaise (voix George - 11Labs), effets sonores (ambiance nature, pas, saut) et musique de fond.

## Workflow de creation

```
Decrire la scene en francais
  -> Planifier (storyboard + timing)
  -> Coder les composants React/SVG
  -> Preview dans le Studio (localhost:3000)
  -> Generer l'audio (11Labs + Auphonic)
  -> Ajuster timings et volumes
  -> Rendu MP4 final
```
