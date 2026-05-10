# ADR-002 — Bridge stdio custom pour le MCP n8n

**Date :** 2026-05-10  
**Statut :** Accepté

## Contexte

Le serveur MCP de n8n utilise le transport HTTP streamable mais n'implémente que le mode "response" (POST → réponse directe). Il ne supporte pas le flux SSE GET sur le même endpoint.

Claude Code ne supporte pas `"type": "http"` + `headers` dans `.mcp.json` (rejeté par le schéma).

## Décision

Un bridge Node.js minimal (`scripts/n8n-mcp-bridge.mjs`) traduit le protocole stdio MCP en simples requêtes POST HTTP vers n8n, sans tenter d'ouvrir de flux SSE.

Le bridge :
- Lit le `.env` lui-même (indépendant de direnv)
- Ignore les notifications MCP (pas de réponse attendue)
- Parse les réponses n8n au format SSE (`data: {...}`) et les écrit en JSON-RPC sur stdout

## Alternatives rejetées

- **supergateway** → crash silencieux après l'initialisation car tente d'ouvrir un flux SSE (GET 404)
- **Transport HTTP natif Claude Code** (`url` + `headers`) → format rejeté par le schéma `.mcp.json`
- **Token `public-api`** → endpoint MCP requiert `aud: mcp-server-api`

## Conséquences

- Dépendance à Node.js (disponible sur le système)
- Le bridge est un fichier simple, facile à maintenir
- Pas de dépendances npm supplémentaires (utilise `fetch` natif Node 18+)
