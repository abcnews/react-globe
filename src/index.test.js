const React = require('react');
const { mount } = require('enzyme');
const Globe = require('.');

describe('Globe', () => {
  it('renders with no arguments', () => {
    const base = mount(<Globe />);
    expect(base.html()).toContain('<div>');
  });

  it('renders with shapes', () => {
    const base = mount(<Globe shapes={[]} />);
    expect(base.html()).toContain('<div>');
  });
});
