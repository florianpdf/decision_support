import React from 'react';
import Tooltip from './Tooltip';
import IconButton from './ui/IconButton';

/**
 * Component for displaying profession tabs
 */
function ProfessionTabs({ professions, currentProfessionId, onSelectProfession, onAddProfession, onDeleteProfession, onRenameProfession }) {
  if (professions.length === 0) {
    return null;
  }

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
            <Tooltip content="Rename profession" position="top">
              <IconButton
                icon="✏️"
                onClick={() => onRenameProfession(profession.id)}
                ariaLabel="Rename profession"
              />
            </Tooltip>
            <Tooltip content="Delete profession" position="top">
              <IconButton
                icon="🗑️"
                onClick={() => onDeleteProfession(profession.id)}
                ariaLabel="Delete profession"
                disabled={professions.length === 1}
              />
            </Tooltip>
          </div>
        </div>
      ))}
      {professions.length < 5 && (
        <button
          className="profession-tab-add"
          onClick={onAddProfession}
          aria-label="Create a new profession"
        >
          ➕ New Profession
        </button>
      )}
    </div>
  );
}

export default ProfessionTabs;
