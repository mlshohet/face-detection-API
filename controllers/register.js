const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup Redis:
// Heroku:
const redisClient = redis.createClient(process.env.REDIS_URL);
//local:
//const redisClient = redis.createClient({ host: '127.0.0.1' });


const handleRegister = (db, bcrypt, req, res) => {
	const { email, name, password } = req.body;
	if( !email || !name || !password) {
		return Promise.reject("Information missing.");
	}
	const hash = bcrypt.hashSync(password); // this is bcrypt hashing of the password from the req body
	return db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email : loginEmail[0],
					name: name,
					joined: new Date()
					})
		.then(user => user[0]);
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => Promise.reject('Error. Cannot register.'))
	
}

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
}

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
	// JWT token, returns user data
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => { 
			return { success: 'true', userId: id, token }
		})
		.catch(console.log)
}

const registerAuthentication = (db, bcrypt) => (req, res) => {
	handleRegister(db, bcrypt, req, res)
		.then(data => {
			return data.id && data.email ? createSessions(data) : Promise.reject(data)
		})
		.then(session => { res.json(session) })
		.catch(err => res.status(400).json(err))
}

module.exports = {
	registerAuthentication: registerAuthentication,
	redisClient: redisClient
};

