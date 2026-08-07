# STORYBOARD — DIRECTION B (System/Conceptual)
## NorthShield · 16:9 1920×1080 · 63.34s

> Généré par agent Opus (isolé, sans connaissance de Direction A), 2026-08-06.
> Script verrouillé + timings extraits de l'alignment audio réel (pas estimés).

### La métaphore centrale : **LE SEUIL QUI RESPIRE**

Le sujet réel de NorthShield n'est pas "bloquer", c'est "doser". Le produit ne dit pas oui/non : il dit *combien*. La métaphore n'est donc pas un objet (bouclier, porte, cadenas) mais une **grandeur continue qui se lit d'un coup d'œil**.

Forme : **une ligne d'horizon horizontale, fine, cyan, qui traverse tout l'écran** — le niveau de vigilance du système. Sous elle, un flux de connexions passe de gauche à droite comme des traits lumineux. La ligne est plate et calme quand tout est normal : les traits la traversent sans qu'elle bouge. Quand une connexion anormale arrive, la ligne se soulève sous ce trait précis — une bosse locale, comme une corde tendue qu'on pince — et seule cette connexion est arrêtée le temps que la bosse retombe.

Pourquoi cette forme :
- Encode la nuance, pas le binaire — un cadenas/bouclier/porte est booléen ; une ligne qui se déforme proportionnellement montre qu'il existe un 18 ET un 82, le cœur du produit.
- Encode "et s'efface le reste du temps" littéralement — 90% du temps la ligne est plate et on l'oublie.
- Encode la combinaison de 4 signaux sans diagramme — la bosse est la somme de 4 tensions appliquées à la même corde (P3).
- Évite le piège du nom — "NorthShield" + "se manifeste" appelle un bouclier 3D. Une corde de vigilance ne protège pas frontalement, elle réagit — plus intelligent, plus juste.
- Animable en SVG pur frame-driven (path d interpolé), zéro asset payant.

Palette imposée par le mockup existant : `#0A1628` fond · `#0F1F38` surfaces · `#F4F1EA` texte · `#00D9FF` accent · vert `#3DDC97` (autorisé) / rouge `#FF4D5E` (vérification) repris exactement des écrans déjà rendus.

---

## P1 — "On traite encore toutes les connexions de la même manière" + "soit on ralentit tout le monde… soit on croise les doigts"
**0.0 → 10.9s** (10.9s)

**INFORMATION** : Le statu quo est un choix entre deux mauvaises options — aucun système actuel ne différencie les connexions.

**REPRÉSENTATION** : Écran noir bleuté. Flux horizontal de traits lumineux identiques (≈40, même longueur/opacité/cyan pâle, espacement régulier) défile au milieu. Mot-clé visuel : l'indifférenciation. Sur "ralentit tout le monde" : une barre verticale épaisse tombe en travers, tout s'arrête en file d'attente, les traits se compriment à gauche de la barre. Sur "croise les doigts" : la barre disparaît d'un coup, tout repart trop vite, les traits filent et sortent du cadre — dont 3 traits rouges qu'on n'avait pas remarqués passent avec les autres, sans que rien ne les arrête.

Pourquoi : montrer le problème comme un flux uniforme (pas "un hacker qui attaque") déplace le sujet du méchant vers le traitement — le vrai sujet client. Le diptyque embouteillage/fuite fait ressentir physiquement le dilemme.

**MEDIUM** : SVG animé frame-driven (traits = rect fins, positions interpolées). Recommandation : zéro texte à l'écran.

**SEMANTIC TEST** : "Un flux de choses identiques ; à un moment tout est bloqué et bouchonne, à un autre tout passe et des éléments rouges filent au travers." → Pas de nuance, et ça coince ou ça fuit.

---

## P2 — "La sécurité a enfin le discernement."
**10.9 → 15.2s** (4.3s, panneau charnière, le plus court et silencieux)

**INFORMATION** : Bascule — ce qui change n'est pas la force du système, c'est son jugement.

