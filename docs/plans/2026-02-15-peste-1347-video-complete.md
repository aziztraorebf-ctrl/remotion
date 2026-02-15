# Peste 1347 - Video Complete (10-12 min) - Plan d'Implementation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Produire la premiere video YouTube complete du projet Remotion : "1347 - Les Humains Deviennent Fous", 10-12 minutes, style pixel art medieval avec data overlays, voiceover francais.

**Architecture:** Script etendu (~2500 mots) decompose en 6-8 blocs de ~1.5 min chacun. Chaque bloc passe par le pipeline valide : storyboard -> audio -> construction Remotion -> review. Les composants prouves de PixelWorldV5 (useCamera, ParallaxLayer, Ground, Building, GridSpritesheetAnimator, PropagationChart, NarrativeHUD) sont reutilises et etendus. 3 modes visuels alternent : pixel world vivant (camera bouge), data pause (camera fixe + overlay), transition (changement de decor).

**Tech Stack:** Remotion 4 (React), ElevenLabs v3 (voix Chris), fal.ai flux/dev (ground textures), pixel art tilesets (itch.io/CraftPix), ffprobe (timing), GPT-4o/Gemini/Grok/Kimi 2.5 (Jury AI 4 LLM)

**Repo:** PRIVE. Tout est committe (scripts, jury AI, storyboards, configs). Si un jour on publie un repo public, ce sera un fork nettoye sans le contenu creatif proprietaire.

---

## Regle de session (BLOQUANTE)

**1 bloc = 1 session max.** Si le contexte derive (autre sujet, exploration non liee), on arrete et on ouvre une nouvelle session. Pas d'exception.

Objectif : eviter la fatigue de contexte qui cause des incoherences entre blocs. Chaque session doit commencer clean, relire le plan, et ne traiter qu'une tache a la fois.

---

## Vue d'ensemble des phases

Ce plan suit les 14 phases du pipeline `/video-production`, adaptees au projet.

| Phase | Contenu | Statut | Bloquant |
|-------|---------|--------|----------|
| 1. Recherche | 145 sources (Grok multi-step) + 3 complementaires | FAIT | - |
| 2. Script V2 | 770 mots, 5 segments | FAIT | - |
| 3. Jury AI V2 | 3 evaluations (GPT-4o, Grok, Gemini) | FAIT | - |
| 4. Validation Aziz V2 | Script V2 valide | FAIT | - |
| 5. Direction artistique | PixelWorldV5 valide par Aziz | FAIT | - |
| A. Script V3 | Reecriture 10-12 min (~2500 mots, 7 segments) | **FAIT** | - |
| B. Jury AI V3 | 4 LLM (GPT-4o 82, Gemini 85, Grok 67, Kimi 70) | **FAIT** | - |
| B'. Corrections post-Jury | 7 corrections appliquees (V3.1) | **FAIT** | - |
| **C. Validation Aziz V3** | **Aziz valide le script etendu -> LOCK** | **EN COURS** | **Oui** |
| **D. Achat tilesets + sprites** | **3-4 tilesets + 2-3 packs sprites animes** | **A FAIRE** | **Oui** |
| 6-8. Storyboard bloc 1 | Composition + previz | A FAIRE | Apres C+D |
| 9. Audio bloc 1 | Voiceover + SFX + musique | A FAIRE | Apres 6-8 |
| 10-12. Construction bloc 1 | Code Remotion + review | A FAIRE | Apres 9 |
| 13. Blocs suivants | Repeter 6-12 pour chaque bloc | A FAIRE | Sequentiel |
| 14. Assemblage final | Combiner + polish | A FAIRE | Apres 13 |

---

## PARTIE 1 : Preparation (avant tout code)

### Task 1 : Reecriture du script pour 10-12 min

**Objectif:** Tripler le script V2 (770 mots -> ~2500 mots) en enrichissant chaque segment avec du contenu narratif, des paralleles modernes, et des moments de "tissu conjonctif" (data, cartes, chiffres).

