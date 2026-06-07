# PLAN VISUEL — ACTE 1 War-Map Sahel (0:00 → 1:16)

> Créé 2026-06-07. À VALIDER par Aziz avant travail autonome.
> Couvre f0 → f2299 (~76s). Frames exactes depuis forced-alignment narration-v1.
> Principe directeur : **séquentiel strict** (1-2 foyers max), **carte colorée dès le départ**,
> **zoom niveau hook** (~4.75, pas plus serré — validé Aziz), **carte qui respire**.

---

## RÉGLAGES GLOBAUX ACTE 1 (les 3 bugs corrigés)

| Bug signalé | Correction appliquée dans ce plan |
|---|---|
| Zoom trop serré (Kidal test) | **Zoom uniforme ~4.75** (niveau hook) sur tout l'Acte 1. On ne dépasse pas. |
| Cartouche latéral à droite inutile | **Cartouches narratifs au CENTRE**, semi-transparents, apparaissent / tiennent / disparaissent. |
| Taches rouges qui traînent | Zones JNIM/EIGS = **remplissage net de régions** (pas de halos flous permanents). L'expansion floue Act2 ne déborde PAS sur l'Acte 1. |

**Caméra Acte 1** : très peu de mouvement. Drift lent centré sur le cœur Mali-centre/Liptako.
- f0→f572 : centre Liptako (lon -0.5, lat 14.8), zoom 4.75 → 4.85 (hook)
- f572→f632 : FIGÉE (freeze "Comment est-ce possible ?")
- f632→f2299 : drift très doux vers le centre Mali/zones armées (lon -1.0, lat 15.0), zoom ~4.75

**HUD permanent Acte 1** : légende factions (haut-gauche) + cartouche date (haut-droite) + bandeau événement (bas). Comme Soudan.

---

## SÉQUENCE BEAT PAR BEAT

### BEAT 1 — HOOK : LA RUPTURE (f0 → f727) ~24s
Carte **colorée dès le départ** (contrôle territorial réel 2020), zoom hook, cœur Liptako.

| Frame | Mot | À L'ÉCRAN |
|---|---|---|
| f0 | "trois pays ont tout changé" | Carte colorée + **cartouche titre CENTRE** semi-transp « Tout a changé en trois ans / SAHEL / 2020—2026 » (tient 4s, disparaît). Drift lent. |
| f151 | "expulsé" | **Mali** : frontière nationale se trace en **doré + pulse fort** (1.5s) → identifie le pays cité. Boom SFX. |
| f231 | "Rompu" | **Burkina** : frontière dorée pulse. Boom. (Mali pulse retombe.) |
| f302 | "Quitté" | **Niger** : frontière dorée pulse. Boom. + **anneau CEDEAO** apparaît (englobe les 3). |
| f382 | "continent" | CEDEAO **néon qui grille** : 3 pulses orange → snap → gris cendre. SFX cedeao-snap. |
| f423 | "construit nouveau" | **3 flèches dorées** poussent des capitales → convergent Liptako. |
| f572 | "possible ?" | **FREEZE 2s** + **onde de choc dorée** Liptako + gong SFX + cartouche CENTRE « Comment est-ce possible ? » semi-transp. |
| f727 | "répondre" | Drift reprend. Cartouche disparaît. |

**Foyers simultanés max** : 1 pays pulsant à la fois (séquentiel strict). CEDEAO = 1 événement.

