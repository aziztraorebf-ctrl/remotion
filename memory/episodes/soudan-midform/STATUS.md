# Soudan Mid-form — STATUS

## ⭐ ÉTAT COURANT (2026-07-21 soir) — PHASE 2 ACTE 4 FAITE + 1er ASSEMBLAGE 6 ACTES + PASSE LLM → 6 LOTS

> **Remplace la section « v12 base validée » ci-dessous (désormais Phase 1, périmée pour l'état courant).**
>
> - **Acte 4 PHASE 2 = FAITE** : 5 lots (flux qui coulent · navire vivant · jetons-portraits Hemedti/al-Burhan +
>   glows RSF/SAF · climax B6 stagger+ondes · frappe Kosti + Nil) + **4 corrections Aziz** : (1) navire
>   PROPORTIONNEL au globe (ne grossit plus au dézoom) · (2) RESPIRATION NIL (Le Caire crème + flux effacés ~2,5s
>   → Nil seul → retour) · (3) Kosti civils NE REVIENNENT PLUS (figés + disparition) · (4) noms de pays B6 en
>   GÉOPLAQUES. **Livrable** : `out/episodes/soudan-midform/wip/acte4-v14-phase2-full.mp4` (130.8s). **Commit
>   `3000dbbe`** sur `feat/soudan-acte4-globe-3registres`. ⚠️ PAS promu FINAL (attend l'application des 6 lots).
> - **AUDIT JETONS PERSONNAGES NOMMÉS = FAIT** : dérive ISOLÉE à l'Acte 3 (Hemedti Section1+Insert, al-Burhan
>   Insert = sprites génériques). CORRIGÉ → portrait-hemeti/portrait-burhan. **Commit `8481e8b9`**. Actes 1,2,5,6 OK.
>   Renders faits (`/tmp/a3-*-fix.mp4`, concat `wip/acte3-globe-jetons-fix-full.mp4`). ⚠️ PAS re-promu FINAL.
> - **1er ASSEMBLAGE 6 ACTES = FAIT** (narration seule) : `wip/soudan-midform-ASSEMBLAGE-v1-6actes.mp4` (625.8s =
>   10min26) + `-compressed.mp4` (720p 30.6mo). Ordre A1(hook 57s, récup catbox `qc5dgq` — ⚠️ jamais promu
>   PRET-PUBLICATION)+A2+A3-globe+A4-v14+A5+A6. Raccords vérifiés OK.
> - **PASSE LLM DOWNSTREAM = FAITE** (nouveau pattern générique gravé dans `doctrines/DA-BRIEF-GATE.md`) :
>   1 diagnostic + 2 prospectifs scindés (globe/caméra + exécution/audio) × Gemini+Kimi = 6 appels, cadrés par
>   nos contraintes (D3/SVG 2D, lisibilité prime). Convergence ~95%. Rapports : `da-briefs-passe-llm-2026-07-21/`.
> - **✅ LES 6 LOTS SONT FAITS (2026-07-21 nuit)** sur branche **`feat/soudan-passe-finale-6lots`** (worktree dédié
>   `/Users/clawdbot/Workspace/remotion-soudan`) : LOT1 souffle frontière+anneaux siège El-Fasher · géoplaques
>   unifiées 6 actes · LOT2 dérive caméra B6 · LOT3 accroche mines/zoom+fracture snap · LOT4 contour jetons+pont
>   croisements · LOT5 bilan 135 pts (ONU/veto+empire or déjà faits). Audio : musique **B kora-dundun** + 7 SFX générés.
> - **⏭️ PROCHAINE SESSION = ASSEMBLAGE** → `starters/STARTER-PROMPT-soudan-midform-ASSEMBLAGE-FINAL.md`
>   (re-render 6 actes + concat 625.8s + mix audio). PUIS promouvoir Acte 1/3/4 FINAL · mid-form 6/6 complet.

---

## 🗄️ ACTE 4 « MÊME LES VOISINS SONT ASPIRÉS » — REFONTE GLOBE D3 3 REGISTRES, v12 BASE VALIDÉE (2026-07-21) — PHASE 1 (trace)

> **Refonte structurelle COMPLÈTE cette session. v12 = base validée Aziz, PAS ENCORE promu FINAL** (reste la Phase 2
> densif/dynamisation → session dédiée, starter `STARTER-PROMPT-soudan-acte4-phase2-densif-dynamisation.md`).
> Mid-form = 6/6 actes CODÉS (5 promus FINAUX + Acte 4 en finition).
>
> **Passé de Mapbox plat (v8 périmé) à GLOBE D3**, cohérence avec Actes 3/5/6. **Architecture 3 registres :**
> - **Bloc globe CONTINU B1→B4** : `src/projects/_rnd/d3-16x9/SoudanActe4B1toB4Globe.tsx` (compo
>   `D3-SoudanActe4-B1B4-Globe`, ~81s). UNE caméra continue qui ACCUMULE (Russie+drapeau+flux Moscou→RSF/SAF bascule
>   2024 → Port-Soudan+navire encre `NavireGuerreEncre` → Égypte+drapeau+arc Le Caire→SAF → Nil qui se surligne).
>   La carte ne se vide JAMAIS entre beats (persistance inter-beats totale). Labels en géoplaques (fond sombre).
> - **B5 Kosti** : insert SVG plein écran `Kosti-Beat5-Standalone` (Root.tsx) — station-service K3, frappe drone. INCHANGÉ.
> - **B6 synthèse** : `SoudanActe4B6Globe.tsx` (compo `D3-SoudanActe4-B6-Globe`, ~24s). Globe 2.0, 4 arcs
>   Russie/EAU/Turquie/Égypte convergent vers Khartoum (occlusion 3D + drapeaux clippés).
> - Assemblage = CONCATÉNATION (bloc + Kosti + B6) → `out/episodes/soudan-midform/wip/acte4-v12-continu-full.mp4` (130.8s).
> **Branche** : `feat/soudan-acte4-globe-3registres` (PAS mergée master).
>
> **Retours Aziz appliqués (v8→v12)** : persistance inter-beats · ZÉRO sous-titre (bas = sources) · géoplaques
> lisibles vs texte blanc · zoom caméra Port-Soudan (navire visible) · **B3 refait sur globe** (D3-force ESSAYÉ puis
> REJETÉ = rupture de registre) · cohérence couleur par ACTEUR (Russie=rouge #c74d4d partout) · palette THEMES.mixte
> (source unique). Plaques-texte factuelles retirées (dans la voix).
>
> **Production** : B6 codé par Claude (modèle) ; B1-B4 délégués à agents frais (worktrees), mergés ; bloc continu
> fusionné par agent. Passe LLM 2 temps (Gemini+Kimi × densif+dynam) faite → 4 rapports dans
> `da-briefs-acte4-phase2/`, forte convergence, application = Phase 2 session dédiée (5 lots validés).
>
> ⛔ **PÉRIMÉ** : toute l'architecture Mapbox de l'Acte 4 (v7/v8, `SoudanActe4.tsx`, sections carte Mapbox). Trace
> uniquement. L'ancienne section STATUS « BEAT 2 REFAIT EN INSERT SVG » (plus bas) = périmée sauf l'insert Kosti.

## ✅✅ ACTE 3 « SUIVRE L'OR » GLOBE 2-REGISTRES — PROMU FINAL (2026-07-19, session 15)

> **TERMINÉ + PROMU.** Refonte complète validée Aziz : passage de 3 registres visuels (SVG + Mapbox 2D +
> Globe) à **2 registres (SVG + Globe)**. Toute la carte est désormais en GLOBE D3, plus aucun Mapbox.
>
> **Livrable** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-globe-FINAL.mp4` (55.9MB, 125.9s).
> ⚠️ L'ancien Mapbox `soudan-acte3-suivre-lor-FINAL.mp4` (74.6MB) reste INTACT — Aziz choisit lequel publier.
> **Code = le vrai livrable** : Section 1 = `src/projects/_rnd/d3-16x9/SoudanActe3Section1Globe.tsx`
> (compo `D3-SoudanActe3-Section1Globe`, 1162f) · insert = `SoudanActe3GlobeInsert.tsx` (compo
> `D3-SoudanActe3-GlobeInsert`, 2611f). Assemblage = CONCATÉNATION des 2 mp4 (jamais compo mixte).
> **Branche** : `feat/soudan-acte3-globe-d3`.
>
> **Fait cette session (retours Aziz appliqués)** :
> 1. **Section 1 refaite en Globe** (agent remotion-composer) : SVG intro (Beat1Paradoxe copié tel quel)
>    + fade doux cross-fade [483,540] + carte globe (North Darfur rouge/Khartoum bleu depuis
>    `sudan-states.geojson` chargé via fetch+delayRender, 3 mines, portrait Hemedti recentré+écarté,
>    jetons hérités RSF/SAF). Échelle topdown **6.5 CONSTANTE** (raccord parfait avec l'insert qui démarre
>    à 6.5). Contours "marque" (borderColor #1c150a, w 1.1, op 0.8 — surcharge LOCALE, PAS THEMES.mixte).
> 2. **Insert : zoom d'entrée recalé 4.4→6.5** (`globeCamera.ts buildInsertCam(T, startScaleMul)`) pour
>    matcher l'échelle de la Section 1. Calage fait par rendu-test, pas au jugé.
> 3. **SVG argent** (Beat1Paradoxe) : le liquide doré abstrait → **billets $ dorés** empilés clippés par
>    `goldLevelClip` (montent/descendent avec le niveau) + fuite = billets $ qui tombent. Couleur or
>    conservée (unité, "or = argent"). Codé directement (géométrie maîtrisée), pas via LLM.
> 4. **3 plaques de sources** sobres parchemin, bas-droite, 1 ligne, ~1.8s fade in/out, SANS le mot
>    "Source:" (retiré sur demande). Composant `SourcePlaque` dans l'insert. Sources RÉELLES du fact-check
>    jury 2026-07-09 (`soudan-midform-ACTE3-JURY-VERDICTS.md`) : Amnesty International mai 2025 (f634) ·
>    Washington Post/ADF/Euronews (f1133) · Chatham House/The Soufan Center (f1754), frames relatives insert.
>
> Moteur globe D3 désormais prouvé sur 3 actes (1 Section + 3 + 5). Doctrine moteur :
> `.claude/.../feedbacks/feedback_globe-d3-moteur-cartographique-reutilisable.md`.
> ⛔ **PÉRIMÉ** : le starter `STARTER-PROMPT-soudan-acte3-globe-assemblage.md` (assemblage fait) + toute la
> Section 1 Mapbox de `src/projects/warmap/soudan-acte3/SoudanActe3.tsx` (remplacée par le globe D3).

## ✅✅ ACTE 6 « POURQUOI PERSONNE NE L'ARRÊTE » — PROMU FINAL (2026-07-20)

> **TERMINÉ + PROMU + VALIDÉ AZIZ.** Acte final du mid-form, codé en globe D3 + 2 inserts SVG mix-and-match
> LLM + passe dynamisme LLM. Aziz : « le globe a débloqué cette vidéo sur le Soudan, la grosse évolution ».
> **Livrable** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte6-verrou-institutionnel-FINAL.mp4` (138s,
> + `_compressed`). **Code** : `src/projects/_rnd/d3-16x9/SoudanActe6Globe.tsx` (compo `D3-SoudanActe6-Globe-Nu`,
> 4140f@30) + `SoudanActe6VoteInsert.tsx` (B3) + `SoudanActe6TableInsert.tsx` (B4) + `soudanActe6Overlays.tsx`
> (B5 cartouche) + `soudanActe6GlobeTiming.ts` + `whisper-words-acte6.ts`. Branche `feat/soudan-acte6-globe`.
> Variante `-Jetons` (jetons institutionnels B1) existe mais NON retenue (Aziz : globe nu).
>
> **Détail des passes ci-dessous (historique de production).** Mid-form Soudan = 5/6 actes FINAUX (1,2,3,5,6) ;
> reste l'Acte 4 (voir NEXT-ACTION). Prochaine session = Acte 4 puis musique+SFX puis assemblage final.

### Historique production Acte 6 (3 passes)

## 🎬 (passe 1-2) ACTE 6 — code initial + retours Aziz (2026-07-20)

> **Verrou institutionnel = acte FINAL du mid-form.** Code en globe D3 + 2 inserts SVG mix-and-match LLM.
> Branche `feat/soudan-acte5-globe` mergée dans master en début de session (Actes 3+5 sécurisés).
>
> **Fichiers** : `src/projects/_rnd/d3-16x9/SoudanActe6Globe.tsx` (compo `D3-SoudanActe6-Globe-Nu` + `-Jetons`,
> 3997f@30) · `soudanActe6GlobeTiming.ts` (timing forced-alignment Whisper de l'audio verrouillé) ·
> `soudanActe6Overlays.tsx` (DisplacementCounter B5) · `SoudanActe6TableInsert.tsx` (B4) ·
> `SoudanActe6VoteInsert.tsx` (B3) · `whisper-words-acte6.ts`. Caméra `buildActe6Cam` dans `globeCamera.ts`.
>
> **5 beats codés + vérifiés au rendu** :
> - B1 (l'arbitre manquant) : raccord EXACT fin Acte 5 (scaleMul 2.2) → zoom-out COURT ~2.5s qui s'ARRÊTE
>   sur l'Afrique (retour Aziz : pas de long dézoom sans destination). Variante `-Nu` retenue (globe nu).
> - B2 (UA écartée) : **cascade de DRAPEAUX voisins un par un** (GlobeFlagFill, ~11 pays UA) dès ~5s,
>   Soudan désaturé gris + barré au centre + accentué (contour clair), voile focus-Afrique, mini-plaque
>   "Union africaine — 55 États". Idée+validation Aziz. Anneau UA à trou ESSAYÉ puis RETIRÉ (noyé).
> - B3 (veto ONU) : **DÉCOR GPT-5.6 Sol** (amphithéâtre, croix retirée) + 14 sièges verts cascade +
>   **jeton DRAPEAU RUSSE au siège-veto** (recette jeton, idée Aziz : le veto incarné). `SoudanActe6VoteInsert`.
> - B4 (paradoxe) : **MIX Fable 5 (base : silhouettes+spotlight) + GPT-5.6 (plateau bois)**, jeton Émirats
>   spotlight. `SoudanActe6TableInsert`. Silhouettes-bustes gardées (choix Aziz).
> - B5 (coût humain) : compteur 13,5M + cercles concentriques déplacement (Khartoum/El-Fasher/Nyala), fade
>   to black sur la clôture. PAS de CTA.
>
> **PASSE 2 (retours Aziz 2026-07-20, 6 lots appliqués)** — durée portée à 4140f (138s, queue de fin) :
> 1. Plaques éphémères (Union africaine + titre Conseil = 2s+fade, comme nos sources, pas gardées tout le beat).
> 2. Cascade des 14 verts RALENTIE (gi*7 au lieu de gi*4).
> 3. ⭐ CARTE PERSISTANTE (non-négociable) : les drapeaux UA + Soudan barré RESTENT affichés tout l'acte
>    (uaFade=1, sudanDesat/banOp persistants) — plus jamais de "carte vierge" aux retours au globe (post-vote,
>    post-table, B5). Les inserts B3/B4 les masquent avec leur fond opaque, la carte réapparaît intacte.
> 4. TABLE B4 ANIMÉE (glow qui respire, reflet balayant clippé au plateau, spotlight de recherche qui tourne
>    avant de se fixer sur les Émirats, bobbing/tilt des silhouettes). `SoudanActe6TableInsert`.
> 5. B5 COÛT HUMAIN refait en CARTOUCHE AES : registre `WarMapOverlayData` (règle R2 "fond SOLIDE parchemin
>    CENTRÉ, fige l'action" + R4 "cream jamais noir"). Chiffre count-up 13,5M + grille de 27 pictos-silhouettes
>    (PersonIcon) + tagline + source OCHA. CENTRÉ, fond solide (retour Aziz : PAS semi-transparent en bas).
>    Cercles concentriques gardés en amorce courte avant le cartouche. `DisplacementCounter` refait.
> 6. FIN EN 2 TEMPS (registre War-Map AES LONGUE, vérifié sur `warmap-sahel-aes-FINAL.mp4`) : dissolution du
>    globe EN CONTOURS (remplissages/drapeaux/océan fondent, ne restent que les traits de frontières, le SOUDAN
>    reste très visible contour marqué + barré) PUIS noir + phrase finale TYPEWRITER une ligne : "Personne ne
>    peut l'arrêter. Personne n'a de raison de le faire." (validée Aziz). PAS de CTA.
>
> ⚠️ Registres AES vérifiés cette passe (code+frames réels, ne pas confabuler) : le cartouche data = la
> VIDÉO LONGUE (`Partie4Cout.tsx`, WarMapOverlayData), PAS le Short 90s. La fin contours = fin de la longue
> ("Durer — reste à le démontrer" sur contours). Drapeaux voisins UA : `public/_shared/flags/` (td,ss,et,er,
> ke,cf,ly,cd,dz,ru + eg,ne,ng existants).
>
> **PASSE 3 — DYNAMISME (passe LLM Gemini 3.1 Pro + Kimi K2.5, convergence quasi totale) — appliquée + PROMU** :
> Aziz a demandé une passe "dynamisme" (pas densification, la scène est déjà dense) via nos 2 modèles habituels
> sur la vidéo complète. Verdict convergent + appliqué :
> - **Veto ONU** : ONDE DE CHOC depuis la Russie (sièges basculent au rouge QUAND l'onde les touche, ~4s,
>   ralenti retour Aziz "trop rapide") + X qui se DESSINE (stroke-dashoffset) + MARTEAU qui frappe au veto.
> - **Table B4** : DÉRIVE de caméra (push-in+drift lent) + PARTICULES "god rays" dans le faisceau + respiration
>   silhouettes renforcée + 1 qui tapote. ⚠️ PAS de vraie vue 3D (impossible proprement en SVG — Claude l'a
>   signalé, Gemini/Kimi surestimaient ; dérive/parallaxe = 80% de l'effet sans le faux-3D bancal).
> - **B2 exclusion** : FLASH + pop d'impact au "suspendu" (SANS camera-shake, Aziz l'a exclu).
> - **B5 compteur** : chiffre qui incrémente 0→13,5 + REBOND + pictos en STAGGER (tombent en place). ⚠️ BUG
>   corrigé : le cartouche crème doit être OPAQUE dès l'apparition (fade court 4f + scale), PAS une longue
>   montée d'opacité (sinon transparent = carte visible à travers = brouillon).
> - **Fin** : typewriter démarre 1,7s plus tôt (pendant la dernière phrase parlée).
> Rapports LLM : `/tmp/da-refs/kimi-compare-acte6-dynamisme.md` + scratchpad `dyn-gemini.md` (rapatrier si utile).
> Leçon gravée : `openrouter-svg.md` § Fable 5 (test SVG) + passe dynamisme (Gemini/Kimi = signal codable).
>
> ✅ **PROMU FINAL 2026-07-20 (v6)** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte6-verrou-institutionnel-FINAL.mp4`
> (+ `_compressed`). Validé Aziz. Lien 72h : https://litter.catbox.moe/16wwtd.mp4.

## ✅✅ ACTE 5 « LE RÉSEAU QUI ARME DANS L'OMBRE » — REFAIT EN GLOBE D3, PROMU FINAL v5 (2026-07-19)

> **TERMINÉ + PROMU.** L'Acte 5 a été entièrement REFAIT en GLOBE D3 intégral (abandon de la piste Mapbox
> v2 de la s12), densifié, review Gemini/Kimi appliqué, validé Aziz.
>
> **Livrable** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte5-reseau-ombre-FINAL.mp4` (+ `_compressed`).
> **Code = le vrai livrable** : `src/projects/_rnd/d3-16x9/SoudanActe5Globe.tsx` (compo `D3-SoudanActe5-Globe`).
> **Branche** : `feat/soudan-acte5-globe` (mergée dans master, commit d92ef780). Sprites neufs : `camp-entrainement-td.png`,
> `portrait-haftar.png` (`public/_shared/sprites/warmap/`). Moteur globe D3 désormais prouvé sur 2 actes (3 et 5).
>
> Fait cette session : globe D3 intégral (5 beats) · densification (jeton Haftar vraie photo + soldats +
> 2 camps + checkpoints, artère multi-lignes + convois) · corridor stylisé piste sinueuse (`windingCircle`,
> inspiration GPT-5.6 Sol) · sources exactes (enquête Lighthouse/Der Spiegel + rapport ONU) · review
> Gemini+Kimi appliqué (croix d'impact retirée → ondes ; système isolé au dézoom ; plaques sources 1 ligne).
>
> ⛔ **PÉRIMÉ — ne pas repartir dessus** : le code Mapbox `src/projects/warmap/soudan-acte5/SoudanActe5.tsx`
> (v2), le diagnostic downstream densification (`da-briefs-acte5/`), l'arbitrage Abou Dabi et le starter
> `STARTER-PROMPT-soudan-acte5-densification.md` sont tous périmés (remplacés par le globe). Trace uniquement.
>
> **Acte 6 (verrou institutionnel UA/ONU + conclusion)** : script v5 + audio VERROUILLÉS + storyboard actés
> (2026-07-19) — voir `memory/projects/soudan-midform-ACTE6-SCRIPT.md`. Audio `public/_shared/audio/soudan/
> acte6-verrou-institutionnel.mp3` (133.2s). Storyboard = globe D3 + overlay UI vote + insert SVG table
> (`da-briefs-acte6/`). CTA : aucun. **→ CODÉ + PROMU FINAL 2026-07-20 (voir section tête).** Reste Acte 4 puis assemblage.

---

## 🗄️ ACTE 5 — état s12 (Mapbox v2, PÉRIMÉ 2026-07-19, trace historique)

0. **🎬 Acte 5 — script verrouillé, audio+timing+code+render v2 FAITS. Reste : TRIER le diagnostic
   downstream + décider quoi appliquer (session 12, 2026-07-18).**
   - Script v6 verrouillé (`memory/projects/soudan-midform-ACTE5-SCRIPT.md`), audio généré
     (`public/_shared/audio/soudan/acte5-reseau-ombre.mp3`, 80.11s), forced-alignment fait, timing
     frame-exact (`src/projects/warmap/soudan-acte5/soudanActe5Timing.ts`).
   - **Code écrit et rendu** : `src/projects/warmap/soudan-acte5/SoudanActe5.tsx` (100% carte, 4
     sections). Render v2 validé par self-review render réel (2 bugs de jonction Beat2→3 trouvés et
     corrigés : caméra qui sautait sèchement + masque parchemin Libye qui clignotait kaki→crème).
     Lien 72h (à re-uploader si expiré) : `https://litter.catbox.moe/4ov6bx.mp4`.
   - ⛔⛔ **DIAGNOSTIC DOWNSTREAM FAIT — verdict net, PAS ENCORE APPLIQUÉ AU CODE.** 2 appels
     séquentiels (Gemini + Kimi K2.5, 4 réponses indépendantes), tous rapatriés dans
     `memory/episodes/soudan-midform/da-briefs-acte5/` :
     - `01-comparatif-{gemini,kimi}.md` : vs référence Sahel P2 — convergence 2/2 sur LE problème n°1 :
       **absence de conséquence territoriale du mouvement** (le trait Kufra→El-Fasher n'a aucun impact
       visuel à l'arrivée), **absence d'acteurs visuels** (portraits Haftar/RSF jamais montrés), et le
       dézoom caméra vers Abou Dabi (ajouté cette session) jugé "motivé par rien" par les deux — mais
       PAS d'accord sur LA solution de remplacement (Gemini : plaque depuis le bord / Kimi : garder en
       persistance réduite).
     - `02-densification-{gemini,kimi}.md` : brainstorm prospectif (PAS un jugement) sur comment
       meubler la carte avec notre arsenal — condensé dans la doctrine `memory/doctrines/
       WARMAP-DENSIFICATION-CARTE.md` (⭐⭐ à lire en premier, 15+ techniques classées par couche
       acteurs/territoire/événements/UI + règle simple garder/effacer : "verbe→efface, nom→persiste").
   - **NEXT SESSION — trier avec Aziz, PUIS coder** (pas l'inverse) : quelles techniques de
     `WARMAP-DENSIFICATION-CARTE.md` s'appliquent à l'Acte 5 précisément (la doctrine propose déjà 5
     points d'application immédiate en fin de fichier, à valider/ajuster, pas à appliquer aveuglément).
     Point d'arbitrage explicite requis : la divergence Gemini/Kimi sur le point Abou Dabi.
   - ⛔ **Point technique non-négociable conservé** : trait corridor Kufra→El-Fasher = UNE seule
     variable de trajectoire continue (Beat3→4), déjà respecté dans le code actuel.
   - Coordonnées géo vérifiées WebSearch (Kufra 24.18°N/23.28°E, Benghazi 32.11°N/20.07°E, Abou Dabi
     24.45°N/54.37°E), El-Fasher déjà dans `sudan.warmap.json`.

**Outils créés/fixés cette session (2026-07-18), réutilisables pour tout futur acte** :
- `scripts/tools/force_ipv4.py` — fix IPv6-mort-en-sandbox importé nativement dans `da-brief.py`,
  `da-compare.py`, `visual_review.py`, `kimi-video-compare.py` (plus besoin du wrapper CLI manuel).
  Détail root-cause : `memory/tools/yt-dlp.md`.
- `scripts/tools/kimi-video-compare.py` — équivalent Kimi K2.5 natif de `da-compare.py` (vidéo complète
  en base64, API Moonshot directe — liens HTTP publics refusés, testé et confirmé). Détail :
  `memory/tools/kimi-video-native-base64.md`.
- Pattern **2 appels séquentiels** (comparatif PUIS génératif) documenté dans `DA-BRIEF-GATE.md` — après
  tout downstream comparatif, TOUJOURS proposer le 2e appel prospectif plutôt que s'arrêter au diagnostic.
  Brief générique réutilisable : `scripts/warmap/templates/warmap-densification-brief.txt`.

1. **Acte 4 — 4 lots de refonte faits, en attente de validation par VISIONNAGE COMPLET (audio+visuel).**
   Suite au retour d'Aziz sur le v6 (session 9), refonte en profondeur cette session (10) :
   - Beat 1 (Russie) : zoom Moscou dézoomé 6.4→3.6 (territoire filtré se lisait comme un point isolé) +
     bascule 2024 fusionnée en un seul mouvement caméra (au lieu d'un aller-retour saccadé).
   - Beat 5 (Kosti, drone) : **⭐ REFONTE 2026-07-17 — carte Mapbox top-down REMPLACÉE par un INSERT SVG
     plein écran** (`src/projects/warmap/soudan-acte4/KostiInsertSVG.tsx`). Raison : la vue carte servait mal
     un fait de COÛT CIVIL (intention "coût humain incarné" = QUOI/COMMENT → insert SVG, pas carte = OÙ ;
     doctrine `MOTEURS-VISUELS-ET-SOCLE.md`). Registre "carte d'état-major" (écho de `KhartoumEtatMajorSVG`
     déjà vu dans la vidéo) mais infléchi CIVIL : 6 jetons civils distincts (portraits) qui s'ÉTEIGNENT à la
     frappe, pas de jeton militaire. Composition de base proposée par GPT-5.6 Sol (validée Aziz), nos assets
     branchés (drone-rsf-td.png + portraits + Nil animé). Calé sur narration p4 (drone frappe sur "drone"
     F4.droneFrappe, civils éteints étalés jusqu'à "civils qui en payent le prix"). Proto validé :
     `KostiFrappeProtoV3`. Ancien code carte (DroneStrikeImpact/CAM4/HookDisplacementBurst) laissé en place
     dans le fichier mais NON monté (voir historique git).
     **⚠️ 2e REFONTE 2026-07-17 (session Kimi K3, branche `feat/kosti-refonte-k3`, commits bd302d24 +
     718244f3, NON mergée)** : la STATION-SERVICE et le corps du DRONE sont désormais dessinés par Kimi K3
     (test vision→SVG one-shot) et rendus INLINE (`StationDecor` + `DroneBodyK3` dans KostiInsertSVG.tsx).
     Le sprite `drone-rsf-td.png` ET le décor externe `kosti-sol-decor-noriver.svg` ne sont PLUS rendus
     (fond de carte redessiné inline `MapBackdrop`, sans mention "CARTE DE SITUATION"). Portraits civils
     INCHANGÉS (toujours `Img` sprites). Mentions inventées par K3 retirées (VECTEUR RSF, 4,2 km, réticule
     horodaté). Re-render isolé validé par Aziz (`Kosti-Beat5-Standalone`). Détail R&D K3 : `memory/tools/openrouter-svg.md` § Kimi K3.
     ⚠️ v7 (`acte4-v7-full.mp4`) est PÉRIMÉ pour le Beat 5 — re-render complet de l'acte nécessaire (jamais
     fait sur la version K3). Merge `feat/kosti-refonte-k3` → master en attente.
   - Beat 2 (Port-Soudan) : insert SVG plein écran abandonné, retour à la carte. Jeton naval iso/topdown
     GPT-5.6 Sol (choisi par Aziz après comparaison sur la vraie carte), agrandi +50% (140→210px).
   - Beat 3-4 (Égypte/Nil) : zoom resserré 4.0-4.6→5.2-5.8, `CountryParchmentMask` appliqué à l'Égypte
     (drapeau retiré de cette section, écrasait le masque). Nil : `GradientPathReveal` abandonné pour un
     simple éclaircissement du tracé natif déjà dessiné par le fond de carte.
   - Beat 6 (synthèse) : séquençage temporel (1 puissance à la fois + convergence finale) remplace 4
     panneaux fixes qui occupaient ~40% de l'écran en permanence.
   Render complet v7 fait : `out/episodes/soudan-midform/wip/acte4-v7-full.mp4`, catbox
   `https://files.catbox.moe/riedly.mp4`, override tracé (pas de review Gemini bloquante ce tour, faux
   positif palette "navy" déjà tracé 3x cette session). **PAS encore promu FINAL.**

**Leçon transversale gravée cette session** (`WARMAP-GRAMMAIRE.md` § R-V5) : sous-dimensionnement
récurrent des objets/effets (4 occurrences dans le même acte) — réflexe de correction = toujours
agrandir/étaler/allonger l'ensemble, jamais un ajustement isolé d'une seule valeur.

---

**Dernière mise à jour :** 2026-07-11 (session 7) — 🎬🎬 **ACTE 3 « SUIVRE L'OR » FINAL PROMU.**
v7→v12 : 3 problèmes v7 (zoom/caméra/drapeaux) corrigés, Beat 1 refondu 2× (concept B rejeté "pas
narratif" → concept A "puits sans fond" adopté et affiné suite retour Gemini), plan SFX complet (9 SFX)
appliqué. **Branche :** `feat/soudan-acte3`. Acte 2 « Blocage » FINAL approuvé (session 4).
**Promu :** `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-FINAL.mp4` (+ `_compressed`)
· `soudan-acte2-blocage-FINAL.mp4` (catbox `jgvhr2`).

## ✅✅ ACTE 3 « SUIVRE L'OR » — FINAL (session 7, 2026-07-11)

**Livrable** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-FINAL.mp4` (74.6MB, 125.8s)
+ `_compressed.mp4` (24.5MB, mobile). Dernier catbox validé : `https://files.catbox.moe/y2swv7.mp4`.

**Corrections v8→v9 (suite diagnostic v7)** :
- Zoom intro (beat 1) : diagnostic agents R&D initial FAUX d'un facteur ×10 sur la formule Web Mercator
  (zoom 6.6 = ~3000km d'écran réel, pas ~300km). Recalibré à zoom 9.3 (vrai close-up ~460km), Khartoum et
  Darfour ne sont plus jamais visibles simultanément.
- Mine hors territoire (`MINE_2`) repositionnée dans le vrai Soudan (Southern Darfur), vérifiée
  point-in-polygon.
- Drapeaux : motif complet permanent (plus d'aplat au dézoom), resynchronisés sur les vrais événements
  narratifs (le drapeau EAU était câblé sur le mauvais jalon, 13.5s de décalage avec l'arrivée du lingot).
- Sprite mine d'or agrandi (72→130px), territoires colorés RSF/SAF ajoutés dès l'ouverture (meuble les
  30 premières secondes).
- Split-screen final : `WarMapSplitScreen` réel écarté (2 Maps WebGL simultanées = crash confirmé par
  test), gardé les panneaux glissants + ajouté connector convergent (trait or) + sortie en étau
  (resserrement plutôt que fade plat).
- Métamorphose or→drone à Dubaï : composant `MarkerMetamorphose` (wipe circulaire, adapté de
  `MetamorphoseFiduciaire`).

**Beat 1 "paradoxe" refondu 2× (session 7)** — leçon clé sur le workflow storyboard→SVG :
1. Storyboard image généré par Gemini (silhouettes en pose de combat) → REJETÉ, pas réalisable en
   SVG/Remotion (pas de rig articulé, ça a été confirmé par la doctrine `openrouter-svg.md`).
2. 2 agents R&D texte ont proposé 2 concepts SVG purs : concept A ("un puits sans fond" — jauge qui fuit
   + 2 sources qui rechargent + filet mystère qui s'inverse) vs concept B ("la source qui ne tarit
   jamais" — veine qui se scinde + jauges oscillantes). **B choisi en premier** (meilleur rendu technique)
   puis **REJETÉ après review** : "dur à comprendre, manque de narratif" (2 cercles R/S + une ligne, sans
   contexte, ne raconte rien tout seul). **A repris et adopté** — chaque phase a un geste CAUSE→EFFET
   lisible sans légende.
   → [[feedback_narratif-avant-esthetique-svg-genere]] (à écrire si le pattern se reproduit).
3. Génération technique : GPT-5.6 Sol (`openai/gpt-5.6-sol` via OpenRouter) bat nettement Gemini 3.1 Pro
   sur ce registre "schéma composé riche" (confirmé 2× — storyboard-dual-gen ET génération SVG directe).
   Prompt→JSON structuré (`{"scene": "<g>...", "notes": "..."}`), scene = JSX directement collable.
4. Révision ciblée (pas regénération) suite retour Gemini vision sur le rendu : recentrage, fuite plus
   visible dès le départ (courbe puissance vs linéaire), graduations qui s'éteignent au niveau du
   liquide, dégradé doré mat, gouttes en fade-out, pulsations sur les tuyaux. Gemini = signal vérifié
   point par point (2 points sur 8 étaient des perceptions à nuancer, pas des faits — ex. couleur déjà
   correcte dans le code).

**SFX (session 7)** — 9 SFX au total (5 existants remontés 0.35-0.4→0.50 + 4 nouveaux ciblés sur les
moments narratifs forts, jamais sur les transitions génériques — whoosh/impacts systématiques écartés
sur consigne Aziz "pas la peine d'abuser") : 3 impacts échelonnés (mines d'or), stamp-dossier
(métamorphose or→drone), tension-pulse (étau final). Règle confirmée : `tension-drone.mp3` INTERDIT
(décision Aziz 2026-06-27, dérange) — jamais de lit sonore continu, combler par musique+SFX ponctuels.

**Nettoyage** : itérations wip/_rnd v7-v12 PAS purgées (permission refusée en session, ~700MB) — à faire
en session future si besoin d'espace disque, sans urgence (FINAL sécurisé dans PRET-PUBLICATION).

## 🗄️ ACTE 3 v7 (session 6, 2026-07-10) — diagnostic archivé, périmé

**⚠️ LIRE AVANT DE REPARTIR** : v5→v6→v7 ont chacun ajouté des corrections (caméra suiveuse, pictogrammes
GLM puis sprites PNG drones, split-screen enrichi, mines pop+onde de choc) et Aziz a validé le PROGRÈS
relatif à chaque tour — MAIS après vérification factuelle (comparaison directe des frames rendues vs
`_incoming/silk road 1/2.mov`) en fin de session, **3 problèmes que Claude croyait résolus ne le sont
PAS réellement** :

1. **Zoom d'intro pas un vrai close-up.** `CAM1` (beat 1, SoudanActe3.tsx) tourne à zoom 5.3-5.8 —
   resserré RELATIVEMENT à la v5 (qui était à 4.2), mais comparé frame-par-frame à Silk Road 2 le zoom
   Mapbox nécessaire pour un vrai "close-up sur 2 points" est beaucoup plus élevé. Le rendu v7 montre
   encore tout le Soudan en contexte, pas 2 portraits en gros plan.
2. **Caméra suiveuse (`cameraFollowsPath`, beats 3-5) pas assez serrée.** `CAM2_ZOOM_FOLLOW = 5.2` est
   quasi identique au zoom "large" du beat 1 — aucune vraie différenciation caméra-suiveuse vs vue
   d'ensemble. L'effet "voyage immersif façon Silk Road 2" n'est PAS obtenu malgré la fonction générique
   `cameraFollowsPath()` (SoudanWarMapEngine.tsx) qui est correcte techniquement — c'est un problème de
   VALEUR DE ZOOM, pas de logique.
3. **Coloriage pays = aplat de couleur unie, PAS le vrai drapeau.** `CountryColorLayer` (fin de
   SoudanActe3.tsx) clippe juste une TEINTE nationale dans le contour du pays, jamais le motif complet du
   drapeau — décision héritée d'une note "retour Aziz 2026-07-09" d'une session antérieure, jamais
   re-tranchée cette session malgré qu'Aziz redemande explicitement plusieurs fois "la couleur du drapeau,
   pas une seule couleur". Le bon composant existe déjà (`useClipFlags`/`ClipFlagsLayer`,
   `src/projects/_shared/mapbox/useClipFlags.tsx`, utilisé ailleurs dans le projet pour un vrai clip de
   drapeau complet, cf `SceneComparaisonV3.tsx` Sénégal) mais n'a pas été branché ici.

**Leçon méthodologique** : Claude a affirmé un progrès ("caméra rapprochée", "drapeau qui se colorie") sur
la base du DIFF relatif vs la version précédente, sans reconfronter le résultat absolu à la référence
demandée (Silk Road) ni au brief d'origine (le VRAI drapeau, pas un aplat). À corriger la prochaine
session : toujours reconfronter au brief original + à la référence visuelle citée, pas juste comparer
« mieux qu'avant ».

**3 agents R&D lancés en fin de session (diagnostic pur, aucun code touché)** — rapports dans
`/private/tmp/.../scratchpad/` (session-spécifique, à rapatrier si utile) ou à relire dans la prochaine
session via les résultats déjà synthétisés par Claude :
- Agent 1 (camera-drapeaux) : diagnostic chiffré des 3 problèmes ci-dessus + valeurs de zoom concrètes.
- Agent 2 (exploration-libre) : carte blanche mise en scène, sans contrainte de réutiliser l'existant.
- Agent 3 (mapanimation-templates) : fouille du catalogue mapanimation.io (89 templates) + composants
  internes Souverain/warmap sous-exploités, pour les 3 mêmes axes (caméra suiveuse, transformation
  visuelle, split-screen enrichi).

**Ce qui reste VALIDE et à garder** (progrès réels, pas remis en cause) : moteur `cameraFollowsPath()`
générique (juste mal paramétré en zoom), sprites PNG drones (nettement mieux que le SVG initial), split-
screen avec icône+2 faits+contour progressif (Aziz a dit "je trouve cela intéressant"), mines pop+onde de
choc, convoi de drones échelonnés, lignes épaissies.

- **Piste globe rotatif testée et ÉCARTÉE pour cette session** (nouvelle demande Aziz, vidéo repérage
  `_incoming/globe trial.mov`) : proto `GlobeSoudanDubaiTest.tsx` (adapté de `GlobeLocationReveal.tsx`,
  existant Souverain 9:16 → testé 16:9), style visuel validé (fidèle à la référence night-mode/étoiles),
  MAIS bug confirmé en rendu headless réel : les tuiles vector natives du fond de carte (terrain/frontières)
  ne se chargent quasi jamais à temps avant capture (disque bleu vide ~95% du rendu, continents visibles
  seulement dans les toutes dernières frames). Distinct du bug fills déjà documenté (`rules-outils-
  techniques.md`) qui touche les layers ADDED, pas les layers natifs du style de base. Piste à reprendre
  en session R&D dédiée (`map.once('idle')` ou pré-chauffage tuiles avant capture), PAS à improviser sur
  un acte en production.
- **Bug trouvé+corrigé en session** : volet Turquie du beat 7 utilisait `drawFlagCanvas` (codes ISO 3
  lettres, "TUR" absent de la liste → juste "TR" en texte) au lieu du PNG `_shared/flags/tr.png` déjà
  utilisé par `ALL_COUNTRY_FLAGS`/`useClipFlags` ailleurs dans le même fichier — corrigé en `staticFile`.
- **Renders produits cette session** (`out/episodes/soudan-midform/wip/`) : `acte3_v5.mp4`, `acte3_v6.mp4`,
  `acte3_v7.mp4` (+ versions `_compressed.mp4` pour mobile, CRF26 faststart) — tous à considérer comme
  ITÉRATIONS DE TRAVAIL, pas des candidats FINAL (les 3 problèmes ci-dessus ne sont résolus dans aucun).

> ⭐ **PROCHAINE ACTION = lire les 3 rapports d'agents R&D, synthétiser un plan de fix chiffré pour les
> 3 problèmes (zoom intro, zoom caméra suiveuse, vrai drapeau clippé), coder, RECONFRONTER au brief
> original + Silk Road avant de présenter comme résolu** (pas juste comparer à la version précédente).

## 🗄️ ACTE 4 (Mapbox, PÉRIMÉ 2026-07-21) — BEAT 2 INSERT SVG, BEAT 4 (session 9, 2026-07-12) — TRACE

> ⛔ **PÉRIMÉ (2026-07-21)** : l'Acte 4 est REFAIT en globe D3 3 registres (voir section tête). L'architecture
> Mapbox ci-dessous est ABANDONNÉE. Seul l'insert Kosti K3 (Beat 5) reste valide et réutilisé. Trace historique.

> ⚠️ **CORRECTION DÉSYNCHRO MÉMOIRE (2026-07-11)** : la section ci-dessous affirmait à tort "breakdown +
> code restent à faire après l'audio (pas commencés)" — FAUX, détecté par agent `creative-director` lors
> d'un audit render réel. En réalité : script v5 verrouillé, **audio généré** (5 parties + FULL concat,
> catbox `13h1s0`), **code écrit** (`src/projects/warmap/soudan-acte4/SoudanActe4.tsx`, ~830 lignes),
> **3 renders déjà produits** (`acte4-test-full.mp4`, `acte4-v2-full.mp4`, `acte4-v3-full.mp4`,
> `out/episodes/soudan-midform/wip/`). Toujours croiser code+render réels avant d'affirmer un état
> d'avancement, ne jamais se fier à une note mémoire seule (règle projet "vérifier CODE + VISUEL").

- **Script v5** verrouillé, audio généré : `memory/projects/soudan-midform-ACTE4-SCRIPT.md`.
  Angle : Russie (bascule de soutien RSF→SAF en 2024, offre de base navale à Port-Soudan 25 ans/300
  soldats/4 navires) + Égypte (soutien direct au SAF, motif Nil/profondeur stratégique) — pont vers l'Acte 5
  (verrou institutionnel UA/ONU/Quad + conclusion ouverte). 6 beats, durée réelle ~131s.
- **Pipeline script complet exécuté** : Tavily → v1 → fact-check Sonar Pro+Tavily (1 fait FAUX retiré,
  Kosti officiers égyptiens confabulé) → v2 → jury LLM clarté (3 modèles) → v3 → jury LLM densité/flux
  (réordonnancement beats 4-5) → v4 → corrections manuelles Aziz → **v5 final**.
- **2 leçons méthodologiques gravées dans `DOCTRINE-SCRIPT-UNIFIEE.md`** : règle 4bis (date/durée EXACTE,
  jamais d'approximation relative) + règle 6bis (densité CUMULATIVE testée sur l'acte ENTIER, pas phrase
  par phrase). Outil créé : `scripts/tools/jury-script-llm.py`.

### ⭐ Beat 4 (motif égyptien/Nil) — DIAGNOSTIC + CORRECTION (session 8, 2026-07-11)

Le "Nil qui pulse" du code initial était **invisible sur render réel** (v3 : diff pixel quasi nul entre
frames 68s/72s, confirmé par extraction directe). Débloqué via `creative-director-dual` (2 agents
indépendants, convergence 100% Mapbox pour tout l'acte) puis `da-brief-gate` upstream (Gemini 3.1 Pro +
Kimi K2.5 + DeepSeek V4, convergence 3/3 sur la solution) :
- **Nouveau composant** `GradientPathReveal` (`src/projects/warmap/_shared/GradientPathReveal.tsx`) : le
  Nil devient une MASSE qui se teinte progressivement (front qui avance dans le sens réel Soudan→Égypte,
  stroke-width 2→11px, dégradé or→bleu SAF, `feTurbulence` texture eau) au lieu d'un marqueur ponctuel qui
  voyage — distinct de `GeoFlowConnection` (réservé aux objets qui VOYAGENT A→B, pas un territoire qui
  change d'état). Flash net synchronisé sur "profondeur stratégique". `NileFactPlaque` (texte 90% eau)
  conservé en renfort discret, pas porteur seul du sens.
- **Beat 3** enrichi : onde de choc (cercle qui s'étend et fade) au contact Égypte→halo SAF, arbitrage
  Aziz entre 2 options DA-brief (onde de choc Gemini retenue vs icône Eye Kimi écartée).
- **Vérifié sur render réel** (test isolé frames 1975-2415, `render-mapbox.sh`) : le trait est maintenant
  visiblement épaissi/coloré entre le début et la fin du beat — plus de trait invisible.
- Synthèse tracée complète : `memory/episodes/soudan-midform/PLAN-ACTE4.md`.

### ⭐⭐ Beat 2 (base navale Port-Soudan) — DIAGNOSTIC COMPARATIF + REFONTE EN INSERT SVG (session 9, 2026-07-12)

Suite à la pause de fond décidée en session 8 (NEXT-ACTION "diagnostic comparatif AVANT tout code"), le
diagnostic a été fait cette session : mapping de CODE (pas juste frames) des 4 vidéos de référence du
projet (War-Map Sahel AES + Actes 1-3 Soudan), confirmé indépendamment par Gemini 3.1 Pro et Kimi K2.5.
Conclusion : pas de refonte structurelle globale de l'acte — la grammaire du projet réserve le régime
"insert SVG plein écran" aux faits conceptuels/institutionnels SANS ancrage géo fort (jamais aux faits
spatiaux), et l'Acte 4 n'en avait AUCUN sur ses 6 beats malgré 2 beats candidats (2 et 4). Détail complet
du diagnostic : `PLAN-ACTE4.md` § Régie globale AMENDÉ.

- **Beat 2 sorti de la régie Mapbox continue**, refait en insert SVG plein écran
  `src/projects/warmap/soudan-acte4/PortSoudanNegociationScene.tsx` : un navire de guerre russe navigue
  depuis la droite vers Port-Soudan (déjà visible dès l'ouverture), se stabilise, mer vivante (couches de
  vagues multiples à vitesses différentes), 3 navires secondaires en fondu à "quatre navires". Cartouches
  texte + halo "propulsion nucléaire" retirés (redondance avec la voix, retour croisé Aziz+Gemini+Kimi) —
  aucune incarnation visuelle de "300 soldats" non plus (décision Aziz : champ déjà dense, risque
  d'échelle avec des stick figures à cette distance).
- **Assets** : mix-and-match GPT-5.6 Sol (port/ciel/mer/navires secondaires, prompt unique) + Gemini 3.1
  Pro (navire principal, silhouette militaire jugée supérieure) — 1 seul prompt combiné envoyé aux 2
  modèles (cohérence multi-éléments). `scripts/tools/svg-scene-narrative.py` corrigé en dur (GPT_MODEL
  `openai/gpt-5.6-sol`, était resté sur `gpt-5.5` malgré la doctrine déjà actée le 2026-07-10).
- **Leçon méthodologique clé** (coût réel : plusieurs rounds de rafistolage) : une tentative de remplacer
  la mer d'origine validée (coordonnées Y=520+) par le composant partagé `OceanProfondeurVagues`
  (coordonnées Y=720 en dur) a cassé le raccord port/mer — corrigé en revenant à la géométrie validée et
  en enrichissant IN PLACE (couches de vagues ajoutées par-dessus) plutôt qu'en import de système externe.
  Détail : `feedback_enrichir-existant-vs-composant-partage-geometrie.md`.
- **4 éléments extraits en composants réutilisables** dans `svg-library/elements/{ciel,ocean,maritime}/`
  (CielCrepusculeFroid, OceanVaguesNocturne, NavireGuerreEncre, PortMilitaireEncre) — le fichier de
  production garde son code inline tel quel (extraction pour réutilisation FUTURE, pas un refactor).
- **Intégré** dans `SoudanActe4.tsx` (ancienne Section2 carte remplacée), imports morts nettoyés,
  vérifié par render réel de la composition complète sur la plage Beat 2.

**NEXT = Beat 4 (motif égyptien/Nil) reste à traiter en session dédiée future** — même diagnostic
applicable probablement (concept abstrait sans ancrage spatial fort), composant `GradientPathReveal` de
la session 8 reste la base technique mais la mise en scène reste à trancher (storyboard + génération).
PUIS re-render l'acte complet (131s) pour validation à l'écoute/à l'œil par Aziz, puis promotion si validé.

## 🎬🎬 ACTE 2 « BLOCAGE » (session 4, 2026-07-09) — COMPLET & POLI
- **Render final** : `out/episodes/soudan-midform/wip/acte2-FINAL.mp4` (à promouvoir) · dernier catbox `https://files.catbox.moe/mxkehy.mp4` (93.6s).
- **Structure 3 sections** (registres alternés, plan gravé) : `src/projects/warmap/soudan-acte2/SoudanActe2.tsx` :
  - **Section 1 [0..1167]** beats 1-4 = CARTE + **jeton 2-visages** (`TwoFaceToken`, symbole signature : convergence→fusion 2021→fend « qui commande »→split 2023 reconstitution) + **compteur d'année** (`YearCounter`, fil temporel 2026→2021→2023) + **forces au split** (soldats portrait-rsf/saf + technicals/chars, meublage).
  - **Section 2 [1167..1887]** beat 5 = INSERT `KhartoumEtatMajorSVG` (hideSubtitle) + **narration dédiée** `acte2-beat5.mp3` (assaut Khartoum, la voix nomme aéroport/palais/TV en synchro). Fin du beat 5 pose « la milice tient déjà plusieurs quartiers » = pont vers beat 6.
  - **Section 3 [1887..2807]** beats 6-9 : **beat 6 = BLOC** `BlocImpasseB6` (rapport de force 100% illustratif : technicals RSF / chars mobiles + avions fixes SAF, poussée→reflux→front tient) puis **beats 7-8-9 = CARTE** (dézoom immensité + **compteur 1000km** + **supply vivante** impulsions/dangers RSF répartis + or du Darfour qui pulse + dézoom hors Soudan). **Continuité front bloc→carte** (`FrontBridge`).
- **Audio LOCK** : 3 blocs (pa/pb/pc) + narration beat5, stability 0.45, prononciation nettoyée (voir AUDIO-ETAT). Fin « sortir du Soudan » restaurée. Aligns : `whisper-partie1.ts`/`whisper-partie2.ts`.
- **SFX ponctuels** (plan validé Aziz) : tics compteurs, tension à la faille, whoosh/impact bloc, node-appear forces, slash dangers. ⚠️ **Volumes à valider à l'oreille Aziz** (Claude ne peut pas écouter).
- **Écartés/backlog** : palais iso (retiré, objet orphelin non nommé par la voix) · relief désertique Mapbox · fissure au split · caméra pitch 3D (rejeté doctrine).
- Assets neufs : `palais-gouv-td.png` (Gemini, retiré du montage mais conservé). Composants : TwoFaceToken, GovBuilding (inutilisé), BlocImpasseB6, YearCounter/KmCounter/FrontBridge (inline SoudanActe2).

## 🎬 ACTE 1 v5-FINAL (session 3, 2026-07-07) — CANDIDAT VALIDÉ (sous réserve dernier visionnage Aziz)
- **Render RETENU** : `out/episodes/soudan-midform/wip/acte1_v5-FINAL.mp4` (57.3s) · catbox `https://files.catbox.moe/qc5dgq.mp4`.
  (v5 = v4-FINAL + **vraie forme du Soudan** extraite du geojson dans l'insert 50M, au lieu de la silhouette Afrique
  dessinée à la main. Fact-check article the-conversation : géo VALIDÉE — RSF ouest / SAF est+Khartoum, or→Émirats.)
- **Corrections cumulées (post-reviews Aziz)** : (1) ⛔ **ORTHOGRAPHE « HEMEDTI »** (était « Hemeti » sans D à
  l'écran = faute grave de crédibilité) — vérifié Wikipédia. **RÈGLE GRAVÉE** : tout nom propre affiché à l'écran →
  vérifier orthographe Wikipédia AVANT render (jamais dériver du whisper). Cf [[feedback_nom-propre-ecran-verifier-wikipedia]]
  + key-learnings. (2) **JETONS NETS** : retiré le `breathe` (scale oscillant continu sur image raster = flou/scintillement
  sub-pixel). Spring d'apparition puis scale figé à 1. (3) **INSERT 50M CENTRÉ** sur la carte (était au bord droit) +
  contenu utile : chiffre + silhouette Afrique (Soudan surligné) + « 3e plus grand pays d'Afrique » — plus les pions
  qui ne disaient rien (`AfricaGlyph`).
- **PROCHAINE ACTION** : dernier verdict Aziz sur v4-FINAL. Si validé → promouvoir en FINAL. **ACTE 2 = SESSION DÉDIÉE**
  (décision Aziz : cette session est pleine, l'Acte 2 gagnera à être fait à part).
- Historique v1→v4 + double review Gemini/Kimi : voir sections ci-dessous + `reviews-acte1/`.

### v4 (avant corrections finales) — trace
- Render : `out/episodes/soudan-midform/wip/acte1_v4.mp4` · catbox `https://files.catbox.moe/5ni7xj.mp4`.
- **Double review Gemini(vidéo)+Kimi(frames)** faite sur v3, convergentes → v4. Détail + recette outils fiables :
  `memory/episodes/soudan-midform/reviews-acte1/` (SYNTHESE-ET-RECETTE.md ⭐, gemini-video-v3, kimi-frames-v3).
  Scripts review réutilisables rapatriés : `scripts/tools/gemini-video-review-custom.py` + `kimi-frames-review.py`.
- **Appliqué en v4** (tout convergent) : (1) **caméra SERRÉE** Darfour beats 1-2 (zoom 5.9) → **dézoom** au « 3e
  plus grand pays » → large partition + **drift lent** permanent (jetons taille écran fixe suivent, OK confirmé).
  (2) **50M = INSERT cartouche AES** (`Insert50M` : encadré parchemin, count-up 0→50 + grille de pions qui se
  remplit) — remplace la grille éparpillée ratée. (3) **LIGNE DE FRONT** nord→sud qui se trace au « coupé en deux »
  (`FrontLine`, encre irrégulière ink-bleed `feTurbulence`/`feDisplacementMap`) = partition PHYSIQUE. (4) **physique
  mines** (ombre portée qui se resserre à l'atterrissage). (5) **halo Hemeti PULSE** (pas fade plat) + respiration.
  (6) **vignette chaude** centrale (lampe de bureau). (7) **halos opaques** sous civils = contraste « pris au piège ».
  (8) **ZÉRO drapeau** mines (consensus 2 modèles + arbitrage Aziz ; nuance : « avec la bénédiction du gvt » aurait
  justifié 1 drapeau, mais épure choisie). Dead code CrowdGrid/SudanFlag retiré.
- **Micro-reste v4** (jugement Aziz) : civils un peu groupés au centre (mais lisent « coincés sur la ligne de front »).

## 🎬 ACTE 1 v3 (session 3, 2026-07-07) — REMPLACÉ par v4 (2e passe retours Aziz, trace)
- **Render** : `out/episodes/soudan-midform/wip/acte1_v3.mp4` (57.3s) · catbox `https://files.catbox.moe/git41c.mp4`.
- **Retours Aziz v2 → v3 (tout visuel + séquençage narratif)** : (1) **ZÉRO label sous les objets** (mine/base).
  (2) **Noms généraux TRANSITOIRES** : fade-in au nom prononcé → disparaissent ~2.5s (plus permanents = distrayants).
  (3) **3 MINES d'or** (même sprite `mine-or-td`) réparties dans le Darfour = « il contrôlait plusieurs mines » ;
  s'estompent (~18%) après le beat Hemeti. (4) **Soldats RSF déplacés** de « il gagne » → « à l'ouest, les hommes
  de Hemeti » (F.ouest), dans leur zone. (5) **50M = GRILLE de silhouettes-pions** (`people-icon`, teintes/tailles
  variées = peuple pluriel/nombreux en étau) qui se remplit puis DISPARAÎT — AUCUN texte (diversité se VOIT, jamais
  « ethnie=cause » : Aziz a laissé Claude trancher le point factuel). (6) **Plaque 25M RETIRÉE** (sous-titre de la voix)
  → seulement jetons civils divers. (7) **Début SÉQUENTIEL** : Hemeti pop seul (« cet homme ») PUIS les mines.
- Décision factuelle tranchée (Aziz délègue) : grille 50M = diversité humaine SANS affirmer que l'ethnie cause la guerre.
- **Micro-restes v3** (jugement Aziz) : pions grille un peu carrés/tassés à l'est · civils centre légèrement groupés.

## 🎬 ACTE 1 v2 (session 3, 2026-07-07) — REMPLACÉ par v3 (trace)
- **Render** : `out/episodes/soudan-midform/wip/acte1_v2.mp4` (57.3s — audio recoupé) · catbox `https://files.catbox.moe/gakuva.mp4`.
- **Retours Aziz v1 appliqués** : (1) portraits Hemeti/Burhan **re-générés en trait d'encre net** (réf `portrait-rsf`,
  double-ref style+visage) + jetons **agrandis** D=76 (v1 = aquarelle floue, trop petits). (2) Beat 1 = **objet MINE D'OR**
  (`mine-or-td.png`, mine à ciel ouvert iso) + **drapeau soudanais SVG** planté dedans + SFX **ping** (jeton) + **pop** (mine)
  — remplace les chars qui ne disaient rien. (3) **Hemeti FIXE** tout le long (v1 le déplaçait = incompris). (4) **ZÉRO chars**
  → **jetons-soldats** visages (`portrait-rsf`/`portrait-saf`, D=44) autour des généraux. (5) al-Burhan = **NOUVELLE base
  soudanaise** dédiée (`base-saf-td.png` régénérée : murs HESCO+tour+pickup+drapeau, plus le recyclage MINUSMA). (6) **25M
  = plaque SUR la carte** + civils **DIVERS** (`refugie-famille/femme1/femme2/homme/enfant`+`portrait-civil`) progressifs LENTS
  (0.66s) — plus de plein écran. (7) **Fin coupée** : audio `acte1-factcheck-v2.mp3` (57.3s, whisper `whisper-words-acte1-v2.ts`)
  s'arrête à « pire crise humanitaire » — le « suivre l'or » doublonnait la dernière phrase du HOOK. (8) 50M = nuée habitants Nil
  (angle « population plurielle en étau », PAS « diversité=cause » : factuellement risqué, écarté avec Aziz).
- **Assets régénérés** (Gemini `gemini-3.1-flash-image-preview`, depuis vraies photos Wikimedia + réf style AES ; damier gris
  Gemini détouré par flood-fill) : `portrait-hemeti/burhan.png` (v2 nets), `mine-or-td.png`, `base-saf-td.png` (neuve).
- **Micro-défauts restants v2** (jugement Aziz) : civils un peu serrés au centre · label « Armée régulière » tronqué à droite.
- Décisions tranchées avec Aziz : couper fin (doublon) · angle 50M population plurielle (pas ethnie=cause).

## 🎬 ACTE 1 v1 (session 3, 2026-07-07) — REMPLACÉ par v2 ci-dessus (archivé pour trace)
- **Fichiers** : `src/projects/warmap/soudan-acte1/SoudanActe1.tsx` (compo `SoudanActe1`, 1995f@30) +
  `whisper-words-acte1.ts` (audio aligné 190 mots). Compo Root enregistrée. Self-review scriptée 0 erreur.
- **Render** : `out/episodes/soudan-midform/wip/acte1_v1.mp4` (66.56s, 1920x1080 H264+AAC, scale=1 plein format).
  Catbox : `https://files.catbox.moe/s1gq11.mp4`.
- **9 beats câblés sur l'audio réel `acte1-factcheck.mp3`** (66.5s, ≠ storyboard : fact-check final = source de vérité) :
  Darfour s'allume → jeton **Hemeti** (VRAI visage) → technicals RSF + halo rouge → nuée dorée "50M" le long du Nil
  (GF1 : PAS de civils) → partition → **al-Burhan MIROIR** (vrai visage, uniforme galonné + base SAF drapeau
  soudanais + tanks bleus, halo bleu) → **civils séquentiels** piégés (GF2 : militaires → 40% Fade to Background)
  → **plein écran SOLIDE 25M** (count-up) → "Suivez l'or" + dézoom amorcé (pont Acte 3).
- **VRAIS VISAGES faits** : `portrait-hemeti.png` (tenue désert/chèche RSF) + `portrait-burhan.png` (uniforme
  galonné SAF) générés Gemini `gemini-3.1-flash-image-preview` depuis vraies photos Wikimedia (Special:FilePath),
  stylisés parchemin (cohérents `portrait-rsf` AES). Base : `base-saf-td.png` (base-fr-td retouchée drapeau
  soudanais + détourée fond blanc). Tous dans `public/_shared/sprites/warmap/`.
- **Review** : Gemini 6.5/NEEDS_WORK ÉCARTÉ (faux positif : réclamait charte Souverain navy/gold au lieu du
  parchemin AES validé = référence-or). Override APPROVE 8.5 documenté dans `acte1_v1.review.json`. Vérifié
  frame par frame (9 frames + 3 corrections : dots Nil renforcés, civils distincts/plus petits, "Suivez l'or" lisible).
- ⚠️ **Limites connues v1 (à traiter selon retour Aziz)** : "Suivez l'or" chevauche légèrement le bas du Soudan ;
  jeton au tout début d'apparition (spring) petit ~1 frame ; sillage Hemeti bref (mouvement resserré).

## ✅✅ SOCLE CARTE SOUDAN — `SoudanWarMapEngine.tsx` (2026-07-07 s2, validé pièce par pièce)
> On a REJETÉ le mini-render de juin (jetons trop gros) ET l'adaptation directe du moteur Sahel (3689 l couplé).
> À la place : NOUVEAU moteur propre `engine/SoudanWarMapEngine.tsx` qui reprend le SOCLE générique AES.
> Référence-or = `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`. Grammaire gravée : [[WARMAP-GRAMMAIRE]] (2 ⭐⭐ en tête).
- **Fichiers** : `engine/SoudanWarMapEngine.tsx` (moteur, 1 Map continue frame-driven) + `engine/soudanActors.tsx`
  (SoudanToken jeton D=58px, SoudanTrail sillage, SoudanBase objet iso) + tests `SoudanSocleTest`/`SoudanHighlightTest`/
  `SoudanMouvementTest`/`SoudanTestFinal` (compos Root). Données : `sudanControlData.ts` (déjà là).
- **API moteur** : `camKeys` (caméra), `zones` (halos locaux qui rayonnent), `highlights` (états qui se tracent),
  `stateLineOpacity`, `showNationalBorder`, `children(proj)` (poser acteurs).
- **VALIDÉ Aziz, pièce par pièce** :
  1. Voile KHAKI troué à la forme du Soudan (voisins sombres, Soudan crème) — reprojeté par frame. Pas "tout crème".
  2. CONTOUR national permanent + INTÉRIEUR VIDE (routes Mapbox masquées, Nil discret, états invisibles au repos).
  3. ⛔ JAMAIS d'aplat de faction plein (testé+rejeté) → la couleur RAYONNE en HALO local, OU trace un CONTOUR d'état.
  4. ⭐ "ON NOMME → ÇA SE TRACE" (option C, la meilleure) : au mot, le contour de l'état se DESSINE (draw-in) dans
     la couleur de la faction (rouge RSF/bleu SAF), et RESTE allumé (persistant, cumul de régions de couleurs ≠).
  5. JETONS AES (portrait-rsf/saf/civil, D=58px fixe) qui se DÉPLACENT + SILLAGE cinétique derrière (traînée qui
     s'estompe ; ⚠️ mouvement doit être RESSERRÉ/rapide sinon sillage invisible : ~2px/frame mini).
  6. ZOOM serré (zoom ~5.5) reste lisible · retour à l'état VIDE en fin d'action OK.
  7. OBJET ISO 3D sur la carte : sprite `base-fr-td.png` = le VRAI fort iso (sacs de sable+tente+drapeau) — ⚠️
     `base-france.png` = une boussole, PAS un bâtiment. Drapeau FR à régénérer neutre/soudanais pour la prod.
- **Renders de validation** (catbox) : socle `w0ydbm` · variantes bloc-vide/états `37cfhc`/`etc2n0` · highlight `42v149`
  · mouvement+sillage `485wub` · **TEST FINAL `i12jyw`** (⭐ LA RÉFÉRENCE — réunit TOUT, point de départ Acte 1).
- ⭐ **`SoudanTestFinal.tsx` = LE CODE DE RÉFÉRENCE** pour bâtir l'Acte 1 (validé Aziz). S'y fier pour : où placer un
  jeton, la plaque-nom (design+position), les halos, le highlight, le sillage, la base iso, le zoom. **Zoom serré ~5.5
  = le zoom de BASE** (validé "parfait, permet de voir l'action"). Tous les socles réutilisables tels quels.
- ⛔ **PROD ACTE 1 — VRAIS VISAGES des généraux (consigne Aziz)** : Hemeti + al-Burhan = personnes RÉELLES → créer
  les jetons à partir de VRAIES PHOTOS (comme les généraux AES), PAS de portrait générique. Les SOLDATS peuvent rester
  génériques (`portrait-rsf/saf`). Recette jeton = cercle parchemin + bordure faction + photo clippée (cf SoudanToken).
  → générer les 2 portraits (Gemini/vraie photo) au début de l'Acte 1. Base iso : régénérer avec drapeau neutre/soudanais
  (le `base-fr-td.png` a un drapeau FR).

Décision structurante antérieure : carte = moteur AES adapté (mini-render juin REJETÉ). Cartographie moteur AES faite.

## ✅ HOOK "L'OR DU DARFOUR" — VALIDÉ (2026-07-07 session 2)
- **Validé Aziz** comme hook d'introduction ("si on doit le changer, plus tard"). Livrable permanent :
  `out/PRET-PUBLICATION/soudan-midform/hook-or-darfour-VALIDE.mp4` · catbox `inys9z`. 23s, plein format.
- Contenu final : VO GéoAfrique V3 (accroche reformulée, `public/_shared/audio/soudan/hook-or-darfour.mp3`) +
  colorisation synchro voix (whisper-align) : lingot or d'entrée → **pelle qui tombe NOIRE puis se peint**
  (3 bandes drapeau en fondu + manche VERT en dernier, ~f150-360) au mot "Darfour" → fumée+sang à "guerre"
  → traînée d'or à "Suivez L'OR" → cartouche "Où va cet or ?". Micro-anims : halo soleil pulse, scintillement
  or, braises. Drone banni retiré. Code : `soudan-hook/OrDarfourHook.tsx` + `orDarfourGroups.ts` (`hookPelle()`).

## 🎯 PROCHAINE ÉTAPE — CARTE SOUDAN via moteur AES adapté
1. **Décision carte = adapter `SahelWarMapEngine`** (référence = `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`).
   Principe visuel central gravé : [[WARMAP-GRAMMAIRE]] § sommaire "CONTOUR PERMANENT + INTÉRIEUR VIDE" ⭐⭐.
2. Audio Acte 2 à régénérer (périmé). Actes 3-4 non écrits.

## 🗺️ RÉUTILISATION MOTEUR AES → SOUDAN (cartographie code faite 2026-07-07 s2)
**Réutilisable TEL QUEL (générique)** : `reskinMap()` (Mapbox reskin parchemin), projection `map.project`+jumpTo
frame-driven (1 Map continue), couche `sahel-fill`+`controlAt` (DATA-DRIVEN, pointe déjà sur `sudan.warmap.json`
via `sudanControlData.ts`), composant jeton (div rond+sprite, taille px FIXE 58px ≠ ancrée degrés → NE GROSSIT PAS),
`SahelAttackArrow`/`TerritorialExpansion`/`RefugeeFlow`/`WarMapBanner`/`WarMapDimmedOverlay`/`WarMapSplitScreen`,
schema/adapter données. **À ADAPTER (hardcodé Sahel)** : couleurs (`SAHEL_COLORS`/`SAHEL_COUNTRY_COLORS`), chemins
geojson en dur (`:477` sahel-admin1, `:560` sahel-countries), TOUS les camKeys (`SahelCameras.ts`), acteurs/waypoints
(`SahelActors.ts`), triggers frames (`SahelTimings.ts`), narration+SFX, les `<PartieX>`. **BLOCAGES** : (a)
`sudan-states.geojson` n'a que `name` (pas `country`) → sous-système multi-pays (fusion byCountry, contours nationaux
par pays) à NEUTRALISER (Soudan = 1 pays) ; (b) pas de `sudan-countries.geojson` ; (c) toute la choré narrative est
en frames LITTÉRALES forced-aligned (pas dans le dataset) → réécriture sur le script Soudan. Pas de couplage ACLED runtime.
- Jetons : **portraits-visage petits** (Hemeti/Burhan/civils, `portrait-{rsf,saf,civil}.png` déjà là). Règle densité [[WARMAP-INSERT-SVG-ETATMAJOR]].

---

## ✅ FAIT (validé Aziz)

- **Prototype insert `KhartoumEtatMajorSVG`** entièrement validé (registre médaillon d'état-major SVG
  pur, PAS Mapbox). Render : `out/_rnd/khartoum-etatmajor-svg/versions/khartoum-etatmajor-PROTOTYPE-VALIDE.mp4`
  · catbox `https://files.catbox.moe/t96in1.mp4`.
- Contenu final : fond recomposé (terrain+Nil+3 bâtiments topdown) · formation de 4 portraits RSF qui
  avancent (mouvement organique + poussière) · impacts onde de choc · fumée post-impact · statut
  capturée (bâtiment semi-transparent + sceau R) · 4 phases + sous-titres.
- **Doctrine + workflow réutilisable écrits** : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md` ⭐.
  C'est notre manière de faire les inserts « carte de guerre / prise de territoire » en SVG.
- Assets R&D consolidés dans `out/_rnd/khartoum-etatmajor-svg/` (SVG sources + DECODE-NOTES + fx-demo).

## ✅ FAIT (2026-07-06, suite) — MOTEUR D'AFFRONTEMENT 2 FACTIONS + 2 variantes (validé Aziz)

> ⚠️ Correction d'un malentendu : le prototype Khartoum n'a JAMAIS eu de place dans le storyboard
> (pas de beat #5 « attaque Khartoum » écrit, pas de voix off) — c'était un proto de R&D, normal
> qu'il ne « s'assemble » nulle part. On est en **mode croissance du moteur d'insert**, pas en montage.

- **Moteur réutilisable** : `src/projects/warmap/_shared/warmapChoc.tsx` — système `Faction` paramétré
  (RSF/SAF = 2 instances, jamais de « R »/« S » en dur), formations qui avancent/tiennent/reculent,
  `ClashSparks` (le choc), `FrontArc` (front qui recule), `SweepZone` (zone qui se remplit), sceaux
  capture/défaite, effets recolorables. Frame-driven pur. C'est la base du futur `WarMapInsert` paramétré.
- **Variante A `KhartoumChocSVG`** (compo Root) : RSF assaut, SAF défend le palais, choc au front,
  bascule accentuée (SAF submergée, RSF recouvre physiquement le palais). Render : `out/_rnd/warmap-choc/
  khartoum-choc-v3.mp4` · catbox `https://files.catbox.moe/2psuqm.mp4`.
- **Variante B `FrontOuvertSVG`** (compo Root) : 2 zones teintées, ligne de front sinueuse qui tient
  (impasse) puis cède par un point de rupture. **Brique directe pour l'Acte 2 Soudan** (impasse
  militaire). Render : `out/_rnd/warmap-choc/front-ouvert-v2.mp4` · catbox `https://files.catbox.moe/hihedl.mp4`.
- Commit `351514e` sur branche `feat/warmap-insert-2factions`.
- Bug trouvé+corrigé en self-review : v1 de A avait une « téléportation » (colonne n'atteignait jamais
  la cible, capture sur compteur) → corrigé (la colonne arrive vraiment au contact).
- Doctrine amendée : portrait rond OK en insert zoomé (`WARMAP-INSERT-SVG-ETATMAJOR.md` § RÈGLE ENRICHIE).

## 🎬 NEXT (prochaine session Soudan)

- **Variante B → ré-habiller quand on écrira l'Acte 2** (impasse militaire) — INTENTION d'abord, pas
  toucher au moteur avant d'avoir le script. Elle est prête comme brique prouvée.
- **Pistes d'extension du moteur en backlog** (à faire sur un vrai beat, PAS en anticipation) :
  flèches de manœuvre (`fleche_manoeuvre` en stock doctrine, pas encore codée), zones qui se remplissent
  plus poussées, généraliser en composant paramétré `WarMapInsert {fond, cibles, faction, séquence}`,
  puis `/beat`-like insert SVG. ⛔ Ne PAS généraliser en `WarMapInsert` avant d'avoir 2-3 vrais cas
  (sinon on fige l'API sur un seul usage).
- Reste aussi les jetons/effets en stock non tous exploités (cf `svg-library/elements/militaire/`).

## ⚠️ Points d'attention

- Le fichier `khartoum-impact-batiment-glm-A-CORRIGER.json` a un bug de halo connu (non utilisé dans le
  proto final — le proto utilise ses propres effets). Ne pas le reprendre sans corriger.
- Ne PAS repartir sur Mapbox pour cet insert (piste écartée, cf DECODE-NOTES.md).

## 📁 Où retrouver

- Code : `src/projects/warmap/KhartoumEtatMajorSVG.tsx` (compo Remotion `KhartoumEtatMajorSVG`).
- Effets R&D : `src/projects/warmap/_rnd/KhartoumFxDemo.tsx` (compo `KhartoumFxDemo`).
- Doctrine/workflow : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`.
- Décodage/méthode : `out/_rnd/khartoum-etatmajor-svg/DECODE-NOTES.md`.
