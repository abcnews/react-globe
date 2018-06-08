const React = require('react');
const TopoJson = require('topojson');
const canvasDpiScaler = require('canvas-dpi-scaler');
const d3 = require('./d3');
const worldJson = require('./world.json');
const countriesJson = require('./countries.json');

const BRISBANE = [153.021072, -27.470125];

const OCEAN_COLOUR = '#E4EDF0';
const LAND_COLOUR = '#FFFFFF';
const LAND_STROKE_COLOUR = 'rgba(29, 60, 67, 0.5)';

const PLANE_IMAGE_SRC =
  'data:image/png;base64,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';

const LAND = TopoJson.feature(worldJson, worldJson.objects.land);
const COUNTRIES = TopoJson.feature(worldJson, worldJson.objects.countries).features.map(f => {
  f.properties.name = countriesJson[f.id.toString()] || '';
  f.properties.center = d3.geoCentroid(f);
  f.properties.colour = '#377f8c';
  return f;
});
const BORDERS = TopoJson.mesh(worldJson, worldJson.objects.countries, (a, b) => a !== b);

const toDegrees = kms => kms / 111.319444;
const wait = m => new Promise((resolve, reject) => setTimeout(resolve, m));
const findCountry = name => {
  return COUNTRIES.filter(c => {
    return c.properties.name.toLowerCase() === name.toLowerCase();
  })[0];
};

function getMargin(width, height) {
  let percentage = width < 700 ? 0.05 : 0.15;
  return Math.floor(Math.min(width, height) * percentage);
}

class Globe extends React.Component {
  constructor(props) {
    super(props);

    this.getContext = this.getContext.bind(this);

    this.onResize = this.onResize.bind(this);

    this.inversePosition = this.inversePosition.bind(this);

    this.setScale = this.setScale.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.rotateBy = this.rotateBy.bind(this);
    this.setScaleAndPosition = this.setScaleAndPosition.bind(this);

    this.highlightedCountries = [];
    this.setHighlightedCountries = this.setHighlightedCountries.bind(this);

    this.labels = [];
    this.setLabels = this.setLabels.bind(this);

    this.ranges = [];
    this.setRanges = this.setRanges.bind(this);

    this.draw = this.draw.bind(this);

    this.globe = { type: 'Sphere' };

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.margin = getMargin(this.width, this.height);
    this.projection = d3
      .geoOrthographic()
      .translate(this.width / 2, this.height / 2)
      .clipAngle(90)
      .precision(0.6)
      .fitExtent([[this.margin, this.margin], [this.width - this.margin, this.height - this.margin]], this.globe);

    this.INITIAL_SCALE = this.projection.scale();
    this.scale = this.INITIAL_SCALE;

    this.planeImage = document.createElement('img');
    this.planeImage.src = PLANE_IMAGE_SRC;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    this.canvas = d3
      .select(this.base)
      .append('canvas')
      .style('display', 'block')
      .attr('width', this.width)
      .attr('height', this.height);

    this.context = this.canvas.node().getContext('2d');
    this.canvasElement = this.canvas.node();

    canvasDpiScaler(this.canvasElement, this.context);

    // Do some preload magic to stop font flicker
    this.context.beginPath();
    this.context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    this.context.font = '700 18px ABCSans';
    this.context.fillText('Preloading ABC Sans...', 100, 100);

    this.path = d3
      .geoPath()
      .projection(this.projection)
      .context(this.context);

    this.setScaleAndPosition(this.props.scale || 100, this.props.center || BRISBANE, 0);
    this.setLabels(this.props.labels || []);

    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    const duration = nextProps.config.duration || this.props.config.duration || 1000;

    if (nextProps.config.center !== this.props.config.center && nextProps.config.center) {
      this.setPosition(nextProps.config.center, duration);
    }

    if (nextProps.config.scale !== this.props.config.scale && nextProps.config.scale) {
      this.setScale(nextProps.config.scale, duration);
    }

    if (nextProps.config.labels !== this.props.config.labels) {
      this.setLabels(nextProps.config.labels || []);
    }

    if (nextProps.config.ranges !== this.props.config.ranges) {
      this.setRanges(nextProps.config.ranges || []);
    }

    if (nextProps.config.highlightedCountries !== this.props.config.highlightedCountries) {
      this.highlightedCountries = (nextProps.config.highlightedCountries || []).map(name => findCountry(name));
    }

    if (nextProps.config.planeVector !== this.props.config.planeVector) {
      if (nextProps.config.planeVector) {
        let p = nextProps.config.planeVector.slice();

        if (typeof p[0] === 'string') {
          p = findCountry(p[0]).properties.center.concat(p[1] || 0);
        }

        // Angle is in degrees, convert to radians
        if (p[2]) {
          p[2] = p[2] * (Math.PI / 180);
        } else {
          p[2] = 0;
        }

        this.plane = p;
      } else {
        this.plane = null;
      }
    }

    this.draw(nextProps);
  }

