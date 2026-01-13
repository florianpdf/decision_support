import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CritereList from '../../components/CritereList';

describe('CritereList', () => {
  const mockCategory = {
    id: 1,
    name: 'Test Category',
    color: '#FF0000',
    criteria: [
      { id: 1, name: 'Criterion 1', weight: 15, type: 'neutral' },
      { id: 2, name: 'Criterion 2', weight: 20, type: 'advantage' }
    ]
  };

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggleStateChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
    mockOnToggleStateChange.mockClear();
  });

  it('should return null when no criteria', () => {
    const { container } = render(
      <CritereList
        category={{ ...mockCategory, criteria: [] }}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render list of criteria', () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Criterion 1')).toBeInTheDocument();
    expect(screen.getByText('Criterion 2')).toBeInTheDocument();
  });

  it('should toggle criterion accordion on click', async () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const criterion1 = screen.getByText('Criterion 1').closest('[role="button"]');
    expect(criterion1).toHaveAttribute('aria-expanded', 'false');

    await user.click(criterion1);
    expect(criterion1).toHaveAttribute('aria-expanded', 'true');
  });

  it('should toggle criterion accordion on Enter key', async () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const criterion1 = screen.getByText('Criterion 1').closest('[role="button"]');
    criterion1.focus();
    
    await user.keyboard('{Enter}');
    expect(criterion1).toHaveAttribute('aria-expanded', 'true');
  });

  it('should call onDelete when delete button is clicked', async () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByLabelText(/supprimer la motivation clé/i);
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(1, 1);
  });

  it('should display edit form when edit button is clicked', async () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByLabelText(/modifier la motivation clé/i);
    await user.click(editButtons[0]);

    // Should show edit form
    expect(screen.getByLabelText(/nom de la motivation clé/i)).toBeInTheDocument();
  });

  it('should expose toggleAll via ref', () => {
    const ref = React.createRef();
    render(
      <CritereList
        ref={ref}
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(ref.current).toHaveProperty('toggleAll');
    expect(typeof ref.current.toggleAll).toBe('function');
  });

  it('should call onToggleStateChange when toggle state changes', async () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStateChange={mockOnToggleStateChange}
      />
    );

    const criterion1 = screen.getByText('Criterion 1').closest('[role="button"]');
    await user.click(criterion1);

    // Should notify parent of toggle state change
    expect(mockOnToggleStateChange).toHaveBeenCalled();
  });

  it('should display criterion details when expanded', async () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const criterion1 = screen.getByText('Criterion 1').closest('[role="button"]');
    await user.click(criterion1);

    // Should show weight and type controls when expanded
    // Use getAllByLabelText and check first one since there are multiple
    const importanceInputs = screen.getAllByLabelText(/importance/i);
    expect(importanceInputs.length).toBeGreaterThan(0);
  });

  it('should display summary when collapsed', () => {
    render(
      <CritereList
        category={mockCategory}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Should show summary with weight and type
    expect(screen.getByText(/importance: 15/i)).toBeInTheDocument();
    expect(screen.getByText(/importance: 20/i)).toBeInTheDocument();
  });
});
