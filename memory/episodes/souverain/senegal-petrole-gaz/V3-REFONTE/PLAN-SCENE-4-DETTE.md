# PLAN SCÈNE 4 — "LE PIÈGE DE LA DETTE" (terrain 2) — V3-REFONTE

> Branche : `feat/senegal-v3-scene2-comparaison` (on continue dessus, comme scènes 2-3).
> Audio : 243.26s -> ~291.0s (~47.7s). Réf V1 = Beat12 (kraft : coffre FONSIS + calebasse 132% + flux + boucliers — REMPLACÉE).
> Registre : navy #16213a + grille or qui respire (= fond des scènes 1b/3). Remotion pur + SVG. PAS de Mapbox.
> Composant cible : `beats/SceneDetteV3.tsx`. Continuité directe avec `SceneContratV3.tsx`.
> ⚠️ PHASE A (plan + jury) faite. Code = Phase B après validation Aziz du checkpoint.

## ✅ PHASE B FAITE — render v3 (2026-06-24)
Composant : `beats/SceneDetteV3.tsx` (compo `SceneDetteV3` dans Root.tsx, 1920x1080, 1440f). 100% SVG, 0 asset.
Render : `out/episodes/senegal-petrole-gaz/wip/scene4-barrage-v3.mp4` — catbox https://files.catbox.moe/lzz6nn.mp4
Itérations : v1 (mécanisme OK) → v2 (fix 132% coupé hors cadre + collision FMI/132% + débordement ondulé + fantôme gris)
→ v3 (fix review Gemini : SEUIL NORVÈGE lisible en or + bassin BUDGET remonté dans safe zone). 0 anti-pattern, 0 err tsc.
Review : `scene4-barrage-v2.review.json` (Gemini, signal filtré). Override tracé `scene4-barrage-v3.review-override.md`
(score non parsé par visual_review.py, pas un échec qualité). EN ATTENTE validation Aziz (perception/rythme final).

## STORYBOARDS COMPARATIFS (2026-06-24) — Aziz tranche le concept sur image
Générés via `gemini-storyboard-panels.py` (gemini-3.1-flash-image-preview, 16:9, navy), 4 panels chacun (protégé→132% écrase→percé→vidé).
- **BARIL** (concept original Phase A) : https://files.catbox.moe/dky7pm.png — RÉUSSI, lecture limpide.
- **BARRAGE/DIGUE** (reco Phase A bis, v2 après 1 correction du prompt) : https://files.catbox.moe/d85q8f.png — RÉUSSI en v2 (la v1 sortait en 3D iso confuse ; v2 = coupe plate nette).
- Verdict Claude : les DEUX racontent bien les 4 temps. Baril = le plus immédiatement lisible MAIS Aziz l'a écarté (redondance). Barrage = neuf, premium, métaphore « 2 fluides séparés par un mur » qui ressort bien en v2 → ma reco. Voir CHECKPOINT 3.

## ✅ CONCEPT TRANCHÉ AZIZ (2026-06-24) : LE BARRAGE / LA DIGUE. On code ça.
Storyboard barrage en 4 plans 16:9 SÉPARÉS (vrai cadre horizontal) :
- Planche 2x2 : https://files.catbox.moe/9fsatj.png
- P1 protégé : https://files.catbox.moe/y3fsoe.png · P2 132% déborde : https://files.catbox.moe/c0am43.png
- P3 brèche/vidange : https://files.catbox.moe/opib20.png · P4 vidé : https://files.catbox.moe/xqww1s.png
⚠️ P3 contient des LABELS ANGLAIS PARASITES (LEFT/CENTER/GOLD dam/national debt/STREAMING OUT…) = le modèle a pris mes
mots descriptifs pour des labels. AU CODE : AUCUN de ces textes. Seuls labels affichés = FONSIS · 132% · BUDGET · FMI.

