import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { DropdownButton, MenuItem, ButtonGroup, Alert, Row, Col, FormGroup, FormControl,
  Button, Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap/lib';
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

class AlignInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      titleA: 'Select an Example Sequence',
      titleB: 'Select an Example Sequence',
      errorsA: [],
      errorsB: [],
      matchScore: '2',
      mismatchPenalty: '6',
      gapPenalty: '4',
      gapOpeningPenalty: '16',
    };
  }

  handleFormChange(key, e) {
    const newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  clickAlign() {
    function validateInput(seq) {
      const errors = [];
      if (seq.length === 0) {
        errors.push('Input sequence is required.');
      }

      if (!seq.match(/^[gctaGCTA\s]+$/)) {
        errors.push('Input sequence can only contain a, t, c, g, A, T, C, or G.');
      }

      return errors;
    }

    const { matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty } = this.state;
    const seqA = ReactDOM.findDOMNode(this.refs.formA).value;
    const seqB = ReactDOM.findDOMNode(this.refs.formB).value;
    const errorsA = validateInput(seqA);
    const errorsB = validateInput(seqB);
    if (errorsA.length === 0 && errorsB.length === 0) {
      this.setState({ errorsA: [], errorsB: [], isLoading: true });
      axios.post(`${Urls.api}/align`, {
        SeqA: seqA.toLowerCase().replace(/\s/g, ''),
        SeqB: seqB.toLowerCase().replace(/\s/g, ''),
        MatchScore: matchScore,
        MismatchPenalty: mismatchPenalty,
        GapPenalty: gapPenalty,
        GapOpeningPenalty: gapOpeningPenalty,
      })
        .then((response) => {
          this.setState({ isLoading: false });
          this.props.updateOutput(response.data);
        },
      )
        .catch(() => {
          this.setState({ isLoading: false, errors: ['Server error try refreshing the page'] });
        },
      );
    } else {
      this.setState({ errorsA, errorsB });
    }
  }

  handleSequenceChange(seqKey, e) {
    const newState = {};
    newState[seqKey] = e.target.value;
    this.setState(newState);
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

  clickSeqItem(ref, sequence, name, titleKey) {
    const newState = {};
    ReactDOM.findDOMNode(this.refs[ref]).value = sequence;
    newState[titleKey] = name;
    this.setState(newState);
  }

  makeSeqMenuItems(ref, titleKey) {
    return Sequences.map((seq, i) =>
      <MenuItem
        key={i}
        onClick={this.clickSeqItem.bind(this, ref, seq.sequence, seq.name, titleKey)}
      >
        {seq.name}
      </MenuItem>,
    );
  }

  makeSeqDropwdown(ref, titleKey) {
    return (
      <DropdownButton
        title={this.state[titleKey]}
        bsStyle={'primary'}
        style={{ marginBottom: '10px' }}
        id="select a sequence"
      >
        {this.makeSeqMenuItems(ref, titleKey)}
      </DropdownButton>
    );
  }

  render() {
    return (
      <Row>
        <Col xs={12} sm={6}>
          {this.makeErrorAlert('errorsA')}
          {this.makeSeqDropwdown('formA', 'titleA')}
          <FormGroup controlId="formControlsTextarea">
            <FormControl
              ref="formA"
              componentClass="textarea"
              placeholder="Or insert a sequence here"
              style={{ height: this.props.height }}
              onChange={this.handleSequenceChange.bind(this, 'seqA')}
            />
          </FormGroup>
        </Col>

        <Col xs={12} sm={6}>
          {this.makeErrorAlert('errorsA')}
          {this.makeSeqDropwdown('formB', 'titleB')}
          <FormGroup controlId="formControlsTextarea">
            <FormControl
              ref="formB"
              componentClass="textarea"
              placeholder="Or insert a sequence here"
              style={{ height: this.props.height }}
              onChange={this.handleSequenceChange.bind(this, 'seqB')}
            />
          </FormGroup>
        </Col>

        <Col xs={12} style={{ textAlign: 'center' }}>
          <ButtonGroup>
            <Button
              onClick={this.clickAlign.bind(this)}
              bsStyle="accent"
              style={{ margin: '-5px 0px 10px 0px' }}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? 'Aligning...' : 'Align'}
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

AlignInput.propTypes = {
  updateOutput: React.PropTypes.func.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default AlignInput;
