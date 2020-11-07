'use strict';

const { response } = require('express');

require('dotenv').config();

const
  express = require ('express'),
  cors = require ('cors'),
  app = express(),
  PORT = process.env.PORT|| 3000,
  superagent=require('superagent');


app.use(cors());
app.get('/',welcomePage);
app.get('/search',getData);

// -------------------------------
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
// -------------------------------

function welcomePage (request , respone)
{
  // respone.send('Welcome to homepage');
  response.render('view/pages/index');
}

app.listen (PORT , () => {
  console.log(`Listening on port: ${PORT}`);
});

function getData (req,res) {
  const url = 'https://api.covid19api.com/summary';
  let countryName = req.query.countryName;
  console.log(countryName);
  const parmetar = {
    limit : 10,
  };

  superagent.get(url).query(parmetar).then ( data => {
    console.log('hi from superagent');
  }).catch(console.log('error in superagent'));

}


