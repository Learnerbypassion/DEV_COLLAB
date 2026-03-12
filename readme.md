# DevCollab 🚀

DevCollab is a **developer collaboration platform** where developers can create projects, invite collaborators, and work together on projects efficiently.

It allows users to **manage projects, send collaboration requests, accept team members, and work together in a structured way.**

---

## Features ✨

### Authentication

* User registration
* User login
* JWT based authentication
* Protected routes

### User System

* User profiles
* View user information
* Track joined projects

### Project Management

* Create a project
* Update project details
* Delete projects
* View project information
* Project owner management

### Collaboration System

* Send collaboration requests
* Accept collaboration requests
* Reject collaboration requests
* View received collaboration requests
* View project collaborators
* Leave a project
* Remove collaborators (project owner)

### Database Safety

Important operations like removing collaborators and leaving projects use **MongoDB transactions** to maintain database consistency.

---

## Tech Stack 🛠

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)

---

## API Routes

### Auth Routes

POST `/api/auth/register`

POST `/api/auth/login`

GET `/api/auth/me`

---

### User Routes

GET `/api/users`

GET `/api/users/:userId`

---

### Project Routes

POST `/api/projects`

GET `/api/projects`

GET `/api/projects/:projectId`

PATCH `/api/projects/:projectId`

DELETE `/api/projects/:projectId`

---

### Collaboration Routes

POST `/api/collabs/request`

GET `/api/collabs/requests`

PATCH `/api/collabs/:collabId/accept`

PATCH `/api/collabs/:collabId/reject`

PATCH `/api/collabs/:collabId/leave`

PATCH `/api/collabs/:collabId/remove`

GET `/api/collabs/project/:projectId/collaborators`

GET `/api/collabs/joined-projects`

---

## Project Structure 📁

```
devcollab
│
├── controllers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── project.controller.js
│   └── collab.controller.js
│
├── models
│   ├── user.model.js
│   ├── project.model.js
│   └── collab.model.js
│
├── routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── project.routes.js
│   └── collab.routes.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── project.middleware.js
│   └── collab.middleware.js
│
├── config
│   └── db.js
│
└── server.js
```

---

## Installation ⚙️

Clone the repository

```
git clone https://github.com/your-username/devcollab.git
```

Go to the project directory

```
cd devcollab
```

Install dependencies

```
npm install
```

Create a `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the server

```
npm run dev
```

Server will run at

```
http://localhost:5000
```

---

## Future Improvements 🚧

* Task management system
* Comments and discussions
* Notifications
* File uploads
* Project roles
* Activity logs

---

## Author 👨‍💻

Developed by **Bit 2**