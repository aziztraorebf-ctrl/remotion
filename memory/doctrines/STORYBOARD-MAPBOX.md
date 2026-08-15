# DOCTRINE — Storyboard Mapbox (carte) : le modèle propose, on décode après

> Posée 2026-06-20 (toi + Claude). Le storyboard Remotion (data-viz) marche : le modèle propose une direction
> créative qu'on n'avait pas, on valide, on code. On veut le MÊME levier pour la CARTE — mais le principe diffère,
> parce qu'une carte est du RÉEL CONTRAINT (la géo est fixe, un modèle d'image ne connaît pas notre vraie carte).

## LE PRINCIPE (ce qui change vs Remotion)

- **Remotion** : le modèle génère une image-cible abstraite (un héros inventé) → on s'en inspire pour coder.
- **Mapbox** : le modèle propose la **CHORÉGRAPHIE** — multi-panneaux d'ÉVOLUTION (caméra + couches + artifices
  dans le temps), comme un storyboard de film. La géo qu'il dessine est APPROXIMATIVE et c'est OK : à ce stade
  c'est une **proposition de direction**, pas le livrable. **La vraie géo arrive au CODE (vraie Mapbox), jamais
  copiée du storyboard pixel par pixel** (ça évite le « faux drapeau / fausse Afrique »).
- Mêmes règles que Remotion : **multi-états (DÉBUT→FIN) + ÉPURE** (chaque état = incrément minimal, zéro texte
  redondant — voir `_PALETTE-BACKGROUNDS.md` § storyboard, et [[CONTINUITE-SCENE-INTENTION-DABORD]]).

### ⚠️ LES ANNOTATIONS DU STORYBOARD NE SONT PAS LE RENDU FINAL (clarification cruciale)
Un storyboard est une **image FIGÉE** : il ne peut pas montrer le mouvement réel. Les **flèches, traits, labels
de panneau** (« LE FLUX S'ARRÊTE », « LA RUPTURE ») sont des **conventions de storyboard** (comme dans un
storyboard de film) — elles disent l'INTENTION de chaque état, elles ne sont PAS forcément à l'écran final.
- Une flèche figée = « ici, ça se déplace dans cette direction » (au code : un arc qui se trace, une unité qui avance).
- Un label = ce que l'état raconte (au code : porté par la voix off + le visuel, pas forcément écrit).
- **Le vrai MOUVEMENT (caméra qui recule, couleur qui envahit, arc qui se trace) ne vit PAS dans l'image — il vit
  dans le BREAKDOWN** (étape suivante) : « état 2→3 : caméra zoome sur Gibraltar 30f, arc 0→100% en dashoffset,
  Maroc gris→or en opacité ». Le storyboard montre QUOI ; le breakdown dit COMMENT ça bouge.
- ⛔ Ne jamais confondre « storyboard chargé d'annotations » avec « scène finale chargée ». Au contraire : la scène
  finale ÉPURE (la voix dit, le visuel montre). Les annotations sont un échafaudage de conception.

## LE PRÉAMBULE (2 couches + nos contraintes — à JOINDRE/DIRE à chaque storyboard carte)

Pour que le modèle propose une direction CRÉATIVE (pas plate), on le cadre AVANT de générer :

**[1] NOTRE CARTE (réf jointe, image)** — selon le type de beat, joindre une frame de NOTRE vraie carte pour
qu'il sache à quoi elle ressemble (style, palette, mécaniques) :
- Beat Souverain Mapbox → `public/_shared/refs/cartes/carte-souverain-geoafrique-v5.jpg`
- Beat **WarMap / AES** → `public/_shared/refs/cartes/carte-warmap-sudan-epic.jpg` (territoires par faction, jetons, plaques villes, sceaux)
- Beat **Atlas** → `public/_shared/refs/cartes/carte-atlas-mansa-moussa.jpg`
(On joint la réf au générateur : `storyboard-dual-gen.py --ref <cette frame>`.)

