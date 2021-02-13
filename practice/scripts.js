const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv');

// Write Headers
writeStream.write(`Title,Link,Date \n`);

request('http://codedemos.com/sampleblog', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    $('ba_').each((i, el) => {
      const title = $(el)
        .find('span')
        .text();
        // .replace(/\s\s+/g, '');
    //   const link = $(el)
    //     .find('a')
    //     .attr('href');
    //   const date = $(el)
    //     .find('.post-date')
    //     .text()
    //     .replace(/,/, '');

      // Write Row To CSV
      console.log(title);
      writeStream.write(`${title}, ${link}, ${date} \n`);
    });

    console.log('Scraping Done...');
  }
});

