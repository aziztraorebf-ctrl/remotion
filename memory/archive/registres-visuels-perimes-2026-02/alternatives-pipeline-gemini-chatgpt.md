# Alternatives & Pistes Strategiques — Synthese Gemini + ChatGPT (2026-02-21)

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — réserve stratégique fev 2026 pour le pipeline
> PixelLab + Remotion (projet Peste 1347 pixel art, depuis abandonné pour Atlas Mapbox pur).
> Aucun des pipelines B-E n'a été adopté. Conservé pour l'historique de décision et les principes
> génériques (niveaux d'ambition visuelle, citation de vision stratégique).

> Ce fichier était une "reserve strategique" : toutes les pistes alternatives proposees par Gemini (152p)
> et ChatGPT (68p). A consulter si le pipeline actuel (PixelLab + Remotion, a l'epoque) rencontrait un blocage majeur.

---

## Pipeline A : Actuel a l'epoque (PixelLab + Aseprite + Remotion)

**Statut :** Pipeline actif a l'epoque. Assets generes (8 personnages). Checklist anti-flottement etablie.

**Forces :**
- Assets deja produits (8 personnages Peste 1347, animations)
- Pipeline Claude Code maitrise (MCP PixelLab fonctionnel)
- Remotion = controle total du timing, overlays, audio sync

**Faiblesses connues :**
- Flottement CSS si regles non respectees (voir checklist key-learnings.md)
- Style "pixel art riche" attendu par les modeles IA = incompatible avec niveau 1.5 vise

---

## Pipeline B : Recraft SVG → Jitter/Lottie → Remotion (style "Enluminure Vivante")

**Source :** Gemini, pages 101-140

**Description :**
Abandonner le pixel art pour passer a un style vectoriel "Gravure medievale coloree". Personnages
qui ressemblent a des dessins faits a la main (traces noirs, textures papier) mais animes avec la
fluidite d'un dessin anime moderne.

**Stack :**
1. Recraft.ai → generation SVG style "Gravure medievale" (seul generateur grand public qui produit vrai SVG natif, pas image dans SVG)
2. Recraft "Style Room" → definir identite visuelle coherente une fois pour toutes
3. Vectorisation : Vtracer (open source) pour convertir eventuellement des assets PixelLab existants
4. Jitter.video API ou Glaxnimate → animation presets sur les SVG
5. Export JSON Lottie → integration dans Remotion via composant `<Lottie />`

**Avantages vs pixel art pur :**
- Resolution infinie (zoom sans flou)
- Animation 60fps constant (vs 8-12fps pixel art)
- Poids leger (quelques Ko de code vs beaucoup de frames PNG)
- Controle dynamique (changer couleur d'habit par code)
- Coherence garantie si Style Room bien configure

**Inconvenients :**
- REPART DE ZERO : tous les assets PixelLab existants deviennent obsoletes
- Vectorisation automatique de pixel art = mauvaise qualite (bords lisses, perte du style escalier)
- Style SVG = plus "froid" — moins adapte aux scenes emotionnelles
- Recraft.ai : statut MCP non confirme a l'epoque (verifier disponibilite API)

**Non retenu.**

---

## Pipeline C : Manim (cartes historiques) + Remotion (scenes personnages)

**Source :** Gemini

**Description :**
Ne pas tout faire dans Remotion. Utiliser Manim (Python) specifiquement pour les sequences de
donnees : cartes de propagation de la peste, graphiques de mortalite, flux de contagion.

**Stack :**
- Manim (Python) → cartes historiques, schemas epidemiologiques, donnees visuelles
- Remotion → scenes avec personnages, narration, overlays texte
- Assemblage final : exporter les sequences Manim en MP4 et les integrer comme `<Video>` dans Remotion

**Avantages :**
- Manim = style academique/noble, tres adapte aux documentaires historiques
- MCP server Manim existe → Claude genere des scenes Python sans toucher le code
- Separation claire : Manim pour les "faits", Remotion pour la "narration"

**Non retenu** (le projet a depuis résolu ce besoin nativement en Remotion via d3-geo/Mapbox).

---

## Pipeline D : Motion Canvas (sequences de contagion/flux organiques)

**Source :** Gemini

**Description :**
Motion Canvas (TypeScript) pour les sequences ou beaucoup d'objets bougent de maniere semi-aleatoire :
rats qui se propagent, humains infectes, flux de population.

**Avantages :**
- Canvas API → 500 objets simultanes fluides (vs Remotion qui est base sur le DOM)
- Generators (yield*) pour sequences chainees elegantes
- Editeur en temps reel (preview instantane)

**Inconvenients :**
- Stack supplementaire a apprendre
- Pas integre nativement dans le workflow Claude Code actuel a l'epoque
- Pour Remotion : utilisation via `<Video>` composant (export MP4 puis integration)

**Non retenu.**

---

## Pipeline E : Rive (personnages articules avec State Machine)

**Source :** Gemini

**Description :**
Rive est le seul outil ou un personnage a des textures, degrades, look "BD/HD" et reagit
dynamiquement au code via une State Machine (isWalking, isSick, isCrying).

**Stack :**
- Rive editor → creer personnage articule avec states
- Integration Remotion via `@rive-app/react-canvas`
- State Machine → changer etat par code (`isWalking: true`)

**Avantages :**
- Personnages avec vraie articulation (pas sprite sheet PNG)
- Style HD possible (textures, degrades, look semi-realiste)
- Reactions dynamiques au code sans regenerer les assets

**Inconvenients :**
- Necessite de "dessiner" les personnages dans Rive editor (pas de generation IA)
- Pipeline tres different du workflow actuel a l'epoque
- Courbe d'apprentissage significative

**Non retenu.**

---

## MCP Sur-Mesure — Vision Pipeline Complet Automatise

**Source :** Gemini (pages 130-152)

**Description :**
Claude Code peut ecrire un serveur MCP pour n'importe quelle API documentee. Vision finale :
pipeline entierement pilote par Claude via MCP enchaines.

**Pipeline theorique via MCP :**
1. MCP Recherche → Claude cherche les donnees historiques (Wikipedia, sources medievales)
2. MCP Recraft → genere personnages et decors en SVG style "Gravure medievale"
3. MCP Jitter/Lottie → anime les SVG, recupere JSON Lottie
4. MCP ElevenLabs → genere la voix off
5. Remotion Master → assemble tout et lance le rendu

**Realite pratique (evaluation honnete a l'epoque) :**
- PixelLab MCP = deja fonctionnel dans ce projet (preuve que c'est faisable)
- Recraft MCP = pas disponible nativement, faisable mais necessite ~1-4h d'implementation
- Estimation "10 minutes" de Gemini = optimiste. Realite : 1-4h par nouveau MCP avec friction auth/CORS
- La vraie valeur : une fois configure, les iterations de style deviennent instantanees
  (ex: changer le parametre `--style` et relancer toutes les generations)

**Avantage concurrentiel cle (formule Gemini) :**
"Les autres YouTubers font de l'assemblage. Toi tu fais de la fusion. L'image est creee pour le code,
et le code est ecrit pour l'image."

---

## Principe Directeur : Niveau d'Ambition Visuelle (ChatGPT)

**Les 3 niveaux definis par ChatGPT :**

| Niveau | Description | Complexite | Faisabilite solo |
|--------|-------------|------------|-----------------|
| 1.5 | Stylise simple, palette restreinte, plateau de theatre, reutilisation massive | 4/10 | Oui |
| 2 | Parallaxe, effets lumiere, foule credible | 7/10 | Difficile |
| 3 | Quasi jeu video, monde coherent, pipeline studio | 9/10 | Non |

**Le projet visait le niveau 1.5 a l'epoque.** Les images generees par IA montrent toujours du 2.5/3 (car
entrainement sur jeux indie finis). Ne pas les utiliser comme reference de direction artistique.

**Formule cle :** "La technologie pousse vers la richesse visuelle. Toi tu veux la maitrise structurelle."

---

## Outils Non Explores mais Mentionnes (a investiguer si besoin, jamais suivi depuis)

| Outil | Usage | Note |
|-------|-------|------|
| Rough.js | Transforme SVG en style "crayonne/croquis" | Utile pour sequences documentaire historique |
| Two.js | Bibliotheque 2D neutre (SVG/Canvas/WebGL) | Syntaxe LLM-friendly |
| P5.js | Simulation narrative (contagion organique) | Chaque habitant = un point qui bouge |
| Theatre.js | Timeline visuelle (type After Effects) branchee sur Remotion | Enregistrer mouvements a la souris |
| After Effects | Standard industriel | A utiliser UNIQUEMENT comme "Finisseur" : vernis final, etalonnage, particules |

---

## Citation Finale — La Vision Strategique (a l'epoque)

**Gemini :** "Tu n'es pas en train de faire une video. Tu es en train de construire un systeme de narration.
Une fois la stack Remotion prete, tu peux produire 10 episodes sur la Peste avec la meme qualite
qu'un documentaire Netflix, seul sur ton Mac mini M1. Le seul facteur limitant : ta narration."

**ChatGPT :** "Ta vraie valeur n'est pas le pixel art. Elle est : script solide, recherche, structure
segmentee, angle narratif, paralleles implicites. Le pixel art est un support. Pas le produit."

---

*Cree : 2026-02-21. Source : analyse PDF Gemini (152p) + ChatGPT (68p) par agent dedie.*
