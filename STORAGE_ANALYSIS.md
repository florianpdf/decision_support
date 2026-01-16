# 📊 Analyse de l'Architecture de Stockage

## 🔍 Situation Actuelle

### Structure des Données
- **7 clés localStorage séparées** :
  - `bulle_chart_professions` : Liste des métiers (max 5)
  - `bulle_chart_categories` : Intérêts professionnels (partagés, max 10)
  - `bulle_chart_criteria` : Motivations clés (partagées, max 110 par catégorie)
  - `bulle_chart_criterion_weights` : Poids/importances (spécifiques par métier)
  - `bulle_chart_color_mode` : Préférence couleur graphique (par métier)
  - Clés de compteurs (next IDs)

### Architecture Actuelle
- **Normalisée** : Catégories et critères partagés entre tous les métiers
- **Dénormalisée** : Poids/importances spécifiques à chaque métier
- **Chargement** : Pour un métier, on charge tout puis on filtre

---

## ⚠️ Problèmes Potentiels avec la Comparaison

### 1. Performance
**Scénario actuel** :
- Charger 1 métier : 3 appels localStorage (categories, criteria, weights)
- Charger 3 métiers pour comparaison : **Même 3 appels**, mais filtrage × 3

**Complexité** :
```javascript
// Pour comparer 3 métiers :
getCategoriesForProfession(1) // loadCategories() + loadCriteria() + loadCriterionWeights() + filtrage
getCategoriesForProfession(2) // MÊMES 3 appels localStorage + filtrage
getCategoriesForProfession(3) // MÊMES 3 appels localStorage + filtrage
```

**Problème** : On charge 3 fois les mêmes données (categories, criteria) et on filtre à chaque fois.

### 2. Limite localStorage
- **Taille max** : ~5-10MB selon navigateur
- **Estimation données** :
  - 5 métiers × 10 catégories × 110 critères = 5500 poids
  - Chaque poids : ~100 bytes (JSON)
  - Total estimé : ~550KB (largement OK)

### 3. Complexité du Code
- Beaucoup de `find()` et `filter()` pour assembler les données
- Logique de jointure manuelle (catégories → critères → poids)

---

## ✅ Avantages de localStorage (Actuel)

1. **Pas de backend** : Application 100% frontend
2. **Persistance** : Données sauvegardées automatiquement
3. **Offline** : Fonctionne sans connexion
4. **Simplicité** : Pas de configuration serveur
5. **Performance acceptable** : Pour 5 métiers max, c'est rapide

---

## 🚀 Solutions Proposées

### Option 1 : Optimiser localStorage avec Cache (⭐ RECOMMANDÉ)

**Principe** : Créer un cache en mémoire pour éviter les appels répétés

**Implémentation** :
```javascript
// Cache en mémoire
let categoriesCache = null;
let criteriaCache = null;
let weightsCache = null;

// Fonction optimisée
function getCategoriesForProfessions(professionIds) {
  // Charger une seule fois
  if (!categoriesCache) categoriesCache = loadCategories();
  if (!criteriaCache) criteriaCache = loadCriteria();
  if (!weightsCache) weightsCache = loadCriterionWeights();
  
  // Filtrer pour tous les métiers en une fois
  return professionIds.map(id => 
    assembleProfessionData(id, categoriesCache, criteriaCache, weightsCache)
  );
}
```

**Avantages** :
- ✅ Garde localStorage (simple, pas de migration)
- ✅ Performance améliorée (1 chargement au lieu de 3)
- ✅ Pas de changement d'architecture
- ✅ Facile à implémenter

**Inconvénients** :
- ⚠️ Cache à invalider lors des modifications
- ⚠️ Légèrement plus de mémoire RAM

---

### Option 2 : IndexedDB

**Principe** : Migrer vers IndexedDB pour meilleures performances

**Avantages** :
- ✅ Plus performant pour grandes quantités
- ✅ Requêtes plus complexes possibles
- ✅ Meilleure gestion des transactions

**Inconvénients** :
- ❌ Migration complexe (toutes les données existantes)
- ❌ Code plus complexe (API asynchrone)
- ❌ Overkill pour 5 métiers max
- ❌ Pas de gain réel pour notre cas d'usage

---

### Option 3 : Restructurer les Données

**Principe** : Stocker par métier au lieu de normalisé

**Avantages** :
- ✅ Chargement direct d'un métier
- ✅ Moins de jointures

**Inconvénients** :
- ❌ Duplication des catégories/critères (5× plus de données)
- ❌ Synchronisation complexe (modifier une catégorie = modifier 5 métiers)
- ❌ Migration complexe
- ❌ Contredit l'architecture actuelle (catégories partagées)

---

## 💡 Recommandation

### ✅ **Garder localStorage + Optimiser avec Cache**

**Pourquoi** :
1. **Volume de données faible** : 5 métiers max = ~500KB (largement OK)
2. **Performance suffisante** : Avec cache, chargement quasi-instantané
3. **Simplicité** : Pas de migration, pas de changement d'architecture
4. **Maintenabilité** : Code existant fonctionne, juste optimisation

**Ce qu'il faut faire** :
1. Créer un cache en mémoire dans `storage.js`
2. Fonction `getCategoriesForProfessions(ids)` pour charger plusieurs métiers en une fois
3. Invalider le cache lors des modifications (add/update/delete)
4. Utiliser ce cache dans la vue comparaison

**Performance attendue** :
- Avant : 3 métiers = 9 appels localStorage + 9 filtrages
- Après : 3 métiers = 3 appels localStorage + 3 filtrages
- **Gain : ~3× plus rapide**

---

## 📝 Plan d'Action

### Étape 1 : Créer le Cache (Phase 1)
- Ajouter cache en mémoire dans `storage.js`
- Fonction `getCategoriesForProfessions(ids)` optimisée
- Invalidation du cache lors des modifications

### Étape 2 : Utiliser dans Comparaison (Phase 3)
- Utiliser `getCategoriesForProfessions()` au lieu de `getCategoriesForProfession()`
- Charger tous les métiers sélectionnés en une fois

### Étape 3 : Monitoring (Optionnel)
- Mesurer les performances avant/après
- Si problème, envisager IndexedDB plus tard

---

## 🎯 Conclusion

**localStorage reste adapté** pour notre cas d'usage, mais il faut **optimiser avec un cache en mémoire** pour éviter les chargements répétés lors de la comparaison.

**Pas besoin de migrer vers IndexedDB** pour l'instant (overkill pour 5 métiers).

**Action** : Implémenter le cache en Phase 1 (fondations) avant de créer la vue comparaison.
