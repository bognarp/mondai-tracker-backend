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

const unknownEndpoint = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} endpoint`, 404));
};

const _devErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const _prodErrors = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR  -> ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    _devErrors(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // TODO: handle mongoose errors as 'operational'
    _prodErrors(err, res);
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  validate,
};
