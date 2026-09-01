**Origine** : Aziz montre le TED-Ed "Mansa Musa" (2015, 8.8M vues, ~1M vues/an) — style whiteboard-doodle
(trait feutre irregulier, remplissages bavants volontaires, silhouettes tres simples pour les personnages
secondaires/foules, un peu plus de detail pour le personnage principal). Rapproche du funambule CFA
(stick figure minimal) et des cartes D3 qu'on maitrise deja (territoire teinte + fleuve + villes en icones,
cf frame Mali Empire de la video). Verdict sur le fond (avant le test de rendu) : aucune brique manquante
cote CAPACITE (personnages minimaux, cartes, foules repetees en ligne = tout deja prouve chez nous a un
niveau egal ou superieur) — le seul ecart reel est PUREMENT ESTHETIQUE (texture du trait), jamais tente.

**Test realise** : 3 variantes de filtre SVG applique a notre stick figure existant (meme geometrie que
StickRig) + 1 variante sur une carte territoire+fleuve (cas d'usage Souverain reel) :
1. `feTurbulence` + `feDisplacementMap` scale=4 seul : effet trop subtil, quasi invisible.
2. **Double-trace decalee** (2 copies du meme path, chacune avec un filtre `feTurbulence` a seed
   different, opacites 0.75/0.55 superposees) : **resultat net et convaincant**, reproduit bien l'effet
   "repasse au feutre 2 fois" visible dans la vraie reference (contour jamais une ligne unique parfaite).
3. Meme filtre applique a un territoire+fleuve+label (cas d'usage carte Souverain) : fonctionne aussi bien
   que sur le personnage, aucun probleme de compatibilite avec le registre carte.

Fichiers test (scratch session, non conserves dans le repo) : `test-feutre.html` + `feutre-test.png`
(rendu via Chrome headless `--screenshot`), a regenerer si repris.

**Conclusion operationnelle** :
- Techniquement TRIVIAL et GRATUIT : primitives SVG natives (`feTurbulence`/`feDisplacementMap`), zero
  appel API, s'applique en `<filter>` sur n'importe quel path/groupe EXISTANT (StickRig, cartes D3, tout
  le stock actuel) sans retoucher la geometrie — un changement de RENDU, pas de structure.
- ⚠️ **Point de vigilance non teste** : `feDisplacementMap` avec un `seed` fixe est stable sur une image
  FIXE, mais si la geometrie sous-jacente BOUGE frame par frame (StickRig qui marche), le displacement
  recalcule sur une forme changeante a chaque frame — risque d'effet de "grouillement" du trait plutot
  qu'un trait vivant naturel. A verifier EN MOUVEMENT (render video, pas juste un still) avant d'adopter
  en production, cf [[feedback_demo-virale-verifier-substrat-avant-de-conclure]] et la regle generale de
  ne jamais juger une intention d'animation sur une image fixe.
- **Statut** : piste ESTHETIQUE disponible, PAS retenue pour Gazoduc (script deja verrouille sur le
  registre encre/D3 propre existant, cf [[STATUS gazoduc]] — changer de style maintenant serait un
  chantier non demande). A ressortir si un futur episode/segment demande explicitement un registre
  "whiteboard vivant" different de notre encre actuelle.

Voir aussi [[PERSONNAGE-VIVANT-INDEX]] et [[main-articulee-doigts-gemini-echec-visuel]] (meme session
2026-08-02, meme demarche : observer une reference TED-Ed reelle avant de conclure sur notre niveau).