**REPRÉSENTATION** : Le chaos du P1 s'apaise, tous les traits se résorbent, et de la turbulence émerge une seule ligne horizontale fine cyan traversant tout l'écran — draw-on gauche à droite (stroke-dasharray), 1.2s, easing calme. La ligne respire à peine (oscillation d'amplitude 2-3px, très lente).

Pourquoi : la plupart des vidéos mettraient un logo qui pulse ou un bouclier qui se referme. Le vide fait le travail — après 11s de désordre, une ligne unique et calme EST la définition visuelle du discernement.

**MEDIUM** : SVG pur (un path, draw-on stroke-dasharray). Recommandation : laisser la ligne seule, sans texte.

**SEMANTIC TEST** : "Le désordre s'est réorganisé en une seule ligne calme." → Quelque chose a pris le contrôle, et c'est calme.

---

## P3 — "NorthShield analyse chaque connexion en temps réel — l'appareil, le lieu, l'historique, le comportement. Quatre signaux vitaux, une décision instantanée."
**15.2 → 28.7s** (13.5s, le cœur conceptuel)

**INFORMATION** : Le mécanisme — 4 signaux mesurés simultanément et en continu, combinés en une seule valeur.

**REPRÉSENTATION** : La ligne du P2 se dédouble en 4 lignes parallèles empilées, étiquetées `APPAREIL` · `LIEU` · `HISTORIQUE` · `COMPORTEMENT`. Chaque ligne a sa micro-activité propre (COMPORTEMENT ondule plus, APPAREIL presque plat). Une connexion (point lumineux) traverse les 4 lignes en même temps — chaque ligne réagit brièvement sous elle. Sur "décision instantanée" : les 4 lignes convergent et se referment en une seule (glissement vertical + fusion), l'amplitude résultante = somme des 4 sursauts. Chiffre discret au-dessus de la bosse : `18`.

Pourquoi : 4 icônes qui s'allument (réflexe standard) montrent qu'il y a 4 choses, jamais qu'elles se combinent. La fusion 4→1 est un geste physique — on VOIT l'addition des tensions produire une seule grandeur. Réutilise l'objet du P2 au lieu d'introduire une forme neuve.

**MEDIUM** : SVG animé frame-driven (4 path interpolés + convergence translateY, chiffre en typo géométrique). Le `18` doit être la même graisse/couleur que le score du dashboard — pont vers P4.

**SEMANTIC TEST** : "Quatre pistes étiquetées appareil/lieu/historique/comportement réagissent ensemble au passage de quelque chose, puis se fondent en une seule qui affiche 18." → Panneau jugé le plus fort des deux directions par l'agent lui-même.

---

## P4 — "Sarah se connecte. Même bureau, à Toronto, même ordinateur. Risque minime. La porte s'ouvre — elle ne s'en rend même pas compte."
**28.7 → 40.9s** (12.2s) — entrée du PRODUIT

**INFORMATION** : Cas réel n°1 et preuve produit — le mécanisme abstrait existe pour de vrai, il produit une ligne dans un vrai dashboard. Côté utilisateur, il ne se passe rien — c'est ça, la réussite.

**REPRÉSENTATION** : Le `18` du P3 reste fixe pendant que la caméra recule (pull back) : le chiffre se révèle être le score de la ligne `Sarah M.` dans le dashboard, qui se dessine autour, puis le dashboard se révèle dans le mockup laptop (`laptop-low-risk-big.png`, zone écran x=515 y=140 940×588). Trois autres lignes visibles au-dessus/dessous (David K. 6, Amina T. 22, Marc L. 14) — toutes vertes : le système tourne en continu sur tout le monde, pas un cas isolé fabriqué. La ligne Sarah s'illumine doucement en vert, arc se remplit jusqu'à 18, badge `Autorisé`. Aucune animation triomphale, aucun son de validation — léger fondu, puis la ligne redevient une ligne parmi les autres.

Pourquoi : le pull back depuis le chiffre abstrait vers l'UI réelle soude ABSTRAIT→PRODUIT — le spectateur change d'échelle, pas de sujet. Sous-jouer l'autorisation traduit visuellement "elle ne s'en rend même pas compte".

**MEDIUM** : UI produit (2 PNG déjà rendus / SVG mockup laptop) + caméra SVG (`<g transform>` scale+translate) + léger overlay cyan d'ambiance. Zéro génération d'asset nécessaire.

**SEMANTIC TEST** : "Un vrai tableau de bord de sécurité sur un laptop ; Sarah M., MacBook Pro, Toronto, score 18, autorisé — et d'autres employés autorisés aussi." → Produit réel qui note les connexions, celle-ci est saine.

---

## P5 — "Trois heures plus tard — même compte, un appareil inconnu, cette fois depuis Berlin. NorthShield le voit. Anomalie critique — vérification exigée, immédiatement."
**40.9 → 56.5s** (15.6s, le retournement)

**INFORMATION** : Même personne, même compte — mais le contexte a changé, et le score bascule. Le contexte décide, pas l'identité.

**REPRÉSENTATION** : Reste sur LE MÊME PLAN, caméra immobile sur le dashboard — il ne se recharge pas, il vit. L'heure passe `09:14 → 12:47` (roulement de chiffres), `MacBook Pro → Appareil inconnu`, `Toronto, CA → Berlin, DE` — substitution en cascade rapide, pendant que les 3 autres lignes restent strictement immobiles et vertes. Le score monte : arc se remplit et change de teinte en cours de route (vert→ambre→rouge), chiffre roule `18→82`, badge devient `Vérification requise`.

Puis sur "NorthShield le voit" : retour bref à la ligne de vigilance (plan serré) — la ligne cyan plate depuis P3 se soulève brutalement en une bosse haute et étroite exactement sous la connexion de Sarah, le reste de la ligne ne bouge pas d'un pixel. Une seule connexion arrêtée, tout le monde continue. Retour dashboard sur `Vérification requise`, plus un encart téléphone minimal : `Confirmez votre connexion — Berlin, DE`.

Pourquoi : garder le même plan et ne changer que 4 valeurs est plus fort qu'un cut vers un "écran d'alerte" — prouve que rien d'autre n'a bougé, le système est chirurgical, pas alarmiste (exigence du ton client). La bosse locale sur une ligne par ailleurs plate démontre visuellement "friction minimale" = friction locale.

**MEDIUM** : UI produit — ⚠️ **[MAJ 2026-08-07]** le dashboard est finalement un composant React
DATA-DRIVEN (`DashboardScreen.tsx`, prop `riskCase: "low"|"high"`), pas 2 PNG statiques comme
envisagé initialement. La technique de morph P4→P5 est donc probablement un crossfade/interpolation
des PROPS React (heure/appareil/ville/score) plutôt qu'un recomposage SVG/DOM par-dessus un PNG
figé — à confirmer en codant, voir `PLAN-ANIMATION-DIRECTION-B.md` pour la technique à jour. +
retour SVG ligne de vigilance + typo encart mobile.

**SEMANTIC TEST** : "Même personne, mais appareil inconnu et Berlin ; score à 82 en rouge, vérification requise — les 3 autres employés non touchés." → Un spectateur qui n'a vu QUE ce panneau a déjà compris NorthShield.

---

## P6 — "NorthShield. La sécurité se manifeste quand il le faut — et s'efface le reste du temps."
**56.5 → 63.34s** (6.8s)

**INFORMATION** : La signature — résumer la philosophie du produit en une image tenable.

**REPRÉSENTATION** : Le dashboard s'efface en fondu. Reste la ligne de vigilance seule, plein cadre. Vue sur durée compressée : la bosse rouge de Sarah retombe, la ligne redevient plate, le flux reprend son passage tranquille au-dessus — la ligne ne bouge plus du tout. Elle s'atténue progressivement jusqu'à n'être qu'un trait presque invisible, sans jamais disparaître complètement. Wordmark `NorthShield` apparaît au centre en typo géométrique blanc cassé, accent cyan seulement sur le point/la barre du logo.

Pourquoi : le script dit "s'efface" — la plupart des vidéos finiraient sur un logo qui grossit. Ici la métaphore exécute la phrase — elle s'efface littéralement, tout en restant présente. Contre-pied exact du bouclier 3D que le nom appelait.

**MEDIUM** : SVG (ligne + flux) + typographie. Fond `#0A1628`.

**SEMANTIC TEST** : "Une ligne de surveillance redevient calme et s'estompe pendant que le trafic reprend normalement ; NorthShield." → Ce produit se fait oublier. Le message principal du brief délivré par l'image seule.

---

## Récapitulatif de timing

| # | Contenu | In | Out | Durée | Medium dominant |
|---|---|---|---|---|---|
| P1 | Le dilemme (flux indifférencié) | 0.0 | 10.9 | 10.9s | SVG |
| P2 | Le discernement (la ligne naît) | 10.9 | 15.2 | 4.3s | SVG + typo |
| P3 | 4 signaux → 1 décision | 15.2 | 28.7 | 13.5s | SVG |
| P4 | Sarah / Toronto / 18 / Autorisé | 28.7 | 40.9 | 12.2s | UI produit |
| P5 | Berlin / 82 / Vérification | 40.9 | 56.5 | 15.6s | UI produit + SVG |
| P6 | La ligne s'efface | 56.5 | 63.34 | 6.8s | SVG + typo |

Structure CONCRET→ABSTRAIT→CONCRET : P1 concret (flux qui bouchonne) → P2-P3 abstrait (mécanisme) → P4-P5 concret (produit réel) → P6 signature abstraite ancrée par ce qui précède.

## Notes de production

- Zéro asset payant — tout est SVG frame-driven + les 2 PNG déjà rendus.
- Le vrai travail technique est P4→P5 : le morph d'une seule ligne du dashboard. Recomposer la ligne Sarah en SVG/DOM par-dessus le PNG plutôt que crossfader les deux images (éviter le scintillement du texte des 3 autres lignes).
- Interdits vérifiés : aucun hoodie, code Matrix, cadenas central, bouclier, pluie de 0/1. Mots checkpoint/constellation/balance absents. Piège "NorthShield/se manifeste" traité frontalement en P6 par l'inverse littéral.

## Point de risque signalé par l'agent (non tranché)

P1 est le panneau le plus long en abstrait pur (10.9s) — risque de la direction. Si le Semantic Test croisé montre que le dilemme ne se lit pas assez vite, parade possible : écourter la phase "indifférenciation" et entrer plus tôt sur la barre qui bloque, ou piocher en Mix & Match l'ouverture humaine de la Direction A pour les 4 premières secondes.

## Fichiers utiles
- Mockup : `public/_client-sim/noteshield/laptop-mockup.svg` (zone écran x=515 y=140 940×588)
- États rendus : `out/_client-sim/noteshield/laptop-{low,high}-risk-big.png`
- Alignement audio : `src/projects/_client-sim/noteshield/audio/narration.alignment.json`
