# SVG DESSINATEUR — mémoire persistante

> Index de ce qui est acquis. Mis à jour en FIN de chaque mission (obligatoire).
> Détail des méthodes : `TECHNIQUES.md` · ⛔ ce qui ne marche pas : `ECHECS.md`.
> ⛔ Journal compacté à 1 ligne/entrée (limite 200 lignes) — le détail vit dans TECHNIQUES.md/ECHECS.md, cherchés par date/mot-clé.

## Ce que je sais faire (prouvé au rendu)

| Registre | Preuve | Fichier |
|---|---|---|
| Objets d'interface (médaille, bouton, carte cadeau, billets, coche) | 6 éléments, 23 groupes nommés, 11 dégradés, validés vs réf pro | `src/projects/_client-sim/repro-redeem/assets/planche-ui.svg` |
| Main-curseur AVEC référence (3 poses) | Contour continu, pouce intégré, 0 id dupliqué | `out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg` |
| Anatomie humaine SANS référence | ⛔ 5/5 modèles échouent — jamais tenter sans image-ref | voir ECHECS.md |
| Ligne-art géométrique sombre / réseau de points | Réussi du 1er coup | `out/_r-and-d/upwork-earthtosuzy/svg-signal-orbit/` |
| Aplats purs (0 dégradé, 0 ombre) | Confirmé par coupe de pixels, 2 pièces | balançoire + coquille cauri |
| Décor de fond en boucle horizontale | Harmoniques entières = raccord garanti | `out/_r-and-d/cauri/fond-decor/` |

## Corpus de référence disponibles (⭐ les OUVRIR avant de dessiner dans ces registres)

- Interface / app mobile : 22 animations démontées et mesurées → `out/_r-and-d/corpus-kamotion/` · `memory/client-sim-tests/corpus-kamotion/CORPUS-REFERENCE-UI.md`
- Mains / gestes de tap : 17 pièces de banque → `out/_r-and-d/banque-mains/` · ⛔ lire ECHECS.md § anatomie AVANT.

## ⭐⭐ PERSONNAGE VECTORIEL ARTICULE · REPRENDRE EN V4
- Starter : `memory/starters/STARTER-PERSO-VECTORIEL-V4.md` — EN PREMIER. Détail : `PERSO-VECTORIEL.md` (ici).
- ⛔ V3 pas strictement > V2 (verdict Aziz), cause racine : zéro référence humaine DE FACE.
- Fichiers : `src/projects/_client-sim/perso-corps-entier/assets/` + gate `tools/test-rotation.py`.

## Journal (1 ligne/entrée, détail → TECHNIQUES.md/ECHECS.md à la date indiquée)

- **2026-08-30** Planche onboarding "Loop" (UI SaaS) — 207 ids uniques, 175 formes, transform de placement doit vivre sur le `<g>` racine (extraction `extraire-groupes.py`). `repro-onboarding/assets/planche-onboarding.svg`.
- **2026-08-31** Châssis métal chill-meter — réussi matière metal SANS perdre l'icy blue là où 5 modèles externes échouent. TECHNIQUES.md § METAL EN SVG.
- **2026-08-31** Spark starburst (Upwork) — rig longueur = `scaleY` sur `<g>` enfant, rotate sur le parent ; prouver le RIG pas juste le statique. TECHNIQUES.md § STARBURST.
- **2026-09-01** Test style TED-Ed, Fable vs Opus SANS image-ref — réseau de points (Poisson-disc + union-find) et silhouette pleine sur aplat (pictogramme) passent sans réf ; anatomie réaliste non. `out/_r-and-d/fable-vs-opus-ted-ed-style/`.
- **2026-09-02** Balançoire TED-Ed AVEC réf — axe de rotation = un seul point pivot, aplats purs confirmés par coupe de pixels (piège : j'avais empilé des ombres par réflexe). TECHNIQUES.md § BALANCOIRE.
- **2026-09-02** Patine retenue + rouille chill-meter (2 passes) — modifs EN PLACE sur TSX existant, geometrie/ids intouchés. TECHNIQUES.md § PATINE RETENUE / ROUILLE.
- **2026-09-03** Bascule gunmetal chill-meter — bascule de teinte ciblée par famille HSV, pas un remplacement de couleur brut. TECHNIQUES.md § BASCULE DE TEINTE CIBLEE.
- **2026-09-04** Coquille de cauri AVEC réf photo — livrable à niveau de détail variable (`fente` détachable sous seuil 18px mesuré), la photo a corrigé un brief faux (ratio h/w inversé). `out/_r-and-d/cauri/coquille/coquille.svg`. TECHNIQUES.md § DETAIL DETACHABLE.
- **2026-09-05** Anatomie humaine avec référence — question ouverte tranchée (voir TECHNIQUES.md § 2026-09-05) ; recalage palette sur photo par HSV.
- **2026-09-06** SIGNAL ORBIT, 5 états d'une même anim — UN générateur pour N états (géométrie partagée = morphable) ; glyphes = un path par LETTRE jamais par mot. TECHNIQUES.md § N ETATS / GLYPHES.
- **2026-09-08** Décor de fond océanique "Le cauri" (4e piste, dessin statique, défilement en boucle) — boucle horizontale garantie par harmoniques entières (période = largeur exacte), masses organiques (`blob_svg`) au lieu d'ellipses régulières (évite l'effet "pois"). `out/_r-and-d/cauri/fond-decor/`. TECHNIQUES.md § BOUCLE HORIZONTALE PAR HARMONIQUES ENTIÈRES.

## Chiffres de référence du métier (mesurés sur du travail vendu)

- ~10 formes par objet (227 chemins / 168 remplissages) — c'est de là que vient le relief.
- 86 % de calques nommés chez le studio de référence. Nous visons 100 %.
- Durée médiane d'une pièce : 3,9 s · format carré · 60 fps · 17 Ko.
- 0 texte natif sur 848 calques : le métier livre du texte vectorisé.
