Un verdict de jury LLM ("PRÊT" / "AJUSTEMENTS MINEURS") ne clôt jamais le débat si Aziz exprime un doute
après coup — même vague, même formulé à l'oreille sans passer par un outil.

**Pourquoi :** Session Soudan Acte 4 (2026-07-10), deux cas dans la même session :
1. Un 1er jury LLM axé clarté phrase-par-phrase a rendu verdict "AJUSTEMENTS MINEURS/PRÊT", mais Aziz a
   détecté à l'oreille, sans outil, que le script "sonnait dense" à la relecture. Un 2e jury avec des
   critères DIFFÉRENTS (densité cumulative + flux narratif + continuité des désignations) a confirmé une
   vraie rupture de flux (un beat mal placé créait une fausse causalité implicite) — invisible au 1er
   jury parce que ses critères ne portaient pas là-dessus. Ce n'était pas un bug du jury, c'est une limite
   de portée des critères utilisés.
2. Sur un calcul de durée de guerre, Aziz a demandé "est-ce que 2023 à 2026 ça fait vraiment 2 ans ?"
   après que le jury (Gemini) avait lui-même contesté un chiffre du script. Vérification manuelle : le
   SCRIPT avait raison, le JURY avait tort.

Les deux cas confirment que le doute d'Aziz est un signal à traiter en PRIORITÉ sur un verdict LLM déjà
rendu, jamais l'inverse.

**Comment appliquer :** Si Aziz exprime un doute (même vague, même après un verdict jury "PRÊT") sur la
clarté, la densité, le flux ou un calcul/fait dans un script déjà jugé validé par un LLM :
1. NE PAS répondre en citant le verdict jury comme clôture du débat.
2. Vérifier manuellement le point précis soulevé (recalcul, relecture à voix haute, ou jury avec un angle
   de critères différent de celui déjà utilisé).
3. Si le jury avait un angle unique (ex: clarté seule), envisager qu'un défaut orthogonal (densité, ordre
   des beats, calcul factuel) ait pu lui échapper structurellement.

Lien avec [[feedback_jugement-sensoriel-solliciter-tot]] (sensoriel audio/visuel — cas où l'agent ne peut
littéralement pas vérifier lui-même) mais ce cas-ci est différent : ici le sujet est du TEXTE (script) et
le tiers contesté est un JURY LLM, pas le jugement de l'agent lui-même. Cohérent avec la doctrine "LLM =
signal, jamais juge" déjà gravée dans `DOCTRINE-SCRIPT-UNIFIEE.md` et `REVIEW-TOOLS-INDEX.md`, mais avec
un exemple concret côté texte/script plutôt qu'audio/vidéo.

---

## Cas 2026-07-19 (Soudan Acte 5 globe) — corollaire côté DEMANDE EXPLICITE d'Aziz

Aziz avait DEMANDÉ des jetons-soldats autour du maréchal Haftar (incarner sa force). Sur reco convergente
Gemini+Kimi (les soldats groupés font "photo de famille"), Claude les a **REMPLACÉS** par des checkpoints
le long du corridor — **en silence, sans signaler l'arbitrage**. Aziz a tiqué ("je ne comprends pas pourquoi
avoir supprimé les soldats").

**Erreur double** : (1) un LLM = SIGNAL, jamais juge — il ne connaît pas les décisions d'Aziz ; (2) une reco
de modèle ne PRIME JAMAIS sur une demande explicite d'Aziz. **Bonne réponse = les DEUX** (garder les soldats
demandés ET traiter le signal "photo de famille" autrement, ex. AJOUTER des checkpoints), et surtout
**SIGNALER l'arbitrage en 1 phrase AVANT d'appliquer**. Ne jamais retirer/remplacer silencieusement ce
qu'Aziz a demandé au nom d'un score de modèle. Si un review LLM contredit une demande explicite d'Aziz →
le signaler et proposer, jamais substituer sans le dire.
