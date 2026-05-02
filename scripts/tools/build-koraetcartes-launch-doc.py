"""
Build the consolidated launch document for Kora & Cartes.
Mobile-first HTML page with everything Aziz needs to launch the channel:
- Final identity (logo + banner)
- Brand system (palette, typography)
- Bios + descriptions for all 3 platforms
- Step-by-step account creation
- Postiz + AgentMail setup
- Strategy + revenue + metrics
Uploads to Vercel Blob.
"""

import os
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

TOKEN = os.environ["BLOB_READ_WRITE_TOKEN"]
SRC = ROOT / "branding" / "koraetcartes"
FOLDER = "koraetcartes/launch-doc"
BASE = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com"


def upload(data: bytes, pathname: str, content_type: str) -> str:
    r = requests.put(
        f"https://blob.vercel-storage.com/{pathname}",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "x-content-type": content_type,
            "x-api-version": "7",
            "x-cache-control-max-age": "31536000",
            "x-add-random-suffix": "0",
            "x-allow-overwrite": "1",
        },
        data=data,
    )
    if r.status_code not in (200, 201):
        raise RuntimeError(f"Upload failed: {r.status_code} {r.text[:300]}")
    return r.json()["url"]


def main():
    print("Uploading final assets...")
    logo_url = upload(
        (SRC / "logo-C-monogramme-KC-v2.png").read_bytes(),
        f"{FOLDER}/logo-final.png",
        "image/png",
    )
    banner_url = upload(
        (SRC / "banner-A-carte-stylisee.png").read_bytes(),
        f"{FOLDER}/banner-final.png",
        "image/png",
    )
    print(f"  Logo: {logo_url}")
    print(f"  Banner: {banner_url}")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M EDT")

    page = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kora &amp; Cartes — Document de lancement</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0D1B3D;
  color: #F5F1E8;
  padding: 20px 16px 80px;
  max-width: 760px;
  margin: 0 auto;
  line-height: 1.65;
  font-size: 16px;
}}
h1 {{
  font-size: 32px;
  margin-bottom: 8px;
  color: #F5F1E8;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
}}
.tagline {{
  color: #B87333;
  font-style: italic;
  font-size: 17px;
  margin-bottom: 24px;
}}
.meta {{
  color: #8a93a8;
  font-size: 13px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #1a2a52;
}}
h2 {{
  font-size: 22px;
  color: #B87333;
  margin: 40px 0 16px;
  border-left: 3px solid #B87333;
  padding-left: 12px;
  font-family: Georgia, serif;
}}
h3 {{
  font-size: 17px;
  color: #F5F1E8;
  margin: 20px 0 10px;
  font-family: Georgia, serif;
}}
h4 {{
  font-size: 15px;
  color: #B87333;
  margin: 16px 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}}
