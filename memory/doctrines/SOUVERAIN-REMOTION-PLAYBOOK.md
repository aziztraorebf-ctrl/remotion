# SOUVERAIN REMOTION PLAYBOOK — Doctrine data-viz / hero-data premium

> **Construit 2026-06-02** via 2 appels Gemini 3.1 Pro sur nos 2 meilleures vidéos data-viz validées : **Silicon Savannah** (chiffres hero, barres, objets hero) + **Niger Uranium** (graphisme réseau, entités, flux, métaphores physiques).
> **Miroir Remotion** du [[SOUVERAIN-VISUAL-PLAYBOOK]] (qui couvre le Mapbox). À LIRE avant tout beat Souverain **Remotion/graphisme/data-viz** (pas carte).
> **Principe fondateur (règle Aziz) :** Claude est maître du CODE. Pour la VISION ARTISTIQUE, s'appuyer sur l'œil externe (Gemini scoré) + ce qui a marché chez nous. Voir [[feedback_systeme-beat-mapbox-vs-remotion]].
> Catalogue des briques codées : section "DONNÉES VISUELLES / HERO DATA" de `src/projects/_shared/COMPOSANTS-INDEX.md`. Squelette d'assemblage : [[SOUVERAIN-REMOTION-SKELETON]].

---

## 0. LA RÈGLE ANTI-CLONAGE (la plus importante)

Les chaînes data-viz populaires (Bloomberg Originals, Vox, Kurzgesagt, Polymatter) ont chacune une signature forte. On adopte leurs **PRINCIPES** (mise en scène de la donnée, secondary motion, discipline du vide), **JAMAIS** une esthétique plaquée.

**Notre signature à préserver :** fond navy `#141c2e` (jamais noir pur) + dégradé radial central · gold `#c8a951` (donnée vitale, < 15% de l'écran) · ivory `#f0e8d8` (texte) · accent rouge `#cc2200` / vert `#4caf7d` **réservé au verdict**. Bebas Neue (hero) + IBM Plex Mono (sources). Premium et CLASSIQUE.

| À ADOPTER (principes) | À ÉVITER (clone / amateur) |
|---|---|
| Chiffre mis en scène comme entité physique | Chiffre statique posé à l'écran |
| Discipline absolue du vide (1 idée/plan) | Écran surchargé, plusieurs héros |
| Secondary motion permanent (float/halo/ping) | Effet « diaporama PowerPoint » |
| Bichromie stricte, accent = verdict | Couleur d'accent décorative |
| Transitions seamless (match cut, zoom intra-élément) | Cuts francs / fondus basiques en chaîne |
| Métaphore physique de la donnée (balance, jauge) | Pourcentage abstrait sans incarnation |

**Synthèse doctrine (Gemini) :** *« La donnée n'est pas seulement lue, elle doit être ressentie physiquement. Notre motion design transforme des chiffres abstraits en entités tangibles soumises à la gravité, à l'inertie et au temps, strictement encadrées par le triptyque Navy/Gold/Ivory. En maîtrisant le vide et en assurant une respiration vectorielle permanente, on guide l'œil sans fatigue cognitive. Chaque rebond, chaque transition seamless sert une seule cause : l'impact éditorial de l'information. »*

---

## 1. LES 8 PRINCIPES PREMIUM (la mécanique vivante)

### P1 — Le Chiffre-Événement (axe A) ⭐ le cœur du hero-data
Le chiffre n'apparaît jamais statique. Count-up animé (0 → valeur) synchronisé sur la voix, **terminé par un spring à overshoot** (rebond physique : scale 1 → 1.05 → 1) qui donne du *poids*. Bebas Neue taille massive. Le chiffre doit être le SEUL élément actif pendant son incrémentation.
- *Pourquoi :* l'œil suit le mouvement ; le count-up crée une micro-tension (« jusqu'où ça monte ? ») résolue par l'impact de la valeur finale.
- *Brique :* `CountUp` preset `hero`. *Exemple :* M-Pesa 0→91%, Niger 0→86%.

### P2 — Discipline chromatique stricte (axe B)
Triptyque Navy/Ivory/Gold exclusif. **Le Gold < 15% de la surface** pour garder son pouvoir d'attraction. Rouge/vert bannis du décoratif → **uniquement Verdict** (sanction, perte, validation).
- *Pourquoi :* supprime la fatigue cognitive. Gold = vital, Rouge = problème, lu sans réfléchir.
- *Pousser plus loin :* radial-gradient navy plus agressif en périphérie pour forcer le regard au centre.

