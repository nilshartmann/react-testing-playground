import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

// This "test" contains some examples of Enzyme's selector

class WeatherReport extends React.Component {
  render() {
    const { weather } = this.props;
    return <div>
      <span>
        In <span className='location'>{weather.city} ({weather.country})</span> there are {weather.temperature}°C
      </span>
    </div>
  }
}

class WeatherReports extends React.Component {
  render() {
    const { locations } = this.props;
    return <div>
      <h1>Weather Reports</h1>
      {locations.map(item => <WeatherReport key={item.id} weather={item}/>)}
    </div>
  }
}
const weatherData = [
  { id: 'ham_ger', city: 'Hamburg', country: 'Germany', temperature: -3 },
  { id: 'bcn_es', city: 'Barcelona', country: 'Spain', temperature: 12 },
  { id: 'osl_no', city: 'Oslo', country: 'Norway', temperature: 2 },
];

function log(component) {
  console.log('Component - name: ' + component.name() + ", type: " + component.type() + ", props: "
    , component.props());
}

function hasWeatherDataForCity(node, expectedCity) {
  const prop = node.prop('weather');
  return prop ? prop.city === expectedCity : false;
}

describe('Enzyme selectors', function() {
  it('SHALLOW should find components on first level only', function() {
    const component = shallow(<WeatherReports locations={weatherData}/>);

    // find an existing HTML Element by Type
    const titles = component.findWhere(n => n.type() === 'h1');
    expect(titles).to.have.length(1);

    // find an existing React Component by Type
    const weatherReportComponents = component.findWhere(n => n.type() === WeatherReport);
    expect(weatherReportComponents).to.have.length(3);

    // find a component by React key
    const weatherReportByKey = component.findWhere(n => n.key() === 'bcn_es');
    expect(weatherReportByKey).to.have.length(1);

    // find a component by one of it's properties
    const weatherReportByProp = component.findWhere(n => hasWeatherDataForCity(n, 'Hamburg'));
    expect(weatherReportByProp).to.have.length(1);
    const weatherReportByPropNotFound = component.findWhere(n => hasWeatherDataForCity(n, 'Berlin'));
    expect(weatherReportByPropNotFound).to.have.length(0);

    // should not find any span, as we render only one level deep, and
    // WeatherReports does not have any spans
    const spans = component.findWhere(n => n.type() === 'span');
    expect(spans).to.have.length(0);

  });

  it('MOUNT should find components on all levels', function() {
    const component = mount(<WeatherReports locations={weatherData}/>);
//    console.log(component.debug());

    // find an existing HTML Element by Type
    const titles = component.findWhere(n => n.type() === 'h1');
    expect(titles).to.have.length(1);

    // find an existing React Component by Type
    const weatherReportComponents = component.findWhere(n => n.type() === WeatherReport);
    expect(weatherReportComponents).to.have.length(3);

    // find an existing element by it's key attribute
    const weatherReportByKey = component.findWhere(n => n.key() === 'bcn_es');
    expect(weatherReportByKey).to.have.length(1);

    // find a component by one of it's properties
    const weatherReportByProp = component.findWhere(n => hasWeatherDataForCity(n, 'Hamburg'));
    expect(weatherReportByProp).to.have.length(1);
    const weatherReportByPropNotFound = component.findWhere(n => hasWeatherDataForCity(n, 'Berlin'));
    expect(weatherReportByPropNotFound).to.have.length(0);

    // should find span rendered in sub-component
    const spans = component.findWhere(n => n.type() === 'span');
    expect(spans).to.have.length(6);

    // try find a span using substring of it's text (children)
    const locationSpansBySubstring = component.findWhere(
      n => n.type() === 'span' && n.text().indexOf('Spain') !== -1);
    // as text() returns a textual representation of the node, the text
    // we're looking for ('Spain') is also contained in the parent node (span)
    //  we got two nodes here
    expect(locationSpansBySubstring).to.have.length(2);

    // try find a span using substring of it's text (children)
    const locationSpansByString = component.findWhere(
      n => n.type() === 'span' && n.text() === 'Barcelona (Spain)');
    // as text() returns a textual representation of the node, the text
    // we're looking for ('Spain') is also contained in the parent node (span)
    //  we got two nodes here
    expect(locationSpansByString).to.have.length(1);

  });
});

