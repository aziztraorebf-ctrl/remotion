---
name: pipeline-voix-vivante-valide
description: Pipeline VALIDÉ (2026-06-10, mis à jour 2026-08-01) pour une voix de narration EXPRESSIVE en gardant le timbre GéoAfrique — ElevenLabs V3 tags + Speech-to-Speech. Voix source = Harmonie (remplace Océane).
metadata:
  type: reference
---

# Pipeline VOIX VIVANTE — VALIDÉ Aziz 2026-06-10, RÉVISÉ 2026-08-01/02

> Résout la MONOTONIE de GéoAfrique V2. Validé après benchmark complet (ElevenLabs réglages, Hume Octave,
> Google Gemini TTS, Speech-to-Speech). Décision Aziz : ce pipeline est LE meilleur et le plus puissant.

## ⭐⭐⭐ CHECKLIST — nouveau script voix, dans cet ordre

1. **Écrire le texte en paragraphes fusionnés** par vraie transition de sujet (pas une phrase par ligne —
   un saut de ligne = pause V3 implicite). Isoler dans leur propre paragraphe les phrases-effet courtes
   voulues telles quelles (anaphores, chutes) — ne pas les fusionner.
2. **Taguer** : tags de ton (`[deliberate]`/`[serious]`/`[curious]`/`[reflective]`...) en tête de
   paragraphe, tags de réaction humaine (`[inhales sharply]`, `[shocked]`, `[sighs]`) UNIQUEMENT sur les
   vrais moments-pivots (jamais `[laughs]`/`[clears throat]` — voir plus bas). `[pause]` NATIF dans le
   texte pour toute pause voulue (pas de silence splicé après-coup — voir § PAUSES). CAPS ciblées (1-2 par
   paragraphe max) sur le mot qui porte l'argument.
3. **Générer PAR PARTIE/ACTE** (jamais tout le script en un bloc) : voix source **Harmonie**
   (`obmcfXCePmPgsNsLIWIj`) → STS **GéoAfrique** (`z3gESu49naEZW8Af2Upm`), réglages ci-dessous.
4. **Écouter chaque partie** (Aziz) — aucun garde-fou automatique ne remplace ça (voir § garde-fou plus
   bas). Repérer : mots mal prononcés, artefacts (réverb/double-voix), rythme des pauses.
5. **Corriger par SPLICE** (segment localisé via forced-align, régénéré seul, recollé avec marge ~40ms)
   plutôt que re-tirer toute la partie — préserve ce qui était déjà bon. Garde-fou forced-align
   (comptage mots) après CHAQUE splice, puis ré-écoute.
6. **Concaténer** les parties finales (ffmpeg re-encode, jamais `-c copy`) → upload → mettre à jour le
   `SCRIPT-*-VOIX.md` de l'épisode avec le texte définitif (celui qui a produit l'audio, tags inclus).

## ⛔⛔ RÉVISION MAJEURE 2026-08-01 — Harmonie remplace Océane comme voix source

**Découverte** : le choix de la voix SOURCE (avant conversion STS) a un impact énorme sur le résultat final
— y compris APRÈS conversion vers GéoAfrique. Contredit l'hypothèse implicite depuis juin (on ne
questionnait jamais Océane, prise par défaut car seule voix FR déjà sur le compte compatible v3).

Voir [[feedback_voix-source-sts-determine-resultat-final]] pour le détail du test (9 voix comparées) et
[[feedback_tags-reactions-humaines-fonctionnent-bien-sts]] pour le test tags approfondi (rire/choc/souffle).

**Verdict Aziz (2026-08-01)** : **Harmonie** (`obmcfXCePmPgsNsLIWIj`, FR, "Energetic and Clear") est
supérieure à Océane sur toute la ligne — débit plus vivant, respirations perceptibles, émotion nettement
transmise après STS. **Devient la voix source par défaut du pipeline**, Océane reste disponible mais n'est
plus le défaut.

