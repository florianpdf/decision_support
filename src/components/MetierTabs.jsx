import React from 'react';
import Tooltip from './Tooltip';
import IconButton from './ui/IconButton';

/**
 * Component for displaying metier tabs
 */
function MetierTabs({ metiers, currentMetierId, onSelectMetier, onAddMetier, onDeleteMetier, onRenameMetier }) {
  if (metiers.length === 0) {
    return null;
  }

  return (
    <div className="metier-tabs" role="tablist" aria-label="Navigation entre les métiers">
      {metiers.map((metier) => (
        <div
          key={metier.id}
          className={`metier-tab ${metier.id === currentMetierId ? 'active' : ''}`}
          role="tab"
          aria-selected={metier.id === currentMetierId}
          aria-controls={`metier-${metier.id}`}
          onClick={() => onSelectMetier(metier.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectMetier(metier.id);
            }
          }}
          tabIndex={0}
        >
          <span className="metier-tab-name">{metier.nom}</span>
          <div className="metier-tab-actions" onClick={(e) => e.stopPropagation()}>
            <Tooltip content="Renommer le métier" position="top">
              <IconButton
                onClick={() => onRenameMetier(metier.id)}
                aria-label="Renommer le métier"
              >
                ✏️
              </IconButton>
            </Tooltip>
            <Tooltip content="Supprimer le métier" position="top">
              <IconButton
                onClick={() => onDeleteMetier(metier.id)}
                aria-label="Supprimer le métier"
                disabled={metiers.length === 1}
              >
                🗑️
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ))}
      {metiers.length < 5 && (
        <button
          className="metier-tab-add"
          onClick={onAddMetier}
          aria-label="Créer un nouveau métier"
        >
          ➕ Nouveau métier
        </button>
      )}
    </div>
  );
}

export default MetierTabs;
