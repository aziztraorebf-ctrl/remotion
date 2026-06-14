> ⛔ ARCHIVÉ 2026-06-14 — P3 TERMINÉE ET VALIDÉE (p3-FINAL.mp4 avec contours nationaux).
> Prochaine partie : voir `BRIEF-PASSATION-P4.md`. Ce fichier = historique P3 uniquement.

# BRIEF DE PASSATION — War-Map Sahel PARTIE 3 "La Rupture"

> Pour l'instance Claude qui démarre la session P3. **LIRE CE FICHIER EN ENTIER EN PREMIER.** Il est autonome :
> il te dit exactement quoi lire, quel fichier copier, dans quel ordre, sans ambiguïté. Branche : `feat/da-brief-gate-warmap-sahel`.

## EN UNE PHRASE
La P2 est FINIE et VALIDÉE (grammaire causale). Tu dois coder la **Partie 3 "La Rupture"** en suivant
EXACTEMENT la même méthode : d'abord **REPRÉVOIR LE VISUEL** (plan narratif phrase par phrase, comment chaque
phrase s'expose sur la carte), PUIS DA-brief upstream, PUIS coder. Ne saute pas la phase visuelle.

---

## ⛔ NE TE TROMPE PAS DE FICHIER (le piège n°1)
- **LE MODÈLE À COPIER = `src/projects/warmap/parties/Partie2Blocage.tsx`** (la P2 narrative VALIDÉE).
- **N'UTILISE PAS `Proto24Extinction.tsx`** — c'est un LEGACY (vieux prototype de test, périmé). Le mode moteur
  `proto24` est aussi legacy : ignore-le.
- Ne code PAS depuis les vieux modes `acte2`/B1 (avion/convoi) — abandonnés.
- Si une vieille doc parle de "généraliser depuis le proto 2.4" ou "Partie2 rejetée" = c'est de l'ARCHIVE PÉRIMÉE.
  La vérité : `Partie2Blocage.tsx` est la P2 validée, c'est ton modèle.

## À LIRE AVANT DE CODER (dans cet ordre)
1. ⭐⭐ **`memory/doctrines/WARMAP-GRAMMAIRE-CAUSALE.md`** — LA doctrine. Règle CAUSE avant EFFET + catalogue des
   5 techniques causales (avancée jetons+sillage · chute base 3 temps · donnée qui se MONTRE · contour flash ·
   casser la grammaire). C'est le standard non-négociable. Sans ça → "bordel confus" rejeté.
2. `memory/episodes/warmap-sahel/PLAN-NARRATIF-P2.md` — le MODÈLE de plan narratif (à reproduire pour P3).
3. `memory/key-learnings.md` (chercher "grammaire causale") — les anti-patterns à ne pas refaire.
4. Le code modèle : `src/projects/warmap/parties/Partie2Blocage.tsx` + `warmapPremiumKit.ts` + `WarMapPlaque.tsx`
   + `sahelCountries.ts`. Et comment le moteur branche `partie2` (`SahelWarMapEngine.tsx` : mode, getPartie2Cam,
   timeline, SFX partie2).

