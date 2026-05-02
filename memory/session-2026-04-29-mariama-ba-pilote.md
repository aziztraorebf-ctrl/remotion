# Session 2026-04-29 — Mariama Bâ pilote (test pipeline figure feminine)

## Contexte
Aziz a eu une discussion avec Claude Desktop sur un pilier "Heros contemporains africains et afro-diasporiques" pour la chaine GeoAfrique. Le document strategique propose 5 figures Tier 1 (Diop, Octavia Butler, Wangari Maathai, Mariama Ba, Bessie Coleman) et 6 Tier 2. Activation conditionnelle a T+60 apres publication des 3 Shorts en cours (Sonjata + Thiaroye + Abou Bakari).

Cette session etait une **discussion + test exploratoire**, pas un demarrage de production. But : valider que le pipeline papercraft sait creer une figure feminine intellectuelle (Mariama Ba) — le type le plus eloigne de ce qu'on a deja produit (heros masculins guerriers/explorateurs).

## Decisions strategiques actees

1. **Heros Oublies + Heros Contemporains = un seul pilier**, pas deux. Meme pipeline papercraft, meme promesse editoriale (figures effacees de la memoire dominante), juste extension temporelle.
2. **Atlas (Mapbox) + Heros papercraft + Long-form compilation = un seul produit a 3 modes de production**. Atlas casse la repetitivite des Shorts et est rapide a produire (1 jour vs 2 jours pour un Short papercraft).
3. **Critere de selection des figures** :
   - Mecconnaissance en francais (asymetrie d'attention vs YouTube anglophone)
   - Equilibre genre (manque de figures feminines)
   - Litterature a jour permettant fact-check rapide
   - Compatible visuellement avec papercraft
4. **Long-form compilation** identifie comme potentiel a explorer apres validation des Shorts (RPM superieur).
5. **Seuil T+60 du document Desktop probablement trop conservateur** — un seul Short a forte traction sur 3 publies suffit comme signal.

## Apprentissages techniques majeurs

### Regle "papercraft = iconique pas ressemblant" (NON-NEGOTIABLE)
Documente dans `memory/tools/gemini.md`. Resume :
- Style GeoAfrique = iconique/symbolique, pas ressemblant
- Dot eyes obligatoires, visages quasi-interchangeables
- Differenciation par coiffure/foulard/costume/accessoires/posture
- **Ne JAMAIS donner de photos historiques realistes en input** quand on cree un personnage canonique — ca derive systematiquement vers BD
- Stratégie correcte : refs papercraft canoniques de la chaine + prompt par attributs distinctifs

### Regle "review d'image — pieges a eviter" (NON-NEGOTIABLE)
Documente dans `memory/tools/gemini.md`. Resume :
- Ne pas sur-analyser les yeux pixel par pixel (dot eye stylise garde une petite forme legere)
- Texte stylise suggerant l'ecriture sans etre lisible = bonne solution
- Ombrage leger directionnel = utile pour coherence d'eclairage en animation
- "Papercraft" est un nom de convention — le style reel est un hybride papercraft/illustration legere
- **Methode** : comparer la nouvelle image cote a cote avec une scene existante de la chaine. Si elles passent ensemble sans dissonance, c'est valide.

### Iterations du charsheet Mariama Ba
- **v1** (5 refs incluant drawing N&B + photos historiques) : style BD avec yeux realistes — ECHEC
- **v2** (5 refs avec ajout femme-nourrisson Sonjata + femme-pagne Abou Bakari + charsheet Abou Bakari) : meilleur style mais layout vertical au lieu d'horizontal, encore un peu illustration peinte — REJETE
- **v3** (3 refs papercraft canoniques uniquement, photos historiques retirees) : layout horizontal correct, dot eyes, costume signature, pose canonique mains-jointes-livre — VALIDE

### Test de scene — table d'ecriture
Refs : `mariama-ba-charsheet-CANONICAL.png` + `papercraft1-cercle-barre-fer-frame1.png` (Sonjata).
Resultat : Ba reconnaissable, costume preserve, pose narrative juste, multi-plans papercraft correct, palette restreinte, 9:16 OK.
Verdict : **pipeline valide pour figure feminine intellectuelle**.

## Assets produits

```
public/assets/library/geoafrique/characters/mariama-ba/
├── mariama-ba-charsheet-CANONICAL.png  ← REFERENCE OFFICIELLE (= v3)
├── mariama-ba-charsheet-v1.png         ← echec BD, garde pour reference
├── mariama-ba-charsheet-v2.png         ← rejete layout vertical
├── mariama-ba-charsheet-v3.png         ← duplicate du CANONICAL
├── femme ref 1.png                     ← ref papercraft femme pagne (Abou Bakari)
├── femme ref 2.png                     ← ref papercraft femme nourrisson (Sonjata)
├── abu bakari ref.png                  ← ref layout charsheet horizontal
├── mansa moussa ref.jpg                ← ref layout charsheet (alternatif)
├── refs-historiques/                   ← 5 photos Wikimedia UNESCO domaine public
│   ├── ba-portrait-haute-res.jpg       ← drawing N&B (NE PLUS UTILISER en gen papercraft)
│   ├── ba-1958-portrait.jpg            ← photo 1958
│   ├── ba-1958-avec-mari.jpg           ← photo 1958 avec Obeye Diop
│   ├── ba-1970s-amicale.jpg            ← photo groupe 1970s (boubous + gele)
│   └── ba-rufisque.jpg                 ← photo discours public Rufisque
└── scenes-test/
    └── scene-table-ecriture-v1.png     ← scene test validee
```

## Scripts crees
- `scripts/tools/generate-mariama-ba-charsheet.py` (v3 final, 3 refs papercraft)
- `scripts/tools/generate-mariama-ba-scene-table-ecriture.py` (scene test)

## Scenes restantes a generer si production activee

Si Aziz decide d'activer Mariama Ba en production complete, les 2 scenes complementaires deja brieffees mentalement :

- **Scene A — Le double heritage (enfance ~6 ans)** : petite fille entre grand-mere boubou traditionnel et cartable ecole francaise. Necessite generer une "Ba enfant", pas le charsheet adulte.
- **Scene C — Le livre qui voyage** : composition symbolique avec exemplaire d'Une si longue lettre + silhouettes etagees (etudiante africaine, lectrice europeenne Francfort, spectatrice 2025). Concept fort pour Angle D "echo 2025 box-office".

## Angles narratifs disponibles pour script Ba

Du document Desktop :
- **A — "Elle a ecrit un seul livre. Il a libere un continent."** (50 ans, patience)
- **B — "La lettre qui n'aurait pas du exister"** (transgression)
- **C — "Le double heritage qui cree une voix"** (conceptuel)
- **D — "L'echo 2025"** (adaptation cinema d'Angele Diabang qui a battu Hollywood au box-office senegalais 2025)

Recommandation : **Angle D** pour CTR initial (pont passe/present), Angle A pour profondeur si serie.

## Cout session
- Gemini : ~$0.30 (3 charsheets + 1 scene test)
- Cle utilisee : `GEMINI_API_KEY` (gemini-3.1-flash-image-preview)

## Statut

**SESSION DE DISCUSSION + TEST. PAS DE PRODUCTION ACTIVE.** Mariama Ba reste dans le backlog, conditionnel a T+30/T+60 apres publication des 3 Shorts en cours.

Prochaine action sur ce dossier : aucune jusqu'a decision explicite d'Aziz d'activer Ba en production.
