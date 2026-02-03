# n8n2-workflows

## But du projet
Centraliser les workflows n8n, leurs exports JSON et leur documentation, avec les outils MCP et les skills necessaires pour les creer et les maintenir.

## Prerequis
- Une instance n8n accessible (self-hosted ou cloud)
- Un serveur MCP n8n configure dans n8n
- Un acces API n8n (API key) pour appeler n8n depuis le MCP
- Acces a Slack (si workflows Slack)
- Python 3 si tu veux installer des skills via script

## Configuration
### Skills (installation locale)
Les skills sont installes localement dans ce workspace :
`./.codex/skills`

Skills installes (n8n-skills) :
- n8n-expression-syntax
- n8n-mcp-tools-expert
- n8n-workflow-patterns
- n8n-validation-expert
- n8n-node-configuration
- n8n-code-javascript
- n8n-code-python

### MCP n8n (serveur)
Le serveur MCP n8n doit etre configure (ex. via Docker) et connecte a l'API n8n.
Il faut donc creer une cle API n8n pour pouvoir appeler l'instance depuis le MCP.
Il expose les operations utilises ici (create, update, validate, list, executions, etc.).

Reference MCP open source : https://github.com/czlonkowski/n8n-mcp

#### Config MCP via Docker (utilisee)
Nous avons utilise Docker car un build local Node posait probleme. Voici la config (donnees masquees) :
```
"new-n8n-mcp": {
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "--init",
    "-e", "MCP_MODE=stdio",
    "-e", "LOG_LEVEL=error",
    "-e", "DISABLE_CONSOLE_OUTPUT=true",
    "-e", "N8N_API_URL=https://<votre-instance-n8n>",
    "-e", "N8N_API_KEY=<votre-api-key>",
    "ghcr.io/czlonkowski/n8n-mcp:latest"
  ]
}
```

Note build local Node (macOS Apple Silicon) : `npm run rebuild` echoue quand `better-sqlite3` est absent et que le fallback `sql.js` est utilise. Les tables FTS5 du schema ne sont pas supportees (`no such module: fts5`), et une tentative de suppression FTS5 peut entrainer `cannot commit - no transaction is active`. Issue ouverte : https://github.com/czlonkowski/n8n-mcp/issues/568

### Export des workflows
Chaque workflow est exporte en format standard dans un dossier dedie :
`./workflows/<nom-du-workflow>/`

Contenu typique :
- `workflow-<nom>.json`
- `README.md` (but, description, config n8n, outils tiers, test/prod)

## Utilisation
1) Creer/modifier un workflow dans n8n
2) Exporter le JSON dans `./workflows/<nom>/`
3) Documenter le workflow dans le `README.md` du dossier
4) Tester en mode webhook test
5) Activer en prod et utiliser l'URL de production

## Notes importantes
- Les exports standard n'incluent pas les credentials.
- Apres import dans n8n, il faut reconfigurer les credentials et les lier aux nodes.
