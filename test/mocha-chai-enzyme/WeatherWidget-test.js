import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import WeatherWidget from '../../src/WeatherWidget';

const mockWeather = {
  city:    'Hamburg',
  degrees: -7,
  sky:     'clear'
};

describe("[mocha-chai-enzyme] WeatherWidget", function() {
  it("render correctly without weather property", function() {
    expect(shallow(<WeatherWidget />).contains(<div>No weather data loaded yet</div>)).to.equal(true);
  });

  it("render correctly with weather property", function() {
    const weatherWidget = shallow(<WeatherWidget weather={mockWeather}/>);
    expect(weatherWidget.contains(<h1>Weather</h1>)).to.be.true;
    const title = weatherWidget.findWhere(n => n.type() === 'p' && n.text().indexOf('City') !== -1);
    expect(title).to.have.length(1);
    expect(title.text()).to.equal('City: Hamburg');
  });
});
