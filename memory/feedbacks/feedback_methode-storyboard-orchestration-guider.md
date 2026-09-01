# Méthode : storyboard / orchestration / guider sans brider (session 2026-06-19→20)

Trois principes de travail établis et **prouvés par tests d'agents réels** cette session. Détail technique
dans les doctrines committées ; ici = la méthode + le POURQUOI (pour ne pas la re-tâtonner).

## 1. Le modèle PROPOSE la direction → Aziz valide → PUIS breakdown → code
- Pour une scène, ne PAS deviner la direction soi-même. Le modèle (Gemini/GPT via `storyboard-dual-gen.py`)
  propose un storyboard multi-états (évolution + épure) ; Aziz valide ; SEULEMENT APRÈS on décode le breakdown technique.
- **Pourquoi** : déplace le jugement de goût d'APRÈS-render (cher, irréversible) vers AVANT-code (gratuit). Et le
  modèle trouve des directions qu'on n'avait pas (flux qui s'arrête, dissolution de frontières, « l'État saigne »).
- **Prouvé 4×** : 90% cobalt, ZLECAf, Maroc hub, Sahel avancée. Doctrines : `memory/doctrines/STORYBOARD-MAPBOX.md`,
  `public/_shared/refs/backgrounds/_PALETTE-BACKGROUNDS.md` (§ storyboard = évolution + épure : chaque état un
  incrément minimal, texte SEULEMENT si vraie nécessité — la voix dit déjà beaucoup).
- Mapbox : la géo du storyboard est approximative = OK (proposition de direction ; vraie géo au CODE, jamais copiée).

## 2. GUIDER SANS BRIDER (la balance qu'Aziz a affinée — cruciale)
- Fixer l'EXIGENCE (« carte vivante », « chiffre qui frappe ») + INFORMER des capacités (ARSENAL :
  `public/_shared/refs/cartes/_ARSENAL.md`, « voici ce qu'on sait faire, VA PLUS LOIN ») + poser les INTERDITS
  (pas de 3D, géo réelle). **JAMAIS dicter la technique** ni transformer une liste en checklist.
- **Pourquoi** : une liste de techniques = brider (l'agent coche, jamais surprenant). Exigence + arsenal d'inspiration
  = l'agent propose mieux. Correction explicite d'Aziz : la directive « carte vivante » listait caméra/couleur/
  apparitions → trop prescriptif → réécrite en exigence pure.
- **Prouvé** : les agents ont TRANSFORMÉ/DÉPASSÉ l'arsenal (dissolution de frontières, contamination « l'État
  saigne », ont RETENU « ne pas mettre des technicals partout »). Verdict d'un agent : « pas de tentation de cocher,
  le contenu était trop fort ».

## 3. DÉLÉGUER à un agent frais (orchestration)
- Un agent vierge (contexte propre, effort élevé) bat souvent l'instance principale au contexte saturé pour
  produire OU vérifier une scène. Claude = CHEF D'ORCHESTRE (découpe, lance N agents, vérifie, synthétise),
  pas exécutant de chaque pixel. Plan : `memory/PLAN-ORCHESTRATION-VIDEO.md`.
- Isolation `worktree` pour le code parallèle · handoff = fichier disque (jamais TodoWrite cross-agent) ·
  un seul agent touche Root.tsx à la fois.
- **Prouvé** : ~10 agents vierges sur la session (storyboards + mini-vidéo RDC cobalt) ont appliqué le système seuls.

## 4. ⚠️ META-LEÇON SUR LE CHEF (moi) — graver une règle ≠ l'appliquer (session 2026-06-20)
Deux fois dans la même session, j'ai SAUTÉ le checkpoint storyboard d'Aziz (produit le storyboard puis enchaîné
direct sur le code/analyse) — alors que la règle « le chef remonte les storyboards à Aziz AVANT le code » était
DÉJÀ gravée. Aziz a dû me reprendre. Leçon : un point de contrôle qui dépend de ma seule discipline est fragile —
je le franchis « sous l'élan ». Le checkpoint storyboard est un **point d'arrêt DUR** : générer image(s) → upload →
donner les liens à Aziz → ATTENDRE sa validation. Ne jamais enchaîner sur breakdown/code sans ce GO explicite.
(Corrigé dans `SYSTEME-AGENTIQUE.md` étape 4 — mais la vigilance reste sur moi tant qu'aucun hook ne le force.)
- Corollaire vérif : j'ai failli déclarer « les agents ont échoué, rien n'existe » sur un `ls` RELATIF depuis un
  cwd trompeur (`/tmp/...`) — tout existait. **Toujours vérifier un livrable en chemin ABSOLU**, jamais croire un
  agent sur parole NI un `ls` relatif (règle « vérifier le réel », appliquée à moi-même).
- **IMAGE storyboard TOUJOURS obligatoire** (tranché Aziz 2026-06-20) : pas d'exception « formes connues = texte
  suffit ». C'est Aziz qui valide la direction → il doit la VOIR, pas l'imaginer. (L'ancienne règle « image OU texte »
  faisait sauter le checkpoint visuel.)

## Annotations de storyboard ≠ rendu final
Les flèches/labels d'un storyboard sont un ÉCHAFAUDAGE de conception (l'image est figée, elle suggère le
mouvement). Le vrai mouvement (caméra, arc qui se trace, couleur qui envahit) vit dans le BREAKDOWN, pas dans
l'image. Ne jamais confondre « storyboard annoté » avec « scène finale chargée » — la scène finale ÉPURE.

