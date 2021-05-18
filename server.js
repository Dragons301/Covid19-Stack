'use strict';

require('dotenv').config();


const
  methodOverride = require('method-override'),//over write method post to delete or update
  express = require('express'),
  bcrypt = require('bcrypt'),
  saltRounds = 10,
  cors = require('cors'),
  // Chart = require('chart.js'),
  app = express(),
  PORT = process.env.PORT || 3000,
  API_NEWS = process.env.API_NEWS,
  superagent = require('superagent');
app.use(express.static('public')); //Diractory start point for redned
app.set('view engine', 'ejs'); // to target all ejs files
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
const pg = require('pg');
const Database = process.env.DATABASE_URL;
// const client = new pg.Client(Database);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } });
let userOn;
app.use(cors());
//--------------------------
//Routes

app.get('/', HomePage);
app.post('/search', getApiInfo);
app.get('/search', showForm);
app.get('/news', getNews);
app.post('/news', saveToDB);//fav
app.get('/fav', showFav);
app.delete('/fav/:id', deleteFav);
app.get('/signUp', signUp);
app.post('/signUp', check);
app.get('/signIn', signInPage);
app.post('/signIn', signIn);
app.get('/logout', logout);
app.get('/aboutUs', aboutUs);
app.post('/searchTo', getApiInfo2);

//----------------------
//functions
function aboutUs(req, res) {
  res.render('pages/aboutUs');
}
//----
function getApiInfo2(req, res) {
  const country = req.body.country;
  let date = req.body.date;
  let date2 = req.body.date2;
  let covid;
  let find = false;
  date = new Date(date);
  date.setDate(date.getDate() - 1);
  date2 = new Date(date2);
  date2.setDate(date2.getDate() + 0);
  date = date.toISOString();
  date2 = date2.toISOString();
  let allCovid = [];
  const url = `https://api.covid19api.com/country/${country}?from=${date}&to=${date2}`;
  superagent.get(url).then(data => {
    for (let i = 1; i < data.body.length; i++) {
      const newData = {
        Country: data.body[i].Country,
        Confirmed: data.body[i].Confirmed - data.body[i - 1].Confirmed,
        Deaths: data.body[i].Deaths - data.body[i - 1].Deaths,
        Recovered: data.body[i].Recovered - data.body[i - 1].Recovered,
        Active: data.body[i].Active - data.body[i - 1].Active,
        Lat: data.body[i].Lat,
        Lon: data.body[i].Lon,
        Date: data.body[i].Date
      };
      covid = new Covid(newData);
      find = true;
      allCovid.push(covid);
    }
    let listConfirm = [];
    let listDate = [];
    allCovid.forEach(element => {
      listConfirm.push(element.Confirmed);
      listDate.push(element.Date);
    });

    if (find) {
      const url2 = 'https://api.covid19api.com/world/total';
      superagent.get(url2).then(data => {
        covid.TotalConfirmed = data.body.TotalConfirmed;
        covid.TotalDeaths = data.body.TotalDeaths;
        covid.TotalRecovered = data.body.TotalRecovered;
        if (listConfirm)
          res.render('pages/show', { result: { listConfirm, listDate } });
        else {
          res.render('pages/error', { result: 'No data of this date yet' });
        }
      }).catch(() => {
        res.render('pages/error', { result: 'No data found on totalApi' });
      });
    }
    else {
      res.render('pages/error', { result: 'No data of this date yet' });
    }

  }).catch(() => {
    res.render('pages/error', { result: 'No data found ,Try again , Pls make sure you insert right input' });

  });
}
//----

function signUp(req, res) {
  res.render('pages/sign', { result: '' });

}
//----

function logout(req, res) {
  userOn = null;
  isOn = false;
  res.redirect('/');
}
//----

function signInPage(req, res) {
  if (!userOn) {
    res.render('pages/signIn', { result: '' });
  }
  else {
    res.redirect('/');
  }

}
//----

function signIn(req, res) {
  const { user, pass } = req.body;
  const url = 'select * from Users where username=$1;';
  client.query(url, [user]).then((data) => {
    if (data.rows.length === 0) {
      res.render('pages/signIn', { result: 'User does not exist' });
    }
    else {
      const passDb = data.rows[0].password;
      bcrypt.compare(pass, passDb, function (error, response) {
        if (response) {
          userOn = user;
          isOn = true;
          res.render('pages/index', { on: isOn });
        }
        else {
          res.render('pages/signIn', { result: 'The password is incorrect!' });

        }

      });

    }
  }).catch(() => console.log('here'));
}

//----

function check(req, res) {
  const { user, pass, cPass } = req.body;
  if (pass === cPass) {
    const url = 'select * from Users where username=$1;';
    client.query(url, [user]).then((data) => {
      if (data.rows.length === 0) {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
          const insertSql = 'insert into Users (username,password) values ($1,$2);';

          client.query(insertSql, [user, hash]).then(() => {

            res.render('pages/sign', { result: 'You sign up successfully' });
          }).catch(() => {
            res.render('pages/error', { result: 'Error in Line 68' });
          });

        });
      }
      else {
        res.render('pages/sign', { result: 'Username Already exists' });

      }

    }).catch(() => res.render('pages/error', { result: 'Error in Line 62' }));

  }
  else {
    res.render('pages/sign', { result: 'The pwassword does not match' });
  }
}
//----

