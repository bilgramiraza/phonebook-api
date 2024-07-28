const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url)
	.then(_result => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.log(`Error Connecting to MongoDB: ${error.message}`)
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: [3, 'Name too short(Min 3)'],
		required: true,
	},
	number: {
		type: String,
		minLength: [8, 'Phone Number too short(Min 8)'],
		validate: {
			validator: value => /^\d{2,3}-\d{5,}$/.test(value),
			message: ({ value }) => `${value} is not a valid Phone Number`,
		},
		required: true,
	},
});

personSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('person', personSchema);
