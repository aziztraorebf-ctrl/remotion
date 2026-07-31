# NotebookLM — la boucle de condensation LONG → SHORT

> **Ce que c'est** : on donne le script long a NotebookLM, il PRODUIT une video Short complete,
> et on en extrait la FORME (pacing, decoupage, hook, chute). Le script qui en sort est une
> matiere premiere qu'on retravaille — jamais un livrable.
>
> **Ce que ce n'est PAS** : un outil d'analyse. ⛔ Ne JAMAIS lui demander un avis ecrit
> (« classe ces 3 moments », « note leur autonomie »). Verdict d'Aziz, 2026-07-30 :
> **une decision sur le pacing se juge en la VOYANT, pas en la lisant.**
>
> **Statut** : eprouvee 3 fois (AES, Senegal, CFA), **2 Shorts publies**. Methode reelle mais
> restee NON ECRITE jusqu'au 2026-07-30 — elle ne vivait que dans les transcripts de conversation.

## Ou ca s'insere

En AMONT de [[SOUVERAIN-SHORT-DEMARRAGE]], qui demarre a « script locked ». Cette boucle est
ce qui PRODUIT ce script.

```
script long fact-checke  →  [BOUCLE NOTEBOOKLM]  →  script court FR  →  TTS  →  forced-align  →  code
```

## La procedure

1. **Charger le script long** (deja fact-checke) comme source unique dans NotebookLM.
2. **Lancer une Video Overview** — preset ou Custom (voir arbitrage plus bas).
3. **Recuperer la video**, la passer a Claude par lien (uguu.se / tmpfiles / Downloads).
   Claude fait : `ffprobe` (duree/format) + extraction de frames + transcript.
   ⛔ Transcript = **API OpenAI Whisper**, jamais le binaire local ([[whisper-api-openai-jamais-local]]) —
   la regle est nee precisement sur ce workflow (>50 min bloque sur un clip de 71 s).
   ⛔ **Forcer la langue source ANGLAISE** : en mode auto, Whisper traduit litteralement et
   fabrique des non-sens (« huile » pour oil, « Normandie » pour Norvege, « grotte » pour vault).
4. **Extraire la structure de compression** : ou il coupe · quel hook il choisit · quel
   enchainement causal · quelle chute · la duree reelle par bloc.
5. **Jeter le visuel et le texte anglais.** ⛔ Ne JAMAIS traduire mot a mot : repartir du
   script FR original fact-checke et ne calquer QUE la structure.
6. Claude ecrit le script FR condense sur ce squelette + le CTA maison, Aziz valide, puis TTS.

**On garde** : hook, arc causal, decoupage, duree cible, calibrage.
**On jette** : le graphisme, le texte anglais, tout chiffre non reverifie.

## ⭐⭐ LE GABARIT — prompt Custom, structure imposee + section intouchable

Ne PAS cadrer le sujet, cadrer la **forme**. Gabarit valide (Senegal, devenu le Short livre) :

```
Video courte (60-90s). Structure obligatoire en 4 temps :
1. Hook : ouvre sur <LE MOMENT CONCRET ET DATE>. Pas de question generique.
2. <Contexte minimal> : 2-3 phrases max.
3. <LE CLIMAX> — section intouchable, ne pas resumer. Garde <les deux faces / le contraste complet>.
4. Chute : referme le sujet. Pas de question ouverte, pas d'appel a une suite.

Si tu dois couper pour tenir la duree, coupe dans la section 2, jamais dans la section 3.
```

⭐ **La derniere ligne est la trouvaille.** Sans elle il coupe au mauvais endroit — voir gotcha n.1.
Fournir aussi la version EN (il repond en anglais, collage direct plus fiable).

## ⛔ LES GOTCHAS (tous mesures, pas deduits)

1. **IL PERD LE CLIMAX.** Mesure 2× sur le Senegal : les deux generations spontanees ont
   abandonne la comparaison Norvege/Congo/Botswana — exactement le moment juge intouchable.
   Il suit UNE ligne du script et laisse tomber le reste. **C'est LA raison d'etre du prompt dirige.**
2. **Les hooks spontanes sont generiques** (« How does a fund protect a nation… ») la ou le
   script long avait un hook date et concret. A verrouiller explicitement.
3. **Duree reelle 60-75 s**, pas 90 — meme en demandant la cible haute.
4. **La narration sort en anglais** (cf. etape 3 : forcer la langue, ne jamais traduire mot a mot).
5. **Le visuel est faible** : overlaps de texte (bug z-index), plans statiques, icones heterogenes.
   Un seul merite : **le texte overlay est time sur l'audio** — signal utile pour le pacing des
   sous-titres. Style Infographic a choisir **Editorial/Professional**, jamais Kawaii/Anime
   (un style cartoon pollue le jugement de fond).
6. **Risque factuel non leve sur sujet dense.** La compression tient sur du generique ; sur du
   geopolitique dense (dates, chiffres, noms propres) la sur-simplification n'a jamais ete
   mesuree. Garde-fou = repartir du FR fact-checke, revarifier tout chiffre.

