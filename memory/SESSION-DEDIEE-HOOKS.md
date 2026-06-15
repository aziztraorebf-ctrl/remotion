# SESSION DÉDIÉE HOOKS — ✅ LIVRÉE (session 2026-06-15)

> ✅ **CHANTIER LIVRÉ.** Bibliothèque codée + commitée (branche `feat/hooks-library`, commits 581542a + 21f7649).
> Code : `src/projects/_shared/hooks-lib/`. Catalogue : `hooks-lib/HOOKS-LIBRARY-CATALOGUE.md`.
> Plan + synthèse DA + leçons : `memory/HOOKS-LIBRARY-PLAN.md` (SOURCE DE VÉRITÉ du chantier).
>
> **CE QUI A ÉTÉ LIVRÉ :**
> - `HookMapBackground` = fond commun agnostique (theme dark/parchemin + raccord carte `countriesGeoJson`
>   + `camKeys` CAMÉRA SERRÉE+PAN comme Acte 1 + `litStagger` contagion + projection géo + punchZoom).
> - 3 hooks à mécaniques DISTINCTES : `CrosshairLock` (traquer), `RedlineContagion` (propager),
>   `MaskReveal` (révéler par texte, prop `effect` plain/echo/chromatic — fusion anti-redondance).
> - `ArteryDrain` = INSERT éco (pas hook). `HookEffects` = grain + displacement (onde de choc), prouvés render.
> - Démos catbox : CrosshairLock cam serrée `9q75sr` · RedlineContagion AE `uwbr8o` / cam `2ppj6r` · MaskReveal cam `4ea6cl`.
>
> **3 LEÇONS GRAVÉES** (dans HOOKS-LIBRARY-PLAN) : (1) hook (crée tension) ≠ insert (explique) ;
> (2) ne pas multiplier les variantes de DÉCO du même squelette = AI-slop ; (3) CAMÉRA SERRÉE comme la
> vraie vidéo (regarder ACTE1_CAM_KEYS), JAMAIS vue continent figée.
>
> **RESTE (différé, pas un manque)** : brancher un hook sur la vraie vidéo AES Acte 1 + narration (= le
> vrai test, relève de la refonte Acte 1 Priorité 2) · version VERTICALE Short · effets AE secondaires
> (halftone radar, gradient-spot, déchirure) · morph path (sujet historique). Tout tracé dans le catalogue.

---
## (archive) Préparation initiale du chantier

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
