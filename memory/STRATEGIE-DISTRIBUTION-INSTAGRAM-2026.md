# Stratégie Distribution Instagram/Réseaux — Kora & Cartes (2026)

> Consolidé 2026-05-31. Source : conversation Gemini (27 échanges) + vérification web 3 agents (sources 2025-2026).
> Gemini avait raison sur l'ARCHITECTURE, faux sur les CHIFFRES (fausse précision) et 2 glissements conceptuels.
> Complète [[ANGLE-MACRO-SOUVERAIN]] côté distribution. Ne PAS reprendre les chiffres de Gemini non vérifiés.

---

## Le système à 3 flux (validé — réutilise les assets existants, zéro production neuve)

| Flux | Source | Nature | Cadence | Rôle |
|---|---|---|---|---|
| **1. Carrousels analytiques** | Newsletter GEO Africa Watch (déjà automatisée) | Statique, charte bleu/or, angle macro | 2-3×/sem | Autorité, capture audience qualifiée |
| **2. Carrousels "Good News Macro"** | Skill `last30days` (fenêtre 7j) | Statique, même charte | ~1×/sem | Aimant grand public, top funnel |
| **3. Carrousels animés (hybrides)** | Extraits vidéos Remotion/Mapbox déjà publiées | Vidéo-loop en fond + texte | À chaque vidéo | Bande-annonce → renvoi vers la vidéo |

Distribution : **Postiz** (déjà en place). CTA des 10 premières vidéos = "clique sur l'avatar @koraetcartes en haut du post" (zéro outil tiers, décision validée).

---

## ⭐ PIPELINE CARROUSEL HYBRIDE ANIMÉ — V2 VALIDÉE (2026-05-31)

> Standard de qualité validé par Aziz sur la slide test "6 pays" (Or Africain).
> Code : `src/projects/souverain/carousels/hybrid/` (Beat3bMapClean.tsx + CarouselSlideHybrid.tsx).
> Render Mapbox propre : https://files.catbox.moe/lbecs5.mp4 (V2 ref).

**Principe fondateur (Aziz)** : toutes nos vidéos sont DÉJÀ animées (Remotion ou Mapbox). Le carrousel hybride RÉUTILISE l'animation existante — pas de re-render spécial systématique. 3 cas :
1. **Slide sur séquence Mapbox** (ex "6 pays") → re-render PROPRE sans overlays (sous-titres karaoké + labels incrustés à retirer). Variante du beat sans `CountryLabel`/`CountriesCounter`/`Subtitles`/`ProgressBar`/`Audio`. Seul cas qui exige un vrai re-render.
2. **Slide sur graphique Remotion** (Hook, stats "3%"/"48%") → animation premium déjà codée, on la réutilise (re-render composant propre ou extrait segment vidéo).
3. **Slide statique / sans anim forte** → Ken Burns léger (zoom/pan lent) SI nécessaire. Pas grave si statique.

**Priorité absolue : HOOK ANIMÉ.** C'est le scroll-stopper (cohérent veille : slide 1 = scroll-stopper). Si Hook + 2 premières slides bougent, le reste peut alterner animé/statique — le rythme de contraste est même bénéfique.

**Specs V2 (standard réutilisable)** :
- Format **1080×1350 (4:5)** Instagram. Export 9:16 séparé si TikTok.
- Fond : clip animé propre (`OffthreadVideo`, objectFit cover) + voile dégradé navy (bas 0.92 pour lisibilité).
- Header : K&C centré + **1 rangée de barres de progression** (barre courante en gold). **JAMAIS "SLIDE X/8"**.
- Texte : highlight serif gold ~96px + corps ivory `#f5efe0` serif **~52px** (pas 40 — trop petit sur mobile, retour Aziz), ombres portées fortes.
- Footer : @koraetcartes gold.
- Animation : laisser respirer **~5s** (pas 2.6s — retour Aziz), durée slide ~6s.
- Charte : navy `#16213a`, gold `#c8a951`, ivory `#f5efe0`, font serif (Georgia).

