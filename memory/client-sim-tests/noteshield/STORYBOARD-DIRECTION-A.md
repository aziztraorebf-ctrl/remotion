# DIRECTION A — Narrative/Human
## NorthShield — storyboard 6 panneaux · 16:9 1920×1080 · 63.34s

> Généré par agent Opus (isolé, sans connaissance de Direction B), 2026-08-06.
> Script verrouillé + timings extraits de l'alignment audio réel (pas estimés).

### La métaphore centrale : **LE COULOIR ET LA PORTE**

Sarah ne vit pas la cybersécurité comme un combat. Elle la vit comme **un trajet quotidien** : elle arrive, elle passe, elle travaille. La sécurité, pour elle, c'est une question binaire et physique : **est-ce que ça s'ouvre, ou est-ce que ça me retient ?**

Donc la sécurité est filmée comme **une architecture de passage** : un couloir sobre, et au bout, un seuil de lumière. Pas une porte dessinée avec une poignée — **une ligne de lumière verticale au sol et au mur**, qui s'écarte ou se referme. C'est le langage du capteur d'aéroport ou du sas de bureau moderne : lu instantanément, et absent du vocabulaire cliché de la cybersécurité.

Pourquoi cette métaphore :
- Contient les trois émotions du brief dans une seule forme : friction (couloir encombré de barrières), soulagement (seuil qui s'efface avant même qu'on l'atteigne), tension (seuil qui se referme et tient).
- Échappe au piège "NorthShield/se manifeste" : ce qui se manifeste ici, c'est une absence qui redevient présence — l'inverse d'un objet ajouté.
- Déjà dans le script : "La porte s'ouvre" — exécute une image que le client a écrite sans la voir.
- Se marie nativement au produit : couloir = ce que Sarah vit, dashboard = ce que l'IT voit. Deux faces, un fait.

Personnage en **silhouette stylisée géométrique** (pas de visage réaliste, pas de stick figure enfantin).

Palette verrouillée (celle du mockup) : fond `#0A1628`, structure `#0F1F38`, blanc cassé `#F4F1EA`, accent cyan `#00D9FF`. Vert `#10B981` / rouge `#F43F5E` viennent UNIQUEMENT du produit, jamais de la scène.

---

## PANNEAU 1 — "Toutes les connexions de la même manière"
**0.0 → 10.9s**

**INFORMATION** : Le statu quo est absurde — le système n'a que deux réglages, et les deux sont mauvais. Ressenti = l'usure, pas la menace.

**REPRÉSENTATION** : Couloir en perspective, lignes fines cyan sur fond marine. Cinq silhouettes identiques avancent en file. À 3.76s ("ralentit tout le monde") : des barrières tombent en travers, une tous les deux mètres, draw-on rapide. Cadence saccadée, mécanique. Compteur mono en haut à droite : `+1 vérification` à chaque arrêt jusqu'à `+47 vérifications aujourd'hui`. À 8.08s ("croise les doigts") : coupe sèche, toutes les barrières disparaissent, couloir vide, silhouettes filent sans ralentir — y compris une silhouette en pointillés (n'aurait pas dû passer) qui traverse sans réaction.

Pourquoi : le même couloir filmé deux fois (pas de split-screen/balance-cliché) montre que c'est le même système mal réglé, pas deux mondes. La silhouette pointillée fait passer "le risque" sans montrer d'attaquant.

**MEDIUM** : SVG animé (Remotion). Couloir en stroke-dasharray draw-on, silhouettes en paths pleins, barrières en spring().

**SEMANTIC TEST** : "Des gens font la queue à des barrières inutiles… puis plus rien ne les arrête." → Le contrôle est mal calibré dans les deux sens.

---

## PANNEAU 2 — "La sécurité a enfin le discernement"
**10.9 → 15.2s**

**INFORMATION** : Bascule — pas *plus* de sécurité, une sécurité qui *regarde* avant de décider.

**REPRÉSENTATION** : Couloir vide, caméra pivote lentement vers le seuil au bout. Barrières disparues, remplacées par une seule ligne de lumière cyan au sol, fine. Sur "discernement" (13.02s) : la ligne respire une fois (pulsation douce). Titre `NorthShield` apparaît en typo géométrique, petit, aligné à gauche.

Pourquoi : remplacer 47 barrières par une seule ligne dit "moins, mais intelligent" visuellement — la sobriété EST le message. Un œil aurait connoté la surveillance (mauvais pour le ton haut de gamme non-alarmiste).

**MEDIUM** : SVG animé + typographie. Transition par mouvement caméra sur `<g transform>`.

**SEMANTIC TEST** : "Tous les obstacles remplacés par une ligne lumineuse." → Passage de beaucoup de contrôles bêtes à un seul contrôle intelligent.

---

## PANNEAU 3 — "Quatre signaux vitaux, une décision instantanée"
**15.2 → 28.7s** (13.5s, le plus long)

**INFORMATION** : Le mécanisme — 4 signaux simultanés fondus en une seule décision. Simultané, pas séquentiel.

**REPRÉSENTATION** : Zoom sur le seuil, la ligne devient le centre du cadre. Quatre traits convergent depuis les bords, étiquetés `APPAREIL` · `LIEU` · `HISTORIQUE` · `COMPORTEMENT`. Présents dès 18.6s, gagnent en intensité sur les mots (19.26/20.46/21.08/22.20s) — lecture cumulative, pas séquentielle. Chaque signal = une forme d'onde propre (créneau régulier / arc / points rythmés / courbe organique irrégulière). Sur "Quatre signaux vitaux" (23.66s) : les 4 ondes se superposent en un seul tracé façon moniteur cardiaque. Sur "décision instantanée" (26.42s) : le tracé composite s'effondre en un point qui pulse, flash cyan bref (3 frames).

Pourquoi : 4 icônes en 4 cartes (réflexe feature grid) sont statiques et additives — disent "4 choses". Des ondes qui fusionnent disent "4 choses qui deviennent 1 jugement".

**MEDIUM** : SVG animé pur (paths + stroke-dasharray, composition d'ondes calculée). Panneau le plus abstrait, encadré des deux côtés par du concret (règle CONCRET→ABSTRAIT→CONCRET).

**SEMANTIC TEST** : "Quatre mesures se rejoignent en un seul point." → Le système combine plusieurs indices en une seule décision.

---

## PANNEAU 4 — Sarah, Toronto : la friction zéro
**28.7 → 40.9s** — entrée du PRODUIT

**INFORMATION** : Cas nominal — le point crucial est qu'elle ne remarque rien. La sécurité réussie est invisible.

**REPRÉSENTATION** : Retour au couloir, une seule silhouette (Sarah, tracée nettement), avance vers le seuil. Sur "Même bureau, Toronto, même ordinateur" (30.58→33.84s) : annotations mono cyan défilent à hauteur de mollet le long du trajet — `TORONTO` · `MACBOOK PRO` · `09:14`. Sur "Risque minime" (34.68s) : point de décision du P3 réapparaît en miniature, affiche `18` en vert. Sur "La porte s'ouvre" (36.64s) : la ligne au sol s'écarte en deux et s'efface latéralement (ne se lève pas, ne pivote pas — cède le passage). Sarah traverse sans ralentir d'un seul pas — cadence rigoureusement identique avant/après.

**Sur 38.14→39.22s ("elle ne s'en rend même pas compte") — LE MOCKUP ENTRE** : la caméra recule, révèle que le couloir est affiché dans l'écran du laptop NorthShield (`laptop-low-risk-big.png`), ligne `09:14 · Sarah M. · MacBook Pro · Toronto, CA · 18 · Autorisé` surlignée cyan. Pull Back Reveal : la scène vécue devient une ligne de tableau vue par l'IT.

Pourquoi : le pull-back (pas une coupe) crée le sens — "ce que tu viens de ressentir, c'est cette ligne-là". Chaîne HUMAN → PRODUCT directe.

**MEDIUM** : SVG animé (couloir + Sarah) + UI produit réelle (mockup laptop, insertion zone x=515 y=140 w=940 h=588). Pull-back via `<g transform>` scale/translate.

**SEMANTIC TEST** : "Une femme marche, une lumière s'ouvre sans qu'elle s'arrête, on découvre une ligne verte dans un tableau de bord." → Passage autorisé sans friction, tracé côté admin.

---

## PANNEAU 5 — Berlin : l'anomalie
**40.9 → 56.5s** — le pic de tension

**INFORMATION** : Même compte, contexte incompatible. NorthShield voit et retient — pas une attaque repoussée, une question posée.

**REPRÉSENTATION** : Reste dans le dashboard. Sur "Trois heures plus tard" (40.98s) : l'horloge passe `09:14 → 12:47`, rien d'autre ne bouge. Sur "même compte, appareil inconnu, Berlin" (42.82→47.10s) : la ligne se réécrit champ par champ sur les mots exacts — `MacBook Pro → Appareil inconnu` (44.32s), `Toronto, CA → Berlin, DE` (46.60s). `Sarah M.` reste identique et immobile — ce qui ne change pas rend le reste inquiétant.

Sur "NorthShield le voit" (48.80s) : retour dans le couloir, plongée dedans. Silhouette en pointillés (la même qu'au P1) avance — rappel structurel : cette fois elle ne passera pas. Sur "Anomalie critique" (50.48s) : les 4 ondes du P3 réapparaissent, 3 plates et calmes, 1 violemment désaccordée. Compteur monte 18→82, bascule rouge `#F43F5E`. Sur "vérification exigée, immédiatement" (52.30→54.16s) : la ligne au sol ne s'écarte pas — elle se dresse en mur de lumière et tient. Silhouette s'arrête net. Texte central : `VÉRIFICATION REQUISE`. Retour bref dashboard (`laptop-high-risk-big.png`), ligne rouge.

Pourquoi : le seuil qui refuse de s'écarter est l'inverse d'un blocage agressif — même forme qu'au P4, jouée à l'inverse. Compréhension par symétrie, pas escalade — préserve le ton non-alarmiste. Rouge apparaît une seule fois dans toute la vidéo.

**MEDIUM** : UI produit (`laptop-high-risk-big.png`) + SVG animé (couloir, ondes, seuil). Aller-retour produit → scène → produit.

**SEMANTIC TEST** : "Même personne, appareil et ville changés, score à 82 en rouge, la lumière lui barre le passage." → Contexte anormal détecté, passage suspendu, vérification demandée.

---

## PANNEAU 6 — Signature
**56.5 → 63.34s**

**INFORMATION** : La promesse en une image — présente quand il le faut, effacée le reste du temps.

**REPRÉSENTATION** : Fond marine plein, la ligne de lumière seule au centre. Logotype `NorthShield` apparaît sur 56.52s. Sur "se manifeste quand il le faut" (59.14s) : la ligne s'intensifie brièvement, légère lueur. Sur "et s'efface le reste du temps" (61.56s) : redescend en opacité très basse — reste à 15% jusqu'au dernier frame, ne disparaît jamais totalement. Logotype net.

Pourquoi : terminer sur une atténuation plutôt qu'une apparition est plus élégant et littéralement la thèse du produit. Un logo qui s'assemble dirait "regardez-nous" ; une ligne qui s'estompe dit "vous nous oublierez, c'est le but".

**MEDIUM** : Typographie + SVG minimal.

**SEMANTIC TEST** : "NorthShield, une ligne de lumière qui s'allume puis se met en veille sans s'éteindre." → Protection discrète, toujours là, qui ne se montre que si nécessaire.

---

## Vérification anti-cliché

| Interdit | Statut |
|---|---|
| Hacker en hoodie | Absent — le risque est une silhouette en pointillés |
| Code Matrix | Absent |
| Cadenas géant | Absent |
| Bouclier qui bloque | Absent — le refus est un seuil qui ne s'écarte pas |
| Pluie de 0 et 1 | Absent |
| Piège "NorthShield / se manifeste" | Désamorcé — manifestation = intensification de lumière, fin sur atténuation |

## Chaîne HUMAN → SYSTEM → PRODUCT → conséquence
P1 (file d'attente) → P4 (Sarah) = HUMAN · P3 (4 ondes) = SYSTEM · P4/P5 (mockups, pull-back) = PRODUCT · P4/P5 (passe sans le savoir / arrêtée et vérifiée) = conséquence.

## Points de décision de goût (non tranchés par l'agent)

1. **La silhouette en pointillés du P1 qui revient au P5** : fil narratif le plus fort, mais implique que Berlin = quelqu'un d'autre sur le compte de Sarah — le script ne le dit jamais explicitement. À atténuer si tu préfères rester strictement neutre.
2. **Le pull-back du P4** : pari central sur l'intégration produit. Alternative plus sûre = coupe franche vers le dashboard, moins élégante mais plus lisible sur un client qui regarde vite.
