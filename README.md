# React Globe

A 3D D3 Globe for React.

## Usage

```js
const React = require('react');
const Globe = require('@abcnews/react-globe');

const BRISBANE = [153.021072, -27.470125];

class App extends React.Component {
  render() {
    return <Globe center={BRISBANE} />;
  }
}

module.exports = App;
```

## Authors

- [Nathan Hoad](mailto:hoad.nathan@abc.net.au)
- [Joshua Byrd](mailto:byrd.joshua@abc.net.au)
