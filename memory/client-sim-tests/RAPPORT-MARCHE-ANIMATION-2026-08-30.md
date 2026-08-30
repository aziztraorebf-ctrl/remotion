# Rapport marché — animation d'interface / Lottie / motion design produit

**Date de collecte : 2026-08-30.** Toutes les données ci-dessous ont été consultées ce jour, sauf mention explicite.
Mission : savoir ce qui est réellement COMMANDÉ, à quel PRIX, et ce que les acheteurs DISENT — pour décider quelles pièces de portfolio produire.

⛔ **Contrainte respectée** : aucun contournement anti-bot. Aucune rotation d'empreinte, d'User-Agent ou de proxy. Les 403 rencontrés sont RAPPORTÉS comme données, pas franchis.

---

## 1. Ce qui est ACCESSIBLE ou non (état exact des sources)

| Source | Outil | Résultat | Cause exacte |
|---|---|---|---|
| `fiverr.com/search/gigs?query=lottie+animation&sort_by=best_selling` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `fiverr.com/search/gigs...` | Firecrawl scrape | ❌ | **HTTP 402** — « Insufficient credits to perform this request » (compte à sec, pas un blocage Fiverr) |
| `fiverr.com/alan_art/create-a-lottie-animation...` (page de gig) | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `fiverr.com/hire/lottie-animation` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `fiverr.com/gigs/lottie-animation` (page catégorie) | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `lottiefiles.com/hire` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `lottiefiles.com/marketplace/animators` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `lottiefiles.com/featured` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `lottiefiles.com/blog/...cost-hire-motion-graphics-designer` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `upwork.com/hire/lottie-freelancers/` | WebFetch | ❌ | **HTTP 403 Forbidden** |
| `contra.com/search?q=lottie` | WebFetch | ⚠️ | HTTP 200 mais **page vide de contenu** (SPA — seules les métadonnées de header sont revenues, zéro profil, zéro prix) |
| Tavily (search + extract) | MCP | ❌ | **HTTP 432** — « This request exceeds your plan's set usage limit » (quota du compte épuisé) |
| Firecrawl (search) | MCP | ❌ | **HTTP 402** — crédits épuisés |
| Reddit via WebSearch | WebSearch | ❌ | **API Error 400** — « domains not accessible to our user agent: ['reddit.com'] » (blocage plateforme, non contournable) |
| **`dribbble.com/services/*`** | WebFetch | ✅ | **Accessible, riche** — prix réels, titres, livrables, délais |
| **`kamotionstudio.site`** | WebFetch | ✅ | Accessible |
| **`creattie.com/blog/how-much-lottie-animations-cost`** | WebFetch | ✅ | Accessible (⚠️ vendeur de stock = source intéressée) |
| **`biztoolkit.co` / `sidestackers.com`** (barèmes) | WebFetch | ✅ | Accessible ⚠️ **aucune méthodologie déclarée** (voir §7) |
| **`lottielab.com/templates/icons`** | WebFetch | ✅ | Accessible |
| **WebSearch (index Google/Bing)** | WebSearch | ✅ | **Le seul angle productif sur Fiverr** — les titres indexés contiennent le prix d'entrée |

**Conclusion d'accès** : Fiverr et LottieFiles sont **hermétiquement fermés** en lecture normale (403 sur 100 % des chemins testés, 5 chemins Fiverr + 4 LottieFiles). Le volet C tel que commandé (explorer l'annuaire LottieFiles) **n'a pas pu être réalisé**. En compensation, **Dribbble Services s'est révélé un gisement supérieur à Fiverr** pour notre question : prix au projet, livrables détaillés, délais, révisions — c'est le segment où un studio se vend, pas où un gig se brade.

---

## 2. Ce qui se VEND (chiffres bruts, chaque ligne sourcée)

### 2.1 Fiverr — titres exacts + prix d'entrée (via index de recherche uniquement)

