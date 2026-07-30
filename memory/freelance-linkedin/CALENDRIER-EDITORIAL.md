# Calendrier éditorial LinkedIn — 12 semaines

> Établi 2026-07-29. Gabarit et règles de forme : [STRATEGIE-LINKEDIN-FREELANCE.md](STRATEGIE-LINKEDIN-FREELANCE.md) § 5.
> Matière : [INVENTAIRE-HISTOIRES.md](INVENTAIRE-HISTOIRES.md).
>
> **Le rythme prime sur la qualité** : 1 post/semaine pendant 6 mois bat 10 posts brillants puis le
> silence. Alternance volontaire des 5 formes narratives pour ne pas lasser.

---

## Le plan

| Sem. | Post | Forme | État |
|---|---|---|---|
| 1 | Le globe jeté (CFA beat 2) | Renoncement | ✅ **rédigé ci-dessous** |
| 2 | Mapbox → D3 | Migration | ✅ **rédigé ci-dessous** |
| 3 | L'insert état-major (Khartoum) | Refus de catégorie | ✅ **rédigé ci-dessous** |
| 4 | « Dessine ET anime » | Découverte | histoire n°1 |
| 5 | Le funambule de profil | Découverte | histoire n°6 |
| 6 | Trois IA d'accord, toutes fausses | Erreur de méthode | histoire n°2 |
| 7 | La démo virale démystifiée | Refus de catégorie | histoire n°5 |
| 8 | La vidéo gelée 4 minutes | Erreur de méthode | histoire n°3 |
| 9 | Le beat techniquement parfait, à jeter | Erreur de méthode | histoire n°7 |
| 10 | Carte vivante ≠ carte chargée | Renoncement | histoire n°9 |
| 11 | Les pauses audio sans régénérer la voix | Migration | histoire n°10 |
| 12 | Les 13 garde-fous, chacun d'un dollar perdu | Découverte | histoire n°29 |

**Réserve si un post tombe** : n°4 (la technique évitée toute une session), n°8 (les 3 façons de poser
un drapeau), n°16 (les tailles toutes fausses ensemble), n°27 (le prix qui inverse la conclusion).

---

## Signature standard (fin de chaque post)

> Je produis des vidéos explicatives sur l'économie et la géopolitique africaines. Tout est composé par code,
> donc tout est révisable : un chiffre, une couleur de marque, un libellé — c'est une ligne, pas un
> nouveau tournage.

Variante quand le post parle déjà beaucoup technique : couper la 2e phrase.

---

# POST 1 — Le globe jeté

*Forme : Renoncement. Source : `feedback_globe-d3-moteur-cartographique-reutilisable.md` § garde-fou 2026-07-21.*

**Accroche**

> J'ai fait construire un globe 3D pour cette scène. Puis je l'ai jeté.
> Pas parce qu'il était raté. Parce qu'il racontait la mauvaise chose.

**Corps**

> La scène devait expliquer le franc CFA : deux zones monétaires, quatorze pays, un même principe.
>
> J'avais un moteur de globe orthographique déjà en place pour un autre épisode — arcs qui suivent la
> courbure, drapeaux découpés dans les frontières réelles, caméra continue. Le réutiliser était
> tentant. Je l'ai fait : les quatorze pays s'allumaient en deux vagues, Afrique de l'Ouest puis
> Afrique centrale.
>
> Techniquement, ça marchait. Au visionnage, non.
>
> Deux problèmes. La sphère démarrait sur un temps mort — il faut la faire tourner avant d'arriver
> quelque part. Et surtout, quatorze drapeaux différents qui s'allument un par un disaient « voici
> quatorze pays distincts » alors que le propos était l'inverse : **un seul mécanisme, partagé**.
> L'image contredisait la phrase.
>
> J'ai soumis les deux versions à trois modèles d'analyse, sans leur dire laquelle j'avais produite en
> premier. Verdict unanime : carte plate.
>
> Parce qu'un globe sert à montrer ce qui **voyage** — de l'or, des armes, de l'argent qui traverse des
> frontières. Une carte plate sert à montrer ce qui **se répartit**. Ma scène était une définition, pas
> un trajet.
>
> La règle que j'en garde : le beat montre-t-il quelque chose qui relie, ou quelque chose qui se
> définit ? La réponse dicte le registre. Pas l'envie d'utiliser l'outil le plus impressionnant qu'on
> vient de construire.
>
> Le globe n'est pas perdu — il tourne dans deux épisodes sur les flux d'armes, là où il est à sa place.
>
> ↓ La version retenue en commentaire.

---

# POST 2 — Mapbox → D3

*Forme : Migration. Source : `feedback_d3-vitesse-iteration-vs-mapbox.md`.*

**Accroche**

> J'ai remplacé Mapbox sur la majorité de mes cartes.
> Ce n'était pas pour économiser. C'était pour arrêter de me battre.

**Corps**

