# Testing Guide

## Overview

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing. All tests must pass before any feature is considered complete.

## Test Coverage Requirements

- **Minimum coverage**: 80% for new code
- **Critical paths**: 100% coverage required
- All user-facing features must have tests
- All utility functions must have tests
- All hooks must have tests

## Test Structure

```
src/
├── components/
│   ├── ComponentName.jsx
│   └── ComponentName.test.jsx
├── hooks/
│   ├── useHookName.js
│   └── useHookName.test.js
├── utils/
│   ├── utilityName.js
│   └── utilityName.test.js
└── services/
    ├── serviceName.js
    └── serviceName.test.js
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test

# Run tests with coverage
npm test:coverage

# Run tests with UI
npm test:ui
```

## Writing Tests

### Component Tests

Every React component should have tests covering:
- Rendering with different props
- User interactions (clicks, form submissions, etc.)
- Edge cases (empty states, loading states, errors)
- Accessibility (ARIA attributes, keyboard navigation)

**Example:**
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### Hook Tests

Custom hooks should test:
- Initial state
- State updates
- Side effects
- Error handling

**Example:**
```jsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(defaultValue);
  });

  it('should update value', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### Utility Function Tests

Utility functions should test:
- Normal cases
- Edge cases (null, undefined, empty arrays, etc.)
- Error cases
- Boundary conditions

**Example:**
```jsx
import { describe, it, expect } from 'vitest';
import { myUtility } from './myUtility';

describe('myUtility', () => {
  it('should handle normal input', () => {
    expect(myUtility('input')).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(myUtility(null)).toBe(null);
    expect(myUtility('')).toBe('');
  });
});
```

## Test Naming Conventions

- Test files: `ComponentName.test.jsx` or `utilityName.test.js`
- Test suites: Use descriptive names matching the component/function
- Test cases: Use "should" statements describing expected behavior

**Good:**
```jsx
describe('CategoryForm', () => {
  it('should display error when name is empty', () => {});
  it('should call onSubmit with correct data', () => {});
});
```

**Bad:**
```jsx
describe('CategoryForm', () => {
  it('test 1', () => {});
  it('works', () => {});
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test user flows**: Test complete user interactions, not isolated functions
4. **Keep tests independent**: Each test should be able to run in isolation
5. **Mock external dependencies**: Use `vi.mock()` for services, APIs, etc.
6. **Clean up**: Use `afterEach` cleanup when needed
7. **Test accessibility**: Verify ARIA attributes and keyboard navigation

## Common Patterns

### Testing Forms

```jsx
it('should submit form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  
  render(<MyForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'Test Name');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({ name: 'Test Name' });
});
```

### Testing Async Operations

```jsx
it('should handle async operations', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Testing Error States

```jsx
it('should display error message', () => {
  render(<MyComponent error="Error message" />);
  
  expect(screen.getByRole('alert')).toHaveTextContent('Error message');
});
```

## Checklist for New Features

When adding a new feature, ensure you:

- [ ] Create test file alongside the component/function
- [ ] Test happy path (normal usage)
- [ ] Test edge cases (empty states, null values, etc.)
- [ ] Test error cases
- [ ] Test user interactions
- [ ] Test accessibility features
- [ ] Run `npm test:coverage` to verify coverage
- [ ] Ensure all tests pass before committing

## Updating Existing Tests

When modifying existing code:

- [ ] Update tests if behavior changes
- [ ] Add new tests for new functionality
- [ ] Remove or update obsolete tests
- [ ] Ensure test names still accurately describe behavior
- [ ] Run full test suite to catch regressions

## Continuous Integration

Tests are automatically run on:
- Pre-commit hooks (if configured)
- Pull requests
- Before merging to main branch

All tests must pass before code can be merged.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
