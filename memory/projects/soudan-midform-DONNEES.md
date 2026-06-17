---
name: soudan-midform-DONNEES
description: Fiche données factuelle tracée pour le mid-form Soudan (recherche 2026-06-16). Chaque chiffre = source + date. Corrections au fichier sujet signalées. Socle avant script/carte.
metadata:
  type: project
---

# FICHE DONNÉES — SOUDAN MID-FORM (recherche 2026-06-16)

> Socle factuel pour [[soudan-midform]]. 3 recherches parallèles (ACLED/territoire · or/EAU · proxys/UA-ONU).

> 🎬 **PARTI PRIS VISUEL (décision Aziz 2026-06-16)** : aller PLUS LOIN que l'AES côté carte vivante. Réutiliser le langage AES (jetons losange/cercle, contours draw-in+pulse, overlays) MAIS ajouter des **sprites animés top-down** (drones, avions, convois) qui bougent avec intention narrative. Le Soudan s'y prête : le mouvement EST le sujet (or→Dubaï, drones↩, fuite El Fasher), pas du glissement décoratif.
> **Stack déjà en place** (vérifié) : moteur Soudan `WarMapEngine.tsx` + `sudan.warmap.json` + `sudanControlData.ts` (véhicules SAF bleu/RSF rouge déjà codés) · proto `out/_r-and-d/sudan-warmap-epic60-v4.mp4`. Routes or→EAU = `GeoFlowConnection` (sprite mobile sur tracé). Flèches = `SahelAttackArrow`. Flux réfugiés = `RefugeeFlow`.
> ⚠️ **GARDE-FOU DRONES (antipattern A5 documenté)** : un sprite top-down (avion/drone vu de dessus) n'est NET que si la carte est à plat (pitch 0). Sur carte inclinée (pitch 28-38°) il flotte faux. 3 options à trancher au moment du beat Acte 3 : (a) Acte 3 en vue à plat, (b) drones générés pour le pitch réel, (c) trajectoire + point lumineux + SFX (plus abstrait). DÉCISION DE GOÛT — remonter à Aziz AVANT de coder le beat drones.
> 📐 Doctrines à lire avant de coder un beat objet : `WARMAP-ANIMER-OBJETS.md` (arbre SVG/Gemini/PixelLab + règles R-OBJ taille ancrée carte) · `WARMAP-GRAMMAIRE.md` · `CATALOGUE-CARTE-VIVANTE.md`.
> **Règle** : chaque chiffre porte `[source — date]`. Distinction FAIT / ESTIMATION / ALLÉGATION / [NON VÉRIFIÉ] respectée.
> ⚠️ **Limite méthodo** : Firecrawl épuisé (crédits, HTTP 402) tôt → bascule WebSearch/WebFetch sur sources nommées. Pages OHCHR/ACLED non ouvertes en propre (403/paywall), chiffres cités via agrégateurs datés (UN News, NPR, Al Jazeera). Pour fiche de PROD définitive : ouvrir Sudan Conflict Monitor (sudantransparency.org) + portail ACLED pour figer la carte État par État.

---

## ⛔ CORRECTIONS AU FICHIER SUJET (à appliquer dans soudan-midform.md)

Le gate factuel a invalidé/nuancé 4 affirmations du fichier sujet. **À ne PAS répéter dans le script :**

1. **« 1500 km Darfour-Khartoum » → FAUX / NON VÉRIFIÉ.** El Fasher–Khartoum ≈ **612 km à vol d'oiseau** ; Khartoum–Port-Soudan = 671 km. Le 1500 km n'est sourcé nulle part. **Reformuler** : « plus de 1 000 km de pistes » (distance routière depuis Darfour profond). L'argument logistique COMME cause de l'impasse, lui, EST documenté (ACLED).
2. **« 33,7M personnes » = en BESOIN D'AIDE, pas déplacés.** Déplacés = **13,6M** (9,3M internes + 4,3M réfugiés) [UN News — 10 janv. 2026]. Ne jamais afficher 33,7M comme « déplacés ».
3. **« Fracture EAU-Hemeti juin 2026 » → NON VÉRIFIÉ.** Aucune source. Signaux CONTRAIRES : Hemeti « prêt à se battre des décennies » [Africanews — 7 mai 2026], armes EAU→RSF tracées via Éthiopie [janv. 2026]. **Ne PAS l'affirmer** sans source d'Aziz.
4. **« Polymarket ceasefire 19% » → c'est ~28%** (marché « ceasefire by Dec 31, 2026 », juin 2026). Le chiffre bouge → revérifier au montage.
5. **Bonus — veto russe = 18 NOV. 2024** (résolution UK + Sierra Leone), pas 2025. Ne pas inverser la date.

