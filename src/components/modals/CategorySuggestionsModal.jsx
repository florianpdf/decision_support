import React, { useState, useMemo } from 'react';
import { CATEGORY_SUGGESTIONS, filterSuggestions } from '../../utils/categorySuggestions';

/**
 * Modal component for suggesting professional interests
 */
function CategorySuggestionsModal({ 
  isOpen, 
  onClose, 
  onSelect,
  existingCategories = []
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter suggestions based on search term and existing categories
  const filteredSuggestions = useMemo(() => {
    return filterSuggestions(searchTerm, CATEGORY_SUGGESTIONS, existingCategories);
  }, [searchTerm, existingCategories]);

  const handleSelect = (suggestion) => {
    onSelect(suggestion);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
        <h3 className="modal-title">💡 Suggestions d'intérêts professionnels</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="suggestion-search" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>
            🔍 Rechercher un intérêt professionnel
          </label>
          <input
            type="text"
            id="suggestion-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tapez pour filtrer les suggestions..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e8ed',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            autoFocus
          />
        </div>

        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          border: '1px solid #e1e8ed',
          borderRadius: '8px',
          padding: '8px'
        }}>
          {filteredSuggestions.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredSuggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(suggestion)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      marginBottom: '4px',
                      textAlign: 'left',
                      background: 'white',
                      border: '1px solid #e1e8ed',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      transition: 'background 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f8f9fa';
                      e.target.style.borderColor = '#5568d3';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e1e8ed';
                    }}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: '#7f8c8d',
              fontSize: '0.95rem'
            }}>
              {searchTerm.trim() 
                ? 'Aucune suggestion trouvée pour votre recherche'
                : 'Toutes les suggestions ont déjà été utilisées'}
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategorySuggestionsModal;
