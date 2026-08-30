# UI PRODUIT / ÉCRAN DE SAAS — fiche de déclenchement (lire AVANT de coder une scène d'interface)

> Se déclenche quand on simule un écran, un dashboard, une app, un site — **pilier B2B n°3 sur 5**.
> ⚠️ Un plan qui ressemble a une UI n'en est pas forcement une : cartouche, portrait, badge, lockup,
> carte + avatars = **pilier 4 (motion design React)**, briques deja presentes. Verifier avant de capturer.
> ⚠️ Si ce que tu lis ne correspond PAS au réel que tu as sous les yeux : **c'est la FICHE qui a tort**.
> Corrige-la immédiatement. Chemins vérifiés sur disque le 2026-08-20.

> ⛔⛔ **`puppeteer` n'est PAS une dépendance du projet** (vérifié 2026-08-27 : `npm ls puppeteer` → vide).
> Tous les `capture-*.mjs` échouent en `ERR_MODULE_NOT_FOUND`. Seuls les NAVIGATEURS sont en cache.
> Contournement sans rien installer : le binaire headless en CLI —
> `~/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --force-device-scale-factor=2 --window-size=1920,1080 --screenshot=<out> <url>`
> ⚠️ Ce contournement ne régénère PAS `*-layout.json` ni les découpes — vérifier leur MD5 après coup.

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
⛔ **`waitUntil:'networkidle'` TIMEOUT sur une page a videos en boucle** (le reseau n'est jamais au
   repos) -> `waitUntil:'load'` + `waitForTimeout(1500)`. ⚠️ `capture-northshield.mjs:78` utilise
   `networkidle0` : correct pour une page statique, il se BLOQUERA sur une page a medias.
⛔ **Playwright sans navigateur** : reutiliser le Chrome de Puppeteer deja present plutot que
   `playwright install` — `chromium.launch({executablePath: process.env.CHROME_BIN})` avec
   `~/.cache/puppeteer/chrome/*/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/...`
   (⚠️ 2 versions coexistent : globber, ne pas coder en dur). Paye le 2026-08-23.

3. **Capturer** : `scripts/tools/ui-capture/capture-northshield.mjs` (versionné ; adapté de
   `assets/scripts/capture-template.mjs`). Produit : plaque pleine page **2x**, découpes par élément,
   plaque VIDE (`hideForEmptyPlate`), et **`live-layout.json` = les bbox réelles**.
   Un 2e état s'obtient par `interact:` (ex. filtrer la liste) → `<name>-after.png`.
4. **Animer** — `PageCam` + les recettes (voir § socle).

## ⛔⛔ LES 4 PIÈGES QUI ONT COÛTÉ UNE ITÉRATION CHACUN

1. **`live-layout.json` de l'état APRÈS interaction est FAUX** — il est relevé AVANT l'`interact`,
   donc il liste encore les 7 lignes alors que la page filtrée n'en a qu'une.
   → **MESURER sur la plaque** (scan du PNG), ne jamais déduire. Erreur commise 2× la même session :
   `FLAG_CY - 660` donnait 313, la vraie valeur mesurée était 642 → cadrage sur du vide.
2. **Ne JAMAIS changer de plaque pendant un mouvement de caméra** (full → filtered) : la caméra
   continue de se resserrer sur une zone qui vient de se vider. Le changement se fait **sur une coupe
   couverte par `FlashCut`**.
3. **Un commentaire JSX mal fermé (`*/` sans `}`) est INVISIBLE jusqu'au typecheck** — rencontré 2× dans la
   même session, dans 2 fichiers. `npx tsc --noEmit` AVANT de considérer un `.tsx` terminé, pas au build.
4. **`omitBackground: true` ne donne PAS de transparence** sur un élément qui a un fond CSS propre
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

*(tableau des proportions retire le 2026-08-23 : doctrine importee, consultable dans
`Vincentwei1021/video-shotcraft` > `sequences/promo-energy-arc`. Les regles dures ci-dessous, elles,
portent chacune leur cout paye.)*

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

