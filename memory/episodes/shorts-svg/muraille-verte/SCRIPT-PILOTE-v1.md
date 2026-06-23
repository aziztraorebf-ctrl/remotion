# SCRIPT PARLE — Pilote Short SVG Grande Muraille Verte (v1, vertical 9:16, ~80s)

> Cale sur le storyboard 6 beats ([[STORYBOARD-PILOTE]]). Voix GeoAfrique V2 (ElevenLabs). Ecrit TTS-safe des le depart.
> Etoile polaire : "On a cru qu'on arreterait le desert avec un mur d'arbres. On avait tort — la vraie solution etait deja sous nos pieds."
> Regles TTS FR appliquees (CLAUDE.md + [[TTS-V3-TAGS-REGLES]]). Voir section VIGILANCE TTS en bas.

## SCRIPT (texte voix off, beat par beat)

**BEAT 1 — HOOK (~0-12s)** [LOCK v2 2026-06-23]
> Voici le plus grand projet ecologique de la planete.
> Un mur d'arbres de huit mille kilometres, du Senegal jusqu'a Djibouti, pour barrer la route au desert.
> Un reve immense. Et pourtant, il s'effondre presque partout. Pourquoi ?

**BEAT 2 — L'ECHEC (~12-28s)**
> L'idee de depart : aligner des arbres, en ligne droite, face au sable.
> Au Nigeria, trois arbres sur quatre meurent en deux mois.
> Au Senegal, sur trente-six zones plantees, une seule reverdit vraiment.
> Les scientifiques sont durs : sur le papier, cette idee n'avait aucune chance.

**BEAT 3 — LE MALENTENDU (~28-42s)**
> Parce qu'on se trompait d'ennemi.
> Le desert n'avance pas comme une armee qu'un mur pourrait stopper.
> La terre, elle, meurt sur place, faute d'eau.
> Et planter des arbres assoiffes dans un sol deja mort, ca ne pouvait pas tenir.

**BEAT 4 — LE RETOURNEMENT / DEMI-LUNE (~42-60s)** ⭐ scene-coeur
> Mais la vraie reponse, des paysans du Sahel la connaissaient deja.
> Pas un mur. Une simple cuvette en demi-lune, creusee a la main, qui retient la pluie.
> L'eau s'enfonce dans le sol... et reveille des racines encore vivantes, endormies sous le sable.
> Sans planter un seul arbre.

**BEAT 5 — LA PREUVE (~60-75s)** [LOCK v3 2026-06-23]
> Le resultat ? Au Niger, deux cents millions d'arbres reviennent.
> Aucune main ne les a plantes la. La nature les a fait revenir. Pour vingt dollars l'hectare.
> Et la ou les paysans creusent ces trous qui retiennent la pluie, l'eau remonte dans les puits. Parfois de dix-sept metres.

**BEAT 6 — OUTRO + CTA (~75-85s)**
> La leçon tient en une phrase : on n'arrete pas le desert en lui livrant bataille de front.
> On reveille la vie qui dort deja dans la terre.
> Et ça, ce ne sont pas les grands plans internationaux qui l'ont compris en premier. Ce sont les paysans.
> Quel pays veux-tu qu'on explore ensuite ? Dis-le en commentaire.

---
## ⚠️ VIGILANCE TTS (scan avant generation ElevenLabs)
Regle 1 (ZERO participe passe "é/ée" en FIN de groupe) — points a surveiller / deja traites :
- "il a presque entierement echoue" -> "echoue" est en fin de phrase. ⚠️ A TESTER (participe passe final). Alt si robotique : "il a presque tout rate" (rate aussi participe... ) -> mieux : "et pourtant, il s'effondre presque partout."
- "trente-six zones plantees" -> "plantees" PAS en fin de groupe (suivi de "une seule reverdit") = OK.
- "des arbres assoiffes dans un sol deja mort" -> "assoiffes" pas en fin = OK ; "mort" adjectif = OK.
- "deux cents millions d'arbres reviennent" -> present, OK (evite "sont revenus" = ont+voyelle/participe).
- "Pas plantes. Revenus." -> ⚠️ "plantes" et "Revenus" en fin de groupe court = RISQUE. Alt : "Personne ne les a plantes" -> garder mais TESTER ; ou "Pas par la main de l'homme. Par la nature."
Regle 2 (ZERO "ont + voyelle") : "la connaissaient deja" (imparfait, OK, evite "ont connu"). "reviennent"/"remonte" present = OK.
Regle 4 (nombres en LETTRES) : ✅ "huit mille", "trois...sur quatre", "trente-six", "deux cents millions", "vingt dollars", "dix-sept metres". (Verifier rendu "huit mille kilometres".)
Regle 3 (villes "s" final) : "Djibouti" (pas de s final, OK), "Senegal", "Nigeria", "Niger", "Sahel" — RAS.
Accents FR : le script doit etre genere AVEC accents (ne pas amputer). Ici en .md ok ; au lock, version accentuee complete.

## TIMING ESTIME
~80s a debit GeoAfrique (lente). Si trop long au mesure (ffprobe apres generation) : couper B2 ("Les scientifiques sont durs...") ou alleger B3.

## NEXT
1. Aziz valide le texte (ton, faits, CTA).
2. Traiter les 2-3 points TTS a risque (echoue / plantes-revenus) -> reformuler si besoin.
3. Generer narration ElevenLabs GeoAfrique -> mesurer (ffprobe) -> timing.ts.
4. Prototyper le fil de transition + generer les 5 scenes manquantes.
