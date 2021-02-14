const request=require('request-promise');
const cheerio=require('cheerio');
const fs=require('fs');
const json2csv=require('json2csv').Parser;
const axios =require('axios');
const express = require("express");

const app=express();
// app.listen(9000);

app.listen(9000, function(req,res){
    console.log('Running.....');
});


app.get('/',function(req,res){
    res.send('Hello World');
});

app.get('/home',function(req,res){
    // const id = req.query.id;
    res.send('Home Works');
});


app.get('/home/:id',function(req,res){
    const id=req.params.id;
    res.send('Home 20 Works' + id);
});

const movies = ["https://www.imdb.com/title/tt0111161/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=MV3G1CFT64EA8PD7THYZ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_1",
"https://www.imdb.com/title/tt9112152/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=&pf_rd_r=M9RMEGVJV91HKP2MJMCF&pf_rd_s=center-3&pf_rd_t=60601&pf_rd_i=&ref_=il_tl_li_i",
"https://www.imdb.com/title/tt13267190/"];

let imdbdata=[];

for(let movie of movies){
    axios.get(movie)
        .then((res) => {
            // console.log(res.data);
            // const posts=[];
            const $=cheerio.load(res.data);
            
                let title=$('div[class="title_wrapper"] > h1').text().trim();
                let rating=$('div[class="ratingValue"] > strong > span').text().trim();
                let summary=$('div[class="summary_text"]').text().trim();
                let realeaseDate=$('a[title="See more release dates"]').text().trim();

                // console.log(title+rating+summary+realeaseDate);

                imdbdata.push({
                title,rating,summary,realeaseDate
                });

                // console.log(imdbdata);

                const j2csv=new json2csv();
                const csv=j2csv.parse(imdbdata);
                fs.writeFileSync("./imdb(axios).csv",csv,"utf-8");
            
            // console.log($('.post-list').children().first().text());
            // $('.card--content').each((index,element)=>{
                // console.log($(element).children().first().text());
            // const link=$(element).children('h3').last().text();
            // const para=$(element).children('p').last().text();
            // console.log(link + para);    
            // posts[index]={link, para};    
            // })
            // console.log(posts);
        });

}