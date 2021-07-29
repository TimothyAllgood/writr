const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const { UserInputError } = require('apollo-server-express');

// User Resolvers

// Sign UP a new user
const signup = async (parent, args) => {
	// Validate Field Input
	if (!args.username || !args.email || !args.password) {
		throw new UserInputError('All Fields Are Required', { type: 'general' });
	}

	// Validate Password Length
	if (args.password.length < 8 || args.password.length > 32) {
		throw new UserInputError(
			'Password must be between 8 and 32 characters long',
			{ type: 'password' }
		);
	}

	try {
		// Send Error if Email Exists in DB
		const foundEmail = await db.User.findOne({ email: args.email });
		if (foundEmail) {
			throw new UserInputError(
				'Email address has already been registered. Please try again',
				{ type: 'email' }
			);
		}

		// Send Error If Username Exists in DB
		const foundUsername = await db.User.findOne({ username: args.username });
		if (foundUsername) {
			throw new UserInputError(
				'Username has already been registered. Please try again',
				{ type: 'username' }
			);
		}

		// CREATE SALT FOR HASH
		const salt = await bcrypt.genSalt(10);
		// HASH USER PASSWORD
		const hash = await bcrypt.hash(args.password, salt);
		// CREATE USER WITH HASHED PASSWORD
		const newUser = await db.User.create({ ...args, password: hash });
		return newUser;
	} catch (error) {
		console.log(error);
		if (error) {
			throw new UserInputError(error);
		} else {
			throw new Error('Something went wrong. Please try again');
		}
	}
};

// Login an existing user
const login = async (parent, args) => {
	try {
		// FIND USER BY EMAIL (OR USERNAME)
		const foundUser = await db.User.findOne({ username: args.username });

		if (!foundUser) {
			throw new UserInputError('No user found with that username', {
				type: 'username',
			});
		}

		// CHECK IF PASSWORDS MATCH
		const isMatch = await bcrypt.compare(args.password, foundUser.password);
		if (!isMatch) {
			throw new UserInputError('Password is incorrect', { type: 'password' });
		}

		// CREATE TOKEN PAYLOAD
		const payload = { id: foundUser._id, user: foundUser.username };
		const secret = process.env.SECRET;
		const expiration = { expiresIn: '1h' };

		// SIGN TOKEN
		const token = await jwt.sign(payload, secret, expiration);

		// SEND SUCCESS WITH TOKEN
		return { id: foundUser._id, username: foundUser.username, token };
	} catch (error) {
		if (error) {
			throw new UserInputError(error);
		} else {
			throw new Error('Something went wrong. Please try again');
		}
	}
};

const verify = () => {
	const token = req.headers['authorization'];
	jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
		if (err || !decodedUser) {
			return res.status(401).json({
				message: 'You are not authorized. Please login and try again',
			});
		}

		// ADD PAYLOAD TO REQ OBJECT
		req.currentUser = decodedUser;

		// ********** --- --- **********
		// SEND SUCCESS WITH TOKEN AS VERIFY ROUTE
		return decodedUser;

		// ********** --- --- **********
		// CALL NEXT AS MIDDLEWARE FUNCTION
		// next();
	});
};

// Returns a list of all users
const getAllUsers = async () => {
	const users = await db.User.find();
	return users;
};

// Find User By Id
const getUser = async (parent, args) => {
	const id = args.id;
	const foundUser = await db.User.findById(id);
	return foundUser;
};

// Story Resolvers

const getAllStories = async (parent, args) => {
	const stories = await db.Story.find();
	return stories;
};

const getUserStories = async (parent, args) => {
	const id = args.id;
	const foundStories = await db.Story.find('author', id);
	return foundStories;
};

const createStory = async (parent, args) => {
	const newStory = await db.Story.create({
		title: args.title,
		story: args.story,
		author: { id: args.authorId, username: args.authorUsername },
	});
	const storyId = newStory._id.toString();
	await db.User.findOneAndUpdate(
		{ _id: args.authorId },
		{ $push: { stories: storyId } }
	);
	return newStory;
};

const updateStory = async (parents, args) => {
	const updatedStory = await db.Story.findOneAndUpdate(
		{ _id: args.id },
		{ title: args.title, story: args.story },
		{
			new: true,
		}
	);

	return updatedStory;
};

const deleteStory = async (parents, args) => {
	await db.Story.findOneAndDelete({ _id: args.id });
	await db.User.findOneAndUpdate(
		{ _id: args.authorId },
		{
			$pull: { stories: args.id },
		}
	);

	return 'Item Deleted';
};

// Resolvers for GraphQL
const resolvers = {
	Query: {
		getAllUsers,
		getAllStories,
		getUserStories,
		getUser,
		verify,
	},
	Mutation: {
		signup,
		login,
		createStory,
		deleteStory,
		updateStory,
	},
};

module.exports = { resolvers };
