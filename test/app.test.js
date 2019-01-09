const puppeteer = require('puppeteer');
// const faker = require('faker');
// const devices = require('puppeteer/DeviceDescriptors');

// const iPhone = devices['iPhone 6'];

const isDebugging = () => {
  const debuggingMode = {
    headless: false,
    slowMo: 25,
    devtools: true
  };
  return process.env.NODE_ENV === 'debug' ? debuggingMode : {};
};

let browser;
let page;
let logs = [];
let errors = [];

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();

  // set `setRequestInterception` to false to
  await page.setRequestInterception(true);
  page.on('request', request => {
    console.log(request.url());
    if (request.url().includes('swapi')) {
      request.respond({
        status: 200,
        content: 'application/json',
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          results: [{ name: 'Alderaan' }, { name: 'Dantooine' }]
        })
      });
    } else {
      request.continue();
    }
  });
  page.on('console', c => logs.push(c.text));
  page.on('pageerror', e => errors.push(e.text));

  await page.goto('http://localhost:9191/');
});

const TIMEOUT = 16000;

describe('Base Application', () => {
  test(
    'headline loads on page load',
    async () => {
      const html = await page.$eval('h1', e => e.innerHTML);

      expect(html).toBe('Star Wars Planets');
    },
    TIMEOUT
  );

  test(
    'http request loads planets',
    async () => {
      const planets = await page.$$eval('li', results =>
        results.map(e => e.innerHTML)
      );

      expect(planets).toEqual(['Alderaan', 'Dantooine']);
    },
    TIMEOUT
  );
});

afterAll(() => {
  const { headless } = isDebugging();
  if (headless !== false) {
    browser.close();
  }
});