### BEAT 2 — TRANSITION : DEUX GROUPES (f727 → f1164) ~15s
| Frame | Mot | À L'ÉCRAN |
|---|---|---|
| f727 | "ce qui existait avant" | Carte calme, drift doux. Aucun nouvel élément (respiration). |
| f1014 | "deux groupes armés se sont développés" | Léger pré-signal : la carte se prépare (rien d'envahissant). |

### BEAT 3 — LE JNIM (f1164 → f1717) ~18s
| Frame | Mot | À L'ÉCRAN |
|---|---|---|
| f1164 | "Le premier... JNIM" | **Zone JNIM** (centre Mali + nord Burkina) : régions passent en **rouge terre #B14B3C** (remplissage net, frontière rouge qui se trace + pulse). |
| f1198 | "JNIM." | **Tampon CENTRE** semi-transp « JNIM · Al-Qaïda » (tient 4s, disparaît). |
| f1396 | "centre du Mali, nord du Burkina" | **1-2 véhicules JNIM réels** (Gemini, technical rouge top-down) patrouillent LENTEMENT dans la zone rouge. Villes Mopti/zone centre pulse discret. |

**Foyers** : zone rouge + tampon, puis zone rouge + véhicules. Jamais les deux tampons à la fois.

### BEAT 4 — L'EIGS (f1717 → f2167) ~15s
| Frame | Mot | À L'ÉCRAN |
|---|---|---|
| f1717 | "Le second... EIGS" | **Zone EIGS** (trois frontières + Tillabéri/NO Niger) : régions passent en **orange-brun** (remplissage net + frontière qui se trace). Tampon JNIM déjà disparu. |
| f1749 | "l'EIGS." | **Tampon CENTRE** « EIGS · Daesh » (tient 4s, disparaît). |
| f1815-1876 | "l'est... préfère" | **1-2 véhicules EIGS réels** (Gemini, technical orange-brun) patrouillent dans la zone orange. |

### BEAT 5 — CONFRONTATION (f2167 → f2299) ~4s — FIN ACTE 1
| Frame | Mot | À L'ÉCRAN |
|---|---|---|
| f2167 | "ils se combattent" | Les véhicules JNIM (rouge) et EIGS (orange) **se rapprochent** vers la frontière commune → **friction** (petit choc visuel, marching-ants sur la ligne de contact) → puis **reculent** chacun dans leur zone. SFX impact léger. |
| f2299 | "les voir séparément" | Véhicules **s'estompent** (fade 1s). Restent les 2 zones colorées distinctes (rouge / orange). **Figé 1s** sur les deux zones séparées. → fin Acte 1. |

---

## ASSETS À GÉNÉRER POUR L'ACTE 1 (Gemini — vrais véhicules Sahel)

| Asset | Description | Recette |
|---|---|---|
| **technical-jnim.png** | Pickup/technical top-down, couleur faction JNIM (rouge terre #B14B3C), drapeau noir discret | Gemini flash-image + recette top-down validée + Recraft removeBg |
| **technical-eigs.png** | Pickup/technical top-down, couleur EIGS (orange-brun), distinct du JNIM | idem |

> FAMa (char bleu), CSP (4x4 or), leaders, réfugiés = générés à leurs actes (2,3,4). PAS l'Acte 1.
> Recette : `memory/feedback_sprites-topdown-gemini-vs-recraft.md`. Fond cream #d4c29d → removeBg.

---

## TEMPLATES NOUVEAUX À CODER POUR L'ACTE 1

1. **Frontière qui se trace + pulse** (au mot exact, pays/zone cité) — doré sur fond coloré, blanc chaud si fond déjà or. Réutilisable toutes war-maps. (Idée Aziz.)
2. **Cartouche CENTRE semi-transparent** (apparaît / tient / disparaît) — remplace le cartouche latéral. (Idée Aziz.)
3. **Confrontation véhicules** (rapprochement → friction → recul) — f2167.

Déjà codé / réutilisé : SahelAttackArrow (flèches conv.), CEDEAO néon, allumage halo, SFX, musique loop.

---

## CE QUI N'APPARAÎT PAS DANS L'ACTE 1 (anti-overcharging)
- Pas de leaders (Acte 2), pas de réfugiés/jetons-visage (Acte 4), pas d'icônes ressources (Acte 4),
  pas de Kidal (Acte 3), pas de bases militaires (Acte 2), pas de flammes/embrasement (Acte 2).
- Villes affichées : UNIQUEMENT si citées dans l'Acte 1 (zone centre Mali). Séquentiel strict.

---

## LIVRABLE FIN DE SESSION
`out/episodes/warmap-sahel/wip/sahel_acte1_vN.mp4` (f0→f2299, ~76s, scale 0.5 pour itérer
puis full pour validation finale). Render via render-mapbox.sh. Validation Aziz.
