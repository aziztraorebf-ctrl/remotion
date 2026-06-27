# Franc CFA — Short SVG — SCRIPT V5 (resserre post-jury)

> V5 = V4 corrige selon JURY LLM unanime (GPT 7 / Gemini 6.5 / Kimi 6) + duree (V4 ~3:50 = 2x trop long).
> Corrections : (1) hook DIRECT (pas "imaginez un instant") (2) -40% de mots (~270, cible ~2:05)
> (3) CTA FUSIONNE au punch (pas "analyse complete a venir") (4) chute = derniere phrase (5) Dakar = 1 image, pas une liste.
> Structure = CHRONO RESSERRE (choix Claude : sur sujet a mecanisme, le flashback Kimi ajoute trop de charge en 2min).
> Faits verrouilles (triple fact-check). Grade 9-10. ⛔ GATE DE SORTIE repassee (voir bas).

## TITRE
« La nuit où le franc CFA a été divisé par deux »

## SCRIPT (voix-off) — ~270 mots, ~2:05 à 125 mots/min

### BEAT 1 — Le choc 1994  [scène nocturne ; pièce qui se fend]
Le 12 janvier 1994, des millions d'Africains se sont couchés avec un certain montant.
Au réveil, leur argent valait deux fois moins.
En une nuit, le franc CFA venait d'être divisé par deux.
Personne ne les avait consultés.
Aujourd'hui, des pays entiers veulent quitter cette monnaie — et on va voir pourquoi.

### BEAT 2 — La parité fixe  [blueprint : cadenas EUR↔CFA]
Tout repose sur une règle simple : la parité fixe.
Un euro vaut toujours le même nombre de francs CFA, et ce chiffre ne change pas.
Cette stabilité protège les prix, et c'est un vrai avantage.
Mais quand une monnaie est verrouillée comme ça, quelqu'un tient la clé.

### BEAT 3 — Qui tient la clé  [blueprint : garantie Paris, flux]
Et cette clé, elle se trouve à Paris.
Le Trésor français garantit le franc CFA en fournissant des euros quand les réserves manquent.
Depuis 2020, l'Afrique de l'Ouest ne dépose plus ses réserves là-bas, mais la garantie, elle, est restée.
Voilà pourquoi, en 1994, les chefs d'État africains ont signé la dévaluation sous la pression du FMI et de la France.

### BEAT 4 — Le quotidien  [scène Dakar, colorisation sélective]
Et ça, ça se ressent jusque sur un marché de Dakar.
Le sac de riz importé se paie en devises, et quand l'euro grimpe, la facture grimpe avec lui.
La monnaie reste stable, mais le pays perd la main sur sa propre économie.

### BEAT 5 — Partir, à quel prix  [carte AES projetée d3-geo]
C'est pour ça que le Mali, le Niger et le Burkina veulent leur propre monnaie.
Et ils en ont le droit : d'autres sont déjà partis avant eux.
Mais partir coûte cher : sans ce verrou, une nouvelle monnaie peut s'effondrer, et les prix avec elle.
La vraie question n'est donc pas de savoir s'il faut partir.
C'est de savoir qui, au bout du compte, va payer le prix.
[le punch EST la fin. CTA visuel discret seulement : logo + "Abonnez-vous" en bandeau, PAS de voix-off CTA.]

---

## NOTES PRODUCTION (registre + colorisation + objets par scène)
- B1 nuit 1994 : scène nocturne, 1 pièce qui se fend en deux (anim cassure). HOOK = "argent valait deux fois moins" visuel fort dès 2s.
- B2 parité : blueprint froid, cadenas reliant "EUR" et "CFA". (656 retiré de la VO — jury: detail Wikipedia; le montrer a l'ecran si besoin, pas le dire.)
- B3 clé : blueprint, garantie Paris↔zone ; 2020 = 1 flèche (dépôt) se coupe, l'autre (garantie) reste.
- B4 Dakar : scène de vie, COLORISATION SÉLECTIVE — étal gris, SEUL le sac de riz "IMPORTÉ" s'allume (1 image forte, pas une liste — note jury). PAS d'humain.
- B5 carte : AES (sahel-countries.geojson) projetée d3-geo. 3 pays s'allument + balance "prix à payer". ⛔ géo jamais dessinée main.

## SCAN TTS FR
- "1994"→"dix-neuf cent quatre-vingt-quatorze" · "2020"→"deux mille vingt".
- Participes fin de groupe : "divisé par deux" (suivi compl., OK) · "consultés" fin de phrase → RISQUE léger.
  Alt si TTS bute : "Personne ne leur avait demandé leur avis."
- "ont signé" = ont+consonne OK.

## GATE DE SORTIE — auto-check [[DOCTRINE-SCRIPT-UNIFIEE]]
1. Zéro phrase sans verbe : ✅ chaque ligne sujet+verbe.
2. Connecteur Tremblay/beat : ✅ B1 "on va voir pourquoi" · B2 "Tout repose sur" · B3 "Voilà pourquoi" · B4 "ça se ressent jusque" · B5 "C'est pour ça".
3. on/nous, pas de "tu", pas de CTA voix-off dans le hook NI ailleurs (CTA = visuel seulement) : ✅.
4. 1 idée/phrase ≤22 mots, tampons (AES implicite "Mali/Niger/Burkina", FMI), grade 9-10 : ✅.
5. DURÉE : ~270 mots → ~2:05 à 125 wpm. ✅ sous 2:20. (V4 faisait ~3:50.)
