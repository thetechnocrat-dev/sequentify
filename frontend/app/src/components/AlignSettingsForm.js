import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap/lib';

function AlignSettingsForm(props) {
  const { handleFormChange, matchScore, mismatchPenalty, gapPenalty,
    gapOpeningPenalty } = props;
  return (
    <form>
      <FormGroup>
        <ControlLabel>Match Score</ControlLabel>
        <FormControl
          type="number"
          value={matchScore}
          style={{ width: '75px' }}
          onChange={handleFormChange.bind(null, 'matchScore')}
        />
        <ControlLabel>Mismatch Penalty</ControlLabel>
        <FormControl
          type="number"
          value={mismatchPenalty}
          style={{ width: '75px' }}
          onChange={handleFormChange.bind(null, 'mismatchPenalty')}
        />
        <ControlLabel>Gap Penalty</ControlLabel>
        <FormControl
          type="number"
          value={gapPenalty}
          style={{ width: '75px' }}
          onChange={handleFormChange.bind(null, 'gapPenalty')}
        />
        <ControlLabel>Gap Opening Penalty</ControlLabel>
        <FormControl
          type="number"
          value={gapOpeningPenalty}
          style={{ width: '75px' }}
          onChange={handleFormChange.bind(null, 'gapOpeningPenalty')}
        />
      </FormGroup>
    </form>
  );
}

AlignSettingsForm.propTypes = {
  handleFormChange: React.PropTypes.func.isRequired,
  matchScore: React.PropTypes.string.isRequired,
  mismatchPenalty: React.PropTypes.string.isRequired,
  gapPenalty: React.PropTypes.string.isRequired,
  gapOpeningPenalty: React.PropTypes.string.isRequired,
};

export default AlignSettingsForm;
