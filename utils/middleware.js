const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error('ERROR NAME: ', error.name);
  console.error('ERROR MESSAGE: ', error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'MongooseError') {
    return response.status(500).send({ error: 'server error' });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
