'use strict';
// https://api.currentsapi.services/v1/search?keywords=Covid-19&apiKey=BOONpfWlotrBLHukxQ1o1LSQ7A6k6agcAnXbFWc_8mzUp8i3&category=health
// For News
//Data look
// "id":"fa06eadd-294c-4f30-b72b-4713b42fcc01",
// "title":"New Brunswick reports 3 new coronavirus cases in Fredericton region",
// "description":"The province said the new COVID-19 cases include one individual aged 19 and under and two people in their 50s....",
// "url":"https:\/\/globalnews.ca\/news\/7448887\/new-brunswick-coronavirus-cases-nov-7\/",
// "author":"aalhakim",
// "image":"https:\/\/globalnews.ca\/wp-content\/uploads\/2020\/11\/1000-2-1.jpeg?quality=85&strip=all&w=720&h=379&crop=1",
// "language":"en",
// "category":[
//    "health",
//    "lifestyle"
// ],
// "published":"2020-11-07 17:24:43 +0000"
// },
require('dotenv').config();

const
  express = require('express'),
  cors = require('cors'),
  app = express(),
  PORT = process.env.PORT || 3000,
  superagent = require('superagent');
app.use(express.static('public')); //Diractory start point
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
// const pg = require('pg');
// const Database=env.process.DATEBASE_URL
// const client=pg.Client(Database)
app.use(cors());
app.get('/', HomePage);
app.post('/search', getApiInfo);
app.get('/search', showForm);
app.get('/', HomePage);

function showForm(req, res) {
  res.render('pages/show', { result: new Covid(0) });
}

function HomePage(req, res) {

  res.render('pages/index');

}

function getApiInfo(req, res) {
  const country = req.body.country;
  const date = req.body.date;
  console.log(date);
  let covid;
  let find = false;



  const url = `https://api.covid19api.com/dayone/country/${country}`;
  superagent.get(url).then(data => {
    data.body.forEach(element => {
      if (date === element.Date.slice(0, 10)) {
        covid = new Covid(element);
        find = true;
      }
    });


    if (find) {
      const url2 = 'https://api.covid19api.com/world/total';
      superagent.get(url2).then(data => {
        covid.TotalConfirmed = data.body.TotalConfirmed;
        covid.TotalDeaths = data.body.TotalDeaths;
        covid.TotalRecovered = data.body.TotalRecovered;
        res.render('pages/show', { result: covid });

      });

    }
    else {
      res.render('pages/error');
    }






  });


}



function Covid(data) {
  this.Country = data.Country || '';
  this.Confirmed = data.Confirmed || '';
  this.Deaths = data.Deaths || '';
  this.Recovered = data.Recovered || '';
  this.Active = data.Active || '';
  try {
    this.Date = data.Date.slice(0, 10) || '';
  }
  catch (error) {
    this.Date = '';

  }
  this.Lat = data.Lat || '';
  this.Lon = data.Lon || '';
  this.TotalConfirmed = '';
  this.TotalDeaths = '';
  this.TotalRecovered = '';

}


// client.connect().then(() => {
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  //   })

});
