'use strict';

require('dotenv').config();



const
  methodOverride = require('method-override'),//over write method post to delete or update
  express = require('express'),
  bcrypt = require('bcrypt'),
  saltRounds = 10,
  cors = require('cors'),
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
const client = new pg.Client(Database);
let userOn;
app.use(cors());
app.get('/', HomePage);
app.post('/search', getApiInfo);
app.get('/search', showForm);
app.get('/', HomePage);
app.get('/news', getNews);
app.post('/news', saveToDB);//fav
app.get('/fav', showFav);
app.delete('/fav/:id', deleteFav);
app.get('/signUp', signUp);
app.post('/signUp', check);
app.get('/signIn', signInPage);
app.post('/signIn', signIn);
app.get('/logout', logout);

function signUp(req, res) {
  res.render('pages/sign', { result: '' });

}

function logout(req, res) {
  userOn = null;
  res.redirect('/');
}

function signInPage(req, res) {
  if (!userOn) {
    res.render('pages/signIn', { result: '' });
  }
  else {
    res.redirect('/');
  }

}

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
          res.redirect('/');
        }
        else {
          res.render('pages/signIn', { result: 'The password is incorrect!' });

        }

      });

    }
  }).catch(() => console.log('here'));



}

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
          }).catch((error) => {
            console.log(error);
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

function deleteFav(req, res) {
  const id = req.params.id;
  const sql = 'delete from news where id=$1;';
  client.query(sql, [id]).then(() => {
    res.redirect('/fav');
  }).catch(() => res.render('pages/error', { result: 'Error in Line 90' }));

}


function showFav(req, res) {

  const sql = 'select * from news where username=$1;';
  client.query(sql, [userOn]).then(data => res.render('pages/fav', { result: data.rows })).catch(() => res.render('pages/error', { result: 'Error in Line 99' }));
}

// function showFavCovid(req, res) {

//   const sql = 'select * from Covid where username=$1;';
//   client.query(sql, [userOn]).then(data => res.render('pages/CovidFavCountry', { result: data.rows })).catch(() => res.render('pages/error', { result: 'Error in Line 99' }));
// }


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


// function saveToDB(req, res) {
//   if (userOn) {
//     const { title, url, image, description } = req.body;

//     const sql = 'insert into Covid (title,url,image,description,username) values ($1,$2,$3,$4,$5);';
//     const saveValue = [title, url, image, description, userOn];

//     let checkSql = 'select * from Covid where title=$1;';
//     client.query(checkSql, [title]).then(data => {
//       if (data.rows.length === 0) {

//         client.query(sql, saveValue).then(() => {
//           res.redirect('/news');
//         });

//       } else {
//         res.redirect('/news');
//       }
//     }).catch((error) => res.render('pages/error', { result: error }));
//   }
//   else {
//     res.redirect('signIn');
//   }
// }

function showForm(req, res) {
  res.render('pages/show', { result: new Covid(0) });
}

function HomePage(req, res) {
  res.render('pages/index');

}

function getNews(req, res) {
  console.log(userOn);

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


function News(data) {
  this.title = data.title;
  this.description = data.description;
  this.image = data.image;
  this.url = data.url;
}


function getApiInfo(req, res) {
  const country = req.body.country;
  const date = req.body.date;
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


client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

}).catch(() => (console.log('No Connection on DataBase')));
