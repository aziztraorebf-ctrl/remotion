# INDEX PAR INTENTION → FORME — SVG animé

> Porte d'entrée SVG. Consulter APRÈS avoir répondu à « ce moment doit faire ressentir QUOI ? » (1 verbe).
> Règle : intention (1 verbe) → forme (le geste) → technique (fiche dans `techniques/`) → élément (dans `elements/`).
> Ne pas partir de l'élément ou de la technique — partir de l'intention. Sinon : sur-animation assurée.
>
> Source de vérité éléments : `SVG-LIBRARY-INDEX.md`. Palette de référence : registre encre GGW (5 couleurs).

---

## TABLE INTENTION → FORME SVG

| Intention (ce que doit ressentir le spectateur) | Forme (le geste visuel) | Technique | Élément recommandé |
|---|---|---|---|
| Faire apparaître un arbre qui pousse | L'arbre émerge du sol, grandit vers le haut | `reveal-clippath-bottom-up` | Arbre Sahel (`elements/nature/trees/`) |
| Coloriser une forme déjà dessinée (verdir, envahir) | Une couleur se répand depuis un point, gagne toute la surface | `buvard-circulaire` | Tout SVG path fermé |
| Dessiner un trait progressivement (contour, hachure) | Le trait s'étire de son point d'origine | `strokeDashoffset-drawing` | Sol aride + hachures (`elements/nature/ground/`), silhouettes |
| Un élément vivant qui respire ou brille | Lueur qui pulse en boucle lente | `glow-pulse-sinusoidal` | Soleil radiant (`elements/nature/sun/`), graine |
| Un feuillage qui se balance au vent | Rotation oscillante du houppier, pivot en bas du tronc | `sway-houppier` | Arbre Sahel (houppier isolé) |
| Apparition avec rebond / vitalité organique | Scale 0→1 avec overshoot (dépasse, se stabilise) | `spring-elastique-overshoot` (damping:9, stiffness:140, mass:0.8) | N'importe quel élément SVG |
| Une forêt entière qui pousse en cascade | Chaque arbre croît avec un délai décalé (stagger) | `reveal-clippath-bottom-up` + delays décalés par index | Arbre Sahel × N, Souche × N |
| Une couleur qui envahit un territoire (forme rectangulaire) | Rectangle grandissant de gauche à droite ou du bas vers le haut | `reveal-clippath-bottom-up` (axe horizontal si rectangle) | Sol aride, forme géographique abstraite |
| Un contour qui se dessine (carte, silhouette de pays) | Le trait parcourt le périmètre depuis un point de départ | `strokeDashoffset-drawing` avec `pathLength:1` | Silhouette SVG du pays, contour de carte |
| Une dégradation / mort progressive | L'élément rétrécit et perd sa couleur vers le gris | `opacity` + `scale` vers 0 + filtre desaturation | Arbre Sahel → Souche, Sol vert → Sol aride |
| Une graine qui germe (micro-naissance) | Graine apparaît (spring rebond), puis se fend, poussin émerge | `spring-elastique-overshoot` puis `reveal-clippath-bottom-up` | Graine (`elements/nature/trees/`) |
| Un soleil qui se lève | Disque monte depuis le bas, rayons s'étendent | `reveal-clippath-bottom-up` (disque) + `strokeDashoffset-drawing` (rayons) | Soleil radiant (`elements/nature/sun/`) |

---

## PATTERNS NARRATIFS GGW (au-delà de l'effet unitaire — ils STRUCTURENT le récit)

> La table ci-dessus = effets unitaires. Ces patterns = comment ENCHAÎNER les effets sur plusieurs beats pour
> raconter, pas une suite de plans. Prouvés GGW Muraille Verte + Cacao→Chocolat (2026-06-29).
> Preuve cacao : `memory/episodes/souverain/cacao-chocolat-short/DA-BRIEF-ANIMATION.md` (leçons + pré-plan B3/B4).

| Pattern narratif | Geste | Quand l'utiliser |
|---|---|---|
| PROPORTION = CHIFFRE | X éléments sur N s'allument/se colorisent (ex: 2 plants /14 en brun-vie, reste en encre morte) | Porter un chiffre du script (« un septième », « 3 sur 4 ») sans infographie LLM |
| BOUCLER LA BOUCLE | L'image finale fait écho à l'image-problème initiale, résolue | Climax / fin — fermer l'arc visuellement |
| EXPLOITER UN SILENCE par l'animation | Un élément discret s'éveille (réseau racinaire, lueur) pendant un temps mort audio | Meubler un blanc de narration sans ajouter d'info |
| FIL DE TRANSFORMATION CONTINU (⭐ dépasse GGW) | Les éléments se TRANSFORMENT et REVIENNENT au lieu d'apparaître/disparaître : tablette→graphique→revient ; champ qui reverdit puis ternit ; carte qui réapparaît. Un même monde qui évolue sur N beats. | Tout Short/scène multi-beats — crée la continuité (GGW bouclait 1×, le fil = mieux) |

### Règle anti-sur-épurage (corollaire premium-d'abord)
« Registre encre » != « minimal/pauvre ». Viser la RICHESSE NARRATIVE (sens par geste, tension, transformation)
DÈS le 1er brief, JAMAIS en rattrapage. Anti-pattern prouvé coûteux (cacao B1/B2) : briefer une tablette/carte
nue puis devoir ajouter geste/couleur après render. Et : on sur-utilise le split-screen — scanner d'abord
buvard-circulaire / proportion=chiffre / fil continu AVANT de défaut sur split.

## Règles de composition SVG (non-negotiables)

- **1 technique par intention** — ne pas cumuler 3 effets sur le même élément pour compenser un dessin faible.
- **Rythme** : un événement visuel toutes les 4-6s maximum. Un arbre qui pousse + se balance + pulse = 3 beats distincts dans le temps, pas simultanés.
- **Spring > interpolate** pour le vivant — `spring()` (Remotion natif) pour tout ce qui doit paraître organique. `interpolate()` pour les effets mécaniques / géométriques.
- **Palette fermée** : 5 couleurs du registre encre GGW uniquement. Tout ajout = validation Aziz.
- **SVG = ABSTRAIT/SYMBOLIQUE** — pas de représentation humaine réaliste, pas de géographie exacte. L'arbre Sahel est un symbole, pas un baobab photographique.
