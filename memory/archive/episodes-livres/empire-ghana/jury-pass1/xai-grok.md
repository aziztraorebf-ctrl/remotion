# Réponse AtlasCritic — Empire du Ghana

## Note globale du brief : 7/10
Le brief est solide sur la structure et les contraintes techniques, avec un script verrouillé qui ancre bien le rythme en 85s. Points forts : focus sur le format Atlas cartographique qui colle au sujet géo-économique, et liste claire des limites stack (ex. Lottie à 5 instances max). Faiblesses : sous-estimation du risque de surcharge visuelle dans les beats denses (Beat 2 et 4), et peu d'indications sur l'intégration audio-visuelle précise (timing ElevenLabs). Globalement, viable pour un viral si on priorise le mouvement caméra pour contrer l'encyclopédisme.

## Q1. Approche méthodologique
Pour coder cette vidéo en Remotion 4 avec React/TypeScript, je commencerais par la "scène d'ancrage" : la carte d3-geo Afrique de l'Ouest en projection Mercator (Natural Earth 50m, comme dans Mansa Moussa V2). C'est prioritaire car elle détermine tout : positions des labels (Koumbi Saleh, Taghaza, Bambouk), chemins de caravanes bezier, et mouvements caméra (zoom/pan). Sans une carte fluide et scalable (SVG natif), les inserts et sprites risquent de déborder en vertical 1080×1920.

