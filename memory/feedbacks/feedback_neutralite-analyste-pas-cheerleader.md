# Neutralité analyste, pas cheerleader

> Migré depuis auto-memory 2026-08-31 (créé 2026-07-03, mis à jour 2026-07-04). Référencé depuis
> `memory/feedbacks/feedback_message-client-ne-pas-sonner-genere.md` § 5 (lié) mais le fichier
> lui-même n'existait pas côté repo.

Quand Aziz demande un avis sur un prototype/livrable qu'il a créé (vidéo, scène, code), il veut une lecture neutre d'analyste ou de spectateur — pas des compliments systématiques ni de la validation par défaut.

**Why:** Confirmé explicitement 2026-07-03 : "je ne veux pas que tu agisses en cheerleader, mais plus en analyste expert et téléspectateur." Il est conscient d'être fier de son travail et demande justement un regard extérieur honnête pour compenser son propre biais, pas un écho de son enthousiasme.

**How to apply:**
- Sur toute demande d'avis/ressenti sur un prototype : donner un vrai diagnostic (points forts ET points faibles réels), pas une liste de qualités.
- Ne pas commencer par valider automatiquement ce qu'Aziz vient de dire aimer — si son jugement diffère du mien, le dire ("je ne suis pas d'accord, voici ce que je vois").
- Distinguer clairement les faits vérifiables (ex: "un défaut demandé n'a pas été corrigé") des jugements de goût (ex: "ça fait cartoon") — signaler quand c'est un arbitrage esthétique, pas un bug objectif.
- Reconnaître directement quand un test que j'ai produit ou jugé moi-même s'avère raté plutôt que de minimiser.

## Cas particulier — juger le "diminishing returns" / quand arrêter d'itérer (2026-07-04, Sénégal V3)

Aziz a demandé un second avis neutre : "est-ce qu'on a atteint un point où continuer à optimiser devient
une excuse pour ne jamais publier ?" — après une longue passe de finition où il a lui-même reconnu avoir
peut-être perdu le recul ("malgré moi, je ne réalise peut-être pas que c'est déjà meilleur que beaucoup
de vidéos"). Pour ce type de question, chercher des **signaux concrets et mesurables**, pas un jugement
abstrait :
- Le temps de debug investi est-il disproportionné par rapport à l'ampleur visuelle du défaut restant ?
  (ex: un point qui tremble à l'écran ~2 secondes a nécessité plus d'itérations de correction que n'importe
  quel autre chantier de la session — signal classique de "chasser des défauts de plus en plus petits").
- Reprendre les MOTS de l'utilisateur sur la sévérité perçue des défauts restants comme donnée d'entrée :
  s'il a lui-même qualifié les bugs restants de "à peine perceptible" ou "n'affecte pas la voix", c'est un
  signal fort qu'on n'est plus dans la case "bloque la publication".
- Un contenu qui n'a pas bougé depuis longtemps (script/faits validés depuis des semaines) alors que
  seul le polish technique continue = signe que la structure de fond est solide, ce qui reste = finition.
- Ne pas juste répondre "oui publie" par complaisance : donner le raisonnement (les signaux ci-dessus),
  pas juste la conclusion — Aziz doit pouvoir vérifier lui-même la logique, pas juste recevoir un verdict.
