# Genshin Wishing Simulator
Genshin Wishing Simulator is an application to let the user to have a similar experience when they are wishing on a genshin banner. This app has : 
* RESTful endpoint for asset's CRUD operation
* JSON formatted response

&nbsp;

## RESTful endpoints
### POST /users/register

> Create new account

_Request Body_
```
{
  "username": "<username to get insert into>",
  "email": "<email to get insert into>",
  "password": "<password to get insert into>"
}
```

_Response (201 - Created)_
```
{
  "id": <given id by system>,
  "username": "<posted username>",
  "email": "<posted email>"
}
```

_Response (400 - Bad Request)_
```
{
  "message": "Username is required"
}
OR
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "Username is already in use"
}
OR
{
  "message": "Email is already in use"
}
OR
{
  "message": "Please enter a valid email address"
}
OR
{
  "message": "Username length must be around 4-16 characters"
}
OR
{
  "message": "Password length must be around 8-32 characters"
}
```

### POST /users/login

> Login and get the access_token

_Request Body_
```
{
  "username": "<username to get insert into>",
  "password": "<password to get insert into>"
}
OR
{
  "email": "<email to get insert into>",
  "password": "<password to get insert into>"
}
```

_Response (200 - OK)_
```
{
  "access_token": "<your access token>"
}
```

_Response (400 - Bad Request)_
```
{
  "message": "Username/Email or Password is required"
}
```

_Response (401 - Unauthorized)_
```
{
  "message": "Username/Email or Password is invalid"
}
```

### GET /gachas/limited/:bannerId

> Start gacha for a limited banner

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Response (200 - OK)_
```
{
  "result": {
    "title": "Purple Star",
    "obtained": "sara",
    "starglitter": 5,
    "type": "character",
    "goldPity": 13,
    "purplePity": 10,
    "guaraCharGold": false,
    "guaraCharPurple": false,
    "goldRate": 600,
    "purpleRate": 5100
  },
  "RNG": 61566
}
```

### Global Error

_Response (401 - Unauthorized)_
```
{
  "message": "Only registered users can access this page"
}
```

_Response (403 - Forbidden)_
```
{
  "message": "You are not authorized"
}
```

_Response (404 - Not Found)_
```
{
  "message": "Data not found"
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```