**Files:**
- Modify: `src/projects/peste-1347-pixel/scripts/script-lecture.md`
- Reference: `research/multistep_reactions_humaines_pendant_la_peste_noire_de_1347_1353_comme_20260213_1900.md`
- Reference: `research/multistep_reactions_humaines_pendant_la_peste_noire_de_1347_1353_comme_20260213_1900_sources.json`

**Decisions de structure a prendre avec Aziz AVANT d'ecrire :**

1. **Paralleles modernes des le hook** (decision de la session precedente). Le hook actuel est purement historique. Le nouveau hook doit poser la question "pourquoi on reagit PAREIL 673 ans plus tard" dans les 15 premieres secondes.

2. **Nombre de segments** : 5 segments actuels -> probablement 7-8 pour 10-12 min. Options :
   - Option A : Garder les 5 segments, les enrichir chacun (plus de details, anecdotes, data)
   - Option B : Ajouter 2-3 segments (ex: "Les Medecins de Peste" comme segment complet, "L'Eglise face a la Peste", "Les Survivants")
   - **Recommande : Option B** — plus de variete visuelle (nouveaux decors par segment), meilleur rythme

3. **Position du Miroir** : actuellement a la fin (Segment 5). Pour 10-12 min, les paralleles modernes devraient etre tissees DANS chaque segment, pas juste a la fin. Le Miroir final devient un recapitulatif + CTA.

4. **Tissu conjonctif planifie** : identifier a l'avance les 4-5 moments de "data pause" (carte propagation, timeline, stats mortalite par ville, comparaison riches/pauvres, etc.)

**Step 1: Discovery Interview avec Aziz**

Questions guidees (chaque option inclut ce qu'elle apporte + recommandation Claude) :

**Q1 : Quels segments enrichir en priorite ?**
- **Boucs Emissaires** (recommande) — Le segment le plus universel. C'est la ou les paralleles modernes sont les plus forts (COVID = anti-asiatique, Moyen Age = anti-juif). Beaucoup de matiere dans nos 145 sources. Visuellement riche (foules, buchers, tribunaux).
- **Remedes** — Tres divertissant (saignees, amulettes, vinaigre des 4 voleurs). Bon pour la retention car ca surprend. Mais moins de profondeur emotionnelle.
- **Flagellants** — Visuellement spectaculaire (processions, fouets, sang). Mais le segment risque d'etre repetitif si trop long — les flagellants font toujours la meme chose.
- **Fuite des Elites** — Court mais percutant. Excellent pour paralleles modernes (Boccaccio = villa de riches, COVID = yachts de milliardaires). Peut doubler de taille sans perdre en rythme.

**Q2 : Quel(s) nouveau(x) segment(s) ajouter ?**
- **Les Survivants / L'Apres-Peste** (recommande) — Angle inattendu : la Peste a AMELIORE la vie des paysans (moins de main-d'oeuvre = salaires en hausse, revoltes, fin du servage). Finir sur un twist positif = memorable. Peu de chaines couvrent cet angle.
- **L'Eglise face a la Peste** — Perte de foi massive, pretres qui fuient, enrichissement via testaments. Risque : sujet sensible, Jury AI Gemini va flag. Mais tres riche narrativement.
- **Le Commerce (Routes de la Soie = Routes de la Peste)** — Bon pour une carte animee (Mode 2 data pause). Mais contenu plus factuel, moins emotionnel. Peut etre integre dans le Hook au lieu d'etre un segment complet.
- **L'Art Macabre (Danse Macabre)** — Visuellement unique (on peut montrer de l'art medieval). Mais leger en contenu narratif, mieux comme interlude de 30s que comme segment complet.

**Q3 : Ton pour 10-12 min ?**
- **Alternance graves/piquants** (recommande) — Un format long purement provocateur epuise. Alterner moments serieux (massacres, souffrance) et piquants (remedes absurdes, reactions de riches) maintient l'engagement. C'est ce que font Kurzgesagt et DirtyBiology en long format.
- **Renforcer le provocateur** — Risque de backlash sur 10 min. Mais plus viral court terme.
- **Adoucir** — Plus safe, mais perd le differenciateur.

