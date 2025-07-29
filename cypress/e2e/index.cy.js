import { websites, enabledTests } from '../support/testControl';

console.log('🧪 websites loaded:', websites);

if (!websites || websites.length === 0) {
  throw new Error('❌ No active website found in testConfig.js. Please uncomment one.');
}

const { baseUrl, site, pass } = websites[0];

describe(`🔍 Testing ${site}`, () => {
  beforeEach(() => {
    cy.visit(baseUrl);
    cy.wait(1000);
    cy.handlePopups();
  });

  
  if (enabledTests.includes('adminTests')) {
    require('./tests/adminTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('globalTests')) {
    require('./tests/globalTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('homepageTests')) {
    require('./tests/homepageTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('agentsTests')) {
    require('./tests/agentsTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('socialsTests')) {
    require('./tests/socialsTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('testimonialsTests')) {
    require('./tests/testimonialsTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('propertiesTests')) {
    require('./tests/propertiesTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('communitiesTests')) {
    require('./tests/communitiesTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('roadmapTests')) {
    require('./tests/roadmapTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('contactTests')) {
    require('./tests/contactTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('externalpageTests')) {
    require('./tests/externalpageTests.cy.js')(site, baseUrl, pass);
  }

  if (enabledTests.includes('sitemappageTests')) {
    require('./tests/sitemappageTests.cy.js')(site, baseUrl, pass);
  }
});