# Comparer à ÉTAT ÉGAL avant d'attribuer un écart à la matière

⛔ Avant toute mesure comparative entre notre livrable et la référence d'un client, **vérifier que
les deux images montrent le MÊME ÉTAT de l'objet**. Un objet animé a N états (repos, 25 %, 75 %,
plein). Comparer notre état de repos à sa référence en état avancé mesure la **différence d'ÉTAT**,
pas la différence de qualité — et attribue à la MATIÈRE ce qui vient de l'ÉCLAIRAGE de l'état.

**Why** : vécu 2026-09-02, contrat Upwork Chill Meter (350 $, jalon 1). J'ai comparé notre meter à
l'état de base (0 %, sans givre) contre la référence de la cliente qui montre le meter à ~75-85 %
(givre actif, halo bleu ambiant). Mesures relevées et présentées comme un verdict sur la matière :

| | luminosité coque | micro-grain |
|---|---|---|
| sa référence (état ~75 %) | 31,4 / 11,8 | 3,85 / 3,73 |
| notre rendu (état 0 %) | 43,1 / 33,6 | 19,76 / 12,66 |

Conclusion tirée à tort : « notre métal a déjà 3-5× plus de grain que le sien ». **Faux** : sa coque
est sombre et lisse parce que le halo bleu du givre l'éclaire et l'aplatit, pas parce que son métal
est différent. C'est Aziz qui l'a signalé.

**Coût** : une piste entière (texture raster plaquée en `<pattern>` SVG) explorée puis abandonnée,
4 dosages de blending mesurés, 2 générations d'image payantes — toutes bâties sur un diagnostic
invalide. Une fois rendue notre propre composition à état égal (`ChillMeter-Fill75`, **dernière**
frame), la comparaison a montré **en une image** ce que 4 essais n'avaient pas montré : le vrai
écart n'est pas la matière du métal, c'est le givre.

## ⛔⛔ La règle EXISTAIT — le défaut était son ADRESSAGE, pas le savoir

`FICHE-BRIEF-CLIENT.md:160` portait déjà, **écrit sur ce projet précis** :
« ⭐ Exiger l'ÉTAT NEUTRE quand la référence client montre l'état FINAL : sa réf était givrée à
100 % ». Je suis tombé dans le piège quand même.

Cause racine trouvée au wrap et **corrigée** : le hook `fiche-inject.sh:186` déclenchait cette fiche
sur `client-sim|upwork|freelance-linkedin|BRIEF-CLIENT`. Or le CODE du contrat vit sous
`src/projects/_rnd/chill-meter/` — aucun de ces motifs. **La fiche ne s'est jamais injectée de toute
la session.** `chill-meter` ajouté au motif, vérifié par test réel (la fiche sort maintenant).
C'est la **2e occurrence** du même défaut d'adressage (la 1re : `FICHE-MOCKUP-3D`, corrigée le 26/08
— « elle ne se déclenchait jamais sur le code qu'elle documente »).

⭐ **La leçon la plus transférable est là** : quand une règle écrite n'a pas empêché l'erreur qu'elle
décrit, chercher d'abord si elle était SOUS LES YEUX au bon moment. Une règle non injectée est une
règle qui n'existe pas. Ne pas la réécrire ailleurs — réparer son déclencheur.

## How to apply

1. Avant de mesurer quoi que ce soit contre une référence client, **identifier l'état visible dans
   sa référence** (quel % de remplissage, quel moment de l'animation, quels effets actifs).
2. **Rendre notre composition dans CE MÊME ÉTAT.** Nos compositions par palier existent pour ça
   (`-Idle`, `-Fill25/50/75/100`). ⚠️ Prendre la **dernière** frame, pas la frame 0 : sur une compo
   de N frames, la frame 0 est le DÉBUT de l'animation (`--frame=104` sur `durationInFrames={105}`).
3. Ne mesurer la matière qu'après avoir neutralisé les effets d'éclairage propres à l'état (halo,
   glow, overlay ambiant). Si on ne peut pas les neutraliser, **la mesure ne parle pas de la matière**.
   ⭐⭐⭐ **Et quand SA référence est figée dans l'état final (on ne peut pas lui demander l'état nu) :
   DÉGIVRER SA RÉFÉRENCE — voir la section suivante.** C'est la sortie de l'impasse que ce point 3
   décrivait sans la résoudre.
4. Corollaire de [[feedback_comparatif-storyboard-mesurer-pas-demander]] : mesurer ne suffit pas, il
   faut mesurer **la même chose des deux côtés**. Le biais n'est pas dans l'outil de mesure, il est
   dans le CADRAGE de la comparaison.

Lié : [[feedback_ecart-brief-verifier-contre-la-reference-client]] ·
[[feedback_gate-contourne-par-outil-alternatif]] · [[feedback_regle-ecrite-insuffisante-sans-gate-outille]]

