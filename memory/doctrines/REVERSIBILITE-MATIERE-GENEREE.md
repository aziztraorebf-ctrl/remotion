# DOCTRINE — La REVERSIBILITE est le critere n°1 de toute matiere generee

> Etablie le 2026-09-06 par Aziz, sur le contrat chill-meter (Abigail/Upwork).
> ⭐ S'applique a **TOUT bloc client**, pas seulement celui-la. Vaut des qu'on fait passer
> une image par un generateur (Gemini, GPT-image, Recraft, MiniMax...) avant de l'animer.

## LE PRINCIPE (mots d'Aziz, 06/09)

> « Le critere devrait etre la REVERSIBILITE, meme si ce n'est pas nous qui creons
> directement et controlons. [...] Non seulement ca nous permet d'atteindre des rendus
> qu'on ne pourrait pas avoir juste avec du SVG, mais si bien fait, ca nous permet de
> revenir en arriere et de modifier par nous-memes, PAR SECTION, s'il faut. »

**On ne remplace jamais une matiere validee : on POSE une couche par-dessus, extraite,
dosable, et retirable d'une ligne.**

## ⭐ POURQUOI C'EST UN CRITERE ECONOMIQUE, PAS UNE PREFERENCE DE METHODE

C'est **le seul moyen de facturer un TOUR DE REVISION au lieu d'une RECONSTRUCTION**.
Une matiere irreversible transforme chaque « finalement, un peu moins » du client en
re-generation + re-validation de TOUT l'objet. Une matiere reversible transforme la meme
phrase en changement d'un parametre.
→ Lien direct avec `memory/projects/CHANTIER-CADRAGE-REVISIONS-CLIENT.md` : ce qui rend
un client couteux, ce n'est pas qu'il change d'avis — c'est que notre matiere ne sache pas
revenir en arriere.

## ⛔⛔ LA REVERSIBILITE NE VIENT JAMAIS DU GENERATEUR — ELLE S'OBTIENT PAR EXTRACTION

Le modele ne produit **jamais** du reversible : il produit une image entiere, et il y
glisse des initiatives qu'on n'a pas demandees. Mesure du 06/09 sur la rouille :
- **Voie A** (regeneration complete) : matiere la plus riche, MAIS le modele a **allume la
  LED verte de sa propre initiative** (939 px) et redessine charnieres et aerations.
  → objet different, a revalider en entier. Irrecuperable comme tour de revision.
- **Voie B** (calque extrait de A) : on garde de A **uniquement les pixels qui se
  rechauffent** (gain R-B > 12), on masque l'ecran et le panneau POWER, et on repose ca en
  RGBA sur l'image validee. Metal, details, LED eteinte : rien d'autre ne bouge.

⭐ **La bonne generation reste utile : on s'en sert comme SOURCE DE MATIERE, pas comme
livrable.** On genere large, puis on extrait etroit.

## LA PARADE EST TOUJOURS LA MEME : « ne garder que ce qui <verbe> »

Deux cas, meme mecanisme, sur le meme contrat :
| Date | Le modele fait | Ce qu'on extrait |
|---|---|---|
| 04/09 — givre | repeint l'objet en BLEU (metal R-B +7,9 -> -30,7 : la rouille validee disparait) | seulement ce qui **s'eclaircit** |
| 06/09 — rouille | rechauffe tout + allume la LED | seulement ce qui **se rechauffe** (gain R-B > 12) |

→ Formuler le critere d'extraction comme un VERBE MESURABLE sur les pixels, jamais comme
une zone dessinee a la main.

## ⛔ CLIPPER UNE ZONE : ses formes ne sont PRESQUE JAMAIS des rectangles

Poser une couche sur une matiere qu'on n'a pas dessinee suppose de delimiter OU elle
s'applique. Le reflexe du `<rect>` est faux par defaut : une image generee est pleine de
panneaux biseautes, d'angles coupes, de bords arrondis.

**Vecu 2026-09-06, en DEUX passes sur le meme clip** (le bandeau « AbiGirl Reacts ») :
1. Clip rectangulaire -> le bleu debordait sur les cotes ET laissait le haut du panneau
   gris. Ca se lisait comme un aplat plaque par-dessus, pas comme du metal qui s'allume.
2. Corrige en `<polygon>` (octogone)... mais avec un bord droit pose a x=1000 au lieu de
   x=948 : le bleu bavait encore sur la piece cylindrique du chassis. **Aziz l'a vu sur le
   rendu, apres que je l'aie declare corrige.**

⭐ La 2e passe est la vraie lecon : corriger la FORME sans re-mesurer les BORNES, c'est le
pattern « correction appliquee a moitie » — le symptome change, le defaut reste.

**La methode** : zoomer le PNG avec une grille de reperes (crop + `ImageDraw` tous les
10-25 px), LIRE les sommets a l'oeil, et les verifier des DEUX cotes (la symetrie n'est pas
garantie). Une detection automatique par seuil echoue ici : elle capte le chassis autour.

⛔ Et verifier sur le RENDU compose, pas sur le PNG : une bavure de 52 px se voit a l'ecran.

## LA CHECKLIST — avant d'integrer toute matiere generee

1. **Puis-je la retirer d'une ligne ?** Si non, ce n'est pas une couche, c'est un remplacement.
2. **Puis-je la doser ?** Un alpha ou un facteur, pas un choix binaire (cf. les 3 niveaux
   B0/B1/B2 produits en une passe le 06/09).
3. **Qu'est-ce que le modele a change que je n'ai PAS demande ?** Mesurer, ne pas supposer :
   geometrie (bornes du device), zones protegees (ecran, LED, boutons), % de pixels touches.
4. **Ma zone de clip epouse-t-elle la forme reelle ?** (cf. section ci-dessus) Un `<rect>`
   sur une forme biseautee deborde et laisse des angles morts.
5. **Le client peut-il revenir a l'etat d'avant ?** C'est la vraie question : un client qui
   ne peut pas revenir en arriere n'a plus le droit de changer d'avis — et il changera d'avis.

## ⚠️ CE QUE CA NE DISPENSE PAS DE FAIRE

La reversibilite protege la MATIERE, pas le PERIMETRE. Elle ne remplace pas le fait de
poser des choix exclusifs au client (A ou B, pas les deux) — cf. le chantier de cadrage.
Une couche reversible mal cadree se re-dose quand meme dix fois.

Voir [[CHANTIER-CADRAGE-REVISIONS-CLIENT]] ·
`memory/client-sim-tests/upwork-chill-meter/STATUS.md` ·
`memory/starters/STARTER-chill-meter-device-rustique.md` (§ les 3 techniques qui ont debloque)
