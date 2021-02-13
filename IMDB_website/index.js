const request=require('request-promise');
const cheerio=require('cheerio');
const fs=require('fs');
const json2csv=require('json2csv').Parser;

const movies = ["https://www.imdb.com/title/tt0111161/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=MV3G1CFT64EA8PD7THYZ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_1",
"https://www.imdb.com/title/tt9112152/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=&pf_rd_r=M9RMEGVJV91HKP2MJMCF&pf_rd_s=center-3&pf_rd_t=60601&pf_rd_i=&ref_=il_tl_li_i",
"https://www.imdb.com/title/tt13267190/"];

(async () => {
    let imdbdata=[];
    for(let movie of movies){
        
    const response=await request({
        uri:movie,
        headers:{
            accept: 
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9"
        }
    });

    let $=cheerio.load(response);

    // title=$('div[class="title_wrapper"] > h1').text();
    let title=$('div[class="title_wrapper"] > h1').text().trim();
    let rating=$('div[class="ratingValue"] > strong > span').text().trim();
    let summary=$('div[class="summary_text"]').text().trim();
    let realeaseDate=$('a[title="See more release dates"]').text().trim();

    imdbdata.push({
        title,rating,summary,realeaseDate
    });

    }
    const j2csv=new json2csv();
    const csv=j2csv.parse(imdbdata);
    fs.writeFileSync("./imdb(request-promise).csv",csv,"utf-8");

})();
