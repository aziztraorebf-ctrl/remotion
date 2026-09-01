# Vérifier la durée avant de la qualifier

> Migré depuis auto-memory 2026-08-31 (modifié 2026-08-26). Référencé en index dans `MEMORY.md` §
> Communication avec Aziz ("verifier-la-duree-avant-de-la-qualifier — ⛔ CALCULER l'ecart de dates
> avant « depuis des semaines »") mais le détail complet n'existait nulle part côté repo.

⛔ Avant d'écrire un qualificatif de durée ("depuis des semaines", "ça fait des mois",
"blocage de N jours"), **CALCULER l'écart** entre la date de la source et la date du jour.
Ne jamais l'estimer au ressenti ni le recopier depuis une note ancienne.

**Vécu 2026-08-25 (Aziz, correction explicite)** : le "blocage de 25 jours" de
`memory/feedbacks/feedback_pipeline-publication-manquant-evitement.md` a été invoqué pour qualifier
le rythme d'un autre chantier (freelance). Vérification faite APRÈS la correction d'Aziz : la
source datait de 3 jours avant, pas de semaines — le chantier avançait vite, pas lentement.

**Deux erreurs distinctes dans le même geste** :
1. **Durée non calculée** — parler comme si le chantier traînait, sans jamais soustraire les dates.
2. **Blocage d'un AUTRE contexte re-appliqué** — les 25 jours concernaient la publication YouTube,
   pas le contexte réutilisé. Un fait daté appartient à son contexte ; le ressortir ailleurs le
   transforme en **reproche permanent** au lieu d'une leçon ponctuelle.

**Why** : un qualificatif de durée faux change le SENS du commentaire. Un constat positif peut
devenir une accusation de lenteur alors que les faits disent l'inverse — et l'interlocuteur doit
alors dépenser un tour de conversation à corriger des faits qu'on avait sous la main. Mots d'Aziz :
« cela peut devenir conflictuel pour moi et devient conflictuel pour toi aussi dans tes commentaires ».

## How to apply

- Avant tout qualificatif temporel : lire la date du jour (fournie en contexte) + la date de la
  source (git log, frontmatter, mtime), et **soustraire**. Si < 7 jours, ne jamais écrire "semaines".
- Un blocage/échec daté se cite **avec sa date ET son périmètre** ("le blocage de publication
  YouTube de juillet"), jamais comme un trait général du travail de l'utilisateur.
- Ne pas re-citer un même feedback d'échec à chaque session : une leçon apprise n'a pas besoin
  d'être rappelée tant qu'elle n'est pas re-enfreinte.
- Cas particulier : un chantier de **moins d'une semaine** ne "traîne" jamais. Vérifier avant de
  suggérer qu'il faut accélérer.

Lié aux principes MEMORY.md § "chiffre-audit-relaye-sans-verification" (un chiffre est un signal, on
le vérifie) et "neutralite-analyste-pas-cheerleader" (dire le vrai, ni flatteur ni accusateur).
