# UI PRODUIT / ÉCRAN DE SAAS — fiche de déclenchement (lire AVANT de coder une scène d'interface)

> Se déclenche quand on simule un écran, un dashboard, une app, un site — **pilier B2B n°3 sur 5**.
> ⚠️ Un plan qui ressemble a une UI n'en est pas forcement une : cartouche, portrait, badge, lockup,
> carte + avatars = **pilier 4 (motion design React)**, briques deja presentes. Verifier avant de capturer.
> ⚠️ Si ce que tu lis ne correspond PAS au réel que tu as sous les yeux : **c'est la FICHE qui a tort**.
> Corrige-la immédiatement. Chemins vérifiés sur disque le 2026-08-20.

## ⛔ LA RÈGLE N°1 — NE PAS REDESSINER L'UI EN REACT

**Une UI de client se CAPTURE, elle ne se recode pas.** Vécu Flowdesk (2026-08-06) : 4 versions,
V1 « slideshow », V2 rejetée « vocabulaire abstrait illisible sans le son », V3 obligée de
reconstruire à la main un vocabulaire d'interface (icônes email/tableur, 5 destinations nommées).
Coût : plusieurs sessions. Le même sujet en pipeline capture = 1 session, zéro rejet de fond.

Corollaire (fiche `row-embed` de shotcraft) : une ligne qui s'anime est un **découpage de la plaque**
(`backgroundPosition` négatif sur la capture pleine page), JAMAIS un redessin — le rendu de police
d'un redessin diffère visiblement de celui de la plaque au sol.

## LE PIPELINE (prouvé 8 versions le 2026-08-19/20, 2 registres)

1. **Page servable** — `src/projects/_client-sim/<client>/live-page[-light]/index.html`.
   Vraie page HTML/CSS, données FICTIVES mais crédibles (⛔ jamais de vraies données client :
   « lorem ipsum ou base vide = prise fichue », dit leur propre script).
   Attributs `data-capture="row|nav|thead|search"` = les sélecteurs de capture.
2. **Servir** : `python3 -m http.server 8899 --directory <live-page>` (⛔ `--directory`, un `cd` ne
   persiste pas → 404).
3. **Capturer** : `scratchpad/shotcraft/cap/capture-northshield.mjs` (adapté de
   `assets/scripts/capture-template.mjs`). Produit : plaque pleine page **2x**, découpes par élément,
   plaque VIDE (`hideForEmptyPlate`), et **`live-layout.json` = les bbox réelles**.
   Un 2e état s'obtient par `interact:` (ex. filtrer la liste) → `<name>-after.png`.
4. **Animer** — `PageCam` + les recettes (voir § socle).

## ⛔⛔ LES 3 PIÈGES QUI ONT COÛTÉ UNE ITÉRATION CHACUN

1. **`live-layout.json` de l'état APRÈS interaction est FAUX** — il est relevé AVANT l'`interact`,
   donc il liste encore les 7 lignes alors que la page filtrée n'en a qu'une.
   → **MESURER sur la plaque** (scan du PNG), ne jamais déduire. Erreur commise 2× la même session :
   `FLAG_CY - 660` donnait 313, la vraie valeur mesurée était 642 → cadrage sur du vide.
2. **Ne JAMAIS changer de plaque pendant un mouvement de caméra** (full → filtered) : la caméra
   continue de se resserrer sur une zone qui vient de se vider. Le changement se fait **sur une coupe
   couverte par `FlashCut`**.
3. **`omitBackground: true` ne donne PAS de transparence** sur un élément qui a un fond CSS propre
   (vérifié : `flagged.png` sort opaque). Les découpes transparentes ne marchent que sur des éléments
   sans background.

## LE SOCLE IMPORTÉ — `src/projects/_client-sim/noteshield/live-page/shotcraft-lib/`

Composants de **video-shotcraft** (Apache-2.0, réutilisation commerciale OK, attribution requise),
copiés TELS QUELS. README d'attribution dans le dossier.

| Fichier | Rôle |
|---|---|
| `PageCam.tsx` ⭐ | Caméra 2.5D par keyframes `{frame, cx, cy, zoom, rotX, rotY, rotZ, persp}` + DOF. Le socle de tout plan « vraie page ». |
| `FlashCut.tsx` | Flash blanc chaud à cheval sur une coupe. Usage : `from = coupe - 5`, durée 10. |
| `DigitRoll.tsx` · `PaperTitleCard.tsx` | Compteur qui roule · carton-respiration (⚠️ calibré papier/ambre, à forker pour un registre sombre). |

