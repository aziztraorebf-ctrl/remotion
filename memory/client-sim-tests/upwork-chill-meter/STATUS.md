# Upwork — "Max Chill Factor Meter" (AbiGirl Reacts) — STATUS

> Prototype de bout en bout sur un VRAI brief client Upwork (350 $, overlay YouTube animé).
> Session du 2026-08-22. Rien n'a été envoyé à la cliente, aucun engagement pris.

## ETAT : proposition ENVOYÉE le 2026-08-23, en attente de réponse

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
   ⭐ **A DIRE DANS LA LIVRAISON** (constate 17h09 : le clip Idle avait disparu de l'apercu —
   cause = `Position Y = -1909` dans Transform, un glissement accidentel dans la fenetre
   d'apercu l'avait pousse hors cadre ; Fill100 etait reste a X=0/Y=0 et s'affichait bien).
   Un overlay plein cadre 1920x1080 se deplace d'un simple glissement, et l'editeur ne voit
   alors plus rien sans comprendre pourquoi — il peut conclure que le fichier est casse.
   Donc preciser 2 lignes a la cliente : (1) les MOV sont **en plein cadre 1920x1080, deja
   positionnes** -> deposer tels quels, ne pas les deplacer ; (2) si le compteur disparait,
   c'est **Transform -> reset** (ou X=0 / Y=0), pas le fichier.

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

3. **ENVOYER LA CANDIDATURE** — tout est redige et en place au 2026-08-23 (voir § CANDIDATURE).

## 📤 PROPOSITION ENVOYÉE — 2026-08-23 (en attente de réponse)

**Envoyée.** Première candidature d'Aziz sur Upwork, moins de 2 jours après la création du profil.
Coût : 7 connects, **pas de boost** (solde ≈143). Pièce jointe : `progressive meter.mp4` (3,2 Mo).

**⛔ DÉCISION (Aziz) : ne RIEN produire de plus avant d'avoir le contrat.** Pas de prototype son,
pas de livrable anticipé. Les 6 états et les animations existent déjà — si le contrat est gagné,
l'essentiel du visuel est fait ; restent le son et des ajustements de dosage (plus/moins de neige,
timing d'une animation).

**PROCHAINE SESSION = seulement si elle répond.** Alors :
1. Lire sa réponse ; si elle négocie ou demande des modifs, arbitrer avec Aziz (le prix de 350 $
   est CELUI DU BRIEF, pas une enchère — ne pas descendre sans contrepartie de périmètre).
2. Si contrat gagné : **prototyper le SON en premier**, c'est le seul point promis non démontré.
   Nos moyens : `scripts/generate-sfx-elevenlabs.py` + 160 SFX déjà produits dans `public/`.
   ⚠️ 2 différences avec nos SFX habituels : (a) matière (craquement de gel, condensation, métal
   qui givre) plutôt que ticks/whooshes d'interface — prévoir ~5 essais par son ; (b) calage sur
   des ÉVÉNEMENTS MÉCANIQUES (impact au sol, clic d'activation, départ de l'onde) et non sur des
   beats narratifs — l'animation étant en code, la frame exacte de chaque événement est connue,
   donc le calage est déterministe. C'est un argument de vente, pas une difficulté.
   Ce que le brief demande par état : entrée = thud + click + power-on · idle = RIEN · 25 % =
   montée légère · 50 % = crackle + pulse + chime + ice-building · 75 % = chime + crackle + vent ·
   100 % = whoosh + boom + chime + crackle + rafale + shimmer.
   ⚠️ Le brief ne précise PAS le format de livraison audio (la section « Final File Exports » ne
   parle que de vidéo). On a proposé des **stems séparés par état** — ça lui laisse le choix de
   mixer contre sa musique. Si elle préfère l'intégré au MOV, faire les deux.
3. Le jalon 1 dépend de SON approbation du design → la relancer plutôt qu'attendre, sinon la date
   du 28 août glisse sans que ce soit notre faute.

⭐ **Leçon confirmée sur un cas réel (Aziz)** : « plus de neige », « animation plus lente » sont des
CHANGEMENTS DE PARAMÈTRE en code. En vidéo générée (MiniMax H3 & co), la même demande impose de
relancer une génération dont le RESTE bougera aussi. Si la cliente avait exigé un livrable vidéo
généré, ces ajustements auraient été bien plus coûteux. C'est le moat « déterminisme » de
`memory/doctrines/PILIERS-B2B.md`, vérifié en conditions réelles.

## ⭐ LE BRIEF CLIENT EST MAINTENANT SUR DISQUE

`BRIEF-CLIENT-ORIGINAL.pdf` (10 pages) dans CE dossier. ⛔ **Gitignore** (7,4 Mo binaire, le repo
fait deja 1,1 Go) — il vit sur disque, pas dans l'historique. Le RELIRE avant toute action sur
cette annonce : cette session a montre qu'un resume ne remplace pas la source (2 erreurs, cf.
[[feedback_reconfronter-brief-original-pas-diff-relatif]] § extension 2026-08-23).