SFX repris de leur banque (**19 fichiers** retenus sur les 149 du repo amont) → `public/_client-sim/noteshield/sfx/`.
⛔⛔ **PAS de whoosh sur les coupes d'UI** (retiré 2026-08-20, retour Aziz) : `whoosh.mp3` est un
sifflement d'AIR, un vocabulaire de mouvement physique sans rapport avec un logiciel — sur 5 coupes il
devenait le son le plus présent du film. **Le FlashCut visuel suffit.**
Musique : leurs 5 BGM sont gratuites (Apache-2.0) — **tester le gratuit AVANT de générer** (réflexe
d'Aziz, 2026-08-20). Choisir le segment sur **mesure du profil d'énergie**
(`ffmpeg -ss T -t 20 -i X -af volumedetect`), pas au hasard : pour `bgm-tech-house`, 156→182 s est la
seule portion qui monte sur 26 s d'affilée, ce qui épouse l'arc. Volume musique **0,13**, SFX **0,50**.

## CE QUI EST AGNOSTIQUE — et ses 2 EXCEPTIONS (2026-08-20, ⛔ nuancé le 08-30)

Le même film a été produit en **registre sombre ET en light mode SaaS** : la bascule est réelle et
tient dans une session. ⛔ **Mais « sans changer un seul composant » était FAUX** — 2 choses ne
basculent jamais toutes seules, mesurées le 2026-08-30 sur `repro-onboarding` :
1. **Les OMBRES en dur.** 11 `#000000` à 30-40 %, invisibles sur fond sombre, qui deviennent des
   taches grises sur fond clair. Elles ne sont pas dans la palette : elles ne se voient qu'au rendu.
2. **Le CONTRASTE du texte secondaire.** Mesure WCAG : le gris atténué à 60 % sur blanc tombe à
   **2,46** (seuil lisible 4,5) = illisible. Remonter l'opacité ne suffit pas (3,46) — il faut
   **assombrir la couleur** (`#3e4a58`, pas `#5d6b7d` → 9,03 en plein, 4,95 atténué).
⭐ **Un thème clair n'est PAS le négatif d'un sombre** : l'œil ne traite pas les deux polarités de
la même façon, le secondaire doit y être nettement plus foncé.
⭐ **Ce qui bascule proprement, c'est ce qui est un TOKEN.** Une ombre et un gris de texte n'en sont
pas tant qu'on ne les a pas déclarés comme tels.
✅ **AVANT de promettre l'agnosticisme à un client** : `grep` les couleurs en dur + mesurer le
contraste WCAG du secondaire. La promesse tient, elle a juste 2 exceptions à traiter d'abord.
Compositions de référence : `NorthShieldPromoV4` (sombre) · `NorthShieldPromoLight` (clair) ·
`ReproOnboarding` (thème paramétré : `THEME=clair python3 assets/gen-planche.py`).
⚠️ `PageCam` a un fond papier `#faf7f2` codé **EN DUR dans les 2 branches** (`PageCam.tsx:60` 2D et `:85` 3D — et c'est la 3D qui est active dès qu'un `rotX` est posé), **aucune prop de fond**. ⛔ Ne pas patcher PageCam : il est PARTAGÉ avec noteshield. Le fond se règle dans la page servie et se capture avec elle.

## ⛔ LE PIÈGE QUI REND UN RENDU ENTIÈREMENT VIDE (payé 2026-08-30)

Une chaîne de markup SVG passée en **enfant JSX** (`{MON_SVG}`) s'affiche en **texte brut** — donc,
sur fond clair, **rien du tout**. Il faut `dangerouslySetInnerHTML={{ __html: ... }}`.
⛔ Symptôme : TypeScript compile, Remotion rend toutes les frames, le `.mp4` existe — et il est
**intégralement vide (0 pixel non-blanc mesuré)**. Aucune erreur nulle part.
⚠️ Les 4 fiches qui parlent déjà de `dangerouslySetInnerHTML` traitent du kebab-case vs camelCase :
**aucune ne couvrait son ABSENCE pure**, qui est le cas coûteux.
✅ Réflexe : après un rendu, compter les pixels non-blancs avant de conclure quoi que ce soit.

## ⛔ CE QUE CE PILIER NE FAIT PAS

Pas de personnages, pas de visages, pas d'organique. Ce n'est pas une limite à cacher : les meilleurs
explainers SaaS n'en ont pas. Si le besoin est un personnage → pilier SVG (2) ou vidéo générée (5).
Voir `memory/doctrines/PILIERS-B2B.md`.

## ⭐⭐ L'UI DANS UN MOCKUP D'APPAREIL 3D → fiche dédiée

→ **`memory/fiches/FICHE-MOCKUP-3D.md`** (déclencheur distinct, scindée le 2026-08-26).
En une ligne : on plaque la capture dans l'écran via la prop `screen`
(`<meshBasicMaterial map={tex} toneMapped={false} />`, **JAMAIS `<Html>` de drei**), et
l'échelle comme le cadrage se **CALCULENT**, ils ne se dosent pas.

## Références
Repo source : https://github.com/Vincentwei1021/video-shotcraft (152 fiches, 209 previews, Apache-2.0).
Fiches lues et appliquées : `opening/brand-ink-open` · `ui-entrance/row-embed` · `ui-entrance/list-reveal` ·
`interaction/type-and-filter` · `camera/cursor-flyover` · `sequences/promo-energy-arc`.
⚠️ Les fiches sont **en chinois** — lisibles par un modèle, pas par Aziz.

## ⭐⭐⭐ LE FOND N'EST PAS UN DETAIL — c'est ce qui fait d'une capture un PLAN

**Constat d'Aziz (2026-08-27, repro Foster plan 8)** : « au lieu d'avoir juste un
background blanc ou noir, avoir un degrade permet de rajouter de la vie, un cote
beaucoup plus premium — c'est peut-etre l'une des raisons pour lesquelles ils
utilisent ceci dans l'original ».

**La reference le fait, et c'est mesurable** : la fenetre de l'app est DETOUREE
(marge ~108 px) sur un degrade vert sombre avec un halo qui monte du bas —
teinte mesuree R30,4 G41,0 B31,3. Ce n'est ni du noir ni du blanc.
→ Une UI collee bord a bord sur du blanc reste une CAPTURE D'ECRAN. Detouree sur
un degrade, avec une ombre portee, elle devient un OBJET FILME. C'est le meme
ecran, et pourtant ce n'est plus le meme registre.

⛔⛔ **LE DEGRADE DOIT VIVRE DANS LA PAGE HTML, PAS DANS LE COMPOSANT REACT.**
Paye 1 rendu : `PageCam` affiche la plaque PLEIN CADRE et masque tout ce qu'on
pose derriere lui — un fond React n'a AUCUN effet mesurable (verifie : la teinte
n'avait pas bouge d'un point apres correction). Le fond se regle dans le `body`
de la page servie, puis se capture avec elle.

