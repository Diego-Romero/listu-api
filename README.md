# Listu Api

## Running in dev mode

### Adding env variables

- create nodemon.config file with the needed env vars

```json
{
  "restartable": "rs",
  "ignore": [".git", "node_modules/", "dist/", "coverage/"],
  "watch": ["src/"],
  "execMap": {
    "ts": "node -r ts-node/register"
  },
  "env": {
    "NODE_ENV": "development",
    "PORT": "8080",
    "SESSION_SECRET": "keyboard cat",
    "DB_CONNECTION": "mongodb://localhost/listu",
    "CLIENT_URL": "http://localhost:3000",
    "SENDGRID_API_KEY": ""
  },
  "ext": "js,json,ts"
}
```

## Running in production mode

For this you will need to create a .env file following the same conventions as .env.example

Then you can run

```bash
yarn run build && yarn start
```

### Folder Structure

```
src
│   app.js          # App entry point
└───api             # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configuration related stuff
└───jobs            # Jobs definitions for agenda.js
└───loaders         # Split the startup process into modules
└───models          # Database models
└───services        # All the business logic is here
└───subscribers     # Event handlers for async task
└───types           # Type declaration files (d.ts) for Typescript
```
