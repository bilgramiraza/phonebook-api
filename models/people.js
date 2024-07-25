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
	name: String,
	number: String,
});

personSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('person', personSchema);
