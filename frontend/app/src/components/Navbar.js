import React from 'react';
import { Navbar } from 'react-bootstrap/lib';

const TopNavbar = function TopNavbar() {
  return (
    <Navbar inverse>
      <Navbar.Header>
        <Navbar.Brand>
          {'Squeify'}
        </Navbar.Brand>
      </Navbar.Header>
    </Navbar>
  );
};

export default TopNavbar;
