# Doctrine War-Map Long Format (5-7min)

> **Lock 2026-06-06.** Nouveau genre validé lors de la session AES/Sahel.
> Distinct de Souverain Mid-form (alterne map/data-viz) et de War-Map Short (9:16, 60-90s).
> Format : 16:9, 5-7min, carte permanente à l'écran, overlays semi-transparents.
> Référence script : `memory/episodes/warmap-sahel/SCRIPT-V3-FINAL-2026-06-06.md`

---

## Positionnement — Ce que ce format est (et n'est pas)

**Ce que c'est :**
- Un format analytique géopolitique long — entre Al Jazeera English explainer et war-map cartographique
- Public : africain engagé + international curieux, connaît vaguement le sujet, veut le cadre interprétatif
- Ton : réalisme stratégique sobre — jamais partisan, jamais "HUMILIE/SHOCKS"
- Référent BBC Afrique x33 : sobre + factuel + question ouverte = performance maximale

**Ce que ce n'est pas :**
- Souverain Mid-form : qui alterne carte et data-viz plein écran
- War-Map Short : qui est 9:16, 60-90s, action pure
- Atlas : qui est narratif historique avec personnages
- Script César ou Médiéval Mindset : structures de compression pour Shorts

---

## La règle fondamentale — La carte ne disparaît jamais

La carte est l'ancre visuelle permanente. Elle est à l'écran du début à la fin.

Les données viennent à la carte. La carte ne va jamais aux données.

**Pourquoi :** le cerveau développe une relation spatiale avec la carte au fil de la vidéo. Chaque coupure vers un plein écran data-viz rompt cette relation. Le viewer doit reconstruire mentalement où il était sur la carte. C'est une friction invisible mais réelle qui érode la rétention.

**Ce que font les war-maps à haute rétention (Ollie Bye, Al Jazeera carto) :** la carte ne quitte jamais l'écran. Les informations sont des calques sur la carte, pas des remplacements.

---

## Système d'overlays — La hiérarchie des calques

Trois niveaux d'overlay sur la carte, selon la densité d'information :

### Niveau 1 — Points et labels (opacité 100%, taille petite)
- Villes qui s'allument quand la voix les cite
- Points militaires, points de conflit
- Dates apparaissant sur la carte
- **Règle :** chaque nom de lieu cité à l'audio = ce lieu s'allume sur la carte au moment exact où le mot est prononcé. Jamais un nom dans le vide.

### Niveau 2 — Overlays informatifs (opacité 65-75%)
- Chiffres clés (budget, soldats, territoire)
- Icône + donnée courte (max 5 mots)
- Apparaissent pendant 4-6 secondes, disparaissent
- **Règle carte :** slow drift continu pendant l'overlay. La carte vit, elle ne se fige pas pour un chiffre.

### Niveau 3 — Overlays atmosphériques (opacité 40-55%)
- Données humanitaires (déplacés, insécurité alimentaire)
- Questions ouvertes en fin d'acte
- Citations courtes
- **Règle carte :** carte figée 2-3 secondes maximum, puis slow drift reprend. Le visuel respire avec l'audio.

**Anti-pattern absolu :** data-viz plein écran, graphique qui remplace la carte, insert séparé de la carte. Ces éléments appartiennent à Souverain Mid-form, pas à War-Map Long.

**Hiérarchie des calques — règle de priorité (validée Aziz 2026-06-07) :**
1. **Objet géo-ancré sur la carte** — si l'information a une localisation précise, elle devient un objet sur la carte (jeton-visage, icône ressource, sprite char). Jamais un overlay texte flottant pour remplacer quelque chose qui peut être montré directement sur la carte.
2. **Overlay texte** — uniquement si l'information n'a pas d'équivalent spatial précis : chiffre global sur 3 pays, concept monétaire, tampon acronyme première apparition, date jalon.

Test rapide avant de coder un overlay : *"Peut-on montrer cette information directement sur la carte sous forme d'objet ?"* Si oui → objet géo-ancré. Si non → overlay autorisé.

---

## Structure en 5 actes (5-7min)

| Acte | Durée | Rôle | Régime audio-visuel dominant |
|---|---|---|---|
| **1 — Rupture** | 0:00-0:55 | Anomalie + question centrale + contexte carte | Question posée, carte s'active |
| **2 — Blocage** | 0:55-2:35 | Mécanisme causal profond — pourquoi ça a échoué | Dense, overlays N2 fréquents, slow drift |
| **3 — Épreuve terrain** | 2:35-4:05 | Événement clé sur la carte — symbole concret | War-map pur, flèches, zoom tactique |
| **4 — Coût réel** | 4:05-5:00 | Populations + ressources — qui paie, qui tient | Overlays N3 humanitaires, respiration |
| **5 — Perspective** | 5:00-5:25 | Question ouverte — pas de verdict | Dézoom, carte globale, silence |

