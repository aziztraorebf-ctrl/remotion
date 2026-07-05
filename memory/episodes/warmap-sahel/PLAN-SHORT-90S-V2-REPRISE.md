# Plan de reprise — Short AES 90s, V2 (re-montage stylé, assets réutilisés)

**Contexte** : V1 (session 2026-07-05) a produit un Short fonctionnel (script + audio + timing validés)
mais avec un DÉFAUT MAJEUR : les beats 2/3/4/5+6 utilisent des composants Mapbox génériques
(`PulsingRegionFill`, `DominoContagionFill`, `FlagDissolveTransition`, `RedlineContagion` — dossier
`_shared/mapbox/`) au lieu du style parchemin/gravure de la vraie vidéo longue. Résultat : incohérence
visuelle flagrante (carte grise `dark-v11` brute, drapeau France/Russie hors-sujet, style qui saute d'un
plan à l'autre façon diaporama). Retour Aziz 2026-07-05 : **repartir en re-montage stylé, réutiliser
les VRAIS assets de la vidéo longue**, pas les composants génériques.

## Ce qui reste VALIDE de la V1 (ne pas refaire)

- **Script FR condensé + tags TTS** : `memory/episodes/warmap-sahel/SCRIPT-SHORT-90S-V1.txt` — validé,
  fact-checké, tags émotionnels corrigés (bug "trois nations" résolu).
- **Narration audio GéoAfrique** : `public/_shared/audio/sahel-warmap/short-90s-v1.mp3` (91.86s) — validé
  à l'oreille, alignment Whisper exact dans `src/projects/warmap/_shared/whisper-words-short-90s.ts`.
- **Beat 7 (naissance AES)** : `LiptakoRevealSVG9x16.tsx` — adaptation portrait du VRAI insert SVG de la
  vidéo longue, validée visuellement. À GARDER.
- **Beat 8 (ressources)** : `ResourcesRevealSVG9x16.tsx` — idem, adaptation du vrai insert. À GARDER.
- **Beat 10 (CTA)** : `CtaCard.tsx` — frame extraite du vrai rendu longue en fond, fonctionne bien
  visuellement. À GARDER (à re-choisir la frame si besoin d'un meilleur plan).
- **3 fixes de bugs Mapbox** (utiles pour tout le projet, pas juste ce Short) : `PulsingRegionFill.tsx`,
  `DominoContagionFill.tsx`, `FlagDissolveTransition.tsx` avaient tous le même bug (`continueRender`
  appelé avant `map.once("idle")`, donc capture Remotion headless avant que les tuiles Mapbox finissent
  de se peindre). Fixé et vérifié indépendamment (pas juste rapport d'agent). Ces fixes restent bons
  même si on n'utilise plus ces composants pour CE Short — ils resteront utiles pour d'autres projets
  du dossier `_shared/mapbox/`.

## Ce qui doit être REFAIT (beats 1, 2, 3, 4, 5+6, 9)

Approche : extraire de VRAIS clips/frames de `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`
(450.28s, 13508 frames, 30fps, 1920x1080) aux moments correspondants, recadrer/retravailler en 9:16.

### Repères de frames DÉJÀ confirmés (grep direct dans le code, fiables)

| Beat | Contenu narratif | Frame(s) source vidéo longue | Fichier source |
|---|---|---|---|
| 1 | Hook "3 pays" | `F_HOOK_MALI=145` → `F_HOOK_DRIFT=684` | `SahelTimings.tsx` |
| 3 | Libye 2012 s'effondre | `F_LIBYE_ARMES=2630` → `F_EXPANSION_END=4800` (large, à resserrer) | `SahelTimings.tsx` |
| 4 | France/ONU échouent, 10 ans plus tard | `F_SERVAL=3196`, `F_ECHEC=3887` (pivot clé), `F_VILLES=4384`, `F_CAMPAGNES=4421` | `Partie2Blocage.tsx` |
| 7 | Naissance AES | `F_BAMAKO`→`F_EPREUVE` (déjà utilisé via LiptakoRevealSVG) | `Partie3Rupture.tsx:40,43` |
| 8 | Ressources | `F_OR-20`→`F_CONFED-16` (déjà utilisé via ResourcesRevealSVG) | `Partie4Cout.tsx:56,61` |

### Repères à VÉRIFIER en début de prochaine session (pas confirmés cette session)

- **Beat 2** ("chassent partenaires, quittent CEDEAO") : pas de marqueur trouvé. Chercher dans
  `Partie2Blocage.tsx` autour de `F_CEDEAO=5639` ou dans `Partie3Rupture.tsx` (le récit CEDEAO menace
  intervention). Vérifier si un plan existe qui montre ce moment précis, ou s'il faut le construire
  différemment (peut-être fusionner avec beat 1 ou 3 plutôt que d'isoler).
- **Beat 5+6** (coups militaires 2023 + menace CEDEAO + twist) : chercher les frames des coups d'État
  (juillet 2023 Niger) — probablement dans `Partie2Blocage.tsx` après `F_CEDEAO=5639`, ou une scène
  dédiée non identifiée cette session. Les portraits dirigeants v4 (`leader-{mali,burkina,niger}-v4.png`)
  restent réutilisables tels quels (médaillons ronds propres, pas besoin de la vidéo longue pour ça).
- **Beat 9** (60 ans de statu quo, question ouverte) : pas de scène équivalente exacte dans la vidéo
  longue (c'est une conclusion propre au Short). Décider : nouvel insert SVG dans le style
  parchemin/gravure (cohérent avec Liptako/Ressources), PAS de recyclage vidéo pour ce beat précis.

## Méthode d'extraction proposée (à valider en session)

1. Pour chaque beat, `ffmpeg -ss <t_debut> -to <t_fin>` sur `warmap-sahel-aes-FINAL.mp4` pour extraire
   le clip brut 16:9.
2. Crop/recadrage en 9:16 : `ffmpeg -vf "crop=608:1080:...`" (centré sur l'élément narratif clé du plan
   — vérifier au cas par cas qu'aucun élément important ne sort du cadre, contrairement au risque déjà
   identifié en session précédente pour un simple crop horizontal).
3. Si le crop coupe des éléments importants (flèches, labels positionnés pour du 16:9) → ne PAS forcer
   le crop, plutôt : (a) régénérer un extrait dédié en re-render Remotion à la même frame mais en 9:16
   natif si la scène le permet (composition Mapbox déjà paramétrable), ou (b) construire un nouvel
   insert SVG dans le même langage visuel que Liptako/Ressources pour ce beat précis.
4. Overlay du texte/sous-titres synchronisé sur les timestamps Whisper déjà extraits (réutilisables
   tels quels, `whisper-words-short-90s.ts`).

## Nettoyage post-V1 (fait 2026-07-05)

`AesShort90s.tsx` (assemblage complet), `CoupsMenaceBeat.tsx` (beat 5+6) et `StatuQuoBeat.tsx` (beat 9)
ont été SUPPRIMÉS — bâtis sur les composants Mapbox génériques rejetés, aucune valeur à conserver. Le
rendu vidéo V1 (`out/_r-and-d/warmap-sahel-short/aes-short-90s-v1.mp4`) a aussi été supprimé. La V2 doit
recréer un fichier d'assemblage neuf (ex: `AesShort90s.tsx` à recréer) une fois le contenu des beats
1/2/3/4/5+6/9 basé sur les vrais extraits de la vidéo longue — le squelette `<Sequence>` calé sur les
timestamps réels (voir constantes `F_BEAT1`...`F_BEAT10` dans l'historique git si besoin de référence,
ou recalculer depuis `whisper-words-short-90s.ts`) est simple à reproduire, pas besoin de le préserver
tel quel vu qu'il contenait les mauvaises références de composants.

## Fichiers de cette session à connaître

- Dossier des composants du Short (ne contient plus que ce qui est VALIDE) :
  `src/projects/warmap/shorts/aes-short-90s/` — `LiptakoRevealSVG9x16.tsx`, `ResourcesRevealSVG9x16.tsx`,
  `CtaCard.tsx`.
- Rendu V1 : SUPPRIMÉ. Ne pas chercher à le récupérer comme référence — c'est le repoussoir, pas un modèle.
