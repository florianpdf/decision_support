# Dépannage GitHub Pages - Erreur 404

## 🔍 Vérifications à faire

### 1. Vérifier le workflow GitHub Actions

Allez sur : https://github.com/florianpdf/decision_support/actions

- ✅ Si vous voyez un workflow "Deploy to GitHub Pages" avec un ✅ vert → Le déploiement a réussi
- ❌ Si vous voyez un workflow avec un ❌ rouge → Cliquez dessus pour voir l'erreur
- ⚠️ Si aucun workflow n'existe → Il faut déclencher le déploiement

### 2. Activer GitHub Pages

Allez sur : https://github.com/florianpdf/decision_support/settings/pages

1. Sous "Source", sélectionnez **"GitHub Actions"**
2. Cliquez sur **"Save"**
3. Attendez quelques secondes

### 3. Déclencher le workflow manuellement

Si le workflow n'a pas été déclenché automatiquement :

1. Allez sur : https://github.com/florianpdf/decision_support/actions
2. Cliquez sur "Deploy to GitHub Pages" dans la liste des workflows
3. Cliquez sur "Run workflow" (bouton en haut à droite)
4. Sélectionnez la branche "main"
5. Cliquez sur "Run workflow"

### 4. Vérifier que le déploiement est terminé

Après avoir déclenché le workflow :

1. Attendez 2-3 minutes
2. Revenez sur la page Actions
3. Cliquez sur le workflow en cours
4. Vérifiez que tous les steps sont ✅ verts

### 5. Vérifier l'URL

L'application devrait être accessible à :
```
https://florianpdf.github.io/decision_support/
```

**Important** : Notez le `/` à la fin de l'URL.

## 🐛 Problèmes courants

### Le workflow échoue sur "Run tests"

- Vérifiez que les tests passent localement : `npm test -- --run`
- Si les tests échouent, corrigez-les avant de pousser

### Le workflow échoue sur "Build"

- Vérifiez les logs du workflow pour voir l'erreur exacte
- Vérifiez que `package.json` contient bien le script `build`

### GitHub Pages affiche toujours 404

- Attendez 5-10 minutes après le déploiement (propagation DNS)
- Videz le cache de votre navigateur (Ctrl+Shift+R)
- Vérifiez que l'URL est exactement : `https://florianpdf.github.io/decision_support/`

## ✅ Solution rapide

Si rien ne fonctionne, déclenchez manuellement le workflow :

```bash
# Depuis votre machine locale
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

Cela créera un commit vide qui déclenchera automatiquement le workflow.
