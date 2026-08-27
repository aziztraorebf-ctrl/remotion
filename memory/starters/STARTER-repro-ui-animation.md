# STARTER — REPRO-UI : refaire 3 pièces d'animation d'interface RÉELLES

> Créé le **2026-08-27** en clôture de la session « marché animation ».
> ⭐ **Copier-coller le bloc PROMPT ci-dessous en début de session.**
> Décision d'Aziz : *vérifier AVANT de vendre* — « il ne sert à rien de se lancer si on n'est pas sûr
> d'être fort dès le premier livrable ».

---

## ▶️ PROMPT DE DÉMARRAGE (copier tel quel)

```
Session : REPRO-UI — refaire 3 pièces d'animation d'INTERFACE réellement vendues,
pour mesurer ce qui BLOQUE chez nous avant d'écrire une offre.

Méthode = celle de REPRO-FOSTER, appliquée cette fois à l'animation d'UI produit.
⛔ On ne choisit NI le sujet NI le niveau d'ambition : c'est le seul test qui peut dire NON.

1. Lire d'abord, dans cet ordre :
   - memory/projects/RECHERCHE-MARCHE-INDEX.md  (porte d'entrée, 8 verdicts + ce qu'on NE sait pas)
   - memory/projects/REPRO-FOSTER.md            (la méthode + les 4 façons de rater une mesure)
   - memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md  (ce que la chaîne sait convertir)

2. Choisir 3 pièces RÉELLES (pas des exercices confortables), couvrant le HAUT du U :
   a. une animation d'INTERFACE produit (dashboard / écran d'app qui se compose)
   b. une séquence de DONNÉES (chiffres qui montent, graphique qui se remplit)
   c. un plan de TYPOGRAPHIE CINÉTIQUE (c'est ce qui porte le récit dans la vidéo vendue)
   Sources possibles : la vidéo Foster déjà sur disque · gigs Fiverr `ui-animation` ·
   portfolios de studios (Vidico, Ordinary Folk). ⚠️ 15-90 s par pièce, pas 5 minutes.

3. Pour CHAQUE pièce, produire et NOTER :
   - le temps réel passé
   - ce qui a coincé (geste manquant, brique absente, réglage inexistant)
   - ce qu'il a fallu contourner et à quel coût
   ⭐ LE LIVRABLE DE LA SESSION EST CETTE LISTE, pas les 3 vidéos.
   Un plan raté proprement documenté vaut plus que 3 plans réussis.

4. ⛔ Question à poser sur chaque plan : « est-ce que quelqu'un COMMANDERAIT ça ? »
   PAS « est-ce que c'est joli ? » (cf. feedback_prouver-une-capacite-nest-pas-produire-un-livrable)

⛔ Rappels non négociables :
 - Déclarer `// MOTEUR: <registre>` dans tout nouveau .tsx (gate actif).
 - Netteté : juger UNIQUEMENT sur un render scale=1. Un scale=0.4 est flou et fait douter à tort.
 - Mesurer un mouvement composante par composante ; un commentaire qui JUSTIFIE une valeur
   jamais mesurée est un signal d'alarme.
 - Calques NOMMÉS systématiquement : c'est la clause contractuelle « source or equivalent ».
