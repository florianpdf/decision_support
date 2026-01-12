#!/bin/bash

# Script de déploiement sur GitHub Pages
# Usage: ./deploy.sh [repository-url]

set -e

REPO_URL=$1

echo "🚀 Déploiement de l'application sur GitHub Pages"
echo ""

# Vérifier si un remote existe déjà
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' déjà configuré"
    REMOTE_URL=$(git remote get-url origin)
    echo "   URL: $REMOTE_URL"
else
    if [ -z "$REPO_URL" ]; then
        echo "❌ Aucun remote configuré et aucune URL fournie"
        echo ""
        echo "📋 Pour déployer, vous devez d'abord :"
        echo "   1. Créer un repository sur GitHub: https://github.com/new"
        echo "   2. Exécuter: ./deploy.sh https://github.com/USERNAME/REPO.git"
        echo ""
        echo "   Ou manuellement :"
        echo "   git remote add origin https://github.com/USERNAME/REPO.git"
        echo "   git push -u origin main"
        exit 1
    else
        echo "🔗 Configuration du remote avec: $REPO_URL"
        git remote add origin "$REPO_URL" || git remote set-url origin "$REPO_URL"
    fi
fi

# Vérifier que tout est commité
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Des modifications non commitées détectées"
    read -p "Voulez-vous les commiter maintenant? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Update before deployment"
    else
        echo "❌ Déploiement annulé"
        exit 1
    fi
fi

# Pousser sur GitHub
echo ""
echo "📤 Poussage du code sur GitHub..."
BRANCH=$(git branch --show-current)
git push -u origin "$BRANCH"

echo ""
echo "✅ Code poussé avec succès!"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Allez sur votre repository GitHub"
echo "   2. Settings > Pages"
echo "   3. Source: GitHub Actions"
echo "   4. Le workflow se déclenchera automatiquement"
echo ""
echo "🌐 Votre application sera accessible à :"
REPO_NAME=$(basename -s .git "$(git remote get-url origin)")
USERNAME=$(git remote get-url origin | sed -E 's/.*github.com[:/]([^/]+).*/\1/')
echo "   https://$USERNAME.github.io/$REPO_NAME/"
