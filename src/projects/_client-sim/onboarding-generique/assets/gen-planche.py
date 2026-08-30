# -*- coding: utf-8 -*-
"""Genere planche-onboarding.svg — GABARIT GENERIQUE (le client remplit), theme sombre.
DESSIN STATIQUE UNIQUEMENT. Aucune animation, aucun <text>, aucun element interdit.
"""
import os
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from texte_paths import texte_path

# ⛔ Chemin RELATIF au script : un chemin en dur ecrasait la planche de la piece
# voisine (vecu le 2026-08-30, restauree par git).
SORTIE = pathlib.Path(__file__).resolve().parent / "planche-onboarding.svg"

# =======================================================================
# ⭐⭐ PARAMETRES CLIENT — ce gabarit se DECLINE sans toucher au dessin.
#   ICONES=3                 nombre de pastilles etape 1 (2, 3 ou 4) — recentrees
#   ICONE_LABELS=a,b,c       leurs libelles
#   OPTION_ACTIVE=2          quelle rangee de reglages est designee (1..4)
#   OPTION_LABELS=w,x,y,z    les libelles des 4 rangees
#   THEME=clair|sombre
# ⛔ Un Lottie n a PAS de moteur de mise en page : rien ne se recentre chez le
#    client. C est NOUS qui calculons la mise en page ici, a la generation, et
#    qui livrons la variante — c est exactement l argument deterministe.
# =======================================================================
NB_ICONES = max(2, min(4, int(os.environ.get("ICONES", "3"))))
_lbl = os.environ.get("ICONE_LABELS", "").strip()
ICONE_LABELS = [x.strip() for x in _lbl.split(",") if x.strip()] if _lbl else \
               ["chat", "files", "design", "tasks"]
OPTION_ACTIVE = max(1, min(4, int(os.environ.get("OPTION_ACTIVE", "2"))))
_olbl = os.environ.get("OPTION_LABELS", "").strip()
OPTION_LABELS = [x.strip() for x in _olbl.split(",") if x.strip()] if _olbl else \
                ["Location", "Contacts", "Photos", "Notifications"]


# ---- palette — DEUX THEMES (bascule : THEME=clair python3 gen-planche.py)
#
# ⭐ Test demande par Aziz (2026-08-30) : « si un client veut une version claire,
# a quel point c'est facile ? » Mesure : les couleurs de CONTENU etaient deja
# centralisees, donc triviales a basculer — MAIS les OMBRES etaient en dur
# (#000000 a 30-40 %, 11 occurrences). Sur fond clair une ombre noire a 40 %
# devient une tache grise sale. C'est le vrai piege d'un theme clair, et il ne
# se voit PAS dans la palette : il se voit au rendu.
import os as _os

THEME = _os.environ.get("THEME", "sombre")
CLAIR = THEME == "clair"


def op_txt(v):
    """Opacite d'un texte ATTENUE.
    ⛔ Ce qui reste lisible en atenue sur fond sombre devient ILLISIBLE sur fond
    clair : mesure WCAG du gris secondaire a 60 % sur blanc = contraste 2,46,
    tres en dessous du seuil de 4,5. En theme clair on remonte le plancher.
    (Le noir sur blanc perd plus vite que le blanc sur noir — l'oeil ne traite
    pas les deux polarites de la meme facon.)"""
    v = float(v)
    return f"{max(v, 0.78):.2f}" if CLAIR else f"{v:.2f}"


def op_ombre(v):
    """Opacite d'ombre : attenuee en theme clair (une ombre noire y salit)."""
    return f"{float(v) * (0.35 if CLAIR else 1.0):.3f}"


if CLAIR:
    OMBRE, FOND_PLANCHE = "#4a5a75", "#e6e9ef"
    REFLET_OFF, REFLET_ON = "#8fa0b5", "#0e8f66"
else:
    OMBRE, FOND_PLANCHE = "#000000", "#05070a"
    REFLET_OFF, REFLET_ON = "#c3ccd8", "#cfe3da"

