# Remotion — Animation & Timing
> Regles Remotion, spring/interpolate, OffthreadVideo, SVG, audio, geo effects.
> Mise a jour : 2026-04-02

---

## spring() vs interpolate()

- `spring()` = physique (rebond, inertie). Pour entrees, impacts, apparitions.
- `interpolate()` = lineaire/courbe. Pour progressions continues (opacite, position).
- Spring s'applique a l'animation interne, jamais au startFrame cale sur audio.

### Mouvement masse lourde
1. `interpolate` lineaire de f0 a ARRIVE_END (vitesse constante)
2. `spring({ damping: 14, stiffness: 35 })` decale de ARRIVE_END (freinage visible)
3. Combiner : `x = frame < ARRIVE_END ? linear : braking`

---

## Audio sequentiel

- `<Audio delay={n}>` N'EXISTE PAS. Pattern correct : `<Sequence from={n}><Audio startFrom={0} /></Sequence>`
- Chaque piste audio sequentielle dans son propre `<Sequence>`
- ⚠️ **`startFrom` TRIME le fichier SOURCE** (saute les X premières frames du fichier lui-même, comme
  l'ancien `trimBefore`) — il NE POSITIONNE PAS le son dans la timeline. Confusion fréquente avec `from`
  de `<Sequence>` (qui lui positionne). Piège : un `<Audio startFrom={n}>` SANS `<Sequence>` autour, avec
  n supérieur à la durée du clip, ne produit PAS d'erreur — juste un SILENCE TOTAL, indétectable sans
  écouter. Si un SFX ne joue jamais malgré volume non-nul et fichier valide : vérifier en premier que
  `startFrom` n'est pas une valeur variable/frame-dépendante plus grande que la durée du fichier. Pattern
  correct pour fenêtrer QUAND un son s'entend SANS `<Sequence>` (ex: dans un composant enfant monté une
  fois) : `startFrom={inAt}` FIXE + moduler `volume` en fonction du frame courant, ex.
  `volume={(fr) => clampI(fr-inAt,90,94,0,0.4) * clampI(fr-inAt,100,110,1,0)}`. Bug trouvé+corrigé 2026-07-04
  (War-Map Sahel, `LiptakoRevealSVG.tsx`/`ResourcesRevealSVG.tsx`).
- ⚠️ **`<Sequence from={N}>` dans un montage assemblé par concaténation ffmpeg de fichiers séparés** (chaque
  scène rendue à part, puis `ffmpeg concat`) : N est relatif à où CE FICHIER démarre PHYSIQUEMENT dans le
  montage final, PAS à une position narrative absolue supposée (ex: une constante type `AUDIO_START` qui a
  un sens ailleurs dans le projet). Confondre les deux crée soit un silence artificiel (retard appliqué en
  double), soit une répétition audio (retard manquant). Toujours recalculer : à quelle frame de CE fichier
  correspond le point de reprise voulu, sachant que frame 0 de ce fichier = son point d'insertion réel dans
  le montage. Erreur vécue + corrigée Sénégal V3 ROUND 2 (2026-07-05).
- **Jonction audio propre entre 2 scènes adjacentes** (mot qui tombe à la frontière) : ne PAS couper l'audio
  en plein mot, même avec fade-out (le fade n'aide pas si la coupe tombe en plein son actif — testé et
  confirmé inefficace). Faire jouer le mot EN ENTIER dans la scène qui le contient (reculer `endAt` jusqu'à
  la fin naturelle du mot, confirmée par forced-align), puis décaler UNIQUEMENT le démarrage de l'Audio
  narration de la scène suivante via `<Sequence from={N}><Audio startFrom={X}/></Sequence>` (N = quelques
  frames), SANS toucher à la référence temporelle globale qui pilote les beats visuels si d'autres beats y
  sont calés à la main (camKeys Mapbox, SFX...). Validé Sénégal V3 ROUND 2 (2026-07-05, jonction
  `SenegalScene1IntroCoin.tsx`→`SceneGisementsV3.tsx`, mot "trois").
