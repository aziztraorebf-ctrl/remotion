---
name: Grille sources 3 niveaux (standard rigueur Souverain)
description: Comment trier sources et chiffres pour épisodes Souverain — pas de liste blanche/noire, mais grille 3 niveaux + règles d'écran
type: feedback
---

# Grille sources 3 niveaux — Standard Souverain

**Origine** : pushback Aziz 2026-05-07 sur épisode Mali futur. Claude était tombé dans piège "sources fiables (occidentales) vs sources biaisées (russes/africaines)" — grille colonialiste implicite. Aziz a corrigé : toutes les sources sont biaisées, y compris AFP/Reuters/Al Jazeera. Distinguer biais (légitime, à signaler) de mode opératoire douteux (volume automatisé, traçabilité nulle).

**Why** : Souverain doit incarner une honnêteté intellectuelle qui ne hiérarchise pas implicitement Occident > reste. Sinon le pilier perd son ADN.

**How to apply** : Pour CHAQUE épisode (pas seulement sensibles), trier les sources en 3 niveaux avant écriture du script.

---

## Niveau 1 — Faits vérifiables
**Quoi** : chiffres, géolocalisations, identités, dates, événements documentés.

**Règle** : croiser au moins **2 sources de camps différents** parmi :
- **Mainstream international** : AFP, Reuters, BBC, France 24, Al Jazeera, Le Monde, NPR
- **Panafricain** : Jeune Afrique, RFI Afrique, Africa Is a Country, Le Monde Afrique
- **OSINT/technique** : ACLED, Bellingcat, Africa Center for Strategic Studies, Chatham House
- **Officiel** : communiqués gouvernementaux, état-major, ONU

Si les 3 catégories convergent → fait solide, on l'affirme.
Si 2/3 divergent → on signale la divergence dans le script.
Si aucune n'est traçable → on ne le dit pas.

**Biais à signaler en interne (pas à l'écran)** :
- AFP/France 24 : grille française, conflit ouvert avec junte malienne depuis 2022
- Al Jazeera : ligne Qatar variable selon dossiers
- ACLED/Bellingcat : biais de sélection (ce qu'ils choisissent de tracker)
- Tous les médias d'État : alignés par construction sur leur gouvernement

## Niveau 2 — Voix et narratifs
**Quoi** : ce que les gens disent, ressentent, interprètent. Récits en circulation.

**Règle** : INCLURE largement, ÉTIQUETER systématiquement. Ne jamais relayer comme vérité. Toujours nommer le porteur du récit.

**Sources légitimes ici** :
- Maliactu, Mondafrique, Bamada.net (proches junte sur certains sujets — utiles pour récit officiel malien)
- Comptes panafricains identifiés
- Diaspora, voix locales sur réseaux sociaux (avec précaution)
- Communiqués des belligérants (JNIM, FLA, FAMa) cités comme tels
- Médias dissidents/opposition

**Format à l'écrit** : "Le récit officiel malien parle de X. Le narratif panafricain met l'accent sur Y. Bellingcat n'a pas vérifié indépendamment." Le spectateur voit les trois, choisit.

## Niveau 3 — Sources à étiqueter avec précaution
**Quoi** : sources avec mode opératoire problématique (pas point de vue problématique).

**Réseau Pravda.ru-network** (`*.news-pravda.com`) :
- Documenté par NewsGuard, ISD, Viginum (agence française)
- Clones automatisés, traduction auto, pas de journalistes identifiables
- **Utilisable comme objet d'étude** ("voici ce qui circule dans l'écosphère pro-Kremlin"), **pas comme source factuelle première**

**Comptes anonymes X/Telegram** :
- Citables seulement si convergence multiple ET étiquetage explicite "non vérifié, mais largement relayé"

**African Initiative** :
- Documenté comme ferme à contenus pro-Kremlin
- Même règle que Pravda : objet d'étude, pas source primaire

---

## Règles d'écran (la rigueur invisible)

**Règle des 3 chiffres maximum (Short)** :
- Hook : 1 chiffre choc
- Illustration : 1 chiffre tangible
- Bascule : 1 chiffre conséquence
- Au-delà → décrochage spectateur

**Marqueur de confiance unique (Short)** :
- 1 seule source citée visuellement à l'écran
- Cartouche discret en bas, sur le chiffre le plus fort
- Format : `Source : Bellingcat / ACLED, mai 2026`
- Le spectateur enregistre "ils sourcent" sans se taper la liste

**Version longue (10 min)** : 2-3 marqueurs visuels max, espacés.

**Phrase de méta-positionnement** (1 par vidéo, optionnelle, précieuse) :
> "Le bilan officiel parle de X. Certaines sources avancent cinq fois plus. La vérité se trouve probablement entre les deux — et c'est précisément ce flou qui en dit long."

Place le spectateur au-dessus du brouillard sans le noyer.

---

## Anti-patterns absolus

À ne JAMAIS faire dans le script :
- "Selon Bellingcat, ACLED, et France 24..." (liste à rallonge)
- "Il faut nuancer..." (signal pédant)
- "D'un côté... de l'autre..." (faux équilibre journalistique)
- Plus de 3 chiffres consécutifs
- Toute phrase qui commence par "Selon..." en début de scène

**Souverain n'est pas un fact-checker. C'est un raconteur qui sait.**

---

## Biais de Claude à signaler (auto-rappel)

Claude a un biais d'entraînement occidental : ses données contiennent infiniment plus d'AFP/Reuters/BBC que de Maliactu/Mondafrique/Conflits. Quand Claude trie spontanément "fiable/pas fiable", il applique inconsciemment une grille qui privilégie les sources les plus vues, pas les plus justes.

**Garde-fou** : si Claude propose d'exclure une source africaine ou non-occidentale, lever un drapeau auprès d'Aziz. Préférer "étiqueter avec précaution" à "exclure".
