# PLAN NARRATIF P3 — "La Rupture et l'Épreuve" — phrase par phrase (depuis l'audio, 2026-06-12)

> Méthode (identique P2 validée) : on part de l'AUDIO. Pour CHAQUE phrase : "que doit COMPRENDRE un œil
> neuf ?" → quelle(s) technique(s) causale(s) du catalogue (`WARMAP-GRAMMAIRE-CAUSALE.md`) → quels assets.
> La CAUSE (un acteur agit) précède TOUJOURS l'EFFET (le territoire change). Action causale, jamais état qui pop.
>
> Modèle de code = `Partie2Blocage.tsx` (helpers `chip()`, `renderBase()`, sillage par mask flouté, `countryOutline`).
> Triggers VÉRIFIÉS contre `narration-v5-alignment.json` (×30fps) le 2026-06-12 — tous confirmés à la frame.

## IDÉE MOTRICE (script)
"Le bloc (AES) se forme — et sa première épreuve se joue sur un seul point : **Kidal**."
Connecteur de présence depuis P2 : la P2 finissait sur la CEDEAO qui menace le Niger (flèches figées f5690).
P3 = la réponse (AES naît) PUIS l'épreuve (Kidal repris) PUIS la part d'ombre (Moura) PUIS "tenir ≠ prendre".

## RACCORD DEPUIS P2 (caméra)
P2 finit serrée sur le Niger/Niamey, flèches CEDEAO en tension. P3 démarre f6118 (`getPartie3Cam`) :
on REPART de cette vue (Niger centré, CEDEAO encore visible) → les flèches CEDEAO se BRISENT → on élargit
sur les 3 pays AES → puis on plonge vers Kidal (nord Mali) à f7000. Caméra "serrée qui suit l'action".

---

