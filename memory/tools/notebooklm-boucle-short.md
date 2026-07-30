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

## Les 2 Shorts publies par cette boucle

| Short | Livrable | Trace |
|---|---|---|
| **AES 90s** | `out/PRET-PUBLICATION/aes-short-90s-FINAL.mp4` | narration 82,5 s calibree sur les 82 s du NotebookLM ; V1-V4 rejetees avant la bonne |
| **Senegal Petrole & Gaz D3** | `out/PRET-PUBLICATION/senegal-petrole-gaz-short-d3-FINAL.mp4` | ⭐ la plus directe : `SCRIPT-FR.txt` = traduction FR de la 3e generation ; scenes calquees (`Scene1Hook`/`Scene2Paradoxe`/`Scene3Comparaison`/`Scene4Dette`/`Scene5Cta`) ; commentaire en tete de `whisper-words-senegal-short.ts` : « script FR condense NotebookLM » |

## 🔬 SECOND USAGE — la planche de slides pour IDÉER des scènes (à prouver)

Découvert le 2026-07-30 : les **slideshows** de NotebookLM proposent des traductions
visuelles qu'on n'aurait pas cherchées (il ignore tout de notre arsenal → remède au biais
du catalogue). Preuve de concept décidée par Aziz, **session future** :
→ `memory/starters/STARTER-PROMPT-preuve-concept-slide-nlm-vers-svg.md`
Références conservées : `public/_shared/refs/notebooklm-slides/` (1 bonne + 1 contre-exemple).

⭐ **La règle qui sort des 2 slides** : ce qui vaut, c'est la **trouvaille de traduction**,
jamais l'exécution — environ **une par lot**, pas une par slide.
⚠️ Ça inverse INTENTION → FORME → TEMPLATE : **écrire ce que la scène doit faire ressentir
AVANT d'ouvrir les images**, sinon on choisit la plus jolie et pas la plus juste.

## Faux ami

`scripts/archive/export-for-notebooklm.ts` — exporte la base de connaissance du projet pour
generer des Audio Overviews SUR le projet. Aucun rapport avec les Shorts, et archive.
