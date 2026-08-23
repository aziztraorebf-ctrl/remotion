# Upwork — "Max Chill Factor Meter" (AbiGirl Reacts) — STATUS

> Prototype de bout en bout sur un VRAI brief client Upwork (350 $, overlay YouTube animé).
> Session du 2026-08-22. Rien n'a été envoyé à la cliente, aucun engagement pris.

## ETAT : prototype COMPLET, livrables prêts, non envoyé

Branche : `feat/proto-chill-meter-upwork` (3 commits, mergeable ou à garder en R&D).

### Ce qui existe sur disque
| Quoi | Où |
|---|---|
| 6 MOV ProRes 4444 **alpha vérifié** (`yuva444p12le`) | `out/_r-and-d/chill-meter-upwork/` |
| Démo 18 s sur le plateau réel (v2 = flocons corrigés) | `out/_r-and-d/chill-meter-upwork/DEMO-FINALE-v2.mp4` |
| 4 planches SVG de l'appareil (kimi/gpt/fable/grok) | idem, `out-*.svg` |
| Code : device + overlay + showcase + planche givre | `src/projects/_rnd/chill-meter/` |
| Briefs réutilisables + script de mix | ce dossier |

✅ **Les 6 MOV sont A JOUR (regeneres le 2026-08-23 16h20, posterieurs au fix `d9737af7`).**
Alpha verifie deux fois — cf. § PROCHAINE SESSION point 2 pour la commande et les mesures.

## PROCHAINE SESSION — 2026-08-23, dans cet ordre

> Statut au 2026-08-23 17h03 : ① test CapCut **VALIDE** · ② 6 MOV **regeneres et a jour**.
> **Seul reste ③ l'envoi — bloque par les connects a 0** (10 gratuits le 1er du mois).