## ARSENAL P3 (assets confirmés sur disque) — à COMBINER, jamais un seul
- **Jetons FAMa** : `jeton-fama.png` (soldat béret, armée malienne) — bordure BLEU Mali. ← l'acteur de la reprise.
- **Jetons touaregs** : `jeton-csp.png` (chèche) — bordure neutre/sable. ← qui TIENT Kidal, puis RECULE.
- **Base Africa Corps** : `base-africacorps.png` (paramilitaire ex-Wagner) — appuie l'offensive FAMa.
- **Base ONU** : `base-minusma-td.png` — présente autour de Kidal, à faire DISPARAÎTRE au retrait (effacement, pas chute violente).
- **Jeton junte** : `jeton-junte.png` — déjà au Niger depuis P2 (continuité), peut rappeler l'union AES.
- **Fumée/explosion** : `fx-smoke/0-8.png` (ambiant, disperse), `fx-explosion/` (one-shot) — pour Moura/attaques 2026, AVEC cause.
- **Contours pays** : `MALI_RING` / `NIGER_RING` / `BURKINA_RING` (`sahelCountries.ts`). Kidal coord [1.44, 18.43] (= KIDAL du modèle P2).
- **Briques kit** : `interpWaypoints` (jetons), `countryOutline` (contour flash), `spriteMapWidth`, `smokePingPong`, `chip()`, `WarMapPlaque`, sillage mask.
- **Couleurs (PAL)** : RED_INK menace jihadiste · STEEL/UN_BLUE bleu Mali/ONU · CEDEAO orange · or AES (à ajouter, ex #C9A24B).
- **Timeline** : graduée pleine largeur (rendue par le moteur), axe P3 ≈ 2023 → 2026.

---

## PLAN PAR PHRASE

### Phrase 1 — "Face à cette menace, Bamako et Ouagadougou répondent d'une seule voix : toute agression contre le Niger sera considérée comme une déclaration de guerre contre eux trois." (Bamako f6118 / Ouaga f6138)
- **Comprendre (œil neuf)** : les 3 capitales sahéliennes font BLOC. La menace CEDEAO (héritée P2) est REPOUSSÉE.
- **Technique causale** : #4 contour flash (les 3 pays se dessinent en or, ensemble) + CASSER l'état P2 (les flèches CEDEAO orange se BRISENT visiblement = cause→effet : l'union AES brise la menace).
- **Assets** : (1) flèches CEDEAO de P2 (orange) qui se FRACTURENT/retombent (anim de rupture) ; (2) Bamako puis Ouaga puis Niamey s'allument vif en séquence syllabe ; (3) une ligne/lien OR relie les 3 capitales (le pacte "une seule voix") ; (4) les 3 contours pays (Mali/BF/Niger) virent couleur unie or progressivement.
- **Mouvement** : on PART de la vue Niger (raccord P2), léger dézoom pour cadrer les 3 pays ensemble.

### Phrase 2 — "Et le 16 septembre 2023, les trois pays scellent leur union en signant la Charte du Liptako-Gourma. C'est ainsi que naît l'Alliance des États du Sahel." (Liptako f6616)
- **Comprendre** : naissance officielle de l'AES, datée. Moment fondateur, à marquer fort.
- **Technique causale** : #3 la donnée qui se MONTRE (la zone Liptako-Gourma = le triangle frontalier où se touchent les 3 pays → elle PULSE en or, point de jonction des 3 territoires) — l'union se VOIT géographiquement.
- **Assets** : (1) zone Liptako (triangle Mali-BF-Niger, centre ≈ [0.5, 14.5]) PULSE OR ; (2) plaque "16 sept. 2023 · AES" (WarMapPlaque, accent or) ; (3) les 3 capitales reliées tiennent. **FIGÉE 2s** (moment fort gardé tel quel, script). [L5 board-clearing : le chapitre "union" se solde, on respire avant Kidal.]
- **Mouvement** : drift quasi nul pendant le figé 2s (solennité). SFX gong/liptako au pulse (support visuel présent = OK).

### Phrase 3 — "Mais ce nouveau bloc va très vite être mis à l'épreuve, et tout va se cristalliser sur un seul point de la carte. Une ville que tout le monde regarde." (~f6800-7050)
- **Comprendre** : transition — on quitte le plan large (le bloc) pour UN point précis. Suspense.
- **Technique causale** : transition L6 (zoom sur le même fil, pas un cut). Hiérarchie du regard : tout s'assombrit SAUF la trajectoire vers Kidal.
- **Assets** : zoom continu de la vue AES vers le nord-Mali ; le reste de la carte s'atténue (dim) ; aucun label encore (on garde le nom pour le beat suivant = paiement).
- **Mouvement** : ZOOM IN progressif vers [1.44, 18.43], accélération douce. Le foyer se resserre.

### Phrase 4 — "Kidal." (f7083) ⭐ MOMENT FORT — gardé tel quel
- **Comprendre** : LE point. Silence, gravité.
- **Technique causale** : #4 contour/halo flash sur le seul point Kidal. Emphase CHIRURGICALE (Aziz) : Kidal pleinement traité, tout le tour épuré/sombre.
- **Assets** : Kidal s'allume SEUL (halo qui pulse une fois) ; label "KIDAL" permanent (WarMapPlaque, reste affiché tout le reste de P3) ; **FIGÉE 1s, silence** (script).
- **Mouvement** : caméra arrêtée sur Kidal. Rien d'autre ne bouge. Le vide autour = intentionnel.

### Phrase 5 — "Depuis 2012, cette ville échappe complètement à l'État malien. Elle est aux mains de groupes armés touaregs. Et les Casques bleus de l'ONU, présents sur place, n'ont pas pour mandat de la reprendre par les armes." (touaregs f7319)
- **Comprendre** : Kidal = tenue par des groupes touaregs depuis 2012 ; l'ONU est là mais NE COMBAT PAS (mandat limité). Statu quo gelé.
- **Technique causale** : montrer QUI tient (jetons touaregs autour de Kidal) + QUI est présent mais passif (points ONU bleus, statiques, sans action). État stable = pas d'avancée, pas de sillage (contraste avec P2 : ici rien ne bouge, c'est le point).
- **Assets** : (1) 2-3 jetons `jeton-csp` (touaregs, bordure sable) POSÉS autour de Kidal (pas de waypoints, ils TIENNENT) ; (2) points/sprite `base-minusma-td` bleus ONU près de Kidal, immobiles ; (3) overlay sobre "Hors contrôle de l'État · depuis 2012" (plaque, pas data-viz). [CORRECTION Sonar : "groupes armés touaregs", PAS "CSP depuis 2012" ni "protégée par MINUSMA".]
- **Mouvement** : drift très léger sur Kidal. Le statu quo se LIT par l'immobilité.

