#!/bin/bash

# Script de déploiement sur GitHub Pages
# Usage: ./deploy.sh [repository-url]

set -e

echo "🚀 Déploiement de l'application sur GitHub Pages"
echo ""

# Vérifier si un remote existe déjà
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' déjà configuré"
    REMOTE_URL=$(git remote get-url origin)
    echo "   URL: $REMOTE_URL"
    read -p "Utiliser ce remote? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        REPO_URL=""
    else
        REPO_URL=$REMOTE_URL
    fi
else
    REPO_URL=$1
fi

# Si pas d'URL, demander à l'utilisateur
if [ -z "$REPO_URL" ]; then
    echo ""
    echo "📋 Pour déployer, vous devez créer un repository GitHub :"
    echo "   1. Allez sur https://github.com/new"
    echo "   2. Créez un nouveau repository (ex: bulle_chart)"
    echo ""
    read -p "Entrez l'URL de votre repository GitHub (ex: https://github.com/username/repo.git): " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "❌ URL requise pour continuer"
        exit 1
    fi
fi

# Configurer le remote
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Configuration du remote avec: $REPO_URL"
    git remote add origin "$REPO_URL"
else
    echo "🔄 Mise à jour du remote..."
    git remote set-url origin "$REPO_URL"
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
echo "   Branche: $BRANCH"
echo "   Remote: origin"

git push -u origin "$BRANCH" || {
    echo ""
    echo "❌ Erreur lors du push"
    echo "   Vérifiez que :"
    echo "   - Le repository existe sur GitHub"
    echo "   - Vous avez les permissions d'écriture"
    echo "   - Vous êtes authentifié (git config --global user.name/email)"
    exit 1
}

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
REPO_NAME=$(basename -s .git "$REPO_URL" | sed 's/.*\///')
USERNAME=$(echo "$REPO_URL" | sed -E 's/.*github.com[:/]([^/]+).*/\1/')
echo "   https://$USERNAME.github.io/$REPO_NAME/"
echo ""
