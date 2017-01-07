import { expect } from 'chai';

let logs = [];

describe("Weather", function() {

  before(function() {
    logs = ['--- before ---------------------------------------'];
  });

  after(function() {
    logs.push('--- after ----------------------------------------');
    logs.forEach((l, ix) => console.log(`| [${ix}] ${l}`));
  });
  it("should render correctly with a promise that resolves immediately", function(done) {
    const p = Promise.resolve('hello');
    logs.push('After Promise resolve');
    p.then(x => logs.push('In then'));
    logs.push('After p.then');
    done();
  });
});