```

---

## POURQUOI cette session, et pas une autre

Le marché a été mesuré les 26-27 août (~10 agents). **Ce qui manque n'est plus de la connaissance
marché, c'est de savoir ce qui BLOQUE chez nous.** Écrire l'offre avant, c'est promettre à l'aveugle.

**Ce que la recherche a déjà tranché** (détail : `RECHERCHE-MARCHE-INDEX.md`) :
- Le marché est un **U** : le haut se vend SANS personnages ni voix off — UI, typo, données.
- La stack couvre **~85 % du marché SaaS**. Nos faiblesses = ce que ce marché n'achète pas.
- Ce qui manque : **le SCRIPT** (qu'on a en doctrine mais qu'on offre au lieu de le facturer)
  et **le SOUND DESIGN** (pas une capacité de code).
- ⛔ « Remotion » n'a **aucune demande** : le code est un avantage de coût, jamais un argument de vente.

## LA SESSION D'APRÈS (ne pas la faire avant)

Écrire l'offre **sur du réel** : titre (`UI animation` / `motion design` / `B2B` — ⛔ jamais
`explainer video`), prix calés sur les temps mesurés en session 1, vignette = l'animation DANS une
interface. ⭐ Les 3 pièces SONT le portfolio — et sur Upwork la sélection se fait sur portfolio,
pas sur compteur d'avis.

## ⛔ CE QU'ON NE FAIT PAS MAINTENANT

- **Sound design** : vrai trou, mais pas une capacité de code → session dédiée, voire partenaire.
- **After Effects** : pas installé, aucun client ne l'a exigé, et ce n'est PAS un mur (mesuré).
  À rouvrir le jour où un client précis le demande.
- **Rive** : une case de format à 9 $/mois, pas un pilier. Rien ne presse.

## 🎣 À GLISSER SANS EN FAIRE UNE SESSION

L'hypothèse CENTRALE non validée : **un acheteur paie-t-il pour le déterminisme ?**
Ça ne se teste pas par la recherche, ça se pose à des acheteurs réels. Chaque candidature Upwork est
une occasion gratuite : *« si vous avez besoin d'ajuster ou de décliner plus tard, c'est un paramètre
chez moi »*. S'ils réagissent, on le saura. S'ils n'en parlent jamais, on le saura aussi.

## FILS PARALLÈLES (n'entrent pas en concurrence)

- **AbiGirl / chill-meter** : elle décide (« reviewing everything carefully »). Rien en suspens de
  notre côté. Si contrat → **le SON en premier**, seul point promis jamais démontré.
  Relance légitime après 3-4 jours ouvrés sans nouvelle. → `memory/client-sim-tests/upwork-chill-meter/STATUS.md`
- **GAZODUC Acte 3** : priorité 1 de PRODUCTION, gel levé. Beats 1-2 V3 attendent la validation d'Aziz.
  N'avance pas tout seul. → `memory/episodes/souverain/gazoduc-aagp-tsgp/STATUS.md`

## 🧹 DETTE À SOLDER (pas en fin de session)

1. **Index mémoire à 20,2 Ko** sur un plafond DUR de 24,4 → compacter. Demande d'arbitrer quoi
   supprimer, donc à faire en DÉBUT de session avec du contexte disponible.
2. **Collision mémoire** : `feedback_worktree-git-isolation-gotchas.md` existe en 2 versions
   divergentes (20 Ko repo / 2,7 Ko auto). ⛔ Ne PAS trancher sur la taille — diffuser, rapatrier,
   laisser un stub.
3. **`freelance-dataviz-fiverr-pro.md` contredit partiellement** les conclusions du 08-27 (il a été
   écrit pour un marché de cartes animées). À réconcilier en connaissance de cause.
4. `PILIERS-B2B.md` pointe 2× `freelance-dataviz-fiverr-pro.md` avec un **chemin MORT** (le fichier
   vit dans `.claude/projects/.../memory/projects/`, pas dans le repo).
5. ⛔ **3 dettes documentées jamais exécutées** (trouvées au wrap du 08-27) :
   - ⚠️ **SÉCURITÉ** : `scripts/tools/svg2lottie.py` parse le SVG **en regex, sans parseur XML**.
     `memory/tools/lottie-claude-inventaire.md:123` dit de **ne PAS l'exposer à un SVG client non
     fiable** sans durcissement XXE. **Deviendra bloquant le jour où un client envoie ses SVG.**
   - `memory/tools/openrouter-svg.md:207` : `max_output_tokens=32000` jamais remonté dans
     `scripts/tools/gemini-vision-breakdown.py:56` (un brief vision multi-formes se fait tronquer).
   - `memory/tools/lottie-claude-inventaire.md:116` : « source .aep À TESTER » — **bloqué sur un
     prérequis matériel** (AE non installé), à déclarer comme tel plutôt que comme action en attente.
6. **`FICHE-MOCKUP-3D`** (202 lignes) a hérité en silence du statut d'exception lors de sa scission
   d'UI-PRODUIT le 08-26 → **arbitrage d'Aziz** : l'inscrire au README des fiches, ou tailler son
   doublon de fin (le § « une affirmation de capacité se vérifie » répète le § SVG/3D d'ouverture).
