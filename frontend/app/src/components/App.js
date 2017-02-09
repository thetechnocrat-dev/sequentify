import React, { Component } from 'react';
import { Grid, Panel, Tab, Tabs } from 'react-bootstrap/lib';
import AlignInput from './AlignInput';
import AlignSearchInput from './AlignSearchInput';
import AlignOutput from './AlignOutput';
import AlignSearchOutput from './AlignSearchOutput';
import Helix from './Helix';
import Style from '../style';
import TopNavbar from './TopNavbar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      alignOutput: [''],
      alignSearchOutput: [''],
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

  updateOutput(key, newOutput) {
    const newState = {};
    newState[key] = newOutput;
    this.setState(newState);
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
            <Tabs defaultActiveKey={1} id="alignment tab selection">
              <Tab eventKey={1} title="Pair Alignment">
                <AlignInput updateOutput={this.updateOutput.bind(this, 'alignOutput')} height={sectionHeight} />
                <AlignOutput output={this.state.alignOutput} height={sectionHeight} />
              </Tab>
              <Tab eventKey={2} title="Database Alignment Search">
                <AlignSearchInput
                  updateOutput={this.updateOutput.bind(this, 'alignSearchOutput')}
                  height={sectionHeight}
                />
                <AlignSearchOutput output={this.state.alignSearchOutput} />
              </Tab>
            </Tabs>
          </Grid>
        </Panel>
      </div>
    );
  }
}

export default App;
