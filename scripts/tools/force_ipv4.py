"""
force_ipv4.py — monkeypatch socket.getaddrinfo pour ne renvoyer que de l'IPv4.

Root cause (confirmée 2026-07-05, re-confirmée 2026-07-18) : la route IPv6 sortante est TOTALEMENT
morte dans ce sandbox. getaddrinfo() renvoie l'IPv6 en premier, et les clients HTTP Python (google-genai,
requests, urllib, httpx) n'ont PAS de fallback rapide type Happy Eyeballs — la connexion reste pendue
bien au-delà du timeout= déclaré. curl gère un vrai happy-eyeballs et bascule vite sur IPv4, d'où la
différence de comportement entre un test curl (rapide) et un appel Python (bloqué indéfiniment).

Détail complet : memory/tools/yt-dlp.md.

USAGE — importer en TOUTE PREMIÈRE LIGNE (avant tout autre import réseau) :
    import force_ipv4  # noqa: F401  (side-effect import, patch socket au chargement)

Idempotent — sans effet si déjà importé/patché ailleurs dans le process.
"""
import socket

if not getattr(socket, "_force_ipv4_patched", False):
    _orig_getaddrinfo = socket.getaddrinfo

    def _ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
        return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)

    socket.getaddrinfo = _ipv4_only
    socket._force_ipv4_patched = True