  getContext() {
    return this.context.canvas ? this.context : this.canvas.node().getContext('2d');
  }

  onResize() {
    // Don't bother resizing if the change is just the mobile browser bars
    if (window.innerHeight < this.height && window.innerHeight > this.height - 80) return;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.attr('width', this.width).attr('height', this.height);

    this.margin = getMargin(this.width, this.height);
    this.projection
      .translate([this.width / 2, this.height / 2])
      .fitExtent([[this.margin, this.margin], [this.width - this.margin, this.height - this.margin]], this.globe);
    this.INITIAL_SCALE = this.projection.scale();

    // Keep scale at the percentage it was before the resize
    this.projection.scale((this.projection.scale() * this.scale) / 100);

    canvasDpiScaler(this.canvasElement, this.getContext());
    this.draw();
  }

  inversePosition() {
    return [-this.projection.rotate()[0], -this.projection.rotate()[1]];
  }

  /**
   * Animate a change in scale for the globe
   * @param {number} scale Percentage of initial scale
   * @param {number} duration A time in milliseconds
   * @param {function} onComplete A function to run when the tween has finished
   */
  setScale(scale, duration, onComplete) {
    if (typeof duration === 'undefined') duration = 1000;

    this.scale = scale;
    scale = (this.INITIAL_SCALE * scale) / 100;

    d3.select({})
      .transition()
      .duration(duration)
      .tween('zoom', () => {
        const scale0 = this.projection.scale();
        const lerp = d3.interpolate(scale0, scale);
        return t => {
          this.projection.scale(lerp(t));
          this.draw();

          if (t === 1) {
            onComplete && onComplete();
          }
        };
      });
  }

  /**
   * Animate the focused location of the globe
   * @param {array|string} position [lat, lng] or name of country
   * @param {number} duration A time in milliseconds
   * @param {function} onComplete A function to run when the tween has finished
   */
  setPosition(position, duration, onComplete) {
    if (typeof duration === 'undefined') duration = 1000;
    if (typeof position === 'string') position = findCountry(position).properties.center;

    d3.select({})
      .transition()
      .duration(duration)
      .tween('rotation', () => {
        const rotation0 = this.projection.rotate();
        const lerp = d3.interpolate(rotation0, [-position[0], -position[1]]);
        return t => {
          this.projection.rotate(lerp(t));
          this.draw();

          if (t === 1) {
            onComplete && onComplete();
          }
        };
      });
  }

  /**
   * Animate a change in location of the globe
   * @param {array} vector [x, y] in kilometres to be added to the current [lat, lng] position
   * @param {number} duration A time in milliseconds
   * @param {function} onComplete A function to run when the tween has finished
   */
  rotateBy(vector, duration, onComplete) {
    if (typeof duration === 'undefined') duration = 1000;

    const rotation0 = this.projection.rotate();
    const newPosition = [-rotation0[0] + toDegrees(vector[0]), -rotation0[1] + toDegrees(vector[1])];

    this.setPosition(newPosition, duration, onComplete);
  }

