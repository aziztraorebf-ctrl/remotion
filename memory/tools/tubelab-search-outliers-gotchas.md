# TubeLab search_outliers — étape 3 obligatoire + gotcha paramètre

> Migré depuis auto-memory 2026-08-31 (créé 2026-08-04). Complète `memory/tools/tubelab.md`
> (méthodologie générale, teste `search_related_outliers` le 2026-06-16) avec un INCIDENT concret
> et un gotcha de nom de paramètre non documenté ailleurs.

Ne jamais conclure "pas de sujet dans la niche" sur la seule base de `search_outliers` avec des mots-clés bruts (étape 1 du workflow SUJET-PRIME). C'est un filtre de découverte volontairement bruité par conception — sa sortie attendue est "3-4 vidéos qui se démarquent", pas un verdict.

**Why:** Session du 2026-08-04 — 2 appels `search_outliers` avec mots-clés Afrique/géopolitique ont renvoyé presque exclusivement du bruit hors-niche (documentaires animaliers, foot, comptines enfants), malgré `language:["fr"]` et `classificationIsFaceless:true` bien réglés. Aziz a flairé une erreur de méthode plutôt qu'un vrai vide de sujets — il avait raison. Un agent d'audit a confirmé : l'étape 3 (`search_related_outliers` avec un `videoId`-seed connu et aligné) avait été sautée — cf doctrine "le seed/input détermine tout" (`memory/projects/RECHERCHE-MARCHE-INDEX.md` ou équivalent SUJET-PRIME). Une fois relancé correctement avec des `videoId` seeds d'une chaîne documentée alignée + `titlePattern:"*Afrique*"`, le signal est redevenu net et fort (ratios jusqu'à 19×) — la niche avait bien de la demande, seule la méthode de recherche était fautive.

**Gotcha technique additionnel** : le paramètre correct de `search_related_outliers` est `videoId` (array), PAS `relatedVideoId` — ce dernier nom de champ n'existe pas dans le schema et l'appel échoue silencieusement en renvoyant un total de 10000 résultats complètement hors-sujet (toutes langues, aucun filtre appliqué) plutôt qu'une erreur explicite. Toujours vérifier le schema réel via `ToolSearch select:mcp__claude_ai_TubeLab__search_related_outliers` avant de deviner un nom de paramètre.

**How to apply:** Dès qu'un premier passage `search_outliers` mots-clés semble donner un signal faible ou hors-niche, ne JAMAIS conclure — enchaîner systématiquement sur `search_related_outliers` avec 1-2 `videoId` d'une chaîne de référence déjà documentée comme alignée (chercher dans `memory/atlas-decode/DECODE-*.md` pour un seed existant avant d'en chercher un nouveau). Croiser 2+ seeds si possible (un sujet qui ressort sur plusieurs seeds = vraie demande, sur un seul = biais de ce seed).
