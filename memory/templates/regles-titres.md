# Règles empiriques titres (données 2025-2026 — NON-NEGOTIABLE)

> Source de vérité partagée. Référencée depuis `script-atlas-v1.md` et `script-ebauche-v1.md`.
> Issues d'études sur 60 000 à 800 000 vidéos YouTube. Pas des opinions — des mesures.

1. **Zéro date dans le titre** — Les titres avec une année (ex: "en 2007", "depuis 1944") reçoivent 53% moins de vues médianes. La date vieillit le titre, l'algorithme le distribue moins au fil du temps. Les dates vont dans la description ou les captions visuelles.

2. **Cible 50 caractères, maximum 55** — La longueur de titre suit une courbe monotone : plus court = mieux distribué + mieux affiché mobile. La plage 60-70 caractères = déjà -59% de performance vs un titre sous 20 caractères. Chaque mot inutile coûte de la distribution.
   - **Exception documentée (Soudan, 2026-07-31)** : titre verrouillé à 67 car. (« L'empire de l'or qui rend la guerre au Soudan impossible à arrêter »), dépassement délibéré validé par Aziz + confirmation indépendante (Gemini web) sur un sujet à 4 puissances étrangères imbriquées (pas un fait unique) — la richesse sémantique nécessaire pour porter la promesse d'explication complète du système justifiait le dépassement. Précédent isolé, pas une nouvelle norme : rester sous 55 car. par défaut, ne dépasser que si le sujet est structurellement dense (plusieurs acteurs/mécanismes imbriqués) ET que le dépassement est validé explicitement par Aziz.
   - **Ne jamais sur-filtrer les options d'un jury avant de les montrer à Aziz** : sur le cas Soudan, une 1re sélection a écarté d'office les titres >55 car. en les jugeant « trop universitaires » selon cette règle appliquée trop mécaniquement — alors qu'Aziz les préférait pour leur richesse. Le titre finalement choisi venait de ce lot initialement écarté à tort. La règle de longueur est un défaut à appliquer par défaut, pas un couperet à appliquer avant présentation — le jugement final (longueur vs richesse sémantique) appartient à Aziz.

3. **Chiffre précis en unités quotidiennes** — Les titres avec un chiffre précis surperforment de 23% dans les niches éducatives (VidIQ 2025). Mais le chiffre doit être en unités compréhensibles physiquement : "9 centimes sur l'euro" pas "9,2%". "16 millions d'habitants" pas "petit pays africain".

4. **Tension binaire courte en priorité** — Deux faits opposés dans le même titre battent la formulation descriptive. Format : "[Fait A]. [Fait B contradictoire]." ou "[Entité A] a [action]. [Entité B] a [action contraire]." Zéro terme à décoder pour le viewer.

5. **Formules mortes à proscrire** — Ces patterns ont chuté de 34% en CTR entre 2023 et 2025 et signalent du contenu conspirationniste qui tue la crédibilité éducative :
   - "Nobody talks about this"
   - "What they're hiding" / "Ce qu'ils cachent"
   - "The real reason X" / "La vraie raison de X"
   - "What nobody tells you" / "Ce qu'on ne te dit pas"
   - "They don't want you to know" / "Ils ne veulent pas que tu saches"
   - Titres en ALL-CAPS intégral

**Test rapide avant de valider un titre :** (1) contient une date ? → retirer. (2) dépasse 55 caractères ? → compresser. (3) contient une des formules mortes ? → réécrire. (4) les deux faits en tension sont-ils dans les 48 premiers caractères ? → sinon réordonner. (5) le titre porte-t-il sur un objet MATÉRIEL (règle 6 ci-dessous) ? (6) le mot-clé cherchable (pays + ressource) y est-il, de préférence tôt ?

6. **SUJET MATÉRIEL > SUJET MÉTA** (mesuré : écart ×157 de vues à production strictement identique sur une chaîne concurrente — cf `memory/doctrines/SUJET-PRIME-SUR-PRODUCTION.md` § PREUVE EMPIRIQUE 2026-07-29). « L'argent qui part » bat « la statistique qui manque ». Un titre portant sur une absence, une lacune, une leçon abstraite ou une comparaison conceptuelle est à REFORMULER sur l'objet matériel en jeu, ou à écarter. ⚠️ *Erreur vécue le 2026-07-30* : « Même ressource, trois destins : Norvège, Congo, Botswana » — format impeccable au regard des règles 1-5, mais sujet méta, donc écarté.

7. **NE JAMAIS RETIRER LE MOT-CLÉ CHERCHABLE** (nom du pays + ressource), même s'il figure déjà dans la miniature. YouTube indexe le TITRE ; le texte gravé dans l'image ne le remplace pas. ⚠️ *Erreur vécue le 2026-07-30* : « Sénégal » retiré d'un titre pour éviter une redondance avec le thumbnail = désindexer la vidéo pour un gain esthétique. Corollaire du Test Tokyo, qui demande d'AJOUTER un enjeu universel — jamais de SUPPRIMER l'ancrage local.

8. **LE TITRE NE REDIT PAS CE QUE LA MINIATURE MONTRE.** L'image montre, le titre nomme ce qui n'est pas montrable. Si les deux disent la même chose, l'un des deux est gaspillé. (Décidé sur le CFA 2026-07-30 : le titre n°1 du jury a été écarté parce qu'il reprenait mot pour mot le texte gravé.)

⭐ **Ne jamais générer ET juger un titre soi-même** (juge et partie). Outil : `scripts/tools/jury-titres-llm.py` — 4 modèles indépendants, ~2 min ; le signal est la CONVERGENCE. Détail : `.claude/…/memory/feedback_jury-titres-llm-4-modeles.md`.

**OBLIGATOIRE — Appliquer AUSSI la règle du titre hybride (Section 9 de `memory/rules/rules-souverain-editorial.md`) :**
Les règles techniques ci-dessus valident le FORMAT. La règle hybride valide le PRINCIPE. Les deux sont obligatoires simultanément.
Résumé règle hybride : tout titre doit passer le **Test Tokyo** — "quelqu'un à Tokyo/Paris/Montréal qui ne s'intéresse pas à l'Afrique a une raison de cliquer ?" Si non → reformuler avec ancrage mondial.
