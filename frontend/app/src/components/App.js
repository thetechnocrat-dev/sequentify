import React, { Component } from 'react';
import { Grid, Panel } from 'react-bootstrap/lib';
import AlignInput from './AlignInput';
import AlignOutput from './AlignOutput';
import Helix from './Helix';
import Style from '../style';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      output: [''],
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  updateOutput(newOutput) {
    this.setState({ output: newOutput });
  }

  render() {
    let width;
    let minHeight;
    let marginTop;
    let sectionHeight;
    if (this.state.windowWidth < Style.xsCutoff) {
      width = '100%';
      minHeight = this.state.windowHeight;
      sectionHeight = minHeight * 0.2;
      marginTop = 0;
    } else if (this.state.windowWidth < Style.smCutoff) {
      width = '723px';
      minHeight = this.state.windowHeight * 0.9;
      sectionHeight = minHeight * 0.4;
      marginTop = this.state.windowHeight * 0.05;
    } else if (this.state.windowWidth < Style.mdCutoff) {
      width = '933px';
      minHeight = this.state.windowHeight * 0.8;
      sectionHeight = minHeight * 0.4;
      marginTop = this.state.windowHeight * 0.05;
    } else {
      width = '1127px';
      minHeight = this.state.windowHeight * 0.8;
      sectionHeight = minHeight * 0.4;
      marginTop = this.state.windowHeight * 0.05;
    }

    const panelStyle = {
      width,
      margin: 'auto',
      marginTop,
      minHeight,
    };

    const gridStyle = {
      width: '100%',
      height: '100%',
    };

    const panelTitle = (
      <h3>Sequentify DNA Sequence Aligner</h3>
    );

    const helixHeight = 80;

    return (
      <div>
        <Helix width={this.state.windowWidth} height={helixHeight} />
        <Panel style={panelStyle} header={panelTitle} bsStyle="primary">
          <Grid style={gridStyle}>
            <AlignInput updateOutput={this.updateOutput.bind(this)} height={sectionHeight} />
            <AlignOutput output={this.state.output} height={sectionHeight} />
          </Grid>
        </Panel>
      </div>
    );
  }
}

export default App;
