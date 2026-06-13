# Synthèse 3 voix — review downstream P3 v2 (2026-06-12)

> Gemini 3.1 Pro (vidéo complète) + Kimi K2.5 (8 frames) + Aziz. Reviews brutes :
> `gemini-p3-jet2-review.md` + `kimi-p3-jet2-review.md`.

## CONVERGENCE TOTALE (3/3) — appliqué en v3
- Focus radial flou = supprimé (Kimi "filtre Instagram", Gemini "claustrophobique").
- Flèche or début = retirée (redondante avec overlay AES).
- Bleu Kidal illisible → sillage wet-ink des jetons + label "CONTRÔLE DE L'ÉTAT MALIEN".
- Africa Corps distinct → vrai jeton mercenaire russe généré (teint pâle, contractor tan, bordure gris-fer).
- ONU impuissance → marqueur casque bleu + pictogramme "interdiction de tirer" (cercle barré) + recul actif.
- Moura trop léger → tache de sang qui s'étend + chiffre mémorial "500+" + SFX grave (boom + drone) + sépia.
- Attaques 2026 → SahelAttackArrow rouges qui poussent + jetons + contour Mali bleu qui flashe (se brisent).
- Plaques élaguées → KIDAL disparaît après reprise (le drapeau suffit). "HORS CONTRÔLE"/"FAMa+AC" retirées.
- Drapeau Mali rectangulaire ondulant + onde de choc bleue à l'impact (cinétique).

## DIVERGENCES (tranchées par Aziz)
- "Soldat écrasé" (Aziz initial) → REJETÉ (Gemini "cheap/hors charte"). Remplacé par CINÉTIQUE : onde de
  choc à l'impact + jeton ennemi repoussé. Aziz a validé la cinétique.
- Ph1 plein écran (Gemini a basculé pour) vs semi-transp (Aziz validé) → Aziz veut COMPARER les 2 versions
  finalisées avant de trancher. (2 maquettes rendues.)
- Kimi "flèche LES MÊMES ACTEURS Moura→Africa Corps" → ÉCARTÉ (charge éditoriale ; le script reste sourcé
  "selon le rapport de l'ONU", prudent).

## À NE PAS CASSER (3 voix)
Inversion chromatique bleu/rouge · latence ONU→offensive · sobriété "table d'état-major".

---
## ⚠️ BUG REVIEW PREMIUM (2026-06-13) : Gemini n'a PAS vu la vidéo
Au review premium v6, gemini-p3-review.py (gemini-3.1-pro-preview, Files API vidéo) a répondu "sans avoir
l'image sous les yeux" → il a raisonné sur le TEXTE du brief, pas la vidéo. Ses suggestions = principes
génériques, dont plusieurs déjà faites ou contraires aux choix Aziz (refocus radial retiré, plein écran écarté)
ou fausses techniquement (map.easeTo INTERDIT). À INVESTIGUER : pourquoi l'upload vidéo Files API ne "prend" pas
pour ce modèle (peut-être 3.1-pro ne lit pas la vidéo, ou bug upload). EN ATTENDANT : pour un review VIDÉO fiable,
privilégier Kimi sur FRAMES (lui a bien vu). Gemini reste OK sur frames/texte, pas vidéo.
