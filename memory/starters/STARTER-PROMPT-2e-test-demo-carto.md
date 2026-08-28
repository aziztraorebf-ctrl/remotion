# STARTER — 2e test du workflow DÉMO CLIENT (cartographique)

> Extrait de `memory/NEXT-ACTION.md` au wrap du **2026-08-28**. Il n'existait QUE là-bas : une purge
> du fichier de priorités aurait détruit un contenu unique (6 rappels payés, aucun dupliqué ailleurs).
> ⛔ Statut : **en attente**, non urgent. Le workflow n'a été validé que sur UN brief (Zambie) —
> doctrine maison : *une abstraction écrite sur un seul cas est un pari, pas une brique*.

## 🔧 BACKLOG — 2e test du workflow démo client (carto), starter prêt (2026-08-22, en attente)

> **Pourquoi une 2e fois avant de graver** : le workflow a été validé sur UN seul brief (Zambie).
> Doctrine maison : *une abstraction écrite sur un seul cas est un pari, pas une brique*.
> On ne sait pas si `carto-selfreview` tient sur une carte CLAIRE, un globe D3 ou un format vertical.

### ▶️ STARTER PROMPT — copier-coller tel quel en début de session

```
Session : 2e test du workflow DÉMO CLIENT cartographique.
Objectif : rejouer la chaîne complète sur un brief NEUF, sans rien réinventer, pour savoir
si le workflow tient sans explication. Si oui → on le grave. Sinon → on note ce qui casse.

1. Lire out/_r-and-d/zambia-peacecorps/MANIFESTE.md (le cas de référence, 2 concepts validés)
   et memory/feedbacks/feedback_comparatif-storyboard-mesurer-pas-demander.md (les pièges payés).
2. Choisir un brief cartographique neuf — idéalement une VRAIE offre client, sinon un sujet
   de la chaîne. Contrainte : 5-10 s max, 2 traitements.
3. Dérouler SANS RACCOURCI :
   brief lavé → audit du brief par un modèle tiers → 3 storyboards (gemini,gpt,grok)
   → arbitrage Aziz → breakdown par le modèle QUI A DESSINÉ → code
   → `carto-selfreview.py` (bloquant, AVANT de présenter) → comparatif planche PLEINE TAILLE
   → corriger par la MESURE.
4. Noter tout ce qui a dû être expliqué/adapté : c'est ce qui manque au workflow.

⛔ Rappels non négociables (chacun a coûté cette session) :
 - Ne PAS coder avant storyboard, même pour « aller vite ».
 - Ne PAS comparer sur des vignettes (2 modèles ont halluciné « 15-20 % du cadre » vs 61 % réel).
 - VÉRIFIER chaque point d'un modèle avant de l'appliquer (2 des 7 étaient nuisibles).
 - Mapbox : déclarer `projection: {name:"mercator"}` sous zoom 5, sinon globe silencieux.
 - Mapbox : appeler `applyGeoAfriqueV5()`, sinon fond noir.
 - Créer un .tsx en Bash déclenche les gates depuis le 2026-08-22 : déclarer `// MOTEUR:`.
```

### Ce qui reste ouvert sur la Zambie (non bloquant)
- **Concept A n'a ni tilt ni relief** (D3 n'en a pas nativement). Les ajouter le rapprocherait de B
  et affaiblirait le contraste du gabarit → décision de goût, à trancher avec Aziz.
- **Filigrane discret** validé par Aziz, jamais posé.
- **Tester GPT-5.5 en relecteur systématique** : sur ce cas il a battu les auteurs des planches
  (seul à voir un manque narratif, seul à donner des px). ⚠️ pas de vidéo en entrée — frames only.