  /**
   * Animate a change in both zoom and location
   * @param {number} scale Percentage of initial scale
   * @param {array} position [lat, lng]
   * @param {number} duration A time in milliseconds
   * @param {function} onComplete A function to run when the tween has finished
   */
  setScaleAndPosition(scale, position, duration, onComplete) {
    if (typeof duration === 'undefined') duration = 1000;

    this.scale = scale;
    scale = (this.INITIAL_SCALE * scale) / 100;

    if (typeof position === 'string') position = findCountry(position).properties.center;

    d3.select({})
      .transition()
      .duration(duration)
      .tween('scaleAndRotation', () => {
        const scale0 = this.projection.scale();
        const lerpScale = d3.interpolate(scale0, scale);
        const rotation0 = this.projection.rotate();
        const lerpRotation = d3.interpolate(rotation0, [-position[0], -position[1]]);
        return t => {
          this.projection.scale(lerpScale(t));
          this.projection.rotate(lerpRotation(t));
          this.draw();

          if (t === 1) {
            onComplete && onComplete();
          }
        };
      });
  }

  /**
   * Move focus to a given country
   * @param {string[]} names The names of the countries
   * @param {number} zoom The scale percentage
   * @param {boolean} autoLabel Show labels on the countries
   * @param {boolean} autoCenter Move the position
   * @param {function} onComplete A function to run when the tween has finished
   */
  setHighlightedCountries(names, zoom, autoLabel, autoCenter, onComplete) {
    autoLabel = typeof autoLabel === 'undefined' ? true : autoLabel;
    autoCenter = typeof autoCenter == 'undefined' ? true : autoCenter;

    // Reset highlighted countries
    this.highlightedCountries = [];
    if (autoLabel) {
      this.setLabels([]);
    }

    if (name === false || name === null || names.length === 0) return;

    if (typeof zoom === 'undefined') zoom = 1;

    names.forEach((name, index) => {
      let country = findCountry(name);
      if (country) {
        this.highlightedCountries.push(country);

        if (autoLabel) {
          this.setLabels(this.labels.concat({ name: country.properties.name, hasDot: false }));
        }
      }
    });

    // Find the center between all of the countries
    if (autoCenter) {
      let center = this.highlightedCountries.reduce(
        (center, country, index) => {
          if (index === 0) return center;

          center[0] += country.properties.center[0];
          center[1] += country.properties.center[1];
          return center;
        },
        [this.highlightedCountries[0].properties.center[0], this.highlightedCountries[0].properties.center[1]]
      );
      center = [center[0] / this.highlightedCountries.length, center[1] / this.highlightedCountries.length];
      this.setScaleAndPosition(zoom, center, 1000, onComplete);
    } else {
      this.setScale(zoom, 1000, onComplete);
    }
  }

  /**
   * Update the labels
   * @param {array} labels The labels and their positions
   */
  setLabels(labels) {
    this.labels = labels.map(l => {
      if (typeof l === 'string') l = { label: l };

      if (!l.center) l.center = findCountry(l.label).properties.center;

      return l;
    });
  }

  /**
   *
   * @param {array} ranges The ranges to show
   * @param {number} duration The length of the animation in milliseconds
   * @param {function} onComplete A callback to run when the animation is done
   */
  setRanges(ranges, duration, onComplete) {
    if (typeof duration === 'undefined') duration = 1000;

    let currentRanges = this.ranges;

    console.log('RANGES', ranges);

    this.ranges = [].concat(ranges).map(r => {
      if (typeof r.center === 'string') r.center = findCountry(r.center).properties.center;

      // Check if there is already a range with that center
      let alreadyRange = currentRanges.filter(_r => {
        const c = _r.center()();
        return c[0] === r.center[0] && c[1] === r.center[1];
      })[0];

      let range = alreadyRange
        ? alreadyRange
        : d3
            .geoCircle()
            .center(r.center)
            .radius(0);

      d3.select({})
        .transition()
        .duration(duration)
        .tween('radius', () => {
          const radius0 = range.radius()();
          const lerp = d3.interpolate(radius0, toDegrees(r.radius));
          return t => {
            range.radius(lerp(t));
            this.draw();
            if (t === 1) {
              onComplete && onComplete();
            }
          };
        });

      return range;
    });
  }

