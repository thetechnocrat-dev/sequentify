import React, { Component } from 'react';
import Style from '../style';

class Helix extends Component {
  componentDidMount() {
    this.initHelix();
  }

  componentDidUpdate() {
    this.initHelix();
  }

  animateHelix(ctx, particles) {
    const { height, width } = this.props;
    function move(particle) {
      let y = (height / 4) * Math.sin(particle.x / 100);
      if (particle.mirror) { y *= -1; }
      ctx.beginPath();
      ctx.fillStyle = particle.fill;
      ctx.arc(particle.x, y + (height / 2), particle.radius, 0, 2 * Math.PI, false);
      ctx.fill();
      if (particle.x >= width + particle.radius) {
        particle.x = -20;
      } else {
        particle.x += 1;
      }
    }

    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      move(particle);
    });

    window.requestAnimationFrame(this.animateHelix.bind(this, ctx, particles));
  }

  initHelix() {
    const { width, height } = this.props;
    function createParticle(x, radius, options = {}) {
      if (!options.fill) { options.fill = Style.primary; }

      const particle = { x, radius, ...options };
      return particle;
    }

    const radius = height / 10;
    const spread = radius * 3;
    let particles = [];
    for (let x = -radius; x <= width + radius; x += spread) {
      const fill = Style.primary;
      particles.push(createParticle(x, radius, { fill, zIndex: 0 }));
    }

    let zIndex = 1;
    let prevY = (height / -4) * Math.sin(-radius / 100);
    const fill = 'black';
    for (let x = -radius; x <= this.props.width + radius; x += spread) {
      const y = (height / -4) * Math.sin(x / 100);
      if (prevY <= 2 * radius && y > 2 * radius) {
        zIndex *= -1;
      }
      prevY = y;
      particles.push(createParticle(x, radius, { mirror: true, fill, zIndex }));
    }

    particles = particles.sort((p1, p2) => p1.zIndex < p2.zIndex);

    const ctx = this.refs.canvas.getContext('2d');
    particles = particles.sort((p1, p2) => p2.zIndex > p1.zIndex);
    this.animateHelix(ctx, particles);
  }

  render() {
    const { height, width } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} />
    );
  }
}

Helix.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default Helix;
