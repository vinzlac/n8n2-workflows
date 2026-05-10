# Test — Joke API

Workflow de test minimal : récupère une blague aléatoire depuis une API publique et formate le résultat.

## Nodes

| Node | Type | Rôle |
|---|---|---|
| Start | Manual Trigger | Déclenchement manuel |
| Fetch Joke | HTTP Request | GET `https://official-joke-api.appspot.com/random_joke` |
| Format Result | Set | Concatène `setup` + `punchline` → champ `joke` |

## Output

```json
{
  "joke": "Why did the designer break up with their font? — Because it wasn't their type.",
  "category": "programming"
}
```

## Credentials

Aucun — l'API est publique.

## n8n

- **ID** : `hVmVCj4VjLSQUCIl`
- **URL** : https://n8n.code-advisors.site/workflow/hVmVCj4VjLSQUCIl
- **Testé le** : 2026-05-10 — succès (182ms)
