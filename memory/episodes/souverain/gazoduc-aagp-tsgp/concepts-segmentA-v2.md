# Concepts de storyboard — PHASE 1 (texte, sans dessin)

> Brief source : `/tmp/brief-segA-v2.txt`
> ⛔ Ces modeles n'ont RIEN dessine. La phase 2 (dessin) part de la PARTIE 3 du concept retenu.
> Le choix du concept a dessiner est HUMAIN — ce n'est pas forcement celui que le modele defend.


---

## Kimi K2.5

## PARTIE 1 — TES CONCEPTS

### Concept A — « La Géologie Comparée »
**Idée centrale :** Transformer la carte en coupe géologique schématique pour révéler que le gazoduc transsaharien ne contourne pas le problème (la côte) mais le traverse physiquement, le rendant plus court mais plus « profond » et donc plus sérieux que la ligne côtière qui reste en surface.

**Moteur :** Map (D3) + Object / Métaphore (coupe technique SVG)

**Symétrie croisée :** Deux tubes partent du Nigeria (gauche) vers l'Algérie (droite). Le tube doré est un fil sinueux flottant en surface, long et précaire. Le tube cyan est un cylindre épais, droit, descendant verticalement à travers les strates géologiques (sable, roche, socle), montrant la différence de nature entre « longer » et « traverser ». Aucun texte n'explique cette opposition ; elle est lisible dans l'épaisseur des traits et leur position verticale.

**Le moment 17,3 s :** La carte « se fend » horizontalement pour révéler la coupe. C'est à cet instant que le spectateur comprend visuellement la relation de compétition : l'un est superficiel, l'autre est une incision. Si l'on restait sur la carte plane, les deux traits seraient de simples lignes équivalentes, créant la confusion sur la nature réelle du défi.

**Où le beat retombe à plat :** Si la transition vers la coupe n'a pas lieu, nous restons 55 secondes sur une vue de dessus où deux traits colorés stagnent, indiscernables dans leur statut respectif.

---

### Concept B — « La Frise Temporelle »
**Idée centrale :** Abstraire les deux routes en barres de progression temporelles qui « déroulent » la géographie à plat, transformant l'espace en temps de construction pour montrer que le projet cyan accélère brutalement là où le doré stagne.

**Moteur :** Geometric Data-Viz (D3) + The Cut

**Symétrie croisée :** Deux bandes horizontales parallèles. La bande supérieure dorée représente la côte atlantique : longue, pointillée, ne se remplissant que de 5% (planification diplomatique). La bande inférieure cyan représente le Sahara : courte, initialement pointillée, mais qui se remplit soudainement d'une lumière solide et pulsante à vitesse vertigineuse. La longueur différente des bandes exprime la distance ; l'épaisseur du remplissage exprime l'avancement concret.

**Le moment 17,3 s :** La barre cyan commence son remplissage rapide tandis que la barre dorée reste quasiment vide. C'est le pivot visuel où la compétition bascule. Sans ce contraste de vélocité, on aurait deux lignes qui se dessinent calmement, créant une fausse équivalence entre les projets.

**Où le beat retombe à plat :** Si les deux barres avancent à la même vitesse ou restent statiques, on perd la sensation d'urgence et de concurrence décisive décrite par la voix.

---

### Concept C — « L'Éclipse de Adrar »
**Idée centrale :** Commencer sur la carte pour établir la symétrie des deux routes, puis couper brutalement vers un plein écran de matière filmée (stylisée) du chantier d'Adrar, réduisant la carte à un simple indicateur circulaire, signifiant que la diplomatie spatiale cède le pas à la réalité physique du terrain.

**Moteur :** The Cut / Editing + Filmed Matter + Map (minimale)

**Symétrie croisée :** Les 11 premières secondes montrent les deux traits doré et cyan de même épaisseur sur la carte. Puis, à 11s, un zoom radical commence : le trait cyan s'épaissit progressivement jusqu'à occuper tout l'écran, devenant une tranchée de sable ocre et de mécaniques cyan, tandis que le trait doré s'amincit et disparaît dans un coin. La symétrie est rompue par l'échelle.

