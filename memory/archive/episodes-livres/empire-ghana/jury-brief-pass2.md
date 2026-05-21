# Brief Jury Pass 2 — Empire du Ghana / Validation lockdown

> Vous êtes membre d'un jury opérationnel. Pass 1 (vision créative) a déjà eu lieu. Aziz a trié les idées. Cette Pass 2 est une **validation go/no-go avec recettes techniques précises** AVANT qu'on code.
>
> ⛔ **AUDIO + STRUCTURE SCRIPT VERROUILLÉS** — ne reproposez pas de modifications.
> ⛔ **DÉCISIONS PALETTE / MARCHANDS / TOP 7 VERROUILLÉS** — pas de remise en question.
> ✅ Votre rôle : **valider chaque recette** + **identifier pièges techniques** + **détecter gaps**.

---

## 1. Script V3 LOCKED (intégral, ~86.5s)

### Beat 0 — Hook (5s)
> Au cœur du Sahara, on troquait du sel contre de l'or. Au gramme près.

### Beat 1 — Setup géographique (13s)
> Wagadou. Aujourd'hui, presque personne ne connaît ce nom. Pourtant, du huitième au treizième siècle, cet empire ouest-africain contrôlait la richesse la plus convoitée du monde médiéval. Et il avait un secret.

### Beat 2 — Densité Cesar (~20.5s) — MENTION ESCLAVES INTÉGRÉE
> À Taghaza, au nord, le sel était extrait par blocs de quatre-vingt-dix kilos. À Bambouk, au sud, l'or sortait de la terre par poignées. Entre les deux, le désert. Et au centre exact, Koumbi Saleh. Vingt mille habitants. Une mosquée. Et un roi qui taxait chaque caravane — d'or, de sel, et d'esclaves.

### Beat 3 — Climax silent barter (16s)
> Mais le moment qui marque l'histoire, c'est ça. Sur les marchés du sud, les marchands déposaient leur sel. Puis ils s'éloignaient. Les acheteurs venaient. Posaient leur or à côté. Et repartaient sans un mot. Le silent barter. Sel contre or, presque au poids égal.

### Beat 4 — Conséquence (15s)
> Ce système a tenu cinq cents ans. Puis les Almoravides coupèrent les routes du sel en mille soixante-seize. Sécheresse. Effondrement. Et en mille deux cent quarante, un certain Sundiata Keïta détruit Koumbi Saleh. L'empire du Mali venait de naître sur les cendres de Wagadou.

### Beat 5 — CTA antithèse (8s)
> Wagadou. Cinq siècles de commerce mondial. Demande qui contrôlait l'or au Moyen-Âge. On te répondra Florence, Venise. Jamais Wagadou.

---

## 2. TOP 7 idées VERROUILLÉES (issues Pass 1)

| # | Idée | Priorité | Vague |
|---|------|----------|-------|
| 1 | **Balance signature dynamique** présente toute la vidéo (oscille selon mots-clés sel/or, équilibre à barter, brise à effondrement). Lottie déjà codé. | HAUTE | V1 |
| 2 | **Beat 3 silent barter — danse rituelle** : 2 sprites symétriques (sahélien sud + berbère nord) + dézoom 2.5x→1.2x + opacité 40% (effet fantomatique) + LightLeak doré + balance équilibre au midpoint narration ("sans un mot") | HAUTE | V1 |
| 3 | **Beat 4 — ligne de front rouge bordeaux** qui descend du nord et coupe SVG route du sel (Almoravides) | HAUTE | V1 |
| 4 | **Beat 4 — pivot Sundiata** : pas de nouvelle carte. Fade-to-black partiel + LightLeak + sceau Empire Mali (Lottie ou SVG) en surimpression sur ruines de Koumbi Saleh | HAUTE | V1 |
| 5 | **Beat 2 — Pop-up Labels** synchronisés mot-par-mot via Forced Alignment ElevenLabs (style notifications UI modernes pour chaque stat) | HAUTE | V1 |
| 6 | **Palette bordeaux profond #4A0E0E** pour routes/frontières (pas l'or — recommandation contraste d3-geo) | HAUTE | V1 |
| 7 | **Koumbi Saleh = ville en pierre/banco** + mosquée stylisée (POI majeur), pas des huttes. Gemini illustration ou Lottie minaret | MOYENNE | V1 |

---

## 3. Stack précis disponible (avec assets prêts)

