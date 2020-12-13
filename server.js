const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const rank = require('./controllers/rank');

console.log("Postgress User: ", process.env.POSTGRES_USER);
const db = knex ({
  client: 'pg',
  connection: {
  	//Docker connections
  	host: process.env.POSTGRES_HOST,
  	user: process.env.POSTGRES_USER,
  	password: process.env.POSTGRES_PASSWORD,
  	database: process.env.POSTGRES_DB
  	// host: '127.0.0.1',
  	// database: 'facerec'
  	// Uncomment below before Heroku deployment
    // connectionString : process.env.DATABASE_URL,
    // ssl: {
    // 	rejectUnauthorized: false
    // }
  }
});

// db.select('*').from('users')
// 	.then(data => {
// 		console.log(data);
// 	}); //KNEX created SQL command

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

// API

app.post('/imageURL', (req, res) => {
	rank.handleAPICall(req, res)
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`server is up on port ${process.env.PORT}`);
});