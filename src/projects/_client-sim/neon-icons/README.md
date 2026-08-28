# Pictogrammes NEON au trait — banc d'essai (2026-08-28)

Origine : annonce Upwork « 25-30 vectors, meme style, fond transparent, trait BLANC,
halo obligatoire » (refs client = 2 JPEG generes par Gemini : pouce leve + main qui salue).
⛔ NON candidate. Test de capacite uniquement.

## Ce qui est PROUVE
- Les calques sortent **nommes par ce qu'ils representent** (`upper-fold`, `magnified-eye`,
  `folded-fingers`) → animables un par un. Contraste avec un export Recraft brut = 509 calques
  `path-248` illisibles.
- Le **style tient sur la serie** (meme trait, meme arrondi, meme densite) = le critere n°1
  du client (« consistency of style matters most »).
- Le halo n'est **pas dans le SVG** : tracé nu ici, halo recree par les 4 passes de
  `svg-library/techniques/neon-glow-reflet-trace.md` (le coeur blanc a x0.34 fait « tube allume »).

## Etat des 4 pieces
| Fichier | Origine | Etat |
|---|---|---|
| `thumbs-up.svg` | genere DEPUIS la ref client (mimetisme) | ✅ raccord main/poignet corrige a la main |
| `face-angry.svg` | genere **SANS aucune reference** | ✅ propre du 1er coup |
| `point-right.svg` | recompose a la main | ✅ lisible |
| `face-magnifier-KO.svg` | 2 tentatives | ❌ **ECHEC** — 2 cercles de taille voisine qui se croisent n'ont aucun indice de profondeur. A refaire par MASQUE (decouper le visage sous la lentille), pas par deplacement. |

## La lecon
Les formes **simples et symetriques** passent ; les **compositions a plusieurs objets en relation
spatiale** echouent — au modele comme a la main. Conforme a
`SVG-SCENES-GENERATIVES.md` § « le SVG generatif est fait pour l'ABSTRAIT, pas l'ORGANIQUE ».
⭐ Et : **avec image de reference tout le monde execute, sans image personne ne trouve la forme.**

## RESTE A FAIRE
⛔ **Animer + passer en Lottie n'a PAS ete fait.** On a prouve que c'est *animable*, pas que ca
survit au transport. C'est le test qui boucle la chaine (generation → animation → format client)
et le 1er pave des **10 animations** requises par LottieFiles Hire.

Prompt de style reutilisable : `BRIEF-STYLE.md`. Rendu : `_planche.jpg`.
