# 📋 Plan d'Implémentation : Vue Comparaison et Recommandation

## 🎯 Objectif
Créer une vue de comparaison des métiers avec système de recommandation automatique.

---

## 📦 Phase 1 : Fondations (Utilitaires et Services)

### Tâche 1.1 : Utilitaires de calcul (`src/utils/comparisonUtils.js`)
**Objectif** : Créer les fonctions de calcul des métriques par métier

**Fonctions à créer** :
- `calculateProfessionMetrics(professionId)` : Calcule toutes les métriques pour un métier
  - Score global (somme pondérée)
  - Total des importances
  - Nombre de motivations clés
  - Répartition par type (avantages, petits avantages, NSP, petits désavantages, désavantages)
  - Répartition par catégorie (poids total par catégorie)
  - Top 3 catégories
  - Top 3 motivations

**Tests** : Tests unitaires pour chaque fonction

**Critère de validation** : Les métriques sont calculées correctement pour un métier donné

---

### Tâche 1.2 : Service de recommandation (`src/services/recommendationService.js`)
**Objectif** : Créer l'algorithme de calcul de score et recommandation

**Fonctions à créer** :
- `calculateCategoryScore(category, professionId)` : Calcule le score d'une catégorie
  - Formule : `Poids_total × Multiplicateur_type`
  - Multiplicateurs :
    - Avantages ≥ 50% : × 1.5
    - Désavantages ≥ 50% : × 0.5
    - NSP ≥ 50% : × 1.0
    - Équilibré : × 1.0
  - Ignore les catégories sans critères

- `calculateProfessionScore(professionId, preferences)` : Calcule le score total d'un métier
  - Somme des scores de catégories
  - Applique les pondérations si catégories prioritaires définies

- `calculateConfidenceScore(scores)` : Calcule le score de confiance
  - Formule : `(Score_max - Score_2ème) / Score_max × 100`
  - Retourne un pourcentage et un label (Très fiable, Fiable, etc.)

- `getRecommendation(professionIds, preferences)` : Retourne la recommandation
  - Calcule les scores pour chaque métier
  - Trie par score décroissant
  - Calcule le score de confiance
  - Retourne métier recommandé + explication

**Tests** : Tests unitaires pour chaque fonction avec différents scénarios

**Critère de validation** : L'algorithme retourne la bonne recommandation selon les données

---

## 📦 Phase 2 : Navigation et Structure

### Tâche 2.1 : Ajout de l'état viewMode dans App.jsx
**Objectif** : Gérer la navigation entre vue principale et vue comparaison

**Modifications** :
- Ajouter état `viewMode` : `'main'` ou `'comparison'`
- Ajouter fonction `setViewMode`
- Conditionner l'affichage selon `viewMode`
- Si `viewMode === 'comparison'`, afficher `ComparisonView` au lieu du contenu principal

**Critère de validation** : On peut basculer entre les deux vues

---

### Tâche 2.2 : Modification de ProfessionTabs.jsx
**Objectif** : Ajouter le bouton "Comparaison" à droite

**Modifications** :
- Ajouter bouton "📊 Comparaison" à droite des onglets
- Désactivé si `professions.length < 2`
- Tooltip explicatif si désactivé
- Appelle `onViewComparison` quand cliqué

**Critère de validation** : Le bouton apparaît et change la vue

---

### Tâche 2.3 : Création de ComparisonView.jsx (structure de base)
**Objectif** : Créer la structure principale de la vue comparaison

