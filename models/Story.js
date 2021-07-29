const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
	title: { type: String, trim: true, required: true },
	story: { type: String, trim: true, required: true },
	author: { type: { id: String, username: String }, required: true },
});

module.exports = mongoose.model('Story', storySchema);
