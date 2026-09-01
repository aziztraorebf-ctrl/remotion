# Décodage Castile → War-Map AES : leçons + garde-fou doctrine (2026-06-18)

Source : "Castile: The Kingdom That Shattered Muslim Spain" (History Mapped Out), 25min, ~300k vues.
Cas d'école proposé par Aziz : War-Map historique très aboutie (AE/3D), à décoder pour en extraire
ce qui est REPRODUCTIBLE dans notre registre (flat, sépia, Mapbox, intention-d'abord).
Matière : `out/_r-and-d/decode-castile/` (frames, transcript, protos, DECODE-NOTES.md).

## CE QUI SE TRANSPOSE (filtré par notre DA) — prouvé par proto
- ✅ **Bannière flottante FLAT** : ondulation 2D codée Remotion (bandes sinusoïdales, mât fixe / bord
  libre). Validée Aziz "très bonne idée, pousser dans ce sens". `ProtoFlag_Sahel.tsx`. Intention = lieu tenu/vivant.
- ✅ **Sceaux d'événement SÉPIA** (alliance/tribut/pouvoir/bataille) : leurs icônes = icon-pack style
  EMOJI (poignée de main, couronne, épées, pièce) → en emoji ça JURE avec notre registre documentaire.
  Transposition = pastille sceau cire/métal gravé sépia + picto lucide-react monochrome. `ProtoPieces_Sahel.tsx`.
- ✅ **Sceau ANIMÉ one-shot** : leurs icônes sont animées (poignée qui se serre, épées qui s'entrechoquent)
  = motion design 2D (PAS 3D/PixelLab/AE-magique), reproductible en CODE Remotion. RÈGLE ANTI-KITSCH :
  anim joue 1 fois à l'estampage PUIS FIGE (pas de boucle continue = gadget). `ProtoSealAnim_Sahel.tsx`.
  Réserve : certains glyphes maison (mains en barres) peu lisibles → préférer vrais pictos lucide animés.
- ✅ **Plan tactique de bataille** (respiration stratégique↔tactique) : leur outil anti-monotonie n°1 sur
  format long. NOTRE AES n'a AUCUNE bataille sur 6 min = plus gros manque. MAIS : réutiliser NOS jetons
  existants comme pièces tactiques (Aziz), PAS créer de nouveaux jetons abstraits. `ProtoBattle_Sahel.tsx` à refaire.
- ✅ **FX flammes/fumée** (là où PixelLab/leur 3D brille) : on a DÉJÀ la fumée (`fx-smoke` AES Partie 2).
  Flammes = sprite Gemini sépia bouclé (force Aziz : ce que Gemini crée, on l'anime sur la carte).
  Nos flammes ne seront jamais aussi léchées que leur 3D, et c'est OK.

## CE QU'ON REJETTE (prouvé sur pièce, pas deviné)
- ❌ **Pions-personnages "vivants"** (voie réaliste Gemini→breathing Remotion ET voie PixelLab pixel-art).
  Nos jetons-portraits flat existants sont DÉJÀ excellents. Réaliste = "animation en boucle" moins élégante ;
  PixelLab = pixel-art qui DÉTONNE avec nos jetons gravure (effet jeu-vidéo dans un document documentaire).
  → PixelLab reste bon pour Atlas (video-game assumé) + pour les FX (flamme/fumée), JAMAIS pour portraits War-Map.
- ❌ **Formes carré/losange colorées** comme pièces : concurrencent nos jetons-portraits (notre signature),
  trop "jeu de plateau", diluent. Si distinguer unité vs acteur : attribut discret sur le jeton rond, pas forme rivale.

## NOTRE LANGAGE WAR-MAP (constaté dans l'AES réel, pas deviné)
Carte Mapbox FLAT vue du dessus · palette SÉPIA (`SAHEL_COLORS`: land #F5EFD6, etat #3E6E9E, jnim #B14B3C,
contested #C99A3A) · typo Cormorant Garamond (titres) + Roboto Condensed (labels) · jetons ronds portraits
gravure cerclés or · halos de contrôle · sprites forts + fx-smoke · contours pays colorés (MLI ocre/BFA brique/NER sarcelle).
⚠️ Frise chrono + encarts "contrôle territorial" = RETIRÉS dans versions finales (après Partie 1).

## ⛔ GARDE-FOU MAJEUR (recadrage Aziz 2026-06-18) — appliquer [[CONTINUITE-SCENE-INTENTION-DABORD]]
Décoder une vidéo réf → lister ses effets → "lequel reproduire ?" = **TEMPLATE-FIRST déguisé** (le catalogue
n'est plus interne, c'est leur vidéo). On a dérivé : protos d'effets HORS-SOL, jolis mais branchés sur AUCUN
moment réel de l'AES, sans intention narrative. = accumulation d'assets, PAS de la mise en scène.
- La phase DÉCODAGE (comprendre ce qui se transpose/jure/nous apprend) EST utile et doctrinale.
- La phase PROTO D'EFFETS EN SÉRIE ne l'est plus dès qu'elle perd l'intention.
- **Retour au supérieur** = repartir d'un MOMENT RÉEL de l'AES → définir l'intention (1 verbe : sceller un
  pacte, encercler, menacer) → ALORS la forme (sceau animé, bataille, bannière) sert ce moment précis, et
  on sait s'il faut animer/sobre/rien. Un sceau "alliance" attaché à la Charte Liptako-Gourma = forme au
  service du sens. Un sceau orphelin = asset au cas où.
- Test : si je produis une forme sans pouvoir nommer le moment AES + l'intention qu'elle sert → STOP, je suis template-first.

## Branche : feat/warmap-decode-castile-protos (protos R&D, AES non touché, rien committé)
