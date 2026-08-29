# BANQUES LOTTIE + TECHNIQUE DE GREFFE — quand PRENDRE au lieu de GENERER

> Etabli le **2026-08-28** par MESURE (16 mains gratuites demontees, 2 concours de 5 modeles,
> 3 licences lues integralement). Declencheur : Aziz — *« est-ce que nous ne sommes pas en train
> de nous casser la tete pour rien ? [...] prendre l'existant au lieu de tout le temps vouloir
> le refaire a partir de zero. Ce que je pense les professionnels font beaucoup de leur cote. »*

---

## ⭐⭐⭐ LA REGLE (nuancee par la mesure, PAS un « toujours prendre »)

**CHERCHER d'abord pour l'HUMAIN et l'ORGANIQUE · GENERER pour le reste.**

Preuve, meme journee, meme brief detaille (pieges nommes, consigne d'empilement) :
| Registre | 5 modeles (Gemini 3.1 Pro · GPT-5.6 Sol · Kimi K3 · Grok 4.6 · GLM-5.2) |
|---|---|
| **Objets** (medaille, cadeau, billets, bouton) | ✅ **tous reussissent**, 55 a 104 formes, conformes |
| **Main humaine** | ⛔ **5 echecs sur 5**, tous de la MEME famille |

⛔ Ne PAS generaliser « les modeles dessinent mal ». Voiture, feu de camp, batiment, objet : nos
modeles savent faire.

⭐⭐ **NUANCE MESUREE LE 2026-08-29 — « organique » n'est pas le bon axe.** Fable a reussi une
**tete de chien mascotte** avec image de reference : un cas qu'on aurait classe « organique donc
voue a l'echec ». Son analyse, verifiee sur le fichier (24 primitives sur 50 formes, 3 paths a
topologie libre, 5 paires symetriques) : **une mascotte de face est organique en APPARENCE, objet
en CONSTRUCTION** (symetrie axiale, presque tout en primitives, une seule forme libre par cote).
Une main est l'inverse : topologie libre partout, cinq formes imbriquees, aucune symetrie.
→ Le predicteur utile n'est pas « organique vs objet » mais **la decomposabilite en primitives
symetriques**. Elle dit surtout le COUT : le chien a converge en 3 iterations.

⛔⛔ **CE QUI RESTE VRAI, et une histoire fausse a ne pas relayer** : l'anatomie humaine reste le
trou. Un audit du 29/08 a conclu que « la main a ete DESSINEE avec reference le 28/08, donc
l'humain passe » — **c'est FAUX** (corrige par Aziz). Le geste reel etait une **GREFFE de
structure** depuis un Lottie premium, et le resultat n'est pas anatomique : index en tube droit
sans phalange ni jointure, 3 doigts replies en arcs identiques. Une icone de curseur, pas une
main. ⚠️ Le ratio doigt/paume (0,72, plausible) ne le voyait pas : **le defaut etait STRUCTUREL,
pas proportionnel**.
⭐ Le visage humain stylise reste **NON TRANCHE** — et un dessin statique reussi ne dit rien de
son ANIMABILITE (le visage du pecheur, 07-20, sortait bien et s'animait mal).

⭐⭐ **LA GREFFE N'EST PAS UN PIS-ALLER (precision d'Aziz, 29/08)** : ce fichier la presente comme
le contournement d'une faiblesse. C'est aussi, en soi, **la bonne methode sur un banc d'essai** —
la contrainte de licence porte sur le **LIVRABLE**, pas sur le **TEST**. Sur un test qui reste dans
le workspace, partir de la geometrie reelle est legitime ET meilleur : la silhouette devient une
constante correcte, donc la seule variable mesuree est celle qu'on veut tester (le rig, le pilotage).
⛔ Imposer un dessin original sur un test de RIG y reinjecte l'anatomie — notre trou connu — et fait
conclure sur le mauvais objet. ⭐ Hygiene : declarer en en-tete du fichier de test d'ou vient la
geometrie, pour ne jamais le promouvoir en livrable par megarde.

⭐ **Le concours n'a pas ete inutile en echouant** : il etablit que le manque est REEL et pas un
defaut de brief. 5 modeles, la meme consigne detaillee, 5 echecs de la meme famille = on sait
qu'il ne faut pas re-tenter.
⛔⛔ **CORRIGE une attente de `openrouter-svg.md`** : GPT-5.6 Sol y est le champion de l'organique
(visage du pecheur). **Il a produit une des pires mains** (paume en grappe de bulles).
« Bon sur les visages » ≠ « bon sur les mains ».

---

## ⭐⭐ CE QUE LE DEMONTAGE APPREND (invisible sans ouvrir les fichiers)

### 1. Le doigt NE PLIE PAS
Sur les 3 mains de banque qui « marchent » : **zero morphing de forme** mesure. L'illusion du tap
vient du **DEPLACEMENT de la main** + de **l'onde de contact** qui se propage. Plus simple et plus
robuste que d'animer une articulation. On animait a grands frais ce que personne n'anime.

