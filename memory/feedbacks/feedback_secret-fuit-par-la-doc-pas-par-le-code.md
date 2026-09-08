---
name: secret-fuit-par-la-doc-pas-par-le-code
description: "Un secret fuit par la DOCUMENTATION, pas par le code — un gate anti-secret qui skippe les .md ne protege rien. 15 tokens, 110 jours, depot public, une page client."
metadata:
  type: feedback
---

# Un secret fuit par la DOCUMENTATION — un gate qui skippe les .md ne protege rien

**Incident mesure le 2026-09-08** : 15 `claimToken` here.now en clair dans **6 fichiers du depot
PUBLIC**, depuis le 2026-05-20 (commit `7ee840de`) — **110 jours d'exposition**.

**Portee verifiee, pas supposee** (le geste qui distingue un incident traite d'un incident raconte) :
26 slugs here.now references dans le repo → **10 repondent encore HTTP 200** → **4 pages VIVANTES
avaient leur token expose**, dont `velvet-portal-r5s9` = **une page CLIENT (flowdesk)**. Un
`claimToken` autorise `PUT /api/v1/publish/:slug` : un tiers pouvait **remplacer le contenu d'une
page livree a un client**.

## Les 3 lecons de conception, chacune payee

1. ⛔⛔ **Ne pas skipper les `.md`.** `gemini-model-guard.sh` les skippe, et c'est legitime : il
   cherche des identifiants de modele dans du CODE. Un gate anti-secret **ne doit pas** — la fuite
   s'est produite **exactement dans de la documentation** (dashboards d'URL, notes de liens client).
   Le code n'a jamais ete le probleme. Copier les exclusions d'un gate voisin sans se demander ou vit
   le risque, c'est heriter de son angle mort.
2. ⛔ **Position 1 du bloc de hooks.** Un blocage amont (un autre gate qui refuse l'ecriture)
   **consomme le declenchement** et masque le secret. Le gate anti-secret passe avant tous les
   autres. Verifiable : `.claude/settings.json`, bloc `PreToolUse` / `Edit|Write`.
3. ⛔ **Une exclusion se matche sur un SEGMENT de chemin, jamais sur une sous-chaine.** Correctif du
   lendemain (`462f541c`) : l'exclusion des archives matchait une sous-chaine, donc
   `notes_archive_2026.md` — fichier versionne parfaitement ordinaire — **echappait au scan**. 6 cas
   retestes apres fix. Meme famille que le hook pre-commit qui cherchait « perime » n'importe ou dans
   un starter.

## Ce qui reste vrai apres le correctif

⛔ **Purger le fichier ne purge pas l'HISTOIRE.** Les tokens restent dans l'historique git d'un depot
public. Decision d'Aziz (`7a650459`) : **on ne reecrit pas l'historique** (ca casse les clones) — les
15 tokens sont consideres **BRULES**. Consigne gravee dans `memory/tools/here-now-hosting.md` : ne
jamais reutiliser un ancien token, **republier sous un NOUVEAU slug**. Les tokens des 10 pages encore
vivantes sont sauvegardes dans `.secrets-local/` (ajoute au `.gitignore`) pour garder la main.

⚠️ **Le hook couvre l'ECRITURE, pas le PUSH.** Avant tout push sur un depot public, la verification
reste un geste (voir aussi `memory/doctrines/HYGIENE-GIT-MULTI-SESSION.md` § 5) :

```bash
git diff origin/master..master | grep "^+" | grep -E "claimToken|sk-|ghp_|AIza"
```

⭐ **Une cle Firebase Web publique dans un repo n'est PAS une fuite** — c'est un identifiant par
design, ce sont les regles Firestore qui protegent (verifie sur `PROMPT-PROCESS-VAULT` le meme jour :
acces anonyme refuse, regles correctes). Ne pas crier au loup dessus : le bruit sur un faux positif
decredibilise l'alerte sur les vrais.

Voisins : [[feedback_regle-ecrite-insuffisante-sans-gate-outille]] (un gate ne vaut que teste sur le
corpus REEL et vu se declencher seul) · [[feedback_tester-le-script-nest-pas-tester-le-branchement]]
· `memory/tools/here-now-hosting.md` (here.now n'est plus la voie par defaut : Artifact > Blob > catbox).
