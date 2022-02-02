const express = require('express');
const bodyParser = require('body-parser');
const config = require('./utils/config');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/api/users');
const projectsRouter = require('./routes/api/projects');
const mongoose = require('mongoose');

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

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
