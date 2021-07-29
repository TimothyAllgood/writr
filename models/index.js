const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
	.connect(MONGODB_URL, {
		useFindAndModify: false,
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Mongodb connected at ', MONGODB_URL))
	.catch((err) => console.log('Mongodb error: ', err));

module.exports = {
	User: require('./User'),
	Story: require('./Story'),
};
