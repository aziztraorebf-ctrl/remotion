# Franc CFA — MID-FORM SVG — STATUS

> Projet ouvert 2026-06-27. ⭐ DÉCISION AZIZ 2026-06-27 : **FORMAT = MID-FORM SVG, PAS short.** Pilier = Souverain.
> RAISON (preuve, cf [[SUJET-PRIME-SUR-PRODUCTION]] règle sujet→format) : le CFA est un sujet à MÉCANISME —
> chaque idée (parité, garantie, marché) a besoin de se CONSTRUIRE visuellement en plusieurs temps (cadenas, flèches,
> colorisation séquentielle des tomates, balance, tampon IMPORTÉ). Le short force "illisible OU tronqué". Le mid-form
> laisse respirer ET montre notre force (construction séquentielle SVG, comme GGW avec les arbres mais sur des concepts).
> ⚠️ Le travail short N'EST PAS perdu : sujet+angle+fact-check+script se TRANSPOSENT directement (comme le Soudan en attente).

## 0. SCÈNE D'ENTRÉE — PROTOTYPE PRODUIT (2026-06-27, fin de session)
- ✅ DA validée (chambre/chevet, DA-brief 3 modèles) → statique Gemini validé Aziz → ANIMÉ en Remotion.
- **Composants** : `src/projects/_rnd/svg-scenes/CfaChambreAnimee.tsx` (+ `cfaChambreBody.ts`). Compo Root `RND-CfaChambreAnimee` (571f/19s).
- **Statique source** : `out/_r-and-d/cfa-midform/cfa-chambre-VALID.svg`. Voix-off : `public/_rnd/cfa-midform/cfa-entree-vo.mp3` (19.04s).
- **Render** : `out/_r-and-d/cfa-midform/cfa-chambre-ANIM.mp4`. (Le bleu nuit `cfa-entree-ANIM.mp4` = POC mécanique abandonné, registre faux.)
- **Mécanique livrée** : chambre se dessine (calme) → zoom pièces (échelle objet, caméra statique) → CHOC (pièce du dessus se fend,
  trait ROUGE seule couleur, cartouche "100→50") → décret vertical d'en haut → 3 pays se détachent. Cf §7a (DA).
- ⚠️ POLISH restant (mineur, pas bloquant) : (1) le lit sort du champ au zoom (perte du dormeur en 2e moitié) ;
  (2) les "pays" = carrés génériques peu évocateurs ; (3) fracture de la pièce un peu discrète. Concept OK, finition à pousser.

## 1. OU ON EN EST (2026-06-27)
- ✅ Sujet VALIDE (pipeline complet, voir §3). Angle VERROUILLE = **(B) le courage + le cout reel**. Pivot = 1994.
- ✅ Script de RÉFÉRENCE (à RÉPARTIR/ÉTENDRE pour le mid-form) = **`SCRIPT-V6.md`** (densité ciselée, 5 beats, faits verrouillés).
  Historique : V1-V5 = itérations (V5 avait dilué, V6 a restauré la densité V2). NE PAS repartir des V1-V5.
- ✅ TRIPLE fact-check FAIT (Tavily + Sonar Pro + Deep Research). 5 corrections appliquees (voir §4). Sources = §6.
- ✅ Jury LLM FAIT (GPT 7 / Gemini 6.5 / Kimi 6) : fond/angle validés, corrections short appliquées en V6.
- ✅ Doctrines gravées : [[RECHERCHE-PRESCRIPT-UNIFIEE]] + règles 11bis/11ter [[DOCTRINE-SCRIPT-UNIFIEE]] + règle sujet→format.
- ⬜ NEXT (mid-form) :
  - Étendre le script V6 (référence short ~2:20) → script mid-form 4-6 min (chaque beat = scène qui se CONSTRUIT,
    + respirations, + ratio doctrine [[MIDFORM-FORMAT-RULES]]). Le V6 condense ce que le mid-form va DÉPLOYER.
  - Storyboard SVG-d'abord par scène (construction séquentielle pensée AVANT le code — cf scènes développées §7).
  - Mesurer audio TTS (ffprobe) avant de figer les frames.

## 2. ANGLE & TITRE
- Titre travail : « La nuit ou le franc CFA a ete divise par deux » (alt : « Quitter le franc CFA : le vrai prix »).
- Ton (B) : tout le monde veut partir → MAIS a quel prix. Doute honnete = notre difference vs desinfo TikTok.
- Pivot = 1994 (incarne). Chainon cause = le quotidien (etal Dakar). Chute = AES + risque + CTA.

