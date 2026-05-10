#!/usr/bin/env bash
set -euo pipefail

: "${N8N_MCP_KEY:?N8N_MCP_KEY non défini — lancez depuis direnv ou sourcez .env}"

echo "Test MCP initialize sur https://n8n.code-advisors.site/mcp-server/http ..."
curl -s \
  -X POST \
  -H "Authorization: Bearer ${N8N_MCP_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}},"id":1}' \
  "https://n8n.code-advisors.site/mcp-server/http" | python3 -m json.tool
