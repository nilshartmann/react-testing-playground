import React from 'react';

import WeatherService from './WeatherService';
import WeatherWidget from './WeatherWidget';

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadWeatherReport(this.props.city);
  }

  componentWillReceiveProps(newProps) {
    const { city: thisCity } = this.props;
    const { city: newCity } = newProps;

    if ((thisCity && thisCity !== newCity)
      || (!thisCity && newCity)) {
      this.loadWeatherReport(newCity);
    }
  }

  loadWeatherReport(city) {
    if (city) {
      WeatherService.readWeatherReport(city)
        .then(weather => this.setState({ weather }));
    }
  }

  render() {
    const { weather } = this.state;
    return (<div>
      <WeatherWidget weather={weather}/>
    </div>);
  }
}
