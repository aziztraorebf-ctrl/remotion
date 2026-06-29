# Cacao → Chocolat — SHORT SVG — SCRIPT V2 (refonte post-avis Aziz 2026-06-28)

> Format = SHORT SVG vertical 9:16 (~2 min), registre encre/parchemin GGW.
> V2 = integre le decorticage beat-par-beat d'Aziz (cf AVIS-CHAUD-AZIZ.md). EVOLUTIF : les LLM (fact-check + DA-brief)
> diront si bon. V1 = base narrative ; V2 = narration + decisions d'animation preliminaires.
> ⛔ PRINCIPE TRANSVERSE : PAS DE CARTOUCHES. Seul texte = titre video au hook (comme GGW) + sous-titres karaoke
>   + SOURCES en bas d'ecran (la ou V1 mettait des cartouches d'info).

## ANGLE & TITRE
- Titre travail : "Ou sont les cacaoyers en Suisse ?" (alt : "Le chocolat suisse n'existe pas")
- Renversement (prouve 14k likes, commentaire Machi) : meilleur chocolat = Suisse / zero cacaoyer en Suisse.
- Chute (prouve 21k likes, Machi) : "L'Afrique n'est pas pauvre" — MAIS avec NUANCE responsabilite interne (Beat 5).

## FAITS VERROUILLES (Tavily 2026-06-28 ; ICCO / FAO-BASIC / Oxfam) — A re-blinder au triple fact-check
- Afrique de l'Ouest = ~2/3 (66%) production mondiale cacao. CI+Ghana ~54% a deux.
- Producteur touche ~6-11% du prix final (FAO/BASIC : 6,6% lait / 11% noir). -> "a peine six pour cent".
- 70% valeur + 90% marges -> marques + distributeurs.
- Ghana = ~15% (un septieme) du cacao mondial, recoit ~1,5% (2 Mds$) des 130 Mds$ de l'industrie (Oxfam).
- ~60% du cacao part vers l'Europe (Oxfam). Oxfam : "colonial legacy of extracting raw materials".

## ⚡ ACTU FRAICHE 2026 (Tavily 2026-06-28 — Deep Research aveugle, cutoff fin 2024)
- ⛔ IMPORTANT Beat 5 "comment ca change" : l'actu 2026 est en fait une REGRESSION sur les prix.
- 4 mars 2026 : Cote d'Ivoire BAISSE le prix au planteur de 57% (2800 -> 1200 FCFA/kg) — chute des cours +
  surstockage (RFI, African Agribusiness). Ghana baisse de 28,6%.
- Le Living Income Differential (LID, +400$/t introduit 2020) a meme ete RETIRE par les traders (Bloomberg fev 2026).
- LID "n'a pas atteint ses objectifs" : paysans touchent ~53% du prix CIF en 2024 (USDA).
- CI+Ghana unissent leurs efforts pour transformer l'industrie ; taxe export degressive selon transformation locale.
- -> NUANCE Beat 5 : les efforts EXISTENT (LID, transformation, prix plancher) mais PEINENT, 2026 = recul.
  Le "comment ca change" doit rester HONNETE (pas triomphaliste).

## TTS (scanner avant generation)
- Nombres en lettres : "six pour cent", "un septieme", "cent trente milliards", "un et demi pour cent".
- "Suisse" OK. Surveiller flux participes "e/ee" fin de groupe.

---

## SCRIPT V2 — narration FR (5 beats, ~2 min)

### BEAT 1 — LE MYTHE (~15s)
[serieux/premium]
On dit que le meilleur chocolat du monde vient de Suisse. Des montagnes, de la neige, un savoir-faire de luxe.
Une marque que la planete entiere s'arrache.

### BEAT 2 — LA QUESTION QUI RENVERSE (~15s)
[reflexif]
Mais posons une question toute simple. Ou sont les cacaoyers en Suisse ?

### BEAT 3 — LA VRAIE SOURCE (~25s)
[serieux]
Il n'y en a aucun. Le cacao ne pousse pas en Europe. Les deux tiers du cacao mondial viennent d'un seul endroit :
l'Afrique de l'Ouest. La Cote d'Ivoire. Le Ghana.

### BEAT 4 — L'EXTRACTION (~30s)
[serieux, monte]
Mais voila ce qu'on ne montre jamais. Sur le prix d'une tablette, le paysan qui cultive le cacao touche a peine
six pour cent. Le Ghana produit un septieme du cacao de la planete... et ne touche qu'un et demi pour cent d'une
industrie qui pese cent trente milliards.

### BEAT 5 — RENVERSEMENT + NUANCE + PONT VERS LE LONG (~25s)
[solennel]
Alors non. L'Afrique n'est pas pauvre. Elle est sur-exploitee.
[reflexif] Mais soyons honnetes : tout n'est pas la faute de l'exterieur. Une partie de cette richesse se perd
aussi a l'interieur — mauvaise gouvernance, dirigeants qui detournent.
[serieux] La vraie question n'est pas seulement qui exploite l'Afrique. C'est pourquoi elle laisse encore faire...
et comment, en ce moment meme, ca commence a changer.
[CTA] Quel produit veux-tu qu'on suive ensuite ? Dis-le en commentaire.

---

## DECISIONS D'ANIMATION — BASE PRELIMINAIRE (evolutive, a valider par DA-brief LLM)

