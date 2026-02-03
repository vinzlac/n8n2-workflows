# Webhook vers Slack

## But
Recevoir un webhook HTTP et publier le contenu dans un channel Slack.

## Description
Ce workflow expose un endpoint `POST` et envoie un message Slack contenant le champ `text` (ou `message`) du JSON reçu.

## Configuration n8n
- Importer `workflow-webhook-vers-slack.json` dans n8n.
- Vérifier le node `Webhook` (method `POST`, path `webhook-slack`).
- Dans le node `Slack`, renseigner le channel cible et sélectionner le credential Slack.

## Configuration Slack (outil tiers)
- Créer une app Slack et lui donner le scope `chat:write`.
- Installer l’app dans le workspace Slack.
- Récupérer le **Bot User OAuth Token** (`xoxb-...`) et l’ajouter dans les credentials n8n.
- Inviter le bot dans le channel cible : `/invite @NomDuBot`.

## Lancer en test ou en prod
- **Test** : utiliser l’URL `.../webhook-test/webhook-slack` (bouton "Listen for test event" activé).
- **Prod** : activer le workflow et utiliser l’URL `.../webhook/webhook-slack`.

Exemple d’appel :
```
curl -X POST "https://<votre-instance-n8n>/webhook/webhook-slack" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello depuis prod"}'
```