**Le moment 17,3 s :** La transition bascule : l'écran est maintenant dominé par des boucles stylisées de pelleteuses et de poussière (flat-vector, tons ocre et cyan), avec seulement un petit cercle en haut à droite montrant l'emplacement sur la carte. Ce changement de registre force l'attention. Sans cette rupture, le chantier resterait une petite vignette sans impact émotionnel.

**Où le beat retombe à plat :** Si l'on conserve le chantier dans l'encart existant (petite vignette) pendant toute la seconde moitié, la révélation du 4 juin 2026 manque de puissance visuelle et reste de l'ordre de l'annotation, pas de l'événement.

---

## PARTIE 2 — CELUI QUE TU DEFENDS

Je défends **le Concept A — « La Géologie Comparée »**.

**Contre le Concept B :** La frise temporelle, bien que claire, sacrifie la géographie réelle qui est essentielle à la compréhension du enjeu saharien. En aplatissant l'Afrique en barres, on perd la sensation de la distance, du désert comme obstacle physique, et du détour côtier. Le documentaire est géopolitique ; l'espace doit rester lisible comme terrain, pas seulement comme durée.

**Contre le Concept C :** L'éclipse brutale vers la matière filmée, bien que dynamique, risque de désorienter. Le passage d'une ligne de carte à un gros plan de pelleteuse sans transition spatiale crée une rupture cognitive : le spectateur perd la relation entre le chantier et la ligne du pipeline. De plus, elle nécessite de quitter la carte pendant plus de 30 secondes, ce qui est long pour un acte censé comparer des routes géographiques.

**Pourquoi le Concept A :** Il résout la « platitude » non en quittant le sujet (la géographie), mais en changeant l'angle de lecture (de plan à coupe). Il conserve la spatialité —cruciale pour comprendre que l'un passe par le Niger et l'autre par la côte— tout en ajoutant la dimension de profondeur qui métaphorise la « gravité » du projet transsaharien. La construction du 4 juin 2026 devient alors l'incarnation concrète de cette profondeur : on voit physiquement le tube se remplir et se connecter aux réseaux algériens, ce que ni la carte plane ni l'encart ne peuvent montrer avec autant de force narrative. C'est la seule solution qui transforme l'information spatiale (la carte) en information stratégique (la difficulté/décision du tracé) sans quitter le cadre géographique.

---

## PARTIE 3 — LA DESCRIPTION DESSINABLE

### CASE 1 — 0-11 s
**CE QU'ON VOIT :** Vue de dessus orthographique de l'Afrique de l'Ouest. Fond radial sombre allant du #0d1f38 (centre) au #050c1a (bords). Les pays sont des aplats #16304f avec des frontières fines #58809f. Au premier plan, deux traits de 4px d'épaisseur partent du Nigeria (bas gauche) : un trait ondulant doré #FFC742 qui longe la côte atlantique vers l'ouest puis remonte ; un trait droit cyan #00C4FF qui monte verticalement vers le nord à travers le Niger. Une plaque discrète #16304f avec bordure #58809f porte « NIGERIA » en bas à gauche ; une autre « ALGÉRIE » en haut à droite. Les deux traits sont complets et lumineux.
**LE GESTE UNIQUE :** les deux tracés se dessinent simultanément depuis le Nigeria vers leurs destinations respectives

