# ADR-003 — Deux tokens JWT distincts pour n8n

**Date :** 2026-05-10  
**Statut :** Accepté

## Contexte

n8n génère deux types de tokens JWT avec des audiences différentes, pour deux usages distincts.

## Décision

Deux variables dans `.env` :

| Variable | Audience JWT | Usage |
|---|---|---|
| `N8N_API_KEY` | `public-api` | API REST n8n (CRUD workflows via HTTP) |
| `N8N_MCP_KEY` | `mcp-server-api` | Endpoint MCP `/mcp-server/http` |

Le token MCP se génère depuis n8n → Settings → MCP Server (onglet dédié, distinct de l'onglet API).

## Conséquences

- Utiliser `N8N_API_KEY` sur l'endpoint MCP retourne `{"message":"Unauthorized"}`
- Le bridge utilise `N8N_MCP_KEY`
- Les éventuels scripts REST utilisent `N8N_API_KEY`