> Mapbox est excellent. Sur mes vidéos, c'était devenu le maillon fragile.
>
> Le problème n'était pas la qualité des cartes. C'était que **rien n'était sous mon contrôle**. Les
> tuiles sont chargées depuis un serveur. Le style vit dans un fichier externe. Et chaque image de la
> vidéo doit recalculer où se trouve chaque point à l'écran — ce qui veut dire que mes marqueurs
> dérivaient dès que la caméra bougeait. Un jeton posé sur une ville se retrouvait à côté.
>
> Ajoutez le rendu : Mapbox a besoin d'une carte graphique. En rendu automatisé, ça refuse une fois sur
> trois, sans dire pourquoi.
>
> Je suis passé à D3 — la carte est désormais générée chez moi, en vectoriel.
>
> Ce que ça a changé, concrètement : la carte et les marqueurs vivent désormais dans le **même
> repère**. Plus de dérive, même en plein mouvement. Et j'ai produit trois palettes complètes d'un même
> globe dans une seule session — bleu spatial, parchemin, kaki et océan — en changeant un objet de
> couleurs. Avant, chaque variante était une négociation avec l'outil.
>
> La contrepartie, parce qu'il y en a une : Mapbox vous donne gratuitement le relief satellite, les
> noms de villes, le terrain texturé. En D3, tout est dessiné de zéro. Sur mes sujets — contours à l'encre,
> registre gravé — je **veux** ce contrôle. Mais si une scène a besoin d'un sol qui existe vraiment, en
> plan rapproché, Mapbox reste le bon choix. Il est resté dans ma boîte à outils, il n'est plus le
> réflexe.
>
> La leçon transposable : un outil puissant qu'on ne contrôle pas coûte plus cher qu'un outil modeste
> qu'on maîtrise. Ce qui compte, ce n'est pas ce que l'outil sait faire — c'est ce que vous pouvez
> prévoir de son résultat.

⚠️ **Avant publication** : j'avais écrit « 200 lignes de code » dans la première version — c'est une
image, pas un chiffre vérifié. Retiré. Ne pas le remettre sans compter.

---

# POST 3 — L'insert état-major

*Forme : Refus de catégorie. Source : `doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`.*

**Accroche**

> Pour cette scène de bataille, j'ai arrêté d'utiliser une carte.
> Une carte sait afficher des données. Elle ne sait pas illustrer un plan.

**Corps**

> Je devais raconter l'assaut sur Khartoum du 15 avril 2023 : trois objectifs pris en séquence —
> l'aéroport, le palais, la tour de télévision.
>
> Sur une carte réelle, ça ne fonctionnait pas. Une carte vous dit *où* se trouve un aéroport. Elle ne
> vous fait pas ressentir qu'on **vient de le prendre**.
>
> J'ai donc fait dessiner une carte d'état-major gravée. Palette sable, or et encre rouge, vue strictement du
> dessus, jamais de perspective.
>
> Trois décisions ont fait la différence, et deux viennent d'essais ratés :
>
> **Les cibles sont des bâtiments dessinés, pas des croix.** L'aéroport a une piste, un terminal, des
> avions. Le palais a une cour et une colonnade. On reconnaît ce qui est en jeu sans légende.
>
> **Les forces sont des visages, pas des véhicules.** J'ai testé des véhicules à l'échelle réelle :
> illisibles, une cinquantaine de pixels. J'ai testé les symboles militaires standard : froids, on ne
> sait pas qui agit. Quatre portraits en médaillon qui avancent vers la cible — on voit *qui* attaque.
> Et le visage ne pivote jamais, même quand la formation change de direction : un visage qui tourne sur
> lui-même est immédiatement faux à l'œil.
>
> **La prise se lit sans texte.** Au moment de l'impact, le bâtiment devient translucide — vidé — un
> sceau s'installe dessus, et une fumée persiste. J'avais d'abord essayé de le colorer en rouge.
> C'était moins clair : c'est le bâtiment **lui-même** qui doit changer, pas un calque posé par-dessus.
>
> J'ai aussi testé une accélération finale des troupes au contact. Rejetée : ça faisait faux. Un
> mouvement continu, avec un léger balancement latéral, se lit comme une avance décidée. Une saccade se
> lit comme un bug.
>
> La règle que j'en garde : une carte est un instrument de mesure, une illustration est un instrument de
> récit. Confondre les deux, c'est demander à un thermomètre de raconter une histoire.

⚠️ **Avant publication** : sujet de guerre. Le ton documentaire passe bien sur LinkedIn, mais s'assurer
que le contexte éditorial du profil le porte déjà (pas en 1er post si le profil est vierge).

---

## Notes d'exécution

- **Vérifier avant chaque post** : les faits techniques cités viennent de fichiers de mémoire qui
  peuvent être périmés. Croiser avec le code réel si le post affirme quelque chose de précis
  (règle CLAUDE.md « vérifier CODE + VISUEL »).
- **La vidéo/le rendu en commentaire**, jamais dans le corps.
- **Traduire tout jargon** : « beat » → « scène », « registre » → « type d'image », « forced-alignment »
  → « calé sur la voix au mot près ».
- **Décision non tranchée** : assumer publiquement l'usage de l'IA dans le process (cf. stratégie § 6).
  Les 3 posts ci-dessus le mentionnent franchement, en position d'outil arbitré. À valider par Aziz.
