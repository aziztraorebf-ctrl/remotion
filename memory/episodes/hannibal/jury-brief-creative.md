# Brief Jury Hybride Pass 1 — Hannibal / "La traversée des Alpes"

> Vous êtes membre d'un jury créatif de 3 LLMs. Vous évaluez un projet de Short YouTube/TikTok/Instagram (vertical 1080×1920) format Atlas (cartographique, géographique). Le script est VERROUILLÉ. Votre mission : nous aider à construire la vidéo de manière créative AVANT qu'on code.

---

## 1. Contexte produit

- **Format** : Short vertical 1080×1920, ~1m35
- **Plateformes** : YouTube Shorts + TikTok + Instagram Reels
- **Voix** : Narratrice GeoAfrique v2 (féminine, didactique chaleureuse, factuelle — pas blagueur)
- **Style visuel cible** : carte d3-geo Méditerranée + palette bleu marine/ocre/violet/blanc Alpes + sprites pixel art PixelLab + HUD RPG (StatGauge) + inserts SVG
- **Audience** : francophonie mondiale, 18-45 ans, histoire/découverte
- **Tonalité** : factuel, chiffres mis en perspective, invitation au savoir

---

## 2. Script intégral VERROUILLÉ (~1m35, 5 beats)

### Hook (5s)
> Quarante-six mille soldats entrent dans les Alpes. Vingt mille en ressortent. Quinze jours.

### Beat 1 — Contexte (12s)
> Nous sommes en deux cent dix-huit avant notre ère. Hannibal Barca, trente ans, commande l'armée carthaginoise en Espagne. Rome le cherche au sud. Il choisit le nord. Par les Alpes. En automne.

### Beat 2 — Le Rhône (18s)
> Avant même les montagnes, il y a le Rhône. Un fleuve large. Un courant violent. Trente-sept éléphants de guerre à faire traverser. Hannibal construit des radeaux de bois recouverts de terre. Les éléphants croient marcher sur une rive. Ils flottent sans le savoir. Mais sur l'autre rive, les Volques les attendent. Hannibal envoie sa cavalerie numide en amont, les prend à revers. Première victoire. Avant même les Alpes.

### Beat 3 — La montagne (25s)
> Puis vient la montagne. Les Allobroges contrôlent les cols. Ils attendent en hauteur, au-dessus des défilés étroits. Hannibal passe la nuit sur un rocher escarpé avec la moitié de son armée pour protéger la colonne. Au matin, les Allobroges reculent. Le col est libre. Mais la roche ne recule pas. Les chemins s'effondrent. Les bêtes glissent dans les précipices. Le froid tue ce que les tribus n'ont pas tué. Selon les chroniqueurs de l'époque, Hannibal fit chauffer des rochers et y versa du vinaigre pour ouvrir un passage. Après neuf jours de montée, le col est atteint. Hannibal arrête l'armée. Il leur montre l'Italie en contrebas. "Vous traversez les murs de Rome."

### Beat 4 — La descente (18s)
> La descente est pire. La neige fraîche recouvre la glace ancienne. Les éléphants basculent. Les chevaux refusent d'avancer. Six jours de descente. À l'arrivée dans la plaine du Pô : vingt mille fantassins. Six mille cavaliers. Trente-sept éléphants sont partis. Un seul est là.

### Beat 5 — Conséquence + CTA (15s)
> La moitié d'une armée a disparu dans la montagne. Et avec ce qui reste, Hannibal va remporter les trois plus grandes défaites de l'histoire de Rome. La Trébie. Le lac Trasimène. Cannes. En une seule journée à Cannes, cinquante mille soldats romains tombent. Pose-toi la question : avec une armée complète, qu'est-ce qu'il aurait pu faire ?

---

## 3. Stack technique disponible

