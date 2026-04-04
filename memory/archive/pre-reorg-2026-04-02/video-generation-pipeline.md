# Video Generation Pipeline — Regles & Outils
> Fusionne kling-pipeline.md + recraft-pipeline.md | Mise a jour : 2026-03-15

---

## 1. Quel outil pour quel plan ?

| Plan | Outil | Modele |
|------|-------|--------|
| Gros plan visage / emotion | Gemini 3.1 Flash Image → Kling V3 Pro | cfg 0.4 |
| Plan epique / armee / territoire | Recraft vivid_shapes → Kling O3 | cfg 0.35 |
| Transition cinematique (dolly in / zoom) | Gemini start+end → Kling O3 | cfg 0.4 |
| Carte / timeline / data | SVG Remotion spring() pur | — |
| Animation image unique (respiration, mouvement) | Gemini → Kling V3 standard ou Pro | cfg 0.35 |

**Orbite 360 = vivid_shapes UNIQUEMENT.** Semi-realiste = morphing visage garanti.

### Révélations techniques (tests Hannibal 2026-03-16, validées round 2)

**1. Crane-up rapide = plan signature**
Kling crane-up sur personnage flat : caméra part du visage, monte vite, révèle toute l'armée + paysage. Cohérence 2D maintenue pendant tout le mouvement. Plan épique impossible à obtenir aussi facilement en semi-réaliste. À systématiser sur tous les personnages historiques.
- **Manque identifié** : les éléments à l'horizon (bateaux, mer) restent statiques. Prochain test : animer légèrement l'océan/bateaux en arrière-plan pour donner vie à la profondeur. Serait un upgrade significatif.

**2. Visage détaillé = exception, pas la règle**
Les plans larges/moyens peuvent garder des visages abstraits/sans traits. On réserve les plans portrait (push-in doux) pour les moments narratifs clés. Kling gère parfaitement la transition abstrait→détaillé dans un même clip. Libère de la contrainte d'animer les émotions sur chaque plan.
- **PAS de "smash zoom"** : l'approche violente génère des artefacts (objet tombant du ciel). Utiliser "slow majestic push-in", "camera glides forward gently" — la révélation vient du visage, pas du mouvement.
- Prompt correct : "slow cinematic push-in toward face, camera glides gently forward, face fills the frame gradually"
- cfg_scale 0.3, V3 Pro
- **Œil fermé confirmé tenu sur TOUT le clip** (round 2 validé) : passe de patch crispé → paupière plissée fermée, ne s'ouvre jamais. Kling respecte si prompt + negative_prompt sont précis.
- **Scène plus longue = plus de risque** : si le plan portrait dure longtemps avant le mouvement de caméra, Kling peut commencer à normaliser l'œil. Couper le clip 1-2s avant la fin pour éviter le point limite.

**3. Arc 180° = outil de transition de scène**
L'arc de caméra permet de changer d'ambiance (vert/neige → or/armée) de manière cinématographique et cohérente dans un seul clip. Outil de storytelling puissant : une scène peut raconter deux temps narratifs via l'arc.

**4. Style flat 2D résiste mieux aux mouvements rapides de caméra que le semi-réaliste**
Contours forts + formes simples = pas de morphing pendant l'arc ou le crane-up. Confirmé sur ces tests.

**5. Cape rouge + casque = signature visuelle de continuité**
Même si les plans changent radicalement (silhouette abstraite → portrait serré → vue aérienne), ces deux éléments présents dans chaque clip suffisent pour que le spectateur reconnaisse le personnage sans transition explicite. Règle : toujours inclure au moins un élément signature visible dans chaque plan d'un même personnage.

**6. Style vivid_shapes flat 2D = candidat sérieux pour remplacer le semi-réaliste**
Décision Aziz en cours : abandonner le semi-réaliste comme style principal. Garder le portrait semi-réaliste UNIQUEMENT pour les gros plans ultra-importants (révélation émotionnelle forte). Le reste de la vidéo en style flat 2D vivid. Applicable à Amanirenas et futurs projets historiques.

**7. Deux palettes vivid_shapes validées — choisir selon l'ambiance narrative**
Même substyle Recraft V3 vivid_shapes, résultats radicalement différents selon la palette :
- **Palette froide (Alpes)** : vert menthe + bleu marine/violet + blanc — hivernale, épique, graphique. Source : `tmp/brainstorm/hannibal-recraft-v3-vivid.png`. Silhouettes sombres sur fond clair = contraste fort = moins de morphing Kling = plus permissif pour mouvements rapides.
- **Palette chaude (Rome/port)** : or + rouge + sable — méditerranéenne, dramatique. Source : `public/assets/hannibal test/hannibal-vivid-portrait-REF.png`.
- **Règle** : palette froide = scènes de guerre/territoire/déplacement. Palette chaude = scènes de pouvoir/révélation/face-à-face.
- **Visage expressif possible dans les deux styles** : Kling peut zoomer sur une silhouette vivid_shapes et révéler un visage cartoon expressif (œil fermé tenu, expression dramatique). Pas besoin de passer au semi-réaliste pour l'émotion.

