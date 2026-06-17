---
name: TTS-V3-TAGS-REGLES
description: Règles actionnables ElevenLabs v3 — placement tags, CAPS, ellipses, longueur. SCANNER avant tout fichier V3. Vérifié doc officielle EL + fiche recherche interne 2026-06-16.
metadata:
  type: reference
---

# RÈGLES TAGS ELEVENLABS V3 (à scanner AVANT chaque fichier V3)

> Vérifié 2026-06-16 : doc officielle EL (best-practices, v3-audiotags, precision-delivery) + [[TTS-EXPRESSIVITE-RECHERCHE-2026-06]].
> Pipeline concerné : `scripts/generate-narration-expressive.py` (Océane V3 → STS GéoAfrique). Doctrine pipeline : [[PIPELINE-VOIX-VIVANTE-VALIDE]].
> ⭐ **PRINCIPE DIRECTEUR (Aziz 2026-06-16) : OSER les tags émotionnels — c'est CE QUI tue le ton robotique/monotone.** Le danger n'est PAS « trop d'émotion », c'est « pas assez » (= GéoAfrique monotone, le problème qu'on combat). Ne JAMAIS sous-doser par excès de prudence.
> Distinguer DEUX choses :
> - **Registre** (ce qui reste cadré) : doc géopo → pas de tags HORS-SUJET (`[laughs]`, `[whispers]` théâtral, `[pirate voice]`, SFX, accents). Ça reste exclu.
> - **Intensité** (à POUSSER dans le registre) : OSER les tags qui donnent de la vie analyste → `[grave] [ominous] [urgent] [emphatic] [indignant] [incredulous] [tense] [solemn] [dramatic tone] [serious] [deliberate] [reflective] [slows down] [pause] [calm]`. Un tag fort mais juste > une voix plate.
> Calibrer à l'oreille (Aziz tranche), mais le défaut = EXPRESSIF, pas timide.

## ⛔ LES 5 RÈGLES (erreurs corrigées Aziz)

### R1 — PLACEMENT : tag JUSTE AVANT le mot/segment à colorer, PAS en tête de paragraphe par défaut
Doc EL : tag *« immediately before the dialogue segment it modifies, or immediately after »* (ex. `[annoyed] This is hard.` ou `This is hard. [sighs]`).
- ❌ ERREUR FRÉQUENTE : mettre `[solemn]` en tête d'une phrase de 25 mots → colore TOUTE la phrase, dilue l'impact.
- ✅ JUSTE : pour frapper un mot précis (un chiffre, un nom), placer le tag **intra-phrase, juste avant ce mot**.
  - Ex : `Et entre les deux camps, une population prise au piège. [solemn] Vingt-cinq millions de personnes ont besoin d'aide pour manger.`
  - Mieux encore (pic) : pause + tag collés au chiffre → `…prise au piège. [pause] [solemn] Vingt-cinq millions…`
- Un tag en tête de paragraphe reste OK pour poser un registre GÉNÉRAL ; mais pour un PIC émotionnel ciblé → intra-phrase.

### R2 — CAPITALISATION = accent/stress sur UN mot (sous-utilisé, à exploiter)
Doc EL : *« add emphasis by making some words capital »*. `OH` vs `oh` change l'intensité.
- Usage sobre pour doc géopo : capitaliser le mot-clé qui doit FRAPPER. Ex : `il est en train de la GAGNER.` · `il ne faut pas suivre les armes. Il faut suivre L'OR.`
- ⚠️ Parcimonie : 1-2 CAPS par acte max, sinon effet criard. Jamais une phrase entière en CAPS.

### R3 — ELLIPSES `...` = poids dramatique / temps d'atterrissage
Doc EL : ellipses ajoutent du poids, laissent un moment « atterrir ». Plus naturel qu'un `[pause]` sec parfois.
- Ex : `Trois années de combats... et personne ne parvient à les arrêter.`
- Combinable : `Il faut suivre... l'or.`

### R3-bis — ⚠️ PAUSES PARCIMONIEUSES : GéoAfrique (et Océane V3) sont DÉJÀ des voix LENTES (Aziz 2026-06-16)
Une fois la voix GéoAfrique appliquée (STS), le débit est déjà posé/lent. Empiler des `[pause]` → la rend TRAÎNANTE, pas dramatique. La pause perd son pouvoir si elle est partout.
- ✅ RÈGLE : `[pause]` réservé aux **1-2 pics les plus forts** de l'acte (le moment qu'on VEUT faire respirer). Ailleurs : laisser la ponctuation naturelle (virgule, point) + le débit lent intrinsèque faire le travail.
- Préférer souvent l'ellipse `...` (poids sans silence mort) à un `[pause]` sec quand on veut juste « peser » un peu.
- ❌ ANTI-PATTERN : un `[pause]` à chaque transition de phrase → effet diaporama lent, ennuyeux.

### R4 — NE PAS HACHER : phrases/segments LONGS (>250 caractères), pas de mini-fragments
⚠️ CONTRE-INTUITIF (inverse de v2). Source interne : *« v3 instable sur prompts courts. Phrases trop courtes APPAUVRISSENT l'expressivité v3. »*
- ❌ ERREUR : 7 petits paragraphes de 1-2 phrases séparés par sauts de ligne → bride l'expressivité.
- ✅ JUSTE : regrouper en blocs de >250 caractères. Le modèle a besoin de « contexte » pour moduler. La ponctuation interne (virgules, points, `...`) porte le rythme, pas le découpage en fragments.
- Le pipeline coupe à ~4800 char/appel sur un `[pause]` ou fin de paragraphe — donc OK d'avoir de longs blocs.

### R5 — TRANSITIONS d'émotion GRADUELLES sur plusieurs phrases, jamais switch brutal dans une ligne
Doc EL : viser un arc émotionnel. Ex : `[reflective]` → `[serious]` → `[solemn]` sur 3 phrases, pas `[calm]...[shouts]` collés.

## RÉGLAGES (rappel doctrine)
- stability = **Natural** (≈0.45 validé Aziz : 0.30 bavait). Robust supprime la réactivité aux tags → à éviter.
- ⚠️ FR + tags : surtout testés en anglais, fiabilité FR « non vérifiée » → rester SOBRE, valider à l'oreille.

## CHECKLIST AVANT GÉNÉRATION V3 (scanner comme les règles TTS FR)
- [ ] Tags des PICS émotionnels placés INTRA-phrase juste avant le mot ciblé (R1) ?
- [ ] CAPS sur les 1-2 mots qui doivent frapper par acte (R2) ?
- [ ] Ellipses `...` sur les moments à faire « atterrir » (R3) ?
- [ ] Blocs >250 caractères, PAS de mini-fragments hachés (R4) ?
- [ ] Arc émotionnel graduel, pas de switch brutal (R5) ?
- [ ] + scan règles TTS FR habituelles (participes é/ée, ont+voyelle, nombres en lettres) ?

Liens : [[TTS-EXPRESSIVITE-RECHERCHE-2026-06]] · [[PIPELINE-VOIX-VIVANTE-VALIDE]] · [[voices-v3]] · [[elevenlabs]].
