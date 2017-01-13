import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';
const expect = unexpected.clone().use(unexpectedReact);

const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import Weather from '../../src/Weather';
import WeatherWidget from '../../src/WeatherWidget';
import WeatherService from '../../src/WeatherService';

const mockWeather = {
  city:    'Hamburg',
  degrees: -7,
  sky:     'clear'
};

let logs = [];

describe('Weather with sinon-stub-promise', function() {
  let readWeatherReportStub;
  beforeEach(function() {
    logs = [ '--- beforeEach ---------------------------------------' ];
    readWeatherReportStub = sinon.stub(WeatherService, 'readWeatherReport').returnsPromise();
  });
  afterEach(function() {
    // dump out our logs
    logs.push('--- afterEach ----------------------------------------');
    logs.forEach((l, ix) => console.log(`| [${ix}] ${l}`));

    readWeatherReportStub.restore();
  });
  it('should render synchronously with sinon promise stub', function() {
    readWeatherReportStub.resolves(mockWeather);

    logs.push('Before mount');
    const weather = ReactTestUtils.renderIntoDocument(<Weather city="Hamburg"/>);
    logs.push('After mount');

    // not necessary at all, as below we make sure that WeatherWidget is rendered
    // with the correct data that has been received from the stub
    // (if stub would not work correctly, WeatherWidget would not receive correct
    // values)
    expect(readWeatherReportStub.calledOnce, 'to be truthy');
    expect(readWeatherReportStub.alwaysCalledWith('Hamburg'), 'to be truthy');
    expect(weather.state.weather.city, 'to equal', 'Hamburg');

    expect(weather, 'to contain', <WeatherWidget weather={mockWeather}/>);
  });
});
