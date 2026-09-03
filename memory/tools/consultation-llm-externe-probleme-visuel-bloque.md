# Consulter 3 LLM externes sur un problème visuel BLOQUÉ (pas pour décrire — pour DIAGNOSTIQUER)

> ⭐⭐⭐ Prouvé le 2026-09-03 (contrat Upwork chill-meter). Après **4 tentatives mesurées et
> échouées** en 2 jours sur un écart de matière, une consultation à 3 modèles a produit le
> diagnostic correct **en un appel**, et il ne ressemblait à aucune de nos 4 hypothèses.
> Idée d'Aziz : « pourquoi ne pas profiter de l'intelligence de nos modèles externes ? »

## ⛔ LA DISTINCTION QUI FAIT TOUT — décrire ≠ diagnostiquer

J'avais DÉJÀ lancé un breakdown 3 modèles le même jour, et il n'avait pas débloqué. Différence :

| | Breakdown (a peu servi) | Consultation (a débloqué) |
|---|---|---|
| Images envoyées | **SA référence seule** | **LES DEUX, côte à côte** |
| Question | « décris cette image » | « pourquoi la nôtre rate, comment vous feriez ? » |
| Contexte fourni | nos mesures | mesures **+ nos 4 échecs détaillés** |
| Résultat | des hex convergents (utiles mais insuffisants) | **la cause racine + la solution structurelle** |

⭐ **Un modèle ne peut pas diagnostiquer un écart s'il ne voit pas les deux termes de l'écart.**
Envoyer la cible seule, c'est demander une description ; envoyer la paire, c'est demander un
diagnostic. Coût identique.

## LA RECETTE

1. **Une planche 2 panneaux** (PIL, même hauteur, libellés en clair « LEFT: client reference /
   RIGHT: our render »). Pas 2 fichiers séparés : côte à côte dans UNE image.
2. **Donner nos mesures ET nos échecs**, chiffrés. « On a tenté X, mesuré Y, ça n'a rien changé »
   — c'est ce qui empêche le modèle de proposer ce qu'on a déjà éliminé, et **ça l'invite à
   réfuter notre hypothèse** (les 3 l'ont fait, à raison).
3. **Nommer la contrainte dure** (ici : ça doit rester du SVG animable, exporté en alpha) sinon
   la réponse sera « utilise une photo » / « fais-le en 3D ».
4. **Exiger du concret** : « hex values, filter parameters, numbers. "Make it cooler" is useless. »
5. **3 modèles en parallèle** (`openrouter-vision-breakdown.py` pour GPT/Grok + `gemini-vision-breakdown.py`).
   La CONVERGENCE est le signal : 3 modèles indépendants qui disent la même chose à 2-3 points
   près, ce n'est plus une opinion.
6. **Leur demander explicitement de challenger notre hypothèse** — question dédiée. C'est ce qui a
   évité une 5e tentative inutile (« réduire l'opacité de la rouille » était ma piste suivante,
   les 3 l'ont réfutée par avance).

## CE QUE ÇA A TROUVÉ, QUE NI MOI NI AZIZ N'AVIONS VU

⭐⭐⭐ **Nos MOYENNES étaient aveugles au défaut.** `max(RGB)-min(RGB)` ne distingue pas :
kaki (R≈G>B à luminance MOYENNE) · acier (R≈G≈B) · rouille (R>G>B, SOMBRE et PETIT).
**Même saturation moyenne, matériaux opposés.** D'où 3 passes de correction qui bougeaient les
chiffres sans changer l'image — je corrigeais une grandeur qui ne décrivait pas le problème.

Métrique conditionnelle utile à la place (GPT) :
`pixels où (R-B > 8) ET (luminance > 55) ET loin d'une arête/vis/joint`

Voir la synthèse complète du cas : `out/_r-and-d/chill-meter-upwork/breakdown-couleur/CONSULTATION-SYNTHESE.md`

## QUAND DÉCLENCHER
Dès **2 tentatives mesurées** qui échouent sur le même écart visuel — pas 4 comme ici. Le coût est
de 3 appels vision et ~10 minutes. Le protocole « déléguer à un agent au 2e échec » du CLAUDE.md
vaut aussi pour ça : ici l'agent interne travaillait déjà, mais il partait de MES hypothèses —
la consultation externe apporte ce qu'un agent interne ne peut pas, un regard qui ne partage pas
mon cadrage.

Lié : [[feedback_comparer-a-etat-egal-avant-d-attribuer-un-ecart]] ·
[[feedback_harnais-de-mesure-accuse-un-code-juste]] · [[feedback_chiffre-audit-relaye-sans-verification]]
