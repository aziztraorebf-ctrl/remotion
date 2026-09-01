# Production SVG générative = 2 appels modèle MAX, fusion mix-and-match faite par Claude

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Pipeline SVG génératif (scène statique avant animation) = **2 appels modèle maximum**, dans cet ordre strict :

1. **Appel 1 — génération** : N modèles en parallèle sur le MÊME brief (GPT-5.6 Sol + Kimi K3 + Fable). On compare les rendus.
2. **FUSION mix-and-match — par CLAUDE, jamais par un modèle.** Claude a tous les codes sources sous la main : la fusion est un travail d'**édition précise**, pas de création. Composer le SVG final élément par élément (prendre le sac de X, l'étiquette de Y, le médaillon de Z), en adaptant les coordonnées.
3. **Appel 2 — enrichissement Fable** : on lui envoie le CODE du mix + l'IMAGE RENDUE (chemins de fichiers, il lit les deux), avec critères stricts + liberté créative encadrée (il doit justifier chaque ajout/modif/retrait en une phrase).
4. **Vérification conjointe Aziz + Claude** sur le rendu ET le code : erreurs de rendu, superpositions, fautes d'orthographe, éléments à corriger/supprimer.
5. **PUIS animation.**

**Why (Aziz, 2026-07-24, beats CFA 5a/5b)** : j'avais proposé 4 appels Fable successifs (génération → fusion → enrichissement → polish). Aziz a coupé : « ça devient beaucoup trop d'appels inutiles qui pourraient dénaturer le SVG à la longue ». Et surtout : **« pourquoi demander à Fable de faire la fusion si toi tu peux le faire et en plus tu as accès à tous les codes sources ? »** — juste. Chaque passage d'un SVG déjà bon dans un LLM est une occasion de dérive ; un appel qui n'apporte pas de création nette est un appel à supprimer.

**How to apply** : avant tout appel modèle sur un SVG existant, se demander « est-ce de la CRÉATION (→ appel justifié) ou de l'ÉDITION/ASSEMBLAGE (→ je le fais moi-même) ? ». La fusion, le repositionnement, la correction de collision, le changement de couleur, le renommage de groupes = TOUJOURS Claude. Seul l'enrichissement créatif (ajouter de la matière/profondeur inventée) justifie un appel.

⚠️ Distinct de la règle « LLM = signal jamais juge » (review) : ici on est en PRODUCTION, l'itération est gratuite avec Fable (agent Claude Code, inclus abonnement Max) — mais gratuite ≠ sans risque, le risque est la dénaturation progressive.

Lié : [[svg-scenes-generatives-regle-n0]] (le modèle dessine le statique, NOUS animons) · doctrine `memory/doctrines/SVG-SCENES-GENERATIVES.md` · `memory/doctrines/DA-BRIEF-GATE.md` § variante SVG/DA créative (trio GPT+Kimi+Fable).

**Extension confirmée (2026-08-04, Gazoduc Acte 2)** : la fusion mix-and-match fonctionne aussi entre
candidats de MODÈLES DIFFÉRENTS (pas seulement entre variantes d'un même appel) — condition de
compatibilité à vérifier avant de fusionner : mêmes `viewBox` des deux côtés (ici 1920x1080), et
structure `<use>`+`transform` propre des deux côtés si on remplace des éléments répétés (ex: 15
fauteuils GPT-5.6 remplacés par des bannières empruntées à Fable). Fait 2× avec succès ce chantier
(scène signature : arche GPT-5.6 + bannières Fable ; scène financement : document/plume/goutte Gemini
+ tuyau/gouffre GPT-5.6).

**Corollaire méthode** : sur un mix déjà tranché, Aziz revient facilement dessus s'il n'est pas sûr et
préfère reregarder les candidats bruts plutôt que se fier à un mix déjà fait ("on ne devrait pas faire
fausse route, peux-tu me redonner le lien") — TOUJOURS garder les liens here.now/candidats accessibles
et retrouvables pendant toute la durée d'un chantier SVG génératif, pour permettre un retour en arrière
sans re-générer.
