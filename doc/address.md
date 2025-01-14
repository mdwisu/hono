# address api spec

## create address

Endpoint: POST /api/contacts/{idContact}/addresses

Request header:

- authorization: token

Request Body

```json
{
  "street": "jalan",
  "city": "kota",
  "province": "province",
  "country": "country",
  "postal_code": "12312"
}
```

Response Body

```json
{
  "data": {
    "id": 1,
    "street": "jalan",
    "city": "kota",
    "province": "province",
    "country": "country",
    "postal_code": "12312"
  }
}
```

## get address

Endpoint: GET /api/contacts/{idContact}/addresses/{idAddress}

Request header:

- authorization: token

Response Body

```json
{
  "data": {
    "id": 1,
    "street": "jalan",
    "city": "kota",
    "province": "province",
    "country": "country",
    "postal_code": "12312"
  }
}
```

## Update Address

Endpoint: PUT /api/contacts/{idContact}/addresses/{idAddress}

Request header:

- authorization: token

Request Body

```json
{
  "street": "jalan",
  "city": "kota",
  "province": "province",
  "country": "country",
  "postal_code": "12312"
}
```

Response Body

```json
{
  "data": {
    "id": 1,
    "street": "jalan",
    "city": "kota",
    "province": "province",
    "country": "country",
    "postal_code": "12312"
  }
}
```

## Remove Address

Endpoint: DELETE /api/contacts/{idContact}/addresses/{idAddress}

Request header:

- authorization: token

Response Body

```json
{
  "data": true
}
```

## List Address

Endpoint: GET /api/contacts/{idContact}/addresses

Request header:

- authorization: token

Response Body

```json
{
  "data": [
    {
      "id": 1,
      "street": "jalan",
      "city": "kota",
      "province": "province",
      "country": "country",
      "postal_code": "12312"
    },
    {
      "id": 2,
      "street": "jalan",
      "city": "kota",
      "province": "province",
      "country": "country",
      "postal_code": "12312"
    }
  ]
}
```
