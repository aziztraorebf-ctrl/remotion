# Un gotcha vit dans la fiche injectée, pas dans le fichier thématique

**Vécu 2026-08-17.** ~50 % de nos appels storyboard échouaient. Le correctif exact était écrit
**depuis le 2026-08-14** dans `memory/tools/openrouter-gpt-image-et-breakdown.md`, mot pour mot pour
ce cas. Il n'a servi à rien : rien n'ouvre ce fichier au moment où on écrit un brief.

Le système d'injection (`.claude/hooks/fiche-inject.sh`) a pourtant **parfaitement fonctionné** —
`FICHE-STORYBOARD.md` s'est déclenchée deux fois, à l'écriture du `PROMPT-*.txt` et au lancement du
script. Le déclencheur n'était pas en cause : **le contenu de la fiche ne contenait pas le gotcha**.

Diagnostic d'Aziz, immédiat : « n'attend-on pas un injecteur de contexte qui aurait dû se
déclencher ? Si tel n'est pas le cas, on devrait enrichir notre système d'injection. »

**Why:** on a deux mémoires de nature différente et on les confond. Les fichiers de
`memory/tools/` sont des **archives consultables** — on y va quand on sait déjà qu'on a un problème.
Les `memory/fiches/` sont des **rappels poussés** — ils arrivent sans qu'on les demande, au moment
du geste. Un gotcha qui doit empêcher une erreur AVANT qu'elle arrive n'a de valeur que dans la
seconde catégorie. Rangé dans la première, il est écrit pour l'archéologue, pas pour l'agent.

**How to apply:**
1. Après tout diagnostic d'un échec RÉCURRENT, se demander : « au moment où l'erreur se commet,
   quelle fiche est injectée ? » → écrire le correctif DANS cette fiche, pas seulement dans le
   fichier thématique (qui garde le détail long et les preuves).
2. Si aucune fiche ne couvre ce geste → c'est un trou du système d'injection : créer l'entrée ou
   étendre le déclencheur dans `.claude/hooks/fiche-inject.sh`.
3. Le fichier thématique garde la démonstration (tests, chiffres, historique) ; la fiche garde la
   **règle actionnable en 3 lignes** + un pointeur. Ne pas dupliquer le détail.
4. Signal d'alarme : « le fix existait déjà et n'a pas été appliqué » n'est presque jamais un
   problème de discipline — c'est un problème de PLACEMENT de l'information.

Cas d'application : `memory/fiches/FICHE-STORYBOARD.md` § « la dernière ligne du brief décide ».

Voir aussi le système de fiches complet : `memory/fiches/README.md`.

---
Migré depuis auto-memory (`feedback_gotcha-doit-vivre-dans-la-fiche-injectee.md`) le 2026-08-31, contenu original inchangé.
