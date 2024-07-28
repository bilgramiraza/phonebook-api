require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/people.js');

app.use(cors());
app.use(express.json());

const postedDataToken = (_tokens) => {
  //if (true)
  return ' ';//Replace with ENV Condition for Logging Post Data
  // const postedData = tokens.body;
  // return JSON.stringify(postedData);
};

morgan.token('postedData', postedDataToken);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postedData', {
  //skip: req => req.method !== "POST" , // Replace Skip Logic With ENV Based Check for Methods Filtering
}));

app.use(express.static('dist'));

app.get('/info', (_request, response, next) => {
  Person
    .countDocuments()
    .then(result => response.send(`<p>Phonebook has ${result} People</p><p>${Date()}</p>`))
    .catch(error => next(error));
});

app.get('/api/persons', (_request, response, next) => {
  Person
    .find({})
    .then(people => response.json(people))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person
    .findById(id)
    .then(person => {
      if (!person) return response.status(404).end();
      response.json(person);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person
    .findByIdAndDelete(id)
    .then(_result => response.status(204).end())
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name: personName, number: personNumber } = request.body;

  if (!personName || !personNumber)
    return response.status(400).json({
      error: 'Data Missing'
    });

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  person
    .save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error));

});

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const { name: personName, number: personNumber } = request.body;

  const person = {
    name: personName,
    number: personNumber,
  };

  const updateOptions = {
    new: true,
    runValidators: true,
    context: 'query',
  };

  Person
    .findByIdAndUpdate(id, person, updateOptions)
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error));

});

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'Endpoint Not Found' });
};

app.use(unknownEndpoint);

const errorHandler = (error, _request, response, next) => {
  console.error(error.message);
  switch (error.name) {
  case 'CastError':
    return response.status(400).send({ error: 'malformatted Id' });
  case 'ValidationError':
    return response.status(400).send({ error: error.message.split(':')[2] });
  default: next(error);
  }
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running and Listening on Port ${PORT}`);
});
