# Empire Ghana — POLISH À FAIRE EN PROCHAINE SESSION

> **STATUS** : Render v2 validé à 95% par Aziz le 2026-05-04. URL : https://files.catbox.moe/lxzqvr.mp4
> 3 choses RESTANTES avant publication Postiz.

---

## 🔴 PRIORITÉ 1 — CTA final manquant (10s plein écran)

**Aziz 2026-05-04** : "la vidéo finit à 1m44 mais il manque le call to action"

### Pattern à reproduire
Voir Mansa Moussa V2 + Sonjata V7 + Thiaroye V5 (3 Shorts publiés). Tous ont le même pattern :
- Insert plein écran COLORÉ (pas la carte)
- Durée ~10s
- Demande d'abonner à la newsletter / chaîne YouTube
- Couleur signature de l'épisode
- Carte Afrique dynamique avec point pulse sur Wagadou

### Ce qu'il faut faire
- Créer `src/projects/atlas/empire-ghana/scenes/Beat6CTA.tsx` (~10s)
- Référence visuelle : `src/projects/geoafrique-shorts/SonjataCTA.tsx`
- Couleur : OR_VIF + BORDEAUX (palette Empire Ghana)
- Texte CTA : à finaliser avec Aziz
- Audio CTA : générer ElevenLabs voix canonique GeoAfrique v2 (`z3gESu49naEZW8Af2Upm`)
- Forced alignment du nouveau CTA audio
- Allonger `EmpireGhanaFull` de ~300 frames

**Coût estimé** : 1-2h + ~$0.35 ElevenLabs

---

## 🟡 PRIORITÉ 2 — Fix écran noir entre 5e et 7e seconde (~2s)

**Aziz 2026-05-04** : "après la 5e seconde, l'écran devient noir et c'est à la 7e seconde que l'action reprend"

### Diagnostic
- Hook segment audio : f5 → f153 (5.1s du fichier)
- Beat 1 segment audio : f211 → f676 (commence à 7.03s)
- **Trou de 58 frames entre f153 et f211** (~1.93s sans contenu visuel)

### Solution proposée
Vérifier `Beat0Hook.tsx` — possiblement un fade global qui se déclenche à f153 et fait un fade-to-black avant f211. Solutions :
- (A) Étendre le contenu visuel Hook jusqu'à f211 (le globe continue de tourner doucement)
- (B) Ajouter une transition fade-cross entre Hook et Beat 1
- (C) Démarrer Beat 1 plus tôt (mais audio ne commence qu'à 7s, donc faux raccord)

Ma recommandation : option (A) — modifier Hook pour qu'il rende le globe Atlas jusqu'à frame 211 (juste un hold sur le globe sans nouveau contenu).

**Coût estimé** : 30 min

---

## 🟢 PRIORITÉ 3 — Vraies frontières Empire du Mali via OpenHistoricalMap

**Aziz 2026-05-04 final** : "il va falloir utiliser historical map car comme tu viens de l'envoyer toi-même, on dirait que les frontières du Mali que tu as dessiné sont encore approximatives"

### Statut actuel
`MALI_PATH` actuel = mes propres coordonnées lat/lon basées sur sources tertiaires Wikipedia, projetées via d3-geo. Toujours approximatif.

### Pattern à reproduire (déjà fait pour Wagadou)
- OpenHistoricalMap relation 2822617 = Wagadou (23 vertices ODbL) — c'est CE niveau de source qu'on veut
- Source attendue : OpenHistoricalMap relation pour "Mali Empire" / "Empire of Mali"
- Format : extraire coordonnées lat/lon
- Projeter via `geoMercator().center([-3, 18]).scale(1400).translate([360, 640])`
- Stocker dans `data/geo/empire-ghana-data.json` sous `maliBordersLatLon`
- Remplacer `MALI_PATH` dans Beat4Consequence.tsx + Beat5CTA.tsx

### Outils à explorer
1. **OpenHistoricalMap web** : https://openhistoricalmap.org/ — chercher "Mali Empire"
2. **Overpass API** : `https://overpass-api.de/api/interpreter` avec query OSM
3. **Wikidata Q108150** (Mali Empire) avec relations géographiques liées
4. **Backup** : si pas trouvé, dataset académique vérifié + documenter la source

**Coût estimé** : 1h recherche + intégration

---

## Ordre d'exécution recommandé

1. **D'abord les 2 fixes mineurs** (1h30)
   - Fix écran noir 5-7s (30 min)
   - Recherche + intégration vraies frontières Mali via OHM (1h)
2. **Puis le CTA** (1-2h)
   - Texte + audio + forced alignment + code
3. **Render final + Catbox** (15 min)
4. **Validation Aziz + commit + publication Postiz** (15 min)

**Temps total estimé prochaine session** : 2-3h.

---

## Référence

- Render v2 actuel (validé 95%) : https://files.catbox.moe/lxzqvr.mp4
- Branche git : `feat/atlas-empire-ghana`
- Brief complet prochaine session : `NEXT-SESSION-empire-ghana-cta.md`
