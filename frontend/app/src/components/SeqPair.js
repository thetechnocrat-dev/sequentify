import React, { Component } from 'react';

class SeqPair extends Component {
  render () {
    var pairDisplay;
    if (this.props.seqPair[0] === this.props.seqPair[1]) {
      pairDisplay = this.props.seqPair[0] + '\n|\n' +  this.props.seqPair[1];
    } else {
      pairDisplay = this.props.seqPair[0] + '\n \n' +  this.props.seqPair[1]
    }

    var style = {
      whiteSpace: 'pre-wrap',
      display: 'inline-block',
      width: '10px',
      textAlign: 'center',
    }
      
    return (
      <div style={style}>
        {pairDisplay}
      </div>
    )
  }
}

SeqPair.propTypes = {
  seqPair: React.PropTypes.string.isRequired,
}

export default SeqPair
