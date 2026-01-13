import React, { useMemo } from 'react';
import IconButton from './ui/IconButton';
import { loadCategories, loadCriteria } from '../services/storage';

/**
 * Component for displaying profession tabs
 */
function ProfessionTabs({ professions, currentProfessionId, onSelectProfession, onAddProfession, onDeleteProfession, onRenameProfession }) {
  if (professions.length === 0) {
    return null;
  }

  // Check if there are any categories or criteria (for last profession deletion check)
  const hasData = useMemo(() => {
    const categories = loadCategories();
    const criteria = loadCriteria();
    return categories.length > 0 || criteria.length > 0;
  }, []);

  return (
    <div className="profession-tabs" role="tablist" aria-label="Navigation between professions">
      {professions.map((profession) => (
        <div
          key={profession.id}
          className={`profession-tab ${profession.id === currentProfessionId ? 'active' : ''}`}
          role="tab"
          aria-selected={profession.id === currentProfessionId}
          aria-controls={`profession-${profession.id}`}
          onClick={() => onSelectProfession(profession.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectProfession(profession.id);
            }
          }}
          tabIndex={0}
        >
          <span className="profession-tab-name">{profession.name}</span>
          <div className="profession-tab-actions" onClick={(e) => e.stopPropagation()}>
            <IconButton
              icon="✏️"
              onClick={() => onRenameProfession(profession.id)}
              tooltip="Renommer le métier"
              tooltipPosition="top"
              ariaLabel="Renommer le métier"
            />
            <IconButton
              icon="🗑️"
              onClick={() => onDeleteProfession(profession.id)}
              tooltip={
                professions.length === 1 && hasData
                  ? "Impossible de supprimer le dernier métier tant qu'il reste des intérêts professionnels ou des motivations clés. Supprimez d'abord tous les intérêts professionnels et leurs motivations clés."
                  : "Supprimer le métier"
              }
              tooltipPosition="top"
              ariaLabel="Supprimer le métier"
              disabled={professions.length === 1 && hasData}
            />
          </div>
        </div>
      ))}
      {professions.length < 5 && (
        <button
          className="profession-tab-add"
          onClick={onAddProfession}
          aria-label="Créer un nouveau métier"
        >
          ➕ Nouveau métier
        </button>
      )}
    </div>
  );
}

export default ProfessionTabs;
