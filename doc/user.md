# user API spec

## Register user

Endpoint : POST /api/users

Request body :

```json
{
  "username": "dwi",
  "password": "rahasia",
  "name": "Muhammad Dwi Susanto"
}
```

Response body :

```json
{
  "username": "dwi",
  "name": "Muhammad Dwi Susanto"
}
```

Response body (failed):

```json
{
  "errors": "username must not blank"
}
```

## Login User

Endpoint : POST /api/login

Request Body:

```json
{
  "username": "dwi",
  "password": "1234"
}
```

Response Body (success):

```json
{
  "data": {
    "username": "dwi",
    "name": "Muhammad Dwi Susanto",
    "token": "token"
  }
}
```

## Get User

Endpoint : GET /api/users/current

Request Header:

- Authorization : token

Response (success):

```json
{
  "data": {
    "username": "dwi",
    "name": "Muhammad Dwi Susanto"
  }
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header:

- Authorization : token

Request Body :

```json
{
  "name": "update"
}
```

Response (success):

```json
{
  "data": {
    "username": "dwi",
    "name": "Muhammad Dwi Susanto"
  }
}
```

## Logout User

Endpoint : PATCH /api/users/current

Request Header:

- Authorization : token

Response (success):

```json
{
  "data": true
}
```
