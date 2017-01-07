const fakeFetchResult = result => ({
  json: () => result
});

// In real life this would be a 'whatwg fetch' call
// To make this example run without a server,
// we simulate a call
const fakeFetch = url => {
  console.log('Simulate Call to ' + url);
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(fakeFetchResult({
        city: url.substring(13),
        degrees: -20,
        sky: 'clear'
      }));
    }, 1000);
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
