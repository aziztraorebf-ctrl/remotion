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
2. **Pas de fichier source After Effects — ⚠️ À RE-TESTER, l'affirmation était FAUSSE.**
   J'ai affirmé qu'AE n'importait pas le Lottie : **c'est faux** (correction d'Aziz, 08-24).
   **Bodymovin** (écrit par le créateur du format) et **LottieFiles for AE** font l'import —
   *« import your Lottie animations into your After Effects project for further editing »*.
   ⚠️ Réserve de praticiens : l'import peut produire des calques encombrés de groupes/merge-paths
   parasites, et *« in some cases you have to rebuild it differently »*. Le texte n'est éditable
   qu'en polices standard. **Nos JSON sont plus simples que ceux générés par AE — favorable,
   mais non vérifié.** → test prioritaire, § 4 bis.
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

**Étape 2 — Une scène réelle : chercher LE POINT DE RUPTURE, pas la faisabilité.**
⭐ On ne teste pas « est-ce que ça marche » — on cherche **où ça casse**. 4 murs possibles :

| Mur | Question | Enjeu si on le heurte |
|---|---|---|
| **Courbes** | franchi à l'étape 1 ? | le seul qu'on sait franchir (Bézier = mécanique) |
| **Poids** | une scène pèse combien ? | au-delà de ~100 Ko l'argument « léger » s'effondre |
| **Structure** | 60 calques restent-ils nommés/dépliables dans Creator ? | c'est ce qui sépare un livrable pro d'un fichier illisible |
| **Non-transportable** | filtres, masques, dégradés radiaux, raster ? | ⭐ **la liste de ce qui NE passe pas EST le livrable de la session** |

Le 4e mur est le plus précieux : c'est lui qui permettra de dire **oui ou non à un brief en 30 s**.
⛔ **2 scènes de registres DIFFÉRENTS minimum** (une abstraite/data-viz, une narrative) — une seule
réussite ne prouve rien, deux font une méthode.
⭐ Le registre visé par Aziz : **animation vectorielle abstraite/éditoriale** — des scènes belles
sans personnages articulés. C'est un créneau réel et moins encombré que l'explainer à personnages.

**Étape 3 — Ce qu'on ne peut PAS transporter (livrable de la session).**
Écrire la liste ferme : ce que Lottie accepte de notre stack, ce qu'il refuse.
C'est ce qui permet de dire OUI ou NON à un brief en 30 secondes.

### ⭐ Étape 4 bis (INDÉPENDANTE) — le test After Effects, 7 jours gratuits

**Pourquoi** : si l'import fonctionne, l'objection « pas de source `.aep` » **tombe**, et on parle le
vocabulaire du marché au lieu de se battre contre lui (raisonnement d'Aziz, 08-24). C'est le même
principe que toute la session : **tester le maillon inconnu, pas construire autour d'une hypothèse.**

⚠️ **Essai = 7 jours, carte bancaire OBLIGATOIRE, compte à rebours dès l'installation.**
⛔ **Ne PAS installer avant d'avoir 2 h devant soi** — sinon on brûle des jours pour rien.
⛔ Annuler **avant** la fin (Compte Adobe → Gérer la formule → Annuler), **jamais le dernier jour**
(témoignages de facturation). Filet : remboursement intégral sous 14 jours.

**Le test, ~1-2 h** :
1. Installer AE + le plugin **Bodymovin** ou **LottieFiles for AE** (gratuits).
2. Importer `out/start_button_v2.json`. Vérifier : les 3 calques sont-ils **nommés** ? Les 5 lettres
   sont-elles séparées dedans ? Les keyframes sont-ils **éditables** ou est-ce un bloc figé ?
3. ⭐ **Le test qui décide** : enregistrer un `.aep`, le refermer, le rouvrir. Si ça tient →
   **on peut livrer un fichier source**, l'objection est levée.
4. Bonus si le temps le permet : aller-retour complet (JSON → AE → ré-export Lottie) et vérifier que
   le fichier ressortant joue toujours. Prouverait que le pont tient **dans les deux sens**.

**Décision qui en découle** : ça marche → l'abonnement mensuel (34,49 $/mois, sans engagement) devient
justifiable **quand un brief l'exige**, pas avant. Ça ne marche pas → on annule et on sait où est la
vraie limite, pour 0 $.

⛔ **Le glissement à surveiller** : utiliser AE comme **convertisseur de sortie** (importer, exporter,
fermer) est cohérent. En faire un outil de PRODUCTION ne l'est pas — ce serait entrer en concurrence
frontale avec des gens qui y ont dix ans d'avance, en abandonnant l'avantage du code.

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
⛔ **PRÉCISION (corrigée au wrap)** : ce durcissement vit dans `svg2lottie.py`, **le prototype
abandonné**. Le convertisseur RETENU, `animate_start.py`, ne parse pas de XML du tout — il lit
les `<path>` par regex (`re.finditer`). Donc **aucune surface XXE, mais aucune validation d'entrée
non plus**. Si on passe un jour à un vrai parseur (nécessaire pour les courbes et les masques),
**reporter le bloc `defusedxml`** — ne pas repartir de zéro.

**Ce que le workflow maison a apporté** : la 1re version (bricolée sans Fable) avait des
rectangles à la place des lettres. La 2e (Fable → SVG structuré → animation) a les vrais
tracés, la cascade lettre par lettre, et un SVG **remplaçable** — si le client envoie son
Figma, on remplace le fichier et on relance.