## 3. PIPELINE DE VALIDATION PROUVE (a graver en doctrine si jury OK — decision Aziz)
Ordre fixe par Aziz : **TubeLab → yt-dlp (transcripts+top comments) → last30days → script → Tavily → (Deep Research + Sonar Pro) → jury LLM → doctrine.**
- **TubeLab** = source de verite n°1 (vues reelles, outliers, tri poubelle). Resultat : demande CONFIRMEE.
  - Outliers CFA : "L'aveu/devaluation Diouf" (227k, chaine 3k abos, x4.2) · "Suspension Afrique Centrale" (126k) · "AES se retire?" (95k).
- **yt-dlp** = transcripts + TOP COMMENTAIRES (mine d'or angles). Commentaires reels : "mon ami le directeur du FMI" / "soumission eternelle" / "bravo au Gabon".
  - ⚠️ Prendre transcripts+comments via yt-dlp (pas TubeLab) = economise credits TubeLab.
- **last30days** = le "poumon" 30j (sujet encore chaud ?). Resultat : BRULANT (737k vues TikTok/30j). Axe dominant = "l'AES tarde a quitter".
  - Pepite : angle juridique (sortie possible) quasi absent du corpus = creneau.
  - ⚠️ top-comments cross-plateforme : Reddit/HN/YouTube natifs ; TikTok/IG/Threads via cle ScrapeCreators (dans ~/.config/last30days/.env). INCLUDE_SOURCES pas lu depuis .env (le mettre en env var si besoin un jour).
- **Tavily** = roi actu fraiche verifiable (reforme 2020, parite 2026). LE SOCLE.
- **Deep Research** = roi nuance/attribution/biais (cutoff 2024, OK car nos points sont structurels).
- **Sonar Pro** = milieu rapide + actu live (confirme AES 2026).

## 4. CORRECTIONS DE TON EN ATTENTE (Sonar Pro — appliquer apres Deep Research)
Le script penche LEGEREMENT "a charge" France/FMI (interdit charte analyste). 3 points :
1. "decide largement ailleurs" (1994) → rendre VISIBLE l'agentivite africaine : les chefs d'Etat ont SIGNE la devaluation (sous influence FMI/France, mais signee par eux). Ne pas deresponsabiliser.
2. "Paris fournit/tient la valeur" → dire que c'est une CO-DECISION (Etats ont signe et maintenu les accords), pas un diktat unilateral.
3. "sans consultation des populations" → vrai mais AUCUNE decision de change au monde n'est referendaire. Retirer ou nuancer (sinon suggere une anomalie qui n'en est pas une).
- Principe : ne pas EDULCORER, mais EQUILIBRER (montrer aussi les arguments pro-CFA : stabilite, inflation basse, garantie). C'est CA notre difference vs desinfo.

## 5. PRODUCTION (resolu, faisable)
- Registres SVG mixtes PROUVES (cfa-midform-final.mp4, 42s) : blueprint froid + etal Dakar (scene de vie SANS humain) + flux.
- Beat 1 (nuit 1994) = NOUVEAU registre a creer (scene nocturne, piece qui se divise).
- Beat 5 CARTE AES = `public/_shared/geo-data/sahel/sahel-countries.geojson` (= Mali+Niger+Burkina) projete via `geoMercator().fitExtent(...)` (pattern Senegal `SceneComparaisonV3.tsx:383`). ⛔ JAMAIS laisser un modele dessiner la geo.
- TTS FR : 1994→"dix-neuf cent quatre-vingt-quatorze", scanner participes "e/ee" fin de groupe.

## 6. FAITS VERROUILLES — RÉFÉRENCE POUR LE MID-FORM (triple fact-check, sources primaires)
> Validé Tavily + Sonar Pro + Deep Research (2026-06-27). Réutilisable tel quel pour la version longue.
- **Dévaluation 12 jan 1994 = -50%** (1 FF : 50→100 FCFA). Sources : communiqué officiel vie-publique.fr (annonce 11 jan, effet 12 jan) + World Bank.
  ⚠️ ATTRIBUTION (Deep Research) : décidée FORMELLEMENT par les chefs d'État africains, MAIS sous forte pression FMI+France.
  NE PAS dire "décidé ailleurs" (déresponsabilise) — dire "signé par eux, sous pression". FMI verbatim : "ont pris l'avis du FMI et de la France, et ont décidé de dévaluer".