### 2. Une bonne main est UN SEUL CHEMIN CONTINU
Le probleme du « pouce detache » (2 iterations perdues avec Fable) **disparait** avec la greffe —
parce qu'il n'y a **pas de jointure a rater**. On corrigeait un raccord qui, dans un bon dessin,
n'existe pas. ⭐ Transposable : quand un raccord resiste, se demander s'il devrait exister.

### 3. Le relief « 3D » vient de l'EMPILEMENT, pas des degrades
Mesure sur la piece vendue « Redeem All » : **227 chemins pour 168 remplissages** (~10 formes par
objet), et **seulement 15 degrades**. Un billet = corps + ombre + pli + liseré + reflet + contour.
⛔ **L'aplat generalise est le symptome** qu'on a code au lieu de faire dessiner.
⚠️ Mais imposer l'empilement dans le brief **n'a pas sauve la main** : 2 planches avaient plus de
formes que les autres, sans etre meilleures. **Le volume ne compense pas une anatomie fausse.**

### 4. ⛔ 13 mains gratuites sur 16 sont FIGEES
Un pictogramme qu'on translate, 1 calque, aucun doigt qui bouge. **8 recherches sur 10 tombent
dessus.** Chercher sans critere precis conclut a tort que « ca n'existe pas » — c'est ce qui m'est
arrive sur la 1re mesure. **Critere qui trie** : multi-poses OU calques separes OU orientation ecran.

---

## ⚖️ LES LICENCES — le seul critere qui decide

| | LottieFiles gratuit | **Creattie** |
|---|---|---|
| Modifier | ✅ | ✅ « unlimited edits » |
| Usage commercial | ✅ | ✅ |
| Attribution | non obligatoire | non obligatoire |
| **Transferer au CLIENT** | ⛔ **NON — licence VIRALE** | ✅ **OUI** (§2.4, a UNE entite) |
| Prix | 0 | **48 $/an** · 99 $ a vie · 19,99 $/mois |

⛔⛔ **LOTTIE SIMPLE LICENSE EST VIRALE** : « Modifications to Files are deemed derivative works
and must also be expressly distributed under the same terms ». Une piece qui incorpore cette
geometrie **ne peut pas etre vendue en exclusivite** — le client paie un fichier que n'importe qui
peut reutiliser. ✅ OK pour NOTRE PORTFOLIO (vitrine, pas livrable vendu). ⛔ PAS pour un client.

**Creattie** (100 000+ assets, verifie 2026-08-28) leve exactement ce blocage. Limites reelles :
budget de production < 10 000 $ · < 500 000 diffusions · **1 seule place** (nom perso ou entite) ·
⛔ interdiction de distribuer l'asset **SEUL** (sans impact : on vend une animation composee).
⚠️ Non teste chez nous — decision d'abonnement a prendre par Aziz.

---

## 🔧 LA GREFFE — mode operatoire (prouve, 2026-08-28)

Un `.lottie` est un ZIP contenant un JSON ou **les coordonnees sont en clair**. Extraction triviale.

1. Recuperer le `.lottie` (l'URL `assets-v2.lottiefiles.com` apparait dans le HTML de la page).
2. Convertir les chemins Lottie (`v` sommets + `i`/`o` tangentes **RELATIVES**) en `d` SVG :
   `C (p0+o[i-1]) (p1+i[i]) p1` — attention, les tangentes sont relatives a leur sommet.
3. Normaliser sur la bbox, reposer dans NOTRE structure de `<g id>` nommes.
4. ⛔ **Ne JAMAIS retaper le chemin dans le `.tsx`** : generer un module TS depuis le SVG
   (`assets/extraire-silhouette.py`), sinon les deux versions divergent en silence.

**Resultat mesure** : main greffee = **1 chemin, 15 sommets** vs 24 calques pour la version Fable.
Conversion Lottie 3,32 % d'ecart — **concentre sur les contours** (antialiasing d'un trait de 7 px),
verifie a l'oeil : les deux rendus sont identiques. Meme famille que le 1,95 % du texte vectorise.
Code : `src/projects/_client-sim/repro-redeem/` (`main-greffee.svg`, `MainGreffeeDemo.tsx`).

⭐ **Verdict d'Aziz sur planche anonymisee** : la greffe choisie sans hesitation contre 5 modeles.
*« n'importe qui qui regarde [...] voit une main humaine avec un pouce »*.

---

## ⏭️ LE TEST QUI N'A PAS ETE FAIT (le plus rentable)

⛔ On ne peut PAS *entrainer* un modele depuis notre poste (l'idee d'Aziz d'« entrainer Fable sur
des Lottie existants »). **Mais on peut lui DONNER LA REFERENCE DANS LE BRIEF** — et c'est
peut-etre suffisant : `openrouter-svg.md` dit deja *« avec image-ref tout le monde execute, sans
image personne ne trouve la forme »*, et les 5 echecs d'aujourd'hui etaient **sans reference
visuelle**. **Coût : 1 appel.** A tester avant de conclure que les modeles ne savent pas.

→ recoupe [[feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable]] ·
  [[feedback_reference-image-mimetisme-composition]] · [[openrouter-svg]] ·
  [[CORPUS-REFERENCE-UI]] (le corpus des 22 pieces du studio)
