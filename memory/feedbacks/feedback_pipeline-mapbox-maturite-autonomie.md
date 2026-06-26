---
name: pipeline-mapbox-maturite-autonomie
description: Bilan maturité pipeline beat Mapbox (2026-06-03) — 2 portes Aziz incompressibles, self-review scriptée, Gemini consultatif, backlog GeoFlowConnection.
metadata:
  type: feedback
---

## Maturité du pipeline beat Mapbox (analyse 2026-06-03)

Après la session fill-pattern + Beat 3 (V1→V9) + corrections Beat 0/1, bilan de l'autonomie possible.

### Le découpage autonomie (2 portes Aziz incompressibles)
```
Phase 0 SCAN templates + Phase 1 RÉDIGE Production Brief  → AUTONOME
   ★ PORTE AZIZ #1 : valider le brief (choix de mise en scène : vue/zoom, statique/animé, texte ou non)
Phase 2 code → Phase 3 self-review → Phase 4 review Gemini → Phase 5 corrections  → AUTONOME
   ★ PORTE AZIZ #2 : valider le rendu final (goût : couleurs, glow, rythme, "donne envie")
```
Entre les 2 portes, Claude enchaîne tout seul. Les itérations TECHNIQUES sortent de la charge d'Aziz.

### Pourquoi les 2 portes ne s'automatiseront JAMAIS (et c'est sain)
- Phase 1 = décisions de réalisateur (ex. "vue monde plutôt que zoom", "drapeaux statiques", "pas de texte Démarrage 2026" — tous les bons choix de la session 2026-06-03 venaient d'Aziz, pas de Gemini).
- Phase 6 = goût subjectif + attraper ce qu'aucune checklist ne liste ENCORE (Aziz a attrapé les drapeaux approximatifs avant qu'on ait la règle).
- **Demander ces choix LE PLUS TÔT possible (Phase 1)** : aujourd'hui "vue monde" est arrivé tard → on a recodé. Au storyboard, même décision sans recoder.

### Gain chiffré
Beat "pays + ressource + acteurs + chiffres" = ~85% ASSEMBLAGE (briques : camCountryApproach + ResourceTextureFill + useClipFlags + GeoCountryPlaque). Beat 3 : V1→V9 aujourd'hui (briques créées en buttant), ~V2-V3 la prochaine fois. **MAIS seulement si Phase 0 SCAN est réellement exécutée** — un composant qu'on n'ouvre pas n'existe pas.

### 3 trous structurels identifiés + statut
1. **Gemini hallucine** (4/10 sur un bon Beat 3, croyait pull back = cut). → RÉGLÉ par règle "Gemini = signal jamais juge" (CLAUDE.md pipeline Mapbox phase 4). Max 1 appel, appliquer le VRAI, STOP, jamais de boucle.
2. **Async vs frame-driven** (lignes invisibles : filter:blur CSS + state centroïde async). → Classe de bugs. Partiellement couvert par self-review (W5 blur). Dériver les valeurs des bbox projetées plutôt que d'un state séparé.
3. **Tentation chemin facile** (dessiner un drapeau vs chercher l'image). → RÉGLÉ par self-review SCRIPTÉE (`scripts/tools/mapbox-selfreview.py`) : check EXTERNE, pas auto-évaluation. Un Claude qui écrit drawFlagCanvas se fait bloquer mécaniquement.

### Self-review scriptée (créée 2026-06-03)
`python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>` — phase 3 du pipeline, BLOQUANT (0 ERROR avant review Gemini).
5 ERROR : E1 SFX hors <Sequence>, E2 drawFlagCanvas appelé, E3 flyTo/easeTo, E5 image distante flagcdn/https. 5 WARN : blur CSS SVG, filtre 'name', outre-mer sans mainlandBox, etc.
Testé : les 3 beats Maroc validés passent (0 erreur), un cas volontairement cassé attrape 4 erreurs. Double sens vérifié.

### GeoFlowConnection — CODÉ 2026-06-03
`src/projects/_shared/mapbox/GeoFlowConnection.tsx`, headless-safe. Voir `feedback_mapanimation-veille-et-geoflow.md` pour le détail complet (route ville→ville qui se dessine, dashed doré + dash animé, city markers Spring Pop, sprite mobile orienté tangente, caméra-follow puis dézoom final). Référencé CATALOGUE-CARTE-VIVANTE section ROUTE/FLUX. [[sfx-sequence-et-drapeaux-reels]] [[philosophie-mapbox-puis-remotion]]
