const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: { type: String, trim: true, required: true },
	email: { type: String, trim: true, required: true },
	password: { type: String, trim: true, required: true },
	stories: [String],
});

module.exports = mongoose.model('User', userSchema);
