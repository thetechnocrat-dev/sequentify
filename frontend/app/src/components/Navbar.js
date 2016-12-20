import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Navbar extends Component {
  render () {
    return (
      <AppBar
        title={'Sequentify'}
        showMenuIconButton={false}
      />
    );
  }
}

export default Navbar;
