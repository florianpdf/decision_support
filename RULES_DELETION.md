# Règles de Suppression des Éléments

Ce document liste toutes les règles qui régissent la suppression des éléments dans l'application.

## 📋 Table des Matières

1. [Suppression de Métier (Profession)](#suppression-de-métier-profession)
2. [Suppression d'Intérêt Professionnel (Category)](#suppression-dintérêt-professionnel-category)
3. [Suppression de Motivation Clé (Criterion)](#suppression-de-motivation-clé-criterion)

---

## 🏢 Suppression de Métier (Profession)

### Règles de Suppression

1. **Dernier métier avec données** ❌
   - **Condition** : `professions.length === 1` ET (`categories.length > 0` OU `criteria.length > 0`)
   - **Action** : Suppression **BLOQUÉE**
   - **Message d'erreur** : `"Impossible de supprimer le dernier métier tant qu'il reste des intérêts professionnels ou des motivations clés. Supprimez d'abord tous les intérêts professionnels et leurs motivations clés."`
   - **Bouton** : Désactivé avec tooltip explicatif
   - **Localisation** : 
     - `src/App.jsx` ligne 331-335
     - `src/hooks/useProfessions.js` ligne 106-115
     - `src/components/ProfessionTabs.jsx` ligne 51-57

2. **Dernier métier sans données** ✅
   - **Condition** : `professions.length === 1` ET `categories.length === 0` ET `criteria.length === 0`
   - **Action** : Suppression **AUTORISÉE** avec confirmation spéciale
   - **Modal** : 
     - Titre : `"Supprimer le dernier métier"`
     - Message : `"Êtes-vous sûr de vouloir supprimer "{professionName}" ? C'est le dernier métier. Cette action est possible car tous les intérêts professionnels et motivations clés ont déjà été supprimés."`
     - **Checkbox obligatoire** : `"Je comprends que je supprime le dernier métier"`
   - **Localisation** : `src/App.jsx` ligne 337-344, 633-640

3. **Métier non-dernier** ✅
   - **Condition** : `professions.length > 1`
   - **Action** : Suppression **AUTORISÉE** avec confirmation standard
   - **Modal** :
     - Titre : `"Supprimer le métier"`
     - Message : `"Êtes-vous sûr de vouloir supprimer "{professionName}" ?"`
     - **Checkbox** : Non requise
   - **Localisation** : `src/App.jsx` ligne 345-352, 633-640

### Effets de la Suppression

- Supprime le métier de la liste
- Supprime tous les poids (weights) associés à ce métier
- Si le métier supprimé était le métier actuel :
  - Basculer vers le premier métier disponible
  - Si aucun métier restant : `currentProfessionId = null`
- **Localisation** : `src/services/storage.js` ligne 119-130, `src/hooks/useProfessions.js` ligne 119-127

---

## 📁 Suppression d'Intérêt Professionnel (Category)

### Règles de Suppression

1. **Intérêt avec motivations clés - Plusieurs métiers** ❌
   - **Condition** : `category.criteria.length > 0` ET `professions.length > 1`
   - **Action** : Suppression **BLOQUÉE**
   - **Message d'erreur** : `"Un intérêt professionnel ne peut pas être supprimé s'il contient des motivations clés. Supprimez d'abord toutes les motivations clés."`
   - **Bouton** : Désactivé avec tooltip : `"Impossible de supprimer : l'intérêt professionnel contient des motivations clés. Supprimez d'abord toutes les motivations clés."`
   - **Localisation** :
     - `src/components/CategoryDetail.jsx` ligne 61-62, 142-151
     - `src/App.jsx` ligne 177-180

2. **Intérêt avec motivations clés - Un seul métier** ✅
   - **Condition** : `category.criteria.length > 0` ET `professions.length === 1`
   - **Action** : Suppression **AUTORISÉE** avec confirmation
   - **Modal** :
     - Titre : `"Supprimer l'intérêt professionnel"`
     - Message : `"Êtes-vous sûr de vouloir supprimer "{categoryName}" ? Cette action supprimera également les {N} motivation(s) clé(s) associée(s)."`
     - **Checkbox** : Non requise
   - **Localisation** : `src/App.jsx` ligne 187-195, 594-604

3. **Intérêt sans motivations clés - Un seul métier** ✅
   - **Condition** : `category.criteria.length === 0` ET `professions.length === 1`
   - **Action** : Suppression **AUTORISÉE** avec confirmation
   - **Modal** :
     - Titre : `"Supprimer l'intérêt professionnel"`
     - Message : `"Êtes-vous sûr de vouloir supprimer "{categoryName}" ?"`
     - **Checkbox** : Non requise
   - **Localisation** : `src/App.jsx` ligne 187-195, 594-604

4. **Intérêt sans motivations clés - Plusieurs métiers** ✅
   - **Condition** : `category.criteria.length === 0` ET `professions.length > 1`
   - **Action** : Suppression **AUTORISÉE** avec confirmation
   - **Modal** :
     - Titre : `"Supprimer l'intérêt professionnel"`
     - Message : `"Êtes-vous sûr de vouloir supprimer "{categoryName}" ? Cette action supprimera cet intérêt professionnel pour TOUS les métiers."`
     - **Checkbox obligatoire** : `"Je comprends que cela supprimera "{categoryName}" dans tous les métiers"`
   - **Localisation** : `src/App.jsx` ligne 187-195, 594-604

### Effets de la Suppression

- Supprime l'intérêt professionnel pour **TOUS les métiers**
- Supprime automatiquement **toutes les motivations clés** associées à cet intérêt
- Supprime tous les poids (weights) associés aux critères supprimés
- **Localisation** : `src/services/storage.js` ligne 233-254

---

## 🎯 Suppression de Motivation Clé (Criterion)

### Règles de Suppression

1. **Toujours autorisée** ✅
   - **Condition** : Aucune restriction
   - **Action** : Suppression **TOUJOURS AUTORISÉE** avec confirmation
   - **Modal** :
     - Titre : `"Supprimer la motivation clé"`
     - Message : `"Êtes-vous sûr de vouloir supprimer "{criterionName}" ? Cette action supprimera cette motivation clé pour TOUS les métiers."`
     - **Checkbox obligatoire** : `"Je comprends que cela supprimera "{criterionName}" dans tous les métiers"`
   - **Localisation** : `src/App.jsx` ligne 233-249, 606-614

### Effets de la Suppression

- Supprime la motivation clé pour **TOUS les métiers**
- Retire la motivation clé de la liste `criterionIds` de sa catégorie
- Supprime tous les poids (weights) associés à cette motivation clé
- **Localisation** : `src/services/storage.js` ligne 367-394

---

## 📊 Récapitulatif des Règles

| Élément | Condition de Blocage | Confirmation Requise | Checkbox Requise | Suppression Multi-Métiers |
|---------|---------------------|---------------------|------------------|---------------------------|
| **Métier** | Dernier métier avec données | ✅ Toujours | ✅ Si dernier métier | ❌ Non (spécifique au métier) |
| **Intérêt Professionnel** | Avec motivations ET plusieurs métiers | ✅ Toujours | ✅ Si plusieurs métiers | ✅ Oui (tous les métiers) |
| **Motivation Clé** | ❌ Aucune | ✅ Toujours | ✅ Si plusieurs métiers | ✅ Oui (tous les métiers) |

---

## 🔍 Points d'Attention

1. **Ordre de suppression** : Pour supprimer un métier qui est le dernier avec des données, il faut d'abord supprimer tous les intérêts professionnels et leurs motivations clés.

2. **Suppression en cascade** : 
   - Supprimer un intérêt professionnel supprime automatiquement toutes ses motivations clés
   - Supprimer un métier supprime tous ses poids associés

3. **Portée des suppressions** :
   - Métiers : Suppression locale (ne concerne que le métier)
   - Intérêts professionnels : Suppression globale (tous les métiers)
   - Motivations clés : Suppression globale (tous les métiers)

4. **Confirmations** :
   - Un seul métier : Confirmation simple pour intérêts et motivations (pas de checkbox)
   - Plusieurs métiers : Confirmation avec checkbox obligatoire pour intérêts et motivations
   - Dernier métier : Confirmation spéciale avec checkbox obligatoire
   - **Règle simplifiée** : Avec un seul métier, on peut supprimer un intérêt même s'il contient des motivations (avec confirmation)

---

## 📝 Notes de Développement

- Les règles sont implémentées dans plusieurs fichiers :
  - `src/App.jsx` : Logique de validation et modals de confirmation
  - `src/components/CategoryDetail.jsx` : Désactivation du bouton de suppression
  - `src/components/ProfessionTabs.jsx` : Désactivation du bouton de suppression
  - `src/hooks/useProfessions.js` : Validation de suppression de métier
  - `src/services/storage.js` : Implémentation de la suppression en base
