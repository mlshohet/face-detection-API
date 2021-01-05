const Clarifai = require('clarifai');

const app = new Clarifai.App({
//Put in the API key for ClarifAI
  apiKey: 'facdef33794149eb87a593f06a9eed71'
});

const handleAPICall = (req, res) => {
	app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
    	console.log(data);
    	res.json(data);
    })
    .catch(err => res.status(400).json("Unable to connect with API"));
}

const handleRank = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Unable to get count.'));
}

module.exports = {
	handleRank,
	handleAPICall
};