**Q4 : Paralleles modernes a inclure ?**
- **COVID-19** (recommande) — Le plus direct et le plus reconnu par le public. Anti-masques = flagellants, fake cures = remedes medievaux, fuite des riches = meme schema. A tisser dans chaque segment, pas juste a la fin.
- **Theories du complot generiques** — Plus large que COVID, plus intemporel. Mais moins concret.
- **Aucun parallele explicite** — Laisser le spectateur faire le lien seul. Plus subtil, mais risque que le message passe au-dessus de la tete.

**Step 2: Ecrire le script V3 version lecture**

Utiliser le skill `youtube-scriptwriting` Phase 3 (Script Writing) avec :
- Niche: Educational
- Tone: Provocateur
- Target: 2500 mots, ~10-12 min voiceover
- Sources: recherche multi-step existante (145 sources)
- Contrainte: paralleles modernes dans chaque segment, pas juste le Miroir

**Step 3: Auto-review interne**

Avant le Jury AI, verifier :
- [ ] Chaque segment a au moins 1 moment de "data pause" identifie
- [ ] Les paralleles modernes sont des constats universels (pas de catalogue politique)
- [ ] Les chiffres sont nuances ("certains historiens...")
- [ ] Les transitions entre segments sont fluides
- [ ] Le hook pose le parallele passe/present dans les 15 premieres secondes
- [ ] Le CTA final est un open-loop ("la prochaine pandemie...")

**Step 4: Commit**

```bash
git add src/projects/peste-1347-pixel/scripts/script-lecture.md
git commit -m "feat(peste): script V3 - extended to 10-12 min (~2500 words)"
```

---

### Task 2 : Jury AI sur script V3

**Objectif:** 3 LLM evaluent le script etendu. Meme processus que pour V2.

**Files:**
- Create: `src/projects/peste-1347-pixel/scripts/jury-v3-gpt4o.md`
- Create: `src/projects/peste-1347-pixel/scripts/jury-v3-grok.md`
- Create: `src/projects/peste-1347-pixel/scripts/jury-v3-gemini.md`
- Create: `src/projects/peste-1347-pixel/scripts/jury-v3-synthesis.md`

**Step 1: Lancer les 3 evaluations en parallele**

Utiliser les prompts templates de `/video-production` Phase 3 :
- GPT-4o : coherence narrative, rythme, transitions (IMPORTANT pour script 3x plus long)
- Grok : potentiel viral, risques backlash, force du hook
- Gemini : precision factuelle, sensibilite culturelle (CRITIQUE vu les paralleles modernes)

**Step 2: Synthetiser les 3 avis**

- Points unanimes (3/3) = action immediate
- Points majoritaires (2/3) = consideration forte
- Points uniques (1/3) = presenter a Aziz

**Step 3: Appliquer les modifications unanimes**

**Step 4: Commit**

```bash
git add src/projects/peste-1347-pixel/scripts/jury-v3-*.md
git commit -m "feat(peste): jury AI V3 evaluation + synthesis"
```

---

### Task 3 : Validation Aziz du script V3

**Objectif:** Aziz lit le script V3 version lecture + synthese jury. Script LOCK apres cette etape.

**Delivrables pour Aziz :**
1. Script V3 version lecture (texte brut, pas de balisage)
2. Synthese jury AI (forces, faiblesses, risques)
3. Liste des modifications appliquees depuis V2
4. Points ou Aziz doit trancher (1/3 du jury)

**Critere de LOCK :** Aziz dit "OK" ou "OK avec ces changements" -> appliquer -> LOCK.

---

### Task 4 : Generer scenes.json V3

**Objectif:** Decomposer le script LOCKED en scenes TTS-ready avec presets ElevenLabs.

**Files:**
- Modify: `src/projects/peste-1347-pixel/scripts/scenes.json`

**Step 1: Decouper le script en scenes**

Chaque scene = 1-3 phrases, 1 preset vocal, 1 expected_duration_sec. Pour 10-12 min, prevoir ~60-80 scenes (vs 26 actuellement).