FOND      = "#f7f8fa" if CLAIR else "#0e1116"
CARTE     = "#ffffff" if CLAIR else "#171c24"
SURELEVE  = "#eef1f5" if CLAIR else "#1f2630"
TXT1      = "#0f1621" if CLAIR else "#f2f5f8"
# ⭐ #3e4a58 et non #5d6b7d : MESURE WCAG. Le gris secondaire doit tenir le
# seuil de 4,5 MEME attenue a 78 % — a #5d6b7d il tombait a 3,46, illisible.
# A #3e4a58 : 9,03 en plein, 4,95 attenue. Le theme clair exige un secondaire
# nettement plus fonce que son equivalent sombre, ce n'est pas symetrique.
TXT2      = "#3e4a58" if CLAIR else "#8b96a5"
SEP       = "#dfe4ec" if CLAIR else "#262d38"
ACC       = "#2f6bff" if CLAIR else "#5b8cff"
ACC2      = "#12b981" if CLAIR else "#3ddc97"
ALERTE    = "#f43f6e" if CLAIR else "#ff6b8a"
JAUNE     = "#e0a020" if CLAIR else "#f5c451"
VIOLET    = "#7c5cf5" if CLAIR else "#a78bfa"
CYAN      = "#0d9fe0" if CLAIR else "#38bdf8"
BLANC     = "#ffffff"

L = []          # lignes de sortie
def w(s, ind=0):
    L.append("  " * ind + s)

def rect(id_, x, y, ww, h, fill, rx=0, op=None, ind=3):
    o = f' opacity="{op}"' if op is not None else ""
    r = f' rx="{rx}"' if rx else ""
    w(f'<rect id="{id_}" x="{x:g}" y="{y:g}" width="{ww:g}" height="{h:g}"{r} fill="{fill}"{o}/>', ind)

def circ(id_, cx, cy, r, fill, op=None, ind=3):
    o = f' opacity="{op}"' if op is not None else ""
    w(f'<circle id="{id_}" cx="{cx:g}" cy="{cy:g}" r="{r:g}" fill="{fill}"{o}/>', ind)

def path(id_, d, fill, op=None, rule=None, ind=3):
    o = f' opacity="{op}"' if op is not None else ""
    fr = f' fill-rule="{rule}"' if rule else ""
    w(f'<path id="{id_}" d="{d}" fill="{fill}"{fr}{o}/>', ind)

def lettrage(id_, s, taille, x, y, fill, face=5, suivi=0.0, op=None, ind=3):
    """y = ligne de base."""
    d, _ = texte_path(s, taille, x, y, face=face, suivi=suivi)
    path(id_, d, fill, op=op, ind=ind)

def largeur(s, taille, face=5, suivi=0.0):
    return texte_path(s, taille, 0, 0, face=face, suivi=suivi)[1]

# =======================================================================
# EN-TETE
# =======================================================================
# ⭐⭐ DEUX MISES EN PAGE, un seul dessin (2026-08-30) :
#   EMPILE=0 (defaut) -> PLANCHE : les 2 ecrans COTE A COTE, 1320x1180.
#                        C'est la source du TSX Remotion, qui cadre lui-meme.
#   EMPILE=1          -> LIVRABLE : les 2 ecrans SUPERPOSES, 500x1080.
#                        C'est ce qui part en Lottie : un .lottie doit sortir
#                        AU BON FORMAT, pas etre recadre apres coup.
# ⛔ On corrige la SOURCE, jamais le fichier genere — meme regle que
# « le SVG est la source, le TSX pilote, jamais l'inverse ».
EMPILE = os.environ.get("EMPILE", "0") == "1"
if EMPILE:
    PLANCHE_W, PLANCHE_H = 500, 1080
else:
    PLANCHE_W, PLANCHE_H = 1320, 1180
w('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">'
  % (PLANCHE_W, PLANCHE_H, PLANCHE_W, PLANCHE_H))
w('<!-- Gabarit onboarding. DESSIN STATIQUE : aucune animation ici, elle est codee en aval. -->')
w('<!-- Chaque <g> de 1er niveau a son repere local a (0,0) ; le transform ne sert qu au placement sur la planche. -->')
w('<rect id="board-bg" x="0" y="0" width="%d" height="%d" fill="%s"/>' % (PLANCHE_W, PLANCHE_H, FOND_PLANCHE), 1)

# =======================================================================
# ECRAN 1 — invite
# =======================================================================
w('')
E1_OX, E1_OY = (0, 0) if EMPILE else (40, 50)
w(f'<g id="screen-one" transform="translate({E1_OX} {E1_OY})">', 1)
w('<!-- taille reelle : 500 x 1080 -->', 2)
rect("step1-bg", 0, 0, 500, 1080, FOND, ind=2)

M = 40                      # marge laterale
# --- barre d etat (habillage discret, pas un calque anime)
w('<g id="step1-status-bar">', 2)
rect("step1-status-time", M, 26, 34, 9, TXT2, rx=4.5)
rect("step1-status-signal", 404, 26, 20, 9, TXT2, rx=3, op="0.75")
rect("step1-status-battery", 430, 25, 30, 11, TXT2, rx=3.5, op="0.55")
rect("step1-status-battery-level", 432, 27, 20, 7, TXT2, rx=2)
w('</g>', 2)

