# ADR-001 — Configuration MCP dans `.mcp.json`

**Date :** 2026-05-10  
**Statut :** Accepté

## Contexte

Claude Code lit la configuration des serveurs MCP depuis des fichiers spécifiques, pas depuis `settings.json`.

## Décision

La configuration MCP est placée dans `.mcp.json` à la racine du projet (avec un point).  
`enableAllProjectMcpServers: true` est ajouté dans `.claude/settings.local.json` pour éviter la boîte de dialogue d'approbation à chaque démarrage.

## Alternatives rejetées

- `settings.json` → le champ `mcpServers` est rejeté par le schéma de validation de Claude Code
- `mcp.json` (sans point) → ignoré par Claude Code
- Configuration globale dans `~/.claude/settings.json` → même rejet du champ `mcpServers`

## Conséquences

- `.mcp.json` est versionné dans le repo → la config MCP est partagée
- `.claude/settings.local.json` n'est pas versionné (contient des permissions locales)
