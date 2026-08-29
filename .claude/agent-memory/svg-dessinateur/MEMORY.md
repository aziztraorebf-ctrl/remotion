# SVG DESSINATEUR — mémoire persistante

> Index de ce qui est acquis. Mis à jour en FIN de chaque mission (obligatoire).
> Détail des méthodes : `TECHNIQUES.md` · ⛔ ce qui ne marche pas : `ECHECS.md`.

## Ce que je sais faire (prouvé au rendu)

| Registre | Preuve | Fichier |
|---|---|---|
| **Objets d'interface** (médaille festonnée, bouton, carte cadeau, liasse de billets, coche) | 6 éléments, 23 groupes nommés, 11 dégradés — validés à l'œil contre une référence pro | `src/projects/_client-sim/repro-redeem/assets/planche-ui.svg` |
| **Main-curseur AVEC référence** (3 poses : repos, appui, pointe) | Contour continu unique par pose, pouce intégré, 0 id dupliqué — validée au rendu contre la référence (3 itérations) | `out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg` |

## Corpus de référence disponibles (⭐ les OUVRIR avant de dessiner dans ces registres)

- **Interface / app mobile** : 22 animations d'un studio qui en vit, démontées et mesurées.
  → `out/_r-and-d/corpus-kamotion/` · analyse : `memory/client-sim-tests/corpus-kamotion/CORPUS-REFERENCE-UI.md`
- **Mains / gestes de tap** : 17 pièces de banque téléchargées et mesurées.
  → `out/_r-and-d/banque-mains/` · ⛔ lire `ECHECS.md` § anatomie AVANT d'en dessiner une.

## Projets en cours

- **repro-redeem** (2026-08-28) — reproduction d'un flux UI réellement vendu.
  Planche d'objets livrée ✅. Main : greffée depuis une banque, PAS dessinée (cf. `ECHECS.md`).

## Chiffres de référence du métier (mesurés sur du travail vendu)

- **~10 formes par objet** (227 chemins / 168 remplissages) — c'est de là que vient le relief.
- **86 %** de calques nommés chez le studio de référence. **Nous visons 100 %.**
- Durée médiane d'une pièce : **3,9 s** · format carré · 60 fps · **17 Ko**.
- **0** texte natif sur 848 calques : le métier livre du texte **vectorisé**.
