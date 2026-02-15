#!/usr/bin/env bash
# Evaluate video script via OpenAI GPT-4o API
# Output: jury-gpt4o.md

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
OUTPUT_FILE="$SCRIPT_DIR/jury-gpt4o.md"

# Load API key from .env
if [[ ! -f "$PROJECT_ROOT/.env" ]]; then
  echo "ERROR: .env file not found at $PROJECT_ROOT/.env"
  exit 1
fi

OPENAI_API_KEY=$(grep '^OPENAI_API_KEY=' "$PROJECT_ROOT/.env" | cut -d'=' -f2- | tr -d '"' | tr -d "'")

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "ERROR: OPENAI_API_KEY not found in .env"
  exit 1
fi

echo "Sending evaluation request to GPT-4o..."

RESPONSE=$(curl -s -w "\n%{http_code}" \
  https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 4000,
  "messages": [
    {
      "role": "system",
      "content": "Tu es un expert en scriptwriting YouTube educatif. Tu evalues des scripts pour des videos animees de 5 minutes destinees a un public francophone curieux (25-45 ans). Ton role est d'\''evaluer la COHERENCE NARRATIVE, la CLARTE du fil rouge, le RYTHME des segments, et le TON general."
    },
    {
      "role": "user",
      "content": "CONTEXTE : Nous produisons une video YouTube educative animee de 5 minutes en style pixel art '\''Terminal Tactique Medieval'\''. Audience : francophones curieux 25-45 ans. Ton : Provocateur. Le script inclut des marqueurs TTS (MAJUSCULES = emphasis, ... = pauses, -- = breaks de ton) et des presets de voix par scene (dramatic, narrator, conversational, calm).\n\nVoici le script complet :\n\n---\nHOOK (0:00 - 0:13)\n\n1347... La MOITIE de l'\''Europe va mourir.\n\nMais cette video ne parle pas de la maladie.\n\nElle parle de ce que les HUMAINS ont fait... quand ils ont cru que c'\''etait la fin du monde.\n\nSEGMENT 1 : Les Flagellants (0:13 - 0:55)\n\nDes foules de centaines -- parfois DIX MILLE personnes -- traversent l'\''Europe en se fouettant jusqu'\''au sang.\n\nIls s'\''appellent les Freres de la Croix. Trente-trois jours et demi de marche... un pour chaque annee de la vie du Christ.\n\nTrois seances par jour. A genoux. En croix. Avec des fouets garnis de pointes de fer.\n\nLeur logique ? Dieu punit l'\''humanite par la peste. Donc il faut souffrir PLUS... pour qu'\''il arrete.\n\nSpoiler... ca n'\''a pas marche.\n\nCa a meme EMPIRE ! Parce que ces processions... propageaient la peste encore plus vite.\n\nSEGMENT 2 : Les Boucs Emissaires (0:55 - 1:50)\n\nQuand les humains ont peur et ne comprennent pas... ils cherchent quelqu'\''un a blamer.\n\nEn 1349, la rumeur se repand -- les Juifs empoisonnent les puits.\n\nA Strasbourg, le quatorze fevrier 1349 -- jour de la Saint-Valentin -- on brule deux mille personnes sur un cimetiere.\n\nA Mayence... six mille en un seul jour.\n\nAu total, trois cent cinquante pogroms. Des communautes entieres... effacees.\n\nLe plus tordu ? Les elites locales savaient que c'\''etait faux. Mais elles devaient de l'\''argent aux preteurs juifs. Alors elles ont laisse faire le massacre... et les dettes ont disparu avec les victimes.\n\nSEGMENT 3 : La Fuite des Elites (1:50 - 2:15)\n\nPendant que les pauvres meurent dans les rues... les riches font leurs valises.\n\nA Florence, Boccaccio decrit des nobles qui partent s'\''installer a la campagne... pour boire du vin et raconter des histoires.\n\nPendant ce temps, la mortalite chez les pauvres est DEUX FOIS plus elevee que chez les riches.\n\nCa vous rappelle quelque chose ?\n\nJets prives, iles privees, confinement en villa... Meme pandemie. Meme reflexe. Six siecles plus tard.\n\nSEGMENT 4 : Les Remedes (2:15 - 2:45)\n\nEt la medecine ? -- Encore pire.\n\nLes medecins de peste portent un masque a bec... rempli de fleurs et de vinaigre.\n\nLeur theorie ? La maladie vient du mauvais air. Donc si ca sent bon... ca guerit.\n\nAutres remedes -- poser un cul de poulet sur les bubons. Boire du vinaigre a l'\''ail... le Vinaigre des Quatre Voleurs. Ou mon prefere -- vivre volontairement dans les egouts, en pensant que la puanteur repousserait la peste.\n\nSEGMENT 5 : Le Miroir (2:45 - 3:20)\n\nAlors... Recapitulons.\n\n1349 -- flagellants qui se torturent. 2020 -- antivax qui boivent de la javel.\n\n1349 -- on brule des Juifs accuses d'\''empoisonner les puits. 2020 -- on attaque des Asiatiques accuses d'\''avoir cree le virus.\n\n1349 -- les riches fuient a la campagne. 2020 -- les riches fuient en jet prive.\n\n1349 -- on pose un poulet sur les bubons. 2020 -- on avale de l'\''ivermectine pour chevaux.\n\nSix cent soixante-treize ans d'\''ecart... Et le script humain... n'\''a pas change d'\''une seule ligne.\n\nLa prochaine pandemie arrivera... Et TOI... tu reagiras comment ?\n---\n\nEvalue ce script selon les criteres suivants :\n\n1. COHERENCE NARRATIVE : Le fil rouge est-il clair du debut a la fin ? Le spectateur comprend-il le message principal ?\n2. RYTHME : Les segments sont-ils bien equilibres ? Y a-t-il des moments plats ou des accelerations mal placees ?\n3. TON : Le ton provocateur est-il bien dose ? Trop agressif ? Pas assez ? Des passages qui risquent de faire decrocher le spectateur ?\n4. TRANSITIONS : Les enchainements entre segments sont-ils fluides ?\n5. HOOK : Le hook retient-il l'\''attention dans les 5 premieres secondes ?\n6. CTA : La question finale est-elle efficace ?\n7. RISQUES : Y a-t-il des formulations qui pourraient etre controversees, mal interpretees, ou qui feraient fuir une partie de l'\''audience ?\n8. SUGGESTIONS : 3 ameliorations concretes avec texte de remplacement propose.\n\nReponds en francais. Sois direct et critique, pas complaisant."
    }
  ]
}')

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [[ "$HTTP_CODE" -ne 200 ]]; then
  echo "ERROR: API returned HTTP $HTTP_CODE"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  exit 1
fi

# Extract content from response
CONTENT=$(echo "$BODY" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data['choices'][0]['message']['content'])
")

# Write to markdown file
{
  echo "# Evaluation du Script - GPT-4o"
  echo ""
  echo "> Genere le $(date '+%Y-%m-%d a %H:%M') via OpenAI GPT-4o"
  echo "> Projet : Peste 1347 - Terminal Tactique Medieval (Pixel Art)"
  echo ""
  echo "---"
  echo ""
  echo "$CONTENT"
} > "$OUTPUT_FILE"

echo "Evaluation saved to: $OUTPUT_FILE"
echo "Token usage:"
echo "$BODY" | python3 -c "
import sys, json
data = json.load(sys.stdin)
u = data.get('usage', {})
print(f\"  Prompt: {u.get('prompt_tokens', '?')} tokens\")
print(f\"  Completion: {u.get('completion_tokens', '?')} tokens\")
print(f\"  Total: {u.get('total_tokens', '?')} tokens\")
"
