# Déploiement Rapide sur GitHub Pages

## 🚀 En 3 étapes

### 1. Activer GitHub Pages

Dans votre repository GitHub :
- `Settings` > `Pages`
- Source : **GitHub Actions**

### 2. Pousser le code

```bash
git add .
git commit -m "Configure GitHub Pages"
git push origin main
```

### 3. Attendre le déploiement

- Allez dans l'onglet `Actions` de votre repository
- Le workflow se déclenche automatiquement
- Une fois terminé, votre app est en ligne !

## 🌐 URL de votre application

```
https://[votre-username].github.io/[nom-du-repo]/
```

## ✅ Vérification

Après le déploiement, testez :
- L'application se charge
- Les données se sauvegardent (localStorage)
- Le graphique s'affiche

## 📖 Documentation complète

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus de détails.
