## Backend Routes

API can be accessed @ https://mondai-backend.herokuapp.com/api/

:lock: - means the endpoint is protected & needs an auth token

### `users`

**Authentication**

- `POST /users/signup` - sign up
  - Body: `{ username, email, password }`
- `POST /users/login` - log in, returns a signed token with 2 hour of expiration
  - Body: `{ email, password }`

**Querying users**

- :lock: `GET /users` - returns all users
- :lock: `GET /users/:userId` - returns user by id
- :lock: `GET /users/current`- returns authenticated user

- :lock: `GET /users`
  - `q=` - `String` (query by username or email)

### `projects` :lock:

- `GET /projects` - returns all projects
- `POST /projects` - creates project
- `GET /projects/:projectId` - returns project by id
- `DELETE /projects/:projectId` - remove project by id

### `stories` :lock:

- `GET /projects/:projectId/stories/current` - returns stories in current sprint
- `GET /projects/:projectId/stories/backlog` - returns stories in backlog
- `GET /projects/:projectId/stories/archive` - returns archived stories
- `PATCH /projects/:projectId/stories/:storyId` - edit story by id
- `DELETE /projects/:projectId/stories/:storyId` - remove story by id

**Querying stories**

- `GET /projects/:projectId/stories?`
  - `title=` - `String`
  - `description=` - `String`
  - `state=` - `UNSCHEDULED`,`UNSTARTED`,`STARTED`,`RESTARTED`,`FINISHED`,`REJECTED`,`ACCEPTED`
  - `difficulty=` - `Number` between 0 - 4
  - `priority=` - `Number` between 0 - 4
  - `owner=` - `UserId`
  - `requester=` - `UserId`
