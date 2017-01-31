import React, { Component } from 'react';
import { Navbar, Nav, Modal } from 'react-bootstrap/lib';
import Style from '../style';
import NavItem from './NavItem';

class TopNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { showAboutModal: false };
  }

  closeAboutModal() {
    this.setState({ showAboutModal: false });
  }

  openAboutModal() {
    this.setState({ showAboutModal: true });
  }

  render() {
    return (
      <div>
        <style type="text/css">{`
          .navbar-custom {
            background-color: ${Style.primary};
            color: white;
            margin-bottom: 0;
          }
        `}</style>
        <style type="text/css">{`
          .icon-bar {
            background-color: white;
          }
        `}</style>
        <Navbar bsStyle="custom" fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              {'Sequentify'}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight >
              <NavItem title="about" clickFunc={this.openAboutModal.bind(this)} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal
          show={this.state.showAboutModal}
          onHide={this.closeAboutModal.bind(this)}
          style={{ marginTop: '225px' }}
        >
          <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Sequentify is an <a href="https://github.com/McMenemy/sequentify">open source</a> web app that aligns DNA sequences. The purpose of the app is mostly to serve as an educational tool since it allows exploration of the alignment function through easy changing of function variables. However, it is also useful for researchers who just want a quick customizable alignment between sequences. For more complicated alignments, use <a href="https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastSearch&BLAST_SPEC=blast2seq&LINK_LOC=align2seq">NCBI’s tool</a>. For more information on how to make your alignment more biologically relevant read <a href="https://en.wikipedia.org/wiki/Gap_penalty">here</a>.</p>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default TopNavbar;
