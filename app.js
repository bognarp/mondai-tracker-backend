const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const passportConfig = require('./utils/passport');
const usersRouter = require('./routes/api/users');
const projectsRouter = require('./routes/api/projects');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB succesfully'))
  .catch((err) => console.log(err));

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
passportConfig(passport);

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