**[2] INSPIRATION EXTERNE (citée par NOM au modèle, pas une banque d'images)** — le modèle connaît ces chaînes,
il sait leur grammaire. On lui dit « vise CE niveau, prends-leur CECI ». Listes données par Aziz 2026-06-20
(repère de goût, pas figé). Pour chaque chaîne : ce qu'on lui VOLE.

*Mapbox dynamique / géopolitique :*
- **@geoglobetales** + **@jacquesadit** (After Effects / GeoLayers 3) → ⚠️ on prend leur **DYNAMISME** : reveals,
  pictos/emojis qui pop, tempo des apparitions, usage de la couleur. ON NE PREND PAS le globe 3D / la techno AE
  (on est Mapbox frame-driven 2.5D). « Leur langage d'animation, pas leur outil. »
- **@reallifelore** → rythme narratif, carte au service du propos, échelle (zoom du monde au détail).
- **@vox** + **@johnnyharris** → rigueur éditoriale, registre documentaire premium, annotations propres.
- **PolyMatter** + **Wendover** → carte animée propre, registre éco/géopolitique très proche du nôtre.
- **Bloomberg Originals** → data-visualisation premium incrustée sur carte (chiffres + géo).

*WarMap / cartes de conflit (+ Atlas) :*
- **@kingsandgenerals** + **@bazbattles** + **@historicbattles** + **@sandrhomanhistory** → grammaire de la carte de
  bataille : flèches de mouvement, fronts qui avancent, jetons d'unités, order of battle, drapeaux.
- **@history_mapped_out** → notre réf flat sépia : bannière flottante, sceaux d'événement (déjà décodée, voir [[decode-castile-warmap-vivante]]).
- **Map Men** → grammaire carte vive/légère (à citer si on veut un registre plus enlevé).
- **Real Time History** → sérieux documentaire-guerre.

**[3] NOS CONTRAINTES + DIRECTIVE « CARTE VIVANTE » (dites en TEXTE au modèle, pas jointes)** :

⭐ **DIRECTIVE CARTE VIVANTE (à donner à CHAQUE storyboard carte — le cœur)** : on fixe l'EXIGENCE, le modèle
trouve le COMMENT. « La carte doit être VIVANTE — jamais plate, jamais un plan fixe figé. À chaque état du
storyboard, quelque chose doit ÉVOLUER pour porter l'intention. **À TOI de proposer COMMENT** (inspire-toi des
chaînes de référence ci-dessus, adapte-les à nos moyens). Ne te contente pas du minimum : ose des partis pris
visuels forts. » — ⚠️ on NE liste PAS les techniques (zoom/couleur/picto…) : ça briderait. Le modèle a les
références, il sait adapter. (Rappel du gain : nos agents ont inventé seuls le passage carte claire→noir au
climax de Beat3 parce qu'on ne leur avait PAS dicté la technique — juste l'intention + le cadre.)

Seuls **INTERDITS techniques** posés (pour qu'il reste dans nos moyens, sans rien imposer d'autre) :
- PAS de 3D / globe type After Effects-GeoLayers (on est Mapbox 2.5D : pitch oui, vrai 3D non).
- La géo reste réelle (pas de continent inventé) — au CODE ; au storyboard l'approximation est tolérée.

*Ce qu'on SAIT faire — l'ARSENAL (source d'inspiration, PAS une checklist).* Le modèle DOIT savoir l'étendue de
notre boîte à outils, sinon il se limite à colorier des pays. On lui passe le bloc registre de
`public/_shared/refs/cartes/_ARSENAL.md` (Souverain / WarMap / Atlas) avec la formule : **« Voici ce qu'on sait
faire. On n'est PAS limité à ça — sers-t'en comme inspiration et VA PLUS LOIN. »** C'est riche exprès (jetons,
losanges, sprites PixelLab, FX, contagion, scanner, sceaux animés…) pour qu'il propose ambitieux — jamais un
mix-and-match à cocher. Refs visuelles de nos assets (jetons/persos) à joindre aussi si pertinent (voir `_ARSENAL.md`).

**[4] L'INTENTION du beat** (1 verbe) + la narration.

→ Le modèle propose un **STORYBOARD multi-états** (dual-gen Gemini + GPT, `storyboard-dual-gen.py`).

## LE FLUX (storyboard d'abord, breakdown APRÈS validation)

1. **Préambule** (les 4 couches ci-dessus) → générer le storyboard carte (Gemini + GPT, on compare).
2. **Aziz valide la DIRECTION** (le ressenti, le mouvement, les artifices). On NE décode pas une direction non validée.
3. **SEULEMENT APRÈS** : on demande le **BREAKDOWN technique** au modèle — voir FORMAT ci-dessous.
4. Code sur la VRAIE carte Mapbox (jamais copier la géo du storyboard).

