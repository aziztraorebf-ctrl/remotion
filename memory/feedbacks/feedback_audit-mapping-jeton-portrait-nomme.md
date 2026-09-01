**Un jeton représentant une personne NOMMÉE (Hemedti, al-Burhan, Haftar, Poutine…) doit afficher son VRAI VISAGE partout où elle apparaît — pas le sprite FACTION générique.**

**Dérive typique (détectée + corrigée 2026-07-21, audit transversal Soudan mid-form) :** un composant `PortraitToken` ou un mapping `faction → sprite` (`{ rsf: "portrait-rsf", saf: "portrait-saf" }`) reste sur le sprite générique (soldat anonyme) même quand le jeton représente une personne nommée au script. Ça passe inaperçu car le générique "ressemble" à un portrait. Suspicion confirmée par Aziz : OK Actes 1-2, dérive dès Acte 3+ (l'Acte 3 Section1 ET Insert affichaient Hemedti/al-Burhan en `portrait-rsf`/`portrait-saf`).

**Why :** une personne nommée à l'oral mais représentée par un visage générique casse le lien nom↔visage que le spectateur construit — et sur un mid-form multi-actes, l'incohérence (vrai visage à l'Acte 1, générique à l'Acte 3) se remarque. Les vrais portraits existent (`public/_shared/sprites/warmap/portrait-hemeti.png`, `portrait-burhan.png`, `portrait-haftar.png`) — il suffit de rediriger le mapping.

**How to apply :** à chaque acte introduisant un personnage nommé sur jeton, GREP systématique :
```
grep -rn "portrait-rsf\|portrait-saf\|PortraitToken\|sprite:" <fichiers de l'acte>
```
Vérifier que chaque occurrence d'un personnage nommé pointe vers son fichier portrait DÉDIÉ, pas le fallback faction. ⚠️ Piège : le sprite peut être câblé en dur dans le composant (`staticFile(".../portrait-rsf.png")`) OU dans un objet mapping (`const PORTRAIT = { rsf: {...} }`) — chercher les deux. Les soldats/unités ANONYMES gardent légitimement le sprite faction (portrait-rsf/saf) : la règle vaut UNIQUEMENT pour les personnes nommées.

Corrigé Acte 3 : `SoudanActe3Section1Globe.tsx` (Hemedti), `SoudanActe3GlobeInsert.tsx` (mapping rsf/saf → hemeti/burhan), `SoudanActe3GlobeMinesProto.tsx`. Commit `8481e8b9`. Lié à [[feedback_geominirig-trio-visage-validation]] (barre de qualité portrait fidèle).
