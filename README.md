# Aide à la Décision - Bilan de Compétences

Application web React pour identifier et visualiser vos intérêts professionnels et motivations clés sous forme de graphique Treemap interactif.

## 🚀 Fonctionnalités

- ✅ **Gestion des intérêts professionnels** : Création, modification, suppression avec couleurs personnalisées
- ✅ **Gestion des motivations clés** : Ajout, modification, suppression avec importance (1-30)
- ✅ **Visualisation graphique** : Treemap où la taille dépend de l'importance
- ✅ **Modification en temps réel** : Slider pour ajuster l'importance avec mise à jour instantanée
- ✅ **Interface responsive** : Adaptée aux différentes tailles d'écran
- ✅ **Accessibilité** : Conforme aux standards WCAG
- ✅ **Persistance locale** : Données sauvegardées dans le navigateur (localStorage)
- ✅ **Tests complets** : 110 tests avec couverture maximale

## 📋 Prérequis

- Node.js >= 16.x et npm

## 🛠️ Installation

### 1. Installer les dépendances

```bash
npm install
```

## 🎯 Lancement de l'application

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000` et s'ouvrira automatiquement dans votre navigateur.

### Build pour production

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`.

### Prévisualiser le build

```bash
npm run preview
```

## 🌐 Déploiement sur GitHub Pages

L'application est configurée pour être déployée automatiquement sur GitHub Pages.

### Configuration automatique

1. **Activer GitHub Pages dans votre repository** :
   - Allez dans `Settings` > `Pages`
   - Source : `GitHub Actions`

2. **Le déploiement se fait automatiquement** :
   - À chaque push sur `main` ou `master`
   - Via le workflow GitHub Actions (`.github/workflows/deploy.yml`)

3. **Votre application sera accessible à** :
   - `https://[votre-username].github.io/[nom-du-repo]/`

### Déploiement manuel

Si vous préférez déployer manuellement :

```bash
# Build avec la base path pour GitHub Pages
GITHUB_PAGES=true GITHUB_REPOSITORY_NAME=votre-nom-de-repo npm run build

# Puis poussez le dossier dist/ sur la branche gh-pages
# ou utilisez gh-pages npm package
```

### Notes importantes

- Le workflow exécute les tests avant de déployer
- Seuls les builds qui passent les tests sont déployés
- Les données sont stockées dans le localStorage du navigateur (pas de serveur requis)

## 📁 Structure du projet

```
bulle_chart/
├── src/
│   ├── components/        # Composants React
│   │   ├── ui/           # Composants UI réutilisables
│   │   ├── forms/        # Formulaires
│   │   ├── charts/       # Composants graphiques
│   │   └── *.test.jsx    # Tests des composants
│   ├── hooks/            # Hooks personnalisés
│   │   └── *.test.js     # Tests des hooks
│   ├── utils/            # Utilitaires et constantes
│   │   └── *.test.js     # Tests des utilitaires
│   ├── services/         # Services (stockage local)
│   │   └── *.test.js     # Tests des services
│   ├── types/            # Définitions de types (JSDoc)
│   ├── styles/           # Styles CSS
│   │   ├── variables.css # Variables CSS
│   │   └── app.css       # Styles principaux
│   ├── test/             # Configuration des tests
│   │   ├── setup.js
│   │   └── templates/   # Templates de tests
│   ├── App.jsx           # Composant principal
│   └── main.jsx          # Point d'entrée
├── index.html
├── vite.config.js
├── package.json
├── TESTING.md            # Guide de tests
├── CONTRIBUTING.md       # Guide de contribution
└── README.md
```

## 🧪 Tests

L'application utilise **Vitest** et **React Testing Library** pour les tests.

```bash
# Lancer les tests
npm test

# Lancer les tests avec couverture
npm test:coverage

# Interface graphique pour les tests
npm test:ui

# Mode watch (développement)
npm test:watch
```

**Important** : Toute nouvelle fonctionnalité ou modification doit inclure les tests correspondants. Voir [TESTING.md](./TESTING.md) pour les guidelines de tests.

### Couverture actuelle

- **110 tests** passent avec succès
- Couverture globale : ~65%
- Services : ~97% de couverture
- Composants UI : ~100% de couverture

## 🎨 Technologies utilisées

- **React 18** : Bibliothèque UI
- **Vite** : Build tool et serveur de développement
- **Vitest** : Framework de tests
- **React Testing Library** : Tests de composants React
- **Material-UI** : Composants UI (Slider, Icons)
- **Recharts** : Graphiques (Treemap)

## 💾 Stockage des données

Les données sont stockées dans le **localStorage** du navigateur. Cela signifie que :
- Les données sont persistantes entre les sessions
- Les données sont spécifiques à chaque navigateur
- Les données sont stockées localement (pas de serveur requis)

### Pour exporter/importer les données

Vous pouvez utiliser la console du navigateur :

```javascript
// Exporter les données
JSON.stringify(localStorage.getItem('bulle_chart_categories'))

// Importer les données
localStorage.setItem('bulle_chart_categories', '[votre JSON]')
```

## 🐛 Dépannage

### L'application ne se lance pas
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules/` et relancez `npm install`

### Les données ne persistent pas
- Vérifiez que les cookies/localStorage ne sont pas désactivés dans votre navigateur
- Vérifiez la console du navigateur pour les erreurs

### Les tests échouent
- Vérifiez que toutes les dépendances sont installées : `npm install`
- Vérifiez que les imports sont corrects après un refactoring
- Consultez [TESTING.md](./TESTING.md) pour les guidelines de tests

## 📚 Documentation

- [TESTING.md](./TESTING.md) - Guide complet pour écrire et maintenir les tests
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide de contribution au projet

## 📄 Licence

MIT

## 👤 Auteur

Développé pour l'aide à la décision dans le cadre d'un bilan de compétences.
