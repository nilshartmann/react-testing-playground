import 'jsdom-global/register'

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Weather from '../../src/Weather';
import WeatherService from '../../src/WeatherService';
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

const mockWeather = {
  city: 'Hamburg',
  degrees: -7,
  sky: 'clear'
};

describe('[mocha-chai-enzyme] Weather', function() {
  let readWeatherReportStub;
  beforeEach(function() {
    readWeatherReportStub = sinon.stub(WeatherService, 'readWeatherReport').returnsPromise();
  });
  afterEach(function() {
    readWeatherReportStub.restore();
  });
  it('should render synchronously with sinon promise stub', function() {
    readWeatherReportStub.resolves(mockWeather);

    const weather = mount(<Weather city="Hamburg"/>);
    const weatherWidget = weather.find('WeatherWidget');
    expect(weatherWidget.prop('weather')).to.equal(mockWeather);

    // not necessary at all, as above we already made sure that WeatherWidget is rendered
    // with the correct data that has been received from the stub
    // (if stub would not work correctly, WeatherWidget would not receive correct
    // values)
    expect(readWeatherReportStub.calledOnce).to.be.true;
    expect(readWeatherReportStub.alwaysCalledWith('Hamburg')).to.be.true;
    expect(weather.state().weather).to.have.property('city');
  });
});