### CASE 2 — 11-22.2 s
**CE QU'ON VOIT :** La moitié supérieure de l'image (la carte) se soulève comme un volet, révélant une coupe géologique schématique en dessous. Cette coupe montre trois bandes horizontales distinctes : le socle nigérian en bas (#16304f), une épaisse couche médiane représentant le Sahara (#0d1f38 avec des stries horizontales #58809f suggérant la roche et le sable), et le sol algérien en haut (#16304f). Dans cette coupe, le pipeline doré apparaît comme un fin trait ondulant #FFC742 collé contre la surface supérieure, long et sinueux. Le pipeline cyan est un trait épais et droit #00C4FF entouré d'un halo lumineux #7FD8FF qui descend verticalement à travers les trois couches géologiques. Les deux partent du point Nigeria à gauche et aboutissent au réseau algérien (tuyaux blancs #F4F8FF horizontaux) à droite.
**LE GESTE UNIQUE :** la carte se soulève pour révéler la coupe stratigraphique comparée

### CASE 3 — 22.2-38 s
**CE QU'ON VOIT :** Gros plan sur la section droite de la coupe (région d'Adrar). Le tube cyan #00C4FF est maintenant entouré d'un halo pulsant rouge #FF4B45 qui clignote lentement. Des formes géométriques stylisées blanches #F4F8FF représentant des pelleteuses et des forets apparaissent sur les bords de la tranchée et se déplacent vers le centre. Le tube se remplit progressivement d'un fluide lumineux cyan #00C4FF qui monte depuis le bas vers le haut, tandis que le tube doré en surface reste vide et statique. Le réseau algérien existant (tuyaux blancs horizontaux) est visible à droite, attendant la connexion.
**LE GESTE UNIQUE :** le tube cyan s'illumine et se remplit de lumière pulsante pendant que les engins de construction apparaissent

### CASE 4 — 38-55 s
**CE QU'ON VOIT :** Zoom arrière progressif sur la coupe complète. Le tube cyan est maintenant plein et brillant #7FD8FF, connecté solidement aux tuyaux blancs #F4F8FF du réseau algérien existant à droite. Le tube doré reste vide, transparent et inactif. Un badge circulaire doré #FFC742 apparaît discrètement en haut à droite avec « 4 JUIN 2026 » en petits caractères blancs #F4F8FF au centre. La lueur rouge #FF4B45 s'estompe progressivement, laissant place à une lumière cyan stable indiquant l'acheminement actif du gaz.
**LE GESTE UNIQUE :** zoom arrière révélant la connexion achevée au réseau algérien existant


---

## Grok 4.20 reasoning

**REPONSE**

## PARTIE 1 — TES CONCEPTS

**Concept 1 : « Origine commune, trajectoires antagonistes »**  
**Moteur :** MAP  
**Symétrie croisée :** Depuis un unique point lumineux au Nigeria, deux lignes épaisses s’animent simultanément dans des directions strictement opposées (or vers l’ouest puis nord-ouest le long de la côte, cyan plein nord à travers le Niger et le Sahara), créant une tension visuelle en X inversé parfaitement lisible sans aucun texte.  
**Ce qui tient l’attention sur les 17,3 secondes :** Un flux de particules très contrasté (or lent et paresseux, cyan rapide et nerveux) qui pulse en continu. Sans ce flux différencié, le beat retombe immédiatement à plat dès que les lignes sont entièrement dessinées.

**Concept 2 : « Le Cœur de la Rivalité »**  
**Moteur :** OBJET / METAPHORE  
**Symétrie croisée :** Un cœur stylisé placé au Nigeria pulse et expulse deux artères-gazoducs massives qui partent du même organe mais divergent immédiatement selon des trajectoires croisées et antagonistes (l’une contourne par la périphérie maritime, l’autre perce droit à travers le désert), le cyan devenant progressivement plus vascularisé et lumineux.  
**Ce qui tient l’attention sur les 17,3 secondes :** Le battement organique du cœur lui-même, dont le rythme s’accélère nettement au deuxième beat. Sans ce pouls central et sa variation de tempo, le concept devient une simple illustration statique.

**Concept 3 : « Sable versus Or »**  
**Moteur :** MATIERE FILMEE + LE RACCORD-MONTAGE  
**Symétrie croisée :** Split-screen vertical très marqué : à gauche, un loop de sable ocre teinté cyan qui s’écoule vers le haut à travers des dunes stylisées ; à droite, un loop d’or liquide qui coule lentement le long d’une courbe horizontale. Les deux matières naissent du même point bas (Nigeria) et montent vers le haut de l’écran, matérialisant l’opposition des chemins sans jamais montrer la carte en continu.  
**Ce qui tient l’attention sur les 17,3 secondes :** Le mouvement hypnotique et perpétuel des deux matières en boucle, avec un cut brutal à 22,2 s qui fait basculer la dominance visuelle du côté cyan. Sans le mouvement constant des loops, l’écran devient immédiatement mort.

