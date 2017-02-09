import React, { Component } from 'react';
import { Table } from 'react-bootstrap/lib';

class AlignSearchOutput extends Component {
  makeTableRows() {
    const { output } = this.props;

    if (output[0] === '') {
      return (
        <tr>
          <td colSpan="3">Output will appear here.</td>
        </tr>
      );
    }

    return output.map((result, i) =>
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{result.Name}</td>
        <td>{result.Score}</td>
      </tr>,
    );
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
      </Table>
    );
  }
}

AlignSearchOutput.propTypes = {
  output: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default AlignSearchOutput;
