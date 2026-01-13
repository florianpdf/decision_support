import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Legend from './Legend';
import { getChartColorMode, setChartColorMode } from '../../services/storage';
import { CRITERION_TYPE_COLORS } from '../../utils/constants';

/**
 * Square chart component
 * Uses Recharts Treemap with CustomContent to display categories and their criteria
 */
function SquareChart({ categories, professionId }) {
    const [colorMode, setColorMode] = useState('category');

    // Load color mode preference for this profession
    useEffect(() => {
        if (professionId) {
            const savedMode = getChartColorMode(professionId);
            setColorMode(savedMode);
        }
    }, [professionId]);

    // Handle color mode switch change
    const handleColorModeChange = (event) => {
        const newMode = event.target.checked ? 'type' : 'category';
        setColorMode(newMode);
        if (professionId) {
            setChartColorMode(professionId, newMode);
        }
    };

    // Prepare data for Treemap with useMemo to avoid recalculations
    const data = useMemo(() => {
        if (!categories || categories.length === 0) {
            return [];
        }
        
        // Filter categories that have at least one criterion
        // and create hierarchical structure: each category is a parent with its criteria as children
        const result = categories
            .filter(category => category.criteria && category.criteria.length > 0)
            .map((category) => {
                // Calculate total weight of category (sum of criterion weights)
                const totalValue = category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
                
                // Create children (criteria) for this category
                // Include criterionId to uniquely identify each criterion (even if names are duplicate)
                const children = category.criteria.map((criterion) => ({
                    id: criterion.id, // Unique identifier for each criterion
                    name: criterion.name,
                    size: criterion.weight,
                    value: criterion.weight,
                    fill: colorMode === 'type' 
                        ? (CRITERION_TYPE_COLORS[criterion.type] || CRITERION_TYPE_COLORS.neutral)
                        : category.color,
                    weight: criterion.weight,
                    type: criterion.type || 'neutral',
                    categoryColor: category.color,
                }));
                
                return {
                    name: category.name,
                    size: totalValue,
                    value: totalValue,
                    fill: category.color,
                    children: children,
                };
            });
        
        return result;
    }, [categories, colorMode]);

    // CustomContent optimized with useCallback
    // Note: we use data via closure to access leaf data
    const CustomizedContent = useCallback((props) => {
        const { root, depth, x, y, width, height, index, name, payload } = props;
        
        // For root (depth === 0), draw nothing
        if (depth === 0) {
            return null;
        }
        
        // For groups (depth === 1), draw background with group color or just border
        if (depth === 1) {
            const groupData = root?.children?.[index];
            if (!groupData) return null;
            
            if (colorMode === 'type') {
                // In type mode, only show white border, no background
                return (
                    <g>
                        <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill="transparent"
                            stroke="#FFFFFF"
                            strokeWidth={6}
                        />
                    </g>
                );
            } else {
                // In category mode, show background with category color
                const groupColor = groupData.fill || '#3498db';
                return (
                    <g>
                        <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            fill={groupColor}
                            stroke="#FFFFFF"
                            strokeWidth={6}
                            fillOpacity={0.3}
                        />
                    </g>
                );
            }
        }
        
        // For leaves (depth === 2), draw squares
        // Treemap already calculates correct proportions: each criterion occupies
        // a space proportional to its weight relative to other criteria in its category
        if (depth === 2) {
            // In Recharts Treemap, for leaves, we can access data
            // via root by finding the parent (depth 1) then the corresponding child
            let criterionData = null;
            
            // Method 1: Use payload if available and has all required properties
            // Check if payload has the properties we need (id, type, categoryColor)
            // We need both type and categoryColor to be sure we have the correct data
            if (payload && payload.id && payload.type !== undefined && payload.categoryColor !== undefined) {
                criterionData = payload;
            } 
            // Method 2: Find via root by traversing groups and their children
            // This is more reliable as it uses the index, not the name
            else if (root?.children) {
                // For depth 2, we need to find the correct leaf by traversing all groups
                // The index in Treemap for depth 2 is a global index across all leaves
                let globalLeafIndex = 0;
                
                for (const group of root.children) {
                    if (group.children) {
                        for (let i = 0; i < group.children.length; i++) {
                            if (globalLeafIndex === index) {
                                criterionData = group.children[i];
                                break;
                            }
                            globalLeafIndex++;
                        }
                        if (criterionData) break;
                    }
                }
            }
            
            // Method 3: Use index to find in data (via closure) - most reliable
            // The Treemap structure maintains order, so we can use the index
            // This ensures each criterion is found correctly even if names are duplicate
            if (!criterionData && data.length > 0) {
                let globalLeafIndex = 0;
                for (const group of data) {
                    if (group.children) {
                        if (globalLeafIndex <= index && index < globalLeafIndex + group.children.length) {
                            const localIndex = index - globalLeafIndex;
                            criterionData = group.children[localIndex];
                            break;
                        }
                        globalLeafIndex += group.children.length;
                    }
                }
            }
            
            if (!criterionData) {
                return null;
            }
            
            // Debug: Log criterion data to verify correct retrieval
            // Remove this after debugging
            if (criterionData.name && data.length > 0) {
                const sameNameCount = data.reduce((count, group) => {
                    return count + (group.children?.filter(c => c.name === criterionData.name).length || 0);
                }, 0);
                if (sameNameCount > 1) {
                    console.log(`[SquareChart] Found criterion "${criterionData.name}" (ID: ${criterionData.id}, index: ${index})`, {
                        type: criterionData.type,
                        categoryColor: criterionData.categoryColor,
                        fill: criterionData.fill
                    });
                }
            }
            
            // Use type color if in type mode, otherwise use category color
            const backgroundColor = colorMode === 'type'
                ? (CRITERION_TYPE_COLORS[criterionData.type] || CRITERION_TYPE_COLORS.neutral)
                : (criterionData.categoryColor || criterionData.fill || '#3498db');
            
            // Use all space allocated by Treemap (which already calculated correct proportions)
            // The rectangle (x, y, width, height) already represents the correct proportional size
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
            
            const criterionName = name || criterionData.name || '';
            const fontSize = Math.max(12, Math.min(20, Math.min(width, height) / 3));
            const textInfo = formatTextForSquare(criterionName, width, height, fontSize);
            const totalTextHeight = textInfo.lines.length * textInfo.lineHeight;
            const startY = centerY - (totalTextHeight / 2) + (textInfo.lineHeight / 2);
            
            return (
                <g>
                    {/* Draw rectangle that occupies all allocated space */}
                    {/* Background color depends on mode: type color or category color, border is white */}
                    <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={backgroundColor}
                        stroke="#FFFFFF"
                        strokeWidth={3}
                        rx={4}
                        ry={4}
                        style={{ cursor: 'pointer' }}
                    />
                    {/* Display criterion name at center with line break handling */}
                    {/* Use white text on background for WCAG AA compliance */}
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
    }, [data, colorMode]);

    // Custom tooltip with useCallback
    const CustomTooltip = useCallback(({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const weight = data.weight || data.size || data.value || 0;
            
            // Determine importance level based on weight
            let importanceLabel = '';
            if (weight >= 0 && weight <= 9) {
                importanceLabel = `Importance faible (${weight})`;
            } else if (weight >= 10 && weight <= 19) {
                importanceLabel = `Importance moyenne (${weight})`;
            } else if (weight > 19) {
                importanceLabel = `Importance haute (${weight})`;
            } else {
                importanceLabel = `Importance: ${weight}`;
            }
            
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{importanceLabel}</p>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                    Graphique de visualisation
                </h2>
                <FormControlLabel
                    control={
                        <Switch
                            checked={colorMode === 'type'}
                            onChange={handleColorModeChange}
                            color="primary"
                        />
                    }
                    label={colorMode === 'type' ? 'Couleurs par type' : 'Couleurs par catégorie'}
                    labelPlacement="start"
                />
            </div>
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
