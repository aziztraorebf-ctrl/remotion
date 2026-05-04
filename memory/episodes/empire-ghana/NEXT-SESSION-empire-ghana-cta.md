# NEXT SESSION — Empire Ghana finition (CTA + 2 fixes)

> Brief de démarrage prochaine session. Branche : `feat/atlas-empire-ghana`.
> État actuel : Short 105s rendu et validé à 95% par Aziz. URL v2 finale : https://files.catbox.moe/lxzqvr.mp4
> 3 choses à faire avant publication Postiz.

---

## 1. 🔴 PRIORITÉ — Ajouter le CTA (10s, plein écran)

### Pattern à reproduire
Voir Mansa Moussa V2 + Sonjata V7 + Thiaroye V5. Les 3 ont le même pattern :
- Insert plein écran COLORÉ (pas la carte)
- Durée ~10s
- Demande d'abonner à la newsletter
- Couleur signature de l'épisode

### À faire
- Créer `src/projects/atlas/empire-ghana/scenes/Beat6CTA.tsx` (nouveau, ~10s)
- Référence visuelle : `src/projects/geoafrique-shorts/SonjataCTA.tsx` (déjà éprouvé)
- Couleur signature Empire Ghana : OR_VIF + BORDEAUX (palette GhanaPalette)
- Texte CTA : à finaliser avec Aziz (probable "Si tu as aimé Wagadou, abonne-toi pour les prochains empires oubliés")
- Carte Afrique dynamique avec point pulse sur Wagadou + lien vers chaîne
- Audio CTA : à générer ElevenLabs (voix canonique GeoAfrique v2)
- Forced alignment du nouveau CTA audio
- Allonger `EmpireGhanaFull` de 357 → ~657 frames (ajouter 300 frames CTA)

### Coût estimé
- Audio CTA : ~$0.30 ElevenLabs
- Forced alignment : ~$0.05
- Production code : 1-2h

---

## 2. 🟡 PRIORITÉ — Fix écran noir entre f150-210 (~2s)

### Symptôme
Aziz a remarqué : "après la 5e seconde, l'écran devient noir et c'est à la 7e seconde que l'action reprend"

### Diagnostic
- Hook segment : f0 → f153 (5.1s)
- Beat 1 segment : f211 → f676 (commence à 7s)
- **Trou de 58 frames entre f153 et f211** (~1.93s sans contenu visuel)

### Solution proposée
Dans `EmpireGhanaFull.tsx`, étendre le Hook jusqu'à f211 OU faire un fade-cross entre Hook fin et Beat 1 début.

**Option A (simple)** : étendre Hook duration de 211 frames (déjà le cas dans la Sequence) mais le COMPOSANT Hook doit rendre quelque chose au-delà de f153. Vérifier que `Beat0Hook.tsx` ne se "termine" pas visuellement à 153 (fade out global, etc.).

**Option B (élégante)** : Ajouter un fade transition entre Hook et Beat 1. La narration audio ne dit rien entre 5.1s et 7s, donc on peut juste tenir le globe Hook ou faire un fade vers Beat 1.

### Fichier à modifier
`src/projects/atlas/empire-ghana/scenes/Beat0Hook.tsx` — vérifier les opacity/fade global qui pourraient causer le black

---

## 3. 🟢 PRIORITÉ — Vraies frontières Empire du Mali via OpenHistoricalMap

### Statut actuel
Le `MALI_PATH` actuel est mes propres coordonnées (lat/lon basées sur sources tertiaires Wikipedia, projetées via d3-geo). C'est mieux qu'avant (blob inventé) MAIS toujours approximatif. **Aziz a confirmé que ça reste à corriger via OHM**.

### Pattern à reproduire (déjà fait pour Wagadou)
- OpenHistoricalMap relation 2822617 = Wagadou (23 vertices ODbL) — c'est ÇA qu'on veut pour Mali
- Source attendue : OpenHistoricalMap relation pour "Mali Empire" ou "Empire of Mali"
- Format : extraire les coordonnées lat/lon
- Projeter via `geoMercator().center([-3, 18]).scale(1400).translate([360, 640])`
- Stocker dans `data/geo/empire-ghana-data.json` sous `maliBordersLatLon`
- Remplacer `MALI_PATH` dans Beat4Consequence.tsx + Beat5CTA.tsx

### Outils à explorer
- API OpenHistoricalMap (https://openhistoricalmap.org/)
- Overpass API : `https://overpass-api.de/api/interpreter` avec query OSM pour "Mali Empire"
- Wikidata Q108150 (Mali Empire) avec relations géographiques

### Si pas de relation OHM trouvée
Backup : utiliser un dataset académique vérifié (ex: World Historical Atlas, ou source historiographique citée dans Britannica). Documenter la source utilisée dans le code.

---

## Ordre d'exécution recommandé prochaine session

1. **D'abord les fixes mineurs** (1h)
   - Fix écran noir 5-7s
   - Recherche + intégration vraies frontières Mali
2. **Puis le CTA** (1-2h)
   - Texte finalisé avec Aziz
   - Génération audio ElevenLabs
   - Forced alignment
   - Code Beat6CTA.tsx
   - Intégration dans EmpireGhanaFull
3. **Render final + Vercel/Catbox** (15 min)
4. **Validation Aziz + commit + publication Postiz** (15 min)

**Temps total estimé** : 2-3h.

---

## URL render v2 actuelle (référence)
https://files.catbox.moe/lxzqvr.mp4 (19.1 MB, 105s, 95% complete)

## Branche git
`feat/atlas-empire-ghana` — derniers commits incluent Beat 4 + Beat 5 + assemblage + SFX + sous-titres.