---

## RÈGLE ABSOLUE — Script-first avant tout code (NON-NEGOTIABLE)

**Avant de coder TOUTE scène, TOUT acte, TOUT effet visuel :**

1. **Ouvrir le script visuel** (`SCRIPT-VX-FINAL.md` de l'épisode)
2. **Lire la section correspondante phrase par phrase**
3. **Lister les événements visuels attendus** (pays qui s'allume, overlay qui apparaît, sprite qui entre)
4. **Mapper chaque événement sur un trigger frame** (depuis `TIMING-V1.md` ou le forced alignment)
5. **Coder SEULEMENT ce qui est dans le script** — jamais interpoler ou "compléter" de mémoire

**Erreur mortelle :** partir du pattern Sudan/engine existant et "adapter" en espérant que le comportement global correspond. Le résultat : un hook de 10 secondes complètement vide alors que le script demande 7 événements visuels précis.

**Format de traçabilité obligatoire dans le code :**
```typescript
// SCRIPT: "Ils ont expulsé leurs partenaires militaires."
// VISUEL: Mali s'allume en blanc → frame ~240 (trigger depuis TIMING-V1)
```

Chaque bloc de code visuel doit tracer sa source au script. S'il n'y a pas de ligne de script correspondante — le code ne doit pas exister.

---

## Le hook — Structure obligatoire

Le hook d'un War-Map Long doit combiner deux canaux simultanément :

**Audio (Option A — contradiction chiffrée) :**
> [Chiffre d'investissement/présence] + [résultat inverse] + [promesse narrative]
> Exemple : "5 500 soldats, dix ans, deux milliards par an. Les groupes armés contrôlent plus de territoire qu'au départ. Ce n'est pas un échec de plus — c'est la rupture qui a tout déclenché."

**Visuel (Option C — carte qui s'étend) :**
> La carte montre l'expansion de la zone de conflit en temps réel pendant que l'audio pose les chiffres.

Les deux canaux se renforcent. L'audio pose le paradoxe, le visuel le prouve géographiquement.

**Cible de rétention à 30 secondes :** >70%. Si le hook ne crée pas de réaction ("attends, quoi ?") dans les 10 premières secondes — réécrire.

---

## Trois régimes audio-visuel — Reconnaître et choisir

**Régime 2 — Complémentarité (cible permanente)**
La voix dit A, le visuel montre B qui prouve ou amplifie A.
→ "La zone rouge s'étend" + la carte s'étend réellement.
→ Rétention maximale. Viser ce régime sur 70%+ de la vidéo.

**Régime 1 — Redondance (à éviter)**
Le visuel montre exactement ce que la voix dit.
→ "La France envoie des soldats" + image de soldats.
→ Le cerveau traite deux fois la même information. Ennui.

**Régime 3 — Compétition (danger)**
Le visuel est si complexe qu'il capte toute l'attention au détriment de l'audio. Ou l'audio est si dense que le viewer arrête de regarder la carte.
→ Passages analytiques abstraits (accords diplomatiques, mécanismes économiques) sans ancrage visuel.
→ Résoudre avec overlay N2 synchronisé ou slow drift.

---

## Règles de mouvement caméra pendant overlays

| Moment | Mouvement carte | Pourquoi |
|---|---|---|
| Overlay N2 informatif | Slow drift continu | La carte vit, ne compete pas avec le chiffre |
| Overlay N3 humanitaire | Figée 2-3s max, puis slow drift | Le viewer lit le chiffre, puis la carte reprend |
| Passage abstrait sans overlay | Slow zoom très lent (10-15s pour 10%) | L'œil est occupé sans décoder |
| Acte de terrain (flèches, offensive) | Zoom tactique dynamique | La carte EST l'action |
| Question finale | Dézoom lent vers vue globale | Respiration + ouverture |

---

## Différences avec Souverain Mid-form

| Critère | Souverain Mid-form | War-Map Long |
|---|---|---|
| Carte | 40-50% du temps | 100% du temps |
| Data-viz | 25-30% plein écran | Overlays sur carte uniquement |
| Public | Grand public, ne connaît pas | Engagé, connaît vaguement |
| Ton | Macro-économique analytique | Géopolitique réalisme stratégique |
| Structure | 4 actes | 5 actes |
| Hook | Chiffre choc + question | Contradiction + carte qui prouve |
| Transitions | Changement visuel marqué | Zoom/dézoom dans la même carte |

---

## Niveau de langage

Grade 10-11 obligatoire. Voir `SCRIPT-ORAL-DOCTRINE.md` pour les règles complètes.

Spécificités War-Map Long :
- Vocabulaire géopolitique autorisé si tampleté (JNIM, CEDEAO, CSP...)
- Vocabulaire militaire sobre autorisé (offensive, positions, reconquête)
- Interdit : jargon universitaire, constructions nominales abstraites, "acteur", "dynamique", "paradigme"

---

## Checklist avant audio lock (War-Map Long)

**Script :**
- [ ] Anomalie + contradiction dans les 10 premières secondes
- [ ] Question centrale posée avant 0:20
- [ ] Tous les acronymes tamponnés au premier passage
- [ ] Phrase de liaison entre chaque acte
- [ ] Aucune phrase > 22 mots
- [ ] Chiffres clés : 6-8 max sur tout le script

**Synchronisation audio-visuelle :**
- [ ] Chaque lieu cité = point qui s'allume sur la carte au mot exact
- [ ] Chaque overlay N2 placé sur la phrase exacte qu'il illustre
- [ ] Aucun passage abstrait > 30s sans overlay ou mouvement caméra
- [ ] La carte ne disparaît jamais

**Ton :**
- [ ] Zéro terme partisan ("jante" → "transition militaire", "coup" → "basculement")
- [ ] Multi-perspective explicite : au moins 2 lectures factuelles sur les événements clés
- [ ] Question finale ouverte — pas de verdict

---

## Pipeline production War-Map Long

1. **Recherche OSINT** — ACLED/UCDP/ISW + web + fact-check (`WARMAP-RESEARCH-PLAYBOOK.md`)
2. **Données JSON** — schema canonique `sahel.warmap.json`
3. **Script V1** — draft libre, fond analytique
4. **Jury LLM** — perspective africaine + biais géopolitique (session séparée)
5. **Script V2** — corrections jury
6. **Script V3-final** — toutes corrections : hook, liaisons, tampons, grade 10-11, synchro audio-visuelle
7. **Fact-check Perplexity** — tous les chiffres avant audio lock
8. **Audio ElevenLabs** — GéoAfrique V2, règles TTS françaises
9. **Code WarMapEngine** — moteur Sahel à partir de Sudan comme base
10. **Render + review**

---

## Référence script canonique — À IMITER (lock 2026-06-07)

**`memory/episodes/warmap-sahel/SCRIPT-V4-FINAL-2026-06-07.md`** — référence obligatoire pour tout nouveau script War-Map Long.

Ce script est la référence canonique à imiter sur :
- **Ton** : réalisme stratégique sobre, jamais partisan, multi-perspective explicite (France = intérêts nommés + Moura documenté + CFA posé comme question ouverte)
- **Style oral** : grade 10-11 appliqué — phrases ≤22 mots, "et alors?" visible entre chaque, constructions verbales avec sujet, tampons sur tous les acronymes (JNIM, EIGS, FAMa, CSP, MINUSMA, Africa Corps, CEDEAO, Liptako-Gourma)
- **Structure 5 actes** : Rupture (anomalie+question <20s) → Blocage (causal dense) → Épreuve terrain (war-map pur, Kidal) → Coût réel (populations+ressources) → Perspective (question ouverte, pas de verdict)
- **Hook validé** : Option C visuel (carte s'étend + flammes) + Option A audio ("cinq mille cinq cents soldats, dix ans, près d'un milliard par an. Les groupes armés contrôlent plus de territoire qu'au départ.")
- **Synchro audio-visuelle précise** : chaque lieu allumé au mot exact prononcé (Djibo/Ménaka/Tillabéri séquentiels, Kidal au mot "flotte", Gao/Ménaka/Niamey séquentiels pour bases militaires), sprites chars JNIM/EIGS/FAMa/CSP, drapeau malien au mot exact, silhouettes réfugiés au mot exact
- **Perspective africaine** : intérêts nommés sans hiérarchisation morale, populations comme sujets (noms de villes), "elle appartient aux Sahéliens" final non-commenté
- **Chiffres fact-checkés** : 5 corrections appliquées (Moura cinq jours, budget Barkhane ~1Md€/an, uranium "fournissait une part significative", 3 millions déplacés, 18 millions insécurité alimentaire)

**Pour démarrer un nouveau script War-Map Long :** lire ce fichier complet AVANT de rédiger. Puis appliquer la structure 5 actes + checklist ci-dessus.

---

## Références internes

- `memory/doctrines/WARMAP-PLAYBOOK.md` — doctrine design war-map (briques, R1-R6)
- `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` — doctrine données OSINT
- `memory/doctrines/SCRIPT-ORAL-DOCTRINE.md` — règles script oral grade 10-11
- `src/projects/warmap/WARMAP-INDEX.md` — point d'entrée code
- `memory/episodes/warmap-sahel/SCRIPT-V4-FINAL-2026-06-07.md` — **RÉFÉRENCE CANONIQUE** (remplace V3-FINAL)
