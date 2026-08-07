# Script d'animation v2 — synthèse du jury à 4 (Gemini, Kimi, GPT, Grok)

> Synthèse écrite après rejet total de la v1 par Aziz (2026-08-07) : "diaporama statique", zéro
> motion design perçu. 4 jurys LLM indépendants (Gemini 3.1 Pro + Kimi K2.5 sur vidéo complète,
> GPT-5.5 + Grok 4.20 sur planche contact début/milieu/fin par panneau) ont rendu un verdict
> **unanime et convergent** — accord total avec Aziz, même cause racine identifiée sous 4
> formulations différentes. Verdicts complets : `out/_client-sim/noteshield/jury/*.md`.
>
> **Priorité de synthèse demandée par Aziz : GPT en premier** (le plus détaillé/actionnable —
> fenêtres de temps précises, couches motion primaire/secondaire/tertiaire), **sans négliger les
> 3 autres** — leurs apports uniques sont intégrés explicitement ci-dessous, marqués par jury.

## Diagnostic racine (unanime, 4/4 jurys)

**"Apparition ≠ Animation."** Chaque panneau v1 a été codé comme une **destination** (état A →
interpolate → état B) plutôt qu'une **chorégraphie continue**. Techniquement les `interpolate()`
tournent ; perceptivement, rien ne bouge en continu — d'où l'effet diaporama même si le code
"anime" tout.

Formulations des 4 jurys (même idée, angles différents) :
- **GPT** : "un SVG par panneau crée naturellement une logique de diaporama" — révéler des
  couches et déplacer des groupes n'est pas la même chose que produire du mouvement perçu.
- **Kimi** : confusion "changement d'état" / "mouvement perçu" ; absence de 3 couches minimum
  (sujet principal / contexte secondaire / ambiance) — v1 n'a souvent qu'une seule couche.
- **Gemini** : absence de "mouvement ambiant" (ambient motion) — "aucun pixel ne doit rester
  totalement immobile plus d'une seconde" dans une vidéo premium.
- **Grok** (le plus tranché) : "on a briefé et développé comme un développeur React qui fait du
  motion, pas comme un motion designer qui utilise React." Sous 1-1.5 couche de mouvement
  simultanée en v1, contre 5-8 attendues dans une vraie vidéo SaaS premium.

## Règle n°1 — non négociable pour toute la v2

**Aucun élément ne doit rester visuellement statique plus de 1 seconde** (Grok chiffre à 0.8s,
GPT/Gemini/Kimi convergent sur "jamais plus d'une seconde"). Même un état "calme" doit respirer :
micro-ondulation, pulse, glow, particule, scan lumineux. Une ligne plate immobile = un bug, pas
un choix de sobriété.

## Cause technique du flickering P5 (apport spécifique Grok, confirmé plausible par Gemini/GPT)

**Grok identifie le mécanisme exact** : `clip-path` sur des lignes fines animées à 30fps — les
bords du clip et les traits 1-2px interagissent mal avec l'anti-aliasing frame par frame.
Gemini/GPT convergent sur des causes compatibles (coordonnées fractionnaires, re-render React
sur changement de prop, scaling non entier). **Fix retenu pour la v2** : remplacer les
`clip-path` de reveal par `stroke-dashoffset` (Grok, GPT) partout où c'est possible — en plus de
résoudre le flickering, ça permet nativement le "flux qui circule" (voir P2/P3 plus bas) au lieu
d'un simple reveal statique.

## Métaphore centrale à corriger (Grok + GPT)

**La ligne de vigilance n'est pas un graphique, c'est le personnage principal** (Grok). Elle doit
porter une respiration, une tension, une "personnalité" continue du début à la fin de la vidéo —
pas juste apparaître (P2) puis rester inerte jusqu'à sa réactivation ponctuelle (P5/P6).

---

## SCRIPT D'ANIMATION V2 — PAR PANNEAU

*Structure et découpage temporel : GPT (le plus opérationnel). Enrichissements marqués [Kimi] /
[Gemini] / [Grok] où ces jurys apportent une précision ou variante que GPT n'a pas.*

### P1 — Le dilemme (0.0 → 10.9s)
**Objectif : faire sentir l'absurdité du tout-bloquer / tout-laisser-passer.**