## CANDIDATURE — prete a envoyer (2026-08-23, brief PDF enfin lu)

⭐ **Le PDF de l'annonce a ete fourni par Aziz cette session** — il corrige 2 erreurs que j'avais
faites en travaillant de memoire :
- ⛔ **Il n'y a PAS de champ TITRE** dans le formulaire de proposition Upwork. J'avais redige un
  titre pour rien. Le brief dit « subject line OR title » -> **FROSTY en 1re ligne de la lettre**
  remplit la condition (et c'est mieux : premiere chose lue).
- ⛔ **Le SON est demande partout** (chaque section du brief liste ses SFX : thud, click, crackle,
  chime, whoosh, boom). Notre demo est MUETTE. Traite en promettant des **stems audio separes par
  etat** — defendable et meilleur pour elle (elle mixe contre sa musique), mais c'est une PROMESSE,
  pas une demonstration. Attendre une question la-dessus en entretien.
- ⛔ La reference visuelle est **SON image fournie** (p.5-6), pas un dessin libre. Dire « I built
  the meter » etait trop large -> reformule en « I animated a working version from your reference ».

**2e test d'attention, distinct du mot-code** : la derniere question (« the one small instruction
outside of the design requirements ») attend l'instruction FROSTY elle-meme (p.9, « Attention to
Detail Check »). Y repondre EXPLICITEMENT, ne pas compter sur le mot-code pour le prouver.

**Structure du formulaire** : 1 lettre + **5 questions dans des cases SEPAREES** + pieces jointes.
⛔ Ne pas tout mettre dans la lettre : une case vide se lit comme un trou. La repetition
lettre/cases est normale et attendue.

**Cadrage retenu (correction d'Aziz, juste)** : la lettre laissait croire que TOUT etait deja
construit, alors que le brief demande 8 livrables et qu'on n'a qu'un prototype visuel muet.
Risque double : elle se demande pourquoi elle paie 350 $, OU elle decouvre apres coup que le son
manque. Phrase-cle ajoutee : **« It's a proof of concept, not the finished piece »** — les 3 jalons
redeviennent logiques et l'absence de son est annoncee par nous, pas decouverte par elle.

**Jalons proposes** (dates volontairement avec marge — le jalon 1 depend de SON approbation) :
1 Meter design approved — 28 aout — 105 $ · 2 Entrance/idle/0-25%/50% — 4 sept — 140 $ ·
3 75% + 100% + fichiers finaux — 11 sept — 105 $. Total 350 $. Duree : « Less than 1 month ».

**Piece jointe** : `progressive meter.mp4` (3,2 Mo — la variante avec l'accroche MAX CHILL en tete).
⛔ Limite Upwork = **10 fichiers, 25 Mo chacun**. Joindre le fichier, ne PAS coller de lien.

**Boost : NON.** La proposition coute 7 connects, le bid de boost est a 0 — on peut envoyer sans.
Le boost ne change PAS la visibilite (toutes les propositions restent visibles), seulement l'ORDRE
d'affichage. Preuve terrain : un candidat a mis 15 connects la veille, la cliente s'est connectee
3 h avant et n'avait toujours pas decide. Garder les connects pour le VOLUME de candidatures.

⭐ **Connects : 0,15 $/unite (verifie page officielle), mais un job coute 4 a 16 connects**, pas 1.
100 connects ≈ 10-25 candidatures. Bonus de **50 connects offerts apres le 1er achat** (nouveau
freelance). Recredites souvent si un client interviewe ; jamais rembourses si elle choisit
quelqu'un d'autre ou si l'annonce expire.

ℹ️ **« Interview » a ce niveau de prix = echange ECRIT** dans le fil Upwork, pas une visio. Le mot
est un terme de plateforme designant le moment ou le client engage la conversation.

## ANCIEN BLOC (conserve pour reference)
3. ~~ENVOYER~~ Le profil Upwork est desormais PRET (voir § ci-dessous).
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
