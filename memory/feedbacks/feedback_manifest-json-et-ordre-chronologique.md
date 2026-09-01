---
name: Manifest JSON obligatoire + ordre chronologique
description: Toujours creer un manifest JSON comme roadmap avant de produire des clips, et travailler scene par scene dans l'ordre chronologique du script.
type: feedback
---

Migré depuis auto-memory 2026-08-31.

## Regle 1 : Manifest JSON = source de verite (NON-NEGOTIABLE)

Avant de commencer toute production de clips pour un Short, creer un manifest JSON qui devient la roadmap unique. Le manifest liste chaque scene avec : numero, titre, duree, timing audio, type (action/narratif/contemplatif), etat (todo/in-progress/done), asset path.

**Why** : Sur Soundjata, l'absence de manifest clair a cause des clips eparpilles, de la confusion sur l'etat de chaque Acte, et 2 tentatives Acte II gaspillees ($5.44). Le manifest dans `soundjata-clip-plan.md` a resolu le probleme quand il a ete cree — mais trop tard.

**How to apply** : creer le manifest JSON DES le debut du projet, avant le premier clip. Le consulter a chaque session. Le mettre a jour immediatement quand un clip est valide.

## Regle 2 : Ordre chronologique strict (NON-NEGOTIABLE)

Produire les scenes dans l'ordre du script : Scene 1, puis Scene 2, puis Scene 3, etc. Ne pas sauter a une scene au milieu ou a la fin.

**Why** : Aziz et Claude se melangent quand les scenes sont produites dans le desordre. Ca complique la continuite visuelle, l'etat d'avancement ("est-ce que la scene X est faite ?"), et les ponts visuels entre scenes adjacentes.

**How to apply** : commencer par la Scene 1, la valider, puis passer a la Scene 2. Exception : si une scene est bloquee (manque de refs, probleme technique), documenter le blocage et passer a la suivante — mais revenir des que le blocage est leve.
