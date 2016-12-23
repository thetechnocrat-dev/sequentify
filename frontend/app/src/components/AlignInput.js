import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { DropdownButton, MenuItem, Alert, Row, Col, FormGroup, FormControl, Button } from 'react-bootstrap/lib';
import Sequences from '../util/sequences';
import Urls from '../util/urls';

// custom components

class AlignInput extends Component {
  state = {
    isLoading: false,
    titleA: 'Select an Example Sequence',
    titleB: 'Select an Example Sequence',
    errorsA: [],
    errorsB: [],
  };

  validateInput(seq) {
    var errors = [];
    if (seq.length === 0) {
      errors.push('Input sequence is required');
    }

    if (!seq.match(/^[gctaGCTA\s]+$/)) {
      errors.push('Input sequence can only contain a, t, c, g, A, T, C, or G.');
    }

    return errors;
  }

  clickAlign() {
    var seqA = ReactDOM.findDOMNode(this.refs.formA).value;
    var seqB = ReactDOM.findDOMNode(this.refs.formB).value;
    var errorsA = this.validateInput(seqA);
    var errorsB = this.validateInput(seqB);
    if (errorsA.length === 0 && errorsB.length === 0) {
      this.setState({ errorsA: [], errorsB: [], isLoading: true });
      axios.post(`${Urls.api}/align`, {
          SeqA: seqA.toLowerCase().replace(/\s/g, ''),
          SeqB: seqB.toLowerCase().replace(/\s/g, ''),
        })
        .then(response => {
          this.setState({ isLoading: false });
          this.props.updateOutput(response.data);
        }
      )
        .catch(error => {
          this.setState({ isLoading: false, errors: ['Server error try refreshing the page'] });
        }
      );
    } else {
      this.setState({ errorsA: errorsA, errorsB: errorsB });
    }
  }

  handleSequenceChange(seqKey, e) {
    var newState = {};
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
  }

  clickSeqItem(ref, sequence, name, titleKey) {
    ReactDOM.findDOMNode(this.refs[ref]).value = sequence;
    var newState = {};
    newState[titleKey] = name;
    this.setState(newState);
  }

  makeSeqMenuItems(ref, titleKey) {
    return Sequences.map((seq, i) => {
      return <MenuItem key={i} onClick={this.clickSeqItem.bind(this, ref, seq.sequence, seq.name, titleKey)}>{seq.name}</MenuItem>;
    });
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

  render () {
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
          <Button
            onClick={this.clickAlign.bind(this)}
            bsStyle="success"
            style={{ margin: '-5px 0px 10px 0px' }}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? 'Aligning...' : 'Align'}
          </Button>
        </Col>
      </Row>
    )
  }
}

AlignInput.propTypes = {
  updateOutput: React.PropTypes.func.isRequired,
  height: React.PropTypes.number.isRequired,
}

export default AlignInput;