⚠️ **Statut de cette donnée** : titre + prix d'entrée proviennent du **titre indexé** du résultat de recherche (format Fiverr « … for $N on fiverr.com »). Les pages elles-mêmes étant en 403, je **n'ai pas pu vérifier** paliers Standard/Premium, délais, nombre d'avis ni notes sur ces gigs.

**Requête « lottie animation website app »** ([WebSearch, 2026-08-30](https://www.fiverr.com/)) :

| Prix d'entrée | Titre exact du gig | URL |
|---|---|---|
| $10 | « I will create lottie animation for web and apps » | fiverr.com/shumys/create-lottie-animation-for-web-and-apps |
| $10 | « I will create custom lottie animation for your website and app » | fiverr.com/sherazkhan4426/create-stunning-lottie-json-animation-or-animated-gif-for-your-web-and-mob-app |
| $10 | « I will create lottie animation or gif for website and app » | fiverr.com/rityra/create-lottie-animation-or-gif-for-website-and-app |
| $10 | « I will create lottie animation for mobile app UI » | fiverr.com/djxbolt/make-lottie-animation-for-website |
| $15 | « I will create lottie animation or svg animation in 24 hours » | fiverr.com/taurusa18/create-lottie-animation-in-24-hours |
| $20 | « I will create a lottie animation for your website or app » | fiverr.com/stass_motion/create-a-lottie-animation-for-your-website-or-app |
| $20 | « I will create json lottie animation for your website and app » | fiverr.com/ruslancomb/create-json-lottie-animation-for-your-website-and-app |
| $20 | « I will create lottie and GIF animations for your web and mobile app » | fiverr.com/shanithdha/create-lottie-animation-for-the-mobile-and-web-sites |
| $25 | « I will create lottie, **json or rive** animation for your web and app » | fiverr.com/cecepandeskor/create-lottie-animation-for-your-web-or-mobile-app |
| $35 | « I will create custom animated gif or lottie » | fiverr.com/flatonicstudios/create-lootie-animation-for-website-and-mobile |
| $50 | « I will create lottie animation for your website or mobile app » | fiverr.com/aryo_dimas/create-lottie-animation-for-your-website-or-mobile-app |
| $65 | « I will create **lightweight** lottie animation for web and apps » | fiverr.com/alan_art/create-a-lottie-animation-for-your-website-or-app |
| $80 | « I will create json lottie animation for your web or app » | fiverr.com/koolton/create-json-lottie-animation-for-your-web-or-app |
| $100 | « I will create a custom lottie animation for your website or app » | fiverr.com/graphicslc/create-a-lottie-or-gif-animation-for-your-website-or-app |

**Fourchette Fiverr « lottie animation » observée : $10 → $100** (14 gigs relevés).

**Requête « ui animation »** ([WebSearch, 2026-08-30](https://www.fiverr.com/)) — $5 à $595 :

| Prix | Titre exact | Vendeur |
|---|---|---|
| $5 | « I will make ui animation prototype for app and website » | design_alicia |
| $10 | « I will do animated website and UI eliminates for mobile app and GIF animation » | imonkhangfx |
| $30 | « I will make interactive UI animation using principle or after effect » | ketigabelas |
| $50 | « I will create mobile ui animations » | tanzeel_web |
| $80 | « I will make UI animation for your mobile app » | anonymograph |
| $100 | « I will create UI animation app demo video app explainer video product demo » | desmond_dy |
| $200 | « I will animate your UI designs » | andreweugene |
| $250 | « I will creat 2d or 3d UI animation for your softwear apps demo vedio » | saifulshohag480 |
| **$595** | « I will do UI animations for mobile app » | ambermove |

**Requête « saas product demo / explainer »** ([WebSearch, 2026-08-30](https://www.fiverr.com/)) — $30 à $750 :

| Prix | Titre exact | Vendeur |
|---|---|---|
| $30 | « I will do animated saas explainer video or saas demo product saas video saas animation » | mafowe |
| $50 | « I will create saas explainer video, demo video for saas product » | m_junaid87 |
| $70 | « I will create saas explainer animation demo video for saas product » | farhanjamali |
| $100 | « I will create product demo video saas explainer video saas animation » | philipkluge |
| $100 | « I will create saas animated explainer video saas product demo video saas ads animation » | james_vidxx |
| $180 | « I will create saas product demo video and software explainer video animation » | julia_yousuf |
| $190 | « I will create saas explainer video, saas animation for saas product » | xxguccixx |
| $300 | « I will create saas explainer video, software demo, **ui animation**, product demo video » | alfredbuffy |
| **$750** | « I will create saas explainer video, saas animation for product demo » | artem_kabanets |

**Micro-interaction sur Fiverr** : une seule occurrence sourcée, $15 — « I will create simple micro animation gif for your website or apps » (fauzansahri). ⚠️ **Un seul gig : ne pas en tirer de conclusion sur le segment.**

### 2.2 Dribbble Services — le segment PRO (source la plus fiable obtenue)

Toutes ces données viennent de pages **effectivement chargées** le 2026-08-30.

**Requête « lottie-animation »** ([dribbble.com/services/search/lottie-animation](https://dribbble.com/services/search/lottie-animation)) :

| Prix | Titre exact | Designer |
|---|---|---|
| $10 | Lottie Json Gif Animation | Tanmoy Nokrek |
| $15 | I Will Create Lottie Animation In 24h | Taurusa Mahda S. |
| $20 | Lottie Animation Of Rotating Texts: V1 | Lubomir Soldan |
| $20 | Lightweight Lottie Animations | Dhiren Motion Designs |
| $50 | Lottie Animation / Logo Animation | Avram Mitrovic |
| $100 | Lottie Animations | Kedar Munje |
| $100 | Lottie And Rive Custom Animations | motioneugene |
| $149 | **Highly Optimized** Lottie Animation | Rockerzz |
| $300 | Rive/Lottie Animation | Dima Moiseenko |
| **$350** | **SaaS Hero Animation \| Lottie** | Tanjil Mahmud |
| $350 | Custom Lottie Animations & UI Motion | Danny Feeling |
| $400 | Lottie Animation & Icon Motion Design | Simay Yenice |
| $500 | Lottie Icon Animation | Sasha Grabovich |
| $500 | **Lottie Hero Section Animation** | Sasha Grabovich |
| $600 | Character Animation & Lottie(json) File | WookMotion |
| **$1 150** | **Product Motion Pack** | Tanjil Mahmud |
| $2 500 | Lottie / Json Animations For App And Web | unicorn.arts |

**Requête « ui-animation »** ([dribbble.com/services/search/ui-animation](https://dribbble.com/services/search/ui-animation)) — 28 services relevés, **$60 → $12 000** :

| Prix | Titre exact | Designer |
|---|---|---|
| $60+ | Interactive UI Animations In Rive | BIJOY CHANDRA |
| $100+ | UI Animation | George Finnbogason |
| $150+/h | **UI Animation (Hourly Rate)** | Alex Tkachev |
| $180 | UI Animation For App Promo Video, 20 Sec | Oksana Lukina |
| $300 | UI Animation & Micro Interactions | Leonid Árestov |
| $350 | Motion Design + UI Animation | Tanjil Mahmud / Animaio |
| $399 | Micro Interactions & UI Animation | Swan Design Agency / Ankit Baghel |
| $500 | Mobile App UI Animation | Amir Hamzah |
| $500 | UI Animation For Web & Mobile Apps | Robiul Islam Rakib |
| $800+ | **Responsive UI Animations Built In Rive** | Galguyn Grzyb Brancher |
| $950+ | Motion Design / UI Animation | Reliqio |
| $1 000+ | Motion Design / UI Animation | Nixtio |
| $1 500 | Motion Design & UI Animation | Wavespace / Shahid Miah |
| $2 000 | UI Animation | Abron Studio |
| $4 000 | Dashboard & SaaS UI/UX Design | Illiyin Studio |

**Requête « saas-product-animation »** ([dribbble.com/services/search/saas-product-animation](https://dribbble.com/services/search/saas-product-animation)) :

| Prix | Titre exact | Designer |
|---|---|---|
| $180 | UI Animation For App Promo Video, 20 Sec | Oksana Lukina |
| $350 | SaaS Hero Animation \| Lottie | Tanjil Mahmud |
| $700 | SaaS Product Demo Video | Aey Motion |
| $700 | SaaS Motion Design & Explainer Videos | Buraq Lab |
| $900+ | 3D Product Animation | Blahomyr Popok |
| $999 | **Product Demo Video \| 30 Sec** | Khushmeen Sidhu |
| $1 000 | **SaaS Motion Design Pack** | Animaio |
| $1 000 | Product Animation \| UI Animation | Rixlab |
| $1 000+ | Product Animation & Explainer Videos | Zajno |
| $1 500 | **Web Animation For Fintech & SaaS** | Picto Design Studio |
| $1 500+ | SaaS Product Promo Video | Krystyna Zeljukina |
| $1 500+ | SaaS Motion Graphics Explainer Video | Krystyna Zeljukina |
| $6 000+ | Product Demo Proof Of Concept | Habitat |

**Micro-interaction sur Dribbble** ([dribbble.com/services/search/micro-interaction](https://dribbble.com/services/search/micro-interaction)) — 8 services, $300 → $6 499 :
$300 Leonid Árestov · $399 Swan Design Agency · $399 Ankit Baghel · $500 Amir Hamzah « Micro Interactions Video » · $500+ Hano Studios · $800 Dipa Inhouse « Micro Component Interaction / Animation » · $1 500 Mehmet Özsoy « UI Motion & Component Animation » · **$6 499+ Ofspace « App Micro Interactions & Motion Design »**.

**Rive** ([dribbble.com/services/search/rive-animation](https://dribbble.com/services/search/rive-animation)) : **15 des 23 services listés portent « Rive » dans le titre**, 3 mentionnent Lottie (souvent apparié à Rive). Fourchette $100 → $7 000. Exemples : $200 Raivu Motion Lab · $250+ « Interactive Rive Animation With Design » Fardeen Awais · $299 Akmal Hakim · $600+ « Rive Character Animation » Khushmeen Sidhu · **$2 000+ « Interactive Animations (Rive) » Matthew Jedrzejewski**.

### 2.3 Détail de deux offres (pages individuelles chargées) — le seul endroit où j'ai délais + révisions

**« Lottie Hero Section Animation », Sasha Grabovich, Kyiv** ([dribbble.com/services/33893](https://dribbble.com/services/33893-Lottie-hero-section-animation)) :
- Prix : **$500** (total avec frais : $540,53 CB / $532,88 crypto)
- Durée : **1 mois** · **3 concepts, 3 révisions**
- Livrables verbatim : « Hero section design and animation provided in **vector (AI), high-resolution (PNG, JPG), and json formats** »
- Process verbatim : « **30-minute consultation** to understand your goals and preferences. I'll deliver an **initial draft within 5 days**, with opportunities for feedback and revisions. »
- Outils déclarés : After Effects, Illustrator, Figma, LottieFiles Editor
- **Projets complétés : 1** · Avis : aucun visible

**« Lottie JSON icon animation », Dhaka, Bangladesh** ([dribbble.com/services/52482](https://dribbble.com/services/52482-Lottie-JSON-icon-animation)) :
- Prix : **$50** (jalons $38 + $12) · Durée : **1 jour** · **1 concept, 1 révision**
- Livrables verbatim : « **.lottie, .json, .HTML, .gif, .mov, .mp4** » avec fonds transparents
- Exigence verbatim : « **You must have to provide vector source file of your design.** »
- **1 projet complété · 1 avis, noté 2,0/5** (contenu du texte non affiché)

**« Lottie Animation & Icon Motion Design », Simay Yenice** ([dribbble.com/simay_astro_studio/services](https://dribbble.com/simay_astro_studio/services)) :
- Prix : **à partir de $400** · Délai : **2 semaines**
- Livrables verbatim : « Custom animations in **Lottie (JSON), GIF, SVG, or MP4** » + « **Developer-friendly files with export support** » + « **UI-focused animations (icons, loaders, buttons)** »
- Positionnement verbatim : « lightweight, **developer-ready** animations », « micro-interactions and onboarding flows »

---

## 3. Ce que les acheteurs DISENT (avis)

⛔ **Le résultat le plus important de ce volet est négatif, et je ne le maquille pas : je n'ai PAS obtenu de corpus d'avis d'acheteurs.**

**Ce que j'ai obtenu, et rien de plus** — 2 extraits d'avis Fiverr, remontés dans le **snippet d'un résultat de recherche**, pages sources en 403, donc **non vérifiables** :

1. Sur alan_art (gig Lottie $65) : « Working with Alan was amazing! He really understand the tasks, was **thinking ahead**, developed very creative ideas, was calm and understanding even after some **miss-communication about some task details** (which was our internal fault) and delivered a really great animation result. »
2. Sur flatonicstudios (gig Lottie/GIF $35) : « Easy communication and I'm a BIG fan of the **clarifying questions** flatonicstudios ask, cause they **save us time and frustrations**! Products looks great and I'm very happy. »

**Statut de ces 2 citations** : chacune est **ISOLÉE** (une seule occurrence). Le seul thème qui apparaît deux fois sur deux avis est **la communication en amont / les questions de clarification**, mais **2 avis ne sont pas un échantillon** — c'est une piste, pas un constat.

**Une seule note chiffrée vérifiée** : le service Dribbble « Lottie JSON icon animation » affiche **1 avis noté 2,0/5** ([source](https://dribbble.com/services/52482-Lottie-JSON-icon-animation)) — texte non affiché, donc cause inconnue.

**Chiffres d'avis Fiverr NON VÉRIFIÉS** : un snippet de recherche a mentionné des vendeurs Lottie (Devie 4,9/631 avis ; Timir 4,9/725 ; Lottie Expert 4,9/254 ; Shanith 5,0/528 ; Koolton 4,8/14) et « ~21 000 avis » pour la catégorie website animation. **Je n'ai pas pu ouvrir une seule de ces pages (403) et je ne présente donc PAS ces chiffres comme mesurés.** À traiter comme rumeur d'index, pas comme donnée.

**Ce que je n'ai PAS fait** : je n'ai retenu aucun « testimonial » trouvé sur des sites d'agences ou de plateformes — c'est du matériel marketing auto-publié, pas un avis d'acheteur, et l'intégrer aurait fabriqué de la fausse preuve.

**Thèmes demandés dans la mission (délai, révisions, format livré, compréhension du brief, communication) : non établis faute de corpus.** Voir §7.

---

## 4. Le VOCABULAIRE acheteur (mots EXACTS relevés dans les titres et descriptifs)

Ces termes sont copiés tels quels des sources consultées. C'est le lexique à utiliser dans nos titres d'offre et de portfolio.

**Le nom du livrable (par fréquence d'apparition dans les titres relevés)** :
- **« UI animation »** — de très loin le plus fréquent, présent sur Fiverr ET Dribbble, de $5 à $12 000
- **« Lottie animation »** / **« Lottie JSON animation »** / **« JSON Lottie animation »**
- **« product demo video »** · **« SaaS explainer video »** · **« SaaS animation »** · **« software demo »**
- **« micro interactions »** (souvent apparié : « Micro Interactions & UI Animation »)
- **« motion design »** (le mot parapluie ; « Motion Design & UI Animation » est un titre récurrent chez plusieurs designers indépendants)
- **« hero section animation »** · **« SaaS Hero Animation »**
- **« app promo video »** · **« mobile app UI animation »** · **« UI animation prototype »**
- **« Product Motion Pack »** · **« SaaS Motion Design Pack »** (le mot **« pack »** pour vendre un lot)
- **« Rive animation »** · **« interactive Rive animation »** · **« Responsive UI Animations Built In Rive »**

**Les qualificatifs qui portent la valeur** (les mots que les vendeurs ajoutent pour justifier un prix) :
- **« lightweight »** · **« highly optimized »** · **« never weighs your product down »** (Kamotion)
- **« developer-friendly files »** · **« developer-ready »** · **« dev-ready »** (Kamotion) · **« with export support »** · **« delivery & integration »**
- **« pixel-perfect »** · **« brand-aligned »** (Kamotion)
- **« Interactive vector motion that reacts, runs anywhere »** (Kamotion, verbatim)

**Les objets nommés que l'acheteur veut animer** :
- **« icons, loaders, buttons »** (Simay Yenice, verbatim)
- **« onboarding flows »** · **« feature walkthrough animations »** (Kamotion, verbatim)
- **« hero section »** · **« landing page »** · **« dashboard »** · **« preloader »** · **« rotating texts »** · **« cards »**

**Les formats de fichier exigés** (liste verbatim, source : deux pages de service Dribbble) :
**`.lottie`, `.json`, `.HTML`, `.gif`, `.mov`, `.mp4`, `SVG`, `AI (vecteur)`, `PNG`, `JPG`** — avec **fond transparent** mentionné explicitement.
⭐ Constat notable : **`.aep` (fichier After Effects source) n'apparaît dans AUCUN des livrables relevés aujourd'hui.** Ce qui est mis en avant, c'est le fichier **exploitable**, pas le projet source.
⚠️ **Nuance importante, issue d'une mesure interne antérieure** (`memory/projects/MARCHE-LOTTIE-2026-08.md` § 1, mesuré 2026-08-27) : le `.aep` existe bel et bien sur le marché, mais **en Gig Extra payant sur Fiverr et dans 1 annonce Upwork sur 7 — et c'est le segment le moins bien payé (5-15 $/h)**. Mon absence de `.aep` aujourd'hui est donc cohérente avec cette mesure (il n'est pas dans le livrable de base), **mais ne prouve pas son absence du marché**. Ne pas en conclure qu'on peut le refuser sans coût.

---

## 5. Les TYPES de pièces qui dominent

⚠️ **Le volet C tel que commandé (annuaire LottieFiles) n'a pas pu être exécuté : 403 sur les 4 chemins.** Ce qui suit vient donc de Dribbble Services, Lottielab et Kamotion, pas de LottieFiles.

**Par volume d'offres relevées, les catégories qui reviennent** :
1. **Icônes animées / micro-interactions d'interface** — le socle du marché. Lottielab ([source](https://www.lottielab.com/templates/icons)) nomme comme usages : « loading, settings, timer, fingerprint scan, eye, download, verified, chart, cart » et positionne le tout « **Perfect for web, mobile, and UI & UX design** ». Formats : « JSON, Lottie, GIF, and SVG ».
2. **Hero section / landing page animée** — segment à $250-$500 chez Dribbble (Weblodge $250, Sasha Grabovich $500, Tanjil Mahmud « SaaS Hero Animation » $350).
3. **Product demo / SaaS explainer video** — le plus gros ticket ($700 à $6 000+). Format court récurrent : **20 sec** (Oksana Lukina $180) et **30 sec** (Khushmeen Sidhu $999).
4. **Logo animation** — segment distinct et très peuplé ($100-$400 : Yoodjin $100, animazzio $250, AnimatedByShafi $250, Ashot S. $400).
5. **Preloader / loader** — pièce unitaire bon marché ($70, Weblodge).
6. **Packs** — « Product Motion Pack » $1 150, « SaaS Motion Design Pack » $1 000 : vendre un LOT plutôt qu'une pièce.

**Registres visuels** : non mesurables sans avoir vu les pièces jouer. **Les 403 LottieFiles m'ont privé exactement de ça.** Je ne l'invente pas.

**Référence de niveau — Kamotion** ([kamotionstudio.site](https://kamotionstudio.site/), consulté 2026-08-30) : positionnement « Lottie animations et UI motion design », cible SaaS/produits numériques, **aucun tarif affiché** (« Reach out for a quote »), process en 4 étapes déclaré (**Discovery & brief · Design & storyboard · Animation & iteration · Delivery & integration**), 4 pièces au portfolio nommées : **Track Order, Spin me!, Bye!, FAQ** — c'est-à-dire **des micro-interactions nommées par leur FONCTION produit**, pas par leur technique.

---

## 6. Ce que ça implique pour NOS pièces de portfolio (5 recommandations, chacune adossée à une donnée citée)

**R1 — Une pièce « SaaS Hero Section animée », livrée en .json + .lottie + mp4.**
*Donnée* : c'est le titre exact le mieux valorisé du segment Lottie sur Dribbble — « SaaS Hero Animation | Lottie » $350 (Tanjil Mahmud) et « Lottie Hero Section Animation » $500 (Sasha Grabovich), contre $10-$100 pour un gig « lottie animation » générique sur Fiverr. **Le même verbe technique vaut 5 à 10× plus cher quand la pièce est nommée par son EMPLACEMENT dans le produit.**

**R2 — Un PACK de 6-8 micro-interactions d'interface nommées par leur fonction (pas par leur technique) : « Track Order », « Empty state », « Upload complete », « Toggle », « FAQ »…**
*Donnée* : Kamotion — notre référence de niveau — nomme ses 4 pièces portfolio **Track Order, Spin me!, Bye!, FAQ**. Et le format « pack » est ce qui porte les plus hauts prix chez les indépendants : « Product Motion Pack » $1 150, « SaaS Motion Design Pack » $1 000. Une pièce isolée se vend $50 ; un pack se vend $1 000+.

**R3 — Faire du poids de fichier et de l'intégrabilité un ARGUMENT VISIBLE de la pièce (afficher le Ko, le nombre de calques, le snippet d'intégration).**
*Donnée* : les qualificatifs qui différencient les offres chères sont textuellement **« lightweight »** (alan_art $65 vs $10 pour le même intitulé), **« Highly Optimized »** (Rockerzz $149), **« developer-friendly files with export support »** (Simay Yenice $400), **« dev-ready »** et **« never weighs your product down »** (Kamotion). C'est exactement notre moat déterministe, et c'est déjà le vocabulaire du marché — il n'y a pas à l'inventer, juste à l'afficher.

**R4 — Une pièce de démo produit courte au format 20-30 secondes, calibrée sur ces durées exactes.**
*Donnée* : les deux seules offres de démo produit qui affichent une durée dans leur titre la fixent à **20 sec** (« UI Animation For App Promo Video, 20 Sec », $180) et **30 sec** (« Product Demo Video | 30 Sec », $999). C'est le format que le marché commande, et le segment le mieux payé ($700-$6 000). ⚠️ Écart de prix ×5 entre ces deux durées : la durée n'explique pas seule le prix, ne pas en conclure un barème.

**R5 — Produire au moins une pièce en Rive à côté du Lottie, ou expliciter pourquoi Lottie.**
*Donnée* : sur la recherche « rive-animation » de Dribbble, **15 des 23 services listés portent Rive dans le titre**, jusqu'à $2 000+ (« Interactive Animations (Rive) ») et $800+ (« Responsive UI Animations Built In Rive ») ; et des vendeurs offrent déjà les deux dans un même titre (« Rive/Lottie Animation » $300, « Lottie And Rive Custom Animations » $100, et sur Fiverr « lottie, json or rive » $25). Rive occupe le créneau « interactif / réactif » que Lottie seul ne couvre pas. ⚠️ Je n'ai **aucune donnée de volume de ventes** comparant les deux : c'est un constat de présence dans l'offre, pas une preuve de demande supérieure.

---

## 7. ⛔ Ce que je N'AI PAS pu établir

Sans atténuation. Aucun de ces points n'est comblé par une supposition ailleurs dans le rapport.

1. **Aucun volume de ventes réel.** Zéro. Je n'ai pas obtenu un seul nombre de commandes vérifié, ni « orders in queue », ni « X commandes livrées ». **Toute la mission « ce qui se vend le plus » est donc NON RÉSOLUE** : je rapporte ce qui est *offert* et *à quel prix affiché*, ce qui n'est pas la même chose que ce qui est *acheté*. Le tri `sort_by=best_selling` de Fiverr n'a jamais pu être chargé.
2. **Aucun corpus d'avis.** 2 citations non vérifiables (snippet, page 403) + 1 note isolée de 2,0/5. **Impossible de distinguer thème RÉPÉTÉ vs ISOLÉ** comme la mission le demandait — il n'y a pas de masse critique. Les thèmes délai / révisions / format livré / compréhension du brief **n'ont pas été mesurés**.
3. **Aucune donnée de paliers Basic/Standard/Premium sur Fiverr.** Les prix Fiverr cités sont uniquement le **prix d'entrée affiché dans le titre indexé**. Je ne sais pas ce que contient le palier Basic, ni l'écart Basic→Premium.
4. **Aucun délai annoncé sur Fiverr.** Les délais que je cite (1 jour, 2 semaines, 1 mois, brouillon en 5 jours) viennent **exclusivement de 3 pages Dribbble**. Un snippet a évoqué « 6-8 jours pour 60 secondes » sans page vérifiable : **non retenu**.
5. **Volet C non réalisé.** L'annuaire LottieFiles et les animations populaires — le gisement présenté comme supérieur — sont **inaccessibles (403 sur `/hire`, `/marketplace/animators`, `/featured`, `/blog`)**. Je ne peux rien dire des registres visuels qui y dominent, ni des types de pièces qui y performent. Mes constats du §5 viennent de substituts (Dribbble/Lottielab), pas de la source demandée.
6. **Les barèmes horaires du volet D sont NON SOURCÉS méthodologiquement.** biztoolkit.co ($25-$200/h par tier ; « App UI animations: $1 000-$5 000 ») et sidestackers.com ($45/$90/$180+ par heure ; « $2 000-$5 000 la minute de 2D ») **ne déclarent ni enquête, ni échantillon, ni source** — vérifié explicitement sur les deux pages. Ce sont des articles de contenu, pas des mesures. Le seul chiffre horaire réellement *pratiqué* que j'ai vu est **« UI Animation (Hourly Rate) $150+/h » d'Alex Tkachev sur Dribbble** — un seul cas.
7. **Upwork, Contra et Toptal : rien.** Upwork 403, Contra vide (SPA), Toptal non atteint. **Le volet D est donc essentiellement non réalisé**, hors les barèmes non sourcés ci-dessus et Creattie (§8).
8. **Représentativité.** Mon corpus Dribbble ≈ 90 offres réparties sur 6 requêtes, et mon corpus Fiverr = 34 titres indexés. **Ce n'est pas un échantillon du marché** : Dribbble est un canal auto-sélectionné haut de gamme (badges PRO/PRO+), et l'index Google ne remonte pas les gigs par volume de ventes. Les fourchettes de prix décrivent **ces offres-là**, pas « le marché ».
9. **Je n'ai vu jouer aucune animation.** Tout ce rapport est du texte et des prix. Aucun jugement sur la qualité, le registre visuel ou le niveau technique réel n'est possible sur cette base.

---

## 8. Note sur une source intéressée

**creattie.com** (vendeur d'abonnements Lottie) affirme : stock à « $1 - $10 » et « $9.99 - $25 avec abonnement mensuel » ; abonnement « $12.99 - $14.99 » icônes illimitées ; « $24.99/mois pour 25 téléchargements » ; et surtout **« An original, short Lottie animation can cost as much as $1500 »** ([source](https://creattie.com/blog/how-much-lottie-animations-cost)).
⚠️ Ce chiffre de $1 500 est publié par un acteur qui a **intérêt commercial à faire paraître le custom cher** face à son propre stock. À traiter comme argumentaire, pas comme mesure. Il est néanmoins **cohérent avec le haut de notre fourchette Dribbble mesurée** ($1 150 Product Motion Pack, $1 500 Web Animation For Fintech & SaaS).

---

*Rapport produit sans aucun contournement de protection anti-bot. Les 11 blocages HTTP rencontrés sont documentés au §1 comme données de terrain.*
