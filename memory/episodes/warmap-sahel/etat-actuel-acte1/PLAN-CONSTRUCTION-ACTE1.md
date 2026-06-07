# PLAN DE CONSTRUCTION — Acte 1 War-Map Sahel (validé upstream Gemini+Kimi)

> Créé 2026-06-07. Review UPSTREAM (avant code) sur l'état actuel validé (socle 6 mécaniques).
> Gemini + Kimi CONVERGENT. Bruts : da-acte1-construction-{gemini,kimi}.md. C'est le plan à
> SUIVRE pour recoder l'Acte 1. Tout vérifié faisable dans notre stack (Remotion/Mapbox/SVG).

## ⭐ ORDRE DE CONSTRUCTION (Gemini — éviter les pièges techniques)
1. **Track caméra SEUL** (f0→f2299) : valider rythme + drift + pause f572 + reprise. Rien d'autre.
2. **Allumer zones en "CUT"** (sans anim) aux frames exactes → valider synchro voix/image.
3. **Easings** : springs sur opacités + stroke-dashoffset sur frontières.
4. **"Chrome"** : véhicules, pulses villes, tampons, ondes de choc.
⚠️ Piège : NE PAS coder les véhicules avant caméra validée → sinon moonwalk (sprite glisse).

## ENCHAÎNEMENT BEAT PAR BEAT (consensus)
- f0-150 : carte vierge (sépia+vignette) + carton titre, drift lent démarre, 1s silence.
- f151 Mali : fill 0→0.82 + front beige se dessine + Bamako pulse 1x. STAGGER fond→contour→ville.
- f231 Burkina : idem + Mali baisse luminosité (brightness 85%, dirige l'œil). Progression O→E.
- f302 Niger + CEDEAO : Niger s'allume + anneau CEDEAO qui SE ROMPT (dasharray qui s'allonge OU
  s'étend vers l'extérieur en s'effaçant) — PAS clignote (= loading spinner amateur).
- f423 Liptako : 3 lignes beiges capitales→centre se dessinent (trait continu, PAS marching-ants),
  s'épaississent à l'arrivée → pulse or UNIQUE ("soudure" alliance).
- f572 FREEZE : TOUT s'arrête caméra comprise, 2s silence absolu. LE moment clé (imprime l'AES).
- f727 transition : drift reprend + NETTOYAGE COGNITIF (couleurs politiques 0.82→0.3) pour faire
  place à la couche tactique. "éteindre la géopolitique pour allumer la tactique".
- f1198 JNIM : zone rouge fade-in + tampon "JNIM" DÉCALÉ ~20f (apparaît au mot "Al-Qaïda", pas avant).
- f1396 : véhicules JNIM patrouillent (lents, orientés selon trajectoire, mouvement erratique/courbes).
- f1749 EIGS : idem orange-brun (saturation -30% vs or contesté), tampon décalé, mvt linéaire/discipliné.
- f2167 friction : véhicules se rapprochent → ondes de choc/glow au contact → reculent (ease-out-back).
- f2299 : véhicules s'estompent, 2 zones distinctes, freeze 1s. Fin Acte 1.

## TEMPLATES — ajustements validés
- Anneau CEDEAO : se ROMPRE/fissurer (stroke-dasharray), pas clignoter. Réf #122 mais désaturé.
- Flèches convergence : trait beige continu qui se dessine, PAS marching-ants. Réf #139/#96.
- Véhicules : signature gardée. Différencier par le MOUVEMENT (JNIM erratique / EIGS linéaire) + couleur.
- Allumage séquentiel : esprit #91 (Europe Rapid Sequence).
- MANQUE à ajouter : typo "dossier classifié" (serif grasse + liseré) · texture papier animée subtile
  (feTurbulence seed change /120f, opacity 0.03) · ombre portée sur fills (drop-shadow) pour "flotter".

## ANTI-SLOP — 8 parades (préventif)
1. STAGGERING obligatoire (5-10f entre fond/contour/pulse). "Erreur n°1 amateur = tout même frame".
2. HIÉRARCHIE pulses : capitales = 1 pulse à l'allumage ; groupes armés = PAS de pulse (anti sapin de Noël).
3. CAMÉRA jamais easing linéaire (= Google Earth) → spring amorti / bézier custom.
4. TEXTE décalé de la voix (anti-redondance).
5. JAMAIS cut sec sur carte statique — toujours motiver par caméra.
6. Couleurs : texture papier multiply opacity 0.15 + saturation fills -15% (anti "plastique digital").
7. Véhicules : easing sur paths + rotation selon tangente (atan2) + léger wobble ±2° (anti-robotique).
8. Palette d'easing variée : allumage cubic-bezier(0.4,0,0.2,1) · convergence spring · friction ease-out-back.

## CHECKLIST avant codage (Kimi)
- [ ] Véhicules : ombres portées cohérentes (même direction que le relief)
- [ ] Grain de papier animé (subtil) anti-plastique
- [ ] Labels villes : text-shadow pour lisibilité sur sépia
- [ ] Freeze f572 : TOUS mouvements stoppés (drift caméra inclus)

## NB : blur autorisé via SVG filter (feGaussianBlur), JAMAIS filter:blur CSS (headless KO).