**Tags testés et confirmés fonctionner ADMIRABLEMENT BIEN via Harmonie→STS→GéoAfrique** (verdict Aziz) :
- `[deliberate]`, `[takes a deep breath]` (souffle) — transmis fidèlement, perceptible clairement
- `[inhales sharply]`, `[shocked]` (réaction de choc sur une révélation chiffrée) — émotion "très présente"
  dans l'original ET dans GéoAfrique après conversion
- Globalement : quasiment tous les tags testés passent bien, SAUF le rire.

**Seul echec identifié** : `[laughs]` sonne "un peu bizarre" — cohérent avec un problème connu et documenté
des moteurs TTS en général (le rire reste un artefact difficile pour la synthèse vocale, pas spécifique à
notre pipeline). → Continuer d'éviter `[laughs]`/`[giggles]` en production, mais lever l'interdiction
généralisée sur les autres tags "réaction humaine" (`[sighs]`, `[inhales sharply]`, `[gasps]`, `[shocked]`,
`[clears throat]`) qui étaient exclus par précaution en registre documentaire — ILS FONCTIONNENT.

**⚠️ NUANCE Aziz (2026-08-01, après test PARTIE 3 complète)** : ces tags fonctionnent TECHNIQUEMENT mais
ne sont pas tous à utiliser librement :
- `[takes a deep breath]` / souffle : PRUDENCE — ralentit l'action, mesuré à +15s sur 108s (+14%) sur
  4 tags. Réservé aux vrais moments de respiration narrative, pas systématique — si un rythme précis est
  voulu à un endroit, préférer `[pause]` natif dans le texte (voir § PAUSES plus bas) plutôt qu'empiler
  les tags de souffle, qui allongent sans donner de contrôle fin sur la durée.
- `[clears throat]` (raclement de gorge) : SONNE BIZARRE en registre narratif documentaire sauf usage
  humoristique très bien calé (savoir-faire/timing qu'on n'a pas encore) — À ÉVITER par défaut, au même
  titre que `[laughs]`.
- Le reste (`[inhales sharply]`, `[shocked]`, `[gasps]`, `[sighs]`) : "fonctionne très bien" pour la
  majorité, à garder comme outil sur les moments-pivots (choc, révélation).
- **Chaque tag de réaction ajoute une VRAIE durée audio** (le son est généré, pas juste une couleur) —
  budgéter en conséquence sur un script long (5 parties × plusieurs tags = minutes ajoutées, impacte le
  montage ET le coût STS facturé à la minute).

**Implication stratégique (Aziz)** : ceci ouvre une nouvelle façon d'écrire les scripts voix — pas juste un
texte narré avec quelques tags de couleur ponctuels, mais un texte scénarisé avec emphase et réactions
placées délibérément aux moments-pivots (révélation chiffrée, choc narratif, respiration avant un virage).
Le texte voix devient un vrai script de performance, pas juste un texte à lire.

## ⛔ POURQUOI DEUX ÉTAPES + POURQUOI "v2" (vérifié doc officielle 2026-07-08, Context7)
Question récurrente : « pourquoi un STS v2 après le V3 ? on ne peut pas juste faire GéoAfrique en V3 ? »
Réponse VÉRIFIÉE (doc `elevenlabs.io/docs/overview/models`) :
- `eleven_v3` = moteur **text-to-speech** (comprend les tags `[serious]`…). GéoAfrique N'EST PAS une voix V3
  (clone, `models=[]`) → elle ne peut pas prendre les tags ni être générée « en V3 ». D'où la ruse : une
  voix source V3 expressive capte l'émotion → on transfère sur GéoAfrique via Speech-to-Speech.
- `eleven_multilingual_sts_v2` = **le voice changer state-of-the-art ACTUEL** (pas une vieille version). Le STS
  (conversion voix→voix) N'EXISTE QU'EN v2 chez ElevenLabs — **il n'y a pas de STS v3**. Les seuls modèles STS
  listés : `eleven_multilingual_sts_v2` (multilingue, le nôtre) et `eleven_english_sts_v2` (anglais seul).
