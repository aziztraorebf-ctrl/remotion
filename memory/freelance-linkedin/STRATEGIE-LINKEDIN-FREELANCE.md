# Stratégie LinkedIn & offre freelance — Kora & Cartes

> Établi 2026-07-29 (session recherche/veille, zéro production). Décision d'Aziz : envisager une
> activité freelance de production vidéo explicative. Ce fichier = le POURQUOI et la LIGNE.
> Le calendrier de posts vit dans [CALENDRIER-EDITORIAL.md](CALENDRIER-EDITORIAL.md).
> L'inventaire des histoires vit dans [INVENTAIRE-HISTOIRES.md](INVENTAIRE-HISTOIRES.md).
> Complète [[STRATEGIE-DISTRIBUTION-INSTAGRAM-2026]] (Instagram = audience chaîne ; LinkedIn = clients).

---

## ⛔ CE QUI EST DATÉ ET CE QUI NE L'EST PAS (lire avant de réutiliser)

Ce dossier mélange deux natures d'information. Ne pas les traiter pareil :

| Nature | Périme ? | Exemples |
|---|---|---|
| **Les principes** | Non — ils tiennent tant que le modèle d'affaires est le même | le moat = révision gratuite · sujet matériel > sujet méta · montrer le processus dé-catégorise |
| **Les chiffres de marché** | OUI, vite (~3 mois) | tarifs Higgsfield, crédits, coût/minute, stats de la chaîne Guinée en Données |
| **L'inventaire d'histoires** | OUI par ACCUMULATION — il ne devient pas faux, il devient incomplet | les 30 histoires extraites au 2026-07-29 |

**Règle de réutilisation** : les principes s'appliquent directement. Les chiffres se re-vérifient
avant tout usage commercial (un tarif SaaS de 3 mois est périmé). L'inventaire se COMPLÈTE, ne se
refait pas — voir la procédure de mise à jour en bas de `INVENTAIRE-HISTOIRES.md`.

---

## 1. Le constat de départ (ce qui a déclenché la session)

Analyse d'une petite chaîne concurrente (Guinée en Données, 459 abonnés, sujets africains) :
9 vidéos, même production, **de 64 à 10 000 vues**. Ratio vues/abonnés moyen 4,07 — donc YouTube
distribue bien la chaîne ; elle ne plafonne pas, elle a un problème de VARIANCE.

**La production étant strictement constante entre la vidéo à 64 vues et celle à 10 000, l'écart ×157
est produit entièrement par le titre, la miniature et le choix du sujet.**

Conséquence directe pour nous, inconfortable et à ne pas oublier :

> Notre avantage technique (moteur déterministe, SVG, D3, cartes vivantes) agit **entièrement APRÈS
> le clic**. Il détermine la rétention, l'abonnement, la valeur perçue — il ne déclenche rien tout
> seul. Un épisode magnifique avec une miniature typographique et un titre à absence fera 64 vues.

⚠️ **Cette chaîne était DÉJÀ notre benchmark documenté** (Décision 5 de
[[feedback_strategie-vs-chaines-youtube-2026-05]], 2026-05-28 : 410 abonnés / 6 vidéos / médiane 1489,
objectif « les dépasser en 6 mois »). Re-mesure du 2026-07-29 : 459 abonnés / 9 vidéos → +49 en 2 mois,
croissance lente, l'objectif reste réaliste. Leçon de méthode : cette session a re-découvert la chaîne
de zéro sans lire la note de mai — **chercher dans la mémoire avant d'analyser un concurrent**.
Doctrine de production correspondante : [[SUJET-PRIME-SUR-PRODUCTION]] (cette session en fournit la
preuve à variable neutralisée).

