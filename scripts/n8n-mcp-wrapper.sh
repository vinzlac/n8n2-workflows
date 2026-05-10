#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  source "${ENV_FILE}"
  set +a
fi

: "${N8N_MCP_KEY:?N8N_MCP_KEY non défini dans .env}"

exec npx -y supergateway \
  --streamableHttp "https://n8n.code-advisors.site/mcp-server/http" \
  --header "authorization:Bearer ${N8N_MCP_KEY}"
