---
name: pipeline-voix-vivante-valide
description: Pipeline VALIDÉ (2026-06-10) pour une voix de narration EXPRESSIVE en gardant le timbre GéoAfrique — ElevenLabs V3 tags + Speech-to-Speech.
metadata:
  type: reference
---

# Pipeline VOIX VIVANTE — VALIDÉ Aziz 2026-06-10

> Résout la MONOTONIE de GéoAfrique V2. Validé après benchmark complet (ElevenLabs réglages, Hume Octave,
> Google Gemini TTS, Speech-to-Speech). Décision Aziz : ce pipeline est LE meilleur et le plus puissant.

## ⛔ POURQUOI DEUX ÉTAPES + POURQUOI "v2" (vérifié doc officielle 2026-07-08, Context7)
Question récurrente : « pourquoi un STS v2 après le V3 ? on ne peut pas juste faire GéoAfrique en V3 ? »
Réponse VÉRIFIÉE (doc `elevenlabs.io/docs/overview/models`) :
- `eleven_v3` = moteur **text-to-speech** (comprend les tags `[serious]`…). GéoAfrique N'EST PAS une voix V3
  (clone, `models=[]`) → elle ne peut pas prendre les tags ni être générée « en V3 ». D'où la ruse : Océane
  (voix V3) capte l'émotion → on transfère sur GéoAfrique via Speech-to-Speech.
- `eleven_multilingual_sts_v2` = **le voice changer state-of-the-art ACTUEL** (pas une vieille version). Le STS
  (conversion voix→voix) N'EXISTE QU'EN v2 chez ElevenLabs — **il n'y a pas de STS v3**. Les seuls modèles STS
  listés : `eleven_multilingual_sts_v2` (multilingue, le nôtre) et `eleven_english_sts_v2` (anglais seul).
- Donc le pipeline actuel est le SEUL possible avec cette architecture. On ne peut pas « s'arrêter au V3 ».
- ⚠️ Les DÉFORMATIONS de prononciation (« alliés »→« haïs », « renversent »→« rengarcent ») viennent de
  l'étape STS v2 (artefact de conversion, PAS de la source Océane). Parades : (1) segmenter + re-tirer le
  segment fautif (règle structurante ci-dessous) ; (2) stability STS plus haute (0.45→0.55) ; (3) paramètre
  `seed` (dispo à l'API STS) pour re-tirer de façon déterministe ; (4) CAPS/ellipses sur le mot fragile.

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

## LE PIPELINE (3 étapes)
1. **Écrire le texte avec des TAGS V3** : `[solemn]` `[whispers]` `[dramatic]` `[sad]` `[serious]` etc.,
   placés phrase par phrase selon l'émotion voulue (ex: `[whispers] Kidal.` pour un moment grave).
2. **Générer avec une voix V3 expressive** (modèle `eleven_v3`) — pas GéoAfrique (qui n'est PAS V3, models=[]).
   Voix V3 FR validée : **Océane "Oceane-V3-test"** `CqTrL0ThT2GJVJEIiLcY` (féminine, FR, narrative, ajoutée au compte).
3. **Convertir vers GéoAfrique via Speech-to-Speech** (`eleven_multilingual_sts_v2`, endpoint
   `/v1/speech-to-speech/z3gESu49naEZW8Af2Upm`) → l'intonation/les pauses/les nuances se TRANSMETTENT
   à ta voix de marque. Résultat = GéoAfrique mais VIVANTE.

## POURQUOI ça marche (constat Aziz à l'écoute)
- Le tag `[whispers]` ne donne pas un vrai chuchotement à la source, MAIS l'INTENTION (baisse d'intensité,
  pauses, intonation) se transmet fidèlement à GéoAfrique après conversion. "Les poses et intonations sont
  très très similaires." → on garde le timbre de marque + on pilote l'émotion par les tags. Game-changer.
- GéoAfrique seule plafonne (clone non optimisé V3, `models=[]`). Hume O2-FR ≈ équivalent EL sans gain.
  Hume O1 = accent anglo (échec). Google = bon mais "voix de conteur", trop posé/lent pour récit rapide.

## ✅ INDUSTRIALISÉ — `scripts/generate-narration-expressive.py` (2026-06-10)
Texte taggé → Océane V3 → STS GéoAfrique → mp3 (concat ffmpeg re-encode, upload catbox auto).
Flags : `--dry-run` (estime le coût SANS appel API — à lancer en premier),
`--sample` (1er segment seulement), `--sts-stability X` (override). `--text-file` ou `--text`.

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
- ÉVITER en registre documentaire : rires/soupirs/SFX (`[laughs]` `[sighs]` `[explosion]`) — hors ton analyste.
- Règle : 0.45 règle la prononciation GLOBALEMENT ; CAPS+ellipses = renfort PONCTUEL sur les mots/moments choisis.

## COÛT (vérifié API 2026-06-10) — double passe
- TTS V3 : **1 crédit/caractère** (tags inclus dans le décompte). STS : **1000 crédits/MINUTE** de durée audio.
- 1 narration mid-form ~5 min ≈ **~9 500 crédits** (4500 texte + 5000 durée). Compte Starter (30 600/mois) = intenable.
- **Reco plan : Creator $22/mois** (100k crédits ≈ 10 vidéos + itérations). Overage désactivé en Starter.
  Coupon premier-mois Creator déjà consommé sur le compte → plein tarif.

## VOIX SOURCES EXPRESSIVES dispo (compte EL)
- Océane V3 FR `CqTrL0ThT2GJVJEIiLcY` (LA source pour tags V3) ⭐
- Stephyra (pro, multilingual_v2, PAS V3) `QMNPncWXVcTVhJ9rDEQO` — naturellement expressive, sans tags.
- Paul K Deep French `5l4ttmr4SKNgi0HnOelT`. Valy Southern French `JgQlYGzpXIS8wtMbmdFv`.
- CIBLE conversion = GéoAfrique v2 (remix) `z3gESu49naEZW8Af2Upm`.

## À FAIRE PROCHAINE SESSION (recherches Aziz)
1. **WebSearch techniques expressivité V3 max** : majuscules (CAPS), `...`, placement tags, audio tags
   avancés (rires, soupirs, hésitations), prompting. Maintenant qu'on est en V3, ces leviers s'appliquent.
2. **API ElevenLabs pricing** : crédits API "+5$" vs passer au palier supérieur. Aziz proche du cap mensuel.
   Évaluer selon volume réel (mid-forms 7min ~7000 char/vidéo). Voir si pay-as-you-go ou tier sup.
3. Industrialiser le pipeline en 1 script + l'appliquer au Sahel V5 (narration-v5 à régénérer via ce pipeline).

## RÉFÉRENCES BENCHMARK (sauvegardées)
- `memory/tools/TTS-VOIX-VIVANTE-BENCHMARK-2026-06.md` (1er comparatif outils)
- `memory/tools/TTS-EXPRESSIVITE-RECHERCHE-2026-06.md` (techniques EL + post-process + Google)
- `memory/tools/hume-octave.md` (limites Hume FR : dilemme langue/acting)
