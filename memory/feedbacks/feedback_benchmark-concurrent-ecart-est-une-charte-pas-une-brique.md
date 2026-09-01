Quand Aziz montre une video de reference (concurrent Fiverr, chaine YouTube, livrable client) et
qu'elle parait « mieux faite » que notre production, **le reflexe de coder une brique neuve est
presque toujours faux**. Analyser d'abord, coder ensuite — et le plus souvent ne pas coder du tout.

**Why** : verifie sur 3 references analysees le meme jour (2026-08-15, session showcase) — un gig
cartes geopolitiques (Google Earth Studio + AE), un livrable B2B ferroviaire (Aikido/Network Rail),
un teaser SaaS (Tugger). **Aucune des trois ne reposait sur une technique absente du repo.** Ce qui
les distinguait etait a chaque fois une discipline de direction artistique :
- Aikido : 4 couleurs + 1 typo tenues sur 2min22, qui font cohabiter 4 registres visuels
  (illustration flat / carte vectorielle / diagramme / mockup UI) sans coutures visibles ;
- Tugger : la lumiere EST le decor (fond noir + degrades/halos qui derivent, quasi zero objet) ;
- gig cartes : imagerie satellite photorealiste (choix de DA, pas capacite).

Sur le seul ecart qui ressemblait a un trou technique (« un objet qui suit un chemin sur la carte »),
l'inventaire a montre qu'on l'avait deja implemente **4 fois** de facon independante — le probleme
etait une dette d'unification, pas un manque. Coder une 5e version aurait aggrave le desordre.

**How to apply** :
1. **Mesurer avant de juger** : `ffprobe` + extraire des frames sur TOUTE la duree (jamais 1 frame au
   hasard, jamais juger a l'oeil sur la lecture). Decrire la structure plan par plan.
2. **Separer capacite et direction artistique** dans le verdict. Question a poser explicitement :
   « est-ce qu'on ne SAIT PAS le faire, ou est-ce qu'on ne l'a pas SOIGNE ? »
3. **Chercher la brique existante AVANT de conclure au manque** (agent d'inventaire sur toutes les
   branches — cf [[feedback_registre-canonique-branche-rnd-jamais-mergee-pattern-recurrent]]).
4. Si l'ecart est une charte : l'ecrire comme document de DA (palette / typo / traitement du fond /
   regle d'enchainement entre registres), **ne pas coder de composant**.
5. Si l'ecart est une vraie brique : ne la coder qu'au 1er usage reel dans une scene, jamais dans le
   vide — cf [[feedback_documenter-methode-prouvee-avant-de-generaliser]].

⭐ Detail recurrent et peu couteux a corriger : **nos fonds sont des aplats** (`#16213a`), les leurs
sont des degrades vivants avec halos qui derivent. C'est ce qui separe « propre » de « premium », et
ca ne demande aucune brique nouvelle.

Contexte complet des 3 analyses : `memory/projects/SHOWCASE-CAPACITES.md` § Benchmark ELARGI.

---

## Corollaire (meme session) : N implementations = dette d'unification, JAMAIS un trou de capacite

Quand un manque percu porte sur une forme **generique** (« un objet suit un chemin », « un chiffre
monte », « un territoire se colore »), la premiere hypothese doit etre **« on l'a fait N fois sans
l'unifier »**, pas « on ne sait pas le faire ». Une forme generique a ete rencontree par plusieurs
episodes, donc elle a ete implementee plusieurs fois.

Vecu : Aziz formule « la seule chose qu'on n'a peut-etre pas, c'est les objets animes qui se deplacent
autour de la carte ». Inventaire + verification disque → **4 implementations independantes et vivantes**
du meme geste, aucune canonique. Le diagnostic « il nous manque X » etait faux — mais **la gene d'Aziz
etait vraie** : la forme n'etait nulle part reutilisable en une ligne. Les deux peuvent etre vrais en
meme temps ; ne pas balayer le ressenti parce que l'inventaire contredit le mot employe.

**Ou regarder pour decrire honnetement le manque** : ce n'est presque jamais l'ALGORITHME (position +
tangente est trivial), c'est **l'adaptateur entre espaces de coordonnees** (% ecran ↔ lon-lat ↔ coords
d3 pre-projetees) et **les invariants transverses** (ancrage de la taille au zoom, R-OBJ-1).

⛔ **Ne pas coder la N+1e version « proprement, une bonne fois »** — une abstraction ecrite sur zero
usage courant est un pari. Unifier au 1er usage reel (cf. [[feedback_documenter-methode-prouvee-avant-de-generaliser]]).

⚠️ **Piege de designation du canon** : j'ai d'abord designe la mauvaise implementation comme canonique
(la plus « propre » a la lecture) en lui attribuant un consommateur qui importait en realite une AUTRE
implementation. **Verifier les imports reels** (`grep -l` sur le nom, lire l'en-tete du fichier) avant
de designer un canon — la lisibilite du code ne dit pas qui s'en sert.


---

## ⭐⭐⭐ 4e CONFIRMATION — MATERA : LE CHIFFRE HABITE L'OBJET (2026-08-24)

Chaîne FR, 7:00, **52 108 vues en 3 jours**, sujet aride (urbanisme parisien de 1966). 83 frames
analysées. Même durée que nos longues, même langue, même absence de visage.

⭐ **Le résultat structurant : 15 chiffres présentés, ZÉRO compteur, ZÉRO barre, ZÉRO courbe.**
Chaque chiffre est accroché à un **objet dont la forme dérive de l'unité mesurée** :
une distance → un panneau directionnel · une quantité de personnes → des pictos-personnes ·
une part d'un territoire → **une découpe dans ce territoire** (pas un camembert) · une hauteur →
une étiquette collée à la hauteur · un prix au m² → une ligne de rappel pointant le m² sur la carte.

C'est l'inverse de notre réflexe dataviz (CountUp, jauge, graphe), qui traite le chiffre comme une
**donnée à afficher** plutôt que comme une **propriété d'un objet montré**. Réponse directe à notre
faiblesse « machine à chiffres abstraits » : notre problème n'est pas le NOMBRE de chiffres
(eux : 1 toutes les 28 s, plus dense que notre plafond) — c'est qu'ils n'ont pas de corps.

3 autres mesures cohérentes : **décor unique** tenu 100 % du temps (autorise l'hétérogénéité des
matières ET la lenteur) · **motif qui rime** (fenêtres vides → peuplées, 3 rappels : la variété vient
de la transformation, pas de la substitution) · rythme **3,2 s/événement mais VARIÉ**, avec des
respirations mesurées — la régularité est une moyenne, pas une cadence.

⛔ **Charte, pas brique** — 4e référence externe analysée, 4e fois qu'aucune ne repose sur une
technique absente du repo. Les 12 registres sur 17 qu'ils emploient sont codables chez nous.
