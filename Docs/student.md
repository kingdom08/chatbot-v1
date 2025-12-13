# User API Specification

---

## Login Student

**Description:**
Student login to the system

**Access:**
Student

### Endpoint : `POST /api/auth/student/login`

#### Request Body :

```json
{
  "studentId": "19013001",
  "password": "secret"
}
```

#### Response Body (Success) :

```json
{
  "msg": "success",
  "token": "jwt",
  "role": "Role"
}
```

#### Response Body (Failed) :

```json
{
  "msg": "Invalid username or password"
}
```

## Register Student

**Description:**
Student register to the system

**Access:**
Student

### Endpoint : `POST /api/auth/student/register`

#### Request Body :

```json
{
  "fullName": "John Doe",
  "studentId": "19013005",
  "email": "1234@gmail.com",
  "whatsappNumber": "+62855123443",
  "password": "secret"
}
```

#### Response Body (Success) :

```json
{
  "msg": "User registered succesfully"
}
```

#### Response Body (Failed) :

```json
{
  "msg": "student ID already exists"
}
```

---

## Student Profile

**Description:**
Student Profile

**Access:**
Student

### Endpoint : `GET /api/student/profile`

#### Response Body (Success):

```json
{
  "fullName": "John Doe",
  "studentId": "19013005",
  "email": "1234@gmail.com",
  "whatsappNumber": "+62855123443",
  "password": "secret"
}
```

---

## Student Update Profile

**Description:**
Student Update Profile all the fields are optional, but in request body must have minimal one field to be updated

**Access:**
Student

### Endpoint : `PATCH /api/student/profile`

#### Request Body :

```json
{
  "fullName": "John Doe",
  "studentId": "19013005",
  "email": "1234@gmail.com",
  "whatsappNumber": "+62855123443",
  "password": "secret"
}
```

#### Response Body (Success):

```json
{
  "msg": "Success to update student profile"
}
```

---

## Chat

**Description:**
Student Profile

**Access:**
Student

### Endpoint : `POST /api/student/chat`

#### Request Body :

```json
{
  "message": "Halo?"
}
```

#### Response Body (Success):

```json
{
  "intent": "basic",
  "response": "Hai, saya BIMA pembimbing akademik kamu!"
}
```

#### Response Body (Failed):

```json
{
  "msg": "Failed"
}
```