# --- 1. titre
w('')
w('<g id="step1-title">', 2)
w('<!-- "Step one title" — 34px, glyphes vectoriels (aucune balise text) -->', 3)
lettrage("step1-title-text", "Step one title", 34, M, 130, TXT1, face=2)
w('</g>', 2)

# --- 2. sous-titre
w('')
w('<g id="step1-subtitle">', 2)
w('<!-- "STEP ONE SUBTITLE" — 13px capitales, lettrage espace -->', 3)
lettrage("step1-subtitle-text", "STEP ONE SUBTITLE", 13, M, 168, TXT2, face=5, suivi=2.2)
w('</g>', 2)

# --- 3. rangee d apps
w('')
w('<g id="step1-apps">', 2)
w('<!-- 3 pastilles 80x80 rx=20 + glyphe blanc + label -->', 3)
# ⛔ PAS DE MARQUES REELLES dans une piece de portfolio : la 1re version
# portait « slack / drive / figma » (le brief les nommait, a tort).
# Un ecran de demo qui affiche des marques tierces est inutilisable
# commercialement et suggere une integration qui n'existe pas.
#
# ⭐⭐ NOMBRE D ICONES VARIABLE (ICONES=2|3|4) — la rangee est RECENTREE ici,
# a la generation. Le client ne recentre rien : il choisit sa variante.
_COUL_APPS = [ACC, ACC2, ALERTE, VIOLET]
_PAS_APP = 110                      # pas horizontal (80 de pastille + 30 de gouttiere)
_LARGEUR_RANGEE = 80 + _PAS_APP * (NB_ICONES - 1)
_X0 = M + (420 - _LARGEUR_RANGEE) / 2.0    # 420 = largeur utile de l ecran
apps = [
    (ICONE_LABELS[i] if i < len(ICONE_LABELS) else f"item {i+1}",
     _COUL_APPS[i % len(_COUL_APPS)],
     _X0 + i * _PAS_APP)
    for i in range(NB_ICONES)
]
for i, (nom, coul, x) in enumerate(apps, start=1):
    w(f'<g id="step1-app-{i}">', 3)
    rect(f"step1-app-{i}-shadow", x + 3, 200 + 6, 80, 80, OMBRE, rx=22, op=op_ombre("0.35"), ind=4)
    rect(f"step1-app-{i}-knob", x, 200, 80, 80, coul, rx=20, ind=4)
    path(f"step1-app-{i}-gloss",
         f"M{x:g} 220"
         f"v-0 a20 20 0 0 1 20 -20 h40 a20 20 0 0 1 20 20 v10"
         f"q-40 14 -80 0z", BLANC, op="0.10", ind=4)
    cx, cy = x + 40, 240
    if i == 1:      # carre
        rect(f"step1-app-{i}-glyph", cx - 13, cy - 13, 26, 26, BLANC, rx=7, ind=4)
    elif i == 2:    # cercle
        circ(f"step1-app-{i}-glyph", cx, cy, 14, BLANC, ind=4)
    else:           # triangle
        path(f"step1-app-{i}-glyph",
             f"M{cx:g} {cy-15:g}L{cx+15:g} {cy+11:g}H{cx-15:g}Z", BLANC, ind=4)
    lw = largeur(nom, 14, face=5)
    lettrage(f"step1-app-{i}-label", nom, 14, x + 40 - lw / 2, 306, TXT2, face=5, ind=4)
    w('</g>', 3)
w('</g>', 2)

# --- 4. libelle de section
w('')
w('<g id="step1-section">', 2)
# ⛔⛔ 3 INCOHERENCES DE RECIT corrigees le 2026-08-30, trouvees par le DA-brief
# (Grok + Kimi, verifiees dans le code avant application) :
#   1. "3 TEAMMATES FOUND" alors que 6 lignes s'affichent -> passe a 6.
#   2. titre "enable notifications" alors que l'etape 1 demande CONTACTS, et que
#      le toggle Notifications est deja vert et ne bouge jamais -> "Step two title".
#   3. "Maya invited you" INVERSAIT la perspective : ecran 1, c'est MOI qui
#      invite Maya ; ecran 2, elle m'invitait -> "Notification title", qui confirme
#      MON action au lieu de la contredire.
# ⭐ Les 3 venaient du BRIEF (dicte par Claude), pas du dessin. Un chiffre et une
# liste ecrits dans la meme consigne sans etre confrontes l'un a l'autre.
#
# ⭐ un CHIFFRE raconte, un adjectif non : "SECTION LABEL" dit ce que
# l app vient de faire (elle a cherche, elle a trouve 3 personnes).
lettrage("step1-section-text", "SECTION LABEL", 13, M, 366, TXT2, face=5, suivi=2.2)
w('</g>', 2)

