# Un gate jamais vu se déclencher est indiscernable d'un gate mort

**Date** : 2026-09-11 · **Coût mesuré** : 7 787 o (31 % de PIPELINE.md) accumulés pendant
4 à 6 semaines sans une seule alerte.

## Ce qui s'est passé

`check-poids-contexte.py` porte une fonction `sections_closes()` censée signaler les projets
terminés qui traînent dans les fichiers d'action. Elle testait :

```python
if line.startswith("## ") and any(m in line for m in MARQUEURS_CLOS):
```

`"### "` **ne commence pas** par `"## "` — le 3e caractère est un `#`, pas une espace. Or dans
`PIPELINE.md` toutes les sections de projet sont en `###`. La fonction renvoyait donc une liste
vide sur un fichier qui contenait **7 sections closes**, dont certaines depuis le 31 juillet.

Pendant ce temps le fichier a grossi (+2 092 o en 4 jours) en accumulant une 8e section close.
La règle d'éviction existait, écrite dans le préambule du fichier lui-même. Le gate existait et
tournait à chaque démarrage. **L'instrument ne regardait simplement pas au bon niveau.**

## Pourquoi personne ne l'a vu

Un gate silencieux et un gate qui fonctionne produisent **exactement la même sortie** : rien.
Rien ne distingue « il n'y a pas de problème » de « je ne sais pas voir le problème ».

C'est le même schéma que [[tester-le-script-nest-pas-tester-le-branchement]], pris par l'autre
bout : là, le script marchait et le branchement manquait. Ici le branchement était bon, et c'est
la **condition** qui ne pouvait jamais être vraie.

## La règle

**Un gate n'est validé que par un cas réel sur lequel on l'a VU se déclencher.**

Concrètement, à chaque gate écrit ou modifié :

1. Le lancer sur un fichier **qui contient le problème** → il doit le trouver.
2. Le lancer sur un fichier **qui ne le contient pas** → il doit rester muet.
3. Garder la sauvegarde du cas positif (`/tmp/<fichier>-avant.md`) pour rejouer le test.

Un gate testé uniquement sur l'état courant — forcément sain, sinon on l'aurait corrigé — ne
prouve rien du tout.

## Corollaire : se méfier d'un gate qui n'a jamais rien dit

Un gate qui n'a jamais produit d'alerte depuis sa création est **suspect**, pas rassurant.
Lui fabriquer un cas positif, ou aller chercher dans git une version du fichier qui portait le
problème, et vérifier qu'il le voit.

Vaut aussi pour les seuils : voir [[mesurer-la-bonne-grandeur-pas-la-plus-facile]] — un plafond
que le code applique plus laxiste que la politique est un plafond qui n'existe pas.
