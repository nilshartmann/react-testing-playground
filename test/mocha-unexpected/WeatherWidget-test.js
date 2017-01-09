import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

const expect = unexpected.clone().use(unexpectedReact);

import WeatherWidget from '../../src/WeatherWidget';

const mockWeather = {
  city:    'Hamburg',
  degrees: -7,
  sky:     'clear'
};

describe("[unexpected-react] WeatherWidget", function() {
  it("render correctly without weather property", function() {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<WeatherWidget />);
    expect(renderer, 'to have rendered', <div>No weather data loaded yet</div>);
  });

  it("render correctly with weather property", function() {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<WeatherWidget weather={mockWeather}/>);
    expect(renderer, 'to contain', <h1>Weather</h1>);
    expect(renderer, 'to contain', <p>City: Hamburg</p>);
  });
});
