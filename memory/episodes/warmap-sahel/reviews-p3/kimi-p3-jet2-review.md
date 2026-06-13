 **RÉALISATEUR / DIRECTEUR ARTISTIQUE — ANALYSE PARTIE 3 "LA RUPTURE"**
*Style référence : Kings & Generals, identité parchemin terre/sable, stack technique SVG/canvas frame-driven*

---

### 1. IMPRESSION GÉNÉRALE

La séquence possède une ossature narrative solide mais souffre d'une **sur-politesse visuelle** qui tue l'urgence documentaire. L'image est trop "propre", trop centrée, trop lisse. On sent une construction algorithmique (placement auto des jetons, vignettes radiales génériques, typographie sans friction) plus qu'une direction artistique intentionnelle. 

Le principal défaut : **la grammaire visuelle n'est pas établie**. On ne comprend pas ce que signifie le bleu (est-ce un territoire ? une influence ? une promesse ?), on ne distingue pas les acteurs (Africa Corps = FAMa visuellement), et la hiérarchie du regard est absorbée par des éléments décoratifs (le focus radial) au détriment de l'information.

---

### 2. RECOMMANDATIONS CONCRÈTES PAR FRAME

**[Ph1 overlay AES naissance]**
- **Problème** : L'apparition des drapeaux en fondu est faible. Le titre manque de "tampon d'archives".
- **Piste** : Déploiement des drapeaux en "wet ink" (tache qui s'étale) depuis le centre vers l'extérieur. Ajouter une texture "tampon encreur" légèrement décalée sur le titre principal pour casser la perfection numérique.
- **Narration** : Insérer un pictogramme CEDEAO (menace externe) en transparence derrière les drapeaux pour justifier visuellement la naissance de l'alliance.

**[Ph1 overlay complet 3 drapeaux+citation]**
- **Problème** : La citation est illisible (taille trop petite, manque d'air).
- **Piste** : Bandeau bas style "citation d'archives" avec guillemets typographiques géants (»). Les drapeaux doivent projeter une ombre portée diffuse (SVG filter) sur le parchemin pour les ancrer dans l'espace.

**[Kidal ville isolée (focus radial)]**
- **Problème** : Le vignette radial est un effet "filtre Instagram" qui floute l'information géographique utile.
- **Piste** : Remplacer par un **"théâtre d'opérations"** : assombrissement des régions externes via une texture de "bords brûlés" (burned edges dessinés), gardant Kidal dans une lumière crue. Le sprite ville (adobe) est acceptable factuellement (Kidal est une garnison du désert), mais ajoutez des volutes de chaleur (particules SVG subtiles) pour signifier le climat et l'isolement.

**[Statu quo touaregs + ONU]**
- **Problème** : L'ONU est mentionnée dans le brief mais absente visuellement. On voit seulement "Hors contrôle".
- **Piste** : Ajouter des jetons ONU (casques bleus) à côté des Touaregs, mais **grisés/transparents** ou avec un pictogramme "interdiction de tirer" (cercle barré) pour visualiser leur mandat non-combattant. Cela explique pourquoi ils ne tiennent pas la ville.

**[Offensive duo FAMa + Africa Corps]**
- **Problème** : Les jetons sont identiques. Africa Corps = Russes, ils doivent être distincts.
- **Piste** : 
  - FAMa : uniforme kaki classique, béret vert.
  - Africa Corps : tenue "contractor" (kaki désert clair, gilets tactiques), insigne "AC" visible, ou teint de peau différent (pâle/européen).
- **Action** : Ajouter des **sillages "wet ink"** derrière les jetons montrant la direction d'avancée. Au contact, générer des "éclats de poussière" (particules SVG) pour suggérer l'engagement sans faire du 3D.

**[Reprise drapeau rectangulaire + zone bleue]**
- **Problème CRITIQUE** : La zone bleue est incompréhensible. C'est un plat de couleur vectoriel sans texture ni légende.
- **Piste** : 
  - Animer la zone comme une **tache d'encre qui s'étend** (TerritorialExpansion) depuis le drapeau, avec des bords irréguliers.
  - Label obligatoire : "CONTRÔLE ÉTATIQUE" qui apparaît en même temps.
  - Le drapeau malien doit être un **sprite ondulant** (vrai tissu), pas une image statique.
  - Ajouter un "flash" blanc (1 frame) au moment de la prise pour marquer l'événement.

**[Moura sepia flashback]**
- **Problème** : Beat trop léger pour un sujet grave. On "mentionne" 500 civils sans en montrer le poids.
- **Piste** :
  - **Ralentir le temps** : le flashback doit avoir un effet "mémoire" (grain de pellicule, scratches animés en overlay).
  - Le point rouge : le transformer en **tache de sang qui s'étale lentement** (scale up avec opacité dégressive sur les bords).
  - Typo : "500+" en chiffres énormes, style mémorial, avec "CIVILS" en dessous plus petit.
  - Connexion narrative : Ajouter une flèche fine qui relie Moura aux jetons Africa Corps de la frame précédente, avec le texte "LES MÊMES ACTEURS" pour que le spectateur comprenne la continuité des exactions.

**[Attaques 2026 flèches + jetons]**
- **Problème** : Les jetons sont statiques et séparés. On ne voit pas le choc, donc on ne comprend pas "repoussées".
- **Piste** :
  - Utiliser les **SahelAttackArrow** : flèches rouges (jihadistes) qui poussent vers l'intérieur, puis se brisent