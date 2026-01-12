import React, { useMemo, useCallback } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import Legend from './Legend';

/**
 * Composant graphique nuage de carrés
 * Utilise Recharts Treemap avec CustomContent pour afficher les catégories et leurs critères
 */
function SquareChart({ categories }) {
    // Préparer les données pour le Treemap avec useMemo pour éviter les recalculs
    const data = useMemo(() => {
        if (!categories || categories.length === 0) {
            return [];
        }
        
        // Filtrer les catégories qui ont au moins un critère
        // et créer la structure hiérarchique : chaque catégorie est un parent avec ses critères comme children
        const result = categories
            .filter(category => category.criteres && category.criteres.length > 0)
            .map((category) => {
                // Calculer le poids total de la catégorie (somme des poids de ses critères)
                const totalValue = category.criteres.reduce((sum, critere) => sum + critere.poids, 0);
                
                // Créer les enfants (critères) de cette catégorie
                const children = category.criteres.map((critere) => ({
                    name: critere.nom,
                    size: critere.poids,
                    value: critere.poids,
                    fill: category.couleur,
                    couleur: category.couleur,
                    poids: critere.poids,
                }));
                
                return {
                    name: category.nom,
                    size: totalValue,
                    value: totalValue,
                    fill: category.couleur,
                    couleur: category.couleur,
                    children: children,
                };
            });
        
        return result;
    }, [categories]);

    // CustomContent optimisé avec useCallback
    // Note: on utilise data via closure pour accéder aux données des feuilles
    const CustomizedContent = useCallback((props) => {
        const { root, depth, x, y, width, height, index, name, payload } = props;
        
        // Pour la racine (depth === 0), ne rien dessiner
        if (depth === 0) {
            return null;
        }
        
        // Pour les groupes (depth === 1), dessiner un fond avec la couleur du groupe
        if (depth === 1) {
            const groupData = root?.children?.[index];
            if (!groupData) return null;
            
            const couleur = groupData.fill || groupData.couleur || '#3498db';
            
            return (
                <g>
                    <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={couleur}
                        stroke="#FFFFFF"
                        strokeWidth={6}
                        fillOpacity={0.3}
                    />
                </g>
            );
        }
        
        // Pour les feuilles (depth === 2), dessiner les carrés
        // Le Treemap calcule déjà les proportions correctes : chaque critère occupe
        // un espace proportionnel à son poids par rapport aux autres critères de sa catégorie
        if (depth === 2) {
            // Dans Recharts Treemap, pour les feuilles, on peut accéder aux données
            // via le root en trouvant le parent (depth 1) puis l'enfant correspondant
            let critereData = null;
            
            // Méthode 1: Utiliser payload si disponible
            if (payload) {
                critereData = payload;
            } 
            // Méthode 2: Trouver via le root en parcourant les groupes et leurs children
            else if (root?.children) {
                // Pour depth 2, l'index est relatif au parent (depth 1)
                let parentGroup = null;
                let childIndexInParent = -1;
                let globalLeafIndex = 0;
                
                for (const group of root.children) {
                    if (group.children) {
                        for (let i = 0; i < group.children.length; i++) {
                            if (globalLeafIndex === index) {
                                parentGroup = group;
                                childIndexInParent = i;
                                break;
                            }
                            globalLeafIndex++;
                        }
                        if (parentGroup) break;
                    }
                }
                
                if (parentGroup && parentGroup.children && childIndexInParent >= 0) {
                    critereData = parentGroup.children[childIndexInParent];
                }
            }
            
            // Méthode 3: Utiliser le name pour trouver dans data (via closure)
            if (!critereData && name && data.length > 0) {
                for (const group of data) {
                    if (group.children) {
                        const found = group.children.find(child => child.name === name);
                        if (found) {
                            critereData = found;
                            break;
                        }
                    }
                }
            }
            
            if (!critereData) {
                return null;
            }
            
            const couleurCategorie = critereData.fill || critereData.couleur || '#3498db';
            
            // Utiliser tout l'espace alloué par le Treemap (qui a déjà calculé les bonnes proportions)
            // Le rectangle (x, y, width, height) représente déjà la bonne taille proportionnelle
            const centerX = x + width / 2;
            const centerY = y + height / 2;
            
            // Function to wrap text and handle long names
            const formatTextForSquare = (text, maxWidth, maxHeight, fontSize) => {
                if (!text) return { lines: [], fontSize };
                
                // Calculate approximate character width (fontSize * 0.6 is a good approximation)
                const charWidth = fontSize * 0.6;
                const padding = 8; // Padding on each side
                const availableWidth = maxWidth - (padding * 2);
                const charsPerLine = Math.floor(availableWidth / charWidth);
                
                // Calculate line height
                const lineHeight = fontSize * 1.2;
                const availableHeight = maxHeight - (padding * 2);
                const maxLines = Math.floor(availableHeight / lineHeight);
                
                // If text fits on one line, return as is
                if (text.length <= charsPerLine) {
                    return { lines: [text], fontSize, lineHeight };
                }
                
                // Split text into words
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';
                
                for (const word of words) {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    
                    // If word alone is too long, split it
                    if (word.length > charsPerLine) {
                        if (currentLine) {
                            lines.push(currentLine);
                            currentLine = '';
                        }
                        // Split long word
                        let remainingWord = word;
                        while (remainingWord.length > charsPerLine) {
                            lines.push(remainingWord.substring(0, charsPerLine - 3) + '...');
                            remainingWord = remainingWord.substring(charsPerLine - 3);
                            if (lines.length >= maxLines) break;
                        }
                        if (remainingWord && lines.length < maxLines) {
                            currentLine = remainingWord;
                        }
                    } else if (testLine.length <= charsPerLine) {
                        currentLine = testLine;
                    } else {
                        if (currentLine) {
                            lines.push(currentLine);
                            currentLine = word;
                        } else {
                            lines.push(word);
                        }
                    }
                    
                    if (lines.length >= maxLines) {
                        // Truncate if too many lines
                        if (currentLine && lines.length < maxLines) {
                            if (currentLine.length > charsPerLine - 3) {
                                lines.push(currentLine.substring(0, charsPerLine - 3) + '...');
                            } else {
                                lines.push(currentLine);
                            }
                        }
                        break;
                    }
                }
                
                if (currentLine && lines.length < maxLines) {
                    lines.push(currentLine);
                }
                
                // If we have too many lines, truncate the last one
                if (lines.length > maxLines) {
                    const lastLine = lines[maxLines - 1];
                    if (lastLine.length > charsPerLine - 3) {
                        lines[maxLines - 1] = lastLine.substring(0, charsPerLine - 3) + '...';
                    }
                    return { lines: lines.slice(0, maxLines), fontSize, lineHeight };
                }
                
                return { lines, fontSize, lineHeight };
            };
            
            const critereName = name || critereData.name || '';
            const fontSize = Math.max(12, Math.min(20, Math.min(width, height) / 3));
            const textInfo = formatTextForSquare(critereName, width, height, fontSize);
            const totalTextHeight = textInfo.lines.length * textInfo.lineHeight;
            const startY = centerY - (totalTextHeight / 2) + (textInfo.lineHeight / 2);
            
            return (
                <g>
                    {/* Dessiner un rectangle qui occupe tout l'espace alloué */}
                    {/* Background color is the category color, border is white */}
                    <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={couleurCategorie}
                        stroke="#FFFFFF"
                        strokeWidth={3}
                        rx={4}
                        ry={4}
                        style={{ cursor: 'pointer' }}
                    />
                    {/* Afficher le nom du critère au centre avec gestion des retours à la ligne */}
                    {/* Use white text on category color background for WCAG AA compliance */}
                    {width > 40 && height > 40 && textInfo.lines.length > 0 && (
                        <text
                            x={centerX}
                            y={startY}
                            textAnchor="middle"
                            dominantBaseline="hanging"
                            fill="#FFFFFF"
                            fontSize={textInfo.fontSize}
                            fontWeight="normal"
                            style={{ 
                                pointerEvents: 'none', 
                                userSelect: 'none',
                                letterSpacing: '0.5px',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {textInfo.lines.map((line, index) => (
                                <tspan
                                    key={index}
                                    x={centerX}
                                    dy={index === 0 ? 0 : textInfo.lineHeight}
                                >
                                    {line}
                                </tspan>
                            ))}
                        </text>
                    )}
                </g>
            );
        }
        
        return null;
    }, [data]);

    // Tooltip personnalisé avec useCallback
    const CustomTooltip = useCallback(({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Importance: {data.poids || data.size || data.value}</p>
                </div>
            );
        }
        return null;
    }, []);

    if (data.length === 0) {
        return (
            <div className="empty-state" role="status" aria-live="polite">
                Aucune donnée à afficher
            </div>
        );
    }

    return (
        <div className="chart-wrapper" role="region" aria-label="Graphique de visualisation des intérêts professionnels">
            <div className="chart-container" aria-label="Treemap représentant les intérêts professionnels et leurs motivations clés">
                <ResponsiveContainer width="100%" height={500}>
                    <Treemap
                        data={data}
                        dataKey="size"
                        stroke="#fff"
                        fill="#8884d8"
                        content={CustomizedContent}
                        aria-label="Graphique de visualisation des intérêts professionnels"
                    >
                        <Tooltip content={CustomTooltip} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
            <Legend categories={categories} />
        </div>
    );
}

export default React.memo(SquareChart);
