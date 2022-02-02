const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const usersRouter = require('./routes/api/users');
const projectsRouter = require('./routes/api/projects');

app.disable('x-powered-by');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
