# NEXT SESSION — Atlas Shaka Zulu : Suite + Explorations

> Mis à jour : 2026-05-02 fin de session
> Branche active : `feat/atlas-shaka-zulu-vague1`
> Lire CE FICHIER + `memory/atlas-shaka-zulu/jury-s4/SYNTHESE-S4-LOCKED.md` avant tout code S4

---

## ÉTAT EXACT DU PROJET

| Scène | Statut | Notes |
|-------|--------|-------|
| S1_GEO | VALIDÉ | commit d1d67c2 |
| S2_A3_CORNES | VALIDÉ | CornesFrameNarrative v5, walk cycle warriors |
| S3_EXPANSION | VALIDÉ | commit d1d67c2 |
| S4_NANDI | PRÊT À CODER | Jury fait, décisions verrouillées, PixelLab en attente |
| S5_CTA | Code existant, jamais mini-renderé | À valider |
| Hook | Code existant, jamais mini-renderé | À valider |
| Render final | Pas encore | Après toutes scènes validées |

---

## S4 NANDI — Ce qui est prêt

### Assets PixelLab (à télécharger au début de la session)
- Character ID : `12715dae-591c-4387-ba0b-419fcf44dd4f`
- `breathing-idle` : 4 frames × 4 directions — GÉNÉRÉ ✅
- `falling-back-death` : généré en fin de session — **VÉRIFIER ET TÉLÉCHARGER ZIP**
```bash
curl --fail -L "https://api.pixellab.ai/mcp/characters/12715dae-591c-4387-ba0b-419fcf44dd4f/download" \
  -H "Authorization: Bearer $PIXELLAB_API_KEY" \
  -o /tmp/nandi-animations.zip && \
  unzip -o /tmp/nandi-animations.zip -d public/atlas-shaka-zulu/characters/nandi/
```

### Décisions S4 verrouillées
Lire : `memory/atlas-shaka-zulu/jury-s4/SYNTHESE-S4-LOCKED.md`

Plan 5 actes :
- Act 1 (0→398) : carte + Nandi breathing-idle + halo or uMgungundlovu
- Act 2 (398→468) : cardio-stop 1 frame noir + falling-back-death B&W + MourningWarp spasm
- Act 3 (468→777) : décrets en slide depuis les bords + désaturation Shaka sprite
- Act 4 (777→927) : InsertNombre4000 existant
- Act 5 (854→1361) : DramaLine scaleY + silence visuel 3-4s + cartouche filets or

**Nouvelles techniques à intégrer (recherche 2026-05-02) :**
- Grille 100 points qui s'éteignent (alternative/complément InsertNombre4000)
- Sprite Shaka S3 désaturé via CSS filter (aucun nouveau asset)
- Silence visuel 3-4s après DramaLine (fond noir + cercle bordeaux seul)

---

## EXPLORATIONS PRÉVUES (mini-renders isolés, sans toucher le projet principal)

### Option A — LightLeaks test
Créer une composition de test `LightLeakTest` dans Root.tsx :
- 60 frames, fond bordeaux → light leak → fond noir
- Voir l'effet concret avant de décider si on l'intègre dans S4
- `npx remotion add @remotion/light-leaks` (vérifié : compatible v4.0.452)

### Option B — LottieFiles test
Créer une composition de test `LottieTest` :
- Chercher sur LottieFiles une icône libre : épée, couronne, ou flèche
- L'intégrer via `@remotion/lottie` sur fond de carte
- Évaluer si ça vaut la peine pour les légendes Atlas futures

### Option C — AudioVisualization test
Créer `AudioVizTest` sur la narration Shaka existante :
- `useWindowedAudioData()` + `visualizeAudio()`
- Contour ZAF qui pulse en intensité avec la voix
- Évaluer l'impact vs la complexité

**RÈGLE : ces tests sont dans des compositions séparées. Jamais modifier AtlasShakaFull.tsx pendant les tests.**

---

## CONTEXTE STRATÉGIQUE (décisions actées cette session)

### Pourquoi Shaka est plus difficile que Mansa Moussa
- Mansa Moussa = histoire de territoire + mouvement → carte IS le propos
- Shaka = histoire de psychologie → la carte ne peut pas montrer l'intériorité
- Solution retenue : carte + inserts Remotion poussés + PixelLab pour la "chair humaine"
- Pas de Seedance pour S4 (rupture stylistique si Hook Seedance pas fait avant)

### Philosophie émotionnelle validée (recherche 2026-05-02)
**Soustraction, pas addition.** Après chaque pic émotionnel : vide visuel 3-4s.
Référence complète : `memory/tools/remotion-capacites-avancees.md`

### Prochains épisodes Atlas idéaux après Shaka
- Hannibal Barca (Carthage → Alpes → Rome) = plus facile, trajet pur
- Empire du Ghana (routes or trans-sahariennes) = facile, flux animés
- Voir liste complète dans `memory/tools/remotion-capacites-avancees.md`

---

## STARTER PROMPT pour la prochaine session

```
Lis COMPACT_CURRENT.md et NEXT-SESSION-shaka-zulu-vague2.md.
On reprend Atlas Shaka Zulu.

Priorité 1 : télécharger le ZIP Nandi PixelLab (falling-back-death) et vérifier les frames.
Priorité 2 : mini-render LightLeaks test (composition isolée, pas toucher AtlasShakaFull).
Priorité 3 : si LightLeaks validé → coder S4 Nandi selon SYNTHESE-S4-LOCKED.md.
```