## BUG « STORYBOARD VERTICAL » — diagnostic (pour le fichier capacités agents)
- **PAS un trou de doctrine, PAS un bug d'outil cassé** : c'est une LIMITE du mode « 4-panels-dans-1-image » de
  `gemini-storyboard-panels.py`. Le script génère UNE image globale ~16:9 (1376x768) qui CONTIENT les 4 panels. Quand
  le modèle les range sur 1 rangée, chaque cellule fait ~344x768 = PORTRAIT, même si la planche globale est 16:9. Le
  `STYLE_BLOCK` demande pourtant « empile sur 2-3 rangées, chaque panneau garde son 16:9 » — le modèle ne l'a pas respecté.
- **Parade fiable (appliquée)** : pour JUGER chaque plan en plein écran 16:9, générer 4 IMAGES 16:9 SÉPARÉES via
  `gemini-gen-image.py` (1 prompt/plan, chacun décrit le plan plein cadre). Ratio réel obtenu = 1376x768 (1.79 ≈ 16:9). ✅
- **Reco process** : `gemini-storyboard-panels.py` reste bon pour une VUE D'ENSEMBLE compacte (la progression d'un coup
  d'œil) ; mais pour valider le cadrage RÉEL d'un plan en 16:9, générer le plan en image dédiée. À noter dans capacités agents.

## AUDIT FAISABILITÉ — codé (SVG/Remotion) vs généré (asset) — NON-NEGOTIABLE avant code
> Règle : on PRÉFÈRE coder en SVG frame-driven (déterministe, contrôle total, net full HD, gratuit, charte exacte).
> On génère un asset SEULEMENT quand l'organique/la matière l'exige. Verdict : **CE CONCEPT EST ~100% CODABLE EN SVG.**
> Tout est géométrie + remplissages animés (clipPath) + Math.sin — exactement la grammaire déjà prouvée sur le baril (sc.3).

