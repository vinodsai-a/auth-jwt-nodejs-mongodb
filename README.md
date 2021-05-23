# api-auth

## Description

JWT Auth using Access Token and Refresh Token

## Installation

```bash
# installs npm packages
$ npm i
```

## Local DB setup

```bash
# for running local mongodb server
$ docker-compose up -d
# or
# to give existing mongodb credentials, add them in .env file
```

## For creating dummy users

Script for creating dummy users

```bash
# for loading dummy users into db
$  npx ts-node ./src/scripts/load_initial_users.ts
```

These are the usernames & passwords created using this script.
| username | password |
| :-------: | :----------: |
| vinod | password@123 |
| sai | password@123 |
| sreenivas | password@123 |

## Running the app

```bash
# development with watch
$ npm run start:dev
```

```bash
# development
$ npm run start
```

```http
http://localhost:3000/docs/auth
```

## For Production

Note: Change access token secret and refresh token secret present in config folder. Encrypt config files before pushing to git

```bash
# prod
$ npm run build
$ npm run start:prod
```

---

## APIs

---

## Swagger URL

```http
GET /docs/auth
```

## Authentication

API to create an access token along with a refresh token for each user. Access token validity should be 1 hr and refresh token validity 1 year.

```http
POST /api/auth/login
```

Body

```json
{
  "password": "string",
  "username": "string"
}
```

Response

```json
{
  "access_token": "ACCESS_TOKEN_JWT",
  "access_token_expires_in": "1h",
  "refresh_token": "REFRESH_TOKEN_JWT",
  "refresh_token_expires_in": "1y"
}
```

## Validate Api

API to validate incoming request and check token validity.

```http
GET /api/auth/validate
```

```header
Authorization: Bearer ACCESS_TOKEN
```

Response

```json
{
  "username": "USERNAME",
  "userId": "USER_ID"
}
```

To validate a incoming request, we have to use this decorator for that action.

```js
  @UseGuards(JwtAccessAuthGuard)
```

## Refresh Api

API to refresh the token in case of the access token is expired using refresh token provided with access token creation

```http
POST /api/auth/refresh
```

BODY

```json
{
  "refresh_token": "REFRESH_TOKEN"
}
```

Response

```json
{
  "access_token": "ACCESS_TOKEN_JWT",
  "access_token_expires_in": "1h"
}
```

## Logout Api

API to remove the refresh token from the db. Access token should be removed from the client side.

```http
POST /api/auth/logout
```

BODY

```json
{
  "refresh_token": "REFRESH_TOKEN"
}
```

Response

```json
{
  "message": "success"
}
```

## Expiry

- Access Token Expiry: 1 hour
- Refresh Token Expiry: 1 year
- On Logout, the refresh tokens is deleted from the db. Access token should be removed from the client side.
- Access Tokens are not maintained in db. On Logout if the access tokens also needs to be invalidated then we have to maintain them also in db.

## Mongodb Tables

1. users

   - Columns: `_id`, `username`, `password`, `passwordSalt`, `createdAt`, `updatedAt`

   - indexes: `username`

2. refreshtokens

   - Columns: `_id`, `userId`, `refreshToken`, `createdAt`, `updatedAt`

   - indexes
     - `userId` (userId is used to clear all the sessions of the user)
     - `refreshToken` (used for clearing only the current session)
     - `createdAt` (with 1 year ttl)

Note:

- `passwordSalt` is a random string. Different for each user. Every time password is changes, passwordSalt should be changed

- `password` stored in db is sha256(actualUserPassword + passwordSalt)

TODO: Unit Tests & E2E Tests