**Reste à industrialiser** : les 7 autres slides Or Africain (repérer segment vidéo par slide), puis les 3 autres carrousels (Thiaroye, Mansa Moussa, Vraie Taille). Mansa Moussa = fichiers à régénérer. Tous étaient en 9:16 (mauvais ratio IG) → refonte hybride 4:5 = occasion de faire propre.

---

## CORRECTIONS TECHNIQUES NON-NEGOTIABLE (erreurs Gemini corrigées par vérif)

### 1. RATIO — ⛔ JAMAIS un export 9:16 unique multiplateforme
- Instagram **crope tout carrousel au-delà de 4:5** (perte haut/bas).
- **Instagram / Facebook carrousel → 4:5 (1080×1350)** recommandé, ou 1:1 safe.
- **TikTok Photo Mode → 9:16 (1080×1920)** natif.
- **Gotcha confirmé** : la **slide 1 fixe le ratio de tout le carrousel** — toutes les autres sont recadrées dessus. Concevoir toutes les slides (photo ET vidéo) dans le ratio de la slide 1.
- → Pipeline : **2 exports** (4:5 IG/FB + 9:16 TikTok) OU 1:1 si export unique. Source : Instagram crop docs 2026, CarouselMaker, Inro.

### 2. Mix photo+vidéo dans carrousel — CONFIRMÉ
- Faisable. **60s max/slide vidéo**, jusqu'à **20 slides**, 4 Go max/clip.
- Pattern hybride retenu : slide 1 statique (cover) → slides data en vidéo-loop → dernière slide statique (CTA).

### 3. Musique — CONFIRMÉ avec nuance
- IG : audio tendance rend le carrousel **éligible au feed Reels/Explore** (pas un "boost magique"). Réutiliser la musique AI de chaque vidéo = OK, zéro copyright.
- TikTok Photo Mode : son **quasi-obligatoire**.

---

## CHIFFRES INTERDITS (folklore marketing — ne JAMAIS reprendre)

- ❌ "Conversion commentaire→DM 90%" → c'est un *taux d'ouverture* DM mal cité, pas une conversion. Aucune source primaire.
- ❌ "+400% de leads vs lien en bio" → introuvable, probablement fabriqué.
- ❌ "Clic 30-50% en DM" → non vérifiable, claims d'éditeurs d'outils.
- ❌ "TikTok carrousel 2,9× commentaires + 1,9× likes + 81% engagement" → **2 études fusionnées à tort** : promo interne TikTok 2024 (2,9×/1,9×/2,6× partages) + Fanpage Karma 2025 (+81% engagement, mais partages −33%). Elles se **contredisent sur les partages**. Citer l'une OU l'autre avec sa date, jamais empilées.
- Seul fait DM défendable (directionnel, sans %) : un DM s'ouvre plus qu'un email ; un lien en DM se clique plus qu'un lien en bio.

---

## GLISSEMENTS CONCEPTUELS À CORRIGER (Gemini)

### "Analytique neutre convertit mieux" → FAUX raisonnement
- La donnée réelle (beehiiv +138% abos payants 2025) dit que **la niche spécialisée et UTILE** convertit — pas la neutralité.
- Pire cas = neutre + généraliste + non-actionnable.
- → **L'angle macro ne convertit que s'il est ACTIONNABLE pour une audience à pouvoir d'achat** (investisseur, expat, diaspora décisionnaire, entreprise exposée à l'Afrique). "Voici comment ça impacte le monde" → "voici ce que ça change pour toi qui décides". La différenciation = l'utilité, pas la neutralité de ton. Cohérent avec [[ANGLE-MACRO-SOUVERAIN]].

