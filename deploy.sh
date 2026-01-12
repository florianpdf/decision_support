#!/bin/bash

# Script de déploiement sur GitHub Pages
# Usage: ./deploy.sh [repository-url]

set -e

REPO_URL=$1

if [ -z "$REPO_URL" ]; then
    echo "Usage: ./deploy.sh <repository-url>"
    echo "Exemple: ./deploy.sh git@github.com:user/repo.git"
    exit 1
fi

echo "🚀 Configuration du remote et push vers GitHub"
echo ""

# Configurer le remote
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Ajout du remote: $REPO_URL"
    git remote add origin "$REPO_URL"
else
    echo "🔄 Mise à jour du remote: $REPO_URL"
    git remote set-url origin "$REPO_URL"
fi

# Vérifier que tout est commité
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Modifications non commitées détectées"
    echo "   Commitez d'abord vos changements"
    exit 1
fi

# Pousser sur GitHub
BRANCH=$(git branch --show-current)
echo "📤 Push vers origin/$BRANCH..."
git push -u origin "$BRANCH"

echo ""
echo "✅ Code poussé avec succès!"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Repository > Settings > Pages > Source: GitHub Actions"
echo "   2. Le workflow se déclenchera automatiquement"
echo ""