### Regles transverses
- Registre encre/parchemin GGW STRICT : enorme vide, trait fin epure, ZERO hachure lourde, ZERO stereotype
  (pas de case/village africain). Colorisation = EVENEMENT a chaque beat. Cf lecons registre franc-cfa STATUS.
- PAS de cartouches. Hook : titre video en bas (comme GGW "La Grande Muraille Verte"). Partout : sous-titres
  karaoke word-level (Whisper) + SOURCES discretes en bas d'ecran.
- Glissement autorise UNIQUEMENT pour marchandise (feve). Objets inertes (tablette, cabosse, chapeau) = apparition/
  fade/colorisation sur place, JAMAIS de glisse (cf doctrine objet inerte).

### Beat 1 — Tablette + drapeau
- Tablette chocolat se DESSINE (strokeDashoffset) + se colorise au fil de la voix off.
- Drapeau suisse se dessine + colorise A COTE de la tablette (PAS dessus). Rouge = couleur-evenement du beat.
- Titre de la video apparait en bas (signature hook GGW). Rien d'autre.

### Beat 2 — Suisse en d3-geo encre
- Carte Suisse projetee via D3GEO (comme debut Senegal, SceneComparaisonV3 pattern). Path SVG exact -> trace
  strokeDashoffset, VITESSE reglable. Style encre/parchemin (trait fin, option hachure "dessin technique").
- On "cherche" un cacaoyer -> RIEN. Le vide se fait. ⭐ AVANTAGE : geo EXACTE, AUCUN LLM pour la carte.

### Beat 3 — Triple/double screen d3-geo -> cabosse SVG pur
- "Afrique de l'Ouest" -> continent projete d3-geo (nos techniques).
- SUCCESSIF, un ecran a la fois : Cote d'Ivoire se dessine, PUIS Ghana se dessine (d3-geo, style encre).
- Puis les DEUX ensemble (double screen) une fois nommes.
- ~10-12s restantes : AUTRE ECRAN = cabosse de cacao SVG PUR qui se dessine + s'ouvre, feves se colorisent
  (brun cacao = vie, comme arbres verts GGW). Sources en bas (pas cartouche).

### Beat 4 — Champ de cacao + artefact paysan (pattern hook GGW)
- Pattern pelle-GGW : un ARTEFACT HUMAIN pose au sol = le paysan. Ici CHAPEAU DE PAYSAN (ou autre artefact cacao).
- CHAMP DE CACAO se dessine (plusieurs plants). "Un septieme" -> on COLORISE une FRACTION des plants (comme GGW
  "3 arbres sur 4" qui s'allument). La proportion DIT le chiffre, sans cartouche.
  ⚠️ RESERVE LISIBILITE (Claude) : "1 sur 7" se lit moins vite que "3 sur 4". Au breakdown, viser une proportion
  visuellement LISIBLE comme "une toute petite part" (ex. ~2 plants colorises sur ~14) plutot qu'un compte exact.
- ⭐ ENCART GRAPHIQUE "data-hero" (idee Aziz 2026-06-28, pattern PORTRAIT TONY RINAUDO du Beat 4 GGW) : pour les
  chiffres economiques qui se representent MAL en scene figurative (le 6% de partage de valeur), projeter un ENCART
  graphique simpliste au CENTRE/milieu, STYLE PARCHEMIN ENCRE, ~8-10s (meme duree que le medaillon Rinaudo GGW : un
  croquis sepia encadre, present qq sec puis fade). Contenu propose = BARRE DE REPARTITION DE LA VALEUR : une barre
  horizontale = "prix d'une tablette" ; petit segment colorise (~6%) cote Afrique = le paysan ; grand segment (~94%)
  = marques + distributeurs. La disproportion DIT tout, lisible en 1s, honnete. = Data-Hero simpliste (cf History
  Scope cubes-continents) mais a NOTRE finition (encart encre, pas aplat plat). Puis l'encart s'efface comme Rinaudo.
  -> SEPARE les deux chiffres : barre 6% = encart graphique (partage valeur) ; colorisation champ = "un septieme"
  (scene). Chaque chiffre a son support, aucun surcharge. Resout aussi la reserve lisibilite "1 sur 7".
- ⛔ NE PAS tenter de representer "130 milliards" ni "la fortune part en Europe" en SCENE. Le 130 Mds$ vit dans la
  VOIX ; le partage de valeur vit dans l'ENCART graphique ci-dessus. Rester sur metaphores fortes pour le reste.

### Beat 5 — Renversement + nuance
- Phrase-cle "pas pauvre, sur-exploitee" s'inscrit (fort, registre encre).
- Nuance interne : visuel a definir au DA-brief (idee : la part coloriee du champ qui se ternit/se fissure de
  l'interieur — montre que la perte vient aussi du dedans). A challenger par LLM.
- Pont vers le long : ouverture visuelle (cafe / or / cobalt en petit ? ou rester sobre ?) — A TRANCHER au DA-brief.
- CTA sobre en bas.

## NEXT
1. Triple fact-check du SCRIPT V2 (Sonar Pro + Deep Research, en plus du Tavily fait) — blinder chiffres + ton.
2. DA-brief LLM (Gemini + Kimi + DeepSeek) sur les decisions d'animation ci-dessus.
3. Storyboard SVG-d'abord par beat -> code.
