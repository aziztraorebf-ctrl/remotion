# TTS Expressivité — Recherche (juin 2026)

> Contexte : docs géopolitiques FR 6-8 min, eleven_v3, voix custom "GéoAfrique V2" jugée MONOTONE + léger artefact robotique. On RESTE sur ElevenLabs (clonage pro ne règle pas la monotonie ; Hume Octave 2 FR ≈ EL ; Octave 1 accent anglo). But : maximiser l'expressivité SUR EL + post-process + vérifier Google.
> Méthode : recherche web 2025-2026 (docs officielles EL + Google Cloud, comparatifs Podonos/MindStudio, tutos créateurs). VÉRIFIÉ vs SUPPOSÉ marqué explicitement.

---

## QUESTION 1 — Voix expressives sur ElevenLabs

### Verdict 1A : Voix PREMADE/catalogue vs clone instantané — LE CATALOGUE GAGNE pour v3 (VÉRIFIÉ)

C'est le point le plus important et il est **documenté noir sur blanc par ElevenLabs** :

- Sur **eleven_v3**, les **Professional Voice Clones (PVC) ne sont PAS encore optimisés** (modèle en research preview). EL recommande explicitement, je cite : *"find an Instant Voice Clone (IVC) or designed voice for your project if you need to use v3 features"*.
- Les voix de la **Voice Library** (10 000+ voix, dont une section "Expressive" et "Documentary Narrator") et les **voix "designed"** (créées par prompt texte : ton/âge/accent) **modulent mieux** les tags émotionnels que les clones.
- **La voix source compte PLUS que les réglages** : la doc v3 dit que *"the most important parameter for Eleven v3 is the voice you choose. It needs to be similar enough to the desired delivery."* Un clone instantané "neutre"/plat (ce qu'est probablement GéoAfrique V2) bridera l'expressivité **quoi qu'on règle**.

➡️ **Implication directe pour Aziz** : une voix custom clonée à partir d'un échantillon calme/neutre **plafonne** en expressivité. Le levier #1 n'est pas un réglage, c'est **le matériau de la voix**. Deux pistes : (a) tester des voix premade "Documentary Narrator/Expressive" FR du catalogue ; (b) re-cloner GéoAfrique à partir d'un échantillon BEAUCOUP plus expressif (cf. 1C).

### Verdict 1B : Speech-to-Speech (Voice Changer) — OUI, ça existe, et c'est la technique la plus puissante pour l'émotion (VÉRIFIÉ) — mais avec une nuance pour une voix de marque

ElevenLabs a bien un **Speech-to-Speech** (renommé **Voice Changer**, API `speech-to-speech/convert`). Principe : tu enregistres/uploades une performance vocale **humaine expressive**, l'outil la **convertit dans une voix cible en PRÉSERVANT ta cadence, tes inflexions, ton émotion** (chuchotements, rires, accents portés). C'est littéralement du **transfert de performance humaine sur une voix TTS**.

C'est **la vraie "technique secrète" d'expressivité** : l'émotion ne vient plus du modèle qui "devine" à partir du texte, elle vient d'un **humain qui joue** la prise. Pour de la narration documentaire, c'est ce qui te sort le plus sûrement de la monotonie.

⚠️ **Nuances honnêtes (non survendues)** :
- Il faut **un humain qui pose bien la voix** (Aziz ou un comédien) pour chaque prise. Ce n'est plus du "texte → audio" : c'est de la **post-synchro**. Coût en temps réel par épisode.
- La voix cible doit être une voix qui **module bien** (donc même logique que 1A : viser une voix premade/designed expressive comme cible, pas un clone plat).
- Réglage clé documenté : équilibre source/cible. Trop "cible" → désync avec la source ; trop "source" → on perd l'identité de la voix de marque. À calibrer.
- **Non vérifié** : la compatibilité fine Voice Changer ↔ identité exacte d'une voix custom donnée. À tester en pratique sur 1 phrase.

### Verdict 1C : Prompting v3 + réglage stability — les astuces qui marchent vraiment (VÉRIFIÉ doc EL + tutos)

Réglage **stability** (le plus important sur v3) — 3 modes :
- **Creative** : plus émotionnel/expressif, mais risque d'hallucinations.
- **Natural** : **meilleur équilibre** consistance ↔ réactivité aux tags. **→ recommandé pour narration vivante.**
- **Robust** : ≈ comportement v2, **supprime la réactivité aux audio tags**. À éviter si on veut sortir de la monotonie.

Astuces de prompting **concrètes et documentées** :
- **Longueur** : v3 instable sur prompts courts. Viser **>250 caractères** (plage utile 200-10 000). Donc **ne PAS découper en mini-fragments** : des phrases trop courtes APPAUVRISSENT l'expressivité v3 (contre-intuitif vs v2).
- **Ponctuation** : virgules = courtes respirations ; **points de suspension `...` = poids dramatique**, laissent "atterrir" un moment. Donne au modèle "un chemin à suivre" → plus naturel.
- **CAPITALISATION** = accent/stress sur un mot (`OH` vs `oh` change l'intensité).
- **Audio tags** `[...]` : `[whispers]`, `[sarcastic]`, `[curious]`, `[serious]`, etc. Deux usages : tag isolé = "beat" séparé ; tag en tête de phrase = **colore la livraison des mots suivants**. Pour un doc géopo : `[serious]`, `[thoughtful]`, `[grave]`, `[ominous]` en tête de paragraphe.
- **Transitions d'émotion graduelles** sur plusieurs phrases plutôt qu'un switch brutal dans une ligne.
- ⚠️ **FR + tags** : les tags sont surtout testés en anglais. **Non vérifié** qu'ils soient aussi fiables en FR. À tester ; rester sobre (1 tag par paragraphe).

### Verdict 1D : modèle v3 vs multilingual_v2 pour narration longue FR (PARTIEL)

- **v3** = le plus expressif (audio tags, dynamique large), MAIS research preview = moins stable, et **PVC non optimisés**.
- **multilingual_v2** = plus stable/prévisible, supporte mieux les PVC, mais expressivité plafonnée (pas d'audio tags).
- **Non vérifié de façon dure** : lequel est "meilleur" en FR long. Compromis classique : v3 pour la vie/émotion (au prix de relances), v2 pour la régularité. Pour résoudre une **monotonie**, v3 (Natural) est le bon pari.

### Classement Q1 par impact (le plus rentable d'abord)

1. **Changer le MATÉRIAU de la voix** (voix premade expressive du catalogue OU re-clone à partir d'un échantillon très expressif). Le levier le plus fort, et le moins cher en effort récurrent.
2. **Speech-to-Speech / Voice Changer** : performance humaine → voix de marque. L'arme anti-monotonie ultime, coût = une prise humaine par épisode.
3. **stability = Natural + prompting v3** (ellipses, CAPS, 1 audio tag/paragraphe, phrases NON-hachées >250 car).

---

## QUESTION 2 — Post-processing pour réchauffer / dé-robotiser un TTS

### Verdict Auphonic (HONNÊTE)

Auphonic fait du **mastering broadcast** : **loudness (LUFS), réduction de bruit/hum, filtrage, leveling adaptatif, dé-reverb**. C'est excellent pour rendre un audio **propre, constant, conforme** — **mais ce n'est PAS un outil de "chaleur/expressivité"**. Auphonic **ne va pas supprimer l'artefact "robotique"** ni ajouter de la vie : il nettoie et normalise. À garder en **dernière étape** (loudness final), pas comme solution au problème de monotonie. (Le "robotique" est un défaut de **timbre/prosodie**, pas de niveau/bruit — hors périmètre Auphonic.)

### Chaîne de post-process recommandée (réchauffer un TTS) — ordre précis

Source : consensus tutos vocal-processing 2025-2026 (Sonarworks, Unison, Kits.AI).

1. **EQ correctif** : atténuer **2-5 kHz** (zone où logent la plupart des artefacts "robotiques"/dureté). Léger **roll-off > 10 kHz** pour tuer le "fizz" numérique synthétique.
2. **De-esser** : cibler **5-8 kHz** (le TTS exagère souvent les sifflantes). Multibande de préférence.
3. **Compression douce** : ratio **2:1 à 3:1**, pour "coller" la voix et lisser les irrégularités de niveau **sans écraser** la dynamique. (C'est la dynamique qui fait le "vivant" — ne pas sur-compresser.)
4. **Saturation tape/tube subtile** (APRÈS la compression) : ajoute des **harmoniques + chaleur organique** que le TTS n'a pas. **C'est l'étape qui "humanise" le plus.**
5. **Reverb de pièce très légère, 5-10 % wet** : donne profondeur/espace, casse le côté "voix dans le vide".
6. **Loudness final** : Auphonic (ou un limiteur) pour normaliser à la cible YouTube (~-14 LUFS).

### Outils qui aident VRAIMENT (chaleur/naturel vs simple nettoyage)

- **Saturation/EQ/comp** (un DAW + plugins tape/tube, ou presets) → **la vraie chaleur**. C'est ici que ça se joue.
- **iZotope RX** → surtout **réparation/nettoyage** (de-noise, de-ess, de-click). Aide le "propre", **peu** le "chaud". Utile mais pas la réponse au robotique.
- **Adobe Podcast Enhance** → ⚠️ **À MANIER AVEC PRÉCAUTION sur un TTS** : c'est un modèle qui **re-prédit** la voix. Sur du déjà-synthétique, il peut **aplatir/altérer** la prosodie et **renforcer** le côté artificiel. Conçu pour de la vraie voix bruitée, pas pour "humaniser" un TTS déjà propre. À tester, mais **pas un pari sûr**.
- **Verdict** : la chaleur vient de **saturation + EQ + comp légère**, pas d'un "enhancer IA". L'IA répare le sale ; l'analogique (émulé) réchauffe.

⚠️ **Réalisme** : le post-process **adoucit** l'artefact robotique, il ne le **supprime** pas. Si la voix source est monotone, **aucun EQ ne crée de l'intonation**. Le post-process est un complément, pas la solution de fond — la solution de fond est en Q1 (matériau voix / speech-to-speech).

---

## QUESTION 3 — Google TTS : clonage dispo maintenant ?

### Modèles identifiés (VÉRIFIÉ)

- **Gemini-TTS** (`gemini-2.5-pro-tts` / `flash-tts`, et la lignée Gemini 3.1 Flash TTS) : contrôle **par langage naturel** ("dis ça d'un ton grave et lent") + SSML + tags émotion + pauses explicites + multi-locuteurs. Expressivité **genuinely excellente** pour podcast/audiobook. **PAS de clonage custom** : voix prédéfinies uniquement.
- **Chirp 3: HD voices** : voix HD prédéfinies, pas de clonage.
- **Chirp 3: Instant Custom Voice** : **LA fonction de clonage** de Google. Clone à partir de **~10 s d'audio** + déclaration de consentement.

### Le clonage custom Google EXISTE-T-IL en juin 2026 ? → OUI techniquement, MAIS en accès restreint (allow-list), pas GA (VÉRIFIÉ doc Google Cloud)

- **Chirp 3: Instant Custom Voice** permet bien le clonage (clé de clonage, 30+ locales **dont `fr-FR` confirmé**, EU + US).
- **MAIS** : *"Access to Instant Custom Voice is restricted to allow-listed users. To request access, contact a member of the sales team."* + endpoint **`v1beta1`** = **beta, pas GA**.
- Donc : quand Aziz a testé "il y a quelques semaines, pas de clonage" → c'était vrai pour **AI Studio / Gemini-TTS** (toujours pas de clonage là). **Le clonage existe via Cloud TTS API (Chirp 3)**, mais **derrière une allow-list commerciale**, pas en libre-service.

### Qualité FR + expressivité + verdict re-test

- **FR** : `fr-FR` supporté sur Chirp 3 ; Gemini-TTS FR de bonne qualité. **Non vérifié en profondeur** sur du FR narratif long (pas de comparatif FR dédié trouvé).
- **EL vs Gemini (comparatif Podonos)** : scores **similaires**, **EL légèrement devant** en qualité globale. Gemini **plus flexible** sur le contrôle stylistique (tags/pauses en langage naturel) et **moins cher à volume**. Gemini a montré **biais de genre** (voix masculines > féminines) et faiblesses noms propres/chiffres.
- **API/Prix** : Cloud TTS API dispo. Prix sur cloud.google.com/text-to-speech/pricing (non extrait ici), compétitif vs EL à grand volume.

➡️ **Verdict re-test** : **Pas une priorité maintenant pour le clonage** — la fonction custom est derrière une allow-list beta, donc pas un drop-in immédiat. **MAIS** ça vaut un test rapide de **Gemini-TTS (voix prédéfinie FR) + contrôle par langage naturel** : son point fort est précisément l'**expressivité dirigée par instruction**, ce qui attaque directement la monotonie — sans clonage. Si une voix prédéfinie FR Gemini sonne bien + dirigeable, c'est une alternative crédible. Le clonage de marque, lui, reste chez EL pour l'instant.

---

## RECOMMANDATION FINALE — 2-3 actions prioritaires contre la monotonie

On reste sur ElevenLabs. Par ordre de rentabilité :

1. **ATTAQUER LE MATÉRIAU DE LA VOIX (action #1, la racine du problème).**
   GéoAfrique V2 est probablement clonée d'un échantillon calme → elle plafonne. Deux tests :
   (a) essayer 2-3 voix **premade FR "Documentary Narrator / Expressive"** du catalogue EL sur un paragraphe réel ;
   (b) **re-cloner** GéoAfrique à partir d'un échantillon **délibérément plus expressif/dynamique** (la doc Google le dit aussi : "more expressive than the final output"). La voix source pilote tout.

2. **TESTER LE SPEECH-TO-SPEECH (Voice Changer) sur un paragraphe.**
   Aziz (ou un comédien) **joue** une prise expressive → conversion vers la voix de marque. C'est l'arme anti-monotonie la plus directe : l'émotion vient d'un humain, plus du modèle. Calibrer l'équilibre source/cible. Coût = une prise par épisode, à arbitrer selon le ROI ressenti.

3. **VERROUILLER les réglages + prompting v3 : stability = Natural**, phrases NON-hachées (>250 car), `...` pour le poids, CAPS pour l'accent, 1 audio tag sobre par paragraphe (`[serious]`, `[grave]`, `[thoughtful]`). **Puis** chaîne post-process légère (EQ -2/5kHz, de-ess, comp 2:1, **saturation tape subtile**, reverb 5-10%, Auphonic en loudness final).

**À NE PAS attendre** : qu'un post-process ou Auphonic "humanise" une voix plate — il adoucit, il ne crée pas d'intonation. **À garder en réserve** : Gemini-TTS (contrôle par langage naturel, sans clonage) comme alternative à tester si 1+2 déçoivent ; clonage Google = pas dispo en libre-service (allow-list beta) en juin 2026.

---

## Sources
- ElevenLabs v3 (catalogue/PVC non optimisés) : https://elevenlabs.io/blog/eleven-v3 · https://elevenlabs.io/v3 · https://elevenlabs.io/voice-library/expressive · https://elevenlabs.io/voice-library/documentary-narrator-voices
- Speech-to-Speech / Voice Changer : https://elevenlabs.io/blog/speech-to-speech · https://elevenlabs.io/docs/eleven-creative/playground/voice-changer · https://elevenlabs.io/voice-changer
- Prompting v3 (stability, tags, ponctuation) : https://elevenlabs.io/docs/best-practices/prompting/eleven-v3 · https://moelueker.com/blog/elevenlabs-v3-tutorial-best-settings-audio-tags-free-gpt-tool · https://audio-generation-plugin.com/elevenlabs-v3/
- Post-process TTS (EQ/comp/saturation/de-ess) : https://www.sonarworks.com/blog/learn/understanding-ai-voice-artifacts-and-how-to-minimize-them · https://www.sonarworks.com/blog/learn/mastering-ai-vocals-eq-and-compression-tips · https://unison.audio/vocal-processing-with-ai/ · https://voice.ai/hub/tts/how-to-make-text-to-speech-sound-less-robotic/
- Google Chirp 3 Instant Custom Voice (clonage, allow-list, fr-FR, v1beta1) : https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice
- Gemini-TTS (contrôle langage naturel) : https://docs.cloud.google.com/text-to-speech/docs/gemini-tts
- Gemini vs ElevenLabs : https://www.podonos.com/blog/gemini-vs-elevenlabs · https://www.mindstudio.ai/blog/gemini-31-flash-tts-review
