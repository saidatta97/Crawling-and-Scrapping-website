const rp = require('request-promise');
var fs = require('fs');
var cheerio = require('cheerio');
var property=[];

// const url = 'https://www.immostreet.ch/en/rent/detail/apartment/subcategory-flat/at-R%C3%BCschlikon/3.0+rooms/3000968062/';

// rp(url)
//   .then(function(html){
//     //success!
//     // console.log(html);
//     fs.writeFile('immmostreetRentAd1.html', html, function (err) {
//       if (err) throw err;
//       // console.log('Html Is stored in file!');
//     })
//   })

// cheerio.load(fs.readFileSync('immmostreetRentAd.html'));
 
fs.readFile('immmostreetRentAd.html', 'utf8', function(err, html) {
  if (err) throw err;
  var $ = cheerio.load(html);
    // console.log($.html());
    
    var property = [],title,description,adtype;

    //title
    title = $('div[class="detail-description"]').find('h2').text().trim();
    // console.log(title);

    //AdType
    type = $('span[class="category"]').text().trim();
    // console.log(type);

    //Description
    description = $('div[class="detail-description"]').find('div').text().trim().split("Read more")[0].trim();
    // console.log(description);

    property.push({
      attribute:'title',
      value: title
  })
  property.push({
    attribute:'property_type',
    value: type
  })
  property.push({
    attribute:'full_description',
    value: description.replace('')
  })

  //buy or rent

  if (html.includes('"cl_kvoffer_type":')) {
    rent_or_buy = html.substring(html.indexOf('"cl_kvoffer_type":') + 18, html.indexOf(',', html.indexOf('"cl_kvoffer_type": ')));
    // console.log(rent_or_buy.trim());
  property.push({
      attribute: 'buy_or_rent',
      value: rent_or_buy.trim().replace(/"/g,'').toLowerCase()
  })
  }

  //Address
  if (html.includes('"cl_kvstreet":')) {
    street = html.substring(html.indexOf('"cl_kvstreet":') + 15, html.indexOf(',', html.indexOf('"cl_kvstreet": ')));
    property.push({
      attribute: 'street',
      value: street.trim().replace(/"/g,'').toLowerCase()
  })
  }

  if (html.includes('"cl_kvcity":')) {
    town = html.substring(html.indexOf('"cl_kvcity":') + 12, html.indexOf(',', html.indexOf('"cl_kvcity": ')));
  property.push({
      attribute: 'town',
      value: town.trim().replace(/"/g,'').toLowerCase()
  })
  }

  if (html.includes('"cl_kvzip":')) {
    zip = html.substring(html.indexOf('"cl_kvzip":') + 12, html.indexOf(',', html.indexOf('"cl_kvzip": ')));
  property.push({
      attribute: 'zip',
      value: zip.trim().replace(/"/g,'').toLowerCase()
  })
  }

  
  if (html.includes('"cl_kvregion":')) {
    region = html.substring(html.indexOf('"cl_kvregion":') + 15, html.indexOf(',', html.indexOf('"cl_kvregion": ')));
  property.push({
      attribute: 'region',
      value: region.trim().replace(/"/g,'').toLowerCase()
  })
  }

  
  if (html.includes('"cl_kvcanton":')) {
    canton = html.substring(html.indexOf('"cl_kvcanton":') + 15, html.indexOf(',', html.indexOf('"cl_kvcanton": ')));
  property.push({
      attribute: 'canton',
      value: canton.trim().replace(/"/g,'').toLowerCase()
  })
  }

 

   //Basic features
$('.detail-attributes').find('li[class="item"]').each((index,el)=> {
  
  var attributes_key = $(el).find('span[class="key"]').text().trim();
  var attributes_value = $(el).find('span[class="value"]').text().trim();
  property.push({
    attribute:attributes_key.toLowerCase().replace(' ','_'),
    value: attributes_value
})
  
});

//Prices
$('.detail-prices').find('li[class="item"]').each((index,el)=> {
  
  var price_key = $(el).find('span[class="key"]').text().trim().toLowerCase().replace(' ','_');
  var price_value = $(el).find('span[class="value"]').text().trim();

  property.push({
    attribute:price_key.replace('/','_per_'),
    value: price_value
})
  
});

//FooterInfo
$('.footer').find('li[class="item"]').each((index,el)=> {
  
  var footer_label = $(el).find('span[class="label"]').text().trim().toLowerCase();
  var footer_value = $(el).find('div[class="value"]').text().trim();

  // console.log(footer_value,footer_label);

  property.push({
    attribute:footer_label.replace(' ','_'),
    value: footer_value.toLowerCase()
})
  
});

//Contact_Number
var contact_no = $('a[class="curtain"]').text().trim().split("\n")[0].trim();
property.push({
  attribute:'contact_phone',
  value: contact_no
})
// console.log(contact_no);
 property.push({
  attribute:'contact_no',
  value: contact_no
})


 //Published date and time
//  pub_date=$('meta[property="article:published_time"]').attr('content').split("T")[0].trim();
//  property.push({
//   attribute:'published_date',
//   value: pub_date
// })
//  console.log(pub_date);


//Google maps location
iframeSrc=$('iframe').attr('src');
logLan=iframeSrc.split("&q=")[1];
logLan=logLan.split("&")[0];
log=logLan.split(",")[0].trim();
lan=logLan.split(",")[1].trim();
// console.log(logLan);
// console.log(log);
// console.log(lan);

property.push({
  attribute:'lon',
  value: log
})
property.push({
  attribute:'lat',
  value: lan
})

//construction standard
var count = 0;
var construction_std;
   attributes = $('.detail-features').find('li')
   for (i = 0; i < attributes.length; i++) {
       str = $(attributes[i]).text()
       str = str.trim()
       count++;
       if (count == 1) {
         construction_std = str;
       }
       else {
         construction_std = construction_std + "," + str
       }
     
   }
   property.push({
       attribute: 'construction_standard',
       value: construction_std.trim().toLowerCase()
   })
   // console.log(str_concat);


   //company Agency Address
var address_AgCompany = $('.company-address').first().text().trim();
// console.log(address_AgCompany);

//company Agency Name
var address_AgCompanyName = $('.company-address').find('span').first().text().trim();
console.log(address_AgCompanyName);
property.push({
    attribute:'contact_address',
    value: address_AgCompany.replace(/\n/g,' ',)
})

//Advertisement
var Advertisement_link = $('.detail-agency').find('a').attr('href');
// console.log(Advertisement_link);
property.push({
  attribute:'advertisement',
  value: Advertisement_link.trim()
})


//images 
// $('.slide').each((index,el)=> {
//   var property_images = $(el).find('img[class="image"]').attr('html-image-src').trim();
//   property.push({
//     attribute:'property_image'+parseInt(index+1),
//     value: property_images
//   })
  
// });

//google api
// var add=$('').text();
// console.log(add);


//To remove empty attribute and value
for (i = 0; i < property.length; i++) {
  if (property[i].value == '' || property[i].value == undefined) {
      property.splice(i, 1)
      i--
  }
}


//object reference no
var object_reference;
$('.detail-reference').find('li[class="item"]').each((index,el)=> {
  
  var attributes_key = $(el).find('span[class="key"]').text().trim();
  object_reference = $(el).find('span[class="value"]').text().trim();
//   property.push({
//     attribute:attributes_key.toLowerCase().replace(' ','_'),
//     value: attributes_value
// })

});
// console.log(object_reference)
console.log(property);

}); 