# contact api spec

- [contact api spec](#contact-api-spec)
  - [create contact](#create-contact)
  - [get contact](#get-contact)
  - [update contact](#update-contact)
  - [remove contact](#remove-contact)
  - [search contact](#search-contact)

## create contact

endpoint POST /api/contact

Request Header:

- Authorization : token

Request Body:

```json
{
  "first_name": "Muhammad",
  "last_name": "Dwi Susanto",
  "email": "dwisusanto784@gmail.com",
  "phone": "081218583533"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Dwi Susanto",
    "email": "dwisusanto784@gmail.com",
    "phone": "081218583533"
  }
}
```

## get contact

endpoint GET /api/contact/{idContact}

Request Header:

- Authorization : token

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Dwi Susanto",
    "email": "dwisusanto784@gmail.com",
    "phone": "081218583533"
  }
}
```

## update contact

endpoint PUT /api/contact/{idContact}

Request Header:

- Authorization : token

Request Body:

```json
{
  "first_name": "Muhammad",
  "last_name": "Dwi Susanto",
  "email": "dwisusanto784@gmail.com",
  "phone": "081218583533"
}
```

Response Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Muhammad",
    "last_name": "Dwi Susanto",
    "email": "dwisusanto784@gmail.com",
    "phone": "081218583533"
  }
}
```

## remove contact

endpoint POST /api/contact

Request Header:

- Authorization : token

Response Body:

```json
{
  "data": true
}
```

## search contact

endpoint GET /api/contacts

Request Header:

- Authorization : token

Query Param:

- name : string, search ke first_name atau last_name
- email : string, search ke email
- phone : string, search ke phone
- page : number, default 1
- size : number, default 10

Response Body:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Muhammad",
      "last_name": "Dwi Susanto",
      "email": "dwisusanto784@gmail.com",
      "phone": "081218583533"
    }
    {
      "id": 2,
      "first_name": "Muhammad",
      "last_name": "Dwi Susanto",
      "email": "dwisusanto784@gmail.com",
      "phone": "081218583533"
    }
    "paging": {
      "current_page": 1,
      "total_page": 10,
      "size": 10
    }
  ]
}
```