- **13 pays en 1994** (PAS 14 — Guinée-Bissau a rejoint en 1997 ; 14 = config actuelle). Source World Bank "treize États".
- **Parité 1 EUR = 655,957 FCFA** (Banque de France ; XE live juin 2026, volatilité 0). NE PAS dire "ne bouge jamais" → "inchangée depuis 1999" (a changé en 1948, 1994).
- **Réforme 2020** : UEMOA ne dépose PLUS au Trésor FR depuis jan-2020 (Trésor FR : "la BCEAO ne dispose plus de compte d'opérations depuis janvier 2020"). MAIS garantie de convertibilité illimitée MAINTENUE (Banque de France 2026). Dépôt 50% subsiste CEMAC + Comores 65%.
- **Sortie juridiquement possible** : Traité UMOA (BCEAO) prévoit le retrait (art. ~36, ~180j — numéro/délai exact NON re-vérifié au texte, dire "le traité le permet"). Précédents : Guinée 1958, Mali (sorti ~1962, revenu 1984), Mauritanie 1972, Madagascar 1972. ⚠️ contextes juridiques différents de l'UEMOA actuelle.
- **AES** (Mali+Niger+Burkina) : PARLENT de monnaie commune (conditionnel — démenti Mali jan-2026 sur un lancement imminent). Eco CEDEAO repoussé 2027.
- **Parité fixe & compétitivité** (Deep Research, nuance) : "rend les exports plus chères" = trop catégorique (matières premières cotées en $). Dire "quand l'euro est fort, pèse sur la compétitivité". Inflation basse = vrai bénéfice à NOMMER (équilibre charte).
- Fichiers fact-check bruts (scratchpad, à archiver si besoin) : cfa-deepresearch-RESULT.md · cfa-sonarpro-RESULT.md · cfa-jury-RESULT.md.

## 7. SCÈNES SVG-D'ABORD — esquisses storyboard (référence production mid-form, horizontal 1920×1080)
> Développées 2026-06-27 pour PROUVER le pivot mid-form (chaque scène se CONSTRUIT en plusieurs temps = impossible en short).
> Principe transverse : penser l'ANIMATION SÉQUENTIELLE dès le script. S'appuyer sur le proto existant
> `src/projects/_rnd/svg-scenes/cfaMarcheGroups.ts` (groupe id="couleurs" = surfaces à coloriser une par une).

### ⛔ LEÇON REGISTRE (Aziz 2026-06-27) — NARRATIF CFA = PARCHEMIN/ENCRE GGW DENSE, PAS line-art minimaliste
Erreur commise : j'ai invente un "line-art encre nocturne" bleu nuit MINIMALISTE (trop pauvre). Aziz : le bon
registre narratif (= bon HOOK) est l'ENCRE/PARCHEMIN GGW DENSE deja prouve : fond creme #e8dcc0, encre #2b2117,
scene RICHE et detaillee qui SE DESSINE (strokeDashoffset) + COLORISATION SELECTIVE (on choisit quoi colorier,
la couleur arrive au CLIMAX pas au debut — regle GGW). Reference = `GgwHookEncreVivant.tsx` + palette
`SVG-LIBRARY-INDEX.md` § registre encre GGW. ⛔ NE PAS reinventer un registre quand on en a un prouve en biblio.
→ La scene d'entree "bleu nuit" (cfa-entree-ANIM.mp4, catbox 97koy7) = POC de la MECANIQUE calme→choc (valide),
  mais REGISTRE A REFAIRE en parchemin dense. La mecanique (calme se dessine → choc se casse) reste bonne.

### ⛔⛔ LEÇON REGISTRE N°2 (vérif frames GGW FINAL réelles, 2026-06-27) — "RICHE" = SOBRE, PAS DENSE
J'ai re-trompé : "parchemin dense + hachures + village africain" = STÉRÉOTYPE + remplissage = l'OPPOSÉ de GGW.
Le VRAI style GGW (frames out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4) :
- ÉNORMÉMENT DE VIDE. Fond parchemin domine, peu d'éléments, beaucoup d'espace aéré.
- TRAIT FIN ÉPURÉ, ZÉRO hachure/texture lourde. Dunes = simples lignes ondulées fines. Soleil = cercle + pointillés.
- COULEUR ULTRA-SÉLECTIVE : tout en encre/parchemin neutre SAUF ce qu'on DÉCIDE de colorier (arbres verts = vie,
  soleil or, bande sol vivante). "zéro couleur sauf celle qu'on décide" (verbatim Aziz). La couleur = un ÉVÉNEMENT narratif.
- Cadre POINTILLÉ + sous-titres en cartouche = signature mise en page.
"Riche" pour Aziz = riche en INTENTION (vide maîtrisé + colorisation comme geste), PAS riche en densité de traits.
⛔ Brief futur : DEMANDER le vide, le trait fin épuré, zéro hachure, zéro stéréotype, palette quasi-monochrome au départ.