# --- 5. banniere
w('')
BY = 388
w('<g id="step1-banner">', 2)
w('<!-- carte large surelevee : icone + 2 lignes de texte + croix -->', 3)
rect("step1-banner-bg", M, BY, 420, 84, SURELEVE, rx=14)
rect("step1-banner-hairline", M, BY, 420, 1.5, BLANC, rx=0.75, op="0.06")
rect("step1-banner-icon", M + 16, BY + 22, 40, 40, SEP, rx=12)
rect("step1-banner-icon-mark", M + 28, BY + 34, 16, 16, TXT2, rx=5, op="0.7")
# ⭐ la banniere PORTE la promesse : ce que l app fait, et ce qu elle a trouve.
lettrage("step1-banner-line-1", "Banner headline", 15, M + 72, BY + 37, TXT1, face=2)
lettrage("step1-banner-line-2", "Banner supporting line", 12, M + 72, BY + 58, TXT2, face=7)
# croix de fermeture (2 traits croises)
cx, cy = M + 392, BY + 26
path("step1-banner-close-a",
     f"M{cx-7:.1f} {cy-8.4:.1f}l1.4 -1.4 15.4 15.4 -1.4 1.4z", TXT2)
path("step1-banner-close-b",
     f"M{cx+8.4:.1f} {cy-7:.1f}l1.4 1.4 -15.4 15.4 -1.4 -1.4z", TXT2)
w('</g>', 2)

w('</g>', 1)   # fin ecran-invite

# =======================================================================
# MEMBRES — <g> de 1er niveau (animes un par un en cascade)
# =======================================================================
MEMBRE_Y0 = 500          # 1re ligne dans le repere de l ecran 1
MEMBRE_PAS = 88
# ⭐ Chaque ligne porte un NOM et une MENTION differents : c est ce qui prouve
# que l app a vraiment lu l espace de travail (des lignes identiques ne prouvent rien).
membres = [
    (1, ACC,    "Member name",  "Detail line one"),
    (2, ACC2,   "Member name",  "Detail line two"),
    (3, ALERTE, "Member name",  "Detail line three"),
    (4, JAUNE,  "Member name",  "Detail line four"),
    (5, VIOLET, "Member name",  "Detail line five"),
    (6, CYAN,   "Member name",  "Detail line six"),
]
w('')
w('<!-- === 6 lignes de membre : <g> SEPARES de 1er niveau (cascade animee un par un) === -->')
for i, coul, nom_membre, mention in membres:
    ty = 50 + MEMBRE_Y0 + (i - 1) * MEMBRE_PAS
    w(f'<g id="step1-member-{i}" transform="translate({40 + M} {ty})">', 1)
    w('<!-- taille reelle : 420 x 68 -->', 2)
    # avatar
    circ(f"step1-member-{i}-avatar-shadow", 23, 25, 23, OMBRE, op=op_ombre("0.30"), ind=2)
    circ(f"step1-member-{i}-avatar", 23, 23, 23, coul, ind=2)
    path(f"step1-member-{i}-avatar-gloss",
         "M0 23a23 23 0 0 1 46 0a23 23 0 0 0 -46 0z", BLANC, op="0.14", ind=2)
    # silhouette dans l avatar (tete + epaules), en blanc translucide
    circ(f"step1-member-{i}-avatar-head", 23, 18, 7.5, BLANC, op="0.85", ind=2)
    path(f"step1-member-{i}-avatar-bust",
         "M11 40a12 12 0 0 1 24 0a23 23 0 0 1 -24 0z", BLANC, op="0.85", ind=2)
    # nom + mention
    lettrage(f"step1-member-{i}-nom", nom_membre, 15, 62, 22, TXT1, face=2, ind=2)
    lettrage(f"step1-member-{i}-mention", mention, 12, 62, 40, TXT2, face=7, ind=2)
    # bouton pilule invite
    rect(f"step1-member-{i}-bouton-shadow", 328, 21, 92, 34, OMBRE, rx=17, op=op_ombre("0.30"), ind=2)
    rect(f"step1-member-{i}-bouton", 328, 17, 92, 34, ACC, rx=17, ind=2)
    rect(f"step1-member-{i}-bouton-gloss", 334, 21, 80, 13, BLANC, rx=6.5, op="0.13", ind=2)
    lw_inv = largeur("invite", 13, face=2)
    lettrage(f"step1-member-{i}-bouton-label", "invite", 13, 374 - lw_inv / 2, 38.6,
             BLANC, face=2, ind=2)
    w('</g>', 1)

