# Type B — Or Africain Script V2 LOCKED
> Validé jury 4 LLM, score moyen 7.2/10. 2026-05-05.
> Corrections Aziz appliquées 2026-05-06 — script TTS final.

## Métadonnées
- Format : 9:16 vertical, ~75s, YouTube Shorts / TikTok / Reels
- Style : Money Legends (dark grid, text cards, sources citées, SFX)
- Voix : ElevenLabs Narratrice GéoAfrique v2 `z3gESu49naEZW8Af2Upm`, eleven_v3
- Hashtags audience : #ResourceSovereignty #GhanaMineralsFirst #NationalizeOurWealth
- Gate validation : 9.5/10 — GO
- Statut : LOCKED — corrections Aziz intégrées, prêt pour TTS

## Script V3 (corrections Aziz 2026-05-06)

**BEAT 1 — HOOK (0-8s)**
"Le prix de l'or vient de battre tous les records. Six gouvernements se sont levés contre le Ghana. Le Ghana a signé quand même."

**BEAT 2 — CONTEXTE (8-22s)**
"Depuis deux mille dix, le Ghana touchait cinq pour cent de royalties sur son or — peu importe si le prix était à mille ou cinq mille dollars l'once. Les multinationales encaissaient toute la hausse. L'État ghanéen ? Rien."

**BEAT 3 — LE FAIT (22-42s)**
"En janvier deux mille vingt-six, l'or dépasse cinq mille dollars l'once pour la première fois de l'histoire. Le Ghana propose des royalties progressives : de cinq pour cent à douze pour cent selon le cours. Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie écrivent une lettre officielle au gouvernement ghanéen. Le message : n'allez pas plus loin. Cette loi menace nos investissements."

**BEAT 4 — LE TWIST (42-62s)**
"Et le Ghana n'est pas un cas isolé. Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol. Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement. Le Burkina Faso a revu son code minier. Le Niger a nationalisé sa seule mine industrielle. Quatre pays. Un même signal."

**BEAT 5 — VERDICT (62-75s)**
"Le Ghana a signé la loi. L'Afrique commence à changer les règles de son propre sous-sol. Discrètement. Sans que personne n'en parle."

## Script TTS annoté (eleven_v3, voix z3gESu49naEZW8Af2Upm)

```
[tense] Le prix de l'or vient de battre tous les records.
[pause]
Six gouvernements se sont levés contre le Ghana.
Le Ghana a signé quand même.

Depuis deux mille dix, le Ghana touchait cinq pour cent de royalties sur son or
— peu importe si le prix était à mille ou cinq mille dollars l'once.
Les multinationales encaissaient toute la hausse.
[pause] L'État ghanéen ? Rien.

[dramatic tone] En janvier deux mille vingt-six, l'or dépasse cinq mille dollars l'once
pour la première fois de l'histoire.
Le Ghana propose des royalties progressives : de cinq pour cent à douze pour cent selon le cours.
Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie écrivent une lettre officielle au gouvernement ghanéen.
[tense] Le message : n'allez pas plus loin. Cette loi menace nos investissements.
[pause]
[solemn] Le Ghana a signé quand même.

[awe] Et le Ghana n'est pas un cas isolé.
Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol.
Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement.
Le Burkina Faso a revu son code minier.
Le Niger a nationalisé sa seule mine industrielle.
[proud] Quatre pays. Un même signal.

[quietly] Le Ghana a signé la loi.
L'Afrique commence à changer les règles de son propre sous-sol.
[whispers] Discrètement. Sans que personne n'en parle.
```

## Corrections appliquées (2026-05-06)
1. "ont tenté d'empêcher" → "se sont levés contre" (règle TTS : "ont + voyelle" éliminé)
2. Tous les chiffres convertis en lettres ("2010" → "deux mille dix", "5%" → "cinq pour cent", etc.)
3. Beat 3 : "Le message : arrêtez." → explication complète : "n'allez pas plus loin. Cette loi menace nos investissements."
4. Beat 4 : "Le Ghana n'est pas seul." → "Et le Ghana n'est pas un cas isolé. Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol." (lien narratif explicite)
5. "Cinq pays." → "Quatre pays." (correction factuelle : Ghana + Mali + Burkina Faso + Niger = 4)
6. "Même mouvement." → "Un même signal." (plus précis narrativement)
7. Pauses réduites : suppression des pauses redondantes (voix V2 déjà lente)

## Plan visuels Remotion (consensus jury)

| Beat | Visuel | Notes |
|------|--------|-------|
| Beat 1 | Text card full screen + compteur prix or 1000→5589 | Compteur crée émotion immédiate |
| Beat 2 | Graphique courbe prix or 2010→2026 + ligne royalties plate à cinq pour cent | Dissonance visuelle = injustice montrée sans l'expliquer |
| Beat 3 | Carte SVG Ghana highlight or + texte "5%→12%" + cascade 5 drapeaux/labels | "N'ALLEZ PAS PLUS LOIN." en rouge plein écran |
| Beat 4 | Carte SVG Afrique highlights successifs Mali/Burkina/Niger + compteur 430M$ | Carte qui s'allume = pattern visuel du mouvement |
| Beat 5 | Text card minimaliste — fond noir uni (sans grille) + silence SFX | Le calme après l'intensité |

## Alerte éditoriale (GPT-4o)
- Montant $430M Barrick/Mali DOIT apparaître avec source à l'écran
- Settlement signé nov 2025, confirmé Bloomberg/Mining Weekly
- Source à afficher : "Bloomberg, nov. 2025"

## Structure projet (canonical — ne pas utiliser poc-money-legends/)
- Code : `src/projects/souverain/or-africain/`
- Audio/assets : `public/souverain/or-africain/`
- POC `public/poc-money-legends/` = backup uniquement, ne plus alimenter

## Assets disponibles
- Carte Afrique SVG — Atlas composants _shared/
- Composants text cards, GridBackground — POC Money Legends (à porter dans souverain/)
- Narration finale : `public/souverain/or-africain/audio/narration-or-africain-FINAL.mp3` (101s)
- Alignment : `public/souverain/or-africain/audio/narration-or-africain-FINAL-alignment.json`
- Musique kora griot : `public/souverain/or-africain/audio/music-v1.mp3`
- SFX : sfx-swoosh-zoomin.mp3, sfx-swoosh-pullback.mp3, sfx-map-ping.mp3
- Courbe dataviz — à créer (simple SVG Remotion, ~30 min)

## Coût production estimé
- TTS ElevenLabs : ~$0.30
- Assets : zéro génération payante requise (tout Remotion pur)
- Composition : 2-3h session
- **Total : $5-10 max**

## Contexte trend
Or $5,589/once mai 2026. Ghana royalties signées mars 2026. Mali/Barrick settlement nov 2025.
Gap francophone confirmé : zéro vidéo courte narrative sur ce sujet en français.