## ⭐⭐⭐ LE PAN NE DOIT PAS DEPASSER LE BORD DE LA PAGE — ca se CALCULE

Symptome vu par Aziz : « a la fin du mouvement on se retrouve avec une page
blanche tout a droite, comme si c'etait un second ecran ». Ce n'etait ni un 2e
ecran ni un probleme de vitesse : la camera sortait de la page, et PageCam
remplit le hors-champ avec son fond papier `#faf7f2`.

`PageCam` place tout point page `p` a **`960 + zoom*(p - cx)`** px ecran — et
c'est IDENTIQUE dans ses 2 branches (2D `scale`, 3D `zoom` CSS ; verifie, le
fichier le dit lui-meme en commentaire). Le bord droit reste donc hors cadre
tant que :

    cx <= largeurPage - 960/zoom          (et symetriquement cx >= 960/zoom)

A zoom 1,55 sur une page de 1920 : **cx <= 1300,6**. Viser le centre de la
derniere CARTE (1622) mettait la camera **320 px** trop loin.
⚠️ Ne pas confondre les 2 series de coordonnees d'une meme page : le 4e MONTANT
est a 1596, la 4e CARTE a 1622.
⭐ `rotX: 0` suffit a basculer PageCam en branche 3D (`has3D`, PageCam.tsx:57) —
c'est VOULU (c'est ce qui donne le `zoom` CSS et le texte net), mais ne pas lire
le code de la branche 2D pour raisonner sur un plan qui porte un `rotX`.
⭐ Cette borne se CALCULE avant de coder les keyframes — elle ne se dose pas au
rendu. Meme logique pour l'axe vertical avec `pageH`.

## ⚠️ LES BBOX CHANGENT A CHAQUE RECAPTURE — les RELIRE, jamais les supposer

Vecu 3 fois dans la meme session : en changeant la marge de la page (64/96 ->
96/120 -> 104/130 px), TOUTES les coordonnees ont bouge (cartes x 425 -> 449 ->
459, montants cx 588 -> 606 -> 614). Un `dash-layout.json` lu une fois et garde
en tete est un piege.
⛔ Corollaire deja dans cette fiche (piege n°1) mais re-paye ce jour : j'ai code
`y = 295 - 212` (centre moins hauteur) alors que `y: 189` etait ECRIT dans le
fichier — les cartes recouvraient le titre. **La valeur etait sous mes yeux.**

## ⛔ 5e PIÈGE — un défaut d'asset peut DORMIR plusieurs plans avant d'être vu (2026-08-27)

L'état `billing` de la page n'avait **jamais** contenu son tableau de lignes. Invisible au plan 8
(caméra serrée sur les cartes du haut : le vide restait hors cadre), exposé au plan 9 qui cadre la
plaque entière — après que le plan 8 ait été validé.
⭐ **Après toute (re)capture, REGARDER la plaque ENTIÈRE**, pas seulement la zone que le plan courant
cadre. Ici même la mesure ne suffisait pas : il fallait regarder hors du cadre.
