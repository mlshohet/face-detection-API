const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const rank = require('./controllers/rank');

const auth = require('./controllers/authorization');

console.log("Postgress User: ", process.env.POSTGRES_USER);
const db = knex ({
  client: 'pg',
  connection: {
  	//Docker connections
  	// host: process.env.POSTGRES_HOST,
  	// user: process.env.POSTGRES_USER,
  	// password: process.env.POSTGRES_PASSWORD,
  	// database: process.env.POSTGRES_DB
  	
    //This is for local host and local Postgres
   //  host: '127.0.0.1',
  	// database: 'facerec'
    
  	// Uncomment below before Heroku deployment
    connectionString : process.env.DATABASE_URL,
    ssl: {
    	rejectUnauthorized: false
    }
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

app.post('/signin', signin.signinAuthentication(db, bcrypt));

// REGISTER

app.post('/register', register.registerAuthentication(db, bcrypt));

// PROFILE

app.get('/profile/:id', auth.requireAuth, (req, res) => {
  console.log("Get request for user");
	profile.handleProfileGet(req, res, db)
});

app.post('/profile/:id', auth.requireAuth, (req, res) => {
  console.log("Post request for user");
  profile.handleProfileUpdate(req, res, db)
});

// RANK

app.put('/rank', auth.requireAuth, (req, res) => {
	rank.handleRank(req, res, db)
});

// API

app.post('/imageURL', auth.requireAuth, (req, res) => {
	rank.handleAPICall(req, res)
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`server is up on port ${process.env.PORT}`);
});