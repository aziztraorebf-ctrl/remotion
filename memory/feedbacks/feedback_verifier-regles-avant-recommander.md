---
name: Verify rules before recommending
description: Always cross-check proposals against documented rules before presenting to Aziz — reading rules is not enough, must APPLY them
type: feedback
---

Migré depuis auto-memory 2026-08-31.

AVANT de presenter une recommendation de prompt, de pipeline, ou de generation a Aziz, faire un SCAN EXPLICITE des regles documentees contre la proposition.

**Why:** Constat qu'un agent/Claude lit les fichiers de regles (seedance-rules.md, pipeline.md, etc.) mais ne les applique pas systematiquement au moment de formuler une recommendation. Exemple concret : une regle (ref image obligatoire) etait dans le fichier lu, mais une proposition "pas de ref" a quand meme ete faite. Lire != appliquer. C'est une perte de confiance.

**How to apply:**
1. Apres avoir ecrit un prompt Seedance ou une recommandation de generation, AVANT de la presenter a Aziz :
   - Ouvrir mentalement le checklist des regles (seedance-rules.md pour Seedance, pipeline.md pour le pipeline, etc.)
   - Scanner CHAQUE regle contre la proposition
   - Si une regle est violee, corriger AVANT de presenter
2. Si une regle est volontairement ignoree (cas rare), le signaler explicitement : "Je deroge a la regle X parce que [raison]"
3. Ne JAMAIS presenter une proposition qui contredit une regle documentee sans le dire

**Pattern a eviter :** "Je lis les regles en debut de conversation, puis j'oublie de les appliquer quand je genere le contenu."
**Pattern correct :** "Je genere le contenu, puis je VERIFIE contre les regles avant de presenter."

Distinct de `feedback_gemini-review-workflow-correct.md` (repo) qui couvre un cas plus spécifique
(workflow de review Gemini post-render) — celui-ci est le principe général.
