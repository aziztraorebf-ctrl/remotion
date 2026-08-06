# NorthShield — brief client (test client-sim #2, à démarrer)

> Nom de code interne "Noteshield" (dit par Aziz à l'oral) — le brief client réel nomme
> l'entreprise **NorthShield**. Utiliser NorthShield partout dans le contenu produit (script,
> UI, textes à l'écran) ; "Noteshield" reste seulement le nom de code de ce dossier de test.

## Statut

**PAS DÉMARRÉ.** Ce fichier documente le brief + la méthode attendue pour la PROCHAINE session.
Rien construit ni généré à ce stade (2026-08-06) — décision explicite d'Aziz de préparer d'abord.

## Contexte : pourquoi ce test, après Flowdesk

Flowdesk a validé HUMAN + SYSTEM (personnage concret + mécanisme abstrait). NorthShield doit
tester **HUMAN + SYSTEM + PRODUCT** — une 3e brique jamais testée : une situation humaine → un
mécanisme invisible rendu visible → une PREUVE dans une vraie interface produit (pas juste
l'abstrait) → une conséquence pour l'utilisateur. Si ça marche, ça couvre l'essentiel du
langage visuel du SaaS explainer observé sur Fiverr (cf `memory/projects/freelance-dataviz-fiverr-pro.md`).

Domaine volontairement plus exigeant que Flowdesk (SaaS générique) : la **cybersécurité** pose
un problème de représentation différent — montrer quelque chose d'invisible, probabiliste et
abstrait (un score de risque calculé en continu) sans tomber dans l'imagerie clichée du genre.

## Brief client intégral (NorthShield)

**Company** : NorthShield
**Project** : Vidéo explicative / présentation produit SaaS
**Usage** : page d'accueil site web, présentations commerciales, LinkedIn
**Durée cible** : 50-60 secondes
**Deadline fictive (contexte du brief)** : 10-14 jours après lancement du projet

### À propos
NorthShield est une plateforme de cybersécurité pour PME. Elle protège les comptes employés
contre les tentatives de connexion suspectes, sans imposer de friction inutile aux utilisateurs
légitimes.

### Le problème
Les systèmes de sécurité traditionnels traitent chaque connexion pareil → dilemme : soit trop
faible, soit vérifications constantes qui usent les employés légitimes. NorthShield évalue
CHAQUE connexion via plusieurs signaux contextuels combinés :
- l'appareil
- l'emplacement approximatif
- l'historique des connexions
- le comportement inhabituel de l'utilisateur

Un employé régulier (laptop + lieu habituels) continue normalement. Un événement inhabituel
(appareil inconnu + comportement atypique) déclenche une vérification supplémentaire.

### Message principal
**"La sécurité doit se manifester lorsqu'elle est nécessaire — et se faire oublier le reste du
temps."**

### Fonctionnalités clés à représenter
- Analyse continue des risques de connexion
- Évaluation simultanée de plusieurs signaux
- Friction minimale pour les utilisateurs à faible risque
- Déclenchement d'une vérification supplémentaire pour les connexions suspectes
- Consultation de l'activité des connexions et niveaux de risque par les admins IT via le
  dashboard NorthShield

### Public cible
Propriétaires de PME, responsables informatiques, directeurs des opérations. Comprend les
concepts de base de la cybersécurité, PAS des experts techniques.

### Ton
Moderne, intelligent, fiable, haut de gamme. **PAS** alarmiste, **PAS** trop technique.

### Direction artistique — client ouvert aux recommandations
Expliquer le concept VISUELLEMENT, pas juste montrer l'UI en continu.

### ⛔ Interdits explicites (garde-fou anti-cliché, NON-NÉGOCIABLE)
- Pas de hacker en hoodie/sweat à capuche.
- Pas de code style Matrix.
- Pas de cadenas géant comme métaphore PRINCIPALE (un petit cadenas ponctuel dans l'UI reste
  acceptable si réaliste, l'interdit porte sur la métaphore centrale de la vidéo).
- Pas de bouclier qui bloque une attaque.
- Pas de pluie de 0 et de 1.
- Résumé Aziz : "je viens de supprimer environ 80% du vocabulaire visuel cliché de la
  cybersécurité" — le studio doit inventer ailleurs.

### Marque
Bleu marine foncé / blanc cassé / accent cyan électrique. Typographie géométrique épurée.
(Palette DISTINCTE de Flowdesk #0B1F3A/#FF6B1A — NorthShield a son propre accent cyan, pas
orange. Ne pas confondre/réutiliser la palette Flowdesk par réflexe.)

### Produit — accès fourni
Compte démo + captures d'écran dashboard disponibles (fictifs pour ce test). Le dashboard
comprend : Activité de connexion, Utilisateur, Appareil, Emplacement, Score de risque, Action.

**Exemples d'événements donnés par le client (à réutiliser tels quels ou variantes proches) :**
- Sarah M. | MacBook Pro | Toronto | 18/100 | Autorisé
- Sarah M. | Appareil inconnu | Berlin | 82/100 | Vérification requise

### Livrables demandés (par le client fictif — rappel de contexte, pas la portée immédiate)
Vidéo 50-60s, master horizontal 1920×1080, voix off, musique + sound design. Versions réseaux
sociaux (verticales) "si disponible" — **mais séquencement studio imposé par Aziz : horizontal
d'abord, vertical seulement une fois le 16:9 validé, cf section Séquencement ci-dessous.**

## Contrainte produit à concevoir (nouveau vs Flowdesk)

NorthShield a un VRAI produit (fictif mais crédible) à représenter — contrairement à Flowdesk
qui restait 100% abstrait/personnage. Concevoir une **petite UI fictive crédible**, 2-3 écrans
suffisent, PAS une application entière. Doit montrer au minimum :
- `Risk Score: 18 — Normal` (cas faible risque, autorisé sans friction)
- `Risk Score: 82 — Verification required` (cas haut risque, vérification déclenchée)

## Méthode imposée pour la prochaine session (raffinement post-Flowdesk)

### 1. Deux storyboards, PAS deux vidéos
Même règle que Flowdesk mais formulée plus précisément (éviter de refiger en prison, cf leçon
GPT dans `memory/projects/flowdesk-client-sim-conclusions.md`) :

- **Direction A — Narrative/Human** : comment raconter cette situation DU POINT DE VUE DE
  L'UTILISATEUR ? **Ne pas dicter la métaphore** — laisser Claude + les autres modèles LLM la
  trouver eux-mêmes.
- **Direction B — System/Conceptual** : comment rendre visible le mécanisme invisible par
  lequel NorthShield prend sa décision ? **Ne pas mentionner "checkpoint", "constellation",
  "balance"** ni aucune métaphore déjà évoquée en conversation avec Aziz — laisser les modèles
  inventer sans influence. Voir ce qu'ils proposent avant de juger.

### 2. Grille obligatoire par panneau (nouveau — évite de refaire Flowdesk B)
Pour CHAQUE panneau de CHAQUE storyboard, répondre explicitement à 4 questions avant de coder
quoi que ce soit :

1. **INFORMATION** — qu'est-ce que cette scène doit faire comprendre ?
2. **REPRÉSENTATION** — pourquoi cette représentation est-elle meilleure qu'une autre ?
3. **MEDIUM** — SVG / illustration / vidéo générée / UI / typographie / autre ?
4. **SEMANTIC TEST** — que comprend quelqu'un qui regarde cette image 5 secondes SANS
   narration ?

### 3. Chaîne HUMAN + SYSTEM + PRODUCT (le vrai test de cette session)
```
Situation humaine
      ↓
Visualisation du mécanisme invisible (le scoring de risque)
      ↓
Preuve dans la VRAIE interface (le dashboard, écrans conçus ci-dessus)
      ↓
Conséquence pour l'utilisateur (accès normal OU vérification demandée)
```

### 4. Séquencement horizontal → vertical (contrainte de projet globale, pas juste NorthShield)
Une fois la version 16:9 validée (peu importe si ça prend 2-3 sessions) : tester une offre
premium de recadrage vertical (Shorts/Reels/TikTok) comme service à part, facturable en plus.
**Ordre impératif : horizontal fini et validé D'ABORD, vertical SEULEMENT ensuite** — ne jamais
mener les deux fronts en parallèle (risque de confusion, et le SaaS se consomme
majoritairement en horizontal de toute façon). Ce point n'est PAS dans le scope de la prochaine
session — à traiter après validation complète du 16:9.

## Prochaine session — plan d'action concret

1. Relire ce brief + `memory/client-sim-tests/INDEX.md` (méthode standard tests client-sim) +
   `memory/projects/flowdesk-client-sim-conclusions.md` (leçons Flowdesk : structure
   CONCRET→ABSTRAIT→CONCRET, règle draw-on/mouvement/vie, pipeline SaaS V1).
2. Écrire le script voix (français, cf conventions TTS du projet — scan anti-pièges ElevenLabs
   avant génération) à partir du message principal + fonctionnalités clés ci-dessus. Découpage
   en panneaux à déterminer (probablement 4-5 vu la chaîne HUMAN+SYSTEM+PRODUCT plus longue que
   Flowdesk).
3. Concevoir les 2-3 écrans UI fictifs NorthShield (dashboard : activité connexion / user /
   device / location / risk score / action) — palette bleu marine/blanc cassé/cyan électrique,
   typographie géométrique épurée. AVANT de lancer les storyboards (le produit doit exister
   comme référence visuelle pour les modèles).
4. Lancer génération Direction A (Narrative/Human) — brief SANS dicter la métaphore.
5. Lancer génération Direction B (System/Conceptual) — brief SANS mentionner
   checkpoint/constellation/balance ni aucune métaphore pré-discutée.
6. Remplir la grille INFORMATION/REPRÉSENTATION/MEDIUM/SEMANTIC TEST pour chaque panneau des 2
   directions.
7. Semantic Test croisé : présenter les 2 storyboards à Aziz, voir ce qui se comprend sans
   narration.
8. Mix & Match — sélectionner/combiner les meilleurs panneaux des 2 directions.
9. Sauvegarder les conclusions (comme `flowdesk-client-sim-conclusions.md`) — QU'EST-CE QUE
   NorthShield a prouvé de plus que Flowdesk (chaîne PRODUCT en particulier), qu'est-ce qui a
   été inventé par les modèles sans métaphore imposée, qualité du garde-fou anti-cliché.

Rien de tout ceci n'est fait à ce jour (2026-08-06) — c'est le plan, pas un état d'avancement.
