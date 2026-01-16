/**
 * Comparison bar chart component
 * Displays metrics comparison using bar charts
 */

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

/**
 * Comparison bar chart
 * @param {Object} props
 * @param {Object} props.metricsByProfession - Object with professionId as key and metrics as value
 * @param {Array} props.professions - Array of profession objects with id and name
 * @param {string} props.metricType - Type of metric to display: 'score' | 'weight' | 'criteria' | 'types'
 */
function ComparisonBarChart({ metricsByProfession, professions, metricType = 'score' }) {
  const selectedProfessions = professions.filter(p => metricsByProfession[p.id]);

  // Prepare chart data based on metric type
  const chartData = useMemo(() => {
    if (metricType === 'score') {
      return selectedProfessions.map(profession => {
        const metrics = metricsByProfession[profession.id];
        return {
          name: profession.name,
          'Score global': metrics?.globalScore || 0
        };
      });
    } else if (metricType === 'weight') {
      return selectedProfessions.map(profession => {
        const metrics = metricsByProfession[profession.id];
        return {
          name: profession.name,
          'Total importances': metrics?.totalWeight || 0
        };
      });
    } else if (metricType === 'criteria') {
      return selectedProfessions.map(profession => {
        const metrics = metricsByProfession[profession.id];
        return {
          name: profession.name,
          'Nombre de motivations': metrics?.totalCriteriaCount || 0
        };
      });
    } else if (metricType === 'types') {
      return selectedProfessions.map(profession => {
        const metrics = metricsByProfession[profession.id];
        const typeDist = metrics?.typeDistribution || {};
        return {
          name: profession.name,
          'Avantages': (typeDist.advantage || 0) + (typeDist.small_advantage || 0),
          'NSP': typeDist.neutral || 0,
          'Désavantages': (typeDist.disadvantage || 0) + (typeDist.small_disadvantage || 0)
        };
      });
    }
    return [];
  }, [metricsByProfession, professions, metricType, selectedProfessions]);

  if (chartData.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucune donnée à afficher
      </div>
    );
  }

  // Get colors for stacked bars
  const colors = {
    'Avantages': '#2d8659',
    'NSP': '#ff9800',
    'Désavantages': '#b84c6b'
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '450px', 
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#fafbfc',
      borderRadius: '12px',
      border: '1px solid #e8e8e8'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 25, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={90}
            tick={{ fontSize: '0.9rem', fill: '#5a6268' }}
            stroke="#7f8c8d"
          />
          <YAxis 
            tick={{ fontSize: '0.9rem', fill: '#5a6268' }}
            stroke="#7f8c8d"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '2px solid #5568d3',
              borderRadius: '10px',
              padding: '12px 16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '0.9rem'
            }}
            formatter={(value) => value.toLocaleString('fr-FR')}
            labelStyle={{ 
              fontWeight: '700', 
              color: '#2c3e50',
              marginBottom: '8px'
            }}
          />
          {metricType === 'types' ? (
            <>
              <Legend 
                wrapperStyle={{ paddingTop: '25px' }}
                iconType="square"
                formatter={(value) => {
                  const labels = {
                    'Avantages': 'Avantages',
                    'NSP': 'NSP',
                    'Désavantages': 'Désavantages'
                  };
                  return labels[value] || value;
                }}
                style={{ fontSize: '0.9rem' }}
              />
              <Bar 
                dataKey="Avantages" 
                stackId="types" 
                fill={colors['Avantages']}
                radius={[0, 0, 0, 0]}
                stroke="#1e6b47"
                strokeWidth={1}
              />
              <Bar 
                dataKey="NSP" 
                stackId="types" 
                fill={colors['NSP']}
                radius={[0, 0, 0, 0]}
                stroke="#e68900"
                strokeWidth={1}
              />
              <Bar 
                dataKey="Désavantages" 
                stackId="types" 
                fill={colors['Désavantages']}
                radius={[10, 10, 0, 0]}
                stroke="#a03d5a"
                strokeWidth={1}
              />
            </>
          ) : (
            <Bar 
              dataKey={Object.keys(chartData[0] || {}).find(key => key !== 'name')} 
              fill="#5568d3"
              radius={[10, 10, 0, 0]}
              stroke="#4455b8"
              strokeWidth={1}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

ComparisonBarChart.propTypes = {
  metricsByProfession: PropTypes.object.isRequired,
  professions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  metricType: PropTypes.oneOf(['score', 'weight', 'criteria', 'types']).isRequired
};

export default ComparisonBarChart;
