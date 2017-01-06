import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Weather from '../src/Weather';
import WeatherService from '../src/WeatherService';

const mockWeather = {
  city: 'Hamburg',
  degrees: -7,
  sky: 'clear'
};

let originalReadWeatherReport = null;
const MockData = {
  mockCalled: false
};

let logs = [];

describe("Weather", function() {

  before(function() {
    logs = [];
    MockData.mockCalled = false;
    originalReadWeatherReport = WeatherService.readWeatherReport;
    logs.push('before called, mockCalled: ' + MockData.mockCalled);
    WeatherService.readWeatherReport = function() {
      MockData.mockCalled = true;
      logs.push('mock called');
      return Promise.resolve(mockWeather)
    };
  });

  after(function() {
    logs.push('after called, mockCalled: ' + MockData.mockCalled);
    logs.forEach(l => console.log(l));
    WeatherService.readWeatherReport = originalReadWeatherReport;
    MockData.mockCalled = false;
  });
  it("should render correctly with a promise that resolves immediately", function(done) {
    logs.push('Before mount');
    const weather = mount(<Weather city="Hamburg"/>);
    logs.push('After mount');
    const weatherWidget = weather.find('WeatherWidget');
    logs.push('After find');

    expect(weatherWidget).to.have.length(1);
    // Widget gets rendered but only with no data, as the WeatherService did not respond now
    expect(weatherWidget.contains(<div>No weather data loaded yet</div>)).to.equal(true);
    logs.push('After expect');
    // State has not been updated, so 'weather' is not defined
    expect(weather.state().weather).to.not.be.ok;

    setTimeout(() => {
      logs.push("Inside setTimeout, mockCalled: " + MockData.mockCalled);
      // After some time the mock should have been called and state should have
      // been updated
      expect(MockData.mockCalled).to.equal(true);
      expect(weather.state().weather).to.have.property('city');
      done();
    }, 750);

    logs.push("After setTimeout, mockCalled: " + MockData.mockCalled);
  });
});