# =======================================================================
# ECRAN 2 — reglages
# =======================================================================
# ⭐ En EMPILE, l'ecran 2 se superpose exactement a l'ecran 1 : meme origine.
E2X = 0 if EMPILE else 620
E2Y = 0 if EMPILE else 50
w('')
w(f'<g id="screen-two" transform="translate({E2X} {E2Y})">', 1)
w('<!-- taille reelle : 500 x 1080 -->', 2)
rect("step2-bg", 0, 0, 500, 1080, FOND, ind=2)

w('<g id="step2-status-bar">', 2)
rect("step2-status-time", M, 26, 34, 9, TXT2, rx=4.5)
rect("step2-status-signal", 404, 26, 20, 9, TXT2, rx=3, op="0.75")
rect("step2-status-battery", 430, 25, 30, 11, TXT2, rx=3.5, op="0.55")
rect("step2-status-battery-level", 432, 27, 20, 7, TXT2, rx=2)
w('</g>', 2)

# --- 1. titre
w('')
w('<g id="step2-title">', 2)
w('<!-- "enable notifications" — 30px -->', 3)
lettrage("step2-title-text", "Step two title", 30, M, 128, TXT1, face=2)
w('</g>', 2)

# --- 2. etape 1
w('')
w('<g id="step2-step-1">', 2)
w('<!-- pastille numerotee "1" + ligne de texte -->', 3)
circ("step2-step-1-knob", M + 14, 176, 14, ACC)
# le "1" : hampe + empattement, formes simples
rect("step2-step-1-number-stem", M + 13, 168, 3.4, 16, BLANC, rx=1.7)
path("step2-step-1-number-head", f"M{M+8.4:.1f} 172.4l1.2 -2.6 4.8 -2.4v3.2l-4.4 2.2z", BLANC)
# ⭐ l etape dit QUOI FAIRE, pas "etape 1" : une notice se lit, elle ne se devine pas.
lettrage("step2-step-1-label", "First action to take", 14, M + 40, 181, TXT1, face=5)
w('</g>', 2)

# --- 3. carte de reglages
w('')
CY0 = 218              # haut de la carte
RANG_H = 76
# ⭐ De vrais libelles de reglages systeme : "Contacts" est LA rangee que l etape 1
# designe, elle porte l interrupteur qu il faut basculer.
# ⭐⭐ OPTION_ACTIVE (1..4) designe la rangee que l etape 1 demande d activer.
# Elle recoit : l icone ACCENT, le libelle en clair, l interrupteur, et le CADRE.
# Les autres rangees restent ternes avec un chevron — la hierarchie doit designer
# UNE cible, sinon le spectateur ne sait pas ou regarder.
_COUL_RANGS = [VIOLET, ACC, JAUNE, ACC2]
rangs = []
for _k in range(4):
    _actif = (_k + 1) == OPTION_ACTIVE
    rangs.append((
        f"step2-row-{_k+1}",
        ACC if _actif else _COUL_RANGS[_k],
        "toggle" if _actif else "chevron",
        OPTION_LABELS[_k] if _k < len(OPTION_LABELS) else f"Setting {_k+1}",
        TXT1 if _actif else TXT2,
    ))
w('<g id="step2-list">', 2)
w('<!-- carte + 4 rangees separees par des filets -->', 3)
rect("step2-list-bg", M, CY0, 420, RANG_H * 4, CARTE, rx=16)
rect("step2-list-hairline", M, CY0, 420, 1.5, BLANC, rx=0.75, op="0.05")
for k, (rid, coul, droite, libelle, coul_txt) in enumerate(rangs):
    y = CY0 + k * RANG_H
    w(f'<g id="{rid}">', 3)
    # ⭐⭐ CADRE de designation (idee d Aziz, 2026-08-30) : un contour lumineux
    # dit QUELLE option l etape 1 demande. Sans lui, l interrupteur qui bascule
    # est arbitraire — le spectateur ne sait pas pourquoi CELLE-la.
    # Calque nomme et SEPARE : il s anime (apparition) sans toucher la rangee.
    # ⭐⭐ Le CADRE ne se dessine PAS ici : il doit s animer SEPAREMENT (il
    # apparait pour DESIGNER la ligne, avant que l interrupteur bascule).
    # Tant qu il vivait dans <g id="screen-two">, il arrivait avec le
    # decor et ne pouvait rien jouer — meme lecon que e2-etape-2 / e2-apercu.
    # Il est emis plus bas, en groupe de 1er niveau. On memorise juste son Y.
    if (k + 1) == OPTION_ACTIVE:
        CADRE_Y_LOCAL = y
    rect(f"{rid}-icon", M + 20, y + 23, 30, 30, coul, rx=9, ind=4)
    rect(f"{rid}-icon-mark", M + 29, y + 32, 12, 12, BLANC, rx=4, op="0.85", ind=4)
    lettrage(f"{rid}-label", libelle, 14, M + 66, y + 43, coul_txt, face=5, ind=4)
    if droite == "chevron":
        # chevron ">" en 2 barres
        px, py = M + 388, y + 38
        path(f"{rid}-chevron",
             f"M{px-4:.1f} {py-9:.1f}l2.6 -2.6 11 11 -2.6 2.6z"
             f"M{px+9.4:.1f} {py-0.6:.1f}l2.6 2.6 -11 11 -2.6 -2.6z", TXT2, ind=4)
    else:
        # emplacement d interrupteur : cadre vide (les 2 versions vivent dehors)
        rect(f"{rid}-toggle-slot", M + 348, y + 22, 58, 32, SEP, rx=16, op="0.45", ind=4)
    if k < 3:
        rect(f"{rid}-divider", M + 20, y + RANG_H - 1, 380, 1, SEP, ind=4)
    w('</g>', 3)
