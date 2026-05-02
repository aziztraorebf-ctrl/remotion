---
name: NEXT SESSION — Atlas Tombouctou + Style Parchemin Mande
description: Brief complet pour demarrer la production de la 1ere video Atlas (Tombouctou) avec style Mapbox custom Parchemin Mande
type: project
---

# NEXT SESSION — Atlas Tombouctou : Style Mapbox + Production v1

> Cree : 2026-04-28
> Statut : Brief pret. Decisions strategiques validees, fact-check effectue. Demarrage immediat possible.

---

## Contexte (a relire en debut de session)

1. **Decisions strategiques 2026-04-27** :
   - Pivot YouTube hors politique (newsletter politique reste separee, en auto-pilote)
   - Audience cible : francophonie mondiale + diaspora bilingue (RPM mixte ~$3-5/1000)
   - Pilier : Atlas (richesse-record + comparaisons + heros oublies)
   - Seuil revenu cible : 2500-3000 EUR/mois mois 12-18
   - Bootstrap accepte 6 mois a 0-300 EUR

2. **Template Atlas v1** sauvegarde dans `memory/templates/script-atlas-v1.md`
3. **2 scripts brouillons valides** :
   - `quebec-jacques-poc/scripts-atlas/script-mali-mansa-moussa-v1.md`
   - `quebec-jacques-poc/scripts-atlas/script-tombouctou-v1.md`
4. **Style choisi** : **Parchemin Mande** (option B) — differenciation maximale, ancrage culturel
5. **Pilote choisi** : **Tombouctou** (moins satured que Mali, vide francophone confirme)
6. **Fact-check 2026-04-28** : `quebec-jacques-poc/research/FACT-CHECK-CONVERSATION.md` — toutes affirmations validees ou rectifiees

---

## Stack technique confirmee

- **Remotion** 4.0.452 ✅ (POC v2)
- **mapbox-gl** 3.22 ✅ (POC v2)
- **react-map-gl** 8.1 ✅ (POC v2)
- **Gemini 3.1 Flash Image Preview** ✅ (utilise pour 3 images comparison)
- **ElevenLabs API** ✅ (config existante)
- **Vercel Blob** ✅ (token dans `.env`)
- **Mapbox token** ✅ (`quebec-jacques-poc/.env`)

**Tout est pret.** Aucun setup supplementaire necessaire.

---

## Coûts mensuels estimes (validés)

| Service | Cout |
|---------|------|
| Mapbox | $0 (free tier 50k map loads/mois) |
| ElevenLabs Creator | $22/mois |
| Gemini API (~10 images/video) | ~$0.50-1/video |
| Vercel Blob | $0 (Hobby) |
| Perplexity Pro (fact-check ponctuel) | $5-10/mois |
| **Total bootstrap** | **~$33-48/mois** |

---

## Plan de la session (etapes ordonnees)

### Etape 1 — Coder le style.json Parchemin Mande (4-8h Claude)

**Output** : fichier `mapbox-styles/atlas-parchemin-mande.json` avec les 5 couches principales :
- Background (parchemin cream `#E8D9B8`)
- Pays (terracotta ocre `#A0522D`)
- Frontieres (indigo profond `#2C3E5C`)
- Eau / fleuves (indigo plus clair)
- Labels (typo hybride avec geo + sans-serif)
- Bordures decoratives mudcloth/Adinkra (en couches additionnelles si Mapbox le supporte)

**Reference visuelle** : image B deja generee et publiee sur Vercel Blob (style cible)

### Etape 2 — Aziz uploade sur Mapbox Studio (5 min)