**Step 2: Assigner les presets**

| Moment | Preset |
|--------|--------|
| Stats choc, revelations | dramatic |
| Narration fluide | narrator |
| Commentaires personnels, humour | conversational |
| Questions rhetoriques, CTA | calm |
| Citations historiques | literal |

**Step 3: Ajouter les notes prosodiques**

Chaque scene doit avoir des `notes` precisant pauses, emphasis, breaks de ton.

**Step 4: Commit**

```bash
git add src/projects/peste-1347-pixel/scripts/scenes.json
git commit -m "feat(peste): scenes.json V3 - TTS-ready for 10-12 min script"
```

---

### Task 5 : Achat et integration des tilesets + sprites personnages

**Objectif:** Acheter 3-4 tilesets medievaux (decors) ET 2-3 packs de sprites animes (personnages) pour couvrir tous les segments.

**Contexte:** On a actuellement 1 tileset "medieval town" et des sprites limites (peasant generique, plague doctor, rats). Pour 10-12 min, on a besoin de decors ET personnages supplementaires.

**SPRITES PERSONNAGES NECESSAIRES :**

| Personnage | Segment | Animations requises | Source recommandee |
|-----------|---------|--------------------|--------------------|
| Flagellant (avec fouet) | Seg 1 | walk, attack/whip, kneel | Pack RPG medieval itch.io |
| Noble/Riche | Seg 3 (Fuite) | walk, idle, run | Pack RPG medieval itch.io |
| Villageois varies | Partout | walk, idle | Pack villagers (GuttyKreum, Elthen) |
| Moine/Pretre | Seg 2 (Boucs) | walk, idle, pray | Pack RPG medieval itch.io |
| Femme/Enfant | Seg 5 (Survivants) | walk, idle | Pack villagers |

Budget sprites : ~$15-25 (2-3 packs). Budget total (tilesets + sprites) : $30-70.

**Decors necessaires (a confirmer avec Aziz selon script final) :**

| Decor | Usage dans le script | Source probable |
|-------|---------------------|-----------------|
| Town (actuel) | Hook, Flagellants, vie quotidienne | DEJA ACHETE |
| Campagne/Foret | Fuite des elites, processions flagellants en route | A acheter |
| Interieur (maison/taverne) | Remedes, medecin de peste au travail | A acheter |
| Port/Commerce | Arrivee de la peste, routes commerciales | A acheter |
| Eglise/Cimetiere | Boucs emissaires, buchers, enterrements de masse | A acheter |

**Step 1: Aziz choisit les tilesets**