p {{ margin-bottom: 12px; }}
strong {{ color: #F5F1E8; }}
em {{ color: #c4cce0; }}
ul, ol {{ padding-left: 22px; margin-bottom: 14px; }}
li {{ margin-bottom: 6px; color: #d8dfee; }}
.card {{
  background: #0a1530;
  border: 1px solid #1a2a52;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 18px;
}}
.card-copper {{
  background: #B87333;
  color: #0D1B3D;
  border: none;
}}
.card-copper h3, .card-copper strong {{ color: #0D1B3D; }}
.card-copper li {{ color: #1a1a1a; }}
img.asset {{
  width: 100%;
  height: auto;
  border-radius: 10px;
  background: #fff;
  display: block;
  margin: 12px 0;
}}
.palette {{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 12px 0;
}}
.swatch {{
  border-radius: 8px;
  padding: 14px 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  font-family: 'SF Mono', Menlo, monospace;
}}
.sw-indigo {{ background: #0D1B3D; color: #F5F1E8; border: 1px solid #1a2a52; }}
.sw-copper {{ background: #B87333; color: #0D1B3D; }}
.sw-cream {{ background: #F5F1E8; color: #0D1B3D; }}
.sw-black {{ background: #0A0A0A; color: #F5F1E8; }}
table {{
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 12px 0;
}}
th, td {{
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid #1a2a52;
  vertical-align: top;
}}
th {{ color: #B87333; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }}
td {{ color: #d8dfee; }}
code {{
  background: #1a2a52;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 13px;
  color: #F5F1E8;
}}
pre {{
  background: #1a2a52;
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #e8e8e8;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 10px 0;
}}
.toc {{
  background: #0a1530;
  border: 1px solid #1a2a52;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 24px 0;
}}
.toc a {{
  display: block;
  color: #B87333;
  text-decoration: none;
  padding: 4px 0;
  font-size: 14px;
}}
.toc a:hover {{ color: #F5F1E8; }}
.checkbox {{
  list-style: none;
  padding-left: 0;
}}
.checkbox li {{
  padding: 6px 0 6px 28px;
  position: relative;
}}
.checkbox li::before {{
  content: '☐';
  position: absolute;
  left: 0;
  color: #B87333;
  font-size: 18px;
}}
.warning {{
  background: rgba(184, 115, 51, 0.15);
  border-left: 3px solid #B87333;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 14px;
  margin: 12px 0;
}}
hr {{
  border: none;
  border-top: 1px solid #1a2a52;
  margin: 30px 0;
}}
</style>
</head>
<body>

<h1>Kora &amp; Cartes</h1>
<p class="tagline">Cartes animées et héros oubliés. Ce que l'école n'a pas raconté.</p>
<p class="meta">Document de lancement — {timestamp}<br>
Statut : tout pré-validé, prêt pour exécution quand tu seras devant ordi + mobile.</p>

<div class="toc">
  <strong style="font-size: 13px; color: #B87333; text-transform: uppercase; letter-spacing: 0.5px;">Sommaire</strong>
  <a href="#identity">1. Identité finale</a>
  <a href="#brand">2. Système graphique</a>
  <a href="#bios">3. Bios &amp; descriptions</a>
  <a href="#strategy">4. Stratégie &amp; revenue</a>
  <a href="#accounts">5. Création des comptes</a>
  <a href="#postiz">6. Postiz (automatisation)</a>
  <a href="#agentmail">7. AgentMail (email)</a>
  <a href="#checklist">8. Checklist finale</a>
  <a href="#metrics">9. Métriques à suivre</a>
</div>

<h2 id="identity">1. Identité finale</h2>

<div class="card">
  <h3>Logo (avatar 1080×1080)</h3>
  <img class="asset" src="{logo_url}" alt="Logo Kora & Cartes" />
  <p style="font-size: 14px; color: #c4cce0;">Monogramme K&amp;C ornemental, palette indigo/cuivre, wordmark Playfair Display.<br>
  Usage : avatar YouTube, Instagram, TikTok. Source : <code>logo-final.png</code></p>
</div>

<div class="card">
  <h3>Bannière YouTube (2560×1440)</h3>
  <img class="asset" src="{banner_url}" alt="Bannière Kora & Cartes" />
  <p style="font-size: 14px; color: #c4cce0;">Carte stylisée Afrique + routes commerciales en cuivre + tagline + cadence.<br>
  Usage : bannière chaîne YouTube. Source : <code>banner-final.png</code></p>
</div>

<table>
  <tr><th>Item</th><th>Valeur</th></tr>
  <tr><td>Nom de chaîne</td><td><strong>Kora &amp; Cartes</strong></td></tr>
  <tr><td>Handle uniforme</td><td><code>@koraetcartes</code></td></tr>
  <tr><td>Tagline canonique</td><td>Cartes animées et héros oubliés. Ce que l'école n'a pas raconté.</td></tr>
  <tr><td>Pays</td><td>Canada</td></tr>
  <tr><td>Langue principale</td><td>Français</td></tr>
  <tr><td>Catégorie YouTube</td><td>Education</td></tr>
</table>

<h2 id="brand">2. Système graphique</h2>

<h4>Palette</h4>
<div class="palette">
  <div class="swatch sw-indigo">Indigo nuit<br>#0D1B3D</div>
  <div class="swatch sw-copper">Cuivre brossé<br>#B87333</div>
  <div class="swatch sw-cream">Crème<br>#F5F1E8</div>
  <div class="swatch sw-black">Noir profond<br>#0A0A0A</div>
</div>

<h4>Typographie</h4>
<table>
  <tr><th>Usage</th><th>Police</th></tr>
  <tr><td>Wordmark, titres</td><td><strong>Playfair Display</strong> (Bold pour le nom, Regular pour titres secondaires)</td></tr>
  <tr><td>Texte courant, overlays vidéo</td><td><strong>Inter</strong> (Medium pour corps, SemiBold pour emphase)</td></tr>
</table>

<h2 id="bios">3. Bios &amp; descriptions</h2>

<h3>Description YouTube (à coller dans Channel customization → Description)</h3>
<pre>Cartes animées et héros oubliés. Ce que l'école n'a pas raconté.

De Mansa Moussa à Tombouctou, de Sundjata à Abou Bakari II — et au-delà. Chaque épisode raconte un empire, une figure, une route commerciale ou une invention que l'histoire officielle a laissés dans l'ombre.

On utilise la cartographie animée et le récit narratif pour rendre vivant ce que les manuels ont rendu plat. Si tu aimes Vox, Johnny Harris, Kurzgesagt ou les documentaires animés en général, tu es au bon endroit.

L'Afrique est notre terrain principal — parce qu'il est le plus injustement raconté — mais l'histoire qu'on déterre est celle du monde entier qui s'y est joué : commerce transsaharien, routes de l'or, sciences arabes, exploration océanique.

Format Shorts (épisodes courts, faits-clés) + format long (récits approfondis).
Nouveau contenu chaque semaine.

NEWSLETTER
Une sélection quotidienne de l'actualité africaine — politique, économie, culture, sciences. Les nouvelles qui comptent, choisies à la main, livrées dans ta boîte mail. (Lien bientôt disponible.)

Pour qui : la diaspora, les curieux d'histoire mondiale, les passionnés de cartographie, et tous ceux qui sentent qu'il manque quelque chose au récit qu'on leur a transmis.</pre>

<h3>Mots-clés YouTube (Settings → Channel → Keywords)</h3>
<pre>histoire mondiale, civilisations anciennes, empires, géographie historique, cartes animées, vulgarisation histoire, documentaire animé, history, world history, lost civilizations, animated maps, geographic history, mansa moussa, tombouctou, sundjata, abou bakari, empires africains, mali empire, songhai, africa history, historical maps, route commerciale, sahara, héros oubliés, forgotten history, animated documentary, education history, géopolitique, panafricanisme, diaspora</pre>

<h3>Bio Instagram (134 caractères)</h3>
<pre>Cartes animées &amp; héros oubliés
L'histoire que l'école n'a pas racontée
Empires d'Afrique, figures, routes
Nouveau Short chaque semaine</pre>

<h3>Bio TikTok (74 caractères)</h3>
<pre>Cartes animées &amp; héros oubliés
L'histoire que l'école n'a pas dite</pre>

<h2 id="strategy">4. Stratégie &amp; revenue</h2>

<div class="card">
  <h3>Phase 1 : Shorts-first (3 premiers mois)</h3>
  <p>Valider l'intérêt avant d'investir dans le Long-form qui coûte 3-4× plus en production. Les 3 Shorts existants (Sonjata, Thiaroye, Abou Bakari II) sont la base. Cadence cible : <strong>2 Shorts/semaine</strong> sur les 3 plateformes.</p>
</div>

<div class="card">
  <h3>Phase 2 : Long-form (mois 4+, si validation)</h3>
  <p>Si métriques M3 ≥ 50% des objectifs YouTube : déclencher production Mansa Moussa Long-form 8-12min en horizontal 16:9. Le Long-form est où l'argent réel est fait (RPM 10-50× supérieur aux Shorts).</p>
</div>

<h3>Hiérarchie revenue (objectif 12 mois)</h3>
<ol>
  <li><strong>YouTube Long-form Ad Revenue</strong> — la vraie goldmine</li>
  <li><strong>Newsletter monétisée</strong> (Substack paid tier ou sponsoring)</li>
  <li><strong>YouTube Shorts Ad Revenue</strong> (secondaire mais stable)</li>
  <li><strong>Patreon</strong> (à activer à 5K subs)</li>
  <li><strong>Brand deals / sponsorings ciblés</strong> (à 50K+ subs)</li>
  <li><strong>IG Subscriptions + Bonuses</strong> (à 10K+ followers IG)</li>
  <li><strong>TikTok</strong> = canal de visibilité, <em>pas de revenue direct attendu</em> (Canada non éligible Creator Rewards en 2026)</li>
</ol>

<div class="warning">
<strong>⚠️ Action concrète Phase 1 :</strong> qualifier pour le <strong>Breakthrough Bonus Instagram</strong> (jusqu'à $5000) en faisant 20 Facebook Reels + 10 IG Reels en 30 jours. Cross-poster les YouTube Shorts → IG/FB coche la case quasi automatiquement.
</div>

<h2 id="accounts">5. Création des comptes</h2>

<h4>Pré-requis</h4>
<ul class="checkbox">
  <li>Adresse Gmail dédiée créée : <code>koraetcartes@gmail.com</code> (ou variante)</li>
  <li>2-Step Verification activée sur ce Gmail (REQUIS pour YouTube Partner Program)</li>
  <li>Logo final téléchargé (1080×1080)</li>
  <li>Bannière finale téléchargée (2560×1440)</li>
  <li>Téléphone disponible pour vérification SMS</li>
</ul>

<h3>Étape 1 : YouTube (web, ~20 min)</h3>
<ol>
  <li>Aller sur <code>youtube.com</code>, se connecter avec <code>koraetcartes@gmail.com</code></li>
  <li>Avatar Google → <strong>Créer une chaîne</strong> → Nom personnalisé : <code>Kora &amp; Cartes</code></li>
  <li><strong>YouTube Studio → Personnalisation</strong> :
    <ul>
      <li>Image de marque : photo de profil (logo 1080×1080) + bannière (2560×1440) + filigrane vidéo</li>
      <li>Informations de base : nom, handle <code>@koraetcartes</code>, description (coller bloc 3), email contact (AgentMail à venir)</li>
    </ul>
  </li>
  <li><strong>Paramètres généraux</strong> :
    <ul>
      <li>Pays : <strong>Canada</strong></li>
      <li>Mots-clés : coller la liste du bloc 3</li>
      <li>Audience : <strong>Non, cette chaîne n'est pas conçue pour les enfants</strong></li>
    </ul>
  </li>
  <li>Activer <strong>2-Step Verification</strong> (Settings Google) — REQUIS</li>
  <li>Demander accès aux <strong>fonctionnalités avancées</strong> (vérification téléphone) → permet vidéos &gt;15 min</li>
</ol>

<h3>Étape 2 : Instagram (mobile, ~10 min)</h3>
<ol>
  <li>App Instagram → Se déconnecter du compte perso</li>
  <li>Créer un nouveau compte avec <code>koraetcartes@gmail.com</code>, username <code>koraetcartes</code></li>
  <li><strong>Paramètres → Compte → Passer en compte professionnel</strong></li>
  <li>Choisir <strong>Créateur</strong> (PAS Business — Créateur a meilleur reach pour contenu non-commercial)</li>
  <li>Catégorie : <strong>Éducation</strong> ou <strong>Personnage public</strong> ou <strong>Créateur de contenu vidéo</strong></li>
  <li>Modifier le profil : photo (logo), nom <code>Kora &amp; Cartes</code>, bio (coller bloc 3), site web vide pour l'instant</li>
  <li><strong>Lier à une page Facebook</strong> (recommandé pour Breakthrough Bonus + cross-posting). Si pas de page FB, en créer une en parallèle (5 min)</li>
</ol>

<h3>Étape 3 : TikTok (mobile, ~10 min)</h3>
<ol>
  <li>App TikTok → Se déconnecter du compte perso</li>
  <li>Créer un compte avec <code>koraetcartes@gmail.com</code>, username <code>koraetcartes</code></li>
  <li><strong>Paramètres → Compte → Passer à un compte Business</strong> (REQUIS pour scheduling Postiz + analytics)</li>
  <li>Catégorie Business : <strong>Education</strong></li>
  <li>Région : <strong>Canada</strong></li>
  <li>Modifier le profil : photo (logo), nom <code>Kora &amp; Cartes</code>, bio (coller bloc 3)</li>
</ol>

<h2 id="postiz">6. Postiz (automatisation)</h2>

<h4>Étape 1 : Création compte (~5 min)</h4>
<ol>
  <li>Aller sur <code>postiz.com</code> → Sign up avec <code>koraetcartes@gmail.com</code></li>
  <li>Choisir le plan <strong>Standard $29/mois</strong> (5 channels, 400 posts/mois, API publique, 2 webhooks)</li>
  <li>Compléter informations de facturation</li>
</ol>

<h4>Étape 2 : Connexion comptes (~10 min)</h4>
<p>Dans Postiz, <strong>Settings → Channels → Connect</strong> :</p>
<ul>
  <li>YouTube : OAuth via <code>koraetcartes@gmail.com</code></li>
  <li>Instagram : OAuth via Facebook Business (page FB liée)</li>
  <li>TikTok : OAuth via compte Business TikTok</li>
</ul>

<h4>Étape 3 : Test (~5 min)</h4>
<ol>
  <li>Créer un post draft programmé sur les 3 plateformes (image placeholder + texte test)</li>
  <li>Programmer pour 5 min plus tard</li>
  <li>Vérifier que le post arrive bien sur les 3 plateformes</li>
  <li>Supprimer le post test</li>
</ol>

<h4>Étape 4 : Cadence (time slots)</h4>
<table>
  <tr><th>Plateforme</th><th>Slots</th></tr>
  <tr><td>YouTube</td><td>Mardi 18h, Vendredi 18h</td></tr>
  <tr><td>Instagram</td><td>Mardi 19h, Vendredi 19h, Dimanche 11h</td></tr>
  <tr><td>TikTok</td><td>Mardi 20h, Vendredi 20h, Dimanche 14h</td></tr>
</table>

<h2 id="agentmail">7. AgentMail (email infrastructure)</h2>

<h4>Étape 1 : Création inbox (~5 min)</h4>
<ol>
  <li>Se connecter à AgentMail (compte existant)</li>
  <li><strong>Create new inbox</strong> : <code>koraetcartes</code> (ou domaine custom si configuré)</li>
  <li>Configuration : webhooks/parsing désactivés pour l'instant (lecture humaine via dashboard web)</li>
</ol>

<h4>Étape 2 : Liaison comptes (~10 min)</h4>
<p>Pour chaque compte créé en bloc 5, changer email contact = adresse AgentMail :</p>
<ul>
  <li>YouTube Studio → Settings → General</li>
  <li>Instagram → Edit Profile → Contact Options</li>
  <li>TikTok → Edit Profile → Email</li>
  <li>Postiz → Account → Email notifications</li>
</ul>

<h4>Étape 3 : Habitude quotidienne</h4>
<p><strong>5 min/jour</strong> sur le dashboard AgentMail web : digests YouTube (commentaires, sub milestones), notifs Instagram, notifs TikTok, notifs Postiz (échecs publication).</p>

<h2 id="checklist">8. Checklist finale avant 1<sup>er</sup> Short</h2>

<div class="card card-copper">
<ul class="checkbox" style="color: #0D1B3D;">
  <li>YouTube : chaîne créée, avatar + bannière uploadés, description + mots-clés en place</li>
  <li>YouTube : 2-Step Verification activée, fonctionnalités avancées débloquées</li>
  <li>Instagram : compte Créateur, avatar, bio, lié à page FB</li>
  <li>TikTok : compte Business Canada, avatar, bio</li>
  <li>Postiz : compte Standard $29 créé, 3 plateformes connectées, test post réussi</li>
  <li>AgentMail : inbox créée, liée aux 4 comptes (YT + IG + TikTok + Postiz)</li>
  <li>Sonjata Short prêt en .mp4 vertical 1080×1920 ≤180s</li>
  <li>Sonjata Short : titre + description + hashtags rédigés</li>
  <li>Cover/thumbnail Sonjata créée (1080×1920)</li>
</ul>
</div>

<h2 id="metrics">9. Métriques à suivre (semaine 1 → mois 3)</h2>

<table>
  <tr><th>Métrique</th><th>S1</th><th>M1</th><th>M3</th></tr>
  <tr><td>Subs YouTube</td><td>50</td><td>500</td><td>2000</td></tr>
  <tr><td>Followers Instagram</td><td>50</td><td>300</td><td>1000</td></tr>
  <tr><td>Followers TikTok</td><td>100</td><td>1000</td><td>5000</td></tr>
  <tr><td>Vues / Short</td><td>500-2K</td><td>2K-10K</td><td>10K-50K</td></tr>
  <tr><td>Watch time YouTube</td><td>50h</td><td>500h</td><td>2000h</td></tr>
</table>

<div class="warning">
<strong>Décision M3</strong> :<br>
• Si &lt; 50% des objectifs YouTube → revoir stratégie (titres, thumbnails, cadence, sujets)<br>
• Si ≥ 50% des objectifs YouTube → déclencher production <strong>Mansa Moussa Long-form 8-12 min</strong>
</div>

<h2>Cadence phase 1 (3 premiers mois)</h2>
<table>
  <tr><th>Semaine</th><th>Mardi</th><th>Vendredi</th></tr>
  <tr><td>S1</td><td>Sonjata</td><td>Thiaroye</td></tr>
  <tr><td>S2</td><td>Abou Bakari II partie 1</td><td>Abou Bakari II partie 2</td></tr>
  <tr><td>S3</td><td>Mansa Moussa partie 1</td><td>Mansa Moussa partie 2</td></tr>
  <tr><td>S4-S12</td><td colspan="2">Nouveaux Shorts à produire (cadence 2/semaine)</td></tr>
</table>

<hr>

<p style="text-align: center; color: #6e7896; font-size: 13px; margin-top: 40px;">
Document généré {timestamp}<br>
Tous les éléments validés. Prêt pour exécution.
</p>

</body>
</html>
"""

    page_url = upload(page.encode("utf-8"), f"{FOLDER}/index.html", "text/html; charset=utf-8")
    print()
    print("=" * 70)
    print(f"LAUNCH DOC: {page_url}")
    print("=" * 70)


if __name__ == "__main__":
    main()
