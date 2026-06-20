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
> d'orchestration (`PLAN-ORCHESTRATION-VIDEO.md`), APRÈS le checkpoint goût.** Le breakdown ne décide rien de
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

## STATUT
✅ Chaînes de référence + directive CARTE VIVANTE remplies (Aziz 2026-06-20).
✅ **FORMAT BREAKDOWN CARTE défini + éprouvé** (2026-06-20, agent réel sur beat AES « confédération » avec piège
   créatif volontaire) : le format protège l'idée inédite via `si_nouveau` sans la raboter. 3 champs auto-portants
   ajoutés (`forme_couvre_tout`/`ce_qui_manque`, `cout_estime`, `fallback_si_echec`).
⏳ Le PRÉAMBULE storyboard (notre carte + chaînes + directive carte vivante) reste à tester sur un cas réel
   (génération d'image), pour valider qu'il produit une direction premium et non plate.
⏳ Reste à éprouver : la chaîne COMPLÈTE storyboard→breakdown→code sur une mini-vidéo cobaye (orchestration bout-en-bout).
Branché dans : `MEMORY.md`, `SYSTEME-AGENTIQUE.md` (étape 5), `PLAN-ORCHESTRATION-VIDEO.md`.