1. ~~**TEST CAPCUT**~~ ✅ **VALIDE le 2026-08-23 17h03** (Aziz sur CapCut desktop, enregistrement
   d'ecran verifie par Claude : 24 frames couvrant toute la duree + mesure pixel).
   **Ce qui est prouve** : CapCut desktop importe le ProRes 4444 sans broncher (c'etait le point
   d'echec de la version WEB) · l'alpha est correctement interprete a la composition · le cas
   **Fill100** passe (givre + flocons en semi-transparence par-dessus le fond, le cas le plus
   delicat) · 3 clips sur 3 pistes cohabitent.
   Mesure objective : bande horizontale a hauteur du compteur sur le composite Fill100 =
   **7 couleurs distinctes** (les barres de mire traversent le cadre). Un fond opaque aurait
   donne une bande unie.
   ⛔ **Piege a connaitre** : la ou aucun clip ne joue EN DESSOUS, l'overlay s'affiche sur le noir
   du projet. Ce noir est le vide de la timeline, PAS un fond du fichier — le chassis reste
   visible au travers. Ne pas le lire comme un defaut. Cf. [[feedback_transparence-lue-comme-bug]].
   ℹ️ **Materiel de test reutilisable** : `TEST-fond-mouvant.mp4` (mire animee 1920x1080, 15 s,
   generee par `ffmpeg -f lavfi -i testsrc2`) dans le meme dossier. Sa vraie video N'EST PAS sur
   disque et n'est PAS necessaire — on n'avait qu'une image fixe de son plateau
   (`public/_shared/rnd/abigirl-decor.png`). Une mire animee est meilleure pour ce test : le
   mouvement rend un fond opaque immediatement visible.
   ⚠️ Ce test validait SON outil a elle, pas notre rendu (l'alpha etait deja prouve cote ffmpeg).

2. ~~**REGENERER les 6 MOV**~~ ✅ **FAIT le 2026-08-23 16h20.** Les 6 sont sur disque, alpha
   verifie 2 fois : `pix_fmt = yuva444p12le` sur les 6, ET mesure pixel reelle sur la frame 100
   de Fill100 (**56,1 % de pixels totalement transparents**, coin haut-gauche a alpha 191 = le
   voile de givre, conforme au brief). Frames : Entrance 60 · Idle 90 · Fill25 75 · Fill50 105 ·
   Fill75 105 · Fill100 135.
   ⭐ **Constat au passage** : Entrance/Idle/Fill25/Fill50 sont sortis **octet pour octet identiques**
   aux anciens — normal, `d9737af7` ne touchait qu'aux paliers 75/100 (cristaux + `meterGuard`).
   Le rendu est donc bien deterministe, et seuls 2 fichiers avaient reellement change.

   Commande de reference (les 3 flags restent obligatoires) :
   ```
   npx remotion render ChillMeter-<Etat> out.mov \
     --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
   ```
   Les 3 flags sont obligatoires : sans `--pixel-format`, ProRes retombe SILENCIEUSEMENT en
   `yuv422p12le` SANS alpha, sans erreur. Sans `--image-format=png`, TypeError.
   Verifier apres coup : `ffprobe ... stream=pix_fmt` doit rendre `yuva444p12le` (le `a` = alpha).

3. **ENVOYER LA CANDIDATURE.** Le profil Upwork est desormais PRET (voir § ci-dessous).
   Le questionnaire a 2 pieges : mot-code **"FROSTY"** dans le titre (PDF p.9) + question sur le
   format transparent (reponse : MOV ProRes 4444).
   ⛔ Connects a 0 au 2026-08-23 : 10 gratuits le 1er du mois, ou en acheter. Sans connects,
   aucune candidature possible.

## ETAT DU PROFIL UPWORK (2026-08-23) — le blocage n'est plus le portfolio

Le profil est rempli et le portfolio est publie : titre, resume, 20 competences, photo,
Working style (« Clear Communicator »), 4 showcases + 11 pieces isolees, toutes en anglais.
Livrables : `out/_r-and-d/portfolio-en/UPWORK/` (+ `showcases/`, `thumbnails/`).

**Ce qui reste ouvert cote profil** : badge d'identite (35 connects — arbitrage d'Aziz :
les candidatures d'abord), aucun temoignage (viendra avec le temps).
✅ **Employment history REMPLI** par Aziz (session du 2026-08-23) — entree « Kora & Cartes /
Founder & Video Director ».

## CE QU'ON A APPRIS (transposable, indépendant de cette annonce)

- **Coût réel mesuré** : 4 planches SVG de l'objet = **0,79 $** (Kimi 0,21 · GPT 0,19 ·
  Grok 0,25 · Fable 0) + 3 planches de givre = 0,48 $. Rendu ProRes 1080p : **53 s** pour 135 frames.
- **Le brief qui DICTE les noms de `<g id>`** rend les planches interchangeables → mix-and-match
  mécanique par script. Sans ça, il faut choisir une seule planche et vivre avec ses défauts.
- **Exiger le châssis PROPRE (sans givre)** alors que la référence client est givrée à 100 % :
  sans cette clause, les paliers 0/25/50 % auraient été impossibles → tout à refaire.
- **Profils des modèles sur objet texturé** (4 testés, même brief, même image) :
  Kimi = le plus propre · GPT = matière la plus riche mais **textes chevauchés** ·
  Fable = meilleur néon, gratuit · **Grok 4.6 = la meilleure typographie, seul sans chevauchement**.
  → Grok entre dans la rotation quand la LISIBILITÉ compte (HUD, habillage de marque).
- **Le marché ne demande pas "du SVG"** : il demande "de l'animation 2D" et un fichier au bon
  format. Le moyen ne l'intéresse pas. Ne jamais vendre la technique, vendre le livrable + la révision.

## GOTCHAS PAYÉS DANS CETTE SESSION

- ⛔ `dangerouslySetInnerHTML` parse en **HTML** → garder le SVG en kebab-case.
  Convertir en camelCase (réflexe JSX) éteint silencieusement les attributs.
- ⛔ Le contrat "prêt à animer" livre `frost_layer`/`icicles` en `opacity="0"`. Si l'enveloppe
  React pilote aussi l'opacité : `0 × frost = 0`, l'élément n'apparaît JAMAIS. Retirer l'attribut figé.
- ⛔ Un gros cercle avec `filter: blur` est rastérisé en **rectangle opaque** en headless.
- ⛔⛔ **La transparence s'AFFICHE comme un rectangle noir** dans les visualiseurs d'images.
  J'ai signalé un bug inexistant et "corrigé" pour rien. Mesurer l'alpha (`getpixel` → `(0,0,0,0)`)
  AVANT de conclure à un défaut de rendu. Cf. [[feedback_transparence-lue-comme-bug]].
- ⛔ `yt-dlp` : 3 installations concurrentes sur cette machine. La seule à jour est
  `/opt/homebrew/Caskroom/miniforge/base/bin/yt-dlp`. Les versions >90 j échouent en 403 sur YouTube.

## RÈGLES PLATEFORME

### ⭐⭐ Lien externe vs piece jointe — TRANCHE le 2026-08-23 (pages officielles Upwork lues)

**Conclusion : joindre le fichier, ne pas coller de lien.** Non pas parce que le lien serait
interdit, mais parce que la piece jointe supprime la question entierement.

Ce que disent les pages officielles (scrapees, pas des forums) :
- La **circonvention** vise les **coordonnees et moyens de contact/paiement hors plateforme** :
  email, telephone, WhatsApp, Telegram, liens de reunion. « Sharing forms of outside communication
  (or any other form of contact outside Upwork) before a contract starts is circumvention. »
  ⛔ Un lien de PORTFOLIO n'y figure pas — c'est ce qu'Aziz avait vu masque en « information
  removed », et ca ne visait pas les liens de travaux.
- **Les propositions acceptent les pieces jointes**, memes types de fichiers que partout ailleurs :
  « The supported file types are the same everywhere attachments are available (proposals, job
  posts, projects, messages, etc.) », **1 Go max par fichier**.
- ⚠️ Le seul risque reel sur un lien (source secondaire, forum) : il devient suspect s'il mene vers
  une page contenant **des coordonnees ou un formulaire de contact**. Un blob nu n'en a pas — mais
  la piece jointe rend le point sans objet.

Sources : `support.upwork.com/hc/en-us/articles/360052511133` (circonvention) ·
`.../360049608113` (partage de fichiers).

### ⭐ Positionnement — ne pas avoir l'air de faire du travail gratuit (Aziz, 2026-08-23)

Le risque n'est PAS qu'elle prenne le travail et parte (un MP4 de demo ne lui sert a rien sans le
projet source ni les 6 MOV). Le risque est de **positionnement** : livrer avant d'avoir parle prix
se lit comme « j'ai besoin du contrat », et devient un argument contre nous a la negociation.
→ Joindre un **extrait court presente comme un test de faisabilite technique**, pas le livrable
presente comme un cadeau. Et **ne pas annoncer qu'on a deja construit les 6 etats** — le garder
pour l'entretien, ou c'est un atout de negociation.

### Divulgation IA — verifie 2026-08-22, sources secondaires
- Upwork n'a **pas** de page de politique dédiée à la divulgation d'IA ; l'obligation générale
  est de « personnellement relire et personnaliser » ce qu'on envoie.
- Upwork **ne scanne pas** les livrables à la recherche d'IA au niveau plateforme. Ce qui compte
  est **ce que le client a spécifié dans SON brief**.
- Depuis le **5 janvier 2026**, Upwork entraîne ses modèles sur le contenu créé sur la plateforme
  (contrats, livrables, pièces jointes, code, messages). Une option de retrait existe.
- ⚠️ **Ce brief-ci n'interdit rien** sur l'IA (contrairement à l'annonce n°2 de la session, qui
  exigeait "ZERO AI GENERATION"). Mais notre pipeline est du **code déterministe**, pas de la
  génération d'image — c'est un argument, pas une zone grise. Le dire dans ces termes.

## LIENS
- Démo v2 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/chill-meter-v2/DEMO-FINALE-qXGU37QYKRIJ9vFvQc3FTqzFOw4cqt.mp4
- Comparatif 4 modèles (artifact) : https://claude.ai/code/artifact/099539be-2871-4bba-9a46-b4752b49bd48
- Chaîne cliente : https://www.youtube.com/@Abigirl_Reacts (107 K abonnés, **1 500 vues médianes**,
  ratio vues/abonnés 0,026 — chaîne à fort volume, faible engagement, monétisation faible).