1. Aller sur [studio.mapbox.com](https://studio.mapbox.com)
2. Login avec compte existant (account associé au token Mapbox déjà dans `.env`)
3. New Style → Upload → choisir `atlas-parchemin-mande.json`
4. Recevoir le Style ID : `mapbox://styles/<username>/<style-id>`
5. **Coller le Style ID dans la conversation**

### Etape 3 — Mini-test render (1-2h Claude + Aziz validation)

**Objectif** : valider que le style s'applique correctement EN MOUVEMENT et que Remotion+Mapbox tient la perf.

**Output** : 1 mini-render Remotion de **5 secondes** :
- Camera zoom from globe → Mali → Tombouctou
- Style Parchemin Mande applique
- Pas d'overlays Remotion (style brut)
- Render local avec GPU (config `chromiumOptions.gl: "angle-egl"`)

**Validation** : Aziz visualise sur PC, confirme que :
- Le style s'affiche correctement quand la carte bouge
- Lisibilite OK sur frame mobile (1080x1920 crop)
- Performance acceptable (< 10s par frame)

### Etape 4 — Iterations style si necessaire (1-3h)

Selon retour Aziz :
- Couleurs trop saturees / pas assez ?
- Typo lisible ?
- Bordures mudcloth visibles ou trop subtiles ?
- Frontieres trop epaisses ?

Modifier `style.json` → re-uploader → re-tester.

### Etape 5 — Decoupage scene-par-scene Tombouctou (2-3h)

Pour chaque des 6 segments du script Tombouctou (`script-tombouctou-v1.md`) :
- Source visuelle (Mapbox custom / Gemini insert / Paper-Craft / icones)
- Mouvement camera Mapbox exact (flyTo coords + zoom + bearing + pitch + duration)
- Assets a generer (avec prompts ready-to-use)
- Stats overlay (texte + position + animation)
- Estimation cout par scene

**Output** : `scripts-atlas/script-tombouctou-asset-plan-v1.md` + dashboard Vercel mobile

### Etape 6 — Generation assets (2-4h selon volume)

- Images Gemini (icones Adinkra, portraits Leon l'Africain, manuscrit ancien)
- Narration ElevenLabs avec test des 7 mots problematiques (Tombouctou, Sankoré, Songhaï, Cordoue, Bagdad, Marrakech, Léon l'Africain)
- Forced alignment ElevenLabs

### Etape 7 — Composition Remotion (3-5h)

- Composer les 14 composants Atlas identifies
- Integrer Mapbox custom avec mouvements camera frame-precis
- Sync narration + overlays avec forced alignment

### Etape 8 — Mini-render bloquant + validation Aziz

Render des 18 premieres secondes (hook + scene 1) avant de produire toute la video.

### Etape 9 — Render final + publication multi-plateformes

Si mini-render OK : render complet 80s → upload Vercel → distribution YouTube/TikTok/Instagram.

---

## Risques techniques a valider EN SESSION 1

⚠️ **Performance render Mapbox+Remotion en headless** :
- Test concrete : 1 frame de Mapbox custom doit prendre **< 10s** sur Mac (avec GPU)
- Si > 30s/frame : 80s × 30fps = 240 min de render = **deal-breaker**
- Mitigation possible : pre-render Mapbox en sequence d'images statiques, puis Remotion compose les overlays (decouplage)

⚠️ **Memory leaks** : pour render >5 min, splitter en chunks de 30s

⚠️ **Lisibilite style** : si le style choque sur mobile, on doit ajuster

---

## Outputs livrables fin de session 1

1. `mapbox-styles/atlas-parchemin-mande.json` — style v1
2. Style ID Mapbox uploaded
3. Mini-render 5s validation style
4. Decision GO/NO-GO sur Parchemin Mande (ou pivot vers C monochrome si lisibilite insuffisante)
5. Asset plan Tombouctou scene-par-scene (si style valide)
6. Estimation finale temps + cout production Tombouctou bout-en-bout

---

## Si tout va bien : sessions suivantes

- **Session 2** : production Tombouctou bout-en-bout (4-6h selon performance)
- **Session 3** : render final + publication
- **Session 4** : analyse perf des 7 premiers jours, ajustements
- **Session 5** : Mali (Mansa Moussa) avec mini-serie + meme style

---

## Starter prompt copier-coller pour next session

```
Charge la memoire de session :
1. Lis memory/COMPACT_CURRENT.md
2. Lis memory/NEXT-SESSION-atlas-mali-tombouctou.md
3. Lis memory/templates/script-atlas-v1.md
4. Lis quebec-jacques-poc/scripts-atlas/script-tombouctou-v1.md
5. Lis quebec-jacques-poc/research/FACT-CHECK-CONVERSATION.md

Session Atlas — production video pilote Tombouctou.

Decisions validees :
- Style choisi : B Parchemin Mande
- Pilote : Tombouctou (mini-serie avec Mali ensuite)
- Stack : Remotion 4 + mapbox-gl 3.22 + react-map-gl 8.1 + Gemini 3.1 Flash Image Preview
- Tout est setup dans .env

Premiere etape : coder mapbox-styles/atlas-parchemin-mande.json (4-8h)
puis Aziz upload sur studio.mapbox.com → me donne le Style ID → on continue.

Reference visuelle cible : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/B-parchemin-mande.png

Lance directement etape 1 (code style.json) en demandant precisions si besoin.
```

---

## Documents de reference (URL stables Vercel mobile)

- **Index recherche complete** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/index.html
- **Comparison styles A/B/C** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/comparison.html
- **Galerie cartes vivantes** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/live-maps/live-maps.html

---

## Decisions deja figees (NE PAS rediscuter en session)

✅ Style Parchemin Mande choisi (option B)
✅ Pilote Tombouctou choisi (apres Mali en episode 2)
✅ Audience francophonie mondiale + diaspora
✅ Mapbox = essentiellement gratuit
✅ Stack technique disponible et fonctionnelle
✅ Pas de pivot vers niche RPM plus haute (territoire valide)

**Si Aziz veut rediscuter une decision, c'est OK, mais le default est : ON EXECUTE.**