---

## 2. Recraft — Regles essentielles

### Modeles utiles
| Modele | Acces | Format | Usage |
|--------|-------|--------|-------|
| `recraftv3` via MCP | MCP | 1024x1024, 1024x1707 | Raster + styles |
| `recraftv3_vector` via MCP | MCP | 1024x1707 (9:16) | SVG portrait — SEUL vecteur 9:16 |
| `recraftv4_vector` via API directe | API REST | 1024x1024 seulement | Carre uniquement |

**Pour format 9:16 SVG : `recraftv3_vector` + `size: "1024x1707"` — V4 ne supporte pas.**

### Substyle vivid_shapes
- Meilleur substyle pour Kling : blocs tres contrastes = separation des plans = orbite possible
- Commande MCP : `style: "vector_illustration"`, `substyle: "vivid_shapes"`
- SVG sorti = image bloc (pas animable par elements) — zoom/pan global uniquement

### Style custom (create_style)
- `mcp__recraft__create_style` depuis start frame → `style_id`
- Garantit coherence FORMELLE (shapes, style) — PAS la coherence chromatique exacte
- Dissonance palette start/end = relue narrativement par Kling O3 (acceptable)

### Regle d'or SVG Recraft
Ne jamais reordonner les calques, changer preserveAspectRatio, supprimer backgroundColor.
Si la composition ne convient pas → regenerer avec nouveau prompt, pas modifier le SVG.

---

## 3. Pipeline Recraft vivid_shapes → Kling O3 (VALIDE production)

```
1. Start frame : Recraft MCP recraftv3, vivid_shapes, 1024x1707
2. Style ID    : mcp__recraft__create_style depuis start frame
3. End frame   : Recraft avec meme style_id, position finale souhaitee
4. Kling O3    : fal-ai/kling-video/o3/standard/image-to-video
                 tail_image_url=end_frame, cfg_scale=0.35, duration="8" min
```

**End frame = sujet seul + pose finale. Pas d'armee, pas de foule — Kling les invente mieux.**

### Règles start/end frame pour éviter l'improvisation Kling (2026-03-17)

**Règle fondamentale : l'écart visuel entre start et end frame doit être minimal.**
Plus l'écart est grand → plus Kling improvise → silhouettes génériques, angles inattendus, perte de détails.

| Écart start→end | Résultat Kling | Recommandation |
|-----------------|----------------|----------------|
| Même cadrage, léger mouvement | Anime fidèlement | Idéal |
| Même cadrage, éléments ajoutés | Anime avec quelques libertés | Acceptable |
| Cadrage différent (angle/distance) | Invente sa propre transition | À éviter |
| Composition complètement différente | Improvise totalement | Interdit |

**Pour la révélation d'armée :** ne pas changer l'angle de caméra. Start = Hannibal seul, Alpes, plan large. End = même plan exact, armée apparue derrière lui. Kling anime l'apparition des soldats sans changer le cadre.

**Règle analyse critique des frames (2026-03-17, OBLIGATOIRE) :**
Claude doit analyser CHAQUE frame extraite avec un oeil hostile, pas complaisant. Points à vérifier systématiquement :
1. Style des personnages secondaires (soldats, foule) — ont-ils changé de style vs end frame ?
2. Orientation des visages/corps — semi-réaliste apparu ?
3. Éléments inventés par Kling non présents dans les frames sources
4. Mouvements anormaux (tête qui tourne, membres qui glissent)
5. Cohérence palette entre début et fin du clip
Ne JAMAIS valider un clip sans avoir vérifié ces 5 points. Une analyse incomplète = feedback inutile pour Aziz.

**Règle orientation personnages pour animation Kling (2026-03-17, VALIDEE) :**

| Orientation | Mouvement Kling | Résultat |
|-------------|-----------------|---------|
| De face / de dos | Marche avant/arrière | Naturel et convaincant |
| De profil (90°) | Glissement latéral | Artificiel — à éviter |
| 3/4 dos | Acceptable | Variable selon la scène |

