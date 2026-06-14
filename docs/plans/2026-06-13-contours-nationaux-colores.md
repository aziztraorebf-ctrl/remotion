# Plan — Contours nationaux colorés (transversal Acte1 → P4)

> Branche : `feat/da-brief-gate-warmap-sahel` (courante).
> Validé Aziz 2026-06-13. Principe prouvé via `SahelCountryBordersTest` (catbox 4m4bpv).

## Décision validée

- **3 contours nationaux colorés, 1 ton/pays** : Mali `#D98A3D` (ocre), Burkina `#C0553C` (brique), Niger `#4E8C7D` (sarcelle). Définis dans `SahelControlData.ts` → `SAHEL_COUNTRY_COLORS`.
- **Carte épurée conservée** (fond actuel = base). Pas de mosaïque pleine, pas de quadrillage interne.
- **Présence PERMANENTE** sur toutes les parties, avec **respiration douce** (visibles en lecture, atténués en action des jetons, jamais disparus).
- **Acte 1** : draw-in (le contour se dessine) + pulse quand la voix nomme le pays.
- **P1→P4** : contours permanents + pulse aux **moments clés** de chaque pays.

## Triggers (frames absolues, fps=30)

### Acte 1 — draw-in + pulse (déjà câblés)
- Mali f150 · Burkina f231 · Niger f301 (constantes `F_HOOK_*` / `A1.*`).

### Mentions/moments clés (depuis narration-v5-alignment.json)
| Frame | Pays | Contexte |
|---|---|---|
| f1324 | MLI | "Mali," |
| f1360 | BFA | "Burkina" |
| f1689 | NER | "Niger." |
| f2442 | MLI | "Mali" |
| f3723 | MLI | "Mali." |
| f4858 | MLI | "Mali." |
| f4976 | BFA | "Burkina" |
| f5380 | NER | "Niger" |
| f6255 | NER | "Niger" (P3) |
| f7083 | MLI | "Kidal." (P3 — Mali) |
| f7240 | MLI | "malien." |
| f8117 | MLI | "malien" |
| f8158 | MLI | "Kidal." |
| f10709 | MLI | "Mali" (P4) |
| f10729 | BFA | "Burkina" (P4) |
| f10851 | NER | "Niger." (P4) |

## Étapes

1. **Composant réutilisable** : extraire le rendu SVG des contours nationaux (déjà prototypé dans `countryBordersTest`) en bloc activable sur TOUS les modes finaux (pas juste le test). Gate : `isFinalLook` (Acte1/P1/P2/P3/P4).
   - Permanent : trait coloré net + respiration d'opacité.
   - Draw-in : seulement en Acte 1, par pays, sur la 1ère mention.
   - Pulse : table de triggers `{frame, country}` → glow qui bat.

2. **Table de pulses** : constante `COUNTRY_PULSES: {f:number, c:"MLI"|"BFA"|"NER"}[]` (depuis le tableau ci-dessus). Fonction `countryPulseAt(country, frame)` → 0..1.

3. **Respiration** : `countryBorderBreathe(frame)` par partie (réutilise les fenêtres action/lecture déjà connues : P3 = courbe validée). Pour Acte1/P1/P2 : courbe simple (haute en transition, basse en action jetons).

4. **NE PAS toucher** au fill/jetons existants. Les contours s'ajoutent par-dessus, sous les panneaux narratifs (z-order : au-dessus carte, sous overlays texte — à vérifier au render).

5. **Validation** : render court de chaque partie (Acte1 ouverture f120-360, P1, P2, P3 install) en scale 0.5 → jugement cohérence d'ensemble Aziz → PUIS renders full HD finaux.

## Garde-fous
- Headless-safe : SVG par-dessus le grain, jamais `filter:blur` CSS (glow = épaisseur+opacité superposées).
- `map.project()` par frame (caméra bouge) → recalcul des paths comme `frontPaths`.
- Respiration : ne jamais descendre à 0 (rester un repère permanent).
- P3-FINAL reste intact tant qu'Aziz n'a pas validé l'intégration.
