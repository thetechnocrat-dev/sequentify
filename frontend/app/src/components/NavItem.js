import React, { Component } from 'react';

class NavItem extends Component {
  render() {
    const { title, clickFunc } = this.props;

    const style = {
      marginTop: '15px',
      marginLeft: '10px',
      cursor: 'pointer',
    };

    return (
      <div style={style} onClick={clickFunc}>
        {title}
      </div>
    );
  }
}

NavItem.propTypes = {
  title: React.PropTypes.string.isRequired,
  clickFunc: React.PropTypes.func.isRequired,
};

export default NavItem;
