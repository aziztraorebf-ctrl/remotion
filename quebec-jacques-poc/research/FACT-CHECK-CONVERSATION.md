# Fact-Check de la conversation Atlas — Validation avant production
> 2026-04-28 | Verification systematique de toutes les affirmations chiffrees et techniques

## TL;DR

| Affirmation initiale | Statut | Vraie valeur |
|----------------------|--------|--------------|
| Mapbox $50/mois pour 10 videos | **FAUX** | **Gratuit** (50k map loads/mois free) |
| Vidéo longue = explosion coût Mapbox | **FAUX** | Identique a video courte (1 map load/render) |
| ElevenLabs $22-99/mois | **CORRECT** | Creator $22, Pro $99 confirmé |
| Gemini Flash Image ~$0.10-0.15/image | **PARTIEL** | $0.067/image en 1024px, $0.034 en batch |
| Vercel Blob gratuit | **CORRECT** | Hobby 1GB free, $0.023/GB-mois au dela |
| RPM Afrique francophone 1-3$/1000 | **A NUANCER** | South Africa $6-10, Nigeria $2.50-2.89, autres <$2 |
| 5-10h/video apres pipeline rode | **ESTIMATION** | Realiste mais a valider par production reelle |
| react-map-gl + Remotion compatible | **CORRECT MAIS NUANCE** | Fonctionne, mais GPU disabled en headless = LENT |

## Erreurs majeures rectifiees

### 1. Cout Mapbox (rectification dans la conversation)

**ERREUR** : "Pour produire 1 video de 80s a 30fps avec carte qui occupe 70% du temps = ~17000 tuiles par video. 3 videos par mois maximum sur le plan gratuit. Au-dela $50/mois pour 10 videos."

**REALITE** :
- Mapbox facture par **map load** (initialisation Mapbox GL JS), pas par tuile
- 1 render Remotion = 1 map load (la session reste ouverte pendant tout le rendu)
- 100 videos/mois = 100 map loads → **largement dans le tier gratuit (50 000)**
- Limite gratuite atteinte uniquement si tu fais 50 000 videos/mois OU si la carte est exposee publiquement avec beaucoup de visiteurs

**Verdict** : **Mapbox = gratuit a vie pour usage YouTube production**.

Source : [Pricing | Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/pricing/)

### 2. Performance Remotion + Mapbox-GL en headless mode (POINT NOUVEAU important)

**OMISSION** : je n'avais pas mentionne que rendre du WebGL en headless mode est plus lent que prevu.

**REALITE** :
- En mode headless (rendu serveur), **Chromium désactive le GPU par defaut**
- WebGL (Mapbox, Three.js) sans GPU = **rendu beaucoup plus lent** (~5-10x)
- Sur Mapbox-GL en mouvement complexe : "il n'est pas possible d'atteindre 60fps stable si la camera est animee"
- **Mitigation** : configurer `chromiumOptions.gl: "angle-egl"` (Linux) pour activer GPU
- **Risque** : memory leaks avec angle, doivent splitter les renders longs en plusieurs parties

**Implication concrete** :
- Render local sur Mac : OK avec GPU, vitesse acceptable
- Render Remotion Lambda (cloud) : **necessite config GPU explicite**
- Pour notre 80s video : **probablement 5-15 min de render** (vs 1-2 min sans Mapbox)
- Pour video 10 min : **30-60 min de render** possible

**Verdict** : reste viable mais demande **calibrage performance reel** au premier prototype. C'est un **risque technique a valider** lors de la session 1.

