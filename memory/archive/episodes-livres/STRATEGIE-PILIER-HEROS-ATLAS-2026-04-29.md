# Stratégie pilier GeoAfrique — actée 2026-04-29 (ARCHIVE)

> Migré depuis auto-memory 2026-08-31. Décisions stratégiques sur l'architecture éditoriale de la
> chaîne GeoAfrique (projet aujourd'hui archivé dans `src/_archive/episodes-livres/`). Conservé
> comme référence de méthode (critères de sélection de figures, test de routage de format) — les
> décisions concrètes de priorisation sont probablement caduques (projet non actif).

## Decision principale : UN seul pilier, pas plusieurs

Le document strategique proposait d'ouvrir un nouveau pilier "Heros contemporains" en plus de "Heros Oublies". **Decision actee : c'est le meme pilier.**

Sonjata, Abou Bakari, Thiaroye sont des heros oublies de leur epoque (Moyen Age + colonial). Diop, Bâ, Coleman, Octavia Butler sont des heros oublies du XXe-XXIe. **Meme pipeline papercraft, meme promesse au viewer ("voici quelqu'un que la memoire dominante a efface").**

Consequence : pas besoin d'un seuil T+60 pour activer un nouveau pilier. C'est une **extension temporelle** du pilier existant.

## 3 modes de production complementaires

| Mode | Cout/temps | Sujet type | Cadence visee |
|------|------------|------------|---------------|
| **Atlas (Mapbox)** | Faible, 1 jour | Geographie, echelle, records, territoires (Tombouctou, Mansa Moussa carte, etc.) | 2x/semaine |
| **Heros (papercraft)** | Moyen, 2 jours pipeline rode | Figures historiques + contemporains XXe-XXIe, oubliees ou occultees | 1x/semaine |
| **Long-form** | Eleve, compilation | Patchwork des deux modes, pont passe/present | A explorer post-validation Shorts |

Atlas casse la repetitivite des Shorts papercraft (variete visuelle = anti-mono-tonal).

## Criteres de selection des figures (méthode réutilisable)

Toute nouvelle figure proposee doit cocher ces 5 critères :

1. **Mecconnaissance en francais** — asymetrie d'attention vs YouTube anglophone (Crash Course Black History etc.)
2. **Equilibre genre** — manque de figures feminines dans le pilier actuel
3. **Compatible visuellement avec papercraft** — arc dramatique condensable en 60-90s
4. **Litterature a jour** — fact-check rapide possible (heures, pas jours)
5. **Lien diaspora ou universel** — au-dela du cadre national

## Critere supplementaire : choix du FORMAT de production (acte 2026-05-05)

Avant de choisir Atlas ou Seedance Shorts pour un sujet, appliquer ce test :

**Question clé : quelle proportion des beats est de l'action géo ?**

| Profil du sujet | Format idéal |
|----------------|-------------|
| >50% territoire, commerce, données chiffrées, expansion carte | **Atlas** |
| >50% action physique (batailles, traversées, voyages, émotions) | **Seedance Shorts** |
| Mix équilibré carte + action | **Atlas avec inserts Seedance ponctuels** (cas Hannibal) |

**Exemples validés (historique GeoAfrique)** :
- Mansa Moussa = empire + routes + or + données → Atlas natif
- Empire Ghana = territoire + commerce + frontières → Atlas natif
- Sonjata = batailles + émotions + personnage → Seedance Shorts
- Hannibal = hybride (carte Beats 1/4/5 + action Beats 2/3) → Atlas avec inserts Seedance
- Ibn Battuta = voyages + terrain + rencontres → Seedance Shorts (ne pas faire en Atlas)
- Askia Muhammad = empire + administration + routes → Atlas natif
- Amina de Zaria = batailles + conquêtes + personnage → Seedance Shorts

**Règle anti-erreur (méthode réutilisable au-delà de GeoAfrique)** : si on se pose la question
"comment animer cette bataille/traversée sur la carte ?" → c'est le signal que le sujet n'est pas
carte-natif — il faut un autre moteur visuel.

**Why:** Hannibal session 2026-05-05 — 1 seule scène en 1 longue session car les beats d'action géo résistent à l'animation carte SVG. Pipeline Gemini composite → Seedance i2v compense mais complexifie la production. Shaka Zulu avait montré le même signal (abandonné). Acté pour éviter de reproduire l'erreur.

**Exemples qui passent** : Mariama Ba, Bessie Coleman, Cheikh Anta Diop, Wangari Maathai, Octavia Butler.
**Exemples qui ne passent pas** : Mansa Moussa (sature YouTube), Mandela (sature), Sankara seul (sature).

## Priorisation visee (post-publication 3 Shorts en cours, 2026-04-29)

1. Mariama Ba — pilote feminin, charsheet papercraft deja valide
2. Bessie Coleman — 5 tableaux geographiques riches (Texas/Chicago/Le Crotoy/shows/Floride)
3. Cheikh Anta Diop — figure intellectuelle senegalaise, completera Ba pour pilier Senegal
4. Wangari Maathai — pilier environnemental, Kenya, Prix Nobel

## Long-form compilation — potentiel exploré à l'époque

Si Sonjata + Thiaroye + Abou Bakari + 3-5 Shorts feminins = 6-9 minutes de matiere premium, peut devenir une **video long-format YouTube de 8-12 min** avec interludes Atlas (Mapbox) comme ponts entre figures.

RPM long-form > RPM Shorts.

## Statut au moment de l'archivage (2026-08-31)

Décidé le 2026-04-29, projet GeoAfrique depuis archivé (`src/_archive/episodes-livres/`). La chaîne
active est désormais Souverain. Les décisions concrètes (priorisation de figures) sont caduques ;
la MÉTHODE (critères de sélection de figures + test de routage carte vs action) reste réutilisable
si un pilier "héros" est un jour relancé.