---

## ACTE 1 — LE CONSTAT (carte 2 couleurs, contrôle territorial avril 2026)

**Thèse confirmée : partition de fait nord/est (SAF) vs ouest (RSF).**

### Zone SAF (armée, Forces armées soudanaises)
- **Khartoum** repris mars 2025 · **Port-Soudan** (capitale de fait), Kassala, Al-Qadarif · **Gezira/Wad Madani** repris 11 janv. 2025 · **Sennar** · **Nord Kordofan** dont El-Obeid · **Sud Kordofan** : Kadugli + Dilling (repris 26 janv. 2026) · **Nil Bleu** majorité sauf Kurmuk · **Région Nord** (vallée du Nil). [Sudans Post — 27 avr. 2026 ; Security Council Report — fév. 2026 ; Al Jazeera — 16 avr. 2026]

### Zone RSF (paramilitaires Hemeti)
- **Darfour** quasi-total (5 États) après chute El Fasher · **Kordofan** larges portions (front contesté) · **Nil Bleu** nouveau front + champ pétrolier Heglig (fin 2025) · poches désertiques Nord. [Sudans Post / Al Jazeera / ISS — 2026]

### ⚠️ Zones à NE PAS colorer franc
- **Bara (Nord Kordofan)** : contestée (SAF + présence RSF).
- Acteurs tiers : **Jebel Marra/Tawila** = SLA-AW (indép.) · est Kadugli = SPLM-N (al-Hilu) · Abyei = mixte.