- Soldats en profil dans les colonnes = beau statiquement MAIS Kling les fait glisser latéralement au lieu de marcher
- **Règle** : pour toute scène avec marche/mouvement, placer les personnages de face ou de dos — JAMAIS en profil pur
- Pour une armée en mouvement convaincant : soldats de dos marchant = illusion parfaite de progression vers l'avant
- Hannibal de dos/face = marche toujours naturelle. Soldats en profil dans colonnes = glissement artificiel.

**Dérive style soldats secondaires quand caméra avance (2026-03-17) :**
Quand Kling anime soldats de dos + caméra qui avance, il invente des détails semi-réalistes (nuques, visages, vêtements) non présents dans les frames sources. Les soldats flat navy → soldats semi-réalistes dans le clip.
- Cause : caméra qui avance = Kling génère les détails "derrière" les personnages qu'il ne voit pas
- Solution à tester : cfg_scale plus haut (0.4-0.45) pour forcer fidélité aux frames
- Alternative : end frame avec soldats encore plus schématiques, ou éviter que la caméra avance vers eux

**Silhouettes sombres = signe d'improvisation excessive.** Si Kling produit des silhouettes uniformes sombres au lieu de soldats détaillés flat, c'est que l'écart start→end était trop grand.

**Style flat = plus permissif sur les détails mais PAS sur la composition.** Kling peut simplifier les détails d'un style flat, mais si la composition change, il recrée tout.

### Clip référence : hannibal-army-appear-MASTERPIECE.mp4 (2026-03-17)
**Points forts exceptionnels :** ombre d'Hannibal au sol animée avec l'épée, cape physique, mouvement de marche naturel, Alpes animées, neige, cohérence personnage principal du début à la fin.
**Défaut unique :** soldats secondaires dérivent vers semi-réaliste en fin de clip (caméra qui avance vers leurs dos).

**Pour corriger ce défaut — à tester prochaine session :**
1. `cfg_scale: 0.45` au lieu de 0.35 — force plus de fidélité aux frames sources
2. End frame avec soldats encore plus schématiques (silhouettes navy sans détails de vêtements)
3. Prompt ajout : "soldiers remain flat graphic shapes, no realistic skin or clothing texture"
4. Negative prompt ajout : "realistic skin, fabric texture, detailed clothing, semi-realistic soldiers"
5. Option radicale : générer un end frame où les soldats sont de FACE (on les voit arriver vers nous) — Kling n'a pas besoin d'inventer leurs dos

### References validees
| Clip | Score | Notes |
|------|-------|-------|
| `references/hannibal-o3-flat-vivid-VALIDATED.mp4` | 8.5/10 | Orbit + cape + armee |
| `references/amanirenas-o3-vivid-VALIDATED.mp4` | 8.7/10 | Orbit 180 + army reveal |
| `references/amanirenas-o3-v2a-PREFERRED.mp4` | PREFERE Aziz | 8s, pyramides animees |
| `tmp/brainstorm/hannibal-elements-v1.mp4` | 9.5/10 Kimi | **REFERENCE ELEMENTS** — soldats dark/violet stables, style flat parfait |

**DEFAUT tous clips Amanirenas : deux yeux ouverts (borgne absente de la source Recraft). REF TECHNIQUE SEULEMENT.**

### Technique elements — PROUVEE (2026-03-17)

**Probleme resolu :** soldats secondaires qui derivent vers semi-realiste (blanc/gris) en cours de clip.

**Solution :** parametre `elements` dans Kling O3/V3 — fournir refs images des personnages AVANT generation.

```python
"elements": [
    {"frontal_image_url": url_hannibal_ref, "reference_image_urls": []},
    {"frontal_image_url": url_soldat_ref,   "reference_image_urls": []},
]
```
Dans le prompt : referencer comme `@Element1` (Hannibal) et `@Element2` (soldat type).

**Assets canoniques :**
- Hannibal REF : `tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png`
- Soldat type REF (de dos) : `tmp/brainstorm/references/hannibal-soldier-type-REF.png`
- Script pret : `scripts/test-hannibal-elements-v1.py`

**Regles apprises :**
- `elements` ne remplace pas start+end frame — les deux sont complementaires
- cfg_scale 0.45 + elements = meilleur verrouillage style que cfg_scale 0.35 seul
- Ref soldat de dos = suffisant pour scenes armée marchant vers l'avant (pas besoin ref de face)
- Bouclier "magique" (bras non visible) = artefact de la ref generee. Fix : ref soldat avec bras gauche clairement visible tenant le bouclier
- Motion Control non necessaire pour marche naturelle en style flat — elements seul suffit

---

## 4. Pipeline Gemini → Kling V3 Pro (portraits semi-realistes)

```
1. Image source : Gemini 3.1 Flash Image Preview, passer ref comme Part.from_bytes()
2. Kling V3 Pro : fal-ai/kling-video/v3/pro/image-to-video, cfg 0.4, 9:16
```

