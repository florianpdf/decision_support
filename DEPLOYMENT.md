# Guide de Déploiement sur GitHub Pages

Ce guide explique comment déployer l'application "Aide à la Décision" sur GitHub Pages.

## 📋 Prérequis

- Un compte GitHub
- Un repository GitHub pour ce projet
- Les permissions d'écriture sur le repository

## 🚀 Configuration automatique (Recommandé)

### Étape 1 : Activer GitHub Pages

1. Allez sur votre repository GitHub
2. Cliquez sur `Settings` (Paramètres)
3. Dans le menu de gauche, cliquez sur `Pages`
4. Sous "Source", sélectionnez `GitHub Actions`

### Étape 2 : Vérifier le workflow

Le workflow GitHub Actions (`.github/workflows/deploy.yml`) est déjà configuré et se déclenchera automatiquement :
- À chaque push sur la branche `main` ou `master`
- Manuellement via l'onglet "Actions" > "Deploy to GitHub Pages" > "Run workflow"

### Étape 3 : Premier déploiement

1. Poussez votre code sur GitHub :
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. Le workflow se déclenchera automatiquement
3. Allez dans l'onglet `Actions` de votre repository pour suivre le déploiement
4. Une fois terminé, votre application sera accessible à :
   ```
   https://[votre-username].github.io/[nom-du-repo]/
   ```

## 🔧 Configuration manuelle

Si vous préférez déployer manuellement :

### Option 1 : Utiliser gh-pages (npm package)

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter le script dans package.json
# "deploy": "npm run build && gh-pages -d dist"

# Déployer
npm run deploy
```

### Option 2 : Build et push manuel

```bash
# Build avec la base path correcte
GITHUB_PAGES=true GITHUB_REPOSITORY_NAME=votre-nom-de-repo npm run build

# Créer une branche gh-pages et pousser dist/
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## ⚙️ Configuration de la base path

La base path est automatiquement configurée dans `vite.config.js` :
- En développement : `/` (racine)
- Sur GitHub Pages : `/[nom-du-repo]/`

Si votre repository s'appelle `bulle_chart`, l'URL sera :
```
https://username.github.io/bulle_chart/
```

## 🔍 Vérification

Après le déploiement, vérifiez que :
- ✅ L'application se charge correctement
- ✅ Les assets (CSS, JS) se chargent sans erreur 404
- ✅ Le localStorage fonctionne (les données persistent)
- ✅ Le graphique s'affiche correctement

## 🐛 Dépannage

### Les assets ne se chargent pas (404)

Vérifiez que la base path dans `vite.config.js` correspond au nom de votre repository.

### Le workflow échoue

1. Vérifiez que les tests passent localement : `npm test -- --run`
2. Vérifiez les logs dans l'onglet `Actions` de GitHub
3. Assurez-vous que GitHub Pages est activé dans les paramètres

### L'application ne se charge pas

1. Vérifiez l'URL complète (doit inclure le nom du repo)
2. Vérifiez que le build s'est bien terminé
3. Consultez la console du navigateur pour les erreurs

## 📝 Notes importantes

- Les données sont stockées dans le localStorage du navigateur (pas de serveur requis)
- L'application fonctionne entièrement côté client
- Aucune base de données ou API backend n'est nécessaire
- Le déploiement est gratuit avec GitHub Pages

## 🔗 Ressources

- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
