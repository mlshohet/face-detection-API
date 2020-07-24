const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const rank = require('./controllers/rank');

const db = knex ({
  client: 'pg',
  connection: {
    host : process.env.DATABASE_URL,
    ssl: true
  }
});

db.select('*').from('users')
	.then(data => {
		console.log(data);
	}); //KNEX created SQL command

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Server is working');
});

// SIGN IN

app.post('/signin', (req, res) => {
	signin.handleSignin(req, res, db, bcrypt);
});

// REGISTER

app.post('/register', (req, res) => { 
	register.handleRegister(req, res, db, bcrypt)
});

// PROFILE

app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db)
});

// RANK

app.put('/rank', (req, res) => {
	rank.handleRank(req, res, db)
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`server is up on port ${process.env.PORT}`);
});