## 4. TRANCHER AU RENDU, PAS AU DÉBAT (test parallèle de directions) — prouvé Cacao→Chocolat 2026-06-29
- Quand plusieurs directions visuelles sont plausibles (ex: transfusion brune vs cuisine vs split-screen),
  ne PAS débattre en abstrait : lancer 2-3 agents qui RENDENT chaque direction, puis trancher sur la matière
  réelle. A permis d'écarter transfusion + cuisine sur PREUVE (belles sur le papier, ne tenaient pas au rendu).
- COROLLAIRE — point de contrôle orchestrateur : après chaque render d'agent, l'orchestrateur vérifie
  frame-par-frame (extraire frames + Read), pas juste « ça crash pas ». A rattrapé 2 bugs réels cette session
  (croix = trou crème vide ; couleurs B2 qui n'apparaissaient que 0,3s avant la coupe) qu'aucun agent n'avait signalés.
- COROLLAIRE 2 (2026-08-04, Gazoduc Acte 2) : même principe pour un DÉFAUT signalé par un retour Gemini/GPT
  (relayé par l'utilisateur, pas produit par un agent) — vérifier soi-même par extraction de frame réelle
  au timecode exact avant d'appliquer une correction, ne pas faire confiance au retour du modèle tiers sans
  preuve directe. A confirmé qu'un bug de chevauchement de texte signalé par Gemini ("Portugal-ne") était
  réel (pas une hallucination) en isolant la frame exacte — cohérent avec la doctrine "LLM = signal jamais
  juge", étendue ici au cas d'un défaut visuel ponctuel précis (pas juste une note globale sur 10).
- Pourquoi : même logique que principe 1 (jugement de goût déplacé vers le concret), appliquée à l'EXÉCUTION
  et pas qu'au storyboard. Le rendu tranche ; le débat tourne en rond.

## 5. REGROUPER les décisions de goût AVANT un render coûteux, pas au fil de l'eau (Sénégal V3, 2026-07-04)
- Pendant une passe de finition longue, j'ai pris plusieurs décisions de goût l'une après l'autre (timing
  d'animation recomposé à la main, pré-roll visuel choisi, SFX identifiés à retirer) sans les regrouper
  pour validation, avant de m'apprêter à lancer un gros re-render de toutes les scènes. Aziz a dû arrêter
  et corriger explicitement : « avant de faire le re-render, n'est-ce pas plus logique de trancher ces
  points tout de suite, une bonne fois pour toutes ».
- **Pourquoi** : c'est le même principe que « regrouper les questions de goût en UN point de contrôle
  espacé » déjà dans CLAUDE.md — mais l'écart concret ici est le TIMING : le risque n'est pas seulement
  de poser trop de questions séparées, c'est de les poser APRÈS avoir déjà commencé à coder/converger sur
  une solution, juste avant un render coûteux qu'il faudrait refaire si l'une des décisions change.
- **Application concrète** : dès qu'on identifie 2+ choix de goût pendant l'exécution d'un chantier (pas
  seulement en amont), les regrouper et les soumettre AVANT le prochain point de rendu coûteux — pas après
  avoir déjà tout implémenté. Un `AskUserQuestion` groupé à ce moment-là coûte une pause ; un render à
  refaire après un mauvais choix de goût coûte le double (le mauvais render + le bon).

> Point d'entrée pour activer tout ça : `memory/SYSTEME-AGENTIQUE.md` (« consulte notre système agentique »).
> Les 3 principes sont aussi dans CLAUDE.md (§ règles de travail non-négociables).
