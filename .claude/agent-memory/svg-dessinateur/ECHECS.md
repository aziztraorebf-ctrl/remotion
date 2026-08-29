# ⛔ ÉCHECS — lire AVANT de tenter

> Chaque entrée décrit le SYMPTÔME VISUEL exact, pas une impression.
> But : ne jamais repayer une tentative déjà perdue.

## ⛔⛔ ANATOMIE HUMAINE — 5 modèles sur 5 échouent SANS RÉFÉRENCE (2026-08-28)

> ⚠️ **Portée du verdict PRÉCISÉE le 2026-08-28 (soir)** : ces 5 échecs valent **SANS image de
> référence uniquement**. Avec une référence visuelle dans le brief, le registre main-curseur a été
> DESSINÉ avec succès (3 poses, validées au rendu contre la référence) — cf. `TECHNIQUES.md`
> § « Anatomie AVEC référence ». La question ouverte est TRANCHÉE : avec image-ref on exécute,
> sans image on ne trouve pas la forme.

**Protocole** : test à l'aveugle, planches anonymisées, clé scellée avant jugement.
Brief détaillé, pièges explicitement nommés, consigne d'empilement incluse.
**Modèles** : Gemini 3.1 Pro · GPT-5.6 Sol · Kimi K3 · Grok 4.6 · GLM-5.2.

| Registre | Résultat |
|---|---|
| Objets d'interface | ✅ 5/5 réussissent |
| **Main humaine (3 poses)** | ⛔ **5/5 échouent** |

**Symptômes visuels, systématiques d'un modèle à l'autre :**
- la paume est un **rectangle** — elle se lit comme une manche, pas comme une main
- les doigts repliés forment une **grappe de bulles** au lieu de trois arcs distincts
- le **poignet est coupé net**, sans raccord
- le **pouce est une forme rapportée** posée à côté, il flotte
- une planche a même un **index qui se plie à l'envers**

⚠️ **Deux planches avaient PLUS de formes que les autres sans être meilleures.**
Le volume ne compense pas une anatomie fausse — la consigne d'empilement ne sauve pas ce registre.

⛔ **Correction d'une attente** : GPT-5.6 Sol est le champion documenté de l'organique (il avait
réussi un visage de pêcheur là où les autres échouaient). **Il a produit une des pires mains.**
« Bon sur les visages » ≠ « bon sur les mains ».

**→ Que faire à la place** : prendre une pièce de banque et la restructurer.
Mode opératoire : `memory/tools/banques-lottie-et-greffe.md` (la géométrie est en clair dans
le `.lottie`, l'extraction est triviale). Résultat : préféré par Aziz contre les 5 modèles,
et **plus léger** (1 chemin continu contre 52 à 139 formes).

✅ **Question TRANCHÉE (2026-08-28, main-curseur avec référence)** : avec une image de référence,
le registre SE DESSINE — succès en 3 itérations, aucun des 5 symptômes ci-dessus au rendu final
(`out/_r-and-d/concours-svg-ui/main-avec-ref/fable.svg`). Méthode : `TECHNIQUES.md` § « Anatomie
AVEC référence ». ⚠️ Les 2 pièges rencontrés EN COURS de route (ils reviendront) :
- **la vallée pouce-index mangée par le trait** : un écart de ~5 unités entre deux parois est
  entièrement absorbé par un stroke de 7 → fente noire, lit comme une craquelure. Garantir ≥12
  unités entre parois parallèles avant stroke.
- **la paume qui s'allonge toute seule** : sans mesure, le poing sort plus haut que large (0,9:1) ;
  la référence est PLUS LARGE que haute (~1,2-1,35:1). Mesurer le ratio du poing, pas l'impression.
Le verdict « 5/5 échouent » reste ENTIER pour toute anatomie **sans** référence : dans ce cas,
greffe de banque, pas de génération.

## ⛔ Dessiner à la main dans le code (l'erreur de l'orchestrateur, 2026-08-28)

Symptôme : tous les objets en **aplats de couleur**, une forme par objet, là où la référence a
des dégradés et ~10 formes empilées. Cause : les formes avaient été écrites au clavier en JSX
au lieu d'être dessinées. **L'aplat généralisé est le symptôme visuel de cette erreur.**
→ `memory/feedbacks/feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable.md`
