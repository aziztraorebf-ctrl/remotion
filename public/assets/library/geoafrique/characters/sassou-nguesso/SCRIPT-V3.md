# Sassou Nguesso Short - Script V3 (VERROUILLE)

## Format
- YouTube Short (1080x1920, 9:16 vertical)
- Duree cible: ~70-75 secondes
- Template: "Le Visage" (figure politique)
- Style: Editorial illustration + motion graphics Remotion

## Angle editorial
- Sujet d'actualite: reelu le 15 mars 2026 avec 94.82% (1 semaine avant publication)
- Fin avec perspective humaine (pas robotique)

---

## BEAT 1 - LE HOOK (0-8s)
**[VISUEL: Carte Congo gold glow, zoom lent vers Brazzaville]**

> "En 1979, un militaire de 35 ans prend le pouvoir au Congo-Brazzaville. 43 ans plus tard... il vient d'etre reelu avec 94% des voix."

**Assets**: carte Congo (existante) + animation glow/zoom Remotion
**Changements visuels**: carte wide -> zoom Brazzaville -> transition portrait

---

## BEAT 2 - LA CHUTE ET LE RETOUR (8-22s)
**[VISUEL: Portrait Sassou fond noir, reveal depuis le noir. Timeline animee.]**

> "Denis Sassou Nguesso. President de 1979 a 1992. Il perd les premieres elections libres du pays. Il termine troisieme. Mais cinq ans plus tard, il revient au pouvoir... avec des chars angolais et des MiG."

**Assets**: portrait fond noir (existant) + motion graphics timeline
**Changements visuels**: reveal portrait -> "1992 - 3eme" barre rouge -> "1997 - Guerre civile" -> silhouettes chars (SVG Remotion)

---

## BEAT 3 - LA CONSTITUTION (22-38s)
**[VISUEL: Vue aerienne Brazzaville (A GENERER) + documents constitutionnels animes]**

> "Il abolit la constitution. En ecrit une nouvelle. Puis en 2015, a 71 ans, il organise un referendum pour supprimer la limite d'age... et la limite de mandats. Resultat officiel : 92%."

**Assets**: vue Brazzaville stylisee (A GENERER) + motion graphics
**Changements visuels**: ville -> document "constitution" -> "Limite d'age: supprimee" -> "92%"

---

## BEAT 4 - L'ESCALADE DES POURCENTAGES (38-50s)
**[VISUEL: Typographie massive, pourcentages en crescendo spring()]**

> "Depuis, ses scores ne font qu'augmenter. 2016 : 60%. 2021 : 88%. Mars 2026 : 94%. Plus il controle, plus il est populaire."

**Assets**: pur motion graphics Remotion
**Changements visuels**: "60%" -> "88%" -> "94.82%" crescendo, le dernier remplit l'ecran

---

## BEAT 5 - LE PARADOXE (50-63s)
**[VISUEL: Portrait fond transparent (decoupe) + infographie petrole/pauvrete]**

> "Le Congo est le 3eme producteur de petrole d'Afrique. Le petrole represente 90% des exportations. Pourtant, un Congolais sur deux vit avec moins de 2 dollars par jour."

**Assets**: portrait transparent (existant) + motion graphics split screen
**Changements visuels**: portrait + "90% exports = petrole" or -> split -> "1 sur 2 dans la pauvrete" blanc

---

## BEAT 6 - LA PERSPECTIVE HUMAINE (63-75s)
**[VISUEL: Foule de jeunes stylisee (A GENERER) + compteur 1979->2026]**

> "60% des Congolais ont moins de 25 ans. Ils n'ont jamais connu un autre president. Dans toute l'Afrique, une nouvelle generation demande des comptes a ses dirigeants. La question n'est plus si le changement viendra... mais quand."

**Assets**: foule jeunes stylisee (A GENERER) + compteur anime + fondu noir + logo GeoAfrique
**Changements visuels**: foule -> "60% < 25 ans" -> fondu noir -> logo + "Abonne-toi"

---

## PIPELINE DE PRODUCTION

### Assets existants (prets)
1. Portrait Sassou fond noir (editorial illustration)
2. Portrait Sassou fond transparent (decoupe)
3. Carte Congo gold glow (geopolitical briefing style)

### Assets a generer (2 images)
1. Vue aerienne Brazzaville (style vectoriel editorial) - voir PROMPTS.md
2. Foule de jeunes (style vectoriel, compositable) - voir PROMPTS.md

### Production Remotion (pur code)
- Timeline animee (1979 -> 2026)
- Pourcentages en spring() crescendo
- Silhouettes chars/MiG en SVG simple
- Document constitutionnel anime
- Compteur annees
- Infographie petrole/pauvrete split screen
- Texte anime, reveals, transitions

### Audio
- Voix: Narrateur GeoAfrique (ElevenLabs, voix Chris)
- Timing: derive de Whisper apres generation audio
- Musique: ambient tension, -18dB sous la voix

---

## DECISIONS VALIDEES PAR AZIZ (2026-03-22)
- [x] Script v3 approuve (6 beats)
- [x] Fin editoriale approuvee ("la question n'est plus si... mais quand")
- [x] Style illustrations IA = OK (pas deepfake, style editorial assume)
- [x] 2 images supplementaires a generer (Brazzaville + foule jeunes)
- [x] Pas de Recraft SVG pour ce Short - pur Remotion + images generees
- [x] Objectif: production rapide
