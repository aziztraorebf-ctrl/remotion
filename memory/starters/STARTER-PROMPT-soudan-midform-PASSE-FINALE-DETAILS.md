# STARTER — Soudan mid-form : PASSE FINALE (12 points polish, session dédiée)

> ✅ **v3 VALIDÉE Aziz dans les grandes lignes (2026-07-22)** : "la vidéo est quasiment finie, on approche du but,
> excellente démo technique 10min multi-registres". Reste 12 points de POLISH ciblé → SESSION DÉDIÉE (décision Aziz).
> Base = `out/episodes/soudan-midform/wip/passe-finale-v3/soudan-midform-v3-MIX.mp4` (636s). Lien : https://litter.catbox.moe/wkn6hj.mp4
> ⛔ NE PAS tout refaire : la v3 est la base, on applique ces 12 corrections dessus.

## OUTILS EN PLACE (tous prouvés cette session)
- Pauses audio DÉTERMINISTES : `scripts/tools/soudan-audio/pauses-sur-original.py` + manifest par acte (cut_s/resume_s/sil_s
  calés sur whisper MOT-À-MOT, PAS gros gaps). ⛔ GARDE-FOU whisper obligatoire après (whisper-align.py, vérifier 0 mot coupé).
- Retrait de mot : re-couper l'audio à la frontière du mot (whisper) + garde-fou.
- SFX sobres : `mix-soudan-v3.sh` (liste SFX fichier:tc:vol). Assets dings : `_shared/sfx/ui/{node-appear,blip-bubble,plate-pop}`,
  `_shared/sfx/camera/sfx-map-ping`, `_shared/sfx/ui/slash-red` (négatif). Count-up : chercher counter-tick / créer boucle courte.
- Globe début habité : recette Acte 4 (PortraitToken 2 généraux + TerritoryGlow + MilitaryToken char/soldat, openingReveal spring).
- Re-timing après changement audio : formule NETTE `F + 30*somme(sil_s − gap_naturel des pauses avant F)`.
- Plaques sources : `SourcePlaque` (Acte 3 insert, bas-droite, ~1.8s fade, SANS le mot "Source:"). Sources fact-check jury.

## LES 12 POINTS (par catégorie)

### 🔊 SFX (dings/count-up)
1. **~0:50 (A1)** count-up sur "50 millions d'habitants" (chiffres qui montent).
2. **Conseil ONU (~9:00, A6 B3)** dings/pings quand les 14 sièges VERTS s'allument (cascade) + MÊME ping quand le siège
   passe au ROUGE (Russie s'oppose) → REMPLACE le SFX Russie actuel (Aziz : "plus naturel, fait plus de sens").
3. **~10:15 (A6 B5)** count-up sur l'insert "13,5 millions de déplacés".

### 🎙️ AUDIO pauses/coupures (méthode déterministe + garde-fou)
4. **Fin HOOK** : l'encadré "Où va cet or ?" (bas d'écran) doit DISPARAÎTRE avant la transition. C'est dans le hook lui-même
   (`src/projects/warmap/soudan-hook/OrDarfourHook.tsx`) — faire fade la plaque avant la fin.
5. **~4:40 (fin A3)** "qui pourrait encore arrêter tout ça ?" est COUPÉE avant "tout ça" → l'A3 n'a PAS encore reçu la
   protection phrase-finale. Re-couper/prolonger pour laisser finir la phrase. (Whisper : chercher "tout ça" fin insert A3.)
6. **~6:28 (début A4)** petit silence avant "Ce n'est plus seulement deux camps soudanais...".
7. **~8:12-8:14 (raccord vers A6)** silence avant "Une guerre comme celle-là" (la voix se précipite). = début Acte 6.
8. **~8:47 (A6)** pause avant "Reste l'échelon au-dessus". (Déjà dans manifest acte6 mais à re-vérifier post-retiming.)
9. **~9:50 (A6)** pause avant "Dans ces conditions" (après "...de l'autre main"). (Idem, re-vérifier.)
10. **~8:05 (A5)** RETIRER le mot "Résumons", garder "Un financement émirati, un relai libyen...". Re-couper audio A5 + garde-fou.

### 🌍 VISUEL
11. **~6:55 (début A6 / organisations internationales)** la carte du Soudan est VIDE → mettre 2 généraux + armées +
    territoires contrôlés (comme A4). Continuité. Recette = MilitaryToken/PortraitToken/TerritoryGlow de SoudanActe4B1toB4Globe.

### 📄 SOURCES (gros point transversal, le + de valeur)
12. Ajouter PLAQUES DE SOURCES (bas d'écran, ~2s + fade, SANS "Source:") partout où elles manquent, SURTOUT les 3-4 premiers
    actes (Aziz : "on a fait le fact-check, les sources existent, ça renforce ÉNORMÉMENT la crédibilité"). Sources par acte :
    fact-check jury (chercher `soudan-midform-*JURY*` + `soudan-midform-DONNEES.md`). Registre = `SourcePlaque` (Acte 3 insert).

## NOTES
- Points 5/8/9 = phrases coupées/pauses déjà connues ; 8/9 traités sur A6 (re-vérifier post-retiming), 5 = A3 pas encore fait.
- La v3 a été VALIDÉE globalement : ces 12 points = polish, PAS une refonte. Après = promotion FINAL + publication.
- État git : branche `feat/soudan-passe-finale-6lots` (commit v3 fait). Session CFA restaurée (stash pop).
EOF
echo "backlog passe finale gravé (12 points)"