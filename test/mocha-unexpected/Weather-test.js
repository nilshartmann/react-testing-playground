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
//
//describe.skip("Weather", function() {
//  let originalReadWeatherReport = null;
//
//  beforeEach(function() {
//    logs = ['--- beforeEach ---------------------------------------'];
//
//    // save original WeatherService
//    originalReadWeatherReport = WeatherService.readWeatherReport;
//  });
//
//  afterEach(function() {
//    // dump out our logs
//    logs.push('--- afterEach ----------------------------------------');
//    logs.forEach((l, ix) => console.log(`| [${ix}] ${l}`));
//
//    // reset
//    WeatherService.readWeatherReport = originalReadWeatherReport;
//  });
//
//  it("should render correctly with a promise that resolves immediately", function(done) {
//    let mockCalled = false;
//    let thenCalled = false;
//
//    WeatherService.readWeatherReport = function() {
//      mockCalled = true;
//      logs.push('mock called - return resolved promise');
//      return Promise.resolve(mockWeather)
//        .then(r => { thenCalled = true; logs.push('Inside mock then'); return r; })
//    };
//
//    logs.push('Before mount');
//    const weather = mount(<Weather city="Hamburg"/>);
//    logs.push('After mount');
//    const weatherWidget = weather.find('WeatherWidget');
//    logs.push('After find');
//
//    expect(weatherWidget).to.have.length(1);
//    // Widget gets rendered but only with no data, as the WeatherService did not respond now
//    expect(weatherWidget.contains(<div>No weather data loaded yet</div>)).to.equal(true);
//    logs.push('After expect');
//    // State has not been updated, so 'weather' is not defined
//    expect(weather.state().weather).to.not.be.ok;
//    expect(weatherWidget.find('h1')).to.have.length(0);
//    // mock should have been called (but not the 'then' callback)
//    expect(mockCalled).to.equal(true);
//    expect(thenCalled).to.equal(false);
//
//    setTimeout(() => {
//      logs.push("Inside setTimeout, mockCalled: " + mockCalled);
//      // After some time the mock should have been called and state should have
//      // been updated
//      expect(mockCalled).to.equal(true);
//      expect(thenCalled).to.equal(true);
//      expect(weather.state().weather).to.have.property('city');
//      expect(weather.find('h1')).to.have.length(1);
//      done();
//    }, 1);
//
//    logs.push("After setTimeout, mockCalled: " + mockCalled + ", thenCalled: " + thenCalled);
//  });
//
//  it('should render with mock promise', function() {
//    let mockCalled = false;
//    let thenCalled = false;
//
//    WeatherService.readWeatherReport = function() {
//      mockCalled = true;
//      logs.push('mock called - return "promise mock"');
//      // return an object that look like a promise (for now 'then' is enough)
//      return {
//        then(fn) {
//          logs.push('inside promise mock - then called');
//          thenCalled = true;
//          fn(mockWeather);
//        }
//      };
//    };
//
//    logs.push('Before mount');
//    const weather = mount(<Weather city="Hamburg"/>);
//    logs.push('After mount');
//    const weatherWidget = weather.find('WeatherWidget');
//    logs.push('After find');
//
//    // as our mock promise is sync everything should have been rendered here
//    expect(weather.state().weather).to.have.property('city');
//    expect(weatherWidget.find('h1')).to.have.length(1);
//  });
//});

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
    // will throw an Error, if 'WeatherWidget' was not rendered at all (an thus cannot be found)
    expect(weather, 'queried for', <WeatherWidget x='xxx' weather={mockWeather}/>)
      .then(wd => console.log(wd));
//      .then(i => { console.log(i); return i; });
    expect(readWeatherReportStub.calledOnce, 'to be truthy');
    expect(readWeatherReportStub.alwaysCalledWith('Hamburg'), 'to be truthy');
    expect(weather.state.weather.city, 'to equal', 'Hamburg');
//    expect(weatherWidget, 'to have rendered', <p>City: Hamburg</p>);
//    const weatherWidget = weather.find('WeatherWidget');
//    logs.push('After find');
//
//    expect(readWeatherReportStub.calledOnce).to.be.true;
//    expect(readWeatherReportStub.alwaysCalledWith('Hamburg')).to.be.true;
//    expect(weatherWidget).to.have.length(1);
//    expect(weather.state().weather).to.have.property('city');
//    expect(weather.find('h1')).to.have.length(1);

  });
});