- V3 Pro = obligatoire pour visage principal (1080x1920, details preserves)
- V3 standard = suffisant pour decors/cartes (720x1280)
- Kling "normalise" les traits physiques inhabituels (oeil ferme → ouvre, cicatrice → attenue)

---

## 5. Pipeline Gemini → Kling O3 (transition dolly in)

```
1. Start frame : Gemini + ref image Part.from_bytes() — plan large
2. End frame   : Gemini + meme ref — gros plan / position finale
3. Kling O3    : fal-ai/kling-video/o3/standard/image-to-video, cfg 0.4
```

**End frame Gemini : TOUJOURS passer l'image source comme Part.from_bytes(), jamais texte seul.**

---

## 6. Kling — Regles critiques (#1 a #34)

### Endpoints fal.ai
| Endpoint | Usage |
|----------|-------|
| `fal-ai/kling-video/v3/standard/image-to-video` | Animation image unique (decors, cartes) |
| `fal-ai/kling-video/v3/pro/image-to-video` | Portrait semi-realiste, visage principal |
| `fal-ai/kling-video/o3/standard/image-to-video` | Start+end frame (transition cinematique) |

**JAMAIS utiliser v1.6 — version obsolete.**

### cfg_scale par usage
- `0.35` : flat design vivid_shapes O3 (anti-morphing)
- `0.4` : portrait semi-realiste V3, dolly in O3
- `0.5-0.6` : cartes geo V2.1 (pas V3 — derive geographique a 0.6)

### Durees
- Portrait V3 : 5s suffisant
- Orbit + reveal O3 : minimum 8s (5s trop court)
- Dolly in O3 : 10-15s selon le beat audio

### Regles comportement Kling
- **Kling narrativise** : invente choregraphie, transfert d'objet, synchronisation armee — ne pas contrer
- **Kling normalise les traits** : oeil ferme → ouvre, cicatrice → attenue. Forcer via negative_prompt.
- **Kling anime fidelement la source** : si defaut dans l'image source → defaut dans le clip. Valider la source d'abord.
- **recraft vivid_shapes = direction narrative** : les images sources semblent ordinaires. Juger le clip, pas les sources.
- **End frame = intention, pas prescription** : elements secondaires (armee) mieux inventes par Kling que forces dans l'end frame
- **Allonger la duree n'ameliore pas le morphing** : rapprocher l'end frame de l'etat intermediaire naturel

### Checklist personnage historique avant envoi a Kling
- [ ] Trait distinctif visible dans l'image source (oeil, cicatrice, couleur peau)
- [ ] Negative_prompt : interdire la "correction" du trait (`"open right eye, both eyes open"`)
- [ ] Positive prompt : renforcer le trait (`"right eye permanently closed by battle scar"`)

---

## 7. Cartes geographiques

**Gemini = meilleur pour cartes.** Recraft ne comprend pas la geographie reelle.

| Carte | Fichier | Usage |
|-------|---------|-------|
| Nil/Nubie/Egypte | `references/map-nil-gemini-v2.png` | Amanirenas |
| Mediterranee | `references/map-mediterranee-gemini-v1.png` | Hannibal |

**Prompt cle :** `"Bold flat vector graphic map, NO TEXT, NO LABELS, NO ANNOTATIONS"` + style Kurzgesagt.

### Narration symbolique Remotion (valide)
Technique : personnage → dissolve silhouette → carte + route draw-on → zoom → retour personnage.
- Route animee : stroke-dashoffset spring()
- Zoom max sur image raster : 2x (au-dela = pixelisation)
- Reference : `references/hannibal-narration-remotion-v3.mp4` (7.5/10)

---

## 8. Remotion — Regles techniques

- `<Video muted>` pour couper l'audio ambiant Kling
- Texte overlay : SVG separe `viewBox="0 0 1080 1920"` — jamais dans le viewBox du backdrop
- `beatFade` + `OffthreadVideo` sur fond noir = double assombrissement — retirer opacity sur AbsoluteFill
- spring() > interpolate() pour mouvements naturels
- extrapolateLeft/Right: 'clamp' sur tous les interpolate
- Anti-patterns : CSS transition, @keyframes, setTimeout, requestAnimationFrame

### Hooks animation valides (src/hooks/animation/index.ts)
| Hook | Usage |
|------|-------|
| `useOceanSwell(i, frame)` | Mouvement vertical bateaux |
| `useSpringEntrance(i, frame, fps, delay?)` | Entree progressive |
| `useDrift(i, frame, directionPx, ...)` | Derive horizontale |