w('</g>', 2)

# ⭐⭐ e2-etape-2 et e2-apercu SORTENT de l'ecran (2026-08-30) : ils doivent
# etre animes SEPAREMENT pour combler les 1,8 s mortes de la fin — l'etape 2
# s'allume, PUIS la notification descend comme sa consequence. Tant qu'ils
# etaient dans <g id="screen-two">, ils apparaissaient avec le decor et
# ne pouvaient rien jouer.
w('</g>', 1)   # <- fin de ecran-reglages

# --- 5. etape 2 (groupe de PREMIER NIVEAU)
w('')
w(f'<g id="step2-step-2" transform="translate({E2X} {E2Y})">', 1)
EY = CY0 + RANG_H * 4 + 56
circ("step2-step-2-knob", M + 14, EY, 14, ACC)
# le "2"
path("step2-step-2-number",
     f"M{M+7.6:.1f} {EY-4.6:.1f}"
     f"q0.6 -4.6 6.4 -4.6 q6.2 0 6.2 5 0 3.4 -4 6.2 l-4.4 3.2 h8.6 v3.2 h-13.6 v-2.8"
     f"q6.6 -4.6 8 -6.4 1.4 -1.8 1.4 -3.2 0 -2.2 -2.4 -2.2 -2.2 0 -2.6 2.4 z", BLANC)
lettrage("step2-step-2-label", "Then the second step", 14, M + 40, EY + 5, TXT1, face=5)
w('</g>', 1)

# --- 6. apercu de notification (comble le bas, registre credible)
w('')
AY = EY + 56
w(f'<g id="step2-notification" transform="translate({E2X} {E2Y})">', 1)
w('<!-- carte d apercu : la notification telle qu elle apparaitra -->', 3)
rect("step2-notification-bg", M, AY, 420, 132, CARTE, rx=18)
rect("step2-notification-hairline", M, AY, 420, 1.5, BLANC, rx=0.75, op="0.05")
rect("step2-notification-edge-accent", M, AY + 24, 3, 84, ACC, rx=1.5)
rect("step2-notification-icon", M + 24, AY + 26, 44, 44, ACC, rx=13)
rect("step2-notification-icon-mark", M + 38, AY + 40, 16, 16, BLANC, rx=5, op="0.9")
# ⭐ l apercu montre le RESULTAT : une vraie notification, avec un des noms
# de l ecran 1 — les deux ecrans se repondent.
lettrage("step2-notification-title", "Notification title", 15, M + 84, AY + 43, TXT1, face=2)
lw_now = largeur("now", 11, face=7)
lettrage("step2-notification-heure", "now", 11, M + 396 - lw_now, AY + 42, TXT2, face=7, op=op_txt("0.8"))
lettrage("step2-notification-body-1", "Notification detail line", 12, M + 84, AY + 64, TXT2, face=7)
# ⛔ teinte SEP (#262d38) essayee ici : le texte DISPARAIT sur le fond de carte.
# Un texte secondaire descend jusqu a TXT2 attenue, jamais jusqu a la couleur des filets.
lettrage("step2-notification-body-2", "Notification second line", 12, M + 84, AY + 82,
         TXT2, face=7, op=op_txt("0.6"))
rect("step2-notification-divider", M + 24, AY + 96, 372, 1, SEP)
lettrage("step2-notification-action-1", "Open", 12, M + 24, AY + 117, ACC, face=2)
lettrage("step2-notification-action-2", "Later", 12, M + 92, AY + 117, TXT2, face=7, op=op_txt("0.75"))
w('</g>', 1)