- Donc le pipeline actuel est le SEUL possible avec cette architecture. On ne peut pas « s'arrêter au V3 ».
- ⚠️ Les DÉFORMATIONS de prononciation (« alliés »→« haïs », « renversent »→« rengarcent ») viennent de
  l'étape STS v2 (artefact de conversion, PAS de la source). Parades : (1) segmenter + re-tirer le
  segment fautif (règle structurante ci-dessous) ; (2) stability STS plus haute (0.45→0.55) ; (3) paramètre
  `seed` (dispo à l'API STS, jamais implémenté dans notre script — TODO) pour re-tirer de façon
  déterministe ; (4) CAPS/ellipses sur le mot fragile.

## ⛔⛔ MÉTHODE AUDIT AUDIO — WHISPER MENT, L'OREILLE D'AZIZ TRANCHE (gravé 2026-07-08, Soudan Acte 2)
Session pénible (6 régénérations) dont voici les leçons DURES pour ne jamais recommencer :
1. **NE PAS auditer la prononciation avec whisper.** Whisper "corrige" à la transcription ce que l'oreille
   entend baver : il écrit "alliés" alors que le STS a prononcé "à lui". Whisper sert UNIQUEMENT à aligner les
   timings (mots→frames), JAMAIS à juger si un mot est bien prononcé. Seule l'écoute d'Aziz valide la prononciation.
2. **Le STS bave systématiquement sur les "é" TONIQUES en finale de mot** (alliés, rivalité, tiré, accepté, céder).
   PARADE = reformuler pour finir les groupes sur : infinitif "-er" atone (reculer, l'emporter), "-u" (voulu),
   consonne, ou déplacer le mot en milieu de phrase. Appliquer la règle CLAUDE.md "zéro participe é/ée en fin de
   groupe" DÈS L'ÉCRITURE du script, pas après coup mot par mot. Ex. validés : alliés→partenaires, rivalité→
   affrontement, "accepté de céder"→"voulu reculer", "tiré le premier"→"ouvert le feu en premier".
3. **NE PAS sur-segmenter.** 9 micro-segments d'une phrase = collage sec + défauts de bord (le 1er/dernier mot
   d'un segment isolé est moins bien prononcé). SWEET SPOT = 2-3 GROS BLOCS cohérents (flux continu, intonation
   qui coule). Re-tirage par bloc si besoin.
4. **Silences aux jonctions** : concaténer les blocs bord-à-bord = rythme haché. Insérer ~0.7s de silence
   (`ffmpeg -f lavfi -i anullsrc -t 0.7`) entre blocs = respiration naturelle.
5. **Le STS n'est pas déterministe** : un mot qui bave peut passer au tirage suivant (aléa ElevenLabs). Avant de
   reformuler un mot légitime, re-tirer le bloc 1× peut suffire.
6. **Couper la dernière seconde** si coupure brusque en fin (`ffmpeg -t <durée-1s>`).
7. STABILITY = **0.45** (défaut doctrine). NE PAS monter à 0.5+ (avale des syllabes). Tester A/B court sur le
   segment le plus fragile si doute, Aziz écoute.

## ⭐⭐ STRUCTURE DU TEXTE > TAGS (découvert 2026-08-01, Gazoduc)
Voir [[feedback_pauses-viennent-sauts-de-ligne-pas-tags]]. Un texte découpé en une phrase par paragraphe
(saut de ligne après chaque phrase) déclenche une pause V3 implicite à CHAQUE fin de phrase, même sans
aucun tag `[pause]`. AVANT d'écrire les tags, fusionner le texte en paragraphes qui suivent les VRAIES
transitions de sujet (3-5 blocs par partie, pas une ligne par phrase). Ajouter des MAJUSCULES ciblées
(1-2 par paragraphe max, sur le mot qui porte l'argument) — effet confirmé fort et sous-utilisé jusqu'ici.

## ⭐ CONFIRMATION 2026-08-01 (Gazoduc P2/P4/P5) — Auphonic NE règle PAS les artefacts STS
Aziz a repéré sur la 1ère régénération complète : mot mal formé par le TEXTE ("de long" prononcé "de lonn"
→ corrigé en "de longueur" ; "solennité" mot lourd/rare à l'oral → remplacé) VS artefacts ALÉATOIRES du STS
(double-voix/réverbération sur "aucun des deux ne verra jamais fini", coupure sur "point de passage",
grincement en ouverture de clip). Question posée : Auphonic peut-il nettoyer ça ? **Non** — confirmé de
nouveau : Auphonic = loudness/EQ/dé-bruitage, aucune fonction de pitch/prosodie/réparation d'artefact de
génération (déjà établi dans [[TTS-VOIX-VIVANTE-BENCHMARK-2026-06]]). **Solution qui a marché** : corriger
les vrais problèmes de texte, puis RE-TIRER le bloc entier (pas de correction audio post-hoc possible sur
un artefact de conversion STS) — cohérent avec la règle déjà écrite "le STS n'est pas déterministe, un
nouveau tirage suffit souvent" (section MÉTHODE AUDIT AUDIO ci-dessus). Le paramètre `seed` (jamais
implémenté, cf TODO) permettrait de fixer un bon tirage une fois trouvé plutôt que de re-tirer à l'aveugle.

## ⭐⭐ SPLICE — remplacer UN segment fautif sans re-tirer tout le bloc (construit 2026-08-01)

**Le problème résolu** : le STS n'est pas déterministe. Re-tirer TOUT un bloc pour corriger un seul mot
remet en jeu au hasard le reste du bloc (déjà bon) — vécu concrètement sur Gazoduc P2 ("si vous lisez la
presse" était parfait, re-tiré par erreur pour corriger "de longer" ailleurs dans le même bloc, ce qui
aurait pu le dégrader). Demande explicite d'Aziz : construire un vrai outil de splice réutilisable plutôt
que du bricolage ponctuel.

**Outil** : `scripts/tools/splice-segment.py` — remplace un segment `[cut_s, resume_s]` d'un audio déjà
validé par un nouveau clip régénéré séparément, recolle avec crossfade ffmpeg (défaut 0.08s).

**Méthode complète (3 étapes)** :
1. **Localiser** le segment fautif via forced alignment sur l'audio existant :
   `python3 scripts/tools/forced-align.py <original.mp3> <texte-tel-que-genere.txt> <mots-repere>`
   → lire `<original>.alignment.json` pour les timestamps mot-à-mot exacts. Choisir `cut_s`/`resume_s` sur
   les frontières de PHRASE (pas le mot isolé — la doctrine "NE PAS sur-segmenter" s'applique aussi ici :
   quelques mots de contexte avant/après pour que la prosodie recolle).
2. **Régénérer UNIQUEMENT ce segment** (texte corrigé) via le pipeline normal (voix source V3 → STS
   GéoAfrique), à part, dans un fichier séparé.
3. **Spliced** : `python3 scripts/tools/splice-segment.py <original.mp3> <replacement.mp3> <cut_s>
   <resume_s> <out.mp3>` — découpe l'original en 2 (avant/après), crossfade avec le remplacement aux 2
   jonctions.

**⛔ GARDE-FOU OBLIGATOIRE après tout splice** : relancer `forced-align.py` sur le résultat, vérifier que le
nombre de mots retrouvés == nombre de mots du texte complet corrigé (aucune perte/duplication à la
jonction). Validé sur Gazoduc P2 (2026-08-01) : 280/280 mots retrouvés après splice de la phrase "de
longer"→"de suivre", reste du clip strictement inchangé.

**⛔⛔ LE COMPTE DE MOTS NE SUFFIT PAS — vérifier aussi la MARGE aux jonctions (bug trouvé Aziz 2026-08-01)**
Le garde-fou "280/280 mots" ne détecte QUE les mots manquants/dupliqués — il ne détecte PAS un mot dont
l'attaque ou la chute a été rognée par une coupe ffmpeg trop serrée. Cause : `cut_s`/`resume_s` pris
directement égaux aux timestamps `.end`/`.start` de forced-align (marge = 0ms) — la coupe peut alors
trancher pile dans le son du mot voisin. Symptôme signalé par Aziz : "le mot qui suit une pause sonne
coupé, pas de temps de respiration". Confirmé sur TOUTES les jonctions P2/P4 de cette session (marge 0ms
partout), pas un cas isolé.
**Règle corrigée** : toujours calculer `cut_s = <fin du mot précédent> + marge` et `resume_s = <début du
mot suivant> - marge`, avec marge ≈ 0.04s (40ms) par défaut. Si le gap naturel entre les deux mots est plus
court que 2×marge (cas de mots très rapprochés), réduire la marge proportionnellement (ex. 0.015s) plutôt
que de la mettre à 0 — ne JAMAIS coller exactement sur les timestamps bruts. Vérifier le gap disponible
(`w[i].start - w[i-1].end` sur les mots encadrants) avant de choisir la marge, pas une valeur fixe aveugle.

**⛔⛔⛔ LE GARDE-FOU (compte de mots + marge) NE COUVRE PAS LA QUALITÉ SONORE — l'écoute d'Aziz reste
irremplaçable.** Ni le compte de mots ni la vérification de marge ne détectent : un artefact de
réverbération/double-voix (le bug qui a motivé les splices "indispensable"/"RÉTRÉCIT" sur P4), une
prononciation baveuse sur un "é" tonique (déjà documenté), ou tout autre défaut de TIMBRE. Ces deux
garde-fous ne prouvent QUE l'absence de perte/coupure de texte — ils ne prouvent jamais qu'un segment
"sonne bien". Ne jamais présenter un splice/re-tirage comme "réglé" sur la seule base du script
forced-align — l'écouter (ou le faire écouter à Aziz) reste une étape obligatoire, pas optionnelle même
quand le garde-fou texte passe au vert.

**⭐ Le splice fonctionne PARTOUT dans la timeline, y compris en tout DÉBUT de clip** (validé Aziz 2026-08-01,
Gazoduc P4 : segment fautif = les tout premiers mots du clip, `cut_s=0`, aucune partie "avant" à préserver).
Bug corrigé dans le script : `ffmpeg -ss 0 -to 0` plantait (segment de durée nulle) — `splice-segment.py`
gère maintenant explicitement les 3 cas (milieu / début / fin de timeline), pas de crossfade côté absent.
Ne PAS se limiter au "re-tirage si c'est en ouverture" — le splice est la méthode par défaut pour UN
segment fautif isolé, quelle que soit sa position. Re-tirage complet reste justifié seulement si plusieurs
erreurs dispersées rendent le splice répété plus complexe qu'un nouveau tirage.

## ⭐⭐⭐ PAUSES — méthode PAR DÉFAUT = tag `[pause]` NATIF régénéré + splice, PAS `pauses-sur-original.py`
(tranché Aziz 2026-08-02, Gazoduc P4 Round 12/13)

**Comparé en side-by-side sur le même passage** : (A) silence artificiel `anullsrc` splicé après-coup via
`pauses-sur-original.py`, même avec la marge corrigée (~40ms) — reste un collage mécanique : pas de
ralentissement avant la pause, pas d'élan à la reprise, la voix "ne sait pas" qu'elle vient de faire une
pause. (B) tag `[pause]` écrit DANS le texte envoyé au TTS (Harmonie), régénéré (segment ou bloc entier),
avec ou sans splice ensuite — Harmonie produit elle-même la prosodie de transition (ralentit, silence,
reprend avec élan). **Verdict Aziz : B nettement supérieur, "cette version me convient"** — généralisé à
tout P4 (régénération complète du bloc avec `[pause]` natif intégré au texte, Round 13).

**Règle retenue pour la suite** : générer des BOUTS D'AUDIO COMPLETS (émotion + pause incluses dans le
texte envoyé au TTS) et les SPLICER dans l'audio existant — pas poser un silence mécanique après-coup.
C'est la méthode par défaut désormais. `pauses-sur-original.py` (silence `anullsrc` + marge) **reste utile
en filet de secours** : réparation ultra-rapide sur un audio déjà validé sans vouloir ré-consommer de
crédits API, ou micro-ajustement de timing pur sans changement de contenu — mais pas le premier réflexe.

