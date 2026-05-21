---
name: Learnings storyboard Zimbabwe — erreurs évitées et workflow final
description: Ce qui n'a pas marché et pourquoi, validé session 2026-05-12. Référence pour éviter de répéter les mêmes détours sur les prochains épisodes.
type: feedback
---

## Règle : Claude écrit les prompts Flash, pas Flash qui invente

**Why:** Quand on dit "sois créatif" à Flash sans ancrage dans notre stack, il génère du After Effects (effets 3D, particules, compositions à 10 éléments). Flash ne "voit" pas nos composants Remotion.

**How to apply:** Claude définit la composition en texte (registre, mécanique, éléments max 4, tension narrative) AVANT de passer à Flash. Flash exécute, il n'invente pas.

---

## Règle : Gemini 3.1 Pro HTML/SVG = mauvaise étape intermédiaire

**Why:** On a essayé de faire générer un storyboard HTML/SVG à 3.1 Pro avant la passe image. Le résultat structurel est correct mais visuellement plat — ça ne donne pas d'information sur le rendu final et ne remplace pas le PNG Flash.

**How to apply:** Sauter cette étape. Aller directement Flash → i2i → 3.1 Pro multimodal avec PNG.

---

## Règle : 3.1 Pro en mode texte seul = pas de valeur pour le storyboard

**Why:** La vraie valeur de 3.1 Pro c'est le multimodal — image en entrée → JSON technique en sortie. En mode texte seul, il produit des descriptions génériques sans coordonnées ni hex codes précis.

**How to apply:** Toujours envoyer le PNG storyboard à 3.1 Pro. Jamais le lancer en texte seul pour le breakdown.

---

## Règle : une seule ref i2i par beat (jamais les deux simultanément)

**Why:** Envoyer les deux refs (Mapbox + Graphisme) en même temps fait moyenner les deux styles à Flash. On perd la spécificité de chaque registre.

**How to apply:** Ref Mapbox (Or Africain) pour beats carte. Ref Graphisme (Niger) pour beats data-viz/texte. Une seule par call.

---

## Erreur : "améliore de manière significative" comme directive i2i

**Why:** Cette directive pousse Flash à sur-enrichir même les beats qui n'en ont pas besoin. Beat 4 (typographie pure) avait été sur-chargé avec des éléments non demandés.

**How to apply:** Directive précise : "garde la composition exacte, enrichis la qualité visuelle". Lister explicitement ce qui doit changer et ce qui doit rester.

---

## Découverte : Beat 4 filigrane monde inattendu mais intéressant

**What:** Lors de la passe i2i V6, Flash a ajouté une carte monde en filigrane doré derrière "MAIS À QUEL PRIX ?" — non demandé, mais narrativement fort (la question flotte sur le monde entier).

**How to apply:** À noter comme pattern possible pour les beats typographiques : fond near-black + carte monde filigrane 10-15% opacity. Propose-le explicitement sur les prochains beats de suspension.
