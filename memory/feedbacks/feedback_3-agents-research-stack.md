# 3-agents paralleles - Recherche stack technique createurs

> Migré depuis auto-memory 2026-08-31 (validée 2026-04-30). Pattern réutilisable pour identifier
> les outils utilisés par des créateurs YouTube/SocMed avec convergence de 3 sources indépendantes.
> Cas d'application archivé : `memory/feedbacks/feedback_chaines-pro-cartographic-stack.md`.

> ROI : 30 min de recherche pour réponse fiable, évite des semaines d'itérations dans le mauvais outil.

## Quand utiliser ce pattern

**Trigger** : avant d'investir > 4h dans la reproduction d'un style visuel d'un créateur YouTube/Twitter/TikTok, **DOIT** identifier leur stack EXACTE.

**Pourquoi** : reproduire un style sans connaître les outils = itération aveugle qui peut coûter $50-500 + 20-100h pour finalement découvrir qu'on utilise le mauvais outil. Si on connaît la stack, on peut soit :
1. L'adopter directement
2. Choisir une alternative compatible avec notre stack code (Remotion)
3. Réaliser que c'est inaccessible et adapter notre vision

## Pattern : 3 agents parallèles + WebSearch dans `last30days`

**Agent 1 — `/last30days` skill** (signal engagement réel)
- Sonde Reddit + X + TikTok + Instagram + YouTube + HN sur 30 derniers jours
- Capture tendances actuelles + posts engagement (likes/upvotes signal)
- Best for : reveals récents, mentions outils, X posts créateurs

**Agent 2 — Deep search general-purpose** (sources convergentes)
- WebSearch + WebFetch sur tutoriels + blogs + articles
- Recherche multi-source : "Channel name how to make", "Channel name pipeline", "Channel name tools"
- Best for : confirmer via documentation officielle (aescripts, plugins payants) + interviews enregistrées + tutoriels détaillés

**Agent 3 — Reverse-engineer spécifique** (sources directes)
- Visite pages YouTube/Patreon/agence/Twitter de chaînes cibles
- Analyse crédits descriptions vidéos
- Cherche bio + about + section communauté (créateurs révèlent souvent en commentaires)
- Best for : trouver le créateur lui-même + son management/agence + son histoire personnelle

## Convergence = vérité vérifiable

**Règle** : ne valider une stack QUE si **3+ sources indépendantes convergent**.

Exemple GeoGlobeTales (2026-04-30, cf `memory/feedbacks/feedback_chaines-pro-cartographic-stack.md`) :
- last30days : @Kartik_ez X post explicite "GEOLAYERS 3 plugin used #aftereffects" (151 likes)
- Deep search : aescripts officiel "How Johnny Harris Makes Maps" + PremiumBeat interview
- Reverse-engineer : tutos communautaires "How to make videos like geoglobetales" pointent CapCut/AI/AE

= Convergence forte sur **After Effects + GEOlayers 3 + Google Earth Studio**.

## Anti-pattern : faire confiance à 1 source

**Erreur évitée** : si Gemini analyse une vidéo et dit "uses Google Earth Studio or Mapbox Satellite", c'est une **hypothèse** pas une **vérité**. Les modèles d'IA généralisent depuis training data, ils peuvent confondre 2 outils similaires.

**Toujours croiser avec :**
- Sources directes du créateur (Patreon, Twitter, podcast interviews)
- Tutoriels officiels du plugin/outil revendiqué
- Benchmark visuel côte-à-côte (le rendu match-il vraiment ?)

## Lancement parallèle optimisé

```python
# Pseudo-code Claude orchestrator
agents = [
    Skill("last30days", args="creator + stack + tools"),
    Agent("general-purpose", "Deep search blogs/tutorials/articles convergent sources"),
    Agent("general-purpose", "Reverse-engineer YouTube/Patreon pages + agency + bio"),
]
# Lance en parallele dans 1 message multi-tool
# Resultats arrivent en 2-5 min
# Synthese par Claude orchestrator
```

**Coût** : ~$0 (agents internes Claude, pas API externe payante).
**Temps** : 2-5 min agents + 15 min synthèse.

## Sortie attendue

Après synthèse, produire un **tableau d'outils précis** :

| Outil | Role | Cout | Compatible avec notre stack |
|-------|------|-----------|------------------------------|
| ... | ... | ... | ... |

Et un **verdict de stratégie** :
- Adopter le pipeline pro tel quel (coût/effort/temps)
- Choisir alternative gratuite ou code-friendly
- Adapter notre vision si pipeline pro inaccessible