**Conséquence pratique** : pour une pause à un endroit donné, le workflow devient (1) écrire `[pause]` (ou
`[deliberate]`/autre tag) directement dans le texte du segment/bloc concerné, (2) régénérer ce segment via
Harmonie→STS (pas tout le clip si only un point précis à corriger — voir méthode splice ci-dessus), (3)
spliceer dans l'audio existant avec `splice-segment.py`, (4) garde-fou forced-align.

**⚠️ Pattern "artefact en ouverture de clip" (P4/P5, signalé 2026-08-01) — PROBABLEMENT PAS un pattern
réel** : rétrospectivement, la vraie cause de ces artefacts était le bug de marge zéro (ci-dessus), déjà
présent à CE moment de la session sur toutes les jonctions, pas spécifique à l'ouverture. Aucune preuve
distincte d'un risque accru en tout début de clip une fois ce bug corrigé — ne pas traiter comme un
pattern établi, juste un faux signal probable à ne pas ressortir sans nouvelle observation indépendante.

## LE PIPELINE (3 étapes)
1. **Écrire le texte en paragraphes fusionnés** (transitions de sujet réelles, pas phrase par phrase) avec
   des TAGS V3 ciblés : `[solemn]` `[whispers]` `[dramatic]` `[sad]` `[serious]` `[shocked]` `[inhales sharply]`
   `[takes a deep breath]` `[sighs]` etc., placés aux moments-pivots (révélation chiffrée, choc, respiration
   avant virage) — PAS `[laughs]` (seul tag qui sonne mal, confirmé 2026-08-01). CAPS sur les mots-clés
   porteurs d'argument (1-2 par paragraphe).
