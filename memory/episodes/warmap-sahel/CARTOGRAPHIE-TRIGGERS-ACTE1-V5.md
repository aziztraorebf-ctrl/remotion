# Cartographie triggers ACTE 1 → narration V5 (expressive)

> **Date** : 2026-06-15
> **Objet** : Remapper chaque trigger visuel hardcodé de l'Acte 1 (`SahelWarMapEngine.tsx`, mode `acte1Final`,
> composition `SahelActe1-Final`, 2300 frames @30fps) sur le VRAI transcript de la narration **V5 expressive**.
> **Problème** : les triggers `F_*` / `A1.*` ont été calés sur la narration **V1** (commentaires de code citant des mots
> qui n'existent plus dans V5, qui est REFORMULÉE). On recale sur le sens, pas le mot.
>
> **Sources de vérité** :
> - Transcript V5 résumé : `/tmp/v5-transcript.txt`
> - Alignment brut (frame = round(start × 30)) : `public/_shared/audio/sahel-warmap/narration-v5-alignment.json`
>
> **Mission = lecture seule.** Aucune modif de `SahelWarMapEngine.tsx`. Ce fichier est le plan de recalage.

---

## ⚠️ Note structurelle importante (à savoir avant de recaler le code)

L'Acte 1 est piloté par **DEUX familles de constantes redondantes** qui portent les MÊMES valeurs :

1. **Bloc `A1` (lignes 144-148)** = les vrais drivers visuels en `acte1Final` (caméra, ignition séquentielle des
   pays via `effSeqIgnite = { MLI: A1.MALI, BFA: A1.BURKINA, NER: A1.NIGER }`, freeze, friction véhicules).
2. **Constantes `F_HOOK_*` (lignes 389-395) + `F_*` corps (330-352)** = utilisées pour les pulses de pays au hook
   (`pulseFor(F_HOOK_MALI)` etc.), CEDEAO, Liptako, drift, tampons JNIM/EIGS, infusion factions.

`F_HOOK_MALI`==`A1.MALI`==150, `F_HOOK_BURKINA`==`A1.BURKINA`==231, etc. **Recaler l'un SANS l'autre désynchronisera
la carte.** Les deux familles doivent recevoir la même nouvelle valeur. Le tableau ci-dessous regroupe les paires.

Par ailleurs `ACTE1_CAM_KEYS` (lignes 524-543) duplique les MÊMES frames (150/231/301/382/502/572/632/726/1198/1749/2167/2299)
dans ses keyframes caméra → à recaler aussi sinon la caméra "va voir" l'action au mauvais moment.

---

## Table de cartographie

| Trigger (constante / paire) | Frame actuelle | Ce qu'il déclenche | Mot/phrase V5 correspondant | Frame V5 réelle | Delta (V5−actuel) | Verdict |
|---|---|---|---|---|---|---|
| `A1.MALI` = `F_HOOK_MALI` | 150 | Mali s'allume (ignition + pulse blanc) | « chassent » (chassent leurs partenaires) | 145 | −5 | OK (limite) |
| `A1.BURKINA` = `F_HOOK_BURKINA` | 231 | Burkina s'allume (ignition + pulse) | « Rompent » (rompent leurs alliances) | 217 | −14 | RECALER |
| `A1.NIGER` = `F_HOOK_NIGER` | 301 | Niger s'allume (ignition + pulse) | « quittent » (quittent l'organisation) | 286 | −15 | RECALER |
| `A1.CEDEAO` = `F_HOOK_CEDEAO` | 382 | Anneau CEDEAO clignote orange puis s'éteint | « continent. » (…du continent) | 361 | −21 | RECALER |
| `A1.LIPTAKO` = `F_HOOK_LIPTAKO` | 502 | Vecteurs capitales → Liptako pulse or (soudure) | « nouveau. » (quelque chose de nouveau) | 477 | −25 | RECALER |
| `A1.FREEZE` = `F_HOOK_FREEZE` | 572 | FREEZE caméra 2s (carte figée) | « possible » (Comment est-ce possible ?) | 539 | −33 | RECALER |
| `A1.FREEZE_END` | 632 | Fin du freeze (= FREEZE + 60) | dérivé du freeze recalé (≈ 539 + 60 = 599) | ≈599 | −33 (suit FREEZE) | RECALER |
| `A1.DRIFT` = `F_HOOK_DRIFT` | 726 | Drift caméra reprend + `politicalDim` 1→0.42 | « répondre » (Pour répondre à cette question) | 684 | −42 | RECALER |
| `F_FACTIONS_INFUSE` | 900 | Couleurs de faction infusent la carte (fin du parchemin neutre du hook) | « cette région » (Dans cette région, deux groupes…) | 900 (« cette ») / 907 (« région ») | 0 à +7 | OK |
| `F_JNIM_ZONE` = `A1.JNIM` | 1198 | Zone rouge JNIM apparaît ; ancre jetons JNIM + caméra push-in Mali central | « JNIM. » (…s'appelle le JNIM) | 1132 | −66 | RECALER (gros écart) |
| `jnimStampOp` (= `F_JNIM_ZONE` + 25) | 1223 | Tampon « JNIM » (anti-redondance, calé sur Al-Qaïda) | « Al-Qaïda. » (groupe lié à Al-Qaïda) | 1192 | −31 | RECALER |
| `A1_REGION_PULSES["jnim-mali"]` | 1411 | Régions Mopti/Ségou s'embrasent (centre du Mali) | « centre » 1310 / « Mali, » 1324 | 1310–1324 | −101 à −87 | RECALER (gros écart) |
| `A1_REGION_PULSES["jnim-bfa"]` | 1454 | Régions Sahel/Nord/Centre-Nord BFA s'embrasent | « Burkina » 1361 / « Faso. » 1375 | 1361–1375 | −93 à −79 | RECALER (gros écart) |
| `F_BURKINA` = 1471 (city `Ouagadougou.appearFrame`) | 1471 | Apparition label/ville Ouagadougou | « Faso. » (nord du Burkina Faso) | 1375 | −96 | RECALER (gros écart) |
| `eigsStampOp` (= 1749 + 25 = 1774) | 1774 | Tampon « EIGS » (calé sur Daesh en V1) | « l'EIGS. » 1461 / « Daesh. » 1523 | 1461 / 1523 | −313 / −251 | RECALER (gros écart) |
| `A1.EIGS` | 1749 | Apparition jetons/véhicules EIGS (est, trois-frontières) + caméra trois-frontières | « second s'appelle l'EIGS » 1461 (ou « deux groupes ne coopèrent » 1745–1749 si calé sur le bilan) | 1461 (réf nommage) | −288 | INCERTAIN — voir note ❶ |
| `A1_REGION_PULSES["eigs-3f"]` | 1942 | Régions Ménaka/Tillabéri (zone des trois frontières) | « zone » 1611 / « frontières, » 1629 | 1611–1629 | −331 à −313 | RECALER (gros écart) |
| `A1_REGION_PULSES["eigs-niger"]` = `F_NIGER` | 2009 | Régions Tillabéri/Tahoua (nord-ouest du Niger) | « nord-ouest » 1667 / « Niger. » 1690 | 1667–1690 | −342 à −319 | RECALER (gros écart) |
| `A1.FRICTION` | 2167 | Friction des jetons (JNIM ↔ EIGS se rejoignent puis reculent) | « combattent. » (Parfois, ils se combattent) | 1840 | −327 | RECALER (gros écart) — voir note ❷ |
| `A1.END` | 2299 | Respiration finale / freeze de fin Acte 1 | dernière idée Acte 1 « combattent » 1840 ; transition « Pour comprendre » 1912 | ≈1840–1912 | ≈ −387 à −459 | INCERTAIN — voir note ❸ |

---

## Notes d'élucidation

❶ **`A1.EIGS` (1749)** — Le code ancre l'apparition EIGS à f1749. Or en V5 « l'EIGS » est nommé bien plus tôt (f1461),
et « Daesh » à f1523. La valeur 1749 correspond presque exactement, en V5, à « **Les deux groupes** » (f1745-1749, début
de « ne coopèrent pas »). **Deux lectures possibles** : (a) recaler EIGS sur le nommage f1461 (cohérent avec JNIM calé
sur son nommage) → écart −288 ; (b) garder ~1749 si l'intention est de faire apparaître EIGS au moment du bilan
« deux groupes ». **À trancher avec Aziz** : EIGS doit-il s'allumer au NOMMAGE (f1461) comme JNIM, ou plus tard ?
Recommandation : symétrie avec JNIM → nommage f1461.

❷ **`A1.FRICTION` (2167)** — Déclenche la convergence puis la répulsion des jetons (« parfois ils se combattent »). En V5
« combattent » est à f1840. Mais TOUTE la chorégraphie de jetons (`ACTE1_VEHICLES`, `FIGHTERS`) est codée en waypoints
référencés à f2167 / f2299. Recaler ce trigger impose de recaler aussi les `wp:[{f:…}]` des jetons (lignes 188-258),
sinon les jetons arriveront au contact 327 frames trop tard. C'est un recalage en cascade, pas un simple nombre.

❸ **`A1.END` (2299)** — C'est la borne de fin de composition (`durationInFrames={2300}` dans Root.tsx). En V5, le
contenu narratif de l'Acte 1 (« ils se combattent ») finit vers f1840, et la phrase de transition « Pour comprendre
comment ces deux groupes ont pu prospérer » va jusqu'à ~f1912 ; « Tout bascule en 2012 » (= Acte 2 / Partie 1) démarre
à f2096-2102. **Donc l'Acte 1 V5 est SENSIBLEMENT PLUS COURT que 2300 frames** : il se termine narrativement autour de
f1900-2096, pas f2299. **À trancher avec Aziz** : faut-il (a) raccourcir la composition Acte 1 (~1950-2100 frames) et
décaler d'autant le raccord Partie 1, ou (b) garder 2300 frames avec une respiration/hold plus longue en fin d'acte ?
C'est une décision de montage (durée de l'acte), pas un simple recalage de frame. Le raccord actuel `PARTIE1_CAM_KEYS`
démarre à f2102 (« bascule » V5 = f2102 exact → ce raccord-là est juste).

