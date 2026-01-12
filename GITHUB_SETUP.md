# Configuration GitHub

## 📋 Étapes pour pousser sur GitHub

### 1. Créer un nouveau repository sur GitHub

1. Allez sur [GitHub](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite > **"New repository"**
3. Donnez un nom à votre repository (ex: `bulle_chart` ou `aide-a-la-decision`)
4. **Ne cochez PAS** "Initialize this repository with a README"
5. Cliquez sur **"Create repository"**

### 2. Connecter votre dépôt local à GitHub

Une fois le repository créé, GitHub vous donnera des commandes. Utilisez celles-ci :

```bash
# Ajouter le remote (remplacez USERNAME et REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Pousser le code
git push -u origin main
```

### 3. Activer GitHub Pages

Après avoir poussé le code :

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **"Source"**, sélectionnez **"GitHub Actions"**
5. Le workflow se déclenchera automatiquement

### 4. Vérifier le déploiement

1. Allez dans l'onglet **Actions** de votre repository
2. Vous verrez le workflow "Deploy to GitHub Pages" en cours
3. Une fois terminé, votre application sera accessible à :
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```

## 🔑 Authentification

Si vous êtes invité à vous authentifier lors du push :

- **HTTPS** : Utilisez un Personal Access Token (Settings > Developer settings > Personal access tokens)
- **SSH** : Configurez vos clés SSH GitHub

## ✅ Vérification

Après le push, vérifiez que :
- ✅ Tous les fichiers sont bien sur GitHub
- ✅ Le workflow GitHub Actions est présent
- ✅ GitHub Pages est activé
