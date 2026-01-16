/**
 * Comparison metrics table component
 * Displays key metrics in a table format for easy comparison
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Comparison metrics table
 * @param {Object} props
 * @param {Object} props.metricsByProfession - Object with professionId as key and metrics as value
 * @param {Array} props.professions - Array of profession objects with id and name
 */
function ComparisonMetricsTable({ metricsByProfession, professions }) {

  if (!metricsByProfession || Object.keys(metricsByProfession).length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
        Aucune donnée à afficher
      </div>
    );
  }

  const selectedProfessions = professions.filter(p => metricsByProfession[p.id]);

  // Prepare table data
  // Note: We exclude "Nombre de motivations clés" and "Nombre d'intérêts professionnels"
  // as they are the same for all professions (shared categories and criteria)
  const tableData = [
    {
      label: 'Score global',
      getValue: (metrics) => metrics.globalScore || 0,
      format: (value) => value.toLocaleString('fr-FR')
    },
    {
      label: 'Total des importances',
      getValue: (metrics) => metrics.totalWeight || 0,
      format: (value) => value.toLocaleString('fr-FR')
    },
    {
      label: 'Total avantages',
      getValue: (metrics) => (metrics.typeDistribution?.advantage || 0) + (metrics.typeDistribution?.small_advantage || 0),
      format: (value) => value.toLocaleString('fr-FR')
    },
    {
      label: 'Total NSP',
      getValue: (metrics) => metrics.typeDistribution?.neutral || 0,
      format: (value) => value.toLocaleString('fr-FR')
    },
    {
      label: 'Total désavantages',
      getValue: (metrics) => (metrics.typeDistribution?.disadvantage || 0) + (metrics.typeDistribution?.small_disadvantage || 0),
      format: (value) => value.toLocaleString('fr-FR')
    }
  ];

  return (
    <div>
      {/* Header with title and switch */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '4px solid #5568d3'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.3rem', 
            fontWeight: '700', 
            color: '#2c3e50' 
          }}>
            📋 Tableau comparatif
          </h3>
        </div>
        <p style={{ 
          margin: 0, 
          color: '#5a6268', 
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          Comparaison des métriques principales entre les métiers sélectionnés
        </p>
      </div>

      {/* Table */}
      <div style={{ 
        overflowX: 'auto', 
        marginTop: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0'
      }}>
      <table 
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <thead>
          <tr style={{ 
            backgroundColor: '#5568d3',
            borderBottom: '2px solid #4455b8'
          }}>
            <th 
              style={{
                padding: '18px 20px',
                textAlign: 'left',
                fontWeight: '700',
                color: '#ffffff',
                fontSize: '1rem',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Métrique
            </th>
            {selectedProfessions.map(profession => (
              <th
                key={profession.id}
                style={{
                  padding: '18px 20px',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#ffffff',
                  fontSize: '1rem',
                  minWidth: '140px',
                  borderRight: selectedProfessions.indexOf(profession) < selectedProfessions.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
                }}
              >
                {profession.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={row.label}
              style={{
                backgroundColor: '#ffffff',
                borderBottom: index < tableData.length - 1 ? '1px solid #e8e8e8' : 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4ff';
                e.currentTarget.style.transform = 'scale(1.01)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(85, 104, 211, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <td
                style={{
                  padding: '16px 20px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '0.95rem',
                  borderRight: '1px solid #e8e8e8',
                  backgroundColor: '#ffffff'
                }}
              >
                {row.label}
              </td>
              {selectedProfessions.map(profession => {
                const metrics = metricsByProfession[profession.id];
                const value = metrics ? row.getValue(metrics) : 0;
                
                return (
                  <td
                    key={profession.id}
                    style={{
                      padding: '16px 20px',
                      textAlign: 'center',
                      color: '#2c3e50',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      borderRight: selectedProfessions.indexOf(profession) < selectedProfessions.length - 1 ? '1px solid #e8e8e8' : 'none'
                    }}
                  >
                    {row.format(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

ComparisonMetricsTable.propTypes = {
  metricsByProfession: PropTypes.object.isRequired,
  professions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
};

export default ComparisonMetricsTable;
