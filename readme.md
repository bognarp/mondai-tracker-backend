## Backend Routes

:lock: means the endpoint is protected & needs auth token

### `users`

- `GET /api/users` - returns all users
- :lock: `GET /api/users/:userId` - returns user by id
- :lock: `GET /api/users/current`- returns authenticated user 
- `POST /api/users/login` - log in, returns a token
- `POST /api/users/signup` - sign up

  **Querying users**

- `GET /api/users`
  - `q=` - String (find by username or email)

### `projects` :lock:

- `GET /api/projects` - returns all project
- `POST /api/projects` - creates project
- `GET /api/projects/:projectId` - returns project by id
- `DELETE /api/projects/:projectId` - remove project by id

### `stories` :lock:

- `GET /api/projects/:projectId/stories/current` - returns stories in current sprint
- `GET /api/projects/:projectId/stories/backlog` - returns stories in backlog
- `GET /api/projects/:projectId/stories/backlog` - returns archived stories
- `PATCH /api/projects/:projectId/stories/:storyId` - edit story by id
- `DELETE /api/projects/:projectId/stories/:storyId` - remove story by id

  **Querying stories**

- `GET /api/projects/:projectId/stories?`
  - `title=` - `String`
  - `description=` - `String`
  - `state=` - `UNSCHEDULED`,`UNSTARTED`,`STARTED`,`RESTARTED`,`FINISHED`,`REJECTED`,`ACCEPTED`
  - `difficulty=` - `Number` between 0 - 4
  - `priority=` - `Number` between 0 - 4
  - `owner=` - `UserId`
  - `requester=` - `UserId`
