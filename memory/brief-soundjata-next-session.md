# Brief prochaine session — Soundjata Short : inventaire + manifest + assemblage

> Cree 2026-04-16 nuit (fin de session Trou A + B + C).
> A ouvrir en debut de prochaine session Soundjata. REMPLACE brief-soundjata-remaining-gaps.md.

---

## PRIORITE ABSOLUE : Inventaire et manifest definitif

### Probleme identifie
Le projet a grandi sur 6+ sessions. Les clips sont eparpilles dans plusieurs dossiers avec des versions multiples (v1/v2/v3). Il n'y a pas de source de verite unique qui dit "pour l'Acte X, utilise CE fichier". Aziz a detecte que la composition d'assemblage utilisait le mauvais clip pour l'Acte I (ancienne version au lieu de la version validee avec Soumaoro oeil/silhouette).

### Plan prochaine session

**Etape 1 — Inventaire complet** (~15 min) :
- Scanner TOUS les dossiers : `clips-validated/`, `clips-pending/`, `actes/`, `out/`, `Downloads/`
- Extraire la premiere frame de chaque clip
- Presenter a Aziz Acte par Acte : "c'est le bon ?" / "c'est pas le bon ?"

**Etape 2 — Manifest definitif** (~10 min) :
- Creer un fichier `src/projects/geoafrique-shorts/manifests/soundjata-asset-manifest.md`
- Pour CHAQUE Acte : chemin exact du fichier valide, duree, type (Seedance/Remotion), audio strategy
- Ce fichier devient la SOURCE DE VERITE — toute composition Remotion le consulte

**Etape 3 — Reassemblage** (~30 min) :
- Repartir de zero sur la composition avec les bons fichiers
- Render complet pour validation Aziz

### Rappel : clips valides connus (a confirmer avec Aziz)

| Acte | Clip probable | A CONFIRMER |
|------|--------------|-------------|
| I | `acte1-v2-mixed.mp4` (avec Soumaoro oeil/silhouette, keep-and-duck) ? OU `acte1-setup-v1.mp4` ? | Aziz doit confirmer |
| II setup | `acte2-setup-humiliation.mp4` = `provocation.mp4` (Dreamina web, valide ce soir) | OK |
| II insulte | `acte2-insulte.mp4` | A confirmer |
| III | `acte3-iron-bar-v1.mp4` (split en 2 morceaux) | A confirmer |
| IV clip 1 | `acte4-clip1-exil-mema-messagers-v3-final.mp4` | OK |
| IV clip 2 | `acte4-clip2-lion-revient-v1.mp4` | OK |
| V | `actes/acte-v-final.mp4` (render Remotion) | A confirmer |
| VI | `SoundjataCharte.tsx` (composition Remotion) | OK |
| VII | `out/acteVII-final/acte7-full-v1.mp4` ou `SoundjataActeVII.tsx` | A confirmer |
| VIII | A generer (Remotion pur split vertical) | Non fait |

### Images Ken Burns generees ce soir (validees)
- Trou B : `refs/acte2/trou-b-v2.png` (Soundjata au sol poings serres)
- Trou C : `refs/acte2/trou-c-v1.png` (pieds plantes + barre tordue)
- Compositions Remotion : `SoundjataTransitions.tsx` (SoundjataReaction + SoundjataNePlus)

### Ce qui a ete fait cette session (2026-04-16 nuit)
1. Trou A comble : 2 images Gemini (start/end frame) + clip Seedance Dreamina web `provocation.mp4` -> `acte2-setup-humiliation.mp4` VALIDE
2. Trou B : image `trou-b-v2.png` VALIDEE, composition Ken Burns creee
3. Trou C : image `trou-c-v1.png` VALIDEE, composition Ken Burns creee
4. Assemblage Actes I-III tente mais ECHEC — mauvais clips utilises, besoin inventaire
5. Memoire visual-producer mise a jour (gotcha coherence start/end frame)
6. Cout session : ~$0.48 Gemini (6 images) + $3.00 fal.ai (clip rejete) + $0 Dreamina credits

### Lecons de cette session
- Pipeline agents fonctionne pour la generation d'images et clips
- Le visual-producer a besoin de corrections mais s'ameliore
- Le vrai probleme n'est pas la generation — c'est l'organisation des assets
- "Slow" dans les prompts Seedance invite au statique — utiliser des verbes actifs
- Start/end frame : generer le END d'abord, puis utiliser comme ref pour le START
- Coherence continuite : verifier les clips adjacents avant de generer (villageoises oui/non)

---

## Apres l'inventaire, il reste

- Trou D / Acte VIII (6.40s) : Remotion pur split vertical signature serie (~$0.20)
- Composition finale `SoundjataShort.tsx` assemblant les 8 Actes
- Render full + upload Vercel pour validation
