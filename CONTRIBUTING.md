# Guide de Contribution

## Workflow de Développement

### 1. Avant de commencer

- Assurez-vous d'avoir lu [TESTING.md](./TESTING.md)
- Vérifiez que tous les tests passent : `npm test`
- Familiarisez-vous avec la structure du projet

### 2. Développement d'une nouvelle fonctionnalité

1. **Créer la fonctionnalité**
   - Écrire le code de la fonctionnalité
   - Suivre les conventions de code existantes
   - Ajouter des commentaires en anglais

2. **Écrire les tests**
   - Créer le fichier de test correspondant
   - Utiliser les templates dans `src/test/templates/` si nécessaire
   - Tester tous les cas : normal, edge cases, erreurs
   - Vérifier l'accessibilité

3. **Vérifier les tests**
   ```bash
   npm test
   npm test:coverage
   ```

4. **Vérifier le code**
   - S'assurer que le code est lisible
   - Vérifier que les commentaires sont en anglais
   - Vérifier l'accessibilité (ARIA, navigation clavier)

### 3. Modification d'une fonctionnalité existante

1. **Modifier le code**
   - Apporter les modifications nécessaires
   - Maintenir la compatibilité si possible

2. **Mettre à jour les tests**
   - Modifier les tests existants si le comportement change
   - Ajouter de nouveaux tests pour les nouvelles fonctionnalités
   - Supprimer les tests obsolètes

3. **Vérifier les tests**
   ```bash
   npm test
   ```

### 4. Checklist avant commit

- [ ] Code fonctionne correctement
- [ ] Tous les tests passent (`npm test`)
- [ ] Couverture de tests >= 80% pour le nouveau code
- [ ] Tests ajoutés/modifiés pour toutes les nouvelles fonctionnalités
- [ ] Commentaires en anglais
- [ ] Code respecte les conventions existantes
- [ ] Accessibilité vérifiée
- [ ] Responsive design vérifié

## Règles de Tests

### Obligatoire

- ✅ Toute nouvelle fonctionnalité doit avoir des tests
- ✅ Toute modification de comportement doit mettre à jour les tests
- ✅ Les tests doivent être indépendants (peuvent s'exécuter dans n'importe quel ordre)
- ✅ Les tests doivent être rapides (< 1s par test)

### Recommandé

- ✅ Utiliser des noms de tests descriptifs
- ✅ Tester les cas limites et les erreurs
- ✅ Tester l'accessibilité
- ✅ Utiliser `screen.getByRole` plutôt que `getByTestId`

## Structure des Tests

```
ComponentName.test.jsx
├── describe('ComponentName')
│   ├── it('should render correctly')
│   ├── it('should handle user interaction')
│   ├── it('should handle edge cases')
│   └── it('should handle errors')
```

## Exemples

### Ajouter un nouveau composant

1. Créer `src/components/MyComponent.jsx`
2. Créer `src/components/MyComponent.test.jsx`
3. Écrire les tests avant ou pendant le développement
4. Vérifier que tous les tests passent

### Ajouter une nouvelle fonction utilitaire

1. Créer `src/utils/myUtility.js`
2. Créer `src/utils/myUtility.test.js`
3. Écrire les tests pour tous les cas d'usage
4. Vérifier la couverture

### Modifier un hook existant

1. Modifier `src/hooks/useMyHook.js`
2. Mettre à jour `src/hooks/useMyHook.test.js`
3. Ajouter des tests pour les nouveaux comportements
4. Vérifier que les anciens tests passent toujours

## Questions ?

Consultez [TESTING.md](./TESTING.md) pour plus de détails sur les tests.
