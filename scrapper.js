const puppeteer = require("puppeteer");
const fs=require("fs");
const json2csv=require("json2csv");
(async () => {

  // Extract partners on the page, recursively check the next page in the URL pattern
  const extractPartners = async url => {
    
    // Scrape the data we want
    const page = await browser.newPage();
    //await page.setDefaultNavigationTimeout(5000);
    await page.goto(url,{timeout: 5000});
    console.log("scrapping at :" + url);
    const partnersOnPage = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div._13oc-S")).map(compact => ({
        title: compact.querySelector("div._4rR01T").innerText.trim(),
        link: compact.querySelector("._1fQZEK").getAttribute('href')
      }))
    );
    await page.close();

    // Recursively scrape the next page
    if (partnersOnPage.length < 1) {
      // Terminate if no partners exist
      return partnersOnPage
    } else {
      // Go fetch the next page ?page=X+1
      const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
      const nextUrl = `https://www.flipkart.com/mobiles/mi~brand/pr?sid=tyy%2C4io&otracker=nmenu_sub_Electronics_0_Mi&page=${nextPageNumber}`;

      return partnersOnPage.concat(await extractPartners(nextUrl))
    }
  };

  const browser = await puppeteer.launch();
  const firstUrl =
    "https://www.flipkart.com/mobiles/mi~brand/pr?sid=tyy%2C4io&otracker=nmenu_sub_Electronics_0_Mi&page=12";
  const partners = await extractPartners(firstUrl);

  // Todo: Update database with partners
  console.log(partners);

  

  await browser.close();

//   const j2csv= await new json2csv();
//   const csv= await j2csv.parse(JSON.stringify(partners));
//   await fs.writeFile("./mobilesData(pagination).csv",csv,"utf-8");


  await fs.writeFile("mobilesData(pagination).json",JSON.stringify(partners),function(err){
    if(err){

    }else{
        console.log("data exported");
    }
});
})();