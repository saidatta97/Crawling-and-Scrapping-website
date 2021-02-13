const axios =require('axios');
const cheerio = require('cheerio');

axios.get("https://www.jamesqquick.com/talks")
        .then((res) => {
            // console.log(res.data);
            const posts=[];
            const $=cheerio.load(res.data);
            // console.log($('.post-list').children().first().text());
            $('.card--content').each((index,element)=>{
                // console.log($(element).children().first().text());
            const link=$(element).children('h3').last().text();
            const para=$(element).children('p').last().text();
            // console.log(link + para);    
            posts[index]={link, para};    
            })

            console.log(posts);
        });


// const request = require('request');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const writeStream = fs.createWriteStream('post.csv');

// // Write Headers
// writeStream.write(`Title,Link,Date \n`);

// request('http://codedemos.com/sampleblog', (error, response, html) => {
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);
//     // console.log(html);

//     // const heading=$('.domain-part');
//     // const heading1=heading.children().parent().text();
//     // console.log(heading1);
//     console.log("hi");
//     $('.ca_ a').each((i, el) => {

//         const item = $(el).text();
//         const links = $(el).attr('href');
//         console.log("hi");
//     });

//     // $('.post-preview').each((i, el) => {
//     //   const title = $(el)
//     //     .find('.post-title')
//     //     .text()
//     //     .replace(/\s\s+/g, '');
//     //   const link = $(el)
//     //     .find('a')
//     //     .attr('href');
//     //   const date = $(el)
//     //     .find('.post-date')
//     //     .text()
//     //     .replace(/,/, '');

//     //   // Write Row To CSV
//     //   writeStream.write(`${title}, ${link}, ${date} \n`);
//     // });

//     console.log('Scraping Done...');
//   }
// });