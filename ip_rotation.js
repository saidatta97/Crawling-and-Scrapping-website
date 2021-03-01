const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [ '--proxy-server=217.11.72.210:3128']
    // slowMo:50
  });
  const page = await browser.newPage();
  
  const pageUrl = 'https://whatismyipaddress.com/';
//   https://www.imdb.com/title/tt13267190/

  await page.goto(pageUrl);
//   console.log("hii")
}

run();









// const puppeteer = require('puppeteer');

// async function run() {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
  
//   const proxy = 'https://proxybot.io/api/v1/API_KEY?url=';
//   const url = 'https://whatismyipaddress.com/';
//   const pageUrl = proxy + url;

//   await page.goto(pageUrl);
// }

// run();