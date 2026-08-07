# Prototype souris virtuelle — validé (2026-08-07)

> Test demandé par Aziz avant d'écrire la spec définitive : la souris virtuelle qui se promène
> sur le dashboard pendant P4/P5 rend-elle bien à l'échelle réelle ?

## Verdict : VALIDÉ

Rendu 90 frames (3s) testé : curseur entre depuis le coin haut-droit, trajet en easing cubique
vers le badge "Autorisé" de la ligne Sarah (highlighted), clic avec ripple animé (anneau cyan qui
grossit et s'estompe).

**Ça marche** : le curseur (forme flat/géométrique, cohérente avec le reste de l'UI — pas un
curseur OS réaliste) se lit bien à 1920×1080, le trajet est fluide, le ripple de clic est visible
et lisible sur les 3 frames inspectées (avant/pendant/après clic).

**2 bugs trouvés et corrigés en cours de route** :
1. L'anneau de clic (v1) était invisible au rendu — positionné en négatif hors du conteneur du
   curseur. Corrigé : ancré sur la pointe du curseur (coordonnée 2,2 du viewBox), taille/opacité
   animées via `clickProgress`.
2. La destination du trajet (v1) n'atterrissait pas sur un élément précis. Corrigé : cible
   maintenant le centre exact du badge `ActionPill` (x=1443, y=690 pour le cas bas-risque).

## Fichiers créés

- `src/projects/_client-sim/noteshield/ui/VirtualCursor.tsx` — composant curseur réutilisable,
  props `x`, `y`, `clicking`, `clickProgress`.
- `src/projects/_client-sim/noteshield/ui/CursorTestComp.tsx` — composition de test (90 frames,
  `NorthShield-Cursor-Test` dans Root.tsx). À garder ou supprimer selon si on veut ce harnais de
  test pour la suite (utile pour retester une variante de trajet sans re-coder toute la scène
  finale).

## Décision

Le curseur est intégré au plan d'animation P4/P5 (voir page storyboard retenu). Reste à trancher
au moment du codage final :
- Le trajet exact par panneau (P4 : survole/clique sur la ligne Sarah bas-risque ; P5 : peut-être
  un 2e clic après la bascule vers le cas haut-risque, ou un simple survol sans clic pour ne pas
  surcharger un panneau déjà dense en changements).
- SFX de clic — pas encore ajouté à ce prototype (demande explicite d'Aziz : "peuvent venir
  après"). Banque SFX du projet : `_shared/sfx/` — chercher un clic UI discret, pas un clic
  mécanique bruyant (registre "premium silencieux", cohérent avec le ton NorthShield).