2. **Générer avec une voix V3 expressive** (modèle `eleven_v3`) — pas GéoAfrique (qui n'est PAS V3, models=[]).
   **Voix V3 FR par défaut : Harmonie** `obmcfXCePmPgsNsLIWIj` (féminine, FR, "Energetic and Clear" —
   remplace Océane depuis 2026-08-01, verdict Aziz après comparaison de 9 candidates).
3. **Convertir vers GéoAfrique via Speech-to-Speech** (`eleven_multilingual_sts_v2`, endpoint
   `/v1/speech-to-speech/z3gESu49naEZW8Af2Upm`) → l'intonation/les pauses/les nuances/le DÉBIT/l'ÉNERGIE de
   la source se TRANSMETTENT à ta voix de marque. Résultat = GéoAfrique mais VIVANTE.

## POURQUOI ça marche (constat Aziz à l'écoute)
- Le tag `[whispers]` ne donne pas un vrai chuchotement à la source, MAIS l'INTENTION (baisse d'intensité,
  pauses, intonation) se transmet fidèlement à GéoAfrique après conversion. "Les poses et intonations sont
  très très similaires." → on garde le timbre de marque + on pilote l'émotion par les tags. Game-changer.
- **2026-08-01** : la voix SOURCE elle-même (pas seulement les tags) transmet son débit/énergie/couleur —
  effet plus fort que prévu, y compris une légère coloration d'accent régional observée sur certaines voix
  candidates testées. Confirme que le STS n'est pas un simple "revoicing neutre" : il transporte une bonne
  part de la performance complète (rythme, souffle, émotion), pas juste l'intonation.
