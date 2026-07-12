# Charte éditoriale Souverain — 1 page

> **Lock 2026-05-19.** Consolide les règles dispersées du projet + apports session "militant vs analyste".
> Lecture obligatoire avant tout nouveau script Souverain. Détails techniques dans `memory/rules/rules-souverain-editorial.md`.
>
> **Complément 2026-05-27 :** [ANGLE-MACRO-SOUVERAIN.md](ANGLE-MACRO-SOUVERAIN.md) — exécution concrète de la promesse "le viewer à Paris/Tokyo/Montréal" via l'angle macro (sujets africains vus depuis leur impact sur le monde). Ratio 70/30 macro/micro recommandé.
>
> **⭐⭐ RÈGLE N°1 (2026-06-16, AVANT TOUT) :** [SUJET-PRIME-SUR-PRODUCTION.md](SUJET-PRIME-SUR-PRODUCTION.md) — valider la DEMANDE du sujet + l'angle/titre AVANT toute production, tous formats. Le sujet décide du clic, la qualité du retour. Même un chef-d'œuvre visuel floppe si le sujet n'a pas de public. Gate ~30-60 min (TubeLab + trends + titres). PRIME sur tout (sans sujet à demande, le reste ne sert à rien — MAIS toujours DANS la niche + charte analyste).

---

## Positionnement (lock)

**Je couvre l'Afrique parce qu'elle est devenue le terrain où se décide le 21e siècle.**
J'écris pour le viewer curieux à Paris, Tokyo, Montréal ou Dakar qui veut comprendre pourquoi sa vie dépend de ce continent.

**Je ne suis ni militant ni neutre. Je suis analyste.**

Le militantisme paie en attention. L'analyse paie en argent — et sert mieux la diaspora éduquée que le militantisme cliché.

---

## Les 4 règles fermes

### 1. Pas de méchant désigné — uniquement systèmes, intérêts, bascules

Aucune vidéo ne pointe un acteur comme coupable. On décrit les forces structurelles qui produisent la situation : intérêts économiques, contraintes géopolitiques, bascules historiques. L'analyse remplace le jugement.

- INTERDIT : "La France pille encore l'Afrique"
- CORRECT : "Comment 14 pays partagent une monnaie qu'ils ne contrôlent pas"

⭐ **DEMANDE PROUVÉE DU PUBLIC (2026-06-28, validée 2× en commentaires Machi + Bhargav)** : sur le thème
« Afrique riche mais pauvre », le public RÉCLAME explicitement la nuance de RESPONSABILITÉ INTERNE (gouvernance,
institutions, choix locaux, faible transformation) — pas seulement le récit extractiviste/colonial. Les commentaires
les + likés sous les viraux du thème le confirment ("our thieves parading as leaders" 4,1k likes ; "after independence
we turned on each other"). C'est exactement le CRÉNEAU analyste vs désinfo : ni militantisme victimaire (qui plafonne),
ni racolage "EXPOSED". Mentionner la part interne RENFORCE la crédibilité (validé jury LLM 8,5/10 sur le short cacao).
Concrètement : sur ce thème, toujours coupler l'injustice externe avec ≥1 point factuel de responsabilité interne.

### 2. Chaque chiffre = source vérifiée (Perplexity sonar-pro après script lock)

Avant TTS, fact-check obligatoire via Perplexity sonar-pro. Croiser au moins 2 sources de camps différents (mainstream international + panafricain + OSINT/officiel). Voir `memory/rules/rules-souverain-editorial.md` Section 1 pour la grille 3 niveaux complète.

Maximum 3 chiffres par Short. Tout chiffre venant d'une seule partie d'un litige = attribution explicite dans la voix-off.

### 3. Test "couper l'audio" — la grammaire visuelle ne juge pas

Couper l'audio. Si les visuels seuls suggèrent qui sont les "méchants" / "victimes" → refaire. Couleurs, désaturation, hiérarchie de luminosité ne codent jamais un jugement moral subliminal. Voir Section 2 du fichier détaillé.

### 4. Format-aware — Short vs Mid-form n'ont pas les mêmes règles

| | Short (60-90s) | Mid-form (6-8 min) |
|---|---|---|
| Multi-perspective | 1 fait + 1 question ouverte | Multi-perspective explicite, 2-3 voix citées |
| Chiffres | 3 max | Dense ok, contextualisé |
| Thèse | 1 phrase obligatoire | Plusieurs angles autorisés |
| Méchant | Jamais désigné | Jamais désigné — mais analyse plus longue des intérêts |

**Sur un Short, "multi-perspective forcée" est impossible.** On cite un fait vérifié et on laisse le viewer assembler. C'est suffisant si les règles 1-2-3 tiennent.

---

## Test des 3 filtres avant audio lock

À appliquer sur chaque script Souverain avant génération TTS :

1. **Le titre identifie-t-il un méchant ?** Si oui → reformuler en mystère ou bascule.
2. **Un viewer occidental neutre se sentirait-il accusé ?** Si oui → reformuler en analyse système.
3. **Bloomberg, FT ou Le Monde pourraient-ils citer cette vidéo sans inconfort ?** Si non → reformuler.

Ces filtres n'empêchent pas de dire des choses fortes. Ils empêchent de basculer dans le clan.

---

## Test "image dans la tête" (Short uniquement)

Pour chaque phrase d'un script Short : "Est-ce que cette phrase génère naturellement une image dans la tête ?"

- Oui → garder
- Non → passer en Mid-form ou couper

Voir `memory/rules/rules-souverain-editorial.md` Section 7 pour gate complet Script-Format Fit.

---

## Titre hybride (formule)

`[Objet mondial connu] + [Verbe d'action] + [Lieu africain précis]`

| ❌ Militant | ✅ Hybride |
|---|---|
| "Le Niger reprend sa mine" | "Pourquoi l'uranium du Niger menace l'énergie française" |
| "Le Ghana récupère son or" | "Comment le Ghana a forcé les mines à payer le double" |
| "Le cobalt africain exploité" | "Cette batterie Tesla vient d'ici — et ça change tout" |

**Test :** "Est-ce que quelqu'un à Tokyo qui ne s'intéresse pas a priori à l'Afrique clique ?" Si non → reformuler.

---

## Stack business cible (rappel du pourquoi)

Le positionnement analyste débloque :
- Sponsors institutionnels (banques, think tanks, EdTech, finance, mining)
- Newsletter payante premium ($10-20/mois, audience décideurs)
- Produits B2B (rapports, briefings, formations)

Le positionnement militant plafonne sur AdSense diaspora et coupe la moitié supérieure du stack.

---

## Références internes (détails)

- `memory/rules/rules-souverain-editorial.md` — règles complètes (sources, couleurs, grammaire, Type B, format-fit, vulgarisation universelle, motivations visibles)
- grille des sources 3 niveaux détaillée (feedback archivé, supprimé)
- palette + test couper l'audio (feedback archivé, supprimé)