### Phrase 6 — "Tout change en novembre 2023, lorsque l'ONU se retire. Les forces armées maliennes, appuyées par Africa Corps — le groupe paramilitaire russe anciennement connu sous le nom de Wagner — lancent alors l'offensive." (retire f7673 · Africa f7794)
- **Comprendre** : l'ONU PART → ça libère le terrain → l'armée malienne + Africa Corps ATTAQUENT. Cause (retrait ONU) → effet (offensive).
- **Technique causale** : #1 l'AVANCÉE (jetons FAMa qui se déplacent vers Kidal, waypoints frame-driven) — c'est leur progression qui prépare la reprise. + disparition causale des points ONU (s'effacent un par un AVANT l'offensive = la cause).
- **⚠️ RACCORD CAUSAL À RESSERRER (DeepSeek + Gemini, VRAI)** : le retrait ONU et l'avancée FAMa doivent se CHEVAUCHER, pas se succéder. Le 1er waypoint FAMa démarre DÈS QUE le dernier point ONU est à ~50% d'opacité (décalage 0.3s/point pour l'effacement ONU). Ainsi l'œil lit LA PASSATION : vide ONU → comblé immédiatement par l'armée. Retrait ONU = translation Y +10px + fade (un "départ", pas un cut sec).
- **Assets** : (1) à f7673, les points ONU `base-minusma-td` DISPARAISSENT un par un (fade séquentiel, effacement propre — l'ONU se retire, ne "tombe" pas) ; (2) à f7794, jetons `jeton-fama` (bordure bleu Mali) AVANCENT depuis Gao/Ménaka [-0.04,16.27]/[2.40,15.92] vers Kidal (waypoints) ; (3) base `base-africacorps` se pose en appui (derrière les FAMa) ; (4) plaque "FAMa + Africa Corps · ex-Wagner" ; (5) léger sillage BLEU (Mali) derrière les FAMa = la reconquête (couleur inversée du rouge P2 : ici c'est l'État qui reprend).
- **Mouvement** : caméra suit l'avancée FAMa vers Kidal (le foyer = l'action).

### Phrase 7 — "En quelques jours seulement, le drapeau malien flotte à nouveau sur Kidal. Pour Bamako, c'est une victoire politique majeure." (flotte f8132) ⭐ MOMENT FORT
- **Comprendre** : Kidal REPRISE par le Mali. Les touaregs reculent, le drapeau malien y est.
- **Technique causale** : aboutissement de #1 — les jetons touaregs `jeton-csp` RECULENT (waypoints qui s'éloignent), les FAMa OCCUPENT Kidal, Kidal vire au BLEU Mali (le territoire change PARCE QUE l'acteur a agi).
- **Assets** : (1) jetons touaregs reculent/disparaissent ; (2) Kidal + contour passe au BLEU MALI DÉSATURÉ (#2B4F7C, opacité fill 40-60% PAS 100% — anti AI-slop, "peint sur le papier" pas calque écran) (remplissage causal) ; (3) au mot "flotte" (f8132) : VRAIE IMAGE drapeau malien CLIPPÉE dans le polygone Kidal (useClipFlags) + MICRO-ONDULATION du clip-path SVG (3-5 frames, oscillation sinusoïdale lente/feutrée = le geste "flotte" SANS générer d'asset) ; (4) plaque "Kidal reprise · Nov. 2023" ; **FIGÉE 2s** — caméra fixe, SEUL le drapeau continue d'onduler lentement (respiration narrative, DeepSeek). Emphase chirurgicale : Kidal éclatant, reste calme.
- **Mouvement** : push-in léger sur Kidal au "flotte", puis figé (drapeau ondule seul).
- **[DA-BRIEF 2026-06-12, Q1 tranchée Aziz]** : Option A + ondulation maison (synthèse 3 voix : Gemini+Kimi+DeepSeek convergent — fill clippé + déformation subtile du clip déjà en place, ZÉRO génération PixelLab/Gemini. "flotte" = figure portée par l'ondulation du clip + le bleu qui envahit, pas un sprite déco façon jeu vidéo).

### Phrase 8 — "Mais cette victoire a aussi une part d'ombre. Selon un rapport des Nations unies, de graves exactions ont été commises contre des civils — notamment à Moura, où, d'après ce même rapport, plus de cinq cents personnes ont été tuées en l'espace de cinq jours." (Moura f8580)
- **Comprendre** : flashback DATÉ (mars 2022, AVANT la reprise) — la même dynamique militaire a fait des victimes civiles à Moura. Registre grave, sourcé ONU.
- **Technique causale** : CASSER la grammaire (changement de registre : on quitte la carte de manœuvre pour un point-mémoire). [L5 board-clearing net] : la carte se calme, un seul foyer = Moura. Pas d'explosion spectacle — gravité sobre.
- **⚠️ ANACHRONISME À NEUTRALISER (3 voix DA-brief, VRAI)** : le flashback 2022 arrive APRÈS Kidal-bleu-2023. Pour éviter le faux raccord temporel = TRAITER LA CARTE EN "ÉTAT ALTÉRÉ" : (a) fondu vers SÉPIA/sable foncé (PAS noir = trop brutal pour la charte) ; (b) opacité du calque "Kidal bleu" baissée à ~20% (mis en pause, comme un souvenir) ; (c) timeline recule visiblement à "Mars 2022" en teinte différente (gris anthracite, pas l'or habituel). Fondu sépia inverse pour revenir au présent.
- **Assets** : (1) repère timeline recule à "Mars 2022" (flashback assumé, teinte anthracite) ; (2) carte globale en état altéré (sépia + Kidal-bleu à 20%) ; (3) Moura [-4.10, 14.85 approx, centre Mali] = ABSTRACTION PURE : point rouge sourd #6B1A1A + halo bordeaux très dilué (opacité ~20%, STATIQUE pas pulsé = pas d'alerte jeu vidéo) ; (4) overlay "Moura · mars 2022 · +500 civils · rapport ONU" (sourçage explicite, plaque sobre serif, espace négatif autour des mots) ; (5) AUCUN visage humain, AUCUNE explosion ni fumée festive. Puis retour timeline "Nov. 2023". [CORRECTION Aziz : "selon le même rapport de l'ONU" = sourçage, déresponsabilise.]
- **Mouvement** : pan/zoom doux vers Moura, immobilité grave, retour.
- **[DA-BRIEF 2026-06-12, Q2 tranchée Aziz]** : ABSTRACTION PURE, unanime 3 voix (Gemini+Kimi+DeepSeek). AUCUN portrait-civil. "Un visage pour 500 morts = décalage d'échelle + pathos." La force = froideur clinique de la carte vs horreur du récit. Le portrait-civil resservira pour l'exode (P4), pas ici.

### Phrase 9 — "Et la menace, elle, est loin d'avoir disparu. Au printemps 2026, les attaques des groupes armés s'intensifient à travers le pays — mais elles sont repoussées, et le pouvoir tient. Une façon de rappeler une règle implacable : prendre un territoire est une chose, le conserver en est une autre." (repousse f9121 · conserver f9372)
- **Comprendre** : 2026, vagues d'attaques jihadistes PARTOUT, mais REPOUSSÉES ; les capitales tiennent. Morale : prendre ≠ garder. Pont vers P4.
- **Technique causale** : #1 inversé + refoulement AVEC ACTEUR VISIBLE — plusieurs sprites jihadistes (`technical-jnim`, `fighter-jnim`, `fighter-eigs` — DÉJÀ sur disque, réutilisés de P1/P2) AVANCENT vers les capitales (waypoints courts + court sillage rouge sourd) PUIS sont REPOUSSÉS (waypoints retour / fade au contact d'un halo bleu de défense). Cause (l'attaquant bouge = un acteur agit) → effet visible (refoulement). C'est la grammaire causale, PAS des halos qui poppent. [CORRECTION Sonar #15 : PAS d'offensive coordonnée sur Bamako du 25 avril — attaques repoussées, capitales tenues, formulation prudente.]
- **Assets** : (1) à f9121, 4-6 sprites jihadistes `technical-jnim`/`fighter-jnim`/`fighter-eigs` avancent en courtes poussées vers Bamako/Ouaga/Niamey (waypoints frame-driven, court sillage RED_INK sourd) ; (2) au contact des capitales (halo bleu défense), ils RECULENT (waypoints retour) puis fade = repoussés ; (3) les capitales gardent leur halo bleu stable tout du long ; (4) overlay "2026 · attaques repoussées" ; (5) au "conserver" (f9372) : zoom arrière lent vers la vue AES complète (3 pays or) = pont P4. La phrase-morale reste pendue.
- **Mouvement** : carte large, sprites jihadistes en courtes poussées vers les capitales, refoulement (recul/fade), puis zoom arrière doux vers AES (transition P4).
- **[CORRECTION FACILITÉ 2026-06-12]** : ex-plan = "halos rouges qui pulsent" (état qui pop, sans acteur, tiède, contraire à la grammaire causale). Remplacé par sprites jihadistes RÉELS qui avancent→refoulés. Gratuit (assets déjà sur disque) ET conforme doctrine. Continuité de l'ennemi P1/P2.
- **⚠️ EASING ASSAUT/DÉROUTE (Gemini + Kimi, VRAI)** : le différentiel de vélocité raconte. Les sprites avancent VITE (assaut) → arrêt NET au contact du halo bleu de défense (pause ~0.2s) → reculent LENTEMENT en s'effaçant (opacité→0). Recul = glissement inverse le long du sillage qui s'effiloche, JAMAIS un effacement instantané/téléportation. Easing ease-in-out (pas linéaire robotique). Max 2 fx-explosion one-shot espacés 1.5s si besoin, sinon fx-smoke ambiante suffit.

---

## TECHNIQUES CAUSALES MOBILISÉES (récap, du catalogue)
| # | Technique | Où dans P3 |
|---|-----------|------------|
| 1 | Avancée jetons + sillage | Ph6 (FAMa avancent, sillage BLEU), Ph7 (touaregs reculent), Ph9 (sprites jihadistes réels avancent→refoulés) |
| 3 | Donnée qui se MONTRE | Ph2 (zone Liptako = union qui se voit), Ph7 (Kidal vire bleu) |
| 4 | Contour de territoire nommé + flash | Ph1 (3 pays AES or), Ph4 (Kidal seul) |
| 5 | Casser la grammaire (acteur différent) | Ph1 (CEDEAO se brise), Ph6 (FAMa = État, bleu pas rouge), Ph8 (Moura = registre mémoire) |
| — | Emphase chirurgicale (Aziz) | Ph4/Ph7 (Kidal plein, tour épuré) |

## INVERSION CHROMATIQUE CLÉ (différence P2 → P3)
En P2, l'avancée = ROUGE (jihadistes prennent). En P3, l'avancée principale = BLEU MALI (l'État REPREND
Kidal). Le rouge revient seulement Ph9 (attaques 2026) mais REFOULÉ (ne tient pas). Cette inversion raconte
visuellement "la rupture" : pour une fois, c'est l'ordre étatique qui gagne du terrain — puis la nuance finale.

## DÉCISIONS DE GOÛT — TRANCHÉES PAR AZIZ (2026-06-12)
1. ✅ **INVERSION CHROMATIQUE = OUI** : l'avancée FAMa colore Kidal en BLEU MALI (l'État reprend). Rouge seulement Ph9, REFOULÉ. C'est l'idée structurante de la P3.
2. ✅ **Drapeau Kidal (Ph7)** : VRAIE IMAGE drapeau malien clippée (technique useClipFlags). Climax premium.
3. ✅ **Moura (Ph8)** : TRÈS SOBRE — point rouge sourd + halo grave + plaque sourcée "Moura · mars 2022 · +500 civils · rapport ONU". Carte assombrie, immobilité. PAS d'explosion ni fumée festive. La gravité par la retenue.
4. ✅ **SFX (choix Claude délégué)** : 3 moments structurants seulement — (a) gong/note grave naissance AES au pulse Liptako (f6616) ; (b) impact sourd sur "Kidal." (f7083) ; (c) whoosh/montée à la reprise "flotte" (f8132). PAS de SFX sur les attaques 2026 (pulses dispersés/refoulés = support visuel trop diffus, doctrine "SFX si support visuel fort").
5. **Couleur AES** (technique, tranché seul) : or chaud `#C9A24B` (cohérent "naissance", déjà la bordure JNIM du modèle — on le réutilise pour l'or AES, contexte différent donc pas de confusion).

## DÉCISIONS DA-BRIEF P3 (2026-06-12) — Gemini 3.1 Pro + Kimi K2.5 + DeepSeek V4 (upstream, 3 voix)
> Output archivé : `/tmp/da-refs/da-warmap-sahel-p3-{gemini,kimi,deepseek}.md`. Gemini=SIGNAL jamais juge — chaque point vérifié contre la doctrine avant intégration.

**Q1 Drapeau Kidal — TRANCHÉE Aziz : Option A + ondulation maison** (convergence 3 voix). Fill clippé (useClipFlags) + micro-déformation du clip-path SVG au "flotte". ZÉRO génération. Voir Ph7.
**Q2 Moura — TRANCHÉE Aziz : Abstraction pure** (unanime 3 voix). Aucun visage. Voir Ph8.

**Angles morts intégrés (techniques objectifs, tranchés seul) :**
- **Anachronisme Moura** : carte en "état altéré" (sépia + Kidal-bleu à 20% + timeline anthracite recule 2022). Ph8.
- **Raccord causal ONU→FAMa** : chevauchement (1er waypoint FAMa quand dernier point ONU à ~50% opacité). Ph6.
- **Anti AI-slop chromatique** : bleu Mali DÉSATURÉ `#2B4F7C` (fill 40-60%, jamais 100%, "peint sur papier") · or AES mat (pas glossy, texture parchemin 15%) · rouge Moura bordeaux `#6B1A1A`. Tester teintes sur fond sable `#EADBC6`.
- **Easing assaut/déroute Ph9** : avance vite → arrêt net → recul lent/effiloché (différentiel vélocité raconte). Pas linéaire.
- **Plaques non-redondantes** : ajouter ce que la voix NE dit PAS (sigle, date précise, source), pas doublon sous-titre. Apparaître 0.5s avant la voix, easing ease-out + pose Y.
- **Respirations** : pause 1.5-2s après chaque coup de théâtre (AES, Kidal, Moura). Fumée/timeline vivent, pas de nouvelle donnée.

**Écartés (vérifiés discutables) :** DeepSeek "légende ~1500 combattants/4j" (risque surcharge vertical + doctrine retenue) · DeepSeek "fondu au NOIR avant Moura" (→ sépia, charte parchemin) · Gemini "aucun jeton sur AES" (déjà le cas dans Ph1-2).

## SCAN TEMPLATES (2026-06-12, demandé par Aziz — l'étape la plus rentable)
> Distinguer ce qui se BRANCHE (même archi : Map continue + ctx.project, ou map passée au scope) de ce qui
> INSPIRE (technique réutilisable) de ce qui est ÉCARTÉ (incompatible "1 seule Map continue").

### ✅ BRANCHABLES DIRECTEMENT (zéro recodage — leur prop `map` = mapRef.current, dispo dans le scope moteur)
- `SahelAttackArrow` (`warmap/_shared`) → OFFENSIVE FAMa→Kidal (Ph6) + attaques 2026 (Ph9). props: map, waypoints, progress, color, headType, marchingFrame.
- `TerritorialExpansion` (`warmap/_shared`) → RECONQUÊTE BLEUE / front qui avance (Ph6-7). Supporte `geoPolygon` (vraie forme Kidal). props: map, regions[], startFrame, endFrame, frame, color, maxOpacity.
- (Option encerclement : `AtlasAttackArrow`/`AtlasEncirclement` — d3-geo, principe pince réutilisable.)

### ✅ KIT P2 (le modèle direct — `warmapPremiumKit.ts` + `Partie2Blocage.tsx`)
`chip()` (jetons FAMa/touaregs) · `countryOutline` (contour flash AES/Kidal) · sillage mask flouté (→ BLEU) ·
`renderBase` (ONU + base Africa Corps) · `WarMapPlaque` · `smokePingPong` · `interpWaypoints` · `spriteMapWidth` ·
`burkinaFill` (clip+remplissage → adapté remplissage BLEU Kidal).

### 💡 TECHNIQUE EMPRUNTÉE (idée, pas le composant — Souverain incompatible archi mais méthode dans le kit)
- Drapeau Kidal (Ph7) : technique `useClipFlags`/`MapboxFlagFill` (clip SVG + reprojection frame-driven) = déjà le pattern `chip()`/`burkinaPath`. → mini clip-flag Mali dans la couche P3 + vraie image drapeau, révélé bas→haut.
- Désaturation Moura (Ph8) : pattern `ArchiveFade` (sépia) → overlay mix-blend simple dans la couche.
- Onde de choc "Kidal." (Ph4) : cercles concentriques = pattern halos-alerte P2.

### ❌ ÉCARTÉ (ne PAS forcer — gèrent leur propre cycle Map → friction avec la Map continue war-map)
Tous les `_shared/mapbox` Souverain qui appellent `pushFlagToMap`/leur Map (FlagFillSequence, ContagionFlagSpread,
SweepRevealTerritory, etc.). Leur technique est récupérée ci-dessus, pas le composant.

## SYNTHÈSE DA-BRIEF UPSTREAM (Gemini+Kimi+DeepSeek, 2026-06-12 — signal vérifié, jamais gobé)
> 3/3 valident le plan + l'inversion chromatique. Convergence forte, 0 hallucination (tout dans la boîte).
**CONVERGENT (intégré au code) :** (1) briser CEDEAO = flèches qui vibrent puis se fragmentent/reculent (pas fade
mou) · (2) DÉLAI COGNITIF causal : jeton arrive → +12-15f → territoire change → +15f → drapeau (jamais tout à la
même frame) · (3) sillage BLEU = même mask wet-ink, juste #5E7FA0 · (4) Moura = rembobinage timeline VISIBLE +
désaturation globale (LE risque de compréhension n°1) · (5) "Kidal." = onde de choc concentrique + label tracé
plume + assombrissement radial · (6) Ph9 = halo bleu "protection" depuis capitales qui ÉTEINT les rouges +
zéro sillage rouge · (7) idle subtil jetons touaregs (pas figés morts).
**IDÉE UNIQUE RETENUE (Aziz a validé) :** ligne de front animée (Kimi) → via `TerritorialExpansion`.
**ÉCARTÉ :** fondu-au-noir entre ères (Kimi) = casse la Map continue ; le figé 2s Liptako suffit.

## DÉCISIONS DE GOÛT POST-DA — TRANCHÉES AZIZ (2026-06-12)
- ✅ Ligne de front animée sur Kidal (Ph6-7) = OUI → `TerritorialExpansion`.
- ✅ Africa Corps = base/fortin gris séparé en appui (asset `base-africacorps.png`), PAS un jeton acteur principal.
- ✅ Moura = désaturation globale + traînée timeline qui recule (marquage flashback maximal, zéro ambiguïté).

## MÉTHODE — PROCHAINE ÉTAPE
**Étape 3 — CODER** : copier `Partie2Blocage.tsx` → `Partie3Rupture.tsx` (réutiliser kit + SahelAttackArrow +
TerritorialExpansion), brancher `partie3` dans le moteur (mode + getPartie3Cam + gates + SFX + map passée à la
couche), enregistrer `SahelPartie3` dans Root. Render full HD pour juger.