### Marchands PixelLab READY (téléchargés et extraits dans `public/empire-ghana/characters/`)
- **Sahélien** (sud, apporte l'or) : robe ocre boubou + turban indigo
  - walking (4 dirs × 6 frames)
  - breathing-idle (4 dirs × 4 frames)
  - crouching (4 dirs × 5 frames) — pour le moment de dépôt
- **Berbère/Tuareg** (nord, apporte le sel) : robe indigo + tagelmust voile bleu
  - walking (4 dirs × 6 frames)
  - breathing-idle (4 dirs × 4 frames)
  - crouching (4 dirs × 5 frames)

### Composants Atlas réutilisables
- `AtlasMercator` (d3-geo Mercator + Natural Earth 50m)
- `AtlasGlobe`, `AtlasLabel`, `AtlasCaravane` (chemins bezier animés)
- `getSpriteFramePath` (helper sprite player PixelLab, validé)
- `InsertNombre1500.tsx`, `InsertNombre4000.tsx` (compteurs animés)
- Karaoke subtitles word-level via Whisper API (template `subtitles-shorts.md`)

### Lottie (validé 2026-05-03)
- Pattern `require()` direct (pas fetch+delayRender)
- Format JSON canonique strict (Wiggle skill)
- Limite : ~10 vertices bezier, 5 instances simultanées
- 3 JSON déjà disponibles : `crown-pulse`, `iklwa`, `arrow-pulse`, `balance` (du test silent barter)

### LightLeaks
- Pattern : opacity cap 0.35, brève (8-10 frames), wrapper div pour cap

### Gemini (images statiques)
- Pour : panoramas, illustrations signature (Koumbi Saleh banco)
- Pas pour : animation, séquences, sprites

### Audio
- ElevenLabs Narratrice GeoAfrique v2 (`z3gESu49naEZW8Af2Upm`)
- Forced Alignment frame-précis sur chaque mot

### Camera moves Remotion
- `interpolate()` continu pour pans/zooms (jamais segmenter — saccades visibles)
- `spring()` pour mouvements naturels avec damping

---

## 4. Palette officielle VERROUILLÉE (palette v1, validée Aziz)

```
NOIR_PROFOND        #1A0D0D    background global
SEPIA_FOND          #2D1810    fond carte secondaire
SABLE_NUIT          #3A2210    ellipse desert intérieur
SABLE_DESERT        #4A2E15    ellipse desert extérieur
PARCHEMIN           #E8DCC0    textes secondaires

OR                  #D4A574    POI, frontières royaumes (DORÉ PRINCIPAL)
OR_VIF              #E8B878    highlights, pulse
OR_TERNI            #8B5E2A    labels secondaires

BORDEAUX_PROFOND    #4A0E0E    routes/frontières d3-geo (ALERTE JURY P1)
BORDEAUX            #7A1F1F    pulse alerte, conquêtes
BORDEAUX_CHAUD      #A33232    climax tragique
ROUGE_SANG          #5C1A1A    gemmes, points critiques

INDIGO              #2B3A5F    robe berbère, voile touareg
INDIGO_VIF          #3F5689    pulse berbère, fleuves
BLEU_DESERT         #1F2E4A    ciel nuit Sahara

TERRACOTTA          #A0522D    voisins Wagadou
OCRE_BOUBOU         #B8741A    robe sahélien

BLANC_SEL           #E8E0D0    sacs de sel, mosquée
BLANC_BANCO         #D8C8A8    murs Koumbi Saleh

GRIS_RUINE          #5C5048    ruines post-effondrement
GRIS_CENDRE         #7A6E66    désaturation territoire
```

Typo : Cinzel/Cormorant (titres), Cormorant Garamond (cartouches), JetBrains Mono (chiffres/dates), Inter (karaoke).

---

## 5. Limites de Claude pour cette production

### Forces validées
- Génération Lottie JSON canon (icônes simples) ✅
- Composants Remotion + d3-geo + sprites PixelLab ✅
- Synchronisation Forced Alignment ✅
- Camera moves continus interpolate/spring ✅

### Faiblesses connues
- Path morphing Lottie complexe (>10 vertices) ❌
- Particules / systèmes physiques ❌
- Effets WebGL lourds (peuvent foirer en headless) ❌
- Reproduction d'images réalistes (utiliser Gemini)

---

## 6. 4 Questions Pass 2 (structurées)

### Q1. Validation idée par idée (oui / non / amendement)
Pour chacune des 7 idées du Top 7, réponds :
- **OUI** (à coder telle quelle)
- **NON** (justifier — limite technique ou risque)
- **AMENDEMENT** (proposer modification précise)

Attention : ne reproposez pas une idée écartée. Validez ou amendez celles présentées.

### Q2. Implémentation concrète par outil (decoupage)
Pour chaque idée validée OUI/AMENDEMENT, propose une **recette technique** :
- Outils utilisés (PixelLab / d3-geo / Lottie / SVG / Gemini / LightLeak)
- Frames clés concernées
- Pseudocode ou structure composant si pertinent
- Estimations effort (gros/moyen/petit)

### Q3. Question stylistique critique propre au projet
**Comment gérer la transition Beat 4 → Beat 5 ?** Le script passe de "L'empire du Mali venait de naître sur les cendres de Wagadou" (climax dramatique) à "Wagadou. Cinq siècles de commerce mondial." (CTA réflexif).

C'est un risque de friction tonale. Comment gérer cette transition (1-2 secondes) en visuel ?

### Q4. Gap detection (8e idée oubliée + pièges techniques anticipés)

#### 4a. 8e idée
Y a-t-il **UNE idée** clé qu'on aurait oublié et qui devrait absolument entrer en VAGUE 1 ? (max 1, justification courte)

#### 4b. Pièges techniques anticipés
Liste 3 pièges techniques précis qui pourraient bloquer cette production. Pour chacun : description + solution préventive.

---

## 7. Format de réponse attendu (Markdown)

```markdown
# Réponse [TON NOM] — Empire du Ghana Pass 2

## Note globale du brief : X/10

## Q1. Validation idée par idée
1. [OUI / NON / AMENDEMENT] — Balance signature dynamique : [recette ou justif]
2. [OUI / NON / AMENDEMENT] — Beat 3 silent barter : [...]
... (7 lignes)

## Q2. Implémentation concrète par outil
[Pour chaque idée validée, recette technique structurée]

## Q3. Transition Beat 4 → Beat 5
[Réponse]

## Q4a. 8e idée éventuelle
[Réponse ou "rien à ajouter"]

## Q4b. 3 pièges techniques
1. [piège + solution]
2. [piège + solution]
3. [piège + solution]
```

Réponds en français. Sois concis et opérationnel. Pas de répétition du brief. Pas d'éloges.
