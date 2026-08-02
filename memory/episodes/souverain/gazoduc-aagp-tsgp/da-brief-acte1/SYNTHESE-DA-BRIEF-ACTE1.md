# Gazoduc Acte 1 (Hook) — Synthèse tracée DA-brief upstream (Gemini + Kimi + DeepSeek)

> Lancé 2026-08-02, `da-brief.py --upstream`, 3 voix (Gemini 3.1 Pro + Kimi K2.5 + DeepSeek V4).
> Sorties brutes : `/tmp/da-refs/da-gazoduc-acte1-hook-{gemini,kimi,deepseek}.md` (à rapatrier si besoin
> avant purge /tmp). Brief envoyé : script phrase par phrase + timing exact (alignment forcé narration.mp3)
> + boîte à outils exacte (globe D3, occlusion réelle, camAt, drift, starfield, drapeaux, Lucide) + 2 frames
> de référence (Soudan Acte 5 validé — flux + carrefour).

## CONVERGENCE FORTE (3/3 ou 2/3, haute confiance)

- **G+K+D** : Frame 0, globe DÉJÀ posé (pas de tracé d'entrée), vue large Afrique, champ d'étoiles actif
  dès le départ (corrige le noir uni des refs Soudan). ✅ **RETENU**.
- **G+K+D** : Le "MOMENT FORT" est le pivot 54.9s-70.78s (AAGP côtier → TSGP saharien) — caméra en
  mouvement CONTINU (jamais de cut), l'arc en cours d'usage passe au premier plan pendant que l'autre
  s'estompe/disparaît par occlusion réelle. Convergence totale sur le principe : **la sphère EST le
  montage**, pas de split-screen. ✅ **RETENU** — c'est le cœur technique de l'acte.
- **G+K+D** : Un seul point source (Nigeria/delta du Niger) qui doit rester l'ancrage visuel identifiable
  jusqu'à la divergence des tracés — éviter que les 2 arcs semblent partir de 2 points proches mais
  distincts. ✅ **RETENU**.
- **G+K+D** : Zone de conflit Sahel/TSGP = polygone rouge `#d6552e` semi-transparent (opacité 0.15-0.3),
  JAMAIS en aplat plein ("crierait alerte incendie"). ✅ **RETENU**.
- **G+K+D** : Micro-dérive (`driftLon`) active en PERMANENCE, y compris pendant les travellings, pour ne
  jamais figer — cohérent avec la leçon Soudan déjà connue. ✅ **RETENU** (déjà notre règle).
- **G+K** : Différenciation visuelle immédiate des 2 tracés par STYLE de trait (AAGP = plein, TSGP =
  pointillé ou vitesse de flux différente), pas par texte. ✅ **RETENU**.
- **G+K+D** : Épure texte totale — SEUL "UN SEUL" (72-77s) justifie un texte à l'écran (emphase orale
  explicite + message-clé à retenir). Aucun label "AAGP"/"TSGP"/noms de pays. ✅ **RETENU**.
- **G+K+D (section AI-slop)** : champ d'étoiles = risque "paillettes/neige TV" si mal dosé → parade
  commune : PRNG seedé fixe, densité modérée (D propose ~200-300, K ~300 max, distribution non uniforme,
  tailles variées, opacité 0.2-0.7-0.8 selon la voix), couleur PAS blanc pur (K : `#b8c4d4`). ✅ **RETENU**,
  paramètres à trancher au code (voir décision ci-dessous).
- **G+K+D** : drapeaux — grands territoires = clipPath classique, petits pays/tracé côtier = FlagToken rond,
  jamais plus de ~3-6 à la fois pour éviter la surcharge ("sapin de Noël"). ✅ **RETENU**.

## DIVERGENCES — tranchées

1. **Un arc unique Nigeria→Europe entre 12s et 29s (avant le split) vs directement 2 arcs fantômes dès
   0-4s.**
   - K et D proposent un arc UNIQUE symbolique (Nigeria→Europe) qui se scinde en 2 à 29s ("Et pourtant…").
   - G ne propose pas cet arc unique, va direct aux 2 arcs qui "jaillissent simultanément" à 22-28s.
   - D va plus loin : dès 0.12-4.20s, 2 arcs FANTÔMES ultra-fins (opacité 0.2) qui s'esquissent déjà.
   - **DÉCISION : retenir la version K/D (arc unique qui se scinde à 29s)** — c'est un geste narratif plus
     fort et plus lisible ("même client, même destination" = UN SEUL trait ; "ne se parlent pas" = le
     split), et ça correspond exactement à la phrase "Et pourtant… ces deux projets ne se parlent pas" qui
     tombe pile au bon moment. Le split-par-morphing (interpolation de chemin, D le précise § construction)
     est plus propre qu'une duplication instantanée — à coder ainsi.
   - Écarter les arcs fantômes dès 0-4s (D) : prématuré, la voix ne parle pas encore de 2 tracés à ce
     moment, risque de confusion narration/visuel.

