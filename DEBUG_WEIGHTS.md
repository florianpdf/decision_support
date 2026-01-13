# Debug: Problème de poids partagés entre critères avec même nom

## Problème signalé
Deux critères portant le même nom dans des catégories différentes récupèrent le poids et le type du premier critère créé.

## Structure actuelle
- **Critères** : `{ id, name, categoryId }` - chaque critère a un ID unique
- **Weights** : `{ professionId, categoryId, criterionId, weight, type }` - stockés par profession ET par critère

## Analyse du code

Le code utilise bien `criterionId` pour trouver les weights :
- `getCategoriesForProfession` : trouve les weights par `professionId` ET `criterionId`
- `setCriterionWeight` : trouve/mise à jour par `professionId` ET `criterionId`
- `setCriterionType` : trouve/mise à jour par `professionId` ET `criterionId`

## Hypothèses possibles

1. **Problème lors de l'initialisation d'un nouveau métier** : 
   - `initializeProfessionWeights` copie les weights par `criterionId`, donc ça devrait fonctionner
   - Mais peut-être qu'il y a un problème si un critère est créé après l'initialisation ?

2. **Problème lors de la création d'un nouveau critère** :
   - Quand on crée un nouveau critère, on appelle `setCriterionWeight` avec le `newCriterion.id` unique
   - Donc ça devrait créer un weight indépendant

3. **Problème de cache/state React** :
   - Peut-être que les critères sont mis en cache quelque part ?

## Solution proposée

Le code semble correct. Le problème pourrait venir de :
- Un bug dans l'initialisation des weights pour un nouveau métier
- Un problème de synchronisation entre la création d'un critère et l'initialisation des weights

**Action recommandée** : Réinitialiser le localStorage pour tester avec des données propres.
