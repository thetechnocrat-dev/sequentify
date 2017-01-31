import React from 'react';

function SeqPair(props) {
  const { seqPair } = props;
  let pairDisplay;
  if (seqPair[0] === seqPair[1]) {
    pairDisplay = `${seqPair[0]}\n|\n${seqPair[1]}`;
  } else {
    pairDisplay = `${seqPair[0]}\n \n${seqPair[1]}`;
  }

  const style = {
    whiteSpace: 'pre-wrap',
    display: 'inline-block',
    width: '10px',
    textAlign: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
  };

  return (
    <div style={style}>
      {pairDisplay}
    </div>
  );
}

SeqPair.propTypes = {
  seqPair: React.PropTypes.string.isRequired,
};

export default SeqPair;
