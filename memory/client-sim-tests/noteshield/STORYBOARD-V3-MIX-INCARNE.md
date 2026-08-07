# STORYBOARD V3 — Mix incarné (System/Conceptual + Narrative/Human + apports GPT externe)

> Écrit le 2026-08-07, après rejet de la Direction B pure (v1 ET v2 codées — voir
> `SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md` pour la v2 motion, gardée comme référence de code).
> Diagnostic qui motive ce storyboard : la Direction B (100% abstraite) manque le brief sur
> deux points **antérieurs au motion design** — (1) le flux de traits P1 reformule le cliché
> "pluie de données" explicitement interdit par le brief client, sous une forme géométrique
> différente mais dans le même registre ; (2) l'absence totale d'incarnation humaine viole la
> chaîne HUMAN→SYSTEM→PRODUCT du brief — confirmé après coup par notre propre Semantic Test
> croisé du 2026-08-07 (`MIX-AND-MATCH-DIRECTION-B.md` : "A-P1 compris immédiatement" vs
> "B-P1 partiellement compris"), qui portait déjà ce signal sans qu'on en tire la conséquence.
>
> Source d'un 3e avis externe : storyboard GPT (image jointe par Aziz, 10 panneaux, très chargé
> en texte/UI mais incarne Sarah avec un vrai visage et évite totalement le flux abstrait) — pas
> suivi à 100%, mais 3 idées reprises explicitement (slider dilemme, cascade dashboard lisible,
> incarnation du personnage).
>
> **Décision de pipeline (validée par Aziz)** : les plans avec Sarah utilisent **MiniMax H3**
> (image-to-video, PAS Seedance) — déjà prouvé sur Flowdesk (personnage qui tape au clavier,
> registre personne/émotion). Coût ~$1.30/5s en 2K. Nécessite une image de référence statique
> (Gemini/Recraft) par plan, animée ensuite par H3 en conservant fidèlement le style — PAS un
> prompt texte pur. Détail technique complet : `memory/tools/minimax.md` § H3.
>
> **Cohérence du personnage (tranchée)** : UNE SEULE image de référence de Sarah, réutilisée
> comme input pour chaque appel H3 sur les 3 plans qui l'impliquent (P1 file d'attente en
> arrière-plan/silhouette parmi d'autres, P5 bureau Toronto, P6 Berlin) — pas de régénération
> indépendante par plan (risque de dérive visuelle du personnage déjà documenté ailleurs comme
> piège classique de génération multi-appels).
>
> Texte/UI/icônes/annotations sont TOUJOURS composités par-dessus le plan vidéo en overlay
> Remotion (React/SVG), jamais générés dans le plan H3 lui-même (règle Seedance/H3 : anti-texte
> obligatoire dans le prompt vidéo — le texte généré par un modèle vidéo est illisible/instable).

## Principe de mix (résumé)

| Panneau | Idée narrative retenue | Source | Moteur |
|---|---|---|---|
| P1 | File d'attente humaine + barrière physique (PAS de flux de traits) | Direction A | MiniMax H3 |
| P2 | Slider "trop strict / trop laxe" | GPT externe | SVG maison |
| P3 | Ligne calme qui naît du chaos | Direction B (déjà codé v2, à garder) | SVG maison |
| P4 | 4 signaux qui convergent en une mesure, ancrés dans un cadre produit | Direction B (mécanisme) + ancrage produit (GPT) | SVG maison + overlay cadre UI |
| P5 | Sarah, Toronto, pull-back vers le dashboard | Direction A (structure) + incarnation réelle | MiniMax H3 + LaptopMockup existant |
| P6 | Cascade Berlin + bosse de vigilance | Direction B (déjà codé v2, à garder tel quel) | MiniMax H3 (contexte bref) + SVG/React (DashboardScreen + ligne) |
| P7 | Signature, ligne qui s'atténue | Direction B (déjà codé v2, à garder tel quel) | SVG maison |

7 panneaux (pas 6, pas 10) — le slider GPT (P2) mérite son propre battement court plutôt que
d'être écrasé dans P1, mais on reste loin des 10 panneaux du storyboard externe (trop de cuts
sur 60s recrée un effet diaporama par accumulation, même si chaque cut est bien exécuté).

