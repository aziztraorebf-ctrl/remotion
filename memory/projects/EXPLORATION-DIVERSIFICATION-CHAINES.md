# Exploration — Diversification de chaînes (réflexion future, PAS court terme)

> Créé 2026-06-14. NE PAS confondre avec NEXT-ACTION (court terme/prochaines sessions).
> Ce fichier = pistes stratégiques à maturité variable, à reprendre quand Kora & Cartes sera stabilisé.
> Aucune de ces pistes n'est à lancer maintenant. C'est de la matière de décision préservée.

---

## Contexte : le studio est portable

Constat fondamental (Aziz 2026-06-14) : la vraie force n'est PAS la niche GéoAfrique, c'est le STUDIO
data-driven construit dessous (Remotion + Mapbox frame-driven + PixelLab + data-viz + pipeline recherche
TubeLab/last30days + publication TryPost/Postiz + DA-brief gate). Ce studio peut servir d'autres niches
2-3x plus vite qu'à l'époque, parce que le pipeline est rodé.

Le moat n'est pas le sujet — c'est l'exécution. Voir analyse "faceless niches" plus bas.

---

## Les chaînes de référence analysées (méthode décodée)

### Medieval Mindset (188k subs) — voir feedback_medieval-mindset-methode.md
Pont temporel présent↔passé + ouverture par personnage + titre dissonant. On prend la mécanique, pas le ton.

### Ear to Hear (909k subs, 1.4M vues sur "explained as a video game") — voir feedback_explain-like-video-game.md
"Concept expliqué comme un jeu vidéo" : métaphore filée jeu + 3 couches visuelles (pixel art / doc réel /
liaison). Formalisé en registre Atlas dédié : doctrines/ATLAS-FORMAT-VIDEO-GAME.md.

### One Person Business — "15 NEW Faceless Niches Blowing Up" (2026-06-12)
15+ chaînes faceless qui explosent en 30 jours. Pattern écrasant : HISTOIRE / NOSTALGIE / OUBLIÉ / GUERRE.
Le mot "Forgotten" apparaît 4x dans la liste. RPM le plus élevé = 11$ (Forgotten Frugal America, seniors US).
4 leviers communs : (1) vidéos longues, (2) produit digital ajouté (ebook IA 10-47$, marge ~100%),
(3) ciblage explicite audience américaine/senior dans le titre, (4) fenêtre algo actuelle favorable aux
nouveaux. EXÉCUTION = slideshow / IA générique / stock footage = COPIABLE en 30 jours (raison pour laquelle
il peut le révéler à 23k personnes). Notre studio n'est PAS copiable en 30 jours = notre défense durable.

**Sujets prouvés massifs par cette vidéo : histoire oubliée, empires, guerres, savoir ancien, frugalité/
nostalgie — exactement le terrain d'Atlas, mais eux le servent en slideshow.**

---

## ⚠️ DÉSACCORD DURÉE — position Aziz (importante, contre la doctrine "30-50 min")

La vidéo One Person Business pousse le 30-50 min (plus d'ads, YouTube favorise le long). **Aziz n'est PAS
d'accord pour NOTRE cas.** Sa position :

- **Le sweet spot = 8 à 10 minutes** (parfois un peu moins). Pas 30-50 min.
- Le 30-50 min est facile en slideshow ET marche SI les gens restent jusqu'au bout et reviennent (satisfaction
  réelle). Mais en slideshow c'est du remplissage qui tolère la longueur.
- Pour un concept EXIGEANT comme Atlas (full Atlas), 8-10 min est le point où ça reste unique et excellent
  SANS diluer. Même si on place moins d'ads, on crée quelque chose d'inimitable. C'est ce qui a poussé Atlas
  dès le début. Au-delà de 10 min, un Atxs full devient "challenger" (dur à tenir au niveau premium).
- Qualité > volume d'ads. Le revenu viendra du produit digital + de la fidélité, pas de l'empilement de pubs.