Ordre de développement :
1. **Setup global (1-2 jours)** : Composant AtlasMercator de base avec palette sépia/or/bordeaux (#D4A574 pour or, #8B4513 bordeaux). Intégrer timing audio-derived via ElevenLabs pour aligner les beats (ex. frame-précis à 5s pour hook). Ajouter karaoke subtitles word-level en typo serif (or, position basse pour ne pas obstruer la carte).
2. **Beat 0 et 1 (ancrage géo, 1 jour)** : Prototypage hook avec zoom 2.5x sur Sahara (interpolate spring pour fluidité), puis pan sud vers Wagadou. Tester sprites PixelLab idle pour caravanes statiques.
3. **Beats 2-4 (cœur narratif, 2-3 jours)** : Itérer sur inserts SVG pour stats (ex. compteur 90kg sel via animateValue). Prioriser Beat 3 (silent barter) car il valide PixelLab + Lottie (marchands walk cycle + balance icône).
4. **Beat 5 et polish (1 jour)** : CTA avec tilt caméra sur carte entière, LightLeaks brève (8 frames) pour fondu sépia. Tests headless pour éviter crashes WebGL, et ratio vide/plein (60% carte vide pour respirer).
5. **Intégration finale** : Composants partagés (AtlasCaravane pour transitions), export 1080×1920 à 30fps.

Cette séquence assure que la carte pilote les animations, évitant des rework si les paths bezier clashent avec les sprites.

## Q2. Scène la plus risquée
La plus risquée est le Beat 2 (Densité Cesar, 19s) : narrativement, 4 stats denses (90kg sel, or par poignées, désert central, 20k hab + mosquée + taxes) risquent de transformer la scène en liste encyclopédique, perdant le viewer TikTok en 10s. Techniquement, surcharger la carte d3-geo avec inserts SVG simultanés (compteurs, labels) + pan caméra peut causer des lags en Remotion headless, surtout avec 3-4 instances Lottie (ex. sacs sel/or) approchant la limite de 5.

Pourquoi ? Le script verrouillé force une perspective géographique sans pauses, et le stack n'autorise pas de path morphing complexe pour fluidifier les stats. Comparé à Beat 3 (rituel visuel clair), ici c'est statique si mal géré, contredisant l'avertissement d'Aziz sur le rythme viral.

Sécurisation :
- **Narratif** : Fractionner en micro-rythmes : stat 1 (Taghaza) avec zoom nord + compteur SVG sel (90kg animé de 0 à 90 via interpolate, 4s) ; stat 2 (Bambouk) pan sud + sprite PixelLab "poignée or" idle (3s) ; centre (Koumbi Saleh) dolly in avec label mosquée + icône Lottie couronne pour roi/taxes (8s total). Limiter à 2 inserts par micro-beat pour anti-saturation.
- **Technique** : Pré-rendre paths caravane bezier statiques en SVG natif (pas animés ici pour économiser). Tester avec spring/interpolate pour mouvements caméra lents (zoom 1.8x max, éviter 2.5x). Si lag, fallback sur Gemini statique pour panorama désert (1 insert unique). Valider en premier via un proto 19s isolé, timing aligné sur narration chaleureuse pour masquer la densité.

## Q3. Pattern visuel récurrent
L'élément récurrent devrait être une "balance caravane" : un chemin bezier animé (AtlasCaravane) reliant Taghaza à Bambouk, avec une icône Lottie balance (simple, 8 vertices : plateau sel/or qui bascule légèrement via wiggle JSON) pulsant en or (#D4A574) sur fond sépia. Elle apparaît en fond subtil (opacité 0.3-0.6) à chaque beat, symbolisant l'équilibre commerce/sel-or, et pulse (scale 1.05x via spring) aux mentions clés (hook, barter, effondrement).

Exécutable avec stack : bezier d3-geo pour route désertique (pré-calculé Mercator), Lottie balance (géométrique canon, 1 instance par scène <5), animation interpolate pour pulse fluide. Mémorable comme la couronne Mansa Moussa : ancre le thème sans saturer, et crée cohérence (ex. balance penche sud à Beat 1, s'équilibre à Beat 3, brise à Beat 4). Critique : évite le trop vu (pas de globe rotatif), mais teste opacité pour ne pas distraire subtitles.

## Q4. Idée créative concrète
Pour le Beat 3 (Climax silent barter, 16s), animer le rituel avec deux sprites PixelLab marchands (un nord sel, un sud or) en walk cycle opposé : le marchand sel avance (4 directions validées), dépose sac Lottie (icône sac simple, 6 vertices) et idle recule ; simultanément, marchand or approche depuis sud, pose or (Lottie étoile/or), recule. La balance récurrente (Q3) s'équilibre pile au midpoint narration ("sans un mot"), avec LightLeaks sépia brève (8 frames) surimprimé pour mystère saharien. Effet : crée un rituel cinématographique hypnotique, transformant le beat en "danse silencieuse" mémorable, éveillant curiosité émotionnelle (merveille médiévale) sans mots, boostant rétention TikTok. Exécutable : paths bezier courts pour walks (AtlasCaravane adapté), 2 Lottie (sacs) + 1 balance <5 instances, timing audio-précis pour synchro dépôt (à "déposaient leur sel", 6s).

## Q5. Sensibilité historique
Sur l'Empire du Ghana (Wagadou), éviter l'orientalisme inverse en ne présentant pas l'empire comme un "miracle isolé" exotique, mais comme un hub interconnecté (commerce transsaharien avec Maghreb/Ifriqiya), sous peine de perpétuer un afrocentrisme simpliste qui ignore les échanges arabes/musulmans (mosquée à Koumbi Saleh). Ne pas omettre subtilement le commerce d'esclaves (présent dans les caravanes sel/or, per sources comme Al-Bakri), même si script factuel : un insert SVG schématique (chemins bezier avec icônes neutres) pourrait underplay, risquant accusation de whitewashing révisionniste ; mieux, garder focus positif sans éluder (ex. label "caravanes mixtes" discret si timing permet).

Sur colorisme : sprites PixelLab doivent être diversifiés (tons peau sahéliens variés, pas uniformément clairs), évitant stéréotype "noir pur" qui exotise ; utiliser walk cycles neutres sans accents physiques (ex. pas de bijoux excessifs). Pas de revanchisme : CTA antithèse (Florence/Venise) est bon, mais éviter visuels "vengeurs" (ex. caravane "triomphante" écrasant Europe) – garder factuel, carte centrée Afrique sans tilt eurasiatique. Globalement, stack SVG/d3-geo aide à la neutralité géographique, mais critique : tester avec beta-testeurs diaspora pour valider absence de biais.

## Alertes critiques
Risque non mentionné : en vertical 1080×1920, les pans caméra latéraux sur carte d3-geo (ex. Beat 2 nord-sud) pourraient couper labels historiques (Taghaza off-screen) ; solution : contrainte Mercator à viewport Afrique Ouest only, avec zoom adaptatif. Aussi, Lottie wiggle sur balance risque de glitcher si >3 instances cumulées avec sprites – limiter à 2-3 par beat via React state.

## Convergences attendues / divergences
Convergences probables avec autres LLMs : accord sur Beat 2 comme risqué et silent barter comme pivot créatif (facile à viraliser). Divergences : je priorise balance récurrente (géométrique, stack-friendly) vs. potentiellement un motif plus narratif comme "sable animé" (trop WebGL-heavy, hors limites headless).