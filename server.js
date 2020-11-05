'use strict';

require('dotenv').config();

const express = require ('express');
const cors = require ('cors');
const app = express();
const PORT = process.env.PORT|| 3000;
const superagent=require('superagent');

app.use(cors());
app.get('/',welcomePage);

function welcomePage (request , respone)
{
  respone.send('Welcome to homepage');
}

app.listen (PORT , () => {
  console.log(`Listening on port: ${PORT}`);
});
