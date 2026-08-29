# CORPUS DE REFERENCE — 22 animations d'un studio qui en vit (mesure 2026-08-28)

> Reponse a « QUOI mettre au portfolio ». Source : **kamotionstudio.site** (studio Lottie/UI SaaS,
> devis sur demande, cite comme niveau-cible dans `RECHERCHE-MARCHE-INDEX.md`).
> ⛔ **LottieFiles /hire est inaccessible** (403 Cloudflare, firecrawl ET playwright headless) —
> le corpus a ete pris chez le studio lui-meme, ou les 22 animations sont servies en clair.
> Fichiers + planches : `out/_r-and-d/corpus-kamotion/` (3,2 Mo).
> Methode : telechargement des 22 `.lottie`/`.json` reellement charges par la page, analyse
> structurelle, **et rendu de 5 frames chacune** (planche regardee, pas seulement mesuree).

---

## ⭐⭐⭐ LES 4 MESURES QUI TRANCHENT

### 1. Le TEXTE NATIF n'existe pas dans le livrable pro — **0 sur 848 calques**
| | compte |
|---|---|
| calques texte natif (`ty:5`) | **0** |
| textes **vectorises** (`* Outlines`) | **66** |
| polices declarees (`fonts.list`) | **0** |

⭐ **Ce que ca regle** : `CE-QUI-PASSE-EN-LOTTIE.md` presentait les deux voies texte comme un
arbitrage ouvert (« choix d'EDITABILITE »). Le marche a **deja tranche** : un studio qui vend
livre **exclusivement du vectorise**, exactement ce que notre chaine fait **par defaut**.
⛔ Notre `--texte natif` est une option de confort, **pas** un attendu client. Ne pas investir
dessus. Le risque mesure (5,74 % d'ecart sans la police, PIRE que ne rien porter) n'est pas un
risque a gerer : c'est une voie que le metier n'emprunte pas.

### 2. Les calques sont NOMMES — **86 %** (118 generiques sur 848)
Noms reels : `Snout Stroke R`, `Cash Button`, `Giftcard Button`, `Shiny Coin`, `L-strap-w`,
`Breath/move control`, `Neck Control`. Ce sont des noms de **fonction**, pas de forme.
⭐ **Confirme notre lecture** (`CE-QUI-PASSE-EN-LOTTIE.md` § Structure) et **chiffre la barre** :
86 % nommes. Nos pictos neon sortent deja a ce niveau (`upper-fold`, `magnified-eye`) ;
un export Recraft brut (`path-248`) est **hors marche**, pas juste « moins propre ».
⚠️ 2 pieces sur 22 sont a **0 %** (06, 15) : meme un studio paye livre parfois sans nommage.
La barre est haute, elle n'est pas absolue.

### 3. La grammaire d'animation est ETROITE — et on la couvre entierement
Sur les 22 pieces : `trim paths` **0** · `repeater` **0** · `gradient` **~40** · `matte` **~90**
· `mask` **3** · `expressions` **0**.
⭐ Tout se joue sur **position / echelle / rotation / opacite + parentage + precomps**. C'est
exactement notre `animate_scene.py`. ⛔ Le seul vrai manque cote conversion reste le **matte**
(`tt`), tres present ici — et refuse par notre chaine.
**→ C'est LE trou a combler en priorite, avant tout autre portage.**

### 4. Le format reel : **court, carre, 60 fps**
Duree **mediane 3,9 s** (min 0,75 · max 16,9). **19 pieces sur 22 en 60 fps.**
Dimensions : carre dominant (600² a 2000²), 3 exceptions au format ecran.
⛔ Nos 1920×1080 sont l'exception, pas la norme — coherent avec « Creator ouvre en 512×512 ».
⭐ Poids median **17 Ko**. Le plus lourd (359 Ko) est le seul avec **25 images raster**.

---

## ⭐⭐ LA TROUVAILLE : le point 5 « non teste » est du LIVRE en production

`13_Hiker_Walking_Theme_Cycle.lottie` contient, dans UN fichier :
- **1 animation** (marche cyclique, 48 frames, marker `Walk Loop`)
- **5 themes de couleur** (`.lottie/t/*.json` : regles `{id, type:Color, value}`)
- **1 state machine** (`s/StateMachine3.json` : 5 etats, `SetTheme` a l'entree, transitions sur
  evenement `cycleComplete`)
- des **slots** dans l'animation (`dark_jeans`, `shirt`, `backpack`…) = les points d'ancrage que
  les themes viennent repeindre

⭐ **Ce que ca prouve** : `CE-QUI-PASSE-EN-LOTTIE.md` point 5 listait les state machines comme
« NON TESTE, enjeu reel ». Ce n'est plus une hypothese — **c'est un livrable courant**, et le
mecanisme est entierement lisible dans le fichier (generateur : `@dotlottie/dotlottie-js@1.6.3`).
⭐⭐ **La consequence commerciale** : un theme = **repeindre sans re-animer**. Un client SaaS qui a
un mode clair/sombre, ou 3 marques, achete UNE animation et la decline. C'est un argument de
vente concret, et c'est du **fichier**, pas du code — donc ca survit chez le client.

---

## 🎯 CE QU'IL FAUT METTRE AU PORTFOLIO (registre observe, pas suppose)

| Registre | pieces /22 | exemples reels |
|---|---|---|
| **Mascotte / personnage boucle** | 9 | chat, chien, cochon, randonneuse, dindon, exercice |
| **Logo anime de marque** | 6 | **Disney+**, **Goodwin**, **Brij**, **VibeUp**, Photo Finale |
| **⭐ Flux d'INTERFACE** | 3 | **12** onboarding app (2 ecrans enchaines) · **22** « Redeem All » (coins → carte cadeau → REDEEMED) · **11** dashboard graphiques |
| Icone / objet UI | 4 | dossier de documents, tirelire |

⛔ **Le constat qui derange** : le registre n°1 en volume est la **mascotte** — pas l'UI.
⭐ Mais c'est le registre que le marche paie le MOINS cher (`RECHERCHE-MARCHE-INDEX` verdict 2 :
les personnages sont au MILIEU du U, l'UI en HAUT), et c'est **notre** faiblesse connue
(l'organique). **Ne pas se laisser entrainer** : on vise les 3 pieces d'interface, qui sont
exactement le creneau `ui-animation` etroit et cher.
⛔ Et : **zero carte geographique** sur 22 pieces. Confirme le recadrage d'Aziz.

⭐ **Les marques citables sont dans les LOGOS** (Disney+, Goodwin, Brij). C'est le levier
« MARQUES CITABLES » du dossier marche — mais il suppose des clients, donc pas mobilisable
maintenant.

---

## ⛔ LES 2 PIECES A REPRODUIRE (choix argumente)

1. **`22` Redeem All** (800×854, 5,85 s) — flux UI complet : un curseur clique un bouton, des
   pieces tombent, un choix apparait (Giftcard / Cash), validation « REDEEMED! ». **6 precomps
   nommes par fonction**, animation 100 % position/echelle/opacite + **1 matte**.
   → dans nos cordes, registre qui vaut, et le matte est justement notre trou.
2. **`12` onboarding app** (2000×4369, 4,58 s) — 2 ecrans qui s'enchainent, **26 precomps**,
   40 textes vectorises, **0 matte 0 gradient**. Le plus proche d'une commande SaaS reelle.

Methode REPRO-FOSTER : refaire de bout en bout, puis **mesurer l'ecart** avec
`verifier_fidelite.py` (refus sur la PIRE frame + amplitude). ⛔ Pas juger a l'oeil seul.

---

## ⛔⛔ CORRECTION D'UNE CONCLUSION DU 2026-08-28 (meme journee, autre session)

`repro-vendeur-lottie/STATUS.md` a mesure que la scene d'exemple fournie par **Creator** etait
faite de **14 images bitmap** (`ty:2`, PNG base64), et en a tire : *« bitmap-dans-Lottie est un
usage courant, y compris chez eux — donc notre vectoriel est un argument de vente reel »*.

**La 1re moitie ne tient pas.** Mesure sur 22 pieces d'un studio qui VEND :

| | calques |
|---|---|
| vectoriels (`ty:4`) | **618** |
| images (`ty:2`) | **28** |
| | **96 % VECTORIEL** |

18 pieces sur 22 sont **100 % vectorielles**. Une seule est bitmap (`19`, 25 PNG — et c'est la
plus lourde du corpus : **359 Ko** contre 17 Ko de mediane). Deux sont mixtes (1-2 images).

⭐ **La conclusion juste** : le bitmap-dans-Lottie n'est PAS l'usage du metier, c'est ce que
produit **l'exemple d'un OUTIL**. Un studio paye livre du vectoriel.
⭐ **Ce que ca change pour nous** : notre sortie vectorielle n'est pas un *avantage* sur le
marche — c'est le **standard d'entree**. Elle cesse d'etre un argument de vente pour devenir
un pre-requis. ⛔ Ne pas batir un argumentaire dessus ; c'est la barre, pas le sommet.
⚠️ La prudence de la note d'origine (« ne PAS en conclure qu'on fait mieux qu'eux en general »)
etait la bonne intuition — cette mesure la confirme et la durcit.

⭐ **Meme famille que la lecon LottieFiles Hire** : une page d'ELIGIBILITE ne dit pas qui est
RETENU, et un fichier d'EXEMPLE ne dit pas ce que le metier LIVRE. Dans les deux cas il a fallu
aller regarder la production reelle.
