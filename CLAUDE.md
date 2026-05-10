# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Centraliser les workflows n8n, leurs exports JSON et leur documentation, avec les outils MCP et les skills nécessaires pour les créer et les maintenir.

## MCP n8n

Le serveur MCP n8n est configuré via `.mcp.json` et un bridge custom (`scripts/n8n-mcp-bridge.mjs`). Il expose 25 outils pour créer, valider et gérer les workflows n8n.

**Tester la connexion MCP :**
```bash
bash scripts/test-n8n-mcp.sh
```

**Credentials (dans `.env`) :**
- `N8N_API_KEY` — token REST API (`aud: public-api`), pour appels HTTP directs
- `N8N_MCP_KEY` — token MCP (`aud: mcp-server-api`), utilisé par le bridge — se génère depuis n8n → Settings → MCP Server

## Créer un workflow (processus MCP)

Suivre ces étapes dans l'ordre — ne pas sauter les étapes de validation :

1. `get_sdk_reference` — lire les patterns SDK avant de coder
2. `search_nodes` — trouver les nodes nécessaires (ex. `"slack"`, `"webhook"`)
3. `get_node_types` — obtenir les définitions TypeScript exactes pour chaque node trouvé (obligatoire, ne pas deviner les noms de paramètres)
4. Écrire le code workflow avec le SDK
5. `validate_workflow` — valider, corriger, re-valider jusqu'à zéro erreur
6. `create_workflow_from_code` — créer dans n8n avec une `description` courte

Pour **mettre à jour** un workflow existant : `update_workflow` (pas `create`).

## Structure des workflows

Chaque workflow exporté va dans `./workflows/<nom-du-workflow>/` :
- `workflow-<nom>.json` — export JSON n8n
- `README.md` — but, config credentials, URLs test/prod

Les credentials ne sont **pas** inclus dans les exports JSON. Après import dans n8n, il faut les reconfigurer manuellement.

## Skills locaux (`.codex/skills/`)

Skills installés pour assister la génération de workflows :

| Skill | Contenu |
|---|---|
| `n8n-mcp-tools-expert` | Guide d'utilisation des outils MCP, formats nodeType, erreurs courantes |
| `n8n-expression-syntax` | Syntax des expressions n8n (`{{ $json.field }}`) |
| `n8n-workflow-patterns` | Patterns architecturaux (webhook, scheduled, AI agent, HTTP API) |
| `n8n-validation-expert` | Interprétation des erreurs de validation |
| `n8n-node-configuration` | Prérequis par opération de node |
| `n8n-code-javascript` | Écrire du JS dans les Code nodes |
| `n8n-code-python` | Écrire du Python dans les Code nodes |

## Points critiques

**Formats nodeType** — deux formats selon l'outil :
- `nodes-base.slack` — pour `search_nodes`, `get_node_types`, `validate_workflow`
- `n8n-nodes-base.slack` — dans le JSON du workflow (code SDK)

**Connexion MCP** — voir `docs/post-mortem/001-n8n-mcp-connexion.md` pour comprendre pourquoi supergateway ne fonctionne pas avec n8n et pourquoi un bridge custom est utilisé.

**Décisions d'architecture** — voir `docs/adr/` pour les ADRs.
