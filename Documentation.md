# Genshin Wishing Simulator
Genshin Wishing Simulator is an application to let the user to have a similar experience when they are wishing on a genshin banner.
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
  "emailUsername": "<email or username to get insert into>",
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

_Response (400 - Bad Request)_
```
{
  "message": "You don't have enough currency"
}
```

### GET /gachas/limited/:bannerId/10x

> Start gacha at a limited banner for 10 times

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Response (200 - OK)_
```
{
    "title": [
        "Blue Star",
        "Blue Star",
        ...,
    ],
    "obtained": [
        "skyrider-greatsword",
        "otherworldly-story",
        ...,
    ],
    "starglitter": 6,
    "type": [
        "weapon",
        "weapon",
        ...,
    ],
    "goldPity": [
        35,
        36,
        ...,
    ],
    "purplePity": [
        3,
        4,
        ...,
    ],
    "guaraCharGold": [
        false,
        false,
        ...,
    ],
    "guaraCharPurple": [
        false,
        false,
        ...,
    ],
    "goldRate": [
        600,
        600,
        ...,
    ],
    "purpleRate": [
        5100,
        5100,
        ...,
    ],
    "RNG": [
        48662,
        35501,
        ...,
    ]
}
```

_Response (400 - Bad Request)_
```
{
  "message": "You don't have enough currency"
}
```

### GET /gachas/banners

> Get gacha banners

_Response (200 - OK)_
```
[
    {
        "id": 1,
        "type": "standard",
        "rateUpGold": null,
        "rateUpPurple1": null,
        "rateUpPurple2": null,
        "rateUpPurple3": null,
        "bannerImageUrl": "https://cdn.discordapp.com/attachments/1082293161440841789/1082320231709540403/image.png",
        "createdAt": "2023-03-08T06:07:36.529Z",
        "updatedAt": "2023-03-08T06:07:36.529Z"
    },
    {
        "id": 2,
        "type": "limitedChar",
        "rateUpGold": "venti",
        "rateUpPurple1": "barbara",
        "rateUpPurple2": "fischl",
        "rateUpPurple3": "chongyun",
        "bannerImageUrl": "https://www.gensh.in/fileadmin/Database/Banner_Gacha/2020/2020-07_Ballad_in_Goblets.png",
        "createdAt": "2023-03-08T06:07:36.529Z",
        "updatedAt": "2023-03-08T06:07:36.529Z"
    },
    ...,
]
```

### GET /gachas/banners/:id

> Get gacha banner by ID

_Request Params_
```
{
  "id": "<integer>"
}
```

_Response (200 - OK)_
```
{
    "id": 3,
    "type": "limitedChar",
    "rateUpGold": "klee",
    "rateUpPurple1": "noelle",
    "rateUpPurple2": "xingqiu",
    "rateUpPurple3": "xiangling",
    "bannerImageUrl": "https://www.gensh.in/fileadmin/Database/Banner_Gacha/2020/2020-07_Sparkling_Steps.png",
    "createdAt": "2023-03-08T06:07:36.529Z",
    "updatedAt": "2023-03-08T06:07:36.529Z"
}
```

### GET /gachas/pities

> Get gacha pities of current user

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Response (200 - OK)_
```
{
    "id": 1,
    "charLimitedGoldPity": 44,
    "charLimitedPurplePity": 1,
    "weaponLimitedGoldPity": 0,
    "weaponLimitedPurplePity": 0,
    "standardGoldPity": 0,
    "standardPurplePity": 0,
    "guaranteedGoldCharacter": false,
    "guaranteedPurpleCharacter": true,
    "guaranteedGoldWeapon": false,
    "guaranteedPurpleWeapon": false,
    "fatePoint": 0,
    "UserId": 1,
    "createdAt": "2023-03-08T06:07:36.531Z",
    "updatedAt": "2023-03-09T02:00:24.591Z"
}
```

### GET /inventories

