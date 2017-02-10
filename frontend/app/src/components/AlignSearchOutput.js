import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Table, Modal, ProgressBar } from 'react-bootstrap/lib';
import AlignOutput from './AlignOutput';
import Urls from '../util/urls';
import Sequences from '../util/sequences';

class AlignSearchOutput extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, isLoading: false, errors: [], alignOutput: [''] };
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal() {
    this.setState({ showModal: true });
  }

  clickAlignment(seq1Name, seq2Name) {
    // this is not optimal because of data structure but will be changed once seqs are moved to backend
    function findSeq(seqName) {
      const sequences = Sequences['H2A genes'];
      for (let i = 0; i < sequences.length; i += 1) {
        if (sequences[i][0] === seqName) {
          return sequences[i][1];
        }
      }
      return false;
    }

    this.setState({ isLoading: true, errors: [] });
    this.openModal();
    const { matchScore, mismatchPenalty, gapPenalty, gapOpeningPenalty } = this.props;
    axios.post(`${Urls.api}/align`, {
      SeqA: findSeq(seq1Name),
      SeqB: findSeq(seq2Name),
      MatchScore: parseFloat(matchScore),
      MismatchPenalty: parseFloat(mismatchPenalty),
      GapPenalty: parseFloat(gapPenalty),
      GapOpeningPenalty: parseFloat(gapOpeningPenalty),
    })
      .then((response) => {
        this.setState({ isLoading: false, alignOutput: response.data });
      },
    )
      .catch(() => {
        this.setState({ isLoading: false, errors: ['Server error try refreshing the page'] });
      },
    );
  }

  makeTableRows() {
    const { output, targetSeqName } = this.props;

    if (output[0] === '') {
      return (
        <tr>
          <td colSpan="3">Output will appear here.</td>
        </tr>
      );
    }

    return output.map((result, i) =>
      <tr
        key={i}
        style={{ cursor: 'pointer' }}
        onClick={this.clickAlignment.bind(this, targetSeqName, result.Name)}
      >
        <td>{i + 1}</td>
        <td>{result.Name}</td>
        <td>{result.Score}</td>
      </tr>,
    );
  }

  makeModal() {
    const { isLoading, errors, alignOutput } = this.state;
    if (isLoading) {
      return <ProgressBar active now={100} />;
    } else if (errors.length > 0) {
      return <Alert bsStyle="danger">{errors.join(' ')}</Alert>;
    }

    return <AlignOutput output={alignOutput} />;
  }

  render() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {this.makeTableRows()}
        </tbody>

        <Modal
          show={this.state.showModal}
          onHide={this.closeModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Alignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.makeModal()}
          </Modal.Body>
        </Modal>
      </Table>
    );
  }
}

AlignSearchOutput.propTypes = {
  output: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  targetSeqName: React.PropTypes.string.isRequired,
  matchScore: React.PropTypes.number,
  mismatchPenalty: React.PropTypes.number,
  gapPenalty: React.PropTypes.number,
  gapOpeningPenalty: React.PropTypes.number,
};

export default AlignSearchOutput;
