# Gazoduc Acte 1 (v8) — Review upstream à 3 voix (2026-08-03)

> Appel `scripts/tools/da-brief-video-3voix.py` (nouveau script, créé cette session) : Gemini 3.1 Pro
> + Kimi K2.5 en VIDEO NATIVE (upload direct du prototype v8, pas juste des frames), GPT-5.6 Sol en
> frames (12, denses) — **GPT-5.6 Sol REFUSE la vidéo via OpenRouter** (testé, `404 No endpoints
> found that support input video`, même limite déjà connue pour Kimi via OpenRouter — cf
> [[kimi-video-native-base64]]). Kimi vidéo native fonctionne via l'API Moonshot DIRECTE
> (`MOONSHOT_API_KEY`, pas OpenRouter), même mécanisme que documenté pour Kimi.

Brief envoyé : script complet de l'Acte 1 (17 phrases, 84.68s) + description du prototype v8
(16s, 2 premières phrases seulement) + contrainte stack (React/Remotion/SVG/D3-geo orthographique,
PAS de code demandé, décrire l'intention) + références de chaînes (Giga Builds/Perduchan pour le
vide qu'on comble, Infographics Show pour le staging, Johnny Harris/Vox Borders/RealLifeLore pour
le globe-narrateur) + les 5 angles obligatoires + bloc expert-constructeur upstream.

Rapports complets : `gemini.md`, `kimi.md`, `gpt56sol.md` dans ce dossier.

## CONVERGENCE FORTE (3/3, haute confiance)

- **⚠️⚠️ Le remplissage PLEIN par drapeau (Espagne/Algérie) pose problème** — les 3 modèles le
  disent indépendamment : Gemini "concours de vexillologie, illisible, fait manuel scolaire, à
  SUPPRIMER" ; Kimi "effet carte de Risk amateur, remplacer par pastille/bandeau le long du tracé" ;
  GPT-5.6 Sol "drapeau surdimensionné devient une affiche pas une information cartographique,
  flash bref à l'identification puis désaturer". **Point NON tranché par Aziz** (décision explicite
  2026-08-03 : consigner sans trancher, prochaine session tranche avec un regard neuf) — c'est un
  changement direct par rapport à la demande d'Aziz qui a fait ajouter les drapeaux en v8 (cf
  STATUS.md § Round 8), donc à traiter avec attention, pas à appliquer par réflexe.
- **Le prototype teste le MÉCANISME, pas encore le RÉCIT** : les 16s actuelles sont un "état"
  (Nigeria qui se pose), le vrai enjeu narratif ne commence qu'à "Même point de départ / Même
  destination / Même urgence" — absent du prototype (jamais rendu au-delà de 16s).
- **Codage couleur strict et jamais mélangé** : AAGP toujours doré/plein/style "diplomatie", TSGP
  toujours orange/pointillé/style "chantier" — déjà en partie fait dans le code, à renforcer et
  appliquer à TOUS les éléments liés à chaque tracé (pas seulement le trait lui-même).
- **Caméra jamais figée, même pendant les silences narratifs** : micro-mouvement constant (rotation
  lente, respiration ±2°), pas juste zoom/dézoom entre 2 points fixes.
- **AI-slop identifié** : easing linéaire actuel sur le zoom (à remplacer par courbes non-linéaires
  marquées), étoiles trop statiques/régulières, palette "carte scolaire" par défaut.

## DIVERGENCES — complémentaires, pas contradictoires

- **Gemini** : approche par ÉPURE — assombrir tout sauf l'élément narrativement actif à chaque
  instant, un uppercut visuel au triplet "Même/Même/Même" (flash + assombrissement global).
- **Kimi** : approche par MISE EN SCÈNE riche — "collision symbolique" des 2 tracés au mot "guerre
  silencieuse" (particules qui se repoussent au milieu), "ghost point" qui pulse avant chaque départ
  de tracé, règle des tiers (Nigeria jamais centré mécaniquement), ligne de flottaison horizontale
  façon Johnny Harris.
- **GPT-5.6 Sol** : approche par CLARTÉ NARRATIVE PURE — le vrai enjeu est "une origine commune → un
  marché commun → deux stratégies incompatibles → une seule place à l'arrivée" ; varier
  DÉLIBÉRÉMENT les courbes de caméra (départ lourd, passage fluide, décélération courte, parfois
  quasi-linéaire pour le Sahara) plutôt qu'un rythme uniforme — le point le plus original des 3.

## SÉQUENÇAGE PROPOSÉ POUR LES 85S (synthèse Gemini, le plus détaillé en blocs temporels)

- 0-10s : origine (Nigeria s'illumine, point qui pulse, léger recul caméra).
- 10-25s : urgence (bascule vers l'Europe, les 2 tracés progressent en parallèle à vitesses
  différentes).
- 25-35s : triplet rhétorique "Même/Même/Même" — un beat visuel marqué par phrase, jamais 2 choses
  affichées en même temps.
- 35-50s : fracture — caméra au-dessus du Sahara, montre l'écart géographique réel entre les 2
  tracés (l'argument visuel de "ils ne se parlent pas").
- 50-75s : les 2 paris — alternance AAGP (estompe le TSGP, suit la courbe côtière) / TSGP (estompe
  l'AAGP, recentre sur le tracé saharien).
- 75-85s : climax — dézoom global, pulsation asynchrone des 2 tracés, fondu vers le titre.

## PROCHAINE ÉTAPE (reprise)

1. Trancher le sort des drapeaux (pastille/halo Kimi vs suppression Gemini vs flash-puis-désaturation
   GPT-5.6 Sol vs garder tel quel — décision Aziz en attente, pas un défaut à corriger par réflexe).
2. Étendre `ProtoGazoducGlobeFusion.tsx` de 16s à 84.68s en intégrant le séquençage synthétisé
   ci-dessus, avec les 17 phrases du script (déjà timées mot-à-mot dans
   `out/episodes/gazoduc-aagp-tsgp/narration-NEW.alignment.json`).
3. Le script `scripts/tools/da-brief-video-3voix.py` (nouveau, cette session) est réutilisable pour
   toute future review upstream à 3 voix avec vidéo native — garder GPT-5.6 Sol sur frames (limite
   technique confirmée, pas à re-tester).
