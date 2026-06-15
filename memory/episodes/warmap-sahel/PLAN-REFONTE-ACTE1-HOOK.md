# PLAN REFONTE ACTE 1 + HOOK — War-Map Sahel (2026-06-15)

> DA-brief 3 voix (Gemini+Kimi+DeepSeek) : `da-briefs/da-warmap-hook-acte1-*.md`. Convergence forte.
> Décisions Aziz tranchées. Grammaire = celle validée en P3/P4.

## DÉCISION STRUCTURANTE (Aziz)
**Refaire TOUT l'Acte 1 (0-77s) à la grammaire P3/P4**, pas juste le hook. Cohérence début↔fin.
- ❌ SUPPRIMER les gros blocs `sahel-fill` (coloriage bleu/jaune/rouge) → contours nationaux qui se
  tracent/flashent (Mali ocre #D98A3D / Burkina brique #C0553C / Niger sarcelle #4E8C7D), carte opaque.
- ❌ SUPPRIMER la légende factions (haut-gauche) — déjà absente de P2/P3/P4, incohérente.
- ❌ SUPPRIMER la timeline graduée (bas) — registre dashboard, tue le hook.
- ✅ Adopter la grammaire causale + contours flash + jetons + caméra serrée de P4.

## MISE EN SCÈNE DU HOOK (0-28s) — consolidée des 3 voix
Audio CONSERVÉ (v5 expressive). Recaler les triggers sur narration-v5-alignment.json.

| Temps | Audio | Visuel | Brique |
|---|---|---|---|
| 0-3s | (cold-open) | carte tremble + grain + flash + boom grave (choc avant le texte) | caméra+SVG+SFX boom |
| 0.1-4.5s | « trois pays ont tout changé » | fond sombre, 3 contours se tracent 1 à 1 + pulse, trous lumineux | countryOutline + WarMapDimmedOverlay |
| 4.6-7.1s | « ils CHASSENT les militaires » | jeton/drapeau France ÉJECTÉ hors carte (translateY+rot, spring sec) | jeton + Lucide Flag/Shield |
| 7.2-9.3s | « ROMPENT les alliances » | liens dorés qui CLAQUENT en leur milieu (stroke-dashoffset + éclats) | SVG paths |
| 9.4-12.6s | « QUITTENT la CEDEAO » | cercle CEDEAO → 3 pays SORTENT du cercle, cercle restant grisé | WarMapDimmedOverlay + clipPath |
| 13.5-16.2s | « BÂTISSENT du nouveau » | TRANSFORMATION carte géo→guerre + sceau AES tamponné au centre | proto P3 transfo + sceau |
| 17.4-21.0s | « Comment ? Pourquoi maintenant ? » | 2 questions TYPO MASSIVE plein écran, pulse/révélation (DÉCISION AZIZ : typo oui) | WarMapOverlayDynamic fullscreen |
| 22.7-28.5s | « regarder ce qui existait avant » | zoom arrière + transition temporelle → carte "d'avant" + voile gris. PARADOXE ici (DÉCISION AZIZ : paradoxe à 22s pas 16s) : richesses or/uranium ↔ crise | transition + icônes Lucide |

## DÉCISIONS DE GOÛT AZIZ (tranchées)
- Questions 17-21s : TYPO MASSIVE plein écran (pas visuel seul).
- Paradoxe richesses↔drame : à ~22s (début explicatif), PAS à 16s (évite surcharge).
- Légende + timeline : SUPPRIMÉES.
- Gros blocs couleur : SUPPRIMÉS → contours flash (grammaire P4).

## ÉCARTÉ (consensus 3 voix)
Légende dashboard · timeline au début · coloriage progressif mou · blur CSS · split-screen (divise l'attention) · gabarit B/C (moins fort que la transformation pour une ouverture).

## ⚠️ DETTE À RÉGLER EN MÊME TEMPS
Triggers Acte 1 calés sur narration-v1 (moteur ligne 382) → RECALER sur narration-v5-alignment.json
(le moteur joue déjà v5-expressive ligne 2259, mais le visuel est désynchro).

## MÉTHODE
Coder → render test hook (0-30s) → valider Aziz → reste Acte 1 (30-77s) → render full Acte1 → valider.
PUIS passer à P1, P2, P3 (passe séquentielle). Assemblage en TOUT DERNIER.
