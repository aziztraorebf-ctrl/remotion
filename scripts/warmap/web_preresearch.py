"""
warmap/web_preresearch.py — Step 2 (PRE-RESEARCH, web). STUB / interface.

Cheap context-gathering BEFORE paid LLM synthesis: gather press articles + local
communiques at the jalon dates to validate WHY a front moved. Planned backends:
  - Firecrawl MCP (firecrawl_search / firecrawl_scrape) -- already connected as MCP server
  - Tavily (needs TAVILY_API_KEY, absent) -- optional
  - WebSearch / WebFetch (Claude-side, used at planning time)

This session: no-op (returns {}). The orchestrator tolerates an empty result. When
implemented, return: { "YYYY-MM-DD": [ {title, url, excerpt, source}, ... ] }.
NO emojis (code file).
"""


def gather(jalon_dates):
    """STUB. Return per-date article lists once a backend is wired."""
    if jalon_dates:
        print(f"[preresearch] STUB: would gather articles for {len(jalon_dates)} dates")
    return {}
