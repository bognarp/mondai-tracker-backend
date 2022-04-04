const AppError = require('./appError');

const validate = (validator) => (req, res, next) => {
  const { errors, isValid } = validator(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: 'fail',
      message: errors,
    });
  }

  next();
};

// ERROR HANDLING

const unknownEndpoint = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} endpoint`, 404));
};

const handleDbValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleDbCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const devErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const prodErrors = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error('ERROR', err);
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    devErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newError = { ...err, message: err.message };

    if (err.name === 'CastError') {
      newError = handleDbCastError(newError);
    }
    if (err.name === 'ValidationError') {
      newError = handleDbValidationError(newError);
    }

    prodErrors(newError, res);
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  validate,
};
