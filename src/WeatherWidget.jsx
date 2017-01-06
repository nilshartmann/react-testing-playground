import React from 'react';

const WeatherWidget = ({ weather }) => {
  if (!weather) {
    return <div>No weather data loaded yet</div>;
  }

  return (<div>
      <h1>Weather</h1>
      <p>City: {weather.city}</p>
      <p>{weather.degrees}°C - Sky is {weather.sky}</p>
    </div>
  );
};

export default WeatherWidget;