  /**
   * Draw a frame to the canvas
   */
  draw(props) {
    if (this.isDrawing) return;
    this.isDrawing = true;

    props = props || this.props;

    const c = this.context.canvas ? this.context : this.canvas.node().getContext('2d');

    if (props.background) {
      c.fillStyle = props.background;
      c.fillRect(0, 0, this.width, this.height);
    } else {
      c.clearRect(0, 0, this.width, this.height);
    }

    // Draw the oceans
    c.beginPath();
    c.fillStyle = OCEAN_COLOUR;
    this.path(this.globe);
    c.fill();

    // Draw the land
    c.beginPath();
    c.strokeStyle = LAND_STROKE_COLOUR;
    c.fillStyle = LAND_COLOUR;
    c.lineWidth = 1.1;
    this.path(LAND);
    c.fill();
    c.stroke();

    // Draw country outlines
    c.beginPath();
    c.strokeStyle = LAND_STROKE_COLOUR;
    c.lineWidth = 1.1;
    this.path(BORDERS);
    c.stroke();

    // Highlight a country
    this.highlightedCountries.forEach(country => {
      c.beginPath();
      c.fillStyle = country.properties.colour;
      this.path(country);
      c.fill();
    });

    // Draw a thicker outline around the globe to hide any circle edges
    c.beginPath();
    c.strokeStyle = '#111';
    c.lineWidth = 4;
    this.path(this.globe);
    c.stroke();

    // Draw any shapes
    (props.config.shapes || []).forEach(shape => {
      shape.features.forEach(feature => {
        if (
          feature.geometry.type === 'Point' &&
          d3.geoDistance(feature.geometry.coordinates, this.inversePosition()) < 1.5707963267949
        ) {
          const [x, y] = this.projection(feature.geometry.coordinates);

          c.beginPath();
          c.fillStyle = shape.fill;
          c.strokeStyle = '#fff';
          c.lineWidth = 2;
          c.arc(x, y, 6, 0, Math.PI * 2);
          c.fill();
          c.stroke();
        } else {
          c.beginPath();
          c.fillStyle = null;
          c.strokeStyle = null;
          this.path(feature);
          if (shape.fill) {
            c.fillStyle = shape.fill;
            if (shape.opacity) {
              c.globalAlpha = shape.opacity;
            }
            c.fill();
            c.globalAlpha = 1;
          }
          if (shape.stroke) {
            c.strokeStyle = shape.stroke;
            c.lineWidth = 2;
            c.stroke();
          }
        }
      });
    });

    // Draw any ranges
    this.ranges.forEach(range => {
      c.beginPath();
      c.strokeStyle = '#FF6100';
      c.globalAlpha = 0.1;
      c.fillStyle = '#FF4D00';
      c.lineWidth = 1.1;
      this.path(range());
      c.fill();
      c.globalAlpha = 1;
      c.stroke();
    });

    // Draw a little plane somewhere
    if (this.plane) {
      const l = this.projection(this.plane.slice(0, 2)).concat(this.plane[2]);
      c.translate(l[0], l[1]);
      c.rotate(l[2]);
      c.drawImage(this.planeImage, -25, -25, 50, 50);
      c.rotate(-l[2]);
      c.translate(-l[0], -l[1]);
    }

    // Draw any labels
    this.labels.forEach((label, index) => {
      if (d3.geoDistance(label.center, this.inversePosition()) < 1.5707963267949) {
        const fontSize = window.innerWidth < 500 ? 16 : 18;

        // Set this before measuring
        c.font = `700 ${fontSize}px ABCSans`;

        const [x, y] = this.projection(label.center);

        const labelTextPadding = 18;
        const labelTextOffset = window.innerWidth < 500 ? 20 : 30;
        const labelTextWidth = c.measureText(label.label).width;

        c.font = `700 ${fontSize}px ABCSans`;
        c.textBaseline = 'bottom';

        // Draw dot
        if (label.hasDot) {
          c.beginPath();
          c.fillStyle = '#FF6100';
          c.strokeStyle = '#fff';
          c.lineWidth = 2;
          c.arc(x, y, 6, 0, Math.PI * 2);
          c.fill();
          c.stroke();
        }

        if (window.innerWidth < 500) {
          if (index % 2 === 0) {
            // Top label
            c.beginPath();
            c.moveTo(x - (labelTextWidth + labelTextPadding * 2) / 2, y - labelTextOffset - fontSize * 2);
            c.lineTo(x + (labelTextWidth + labelTextPadding * 2) / 2, y - labelTextOffset - fontSize * 2);
            c.lineTo(x + (labelTextWidth + labelTextPadding * 2) / 2, y - labelTextOffset);
            c.lineTo(x + 5, y - labelTextOffset);
            c.lineTo(x, y - labelTextOffset * 0.3);
            c.lineTo(x - 5, y - labelTextOffset);
            c.lineTo(x - (labelTextWidth + labelTextPadding * 2) / 2, y - labelTextOffset);
            c.lineTo(x - (labelTextWidth + labelTextPadding * 2) / 2, y - labelTextOffset - fontSize * 2);
            c.closePath();
            c.fillStyle = '#000';
            c.fill();

            // Draw text
            c.fillStyle = '#fff';
            c.textAlign = 'center';
            c.fillText(label.label, x, y - labelTextOffset - fontSize * 0.2);
          } else {
            // Bottom label
            c.beginPath();
            c.moveTo(x - (labelTextWidth + labelTextPadding * 2) / 2, y + labelTextOffset + fontSize * 2);
            c.lineTo(x + (labelTextWidth + labelTextPadding * 2) / 2, y + labelTextOffset + fontSize * 2);
            c.lineTo(x + (labelTextWidth + labelTextPadding * 2) / 2, y + labelTextOffset);
            c.lineTo(x + 5, y + labelTextOffset);
            c.lineTo(x, y + labelTextOffset * 0.7);
            c.lineTo(x - 5, y + labelTextOffset);
            c.lineTo(x - (labelTextWidth + labelTextPadding * 2) / 2, y + labelTextOffset);
            c.lineTo(x - (labelTextWidth + labelTextPadding * 2) / 2, y + labelTextOffset + fontSize * 2);
            c.closePath();
            c.fillStyle = '#000';
            c.fill();

            // Draw text
            c.fillStyle = '#fff';
            c.textAlign = 'center';
            c.fillText(label.label, x, y + labelTextOffset + fontSize * 1.6);
          }
        } else {
          if (index % 2 === 0) {
            // Draw tag background
            c.beginPath();
            c.moveTo(x + labelTextOffset, y - fontSize);
            c.lineTo(x + labelTextOffset + labelTextWidth + labelTextPadding * 2, y - fontSize);
            c.lineTo(x + labelTextOffset + labelTextWidth + labelTextPadding * 2, y + fontSize);
            c.lineTo(x + labelTextOffset, y + fontSize);
            c.lineTo(x + labelTextOffset / 3, y);
            c.closePath();
            c.fillStyle = '#000';
            c.fill();

            // Draw label
            c.fillStyle = '#fff';
            c.textAlign = 'left';
            c.fillText(label.label, x + labelTextOffset + labelTextPadding, y + fontSize * 0.6);
          } else {
            // Draw tag background
            c.beginPath();
            c.moveTo(x - labelTextOffset, y - fontSize);
            c.lineTo(x - labelTextOffset - labelTextWidth - labelTextPadding * 2, y - fontSize);
            c.lineTo(x - labelTextOffset - labelTextWidth - labelTextPadding * 2, y + fontSize);
            c.lineTo(x - labelTextOffset, y + fontSize);
            c.lineTo(x - labelTextOffset / 3, y);
            c.closePath();
            c.fillStyle = '#000';
            c.fill();

            // Draw label
            c.fillStyle = '#fff';
            c.textAlign = 'right';
            c.fillText(label.label, x - labelTextOffset - labelTextPadding, y + fontSize * 0.6);
          }
        }
      }
    });

    this.isDrawing = false;
  }

  render() {
    return <div ref={el => (this.base = el)} />;
  }
}

Globe.defaultProps = {
  config: {}
};

module.exports = Globe;