### "Newsletter payante = la monétisation" → modèle le plus DUR
- Références premium (Visual Capitalist, Morning Brew) = **gratuit + sponsoring + licensing B2B**, pas abonnement individuel.
- Conversion free→paid réaliste newsletter niche solo = **2-5%** (pas 5-10%). Caspian Report ≈ 500 payants Patreon malgré sa réputation.
- Pour 1000 payants → ~20-50k inscrits gratuits requis = objectif d'**années**, pas de mois.

### ⭐ DÉCISION DURABLE Aziz (2026-05-31) — PAYANT ÉCARTÉ DÈS LE DÉPART
- **Modèle = 100% gratuit côté lecteur.** Monétisation différée par **sponsoring (newsletter) + YouTube (AdSense + sponsors)**. Deux sources complémentaires qui se nourrissent.
- **Preuve par l'exemple** : les plus gros créateurs IA (Matt Wolfe/Future Tools, The Rundown, Superhuman, Superpower, TLDR) = tous gratuits, tous sponsoring. Secteur où Aziz est lui-même abonné → modèle déjà validé à grande échelle, pas besoin de le re-tester.
- **Pourquoi c'est la bonne décision (raisonnement Aziz, validé)** :
  1. Le gratuit te met en concurrence avec personne (créneau data-viz Afrique premium vide) ; le payant te mettrait face à RFI/Jeune Afrique/The Economist.
  2. **Ne pas facturer PRÉSERVE la neutralité éditoriale.** Le payant force vers "utilité actionnable décideur/investisseur" → dérive vers du conseil financier. Sans facturation, on garde la voix d'analyste macro neutre sans pression de conversion.
  3. Newsletter = actif qu'on POSSÈDE (vs abonnés Instagram que l'algo peut retirer) + inventaire pub futur.
- **Rôle newsletter au lancement** : valider l'intérêt + **capturer les emails**. La landing page reste active DÈS le lancement public — collecter gratuitement maintenant est gratuit ; re-collecter plus tard est impossible. Chaque email non capturé = perdu pour toujours. → Zéro stress monétisation, **zéro relâchement sur la capture**. La landing reste, le "payez-moi" disparaît.
- Avantage Remotion/Mapbox reste exploitable plus tard via **licensing des cartes/data-viz** (modèle Visual Capitalist), mais bien après — pas une priorité de lancement.

---

## CE QUI EST CONFIRMÉ (sources 2025-2026)