| Élément | Verdict | Pourquoi / comment |
|---|---|---|
| **Mur-barrage or + label « FONSIS »** | ✅ **CODÉ** | Un `path` SVG (profil trapèze/arc), fill gradient or (`linearGradient` comme `steelV`/`senFlagV` de sc.3), label en `<text>` Bebas. Halo or = `Math.sin` sur opacité. Asset = 0. |
| **Liquide tricolore retenu (ondule, descend, s'écoule)** | ✅ **CODÉ** | C'est EXACTEMENT le drapeau-dans-baril de sc.3 transposé : `clipPath` sur une zone gauche, fill = `senFlagV` gradient + étoile `<polygon>`. Surface qui ONDULE = un `path` dont le bord haut est une sinusoïde `Math.sin(frame)`. Niveau qui DESCEND = interpolate du `senCutY`. L'écoulement par la brèche = un `path` étroit tracé (stroke-dashoffset) + le niveau gauche qui chute. ZÉRO asset. |
| **Eau rouge de la dette qui MONTE derrière le mur** | ✅ **CODÉ** | Symétrique du tricolore : zone droite, fill rouge `#7a2a22` (gradient `costV` réutilisé de sc.3), bord haut sinusoïdal, niveau = interpolate qui MONTE (0→au-dessus de la crête). Trivial. |
| **« 132% » + ligne de crête qui déborde** | ✅ **CODÉ** | `<text>` Bebas + count-up `interpolate` 0→132 (overshoot spring). La ligne de crête = une `line` pointillée (`strokeDasharray`) à la cote, le rouge qui la franchit = niveau rouge > Y de la ligne. Évident (déjà fait `PctReadout` sc.3). |
| **Brèche / fissures dans le mur** | ✅ **CODÉ** | Fissures = `path` tracés en `stroke-dashoffset` (anticipation avant rupture). La brèche = un trou (rect/path) qui s'ouvre + le mur qui se fend en 2 groupes (transform). Pas de morphing exotique. Déjà la grammaire des fissures du `ContractDoc` sc.3. |
| **Vanne / siphon de vidange** | ✅ **CODÉ** | Un petit `<g>` SVG maison (rect + cercle = robinet) OU rien : la brèche au pied du mur SUFFIT (le filet tricolore qui sort par le trou). Reco : brèche simple, pas de vanne mécanique (épure). Si vanne voulue : SVG maison + rotation `interpolate`. 0 asset. |
| **Cloche / alerte FMI** | ✅ **CODÉ (icône Lucide)** | `<Bell/>` ou `<TriangleAlert/>` de `lucide-react` (déjà importé en V1 Beat12) en `foreignObject` OU re-dessinée en path. Halo rouge `Math.sin`, scale spring. Limiter à 1 icône (doctrine : pas de grille d'icônes). |
| **Basin « BUDGET » qui reçoit** | ✅ **CODÉ** | `path`/rect SVG (un bac) + le filet tricolore qui tombe dedans + niveau qui monte un peu (clipPath). Trivial. |
| **Fond navy + grille or qui respire** | ✅ **CODÉ (réutilisé)** | `GridBackground` repris VERBATIM de `SceneContratV3.tsx`. Peut s'affoler au climax (accélérer translation + opacité). |
| **Raccord depuis scène 3** | ✅ **CODÉ** | Le baril de sc.3 n'est PAS dans cette scène ; raccord = on ouvre sur le barrage. Continuité de MATIÈRE (le tricolore = même liquide/couleur que dans le baril) + même fond. Si pan voulu : `transform translateX` sur un wrapper. Pas d'asset. |
| **Cadenas qui tombe avec rebond spring (question Aziz)** | ✅ **CODÉ EN SVG, PAS d'image** | Verdict net : un cadenas est une forme géométrique simple (corps `rect` rx + anse `path` en U + trou `circle`) — déjà dessiné en SVG maison dans `ContractDoc` de sc.3 (lignes 284-286). Le rebond = `spring({damping,stiffness})` sur translateY/scale. Une IMAGE générée serait PIRE (détourage, bords flous au scale, charte approximative, non animable de l'intérieur). ⛔ Dans le barrage, le cadenas n'est même pas central (c'est le MUR qui protège) — optionnel sur le mur. **Règle générale : tout objet géométrique net (cadenas, vanne, bac, mur, jauge) = SVG codé ; on ne génère JAMAIS une image pour ça.** |