function deleteFav(req, res) {
  const id = req.params.id;
  const sql = 'delete from news where id=$1;';
  client.query(sql, [id]).then(() => {
    res.redirect('/fav');
  }).catch(() => res.render('pages/error', { result: 'Error in Line 90' }));

}
//----


function showFav(req, res) {

  const sql = 'select * from news where username=$1;';
  client.query(sql, [userOn]).then(data => res.render('pages/fav', { result: data.rows })).catch(() => res.render('pages/error', { result: 'Error in Line 99' }));
}
//----

function saveToDB(req, res) {
  if (userOn) {
    const { title, url, image, description } = req.body;

    const sql = 'insert into news (title,url,image,description,username) values ($1,$2,$3,$4,$5);';
    const saveValue = [title, url, image, description, userOn];

    let checkSql = 'select * from news where title=$1;';
    client.query(checkSql, [title]).then(data => {
      if (data.rows.length === 0) {

        client.query(sql, saveValue).then(() => {
          res.redirect('/news');
        });

      } else {
        res.redirect('/news');
      }
    }).catch((error) => res.render('pages/error', { result: error }));
  }
  else {
    res.redirect('signIn');
  }
}

let isOn = false;
//----

function showForm(req, res) {
  res.render('pages/show', { result: new Covid(0) });
}
//----

function HomePage(req, res) {
  res.render('pages/index', { on: isOn });

}
//----

function getNews(req, res) {

  const url = `https://api.currentsapi.services/v1/search`;
  const parameter = {
    keywords: 'Covid-19',
    apiKey: API_NEWS,
    category: 'health',
  };

  let all = [];
  superagent.get(url).query(parameter).then(data => {
    for (let i = 0; i < data.body.news.length; i++) {
      all.push(new News(data.body.news[i]));
      if (i === 9) break;
    }
    res.render('pages/news', { result: all });

  }).catch(() => {
    res.render('pages/error', { result: 'No News Avaliable' });
  });
}
//----

function getApiInfo(req, res) {
  const country = req.body.country;
  let date = req.body.date;
  let covid;
  let find = false;
  date = new Date(date);
  date.setDate(date.getDate() + 0);
  let date2 = new Date(date);
  date2.setDate(date2.getDate() - 1);
  date = date.toISOString();
  date2 = date2.toISOString();
  // let allCovid=[];
  const url = `https://api.covid19api.com/country/${country}?from=${date2}&to=${date}`;
  superagent.get(url).then(data => {
    // data.body.forEach(element => {


    //   if (date.toISOString().slice(0, 10) === element.Date.slice(0, 10)) {

    const newData = {
      Country: data.body[1].Country,
      Confirmed: data.body[1].Confirmed - data.body[0].Confirmed,
      Deaths: data.body[1].Deaths - data.body[0].Deaths,
      Recovered: data.body[1].Recovered - data.body[0].Recovered,
      Active: data.body[1].Active - data.body[0].Active,
      Lat: data.body[1].Lat,
      Lon: data.body[1].Lon,
      Date: data.body[1].Date

    };

    covid = new Covid(newData);
    find = true;

    if (find) {
      const url2 = 'https://api.covid19api.com/world/total';
      superagent.get(url2).then(data => {
        covid.TotalConfirmed = data.body.TotalConfirmed;
        covid.TotalDeaths = data.body.TotalDeaths;
        covid.TotalRecovered = data.body.TotalRecovered;
        if (newData.Date.slice(0, 10) === date.slice(0, 10))
          res.render('pages/show', { result: covid });
        else {
          res.render('pages/error', { result: 'No data of this date yet' });
        }

      }).catch(() => {
        res.render('pages/error', { result: 'No data found on totalApi' });
      });

    }
    else {
      res.render('pages/error', { result: 'No data of this date yet' });
    }

  }).catch(() => {
    res.render('pages/error', { result: 'No data found ,Try again , Pls make sure you insert right input' });

  });

}


//--------------------------------------
//Constructor
function News(data) {
  this.title = data.title || 'No title';
  this.description = data.description || 'No description';

  this.image = data.image;
  if (this.image === 'None')
    this.image = 'https://cdn.dribbble.com/users/55871/screenshots/2158022/no_photo.jpg';
  this.url = data.url;
}


//----------
function Covid(data) {
  this.Country = data.Country || '';
  this.Confirmed = data.Confirmed || 0;
  this.Deaths = data.Deaths || 0;
  this.Recovered = data.Recovered || 0;
  this.Active = data.Active || 0;
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

//-----------------------------------------
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

}).catch(() => (console.log('No Connection on DataBase')));


app.use('*', (request, resp) => {
  resp.status(404).render('pages/error', { result: 'Page Not Found 404' });
});
