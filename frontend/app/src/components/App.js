import React, { Component } from 'react';
import { Grid, Panel } from 'react-bootstrap/lib';
import AlignInput from './AlignInput';
import AlignOutput from './AlignOutput';
import Helix from './Helix';
import Style from '../style';
import TopNavbar from './TopNavbar';

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
    let sectionHeight;
    if (this.state.windowWidth < Style.xsCutoff) {
      width = '100%';
      minHeight = this.state.windowHeight;
      sectionHeight = minHeight * 0.2;
    } else if (this.state.windowWidth < Style.smCutoff) {
      width = '723px';
      minHeight = this.state.windowHeight * 0.9;
      sectionHeight = minHeight * 0.4;
    } else if (this.state.windowWidth < Style.mdCutoff) {
      width = '933px';
      minHeight = this.state.windowHeight * 0.8;
      sectionHeight = minHeight * 0.4;
    } else {
      width = '1127px';
      minHeight = this.state.windowHeight * 0.8;
      sectionHeight = minHeight * 0.4;
    }

    const panelStyle = {
      width,
      margin: 'auto',
      minHeight,
    };

    const gridStyle = {
      width: '100%',
      height: '100%',
    };

    const helixHeight = 60;

    return (
      <div>
        <TopNavbar />
        <style type="text/css">{`
          .btn-primary {
            background-color: ${Style.primary};
            color: white;
          }
        `}</style>
        <Helix width={this.state.windowWidth} height={helixHeight} />
        <style type="text/css">{`
          .btn-accent {
            background-color: ${Style.accent};
            color: white;
          }
        `}</style>
        <style type="text/css">{`
          .btn-accent-off {
            background-color: ${Style.accentOff};
            color: white;
          }
        `}</style>
        <style type="text/css">{`
          .panel-primary {
            border-color: {Style.primary};
          }
        `}</style>
        <Panel style={panelStyle} bsStyle="primary">
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
