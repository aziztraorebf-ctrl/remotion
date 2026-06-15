# PLAN REFONTE P4 — Polish (après visionnage Aziz 2026-06-15)

> Source : DA-brief P4 (Gemini 3.1 Pro + Kimi K2.5, frames réelles) + décisions Aziz.
> Fichiers DA : `/tmp/da-refs/da-warmap-p4-refonte-{gemini,kimi}.md`.
> Diagnostic prouvé par frames (intro vide t12, bug opacité t67, fin entassée t122, final court t133)
> + diff de frames consécutives (jitter sub-pixel confirmé).

## CONTEXTE
P4 rendue complète (`SahelPartie4` f9416→13439). Aziz a relevé 8 problèmes réels.
Refonte = polish, pas réécriture. Tous validés par DA (G+K convergents) + tranchés Aziz.

## DÉCISIONS VERROUILLÉES (Aziz)
1. Intro : PAS de plaque-titre. Caméra serrée + villes qui s'allument.
2. ⭐ Triple-screen : PROLONGER ~40s + ANIMER chaque volet + EFFACER opacité Mapbox (axe central).
3. Fin : zoom serré (pas continental).
4. Portraits dirigeants réduits + caméra figée.
5. Soldats : GARDER les sprites (soldier-aes.png), espacés aux frontières nord + réduits (PAS icônes Lucide).
6. Flash "Construire" : retiré.
7. Final : allongé ~5.5s + 1 ligne typewriter monospace = « Durer — reste à le démontrer. »
8. Jitter : caméra figée (drift→0) sur séquence finale.

## PLAN D'IMPLÉMENTATION (tranché)

### A. Triple-screen ressources (#2 — priorité)
- Allonger la fenêtre overlay à ~40s. Recaler `MAP_HIDE_WINDOWS` + `CONTOUR_HIDE_WINDOWS`
  sur TOUTE la plage + fade-out inclus (fin = Y+24f). `mapHideFactor`→1 plein.
- Chorégraphie interne par volet (frame-driven, séquentielle gauche→droite) :
  Mali : contour trace → texture or → icône émerge (scale spring) → compteur 0→~68 t/an → badge "2e Afrique".
  Burkina : idem décalé +0.5s → ~60 t/an → "parmi les premiers".
  Niger : double séquence Atom (uranium, rotation lente) + Droplet (pétrole, remplissage clipPath) → "Arlit/Agadem".
- Panneau du pays nommé pulse 1.05x quand la voix le dit (synchro alignment).
- Accent couleur pays sur les icônes (ocre/brique/sarcelle). Icônes Lucide vectorielles (pas photos/PixelLab).

### B. Intro (#1)
- Zoom départ serré (~5.2). Pas de drift latéral.
- MapPins Lucide + anneaux pulsés sur Djibo/Ménaka/Tillabéri dès ~f9440.
- OPTION (à tester) : RefugeeFlow pré-charge ~2s avant narration ; WarMapDimmedOverlay trous lumineux.

### C. Fin (#3-4-5-6)
- Caméra : figer le drift (driftSpeed→0) + zoom serré ~5.2-5.4 sur la séquence dirigeants/soldats. Pas de continental.
- Portraits dirigeants : D `vmin*0.105` → `~0.065`.
- Soldats : sprites soldier-aes.png GARDÉS, dispersés aux frontières nord (pas cluster central), réduits.
- Menaces : OPTION zone tampon SVG + AlertTriangle (vs 7 jetons) — à tester, sinon réduire/disperser.

### D. Final (#7-8)
- Retirer constructFlash (ligne ~808).
- Allonger plan noir ~5.5s. 1 ligne typewriter monospace (Courier) : « Durer — reste à le démontrer. »
- Contours AES trait épais 4px (ocre/brique/sarcelle). Fade au noir doux.
- OPTION : SFX clavier mécanique léger sur les lettres.

## ÉCARTÉ
- Plaque-titre intro (Aziz). Dézoom continental (illisible). Overlays semi-transp (doctrine). Icônes Lucide pour soldats (Aziz : garder sprites). PixelLab pour icônes ressources (chaotique).

## NOTE TECHNIQUE
- DeepSeek pas appelé (l'outil ne l'inclut pas par défaut sans flag) — Gemini+Kimi vision ont suffi.
- Jitter = aliasing temporel (caméra drift + traits fins géo-ancrés re-projetés). Caméra figée = seule vraie solution.