> Get inventory of current user

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Response (200 - OK)_
```
{
    "id": 1,
    "UserId": 1,
    "primogem": 262940,
    "intertwined_fate": 205,
    "acquaint_fate": 200,
    "starglitter": 92,
    "createdAt": "2023-03-08T06:07:36.526Z",
    "updatedAt": "2023-03-09T02:00:24.587Z",
    "Characters": [
        {
            "id": 14,
            "name": "chongyun",
            "InventoryId": 1,
            "constellation": 0,
            "createdAt": "2023-03-09T02:00:24.574Z",
            "updatedAt": "2023-03-09T02:00:24.574Z"
        },
        {
            "id": 13,
            "name": "yanfei",
            "InventoryId": 1,
            "constellation": 0,
            "createdAt": "2023-03-08T10:35:15.567Z",
            "updatedAt": "2023-03-08T10:35:15.567Z"
        },
        ...,
    ],
    "Weapons": [
        {
            "id": 1,
            "name": "redhorn-stonethresher",
            "InventoryId": 1,
            "createdAt": "2023-03-08T06:07:36.528Z",
            "updatedAt": "2023-03-08T06:07:36.528Z"
        },
        {
            "id": 2,
            "name": "dull-blade",
            "InventoryId": 1,
            "createdAt": "2023-03-08T06:07:36.528Z",
            "updatedAt": "2023-03-08T06:07:36.528Z"
        },
        ...,
    ]
}
```

### PUT /inventories/buy

> Purchase fates by current user's primogem (from inventory)

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Request Body_
```
{
  "intertwined_fate": "<intertwined_fate to get insert into>"
}
OR
{
  "acquaint_fate": "<acquaint_fate to get insert into>"
}
```

_Response (200 - OK)_
```
{
    "message": "Purchase success"
}
```

_Response (400 - Bad Request)_
```
{
  "message": "You don't have enough currency"
}
```

### PATCH /inventories/topup

> Increase current's user primogem

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Request Body_
```
{
  "primogem": "<primogem to get insert into>"
}
```

_Response (200 - OK)_
```
{
    "message": "Top Up success"
}
```

### POST /users/midtransToken

> Get a midtrans token / redirect_url

_Request Headers_
```
{
  "access_token": "<your access token>"
}
```

_Request Body_
```
{
  "price": "<price to get insert into>"
}
```

_Response (200 - OK)_
```
{
    "token": "4061e4dc-7bc7-4ddb-aa05-0f595a2d5c44",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v3/redirection/4061e4dc-7bc7-4ddb-aa05-0f595a2d5c44"
}
```

_Response (400 - Bad Request)_
```
{
  "message": "<string>"
}
```

### GET /characters/fiveStars

> Get five star characters

_Response (200 - OK)_
```
[
    {
        "id": 1,
        "name": "albedo",
        "type": "character",
        "limited": true,
        "available": true,
        "imageUrl": "https://muakasan.github.io/genshin-portraits/assets/UI_AvatarIcon_Albedo.png",
        "createdAt": "2023-03-08T06:07:36.575Z",
        "updatedAt": "2023-03-08T06:07:36.575Z"
    },
    {
        "id": 4,
        "name": "arataki-itto",
        "type": "character",
        "limited": true,
        "available": true,
        "imageUrl": "https://muakasan.github.io/genshin-portraits/assets/UI_AvatarIcon_Itto.png",
        "createdAt": "2023-03-08T06:07:36.576Z",
        "updatedAt": "2023-03-08T06:07:36.576Z"
    },
    ...,
]
```

### GET /characters/fourStars

> Get four star characters

_Response (200 - OK)_
```
[
    {
        "id": 1,
        "name": "amber",
        "type": "character",
        "available": true,
        "imageUrl": "https://muakasan.github.io/genshin-portraits/assets/UI_AvatarIcon_Ambor.png",
        "createdAt": "2023-03-08T06:07:36.573Z",
        "updatedAt": "2023-03-08T06:07:36.573Z"
    },
    {
        "id": 2,
        "name": "barbara",
        "type": "character",
        "available": true,
        "imageUrl": "https://muakasan.github.io/genshin-portraits/assets/UI_AvatarIcon_Barbara.png",
        "createdAt": "2023-03-08T06:07:36.573Z",
        "updatedAt": "2023-03-08T06:07:36.573Z"
    },
    ...,
]
```

### Global Error

_Response (401 - Unauthorized)_
```
{
  "message": "Please login first"
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