# Post-Mortem — Connexion MCP n8n

**Date :** 2026-05-10  
**Durée de résolution :** ~2h (plusieurs sessions)  
**Statut :** Résolu

---

## Problèmes rencontrés (chronologique)

### 1. `mcpServers` rejeté dans `settings.json`
**Symptôme :** Erreur de validation au démarrage de Claude Code.  
**Cause :** Le champ `mcpServers` n'existe pas dans le schéma de `settings.json`.  
**Fix :** Utiliser `.mcp.json` à la racine du projet.

### 2. `mcp.json` ignoré (sans point)
**Symptôme :** Le serveur n'apparaît pas dans `/mcp`.  
**Cause :** Claude Code lit `.mcp.json` (avec point), pas `mcp.json`.  
**Fix :** Renommer en `.mcp.json`.

### 3. Format `url` + `headers` rejeté dans `.mcp.json`
**Symptôme :** `[Failed to parse] Does not adhere to MCP server configuration schema`.  
**Cause :** Claude Code ne supporte pas ce format dans `.mcp.json` (même avec `"type": "http"`).  
**Fix :** Passer par une commande stdio (`command` + `args`).

### 4. Serveur marqué "failed" avec supergateway
**Symptôme :** `/mcp` affiche `✘ failed`, reconnect ne fonctionne pas.  
**Cause :** Deux sous-problèmes :
- Token `N8N_AI_KEY` (`aud: public-api`) rejeté par l'endpoint MCP → `{"message":"Unauthorized"}`
- Même avec le bon token, supergateway crashe après l'initialisation car il tente d'ouvrir un flux SSE (GET sur le même endpoint) → 404

**Diagnostic :** Test curl avec `Accept: application/json, text/event-stream` → réponse SSE valide. Test supergateway manuel → initialisation OK puis crash SSE.

**Fix :** Bridge Node.js custom qui fait de simples POST sans SSE.

### 5. Variable d'environnement non disponible au démarrage
**Symptôme :** Le wrapper script échoue avec `N8N_MCP_KEY non défini`.  
**Cause :** Claude Code ne lance pas direnv avant de démarrer les process MCP.  
**Fix :** Le bridge lit lui-même le fichier `.env` via `readFileSync`.

---

## Solution finale

```
.mcp.json → command: node scripts/n8n-mcp-bridge.mjs
scripts/n8n-mcp-bridge.mjs → lit .env, POST vers n8n, parse SSE response, écrit JSON-RPC sur stdout
.env → N8N_MCP_KEY (aud: mcp-server-api, généré depuis Settings → MCP Server dans n8n)
```

## Leçons

- Toujours tester l'endpoint MCP directement avec curl avant de déboguer le client
- n8n implémente le mode "response" du streamable HTTP, pas le flux SSE GET
- Deux tokens JWT n8n distincts : API REST (`public-api`) vs MCP (`mcp-server-api`)
- Claude Code ne supporte pas le transport HTTP natif avec headers dans `.mcp.json`
