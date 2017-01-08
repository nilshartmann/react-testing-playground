import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import WeatherApp from '../../src/WeatherApp';
import WeatherService from '../../src/WeatherService';

import sinon from 'sinon';

const mockWeather = {
  city:    'Hamburg',
  degrees: -7,
  sky:     'clear'
};

describe("WeatherApp", function() {
  let stub;

  it("render empty form on startup", function() {
    const weatherApp = shallow(<WeatherApp />);
    expect(weatherApp.find('input').prop('value')).to.equal('');
    expect(weatherApp.find('button').prop('disabled')).to.be.true;
    expect(weatherApp.find('Weather').prop('city')).to.not.be.ok;
  });

  // DEMO: simulate events
  it("updates button enablement", function() {
    const weatherApp = shallow(<WeatherApp />);
    weatherApp.find('input').simulate('change', { target: { value: 'Hamburg' } });
    expect(weatherApp.find('input').prop('value')).to.equal('Hamburg');
    expect(weatherApp.find('button').prop('disabled')).to.be.false;
  });

  it("loads the weather (shallow rendering)", function() {
    stub = sinon.spy(WeatherService, 'readWeatherReport');
    const weatherApp = shallow(<WeatherApp />);
    weatherApp.find('input').simulate('change', { target: { value: 'Hamburg' } });
    weatherApp.find('button').simulate('click');

    // Weather-Component's properties should have been updated
    expect(weatherApp.find('Weather').prop('city')).to.equal('Hamburg');
    // 'Weather' is not rendered (as we shallow rendered WeatherApp),
    // so WeatherService should not have been called
    expect(stub.calledOnce).to.be.false;
  });

  it("loads the weather (dom rendering)", function() {
    stub = sinon.stub(WeatherService, 'readWeatherReport').returnsPromise();
    stub.resolves(mockWeather);
    const weatherApp = mount(<WeatherApp />);
    weatherApp.find('input').simulate('change', { target: { value: 'Hamburg' } });
    weatherApp.find('button').simulate('click');

    // WeatherApp component renders completely, so Weather component
    // should be updated/re-rendered with new properties
    const weather = weatherApp.find('Weather');
    expect(weather.prop('city')).to.equal('Hamburg');
    expect(weather.findWhere(n => n.type() === 'p')).to.have.length(2);
    expect(stub.calledOnce).to.be.true;
  });

  afterEach(function() {
    if (stub) {
      stub.restore();
    }
  })

});