### P3 — Séquençage minimaliste / Règle des 8s (axe C)
Une seule idée visuelle par plan. L'évolution se fait par **reveal successif** (une ligne, puis un texte) plutôt que par changement de plan complet. Le vide donne de l'importance à l'élément central.
- *Pousser plus loin :* chaque reveal = micro-mouvement (translate-y 10px + spring), jamais un simple fondu d'opacité. L'apparition doit sembler organique, pas mécanique.
- *Brique :* `SubtitleBarSouverain` + reveals via `animations.ts`.

### P4 — Contraste d'échelle extrême (axe D)
L'élément hero occupe 40-60% de l'espace central. Métadonnées (sources, dates) reléguées aux marges, IBM Plex Mono, opacité réduite (~40%), letter-spacing large.
- *Pourquoi :* hiérarchise la lecture — impact émotionnel d'abord (gros chiffre), crédibilité ensuite (petite source).
- *Pousser plus loin :* chiffre `text-stat-2xl`/`text-stat-xl`, source `text-mono-sm` opacity-40.

### P5 — Respiration vectorielle / Secondary motion (axe E)
Un objet statique reste vivant via animations secondaires cycliques : ping-ring (ondes concentriques), glow pulsant, float sinusoïdal, tracé lent (stroke-dashoffset).
- *Règle :* dès qu'un élément reste > 3s sans action majeure, il DOIT avoir un secondary motion.
- *Pousser plus loin :* ajouter de la profondeur 2.5D — drop-shadow dynamique + parallaxe (fond 3× plus lent que le premier plan lors d'un pan).
- *Brique :* `FloatingHeroObject` (float + halo + ping-ring).

### P6 — Highlight typographique synchronisé (axe G)
La phrase est affichée, puis les mots-clés **passent en gold / se soulignent** exactement quand la voix les prononce. Préféré au mot-par-mot saccadé (machine à écrire) pour une punchline.
- *Pousser plus loin :* soulignement = div absolue scale-x 0→100% avec spring, calé sur la frame de la syllabe.
- *Brique :* `TextChoc` (mot-par-mot + underline strokeDasharray) / highlight inline.

### P7 — Métaphore physique de la donnée (axe H) ⭐ différenciant fort
Traduire une donnée abstraite par un comportement physique : balance qui penche, pièce qui se divise en jauges, fûts qui s'empilent, barres qui s'allongent.
- *Pourquoi :* le cerveau comprend la physique (poids, volume, équilibre) bien plus vite qu'un pourcentage.
- *Règle d'animation :* **anticipation** (micro-mouvement inverse) → action → **overshoot** (dépassement) → stabilisation. C'est ce qui sépare le « PowerPoint » du « motion premium ».
- *Briques :* `HeroMirrorBars`, `ScaleTilt`/`ScaleShock` (balance), `BarRace`, `FillScreen`.

### P8 — Transitions seamless (axe F — notre faiblesse #1 à combler)
**Diagnostic Gemini :** nos données apparaissent avec impact, mais les transitions entre idées cassent l'immersion (effet « slideshow » : cuts francs / fondus basiques en chaîne).
- *Solutions dans notre stack :*
  1. **Zoom intra-élément** : zoomer DANS le « 0 » d'un pourcentage massif pour révéler le fond navy de la scène suivante (flux ininterrompu).
  2. **Caméra virtuelle continue** : pan/zoom via `useCurrentFrame` + `interpolate` pour lier deux plans logiquement.
  3. **2.5D systématique** : background / midground (données) / foreground (particules/glow) à vitesses légèrement différentes (parallaxe).

---

## 2. SOLUTIONS ANTI-SLIDESHOW (dans NOTRE style)

| Problème | Solution navy/gold | Technique Remotion |
|---|---|---|
| Cuts francs entre idées (slideshow) | Match cut / zoom intra-élément | `interpolate(frame, …, [scale1, scale50])` dans le hero de fin → fond scène suivante |
| Objet figé > 3s | Secondary motion obligatoire | `Math.sin(frame/N)` float + ping-ring scale 0.9→2.4 + glow oscillant |
| Apparition mécanique (fondu plat) | Reveal organique | `spring()` translate-y 10px + opacity, jamais opacity seule |
| Chiffre sans poids | Overshoot physique | `spring({damping:6, stiffness:200})` scale 1→1.05→1 sur la valeur finale |
| Donnée abstraite | Métaphore physique | balance/jauge/empilement avec anticipation + overshoot |

---

## 2bis. ORDRE DU PIPELINE (NON-NEGOTIABLE — ne jamais sauter une étape)

```
Phase 0 SCAN        → lire COMPOSANTS-INDEX EN ENTIER (71+, pas juste HERO DATA)
                       → identifier templates pertinents + proposer >= 2 COMBINAISONS
                       → présenter à Aziz. (beat-session.py --phase scan, gate bloquant)
        ↓
STORYBOARD GEMINI   → storyboard VISUEL multi-panels (Gemini Flash) montrant la PROGRESSION
  (OBLIGATOIRE)        du beat (intro → développement → climax/verdict).
                       → prompt rédigé depuis le scan, VALIDÉ Aziz, puis :
                         scripts/tools/gemini-storyboard-panels.py
                       → présenter le PNG à Aziz. C'est ce qui permet de coder sans hésiter
                         ET d'où on tire le breakdown JSON. JAMAIS coder sans ce storyboard.
        ↓
BREAKDOWN JSON      → Gemini 3.1 Pro lit le storyboard → JSON "comment coder" (Tailwind, timing)
        ↓
CODE                → assembler les briques (combinaison, pas 1 seul template) selon le breakdown
        ↓
SELF-REVIEW 19/23 → REVIEW GEMINI (1 appel) → CORRECTIONS → UPLOAD
```

**Deux règles de scan (les plus oubliées) :**
1. **Scan COMPLET** : lire TOUT `COMPOSANTS-INDEX.md` (toutes les sections), pas seulement HERO DATA. Aziz ne mémorise pas 71 composants — Claude le fait.
2. **Combinaison obligatoire** : un beat premium = plusieurs templates assemblés (corps + insert + overlay + sous-titre). Jamais un seul template tout du long.

---

## 3. TEMPLATE STORYBOARD BEAT REMOTION (le master)

> Phase storyboard du `beat-session.py`. Remplir AVANT le code. **Règle d'or : aucun champ ne reste vide.** Force à concevoir riche dès le départ (physique, vide, continuité) plutôt que réparer après. Issu de Gemini (10 champs).

Par scène / plan :
1. **BEAT ID + DURÉE** — ex: Plan 03 — 6.5s
2. **VOIX OFF EXACTE** — texte prononcé (pour caler les frames clés sur la syllabe)
3. **DATA HERO** — le chiffre/icône central. ex: « 86% » Bebas Neue Gold, 40-60% écran
4. **MÉTAPHORE PHYSIQUE** — comment la donnée se comporte. ex: jauge qui se remplit avec gravité
5. **ANIMATION ENTRÉE (SPRING)** — anticipation + overshoot. ex: scale 0→1 rebond lourd (damping bas)
6. **SECONDARY MOTION / RESPIRATION** — ce qui maintient la scène vivante. ex: ping-ring lent autour du chiffre
7. **MÉTADONNÉES & SOURCES** — position + opacité IBM Plex Mono. ex: bottom-right, opacity-40
8. **HIGHLIGHT TYPO SYNC** — mot à passer en gold + frame d'activation
9. **TRANSITION SORTIE SEAMLESS** — comment on passe au plan suivant sans cut franc. ex: zoom dans la jauge
10. **SFX / AUDIO CUE** — swoosh grave à l'entrée, tick pendant le count-up, impact lourd à la fin

---

## 2ter. TAILLES & OCCUPATION DE L'ESPACE (NON-NEGOTIABLE — codifié 2026-06-03)

> **Erreur récurrente de Claude : faire les textes/graphismes TROP PETITS et TROP TARDIFS au premier jet.**
> Résultat : Aziz doit systématiquement demander « agrandis, occupe l'espace, démarre plus tôt ».
> Cette section EST la réponse — viser ces valeurs DÈS LE PREMIER CODE, ne plus attendre le retour.

### Tailles minimales (1080×1920) — viser le HAUT de la fourchette par défaut
| Élément | Taille (px) | Tokens Tailwind |
|---|---|---|
| Chiffre HERO (le seul chiffre du plan) | **180-220** | `text-stat-xl` / `text-stat-2xl` |
| Chiffre important (barres, comparaison) | **96-120** | `text-stat-lg` |
| Mot-clé / entité HERO (PHOSPHATE, un nom) | **88-110** | `text-entity` |
| Question / punchline (TextChoc, verdict) | **110-150** | — |
| Titre de section / label au-dessus d'un hero | **35-44** | `text-label` |
| Sous-label / contexte (sous un mot-clé) | **22-28** | `text-mono-sm` |
| Source (bas écran, discret) | **20** opacity-40 | `text-mono-sm` |

**Règle d'or : l'élément HERO occupe 40-60% de la largeur OU de la hauteur de l'écran.** Si après render il "flotte" petit au milieu avec beaucoup de vide → il est TROP PETIT, agrandir.

### Occuper l'espace (anti-vide) — 4 leviers
1. **Agrandir le hero** (cf. tailles ci-dessus) — le plus simple, le plus oublié.
2. **Disposition qui remplit** : empilement vertical (mots reliés), barres verticales (hauteur), grille — plutôt qu'un petit élément centré.
3. **Fond actif** : dégradé radial central + `GridOverlay` + vignette périphérique + particules ambiantes (cf. A3/A6). Jamais un aplat navy.
4. **Marges safe mais pleines** : marges 60px, mais le contenu DOIT s'approcher des bords (un hero à 108px touche presque les marges en 1080 — c'est voulu).

