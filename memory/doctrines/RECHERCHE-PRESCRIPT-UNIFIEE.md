# DOCTRINE — RECHERCHE PRÉ-SCRIPT UNIFIÉE (de l'idée au script blindé)

> **Source de vérité UNIQUE pour le "comment valider un sujet PUIS écrire un script juste, AVANT toute production".**
> Lock 2026-06-27 (Aziz). Prouvée de bout en bout sur le **Short franc CFA** (1er run complet).
> ⚠️ NE DUPLIQUE PAS [[SUJET-PRIME-SUR-PRODUCTION]] : ce fichier CHAÎNE les étapes et AJOUTE les étapes 7-9
> (script + fact-check + jury) qui manquaient. Les étapes 0-6 (validation sujet + positionnement) vivent dans
> SUJET-PRIME — ici on POINTE, on ne recopie pas. Le "comment écrire les phrases" vit dans [[DOCTRINE-SCRIPT-UNIFIEE]].

## POURQUOI CETTE DOCTRINE EXISTE
Valider un sujet (SUJET-PRIME) ne suffit pas : un sujet validé peut donner un script FAUX (chiffres périmés,
attribution biaisée) ou MAL ÉCRIT (télégraphique, plat). Cette doctrine ferme la boucle : du coup de tête initial
jusqu'à un script factuellement blindé ET incarné, prêt pour la production. Chaque étape a un COÛT maîtrisé et un
LIVRABLE. C'est l'équivalent "recherche" du script unifié (qui, lui, régit l'écriture orale).

## LA CHAÎNE COMPLÈTE (9 étapes — du large au précis, ~2-3h pour un short)

### PHASE A — VALIDER LE SUJET (étapes 0-6) → voir [[SUJET-PRIME-SUR-PRODUCTION]]
Ne pas recopier ici. Résumé pointeur :
- **0 Intake · 1 Découverte large (TubeLab) · 2 Timing (last30days) · 3 Remonter le fil (yt-dlp transcripts+commentaires)
  · 4 Synthèse angle · 5 Verdict GO/NO-GO · 6 Étoile polaire de positionnement.**
- Outils : **TubeLab = passé/demande** (source de vérité n°1, crédits) · **last30days = présent/chaud** (le "poumon")
  · **yt-dlp = transcripts + TOP COMMENTAIRES** (mine d'or à angle, GRATUIT — préférer à TubeLab pour économiser crédits).
- Sortie phase A : SUJET validé + ANGLE libre + pré-TITRE + positionnement (1 ligne pour un short).

### PHASE B — ÉCRIRE LE SCRIPT (étape 7)
**7. SCRIPT V1 → conforme [[DOCTRINE-SCRIPT-UNIFIEE]] DÈS la 1re version (pas en correction après).**
   - Structure du PILIER (Souverain/Atlas/War-Map) pour le QUOI/ordre ; couche orale unifiée pour le COMMENT.
   - ⛔ GATE D'ÉCRITURE (les 4 règles le plus souvent violées — checklist AVANT de présenter un script) :
     1. **Zéro phrase sans verbe** (règle 11). "Minuit." / "Une balance." = télégraphique = INTERDIT. Phrases complètes.
     2. **Un connecteur de présence narrateur par beat** (règle 10 Tremblay). Sinon = exposé, pas "quelqu'un me parle".
     3. **"on/nous" jamais "tu"** (règle 8) · **pas de CTA dans le hook** (règle 9).
     4. **1 idée/phrase, ≤20-22 mots · tampon sur chaque nom propre/terme · niveau cible du format** (Short=grade 9-10).
   - Penser DÈS le script : registre visuel par beat + "quoi générer exactement" (colorisation sélective, objets à dessiner).

### PHASE C — BLINDER LE SCRIPT (étapes 8-9)

> ⭐⭐ **ORDRE INVERSÉ 2026-08-01 (prouvé Gazoduc AAGP/TSGP)** : le JURY CRÉATIF passe AVANT le fact-check
> formulations, pas après. Raison : le jury peut faire réécrire des pans entiers du script (hook, actes) —
> fact-checker une version qu'on va de toute façon jeter/réécrire est du travail perdu. Fact-checker APRÈS
> le jury garantit qu'on vérifie le texte qui sera réellement dit. Les faits BRUTS (chiffres, dates,
> événements) restent vérifiés en amont, à la Phase A/recherche (WebSearch/Tavily/Sonar Pro), AVANT
> d'écrire le V1 — ça ne bouge pas. Ce qui change c'est le fact-check FINAL (formulations exactes) : lui
> se fait sur le texte déjà retravaillé par le jury, pas sur le V1 brut.

**7. SCRIPT V1 → conforme [[DOCTRINE-SCRIPT-UNIFIEE]] DÈS la 1re version**, sur la base d'une recherche
   factuelle déjà verrouillée (Phase A + recherche fraîche si sujet daté/mouvant). Voir gate d'écriture
   ci-dessus (étape 7 originale, 4 règles).

**8. JURY LLM CRÉATIF (critique de l'angle/structure/hook/rythme — PAS le fact-check factuel) →
   sur le script V1, AVANT tout fact-check de formulation.**
   - **4 modèles** (élargi de 3 à 4, 2026-08-01) : GPT-5.6 Sol + Gemini 3.1 Pro + Kimi k2.5 + **Grok**
     (`grok-4.20-reasoning` via xAI, ajouté pour sa tendance à sortir du consensus/angle réseaux sociaux —
     même logique que son inclusion au jury titres, cf `feedback_jury-titres-llm-4-modeles.md`).
   - **Brief structuré, même prompt aux 4, dans UN SEUL appel qui inclut la réécriture** (pas un 2e passage
     séparé) : (1) niveau de technicité / où ça décroche pour un spectateur novice, avec passages précis
     cités ; (2) force du hook / la 1re minute, sévère ; (3) dynamisme et rétention, zones plates
     identifiées ; (4) équilibre vulgarisation/sérieux/ton humain, AVEC référence à des techniques
     concrètes de chaînes connues pour leur écriture (pas juste journalistiques) ; (5) note /10 justifiée ;
     (6) **réécriture complète** du script, mêmes faits/mêmes actes, s'il devait tout refaire.
   - Outil : `scripts/tools/jury-script-creatif-llm.py` (committé 2026-08-01, même pattern d'appel 4
     modèles que `jury-titres-llm.py` — IPv6 fix, parallélisation). ⚠️ NE PAS confondre avec
     `scripts/tools/jury-script-llm.py` (existant, périmètre différent : conformité DOCTRINE-SCRIPT-UNIFIEE
     — clarté phrase-par-phrase + densité cumulative règle 6bis, PAS la critique créative hook/rythme/ton).
     Usage : `python3 scripts/tools/jury-script-creatif-llm.py <script.md> --contexte "..."`.
   - **Fusion manuelle par Aziz, pas automatique** : Aziz lit les 4 verdicts + réécritures, choisit ses
     préférés PAR MORCEAU (ex. hook de X, Acte 2 de Y), et peut lui-même composer un mix à la main. Le mix
     d'Aziz prime toujours sur toute fusion algorithmique — c'est un choix de goût, pas une moyenne.
   - **Piège du mix manuel à surveiller (Claude)** : un copier-coller de 2 sources différentes laisse
     souvent des DOUBLONS (mêmes idées dites 2x, un paragraphe entier répété) et des TROUS de cohérence
     (connecteur-cliché resté d'une source non nettoyée, contradiction jamais reliée entre 2 passages
     venant de scripts différents). Après tout mix manuel : une passe de nettoyage CIBLÉE (uniquement les
     doublons/trous, ne pas retoucher les choix de phrase d'Aziz) est un service à rendre systématiquement,
     pas à attendre qu'Aziz les repère lui-même.
   - **⭐⭐ RAFFINEMENT "3 PASSES" (validé 2026-08-06, refonte script AES post-échec publication)** : sur un
     script déjà PUBLIÉ et raté (pas un V1 jamais sorti), une seule passe jury+mix ne suffit pas toujours —
     itérer en 3 passes distinctes bat 1 passe unique quand l'enjeu est un script à refaire de zéro plutôt
     qu'un V1 à blinder avant 1ère publication :
     1. **Passe diagnostic** (le protocole standard ci-dessus, 4 modèles, script complet, réécriture incluse)
        — identifie LES problèmes, sert à choisir 2 juges complémentaires pour la suite (ex. un juge
        structure/rigueur + un juge punch/personnalité — pas figé, dépend des styles observés).
     2. **Passe comparaison** (script ad hoc, PAS `jury-script-creatif-llm.py` tel quel) : brief qui montre
        V1 ET V2 (mix manuel Aziz) ensemble, demande explicitement "les corrections de la passe 1
        sont-elles reprises ?". 2 juges seulement (ceux choisis en passe 1), pas 4 — la comparaison cible
        est plus utile qu'un nouveau diagnostic large à ce stade.
     3. **Passe vérification stricte** : mêmes 2 juges, brief qui exige une NOTE PAR ACTE (pas qu'une note
        globale — une moyenne haute peut masquer un seul acte faible) + réécriture CIBLÉE de 2-4 phrases
        max si besoin (jamais une réécriture complète à ce stade, le script est déjà bon).
     Détail complet + preuve (script AES V1→V4, 3-4.9/10 → 8.8/10) : `feedback_hook-retention-premiere-minute.md`
     § "méthode validée — refonte en 3 passes".
   - **⛔⛔ TOUTE MODIFICATION MANUELLE POST-JURY DOIT REPASSER PAR L'ÉTAPE 9 (fact-check), MÊME CIBLÉE** :
     vécu sur l'AES (2026-08-06) — une correction manuelle de 2 phrases (réchauffer le ton d'un passage)
     a introduit une erreur factuelle de chronologie (lien causal faux entre 2 événements espacés d'1 an)
     qu'AUCUN des 2 juges de la passe suivante n'a détectée à la première lecture (1 des 2 seulement, à la
     relecture). Une modif manuelle, même 2 phrases, n'est pas exemptée du fact-check parce qu'elle "a l'air
     mineure" — c'est justement le genre de rustine ajoutée vite qui échappe à la vérification systématique.

**9. FACT-CHECK 3 NIVEAUX SUR LE TEXTE FINAL (formulations exactes, pas les faits déjà vérifiés en
   amont) → [[FACT-CHECK-DEEP-RESEARCH-VS-SONAR]] pour le routage outil.**
   - Sur un sujet 100% daté de l'année courante, **Deep Research est peu utile** (cutoff fin-2024, aveugle) —
     remplacer par un 2e/3e passage Sonar Pro ciblé plutôt que de s'acharner (Deep Research a aussi un bug
     connu de réponse VIDE malgré HTTP 200 sur prompt long, observé 2026-08-01 — ne pas retenter en boucle,
     basculer sur Sonar Pro).
   - **1 passage "faits datés"** (chiffres/dates/événements tels que FORMULÉS dans le texte final, pas le
     fait brut) + **1 passage "attribution/neutralité"** dédié — brief explicite : le texte traite-t-il les
     2 camps avec la même rigueur, des formulations prêtent-elles une intention non sourcée, etc.
   - ⛔⛔ **LE MODÈLE DE FACT-CHECK NE CONNAÎT PAS NOTRE CHARTE — FILTRER SES VERDICTS À TRAVERS
     [[CHARTE-EDITORIALE-SOUVERAIN]], NE PAS LES APPLIQUER TELS QUELS** (gravé 2026-08-01, Gazoduc). Un
     modèle générique juge contre une neutralité journalistique plate ("ni parti pris ni ton"). Notre
     charte dit explicitement : *"Je ne suis ni militant ni neutre. Je suis analyste."* — du TON, du style,
     une tension narrative sont ATTENDUS, pas des défauts. Sur le script Gazoduc, ~10 corrections
     "neutralité" ont été proposées par Sonar Pro ; 7 étaient des faux positifs (ton analyste normal :
     "guerre silencieuse", "maître du gaz", "paradoxe de cette course" — aucun jugement moral, aucun
     méchant désigné, à garder tels quels) et seulement 3 touchaient un vrai problème couvert par la
     charte (règle 1 "pas de méchant désigné" implique aussi PAS DE HÉROS IMPLICITE — le même TYPE de fait,
     ex. la source de financement d'un projet, cadré en vertu pour un camp et en faiblesse pour l'autre).
     **Test de tri** : la correction retire-t-elle un jugement moral non sourcé sur un FAIT (à garder), ou
     retire-t-elle simplement du STYLE/de la tension narrative (à écarter, ce n'est pas notre définition de
     neutralité) ? Si le camp Claude n'est pas sûr → demander à Aziz plutôt que d'appliquer en masse.
   - PROCÉDURE : 1 passe chaque outil → lister CHAQUE correction proposée avec verdict retenu/écarté et
     pourquoi → appliquer seulement le retenu → STOP. Pas de boucle, pas d'auto-application en masse.

→ SORTIE : script Vfinal (jury créatif intégré + factuellement blindé sur les formulations + neutralité
filtrée par la vraie charte) → PUIS gate voix haute + densité mots → audio → production (storyboard/code).

## EXEMPLE COMPLET — Gazoduc AAGP/TSGP (2026-08-01, 1er run de la méthode réordonnée)

Script complet + toutes les versions : `memory/episodes/souverain/gazoduc-aagp-tsgp/` (SCRIPT-V1 brouillon
→ jury 4 modèles → SCRIPT-V2 synthèse Claude → mix manuel Aziz → SCRIPT-V3 nettoyé + fact-checké, verrouillé).

**Ce que le jury a produit concrètement** : sur le hook du V1 ("Deux pays construisent, en ce moment même,
deux gazoducs presque identiques...", jugé "clinique/universitaire" par Aziz), les 4 modèles ont convergé
(note moyenne ~6,5-7,4/10) sur le même diagnostic — trop d'acronymes d'un coup (AAGP/TSGP/CEDEAO/EXIM en 3
phrases), hook qui énonce des faits au lieu d'installer une tension, manque de "texture orale". Gemini a
produit le hook finalement retenu quasi-verbatim : *"Imaginez deux immenses tuyaux qui partent du même
pays... Voici la course secrète pour devenir le futur maître du gaz africain."* — Aziz l'a jugé "extrêmement
bien dit, je le garderai verbatim" avant même de voir le nettoyage.

**Ce que le mix manuel d'Aziz a nécessité comme nettoyage (étape "piège du mix" ci-dessus, appliquée pour
de vrai)** : le copier-coller Grok+Gemini d'Aziz contenait un paragraphe entier ("Le problème de ce bras de
fer, c'est le timing...") répété MOT POUR MOT 2 fois consécutives, une phrase sur "aucun kilomètre de
tracé" dupliquée dans le hook, le connecteur-cliché "Comment est-ce possible ?" resté d'une source, et le
mot "terroriste" (repéré par Aziz comme vocabulaire à charge, incompatible charte analyste) réapparu d'un
bloc non nettoyé. 6 corrections chirurgicales, zéro retouche du choix de phrases d'Aziz.

**Ce que le fact-check final a vraiment trouvé (utile pour calibrer les attentes)** : sur ~15 affirmations
datées vérifiées, TOUTES confirmées ou nuancées mineurement (aucune fausse) — le vrai gain n'était pas de
"trouver des erreurs factuelles" (la recherche amont était déjà solide) mais de détecter le déséquilibre de
CADRAGE entre les 2 camps (Algérie systématiquement cadrée en "vertueuse/autonome", Maroc en "dépendant") à
travers un vocabulaire répété (Algérie = "ses propres fonds", "pas besoin d'attendre" ; Maroc = "suspendu
au bon vouloir des banquiers"). Sur le même TYPE de fait (source de financement), corriger ce déséquilibre
a demandé 3 reformulations ciblées, pas une réécriture — leçon : le fact-check final sert surtout à
l'ATTRIBUTION, les faits bruts sont généralement déjà bons si la recherche amont (Phase A) était sérieuse.

## LEÇON RACINE — POURQUOI J'AI SAUTÉ DES ÉTAPES (à ne pas reproduire)
Sur le CFA, j'ai écrit un script V1-V3 JUSTE mais TÉLÉGRAPHIQUE (phrases sans verbe) et SANS connecteurs Tremblay
— en violant des règles que je "connaissais". Cause racine : j'ai traité DOCTRINE-SCRIPT-UNIFIEE comme une référence
à consulter APRÈS, pas comme une GATE à cocher AVANT de présenter. D'où la GATE D'ÉCRITURE explicite (étape 7) :
cocher les 4 règles AVANT de montrer un script, comme le SCAN COMPOSANTS-INDEX est bloquant avant de coder un beat.

## COÛTS & GARDE-FOUS
- TubeLab = crédits (économiser : transcripts/commentaires via yt-dlp, pas TubeLab). last30days/Tavily = ~gratuits.
- Deep Research ~0,19$/run · Sonar Pro ~0,10$/run. Jury : 3 appels API.
- Proportionné : un Short = chaîne complète mais légère (positionnement 1 ligne). Un mid-form = plus profond.

Liens : [[SUJET-PRIME-SUR-PRODUCTION]] (étapes 0-6) · [[DOCTRINE-SCRIPT-UNIFIEE]] (écriture orale) ·
[[FACT-CHECK-DEEP-RESEARCH-VS-SONAR]] (routage fact-check) · [[DA-BRIEF-GATE]] (miroir VISUEL amont) ·
[[CHARTE-EDITORIALE-SOUVERAIN]] (analyste, attribution honnête).