### 7a. Scène d'entrée 1994 — DA VALIDÉE (DA-brief upstream Gemini+Kimi+DeepSeek, 2026-06-27)
> Brief : `scratchpad/cfa-entree-da-brief.txt` · réponses : `/tmp/da-refs/da-cfa-entree-{gemini,kimi,deepseek}.md`.
> Décor tranché Aziz = **CHAMBRE/CHEVET (concept DeepSeek)**. Mécanique = consensus des 3 voix.
- **DÉCOR** (registre encre/parchemin GGW, 70% vide, zéro hachure, zéro cliché ethnique) : chambre la nuit vue de chevet —
  silhouette endormie sous couverture (trait épuré), table de nuit avec RÉVEIL sur MINUIT + pile de pièces CFA, fenêtre sur nuit étoilée.
  4-5 éléments MAX. Hiérarchie regard : fenêtre/étoiles → réveil → pièces → silhouette.
- **COLORISATION SÉLECTIVE** (couleur = ÉVÉNEMENT unique) : tout en encre #2b2117 sur #e8dcc0 pendant le calme.
  Au "deux fois moins" : la pièce du DESSUS se FEND, trait ROUGE sur la fracture (SEULE couleur), cartouche "100 → 50" / "−50%".
- **MÉCANIQUE** : calme se DESSINE (strokeDashoffset, ease doux) → choc INSTANTANÉ (cut sec, easing rigide "tombe comme une pierre",
  PAS de rebound) + flash blanc 2-3 frames. Caméra STATIQUE (viewBox fixe). Pas d'explosion de particules (cheap).
- **FORCE D'EN HAUT** ("décision tombée d'en haut") : un décret/trait vertical épais descend du haut → frappe la pièce. ABSTRAIT (jamais un politicien/Élysée).
- **FIN** ("pays veulent quitter") : silhouettes de pays (formes simples 3-4 points) se détachent des fragments + flèches, glissent vers les bords.
- **ANCRAGE CHIFFRE** : "100 → 50" dans le cartouche sur "deux fois moins" (rend l'abstraction concrète).
- ⛔ AI-slop à éviter (consensus) : easing bouncy, particules shatter, typo sans-serif générique, carte d'Afrique complexe, hachures, shake excessif.
- 0-4s "12 janvier 1994, minuit" : horizon + toits + lune + horloge → minuit. TRACÉ lent, calme, silence. Fond nuit (#16213a profond).
- 4-7s "des millions dorment" : fenêtres dorées s'éclairent (fade lent). Pièce CFA se trace au compas, stable.
- 7-8s "à leur réveil—" : RUPTURE. Flash bref + SFX grave. ZÉRO tracé (instantané).
- 8-11s "vaut deux fois moins" : pièce SE FEND net (fracture qui apparaît, pas dessinée), "÷2" spring pop, fenêtres s'éteignent d'un coup.
- 11-15s "divisé par deux" : fracture béante, moitié droite chute (pèse moins), silence tenu 1s.
- 15-19s "tombée d'en haut, sans vote" : UNE seule flèche verticale descend et frappe (l'unicité DIT "d'en haut", aucun débat).
- 19-23s "des pays veulent quitter" : ⛔ CAMÉRA STATIQUE (pas de zoom-out — sinon objets sortent du cadre). Les DEUX moitiés
  de la pièce RAPETISSENT sur place (scale des objets, viewBox fixe), 3 zones AES s'allument autour (fade) → transition.
> ⛔ RÈGLE SVG : caméra STATIQUE, viewBox FIXE. Tout "zoom/recul" = échelle des OBJETS, jamais déplacement caméra.

### 7b. SCÈNE "parité fixe" (blueprint froid) — construction en 5 temps
plaques "1€"/"CFA" se tracent → trait + cartouche "655,957" → cadenas (spring + SFX clic) → courbe nerveuse d'une
autre monnaie EN CONTRASTE (CFA = ligne plate) → cadenas glow doré + "?" → transition "qui tient la clé".

### 7c. SCÈNE "marché de Dakar" (parchemin chaud, colorisation séquentielle) — l'étal se révèle
étal tracé gris (vide) → tomates se colorisent rangée par rangée (groupe "couleurs" du proto) → ruban prix "500 F"
stable + balance équilibrée → sac de riz se colorise + tampon "IMPORTÉ" (spring), tomates locales se désaturent
→ flèche du sac vers le haut, prix riz monte "500→650", balance penche. PAS d'humain (registre scène-de-vie prouvé).

> Ces 3 scènes = la preuve visuelle du pivot. En mid-form chaque temps respire (~3-4s/élément) ; en short = illisible.
