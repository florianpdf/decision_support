import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfessionTabs from '../../components/ProfessionTabs';
import * as storage from '../../services/storage';

vi.mock('../../services/storage', () => ({
  loadCategories: vi.fn(() => []),
  loadCriteria: vi.fn(() => [])
}));

describe('ProfessionTabs', () => {
  const mockProfessions = [
    { id: 1, name: 'Profession 1', created_at: new Date().toISOString() },
    { id: 2, name: 'Profession 2', created_at: new Date().toISOString() }
  ];

  const mockOnSelectProfession = vi.fn();
  const mockOnAddProfession = vi.fn();
  const mockOnDeleteProfession = vi.fn();
  const mockOnRenameProfession = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSelectProfession.mockClear();
    mockOnAddProfession.mockClear();
    mockOnDeleteProfession.mockClear();
    mockOnRenameProfession.mockClear();
    storage.loadCategories.mockReturnValue([]);
    storage.loadCriteria.mockReturnValue([]);
  });

  it('should return null when no professions', () => {
    const { container } = render(
      <ProfessionTabs
        professions={[]}
        currentProfessionId={null}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render profession tabs', () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    expect(screen.getByText('Profession 1')).toBeInTheDocument();
    expect(screen.getByText('Profession 2')).toBeInTheDocument();
  });

  it('should highlight active profession', () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const tab1 = screen.getByText('Profession 1').closest('.profession-tab');
    expect(tab1).toHaveClass('active');
  });

  it('should call onSelectProfession when tab is clicked', async () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const tab2 = screen.getByText('Profession 2').closest('.profession-tab');
    await user.click(tab2);

    expect(mockOnSelectProfession).toHaveBeenCalledWith(2);
  });

  it('should call onSelectProfession on Enter key', async () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const tab2 = screen.getByText('Profession 2').closest('.profession-tab');
    tab2.focus();
    await user.keyboard('{Enter}');

    expect(mockOnSelectProfession).toHaveBeenCalledWith(2);
  });

  it('should call onAddProfession when add button is clicked', async () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const addButton = screen.getByRole('button', { name: /nouveau métier/i });
    await user.click(addButton);

    expect(mockOnAddProfession).toHaveBeenCalled();
  });

  it('should not show add button when 5 professions exist', () => {
    const fiveProfessions = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Profession ${i + 1}`,
      created_at: new Date().toISOString()
    }));

    render(
      <ProfessionTabs
        professions={fiveProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    expect(screen.queryByRole('button', { name: /nouveau métier/i })).not.toBeInTheDocument();
  });

  it('should call onDeleteProfession when delete button is clicked', async () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const deleteButtons = screen.getAllByLabelText(/supprimer le métier/i);
    await user.click(deleteButtons[0]);

    expect(mockOnDeleteProfession).toHaveBeenCalledWith(1);
  });

  it('should call onRenameProfession when rename button is clicked', async () => {
    render(
      <ProfessionTabs
        professions={mockProfessions}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const renameButtons = screen.getAllByLabelText(/renommer le métier/i);
    await user.click(renameButtons[0]);

    expect(mockOnRenameProfession).toHaveBeenCalledWith(1);
  });

  it('should disable delete button for last profession when data exists', () => {
    storage.loadCategories.mockReturnValue([
      { id: 1, name: 'Category', color: '#FF0000', criteria: [] }
    ]);

    render(
      <ProfessionTabs
        professions={[{ id: 1, name: 'Profession 1', created_at: new Date().toISOString() }]}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const deleteButton = screen.getByLabelText(/supprimer le métier/i);
    expect(deleteButton).toBeDisabled();
  });

  it('should enable delete button for last profession when no data exists', () => {
    storage.loadCategories.mockReturnValue([]);
    storage.loadCriteria.mockReturnValue([]);

    render(
      <ProfessionTabs
        professions={[{ id: 1, name: 'Profession 1', created_at: new Date().toISOString() }]}
        currentProfessionId={1}
        onSelectProfession={mockOnSelectProfession}
        onAddProfession={mockOnAddProfession}
        onDeleteProfession={mockOnDeleteProfession}
        onRenameProfession={mockOnRenameProfession}
      />
    );

    const deleteButton = screen.getByLabelText(/supprimer le métier/i);
    expect(deleteButton).not.toBeDisabled();
  });
});
