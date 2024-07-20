const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

const postedDataToken = (_tokens) => {
	if (true) return ' ';//Replace with ENV Condition for Logging Post Data
	// const postedData = tokens.body;
	// return JSON.stringify(postedData);
}

morgan.token('postedData', postedDataToken);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postedData', {
	//skip: req => req.method !== "POST" , // Replace Skip Logic With ENV Based Check for Methods Filtering
}));

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

const generateId = () => {
	const maxId = phoneBook.length > 0
		? Math.max(...phoneBook.map(pB => Number(pB.id)))
		: 0;

	return String(maxId + 1);
};

const checkDuplicate = newName => {
	const duplicate = phoneBook.find(pB => pB.name === newName);
	return Boolean(duplicate);
};

app.post('/api/persons', (request, response) => {
	const { name: personName, number: personNumber } = request.body;

	if (!personName || !personNumber)
		return response.status(400).json({
			error: "Data Missing"
		});

	if (checkDuplicate(personName))
		return response.status(400).json({
			error: "Name Must be Unique"
		});

	const person = {
		id: generateId(),
		name: personName,
		number: personNumber,
	};

	phoneBook = phoneBook.concat(person);

	response.json(person);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "Endpoint Not Found" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server Running and Listening on Port ${PORT}`)
});
