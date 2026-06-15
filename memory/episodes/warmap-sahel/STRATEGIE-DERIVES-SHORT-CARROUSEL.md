# STRATÉGIE — Dérivés Short + Carrousel à partir du long War-Map AES

> Question Aziz 2026-06-15 (fin de session). À reprendre APRÈS finalisation du long (assemblage + Gemini polish).
> Principe : un long = gros travail → en tirer des réutilisables multiplie le ROI sans re-tourner.

## Faisabilité (verdict)
- **CARROUSEL IG/FB = FACILE** (quick win, ~quelques heures). Pipeline existant.
- **SHORT 60-90s 9:16 = MOYEN** (~1 session). 80% des briques sont là, mais ≠ couper 60s du long.

## CARROUSEL (le plus rentable, à faire en premier)
- Pas de vidéo/audio/vertical → slides fixes.
- RÉUTILISER les frames clés déjà rendues (confédération sceau AES, triple-screen ressources, carte contrôle,
  exode, CFA). Contenu = transcript du long (règle : jamais improviser, source = vidéo — `feedback_carousel-content-source`).
- Pipeline existant : `src/projects/souverain/carousels/hybrid/README.md` (+ good-news pour les briques).
- CTA : "Cherche @koraetcartes" (pas de lien externe — `feedback_instagram-algo-lien-externe`).

## SHORT 60-90s vertical 9:16
Obstacles (par ordre) :
1. **Format vertical** : le long est 16:9, scènes composées 16:9 (triple-screen, accordéon NE passent PAS en
   9:16). MAIS `WarMapSplitScreen` gère déjà l'orientation HORIZONTALE (haut/bas) = split 2-écrans natif vertical.
   → recadrer/recomposer scène par scène (travail).
2. **Écriture condensée** : 1 SEULE idée, pas un résumé. Angle le plus fort = "Comment 3 pays pauvres ont défié
   la France" (confédération + CFA + uranium nationalisé 2025). Travail d'écriture.
3. **Hook 9:16 agressif** : ON A LES OUTILS → `HOOK-MAXBELLONA-GABARIT.md` (gabarit A) + proto **P3 transformation
   carte→guerre** (`_rnd/maxbellona/`) déjà codé cette session. Parfait pour l'ouverture.
4. **Audio** : re-générer narration courte ElevenLabs (léger, pipeline voix vivante existant).
- Pattern PROUVÉ : Sénégal = le Short "Pétrole de la patience" était le TEASER du mid-form. Même logique ici.
- Pipeline Short Souverain rodé adaptable (`SOUVERAIN-SHORT-DEMARRAGE/SKELETON`).

## ORDRE RECOMMANDÉ
1. Finaliser le LONG (assemblage + Gemini polish) — priorité.
2. CARROUSEL (quick win, frames déjà là) — pour accompagner la sortie.
3. SHORT-teaser (1 angle fort, 9:16, hook P3) — session dédiée, gros reach.

## RÉUTILISABLE pour le short (déjà créé cette session)
- Proto P3 (carte→guerre) = hook. Gabarits hook A/B/C. WarMapSplitScreen orientation horizontale (2 écrans vertical).
- Frames FINAL de toutes les scènes (réutilisables en carrousel ET comme plans du short).

Liens : [[INVENTAIRE-TEMPLATES-SESSION-06-15]] · [[HOOK-MAXBELLONA-GABARIT]] · [[DECODE-sahel-chronicles]]
(public panafricain confirmé) · project_carousel-pipeline · STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.
