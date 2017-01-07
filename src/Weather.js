import React from 'react';

import WeatherService from './WeatherService';
import WeatherWidget from './WeatherWidget';

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { city } = this.props;
    WeatherService.readWeatherReport(city)
      .then(weather => this.setState({weather}));
  }

  render() {
    const { weather } = this.state;
    return <WeatherWidget weather={weather} />
  }
}
