# Template — Sous-titres Shorts (TikTok/Karaoke hybride)

> Template Remotion reutilisable pour sous-titres synchronises mot-par-mot, blindes en lisibilite, theme-able par couleur.
> Cree 2026-04-29 — valide sur Sonjata Papercraft scene 7.

## Quand l'utiliser

- Tout Short Remotion 9:16 avec narration ElevenLabs
- Sujets compatibles : Sonjata, Abou Bakari (or), Thiaroye (rouge), Atlas (vert/or)
- Pas adapte aux long-form (TV-style, 16:9) — fait pour la lecture rapide mobile

## Composants

### `src/projects/geoafrique-shorts/Subtitles.tsx`
Composant principal. Phrase-level display + karaoke word highlight.

### `src/projects/geoafrique-shorts/whisper-words.ts`
Donnees mot-par-mot generees par Whisper API. Une seule narration = un fichier.
**Pour un nouveau projet** : creer `whisper-words-<projet>.ts` et importer dans le composant.

### `src/projects/geoafrique-shorts/cameraShake.ts`
Helper standalone pour le tremblement de camera sur moments de force. Utilise dans Sonjata scene 5 (baobab) et scene 7 (chute Soumaoro).

### `scripts/tools/whisper-align.py`
Genere `whisper-words.ts` depuis un fichier audio via OpenAI Whisper API.
Cout : ~$0.006/min.

## Pipeline d'utilisation (4 etapes)

### 1. Generer les timestamps
```bash
python scripts/tools/whisper-align.py public/audio/<projet>/narration.mp3 \
    --out src/projects/<projet>/whisper-words.ts
```

### 2. Importer dans la scene
```tsx
import { Subtitles } from "./Subtitles";
import { cameraShake, shakeEnvelope } from "./cameraShake";

export const MyScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <OffthreadVideo src={...} muted />
      <Subtitles
        sceneStartS={NARRATION_START_S}
        sceneEndS={NARRATION_START_S + NARRATION_END_RELATIVE_S}
        highlightColor="#FFD84A"  // optional, defaut or
      />
    </AbsoluteFill>
  );
};
```

### 3. Themer par couleur (optionnel)
| Projet | highlightColor | Raison |
|--------|---------------|--------|
| Sonjata, Abou Bakari | `"#FFD84A"` (or) | Heroique, noble, empires |
| Thiaroye 1944 | `"#E63946"` (rouge sang) | Tragedie, massacre |
| Atlas (geo, richesse) | `"#06D6A0"` (vert) | Nature, geographie |

### 4. Ajouter camera shake sur moments de force
```tsx
const Scene5BWithShake: React.FC = () => {
  const frame = useCurrentFrame();
  const env = shakeEnvelope(frame, { start: 155, peak: 165, end: 215 });
  const { x, y } = cameraShake(frame, 12 * env);  // amplitude 12 = baobab
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>
      <OffthreadVideo src={...} muted />
    </AbsoluteFill>
  );
};
```

**Amplitudes recommandees** :
- 8 = pas, contact leger
- 12 = baobab arrache, chute lourde
- 18 = explosion, tir de canon
- 24 = seisme (parcimonieux — fatigant a regarder)

## Choix techniques (NE PAS modifier sans raison)

### Police : Anton (Google Fonts)
- Grasse, condensee, MAJUSCULES
- Style MrBeast / HighPerf YouTube
- Lisible a 100% sur mobile et TV

### Lisibilite blindee (3 couches)
1. **Background pill** semi-transparent sombre + blur derriere chaque phrase
2. **Text-stroke** noir 1.5px autour de chaque lettre
3. **Text-shadow** 4 directions (haut/bas/gauche/droite) noir + glow couleur sur mot prononce

Resistance testee : fonds clairs (papercraft sepia), fonds charges (combat), fonds sombres (nuit).

### Phrase grouping
- Algorithme : groupe consecutif jusqu'a silence > 0.45s OU 7 mots max
- Modifie dans `Subtitles.tsx` -> fonction `buildPhrases`

### Timing : Whisper API ONLY
- ElevenLabs forced-alignment a echoue sur la voix Narratrice GeoAfrique v2 (loss > 1.0 sur quasi tous les mots)
- Whisper API OpenAI = source de verite pour le timing mot-par-mot des sous-titres
- Ne PAS utiliser Whisper local (lent + moins precis que API)
- Ne PAS utiliser ElevenLabs forced-alignment pour les sous-titres (mais OK pour les BEATS de scenes globales)

## Anti-patterns

- ❌ **Ne PAS** utiliser une police fine (Cinzel, Times) -> illisible sur mobile petit
- ❌ **Ne PAS** mettre `fontSize > 60` -> debordement horizontal sur 1080px
- ❌ **Ne PAS** oublier le pill background -> texte perdu sur fond clair
- ❌ **Ne PAS** mettre le shake sur toute une scene -> nausee garantie
- ❌ **Ne PAS** chainer plusieurs camera shake en moins de 5s -> pareil

## Couts

- Whisper API : ~$0.006/min (3 min narration = $0.018)
- Anton font : gratuit (Google Fonts)
- Camera shake : 0 cout, juste calcul JS

## Roadmap

- [ ] Variant `style="ticker"` pour news geopolitique
- [ ] Variant `style="dialogue"` avec icone parlant pour interviews
- [ ] Auto-detection scene boundaries pour eviter de passer `sceneStartS`/`sceneEndS` manuellement
