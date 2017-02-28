import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Popover, DropdownButton, Alert, MenuItem, Row, Col, Button, FormGroup, FormControl,
  ButtonGroup, OverlayTrigger, Glyphicon } from 'react-bootstrap/lib';
import Sequences from '../util/sequences';
import Urls from '../util/urls';
import AlignSettingsForm from './AlignSettingsForm';

function AlignSettingsPopover(props) {
  return (
    <Popover id="align-settings" title="Align Settings">
      <AlignSettingsForm {...props} />
    </Popover>
  );
}

class AlignSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      targetTitle: 'Select a Sequence',
      dbTitle: 'Select a Database',
      targetErrors: [],
      dbErrors: [],
      matchScore: '2',
      mismatchPenalty: '-6',
      gapPenalty: '-4',
      gapOpeningPenalty: '-16',
    };
  }

  handleFormChange(key, e) {
    const newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  clickAlignSearch() {
    function validateTargetInput(seq) {
      const errors = [];
      if (seq.length === 0) {
        errors.push('Input sequence is required.');
      }

      if (!seq.match(/^[gctaGCTA\s]+$/)) {
        errors.push('Input sequence can only contain a, t, c, g, A, T, C, or G.');
      }

      return errors;
    }

    const { dbTitle, matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty, targetTitle } = this.state;
    const targetSeq = ReactDOM.findDOMNode(this.refs.targetForm).value;
    const targetErrors = validateTargetInput(targetSeq);
    const dbErrors = [];
    if (dbTitle === 'Select a Database') {
      dbErrors.push('Database Selection is Required');
    }

    if (targetErrors.length === 0 && dbErrors.length === 0) {
      this.setState({ targetErrors: [], dbErrors, isLoading: true });
      axios.post(`${Urls.api}/alignSearch`, {
        TargetSeq: targetSeq,
        Sequences: Sequences['H2A genes'],
        MatchScore: parseFloat(matchScore),
        MismatchPenalty: parseFloat(mismatchPenalty),
        GapPenalty: parseFloat(gapPenalty),
        GapOpeningPenalty: parseFloat(gapOpeningPenalty),
      })
        .then((response) => {
          this.setState({ isLoading: false });
          const scores = response.data.sort((result1, result2) => result1.Score <= result2.Score);
          this.props.updateOutput({
            output: scores, targetSeqName: targetTitle, matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty,
          });
        },
      )
        .catch(() => {
          this.setState({ isLoading: false, errors: ['Server error try refreshing the page'] });
        },
      );
    } else {
      this.setState({ targetErrors, dbErrors });
    }
  }

  handleSequenceChange(e) {
    this.setState({ targetSeq: e.target.value });
  }

  makeErrorAlert(errorKey) {
    if (this.state[errorKey].length > 0) {
      return (
        <Alert bsStyle="warning">
          {this.state[errorKey].join('\n')}
        </Alert>
      );
    }
    return <div />;
  }

  clickSeqItem(ref, sequence, name) {
    ReactDOM.findDOMNode(this.refs[ref]).value = sequence;
    this.setState({ targetTitle: name });
  }

  makeSeqMenuItems(ref) {
    return Sequences['H2A genes'].map((seq, i) =>
      // seq[0] == seqName, seq[1] == sequence
      <MenuItem
        key={i}
        onClick={this.clickSeqItem.bind(this, ref, seq[1], seq[0])}
      >
        {seq[0]}
      </MenuItem>,
    );
  }

  makeSeqDropdown(ref) {
    let title = this.state.targetTitle;
    const cutoff = 40;
    const end = title.length > cutoff ? cutoff : title.length;
    if (end === cutoff) { title = `${title.slice(0, end)}...`; }
    return (
      <DropdownButton
        title={title}
        bsStyle={'primary'}
        style={{ marginBottom: '10px' }}
        id="select a sequence"
      >
        {this.makeSeqMenuItems(ref)}
      </DropdownButton>
    );
  }

  clickDbItem(seqDbName) {
    this.setState({ dbTitle: seqDbName });
  }

  makeDbMenuItems() {
    return Object.keys(Sequences).map((seqDbName, i) =>
      <MenuItem
        key={i}
        onClick={this.clickDbItem.bind(this, seqDbName)}
      >
        {seqDbName}
      </MenuItem>,
    );
  }

  makeDbDropdown() {
    const { dbTitle } = this.state;
    return (
      <DropdownButton
        title={dbTitle}
        bsStyle={'primary'}
        style={{ marginBottom: '10px' }}
        id="select a sequence database"
      >
        {this.makeDbMenuItems()}
      </DropdownButton>
    );
  }

  render() {
    return (
      <Row style={{ marginTop: '15px' }}>
        <Col xs={12}>
          {this.makeErrorAlert('dbErrors')}
          {this.makeDbDropdown()}
        </Col>

        <Col xs={12}>
          {this.makeErrorAlert('targetErrors')}
          {this.makeSeqDropdown('targetForm')}
          <FormGroup controlId="formControlsTextarea">
            <FormControl
              ref="targetForm"
              componentClass="textarea"
              placeholder="Or insert sequence here"
              style={{ height: this.props.height }}
              onChange={this.handleSequenceChange.bind(this)}
            />
          </FormGroup>
        </Col>

        <Col xs={12} style={{ textAlign: 'center' }}>
          <ButtonGroup>
            <Button
              onClick={this.clickAlignSearch.bind(this)}
              bsStyle="accent"
              style={{ margin: '-5px 0px 10px 0px' }}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? 'Search Aligning...' : 'Search Align'}
            </Button>
            <OverlayTrigger
              trigger="click"
              rootClose
              placement="right"
              overlay={AlignSettingsPopover(
                {
                  handleFormChange: this.handleFormChange.bind(this),
                  matchScore: this.state.matchScore,
                  mismatchPenalty: this.state.mismatchPenalty,
                  gapPenalty: this.state.gapPenalty,
                  gapOpeningPenalty: this.state.gapOpeningPenalty,
                },
              )}
            >
              <Button
                bsStyle="accent-off"
                style={{ margin: '-5px 0px 10px 0px' }}
              >
                <Glyphicon glyph="cog" />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </Col>
      </Row>
    );
  }
}

AlignSearchInput.propTypes = {
  updateOutput: React.PropTypes.func.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default AlignSearchInput;