- **0.0–1.5s (flux initial)** : fond sombre, grille en parallax lent. 80 à 150 traits de
  connexion actifs simultanément (pas 40 statiques comme en v1), longueurs/vitesses/opacités/
  profondeurs variées, cyan/blanc/gris + quelques rouges rares dès le départ. Les traits se
  déplacent à CHAQUE frame (translateX continu, pas une apparition suivie d'une pause). Léger
  motion blur horizontal. [Grok] Le flux doit rester chaotique et dense jusqu'à la fin du
  panneau, jamais retomber en dessous d'un seuil de densité perceptible.
- **1.5–3.8s (densification)** : le flux augmente, les lignes se chevauchent, accélèrent/
  ralentissent, "bursts" plus lumineux ponctuels. Léger push-in caméra. Les 3 traits rouges
  visibles mais noyés dans la masse, pas isolés.
- **3.8–4.6s (impact barrière)** : la barrière ne doit pas fade-in — elle **jaillit** (GPT) :
  pop/drop avec overshoot 4-6px, glow blanc/cyan brutal, flash d'impact. [Grok] "slam" depuis le
  bas avec particules d'impact visibles au contact.
- **4.6–7.2s (embouteillage)** : les lignes s'entassent contre la barrière avec une vraie
  physique de compression (scaleX qui diminue en approchant, pas juste une opacité) — squash
  effect (Gemini). Certaines rebondissent/se décalent verticalement. Écran dense, oppressant.
  Les rouges sont bloqués avec les autres : le système ne discerne rien (c'est le point du
  panneau).
- **7.2–8.2s (relâchement brutal)** : la barrière disparaît d'un coup (dissolve fragmenté, pas
  un fade). Les lignes compressées explosent vers la droite avec accélération exponentielle,
  traînées lumineuses intenses (motion blur directionnel). Les 3 rouges filent plus vite que le
  reste, traînée rouge plus longue et visible — le spectateur DOIT les voir passer sans être
  arrêtés.
- **8.2–10.9s (transition vers P2)** : le chaos est progressivement aspiré vers une ligne
  horizontale centrale — pas un cut, une convergence visible. Couleurs parasites s'éteignent.

### P2 — Naissance du discernement (10.9 → 15.2s)
**Objectif : faire naître la ligne comme un système qui prend le contrôle, jamais comme un
dessin qui apparaît puis meurt.**

- **10.9–11.8s (résorption)** : les derniers résidus du chaos P1 se contractent vers le centre ;
  plusieurs segments courts se rejoignent pour former une ligne continue (pas un simple
  clip-path gauche→droite sur un path déjà complet). [Grok, alternative à considérer] : la ligne
  peut naître du CENTRE vers les deux extrémités simultanément plutôt que gauche→droite classique
  — à trancher visuellement (les deux options sont défendables, tester les deux).
