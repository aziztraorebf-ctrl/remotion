# FICHE PACKAGING — titre · miniature · description (rappel au moment de le faire)

> Doctrine complète (34 Ko, source de vérité unique) : `memory/doctrines/PACKAGING-YOUTUBE.md`.
> Cette fiche n'en est PAS le résumé : elle rappelle **les interdits déjà payés** et l'ordre des gestes.
> Enjeu mesuré : CTR **1,5-1,8 %** sur 1800-3600 impressions → le problème est la **CONVERSION**,
> pas le reach. Le packaging est le levier, pas la production.

## ⭐ LE PRINCIPE — trois pièces AUTONOMES
**Le TITRE crée le manque · l'IMAGE donne l'émotion · le CONTENU résout.**
Aucune ne répète les autres. Anti-pattern n°1 = **le titre-thèse** (qui résume le script au lieu de
créer un manque).

## ⛔⛔ LES 3 INTERDITS QUI ONT DÉJÀ COÛTÉ

### 1. Ne JAMAIS générer ET juger un titre soi-même — juge et partie
Vécu 2026-07-30 : **3 séries rejetées** (« trop universitaire », « trop safe »), dont un titre
**factuellement faux**. Mes titres portent mon biais (sages, descriptifs, sans tension) et je ne peux
pas le voir de l'intérieur.
→ `python3 scripts/tools/jury-titres-llm.py <script.md> --contexte "..." --out <rapport.md>`
4 modèles indépendants (Grok · Gemini 3.1 Pro · GPT-5.5 · Kimi k2.5), ~2 min. **Le signal est la
CONVERGENCE**, pas l'avis d'un modèle.

### 2. Le `--contexte` du jury DOIT contenir la doctrine + le diagnostic
Sans ça le jury échoue (Soudan v1, 2026-07-31 : 4 séries de titres-thèses qui résument le script).
Injecter systématiquement : **(1)** §1+§2+§3 de la doctrine · **(2)** ⭐ **le diagnostic des 3 échecs
(§0)** — c'est lui qui fait basculer les modèles vers la tension · **(3)** ce que la miniature montre
déjà (interdit au titre de le répéter) · **(4)** les angles déjà écartés · **(5)** l'état de publication.
*Preuve : jury v3 avec diagnostic → convergence des 4 modèles en 41-51 car. contre 66 sans.*

### 3. ⛔⛔ APRÈS le jury, AVANT de présenter : FACT-CHECK dans le script
**Le jury juge la mécanique du titre, JAMAIS sa véracité.**
1. Pour CHAQUE titre : `grep -i` dans le script complet les mots-clés de ce qu'il **affirme** ET de ce
   qu'il **nie**.
2. Titre avec une négation (« ce n'est pas X ») ? → chercher X dans le script. S'il y est → **disqualifié**.
3. Compter les caractères. Privilégier un titre qui **cite** une phrase du script : il ne peut pas mentir.
⚠️ **Ne pas sauter parce que le jury a convergé.** Vécu 2026-08-17 : les 4 modèles ont convergé, j'ai
validé la mécanique, et présenté à Aziz un titre dont **la seconde moitié était fausse**.
**La convergence valide la FORME, jamais le FOND.**

## 🖼 MINIATURE — on la COMPOSE, on ne la génère pas
Méthode par défaut : **SVG maison composé** (§5.1 de la doctrine). La génération d'image (Pipeline C)
est l'exception, pas le défaut.
⭐ **Avant de composer : REGARDER la vidéo source** (§5.4) — extraire des frames, ne pas composer de mémoire.
⛔ La miniature ne répète pas le titre (règle 8) : si l'image montre X, le titre ne dit pas X.

## 💬 ENGAGEMENT — la pièce qu'on oublie totalement
**0 commentaire sur 3 vidéos** = on ne pose jamais de question. §6 de la doctrine.
Piste mesurée ailleurs : demander une **donnée personnelle précise** (« ton chiffre exact, sans
arrondir ») plutôt qu'une opinion — chacun connaît déjà sa réponse, personne n'a à fabriquer un avis.
⚠️ Un seul cas observé (Adam Ivy) → **à tester contre notre gabarit, pas à substituer d'office**.

## 📋 ORDRE D'EXÉCUTION (§8)
script verrouillé → **jury titres** → **fact-check** → miniature composée (après avoir vu la vidéo) →
description → sous-titres (§7, gratuit et systématiquement oublié) → publication.

## ⛔ NE PAS OUBLIER
- **Nom de la chaîne = « Kora et Cartes »** (≠ le nom de la voix GéoAfrique).
- **Vérifier tout nom propre à l'écran sur Wikipédia** avant render.
- **Bas d'écran = zone SOURCES**, jamais de sous-titres dedans.
