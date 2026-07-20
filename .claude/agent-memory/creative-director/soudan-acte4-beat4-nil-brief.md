---
name: soudan-acte4-beat4-nil-brief
description: Direction Brief indépendant — Acte 4 Soudan régie globale + proposition Beat 4 (Nil/Égypte), diagnostic du piège "concept abstrait sans geste cause-effet"
metadata:
  type: project
---

Diagnostic Acte 4 (script v5 verrouillé, 6 beats) : l'acte entier doit rester 100% carte Mapbox
continue (`SoudanWarMapEngine.tsx`), aucun beat ne relève du périmètre documenté de l'insert SVG
`KhartoumEtatMajorSVG` (réservé prise de territoire/assaut — cf. `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`
ligne "Quand PAS l'utiliser"). L'Acte 4 est de la géopolitique de flux (armes/argent/renseignement),
exactement le rôle du moteur carte existant.

Beat 4 (Nil/Égypte) confirmé comme le point à risque : code existant (`SoudanActe4.tsx` L376-434)
montre déjà un tracé du Nil qui pulse + un `NileFactPlaque` texte ajouté à côté — signe qu'un geste
visuel isolé n'a pas suffi et qu'une béquille textuelle a été rajoutée. C'est le même piège que le
concept B rejeté en Acte 3 Beat 1 ("2 cercles + une ligne sans contexte, ne raconte rien seul").

**Ma proposition (indépendante, pas de convergence recherchée avec l'autre agent en parallèle)** :
- Garder le tracé du Nil (asset déjà là, zéro nouveau coût) mais le faire pointer dans le sens du
  courant réel Soudan→Égypte (aval), pas un "pouls qui remonte" comme codé actuellement — le sens
  actuel est narrativement à l'envers par rapport à "l'Égypte redoute un événement en amont".
- Faire VACILLER le halo bleu du jeton SAF (déjà établi au Beat 3 immédiatement précédent comme "le
  camp soutenu par l'Égypte") au moment de "elle redoute de voir le Soudan basculer" — reprise directe
  et inversée du geste du Beat 3 (où ce même halo se renforçait). Cause (dépendance au Nil, déjà visible)
  → effet (peur = ce jeton spécifique vacille), sans inventer de nouveau signe abstrait.
- Retirer le `NileFactPlaque` texte : s'il faut un texte pour comprendre le geste, le geste est raté,
  pas le texte manquant.

**Pourquoi ce point est structurant** : la doctrine `WARMAP-INSERT-SVG-ETATMAJOR.md` documente
explicitement son périmètre (prise de territoire) — utile de re-vérifier ce fichier avant TOUT beat
futur "abstrait" (calcul stratégique, doctrine, alliance) qui pourrait tenter de basculer vers l'insert
SVG par facilité alors que Mapbox est le bon outil s'il y a un vrai lieu géo réel en jeu (ici : Nil,
Soudan, Égypte — tous réels et situables).

Voir aussi [[feedback_reutiliser-geste-etabli-plutot-que-nouveau-signe]] (à créer si le pattern se
confirme sur d'autres beats) — la règle générale semble être : pour un concept abstrait sur carte,
réutiliser un objet/geste DÉJÀ établi dans la scène plutôt que d'inventer un nouveau signifiant isolé.
