const assign = require('object-assign');

module.exports = assign(
  {},
  require('d3-selection'),
  require('d3-geo'),
  require('d3-queue'),
  require('d3-array'),
  require('d3-color'),
  require('d3-scale'),
  require('d3-drag'),
  require('d3-transition'),
  require('d3-interpolate'),
  require('d3-request')
);
