# Verdict gemini-31-pro-preview

## Verdict global (MOYEN)
Le script a une excellente ossature et comprend l'ADN de la chaîne : on parle de systèmes, pas de morale. La progression narrative (Anomalie → Démonstration → Mécanismes) est solide. En revanche, le script trébuche sur la vulgarisation économique (une erreur factuelle sur la dette), manque d'une voix systémique pour expliquer les frictions contractuelles, et sature cognitivement dans l'Acte 3. C'est un bon brouillon, mais il n'est pas encore prêt pour le studio.

---

## AXE 1 — Hook : MOYEN
**Justification :** Le retournement narratif (catastrophe vs miracle) fonctionne, mais la phrase "Personne ne vous explique comment ça marche vraiment" est un cliché YouTube usé qui sonne creux. Le vrai hook de ce script, c'est l'argent brut généré par un pays novice, contrasté avec la question de la rétention. 
**Correction :** Supprime la phrase clichée. Passe directement de la dualité (catastrophe/révolution) au fait brut. 
*Remplacement :* "La réalité se joue loin des discours militants. En juin 2024..." 
*Amélioration visuelle :* Ajoute un `PulseNumber` massif sur "8 millions de dollars" pendant l'Acte 1 pour ancrer l'enjeu financier avant le re-hook textuel.

## AXE 2 — Clarté : MOYEN
**Justification :** Le Mécanisme 1 (contrat) et le Mécanisme 3 (Chine) sont clairs. Le Mécanisme 2 (FONSIS/Dette) contient une aberration économique qui va détruire ta crédibilité : *"une dette publique qui dépasse 70% du PIB — sur chaque euro que l'État dépense, soixante-dix centimes sont déjà empruntés"*. C'est faux. Le PIB est un stock/flux macro, le budget de l'État en est un autre. Tu confonds le ratio Dette/PIB avec le déficit budgétaire.
**Correction :** Reformule pour être factuellement inattaquable tout en gardant l'impact.
*Remplacement :* "...avec une dette publique qui équivaut à 70% de la richesse annuelle du pays, le service de cette dette asphyxie déjà le budget. La tentation de piocher dans l'argent du pétrole pour payer les factures d'aujourd'hui est immense."

## AXE 3 — Rythme : FAIBLE
**Justification :** L'Acte 3 dure 2 min 30 s et balance trois concepts lourds (fiscalité internationale, macroéconomie des fonds souverains, géopolitique de la transition énergétique). Tu violes ta propre règle de "1 concept max par minute". Le spectateur va décrocher au Mécanisme 2.
**Correction :** Il faut des marqueurs visuels beaucoup plus tranchés entre les mécanismes pour réinitialiser l'attention. 
* Ajoute un `BrutalHeadline` ou un `TypeReveal` d'une seconde ("MÉCANISME 2 : LE PIÈGE DE LA DETTE") avant de lancer la voix off. 
* Fais des pauses audio strictes de 1.5s *entre* chaque mécanisme, sur fond noir ou kraft brut.

## AXE 4 — Multi-perspective : MOYEN
**Justification :** Tu as les acteurs, mais tu traites Woodside de manière superficielle. Tu mentionnes leur contentieux avec Dakar, ce qui donne l'impression qu'ils "fraudent", frôlant la désignation d'un méchant. Pour être "Souverain", tu dois expliquer *l'intérêt systémique* de Woodside (le *Cost Recovery* — le droit de rembourser ses coûts d'investissement avant de partager les profits).
**Correction :** Dans le Mécanisme 1, ajoute 10 mots pour donner la perspective de la major. 
*Ajout :* "...un redressement que la compagnie conteste au nom du remboursement de ses coûts initiaux massifs d'infrastructure." Cela montre un affrontement de logiques financières, pas un affrontement Bien/Mal.

## AXE 5 — Charte : FORT
**Justification :** Très bon travail sur le ton. Le refus d'accuser les compagnies de pillage ou l'État de corruption est respecté. La comparaison Norvège/Congo/Botswana est excellente car elle prouve visuellement que la ressource n'est pas le destin, validant la thèse des "mécanismes". Rien à corriger ici.

## AXE 6 — Visuels : MOYEN
**Justification :** Le choix des templates est globalement pertinent, mais mal calibré sur deux moments clés. 
1. Utiliser un `FillScreen 70%` pour illustrer la dette publique est un mauvais usage du template (qui sert à montrer un remplissage physique ou une part d'un tout absolu).
2. Il manque un support visuel pour expliquer le partage des revenus (les fameux 60%).
**Correction :** 
* Pour la dette (Mécanisme 2) : Remplace le FillScreen par un `ScaleShock` (deux cercles) comparant le budget de l'État sénégalais et le montant de la dette, pour créer un vrai choc d'échelle visuel.
* Pour le Mécanisme 1 (Contrat) : Le `KraftCardDocClassifie` est bon, mais insère juste après un `StackedBars` ultra-simplifié (Barre 1 : Revenu brut / Barre 2 : Part remboursée à Woodside / Barre 3 : Reste à partager). Cela encodera visuellement pourquoi ils se battent.

---

## Top 3 corrections prioritaires

1. **Corriger l'erreur macroéconomique sur la dette (Acte 3).** La confusion Dette/PIB vs Déficit budgétaire est éliminatoire pour la cible "bac+3 exigeante" de la chaîne.
2. **Ralentir et segmenter l'Acte 3.** Insérer des `TypeReveal` francs et des pauses audio entre les 3 mécanismes pour baisser la densité cognitive et respecter la règle d'un concept par minute.
3. **Citer la logique de Woodside (Cost recovery).** Pour respecter la règle d'analyse systémique (multi-perspective), explique *pourquoi* la major conteste le fisc, plutôt que de simplement constater le conflit.
