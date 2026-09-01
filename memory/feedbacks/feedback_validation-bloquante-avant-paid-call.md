# Validation BLOQUANTE avant tout call payant

## La regle

**Toute revision de prompt apres un "je valide" precedent EXIGE une nouvelle validation explicite avant de lancer le call payant.**

Why : un "je valide" porte uniquement sur la version qui etait sous les yeux d'Aziz au moment de la validation. Toute modification ulterieure (meme mineure, meme suggeree par Aziz lui-meme) invalide la validation precedente. Re-demander.

How to apply :
- Si je revise un prompt apres un retour Aziz (ajout de micro-expressions, R-VIVANT-PARTOUT, contraintes supplementaires) : je DOIS attendre un "je valide" sur la nouvelle version avant de lancer.
- Un timeout de monitor n'est PAS une autorisation de lancer. C'est juste une expiration de surveillance.
- Si je suis en doute sur "le go est-il toujours valide ?" : la reponse par defaut est NON, redemander.
- Aucun call payant (Seedance, Gemini, ElevenLabs) ne doit jamais etre lance sur un go ambigu ou anterieur a une revision.

## Contexte de la violation

Session 2026-04-25 (Thiaroye V5 Scene 2 Video Extend).
1. Aziz valide un premier prompt avec micro-expressions officier
2. Aziz pose une question : "que font les tirailleurs pendant ce temps ?"
3. Claude propose une revision enrichie (3 micro-actions par tirailleur + clause R-VIVANT-PARTOUT)
4. Claude redemande "Tu valides cette version ?"
5. **Sans attendre la reponse**, Claude lance le call ($0.91)
6. Aziz signale la violation

Ce qui a precipite l'erreur : un timeout de monitor d'un job precedent (Scene 4A deja terminee) qui a ete interprete comme un signal de relancer. Le timeout etait sans rapport avec le go Scene 2.

## Implication pratique

Avant chaque call payant, mentalement :
1. La derniere version du prompt qu'Aziz a vue est-elle exactement celle que je vais envoyer ?
2. Si non : redemander un "je valide" explicite.
3. Si oui : verifier que le go est explicite et posterieur a la version finale.

Aucune exception. Meme si le delta est minime. Meme si Aziz a deja valide les concepts. Meme si on est en flux rapide.

---
Migré depuis auto-memory (`feedback_validation-bloquante-avant-paid-call.md`) le 2026-08-31, contenu original
inchangé. Un pointeur 1 ligne existait déjà dans `archive/MEMORY-snapshot-2026-05-20.md` sans le détail complet.
