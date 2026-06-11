# Benchmark TTS — Voix FR narrativement vivante (juin 2026)

> Objectif : trancher la monotonie de la voix narration "GéoAfrique V2" (ElevenLabs `eleven_v3`, voice_id `z3gESu49naEZW8Af2Upm`, stability 0.22 / similarity 0.55 / style 0.55 / speed 1.0).
> Méthode : WebSearch + WebFetch, sources 2025-2026 listées en bas. Distinction explicite VÉRIFIÉ / SUPPOSÉ à chaque point.

---

## VERDICT sur la question centrale

**Le Professional Voice Cloning (PVC) d'ElevenLabs ne résoudra PROBABLEMENT PAS la monotonie.** (confiance : élevée sur le principe, à confirmer à l'oreille)

Raison vérifiée : le PVC améliore surtout la **fidélité/ressemblance** et la **cohérence** de la voix (fine-tuning des poids du modèle sur 30+ min d'audio), pas l'expressivité intrinsèque. La doc et les analyses 2026 sont convergentes :
- La gamme émotionnelle d'une voix clonée **reflète l'audio d'entrée** : un dataset plat/monotone → clone plat. "If the dataset lacks expressive variations or contains flat, monotonous speech, the resulting voice clone will reflect those same qualities." (cloudthat, ElevenLabs docs)
- Le PVC "handle emotional range better" que l'Instant **uniquement par rapport à l'Instant** — ce n'est pas un saut d'expressivité absolu, c'est moins de lissage et plus de cohérence.

**Nuance importante (à ne pas zapper) :** une partie du "robotique de fond" que décrit Aziz peut venir de la voix custom ELLE-MÊME (probablement un Instant Clone ou une voix Designed sur dataset limité). Dans ce cas précis, refaire la voix en **PVC sur un dataset d'entrée EXPRESSIF** (lecture jouée, modulée, pas une diction neutre) PEUT réduire le "lissage" et donner plus de matière au modèle. Mais ça ne crée pas de l'intonation qui n'existe pas dans le dataset.

**Conclusion opérationnelle :** la monotonie se règle d'abord au niveau **modèle + réglages + écriture des tags**, pas par le clonage. Le clonage est un levier de *cohérence de marque*, pas d'expressivité. Si après réglages ElevenLabs plafonne encore, le vrai changement de palier expressif se trouve **chez Hume Octave** (modèle conçu autour de la prosodie émotionnelle explicite).

**Auphonic ne réglera PAS la monotonie** (vérifié) : il ne fait que loudness / EQ / débruitage / dé-ess. Aucune fonction de pitch/prosodie. Il polit le son, il ne le rend pas vivant. Garder Auphonic en fin de chaîne pour le mastering, jamais comme solution à la monotonie.

---

## Tableau comparatif

| Moteur | Expressivité FR | Clonage voix | Prix (ordre de grandeur) | API | Verdict pour Aziz |
|---|---|---|---|---|---|
| **ElevenLabs `eleven_v3`** | Élevée (la + expressive d'EL), via audio tags ; français dans 70+ langues | Instant (1-2 min) + **PVC** (30+ min, sur Creator+) | Creator 22$/mois, 100k car. | Oui (mature) | **Garder. Optimiser réglages d'abord.** v3 EST déjà le sommet expressif d'EL — pas de v4. |
| **Hume Octave (Octave 2)** | **La + haute** : modèle "speech-language" qui lit le SENS avant de générer + contrôles prosodiques explicites (happiness/sadness/calm/intensity). FR officiellement supporté (11 langues) | Oui (depuis échantillons) | ~150$/M car. (Creator overage) / 100$/M (Business) | Oui | **LE vrai concurrent expressif.** À benchmarker si EL plafonne. Risque : "English-first, expanding" → vérifier la qualité FR à l'oreille. |
| **Cartesia Sonic 3.5** | Bonne, naturelle ; FR cité comme langue à perf "step-change". Optimisé temps réel (<100ms) | Instant (3s) + pro (10 min) | ~très bas au caractère ; Pro 4-5$/mois | Oui | Pensé pour agents conversationnels temps réel, pas pour narration jouée premium. Moins le bon outil ici. |
| **Scenema Audio** | Très haute en théorie (émotion pilotée par le prompt, arcs émotionnels intra-génération) ; FR + accent parisien démontré | Zero-shot (clip 10s) | Plateforme SaaS (free tier) OU auto-hébergé Docker | Pas d'API claire (juin 2026) | **Modèle open-source (LTX 2.3, MIT)**, jeune. Prometteur mais NON éprouvé en prod, pas d'API stable confirmée. À tester en R&D, pas pour 8 vidéos en cours. |
| **OpenAI TTS** | Moyenne-haute (instructions naturelles), pas de clonage de marque custom fiable | Non (voix fixes) | Pay-per-use | Oui | Écarté : pas de voix de marque clonable. |
| **PlayHT / Minimax / Microsoft** | Variable ; large couverture multilingue | Oui selon offre | Variable | Oui | Non prioritaires : aucun n'a la réputation "voix FR la plus vivante" en 2026. |

> Réputation "voix la plus émotionnelle/vivante" en 2026 (vérifié sur comparatifs SurePrompts/Coval) : **Hume Octave** pour l'émotion qui "land precisely", **ElevenLabs** pour le clonage le plus indiscernable. Pour une narration documentaire FR jouée, ces deux-là sont les seuls candidats sérieux.

---

## Pourquoi v3 sonne "un peu robotique" malgré les tags — points vérifiés

- **v3 est bien le modèle le + expressif d'ElevenLabs** ; il n'existe PAS de v4 (le "nouveau modèle mars 2026" = simplement la disponibilité générale de v3 sur tous les tiers, pas un nouveau moteur). Donc on ne "rate" aucun modèle plus expressif chez EL.
- v3 a **3 modes de stability** : Creative (le + expressif, mais hallucine), Natural (équilibré), Robust (le + stable/plat). Le réglage actuel d'Aziz (stability 0.22) est bas = bon réflexe pour l'expressivité, mais l'UI v3 récente raisonne en modes plutôt qu'en valeur seule — **vérifier qu'on est bien en mode Creative**.
- **Limites connues des tags v3** : pas de SSML break ; trop de tags ou de balises de pause → instabilité, accélérations, artefacts. Un tag qui contredit la voix (voix calme + `[shout]`) → résultat faible. Donc empiler `[tense][solemn][dramatic tone]` peut PARADOXALEMENT aplatir/abîmer.

---

## 3 PISTES classées par effort/gain

### Piste 1 — GRATUIT / immédiat : ré-optimiser ElevenLabs v3 (effort très bas, gain moyen-élevé)
Avant tout changement de moteur, épuiser ces leviers sur la voix existante :
- **Passer explicitement en mode Creative** (vérifié : le + émotionnel). Tester stability ~0.20-0.30 mais via le sélecteur de mode, pas que la valeur.
- **Baisser `style`** : un style trop haut peut figer la voix. Tester style 0.30-0.40 vs 0.55 actuel.
- **Alléger les tags** : 1 tag émotionnel par phrase-clé max, pas d'empilement. Privilégier la **ponctuation** (points de suspension, virgules, phrases courtes) qui pilote le pacing v3 mieux que les tags.
- **Réécrire pour l'oral joué** : phrases plus courtes, ruptures, questions. v3 module sur la structure du texte, pas seulement sur les tags.
- Garder Auphonic en mastering final uniquement.
> Si après ça la voix reste "robotique derrière" → le plafond est le modèle/voix, passer Piste 2 ou 3.

### Piste 2 — Cohérence de marque : refaire la voix en PVC (effort moyen, gain INCERTAIN sur la monotonie)
Pertinent SEULEMENT si la voix custom actuelle est un Instant Clone / Designed sur dataset limité, ET si Aziz peut fournir **30+ min d'audio source EXPRESSIF** (lecture jouée, modulée — pas une diction neutre).
- Gain réel attendu : moins de lissage, meilleure cohérence inter-vidéos, peut-être un peu plus de matière émotionnelle.
- **Ne pas en attendre un saut d'expressivité** : si le dataset est neutre, le clone restera neutre.
- Coût : inclus dans le plan Creator (22$/mois). Risque faible financièrement, risque moyen en temps (réenregistrer un dataset jouée).

### Piste 3 — Changement de palier expressif : benchmarker Hume Octave (effort moyen, gain potentiellement élevé)
Si ElevenLabs plafonne sur la vie de la voix, **Hume Octave** est le seul moteur 2026 conçu autour de l'émotion (prosodie explicite, lecture du sens). 
- Cloner la voix de marque sur Octave pour garder la cohérence sonore, puis exploiter les contrôles émotionnels natifs.
- À vérifier impérativement À L'OREILLE : la qualité du **français** (Octave est "English-first, expanding" — c'est le seul vrai doute).
- Coût plus élevé (~100-150$/M car.) mais volume Aziz (6-8 min/vidéo) reste modeste.
- Scenema = à garder en veille R&D (open-source, jeune, pas d'API stable) — pas pour les 8 vidéos en cours.

---

## TEST A/B concret à faire (pour trancher à l'oreille, 30 min)

1. **Choisir 2 extraits** de ~25-40s tirés d'un script géopolitique réel :
   - (A) un passage **tendu/dramatique** (montée, enjeu) — là où la monotonie se voit le plus.
   - (B) un passage **explicatif calme** (data, contexte) — pour vérifier que le moteur ne sur-joue pas.
2. **Générer le MÊME texte sur 4 variantes** :
   - V1 : voix actuelle, réglages actuels (référence).
   - V2 : voix actuelle, **mode Creative + style baissé 0.35 + tags allégés + ponctuation retravaillée** (Piste 1).
   - V3 : Hume Octave, voix clonée + contrôles émotionnels (Piste 3) — **écouter surtout l'accent/naturel FR**.
   - (optionnel V4 : Scenema, même texte, pour calibrer la R&D.)
3. **Écoute en aveugle** (renommer les fichiers), juger sur : variation de pitch, ruptures naturelles, "robotique de fond", justesse FR. 
4. **Décision** : si V2 suffit → rester ElevenLabs (zéro coût, cohérence préservée). Si seul V3 décolle vraiment → migrer vers Hume pour les prochaines vidéos, garder EL pour finir les 8 en cours (cohérence de marque sur la série déjà entamée).

---

## Sources (consultées juin 2026)
- ElevenLabs — Models : https://elevenlabs.io/docs/overview/models
- ElevenLabs — Eleven v3 : https://elevenlabs.io/v3 · https://elevenlabs.io/blog/eleven-v3
- ElevenLabs — Audio tags / best practices : https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices · https://elevenlabs.io/blog/v3-audiotags
- ElevenLabs — PVC vs Instant : https://elevenlabs.io/docs/creative-platform/voices/voice-cloning/professional-voice-cloning · https://www.cloudthat.com/resources/blog/a-deep-dive-into-elevenlabs-professional-and-instant-voice-cloning-features
- "New model March 2026" (= GA de v3, pas un v4) : https://techsifted.com/posts/elevenlabs-march-2026-update-new-voice-model/
- Comparatif moteurs 2026 : https://sureprompts.com/blog/voice-generation-models-compared-2026 · https://www.coval.ai/blog/best-text-to-speech-providers-in-2026-how-to-choose-(and-why-vendor-benchmarks-lie)/
- Hume Octave : https://www.hume.ai/octave · https://dev.hume.ai/docs/voice/voice-cloning · https://www.hume.ai/pricing
- Cartesia Sonic : https://www.cartesia.ai/sonic/ · https://www.cartesia.ai/pricing
- Scenema Audio : https://scenema.ai/audio · https://github.com/ScenemaAI/scenema-audio
- Auphonic (ne corrige PAS la prosodie) : https://auphonic.com/features · https://auphonic.com/help/algorithms/singletrack.html
- Prix ElevenLabs : https://elevenlabs.io/pricing