## PARTIE 2 — CELUI QUE TU DEFENDS

Je défends **le Concept 2 (« Le Cœur de la Rivalité »)**.

Il est le seul à résoudre vraiment le diagnostic du directeur. Il sort complètement du registre « carte + encart » qui a bloqué la séquence pendant des semaines, tout en gardant une lisibilité géographique forte grâce à la position réelle des artères sur la carte très atténuée en fond. Le battement du cœur crée une dramaturgie organique et viscérale qui porte les 55 secondes à lui seul : on *sent* que « ce concurrent, lui, n’attend plus ». 

Le Concept 1, bien que amélioré, reste dans la famille « carte animée » que le réalisateur trouve plate par nature. Le Concept 3 est visuellement puissant mais risque de trop déconnecter le spectateur de la géographie réelle du Sahel et du Sahara, ce qui est dangereux dans un documentaire de géopolitique. Le Concept 2 trouve le juste milieu : il est métaphorique sans être abstrait, change radicalement de registre, et possède un geste unique (le pouls) qui porte toute la narration.

## PARTIE 3 — LA DESCRIPTION DESSINABLE

**CASE 1 — 0 s**  
CE QU’ON VOIT : Fond radial très sombre (#0d1f38 vers #050c1a). Carte d’Afrique de l’Ouest et du Sahara en aplats très discrets (#16304f) avec bordures fines (#58809f). Au-dessus du Nigeria, un grand cœur stylisé vectoriel (contour blanc fin, dégradé du #2E9FD4 au #FFC742) occupe 18 % de la hauteur d’image. De sa partie supérieure partent deux artères très épaisses encore partiellement dessinées : l’une dorée (#FFC742) s’incurve vers la gauche puis remonte le long de la côte, l’autre cyan (#00C4FF) monte droit vers le nord. Plaques de pays en petites capitales blanches : « NIGERIA » en bas, « NIGER » et « ALGERIE » plus haut.  
**LE GESTE UNIQUE :** le cœur s’allume et commence à pulser lentement.

**CASE 2 — 17 s**  
CE QU’ON VOIT : Le même cœur est maintenant plus lumineux et légèrement plus gros à chaque pulsation. L’artère cyan est entièrement dessinée et beaucoup plus épaisse que l’artère dorée ; un flux de petites particules cyan très lumineuses circule rapidement à l’intérieur. L’artère dorée est terminée mais terne et sans particules. La carte en fond reste très discrète. Plaques de pays toujours présentes.  
**LE GESTE UNIQUE :** le flux cyan accélère dans son artère.

**CASE 3 — 26 s**  
CE QU’ON VOIT : Le cœur a nettement grossi et pulse plus vite et plus fort. L’artère cyan atteint maintenant la région d’Adrar en Algérie et brille d’un halo cyan clair. Un petit rectangle sombre à bord clair apparaît près d’Adrar contenant uniquement la date « 4 JUIN 2026 » en blanc. L’artère dorée semble visuellement moins nourrie. Fond carte toujours atténué, palette strictement respectée.  
**LE GESTE UNIQUE :** le cœur passe à un rythme frénétique.

**CASE 4 — 47 s**  
CE QU’ON VOIT : Le cœur est à son maximum de taille et de luminosité, pulsant violemment. L’artère cyan est saturée de flux lumineux et semble presque vibrer. L’artère dorée est visuellement reléguée en arrière-plan par une baisse d’opacité. Une très petite fenêtre rectangulaire apparaît à l’extrémité de l’artère cyan près d’Adrar, contenant une boucle ultra-stylisée de pelleteuse dans le sable ocre (vectorisée, tons chauds). Plaques de pays toujours visibles, aucune autre mention textuelle.  
**LE GESTE UNIQUE :** le cœur pulse à son paroxysme tandis que le flux cyan submerge l’image.


---

## Gemini 3.1 Pro

Voici trois propositions distinctes pour débloquer cet acte. 

## PARTIE 1 — TES CONCEPTS

**Concept 1 : L'Échelle Rompue (Le Macro vs Le Micro)**
*   **L'idée centrale :** Opposer la théorie géopolitique lisse des tracés de pipelines à la brutalité mécanique et concrète d'un chantier qui a déjà commencé.
*   **Le Moteur :** Carte (1) puis Raccord-Montage (6) et Matière Filmée (5).
*   **La symétrie croisée (sans texte) :** Sur la carte, le Nigeria est un point d'origine d'où jaillissent simultanément deux lignes : l'une dorée, lente, qui épouse laborieusement les contours sinueux de la côte ; l'autre cyan, rapide, qui transperce violemment les terres en ligne droite vers le nord.
*   **Ce qui tient l'attention :** À 22,2s, au lieu de faire apparaître un petit encart timide sur la carte, on *tue* la carte. Le beat retomberait à plat si on restait à 10 000 km d'altitude pour parler de pelleteuses. Le raccord brutal vers la matière filmée en plein écran crée un choc de registre qui relance l'acte.

**Concept 2 : La Course Linéaire (Abstraction Géométrique)**
*   **L'idée centrale :** Abandonner totalement la géographie pour transformer l'enjeu en une pure course de distance, de temps et d'obstacles.
*   **Le Moteur :** Data-Viz géométrique (2) — *Aucune carte.*
*   **La symétrie croisée (sans texte) :** Le Nigeria est un axe vertical central. Vers la gauche se déploie une immense courbe dorée complexe (l'Atlantique) qui avance lentement. Vers la droite, une barre cyan massive et très courte percute immédiatement un bloc pré-existant (le réseau algérien). Le contraste visuel de longueur dit tout.
*   **Ce qui tient l'attention :** Un graphique qui se remplit est mécaniquement satisfaisant. À 22,2s, la monotonie est brisée quand la barre cyan change d'état physique : elle se met à hachurer et à "tourner" (pattern SVG en mouvement) sous l'impact d'une ligne de temps qui vient de frapper la date de juin 2026. Sans cette bascule cinétique, l'abstraction géométrique deviendrait ennuyeuse.

**Concept 3 : L'Onde de Choc Souterraine**
*   **L'idée centrale :** Montrer que le gazoduc transsaharien n'est pas qu'une ligne dans le vide, mais le détonateur qui vient réveiller une infrastructure géante et déjà vivante.
*   **Le Moteur :** Carte (1) et Objet/Métaphore (3).
*   **La symétrie croisée (sans texte) :** La ligne dorée s'allonge vers l'océan, dans une zone morte et sombre. La ligne cyan monte à travers le Sahara et, dès qu'elle touche la frontière algérienne, elle agit comme une étincelle : elle illumine instantanément un réseau veineux gigantesque et dense remontant vers la Méditerranée.
*   **Ce qui tient l'attention :** L'acte meurt à 22s si la ligne s'arrête de bouger. Ici, la ligne cyan agit comme un outil de découpe : au moment où la voix parle du 4 juin, le tracé cyan au niveau de l'Algérie "s'ouvre" littéralement en deux sur la carte (masque SVG), révélant en profondeur une texture de sol et un engrenage stylisé qui tourne à même la géographie.

---

## PARTIE 2 — CELUI QUE TU DEFENDS

**Je défends le Concept 1 : L'Échelle Rompue.**

Pourquoi ? Parce que le diagnostic du réalisateur ("je trouve ça plat, ça ne décolle pas") est la conséquence directe d'une erreur classique : **essayer de faire porter une action concrète à un outil macroscopique.** 

La géographie (la carte) est excellente pour expliquer un trajet (Beat 1, de 0 à 22s). Mais elle est incapable d'exprimer l'imminence physique d'un chantier (Beat 2, de 22 à 55s). Si on essaie de garder les deux concepts sur le même écran, on obtient ce que vous aviez : une carte silencieuse avec un encart minuscule qui n'a aucune force.

Le Concept 2 (Data-viz) est trop froid pour la notion de "terrain et pelleteuses". Le Concept 3 (Onde de choc) maintient le spectateur captif de la carte pendant 55 secondes, risquant la même fatigue visuelle. 

Le Concept 1 utilise l'arme la plus simple et la moins chère du montage : le *Cut*. En passant brutalement de l'abstraction silencieuse d'une carte à échelle continentale au gros plan dynamique (flat-vector) d'une pelleteuse en plein écran, on réveille l'oeil. On épouse la narration : la théorie diplomatique (Beat 1) vs la boue, le métal et l'action (Beat 2).

---

## PARTIE 3 — LA DESCRIPTION DESSINABLE 

*(Cahier des charges strict pour générer les 4 cases horizontales du Concept 1)*

**CASE 1 — 12,0 s**
- **CE QU'ON VOIT :** Une carte plate en vue de dessus. Le fond océanique est bleu très sombre (#0d1f38), les terres sont bleu marine (#16304f) avec des frontières fines gris-bleu. Dans la moitié basse, un point d'ancrage lumineux blanc surmonté de la plaque "NIGERIA". De ce point, un fin trait doré part vers la gauche, frôlant la limite entre la terre et l'eau. Exactement depuis ce même point, un trait plein, épais et cyan (#00C4FF), parfaitement droit, monte vers le haut de l'image, coupant rudement à travers le territoire uni.
- **LE GESTE UNIQUE :** Les deux lignes divergent.

**CASE 2 — 21,5 s**
- **CE QU'ON VOIT :** La carte a glissé vers le haut. Le trait doré n'est plus visible. Le trait cyan massif atteint une vaste zone territoriale bleu clair (#2E9FD4) portant la plaque "ALGÉRIE". À l'instant exact où le trait cyan touche ce pays, l'intérieur complet de la forme de l'Algérie est rempli par un maillage dense et complexe de dizaines de fines lignes cyan, très lumineuses, qui montent toutes vers le haut de l'image. 
- **LE GESTE UNIQUE :** Le réseau existant s'illumine.

**CASE 3 — 23,0 s**
- **CE QU'ON VOIT :** La carte a totalement disparu. L'image est un gros plan serré et graphique (style vectoriel aplat, pas de 3D) sur les dents et le godet massif d'une pelleteuse. L'engin est dessiné en silhouettes bleu très foncé (#050c1a) et en touches de cyan. Il mord dans un sol géométrique formé de larges blocs obliques bleu marine et cyan. Au centre de l'image, en très grandes lettres blanches et épurées, flotte la date : "4 JUIN 2026".
- **LE GESTE UNIQUE :** Cut brutal sur l'action.

**CASE 4 — 45,0 s**
- **CE QU'ON VOIT :** Toujours dans le monde vectoriel de la matière filmée, le cadre s'est légèrement élargi. La pelleteuse (aux formes géométriques et aux aplats parfaits) se découpe contre un ciel bleu sombre. Sur la gauche de l'écran flottent simplement une fine plaque blanche avec le mot "ADRAR", et un petit point cyan auréolé d'un léger flou (glow) qui clignote juste à côté du texte. 
- **LE GESTE UNIQUE :** La machine creuse l'écran.


---

## GPT-5.5

## PARTIE 1 — TES CONCEPTS

### CONCEPT 1 — **LE COMPAS ET LA CICATRICE**
**Idée centrale :** le gazoduc transsaharien n’est pas seulement une autre ligne sur la carte : c’est une ligne plus directe qui se transforme visuellement en chantier réel.

**MOTEUR utilisé :** carte + objet/métaphore + le raccord-montage.

**Comment il exprime la SYMÉTRIE CROISÉE sans texte explicatif à l’écran :**  
Les deux projets partent du même point au Nigeria. Le tracé doré fait un grand arc côtier, presque comme un détour dessiné au compas. Le tracé cyan coupe l’intérieur du continent comme une corde tendue. Même origine, même horizon nord, mais deux logiques opposées : contourner / traverser ; ligne diplomatique / ligne qui entaille déjà le sol.

**Ce qui tient l’attention sur les 17,3 secondes, et où le beat retomberait à plat si on ne faisait rien :**  
L’attention tient parce que la ligne cyan change de nature : elle commence comme un tracé cartographique, puis devient une incision, puis se raccorde à un réseau déjà lumineux en Algérie. Le danger serait de rester sur “un trait qui se dessine + un encart de pelleteuse” : une fois le trajet compris, l’image n’a plus rien à révéler pendant que la voix parle du chantier.

---

### CONCEPT 2 — **LES DEUX TUYAUX**
**Idée centrale :** quitter totalement la carte pour montrer deux infrastructures comme deux conduites issues de la même vanne : l’une fait un long détour, l’autre s’emboîte directement dans un réseau déjà sous pression.

**MOTEUR utilisé :** objet/métaphore + data-viz géométrique.  
**Concept non map-based.**

**Comment il exprime la SYMÉTRIE CROISÉE sans texte explicatif à l’écran :**  
Au centre bas de l’image, une même sortie alimente deux conduites. La conduite dorée longe le bord de l’écran, avec beaucoup de coudes et de segments. La conduite cyan traverse en diagonale, plus courte, et vient se brancher sur un collecteur supérieur déjà animé par des impulsions lumineuses. Le spectateur voit immédiatement : même départ, deux architectures, mais une seule semble déjà rejoindre une machine existante.

**Ce qui tient l’attention sur les 17,3 secondes, et où le beat retomberait à plat si on ne faisait rien :**  
L’attention tient dans le raccord mécanique : la conduite cyan n’est pas seulement dessinée, elle vient s’aligner, puis une bague de connexion se verrouille dans le réseau algérien. Le beat retomberait si l’on gardait deux lignes parallèles abstraites : sans changement d’état, le dispositif deviendrait un schéma décoratif.

---

### CONCEPT 3 — **LE RÉSEAU QUI ÉTAIT DÉJÀ LÀ**
**Idée centrale :** la scène passe progressivement de la géographie au réseau : le sujet n’est plus “où passe la ligne”, mais “à quoi elle se branche”.

**MOTEUR utilisé :** carte + data-viz géométrique + le raccord-montage.

**Comment il exprime la SYMÉTRIE CROISÉE sans texte explicatif à l’écran :**  
La carte réelle apparaît d’abord. Puis les terres se simplifient jusqu’à ne laisser que les nœuds et les connexions : Nigeria, Niger, Algérie, puis les lignes algériennes vers le nord. Le tracé doré reste périphérique, long, contournant. Le tracé cyan devient un segment central qui rejoint un réseau préexistant. La symétrie est lisible par la composition : une boucle extérieure contre une diagonale qui trouve une prise.

**Ce qui tient l’attention sur les 17,3 secondes, et où le beat retomberait à plat si on ne faisait rien :**  
L’attention tient par le changement de registre : carte réelle → abstraction réseau → retour local sur Adrar. Le risque, si rien ne change, est que la mention d’Adrar et de Sonatrach ne produise qu’un zoom de plus sur la carte, donc exactement le problème actuel : un point qui clignote pendant que la narration fait tout le travail.

---

## PARTIE 2 — CELUI QUE JE DÉFENDS

Je défends **LE COMPAS ET LA CICATRICE**.

C’est le plus solide parce qu’il garde l’ancrage géopolitique réel — Nigeria, Niger, Sahara, Algérie — tout en sortant du simple registre cartographique. Il donne une progression visuelle nette : d’abord la concurrence entre deux tracés, ensuite la différence de logique entre détour côtier et traversée directe, enfin le basculement décisif vers le chantier. La scène ne repose donc plus sur “regarder une ligne apparaître”, mais sur une ligne qui change de statut.

Je le défends contre **LES DEUX TUYAUX** parce que ce concept est graphiquement puissant, mais plus risqué : en quittant complètement la carte, on peut perdre la spécificité géographique du Sahara, du Niger et de l’Algérie. Or cette portion de narration a besoin de faire sentir le raccourci territorial, pas seulement l’efficacité mécanique.

Je le défends contre **LE RÉSEAU QUI ÉTAIT DÉJÀ LÀ** parce qu’il reste plus proche d’une solution de carte intelligente. C’est meilleur que l’état actuel, mais le danger est de retomber dans un langage de lignes, nœuds et pulses. **Le Compas et la Cicatrice** a une image plus mémorable : la route concurrente n’est pas seulement tracée, elle entaille la carte.

---

## PARTIE 3 — LA DESCRIPTION DESSINABLE

### CASE 1 — 0,0 s

**CE QU’ON VOIT :**  
Plan large horizontal 16:9 sur une carte réelle de l’Afrique de l’Ouest et du Nord. Fond en dégradé radial bleu nuit, de `#0d1f38` au centre vers `#050c1a` sur les bords. Les terres sont en aplats `#16304f`, avec frontières fines `#58809f`. Le Nigeria est rempli en bleu actif `#2E9FD4`, légèrement plus lumineux que les autres pays. Une petite plaque sombre à bord clair porte uniquement le nom **NIGERIA**. Depuis le sud du Nigeria, un long tracé doré `#FFC742` longe déjà la côte atlantique vers le nord-ouest, fin et continu. Au-dessus du Nigeria, un petit point blanc-cyan très lumineux sert de pivot. Une grande forme de compas très simplifiée, en traits blancs fins et cyan pâle, est posée par-dessus la carte : une branche pointe vers la côte atlantique, l’autre est encore fermée près du pivot.

**LE GESTE UNIQUE :**  
Le pivot s’allume.

---

### CASE 2 — 10,8 s

**CE QU’ON VOIT :**  
Même carte, mais la composition est plus tendue autour du Nigeria, du Niger et de l’Algérie. Les plaques **NIGERIA**, **NIGER** et **ALGÉRIE** sont visibles, petites, sombres, sans autre texte. Le tracé doré côtier reste présent mais légèrement atténué, comme placé en arrière-plan. Une ligne cyan `#00C4FF`, plus vive et plus droite, part du même point au Nigeria, traverse le Niger, remonte le Sahara et se dirige vers l’Algérie. La branche mobile du compas est maintenant ouverte vers le nord : elle accompagne visuellement la diagonale cyan. La ligne cyan est plus épaisse que la ligne dorée et possède un léger halo bleu clair `#7FD8FF`.

**LE GESTE UNIQUE :**  
La ligne tranche.

---

### CASE 3 — 22,2 s

**CE QU’ON VOIT :**  
Coupe nette vers un cadrage rapproché sur le sud de l’Algérie, toujours en carte réelle. Le pays **ALGÉRIE** occupe presque tout le cadre, en bleu actif `#2E9FD4`, avec les pays voisins en bleu sombre. Les frontières restent fines et froides. Le tracé cyan entre par le bas du cadre et arrive dans une zone désertique intérieure. À cet endroit, la ligne n’est plus un simple trait : elle s’élargit en une ouverture sombre, comme une fente horizontale dans la carte, bordée de deux lèvres cyan lumineuses. À côté de cette fente, une très petite silhouette plate de pelleteuse en blanc cassé `#F4F8FF` et cyan est visible, sans détail réaliste, orientée vers la ligne ouverte. Aucun encart, aucun badge, aucun libellé.

**LE GESTE UNIQUE :**  
La carte s’ouvre.

---

### CASE 4 — 43,0 s

**CE QU’ON VOIT :**  
La caméra est revenue à un cadrage plus large sur l’Algérie et la Méditerranée. Le sud algérien avec la fente cyan est visible en bas du cadre. Depuis cette zone, plusieurs lignes cyan et bleu clair remontent vers le nord de l’Algérie, puis vers la côte méditerranéenne. Ces lignes sont plus fines que le gazoduc principal, mais nombreuses, comme un réseau existant. Certaines portions brillent en blanc `#F4F8FF`, créant une impression d’impulsions dans les conduites. La route dorée atlantique est encore visible très loin à gauche, fine, longue, en périphérie. La plaque **ALGÉRIE** reste la seule plaque dominante. L’ensemble de la carte est sombre, avec le réseau cyan comme élément le plus lumineux.

**LE GESTE UNIQUE :**  
Les réseaux s’allument.
