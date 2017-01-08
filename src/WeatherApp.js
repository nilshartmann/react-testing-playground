import React from 'react';

import Weather from './Weather';

export default class WeatherApp extends React.Component {
  constructor() {
    super();

    this.state = {
      cityInput: ''
    };
  }

  loadWeather() {
    const { cityInput } = this.state;

    this.setState({
      city:      cityInput,
      cityInput: ''
    });
  }

  render() {
    const { cityInput, city } = this.state;
    return (
      <div>
        <h1>Weather App</h1>
        <h2>Please enter a location</h2>
        <input type="text" name="city" value={cityInput} onChange={e => this.setState({ cityInput: e.target.value })}/>
        <button onClick={() => this.loadWeather()} disabled={!cityInput}>Load</button>
        <Weather city={city}/>
      </div>
    );
  }
}
