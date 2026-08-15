# Showcase des capacités — vidéo démo du savoir-faire (lancé 2026-08-15)

> **Idée d'Aziz**, née d'un constat qu'il a formulé lui-même : *« nous en avons d'autres que même moi
> j'ai oublié qu'elles étaient disponibles »*. Le repo compte **640 compositions enregistrées** et
> **243 composants partagés** (mesuré 2026-08-15) — le catalogue existe en Markdown mais ne se
> CONSULTE pas. Une vidéo se revoit.

## Décisions prises (Aziz, 2026-08-15)

**Double usage, dans cet ordre** :
1. **Index visuel interne d'abord** — exhaustif, chaque brique nommée à l'écran, 3-4 min. Valeur
   immédiate : résout le « j'ai oublié ce qu'on a », se revoit avant de coder une scène.
2. **Cut vente ensuite**, extrait du même montage — 60-90 s, orienté prospects freelance.
   L'index sert de banc de montage ; rien n'est produit deux fois.

**Sélection PAR CAPACITÉ** (pas par projet, pas par techno) : 8-10 blocs, chacun prouvant une
capacité distincte, avec le MEILLEUR exemple de chaque. Une showcase qui **démontre** bat une
showcase qui **énumère** — 8 moments qui prouvent qu'on sait tout faire valent mieux que 25 qui
prouvent qu'on a beaucoup travaillé.

Une capacité se formule en langage non-technique (« un territoire prend une couleur », « la caméra
plonge du globe vers un point ») — ⛔ Mapbox / D3 / SVG sont des MOYENS, pas des capacités.

## ⚠️ Tension de positionnement — À TRANCHER avant le cut vente

Presque tout le matériau existant est **géopolitique africaine** (War-Map, gisements, flux d'or), or
la piste freelance vise le **SaaS / explainer / data-viz corporate**. Un prospect SaaS voyant 90 s de
War-Map Soudan pense « très beau, mais ce n'est pas mon domaine ».

Deux voies, non tranchées :
- **assumer le créneau « cartographie éditoriale/géopolitique »** — réellement différenciant, cf
  [freelance-dataviz-fiverr-pro](freelance-dataviz-fiverr-pro.md) ;
- **montrer les FORMES en masquant le sujet** — un flux entre deux points sert autant une chaîne
  d'approvisionnement qu'un gazoduc.

⭐ Remarque de fond : pour VENDRE, trois démos courtes disant chacune « je fais ça, très bien »
convertissent mieux qu'un objet unique disant « je fais tout ». L'index interne, lui, gagne à être
exhaustif — d'où l'ordre index → cut.

## Atout de départ

**Le matériau est déjà produit, rendu, validé, publié.** C'est un travail de MONTAGE et de SÉLECTION,
pas de création — quelques jours, pas quelques semaines. Sources : `out/PRET-PUBLICATION/` (~16 FINAL)
+ les compositions de `src/Root.tsx`.

## Garde-fous

- ⛔ **Ne jamais montrer un proto jamais rendu ou rejeté** — croiser avec la section « REJETS PROUVÉS »
  de `src/projects/_shared/INTENTION-FORME-INDEX.md` et grep `VERDICT`/`REJETÉ` avant d'inclure un
  plan (règle : [[feedback_lire-verdict-rejet-breakdown-avant-reprendre-version]]).
- ⛔ **Vérifier CODE + VISUEL** de tout plan hérité avant de l'inclure : un composant qu'on n'a pas
  revu n'est pas un acquis.
- La sélection doit venir d'un **inventaire réel du repo**, pas de la mémoire — 640 compositions ne
  tiennent dans la tête de personne (ni celle d'Aziz, ni la mienne).

## État

- **2026-08-15** : cadrage validé (double usage + sélection par capacité). Inventaire des capacités
  lancé en agent (liste des 8-12 capacités + meilleur exemple de chaque + **ce qui est oublié** +
  rejets à éviter + trous du catalogue). Rien n'est encore monté.
- Prochaine étape après l'inventaire : Aziz arbitre la liste, puis on écrit le déroulé (ordre des
  blocs, durée par bloc, musique) avant tout montage.