## LE FORMAT DU BREAKDOWN CARTE (éprouvé 2026-06-20, agent réel sur beat AES « confédération »)

> ⛔ **RÈGLE D'OR — le breakdown TRANSCRIT, il ne CRÉE pas.** La direction créative est DÉJÀ tranchée au
> storyboard validé. Le breakdown la traduit en technique FIDÈLE. Il ne rabote JAMAIS une idée du storyboard
> sous prétexte qu'aucun composant ne la fait — il la signale « à créer ». **C'est l'étape 5 du flux
> d.orchestration (`SYSTEME-AGENTIQUE.md`), APRÈS le checkpoint goût.** Le breakdown ne décide rien de
> créatif → il ne peut pas brider ; au contraire il PROTÈGE la direction validée (force le frame-driven, bloque
> les rejets type `flyTo`). La liberté vit à l'étape 3 (storyboard) ; la fidélité vit ici.

**(A) JSON structuré — un objet par ÉTAT du storyboard** (champs ouverts = anti-rigidité) :
```
{
  "etat": <n>, "frames": "<début>-<fin>",
  "camera": {"mode":"frame-driven-jumpTo", "keys":[{"f":,"lng":,"lat":,"zoom":,"pitch":,"bearing":}]},
  "intention_etat": "<ce que l'état doit faire RESSENTIR — langage LIBRE, copié de la direction validée>",
  "forme_connue": "<composant exact qui le fait, OU null si rien n'existe>",
  "forme_verifiee": "<chemin RÉEL grep'd du composant — OBLIGATOIRE si forme_connue≠null (anti-fantôme, cf. AnimatedCaravan) ; null = pas vérifié = STOP>",
  "forme_couvre_tout": <true|false>,            // false = le composant ne fait l'intention QU'EN PARTIE
  "ce_qui_manque": "<si forme_couvre_tout=false : ce que le composant ne fait pas, à compléter>",
  "si_nouveau": "<si forme_connue=null : description RICHE et libre de l'effet, sans le réduire à l'existant>",
  "cout_estime": "trivial | ajustement | proto-rnd",   // pour qu'Aziz arbitre AVANT (proto-rnd = chantier)
  "fallback_si_echec": "<la version dégradée la MOINS trahissante si le proto échoue au render>",
  "sync_voix": "<le mot de la narration sur lequel cet état se cale (frame0 = 1er mot)>",
  "sfx": [{"at":<frame>,"type":"<son>","gain":<≥0.50>}]
}
```
+ champ global `"forbid": [...]` (les REJETS techniques : `flyTo`/`easeTo`, `drawFlagCanvas`, filtre par `name`,
`semitransp`<0.5, SFX hors `<Sequence>`, vrai 3D, images async sans `delayRender`). + `"continuite_avec"` (le beat
précédent, pour ne pas re-poser une caméra qui contredit le plan d'avant — doctrine [[CONTINUITE-SCENE-INTENTION-DABORD]]).

**(B) Résumé prose** (5-8 lignes) — le beat raconté comme un plan de tournage, pour qu'Aziz VALIDE sans lire le JSON.

⚠️ **Cohérence amont + durée** (leçons cobayes 2026-06-20) : avant de breakdowner, vérifier que l'audio prononce ce que
le beat montre (sinon STOP, beat mal briefé) ; et si le beat dure nettement plus que son segment de voix, tenir le surplus
par un état de PLATEAU (caméra quasi fixe + halo qui respire), pas par des frames étirées au hasard.

⚠️ **Les 3 champs qui rendent le format auto-portant** (issus du test — sans eux, le format dépend de la seule
vigilance de l'agent) : `forme_couvre_tout`/`ce_qui_manque` désamorce l'aimant « un composant existe à peu près,
je le coche » ; `cout_estime` montre à Aziz qu'un état coûte 10× les autres (il arbitre proto vs fallback) ;
`fallback_si_echec` évite le rabotage EN PANIQUE au render (garder le CŒUR de l'idée même dégradée — ex : garder
la FUSION des 3 pays même sans la matière métal-liquide).

## LE CRAN DE RE-STORYBOARD (le vrai gain — moteur d'évolution du style)

Si une scène codée est **trop statique / ne marche pas** : ne PAS repartir de zéro. Redemander un storyboard
**« même intention, mais inspire-toi de chaînes plus dynamiques — change les mouvements de caméra, la façon
dont les choses apparaissent »** → nouveau breakdown → re-test. Permet de faire ÉVOLUER notre patte (du sobre
au très dynamique) beaucoup plus vite qu'en re-codant à l'aveugle.

## CAPACITÉ RÉELLE (honnête, vérifié 2026-06-20)
- Le storyboard carte = **généré par le modèle image** (Gemini/GPT), comme Remotion. Faisable, automatisable
  (un agent décrit le préambule, `storyboard-dual-gen.py --prompt-file … --ref notre-carte.png` fait le rendu).
- Alternative envisagée puis ÉCARTÉE pour le storyboard : « vraie vignette Mapbox Static + annotations SVG ».
  Faisable (outil `static_map_image_tool` + SVG composé), MAIS ça illustre une direction QUE NOUS imposons —
  or le but est que le MODÈLE propose la créativité. On garde donc le modèle-propose. (La vraie carte = au code.)

## ⭐⭐⭐ EXTENSION D3 + VERDICT GPT vs GEMINI + MIX-AND-MATCH (2026-08-13, Gazoduc Acte 3 Segment A)

> Première application RÉELLE bout-en-bout de la chaîne storyboard→breakdown→code sur une carte **D3**
> (pas Mapbox — le principe generalise, le préambule ci-dessus s'applique tel quel). Déclenchée par un
> constat direct d'Aziz sur le rendu Acte 3 existant : "très statique, tracés plats qui ne représentent
> pas grand-chose" — le DA-brief textuel (3 voix, `da-brief.py`) déjà fait sur ce chantier n'avait PAS
> remplacé un vrai storyboard VISUEL, d'où la dérive vers un rendu plat malgré un brief écrit soigné.
> **Leçon : un DA-brief textuel seul ne suffit pas pour un beat carte — le storyboard IMAGE reste
> nécessaire même après un brief écrit détaillé.**

> ⛔ **Gate supplémentaire (2026-08-14, même chantier) : même avec un storyboard image validé, le
> BREAKDOWN écrit à la main (Claude, pas le modèle qui a généré l'image) doit être vérifié contre les
> règles DÉJÀ TRANCHÉES du même chantier avant de faire coder** — pas seulement contre l'image. Vécu :
> un breakdown fusionnant 2 images de storyboard a réintroduit un widget HUD en coin d'écran, alors
> qu'une règle DA-brief antérieure du même projet l'interdisait déjà explicitement ("financement/
> banques = dispositif SUR la carte, jamais un widget coin d'écran"). Le code écrit à partir de ce
> breakdown a été rejeté par Aziz. Réflexe à prendre : avant d'écrire un breakdown, relire les DA-briefs
> déjà actés sur CE segment précis, pas seulement regarder l'image de référence.

### ⭐⭐⭐ VERDICT GPT Image 2 vs Gemini 3.1 Flash — GPT SUPÉRIEUR pour le storyboard carte annoté

Sur un MÊME brief exact (texte identique, même image de référence jointe), GPT Image 2
(`openrouter-img2img.py --model openai/gpt-5.4-image-2`) a produit un storyboard nettement plus
exploitable que Gemini 3.1 Flash Image sur ce cas précis :
- **Français natif propre** dans les libellés (Gemini mixait franglais/anglais dans les labels).
- **Annotations de mise en scène explicites et utiles** : à chaque panneau, une mini-légende avec icône
  caméra + description du mouvement suggéré ("📷 zoom progressif du Nigeria vers l'Europe le long du
  tracé", "pause courte sur Adrar, vignette, le reste s'assombrit", "whip-pan ou glissement ouest-est").
  Gemini ne donnait quasi aucune indication caméra explicite.
- **Structure séquentielle numérotée** (panneaux 1→2→3→4→5 par concept) plus proche d'un vrai storyboard
  de tournage qu'un simple jeu d'images isolées.

**⭐ RÈGLE POUR LA PROCHAINE FOIS — ne pas trop brider GPT sur les annotations.** Le 1er appel GPT
(brief riche, sans consigne anti-texte) a spontanément produit ces annotations réalisateur de grande
qualité — à EXPLICITEMENT demander/encourager dans le prompt à l'avenir ("include director's-style
camera movement annotations for each beat"), ne pas les considérer comme du bruit à éliminer d'office.
**Nuance importante** : un 2e appel (brief "1 seul concept par image, minimal texte, show-don't-tell")
a ensuite été fait sur Gemini pour corriger un défaut DIFFÉRENT (surcharge/illisibilité à cause d'un
montage 3-concepts-en-1-image à seulement 1024×1024) — les deux leçons ne se contredisent pas : le
problème n'était pas "trop d'annotations", c'était "trop de contenu dense dans une seule image trop
petite". Isoler UN concept par image + garder les annotations caméra réalisateur = la bonne combinaison.

**⚠️ Toujours vérifier la résolution réelle du fichier reçu avant de juger la lisibilité** (`PIL Image.size`
ou équivalent) — le 1er storyboard GPT semblait "surchargé/illisible" mais était surtout en 1024×1024
carré (pas le 16:9 demandé), ce qui rend N'IMPORTE QUEL texte dense illisible indépendamment de la
qualité du contenu. Uploader en ligne pour zoom réel avant de conclure à un échec de contenu.

### ⭐⭐⭐ MIX-AND-MATCH inter-modèles — même principe que le SVG génératif, appliqué au storyboard carte

Cohérent avec la doctrine SVG déjà validée (`SVG-SCENES-GENERATIVES.md` § svg-generatif-2-appels-fusion-
par-claude) : générer plusieurs concepts VISUELS SÉPARÉS (1 image = 1 concept, jamais un montage
multi-concepts en une image basse résolution), éventuellement sur PLUSIEURS modèles (Gemini + GPT).
Méthode initiale testée : Claude regarde les 2-3 meilleures images choisies par Aziz et écrit
directement un breakdown texte détaillé qui combine les meilleures idées dans NOTRE stack réel.

⛔⛔ **CORRIGÉ (2026-08-14) — cette méthode initiale a produit un breakdown fautif, code rejeté par
Aziz.** Le breakdown écrit par Claude à partir des images a réintroduit un défaut (widget HUD en coin
d'écran) qu'une règle DA-brief antérieure du même chantier interdisait déjà — Claude n'avait pas
recroisé le breakdown contre les règles déjà tranchées avant d'écrire (cf § gate ajouté plus haut dans
ce fichier). **Méthode corrigée et validée à la place** : demander le breakdown JSON complet au MODÈLE
QUI A GÉNÉRÉ L'IMAGE lui-même (pas à Claude qui doit interpréter/deviner) — il connaît exactement ce
qu'il a voulu représenter, zéro ambiguïté. Détail complet du cas réel (V3 rejeté → V4/V5 storyboard
corrigé → prochaine étape breakdown-par-le-modèle) :
`episodes/souverain/gazoduc-aagp-tsgp/BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md`.

**Prompt squelette réutilisable** (structure légère 3-états + 6 règles de composition non-négociables +
règle anti-surcharge texte — a produit le meilleur résultat de la session, supérieur à un brief
prescriptif détaillé) : `episodes/souverain/gazoduc-aagp-tsgp/PROMPT-SQUELETTE-STORYBOARD-LIBRE-CREATIVE.txt`.
À adapter (narration + structure 3-états du beat) pour tout futur segment carte D3/Mapbox.

### ⛔ Piège confirmé — ne jamais laisser un modèle d'image "dessiner" une vraie géographie complexe

Distinct du storyboard (où l'approximation géo est tolérée, cf § principe ci-dessus) : si le TEST final
passe par un agent qui CODE en s'inspirant du storyboard (pas juste le storyboard lui-même), la règle
"la vraie géo arrive au CODE, jamais copiée pixel par pixel" doit être appliquée strictement — un test
Fable5 SVG distinct (scène dette/FMI, même session) a confirmé qu'un continent dessiné à main levée
échoue systématiquement (2 tentatives ratées) et nécessite un pivot vers de vraies données `d3-geo`/
Natural Earth. Le storyboard peut approximer la géo, le CODE final jamais.

## ⭐⭐⭐ LA BOUCLE FERMÉE — 3e appel COMPARATIF rendu-vs-storyboard (2026-08-15, Gazoduc Acte 4 / 4A)

> **Le maillon qui manquait.** Cette doctrine décrivait storyboard → validation → breakdown → code.
> Elle s'arrêtait au code. Or **le code est le premier brouillon, pas la fin** : entre le storyboard
> validé et le rendu, il se perd systématiquement des choses — pas par négligence, mais parce qu'on
> code ce qu'on a compris, et qu'on ne voit plus l'écart une fois le nez dans le fichier.
> **Le 3e appel referme la boucle** : on renvoie au modèle SON PROPRE storyboard + notre rendu réel,
> et on lui demande de mesurer l'écart. Gain mesuré sur 4A : 13 écarts trouvés dont 6 majeurs, et
> l'activité visuelle a doublé (médiane de pixels modifiés 5.75 % → 10.28 %).

**Le flux complet devient :**
`storyboard (N appels, modèles concurrents)` → **validation Aziz** → `breakdown JSON` → `CODE` →
**`3e appel COMPARATIF`** → `corrections` → re-render.

### Comment monter l'appel comparatif (recette exacte, reproductible)

1. **Extraire 5-6 frames** du rendu aux moments qui correspondent aux ÉTATS du storyboard (pas au
   hasard : ouverture / avant-pic / pic / verdict / fin).
2. **Monter une planche unique** (PIL, grille 2×3 avec un libellé + timecode sur chaque vignette).
   Un modèle compare bien mieux une planche qu'une rafale d'images séparées.
3. **Composer une image A/B verticale** : storyboard cible EN HAUT, planche du rendu EN BAS, chacune
   avec un bandeau de titre explicite. C'est CETTE image qu'on envoie.
4. **Appeler `openrouter-vision-breakdown.py --model openai/gpt-5.5`** (texte+vision, PAS le modèle
   image — on veut du JSON d'analyse, pas un dessin).
5. Demander un JSON avec, PAR écart : `gap_id`, `severity`, `what_the_storyboard_shows`,
   `what_our_render_does_instead`, `fix` **chiffré**, + un `priority_order` global.

### ⛔ Les 3 règles qui font marcher cet appel (chacune payée par un raté)

1. **DÉCLARER EXPLICITEMENT CE QUI EST HORS-SCOPE.** Sans ça, le modèle dépense son analyse à
   critiquer le fond de carte (palette, teinte des terres, style des frontières) — verrouillé chez
   nous par cohérence de série. Formule qui marche : *« The base map is FIXED and untouchable. Do NOT
   recommend changing it. »* Anticipé par Aziz avant l'appel, et effectivement neutralisé.
2. **EXIGER DES NOMBRES, PAS DES ADJECTIFS.** Demander littéralement *« not "make it more vivid" but
   the actual values to type »*. On obtient alors `stdDeviation: 14`, `fill_opacity: 0.46`,
   `length_px: 132` — directement implémentable. Sans cette phrase : « rendre plus dynamique »,
   inutilisable.
3. ⛔⛔ **VÉRIFIER CHAQUE GAP CONTRE NOS DÉCISIONS AVANT DE L'APPLIQUER — le modèle ignore notre
   projet.** Sur 4A, GPT a classé HIGH un gap « la route marocaine longe trop la côte » et fourni des
   coordonnées de remplacement passant par le Sahara. Or l'AAGP **est** un gazoduc côtier, et cette
   géométrie vient des Actes 1-2 déjà validés : appliquer le fix aurait introduit une **erreur
   factuelle** et cassé la cohérence de la série. Un gap plausible n'est pas un gap vrai.
   → Réflexe : tout gap qui touche la GÉO, un CHIFFRE, ou une décision déjà tranchée = suspect par
   défaut, à confronter au code/script avant application. (Cas particulier de « Gemini = signal,
   jamais juge », appliqué au comparatif.)

### Ce que le comparatif trouve que NOUS ne voyons pas

Les écarts que ni Aziz ni Claude n'avaient relevés à l'œil, et qui étaient pourtant structurants :
- **Le retour à l'état neutre** : les tracés restaient aussi vifs au verdict qu'à l'ouverture, ce qui
  annulait le contraste voulu. Un pic n'existe que si l'état d'après est visiblement plus faible.
- **Le chevauchement de deux états** : l'insert du pic traînait sur le verdict et écrasait le 3e
  temps. Corollaire : *la sobriété d'un verdict n'existe que si le pic a vraiment quitté l'écran.*

Ces deux-là sont des défauts de RYTHME, invisibles sur une frame isolée et difficiles à nommer en
regardant la vidéo — mais évidents pour un modèle qui compare état par état à une cible.

### Le modèle ne voit pas la vidéo — et ce n'est pas un problème ici

`gpt-5.5` n'accepte pas la vidéo, seulement des images. Pour comparer une COMPOSITION à un storyboard,
c'est sans importance (on compare des états). Ce qu'on perd, c'est le jugement sur le MOUVEMENT →
si c'est le rythme qu'on veut juger, passer par **Gemini 3.1 Pro qui accepte l'upload vidéo réel**
(cf `memory/tools/gemini-video-upload-fiable.md`). Les deux sont complémentaires, pas concurrents.

**Artefacts de référence de cette session** (gabarits réutilisables tels quels) :
- prompt storyboard : `episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/PROMPT-storyboard-4A-v2.txt`
- prompt breakdown : `.../breakdown-acte4/PROMPT-breakdown-4A.txt`
- ⭐ **prompt comparatif (LE gabarit à copier)** :
  `.../breakdown-acte4/PROMPT-comparatif-rendu-vs-storyboard.txt`
- sortie réelle : `.../breakdown-acte4/4A-breakdown-V2-gaps.json` (13 gaps classés)

### ⭐ Corollaire amont : la RÉFÉRENCE-IMAGE dicte la COMPOSITION, pas seulement le style

Découvert au 1er essai de 4A, avant même le comparatif. En joignant comme référence une frame
contenant un **insert composé**, les DEUX modèles ont produit des storyboards où chaque idée arrivait
dans un panneau encadré avec du texte — 6 panneaux, presque autant d'inserts. Ce n'était pas leur
créativité, c'était le mimétisme de l'amorce.

En rejouant le MÊME brief avec (1) une frame de **carte pure** et (2) une consigne inversée
explicite — *« THE MAP CARRIES THIS BEAT. AT MOST ONE composed insert card in this ENTIRE beat »* —
les deux modèles ont basculé vers de vraies propositions cartographiques, et leurs notes de direction
se sont mises à décrire **ce que fait la carte** au lieu de mouvements de caméra.

⛔ **Règle** : choisir la frame de référence pour la COMPOSITION qu'elle amorce, pas seulement pour sa
palette. Et quand un dispositif est nouveau (comme l'insert matière), **poser un plafond chiffré**
dans le brief — sinon il devient le régime normal et cesse de faire rupture. (Raison d'Aziz, plus
forte que la sobriété : *un insert qui survient toutes les 20 s ne surprend plus, et le climax n'a
alors plus rien à rompre.*)

## STATUT
✅ **BOUCLE FERMÉE storyboard→code→comparatif→corrections éprouvée** (2026-08-15, Gazoduc Acte 4 / 4A) —
   voir section ci-dessus. 3 règles de brief + garde-fou « vérifier chaque gap contre nos décisions »,
   gabarits de prompts disponibles. Gain mesuré : activité visuelle ×1.8, 6 gaps majeurs corrigés.
✅ Chaînes de référence + directive CARTE VIVANTE remplies (Aziz 2026-06-20).
✅ **FORMAT BREAKDOWN CARTE défini + éprouvé** (2026-06-20, agent réel sur beat AES « confédération » avec piège
   créatif volontaire) : le format protège l'idée inédite via `si_nouveau` sans la raboter. 3 champs auto-portants
   ajoutés (`forme_couvre_tout`/`ce_qui_manque`, `cout_estime`, `fallback_si_echec`).
✅ **Chaîne COMPLÈTE storyboard→breakdown→code éprouvée sur D3** (2026-08-13, Gazoduc Acte 3 Segment A) —
   voir section ci-dessus. Verdict GPT>Gemini pour ce type de storyboard annoté, méthode mix-and-match
   documentée, gabarit de breakdown réel disponible.
⏳ Le PRÉAMBULE storyboard (notre carte + chaînes + directive carte vivante) reste à tester sur Mapbox
   proprement dit (le test 2026-08-13 était sur D3, principe transposable mais pas encore vérifié sur
   Mapbox spécifiquement).
Branché dans : `MEMORY.md`, `SYSTEME-AGENTIQUE.md` (étape 5).