- GéoAfrique seule plafonne (clone non optimisé V3, `models=[]`). Hume O2-FR ≈ équivalent EL sans gain.
  Hume O1 = accent anglo (échec). Google = bon mais "voix de conteur", trop posé/lent pour récit rapide.

## ✅ INDUSTRIALISÉ — `scripts/generate-narration-expressive.py` (2026-06-10)
Texte taggé → voix source V3 → STS GéoAfrique → mp3 (concat ffmpeg re-encode, upload catbox auto).
Flags : `--dry-run` (estime le coût SANS appel API — à lancer en premier),
`--sample` (1er segment seulement), `--sts-stability X` (override). `--text-file` ou `--text`.
✅ `VOICE_V3_OCEANE` mis à jour vers Harmonie (`obmcfXCePmPgsNsLIWIj`) dans le script — fait 2026-08-02.

## ⭐ RÈGLE STRUCTURANTE — GÉNÉRER PAR ACTE/SCÈNE, JAMAIS EN BLOC (validé Aziz 2026-06-10)
NE PAS générer une narration longue en un seul fichier. Toujours découper en PARTIES/ACTES/SCÈNES dès
la génération, en sortant UN mp3 par partie (+ concat optionnel pour écoute globale). Raisons :
1. **Réparation chirurgicale** : un mot bave / micro-coupure dans la Partie 3 → régénérer la Partie 3 SEULE
   (quelques centaines de crédits) au lieu des 7 min entières.
