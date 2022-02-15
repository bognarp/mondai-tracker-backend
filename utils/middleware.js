const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error('ERROR NAME: ', error.name);
  console.error('ERROR MESSAGE: ', error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'MongooseError') {
    return res.status(500).send({ error: 'server error' });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
