# TEST CLIENT-SIM — LOTTIE UI (menu LCD embarqué)

> Session du 2026-08-24. **Statut : pipeline PROUVÉ, validé dans l'outil officiel du client.**
> Prochaine étape identifiée : passer des composants simples aux SCÈNES COMPLEXES.
> Méthode de candidature : `memory/fiches/FICHE-BRIEF-CLIENT.md` (auto-injectée).

---

## 1. CE QUI EST PROUVÉ (mesuré, pas supposé)

**On peut produire du Lottie standard depuis notre workflow SVG habituel, sans After Effects.**

Chaîne validée : **image → Fable (SVG structuré) → notre script → `.json` Lottie**.

| Vérification | Résultat |
|---|---|
| Moteur mobile `rlottie` | ✅ charge et joue |
| Moteur navigateur `lottie-web` | ✅ 11 groupes, 8 tracés, dégradé + couleurs OK |
| **LottieFiles Preview** (officiel) | ✅ 5,91 Ko · 30 fps · 360×72 · 24 frames · **3 layers** · 800 ms |
| **LottieFiles Creator** (officiel) | ✅ calques nommés visibles, dépliables, **éléments déplaçables un par un** |
| Poids compressé `.lottie` | **1 382 octets** — la référence du client fait 1 400 |

⭐ **Le test décisif** : dans Creator, Aziz a sélectionné le chevron seul et l'a déplacé
indépendamment du bandeau. C'est exactement ce que le brief exigeait
(« developers can control them independently »).

⚠️ Piège d'affichage rencontré : à l'import, Creator enveloppe l'animation dans un
`[Precomp Layer ...]` et le panneau ne montre qu'UNE ligne. **Les calques sont derrière
l'onglet du même nom, en bas à côté de « Main Scene »** — cliquer dessus. Rien n'est aplati.

---

## 2. LES LIVRABLES SUR DISQUE

Code et sorties : `src/projects/_client-sim/lottie-ui/`
- `svg/start_button.svg` — le dessin produit par Fable (statique, ids imposés)
- `out/start_button_v2.json` · `out/start_button.lottie` — l'animation
- `tools/animate_start.py` — SVG structuré → Lottie (le convertisseur retenu)
- `tools/svg2lottie.py` — 1re version, prototype de tuyauterie (garde l'historique)

Matière client : `memory/client-sim-tests/lottie-ui-lcd/lcd.jpg` + `start_ref.png`

⚠️ Le GIF d'aperçu n'a pas été rapatrié (217 Ko, régénérable en 1 commande).

---

## 3. ⛔ LES 3 LIMITES CONNUES — à dire au client, jamais à cacher

1. **Le convertisseur ne gère que les segments DROITS** (`M/L/H/V/Z`).
   Une courbe (cadran rond, jauge circulaire, forme organique) le fait échouer —
   **bruyamment, par choix**, jamais en silence. C'est LE chantier n°1.
2. **Pas de fichier source After Effects.** AE *exporte* vers Lottie, il ne l'*importe* pas.
   Nos sources = le SVG + le code. Défendable (« changer une couleur est un paramètre »),
   mais c'est un vrai motif de rejet si le client exige un `.aep`.
3. **Pas de personnages articulés.** Ce n'est pas une limite de format (Lottie sait faire
   des courbes) — c'est un métier différent (rigging, pivots, dessins par angle).

---

## 4. ⭐ LA PROCHAINE SESSION — objectif d'Aziz

**« Traduire des SCÈNES COMPLEXES, pas seulement des composants. »**
Cible nommée : nos **scènes narratives** SVG, découpées en calques.

### Ordre proposé (du moins cher au plus cher)

**Étape 1 — Les courbes (bloquant, ~2-4 h).**
Étendre `animate_start.py` aux commandes `C`/`S`/`Q`/`T`/`A`. Lottie stocke les tangentes
dans `i`/`o` de chaque point : la conversion Bézier existe, elle est mécanique.
⭐ **Test de sortie** : reprendre `soleil-radiant-ggw.svg` — ses cercles passent déjà,
mais prendre un asset à vraies courbes de `svg-library/elements/` (ex. `cabosse-ouverte`,
`poisson-encre`) et vérifier le rendu contre le SVG d'origine.

**Étape 2 — Une scène réelle, mesurée.**
Prendre UNE scène narrative existante et la convertir. Questions à trancher **par la mesure**,
pas par l'intuition :
- Combien pèse le `.lottie` ? (au-delà de ~100 Ko, l'argument « léger » tombe)
- Les calques restent-ils nommés et dépliables dans Creator ?
- Qu'est-ce qui NE passe PAS ? (filtres, masques, images raster, dégradés radiaux)
⛔ **Ne pas conclure sur un seul cas** — 2 scènes de registres différents minimum.

**Étape 3 — Ce qu'on ne peut PAS transporter (livrable de la session).**
Écrire la liste ferme : ce que Lottie accepte de notre stack, ce qu'il refuse.
C'est ce qui permet de dire OUI ou NON à un brief en 30 secondes.

### ⛔ Ce qu'il ne faut PAS faire la prochaine session
- Bâtir un convertisseur générique « pour tous les cas » sans client en face.
  (Pattern déjà payé : construire d'abord, chercher l'usage ensuite.)
- Se remettre à produire des pièces de portfolio avant d'avoir tranché l'étape 1.

---

## 5. LE BRIEF QUI A SERVI DE CAS D'ÉTUDE (non candidaté)

Upwork, publié 2026-08-23 : « Lottie Animations for a Hardware LCD Menu — Mostly Icons ».
4 écrans (Lightning/Sound/Timelapse/Laser), composants séparés, `.json`/`.lottie` + sources.

**Tri client (méthode de la fiche)** : 1 900 $ dépensés / 19 embauches = **100 $ par embauche**,
et le budget affiché est **100 $**. Le client paie toujours pareil → aucune négociation possible.
Par ailleurs sérieux : 4,9/5 sur 16 avis, 100 % de taux d'embauche, entreprise 10-99 personnes,
Turquie. Au moment de la lecture : 1 embauche faite, 2 entretiens en cours.

**Décision : pas de candidature.** La pièce a été produite pour le portfolio, pas pour lui —
c'est de l'UI générique, elle ne périme pas.

⭐ **Acquis de méthode** : ne JAMAIS renvoyer au client sa propre référence comme preuve
(correction d'Aziz, juste). L'exemple LottieFiles qu'il cite est gratuit et public — le
renvoyer ne prouve rien. **Animer SON élément à lui** prouve qu'on a lu son écran.

---

## 6. CE QUE LA SESSION A COÛTÉ ET RAPPORTÉ

**2 bugs attrapés par le VISUEL, invisibles à la lecture du code** (règle CODE + VISUEL, encore) :
- rotation posée à CÔTÉ des formes au lieu de les ENVELOPPER → le groupe ne tournait pas,
  alors que le JSON était valide et se chargeait sans erreur.
- chevron de Fable trop petit → corrigé après mesure pixel de la maquette (l'icône occupe
  ~70 % de la hauteur et déborde à droite).

**1 faille de sécurité signalée par le hook** : parseur XML stdlib vulnérable (XXE / billion
laughs) sur des SVG qui viendront de clients. Corrigé : `defusedxml` si présent, sinon parseur
qui refuse toute déclaration d'entité.

**Ce que le workflow maison a apporté** : la 1re version (bricolée sans Fable) avait des
rectangles à la place des lettres. La 2e (Fable → SVG structuré → animation) a les vrais
tracés, la cascade lettre par lettre, et un SVG **remplaçable** — si le client envoie son
Figma, on remplace le fichier et on relance.
