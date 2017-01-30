import React, { Component } from 'react';
import Style from '../style';

class Helix extends Component {
  componentDidMount() {
    this.initHelix(this.props);
  }

  componentWillReceiveProps(newProps) {
    window.cancelAnimationFrame(this.animationReq);
    this.initHelix(newProps);
  }

  componentDidUpdate() {
    this.animationReq();
  }

  animateHelix(particles, rightBound, spread) {
    const { height, width } = this.props;
    const { ctx } = this.state;
    function move(particle) {
      let y = (height / 4) * Math.sin(particle.x / 100);
      if (particle.mirror) { y *= -1; }
      ctx.beginPath();
      ctx.fillStyle = particle.fill;
      ctx.arc(particle.x, y + (height / 2), particle.radius, 0, 2 * Math.PI, false);
      ctx.fill();
      if (particle.x >= rightBound + particle.radius) {
        particle.x = -1.5 * spread;
      } else {
        particle.x += 0.5;
      }
    }

    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      move(particle);
    });

    this.animationReq = window.requestAnimationFrame(this.animateHelix.bind(this, particles, rightBound, spread));
  }

  initHelix(props) {
    const { width, height } = props;
    function createParticle(x, radius, options = {}) {
      if (!options.fill) { options.fill = Style.primary; }

      const particle = { x, radius, ...options };
      return particle;
    }

    const radius = height / 10;
    const spread = radius * 3;
    const rightBound = Math.ceil((width) / spread) * spread; // prevents gaps on wrap
    let particles = [];
    for (let x = -spread; x <= rightBound; x += spread) {
      const fill = Style.primary;
      particles.push(createParticle(x, radius, { fill, zIndex: 0 }));
    }

    let zIndex = 1;
    let prevY = (height / -4) * Math.sin(-radius / 100);
    const fill = 'black';
    for (let x = -spread; x <= rightBound + radius; x += spread) {
      const y = (height / -4) * Math.sin(x / 100);
      if (prevY <= 2 * radius && y > 2 * radius) {
        zIndex *= -1;
      }
      prevY = y;
      particles.push(createParticle(x, radius, { mirror: true, fill, zIndex }));
    }

    particles = particles.sort((p1, p2) => p2.zIndex > p1.zIndex);
    this.animationReq = this.animateHelix.bind(this, particles, rightBound, spread); // used to remove later
    const ctx = this.refs.canvas.getContext('2d');
    this.setState({ ctx });
  }

  render() {
    const { height, width } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} style={{ marginTop: '50px' }} />
    );
  }
}

Helix.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default Helix;
