import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Legend from '../../components/charts/Legend';

describe('Legend', () => {
  it('should return null when no categories with criteria', () => {
    const { container } = render(<Legend categories={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when categories have no criteria', () => {
    const categories = [
      { id: 1, name: 'Category 1', color: '#FF0000', criteria: [] }
    ];
    const { container } = render(<Legend categories={categories} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display categories with criteria', () => {
    const categories = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [
          { id: 1, name: 'Criterion 1', weight: 10 },
          { id: 2, name: 'Criterion 2', weight: 20 }
        ]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText(/2 motivation/i)).toBeInTheDocument();
    expect(screen.getByText(/importance: 30/i)).toBeInTheDocument();
  });

  it('should display multiple categories', () => {
    const categories = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [{ id: 1, name: 'Criterion 1', weight: 10 }]
      },
      {
        id: 2,
        name: 'Category 2',
        color: '#00FF00',
        criteria: [{ id: 2, name: 'Criterion 2', weight: 20 }]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should filter out categories without criteria', () => {
    const categories = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [{ id: 1, name: 'Criterion 1', weight: 10 }]
      },
      {
        id: 2,
        name: 'Category 2',
        color: '#00FF00',
        criteria: []
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.queryByText('Category 2')).not.toBeInTheDocument();
  });

  it('should display correct singular form for criterion', () => {
    const categories = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [{ id: 1, name: 'Criterion 1', weight: 10 }]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText(/1 motivation clé/i)).toBeInTheDocument();
  });

  it('should display correct plural form for criteria', () => {
    const categories = [
      {
        id: 1,
        name: 'Category 1',
        color: '#FF0000',
        criteria: [
          { id: 1, name: 'Criterion 1', weight: 10 },
          { id: 2, name: 'Criterion 2', weight: 20 }
        ]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText(/2 motivations clés/i)).toBeInTheDocument();
  });
});