- **Double reach** : réel (Mosseri confirme "second chance" en démarrant slide 2). Mais "ça double" non chiffré. Dire "Instagram peut redonner une chance en démarrant slide 2".
- **Carrousel = meilleur taux d'engagement + saves** sur IG. MAIS **Reel = roi du reach/découverte** → il en faut aussi. Carrousel = profondeur/conversion, Reel = découverte.
- **Espace data-viz géopolitique premium Afrique = réellement sous-occupé** (84% des Africains s'informent via réseaux ; The Continent/Jeune Afrique absents du créneau natif). Vide **réel mais difficile** (sous-occupé car cher/lent à produire → ton stack = le fossé).
- **Postiz** : publie carrousels multi-plateformes, PAS de DM conversationnel. 30+ réseaux.
- **"Lien en bio" ne pénalise PAS** le reach (démenti officiel Mosseri = folklore). ⚠️ MAIS Meta **teste limite 2 posts/lien externe/mois** (déc. 2025, sauf Meta Verified ~15$/mois) → à surveiller.
- **Cadence** : 3-5 posts/sem = zone optimale (double la croissance vs 1-2 ; >5 = rendements décroissants). 2-3 carrousels seuls = suffit pour ne pas décliner, insuffisant pour croître → ajouter Reels.
- **Couvertures Reels custom** (1080×1440, zones sécurité haut 220px / droite 120px) + **épingler 3 posts** : confirmés. "Séries" = playlists de Reels (flou, parler de playlists).
- **Hook coupé / panorama continu** : pratiques réelles éprouvées par la communauté (gain non prouvé statistiquement, 3 slides = sweet spot, ~80% complétion swipe).
- **Clic avatar → profil** : triv100% (pas besoin de "cherche @...").

---

## AUTOMATION DM — état réel (pour PLUS TARD, pas les 10 premières vidéos)

- **ManyChat free tombé à 25 contacts/mois** (mars 2026). Essential 14$/250 contacts. Pro 29$/2500.
- **n8n self-hosted** : faisable (templates officiels) mais complexe — OAuth, app Meta Developer, App Review (semaines), ~200 DM/h. Fragile à maintenir.
- **SocialBu** : auto-reply commentaires par mot-clé confirmé, mais payant (~19$/mois), free inutilisable.
- **Brevo** : ❌ ne fait PAS de comment-to-DM (Gemini s'est trompé — c'est de l'export data IG vers email marketing).
- **Meta Business Suite natif** : réponses auto basiques seulement, PAS d'équivalent ManyChat gratuit.
- **Contrainte Meta** : compte Business/Creator + app Developer + App Review obligatoires en prod (sinon 25 test users). Fenêtre 24h pour DM libre. Page FB en voie d'être optionnelle (flux Instagram Login).

---

## Veille terrain last30days (mai 2026) — confirmations

> 9 threads Reddit + 16 X + 4 TikTok + 8 pages web. Tout converge avec notre doc.

- **Repurposing 1-idée-3-formats = LE workflow créateur 2026.** Carrousel 4:5 IG + vidéo 9:16 TikTok/Reels + 16:9 YouTube, sans refaire le travail. **Carrousel et vidéo partagent le MÊME script** (le carrousel = sous-titrage de la narration). On a déjà le script = narration ElevenLabs. Source : 2Slides, ContentBeta.
- **Carrousels mixtes images+vidéo = le PLUS haut engagement (~2.33%)** vs ~0.72% statique vs Reels. → Le flux hybride animé (n°3) est le bon pari, moins saturé que le statique pur. Source : EvergreenFeed, ReelBase (Carousel Reels 12% engagement / 89K reach).
- **Vidéo = découverte, carrousel = rétention.** Consensus net (@MichaelGannotti). Mix optimal **60-70% Reels / 20-30% carrousels / 10% statique**. → Les carrousels SEULS ne suffisent pas à la croissance : il FAUT publier les vidéos en Reels (déjà fait via Postiz). Système complet = Reel (découverte) + carrousel animé même source (rétention).
- **TikTok carrousels = canal SEO sous-estimé mais LAG 8-10 jours** avant de surfacer en recherche, puis compound pendant que les vidéos meurent en 4j. → Le 9:16 existant n'est pas perdu = format TikTok natif. Source : r/TikTokMarketing.
- **Funnel carrousel → PDF/email gratuit = pratique validée.** "Sell directly on social = burn out ; drive into funnel = grow fast" (Heropost). Confirme notre décision gratuit + capture email.
- **Open loop obligatoire** : réponse slide 1 révélée slide 5-6. Target swipe-through **65%+**, sweet spot **7-10 slides** (nos carrousels = 8 ✅).
- **Saves = signal-roi du contenu éducatif evergreen** = pile la niche data-viz.
- Tendance chaude : "générer un carrousel IG avec l'IA en <60s" (@cipherwebthree 1287 likes). On est en avance : génération par CODE (Remotion), pas prompt manuel.

## Recommandation stratégique synthétique (étayée)

Angle **MACRO analytique** (neutralité préservée — assumée comme actif de marque, pas obstacle puisqu'on ne facture pas). Monétisation **100% gratuite côté lecteur** → **sponsoring (newsletter) + YouTube (AdSense/sponsors)**, payant ÉCARTÉ (voir décision durable ci-dessus). Newsletter = validation intérêt + capture emails (landing active dès le lancement). Format : **3-5 posts/sem** mêlant carrousels (saves + funnel email) ET Reels animés (reach). "Good News" = canal grand public **distinct**, jamais fusionné à la marque analyste (sinon dilue + attire faible pouvoir d'achat).
