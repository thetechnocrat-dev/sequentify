import React from 'react';
import { Navbar } from 'react-bootstrap/lib';
import Style from '../style';

const TopNavbar = function TopNavbar() {
  return (
    <div>
      <style type="text/css">{`
        .navbar-custom {
          background-color: ${Style.primary};
          color: white;
          margin-bottom: 0;
        }
      `}</style>
      <Navbar bsStyle="custom">
        <Navbar.Header>
          <Navbar.Brand>
            {'Sequentify'}
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    </div>
  );
};

export default TopNavbar;
