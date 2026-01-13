import React from 'react';
import PropTypes from 'prop-types';
import WeightSlider from './WeightSlider';
import CriterionTypeSelector from './CriterionTypeSelector';

/**
 * Reusable component for displaying and editing criterion weight and type
 * Used in both CritereForm and CritereList accordion
 */
const CriterionWeightAndType = ({
  weight,
  type,
  onWeightChange,
  onWeightCommit,
  onTypeChange,
  categoryColor,
  showWeightLabel = true,
  showWeightValue = true,
  weightLabel,
  namePrefix,
  weightId
}) => {
  return (
    <>
      {showWeightLabel && (
        <div className="critere-weight-label">
          {weightLabel || `⚖️ Importance: ${weight}`}
        </div>
      )}
      <WeightSlider
        id={weightId}
        value={weight}
        onChange={onWeightChange}
        onChangeCommitted={onWeightCommit}
        color={categoryColor}
        showValue={showWeightValue}
        ariaLabel="Importance de la motivation clé"
      />
      <div className="critere-type-container" style={{ marginTop: '15px' }}>
        <div className="critere-type-label" style={{ marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
          🎯 Type:
        </div>
        <CriterionTypeSelector
          selectedType={type}
          onChange={onTypeChange}
          namePrefix={namePrefix}
        />
      </div>
    </>
  );
};

CriterionWeightAndType.propTypes = {
  weight: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onWeightChange: PropTypes.func.isRequired,
  onWeightCommit: PropTypes.func,
  onTypeChange: PropTypes.func.isRequired,
  categoryColor: PropTypes.string,
  showWeightLabel: PropTypes.bool,
  showWeightValue: PropTypes.bool,
  weightLabel: PropTypes.string,
  namePrefix: PropTypes.string.isRequired,
  weightId: PropTypes.string
};

export default React.memo(CriterionWeightAndType);