# --- 6b. note d aide (comble l espace entre apercu et pied)
w('')
NY = AY + 132 + 40
w(f'<g id="step2-footnote" transform="translate({E2X} {E2Y})">', 1)
w('<!-- bandeau d aide discret : pastille i + 2 lignes -->', 3)
rect("step2-footnote-bg", M, NY, 420, 72, SURELEVE, rx=14, op="0.55")
rect("step2-footnote-hairline", M, NY, 420, 1.5, BLANC, rx=0.75, op="0.05")
circ("step2-footnote-knob", M + 40, NY + 36, 15, TXT2, op="0.30")
rect("step2-footnote-i-dot", M + 38.4, NY + 27, 3.2, 3.2, TXT2, rx=1.6)
rect("step2-footnote-i-stem", M + 38.4, NY + 33, 3.2, 12, TXT2, rx=1.6)
# La phrase du brief tient sur UNE ligne (216px pour 420 de large) : la couper en
# deux laissait une 2e ligne orpheline. Ligne 2 = le rappel de l ecran precedent.
lettrage("step2-footnote-line-1", "Footnote first line", 12, M + 72, NY + 32,
         TXT2, face=7, op="0.9")
lettrage("step2-footnote-line-2", "Footnote second line", 12, M + 72, NY + 50,
         TXT2, face=7, op=op_txt("0.55"))
w('</g>', 1)

# --- 7. pied d ecran : indice de progression + bouton principal
w('')
PY = 946
w(f'<g id="step2-footer" transform="translate({E2X} {E2Y})">', 1)
w('<!-- 3 pastilles de progression + bouton pleine largeur -->', 3)
circ("step2-footer-dot-1", 224, PY, 5, ACC)
circ("step2-footer-dot-2", 244, PY, 5, TXT2, op="0.45")
circ("step2-footer-dot-3", 264, PY, 5, TXT2, op="0.45")
rect("step2-footer-bouton-shadow", M, PY + 34, 420, 60, OMBRE, rx=18, op=op_ombre("0.35"))
rect("step2-footer-bouton", M, PY + 28, 420, 60, ACC, rx=18)
path("step2-footer-bouton-gloss",
     "M%d %d a18 18 0 0 1 18 -18 h384 a18 18 0 0 1 18 18"
     "h-2.5a15.5 15.5 0 0 0 -15.5 -15.5h-384a15.5 15.5 0 0 0 -15.5 15.5z" % (M, PY + 46),
     BLANC, op="0.22")
path("step2-footer-bouton-shadow-inner",
     "M%d %d a18 18 0 0 0 18 18 h384 a18 18 0 0 0 18 -18"
     "h-2.5a15.5 15.5 0 0 1 -15.5 15.5h-384a15.5 15.5 0 0 1 -15.5 -15.5z" % (M, PY + 70),
     OMBRE, op=op_ombre("0.18"))
lw_cont = largeur("Continue", 18, face=2)
lettrage("step2-footer-bouton-label", "Continue", 18, 250 - lw_cont / 2, PY + 64, BLANC, face=2)
w('</g>', 1)

   # fin ecran-reglages

# =======================================================================
# INTERRUPTEURS — 2 versions du MEME objet, 1er niveau, meme taille 58x32
# =======================================================================
# Places visuellement dans les rangees 2 et 4 de l ecran 2.
# ⭐⭐ Les 2 interrupteurs SUIVENT la rangee active (OPTION_ACTIVE).
# ⛔ Ils etaient cables en dur sur les rangees 2 et 4 : des que l option active
# changeait, le CADRE designait une ligne et l interrupteur basculait sur une
# AUTRE (vu au rendu le 2026-08-30, invisible dans les chiffres).
# off ET on partagent la meme position : c est la MEME ligne qui bascule.
# ⭐⭐ CADRE DE DESIGNATION — groupe de 1er niveau, donc ANIMABLE (idee d Aziz).
# Coordonnees absolues de planche : l ecran 2 est a translate(E2X E2Y).
w('')
w('<!-- === cadre de designation : <g> de 1er niveau, anime separement === -->')
w(f'<g id="step2-frame" transform="translate({E2X + M + 12} {E2Y + CADRE_Y_LOCAL + 8})">', 1)
w(f'<rect id="step2-frame-halo" x="0" y="0" width="396" height="{RANG_H - 16}" '
  f'rx="14" fill="{ACC}" opacity="0.10"/>', 2)
w(f'<rect id="step2-frame-stroke" x="0" y="0" width="396" height="{RANG_H - 16}" '
  f'rx="14" fill="none" stroke="{ACC}" stroke-width="2" opacity="0.95"/>', 2)
