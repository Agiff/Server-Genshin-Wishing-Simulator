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
  "email": "<posted email>",
  "password": <posted hashed password>,
  "createdAt": "2023-02-14T17:28:46.674Z",
  "updatedAt": "2023-02-14T17:28:46.674Z"
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
  "message": "username must be unique"
}
OR
{
  "message": "email must be unique"
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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc2ODI1NjA2fQ.YePkiNMmiLn6gJnCpNtquB7SbB3g9NpEsziIZIvU3Go"
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

### Global Error

_Response (401 - Unauthorized)_
```
{
  "message": "You're not allowed to access this page"
}
```
_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```