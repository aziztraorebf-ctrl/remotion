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
4. Corollaire de [[feedback_comparatif-storyboard-mesurer-pas-demander]] : mesurer ne suffit pas, il
   faut mesurer **la même chose des deux côtés**. Le biais n'est pas dans l'outil de mesure, il est
   dans le CADRAGE de la comparaison.

Lié : [[feedback_ecart-brief-verifier-contre-la-reference-client]] ·
[[feedback_gate-contourne-par-outil-alternatif]] · [[feedback_regle-ecrite-insuffisante-sans-gate-outille]]