w('</g>', 1)

_RANG_ACTIF = OPTION_ACTIVE - 1
TOG_OFF_X = E2X + M + 348
TOG_OFF_Y = E2Y + CY0 + _RANG_ACTIF * RANG_H + 22
TOG_ON_X  = E2X + M + 348
TOG_ON_Y  = E2Y + CY0 + _RANG_ACTIF * RANG_H + 22

w('')
w('<!-- === Interrupteur : 2 etats dessines separement, meme boite 58x32 === -->')
w(f'<g id="step2-toggle-off" transform="translate({TOG_OFF_X} {TOG_OFF_Y})">', 1)
w('<!-- taille reelle : 58 x 32 -->', 2)
rect("step2-toggle-off-track", 0, 0, 58, 32, SEP, rx=16, ind=2)
path("step2-toggle-off-groove",
     "M0 16a16 16 0 0 1 16 -16h26a16 16 0 0 1 0 32h-26a16 16 0 0 1 -16 -16z"
     "M2 16a14 14 0 0 0 14 14h26a14 14 0 0 0 0 -28h-26a14 14 0 0 0 -14 14z",
     OMBRE, op=op_ombre("0.30"), rule="evenodd", ind=2)
circ("step2-toggle-off-knob-shadow", 16, 17.6, 12, OMBRE, op=op_ombre("0.38"), ind=2)
circ("step2-toggle-off-knob", 16, 16, 12, BLANC, ind=2)
path("step2-toggle-off-knob-bottom",
     "M4 16a12 12 0 0 0 24 0a12 12 0 0 1 -24 0z", REFLET_OFF, op="0.60", ind=2)
w('</g>', 1)

w('')
w(f'<g id="step2-toggle-on" transform="translate({TOG_ON_X} {TOG_ON_Y})">', 1)
w('<!-- taille reelle : 58 x 32 -->', 2)
rect("step2-toggle-on-track", 0, 0, 58, 32, ACC2, rx=16, ind=2)
path("step2-toggle-on-gloss",
     "M1.6 13a16 16 0 0 1 14.4 -13h26a16 16 0 0 1 14.4 13"
     "q-27.4 6 -54.8 0z", BLANC, op="0.17", ind=2)
path("step2-toggle-on-ring",
     "M0 16a16 16 0 0 1 16 -16h26a16 16 0 0 1 0 32h-26a16 16 0 0 1 -16 -16z"
     "M2 16a14 14 0 0 0 14 14h26a14 14 0 0 0 0 -28h-26a14 14 0 0 0 -14 14z",
     OMBRE, op=op_ombre("0.16"), rule="evenodd", ind=2)
circ("step2-toggle-on-knob-shadow", 42, 17.6, 12, OMBRE, op=op_ombre("0.38"), ind=2)
circ("step2-toggle-on-knob", 42, 16, 12, BLANC, ind=2)
path("step2-toggle-on-knob-bottom",
     "M30 16a12 12 0 0 0 24 0a12 12 0 0 1 -24 0z", REFLET_ON, op="0.60", ind=2)
w('</g>', 1)

# =======================================================================
# PIECE DETACHEE — bouton flottant
# =======================================================================
BF_X = 1200
BF_Y = 950
w('')
w(f'<g id="action-button" transform="translate({BF_X} {BF_Y})">', 1)
w('<!-- taille reelle : 72 x 72 -->', 2)
circ("action-button-halo", 36, 36, 36, ACC, op="0.18", ind=2)
circ("action-button-shadow", 36, 40, 33, OMBRE, op=op_ombre("0.40"), ind=2)
circ("action-button-body", 36, 36, 33, ACC, ind=2)
path("action-button-gloss",
     "M3 36a33 33 0 0 1 66 0a33 33 0 0 0 -66 0z", BLANC, op="0.16", ind=2)
# fleche vers la droite : hampe + pointe
path("action-button-arrow",
     "M21 32.6h17.4l-6.6-6.6a3.4 3.4 0 0 1 4.8-4.8l12.4 12.4"
     "a3.4 3.4 0 0 1 0 4.8l-12.4 12.4a3.4 3.4 0 0 1-4.8-4.8l6.6-6.6"
     "h-17.4a3.4 3.4 0 0 1 0-6.8z", BLANC, ind=2)
w('</g>', 1)

w('</svg>')

SORTIE.parent.mkdir(parents=True, exist_ok=True)
SORTIE.write_text("\n".join(L) + "\n", encoding="utf-8")
print("ecrit :", SORTIE, len("\n".join(L)), "octets")