2. **Compteur kilométrique / jauge de rivalité (idées bonus G, D).**
   - K propose une jauge SVG "6900km / 4100km" affichée en incrustation.
   - D propose une jauge de "rivalité" à 2 curseurs qui s'équilibrent/déséquilibrent.
   - 🔶 **NUANCÉ/OPTION, pas retenu par défaut** : la doctrine ÉPURE du système (SYSTEME-AGENTIQUE.md étape 3)
     est stricte — un chiffre affiché doit être une info que la voix NE DIT PAS et qui frappe. Les distances
     ne sont pas dans le texte de l'Acte 1 (elles arrivent en Acte 2/3 : "6900 kilomètres" est dit dans
     l'Acte 2). Afficher "6900km" ici serait une REDITE anticipée qui décharge l'Acte 2 de son propre choc
     numérique. → écarté pour l'Acte 1, à garder en réserve pour l'Acte 2/3 où le chiffre est réellement dit.

3. **Rose des vents / boussole Lucide (G), grille de lecture (idée expert G).**
   - ❌ **ÉCARTÉ** : gadget superflu, ajoute un élément UI qui n'existe dans aucune de nos vidéos
     précédentes — pas dans la boîte à outils validée, romprait la cohérence de charte établie sur Soudan.

4. **Flash blanc de transition à 70-72s (K, "seule cut visuelle justifiée").**
   - 🔶 **OPTION, à juger au rendu** : idée défendable (emphase orale forte sur "Un SEUL") mais un flash
     plein écran est un procédé qu'on n'a jamais utilisé dans la charte Souverain — à tester en code, garder
     seulement si ça ne casse pas la continuité "1 seule sphère continue" qui est justement notre signature
     face au montage classique. Ne pas l'imposer d'office.

5. **Tremblement caméra sur "guerre silencieuse" (D, idée bonus 3).**
   - 🔶 **OPTION mineure** : faisable, mais léger risque de lire comme un bug de caméra plutôt qu'une
     intention si mal dosé. À activer seulement si le rendu du polygone rouge + icône seul semble trop
     timide au premier passage — ne pas le coder d'emblée, garder en réserve.

6. **Split médian doré vertical façon "Split Comparison" (K, section expert constructeur).**
   - ❌ **ÉCARTÉ** : contredit frontalement le principe validé par G+K+D eux-mêmes ("la sphère EST le
     montage, pas de split-screen") — auto-contradiction interne à Kimi (famille de faux positifs (c) de la
     doctrine DA-BRIEF-GATE : le rapport se contredit d'une section à l'autre). Ne pas appliquer.

7. **Icônes Lucide pour illustrer partenaires/vitesse (Landmark, Zap, Factory, Building, Banknote, Fuel,
   Flame…) — proposées par les 3 voix mais avec des choix différents.**
   - ✅ **RETENU dans le principe** (3e voie dessin/animation maison, déjà dans notre boîte à outils
     standard), 🔶 **le choix précis des icônes reste ouvert** — à trancher au moment du code selon ce qui
     rend bien à l'écran, pas figé par le brief. Contrainte commune retenue : jamais plus d'1 icône visible
     à la fois, apparition/disparition rapide (spring, pas de rebond excessif), ivoire ou or, jamais de
     glow/blur.

## PIÈGES AI-SLOP IDENTIFIÉS (parades à appliquer par défaut, pas optionnelles)

- Pas de `filter:blur`/glow CSS pour simuler la profondeur → cercles concentriques opacité décroissante ou
  vignettage radial-gradient (déjà notre pattern).
- Easing JAMAIS linéaire → cubique maison différencié par type de mouvement (arrivée/départ/pivot).
- Rouge alerte toujours en semi-transparence, jamais en aplat.
- Or (`#ffe39a`/`#e8b44a`) réservé aux flux/pastilles, jamais en grande surface.
- Pas de texte redondant avec la voix — seule exception actée : "UN SEUL" (72-77s).

## CE QUI RESTE À TRANCHER AU CODE (pas un manque du brief — des choix d'exécution normaux)

- Paramètres exacts du PRNG étoiles pour le 16:9 (densité, seed) — porter le pattern 9:16 existant
  (`GlobeRecitProto.tsx`, seed=42, 140 pts, `#F4ECD2`) et ajuster densité/couleur selon les retours G/K/D
  (distribution non uniforme, `#b8c4d4` proposé par K vs `#F4ECD2` de l'existant — GARDER `#F4ECD2` pour
  cohérence de charte inter-vidéos, sauf si le rendu 16:9 le justifie visuellement).
- Keyframes lon/lat/scaleMul précises par pivot — les 3 voix donnent des valeurs indicatives cohérentes
  entre elles (ordre de grandeur scaleMul 1.3-3.2 selon le plan), à affiner en code contre le vrai GeoJSON
  (le brief le rappelle : "géo approximative OK, vraie géo au CODE").

## PROCHAINE ÉTAPE

Breakdown technique (format `SOUVERAIN-REMOTION-PLAYBOOK.md` § FORMAT BREAKDOWN, adapté au globe D3) puis
code — base = `Globe2Proto16x9.tsx` (occlusion, halos, terminateur) + `globeCamera.ts` (caméra continue) +
starfield porté de `GlobeRecitProto.tsx`, sur le séquencier ci-dessus (Partie A du brief, table complète
dans les sorties brutes).
