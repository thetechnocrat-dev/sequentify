import React, { Component } from 'react';
import { Row, Col,  Well } from 'react-bootstrap/lib';

// Custom components
import SeqPair from './SeqPair';

class AlignOutput extends Component {
  makeSeqPairs() {
    if (this.props.output[0] === '' ) {
      return <p style={{ color: '#8e8e8e' }}>Alignment output will appear hear</p>
    } else {
      return this.props.output.map((seqPair, i) => {
        return <SeqPair seqPair={seqPair} key={i} />
        }
      );
    }
  }

  render () {
    return (
      <Row>
        <Col xs={12}>
          <Well style={{ minHeight: this.props.height }} >{this.makeSeqPairs()}</Well>
        </Col>
      </Row>
    )
  }
}

AlignOutput.propTypes = {
  output: React.PropTypes.array.isRequired,
  height: React.PropTypes.number.isRequired,
}

export default AlignOutput;