Presenter 3-5 options par decor (CraftPix freebies d'abord, itch.io ensuite). Budget indicatif : $5-15/tileset, total $15-45.

**Step 2: Extraire les tiles**

Meme processus que pour le town tileset actuel :
- Ouvrir le spritesheet
- Identifier et extraire les tiles individuels
- Nommer selon convention : `wall-*.png`, `floor-*.png`, `roof-*.png`, `prop-*.png`
- Sauver dans `public/assets/peste-pixel/<decor>/extracted/`

**Step 3: Generer les grounds AI**

Pour chaque nouveau decor, generer un ground AI de 1536x256 (meme process que `ground-ai.png`) :
- Campagne : herbe/terre battue
- Interieur : plancher bois / dalle pierre
- Port : quai bois / paves mouilles
- Eglise : dalle de pierre / terre de cimetiere

**Step 4: Creer les Building presets pour chaque decor**

Etendre le pattern de `BUILDING_PRESETS` dans PixelWorldV5 :

```typescript
// Exemple pour campagne
const FARM_PRESETS: BuildingConfig[] = [
  { wall: "wood-farm", roof: "thatch", door: "barn", windows: 1 },
  { wall: "stone-farm", roof: "thatch-large", door: "wood", windows: 0 },
];
```

**Step 5: Commit par decor**

```bash
git add public/assets/peste-pixel/<decor>/
git commit -m "feat(peste): add <decor> tileset + extracted tiles"
```

---

## Notes de production (Jury AI V3 + Kimi 2.5)

Ces notes sont issues du Jury AI et doivent etre appliquees pendant la production, pas dans le script.

### Jury AI - Composition du jury
| LLM | Role | Note V3 | Verdict |
|-----|------|---------|---------|
| GPT-4o | Structure, flow, retention | 82/100 | PRESQUE |
| Gemini 2.0 Flash | Precision historique, rigueur | 85/100 | PRESQUE |
| Grok-3 (xAI) | Viralite, risques, potentiel clip | 67/100 | PRESQUE |
| Kimi 2.5 (manuel) | Vision realisateur, rythme visuel | 70/100 (14/20) | PRESQUE |

**Kimi 2.5 est consulte manuellement par Aziz** (pas d'API). Son regard de "realisateur visuel" complete les 3 LLM API qui evaluent surtout le texte. A consulter pour chaque phase de production visuelle.

### Regles visuelles pour la production (issues du jury)

1. **Data Pauses : TOUJOURS narrees, 8-15 secondes** (Kimi + Grok + Aziz). Un graphique sans voix-off sera ignore. Nos Data Pauses sont narrees (dual coding audio+visuel), donc 8-15s est la bonne duree. Les 3-4s de Kimi ne s'appliquent qu'aux visuels muets de confirmation (un chiffre deja dit, confirme a l'ecran). Les tableaux complexes ne sont JAMAIS muets.

2. **Varier les formats des Data Pauses** (Kimi). Ne pas toujours faire freeze -> graphique -> retour pixel. Alterner : carte animee (Seg 1), tableau chronologique (Seg 2), graphique comparatif (Seg 3), liste iconique animee (Seg 4), graphique economique (Seg 5).

3. **Seg 5 (Survivants) : transformation visuelle** (Kimi). Quand le ton passe de la catastrophe a l'espoir, le visuel doit accompagner : couleurs plus chaudes, personnages plus droits, ciel plus clair. C'est le moment de changement de palette.

4. **Flash contemporain dans le Miroir** (Kimi). 2-3 secondes d'images pixelisees contemporaines (ecran telephone, masque, foule) SANS texte. Le spectateur fait le lien. Note visuelle deja dans le script V3.1.

5. **Portraits de personnages historiques** (Aziz). Overlay slide-in quand un personnage est mentionne. 8 personnages identifies. Style a decider en Phase 5 storyboard : pixel art portrait / gravure medievale / silhouette + texte.

6. **Potentiel clip viral = Segment 4 (Remedes)** (unanime). La sequence poulet/emeraudes/theriaque est le meilleur extrait pour Shorts/Reels. A produire avec soin particulier.

---

## PARTIE 2 : Production bloc par bloc

### Decoupe en blocs

Le script de 10-12 min sera decoupe en **6-8 blocs de ~1.5 min** chacun. Chaque bloc passe par le pipeline complet.

**Decoupe indicative (a ajuster apres script LOCK) :**

| Bloc | Segment | Duree | Decor principal | Mode dominant | Notes production |
|------|---------|-------|-----------------|---------------|-----------------|
| 1 | Hook (carte Routes Soie) | ~0:50 | Carte SVG animee | Data/carte | Pas de pixel world, SVG pur |
| 2 | Flagellants | ~2:00 | Route/Campagne | Pixel world + data | Carte Europe processions |
| 3 | Boucs Emissaires (debut) | ~1:20 | Town (jour, foule) | Pixel world | "Orchestre" pose tot |
| 4 | Boucs Emissaires (massacres + elites) | ~1:10 | Town + interieur nobles | Data pause + pixel | Portraits: Konighofen |
| 5 | Fuite des Elites | ~1:20 | Campagne (villa) | Pixel world + data | Graphique mortalite |
| 6 | Remedes | ~1:40 | Interieur medecin | Pixel world + data | CLIP VIRAL - soigner |
| 7 | Survivants | ~1:40 | Champ (lumineux, chaud) | Pixel world + data | Palette chaude! Portraits: Edouard III, Wat Tyler |
| 8 | Miroir + CTA | ~0:50 | Town (crepuscule) | Pixel world | Flash contemporain 2-3s |

---

### Task 6-12 : Pipeline pour chaque bloc (TEMPLATE)

Ce template se repete pour chaque bloc. Les taches sont identiques, seul le contenu change.

#### Task 6.N.1 : Storyboard du bloc N

**Files:**
- Create: `src/projects/peste-1347-pixel/storyboard/bloc-N.md`

**Step 1: Definir les 5 couches** (selon SKILL.md Phase 6)

Pour chaque scene du bloc (~15-20s chacune) :

1. **PREVIZ** : si fal.ai est utilise pour ce bloc (ground texture), generer l'image
2. **COMPOSITION** : fond, personnages, UI/data, z-index
3. **ANIMATIONS** : entrees, mouvements pendant, sorties, timing exact
4. **INTEGRATION DONNEES** : comment les chiffres s'integrent dans la scene (Mode B)
5. **TRANSITION** : type et duree vers scene suivante

**Step 2: Identifier le mode visuel**

- Mode 1 (pixel world vivant) : camera bouge, sprites animes, monde en mouvement
- Mode 2 (data pause) : camera fixe, overlay data apparait sur le monde visible
- Mode 3 (transition) : changement de decor (hard cut ou crossfade)

**Step 3: Validation Aziz**

Presenter le storyboard texte + previz images a Aziz. OK = audio. Pas OK = ajuster.

---

#### Task 6.N.2 : Audio du bloc N

**Files:**
- Create: `public/audio/peste/bloc-N-voice.mp3`
- Create: `public/audio/peste/bloc-N-sfx-*.mp3`

**Step 1: Generer le voiceover ElevenLabs**

Utiliser les scenes.json du bloc avec :
- Voice: Chris (iP95p4xoKVk53GoZ742B)
- Model: eleven_v3
- Language: fr
- Settings: stability 0.0, similarity_boost 0.8, style 0.8
- Request stitching: previous_text + next_text entre scenes

**Step 2: Mesurer avec ffprobe**

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/audio/peste/bloc-N-voice.mp3
```

**Step 3: Definir SCENE_TIMING**

Creer/mettre a jour les constantes de timing basees sur les durees REELLES (jamais estimer).

**Step 4: Generer SFX**

ElevenLabs sound-generation pour les effets lies aux animations :
- Fouets (flagellants), cloches, feu, foule, cris, etc.
- `prompt_influence: 0.6-0.8` pour SFX precis
- `prompt_influence: 0.2-0.3` pour ambiances

**Step 5: Generer/selectionner musique**

ElevenLabs music-generate :
- Style: "dark medieval ambient 8-bit chiptune"
- Duration: exactement la duree du bloc
- Volume cible: ~0.18 (sous la voix)

---

#### Task 6.N.3 : Construction Remotion du bloc N

**Files:**
- Create: `src/projects/peste-1347-pixel/scenes/Bloc-N.tsx`
- Modify: `src/projects/peste-1347-pixel/config/timing.ts`
- Modify: `src/Root.tsx`

**Step 1: Creer le composant de scene**

Architecture basee sur PixelWorldV5 :

```typescript
// Structure de chaque bloc
export const BlocN: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scrollPos, zoom, offsetY } = useCamera(frame, fps);

  return (
    <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden" }}>
      {/* Camera wrapper */}
      <div style={{ transform: `scale(${zoom}) translateY(${offsetY}px)` }}>
        {/* Layer 0: Sky */}
        {/* Layer 1: Buildings */}
        {/* Layer 2: Ground */}
        {/* Layer 3: Props */}
        {/* Layer 4: NPCs/Sprites */}
        {/* Layer 5: FX (fire, etc.) */}
        {/* Layer 6: Atmosphere (fog, night filter) */}
      </div>

      {/* Outside camera: fixed position */}
      {/* Layer 7: Vignette + scanlines */}
      {/* Layer 8: Data overlays (PropagationChart, etc.) */}
      {/* Layer 9: Narrative HUD */}

      {/* Audio */}
      <Audio src={staticFile("audio/peste/bloc-N-voice.mp3")} />
      <Audio src={staticFile("audio/peste/bloc-N-music.mp3")} volume={0.18} />
    </div>
  );
};
```

**Step 2: Render partiel**

```bash
npx remotion render PesteBlocN --frames=0-END
```

**Step 3: Extraire frames pour review**

```bash
./scripts/extract_review_frames.sh out/PesteBlocN.mp4 3 peste-bloc-N
```

**Step 4: Jury AI review frames**

Envoyer frames + storyboard original aux 3 LLM.

**Step 5: Validation Aziz**

Aziz voit le rendu video. OK = bloc suivant. Pas OK = corriger.

**Step 6: Commit**

```bash
git add src/projects/peste-1347-pixel/scenes/Bloc-N.tsx
git add src/projects/peste-1347-pixel/config/timing.ts
git commit -m "feat(peste): bloc N complete - [description courte]"
```

---

## PARTIE 3 : Assemblage final

### Task 13 : Composition principale

**Files:**
- Create: `src/projects/peste-1347-pixel/scenes/PesteComplete.tsx`
- Modify: `src/Root.tsx`

**Step 1: Assembler tous les blocs avec Series**

```typescript
import { Series } from "remotion";

export const PesteComplete: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={BLOC1_FRAMES}>
      <Bloc1 />
    </Series.Sequence>
    <Series.Sequence durationInFrames={BLOC2_FRAMES}>
      <Bloc2 />
    </Series.Sequence>
    {/* ... */}
  </Series>
);
```

**Step 2: Verifier les transitions entre blocs**

- Pas de gap audio
- Les crossfades visuels sont fluides
- Le HUD est coherent d'un bloc a l'autre (hearts, counter)

**Step 3: Render complet**

```bash
npx remotion render PesteComplete
```

**Step 4: Review finale**

- Extract frames du rendu complet
- Jury AI sur l'ensemble
- Validation Aziz finale

---

### Task 14 : Polish et export

**Step 1: Ajuster les niveaux audio**

- Voix: 1.0 (reference)
- Musique: ~0.18
- SFX: 0.3-0.6 (selon l'effet)

**Step 2: Verifier la duree finale**

Target: 10-12 min. Si trop court ou trop long, ajuster les pauses ou les segments data.

**Step 3: Export final**

```bash
npx remotion render PesteComplete --codec h264 --quality 80
```

**Step 4: Commit final**

```bash
git add -A
git commit -m "feat(peste): video complete 10-12 min - ready for upload"
git push origin master
```

---

## Composants reutilisables de V5

Ces composants sont PROUVES et seront reutilises tels quels (ou avec modifications mineures) :

| Composant | Fichier source | Usage |
|-----------|---------------|-------|
| `useCamera` | PixelWorldV5.tsx:91-118 | Scroll, zoom, offsetY par bloc |
| `ParallaxLayer` | PixelWorldV5.tsx:123-164 | Ciel parallaxe (toutes scenes exterieures) |
| `Ground` | PixelWorldV5.tsx:175-221 | Sol AI tile (1536x256, different par decor) |
| `Building` | PixelWorldV5.tsx:226-391 | Batiments assembles par presets (a etendre par decor) |
| `Prop` | PixelWorldV5.tsx:396-426 | Props decoratifs (barils, caisses, etc.) |
| `PeasantNPC` | PixelWorldV5.tsx:431-464 | Paysans spritesheets (background CSS) |
| `RunningRats` | PixelWorldV5.tsx:469-520 | Rats animes (GridSpritesheetAnimator) |
| `FireFX` | PixelWorldV5.tsx:525-556 | Feu anime (sprite frames) |
| `PropagationChart` | PixelWorldV5.tsx:562-742 | Graphique data overlay (slide-in) |
| `PopulationCard` | PixelWorldV5.tsx:747-874 | Carte stat (slide-up) |
| `NarrativeHUD` | PixelWorldV5.tsx:886-1043 | HUD gaming (hearts, counter, status) |
| `GridSpritesheetAnimator` | components/GridSpritesheetAnimator.tsx | Animation spritesheet generique |

## Sprites disponibles

| Sprite | Fichier | Animations |
|--------|---------|------------|
| Peasants | sprites/peasants/peasants.png | 8x6 grid, 64x48 frames |
| Plague Doctor | sprites/plague-doctor/plague-doctor.png | Elthen, specifique |
| Rats | sprites/rats/rats.png | 5x8 grid, 32x32 frames |
| Reaper | sprites/reaper/*.png | 7 sheets (idle, run, attack, etc.) |
| Skeletons | sprites/skeletons/*/\*.png | 3 types (archer, warrior, spearman) |
| Fire FX | fire/red/Group \*/\*.png | 5 variants, 8 frames chacun |

## Sprites a acheter / trouver

| Besoin | Usage | Source recommandee |
|--------|-------|-------------------|
| Flagellant (fouet) | Segment 1 - processions | Paysan recolore + fouet SVG custom |
| Noble/Riche | Segment 3 - fuite des elites | itch.io medieval RPG pack |
| Medecin de peste (variantes) | Segment 4 - remedes | Elthen (deja achete), recolorable |
| Foule/Villageois (varietes) | Tous segments | Peasant sheet actuel + recoloration |
| Moine/Pretre | Segment eglise (si ajoute) | itch.io ou CraftPix |

---

## Estimation de travail

| Phase | Sessions Claude Code estimees | Bloquant humain |
|-------|-------------------------------|-----------------|
| Script V3 + Jury AI | 2-3 sessions | Aziz valide le script |
| Achat tilesets | 1 session + achat Aziz | Aziz achete sur itch.io/CraftPix |
| Scenes.json V3 | 1 session | Non |
| Bloc 1 (storyboard + audio + code + review) | 3-4 sessions | Aziz valide le storyboard + rendu |
| Blocs 2-8 (chacun) | 2-3 sessions chacun | Aziz valide chaque bloc |
| Assemblage final | 1-2 sessions | Aziz valide le rendu final |
| **TOTAL** | **~25-35 sessions** | **~10 validations Aziz** |

---

## Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Script trop long -> voiceover depasse 12 min | Cout ElevenLabs + duree video | Mesurer tot, couper avant Jury AI |
| Tilesets incompatibles (echelle, palette) | Perte de temps + cout | Tester freebies d'abord, acheter apres validation |
| Sprites statiques = "slideshow feel" | Qualite percue | 3 modes visuels + idle animation + camera motion |
| Fatigue de contexte (sessions longues) | Incoherence entre blocs | 1 bloc par session max, HUD et timing dans config partagee |
| ElevenLabs quota (33K chars/month Starter) | Impossible de generer tout le voiceover | Script ~2500 mots = ~15K chars. 2 tentatives = 30K. Marge serree. |

---

## Ordre d'execution recommande

```
1. [AZIZ] Discovery interview (Task 1, Step 1)
2. [CLAUDE] Script V3 (Task 1, Steps 2-4)
3. [CLAUDE] Jury AI V3 (Task 2)
4. [AZIZ] Validation script V3 (Task 3) -> SCRIPT LOCK
5. [CLAUDE] Scenes.json V3 (Task 4)
6. [AZIZ] Choix + achat tilesets (Task 5, Step 1)
7. [CLAUDE] Extraction + integration tilesets (Task 5, Steps 2-5)
8. [BOUCLE] Pour chaque bloc :
   a. [CLAUDE] Storyboard (Task 6.N.1)
   b. [AZIZ] Validation storyboard
   c. [CLAUDE] Audio (Task 6.N.2)
   d. [CLAUDE] Construction Remotion (Task 6.N.3)
   e. [CLAUDE] Jury AI frames
   f. [AZIZ] Validation bloc
9. [CLAUDE] Assemblage final (Task 13)
10. [CLAUDE] Polish + export (Task 14)
11. [AZIZ] Validation finale -> UPLOAD
```