2. **Pas de re-découpage tardif** : l'audio SERA de toute façon découpé pour le montage (chaque partie = ses
   beats + son forced alignment). Le faire dès la génération évite de re-segmenter pendant la phase de code.
Marqueur dans le texte taggé : ligne `### PARTIE <n> — <titre>`. Le script sort `narration-pXX.mp3` par partie.
Micro-coupures STS = NON bloquantes (disparaissent sous SFX/musique). Auphonic = option declics si besoin, pas systématique.

## CODE DE RÉFÉRENCE (réglages VALIDÉS render)
- Génération V3+tags : POST `/v1/text-to-speech/<voiceV3>` model `eleven_v3`, voice_settings
  {stability 0.30, similarity 0.75, style 0.0, speed 1.0}. Tags DANS le texte.
- Speech-to-Speech : POST `/v1/speech-to-speech/<GEOAFRIQUE>` multipart (`audio` file),
  data model_id `eleven_multilingual_sts_v2`, voice_settings {**stability 0.45** ⭐, similarity 0.80, style 0.0}.
- Limite 5000 char/appel → découper long format (voir elevenlabs.md pipeline TTS-safe).

## ⭐ RÉGLAGE STS stability = 0.45 (VALIDÉ Aziz 2026-06-10, test A/B/C)
- stability 0.30 (1er défaut doctrine) BAVAIT sur certaines voyelles ouvertes → artefact prononciation
  (mot "épreuve" déformé, repéré à l'oreille par Aziz). C'est un artefact de la CONVERSION STS, pas de la source.
- **0.45 corrige la prononciation SANS perdre l'expressivité** transmise par les tags V3. Validé sur 2 variantes
  (B = texte original + 0.45 ; C = CAPS+ellipse + 0.45) — les deux propres et vivantes. → défaut série gravé dans le script.

## LEVIERS EXPRESSIVITÉ V3 (sur le TEXTE, ponctuels — pas systématiques)
- **CAPS** sur un mot = emphase + articulation plus nette (`mis à l'ÉPREUVE`). Utile sur mot fragile ou à appuyer.
- **Ellipses `...`** = pause/respiration, isole un mot, suspension avant un nom fort (`...une ville... Kidal.`).
- **Tags débit** : `[deliberate]` `[slows down]` ralentissent la zone. `[solemn]` `[serious]` `[reflective]` `[tense]` `[calm]`.
- **Tags réaction humaine** (`[sighs]` `[inhales sharply]` `[gasps]` `[shocked]` `[clears throat]` `[takes a
  deep breath]`) : CONFIRMÉS fonctionner bien via Harmonie→STS (2026-08-01) — ne plus les éviter par défaut.
  SEUL `[laughs]` reste à éviter (sonne artificiel, limite connue des moteurs TTS en général, pas spécifique
  à notre pipeline).
- Règle : 0.45 règle la prononciation GLOBALEMENT ; CAPS+ellipses+réactions humaines = renfort PONCTUEL sur
  les mots/moments choisis (révélation chiffrée, virage narratif, moment de tension).

## COÛT (vérifié API 2026-06-10) — double passe
- TTS V3 : **1 crédit/caractère** (tags inclus dans le décompte). STS : **1000 crédits/MINUTE** de durée audio.
- 1 narration mid-form ~5 min ≈ **~9 500 crédits** (4500 texte + 5000 durée). Compte Starter (30 600/mois) = intenable.
- **Reco plan : Creator $22/mois** (100k crédits ≈ 10 vidéos + itérations). Overage désactivé en Starter.
  Coupon premier-mois Creator déjà consommé sur le compte → plein tarif.

## VOIX SOURCES EXPRESSIVES dispo (compte EL)
- **Harmonie V3 FR** `obmcfXCePmPgsNsLIWIj` — **DÉFAUT depuis 2026-08-01** ⭐⭐ ("Energetic and Clear").
- Océane V3 FR `CqTrL0ThT2GJVJEIiLcY` — ancien défaut, gardée en réserve.
- Autres candidates FR "energetic" testées 2026-08-01 (non retenues, voir comparaison) : Claudia, Marie
  Line, Sarah (Energetic), Solene, Yariq (M), Simon (M), Nic (M) — toutes compatibles v3, dispo si besoin
  de re-tester. Liste complète Voice Library : `memory/tools/elevenlabs-nouveautes-2026-08.md`.
- Stephyra (pro, multilingual_v2, PAS V3) `QMNPncWXVcTVhJ9rDEQO` — naturellement expressive, sans tags.
- Paul K Deep French `5l4ttmr4SKNgi0HnOelT`. Valy Southern French `JgQlYGzpXIS8wtMbmdFv`.
- CIBLE conversion = GéoAfrique v2 (remix) `z3gESu49naEZW8Af2Upm`.

## ✅ FAIT (2026-08-02) — anciens points 1-2 : script mis à jour vers Harmonie, Gazoduc complet régénéré/assemblé/uploadé.

## BACKLOG (pas urgent)
- Ajouter le paramètre `seed` au script pour re-tirage déterministe sur mots fragiles (jamais implémenté).
- Tester le bouton "Enhance" EL comme second avis sur un texte déjà taggé manuellement.

## RÉFÉRENCES BENCHMARK (sauvegardées)
- `memory/tools/TTS-VOIX-VIVANTE-BENCHMARK-2026-06.md` (1er comparatif outils)
- `memory/tools/TTS-EXPRESSIVITE-RECHERCHE-2026-06.md` (techniques EL + post-process + Google)
- `memory/tools/hume-octave.md` (limites Hume FR : dilemme langue/acting)
- `memory/tools/elevenlabs-nouveautes-2026-08.md` (veille août 2026 : seed param, bouton Enhance)
- [[feedback_pauses-viennent-sauts-de-ligne-pas-tags]] (structure texte > tags)
- [[feedback_voix-source-sts-determine-resultat-final]] (choix voix source = levier majeur)
- [[feedback_tags-reactions-humaines-fonctionnent-bien-sts]] (tags choc/souffle confirmés, rire = seul échec)