### Ce qu'on PEUT faire
- **d3-geo cartes vectorielles** Méditerranée (projection Mercator, Natural Earth 50m) — pipeline mature
- **Sprites PixelLab** déjà générés : Hannibal infanterie 8 directions 64px + éléphant carthaginois 160×120px
- **Colonne de marche multi-sprites** (délai entre sprites — validé Empire Ghana avec chameaux en file indienne)
- **FocusBubble** (zoom 1.45x + blur 3.5px sur background, foreground net) — validé Lab Hannibal Phase 1
- **StatGauge HUD** (jauge animée fromValue→toValue + delta, disparaît pendant moments dramatiques) — validé Lab Hannibal Phase 1
- **AtlasCaravane** (sprite qui suit un chemin bezier animé sur la carte)
- **AtlasPulseMarker** (cercle pulsant sur POI)
- **Mouvements caméra Remotion** : push-in, dolly-out, camera-track, ken burns, dutch tilt, whip-pan, freeze-frame — tous disponibles, certains jamais testés
- **Inserts SVG dataviz** (compteurs, comparaisons d'échelle)
- **Audio-derived timing** (Forced Alignment ElevenLabs)
- **Karaoke subtitles** word-level (Whisper)
- **Lottie via Claude** (icônes géométriques simples — limite 10 vertices, 5 instances simultanées)
- **Gemini** (illustrations statiques, fonds)

### Ce qu'on NE PEUT PAS faire
- Vidéos génératives (Seedance/Kling) — c'est un épisode Atlas pur Remotion
- Silhouettes humaines réalistes via Lottie
- Animations fluides de mort via PixelLab (testé Lab Phase 2 — spritesheet 13 frames trop saccadée)
- Plus de 5 instances Lottie simultanées

### Nouveaux patterns à valider (jamais utilisés en production)
- **Encerclement animé SVG** (arc qui se referme — prévu pour Cannes épisode 2)
- **Dutch tilt** (rotation 3-8° sur tension — jamais utilisé)
- **Whip-pan** (pan ultra-rapide entre POI — jamais utilisé)
- **Colonne de marche qui s'amincit progressivement** (sprites qui disparaissent un par un)

---

## 4. Ce qui est verrouillé vs ouvert

### VERROUILLÉ
- Script intégral V2
- Format Atlas (carto, pas Seedance)
- Palette méditerranéenne : mer #1B3A52, Carthage #A8623A, Rome #5B4A6E, Alpes #D9E4ED, or #E6C76E
- Sprites Hannibal + éléphant (déjà générés)
- Voix Narratrice GeoAfrique v2

### OUVERT (votre travail)
- Découpage scène par scène avec mouvements caméra beat par beat
- Comment visualiser la colonne qui s'amincit (pertes progressives)
- Pattern visuel récurrent / signature de l'épisode
- Transitions entre beats
- Quels moments méritent un FocusBubble vs une StatGauge vs un insert SVG
- Comment représenter les Alpes sur la carte (masse blanche ? texture hachures ?)
- Idées créatives concrètes qu'on n'a pas pensées

---

## 5. Commentaires du réalisateur (Aziz)

### Ce qui m'attire dans ce projet
- L'arc est parfait : armée complète → armée à moitié détruite → victoires impossibles
- La StatGauge qui compte les pertes en temps réel pendant la traversée = idée forte
- FocusBubble sur des moments clés (nuit sur le rocher, 1 seul éléphant à l'arrivée)
- Cannes gardé comme mystère final (une seule ligne) — l'épisode 2

### Ce qui m'inquiète
- **Carte Méditerranée vs carte Afrique** : nos épisodes précédents utilisaient la carte Afrique (d3-geo Afrique de l'Ouest). Pour Hannibal, on a besoin d'une carte Méditerranée (Espagne, Alpes, Italie) — pipeline à valider
- **Les Alpes visuellement** : comment rendre les Alpes reconnaissables et dramatiques sur une carte SVG ? Pas juste une masse blanche
- **Rythme** : 5 beats sur 1m35, certains très statiques géographiquement (la montagne = même zone pendant 25s). Comment éviter la monotonie ?
- **Beat 3 dense** : 25s sur la même zone géographique — risque d'ennui visuel si la caméra ne bouge pas

### Référence visuels à suivre
- **Empire Ghana Final** (validé publication 2026-05-04) : carte vectorielle + sprites PixelLab sur la carte + StatGauge HUD + FocusBubble moments dramatiques + karaoke subtitles
- **Mansa Moussa V2** : caravane qui suit un chemin bezier, camera-track sur le sprite, inserts dataviz

---

## 6. 5 Questions structurées

### Q1. Carte Méditerranée — comment l'aborder ?
On passe d'une carte Afrique de l'Ouest (nos épisodes précédents) à une carte Méditerranée (Espagne → Alpes → Italie du nord). Comment rendre cette carte lisible, dramatique et reconnaissable en portrait 1080×1920 ? Quelle projection ? Quels éléments visuels distinguer (mer, terre, Alpes, Carthage, Rome) ?

### Q2. Visualiser les pertes progressives
La narration raconte une armée qui fond progressivement : 46 000 → 20 000 hommes, 37 → 1 éléphant. Comment le MONTRER visuellement sur la carte, beat par beat, de façon mémorable et non-encyclopédique ? StatGauge seule suffit-elle ou faut-il un autre dispositif ?

### Q3. Beat 3 — 25s sur la même zone : comment éviter la monotonie ?
Beat 3 (la montagne) dure 25 secondes et se passe entièrement dans les Alpes — même zone géographique. Plusieurs micro-événements (nuit sur rocher, chemins qui s'effondrent, vinaigre, arrivée au col, discours). Comment structurer visuellement ces 25s pour maintenir le rythme sans que la carte paraisse figée ?

### Q4. Idée créative concrète qu'on n'aurait pas pensée
Une idée créative concrète, exécutable avec notre stack, qui transformerait un beat ordinaire en moment mémorable. Précise le beat, l'effet visuel, et l'outil (FocusBubble / StatGauge / SVG / PixelLab / Lottie / mouvement caméra).

### Q5. Signature visuelle de l'épisode
Quel élément visuel récurrent devrait traverser toute la vidéo comme signature propre à cet épisode Hannibal ? (Exemple : Empire Ghana avait les routes commerciales qui s'allumaient. Mansa Moussa avait la caravane.) Doit être exécutable avec notre stack.

---

## 7. Format de réponse attendu

```markdown
# Réponse [TON NOM LLM] — Hannibal Traversée des Alpes

## Note globale du brief : X/10

## Q1. Carte Méditerranée
[Réponse]

## Q2. Visualiser les pertes progressives
[Réponse]

## Q3. Beat 3 — 25s sans monotonie
[Réponse]

## Q4. Idée créative concrète
[Réponse]

## Q5. Signature visuelle
[Réponse]

## Alertes critiques (optionnel)
[Risques non mentionnés]
```

Réponds en français. Concret, pas généraliste. Pas d'éloges. Droit au sujet. ~600-1000 mots.