- **11.8–13.0s (draw-on actif)** : une impulsion lumineuse parcourt la ligne, laisse une trace
  stable derrière elle. Le glow suit l'impulsion puis redescend. Techniquement : `stroke-
  dashoffset` animé, PAS clip-path (fix flickering + vrai flux).
- **13.0–15.2s (respiration continue, NE JAMAIS s'arrêter)** : micro-ondulation 1-3px en continu
  (`Math.sin(frame)`), pulse lumineux toutes les ~0.7-1.2s (Grok précise 0.7s, GPT 1.2s — prendre
  ~1s), petit point de scan qui voyage lentement en boucle le long de la ligne. [Kimi] amplitude
  de respiration 3x plus grande que ce qui semblait prévu en v1 — ne pas sous-doser par prudence.

### P3 — Les 4 signaux (15.2 → 28.7s) — panneau le plus important, à soigner le plus
**Objectif : montrer une vraie analyse en temps réel, pas 4 dessins juxtaposés.**

- **15.2–16.6s (split)** : la ligne centrale se sépare fluidement en 4 rails (morphing des
  points du path, pas un simple `translateY` de groupes déjà séparés — piège déjà rencontré en
  v1 où le translateY déplaçait aussi les labels). Labels avec slide+fade, mini-barre cyan
  animée comme curseur actif à côté de chaque label.
- **16.6–21.5s (signature de mouvement propre à chaque ligne, EN CONTINU)** :
  - APPAREIL : signal carré qui se déplace horizontalement en boucle (le motif défile, pas
    figé une fois tracé) + micro-glow aux angles.
  - LIEU : courbe douce qui dérive lentement, point cyan voyageur sur la courbe.
  - HISTORIQUE : ticks qui s'allument successivement, points qui apparaissent/se fondent.
  - COMPORTEMENT : courbe organique à micro-déformations continues (jamais figée).
  [Grok] chaque ligne doit avoir une "personnalité" de fréquence/amplitude/texture distincte ET
  une interaction subtile entre elles (une monte → les autres réagissent légèrement) — niveau
  d'ambition supérieur à GPT sur ce point, à garder si le temps de dev le permet.
- **21.5–24.5s (extraction des signaux)** : un pulse plus lumineux par ligne avance vers la
  droite pendant que la courbe de fond continue de vivre derrière lui.
- **24.5–27.2s (convergence)** : les 4 lignes se courbent vers le point de score. Le score
  s'incrémente PAR ÉTAPE à chaque arrivée de pulse (GPT propose 4→9→14→18, un exemple concret
  et convaincant — reprendre ce principe même si les valeurs intermédiaires exactes sont
  libres), pas un pop final isolé. [Grok] "collapse violent" + chromatic aberration + particules
  à l'arrivée finale — intensité à doser (le brief demande "alerte calme", donc modérer
  l'agressivité de Grok ici, garder l'idée d'impact sans être violent).
- **27.2–28.7s (décision stable, mais vivante)** : le score se verrouille, anneau respire
  légèrement, les 4 lignes continuent de vivre en fond faible avant la transition P4.

### P4 — Dashboard vivant (28.7 → 40.9s) — le "vrai travail technique"
**Objectif : transformer le score conceptuel en produit RÉELLEMENT utilisé, pas montré.**

- **28.7–31.5s (pull-back)** : le cercle "18" devient une cellule de dashboard (transition
  motivée, pas un simple fade/scale vers une image figée — c'est le reproche n°1 des 4 jurys sur
  ce panneau). Caméra pull-back avec easing doux, jamais totalement figée à l'arrivée (garder un
  micro-mouvement résiduel, Gemini).
- **31.5–33.5s (construction du dashboard)** : colonnes révélées en stagger (pas toutes d'un
  coup), les lignes de contexte à opacité plus faible que Sarah.
- **33.5–35.8s (curseur + hover, OBLIGATOIRE selon les 4 jurys)** : un curseur discret entre
  dans le cadre, se déplace avec une trajectoire courbe (Bézier, pas une ligne droite — Gemini/
  Grok insistent sur ce point précis), s'arrête sur la ligne Sarah. Au hover : la ligne
  s'illumine, fond légèrement teinté, score qui pulse une fois. [Grok] "le curseur n'est pas un
  détail, c'est un acteur" — c'est la correction n°1 attendue par Aziz sur ce panneau
  spécifiquement (il l'a nommée dans son retour).
- **35.8–38.0s (badge qui se construit)** : le badge "Autorisé" se construit (contour qui se
  dessine, point qui s'allume, texte qui glisse) plutôt que d'apparaître d'un coup.
- **38.0–40.9s (tenue vivante, jamais morte)** : le curseur reste avec un micro-glow de hover,
  petits pulses circulent dans les cellules, le score respire. Dashboard actif en permanence,
  même sans action visible majeure.

### P5 — L'anomalie (40.9 → 56.5s) — le plus critique après P1
**Objectif : faire MONTER l'anomalie (causalité visible), pas juste afficher un résultat.**

- **40.9–42.0s** : même cadrage, Sarah encore verte. Un petit pulse traverse la ligne : état
  normal qui continue de vivre (pas figé en attendant l'événement).
- **42.0–43.2s (heure)** : la cellule heure change en premier (flip digital/compteur), pulse
  cyan/jaune traverse la ligne Sarah au changement.
- **43.2–44.6s (appareil)** : brouillage bref puis "Appareil inconnu", icône vire à l'orange,
  score commence à monter visiblement (18→~34, GPT donne des paliers concrets à reprendre).
- **44.6–46.0s (lieu — LE moment clé)** : "Toronto, CA" se décale/se floute → "Berlin, DE"
  apparaît. Pulse rouge plus marqué que les précédents. Score continue de monter (34→~57).
- **46.0–47.8s (comportement/historique)** : micro-secousses horizontales sur la ligne Sarah,
  indicateurs secondaires passent au rouge, score →~82.
- **47.8–49.0s (bascule badge, PAS un cut)** : "Autorisé"→"Vérification exigée" par morph :
  contour vert qui se rétracte, rouge qui se propage depuis la gauche, texte en wipe, icône
  warning. Fond de la ligne Sarah devient rouge sombre mais premium, pas criard.
- **49.0–51.5s (LE PIC — corriger le défaut n°1 signalé par Aziz : "je n'ai même pas vu la
  bosse")** : cut/transition rapide vers la ligne de vigilance en plan serré. La bosse doit être
  **impossible à manquer** : montée brutale et haute, rouge vif, halo, anneaux d'alerte,
  micro-ondes qui partent de part et d'autre. [Grok] elle doit "exploser" avec distortion et glow
  agressif au moment de l'arrivée — plus intense que ce que la v1 a produit. **Durée minimale
  1 à 1.5 seconde tenue** (GPT) — en v1 elle était probablement visible sur 2-3 frames seulement,
  d'où l'invisibilité pour Aziz. C'est un problème de DURÉE ET D'AMPLITUDE, pas juste de couleur.
- **51.5–53.0s (retour dashboard)** : Sarah en état critique verrouillé, score 82 qui pulse en
  rouge, les autres lignes restent calmes et vertes (montrer que c'est ciblé, pas systémique).
- **53.0–56.5s (encart téléphone)** : slide up + fade + léger overshoot, glow rouge/cyan,
  vibration façon notification. [Grok] curseur qui va cliquer sur "Confirmez" — bonne idée pour
  boucler la boucle du curseur-acteur introduit en P4, à intégrer si le temps le permet.

### P6 — Signature (56.5 → 63.34s)
**Objectif : résolution élégante qui capitalise sur la métaphore, pas un fade sur écran vide.**

- **56.5–58.0s (échos décroissants)** : la bosse redescend en 3 échos visibles (amplitude
  50%→25%→10%, Kimi), première onde rouge forte, dernière presque cyan. Les ondes se propagent
  le long de la ligne, pas juste une opacité qui diminue sur place.
- **58.0–60.0s (retour au calme, jamais mort)** : le rouge se dissout dans le cyan, la ligne
  garde sa micro-respiration de P2 (même signature de mouvement — la boucle visuelle se referme).
  Quelques points de données discrets continuent de passer, sans alerte.
- **60.0–61.5s (wordmark lié à la ligne, pas un fade indépendant)** : une impulsion cyan parcourt
  la ligne, révèle les lettres du wordmark à son passage sous le centre (GPT) — ou [Grok]
  alternative : les lettres se construisent EN SUIVANT la courbe de la ligne. Les deux versions
  lient visuellement le logo à la métaphore ; choisir celle qui rend le mieux à l'implémentation.
- **61.5–63.34s (tenue finale vivante)** : ligne calme mais jamais figée, glow minimal, dernier
  micro-pulse subtil. Fin sur une image "premium qui respire", pas un écran éteint.

---

## Fixes techniques transversaux à appliquer partout en v2

1. **`stroke-dashoffset` remplace `clip-path`** pour tous les draw-on (P1 horizon, P2, P3,
   éventuellement P6) — résout le flickering identifié par Grok et permet nativement le flux
   continu au lieu d'un simple reveal statique.
2. **Précomposer/stabiliser les éléments UI fins** (Gemini) : éviter les coordonnées
   fractionnaires sur les traits 1-2px, vérifier les scales non entiers sur le dashboard/laptop
   pendant le pull-back P4, envisager un rendu à plus haute résolution puis downsample si le
   flickering persiste après le fix stroke-dashoffset.
3. **Curseur systématique dès qu'un dashboard est à l'écran** (P4, P5) — trajectoire en courbe
   de Bézier, jamais en ligne droite.
4. **Chaque changement de donnée = un événement animé, jamais une substitution de prop brute**
   (le score, l'heure, la ville, l'appareil doivent tous transiter, pas "cutter").

## Règles de méthode pour la suite (à appliquer AVANT tout futur panneau, pas seulement noter)

1. **Test de densité de mouvement obligatoire avant validation** (GPT, règle 8) : extraire
   3-5 frames par panneau (début/quart/milieu/trois-quarts/fin) et vérifier qu'aucune paire de
   frames consécutives ne se ressemble trop. Si oui → le panneau est probablement trop statique,
   corriger AVANT de considérer l'animation terminée, pas après le retour d'Aziz. (C'est
   exactement la méthode qui a permis de mesurer objectivement le défaut cette fois — à
   appliquer proactivement désormais, pas seulement en post-mortem.)
2. **Un storyboard validé ne valide PAS l'animation** (GPT, règle 1) — ce sont deux gates
   distincts. Le storyboard valide la narration/composition ; une passe d'"animatic motion"
   (même rugueuse) doit valider le mouvement avant le rendu final soigné.
3. **Lister explicitement, par panneau, avant de coder : mouvement primaire / secondaire /
   ambiant** (Kimi, GPT, Grok convergent sur cette grille). Si la case "ambiant" est vide, le
   panneau va probablement lire comme statique.
4. **`clip-path` = outil d'apparition, jamais de vie continue** (GPT) — dès qu'un draw-on doit
   suggérer un flux ou un système actif (pas juste "ceci existe maintenant"), utiliser
   `stroke-dashoffset` en boucle ou un déplacement de texture, pas un simple reveal figé.