- **Diagnostic audio fiable** : forced-alignment ElevenLabs (API directe, pas Whisper) sur le MONTAGE RÉEL
  assemblé (pas seulement la narration source isolée) pour confirmer/infirmer un bug avant de coder un fix.
  Si plusieurs fichiers forced-align existent pour une même zone avec des `loss` différents, toujours
  privilégier celui au loss le plus bas comme source de vérité.

### Audio volume partiel
```tsx
<Audio src={...} volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
```

### ⭐⭐ AVANT de mixer : CHOISIR la piste — le banc d'ecoute a variable unique (2026-07-30, CFA)

Un choix de musique est **perceptif**. La mesure sert a EGALISER les candidats, jamais a choisir
a la place de l'oreille. Ne jamais demander a Aziz de trancher sur un tableau de chiffres ni sur
des fichiers isoles ecoutes a la suite (les niveaux different → il compare des volumes, pas des
musiques).

**La chaine en 3 temps :**
1. **Presolection MESUREE** → `public/_shared/audio/MUSIQUE-INDEX.md` (72 pistes deja produites,
   avec LUFS / amplitude par fenetres de 5 s / plancher). ⛔ **Inventorier AVANT de generer** — on
   possede probablement deja la bonne piste. Ecarter d'emblee toute piste a **plancher bas**
   (creux audibles sous la narration) ou **forte amplitude**. Outil rejouable :
   `scripts/tools/measure-music-track.py`.