**Composant à créer** :
- Structure de base avec header
- Sélection des métiers (checkboxes, max 3 sélectionnables)
- Par défaut : tous les métiers sélectionnés (jusqu'à 3)
- Message si < 2 métiers
- Bouton retour vers vue principale

**Critère de validation** : La vue s'affiche et permet de sélectionner les métiers

---

## 📦 Phase 3 : Visualisations (Vue Globale)

### Tâche 3.1 : Tableau comparatif (`src/components/comparison/ComparisonMetricsTable.jsx`)
**Objectif** : Afficher les métriques principales dans un tableau

**Composant** :
- Tableau avec métiers en colonnes
- Lignes : Score global, Total importances, Nombre motivations, Répartition par type
- Style : Alternance de couleurs, responsive

**Critère de validation** : Le tableau affiche correctement les métriques

---

### Tâche 3.2 : Graphiques en barres (`src/components/comparison/ComparisonBarChart.jsx`)
**Objectif** : Comparer les métriques avec des graphiques en barres

**Composant** :
- Utilise Recharts `BarChart`
- Graphiques pour :
  - Score global
  - Total des importances
  - Répartition par type (barres empilées)
- Responsive

**Critère de validation** : Les graphiques s'affichent et sont lisibles

---

### Tâche 3.3 : Intégration dans ComparisonView (Vue Globale)
**Objectif** : Créer l'onglet "Vue Globale" avec tableau et graphiques

**Modifications** :
- Ajouter système d'onglets (Vue Globale / Vue Détaillée)
- Onglet "Vue Globale" contient :
  - Tableau comparatif
  - Graphiques en barres
- Utilise les métiers sélectionnés

**Critère de validation** : L'onglet Vue Globale affiche tableau + graphiques

---

## 📦 Phase 4 : Vue Détaillée

### Tâche 4.1 : Vue détaillée (`src/components/comparison/ComparisonDetailView.jsx`)
**Objectif** : Afficher les détails complets de chaque métier

**Composant** :
- Section par métier
- Répartition complète par catégorie (graphique)
- Liste complète des motivations avec importances et types
- Top 3 catégories et motivations

**Critère de validation** : La vue détaillée affiche tous les détails

---

### Tâche 4.2 : Intégration dans ComparisonView (Vue Détaillée)
**Objectif** : Créer l'onglet "Vue Détaillée"

**Modifications** :
- Onglet "Vue Détaillée" contient `ComparisonDetailView`
- Affiche les détails pour chaque métier sélectionné

**Critère de validation** : L'onglet Vue Détaillée fonctionne

---

## 📦 Phase 5 : Système de Recommandation

### Tâche 5.1 : Configuration des critères (`src/components/comparison/RecommendationConfig.jsx`)
**Objectif** : Interface pour configurer les critères de recommandation

**Composant** :
- Section collapsible "Configurer les critères"
- Slider : Poids avantages/désavantages (0-100%)
- Sélection catégories prioritaires avec pondération (1-5 étoiles)
- Bouton "Réinitialiser aux valeurs par défaut"
- Bouton "Sauvegarder les préférences"

**Valeurs par défaut** :
- Poids avantages : 60%
- Catégories prioritaires : Aucune

**Critère de validation** : La configuration fonctionne et sauvegarde les préférences

---

### Tâche 5.2 : Sauvegarde/Chargement des préférences
**Objectif** : Persister les préférences dans localStorage

**Modifications** :
- Ajouter fonctions dans `storage.js` :
  - `saveRecommendationPreferences(preferences)`
  - `loadRecommendationPreferences()`
- Utiliser dans `RecommendationConfig`

**Critère de validation** : Les préférences sont sauvegardées et rechargées

---

### Tâche 5.3 : Modal de recommandation (`src/components/comparison/RecommendationModal.jsx`)
**Objectif** : Afficher le résultat de la recommandation

**Composant** :
- Modal avec :
  - Métier recommandé en évidence
  - Score et score de confiance
  - Explication (points forts, points d'attention)
  - Classement complet des métiers
  - Légende expliquant le calcul (formule, multiplicateurs)
- Bouton "Fermer"

**Critère de validation** : La modal affiche correctement la recommandation

---

### Tâche 5.4 : Intégration du bouton "Choisis pour moi"
**Objectif** : Ajouter le bouton et connecter au système de recommandation

**Modifications** :
- Ajouter bouton "🎯 Choisis pour moi" en haut à droite de ComparisonView
- Style proéminent (bouton primaire)
- Au clic :
  - Calcule la recommandation avec les préférences
  - Ouvre la modal avec le résultat

**Critère de validation** : Le bouton fonctionne et affiche la recommandation

---

## 📦 Phase 6 : Styles et Finitions

### Tâche 6.1 : Styles CSS pour ComparisonView
**Objectif** : Styliser tous les composants de comparaison

**Fichiers** :
- Ajouter styles dans `src/styles/app.css` ou créer `comparison.css`
- Styles pour :
  - ComparisonView (layout, header, sélection métiers)
  - Onglets de niveau de détail
  - Tableau comparatif
  - Graphiques
  - Vue détaillée
  - Configuration recommandation
  - Modal recommandation

**Critère de validation** : Tout est stylisé et responsive

---

## 📦 Phase 7 : Tests

### Tâche 7.1 : Tests unitaires utilitaires
**Objectif** : Tester les fonctions de calcul

**Fichiers** :
- `src/__tests__/utils/comparisonUtils.test.js`
- `src/__tests__/services/recommendationService.test.js`

**Critère de validation** : Tous les tests passent

---

### Tâche 7.2 : Tests de composants
**Objectif** : Tester les composants React

**Fichiers** :
- `src/__tests__/components/comparison/ComparisonView.test.jsx`
- `src/__tests__/components/comparison/ComparisonMetricsTable.test.jsx`
- `src/__tests__/components/comparison/ComparisonBarChart.test.jsx`
- `src/__tests__/components/comparison/RecommendationModal.test.jsx`

**Critère de validation** : Tous les tests passent

---

## 🎯 Ordre d'Implémentation Recommandé

1. **Phase 1** : Fondations (Tâches 1.1, 1.2) - Testable immédiatement
2. **Phase 2** : Navigation (Tâches 2.1, 2.2, 2.3) - Testable visuellement
3. **Phase 3** : Vue Globale (Tâches 3.1, 3.2, 3.3) - Testable visuellement
4. **Phase 4** : Vue Détaillée (Tâches 4.1, 4.2) - Testable visuellement
5. **Phase 5** : Recommandation (Tâches 5.1, 5.2, 5.3, 5.4) - Testable fonctionnellement
6. **Phase 6** : Styles (Tâche 6.1) - Testable visuellement
7. **Phase 7** : Tests (Tâches 7.1, 7.2) - Validation finale

---

## ✅ Critères de Validation Globaux

- [ ] Navigation fonctionne entre vue principale et comparaison
- [ ] Sélection des métiers fonctionne (max 3, tous par défaut)
- [ ] Vue globale affiche tableau et graphiques correctement
- [ ] Vue détaillée affiche tous les détails
- [ ] Système de recommandation calcule correctement
- [ ] Modal de recommandation affiche résultat et explication
- [ ] Préférences sont sauvegardées et rechargées
- [ ] Styles sont cohérents et responsive
- [ ] Tous les tests passent
- [ ] Accessibilité respectée (ARIA, clavier, etc.)