---

## ⭐⭐⭐ LE GESTE QUI DÉBLOQUE — ramener SA référence dans NOTRE état (idée d'Aziz, 02/09/2026)

> Ce feedback décrivait le piège mais laissait une impasse : « si on ne peut pas neutraliser les
> effets, la mesure ne parle pas de la matière ». **Voici comment on en sort.** Prouvé le lendemain
> du jour où le piège a coûté une session entière.

**Le problème générique** : un client fournit une référence dans un ÉTAT FINAL qu'on ne peut pas
lui demander de retirer (givrée, allumée, éclairée en studio, stylisée, retouchée, générée par IA).
Notre livrable, lui, part de l'état NU. Aucune comparaison n'est valide, et on dose donc à l'aveugle
sur le seul point subjectif du brief.

**Le geste** : demander à un modèle image-to-image (`scripts/tools/gemini-i2i.py --ref`) de RETIRER
l'état final et de rendre l'objet nu, en décrivant précisément l'état initial voulu (ici : châssis
propre, écran éteint, jauge vide, sans glace ni halo). On obtient **SA référence dans NOTRE état**.

**Pourquoi ça marche particulièrement bien ici** : sa référence était elle-même générée par IA. On
ne « devine » pas ce qu'il y a dessous, on demande au même type d'outil de reconstruire ce qu'il
aurait produit sans l'effet. C'est du **reverse engineering de référence client**.

### Ce que ça a donné concrètement (mesures, pas impressions)
| | Son métal nu | Le nôtre |
|---|---|---|
| Luminosité moyenne | 41-64 | 48 ✅ déjà dans sa fourchette |
| Micro-contraste | 25-33 | 24 ✅ quasi identique |
| **Ratio p95/p5 (plage tonale)** | **11,8-14,5** | **3,9** ❌ |

⭐⭐ **Les 2 premières lignes sont le vrai gain** : elles ont prouvé que le défaut n'était NI « trop
clair » NI « pas assez de grain » — les 2 axes sur lesquels j'aurais dosé pendant des heures (et
sur lesquels la session précédente A dosé pendant des heures). Le seul écart réel était la PLAGE
TONALE, dont la cause a été trouvée dans le code en 10 minutes : 3 rampes de dégradé coincées entre
L26 et L113. **Une demande subjective (« more texture and character ») est devenue mesurable.**

### Bénéfices en cascade, tous vérifiés
- ⭐ **Ça rend des pistes lourdes SANS OBJET.** La piste 3D (générer un rendu éclairé comme cible)
  visait exactement ce que le dégivrage donne en 2 appels Gemini, sans mailler un panneau plat que
  ces modèles gèrent mal. Abandonnée sans regret. **Toujours tenter le geste le moins cher AVANT
  d'ouvrir un chantier technique.**
- ⭐ **Deux jets = une FOURCHETTE, pas une contradiction.** Les 2 sorties (une sobre, une franchement
  rouillée) ne se départagent pas : elles donnent l'amplitude de ce que le mot du client (« rusted »)
  peut vouloir dire. Elles sont devenues **les 2 variantes proposées à la cliente**, et les
  reconstructions elles-mêmes ont été **jointes au message** comme justification de la démarche.
- ⭐ **C'est un argument commercial.** Sans elles, 2 variantes ressemblent à 2 essais au hasard ;
  avec elles, ce sont 2 lectures argumentées de SA propre référence. Le retour client passe de
  « j'aime / j'aime pas » à « plutôt vers cette version-là ».

### ⚠️ Limites à énoncer, au client comme à soi-même
- Ce que le modèle rend est une **hypothèse plausible**, pas une vérité : il invente ce qu'il y a
  sous l'effet. Exploitable pour la **DIRECTION** (plus sombre / plus terne / plus contrasté), jamais
  pour un détail au pixel. Suffisant pour trancher un point subjectif.
- **Le dire franchement au client** quand on lui montre les reconstructions. Ne rien cacher de
  l'usage de l'IA : quand sa propre référence en vient (cas fréquent), c'est un langage commun, et
  la transparence fait paraître méthodique plutôt que l'inverse.
- Surveiller les hallucinations, relancer si le 1er jet dérive.

### Quand déclencher ce geste
Dès qu'un point du brief est SUBJECTIF (« plus de caractère », « plus premium », « plus vivant »)
**et** que la référence du client montre un état qu'on ne livre pas. Ne pas attendre d'avoir dosé
2 fois dans le vide : c'est précisément ce que ce geste évite, et il coûte 2 appels image.

Lié : [[feedback_reference-image-superieure-a-description-texte-genai]] ·
[[feedback_harnais-de-mesure-accuse-un-code-juste]] (4e piège : mesurer à côté de ce que le fix touche)