2. **BANC D'ECOUTE a variable unique** → N candidates posees sous le **MEME extrait narre**
   (~35 s d'un beat central), **a marge mesuree identique** : seule la musique change. Une page
   HTML mobile, un seul son a la fois (deux lecteurs superposes ruinent la comparaison), plus un
   **temoin voix seule** en premier. ⛔ Page HTML pour mobile = **here.now**, pas un Artifact
   (`memory/tools/here-now-hosting.md`).
3. **Mix par bande** (section ci-dessous) une fois la piste choisie.

⭐ Le meme dispositif a fait ECHOUER une hypothese le meme jour (3 intensites de grain → « je ne
vois vraiment pas de difference ») : **un bon banc rend le NON aussi lisible que le OUI.**

### ⛔⛔ UN REGLAGE APPARTIENT A LA **VERSION**, PAS A L'EPISODE (2026-07-30)

Un chiffre de mix est valide pour le couple **(piste, montage)** qui l'a produit. Toute nouvelle
version **re-mesure**, ne reporte jamais. Les deux plus dangereux sont ceux qui ont l'air stables :

| Chiffre | Pourquoi il se perime | Vecu CFA v2 → v3 |
|---|---|---|
| **Le volume** | change avec la PISTE | `0.26` (ancienne piste) → **0.0716** : la nouvelle arrivait 2,9 dB plus fort dans la bande voix. Reporter = musique bien trop presente. |
| **Les bornes de fenetre** | changent avec toute COUPE en amont | fin `268.167 s` (v2) → **259.7 s** : une coupe de ~10 s au beat 5b avait decale toute la fin. Reporter = la musique joue par-dessus l'ecran de fin. |

⭐ **Regle** : **toute coupe en amont invalide TOUTES les bornes en aval.** Les re-localiser sur
**FRAMES** (extraire des images autour de la zone, regarder), jamais par soustraction mentale.

### Musique de fond — valeur par defaut

**0.07** est le volume de depart pour toute musique de fond Souverain/Atlas. Ajuster en hausse ou en baisse selon ressenti, mais toujours commencer a 0.07. Validé Niger Uranium 2026-05-12.
- Trop discret : monter par paliers de 0.03 (0.10, 0.13...)
- Trop present : descendre par paliers de 0.02 (0.05, 0.03...)
- Narration : toujours volume={1.0}, jamais toucher

⚠️ **0.07 est un POINT DE DEPART, pas une valeur universelle — il suppose une musique generee FORTE.**
Sur une piste deja discrete a la source, 0.07 donne une musique **inaudible** (vecu CFA 2026-07-26 :
32.5 dB d'ecart avec la voix, soit le silence). **Toujours MESURER voix ET musique avant de fixer le
volume**, jamais appliquer le defaut a l'aveugle.
⚠️ **Le 0.26 retenu sur le CFA n'est PAS une valeur a reutiliser** : il etait calibre POUR une piste
precise (`musique-episode.mp3`, deja EQualisee), **abandonnee le 2026-07-26** (Aziz : musique pas
adaptee a la video). C'est la METHODE ci-dessous qui se transporte, jamais le chiffre — recalculer
par bande pour chaque nouvelle piste.

### ⭐⭐ Mixer voix + musique : MESURER PAR BANDE, pas en RMS global (grave 2026-07-26, CFA)

**Un ecart RMS GLOBAL correct ne garantit PAS que la voix passe.** Vecu : musique posee a -18 dB sous
la voix (la cible documentaire Arte/BBC, donc "conforme"), et Aziz entend quand meme *"elle concurrence
la voix"*.

Cause reelle = **MASQUAGE FREQUENTIEL**. La mesure par bande le montre :

| Bande | Voix | Musique | Marge reelle |
|---|---|---|---|
| grave < 200 Hz | -25.2 dB | -32.4 dB | 7.2 dB |
| **medium 200 Hz–2 kHz** | **-19.0 dB** | **-27.2 dB** | **8.2 dB** ← les deux y vivent |
| aigu > 2 kHz | -42.6 dB | -38.2 dB | — |

8.2 dB de marge dans le medium, contre 17.9 dB en global. **La voix et la musique occupent la meme
bande** : ce n'est pas un probleme de niveau brut, c'est une place disputee.

**Fix en 2 temps (mieux que baisser le volume seul, qui tue la musique sans liberer la voix)** :
1. **EQ sur le fichier source** : creux **-5 dB a 700 Hz** (Q~2.2) et **-3 dB a 1.8 kHz**.
   `ffmpeg -i in.mp3 -af "equalizer=f=700:width_type=o:width=2.2:g=-5,equalizer=f=1800:width_type=o:width=1.5:g=-3" out.mp3`
   Libere ~3.8 dB dans la bande de la voix **sans changer le caractere** de la piste.
2. **Puis** ajuster le volume Remotion.

⚠️ **Hypothese "trop de basses" INFIRMEE par la mesure** — le grave de la musique etait plus faible que
son medium. Ne pas deviner : mesurer.

**Verification d'un mix reussi** : comparer le rendu avec et sans musique, tranche par tranche.
Sous la voix l'ajout doit etre **+0.0 / +0.1 dB** (la musique ne lui dispute rien) ; dans les silences
elle remonte (elle habille le vide au lieu de laisser un trou).

### ⭐⭐ ASSEMBLAGE MULTI-BEATS : `atrim` l'audio AVANT le `concat=` (grave 2026-07-26, CFA)

Le filtre `concat=` est OBLIGATOIRE pour assembler des beats (jamais le concat demuxer — DTS casses =
image gelee avec audio normal, vecu Soudan 4 min). **Mais il ne suffit pas.**

**Symptome** : l'assemblage CFA a produit **8357 frames au lieu des 8347** attendues (= la somme exacte
des 8 beats). Une derive de 10 frames, invisible sur un plateau mais qui decale chaque beat un peu plus.

**Cause** : dans CHAQUE beat rendu separement, la piste **audio AAC est plus longue que la video**
(+23 a +63 ms, granularite de trame de l'encodeur). `concat=` **etire la video** de chaque segment pour
rattraper son audio, et ces paddings **s'ACCUMULENT** (0.38 s ≈ 11 frames sur 8 beats).

**Fix** : mesurer la duree video exacte de chaque beat (`ffprobe -select_streams v:0 -show_entries
stream=duration`) et `atrim` sa piste audio a CETTE duree AVANT le concat :
```
[0:a]atrim=0:19.5,asetpts=N/SR/TB[a0];[1:a]atrim=0:35.833333,asetpts=N/SR/TB[a1]; ...
[0:v][a0][1:v][a1]...concat=n=8:v=1:a=1[v][a]
```
→ 8347 frames pile. **A appliquer a TOUT assemblage multi-beats** (vaut aussi pour le Soudan).
⚠️ Distinct du bug de continuite inter-segments (trous/chevauchements aux bornes de rendu) : ici c'est
une derive de DUREE cumulative d'origine intra-segment.

**Boucler une musique plus courte que la fenetre a couvrir** : JAMAIS bout-a-bout. La tete et la queue
d'une piste n'ont pas la meme amplitude (mesure 5.5 dB d'ecart sur la piste CFA, crete a -3.9 dB) → la
jonction s'entend. Utiliser un **`acrossfade` de ~4 s** :
```
[0:a]atrim=0:150,asetpts=N/SR/TB[a1];[1:a]atrim=0:150,asetpts=N/SR/TB[a2];
[a1][a2]acrossfade=d=4:c1=tri:c2=tri[out]
```

### ⚠️ `ffmpeg volumedetect` echoue silencieusement sur les extraits — decoder en PCM

`volumedetect` marche sur un fichier entier mais **retourne du vide** sur un segment (`-ss`/`-t`, extrait
copie, WAV decoupe) : la commande sort sans erreur ET sans mesure, on croit a un silence. Idem `astats`.
**Ne pas s'acharner** — decoder en PCM et calculer le RMS soi-meme :

```python
raw = subprocess.run(["ffmpeg","-v","error","-i",path,"-f","s16le","-ac","1","-ar","8000","-"],
                     capture_output=True).stdout
n = len(raw)//2; s = struct.unpack(f"<{n}h", raw[:n*2])
rms = math.sqrt(sum(x*x for x in seg)/len(seg)); db = 20*math.log10(rms/32768)
```
Filtrer les tranches sous un seuil (`rms > 300`) pour mesurer la voix **hors blancs de narration**,
sinon les silences tirent la moyenne vers le bas et faussent le calcul de volume.
Bonus : la meme boucle donne le **profil d'energie** d'une musique (detecte les ruptures de section —
c'est ce qui a fait ecarter une piste candidate sur CFA : chutes a -33 dB = trous audibles en boucle).

---

## Mapbox — delayRender rend le PRE_ROLL optionnel

`delayRender`/`continueRender` dans une scène Mapbox (ex. `CartoSouverainV5.tsx`) garantit que Remotion
ne capture JAMAIS le render avant que la carte soit visuellement prête (style chargé, tuiles rendues).
Un `PRE_ROLL` (fondu/écran gris avant que la carte n'apparaisse) n'est donc utile QUE pour un fondu
narratif volontaire (transition douce choisie), jamais nécessaire pour masquer un chargement technique —
supprimer le PRE_ROLL n'introduit pas de flash/vide, la carte est déjà pleinement chargée à la frame 0.
Validé Sénégal V3 ROUND 2 (2026-07-05), jonction `SenegalScene1IntroCoin.tsx`→`SceneGisementsV3.tsx`.

---

## ⚠️ Mapbox — reskin (recoloration frontières/fond) appliqué une seule fois ne couvre pas les tuiles
## chargées tardivement (GAP NON RÉSOLU, 2026-07-05, War-Map Sahel)

Un reskin de style Mapbox (ex. `map.setPaintProperty(layerId, "line-color", ...)` sur les couches
`admin-0`/`admin-1`, appliqué dans un handler `style.load`) ne s'applique qu'aux tuiles DÉJÀ chargées au
moment de l'event. Si la caméra visite ensuite une zone JAMAIS vue avant (ex. un zoom élargi qui montre
pour la première fois des pays restés hors-cadre jusque-là), les tuiles vectorielles de cette zone se
chargent après coup et gardent potentiellement la couleur NATIVE Mapbox (ex. liseré blanc/crème au lieu
du brun stylisé du reste de la carte).

**3 pistes de fix testées et ÉLIMINÉES par test direct (aucune n'a résolu, vérifié pixel-identique
avant/après)** :
1. Listener `sourcedata` qui réapplique le reskin à chaque nouvelle donnée de tuile chargée.
2. Forcer `line-opacity: 0` sur la sous-couche `*-boundary-bg` (halo de fond).
3. Forcer `line-opacity: 0` sur la sous-couche `*-boundary-disputed`.

**Cause exacte NON identifiée** à la fin de l'investigation (2026-07-05). Le problème a été laissé
comme point ouvert non bloquant (résidu visuel discret, pas de contenu manquant). Si ce gotcha
réapparaît sur un futur projet Mapbox (ex. Soudan, zoom vers de nouveaux pays jamais visités avant) :
NE PAS repartir des 3 pistes ci-dessus (déjà éliminées), chercher une cause différente — possiblement
liée à l'ordre de layers ou à une sous-couche non identifiée par `l.id.includes("admin-0")`.

---

## OffthreadVideo + clips Kling/Seedance

3 regles NON-NEGOTIABLES :
1. `<Video>` INTERDIT en headless render -> frames noires. Toujours `<OffthreadVideo>`.
2. `<OffthreadVideo>` DOIT etre dans `<Sequence from={BEATS.xxx.start}>` — sans Sequence = freeze.
3. Toujours `muted` — Kling/Seedance generent toujours une piste audio parasite.

### beatFade + OffthreadVideo
- `beatFade` (opacity 0->1) + `OffthreadVideo` sur fond noir = double assombrissement = ecran noir ~20 frames
- Fix : retirer opacity de l'AbsoluteFill. Le clip demarre deja sur fond noir.

### Split screen
- `clipPath: inset()` ne fonctionne pas avec `OffthreadVideo`. Solution : `div overflow:hidden` + offset negatif.

---

## SVG inline JSX (Recraft)

- `<Img src="fichier.svg">` = statique. `<use href>` = CORS-bloque en headless.
- Solution : script Node.js pour convertir SVG en JSX inline. Extraire groupes, animer avec spring/sin.
- `backgroundColor` OBLIGATOIRE sur `AbsoluteFill` (fond blanc en headless Puppeteer sinon)
- `preserveAspectRatio="xMidYMid meet"` (jamais `none`)

### SVG viewBox 9:16
- Asset 16:9 dans canvas 9:16 perd ~80% du contenu. Generer les assets NATIVEMENT en 9:16.
- Texte overlay : SVG separe avec `viewBox="0 0 1080 1920"`, jamais dans le meme SVG que le backdrop.

### Pipeline SVG anime -> Remotion
- Toute animation DOIT etre pilotee par `useCurrentFrame()`. CSS/SMIL ne s'executent pas en headless.
- < 10 elements : strip CSS + spring/interpolate (30-60 min)
- >= 10 elements : Anime.js hook (paused + seek)
- Lottie : `@remotion/lottie` UNIQUEMENT (pas `lottie-react`)

### Determinisme frame-driven — gotchas SVG/effets (2026-07-06, insert etat-major Khartoum)
- ⛔ **`Math.random()` INTERDIT en Remotion** (complete la liste CLAUDE.md setTimeout/@keyframes/rAF qui
  l'omet) : casse la reproductibilite entre frames — chaque frame re-tire → scintillement/artefacts au
  render, et un meme render n'est pas reproductible. Pour un jitter/dispersion pseudo-aleatoire mais
  STABLE (particules, poussiere, dispersion de positions), utiliser un hash deterministe INDEXE :
  `const jag = (i) => (Math.sin(i * 12.9898) * 43758.5453) % 1`. (⚠️ de vieilles reviews Kimi archivees
  suggerent naivement `Math.random()` seede — ne pas recopier.)
- **`feTurbulence` anime** : le `seed` doit VARIER par frame (`seed={Math.floor(frame/4)}`) pour que la
  deformation/le grain bouge — un seed fixe donne un grain FIGE. (baseFrequency liee a un spring = deja connu.)
- **Filtres SVG (`<filter id=...>`)** : `id` UNIQUE par instance/composant (deriver de la position ou d'un
  index), sinon collision dans `<defs>` entre deux usages du meme composant sur la meme frame → un filtre
  ecrase l'autre (fumee/glow qui "saute" d'une cible a l'autre).
- **Narrowing TS sur const-literal** : une `const STYLE: "a"|"b" = "a"` jamais reassignee est resserree par
  TS au litteral → `STYLE === "b"` signale "toujours faux". Caster `(STYLE as string)` ou passer par une
  variable non-const. (Frequent sur les flags de variante A/B testes en session.)
- Contexte d'usage detaille : [[doctrines/WARMAP-INSERT-SVG-ETATMAJOR]] (§Gotchas techniques).

### Sprites & downscale — style graphique vs taille d'affichage
Un sprite/portrait style **gravure fine à hachures/pointillés** NE SURVIT PAS à un downscale extrême
(ex: diamètre `vmin*0.065` ≈ 70px sur 1080p → devient du bruit visuel illisible), contrairement à un
style **aplats de couleur épais** qui reste net à la même taille. La résolution SOURCE suffisante
(ex: 900×1150px) ne garantit PAS la lisibilité au petit format si le style est trop fin. Avant de choisir
un diamètre de chip/portrait sur un nouvel asset : vérifier le style graphique, pas seulement la résolution
source. Découvert 2026-07-04 (War-Map Sahel, sprites `p4-assets/leader-*.png`) — un flou visuel avait été
mal diagnostiqué comme un bug d'opacité (`attenuate`) alors que c'était uniquement ce problème de taille
d'affichage vs densité de détail.

---

## Geo Visual Effects

Effets geo (hachures SVG, vignette, draw-on, pulse rings, etc.) documentes dans fichier dedie :
-> **`memory/tools/remotion-geo.md`**

---

## Hooks animation (src/hooks/animation/index.ts)

| Hook | Usage | Signature |
|------|-------|-----------|
| `useOceanSwell(i, frame)` | Houle individuelle par element | -> `ty: number` |
| `useSpringEntrance(i, frame, fps, delay?)` | Apparition decalee spring | -> `opacity: number` 0->1 |
| `useDrift(i, frame, directionPx, totalFrames?, offset?)` | Deplacement progressif clamp | -> `tx: number` |

**Regle** : Un hook valide par Aziz = il entre dans `index.ts`. Jamais re-coder dans les composants.

---

## Entry point & composition registration

**Entry point** : `src/index.ts` (PAS `src/Root.tsx`)
- `registerRoot()` est dans `src/index.ts`
- `Root.tsx` ne contient QUE la liste des compositions — pas de `registerRoot`
- Tailwind CSS import : dans `src/index.ts` (ex: `import "./styles/global.css"`)

**Render d'une composition par nom** :
```bash
npx remotion render src/index.ts Layout-<NomComposition>
# Exemples validés :
npx remotion render src/index.ts Layout-RadarScan
npx remotion render src/index.ts Layout-SplitFlap
```

**Templates connus dans Root.tsx (ajoutés session 2026-05-14) :**
RadarScan, RadarPing, PulseNumber, SplitFlap, TimelineFracture, WordExplode, BarRace, StackedBars, TypeReveal, TypeWriter — tous enregistrés sous `Layout-<Nom>`.

---

## Pipeline & Workflow

### Overlay texte
- Texte overlay justifie seulement si l'image est ambigue sans lui
- Dates et identifications = necessaires. Si le visuel raconte deja l'histoire = pas de texte.

### Transitions entre scenes
- Par defaut : coupes franches. Transitions stylisees uniquement apres validation explicite d'Aziz.

### Etalonnage couleur narratif
- Palette chaude (navy + or + etoiles) = humanite, spiritualite
- Palette froide (gris-bleu + blanc terne) = froideur, mecanique
- C'est une decision narrative, pas esthetique.

### Render en plusieurs segments (`--frames=A-B` x N) — verifier la continuite AVANT tout concat
Bug 2026-07-01 (War-Map Sahel) : des renders separes avaient des trous aux jonctions (fin segment N != debut
segment N+1) — jusqu'a 40s de narration/visuel jamais rendues, un chevauchement faisant repeter une phrase.
Personne (agent ni humain) ne l'a detecte avant presentation. Garde-fou : `python3
scripts/tools/check-frame-continuity.py <start-end> <start-end> ...` (memes bornes que les `--frames=`
utilises, dans l'ordre) — DOIT renvoyer exit 0 avant tout `ffmpeg concat` ou envoi de livrable. Detail complet
et regle gravee : `memory/doctrines/DOCTRINE-SOUVERAIN.md` §3.8 point 6.

<!-- Section "Kimi review" supprimee 2026-04-24 : appartient a quality-reviewer, pas a remotion composition. Voir .claude/agents/quality-reviewer.md -->

