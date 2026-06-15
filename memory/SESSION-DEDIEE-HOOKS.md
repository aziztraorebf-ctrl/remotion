# SESSION DÉDIÉE HOOKS — Préparation (créé 2026-06-15)

> ⭐ CHANTIER STRATÉGIQUE prioritaire (Aziz 2026-06-15). "On est à court de bons hooks" = manque
> structurel. Objectif : une BIBLIOTHÈQUE de hooks RÉUTILISABLES pour TOUTES nos vidéos
> (War-Map, Souverain, Atlas), pas juste un hook one-shot. Session ÉTENDUE, on pousse à fond.

## POURQUOI (le constat)
- Le hook = levier #1 de rétention (confirmé : toutes les grosses chaînes y mettent l'emphase).
- On a PROUVÉ qu'on sait créer des hooks forts : **KineticMaskSlam** + **ComboMaskSweep** (validés, previews).
- Mais on n'a PAS de bibliothèque structurée → à chaque vidéo on improvise → hooks faibles.
- ⛔ LEÇON 2026-06-15 (hook Sahel raté) : NE PAS transposer une recette d'une AUTRE grammaire
  (gabarit Bellona "carte qui se transforme", pensé pour leur style) sur NOTRE carte 2D flat
  top-down. Partir de CE QUI MARCHE CHEZ NOUS. Le prototype `SahelHookActe1` a été supprimé.

## NOS 2 PATTERNS PROUVÉS (le socle de départ)
1. **KineticMaskSlam** ⭐ (`src/projects/_shared/mapbox/KineticMaskSlam.tsx`) — un CHIFFRE/MOT géant
   slamme, la carte n'est visible qu'À L'INTÉRIEUR du texte (mask SVG), puis le texte zoome jusqu'à
   révéler la carte pleine + allumage pays gold. Props : bigText, subText, focusIso, center, baseZoom.
   Preview H : https://files.catbox.moe/6zivbg.mp4 · V : https://files.catbox.moe/9hu9oe.mp4
2. **ComboMaskSweep** ⭐ (`src/projects/_shared/mapbox/ComboMaskSweep.tsx`) — variation/extension du
   Kinetic : chiffre choc → révèle carte → faisceau allume le pays. Hook 3 temps "le plus abouti".
   Preview H : https://files.catbox.moe/n9f3u3.mp4 · V : https://files.catbox.moe/h75bhk.mp4
   ⚠️ Ces 2 sont Mapbox AUTONOMES (style dark, leur propre Map) → pour les brancher sur un moteur
   custom (War-Map parchemin), ADAPTER la mécanique (mask-texte + zoom-reveal), pas déposer tel quel.

## BACKLOG IDÉES HOOK (déjà noté, à exploiter en session)
- `memory/tools/gemini-hook-ideas-2026-06-02.json` : TacticalRadarScan, EpicenterShockwave,
  SatelliteTargetLock, GlitchMapIntro (idées non codées).
- 3 gabarits formalisés `memory/doctrines/HOOK-MAXBELLONA-GABARIT.md` (A carte se transforme /
  B argumentatif / C questions-pièges) — VALABLES comme STRUCTURE, mais à réincarner dans NOTRE grammaire.
- Analyse chaînes : `feedback_medieval-mindset-methode.md` (in medias res par personnage, pont temporel).

## DA-BRIEFS HOOK déjà produits (réutilisables) — `memory/episodes/warmap-sahel/da-briefs/`
- `da-warmap-hook-acte1-{gemini,kimi,deepseek}.md` : mises en scène seconde-par-seconde (matière riche,
  même si la direction "carte qui se transforme" était inadaptée — les briques d'animation restent utiles).

## OBJECTIFS DE LA SESSION DÉDIÉE
1. Décoder + s'inspirer (Stream/chaînes de réf si besoin) — qu'est-ce qui fait un hook qui RETIENT en 2D.
2. Concevoir une FAMILLE de hooks réutilisables, paramétrables (chiffre, mot, carte/pays, registre).
3. Les rendre AGNOSTIQUES au moteur (utilisables War-Map parchemin ET Souverain Mapbox ET Atlas).
4. Catalogue + previews + doctrine d'usage ("quand Aziz dit X → tel hook").
5. PUIS l'appliquer à l'Acte 1 War-Map Sahel (le besoin immédiat qui a déclenché tout ça).

## CONTRAINTES IDENTITÉ (garde-fous)
Carte 2D flat top-down (pas 3D). Registre on/nous jamais "tu". Pas de CTA dans le hook. Grammaire
contours-qui-flashent (P3/P4). Escalade émotionnelle. Pas d'overlay semi-transp (carte à travers).
