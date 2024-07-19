const express = require('express');
const app = express();

app.use(express.json());

let phoneBook = [
	{
		"id": "1",
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": "2",
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": "3",
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": "4",
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
];

app.get('/', (request, response) => {
	response.send('<h1>PhoneBook Api</h1>');
});

app.get('/info', (request, response) => {
	const count = phoneBook.length;
	response.send(`<p>Phonebook has ${count} People</p><p>${Date()}</p>`);
});

app.get('/api/persons', (request, response) => {
	response.json(phoneBook);
});

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = phoneBook.find(pB => pB.id === id);

	if (!person) return response.status(404).end();

	response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;

	phoneBook = phoneBook.filter(pB => pB.id !== id);

	response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server Running and Listening on Port ${PORT}`)
});
