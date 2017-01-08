const fakeFetchResult = result => ({
  json: () => result
});

// In real life this would be a 'whatwg fetch' call
// To make this example run without a server,
// we simulate a call
const fakeFetch = url => {
  console.log('Simulate Call to ' + url);
  const skies = [ 'clear', 'cloudy', 'rainy' ];
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(fakeFetchResult({
        city:    url.substring(13),
        degrees: Math.floor(Math.random() * 16) + 1,
        sky:     skies[ Math.floor(Math.random() * skies.length) ]
      }));
    }, 250);
  });
};

const WeatherService = {
  // This methods needs to be mocked in our testcases
  readWeatherReport(city) {
    return fakeFetch(`/api/weather/${city}`)
      .then(result => result.json());
  }
};

export default WeatherService;
