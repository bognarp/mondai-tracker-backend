const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

const config = require('./utils/config');
const passportConfig = require('./utils/passport');
const usersRouter = require('./routes/api/userRoutes');
const projectsRouter = require('./routes/api/projectRoutes');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => {
    console.error(err.name, err.message);
  });

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));
app.use(passport.initialize());
passportConfig(passport);

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);

app.all('*', unknownEndpoint);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
