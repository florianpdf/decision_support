# Guide de Déploiement

## 🚀 Déploiement automatique (Recommandé)

Le workflow GitHub Actions (`.github/workflows/deploy.yml`) est configuré pour déployer automatiquement sur GitHub Pages.

### Étapes

1. **Activer GitHub Pages** :
   - Repository > Settings > Pages
   - Source : **GitHub Actions**

2. **Pousser le code** :
   ```bash
   git push origin main
   ```

3. **Le workflow se déclenche automatiquement** :
   - Exécute les tests
   - Build l'application
   - Déploie sur GitHub Pages

4. **Votre application sera accessible à** :
   ```
   https://[username].github.io/[nom-du-repo]/
   ```

## 🐛 Dépannage

- **Assets 404** : Vérifiez que la base path dans `vite.config.js` correspond au nom du repository
- **Workflow échoue** : Vérifiez que les tests passent localement (`npm test -- --run`)
- **App ne se charge pas** : Vérifiez l'URL complète (doit inclure le nom du repo)

Pour plus de détails, voir la section "Déploiement" dans [README.md](./README.md).