## Preset ou Custom ?

- **Preset** : sortie non contaminee par nos idees → le pacing observe est vraiment le sien.
  Utile pour apprendre quel angle LUI parait le plus facile a tenir en format court.
  ⚠️ Mais il ne dit rien du format cible → risque d'overview longue, structuree en resume.
- **Custom** : impose la contrainte de forme (duree, structure, section intouchable). **Defaut
  recommande** des qu'on sait quel climax proteger.
- Les presets couvrent typiquement chacun UN acte du script — d'ou leur faiblesse sur un script
  a arc causal long.

## ⭐ L'ACQUIS QUI A DEPASSE LE CADRE DU SCRIPT

Extrait de l'observation des videos NotebookLM, devenu principe de projet :
**UNE SEULE scene/objet visuel persiste a l'ecran du debut a la fin et se TRANSFORME** — jamais
de cut vers un nouveau decor complet. Sous-titres mot-par-mot. Une seule rupture de registre
visuel, au moment le plus dramatique.
(Grave dans `memory/episodes/warmap-sahel/PLAN-SHORT-90S-V3-REPRISE.md`.)

⚠️ **Nuance tranchee** : le succes de NotebookLM ne prouve PAS qu'un Short peut diverger du style
du long. Il prouve qu'un style simple et coherent avec lui-meme fonctionne. Decision d'Aziz : le
Short reste reconnaissable comme teaser du long (meme univers visuel). La V1 du Short AES a ete
REJETEE pour ca (composants Mapbox generiques vs DA parchemin du long).

## Les Shorts produits par cette boucle (2 publies, 1 pret)

| Short | Livrable | Trace |
|---|---|---|
| **AES 90s** | `out/PRET-PUBLICATION/aes-short-90s-FINAL.mp4` | narration 82,5 s calibree sur les 82 s du NotebookLM ; V1-V4 rejetees avant la bonne |
| **Senegal Petrole & Gaz D3** | `out/PRET-PUBLICATION/senegal-petrole-gaz-short-d3-FINAL.mp4` | ⭐ la plus directe : `SCRIPT-FR.txt` = traduction FR de la 3e generation ; scenes calquees (`Scene1Hook`/`Scene2Paradoxe`/`Scene3Comparaison`/`Scene4Dette`/`Scene5Cta`) ; commentaire en tete de `whisper-words-senegal-short.ts` : « script FR condense NotebookLM » |
| **Franc CFA** | `out/PRET-PUBLICATION/franc-cfa-short-9x16-FINAL.mp4` (2026-07-31, PRET, pas encore publie) | video source jamais sauvegardee lors du 1er passage (contrairement aux 2 autres) — recuperee via lien tmpfiles.org fourni par Aziz. ⚠️ **GOTCHA tmpfiles.org** : le lien colle pointe vers la PAGE WEB, pas le fichier — il faut parser le HTML (`grep -oE 'href="[^"]*\.mp4"'`) pour trouver le vrai lien `/dl/...` avant `curl`. Climax choisi = le levier de devaluation coince (Beat 5b du mid-form), pas 1994 seul — convergence spontanee avec un beat deja ecrit = signal fort. Transcript par ElevenLabs Scribe (Whisper en quota epuise ce jour-la). |

## ✅ SECOND USAGE — la planche de slides pour IDÉER des scènes : **PROUVÉ (2026-07-30)**

Les **slideshows** de NotebookLM proposent des traductions visuelles qu'on n'aurait pas
cherchées (il ignore tout de notre arsenal → remède au biais du catalogue).
**La preuve de concept est FAITE et RÉUSSIE.**

