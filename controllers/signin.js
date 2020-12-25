const jwt = require('jsonwebtoken');

const handleSignin = (db, bcrypt, req, res) => {
	const { email, password } = req.body;
	if( !email || !password) {
		return Promise.reject('Information missing.');
	}
	return db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
						.where('email', '=', email)
						.then(user => user[0])
						.catch(err => Promise.reject('Unable to sign in.'))
			} else {
				Promise.reject('Wrong username and/or password.')
			}
		})
		.catch(err => Promise.reject('Wrong username and/or password.'))
}

const getAuthTokenId = () => {
	console.log('Auth OK.');
}

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days'});
}

const createSessions = (user) => {
	// JWT token, return user data
	console.log("BUt does it get to here?");
	const { email, id } = user;
	const token = signToken(email);
	return { success: 'true', userId: id, token }
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
	console.log("It gets to here at least");
	const { authorization } = req.headers;
	console.log("And also to here");
	return authorization ?
		getAuthTokenId() :
		handleSignin(db, bcrypt, req, res) // this has to return something, so return is added to db.select statement
			.then(data => {
				return data.id && data.email ? createSessions(data) : Promise.reject(data)
			})
			.then(session => res.json(session))
			.catch(err => res.status(400).json(err))
}

module.exports = {
	signinAuthentication: signinAuthentication
};