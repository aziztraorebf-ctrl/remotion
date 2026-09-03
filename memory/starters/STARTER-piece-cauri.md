# STARTER — Pièce portfolio « Le cauri »

> Ouvrir CE fichier en premier pour reprendre ce chantier. Écrit le 2026-09-02 en fin de
> session, contexte chargé — tout ce qui suit est dans des fichiers, rien ne dépend du fil
> de conversation précédent.

## Où on en est exactement

✅ **Fait** : recherche + brief verrouillés · **animatic de travail rendu et validé par Aziz**
(rythme approuvé) · **analyse du continuous flow TED-Ed faite** (10 règles actionnables).
⬜ **Pas commencé** : le dessin, le son.

**Prochaine étape concrète** : faire dessiner **UNE coquille** (pas 7 formes) — agent
`svg-dessinateur`. Elle doit tenir 5 rôles par simple changement d'échelle et de groupement :
objet précieux · point du semis · grain du flux · brique de la colonne · débris. C'est la
règle R6 de l'analyse, et c'est ce qui rend la pièce tenable en coût.

## ⭐ Ce qui a CHANGÉ le 2026-09-02 (2e session)

- **La contrainte de morphing est ASSOUPLIE** (décision Aziz, sur mesure). Le § 4 exigeait
  « topologies compatibles, nombre de points constant » : abandonné. La référence TED-Ed ne
  fait **aucun morph de path** sur 5 min (zéro cas), pour **une seule coupe franche**.
  → Le zéro-coupe repose désormais sur **4 dispositifs nommés** (ancre · iris · réassignation ·
  mise en file) — cf. § 4 du brief, tableau. Toute transition doit en employer au moins un.
- **Le son a 3 règles mesurées** (§ 7 du brief), dont une contre-intuitive : ⛔ **l'effondrement
  se marque par un CREUX sonore, pas par un pic** — couper le lit 0,5 s avant l'impact.
- **L'animatic existe** : `out/_r-and-d/cauri/animatic/animatic_v1.mp4` (20,6 s, gris neutre,
  jetable). Composition Remotion `Cauri-Animatic`, code dans `src/projects/_portfolio/cauri/`.
  Le fichier `animatic-timing.ts` est conçu pour SURVIVRE : le timing s'y règle, le dessin
  définitif le reprend tel quel. Page de suivi : voir `memory/INDEX-LIENS.md`.
- **Mesuré sur l'animatic** : 42 frames uniques sur 42 échantillons (aucun gel) · flux long
  88 % de la largeur vs flux court 17 % (densité ×5,1) · 20,6 s, dans la cible.

## Les 2 fichiers à lire (dans cet ordre)

1. **`out/_r-and-d/cauri/BRIEF-PIECE.md`** ⭐ — le brief complet : propos, chaîne de formes,
   palette, son, et surtout les **5 interdits factuels**. Tout est décidé, rien à re-trancher.
   ⚠️ § 4 et § 7 ont été RÉÉCRITS le 2026-09-02 — lire les blocs marqués « ASSOUPLI » / « règles
   mesurées », ils remplacent ce qu'un souvenir de la 1re session pourrait contenir.
1bis. **`out/_r-and-d/fable-vs-opus-ted-ed-style/source-ted-ed/ANALYSE-CONTINUOUS-FLOW.md`** ⭐⭐
   — les 10 règles R1-R10 (durées de transition, ancre, iris, son). Le § 6 est la partie utile.
2. `out/_r-and-d/cauri/RECHERCHE.md` — le dossier sourcé (576 lignes) si un fait doit être
   vérifié ou approfondi. Distingue explicitement [ÉTABLI] / [DÉBATTU] / [APPROXIMATIF].

## Les décisions déjà prises (ne pas re-discuter)

| Sujet | Décision |
|---|---|
| Nature de la pièce | Portfolio **autonome**, PAS le pilote d'une série (« ce n'est pas non plus le début d'une vidéo complète, ce n'est pas mon but ») |
| Format | 15-25 s, **une seule prise, zéro coupe** |
| Mécanisme | « La valeur tenait à la distance » — inflation par choc d'offre |
| Palette | Tirée du sujet (bleu océan, nacre, ocre, rouge-brun), ⛔ PAS les aplats acides TED-Ed |
| Géographie | Abstraite, distance suggérée — pas de carte |
| Texte à l'écran | 2 repères seulement : « 1845 » et « près de 40 000 tonnes » |
| Traite négrière | ⛔ **NON abordée** — cf. § 3 du brief, raison documentée |
| Son | Dans le brief dès le départ, colonne par colonne |

## ⛔ Le piège principal, à ne pas répéter

**J'avais proposé « 8 000 km » comme repère à l'écran. C'était inventé** — absent du dossier
de recherche. Attrapé en relisant les sources avant d'écrire le brief.
→ Tout chiffre affiché doit venir de `RECHERCHE.md`, jamais d'une estimation de mémoire.

Autres corrections que la recherche a apportées (détail § 3 du brief) : la route principale
du cauri était le **Bengale**, pas l'Afrique ; le cauri ne vit pas en Afrique de l'Ouest.

## Contexte utile

- **Les 3 repros TED-Ed** (réseau, chasseurs, balançoire) sont de la **R&D interne, jamais
  montrées** : `out/_r-and-d/fable-vs-opus-ted-ed-style/STATUT.md`. Ce qu'on en garde, ce
  sont les **rigs** (propagation par graphe, trajectoire+impact, bascule) — réutilisables ici.
- **La vidéo source est conservée** : `out/_r-and-d/fable-vs-opus-ted-ed-style/source-ted-ed/`
  ⭐ Son README liste ce qu'il RESTE à en apprendre — surtout l'analyse du **continuous flow**,
  jamais faite sérieusement, et le relevé du **design sonore**.
- Feedbacks écrits cette session : `morphing-continu-se-prepare-au-dessin` ·
  `son-dans-le-brief-des-le-depart` · `reproduction-fidele-nest-pas-une-piece-portfolio`.

## Ce qu'on cherche à mesurer avec cette pièce

1. ✅ **TRANCHÉ sur l'animatic** : le zéro-coupe tient (42/42 frames uniques). Reste à le
   re-vérifier une fois le vrai dessin en place, avec les 4 dispositifs et non plus la
   structure à particules de l'animatic.
2. Un spectateur non briefé comprend-il « c'était rare, puis ça ne l'était plus » ?
3. **Le coût réel de production d'une scène** — chiffre attendu avant d'envisager quoi que
   ce soit de plus long.
