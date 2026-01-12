# Démarrage Rapide

## Installation en 2 étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer l'application
```bash
npm run dev
```

L'application s'ouvrira automatiquement dans votre navigateur sur **http://localhost:3000**

## Commandes utiles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Compiler pour la production
- `npm run preview` - Prévisualiser le build de production

## Structure des fichiers importants

- `src/App.jsx` - Composant principal
- `src/components/` - Composants React
- `src/services/storage.js` - Service de stockage localStorage
- `src/styles/app.css` - Styles CSS
- `index.html` - Point d'entrée HTML

## Stockage des données

Les données sont stockées dans le **localStorage** de votre navigateur. Elles persistent entre les sessions et sont spécifiques à chaque navigateur.

## Dépannage

**L'application ne se lance pas ?**
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules/` et relancez `npm install`

**Les données ne persistent pas ?**
- Vérifiez que les cookies/localStorage ne sont pas désactivés dans votre navigateur
- Vérifiez la console du navigateur pour les erreurs
