# Starter Prompt — Refactor Vague 1 Short → 16:9 natif

> **STATUT : COMPLET — 2026-05-22**
> 18 templates refactorés, ProtoR showcase rendu et validé.
> Render : https://files.catbox.moe/40lmi9.mp4
> Commit : `refactor(vague1): 18 templates Short→16:9 natif + ProtoR showcase`

> Colle le bloc ci-dessous dans Claude Code au démarrage de la session.

---

## PROMPT À COLLER

```
Refactor Vague 1 — Templates Short → 16:9 natif.

AVANT D'AGIR — lire dans cet ordre :
1. memory/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/plan-vague1-refactor-16-9.md (plan complet, 3 niveaux)
2. memory/CATALOGUE-GEMINI.md (état actuel du catalogue — à mettre à jour en fin de session)
3. public/_shared/ASSETS-INDEX.md section "Vague 1" (documentation actuelle des templates)

CONTEXTE :
17 templates ont été conçus pour YouTube Short (9:16, 1080×1920). Ils ont déjà été refactorés
pour avoir bgColor="transparent" et useVideoConfig(). Il reste une seule chose à faire :
remplacer les constantes et coordonnées hardcodées 1080/1920 par des valeurs dérivées de
useVideoConfig().width/height, et revoir les compositions pour qu'elles respirent en 16:9.

ÉTAT DES TEMPLATES (ce qui existe dans src/projects/_shared/components/layouts/) :
- Niveau 1 (30min/each) : ScaleShock, Timeline, IconStat, OdometerFlip, CoinFlip, GlitchReveal, RadarScan
- Niveau 2 (1-2h/each) : BarRace, StackedBars, PulseNumber, RadarPing, ProcessFlow, TimelineFracture, SplitFlap
- Niveau 3 (2-4h/each) : NetworkGraph, IconGrid, ShatterReform, BurnReveal

ORDRE D'ATTAQUE (ne pas dévier sans raison) :
1. Tous les Niveau 1 d'abord — gains immédiats, 7 templates
2. Niveau 2 prioritaires : Timeline (déjà Niveau 1 en réalité), BarRace, StackedBars, ProcessFlow
3. Niveau 2 restants : PulseNumber, RadarPing, TimelineFracture, SplitFlap
4. Niveau 3 si temps : NetworkGraph en priorité (le plus puissant visuellement)

RÈGLES DE REFACTOR (NON-NEGOTIABLE) :
- JAMAIS supprimer ou modifier les props existantes — tout ajout doit être rétrocompatible
- const { width, height, fps } = useVideoConfig() — toujours déstructurer en haut du composant
- viewBox="0 0 1080 1920" → viewBox={`0 0 ${width} ${height}`}
- Constantes hardcodées : const H = 1920 → const { height } = useVideoConfig()
- Les ratios relatifs restent des ratios : BARS_BOTTOM_Y = 1920 - 1560 → height * 0.81
- Ne PAS changer la typographie, les couleurs, les timings d'animation — seulement le layout
- Après chaque template : render rapide dans Remotion Studio pour vérifier visuellement en 16:9

POUR CHAQUE TEMPLATE — workflow :
1. Lire le fichier .tsx, identifier TOUS les hardcodes 1080/1920
2. Faire les remplacements
3. Vérifier dans Remotion Studio (composition Template-XXX doit exister dans Root.tsx)
4. Si la composition n'existe pas encore en 16:9 : ajouter dans Root.tsx avec width=1920 height=1080
5. Render PNG (frame 50% de la durée) → review visuelle rapide
6. Passer au suivant

VALIDATION DE FIN DE SESSION :
1. Créer ProtoR-Vague1-16-9-Showcase.tsx — showcase de tous les templates refactorés
   (même pattern que ProtoQ : N templates × 270f, label en bas)
2. Render + upload catbox/imgur
3. Mettre à jour CATALOGUE-GEMINI.md : chaque template Niveau 1 passe de
   "Format : 16:9 | ..." à "Format : 16:9 natif (refactoré Short→16:9)"
4. Mettre à jour ASSETS-INDEX.md si les durées ou compositions changent
5. Commit propre

CONTEXTE TECHNIQUE :
- Palette : #1a2535 navy, #c8a951 gold, #f2ebd9 ivory, #4a9eff bleu analytique, #e63946 rouge urgence
- Typo : IBM Plex Mono (+ Bebas Neue pour certains templates existants — ne pas changer)
- Tailwind 3.4 installé — tokens text-gold / text-ivory / bg-navy disponibles
- Remotion : spring() + interpolate(), ZERO Math.random() dans les animations frame-dépendantes
- Backgrounds : SouverainScene + DarkCssBg ("dark-dots-navy" | "slate-medium" | "kraft-dark")
- Root.tsx : les compositions Niveau 1 sont enregistrées comme Layout-XXX (Short).
  Pour la version 16:9 : enregistrer en PLUS comme Template-XXX (1920×1080), sans supprimer l'ancienne.

IMPORTANT — ne pas tout faire en une fois :
Render + review après chaque template, pas à la fin du lot.
Un template cassé visuellement en 16:9 = temps perdu si on réalise 5 templates plus tard.

PREMIÈRE ACTION :
Lire ScaleShock.tsx, vérifier qu'il n'y a rien à changer, faire le render en 16:9 pour confirmer.
C'est le template le plus simple — il sert de calibration pour le reste de la session.
```

---

## NOTES DE CONTEXTE

**Pourquoi ce refactor maintenant :**
Phase 3 Templates 16:9 est COMPLETE (~40 templates natifs). Mais les 17 templates Vague 1 conçus
pour Short sont toujours calibrés portrait. Aziz veut une bibliothèque 100% compatible mid-form
pour pouvoir passer le CATALOGUE-GEMINI complet à Gemini sans exceptions.

**Ce qui a déjà été fait (ne pas refaire) :**
- bgColor="transparent" avec prop optionnelle : FAIT sur tous les 17
- useVideoConfig() importé : FAIT sur tous les 17
- Tailwind refactor (suppression styles inline couleurs/typo) : FAIT sur tous les 17

**Ce qui reste uniquement :**
- Remplacer les constantes/viewBox hardcodées 1080/1920
- Vérifier que la composition visuelle est équilibrée en format landscape

**Cas particuliers documentés :**
- NetworkGraph : `const W=1080; H=1920` utilisés pour calculer XY de chaque nœud →
  les positions des nœuds sont pour un espace portrait. En 16:9 recalculer les angles
  (nœuds doivent s'étaler en largeur, pas en hauteur). C'est le plus complexe — Niveau 3.
- GlitchReveal : utilise déjà `const { fps, width, height } = useVideoConfig()` →
  seul fix = `scanlineTop = (frame * 18) % height` au lieu de `% 1920`. Quasi gratuit.
- TimelineFracture : `const HALF_LINE = 540` = moitié de 1080 (largeur Short) →
  en 16:9 doit devenir `width / 2`. Fix en 2 lignes.

**Showcase final attendu :**
ProtoR-Vague1-16-9-Showcase.tsx dans src/projects/_proto-16-9/
Enregistré dans Root.tsx comme ProtoR-Vague1-16-9-Showcase (durée = N templates × 270f)
