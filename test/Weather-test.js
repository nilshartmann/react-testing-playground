import 'jsdom-global/register'

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Weather from '../src/Weather';
import WeatherService from '../src/WeatherService';

const mockWeather = {
  city: 'Hamburg',
  degrees: -7,
  sky: 'clear'
};

let logs = [];

describe("Weather", function() {
  let originalReadWeatherReport = null;

  beforeEach(function() {
    logs = ['--- beforeEach ---------------------------------------'];

    // save original WeatherService
    originalReadWeatherReport = WeatherService.readWeatherReport;
  });

  afterEach(function() {
    // dump out our logs
    logs.push('--- afterEach ----------------------------------------');
    logs.forEach((l, ix) => console.log(`| [${ix}] ${l}`));

    // reset
    WeatherService.readWeatherReport = originalReadWeatherReport;
  });

  it("should render correctly with a promise that resolves immediately", function(done) {
    let mockCalled = false;
    let thenCalled = false;

    WeatherService.readWeatherReport = function() {
      mockCalled = true;
      logs.push('mock called - return resolved promise');
      return Promise.resolve(mockWeather)
        .then(r => { thenCalled = true; logs.push('Inside mock then'); return r; })
    };

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
    expect(weatherWidget.find('h1')).to.have.length(0);
    // mock should have been called (but not the 'then' callback)
    expect(mockCalled).to.equal(true);
    expect(thenCalled).to.equal(false);

    setTimeout(() => {
      logs.push("Inside setTimeout, mockCalled: " + mockCalled);
      // After some time the mock should have been called and state should have
      // been updated
      expect(mockCalled).to.equal(true);
      expect(thenCalled).to.equal(true);
      expect(weather.state().weather).to.have.property('city');
      expect(weather.find('h1')).to.have.length(1);
      done();
    }, 1);

    logs.push("After setTimeout, mockCalled: " + mockCalled + ", thenCalled: " + thenCalled);
  });

  it('should render with mock promise', function() {
    let mockCalled = false;
    let thenCalled = false;

    WeatherService.readWeatherReport = function() {
      mockCalled = true;
      logs.push('mock called - return "promise mock"');
      // return an object that look like a promise (for now 'then' is enough)
      return {
        then(fn) {
          logs.push('inside promise mock - then called');
          thenCalled = true;
          fn(mockWeather);
        }
      };
    };

    logs.push('Before mount');
    const weather = mount(<Weather city="Hamburg"/>);
    logs.push('After mount');
    const weatherWidget = weather.find('WeatherWidget');
    logs.push('After find');

    // as our mock promise is sync everything should have been rendered here
    expect(weather.state().weather).to.have.property('city');
    expect(weatherWidget.find('h1')).to.have.length(1);
  });
});
