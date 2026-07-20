---
name: soudan-midform-ACTE3-JURY-VERDICTS
description: Verdicts complets du jury LLM 3 modèles (GPT-5.5, Gemini 3.1 Pro, Kimi K2.5) sur le script v4 de l'Acte 3 Soudan. Trace brute, référence si besoin de revoir le détail d'un argument.
metadata:
  type: project
---

# JURY LLM — ACTE 3 SOUDAN v4 (2026-07-09)

> Script évalué : v4 (voir historique git de [[soudan-midform-ACTE3-SCRIPT]]). Décisions retenues déjà
> appliquées au script v5 — ce fichier est la trace brute, pas à relire sauf besoin de détail.

## Convergences (3/3 modèles)
- Hook beat 1 + structure globale solides, aucun ne remet en cause l'architecture.
- Beat 5 (mer Rouge) = trou show-don't-tell : "influence stratégique" non montrée. → Fix retenu : Suakin.
- Beat 6 : phrase méta-textuelle "voici deux camps qu'on oppose" à couper/reformuler.
- Beat 5bis fragile : lecture ambiguë "déplacement interne" vs "vente hors circuit".

## Divergences (idées uniques par modèle, toutes retenues au moins partiellement en v5)
- **Gemini** : Suakin comme ancrage géo-historique réel pour l'influence turque (retenu).
- **GPT-5.5** : specs détaillées `GeoFlowConnection` (props complètes) ; incohérence "trois trajets" vs
  4 flux réels au beat 6 (relevé et corrigé) ; réécriture alternative complète des beats (non retenue,
  le squelette v4 jugé bon par Aziz).
- **Kimi K2.5** : marqueur unique qui se transforme (retenu) ; risque whiplash spatial beat 1 (retenu,
  fix lignes de fuite) ; segmentation beat 3 sur la distance Darfour→Dubaï (noté pour le breakdown,
  pas encore tranché en détail visuel).

## Détail complet des 3 réponses
Conservé dans les transcripts agents de la session 2026-07-09 (branche `feat/soudan-acte3`). Si le détail
exact d'un argument est nécessaire au-delà du résumé ci-dessus, relancer un jury frais sur le script v5
plutôt que d'essayer de retrouver les transcripts (coût faible, fraîcheur garantie).

---

## FACT-CHECK FINAL v5 (2026-07-09, Sonar Pro + Tavily croisés)

> Avant verrouillage définitif, chaque affirmation factuelle du script re-vérifiée sur sources 2025-2026.
> Méthode : Sonar Pro (rapide) + Tavily (sources primaires) en parallèle, convergence = fait sûr.

| Affirmation | Sonar Pro | Tavily (sources primaires) | Verdict retenu |
|---|---|---|---|
| Jebel Amer/Al Junaid contrôlé par famille Hemedti, ~1Md$ | Nuancé (chiffre non trouvé) | **Confirmé** — liste sanctions UE 2024/384, Reuters, Chatham House, Global Witness | GARDÉ — sources primaires fortes |
| EAU 1er importateur or africain | VRAI | VRAI — DW nov.2025, AFP/L'Express (90% or soudanais → EAU) | CONFIRMÉ double source |
| Drones Wing Loong/Sunflower-200, Amnesty, via EAU | "Non vérifiable" (Sonar a raté la source) | **Confirmé directement sur amnesty.org** (rapport mai 2025) + Arab News fév.2026 | GARDÉ — Sonar a une lacune de recherche, pas le fait |
| Bayraktar Turquie 2023, ~120M$ | "Douteux, non trouvé" | **Confirmé 4 sources indépendantes** : Washington Post (via Turkish Minute), ADF, Euronews, Fair Observer — contrat daté 16 nov. 2023, 6-8 TB2 + 600 têtes | GARDÉ, solidement sourcé |
| Suakin, bail 99 ans, démenti "base militaire" | VRAI | VRAI | CONFIRMÉ double source |
| Or SAF hors-circuit "depuis Port-Soudan" | Nuancé (confirme "les 2 camps" mais pas Port-Soudan précisément) | **CORRECTION** : Chatham House + African Gold Report + Soufan Center + Beam Reports convergent — destination principale = **ÉGYPTE** (~60% production Nord/Nil/Mer Rouge, 46-60t depuis 2023), pas "Port-Soudan" comme terminus. Beaucoup de cet or est ensuite ré-exporté vers Dubaï depuis l'Égypte. | **SCRIPT CORRIGÉ** (beat 5bis v5 : trajet SAF→Égypte, pas SAF→Port-Soudan→est) |

**Incident sécurité pendant ce fact-check** : l'agent Sonar Pro a exposé la clé OPENROUTER_API_KEY en clair
dans une commande bash (au lieu de la lire dynamiquement). `.env` non touché par git (pas de fuite dans le
repo), mais la clé a transité en clair dans les logs de session. **Recommandation : faire tourner (rotate)
la clé OpenRouter par précaution.**

Liens : [[soudan-midform-ACTE3-SCRIPT]] · [[soudan-midform-ACTE3-NOTE-ACTEURS-EXTERNES]] · [[RECHERCHE-PRESCRIPT-UNIFIEE]].