Source : [Performance Tips | Remotion](https://www.remotion.dev/docs/performance), [GPU options](https://www.remotion.dev/docs/gl-options)

### 3. RPM YouTube Africa francophone

**MES CHIFFRES** : "RPM Afrique francophone = 1-3$/1000 vues"

**REALITE** (donnees 2026) :
- South Africa : **CPM $6.50-10** (RPM ~$3.50-5.50 apres cut YouTube 45%)
- Nigeria : CPM $2.50-2.89 (RPM ~$1.40-1.60)
- Autres pays Afrique : CPM <$2 (RPM <$1.10)
- France : CPM ~$5-8 (RPM ~$2.75-4.40)
- Belgique/Suisse : similaire France
- Canada : CPM $7-10 (RPM ~$3.85-5.50)
- US : CPM $9-13 (RPM ~$5-7)

**Ma claim "1-3$/1000 vues" etait juste pour les pays Africains hors RSA, mais imprecise.**

**Verdict revise** :
- Audience pure Afrique francophone (hors RSA) : RPM ~$1-2/1000
- Audience mixte francophonie + diaspora (notre cible) : RPM ~$3-5/1000 (ce qui justifie le pivot strategique)
- Mon estimation initiale "$4/1000 RPM mixte" pour le calcul revenu mois 12-18 reste **realistement defendable**

Source : [YouTube CPM/RPM Rates 2026](https://www.lenostube.com/en/youtube-cpm-rpm-rates/), [CPM by Country 2026](https://upgrowth.in/youtube-cpm-by-country-global-comparison-2026/)

## Verifications confirmant mes affirmations

### ElevenLabs pricing 2026 (CONFIRME)

| Plan | Prix | Credits | Notre besoin |
|------|------|---------|--------------|
| Free | $0 | 10 000 | INSUFFISANT (1 video Atlas = ~600-800 chars) |
| Starter | $5 | 30 000 | OK pour 30-40 videos courtes/mois |
| **Creator** | **$22** | **100 000** | **PLAN RECOMMANDE** (~120 videos/mois) |
| Pro | $99 | 500 000 | Trop pour le bootstrap |

**Verdict** : $22/mois Creator suffit largement.

Source : [ElevenLabs Pricing](https://elevenlabs.io/pricing)

### Gemini 3.1 Flash Image Preview (PRECISE)

- **Prix officiel** : **$0.067/image en 1024px** (default)
- Resolution 2K : $0.101/image
- Resolution 4K : $0.151/image
- **Batch processing** : -50% donc $0.034/image en 1024px

**Pour notre 3 styles comparison** (qu'on a deja generee) : ~$0.20 total. Je l'avais surestime a $0.30-0.45.

**Pour 1 video Atlas typique** : 8-12 images custom (icones Adinkra, portraits Paper-Craft, B-roll) = **~$0.50-1/video**.

Source : [Gemini 3.1 Flash Image Pricing](https://www.aifreeapi.com/en/posts/gemini-flash-image-generation-pricing)

### Vercel Blob (CONFIRME)

- **Hobby (gratuit)** : **1 GB stockage/mois** + 1 GB transfer/mois inclus
- Au-dela : $0.023/GB-mois stockage + $0.05/GB transfer

**Pour notre usage** : 1 GB suffit pour ~50-100 images + 5-10 videos courtes. **Largement suffisant pour le bootstrap.**

**Restriction** : Hobby plan **non-commercial only**. Si la chaine YouTube monetise, il faudrait Pro ($20/mois).

**Verdict** : Vercel Blob = **$0** pendant phase pre-monetisation, **$20/mois** une fois la chaine monetisee.

Source : [Vercel Blob Pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)

### Compatibilite react-map-gl + Remotion (CONFIRME AVEC NUANCE)

**Confirme techniquement faisable** :
- Remotion supporte WebGL (Three.js, Mapbox, Skia, P5.js)
- react-map-gl s'integre comme composant React standard

**Nuances techniques importantes** :
1. **GPU obligatoire pour perf** : sans config explicite, render extremement lent
2. **Memory leaks possibles** sur longs renders avec angle-egl → splitter en chunks
3. **Mapbox-GL ne tient pas 60fps** sur camera animations complexes → **on doit cibler 30fps** (deja le defaut Remotion)
4. **Stack actuel POC v2** : `mapbox-gl@3.22` + `react-map-gl@8.1` confirmes deja installes

Source : [Remotion GPU](https://www.remotion.dev/docs/gpu), [Remotion Performance](https://www.remotion.dev/docs/performance)

## Cout total mensuel estimé pour la chaine Atlas

**Phase bootstrap (mois 1-6)** :

| Service | Cout |
|---------|------|
| Mapbox | **$0** (free tier suffit) |
| ElevenLabs Creator | $22/mois |
| Gemini API (images) | $5-15/mois (selon volume) |
| Vercel Blob | $0 (Hobby free) |
| OpenAI/Perplexity (fact-check) | $5-10/mois |
| Domain name (futur) | $1/mois (proratise) |
| **TOTAL** | **$33-48/mois** |

**Phase apres demarrage (mois 6+)** :
- Vercel Pro si monetisation : +$20/mois
- ElevenLabs Pro si volume haut : +$77/mois (de $22 a $99)
- TOTAL eventuel : **$70-150/mois max** au fur et a mesure de la croissance

**Verdict** : la stack est **economiquement viable** sur le seuil $2500-3000/mois cible apres mois 12-18.

## Risques techniques residuels (a valider en session 1)

| Risque | Severite | Mitigation |
|--------|----------|------------|
| Render Mapbox+Remotion lent (>30 min/video 80s) | Moyenne | Tester GPU config, sinon pre-render carte en sequence d'images |
| Memory leaks sur longs renders | Moyenne | Splitter en chunks 30s |
| Style.json Parchemin Mande necessite > 8h coding | Basse | Iterer sur multiples passes, accepter v1 imparfaite |
| Lisibilite style sur differentes zooms | Moyenne | Tester sur 5+ scenes pendant prototype |
| Cout reel video productions hors prevision | Basse | Tracker depenses par video, ajuster |

## Composants techniques validés

✅ Remotion 4.0.452 deja installe (POC v2)
✅ mapbox-gl@3.22 deja installe
✅ react-map-gl@8.1 deja installe
✅ ElevenLabs API key dans `.env`
✅ Gemini API key dans `.env`
✅ Vercel Blob token dans `.env`
✅ Mapbox token dans `.env` (POC v2)

**Tout l'environnement technique est pret.** Aucun setup supplementaire necessaire.

## Conclusion

**Le projet Atlas est techniquement et economiquement viable.** Aucun show-stopper detecte.

**Risque principal** : performance render Remotion+Mapbox en pratique (a valider session 1).

**Risque secondaire** : style.json Parchemin Mande doit demander iteration (estimation 8-15h vs 4-8h initialement annonces).

**Tout le reste est confirme** : prix raisonnables, stack compatible, environnement deja setup.
