# SVG genere par un LLM : les 4 defauts a chercher AVANT de juger le dessin

Un SVG genere peut etre XML-valide, scorer 100/100 au gate de conformite, et rester
visuellement casse. Ces 4 defauts sont invisibles a la lecture du code et au gate — il
faut les chercher explicitement, dans cet ordre, avant de juger le dessin.

**1. ⛔⛔ Les arcs en `stroke` SANS `fill="none"`** (le plus frequent et le plus grave)
Un `<path stroke="..." />` sans attribut `fill` HERITE du fill de son groupe parent et se
remplit. Sur le reveil : **73 paths** concernes, chacun se remplissant du gris sombre du
parent — deux bandes noires barraient le cadran.
⭐ Systemique sur les objets RONDS (beaucoup d'arcs de reflet). Correction mecanique :
`re.sub(r'<path(?![^>]*\sfill=)([^>]*\sstroke=[^>]*)>', r'<path fill="none"\1>', svg)`

**2. Les arcs aux rayons incoherents**
`M112 413 A253 253 ... A247 247 ...` — deux arcs partant du meme point avec des rayons
DIFFERENTS ne forment pas un croissant fin mais une **lentille geante**. Chercher les
formes dont la bbox depasse largement leur role suppose (un « reflet » de 480 px de large).

**3. Les apostrophes simples**
Le modele peut ecrire `id='x'` : XML parfaitement valide, mais **invisible a toute regex
`id="`**. Mes controles affichaient « 0 id » et « 1 style= » — deux faux diagnostics.
→ normaliser en entree (fait dans `scripts/tools/svg-vers-calques.py`).

**4. Une ouverture comblee**
Le modele remplit parfois une zone qui, sur la photo, laisse voir ce qu'il y a dessous
(la cuvette sous la platine). Invisible sans comparer photo et dessin **cote a cote** sur
la zone — c'est Aziz qui l'a vu, pas moi.

**Why:** les 4 sont apparus sur le meme fichier le 2026-09-05, tous apres un 100/100 au
gate. **Le gate verifie la CONFORMITE (pas de filtre, ids uniques, XML valide), jamais le
RENDU.** Un score parfait ne dit rien de ce qui s'affiche.

**How to apply:**
- Rendre chaque groupe ISOLEMENT (`--lister` puis rsvg-convert) et REGARDER, avant tout code.
- Comparer photo et dessin cote a cote, zone par zone, quand il y a une reference.
- ⛔ Ne jamais conclure « le dessin est bon » sur la foi du gate seul.

Lie a [[rapport-vert-ne-prouve-rien-regarder-l-image]],
[[photo-de-reference-bat-la-liste-d-organes]], [[limite-d-un-dessin-ouvrir-les-d-avant-de-conclure]].
