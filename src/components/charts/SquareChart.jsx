import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
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

    // Prepare data for Treemap and create map for quick access by ID
    const { data, criterionMap } = useMemo(() => {
        if (!categories || categories.length === 0) {
            return { data: [], criterionMap: new Map() };
        }
        
        const map = new Map();
        
        const result = categories
            .filter(category => category.criteria && category.criteria.length > 0)
            .map((category) => {
                const totalValue = category.criteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
                
                const children = category.criteria.map((criterion) => {
                    const childData = {
                        id: criterion.id,
                        name: criterion.name,
                        size: criterion.weight,
                        value: criterion.weight,
                        fill: colorMode === 'type' 
                            ? (CRITERION_TYPE_COLORS[criterion.type] || CRITERION_TYPE_COLORS.neutral)
                            : category.color,
                        weight: criterion.weight,
                        type: criterion.type || 'neutral',
                        categoryColor: category.color,
                    };
                    // Store in map for quick access by ID (handles duplicate names)
                    map.set(criterion.id, childData);
                    return childData;
                });
                
                return {
                    name: category.name,
                    size: totalValue,
                    value: totalValue,
                    fill: category.color,
                    children: children,
                };
            });
        
        return { data: result, criterionMap: map };
    }, [categories, colorMode]);

    /**
     * Format text to fit within square dimensions
     */
    const formatTextForSquare = useCallback((text, maxWidth, maxHeight, fontSize) => {
        if (!text) return { lines: [], fontSize, lineHeight: fontSize * 1.2 };
        
        const charWidth = fontSize * 0.6;
        const padding = 8;
        const availableWidth = maxWidth - (padding * 2);
        const charsPerLine = Math.floor(availableWidth / charWidth);
        const lineHeight = fontSize * 1.2;
        const availableHeight = maxHeight - (padding * 2);
        const maxLines = Math.floor(availableHeight / lineHeight);
        
        if (text.length <= charsPerLine) {
            return { lines: [text], fontSize, lineHeight };
        }
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (word.length > charsPerLine) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = '';
                }
                let remainingWord = word;
                while (remainingWord.length > charsPerLine && lines.length < maxLines) {
                    lines.push(remainingWord.substring(0, charsPerLine - 3) + '...');
                    remainingWord = remainingWord.substring(charsPerLine - 3);
                }
                if (remainingWord && lines.length < maxLines) {
                    currentLine = remainingWord;
                }
            } else if (testLine.length <= charsPerLine) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
            
            if (lines.length >= maxLines) {
                if (currentLine && lines.length < maxLines) {
                    const truncated = currentLine.length > charsPerLine - 3 
                        ? currentLine.substring(0, charsPerLine - 3) + '...'
                        : currentLine;
                    lines.push(truncated);
                }
                break;
            }
        }
        
        if (currentLine && lines.length < maxLines) {
            lines.push(currentLine);
        }
        
        return { 
            lines: lines.slice(0, maxLines), 
            fontSize, 
            lineHeight 
        };
    }, []);

    /**
     * Render category group (depth 1)
     */
    const renderCategoryGroup = useCallback((x, y, width, height, groupData, mode) => {
        if (mode === 'type') {
            return (
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="transparent"
                    stroke="#FFFFFF"
                    strokeWidth={6}
                />
            );
        }
        
        const groupColor = groupData.fill || '#3498db';
        return (
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
        );
    }, []);

    /**
     * Render criterion square (depth 2)
     */
    const renderCriterionSquare = useCallback((x, y, width, height, criterionData, name, mode) => {
        const backgroundColor = mode === 'type'
            ? (CRITERION_TYPE_COLORS[criterionData.type] || CRITERION_TYPE_COLORS.neutral)
            : (criterionData.categoryColor || criterionData.fill || '#3498db');

        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const fontSize = Math.max(12, Math.min(20, Math.min(width, height) / 3));
        const textInfo = formatTextForSquare(name || criterionData.name || '', width, height, fontSize);
        const totalTextHeight = textInfo.lines.length * textInfo.lineHeight;
        const startY = centerY - (totalTextHeight / 2) + (textInfo.lineHeight / 2);
        
        return (
            <g>
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
    }, [formatTextForSquare]);

    /**
     * Custom content renderer for Treemap
     * Based on the working commit logic, adapted for ID-based lookup
     */
    const CustomizedContent = useCallback((props) => {
        const { root, depth, x, y, width, height, index, name, payload } = props;

        // Root level: render nothing
        if (depth === 0) {
            return null;
        }
        
        // Category group level (depth 1)
        if (depth === 1) {
            const groupData = root?.children?.[index];
            if (!groupData) return null;
            
            return (
                <g>
                    {renderCategoryGroup(x, y, width, height, groupData, colorMode)}
                </g>
            );
        }
        
        // Criterion level (depth 2)
        // The index at depth 2 is a global index across all leaves
        // Use the same logic as the working commit: traverse root.children with globalLeafIndex
        if (depth === 2) {
            let criterionData = null;
            
            // Method 1: Use payload if available (most reliable)
            if (payload && payload.id) {
                if (criterionMap.has(payload.id)) {
                    criterionData = criterionMap.get(payload.id);
                } else if (payload) {
                    criterionData = payload;
                }
            }
            
            // Method 2: Find via root by traversing groups and their children
            // This matches the exact logic from the working commit
            if (!criterionData && root?.children) {
                let parentGroup = null;
                let childIndexInParent = -1;
                let globalLeafIndex = 0;
                
                // Traverse all groups and their children, incrementing globalLeafIndex
                for (const group of root.children) {
                    if (group.children && Array.isArray(group.children)) {
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
                
                // Get the child data from the found parent group
                if (parentGroup && parentGroup.children && childIndexInParent >= 0) {
                    const leafData = parentGroup.children[childIndexInParent];
                    // Use ID to get complete data from map (handles duplicate names)
                    if (leafData?.id && criterionMap.has(leafData.id)) {
                        criterionData = criterionMap.get(leafData.id);
                    } else if (leafData) {
                        criterionData = leafData;
                    }
                }
            }
            
            // Method 3: Use name to find in data (via closure) - fallback for edge cases
            if (!criterionData && name && data.length > 0) {
                for (const group of data) {
                    if (group.children) {
                        // Try to find by name, but prefer ID-based lookup if available
                        const found = group.children.find(child => child.name === name);
                        if (found) {
                            // If found has ID, get complete data from map
                            if (found.id && criterionMap.has(found.id)) {
                                criterionData = criterionMap.get(found.id);
                            } else {
                                criterionData = found;
                            }
                            break;
                        }
                    }
                }
            }
            
            if (!criterionData) {
                return null;
            }
            
            return renderCriterionSquare(x, y, width, height, criterionData, name, colorMode);
        }
        
        return null;
    }, [colorMode, renderCategoryGroup, renderCriterionSquare, criterionMap, data]);

    /**
     * Custom tooltip component
     */
    const CustomTooltip = useCallback(({ active, payload }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }
        
        const data = payload[0].payload;
        const weight = data.weight || data.size || data.value || 0;
        
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
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                    {importanceLabel}
                </p>
            </div>
        );
    }, []);

    // Empty state
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span 
                        style={{ 
                            fontSize: '0.9rem', 
                            color: colorMode === 'category' ? '#5568d3' : '#7f8c8d',
                            fontWeight: colorMode === 'category' ? '600' : '400',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            if (colorMode !== 'category') {
                                handleColorModeChange({ target: { checked: false } });
                            }
                        }}
                    >
                        Couleurs par catégorie
                    </span>
                    <Switch
                        checked={colorMode === 'type'}
                        onChange={handleColorModeChange}
                        color="primary"
                    />
                    <span 
                        style={{ 
                            fontSize: '0.9rem', 
                            color: colorMode === 'type' ? '#5568d3' : '#7f8c8d',
                            fontWeight: colorMode === 'type' ? '600' : '400',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            if (colorMode !== 'type') {
                                handleColorModeChange({ target: { checked: true } });
                            }
                        }}
                    >
                        Couleurs par type
                    </span>
                </div>
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
            <Legend categories={categories} colorMode={colorMode} professionId={professionId} />
        </div>
    );
}

export default React.memo(SquareChart);