### ✅ GRILLE DE CONTRÔLE ÉTAT PAR ÉTAT (verrouillée Tavily 2026-06-16 — base carto Actes 1-2)
**Source maîtresse : [Sudans Post — 27 avr. 2026](https://www.sudanspost.com/territorial-control-map-sudan-conflict-as-of-april-27-2026)** (découpage par localité), recoupée ACAPS (11 fév. 2026), ReliefWeb/FEWS NET (jan-mai 2026), ACLED, Freedom House 2026.

**Légende couleurs (modèle Operation Broken Silence)** : SAF = une couleur · RSF = une couleur · SPLM-N al-Hilu (jaune) · SLA-AW neutre (violet) · zones jointes RSF+SPLM-N (orange).

| Zone | Contrôle | Détail |
|---|---|---|
| **Khartoum** | SAF | siège gouv. rapatrié le **11 janv. 2026** (ACLED) |
| **Centre-Est** (Gezira/Al-Jazirah, Sennar, Kassala, Al-Qadarif, Port-Soudan, Wad Madani) | SAF | cœur administratif/logistique. SAF a achevé la reprise du centre en mai 2025 |
| **Darfour (5 États)** | RSF | quasi-total après chute El Fasher (oct. 2025) |
| → **Exception NO Darfour** (Tina, Kornoi, parties d'Ambaro) | anti-RSF/SAF (Zaghawa) | poche pro-SAF |
| → **Jebel Marra / Tawila** | SLA-AW (Abdel Wahid al-Nur) | **NEUTRE** indépendant — ne PAS attribuer à un camp |
| **Nord Kordofan** | SAF majoritaire | dont **El-Obeid**. ⚠️ RSF présent à **Bara, Jabra al-Sheikh, Umm Dam, O/NO Sheikan** = CONTESTÉ |
| **Sud Kordofan** | fragmenté | SAF a repris **Dilling + Kadugli + Habila** (jan. 2026, siège brisé) MAIS zone très contestée. **Est Kadugli + SE Dilling = SPLM-N al-Hilu**. RSF+SPLM-N jointement = hinterland Dilling (Al-Fiu). Route Dilling-Kadugli coupée par RSF |
| **Nil Bleu** | SAF majoritaire | **sauf Kurmuk** = joint RSF–SPLM-N (sauf poches nord ex. Dindiro). Nouveau front actif (campagne RSF 2026) |
| **Triangle Soudan-Égypte-Libye** (extrême nord) | RSF (depuis **11 juin 2026**) | corridor désertique fuel/armes via LNA Haftar [weAfrica — 11 juin 2026, source secondaire à recouper] |

**⚠️ Pour la carte simplifiée Acte 1 (2 couleurs)** : la partition SAF nord/est vs RSF ouest tient. Mais NE PAS lisser le Kordofan en bloc d'une couleur — c'est la zone fragmentée/contestée centrale, et c'est précisément là que se joue la guerre 2026. Réserver les nuances (contesté/tiers) pour l'Acte 2 (zoom front).

### Chiffre-ancre Acte 1
- **33,7M en besoin d'aide** (~⅔ population) [UN News — 10 janv. 2026]. PAS déplacés.
- (Si besoin déplacés : 13,6M.)

---

## ACTE 2 — POURQUOI L'ARMÉE NE GAGNE PAS (impasse)

**Thèse « impasse » DOCUMENTÉE — avec nuance obligatoire :**
- Al Jazeera (16 avr. 2026, titre explicite) : *« army and RSF locked in military impasse »*, « stagnation, aucun camp de victoire décisive ».
- ⚠️ **Nuance à tenir** : Security Council Report (fév. 2026) parle d'**escalade** sur multiples fronts, Kordofan = épicentre. Synthèse juste = **partition figée globalement MAIS fronts Kordofan + Nil Bleu actifs**. Ne pas dire « tout est figé ».
- Phase actuelle = **guerre de drones à grande échelle** : >1 000 morts par drones en 2026 [Al Jazeera — 15 juin 2026].

**Mécanique logistique (cause de l'impasse) — DOCUMENTÉE :**
- « Longues lignes d'appro SAF + pénuries carburant affaiblissent l'avance ; RSF opère près de ses bases, lignes resserrées » [ACLED — 2026].
- Chaque camp fort chez lui, faible loin de ses bases. EAU réapprovisionne RSF via routes alternatives (Éthiopie, Tchad, RCA).
- ⚠️ Distance : « **>1 000 km de pistes** » (PAS 1500 km). El Fasher–Khartoum ≈ 612 km vol d'oiseau.

---

## ACTE 3 — QUI ALIMENTE LA GUERRE (cœur de valeur ajoutée) ⭐

### 3A. L'OR (follow the money)
**3 chiffres-ancres solides :**
1. **64 t produites en 2024** (déclarée), mais **50–80% de l'or soudanais échappe aux circuits officiels** [FAIT — converge Chatham House, Sudan Transparency, ISPI].
2. **Jebel Amer (Nord-Darfour, 2017) = acte fondateur** : la famille Dagalo bâtit sa fortune via **Al Junaid** (actifs ~1 Md USD, fondée 2009 par Hemeti + frère Abdulrahim) [FAIT — US Treasury, The Sentry].
3. **Destination Dubaï** : EAU = 2e exportateur mondial d'or, 1re destination de l'or africain smugglé. **≥400 t soudanaises smugglées 2012–2024**, ~moitié vers EAU [ESTIMATION — SwissAid].

**Décomposition 2024** : ASGM artisanal 53,71t (83%) · tailings 4,95t (7%) · industriel 5,70t (9%) [Chatham/SMRC].

**⚠️ 3 incertitudes à NE PAS masquer (en faire un argument narratif) :**
- Production RSF 2024 : **10 t (ONU/860M USD) vs ~1 t (Chatham/Baldo)** — écart x10. Présenter en fourchette. ✅ **VERROUILLÉ ci-dessous (3A-bis).**
- Chiffres officiels 2022 contradictoires (41,8 / 49,7 / 87 t) = symptôme du système opaque.
- **L'or de Dubaï n'est PAS 100% RSF** : le SAF vend aussi son or off-the-books (Port-Soudan). Tableau exact = **les DEUX camps financent la guerre par l'or via l'EAU**. Plus puissant ET plus juste.

### 3A-bis. ✅ OR RSF — ÉCART x10 TRANCHÉ (verrouillé Tavily 2026-06-16)
**Ce n'est PAS « une source a tort » : c'est un chiffre ONU officiel disputé par les experts, et la raison est précise.**

| Estimation | Source | Périmètre |
|---|---|---|
| **~10 t / 860 M$** | UN Panel of Experts (rapport confidentiel CS, fin 2024 ; interviews monitors locaux août-sept. 2024) | or *sorti* des zones RSF (Jebel Amer + Songo + autres) |
| ~13-15 t | implicite si 860 M$ ÷ prix or 2024 | African Gold Report note l'incohérence interne |
| **< 10 t, "max 1 t"** | Baldo & Soliman, Chatham House (mars 2025) | *production des usines* RSF seules |
| 240 t / 2015-2022 (~32 t/an) | al-Rayeh via Darfur24 | historique pré-guerre (≠ production de guerre) |

**Mécanique de l'écart (= le verrouillage)** : Baldo/Soliman ne contestent pas que ~10 t *circulent* en zone RSF. Ils contestent que les **usines RSF** (Jebel Amer effondré + Songo) en *produisent* >1 t. Citation : *« ils doutent que les achats d'Al Junaid auprès des mineurs artisanaux indépendants comblent la différence de 9 t »*. → **Production propre RSF ≈ 1 t ; flux taxé/acheté ≈ jusqu'à 10 t.** L'ONU compte le flux, Chatham la production d'usine. Les deux vrais sur périmètres différents.

**FORMULATION SCRIPT VERROUILLÉE** (l'incertitude DEVIENT l'argument) :
> « L'ONU évalue à 10 tonnes (860 M$) l'or sorti des zones RSF en 2024 ; Chatham House juge ce chiffre exagéré — les mines RSF n'en produiraient qu'une. L'écart raconte l'opacité du système : impossible de distinguer l'or produit de l'or simplement taxé sur la route. »

**⚠️ CORRECTION GÉO IMPORTANTE** : le Darfour (zone RSF) ne produit PAS l'essentiel de l'or. Les grosses mines sont en **zone SAF** (Mer Rouge, Nord, Nil, Kordofan, Nil Bleu). Le Panel ONU estime Darfour = 30% du national (~19 t base 2024) mais **jugé surestimé**. NE PAS dire « le Darfour, mine d'or du pays ». La force RSF = artisanal + taxation + contrôle des routes, pas le volume.

**Précisions chiffrées verrouillées** :
- Deal Jebel Amer 2019-2021 : RSF cède ses droits contre **250 M$** + exemptions taxes (Chatham — chiffre exact, remplace le « >200M$ »).
- Production nationale rebond : 23,2 t fin 2023 (zones SAF) → **64,36 t en 2024** ; Port-Soudan revendique 27,96 t exportées (~1,6 Md$). [Chatham/SMRC]
- Exports 2024 officiels divergent déjà entre eux : CBoS 22,918 t/1,57 Md$ · SMRC 27,96 t/1,59 Md$ · Min. Finances 31 t. = symptôme opacité.
- ⚠️ **Rappel** : or RSF n'apparaît PAS dans les stats d'export officielles (par définition contrebande).

**Sources verrouillées** : [African Gold Report — Sudan](https://www.africangoldreport.org/sudan) (réconcilie les deux estimations) · [Chatham House PDF — Gold and the war in Sudan, mars 2025](https://snas.org.sd/wp-content/uploads/2025/04/2025-03-25-gold-and-the-war-in-sudan-soliman-and-baldo.pdf) · [ISPI — Role of Gold](https://www.ispionline.it/en/publication/the-role-of-gold-in-the-sudanese-war-207364) · [Noria Research — Black Gold Liquid Metal](https://noria-research.com/mena/black-gold-liquid-metal-the-political-economy-of-gold-in-sudan) · UN PoE S/2024/65.

**Routes contrebande (flèches carte)** : zones RSF → via Libye / Tchad / Soudan du Sud → EAU. Égypte = ~60% or zones SAF (>60 t/an). Dubaï = hub raffinage/réexport (puis Suisse).

**Coordonnées carto à re-vérifier avant render** (NE PAS placer de point ferme sans OSM/Natural Earth) :
- **Jebel Amer** ~13,8°N / 23,7°E (cohérent Kabkabiya ~13,65N/24,08E — à confirmer).
- **Songo / Al-Radom** (Sud-Darfour SO, ~9–10°N) — à géolocaliser.
- Port-Soudan (mer Rouge) + axes Tchad/Libye/Égypte/Soudan du Sud pour flèches.

### 3B. LES DRONES (guerre des proxys)
**Modèles SÛRS à nommer (forensique Amnesty/Yale) — ne pas en inventer d'autres :**
- **Côté RSF (via EAU)** : Wing Loong II, FH-95 (FeiHong-95), Sunflower-200 (clone Shahed-136), VTOL serbe Yugoimport, bombe planante GB50A (Norinco, 1er usage mondial documenté), howitzer AH-4. Acheminés à Nyala (hub RSF). [Amnesty Int. — mai 2025 ; Yale HRL]
- **Côté SAF** : Bayraktar TB2 + Akıncı (contrat Baykar nov. 2023, ~120M USD, 8 TB2) · Iran Mohajer-6 (base Wadi Sayyidna). [Fair Observer / Bloomberg — 2024-25]
- Jalon : **3e Akıncı abattu par RSF, 13 sept. 2025** (Ouest Kordofan) = la RSF apprend à contrer les drones turcs.
- ⚠️ **EAU dément systématiquement** tout soutien RSF → étiqueter « allégation, EAU dément » à l'écran, même si faisceau forensique lourd.

---

## ACTE 4 — POURQUOI ÇA NE S'ARRÊTE PAS (UA/ONU + paradoxe)

- **UA** : Soudan **suspendu depuis oct. 2021** (coup d'État). Al-Burhan refuse médiation UA tant que suspension non levée → UA récusée comme médiateur. Membres-clés UA eux-mêmes parties par proxy (Égypte pro-SAF). [Garowe Online — 2025]
- **ONU** : **veto russe 18 nov. 2024** (résolution UK + Sierra Leone, cessez-le-feu) = seul vote contre sur 15. Embargo ONU sur le **Darfour seulement** (pas tout le Soudan), monitoring défaillant. [France24 / HRW / UN Press — nov. 2024]
- **Médiations échouées** : Jeddah (US-Saoudite, mai 2023, effondré ~1 mois) · cadre actuel **« Quad »** (US, Arabie S., Égypte, EAU), déclaration 12 sept. 2025, trêve jamais tenue.
- **PARADOXE FINAL (l'angle)** : les 2 puissances capables de forcer la paix — **EAU (arme RSF) + Turquie (arme SAF)** — tirent bénéfice (mer Rouge, or, influence) de la continuation. **L'EAU siège dans le Quad censé arrêter la guerre que son client mène.** Chaque médiateur potentiel est aussi un belligérant par proxy. [Washington Institute / MEE — 2025-26]
- **Polymarket** : ceasefire 2026 ≈ **28%** (pas 19%), bouge → revérifier au montage.

⛔ **CONTRAINTE D'ÉCRITURE ACTE 4 (Aziz 2026-06-16) — NUANCE DARFOUR (report depuis Acte 2)** :
L'Acte 2 dit « les forces de Hemeti sont chez elles à l'ouest » — juste MILITAIREMENT (sanctuaire logistique, recrutement tribal arabe) mais NE DOIT PAS laisser croire que toute la population du Darfour les soutient. **L'Acte 4 (coût humain) DOIT révéler explicitement** : la RSF y commet un **génocide ciblé** contre les communautés non-arabes (**Zaghawa, Masalit, Fur** — qualification Mission ONU 17-19 fév. 2026 + CPI, voir El Fasher). Le Darfour n'est PAS un bloc RSF homogène (poche pro-SAF Zaghawa au NO Darfour : Tina/Kornoi, déjà dans la grille territoriale). Effet recherché : le spectateur réalise rétroactivement le vrai sens de « chez elles » = un fief tenu par la terreur, pas un soutien populaire. Le visuel Acte 1 peut déjà le suggérer (la poche pro-SAF visible dans le Darfour RSF).

---

## EL FASHER (jalon transversal, à placer Acte 1 ou 2)
- **Tombée 26 oct. 2025** après ~500 jours de siège.
- Bilan ONU : **>6 000 tués en 3 jours** (≥4 400 ville + >1 600 routes de fuite), réel « très supérieur » [OHCHR — fév. 2026]. Le « 6000+ » du fichier sujet est CONFIRMÉ.
- Qualification : **« caractéristiques du génocide »**, ciblage Zaghawa + Fur (Mission ONU 17-19 fév. 2026 ; CPI janv. 2026).
- Conséquence : dernière poche SAF au Darfour éliminée → RSF verrouille la partition ouest.

## BILAN HUMAIN (présenter en fourchettes, jamais un chiffre unique)
- **Morts** : 56 000 recensés (ACLED, directs) → 150 000–400 000 (estimations larges incluant faim/maladie). « Quelqu'un tué toutes les 27 min » [Al Jazeera — avr. 2026].
- **Déplacés** : 13,6M · **Insécurité alimentaire** : 21–26M · **Besoin d'aide** : 33,7M.
- Famine concentrée Darfour/Kordofan.
- ✅ **IPC Phase 5 (FAMINE DÉCLARÉE) — VERROUILLÉ (Tavily 2026-06-16)** : famine officiellement confirmée par le Famine Review Committee à **El Fasher** (Nord-Darfour) + **Kadugli** (Sud-Kordofan), sept. 2025→jan. 2026. **2e confirmation en <1 an.** Seuils famine aussi franchis à **Um Baru + Kernoi** (Nord-Darfour, fév. 2026). **20 zones** à risque. **841 000 personnes non classables** faute d'accès (le chiffre minore, ne majore pas). Détail dur exploitable : à Kadugli, civils mangent des matières non alimentaires. → le script PEUT affirmer « famine déclarée » sans réserve. Sources : IPC/FRC, WFP, IFPRI, FEWS NET, [ReliefWeb IPC Snapshot sept25-mai26](https://reliefweb.int/report/sudan/sudan-ipc-acute-food-insecurity-snapshot-l-september-2025-may-2026).
- ⚠️ **Polymarket ceasefire = NON FIGÉ** : Tavily n'a pas sorti la valeur live du marché Sudan (≈28% selon recherche antérieure, non reconfirmé). **Reco : NE PAS bâtir un beat dessus** (chiffre volatil, sera périmé en prod). Donnée robuste équivalente : IPC « seul un cessez-le-feu peut empêcher la détérioration » + médiations échouées (Quad/Jeddah). Si tenu au chiffre → re-vérifier en J-1 montage, OPTIONNEL.

---

## RAPPORTS-SOURCES DE RÉFÉRENCE (à créditer si cités à l'écran)
Chatham House (Baldo, « Gold and the war in Sudan », mars 2025) · The Sentry (« RSF Business Network in UAE », oct. 2025) · SwissAid (« On the trail of African gold », 2024) · Sudan Transparency (« Fueling Sudan's War », oct. 2024) · US Treasury OFAC (jy1514, juin 2023) · UN Panel of Experts Sudan · Amnesty International (drones, mai 2025) · Yale Humanitarian Research Lab · ICG · Security Council Report.

---

Liens : [[soudan-midform]] · [[SUJET-PRIME-SUR-PRODUCTION]] · [[WARMAP-LONG-DOCTRINE]] · [[DOCTRINE-SCRIPT-UNIFIEE]] · [[DA-BRIEF-GATE]].
