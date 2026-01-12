import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CritereEditForm from './CritereEditForm';

/**
 * Composant liste des critères avec drag & drop
 */
function CriteresList({ criteres, onDelete, onReorder, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        // Créer un nouveau tableau avec l'ordre modifié
        const items = Array.from(criteres);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Appeler la fonction de réordonnancement (ordre d'affichage uniquement)
        onReorder(items);
    };

    if (criteres.length === 0) {
        return (
            <div className="empty-state">
                <p>Aucun critère pour le moment</p>
                <p>Utilisez le formulaire pour en ajouter</p>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="criteres-list">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="criteres-list"
                    >
                        {criteres.map((critere, index) => (
                            <Draggable
                                key={critere.id}
                                draggableId={String(critere.id)}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`critere-item ${snapshot.isDragging ? 'dragging' : ''} ${editingId === critere.id ? 'editing' : ''}`}
                                    >
                                        {editingId === critere.id ? (
                                            <div className="critere-edit-container">
                                                <CritereEditForm
                                                    critere={critere}
                                                    onSubmit={(updatedCritere) => {
                                                        onUpdate(updatedCritere);
                                                        setEditingId(null);
                                                    }}
                                                    onCancel={() => setEditingId(null)}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div 
                                                    {...provided.dragHandleProps}
                                                    className="critere-item-content"
                                                >
                                                    <div
                                                        className="critere-color"
                                                        style={{ backgroundColor: critere.couleur }}
                                                    />
                                                    <div className="critere-info">
                                                        <div className="critere-nom">{critere.nom}</div>
                                                        <div className="critere-details">
                                                            Poids: {critere.poids}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="critere-actions">
                                                    <button
                                                        className="btn btn-secondary btn-small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingId(critere.id);
                                                        }}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(critere.id);
                                                        }}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default CriteresList;
