# Synthèse review Zone 2 Acte 1 (f750-2299, 25s-1:16) — Gemini + Kimi CONVERGENT

> Review DA-BRIEF-GATE 2026-06-07 sur la 2e moitié de l'Acte 1 (vide / "mouvements fantômes").
> Bruts : da-zone2-{gemini,kimi}.md. Frames : f750-transition / f1198-jnim / f1500-patrouille /
> f1800-deux-groupes / f2167-friction. Décisions Aziz incluses.

## DIAGNOSTIC (unanime)
"Syndrome de l'aquarium" (Gemini) / "densité narrative par pixel" (Kimi) : 1re moitié = géométrie
MACRO (pays, anneau) remplit l'écran. 2e moitié = MICRO (véhicules 40px) SANS changer l'échelle de
mise en scène → 3 sprites portent 50s seuls = vide. "Mouvement fantôme" = (1) trajectoires sans
mémoire, (2) terrain qui ne réagit pas, (3) caméra reste macro.

## 3 CORRECTIONS LES PLUS RENTABLES (consensus total)
- **A. ZOOM caméra** : push-in Mali (JNIM) → pan est (EIGS). Agrandit les véhicules, crée un "voyage".
  → **Décision Aziz : zoom MODÉRÉ + pan O→E** (reste lisible, zone visible).
- **B. TACHE D'INFLUENCE** ⭐⭐ (LE point clé) : les véhicules ÉTALENT une couleur de contrôle qui
  GRANDIT depuis le foyer (rouge JNIM organique bords irréguliers / sombre EIGS géométrique). Au
  contact f2167 les 2 taches se touchent puis se repoussent. Donne du SENS au mouvement + comble le
  vide. Métaphore "tache = conquête" lisible. → **Décision Aziz : tache qui s'étend depuis la zone.**
- **C. TRAÎNÉES** : chaque véhicule laisse une traînée beige qui s'estompe ~2s (occupation, pas glisse).

## IDÉES ADDITIONNELLES (à intégrer si pertinent)
- Highlight "trois frontières" Mali-Niger-Burkina au mot exact (stroke beige draw-in) — la carte "écoute".
- Différenciation par MOUVEMENT : JNIM courbes organiques / EIGS lignes droites mécaniques (déjà amorcé).
- Icônes contexte (bœuf/blé) sur "tensions éleveurs/agriculteurs" — ancre social (optionnel).
- Vignettage dynamique : assombrir hors zone active (guide le regard). NB on a déjà la vignette géo.
- Transition continue O→E (pan 60f, tache JNIM fade 40→20% pendant qu'EIGS monte 0→40%).

## VÉRIFICATIONS (Gemini/Kimi = signal, jamais juge)
- ⚠️ Gemini "flyTo" = FAUX dans notre stack (incompatible headless). Zoom = interpolate + jumpTo frame-driven.
- ⚠️ "réduire véhicules 30%" : EIGS déjà réduit (size 46), rejuger après zoom.
- ✅ Reste factuellement juste + exécutable stack (Remotion/SVG/Mapbox, zéro AE/3D).

## VERDICT (les deux) : structure BONNE, à ENRICHIR pas repenser.
Squelette OK (véhicules au bon moment suivant la voix), manque la CHAIR : taches d'influence + zoom + traînées.

## PLAN D'IMPLÉMENTATION (décidé)
1. Zoom modéré + pan O→E dans ACTE1_CAM_KEYS (push Mali f1198, pan est f1749).
2. Tache d'influence SVG qui grandit (polygone reprojeté frame-driven) : JNIM rouge organique depuis
   centre Mali, EIGS sombre depuis est Niger. Contact + répulsion f2167.
3. Traînées véhicules (SVG path opacity dégressif).
4. (Optionnel selon rendu) highlight trois-frontières + icônes contexte.