La slide « The Sira Chasm » (3 piliers enjambant un gouffre, tablier commun, socles fissurés)
est devenue une scène SVG animée dans notre registre encre/nuit — 390 frames 1920×1080,
78 empreintes uniques sur 78 (aucun gel). `src/projects/_rnd/svg-scenes/PiliersGouffre16x9.tsx`
+ `PiliersGouffreBodies.ts`, compo `RND-PiliersGouffre` (commit `4f35233b`).
⛔ **Destinée au GAZODUC, PAS au CFA** (épisode clos — décision d'Aziz).
Références : `public/_shared/refs/notebooklm-slides/` (1 bonne + 1 contre-exemple).

⭐ **La règle qui sort des 2 slides** : ce qui vaut, c'est la **trouvaille de traduction**,
jamais l'exécution — environ **une par lot**, pas une par slide.
⚠️ Ça inverse INTENTION → FORME → TEMPLATE : **écrire ce que la scène doit faire ressentir
AVANT d'ouvrir les images**, sinon on choisit la plus jolie et pas la plus juste.

### ⭐⭐ CE QUE LA PREUVE A APPRIS (réutilisable bien au-delà de NotebookLM)

- **La v1 a été REJETÉE au rendu**, sur 3 défauts invisibles dans le code : gouffre inexistant
  (sol continu → métaphore morte), contraste bleu-sur-bleu, emblèmes en cartouches rapportés.
  La v2 les a corrigés après un brief qui **NOMMAIT chaque défaut**.
- ⭐ **PRÉVOIR UN FALLBACK DANS LE BRIEF.** La poignée de main a échoué **3 fois** (lue comme un
  raccord de tuyau, puis une boucle de ceinture) → remplacée par le **sceau gravé, prévu comme
  repli dans le brief initial**. Coût : une ligne. Gain : 1 à N itérations. À faire pour tout
  élément à lecture ambiguë (mains, gestes, jonctions d'objets, symboles de contact).
- ⭐⭐ **BALAYAGE vs FONDU = une différence de SENS, pas d'effet.** Un fondu dit « elles étaient
  déjà là » ; un balayage dit « elles s'ouvrent MAINTENANT ». Le script parlait au présent →
  balayage. Le mode de révélation se tranche sur ce que la phrase dit du TEMPS, jamais sur le joli.
- **Un clip qui « ne marche pas » se résout par la MESURE** : le masque des fissures démarrait à
  `y=655` alors que les fissures vivent en `y∈[686,771]` — mesuré dans le SVG source, pas estimé à l'œil.
- **Le « rends et regarde » se COMMANDE** : l'agent a itéré 17 fois parce que le brief l'exigeait.
  Ce n'est pas un trait acquis du modèle, c'est une consigne à écrire.

## 🎯 CE QU'AZIZ ATTEND DE CE SECOND USAGE (verbatim 2026-07-30)

> « Une fois le script construit, on peut l'utiliser pour générer des **slide decks custom**
> [...] on lui donne **le minimum** [d'instructions], et après **on regarde les graphismes
> qu'il prépare**. »

1. **La granularité visée est la SCÈNE / le BEAT**, pas l'épisode. Une planche **ajustée par beat**.
2. **Le minimum d'instructions, délibérément.** ⚠️ Ça semble contredire le gabarit dirigé du
   § LE GABARIT — ce n'en est pas un : **les deux usages n'ont pas le même but**. Pour le SCRIPT
   on dirige (il faut protéger un climax précis) ; pour l'IDÉATION on sous-spécifie **exprès**,
   parce que la valeur vient de ce qu'il propose et qu'on n'aurait pas cherché. Sur-briefer
   l'idéation revient à lui faire dessiner notre propre idée.
3. **NotebookLM sait produire DIFFÉRENTS TYPES de slide decks** — noté par Aziz, non exploré.
   Le type de deck est un levier gratuit, à sonder.

⭐ **CANDIDAT n°1 : le GAZODUC Nigeria-Maroc-Europe** (`memory/projects/GAZODUC-MEGAPROJETS-SUJET.md`).
C'est le piège de la carte : le réflexe sera de tout poser sur une carte, alors que le sujet est fait
d'abstractions (financement, délais, dépendance, rapport de force) — là où une carte échoue et où une
scène-objet gagne.
⭐⭐ **Corollaire du comparatif 4 modèles** : on lui demandera de **TROUVER, pas de dessiner**.
NotebookLM = l'idéateur, Fable = le dessinateur. Ne pas les intervertir.
(Détail : `memory/doctrines/SVG-SCENES-GENERATIVES.md` § SANS IMAGE, PERSONNE NE TROUVE LA FORME.)

## 🔌 AUTOMATISER LA BOUCLE ? — recherché le 2026-07-30, verdict : NON pour l'instant

**API officielle** : existe (**Gemini Notebook Enterprise**, ex-NotebookLM Enterprise, renommé le
2026-07-16) mais **ne couvre NI la vidéo NI les slides — uniquement l'audio**. Entreprise / Google
Cloud payant → **impossible depuis un compte perso**. Donc inutile pour notre boucle.

**CLI officiel** : n'existe pas. Meilleur tiers = **`teng-lin/notebooklm-py`** (18 351 étoiles, actif
au 2026-07-29), qui fait **exactement notre boucle** : créer un notebook, uploader une source, Video
Overview **avec instructions custom**, slide deck, télécharger `.mp4` / `.pptx`.

**Quotas Video Overview** (utile même en usage manuel) : gratuit **3/jour** · Plus 6 · Pro 20 · Ultra 100-200.

⛔ **POURQUOI C'EST ÉCARTÉ (décision d'Aziz)** : le mode automatisable repose sur un **« master token »**
que **ses propres auteurs qualifient d'`infostealer-grade`** — un identifiant **PLEIN COMPTE Google**
(Gmail, Drive, YouTube) qui **survit au changement de mot de passe**. Contraire aux CGU Google, qui
poursuit SerpApi sur ce motif exact.
→ **Écarté pour le compte principal.** Si un jour on scripte : **compte Google dédié**, jamais le compte
de travail. En attendant, boucle manuelle — les quotas suffisent à notre rythme.

## Faux ami

`scripts/archive/export-for-notebooklm.ts` — exporte la base de connaissance du projet pour
generer des Audio Overviews SUR le projet. Aucun rapport avec les Shorts, et archive.