### Rythme de démarrage (R1 appliqué au début du beat)
- **Le 1er élément visuel apparaît AVANT ~1-1.5s** (frame ~20-45), JAMAIS à 5s.
- Caler les apparitions sur les mots de la voix-off (forced-alignment) — pas de temps mort en ouverture.
- Si les 3 premières secondes sont vides → recaler le segment audio (`SEG_START_FRAME`) sur la phrase-clé.

### Pas de redondance
- **Sous-titre INUTILE quand le texte hero EST déjà à l'écran en grand** (question, punchline, mot-clé). Le retirer.
- Sous-titre utile uniquement quand la voix dit autre chose que ce qui est affiché.

---

## 3bis. SFX & AUDIO (NON-NEGOTIABLE — un beat muet n'est pas fini)

> Ajouté 2026-06-03 (le système data-viz l'avait omis, contrairement au Mapbox). Un beat data-viz a un design sonore au même titre qu'une carte. Catalogue : `public/_shared/sfx/SFX-INDEX.md`. Plancher volume SFX = **0.5**.

**Règle d'assemblage audio (pattern skeleton) :**
- **Narration globale** au niveau de l'assemblage (`<Episode>Full`). Pour tester un beat/segment isolé : `<Audio src={narration} startFrom={frameDébutSegmentDansNarrationGlobale} />`.
- **Musique** : même offset, volume bas (~0.08).
- **SFX ponctuels** via `<Sequence from={frame}><Audio volume={>=0.5} /></Sequence>`.

**SFX par événement HERO DATA (mapping type) :**
| Événement | SFX (catalogue) | Volume |
|---|---|---|
| Objet hero apparaît (FloatingHeroObject) | `ui/reveal.mp3` | 0.6 |
| Barres montent (HeroVerticalBars / MirrorBars) | `ui/whoosh.mp3` | 0.55 |
| Count-up des chiffres | `data/counter-tick.mp3` / `tick-counter.mp3` | 0.5 |
| Verdict / barre dominante (impact) | `impact/impact.mp3` | 0.65 |
| Cartouche / plaque qui claque | `ui/stamp-dossier.mp3` / `ui/plate-pop.mp3` | 0.6 |
| Transition seamless (zoom intra-élément) | `ui/whoosh.mp3` / `camera/sfx-swoosh-*.mp3` | 0.55 |

**Le storyboard (template §3) DOIT remplir le champ 10 (SFX / AUDIO CUE) — aucun beat ne se code sans son design sonore prévu.**

---

## 4. ÉCART AU PREMIUM — chantiers d'amélioration (arbitrés Gemini)

| Constat | Réf premium | Comment combler dans notre stack |
|---|---|---|
| Transitions trop segmentées (slideshow) | Vox / Kurzgesagt | Match cut + zoom intra-élément + caméra virtuelle continue |
| Manque de profondeur (flat design pur) | Bloomberg | Drop-shadow dynamique + parallaxe fond/premier plan (2.5D) |
| Springs trop linéaires/abruptes | Polymatter / Kurzgesagt | Plus d'anticipation (recul) + overshoot (dépassement) sur les tokens physique |

---

## 5. CE QU'ON FAIT BIEN DÉJÀ (à garder)

- Chiffre-événement count-up + spring (P1) — appliqué **bien** (M-Pesa, Niger)
- Discipline chromatique navy/gold/ivory (P2) — appliqué **bien**
- Contraste d'échelle hero vs métadonnées (P4) — appliqué **bien**
- Highlight typo synchronisé voix (P6) — appliqué **bien**
- Métaphore physique (P7) — appliqué **partiellement** (balance Niger, pièce M-Pesa)
- 1 narration globale + offsets audio-dérivés (assemblage propre) — voir [[SOUVERAIN-REMOTION-SKELETON]]

**À pousser :** P3 (reveals organiques pas fondus plats), P5 (2.5D/parallaxe), P8 (transitions seamless = faiblesse #1).

---

## Sources

- Nos 2 vidéos data-viz : Silicon Savannah, Niger Uranium (analysées 2026-06-02)
- Script génération : `scripts/tools/gemini-remotion-playbook.py`
- JSON bruts : `/tmp/remotion-playbook-appel1.json` (principes), `/tmp/remotion-playbook-appel2.json` (gap + doctrine + template)