---

## P1 — Le dilemme, incarné (0.0 → 10.9s)

**INFORMATION** : Le statu quo est absurde et USE les gens — pas une menace, une friction
quotidienne mal calibrée dans les deux sens.

**REPRÉSENTATION** : Plan filmé (MiniMax H3) — couloir de bureau moderne, plusieurs silhouettes
humaines (dont Sarah, en amorce parmi d'autres — pas encore le focus) avancent en file vers un
contrôle d'accès. Sur "ralentit tout le monde" (3.76s) : une barrière physique descend d'un coup,
tout le monde s'arrête, mécanique et saccadé. Sur "croise les doigts" (8.08s) : cut sec, la
barrière remonte, tout repart trop vite — un employé qui n'aurait pas dû passer se fond dans le
mouvement sans qu'on le remarque particulièrement (pas de mise en scène appuyée sur lui, juste
présent dans le plan).

**Pourquoi ce choix** : remplace le flux de traits abstrait (cliché "pluie de données" déguisé,
signalé par Aziz et confirmé contraire au brief) par une scène humaine directement lisible —
zéro décodage requis, conforme au Semantic Test qui donnait déjà l'avantage à ce registre.

**MEDIUM** : MiniMax H3 (image de référence : couloir de bureau + groupe de silhouettes stylisées,
génération Gemini/Recraft en amont, registre "2D flat illustration" cohérent avec notre identité
visuelle, PAS photoréaliste — éviter la dérive vers un rendu corporate stock générique).
Overlay Remotion minimal : un compteur mono discret en coin (`+1 vérification` qui s'incrémente)
si le rythme du plan le permet sans surcharger.

**SEMANTIC TEST (cible)** : "Des gens avancent, une barrière les arrête tous d'un coup, puis
repart trop vite." → Le contrôle est mal calibré dans les deux sens.

---

## P2 — Le dilemme visualisé (10.9s → ~14s, ~3s)

**INFORMATION** : Nommer explicitement le compromis binaire que tout système de sécurité
traditionnel impose — pour préparer la bascule du panneau suivant.

**REPRÉSENTATION** : Slider horizontal, dégradé rouge→bleu, curseur au centre. Icône utilisateur
frustré à gauche ("trop strict — productivité basse"), icône silhouette suspecte à droite ("trop
laxe — risque élevé"). Le curseur oscille légèrement entre les deux extrêmes puis se fige au
centre — visualise concrètement qu'aucun réglage fixe ne fonctionne.

**Pourquoi ce choix** : repris de la proposition GPT externe — langage d'infographie SaaS que le
public cible (responsables IT, PME) reconnaît instantanément, complémentaire à la scène humaine
de P1 sans la répéter.

**MEDIUM** : SVG maison (notre force : dataviz nette). Composant simple, pas de personnage
nécessaire ici.

**SEMANTIC TEST (cible)** : "Une jauge oscille entre deux extrêmes mauvais, se bloque au milieu."
→ Il n'existe pas de bon réglage fixe.

---

## P3 — Le discernement naît (~14s → ~18.5s, ~4.5s)

**INFORMATION** : Bascule — la réponse n'est pas un réglage, c'est un jugement continu.

**REPRÉSENTATION** : INCHANGÉ vs la v2 déjà codée et validée (`P2SeuilNait.tsx`) — le chaos se
résorbe, une ligne cyan calme naît (draw-on via stroke-dashoffset), respiration continue, point
de scan voyageur. Ce panneau n'a jamais été mis en cause par le Semantic Test ni par le retour
d'Aziz — panneau charnière court et silencieux, garder tel quel.

**MEDIUM** : SVG maison (code existant réutilisable directement, voir
`src/projects/_client-sim/noteshield/direction-b/P2SeuilNait.tsx`).

**SEMANTIC TEST** : "Le désordre s'est réorganisé en une seule ligne calme." → Quelque chose a
pris le contrôle, et c'est calme.

---

## P4 — Les 4 signaux → décision (~18.5s → ~32s, ~13.5s)

**INFORMATION** : Le mécanisme — 4 signaux mesurés en continu, combinés en une seule valeur,
ET cette valeur appartient déjà à une vraie interface produit (pas un schéma flottant dans le
vide abstrait).

**REPRÉSENTATION** : Reprend la mécanique déjà codée en v2 (`P3QuatreSignaux.tsx` — 4 lignes
avec signature de mouvement continue chacune, convergence, score par paliers) MAIS ancrée
visuellement dans un cadre qui préfigure déjà le dashboard (bordure fine, style de carte UI
autour de la zone de convergence) — pour que le lien SYSTEM→PRODUCT soit visible DANS l'image,
pas seulement en cut vers le panneau suivant.

**Pourquoi ce choix** : la convergence de 4 lignes reste une meilleure idée que "4 checkmarks
verts" (GPT) — montre la fusion, pas l'addition — mais l'ancrage produit corrige la faiblesse
"trop flottant dans l'abstrait" que Aziz reproche à la Direction B globalement.

**MEDIUM** : SVG maison (code existant + ajout d'un cadre UI léger autour de la zone de
convergence, changement mineur sur un composant déjà vivant).

**SEMANTIC TEST (cible)** : "Quatre pistes convergent en un point, à l'intérieur de ce qui
ressemble déjà à un écran de suivi." → Le système combine ses mesures dans un vrai outil, pas
dans le vide.

---

## P5 — Sarah, Toronto : la friction zéro (~32s → ~44s, ~12s)

**INFORMATION** : Cas nominal — Sarah existe, elle est réelle, et elle ne remarque rien. La
réussite de la sécurité est son invisibilité.

**REPRÉSENTATION** : Plan filmé (MiniMax H3) — Sarah à son bureau, plan large ou mi-plan, geste
naturel bref (elle tape, elle ouvre son laptop), PAS de gros plan visage prolongé (évite tout
risque d'expression figée ou de lip-sync inutile — elle n'a aucune ligne de dialogue). Pull-back
caméra (dans le plan H3 si le mouvement de caméra est crédible en une seule génération, sinon
raccord vers notre `LaptopMockup` existant côté Remotion) qui révèle son écran, où le dashboard
`DashboardScreen riskCase="low"` apparaît, ligne Sarah illuminée en vert, score 18.

**Pourquoi ce choix** : c'est le maillon HUMAN qui manquait entièrement dans la Direction B —
directement identifié par Aziz comme la vraie cause du problème ("ça manque de l'incarner").
Reprend la structure de pull-back déjà pensée en Direction A, mais avec un personnage réel
plutôt qu'une silhouette SVG.

**MEDIUM** : MiniMax H3 (image de référence Sarah — RÉUTILISER la même image que P1/P6 pour la
cohérence du personnage) + `LaptopMockup`/`DashboardScreen` existants (déjà data-driven, aucun
changement de code nécessaire sur cette brique). Overlay Remotion : annotations mono cyan
discrètes (`TORONTO` · `MACBOOK PRO` · `09:14`) pendant le plan filmé, avant l'entrée dans le
dashboard.

**SEMANTIC TEST (cible)** : "Une femme travaille tranquillement ; son écran affiche un tableau
de bord où sa ligne est verte, score 18, autorisée." → Produit réel, connexion saine, aucune
friction perçue par l'utilisatrice.

---

## P6 — Berlin : l'anomalie (~44s → ~59.5s, ~15.5s)

**INFORMATION** : Même personne, contexte incompatible — le contexte décide, pas l'identité.

**REPRÉSENTATION** : INCHANGÉ dans sa mécanique vs la v2 déjà codée (`P5DashboardMorphBosse.tsx`)
— cascade de champs avec transition floutée (pas de cut binaire), score qui grimpe visiblement
18→82, plan serré sur la ligne de vigilance avec bosse rouge tenue ~1.4s (corrige explicitement
le défaut "je n'ai même pas vu le pic"), retour dashboard, encart téléphone, curseur qui confirme.
Seul ajout : un bref plan MiniMax H3 (même référence Sarah) en ouverture du panneau — un contexte
visuel très court (elle est ailleurs, différent de son bureau habituel — pas besoin de "Berlin"
littéral, juste un cadre différent) avant de basculer sur le dashboard qui porte toute la tension.

**Pourquoi ce choix** : c'est la partie de notre travail qui fonctionnait déjà bien selon notre
propre vérification (mouvement continu, bosse enfin visible, curseur acteur) — on ne la jette
pas, on l'ancre juste avec un instant d'incarnation en ouverture pour rester cohérent avec P5.

**MEDIUM** : MiniMax H3 (plan bref, même référence Sarah) + `DashboardScreen`/SVG existants
(code déjà vivant, aucun changement nécessaire).

**SEMANTIC TEST (cible)** : "Même personne, ailleurs ; son score grimpe en rouge, une vérification
est demandée." → Contexte anormal détecté, réponse proportionnée, pas de panique.

---

## P7 — Signature (~59.5s → 63.34s)

**INFORMATION** : La promesse en une image — présente quand il le faut, effacée le reste du
temps.

**REPRÉSENTATION** : INCHANGÉ vs la v2 déjà codée (`P6Signature.tsx`) — bosse qui retombe en
échos propagés, ligne qui s'atténue sans jamais disparaître, wordmark révélé par une impulsion
qui parcourt la ligne. Jamais mis en cause par aucun retour — garder tel quel.

**MEDIUM** : SVG maison (code existant).

**SEMANTIC TEST** : "Une ligne de surveillance redevient calme et s'estompe pendant que le trafic
reprend normalement ; NorthShield." → Ce produit se fait oublier.

---

## Vérification anti-cliché (mise à jour)

| Interdit brief | Statut v3 |
|---|---|
| Hacker en hoodie | Absent |
| Code Matrix / pluie de 0 et 1 | **Absent — corrigé** (le flux de traits P1 de la Direction B est retiré, remplacé par la scène humaine) |
| Cadenas géant | Absent |
| Bouclier qui bloque | Absent |
| Piège "NorthShield / se manifeste" → bouclier 3D | Désamorcé en P7 (ligne qui s'atténue, pas un bouclier) |
| "Expliquer VISUELLEMENT, pas juste montrer l'UI en continu" (brief) | Amélioré vs storyboard GPT (qui sur-affichait l'UI) — P1/P2/P3 restent visuellement conceptuels, l'UI n'entre qu'à partir de P4/P5 |

## Ce qui reste à trancher AVANT de coder la v3 (prochaine session)

1. **Image de référence Sarah** : à générer (Gemini ou Recraft, registre 2D flat cohérent avec
   notre identité — PAS photoréaliste) avant tout appel MiniMax H3. Une seule image, réutilisée
   sur les 3 plans (P1 arrière-plan, P5, P6).
2. **Faisabilité du pull-back en un seul plan H3 (P5)** : à tester — si le mouvement de caméra
   n'est pas crédible en une seule génération, prévoir un raccord (cut ou whip-pan) vers notre
   `LaptopMockup` React existant plutôt que de forcer un mouvement que H3 ne rend pas bien.
3. **Durée exacte des plans H3** : MiniMax H3 coûte ~$1.30/5s en 2K — les 3 plans (P1, P5, P6)
   doivent être calibrés en durée avant génération pour ne pas payer des segments inutilisés
   (règle projet : prévisualiser coût AVANT tout appel payant).
4. **Timings précis** : les bornes de panneaux ci-dessus sont approximatives (calées sur le
   sens du script, pas encore sur l'alignment audio mot-par-mot comme les storyboards
   précédents) — à recalculer précisément depuis `narration.alignment.json` avant le storyboard
   final chiffré.

## Code v2 conservé comme référence (ne pas supprimer)

`src/projects/_client-sim/noteshield/direction-b/` — composants P2, P3, P6 (Signature)
réutilisables tels quels dans la v3. P1, P4, P5 seront remplacés par les nouveaux plans H3 mais
le code SVG/React qui les accompagne (`DashboardScreen`, `LaptopMockup`, cascade de données,
bosse de vigilance) reste la bonne base technique — voir cette section du fichier avant de
recoder quoi que ce soit à la prochaine session.