⭐⭐ **LE GOTCHA QUI CHANGE TOUT (leur commentaire, vérifié)** : en mode 3D `PageCam` agrandit via la
propriété CSS **`zoom`**, PAS `transform: scale`. Avec `scale`, Chromium rastérise la couche à la
taille de layout 1920 **puis** agrandit en GPU → le texte est flouté avant d'être grossi. Avec `zoom`,
la boîte de layout grandit → texte net sous perspective. C'est la raison technique pour laquelle
leurs plans serrés sont nets et pas une réimplémentation maison.

## LE MONTAGE — leur `promo-energy-arc` (= leur mix-and-match)

| Segment | Part | Énergie | Cartes |
|---|---|---|---|
| ① Ouverture marque | 8-12 % | basse | `brand-ink-open` |
| ② Le héros | 12-15 % | moyenne | la page se pose |
| ③ Montée | **55-65 %** | moyenne⇄basse | `row-embed` · `type-and-filter` · `list-stack-press` |
| ④ Final | 13-16 % | **pic** | `outro-group-photo-launch` |

Règles dures de leurs fiches : **hold ≥ 1 s** après la pose d'un lockup (« sous 1 s = à refaire ») ·
frappe **3f/caractère** (valeur figée après un retour « trop rapide ») · **respiration de ~11f** entre
fin de frappe et filtrage (sinon lecture « machine ») · sortie des lignes décalée ≥ 0,4f (sinon « la
page plante ») · une technique ne peut être vedette qu'**une seule fois**.

## LE CURSEUR (fiche `camera/cursor-flyover`)

⭐ **La caméra et le curseur sont UN SEUL SYSTÈME** — même table de keyframes, donc ils arrivent
toujours ensemble. `scale(1/zoom)` sur le curseur, sinon il devient énorme en gros plan et on perd
l'illusion qu'il appartient à la couche UI. Clic = **2 anneaux concentriques décalés de 3f** (un seul
est trop discret).

## LE SON

SFX repris de leur banque (149 fichiers, 16 catégories) → `public/_client-sim/noteshield/sfx/`.
⛔⛔ **PAS de whoosh sur les coupes d'UI** (retiré 2026-08-20, retour Aziz) : `whoosh-fast.mp3` est un
sifflement d'AIR, un vocabulaire de mouvement physique sans rapport avec un logiciel — sur 5 coupes il
devenait le son le plus présent du film. **Le FlashCut visuel suffit.**
Musique : leurs 5 BGM sont gratuites (Apache-2.0) — **tester le gratuit AVANT de générer** (réflexe
d'Aziz, 2026-08-20). Choisir le segment sur **mesure du profil d'énergie**
(`ffmpeg -ss T -t 20 -i X -af volumedetect`), pas au hasard : pour `bgm-tech-house`, 156→182 s est la
seule portion qui monte sur 26 s d'affilée, ce qui épouse l'arc. Volume musique **0,13**, SFX **0,50**.

## CE QUI EST AGNOSTIQUE (prouvé 2026-08-20)

Le même film a été produit en **registre sombre ET en light mode SaaS** sans changer un seul
composant — seules la capture source et la palette varient. C'est ce qui permet de promettre à un
client que **le pipeline s'adapte à SON design**. Compositions de référence :
`NorthShieldPromoV4` (sombre) · `NorthShieldPromoLight` (clair).
⚠️ `PageCam` a un fond papier `#faf7f2` par défaut — visible sur un blanc franc, 1 ligne à changer.

## ⛔ CE QUE CE PILIER NE FAIT PAS

Pas de personnages, pas de visages, pas d'organique. Ce n'est pas une limite à cacher : les meilleurs
explainers SaaS n'en ont pas. Si le besoin est un personnage → pilier SVG (2) ou vidéo générée (5).
Voir `memory/doctrines/PILIERS-B2B.md`.

## Références
Repo source : https://github.com/Vincentwei1021/video-shotcraft (152 fiches, 209 previews, Apache-2.0).
Fiches lues et appliquées : `opening/brand-ink-open` · `ui-entrance/row-embed` · `ui-entrance/list-reveal` ·
`interaction/type-and-filter` · `camera/cursor-flyover` · `sequences/promo-energy-arc`.
⚠️ Les fiches sont **en chinois** — lisibles par un modèle, pas par Aziz.
