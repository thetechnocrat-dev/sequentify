import React, { Component } from 'react';
import { Row, Col, Well } from 'react-bootstrap/lib';
import SeqPair from './SeqPair';

class AlignOutput extends Component {
  makeSeqPairs() {
    const { output } = this.props;

    if (output[0] === '') {
      return <p style={{ color: '#8e8e8e' }}>Alignment output will appear hear</p>;
    }

    const labelStyle = {
      whiteSpace: 'pre-wrap',
      display: 'inline-block',
      width: '100px',
      textAlign: 'left',
      paddingTop: '10px',
      paddingBottom: '10px',
    };
    const labelText = 'Sequence1:\n\nSequence2:';
    const label = [<div style={labelStyle} key={-1}>{labelText}</div>];

    return label.concat(output.map((seqPair, i) => <SeqPair seqPair={seqPair} ind={i} key={i} />));
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Well style={{ minHeight: this.props.height }} >{this.makeSeqPairs()}</Well>
        </Col>
      </Row>
    );
  }
}

AlignOutput.propTypes = {
  output: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  height: React.PropTypes.number,
};

export default AlignOutput;