**Atout Remotion pour tenir 8-10 min sans face-cam (insight Aziz) :** les inserts PLEIN ÉCRAN Remotion
(comme dans Mansa Moussa) permettent de ne PAS tout faire sur la carte. En format horizontal, on peut tenir
des sessions de 20s+ sur un insert (data-viz, chiffre, tableau d'enquête EvidenceBoard) — ça joue le rôle
qu'aurait une section footage ou face-cam chez les autres. C'est notre respiration visuelle ET notre
différenciateur (personne en faceless n'a ça avec ce niveau de production).

---

## Les pistes de diversification (comparées)

### Piste A — Immobilier / économie canadienne (FR)
Créneau VIDE dans un format CONNU. CPM élevé (10-30$, immobilier S-tier). Voix FR existe. Réutilise
Mapbox + data-viz (~80%). POC fait : "Nord Données" (out/episodes/_r-and-d/poc-immobilier-qc/). Risque
éditorial faible. Plafond : marché Canada FR plus petit.

### Piste B — "History as a video game" (anglais ou FR) ⭐ le plus différenciant
Format QUASI INÉDIT dans un marché ÉNORME (anglophone). Réutilise le STACK COMPLET (Mapbox + PixelLab +
data-viz + métaphore = ~85%, le seul concept qui utilise TOUT). CPM histoire moyen (4-7$). Barrière voix
anglaise MOINS bloquante ici (60% du contenu est visuel/universel — la carte et le perso portent le récit).
Personne ne combine les 4 couches : Ear to Hear a le concept sans la carte, AGL a la carte sans l'incarnation.
Garde-fou : concepts/systèmes OUI, drames humains NON (ATLAS-FORMAT-VIDEO-GAME.md).

### ✅ POC HUD validé (2026-06-14) — le maillon faible tient
Test ciblé du SEUL vrai inconnu : le cartouche-HUD premium sur carte Atlas, sans basculer enfantin.
Verdict : CONCLUANT. Cadre parchemin + Cinzel + jauge "Or contrôlé" en pastilles dorées + zones aurifères
qui s'illuminent (mécanique zone de contrôle 4X) + Mansa qui marche. Registre "Civilization/atlas ancien"
atteint, zéro couleur primaire. Render full HD headless du 1er coup (après fix `<Img>` hors `<svg>`).
Code : `src/projects/_rnd/poc-mali-videogame/PocMaliVideoGame.tsx` (compo `PocMaliVideoGame`).
Render : `out/episodes/_r-and-d/poc-mali-videogame/poc-hud-v1.mp4` · catbox p9droa.
AJUSTEMENTS si on pousse (réglages, pas blocages) : grossir le sprite OU zoomer caméra dessus quand il
porte le récit (se perd à l'échelle continent) · doser le grain papier (trop présent) · équilibre compo
(penche à gauche). Décision Aziz sur le GOÛT du registre = en attente.
Scripts démo (récit simple Mali + système route commerciale) supprimés au ménage du 2026-07-31,
piste jamais lancée depuis mai — à réécrire si la piste redémarre. Faisabilité : récit = coût
Atlas+habillage ; système (route, Peste) = vrai chantier (logique d'état + jauges synchro).

### Multiplicateur transversal à exploiter (emprunté aux faceless)
**Le produit digital ajouté** (ebook/guide créé une fois, vendu 10-47$, marge ~100%). C'est le multiplicateur
de revenu qu'on n'exploite pas. Transforme un CPM moyen en revenu réel. À activer quand une chaîne a une audience.

---

## Séquencement recommandé (PAS un choix exclusif)

1. **Kora & Cartes reste prioritaire** jusqu'à avoir testé le Long Format 8-10 min (le vrai test jamais fait).
2. **Format "history as a video game" = meilleur pari long terme** (exploite tout le studio) — mais PROUVER
   d'abord avec UN POC (HUD + framing + incarnation sur carte, 60-90s) avant d'en faire une chaîne.
3. **Piste canadienne = réserve** "CPM élevé / risque faible" si on veut monétiser vite.

**Danger principal : la dispersion.** 3 directions possibles. Le studio portable est un atout, mais ne pas
lancer 3 chaînes à la fois. Tester séquentiellement.

---

## Sujets candidats prouvés (intersection demande × notre stack)

Basé sur TubeLab + last30days (2026-06-13/14) — demande RÉELLE multi-plateforme :
- **Mali / Mansa Moussa / Timbuktu / or** : sujet le plus répété de la conversation sociale actuelle
  (TubeLab 563k vues 9x ; last30days = dominant TikTok+X+IG). ⚠️ Mansa Moussa pas 100% consensuel (héros pour
  les uns, figure complexe pour d'autres — commerce incl. esclaves). Ne PAS refaire à l'identique du troupeau.
- **Empires "oubliés"** : Songhai (plus grand que l'Europe de l'Ouest), Kush (pharaons noirs), Great Zimbabwe
  (or/ivoire, murs sans mortier), Aksum. Angle "richer than Europe / before Oxford" = pont temporel viral.
- **Commerce transsaharien** : neutre politiquement, riche en mécaniques de jeu, sprites caravane déjà là.
- L'émotion dominante = "on nous l'a caché/effacé" → PUISSANT mais piège militant. Rester sur l'émerveillement
  (richesse, échelle, ingéniosité), jamais le grief. Charte "analyste, pas militant".
- **Peste 1347 vue du système commercial mondial (angle Aziz 2026-06-14)** ⭐ candidat sérieux, peut-être AVANT
  le Mali. ⛔ DISTINCTION CRITIQUE : on NE gamifie PAS la peste/la mort (drame humain = règle d'or interdit, type
  Plague Inc. proscrit). On gamifie le RÉSEAU COMMERCIAL mondial de 1347 (routes Afrique/Europe/Asie, or/sel/soie/
  épices) — la peste devient l'ÉVÉNEMENT IMPRÉVU qui frappe le système (même structure que le pèlerinage Mali :
  conséquence non anticipée). Angle africain différenciant : "pourquoi la peste a moins touché l'Afrique
  subsaharienne" = question de GÉOGRAPHIE du système (Sahara barrière, où le réseau s'arrête la maladie s'arrête)
  — prouvé sans concurrent YT (TubeLab, mid-form Peste). Ton GRAVE/analyste sur les morts, grammaire de jeu sur le
  SYSTÈME uniquement. Avantages : crossover Afrique/Europe plus original que Mansa Moussa (saturé) + matière/assets
  de l'épisode Peste existant réutilisables. ⚠️ NE PAS toucher au short Peste 1347 actuel (presque fini, Atlas
  classique) — c'est un FUTUR épisode du format video-game.

---

## ⭐⭐ AXE "AFRIQUE-COMME-TERRAIN" (2026-08-04, discussion Aziz + 2 réponses GPT-5.6)

> Distinct de la diversification de chaîne ci-dessus (qui envisage sortir de la niche). Ici on RESTE sur
> Kora & Cartes, on garde l'Afrique comme fil conducteur, mais on élargit le TYPE de sujet : pas seulement
> "tel État contre tel État", aussi "comment fonctionne [mécanisme universel], incarné par un cas africain".
> Aziz a testé l'idée avec GPT-5.6 : 2 réponses obtenues, la 1ère proposait des sujets 100% universels
> (paiement carte, avions, supermarchés — SANS lien Afrique), la 2e (jugée meilleure par les deux) proposait
> de garder l'Afrique comme terrain d'observation plutôt que sujet exclusif. **On retient la 2e, pas la 1ère.**
> Constat de fond : ce n'est pas une idée neuve — cacao (chaîne de valeur), Muraille Verte (écologie),
> mobile money/Silicon Savannah (fintech), Peste 1347 ci-dessus (réseau commercial) sont DÉJÀ ce patron. On
> ne l'avait juste pas nommé comme catégorie à part, donc pas exploité systématiquement.

**Exemples GPT (réponse 2, filtrés Afrique) à valider/rejeter en vraie recherche, pas pris tels quels** :
internet sous-marin (câbles qui relient l'Afrique), mobile money/M-Pesa (déjà fait — Silicon Savannah,
5 beats produits 2026-06, à vérifier si publié avant de le refaire), chaîne de valeur cacao (déjà fait et
publié, pattern `TabletteMorphBarre` réutilisable pour café/or/cobalt), coût d'envoi d'argent en Afrique,
pourquoi certains pays africains ont plusieurs capitales, électricité jusqu'à une maison africaine.

**2 pistes concrètes trouvées le 2026-08-04** (TubeLab, seed Max Bellona, méthode corrigée — voir
[[feedback_tubelab-search-outliers-seul-insuffisant]]) qui vont dans ce sens sans être universelles à 100% :
- **L'Union Africaine qui fait volte-face sur le Burkina Faso** (Sahel Horizon, 2026-08-04, 5.4k vues) —
  MOINS "Afrique-comme-terrain" que les 2 ci-dessus, mais même famille : c'est un MÉCANISME institutionnel
  (pourquoi une organisation qui sanctionnait hier change de ton) plutôt qu'un rapport de force État-État.
  Pas encore fact-checké — le fait précis du "changement de ton" reste à vérifier avant tout script.
- **La guerre du Biafra (1967-1970)** — conflit historique STABLE (pas d'actu mouvante à re-vérifier en
  cours de prod), jamais traité par nous ni concurrents FR directs, ratio TubeLab élevé (7x). Moteur
  RÉCIT/CHRONOLOGIE classique, pas un "mécanisme universel", mais candidat solide en parallèle.

**Ce qui reste à faire avant de lancer quoi que ce soit** (pas fait le 2026-08-04, session limitée à
TubeLab+last30days sans le protocole complet) : relancer le VRAI workflow SUJET-PRIME 6 étapes
([[doctrines/SUJET-PRIME-SUR-PRODUCTION]]) sur 2-3 pistes "mécanisme universel + vecteur Afrique" pour
avoir un vrai GO/NO-GO avec angle et pré-titre, pas juste un signal TubeLab brut. Bénéfice additionnel
noté par Aziz : ce type de sujet (mécanisme, pas affrontement) est aussi un bon terrain pour tester le
pipeline SVG narratif (personnages stick-figure, scènes-lieu) sur un sujet neuf, hors calendrier Souverain
habituel — a mentionner comme critère de sélection si plusieurs pistes sont à égalité.

## ⭐⭐ SESSION 2026-08-12 — bilan analytics + exploration approfondie, plusieurs pistes rejetées

> Suite directe de l'axe ci-dessus, déclenchée par un diagnostic analytics complet de Kora & Cartes
> (CTR/rétention/démographie — détail dans [[doctrines/DIAGNOSTIC-FLOP-VIDEO]]). Question motrice d'Aziz :
> la chaîne se limite-t-elle trop aux sujets géopolitiques chargés, alors qu'un public plus large existe
> peut-être pour un registre plus éducatif ?

**Pistes explorées et REJETÉES** (ne pas re-proposer sans nouvel élément) :
- **Ajustement structurel du FMI** — signal réel (Histoires Crépues 375K abonnés, demande explicite en
  commentaires "vite une vidéo sur l'ajustement structurel", 125 likes) mais abandonnée en cours de session
  au profit d'autres pistes, pas rejetée sur le fond — à reconsidérer si les pistes ci-dessous s'épuisent.
- **Empires africains oubliés (Aksoum)** — bon signal TubeLab (2 vidéos indépendantes, même semaine, même
  angle "empire oublié qui rivalisait avec Rome") mais **rejetée explicitement par Aziz** : "un sujet dont
  pas tout le monde se soucie", ne répond pas à l'objectif d'audience élargie.
- **Garder un sujet conflit existant (ex. Soudan) en changeant juste le TON (calme façon TED-Ed) sans
  changer le fond** — rejetée après qu'Aziz a lui-même identifié la contradiction ("c'est moi qui suis
  contradictoire") entre vouloir rester sur l'Afrique moderne ET éviter les conflits.

**Découverte clé — analyse du catalogue TED-Ed entier** (`TubeLab get_channel`, 120 vidéos = échantillon
complet dernière année, 22,8M abonnés) : **AUCUN sujet Afrique, AUCUNE actualité/conflit** dans le top 40
annuel. Le pattern commun qui explique leur succès n'est PAS le sujet — c'est le titre en **question-
curiosité universelle** ("Pourquoi...", "Que se passe-t-il si..."). Seule exception dans tout leur
catalogue historique (hors échantillon annuel) : une vidéo sur Mansa Moussa (registre patrimonial pur).
Cf. [[doctrines/SUJET-PRIME-SUR-PRODUCTION]] étape 3 — méthode "remonter le fil sur catalogue entier".

**Signal marché confirmant le pivot vers l'éducatif** : article "10 Meilleures Niches YouTube Afrique
Francophone 2026" classe "Actualités et politique" en niche À ÉVITER (sensible, monétisation limitée,
annonceurs qui fuient le controversé) et "Éducation/formation" avec la concurrence la plus faible du
classement.

**Piste 4 — rédigée en positionnement complet, puis DÉPASSÉE le même jour** : "pourquoi l'Afrique reste
pauvre" (mécanisme institutions vs géographie), inspirée d'Economics Explained (2,87M abonnés, "MIT Study
Reveals Why Africa Is Still Poor", 2,4M vues, transcript complet lu — structure : interview d'un vrai
chercheur MIT/Nobel Acemoglu, casse la généralisation dès l'ouverture, chaîne causale stricte, finit sur
contre-exemple positif Botswana). Fichier : [[pauvrete-institutions-afrique-POSITIONNEMENT]] — **conservé
comme référence méthode, PAS comme piste active**, voir bandeau en tête du fichier.

**Piste 5 — RETENUE, contre-proposition d'Aziz en fin de session (angle INVERSÉ)** : plutôt que partir du
constat de pauvreté, partir de la croissance — "pourquoi l'Afrique évolue / les pays qui montent",
entrepreneuriat, démographie. Vérification TubeLab confirme un marché **plus solide** que la piste 4 :
"10 PAYS LES PLUS DÉVELOPPÉS D'AFRIQUE" (Afrique Révélée, 403K abonnés) = **1,95M vues, ratio 25x** la
moyenne de la chaîne (un des plus hauts scores vus toute la session) ; écosystème dense de chaînes
entrepreneuriat africain actif (Business Expertiz, Investir Au Pays 1,23M abonnés, L'Investisseur Africain
584K) — plus régulier en volume que le filon "dette/ajustement structurel".

**⭐ PROCHAINE SESSION — reprendre ici** : relancer le protocole SUJET-PRIME 6 étapes complet sur la
piste 5 ("pourquoi l'Afrique évolue / pays qui montent") pour obtenir un vrai GO/NO-GO + angle + pré-titre,
puis écrire son propre fichier POSITIONNEMENT (gabarit [[soudan-midform-POSITIONNEMENT]], même structure
que la piste 4 dépassée). Aucun script ni positionnement encore écrit sur cette piste — décision explicite
d'Aziz de reporter la suite, pas un blocage technique.