Les 3 transferts retenus : sujet matériel (l'argent qui part) > sujet méta (la statistique manquante) ·
miniature décodable en 0,4 s (objet de valeur + sujet humain **DESSINÉ**, jamais photo/visage criard — cf. Décision 4 de [[feedback_strategie-vs-chaines-youtube-2026-05]], validée Aziz 2026-05-28 : notre niche rejette activement le clickbait ; décodable ≠ criard) · chiffre livré en <3 s (le globe/plongée
caméra vient APRÈS, il retient mais n'accroche pas).

---

## 2. Le moat, formulé précisément

La formulation vague (« ma méthode est plus contrôlable ») ne vaut rien commercialement. La précise
vaut beaucoup :

> **La révision est gratuite et exacte.** Sur une vidéo générée, chaque demande de changement relance
> un tirage payant qui ne redonne pas le plan d'origine corrigé. Sur une composition déterministe, on
> change la ligne concernée et le reste de l'image est strictement identique — autant de fois que
> nécessaire, sans coût.

> Analyse TECHNIQUE du pipeline concurrent qui fonde ce constat (et sa réserve de péremption — à
> re-évaluer à chaque nouvelle vague) : [[feedback_vox-generation-vs-composition-deterministe-moat]].

**Trois avantages vendables que le génératif ne peut pas égaler** :
1. **La correction chirurgicale** — un chiffre, un mot, une couleur ; le reste bit-identique.
2. **Le texte et les chiffres exacts à l'écran** — ÉLIMINATOIRE pour le génératif sur du contenu data.
   Un générateur dessine le texte, il ne le compose pas : « 8,7 % » n'est pas garanti.
3. **La réutilisation capitalisée** — le client 2 hérite du travail du client 1. Notre marge monte
   avec le temps, la leur est plate. Permet la SÉRIE (12 épisodes cohérents), très dure en génératif.

**Le comparatif chiffré** (épisode Franc CFA réel, 4min38, 8 beats, 278 s) :

| | Vidéo générée | Nous |
|---|---|---|
| Livraison v1 | 90–190 $ | 5–8 $ (ElevenLabs + Minimax + render) |
| 3 révisions client | 117–243 $ | ~0 $ |
| **Total cash** | **207–433 $** | **5–8 $** |
| Convergence garantie | non | oui |
| Chiffres exacts | non garantis | garantis |
| Le reste après révision | peut avoir dérivé | bit-identique |

⚠️ **Hypothèses à re-vérifier avant usage client** : tarifs Higgsfield au 2026-07-29 (Ultra 3000 cr
= 99–129 $, top-up ~5 $/100 cr, Seedance 2.0 Standard 36 cr/clip 8 s) + ratio de 3 essais/plan.
Point d'ancrage vérifié : un praticien en commentaire rapporte **4000+ crédits pour 2 vidéos de 5 min**.

⚠️ **Réserve honnête** : notre coût dominant est le TEMPS, absent de ce tableau. L'avantage n'existe
pas au 1er projet d'un type neuf — il se creuse avec la bibliothèque. Vendre la vitesse sur
l'ITÉRATION et la SÉRIE, jamais sur un projet neuf.

**Ce qui nous menacerait vraiment** : pas l'amélioration de la qualité d'image des générateurs (elle
viendra), mais un outil qui produirait une **représentation éditable** (calques, vectoriel, timeline)
au lieu d'un fichier vidéo plat. Higgsfield ne fait pas ça. À surveiller.

**Segment où nous sommes objectivement le meilleur choix** : vidéo explicative data-driven, EN SÉRIE,
pour un client avec charte graphique et chiffres qui bougent (institutions, think tanks, ONG, cabinets
d'études, médias économiques — a fortiori sur l'Afrique, où la bibliothèque carto existe déjà).
**Terrain à laisser** : le clip d'ambiance cinématique de 30 s sans texte ni révision — le génératif
gagne sur coût et vitesse. Ne pas le disputer.

---

## 3. Le vrai obstacle n'est pas technique

L'illusion du technicien : « si ma production est excellente, les clients viendront ». Faux — la
qualité n'entre en jeu qu'à l'étape 4 d'un parcours de 6 : (1) le client réalise son besoin, (2) il
cherche ou est trouvé, (3) **il nous découvre**, (4) il nous juge crédible en 30 s, (5) il comprend
prix et délai, (6) il signe. Échouer en 1-3 = le moteur n'a jamais l'occasion d'être vu.

Pernicieux parce qu'améliorer le moteur est agréable, mesurable et sous contrôle ; prospecter est
inconfortable, lent et plein de rejets. D'où le retour naturel au code, « quand ce sera prêt ».

**Les 4 obstacles réels, dans l'ordre** :
1. **Distribution** — personne ne sait qu'on existe. La chaîne YouTube parle à des SPECTATEURS, pas à
   des ACHETEURS. Deux publics différents.
2. **Preuve** — un portfolio de belles vidéos fait dire « c'est beau », pas « il résout mon problème ».
   Ce qui convainc = le CAS (besoin, contraintes, livré, en combien de temps). La démo la plus
   puissante n'est même pas une vidéo : c'est **la même scène en 3 variantes côte à côte**.
3. **Prix** — 2 erreurs : facturer à l'heure (punit exactement ce qu'on a construit : plus la
   bibliothèque rend rapide, moins on gagne) et se croire trop cher (un prix bas DISQUALIFIE auprès
   des clients sérieux). Facturer au LIVRABLE ou au FORFAIT SÉRIE.
4. **Confiance** — le client achète de la réduction de risque autant que de la vidéo (si c'est raté,
   c'est LUI qui est exposé en interne). « Révisions incluses » est un argument ANTI-RISQUE.

**Le test qui tranche, répondable sans une ligne de code** :
- Par quel chemin concret un client idéal arriverait-il jusqu'à moi aujourd'hui ?
- Combien de personnes ayant un budget vidéo savent que je fais ça ?
- Ai-je déjà dit un prix à voix haute à quelqu'un ?

**Le coût caché du perfectionnement** : ce n'est pas le temps perdu, c'est de construire à l'aveugle.
Peut-être que les clients se moquent des cartes animées et veulent des vidéos de résultats
trimestriels bien faites. Impossible à déduire depuis l'éditeur.

**À cadrer AVANT le premier contrat, tant que c'est gratuit** : ce qui reste notre propriété
réutilisable vs ce qui appartient au client. C'est exactement l'actif qui fait la marge.

---

## 4. LinkedIn — pourquoi, et ce qui y est vrai

**« LinkedIn est mort » = vrai pour UN usage** (post texte générique + prospection à froid en masse),
faux pour le nôtre. Ce n'est pas la plateforme qui est morte, c'est le **contenu indifférenciable**
qui ne passe plus — et le seuil a monté brutalement depuis que tout le monde génère ses posts. Ce qui
reste rare monte mécaniquement en valeur.

**Le chiffre bas de likes est un faux signal.** En B2B, la métrique n'est pas likes/abonnés mais
« combien de BONNES personnes ont vu le travail ». 8 likes dont 2 décideurs > 400 likes de créateurs
de contenu.

**L'hostilité anti-IA ne vise pas l'IA** — elle vise l'absence d'effort et de spécificité. Notre
travail est l'inverse : code déterministe, données sourcées, géométries calculées, choix de DA.
⚠️ **MAIS cette distinction n'est pas visible d'office** : une belle vidéo animée en 2026 peut être
prise pour de la génération. D'où :

> **Montrer le PROCESSUS n'est pas optionnel — c'est ce qui nous dé-catégorise.** C'est ce qui prouve
> que c'est construit, pas tiré au sort.

**L'asymétrie sur laquelle tout repose** : tout le monde peut poster un beau rendu, presque personne
ne poste un ARBITRAGE. Un rendu magnifique se lit comme « probablement généré ». Un arbitrage motivé
— j'ai construit ceci, je l'ai rejeté, voici le critère — ne peut pas être fabriqué en un prompt.

**Ce qui devrait vraiment inquiéter** (pas ce que les gens listent) :
1. **Le rythme, pas la qualité.** 1 post/semaine pendant 6 mois bat 10 posts brillants puis le silence.
2. **Parler à la mauvaise audience.** Les posts attireront naturellement des créateurs/devs/curieux
   d'IA — qui likent et n'achètent pas. Écrire pour l'ACHETEUR même si les pairs réagissent plus fort.
3. **Ne jamais dire ce qu'on vend.** Erreur classique du technicien : montrer un travail magnifique
   sans indiquer qu'on peut le commander.
4. **Traiter LinkedIn comme un objectif plutôt qu'une vitrine.** Le but = une conversation avec
   quelqu'un qui a un budget. Le post n'est qu'un prétexte.

**Positionnement de LinkedIn dans le dispositif** : c'est la PREUVE et la MÉMOIRE — l'endroit où on
vérifie notre crédibilité après avoir entendu parler de nous. Le premier contact viendra plus souvent
d'une conversation directe ou d'une recommandation. **Ne pas compter sur LinkedIn seul pour trouver
des clients.**

---

## 5. Le gabarit de post — 5 mouvements

| # | Mouvement | Rôle | Longueur |
|---|---|---|---|
| 1 | **Le renoncement / le contre-pied** | Accroche. Dire d'emblée ce qu'on a jeté ou raté. Arrête le scroll sans clickbait. | 2 lignes |
| 2 | **Le contexte concret** | Le sujet réel, nommé. Jamais « un client », « un projet ». | 2-3 lignes |
| 3 | **Le diagnostic** | POURQUOI c'était faux. Le cœur : prouve du jugement, pas de la technique. | 4-6 lignes |
| 4 | **La règle transposable** | Ce que le lecteur emporte même s'il ne fera jamais de vidéo. | 2-3 lignes |
| 5 | **La signature** | Ce qu'on fait + l'avantage, en langage client. JAMAIS le mot « déterministe ». | 2 lignes |

**Règles de forme** :
- Les **2 premières lignes décident tout** (LinkedIn coupe le reste). Les écrire EN DERNIER.
- **Aucun lien dans le corps** → la vidéo en commentaire (un lien sortant réduit fortement la portée).
- Une ligne = une idée. Paragraphes courts, sauts de ligne francs (lecture au pouce).
- 2 hashtags maximum, ou zéro.
- **Zéro jargon interne** : « forced-alignment », « registre », « beat » sont notre vocabulaire, pas
  celui du client. Traduire systématiquement.

**Les 5 formes narratives** (alterner pour ne pas lasser) : Renoncement · Migration · Refus de
catégorie · Découverte · Erreur de méthode.

**Poster les ÉCHECS — la nuance qui compte** :
- ✅ L'échec INSTRUCTIF qui se termine par une solution → montre du jugement professionnel, rassure
  (« il attrapera les erreurs avant moi »).
- ⛔ L'échec BRUT sans résolution, ou l'aveu de fragilité (« 3 jours perdus, je ne comprends rien »)
  → sympathie entre pairs, INQUIÉTUDE chez un acheteur.
- Règle : **l'échec est bonne matière quand il rend le RÉSULTAT plus impressionnant, jamais quand il
  rend le PRESTATAIRE plus incertain.**

**Signature de référence** (réutilisable telle quelle) :
> Je produis des vidéos explicatives sur l'économie et la géopolitique africaines. Tout est composé
> par code, donc tout est révisable : un chiffre, une couleur de marque, un libellé — c'est une ligne,
> pas un nouveau tournage.

⛔ **INTERDIT DE LANGAGE (arbitré 2026-07-29, règle transversale confirmée)** : ne JAMAIS écrire « je
code », « j'anime en code », « je dessine tout ». C'est faux (Aziz orchestre des IA, il n'écrit pas le
code) ET ça plante une barrière technique dès la 1re phrase, ce qui rétrécit l'audience à
« développeur doué ». Dire : « je fais construire », « tout est composé par code », « je dirige la
production ». Source : [[feedback_vox-generation-vs-composition-deterministe-moat]] § POSTURE DE
COMMUNICATION. Vaut AUSSI pour le registre commercial LinkedIn — pas seulement le pédagogique.

---

## 5bis. Articulation avec la piste Fiverr Pro (décidé 2026-07-31)

Ce fichier (LinkedIn) et `freelance-dataviz-fiverr-pro.md` (marketplace Fiverr Pro/B2B direct) sont
**complémentaires, pas concurrents** — décision Aziz du 2026-07-31, après qu'un audit mémoire ait
signalé le chevauchement (les deux pistent "vendre le savoir-faire en freelance" sans se référencer).

- **LinkedIn = vitrine/preuve** — montrer le processus, construire la crédibilité, poser le moat
  (déterminisme, révision gratuite) dans la durée, sans dépendre d'un algorithme de marketplace.
- **Fiverr Pro = canal de vente réel** — là où une commande se concrétise, avec le positionnement
  "cartographie éditoriale data-sourcée premium" déjà tranché dans ce fichier-là.

Ne pas les fusionner en un seul document : les horizons diffèrent (LinkedIn = contenu continu dès
maintenant si activé ; Fiverr Pro = test après Gazoduc). Mais toute décision de prix/positionnement
prise dans l'un doit rester cohérente avec l'autre — se relire les deux avant de trancher le prix
(point 2 de la section suivante) ou de rédiger un post qui mentionne un tarif.

## 6. Décisions à trancher par Aziz

1. ✅ **TRANCHÉ 2026-08-01 : assumer publiquement l'usage de l'IA, ton casual.** Aziz a explicitement
   choisi de mentionner l'IA franchement (pas de détour), avec un ton décontracté "comme à un ami" —
   pas corporate, pas de jargon technique — en réaction à l'allergie croissante observée sur LinkedIn
   envers les posts trop artificiels/robotiques. Voir § 6bis pour le texte de profil qui applique
   cette décision.
2. **Le prix.** Aucun prix n'a encore été dit à voix haute à qui que ce soit. C'est la seule
   hypothèse qui compte et elle n'est pas testée.
3. **Les 2 histoires sensibles** (pipeline concurrent nommé, chaîne YouTube nommée) : postables mais
   à reformuler sans les noms pour éviter l'accroche polémique.

## 6bis. Profil LinkedIn — état d'avancement (2026-08-01)

Le compte LinkedIn personnel d'Aziz (ancien compte, vide, jamais utilisé) a été connecté à TryPost
(`social_account_id: 019fbb12-0555-70e7-9886-0071425c0431`). Décision : compléter le profil
(titre + section "À propos") AVANT tout premier post — un profil vide contredirait la vitrine de
crédibilité visée par cette stratégie.

**Textes rédigés et validés par Aziz**, à coller MANUELLEMENT sur LinkedIn (aucun outil ne peut
éditer un profil LinkedIn — ni TryPost ni un autre MCP) :

- **Titre de profil** : « Je produis des vidéos explicatives sur l'économie et la géopolitique
  africaines — Kora & Cartes »
- **Section "À propos"** : « Je fais des vidéos qui expliquent l'économie et la géopolitique
  africaines — la chaîne s'appelle Kora & Cartes. J'utilise l'IA, sans complexe : pour la
  recherche, la voix, la musique. Mais tout ce qui s'affiche à l'écran — cartes, chiffres,
  animations — je le construis, ligne par ligne, avec l'IA. Ça change tout pour les corrections :
  un chiffre à changer, une couleur, un mot — c'est une ligne, pas un nouveau tournage. Si vous
  cherchez quelqu'un pour raconter une histoire de données ou de territoire, simplement et sans
  sur-tournage inutile, dites-moi. »

⚠️ **Variante de formulation à noter** : ce texte dit « je le construis, ligne par ligne, avec
l'IA » — légèrement différent de la signature de référence au § 5 (« tout est composé par code »).
Les deux sont cohérentes avec l'interdit « jamais dire je code » (ici on dit explicitement qu'on
utilise l'IA, pas qu'on écrit le code soi-même), mais à harmoniser en une seule formulation à la
prochaine passe sur le gabarit de post.

**Prochaine session** : vérifier si Aziz a collé ces textes avant de proposer le premier post du
calendrier éditorial LinkedIn.

---

## Livrables produits dans cette session

- **Page de démonstration du déterminisme** (3 variantes de la scène du filet CFA + diff + comparatif
  de coûts) : `https://files.catbox.moe/4xmfbl.html` — source dans le scratchpad de session.
  ⚠️ Les 3 images sont des RECONSTITUTIONS fidèles de la géométrie réelle, pas des exports Remotion.
  Pour un usage portfolio opposable : exporter 3 vraies frames en changeant les constantes.
- **3 posts rédigés** : le globe D3 abandonné · Mapbox→D3 · l'insert état-major (dans
  `CALENDRIER-EDITORIAL.md`).
