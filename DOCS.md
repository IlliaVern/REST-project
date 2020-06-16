<a name="top"></a>

# rest-project v0.0.0

- [Auth](#Auth)
  - [Authenticate](#Authenticate)
- [PasswordReset](#PasswordReset)
  - [Send email](#Send-email)
  - [Submit password](#Submit-password)
  - [Verify token](#Verify-token)
- [Posts](#Posts)
  - [Create posts](#Create-posts)
  - [Delete posts](#Delete-posts)
  - [Retrieve posts](#Retrieve-posts)
  - [Update posts](#Update-posts)
- [User](#User)
  - [Create user](#Create-user)
  - [Delete user](#Delete-user)
  - [Retrieve current user](#Retrieve-current-user)
  - [Retrieve user](#Retrieve-user)
  - [Retrieve user&#39;s posts](#Retrieve-user's-posts)
  - [Retrieve users](#Retrieve-users)
  - [Update password](#Update-password)
  - [Update user](#Update-user)

---

# <a name='Auth'></a> Auth

## <a name='Authenticate'></a> Authenticate

[Back to top](#top)

```
POST /auth
```

### Headers - `Header`

| Name          | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| Authorization | `String` | <p>Basic authorization with email and password.</p> |

### Parameters - `Parameter`

| Name         | Type     | Description                 |
| ------------ | -------- | --------------------------- |
| access_token | `String` | <p>Master access_token.</p> |

### Success response

#### Success response - `Success 201`

| Name  | Type     | Description                                                           |
| ----- | -------- | --------------------------------------------------------------------- |
| token | `String` | <p>User <code>access_token</code> to be passed to other requests.</p> |
| user  | `Object` | <p>Current user's data.</p>                                           |

### Error response

#### Error response - `Error 4xx`

| Name | Type | Description                                       |
| ---- | ---- | ------------------------------------------------- |
| 401  |      | <p>Master access only or invalid credentials.</p> |

# <a name='PasswordReset'></a> PasswordReset

## <a name='Send-email'></a> Send email

[Back to top](#top)

```
POST /password-resets
```

### Parameters - `Parameter`

| Name  | Type     | Description                                               |
| ----- | -------- | --------------------------------------------------------- |
| email | `String` | <p>Email address to receive the password reset token.</p> |
| link  | `String` | <p>Link to redirect user.</p>                             |

### Success response

#### Success response - `Success 202`

| Name | Type | Description      |
| ---- | ---- | ---------------- |
| 202  |      | <p>Accepted.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |

## <a name='Submit-password'></a> Submit password

[Back to top](#top)

```
PUT /password-resets/:token
```

### Parameters - `Parameter`

| Name     | Type     | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| password | `String` | <p>User's new password.</p>_Size range: 6.._<br> |

### Success response

#### Success response - `Success 200`

| Name | Type     | Description         |
| ---- | -------- | ------------------- |
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 404  |          | <p>Token has expired or doesn't exist.</p>         |

## <a name='Verify-token'></a> Verify token

[Back to top](#top)

```
GET /password-resets/:token
```

### Success response

#### Success response - `Success 200`

| Name  | Type     | Description                  |
| ----- | -------- | ---------------------------- |
| token | `String` | <p>Password reset token.</p> |
| user  | `Object` | <p>User's data.</p>          |

### Error response

#### Error response - `Error 4xx`

| Name | Type | Description                                |
| ---- | ---- | ------------------------------------------ |
| 404  |      | <p>Token has expired or doesn't exist.</p> |

# <a name='Posts'></a> Posts

## <a name='Create-posts'></a> Create posts

[Back to top](#top)

```
POST /posts
```

### Parameters - `Parameter`

| Name         | Type     | Description               |
| ------------ | -------- | ------------------------- |
| access_token | `String` | <p>user access token.</p> |
| title        |          | <p>Posts's title.</p>     |

### Success response

#### Success response - `Success 200`

| Name  | Type     | Description          |
| ----- | -------- | -------------------- |
| posts | `Object` | <p>Posts's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 404  |          | <p>Posts not found.</p>                            |
| 401  |          | <p>user access only.</p>                           |

## <a name='Delete-posts'></a> Delete posts

[Back to top](#top)

```
DELETE /posts/:id
```

### Parameters - `Parameter`

| Name         | Type     | Description               |
| ------------ | -------- | ------------------------- |
| access_token | `String` | <p>user access token.</p> |

### Success response

#### Success response - `Success 204`

| Name | Type | Description        |
| ---- | ---- | ------------------ |
| 204  |      | <p>No Content.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type | Description              |
| ---- | ---- | ------------------------ |
| 404  |      | <p>Posts not found.</p>  |
| 401  |      | <p>user access only.</p> |

## <a name='Retrieve-posts'></a> Retrieve posts

[Back to top](#top)

```
GET /posts
```

### Parameters - `Parameter`

| Name   | Type       | Description                                                                                  |
| ------ | ---------- | -------------------------------------------------------------------------------------------- |
| q      | `String`   | **optional** <p>Query to search.</p>                                                         |
| page   | `Number`   | **optional** <p>Page number.</p>_Default value: 1_<br>_Size range: 1..30_<br>                |
| limit  | `Number`   | **optional** <p>Amount of returned items.</p>_Default value: 30_<br>_Size range: 1..100_<br> |
| sort   | `String[]` | **optional** <p>Order of returned items.</p>_Default value: -createdAt_<br>                  |
| fields | `String[]` | **optional** <p>Fields to be returned.</p>                                                   |

### Success response

#### Success response - `Success 200`

| Name  | Type       | Description                   |
| ----- | ---------- | ----------------------------- |
| count | `Number`   | <p>Total amount of posts.</p> |
| rows  | `Object[]` | <p>List of posts.</p>         |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |

## <a name='Update-posts'></a> Update posts

[Back to top](#top)

```
PUT /posts/:id
```

### Parameters - `Parameter`

| Name         | Type     | Description               |
| ------------ | -------- | ------------------------- |
| access_token | `String` | <p>user access token.</p> |
| title        |          | <p>Posts's title.</p>     |

### Success response

#### Success response - `Success 200`

| Name  | Type     | Description          |
| ----- | -------- | -------------------- |
| posts | `Object` | <p>Posts's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 404  |          | <p>Posts not found.</p>                            |
| 401  |          | <p>user access only.</p>                           |

# <a name='User'></a> User

## <a name='Create-user'></a> Create user

[Back to top](#top)

```
POST /users
```

### Parameters - `Parameter`

| Name         | Type     | Description                                                                           |
| ------------ | -------- | ------------------------------------------------------------------------------------- |
| access_token | `String` | <p>Master access_token.</p>                                                           |
| email        | `String` | <p>User's email.</p>                                                                  |
| password     | `String` | <p>User's password.</p>_Size range: 6.._<br>                                          |
| name         | `String` | **optional** <p>User's name.</p>                                                      |
| picture      | `String` | **optional** <p>User's picture.</p>                                                   |
| role         | `String` | **optional** <p>User's role.</p>_Default value: user_<br>_Allowed values: user,admin_ |

### Success response

#### Success response - `Sucess 201`

| Name | Type     | Description         |
| ---- | -------- | ------------------- |
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401  |          | <p>Master access only.</p>                         |
| 409  |          | <p>Email already registered.</p>                   |

## <a name='Delete-user'></a> Delete user

[Back to top](#top)

```
DELETE /users/:id
```

### Parameters - `Parameter`

| Name         | Type     | Description               |
| ------------ | -------- | ------------------------- |
| access_token | `String` | <p>User access_token.</p> |

### Success response

#### Success response - `Success 204`

| Name | Type | Description        |
| ---- | ---- | ------------------ |
| 204  |      | <p>No Content.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type | Description               |
| ---- | ---- | ------------------------- |
| 401  |      | <p>Admin access only.</p> |
| 404  |      | <p>User not found.</p>    |

## <a name='Retrieve-current-user'></a> Retrieve current user

[Back to top](#top)

```
GET /users/me
```

### Parameters - `Parameter`

| Name         | Type     | Description               |
| ------------ | -------- | ------------------------- |
| access_token | `String` | <p>User access_token.</p> |

### Success response

#### Success response - `Success 200`

| Name | Type     | Description         |
| ---- | -------- | ------------------- |
| user | `Object` | <p>User's data.</p> |

## <a name='Retrieve-user'></a> Retrieve user

[Back to top](#top)

```
GET /users/:id
```

### Success response

#### Success response - `Success 200`

| Name | Type     | Description         |
| ---- | -------- | ------------------- |
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| 404  |      | <p>User not found.</p> |

## <a name='Retrieve-user&#39;s-posts'></a> Retrieve user&#39;s posts

[Back to top](#top)

```
GET /users/:id/posts
```

### Success response

#### Success response - `Success 200`

| Name | Type     | Description        |
| ---- | -------- | ------------------ |
| user | `Object` | <p>posts data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type | Description                    |
| ---- | ---- | ------------------------------ |
| 404  |      | <p>User's posts not found.</p> |

## <a name='Retrieve-users'></a> Retrieve users

[Back to top](#top)

```
GET /users
```

### Parameters - `Parameter`

| Name         | Type       | Description                                                                                  |
| ------------ | ---------- | -------------------------------------------------------------------------------------------- |
| access_token | `String`   | <p>User access_token.</p>                                                                    |
| q            | `String`   | **optional** <p>Query to search.</p>                                                         |
| page         | `Number`   | **optional** <p>Page number.</p>_Default value: 1_<br>_Size range: 1..30_<br>                |
| limit        | `Number`   | **optional** <p>Amount of returned items.</p>_Default value: 30_<br>_Size range: 1..100_<br> |
| sort         | `String[]` | **optional** <p>Order of returned items.</p>_Default value: -createdAt_<br>                  |
| fields       | `String[]` | **optional** <p>Fields to be returned.</p>                                                   |

### Success response

#### Success response - `Success 200`

| Name  | Type       | Description           |
| ----- | ---------- | --------------------- |
| users | `Object[]` | <p>List of users.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401  |          | <p>Admin access only.</p>                          |

## <a name='Update-password'></a> Update password

[Back to top](#top)

```
PUT /users/:id/password
```

### Headers - `Header`

| Name          | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| Authorization | `String` | <p>Basic authorization with email and password.</p> |

### Parameters - `Parameter`

| Name     | Type     | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| password | `String` | <p>User's new password.</p>_Size range: 6.._<br> |

### Success response

#### Success response - `Success 201`

| Name | Type     | Description         |
| ---- | -------- | ------------------- |
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401  |          | <p>Current user access only.</p>                   |
| 404  |          | <p>User not found.</p>                             |

## <a name='Update-user'></a> Update user

[Back to top](#top)

```
PUT /users/:id
```

### Parameters - `Parameter`

| Name         | Type     | Description                         |
| ------------ | -------- | ----------------------------------- |
| access_token | `String` | <p>User access_token.</p>           |
| name         | `String` | **optional** <p>User's name.</p>    |
| picture      | `String` | **optional** <p>User's picture.</p> |

### Success response

#### Success response - `Success 200`

| Name | Type     | Description         |
| ---- | -------- | ------------------- |
| user | `Object` | <p>User's data.</p> |

### Error response

#### Error response - `Error 4xx`

| Name | Type     | Description                                        |
| ---- | -------- | -------------------------------------------------- |
| 400  | `Object` | <p>Some parameters may contain invalid values.</p> |
| 401  |          | <p>Current user or admin access only.</p>          |
| 404  |          | <p>User not found.</p>                             |