---

## Résumé

- **Triggers Acte 1 analysés** : 18 (paires `A1.*` / `F_HOOK_*` comptées une fois) + dérivés.
- **OK (|delta| ≤ 5)** : 2 → `A1.MALI`/`F_HOOK_MALI` (−5) et `F_FACTIONS_INFUSE` (0 à +7).
- **À RECALER** : 14 → tous les autres triggers du hook et du corps. Les écarts s'AGGRAVENT en avançant dans l'acte :
  hook ~−5 à −42 frames, corps (JNIM/EIGS/pulses) ~−66 à −342 frames. **La V5 est plus dense/rapide que la V1** :
  les mêmes idées arrivent de plus en plus en avance par rapport au calage V1.
- **INCERTAIN** : 2 → `A1.EIGS` (note ❶, décision nommage vs bilan) et `A1.END` (note ❸, décision de DURÉE d'acte).
- **Delta max observé** : ≈ **−342 frames** (`A1_REGION_PULSES["eigs-niger"]` / `F_NIGER` 2009 vs « nord-ouest » 1667).
  Si l'on prend le tampon EIGS calé sur « EIGS » f1461, l'écart monte à −313 ; mais ce trigger pointe en réalité vers
  le nommage et non vers Daesh, d'où le classement RECALER plutôt qu'incertain.

### Triggers à ÉLUCIDER avec Aziz (pas un simple nombre)
1. **`A1.EIGS`** — allumer EIGS au nommage (f1461, symétrie JNIM) OU au bilan « deux groupes » (~f1749) ? (note ❶)
2. **`A1.END` + durée composition** — l'Acte 1 V5 finit ~f1900-2096, pas f2299. Raccourcir l'acte ou tenir un hold ? (note ❸)
3. **`A1.FRICTION` + waypoints jetons** — recaler f2167→f1840 impose de recaler en cascade tous les `wp` des
   `ACTE1_VEHICLES` et `FIGHTERS` (note ❷). À décider : recaler la chorégraphie complète ou conserver le timing actuel
   des jetons en l'ajustant à la nouvelle durée d'acte.

---

## Triggers HORS Acte 1 (signalés, non analysés — valeurs > 2300, dédiés Acte2/P1-P4)

`F_AES_NEE` 7014 · `F_KIDAL_ALONE` 7279 · `F_KIDAL_FLAG` 8683 · `F_REF_DJIBO` 10294 · `F_REF_MENAKA` 10349 ·
`F_REF_TILLABERI` 10783 · `F_ICON_OR` 11032 · `F_ICON_PETRO` 11122 · `F_SAHELIENS` 12183 · `F_GAO` 3989 ·
`F_MENAKA_BASE` 4014 · `F_NIAMEY_BASE` 4043 · `F_DJIBO_REF` 10294 · `F_EXPANSION_START/END` 2630/4800 ·
`F_LIBYE_ARMES` 2630 · `F_KIDAL_OFFENSIVE` 8218 · `F_KIDAL_FLAG_VISIBLE` 8683 · `F_KIDAL_COUNTER` 9477 ·
`COUNTRY_PULSES` (1324→10851) · `ACTE2_REGION_PULSES` (2613/3575) + tous les `PARTIE{1,2,3,4}_CAM_KEYS` et
`PROTO24_CAM_KEYS`. **STATUS.md indique que P1-P4 sont déjà FINAL** ; ces triggers ne sont pas l'objet de ce recalage.