### CONCLUSION AUDIT
**0 asset à générer. Scène 100% SVG frame-driven.** On réutilise massivement la mécanique de `SceneContratV3.tsx`
(gradients senFlagV/costV/steelV, clipPath niveau, GridBackground, fissures, PctReadout count-up, marqueurs). Le SEUL
« nouveau » est la GÉOMÉTRIE du mur-barrage (un path) + les 2 bassins gauche/droite au lieu d'un baril cylindrique —
mais la grammaire d'animation (niveaux clipPath + ondulation Math.sin + count-up) est IDENTIQUE. Faisabilité = TRÈS HAUTE,
risque technique faible. Aucun outil de génération d'image n'est requis pour cette scène.
> Anti-AI-slop confirmé : le SVG maison ÉVITE le « clipart barrage » (le risque #1 si on générait). Net, charte exacte, animable de l'intérieur.

## INTENTION (1 verbe) : SIPHONNER.
Le Sénégal a un RÉSERVOIR PROTÉGÉ (le FONSIS, où va l'argent du pétrole, verrouillé = bonne nouvelle sur le
papier). MAIS une pression écrasante — la dette publique à **132% du PIB** — pousse à PERCER ce réservoir et
le VIDER pour payer les factures d'aujourd'hui. Le FMI alerte. « Un fonds qu'on peut vider ne protège plus rien. »
Un seul objet, qui change d'état : PROTÉGÉ → MENACÉ → PERCÉ → VIDE.

## ⛔ DÉCISION AZIZ (2026-06-24) : LE BARIL EST REFUSÉ. Concept neuf obligatoire.
Aziz : réutiliser le baril sur 3-4 scènes de suite = REDONDANT. Scène 4 doit avoir un OBJET/MÉTAPHORE NEUF,
distinct du baril ET de la V1 kraft (coffre/calebasse/boucliers). Même récit, même intention (SIPHONNER),
même registre navy+grille or. Le jury G+K+D ayant presque tout ramené au baril, les concepts ci-dessous sont
une PROPOSITION CLAUDE (déduite de l'intention, pas du jury). → voir CHECKPOINT 2.

## CONCEPTS NEUFS — choix Aziz EN COURS (le baril est écarté)

> Le récit impose DEUX gestes physiques : (1) une PRESSION EXTERNE qui monte et étouffe (la dette 132%),
> (2) une PERFORATION/PONCTION du fonds protégé (« piocher »). L'objet doit rendre ces deux gestes LISIBLES
> + montrer un état « verrouillé/protégé » crédible. 3 concepts, classés par adéquation.

### CONCEPT A ⭐ (MA RECO) — LE BARRAGE / LA DIGUE (« la retenue qui cède »)
**Geste central** : un barrage en arc retient une RÉSERVE (le FONSIS, liquide tricolore SEN). Derrière le mur,
une eau ROUGE SOMBRE (la dette) monte et pousse ; une vanne/brèche s'ouvre et la réserve protégée s'échappe.
- **FONDS PROTÉGÉ** : un mur-barrage or massif (profil en arc SVG) tient une retenue calme (drapeau SEN en aplat liquide). Label « FONSIS » gravé sur le mur. Halo or = solidité. (calage f57-f399)
- **DETTE 132% écrase** : derrière/au-dessus du mur, une masse d'eau ROUGE #7a2a22 MONTE (clipPath niveau). Le « 132% » s'inscrit comme la COTE D'EAU qui dépasse la ligne de crête (lecture immédiate « ça déborde »). Le mur vibre, fissures se tracent (stroke-dashoffset). (f480-697)
- **On perce / on pioche** : une vanne s'ouvre au pied du barrage, la réserve protégée FUIT par le bas vers un « BUDGET » assoiffé. Niveau de la retenue chute. (f783)
- **Vidé / menacé** : retenue à sec, le rouge a submergé, le mur = coquille. « ne protège plus rien ». (f1282)
- **Premium, pas générique** : la PHYSIQUE de 2 fluides opposés séparés par un mur raconte tout sans texte ; la cote « 132% » = crête dépassée. Métaphore quasi jamais vue en data-viz éco (différenciant). Profil de barrage = arc élégant, pas un clipart.
- **Faisabilité Remotion+SVG** : ÉLEVÉE. 2 rect clippés par un path (mur), niveaux animés interpolate/clipPath, fissures stroke-dashoffset, vanne = rotation. Onde de surface = Math.sin sur 1 path. Aucune particule lourde.
- **Raccord scène 3 (sans baril)** : pan latéral — le baril sort du cadre à gauche, on découvre le barrage (vue large). Le liquide tricolore est le FIL conducteur : continuité de MATIÈRE (même couleur), pas d'objet.

### CONCEPT B — LA CHAMBRE FORTE SOUTERRAINE PERCÉE (« le coffre qu'on creuse par-dessus »)
**Geste central** : une chambre forte enterrée (le FONSIS) scellée par une porte ronde or ; au-dessus, le poids
de la DETTE (une strate rouge massive) presse ; un foret/tunnel perce la voûte et siphonne l'or vers la surface.
- **FONDS PROTÉGÉ** : salle blindée (rect arrondi + porte de coffre ronde or + molette) remplie d'aplat or. Label « FONSIS ». Verrou qui claque.
- **DETTE 132% écrase** : une STRATE rouge sombre au-dessus (la dette = le sol qui pèse) descend et comprime la voûte. « 132% » = épaisseur/poids de la strate. La voûte se fissure.
- **On perce / on pioche** : un foret/tunnel traverse la strate et perfore la chambre ; l'or est aspiré vers le haut (« factures d'aujourd'hui »). Niveau d'or baisse.
- **Vidé / menacé** : chambre vide, porte béante, strate affaissée dedans. « ne protège plus rien ».
- **Premium** : coupe géologique (souterrain pétrolier = cohérent sujet) + poids vertical de la dette. Différent de la V1 (coffre kraft posé) car ENTERRÉ et ÉCRASÉ.
- **Faisabilité** : ÉLEVÉE. rect/path + clipPath, strate = rect animé en Y, foret = ligne+rotation. Risque : plus de pièces mobiles (porte, molette, foret) → veiller à l'épure. Proche du « coffre » V1.
- **Raccord** : pan DESCENDANT depuis le baril (qui pompe en surface) vers le sous-sol. Continuité = on suit l'argent vers le bas.

### CONCEPT C — LA RÉSERVE COMPRIMÉE (« étouffer », plus abstrait, backup)
**Geste central** : un bloc-réserve or (le FONSIS) COMPRIMÉ entre deux mâchoires (dette du haut, budget du bas) ;
quand ça presse trop, il se fend et l'or fuit.
- 4 temps : réserve scellée → mâchoire rouge « DETTE 132% » descend et comprime (« étouffe ») → fissure, l'or fuit par les côtés → bloc écrasé/vide.
- **Premium** : porte LITTÉRALEMENT « étouffe le budget » (compression). Très épuré (1 bloc + 2 forces).
- **Faisabilité** : TRÈS ÉLEVÉE (le plus simple). MAIS : risque « graphique de pression » abstrait, moins narratif/mémorable que A ; le « protégé/verrouillé » est peu lisible (un bloc compressé ≠ un fonds protégé).

### TRANCHE CLAUDE
- ⭐ **A (barrage)** = ma reco : SEUL concept qui rend les DEUX gestes parfaitement lisibles (dette = eau rouge qui monte derrière le mur ; 132% = cote qui déborde ; percer = vanne), le plus PREMIUM et le moins vu, évite l'effet « coffre » V1.
- **B (chambre forte)** = solide 2e choix, plus littéral « fonds », cohérent souterrain-pétrole, mais plus de pièces mobiles (risque épure) + proche du coffre V1.
- **C (compression)** = le plus simple mais le plus abstrait/peu mémorable, « protégé » peu lisible. Backup.

> Le DÉCOUPAGE CALÉ VOIX ci-dessous (12 pivots) reste valide quel que soit le concept retenu — seul l'OBJET change,
> les 4 temps (protégé→écrasé→percé→vidé) et leurs frames sont identiques. Remplacer « baril » par l'objet choisi.

## MÉTAPHORE (ANCIENNE, baril — ÉCARTÉE par Aziz, conservée pour archive)
On REPRENAIT le baril-jauge drapeau SEN (continuité max avec scènes 1b/3, baril RECONNAISSABLE) :
1. **VERROUILLER** : un cadenas or se pose sur le baril, label « FONSIS ». L'argent est protégé. (raccord depuis « ??% »)
2. **MENACER** : une masse rouge sombre « dette » descend du haut et écrase le couvercle. Le **132%** s'inscrit (chiffre hero).
3. **PERCER** : un siphon/vanne s'ouvre, le drapeau s'écoule. Le niveau chute. Cloche FMI. Touche « plus souple que la Norvège » légère.
4. **VIDER** : le cadenas saute, le baril se vide, coquille vide. « ne protège plus rien ». Teaser « loin de Dakar ».

## SYNTHÈSE EXTRACTIVE TRACÉE (jury G=Gemini, K=Kimi, D=DeepSeek, mode upstream --expert)

### CONVERGENCE 3/3 (socle de haute confiance)
- **Reprendre le baril de la scène 3, PAS un nouveau coffre.** [G+K+D] Continuité = capital. Nouveau coffre = casse le fil
  (« où est passé le baril ? » -K). RETENU. (G nuance en « hybride » : le baril se vide vers un réservoir FONSIS — voir DIVERGENCE.)
- **Un seul monde qui change d'état** (protégé → menacé → percé → vide), pas 4 saynètes. [G+K+D] RETENU (cœur du plan).
- **VERROUILLER le baril = créer le FONSIS** : cadenas (Lucide `Lock`) + label « FONSIS » qui se pose, spring overshoot + halo or. [G+K+D] RETENU.
- **132% = chiffre hero gravé dans/lié à la masse rouge de la dette qui ÉCRASE par le haut** (pas un chiffre volant powerpoint). [G+K+D] RETENU.
  Count-up 0→132 (~45-60f), overshoot (scale ~1.1→1.0), calé sur « cent trente-deux » (f527). Couleur : 132% en or ou ivory, masse en rouge sombre #7a2a22.
- **SIPHONNER = percer + vidange**, pas un simple abaissement répété (le « vider encore » serait illisible -D). Un tube/vanne perce le réservoir scellé, le drapeau s'écoule. [G+K+D] RETENU. Calé sur « piocher dans l'argent » (f783).
- **Norvège = touche LÉGÈRE signalétique**, JAMAIS la 2e saynète boucliers de la V1 (déjà traité scène 2). [G+K+D] RETENU.
  → forme : une **ligne de flottaison pointillée « SEUIL NORVÈGE »** que le niveau n'atteint plus (G, le plus épuré). RETENU (préféré aux 2 boucliers de K/D = retour V1).
- **Respirations calées sur la voix** : après « verrouillée » (f175-f399) = stabilité, calme avant la tempête → le « Mais voilà le piège » frappe plus fort. [G+K+D] RETENU.
- **Pas de cut, tout en morphing/glissement** sur le MÊME objet (la masse descend SUR le baril, la vanne sort DU flanc). [G+K+D] RETENU.
- **Raccord entrée** : la lame Cost Recovery de la scène 3 se retire, le label « ??% » s'efface, le baril reste à son niveau, le cadenas se pose. [G+K+D] RETENU.
- **Teaser sortie** « loin de Dakar » (f1389) : le baril vide s'estompe, un point/lumière apparaît à droite OU caméra glisse hors-champ. [G+K+D] RETENU (forme exacte à coder simple : fade baril + glissement latéral, PAS de boussole gadget — voir ÉCARTÉ).

### DIVERGENCE (tranchée par Claude, à confirmer Aziz sur 1 point = le checkpoint)
- **G : baril se vide via un tuyau vers un SECOND réservoir FONSIS distinct** (le baril de la sc.3 = source, le FONSIS = destination).
  🔶 NUANCÉ → ÉCARTÉ comme tel : ajoute un 2e objet = re-complexifie, contredit « un seul monde ». La version K/D (le baril LUI-MÊME
  DEVIENT le FONSIS verrouillé) est plus épurée et plus continue. RETENU = baril unique = FONSIS. (On garde de G l'idée de la masse
  qui écrase PAR LE HAUT et force la vidange PAR LE BAS — excellente lecture physique.)
- **Niveau de départ du baril** : ambiguïté héritée. Scène 3 finit sur « ??% PART RÉELLE » (~28-60% selon le moment du bras de fer).
  DÉCISION Claude : entrer au niveau ~60% (le baril « plein » de la part nationale), label « ??% » qui s'efface → on remet le baril dans
  un état « plein protégé » pour que la VIDANGE finale soit lisible (de plein à vide). C'est cohérent narrativement : la scène 4 parle de
  l'ARGENT DU FONDS (les revenus protégés), pas de la part contractuelle. À confirmer dans le checkpoint (option B ci-dessous).
- **Comptage Norvège** : K+D proposent 2 boucliers Shield Lucide. ÉCARTÉ (retour à la V1, redondant scène 2). G = ligne de flottaison. RETENU (G).

### ÉCARTÉ + RAISON
- **Boussole Lucide `Compass` au teaser** (D). ❌ ÉCARTÉ : gadget icône web, hors-registre. Le teaser = fade + glissement, la voix porte « loin de Dakar ».
- **Effet « PixelLab glitch » sur le cadenas** (G idée bonus 3). ❌ ÉCARTÉ : PixelLab = pixel art, hors-charte de cette scène vectorielle nette.
- **Graphique en barres « budget étouffé »** (K bonus 2 / D bonus 2). 🔶 OPTION (pas prioritaire) : un mini-compteur BUDGET qui descend pendant la vidange POURRAIT renforcer « payer les factures », mais risque de surcharger. À n'ajouter QUE si la scène respire trop. NON RETENU au 1er jet.
- **Odomètre $228M de la V1** (rappel) : ❌ jamais prononcé par la voix → supprimé (G angle synchro). Confirmé.
- **Masse rouge qui couvre/cache le baril** : limiter l'opacité (~0.8, K) pour qu'elle PRESSE sans masquer — le baril reste lisible.

### IDÉES BONUS RETENUES (faisables, élèvent)
- **Onde de choc à f527** (132%) : cercles concentriques rouges qui partent du baril (D bonus 1). ✅ RETENU (déjà faisable, renforce l'impact).
- **Lignes de force/pression** convergeant du 132% vers le baril (K bonus 1). ✅ RETENU léger (stroke-dashoffset, montre l'écrasement).
- **Micro-grille qui s'affole au climax du siphon** (D bonus 3) : la grille or accélère sa translation + opacité vacille pendant la vidange. ✅ RETENU (tension subliminale, trivial sur le GridBackground existant).
- **Stress-test : contours or du baril qui se déforment sous la pression** (G bonus 1, scaleY 0.98 du groupe). ✅ RETENU (matérialité).
- **Fissures stroke-dashoffset sur le couvercle** avant la perforation (K/D). ✅ RETENU (anticipe la perforation).

## DÉCOUPAGE CALÉ VOIX (frame = (t_abs - 243.26) * 30 ; scène démarre à 243.26s = « Mais le terrain… »)
| t_abs | frame | voix | visuel |
|---|---|---|---|
| 243.26 | 0 | « Mais le terrain le plus piégeux… Il est dans la dette. » | RACCORD : lame cost-recovery sort, label « ??% » s'efface, baril reste (niveau ~60%), fond navy/grille inchangé |
| 245.06 | ~57 | « le FONSIS » | cadenas or se pose sur le baril (spring overshoot) + label « FONSIS » se trace, halo or |
| 249.06 | ~175 | « verrouillée avant même le premier baril » | serrure se ferme net, contour or solide, le baril est SCELLÉ. SFX clac métallique |
| 256.5 | ~399 | « Sur le papier, c'est une bonne nouvelle » | RESPIRATION : baril stable, halo or pulse lent (Math.sin). AUCUN nouvel élément (calme avant tempête) |
| 259.4 | ~480 | « Mais voilà le piège » | la lumière baisse, une MASSE rouge sombre #7a2a22 commence à descendre du haut |
| 261.84 | ~527 | « cent trente-deux pour cent » | IMPACT : la masse écrase le couvercle, **132%** count-up 0→132 (overshoot), onde de choc, micro-shake. SFX BOOM. MOMENT-FORT |
| 266.6 | ~697 | « étouffe déjà le budget » | la masse pousse encore, fissures se tracent sur le couvercle, baril vibre (Math.sin), niveau baisse de ~5% |
| 269.86 | ~783 | « piocher dans l'argent du pétrole » | PERFORATION : un siphon/vanne sort du flanc bas, perce le baril, le drapeau s'écoule. Niveau chute 60%→~25%. SFX succion |
| 276.4 | ~983 | « Le FMI tire la sonnette d'alarme » | cloche/alerte (Lucide `Bell` ou `TriangleAlert`) en rouge, halo pulsant, sigle « FMI ». La vanne reste ouverte |
| 281.34 | ~1128 | « plus souples que la Norvège » | ligne de flottaison pointillée or « SEUIL NORVÈGE » apparaît HAUT — le niveau est déjà loin en-dessous. PAS de boucliers |
| 285.94 | ~1282 | « Un fonds qu'on peut vider… ne protège plus rien » | le baril se vide ENTIÈREMENT (clipPath→~0), le cadenas saute/se brise, coquille vide grisâtre. SFX vide/écho |
| 291.04 | ~1389 | « Reste le dernier terrain. Et celui-là, il se joue loin de Dakar » | TEASER : le baril vide s'estompe, glissement latéral léger vers navy pur (raccord scène 5). Pas de gadget |

Durée totale ~1430f (~47.7s). END ~1440.

## CONTRAINTES (rappel)
Remotion frame-driven + audio-derived · SVG natif OK · PAS Mapbox · INTERDIT CSS transition/keyframes/setTimeout/requestAnimationFrame/3D lourde/blur CSS
· texte minimal accents FR (DETTE, RÉELLE, SÉNÉGAL, VERROUILLÉ) · safe zones 1920x1080 · navy+or, drapeau/rouge <=15% chacun · masse rouge opacité ~0.8 (presse sans masquer).
Hiérarchie regard : baril TOUJOURS au centre, 132% seul gros texte à droite, icônes petites + halo timées. Espace négatif ~20% autour du baril.

## RÉUTILISATION (continuité technique)
- `BarilJaugeIcon` (`src/projects/_shared/thumbnails/icons/BarilJaugeIcon.tsx`) + la géométrie baril+clipPath de `SceneContratV3.tsx` (drapeau SEN gradient, étoile, cerclages). On DUPLIQUE la mécanique baril (clipPath niveau = `senCutY`).
- `GridBackground` (navy + grille or qui respire) = repris VERBATIM de SceneContratV3 (peut accélérer au climax).
- Marqueurs/accolades reliant label→zone = repris de `ActorMarkers` (sc.3) pour « DETTE »→masse, « FONSIS »→cadenas.
- Cadenas : même langage que le cadenas de `ContractDoc` (sc.3) — path SVG maison (pas que Lucide), continuité graphique.

## SFX (existants sur disque, vérifiés)
- `_shared/sfx/ui/sfx-baril-fill.mp3` (déjà sc.3) · `_shared/sfx/data/stat-tick.mp3` (132% s'inscrit) · `_shared/sfx/ui/stamp-dossier.mp3` (cadenas/verrouillage)
- `_shared/sfx/impact/sfx-clash-impact.mp3` (BOOM masse f527) · `_shared/sfx/sfx-cost-recovery-drain.mp3` (siphon/vidange f783 — réemploi du drain de sc.3, ici JUSTIFIÉ par la vidange réelle)
- `_shared/sfx/sfx-tension-tug.mp3` (pression de la dette, f480-527) · `_shared/sfx/ui/whoosh.mp3` (teaser sortie)
- ⚠️ `reveal.mp3` CORROMPU (voix fantôme) — NE PAS utiliser. Si besoin d'un SFX cloche FMI : générer via `scripts/generate-sfx-elevenlabs.py` en Phase B.
- Musique : `music-A-ambient-souverain.mp3` 5.5%, fade-out 3s (même que sc.2/3), offset = AUDIO_START.

## AUDIO
- Narration : `narration-v3-VALIDEE.mp3`, `startFrom = round(243.26*30)`, `endAt = round(291.0*30)`.
- AUDIO_START = 243.26 (le baril était à 188.66 en sc.3 ; ici scène 4 démarre à 243.26).

## ÉTAT
🟡 **PHASE A FAITE (2026-06-24).** Plan + jury 3 modèles + synthèse tracée. CHECKPOINT goût remonté à Aziz (métaphore baril-FONSIS-siphonné + niveau de départ).
▶ PHASE B (code) après validation : dupliquer mécanique baril sc.3 → SceneDetteV3.tsx → render → self-review → validation → `scene4-dette-FINAL.mp4`.
