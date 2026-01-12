import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Legend from './charts/Legend';

describe('Legend', () => {
  it('should return null when no categories with criteres', () => {
    const { container } = render(<Legend categories={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when categories have no criteres', () => {
    const categories = [
      { id: 1, nom: 'Category 1', couleur: '#FF0000', criteres: [] }
    ];
    const { container } = render(<Legend categories={categories} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display categories with criteres', () => {
    const categories = [
      {
        id: 1,
        nom: 'Category 1',
        couleur: '#FF0000',
        criteres: [
          { id: 1, nom: 'Critere 1', poids: 10 },
          { id: 2, nom: 'Critere 2', poids: 20 }
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
        nom: 'Category 1',
        couleur: '#FF0000',
        criteres: [{ id: 1, nom: 'Critere 1', poids: 10 }]
      },
      {
        id: 2,
        nom: 'Category 2',
        couleur: '#00FF00',
        criteres: [{ id: 2, nom: 'Critere 2', poids: 20 }]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('should filter out categories without criteres', () => {
    const categories = [
      {
        id: 1,
        nom: 'Category 1',
        couleur: '#FF0000',
        criteres: [{ id: 1, nom: 'Critere 1', poids: 10 }]
      },
      {
        id: 2,
        nom: 'Category 2',
        couleur: '#00FF00',
        criteres: []
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.queryByText('Category 2')).not.toBeInTheDocument();
  });

  it('should display correct singular form for critere', () => {
    const categories = [
      {
        id: 1,
        nom: 'Category 1',
        couleur: '#FF0000',
        criteres: [{ id: 1, nom: 'Critere 1', poids: 10 }]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText(/1 motivation clé/i)).toBeInTheDocument();
  });

  it('should display correct plural form for criteres', () => {
    const categories = [
      {
        id: 1,
        nom: 'Category 1',
        couleur: '#FF0000',
        criteres: [
          { id: 1, nom: 'Critere 1', poids: 10 },
          { id: 2, nom: 'Critere 2', poids: 20 }
        ]
      }
    ];
    
    render(<Legend categories={categories} />);
    
    expect(screen.getByText(/2 motivations clés/i)).toBeInTheDocument();
  });
});