## ▶ TA MISSION — ORDRE STRICT (ne pas sauter la phase visuelle)
**ÉTAPE 1 — REPRÉVOIR LE VISUEL (avant tout code, avant l'upstream).**
Écouter/lire le texte P3 phrase par phrase et écrire **`PLAN-NARRATIF-P3.md`** (modèle = PLAN-NARRATIF-P2.md).
Pour CHAQUE phrase : "que doit COMPRENDRE un œil neuf ?" + quelle(s) technique(s) causale(s) du catalogue +
quels assets. Audio : `public/_shared/audio/sahel-warmap/narration-v5-p3.mp3`. Texte : `SCRIPT-V5-LINEAIRE-2026-06-10.md`
section "PARTIE 3". **Le visuel doit être pensé AVANT d'envoyer à l'upstream.**

**ÉTAPE 2 — DA-BRIEF UPSTREAM sur le plan** (`scripts/tools/da-brief.py`, Gemini+Kimi). Signal jamais juge :
vérifier chaque point, filtrer les hallucinations. La baseline war-map (P2) est dans `da-compare.py` → montre ~80%
de ce qu'on sait faire. Synthèse → validation Aziz du goût → PUIS code.

**ÉTAPE 3 — CODER** : copier `Partie2Blocage.tsx` → `Partie3Rupture.tsx`, réutiliser le kit, brancher dans le moteur.

## TRIGGERS P3 (alignment `narration-v5-alignment.json`, ×30fps — VÉRIFIÉS)
| Beat | Mot | Frame |
|---|---|---|
| AES répond (Bamako/Ouaga s'allument, flèches CEDEAO se brisent) | Bamako/Ouaga | f6118 / f6138 |
| Charte Liptako-Gourma = naissance AES (zone or pulse, figée 2s) | Liptako | f6616 |
| Zoom sur Kidal (cristallisation) | "Kidal." | f7083 |
| Kidal hors-contrôle depuis 2012 (groupes touaregs + MINUSMA) | touaregs | f7319 |
| ONU se retire (points MINUSMA disparaissent) | retire | f7673 |
| FAMa + Africa Corps lancent l'offensive | Africa | f7794 |
| Drapeau malien flotte sur Kidal (reprise, figée 2s) | FLOTTE | f8132 |
| Exactions / Moura (flashback daté mars 2022, +500 civils, rapport ONU) | Moura | f8580 |
| 2026 attaques repoussées, le pouvoir tient ("tenir = autre affaire") | repousse | f9121 |
| Pont vers P4 ("conserver en est une autre") | conserver | f9372 |

## ASSETS P3 (prêts — réutiliser, ne pas regénérer)
- `jeton-fama.png` (soldat FAMa béret = armée malienne, bleu) · `jeton-csp.png` (touareg chèche = groupes touaregs)
- `base-africacorps.png` (paramilitaire russe / ex-Wagner) · `jeton-junte.png` (officier béret neutre)
- `base-minusma-td.png` (avant-poste ONU, à faire DISPARAÎTRE au retrait) · `fighter-jnim/eigs.png` (jihadistes 2026)
- Contours pays : `sahelCountries.ts` (Mali/Niger/Burkina). Besoin de Kidal en focus → coord [1.41, 18.44].
- SFX banque `warmap/` (boom-coup, ink-spread, arrow-whoosh, drone, liptako-gong pour la naissance AES).

## BRIQUES PRÊTES (toutes dans `parties/`)
`warmapPremiumKit.ts` : interpWaypoints (jetons qui avancent) · countryOutline (contour flash) · buildStaticZone ·
smokePingPong · spriteMapWidth (ancrage carte) · PAL. — `WarMapPlaque.tsx` (noms parchemin). — `chip()` dans
Partie2Blocage (jeton circulaire : cercle + bordure faction + portrait clippé — JAMAIS portrait nu). — Sillage
causal (mask flouté). — Timeline graduée (réactivée par mode dans le moteur).

## PATTERN D'INTÉGRATION MOTEUR (checklist, miroir de partie2)
1. Créer `Partie3Rupture.tsx` (couche pure `({ ctx }: { ctx: SahelRenderContext | null })`).
2. Moteur : prop `partie3?: boolean` → l'ajouter à `isFinalLook` + `isPartie` → `getPartie3Cam` (raccord exact
   depuis fin P2 f5690, serrée qui suit) → `camFn = partie3 ? getPartie3Cam : ...` → gate `showChrome` sur `!partie3`
   → activer la timeline pour partie3 (axe 2023→2026) → injecter `{partie3 && <Partie3Rupture ctx={sahelCtx} />}`.
3. ⚠️ PIÈGE (bug P2) : ne gate JAMAIS un fragment HUD entier sur `!partie3` — la timeline y est enfermée. Gate
   chaque sous-bloc individuellement.
4. Root.tsx : enregistrer compo `SahelPartie3` avec `defaultProps={{ partie3: true }}`.
5. Bloc SFX `{partie3 && ...}` dans le moteur (miroir du bloc partie2).

## RENDER (commandes)
- `./scripts/render-mapbox.sh SahelPartie3 <out.mp4> [--muted] [--frames=A-B]`. Netteté = full HD only.
  Plages de check rapide : `--frames=A-B`. Render complet P3 ≈ f6000-9400.
- Audio embarqué : render SANS `--muted` (le moteur a `<Audio narration-v5-expressive.mp3>` + musique + SFX).
  Pour présenter avec son : render direct (pas besoin de muxer). Upload catbox pour Aziz.

## SPÉCIFICITÉS NARRATIVES P3 (corrections déjà actées dans le script — respecter)
- "groupes armés touaregs" (PAS "CSP tient depuis 2012" ni "protégée par MINUSMA" — chargé/faux).
- Africa Corps = "ex-Wagner" (sourcé). Moura = flashback DATÉ "mars 2022" + "selon le rapport de l'ONU" (sourçage).
- 2026 = attaques REPOUSSÉES, pouvoir tient (NE PAS affirmer offensive coordonnée sur Bamako = non confirmée).
- Moments forts gardés tels quels : "Kidal." (figé 1s, silence) · naissance AES (figé 2s, zone or).

## RÈGLES PROCESS
- Premium d'abord. Cause avant effet (test Kimi : son coupé, comprend-on l'action ?). Combiner l'arsenal.
- Trancher le technique seul, regrouper le goût pour Aziz. DA = signal jamais juge.
- Commits fréquents, scope warmap-sahel uniquement. Render full HD pour juger.
- Lancer `/reflect` en début de session (learnings en file de la session P2).
