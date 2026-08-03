# Gazoduc AAGP/TSGP — Acte 1 — POLISH À FAIRE EN PASSE FINALE

> **STATUS** : Acte 1 (globe D3, 84.68s) validé comme base de production par Aziz le 2026-08-03
> (render v6, après passe downstream 3 voix + fixes Maroc/tracé côtier/couleurs/labels/échelle km).
> URL v6 : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/acte1-v6-m5QFFUpozes11al9Vs2NxEXfaZkPdU.mp4
> Fichier source : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx`
>
> **Décision Aziz (2026-08-03)** : ne PAS corriger ces points maintenant — les noter et les traiter
> dans la passe finale une fois toute la vidéo assemblée (tous les actes), pas acte par acte.

---

## 🟡 PRIORITÉ 1 — Maroc/Algérie apparaissent trop tôt sur la carte

**Aziz 2026-08-03** : "je pense que d'avoir le Maroc et l'Algérie qui apparaissent dès le départ ne
sert pas à grand chose [...] Je pense que l'on devrait garder la carte juste pour se concentrer sur
le Nigeria. Donc le Maroc et l'Algérie apparaîtront uniquement quand les tracés [...] commenceront
leur voyage."

### Diagnostic
Actuellement `pMaroc`/`pAlgerie` (points discrets) et les contours de base (`fillOpacity={0.88}`)
sont dessinés dès la frame 0, avant même le beat 3 (marché européen) — visibles en fond dès les
premières secondes centrées sur le Nigeria, sans fonction narrative à ce stade.

### Solution proposée
Conditionner l'affichage des points-source/cible discrets (`pMaroc`, `pAlgerie`) et des contours de
base (fill 0.88) à `frame >= BEAT_T.b5Start` (début de la divergence/tracés) au lieu de toute la
durée. Le Nigeria reste seul sur la carte jusqu'à ce que les 2 gazoducs commencent leur tracé.

**Fichiers concernés** : `GazoducActe1Hook.tsx` — bloc "base fixe kaki" (Maroc/Algérie) + bloc
"points-source/cible discrets" (`pMaroc`/`pAlgerie`).

---

## 🟡 PRIORITÉ 2 — Halo Europe trop discret, empiète visuellement sur Maroc/Algérie

**Aziz 2026-08-03** : "la couleur [...] pour représenter l'Europe est un peu trop discrète [...]
l'Algérie et le Maroc ont l'air presque qu'ils font partie de l'Europe [...] on ne voit même pas
les frontières de ce que tu essaies de représenter [...] peut-être que c'est l'opacité, peut-être
la couleur [...] il faudrait faire disparaître l'Algérie et le Maroc quand on parle de l'Europe."

### Diagnostic
Le voile sombre (`europeGlowReveal * 0.6`) + le fill doré des pays européens ne créent pas assez de
contraste par rapport au Maroc/Algérie qui restent visibles juste en dessous avec leur propre
opacité (0.88) — la limite entre "zone Europe illuminée" et "reste du globe assombri" n'est pas
nette, et Maroc/Algérie semblent visuellement inclus dans la zone Europe.

### Solution proposée (à combiner avec PRIORITÉ 1)
- Si PRIORITÉ 1 est traitée en premier, Maroc/Algérie ne seront déjà plus affichés avant `b5Start`
  — donc absents pendant le beat 3 (Europe), ce qui règle une bonne partie du problème par ricochet.
- En plus : renforcer le contraste du voile sombre (`europeGlowReveal * 0.6` → tester `0.75-0.8`) et/ou
  augmenter l'opacité du fill doré Europe pour une limite plus nette.
- Vérifier aussi le rappel Europe atténué aux arrivées (`europeRecallReveal`, ~0.45) — s'assurer qu'il
  n'entre pas en collision visuelle avec le fill plein du pays qui vient d'arriver (Maroc à `ARC_END`,
  Algérie à `TSGP_END`) — cf capture 71s où le rouge (fill Algérie à l'arrivée) et un reste de glow
  Europe se chevauchent dans la même zone.

**Fichiers concernés** : `GazoducActe1Hook.tsx` — bloc "EUROPE — mask reveal" (`europeGlowReveal`,
`europeRecallReveal`, le `<rect>` d'assombrissement).

---

## ⚪ À VÉRIFIER — Identité du petit territoire isolé à gauche du globe (beat 3)

**Aziz 2026-08-03** : a demandé confirmation sur un petit pays allumé tout à gauche du globe pendant
le beat Europe — quel pays est-ce ?

**Réponse donnée en session (à vérifier visuellement avant la passe finale, pas garantie à 100%)** :
probablement l'**Irlande** (geoCentroid réel `[-8.02, 53.17]`, le pays d'`EUROPE_COUNTRIES` le plus à
l'ouest et visuellement séparé de la masse continentale à cette rotation de caméra) — mais pas confirmé
par une relecture frame-par-frame précise, seulement déduit par coordonnées. À reconfirmer visuellement
(extraire la frame exacte + comparer au contour Irlande) avant de considérer que c'est vraiment ça.

---

## 🟢 CONFIRMÉ CORRECT — Cartouche final (échelle km)

**Aziz 2026-08-03** : "Pour la cartouche finale [...] je pense que cela est tout à fait correct."

Rien à changer sur `InsertEchelle` (comparatif 6900 km AAGP vs 4128 km TSGP).

---

## 🔵 À FAIRE (mentionné, pas détaillé — pour toute la vidéo, pas juste Acte 1)

**Aziz 2026-08-03** : "évidemment avec le SFX qu'il faudrait rajouter, mais on fait comme ça plus tard."

Aucun SFX n'est encore posé sur l'Acte 1 (tracés qui se dessinent, arrivées, pulse Nigeria, transition
overlay échelle, titre). À traiter dans la passe finale audio, probablement avec `scripts/tools/`
génération SFX ElevenLabs (cf `memory/tools/elevenlabs.md`) une fois tous les actes assemblés.

---

## Ordre d'exécution recommandé (passe finale, tous actes assemblés)

1. Reconfirmer visuellement l'identité du petit territoire (5 min, frame extraction).
2. PRIORITÉ 1 — retarder l'apparition Maroc/Algérie à `b5Start` (15-20 min).
3. PRIORITÉ 2 — renforcer le contraste du halo Europe, re-render, comparer (30-45 min).
4. SFX sur l'Acte 1 (à chiffrer une fois le reste de la vidéo assemblé).
5. Render final + validation Aziz.

## Référence

- Render v6 (validé comme base de prod) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/acte1-v6-m5QFFUpozes11al9Vs2NxEXfaZkPdU.mp4
- Fichier source : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx`
- Historique complet du chantier (8+ rounds proto, review upstream 3 voix, refonte caméra, downstream
  review 3 voix) : `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md`
