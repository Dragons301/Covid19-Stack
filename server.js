'use strict';

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

app.use(cors());
app.get('/', HomePage);
app.post('/search', getApiInfo);


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
  this.Country = data.Country;
  this.Confirmed = data.Confirmed;
  this.Deaths = data.Deaths;
  this.Recovered = data.Recovered;
  this.Active = data.Active;
  this.Date = data.Date.slice(0, 10);
  this.Lat = data.Lat;
  this.Lon = data.Lon;
  this.TotalConfirmed=0;
  this.TotalDeaths=0;
  this.TotalRecovered=0;

}



app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
